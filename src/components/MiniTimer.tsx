import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { useStudyStore } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

export function MiniTimer() {
  const { user } = useAuth();
  const { 
    isStudying, 
    startTime, 
    totalTime, 
    userId,
    setUserId,
    loadTotalTime,
    startStudySession, 
    stopStudySession
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
      } else {
        startStudySession();
      }
    } catch (error) {
      toast.error('Failed to update study session');
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 border-t border-white/10">
      <div className="flex items-center justify-between">
        <span className="font-medium">{formatTime(currentTime)}</span>
        <Button
          variant={isStudying ? 'destructive' : 'default'}
          size="sm"
          onClick={handleStartStop}
        >
          {isStudying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}