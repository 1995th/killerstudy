import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';

export function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [sessionLength, setSessionLength] = useState(25);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: number;
    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsBreak((prev) => !prev);
      setTimeLeft(isBreak ? sessionLength * 60 : 5 * 60);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak, sessionLength]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(sessionLength * 60);
    setIsBreak(false);
  };

  const progress = (timeLeft / (sessionLength * 60)) * 100;

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Pomodoro Timer</h3>
        <Timer className="h-5 w-5" />
      </div>

      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {isBreak ? 'Break Time' : 'Focus Time'}
          </p>
          <p className="text-4xl font-bold">{formatTime(timeLeft)}</p>
        </div>

        <Progress value={progress} />

        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button variant="outline" size="icon" onClick={reset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <p className="text-sm">Session Length: {sessionLength} minutes</p>
          <Slider
            value={[sessionLength]}
            onValueChange={(value) => {
              setSessionLength(value[0]);
              if (!isRunning) setTimeLeft(value[0] * 60);
            }}
            min={5}
            max={60}
            step={5}
          />
        </div>
      </div>
    </Card>
  );
}