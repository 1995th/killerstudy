import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Timer, Play, Pause, Award } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { logStudySession } from '@/lib/analytics';
import { toast } from 'sonner';

interface StudyTrackerProps {
  onStreakUpdate: (streak: number) => void;
}

export function StudyTracker({ onStreakUpdate }: StudyTrackerProps) {
  const { user } = useAuth();
  const { 
    isStudying, 
    timeStudied, 
    lastLoggedTime,
    setIsStudying, 
    setTimeStudied,
    setLastLoggedTime 
  } = useStore();
  const [dailyGoal] = useState(7200); // 2 hours in seconds
  const [achievements, setAchievements] = useState<string[]>([]);

  useEffect(() => {
    let interval: number;
    if (isStudying) {
      interval = window.setInterval(() => {
        setTimeStudied(timeStudied + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStudying, timeStudied, setTimeStudied]);

  useEffect(() => {
    const shouldLog = timeStudied - lastLoggedTime >= 300;
    
    if (shouldLog && isStudying && user) {
      const duration = timeStudied - lastLoggedTime;
      logStudySession(user.id, duration)
        .then(() => {
          setLastLoggedTime(timeStudied);
        })
        .catch(() => {
          toast.error('Failed to log study session');
        });
    }
  }, [timeStudied, lastLoggedTime, isStudying, user, setLastLoggedTime]);

  useEffect(() => {
    // Check for achievements
    if (timeStudied >= 3600 && !achievements.includes('First Hour')) {
      setAchievements((prev) => [...prev, 'First Hour']);
    }
    if (timeStudied >= dailyGoal && !achievements.includes('Daily Goal')) {
      setAchievements((prev) => [...prev, 'Daily Goal']);
      onStreakUpdate((prev) => prev + 1);
    }
  }, [timeStudied, achievements, dailyGoal, onStreakUpdate]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStopStudying = async () => {
    if (user && timeStudied > lastLoggedTime) {
      try {
        await logStudySession(user.id, timeStudied - lastLoggedTime);
        setLastLoggedTime(timeStudied);
      } catch (error) {
        toast.error('Failed to log final study session');
      }
    }
    setIsStudying(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Study Session</h2>
        <Timer className="h-6 w-6" />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xl font-medium">{formatTime(timeStudied)}</span>
          <Button
            onClick={() => isStudying ? handleStopStudying() : setIsStudying(true)}
            variant={isStudying ? 'destructive' : 'default'}
          >
            {isStudying ? (
              <><Pause className="mr-2 h-4 w-4" /> Pause</>
            ) : (
              <><Play className="mr-2 h-4 w-4" /> Start</>
            )}
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Daily Progress</span>
            <span>{Math.round((timeStudied / dailyGoal) * 100)}%</span>
          </div>
          <Progress value={(timeStudied / dailyGoal) * 100} />
        </div>
      </div>

      {achievements.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Achievements</h3>
          <div className="grid grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement} className="p-4 flex items-center space-x-2">
                <Award className="h-5 w-5 text-yellow-500" />
                <span>{achievement}</span>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}