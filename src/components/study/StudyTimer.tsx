import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';
import { useStudyStore } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { updateStreak } from '@/lib/streaks';
import { toast } from 'sonner';

interface StudyTimerProps {
  onStreakUpdate: (streak: number) => void;
}

export function StudyTimer({ onStreakUpdate }: StudyTimerProps) {
  const { user } = useAuth();
  const { 
    isStudying, 
    startTime, 
    totalTime, 
    userId,
    setUserId,
    loadTotalTime,
    startStudySession, 
    stopStudySession,
    resetTimer
  } = useStudyStore();
  const [currentTime, setCurrentTime] = useState(totalTime);

  useEffect(() => {
    if (user && user.id !== userId) {
      setUserId(user.id);
      loadTotalTime(user.id);
    }
  }, [user, userId, setUserId, loadTotalTime]);

  useEffect(() => {
    let interval: number;

    if (isStudying && startTime) {
      interval = window.setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        setCurrentTime(totalTime + elapsedSeconds);
      }, 1000);
    } else {
      setCurrentTime(totalTime);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isStudying, startTime, totalTime]);

  const handleStartStop = async () => {
    if (!user) return;

    try {
      if (isStudying) {
        await stopStudySession();
        const newStreak = await updateStreak(user.id);
        onStreakUpdate(newStreak);
      } else {
        startStudySession();
      }
    } catch (error) {
      toast.error('Failed to update study session');
    }
  };

  const handleReset = () => {
    if (isStudying) {
      toast.error('Stop the timer before resetting');
      return;
    }
    resetTimer();
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Timer className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Study Timer</h2>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleReset}
          disabled={isStudying}
          title={isStudying ? 'Stop timer before resetting' : 'Reset timer'}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center">
          <span className="text-4xl font-bold font-mono">
            {formatTime(currentTime)}
          </span>
        </div>

        <Progress value={(currentTime % 3600) / 36} />

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleStartStop}
            variant={isStudying ? 'destructive' : 'default'}
          >
            {isStudying ? (
              <><Pause className="mr-2 h-5 w-5" /> Pause Session</>
            ) : (
              <><Play className="mr-2 h-5 w-5" /> Start Session</>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}