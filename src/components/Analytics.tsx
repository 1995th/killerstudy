import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StudyProgressChart } from '@/components/charts/StudyProgressChart';
import {
  Brain,
  Clock,
  BookOpen,
  Award,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { fetchStudyStats } from '@/lib/analytics';
import { toast } from 'sonner';

export function Analytics() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTimeStudied: 0,
    flashcardsReviewed: 0,
    notesCreated: 0,
    currentStreak: 0,
    weeklyStudyHours: Array(7).fill(0),
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStudyStats(user.id)
        .then(setStats)
        .catch(() => toast.error('Failed to load study stats'))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  const chartData = stats.weeklyStudyHours.map((hours, index) => ({
    day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
      (new Date().getDay() + 7 - index) % 7
    ],
    hours,
  })).reverse();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <TrendingUp className="h-6 w-6" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Study Time
            </p>
            <p className="text-2xl font-bold">{formatTime(stats.totalTimeStudied)}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Flashcards Reviewed
            </p>
            <p className="text-2xl font-bold">{stats.flashcardsReviewed}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-primary/10">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Notes Created
            </p>
            <p className="text-2xl font-bold">{stats.notesCreated}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Award className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Current Streak
            </p>
            <p className="text-2xl font-bold">{stats.currentStreak} days</p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Weekly Study Progress</h3>
          <Calendar className="h-5 w-5 text-muted-foreground" />
        </div>
        <StudyProgressChart data={chartData} />
      </Card>
    </div>
  );
}