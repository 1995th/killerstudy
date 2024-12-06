import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StudyTimer } from './StudyTimer';
import { Target, Check, Clock, History } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { fetchGoals, createGoal, completeGoal } from '@/lib/goals';
import { toast } from 'sonner';

interface Goal {
  id: string;
  content: string;
  completed: boolean;
  createdAt: Date;
}

interface StudySessionProps {
  onStreakUpdate: (streak: number) => void;
}

export function StudySession({ onStreakUpdate }: StudySessionProps) {
  const { user } = useAuth();
  const [newGoal, setNewGoal] = useState('');
  const [currentGoals, setCurrentGoals] = useState<Goal[]>([]);
  const [previousGoals, setPreviousGoals] = useState<Goal[]>([]);
  const [showPrevious, setShowPrevious] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchGoals(user.id)
        .then(goals => {
          const now = new Date();
          const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          
          setCurrentGoals(goals.filter(goal => 
            new Date(goal.createdAt) > dayAgo && !goal.completed
          ));
          
          setPreviousGoals(goals.filter(goal => 
            new Date(goal.createdAt) <= dayAgo || goal.completed
          ));
        })
        .catch(() => toast.error('Failed to load goals'))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newGoal.trim()) return;

    try {
      const goal = await createGoal(user.id, newGoal);
      setCurrentGoals(prev => [goal, ...prev]);
      setNewGoal('');
      toast.success('Goal added');
    } catch (error) {
      toast.error('Failed to add goal');
    }
  };

  const handleCompleteGoal = async (goalId: string) => {
    if (!user) return;

    try {
      await completeGoal(user.id, goalId);
      const completedGoal = currentGoals.find(g => g.id === goalId);
      if (completedGoal) {
        setCurrentGoals(prev => prev.filter(g => g.id !== goalId));
        setPreviousGoals(prev => [{...completedGoal, completed: true}, ...prev]);
      }
      toast.success('Goal completed');
    } catch (error) {
      toast.error('Failed to complete goal');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <StudyTimer onStreakUpdate={onStreakUpdate} />

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Session Goals</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPrevious(!showPrevious)}
          >
            <History className="h-4 w-4 mr-2" />
            {showPrevious ? 'Hide Previous' : 'Show Previous'}
          </Button>
        </div>

        <form onSubmit={handleAddGoal} className="mb-6">
          <div className="flex space-x-2">
            <Input
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Add a goal for this study session..."
              className="flex-1"
            />
            <Button type="submit">Add Goal</Button>
          </div>
        </form>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Current Goals
            </h3>
            {currentGoals.length === 0 ? (
              <p className="text-sm text-muted-foreground">No current goals. Add one above!</p>
            ) : (
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {currentGoals.map((goal) => (
                    <Card key={goal.id} className="p-3 flex items-center justify-between">
                      <span>{goal.content}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCompleteGoal(goal.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {showPrevious && previousGoals.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Previous Goals
              </h3>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {previousGoals.map((goal) => (
                    <Card key={goal.id} className="p-3 flex items-center justify-between">
                      <span className="text-muted-foreground">{goal.content}</span>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(goal.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}