import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, Square, RotateCcw } from "lucide-react";
import {
  formatDuration,
  formatDurationWithMs,
  generateSessionId,
} from "@/lib/time-utils";
import { saveSession, getActiveSession, type WorkSession } from "@/lib/storage";

interface TimerProps {
  onSessionUpdate: () => void;
}

export function Timer({ onSessionUpdate }: TimerProps) {
  const [currentSession, setCurrentSession] = useState<WorkSession | null>(
    null,
  );
  const [elapsedTime, setElapsedTime] = useState(0);
  const [milliseconds, setMilliseconds] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const msIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Check for existing active session on mount
    const activeSession = getActiveSession();
    if (activeSession) {
      setCurrentSession(activeSession);
      const now = Date.now();
      const elapsed = Math.floor(
        (now - activeSession.startTime.getTime()) / 1000,
      );
      setElapsedTime(elapsed);
    }
  }, []);

  useEffect(() => {
    if (currentSession?.isActive) {
      // Milliseconds interval (every 10ms for smooth display)
      msIntervalRef.current = window.setInterval(() => {
        setMilliseconds((prev) => (prev + 10) % 1000);
      }, 10);

      // Seconds interval
      intervalRef.current = window.setInterval(() => {
        setElapsedTime((prev) => {
          const newTime = prev + 1;
          // Auto-save every 10 seconds
          if (newTime % 10 === 0 && currentSession) {
            const updatedSession = {
              ...currentSession,
              duration: newTime,
            };
            saveSession(updatedSession);
          }
          return newTime;
        });
        setMilliseconds(0); // Reset milliseconds at each second
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (msIntervalRef.current) {
        clearInterval(msIntervalRef.current);
        msIntervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (msIntervalRef.current) {
        clearInterval(msIntervalRef.current);
      }
    };
  }, [currentSession?.isActive]);

  const startTimer = () => {
    const newSession: WorkSession = {
      id: generateSessionId(),
      startTime: new Date(),
      endTime: null,
      duration: 0,
      isActive: true,
    };

    setCurrentSession(newSession);
    setElapsedTime(0);
    setMilliseconds(0);
    saveSession(newSession);
    onSessionUpdate();
  };

  const pauseTimer = () => {
    if (!currentSession) return;

    const updatedSession = {
      ...currentSession,
      isActive: false,
      duration: elapsedTime,
    };

    setCurrentSession(updatedSession);
    saveSession(updatedSession);
    onSessionUpdate();
  };

  const resumeTimer = () => {
    if (!currentSession) return;

    const updatedSession = {
      ...currentSession,
      isActive: true,
    };

    setCurrentSession(updatedSession);
    saveSession(updatedSession);
    onSessionUpdate();
  };

  const stopTimer = () => {
    if (!currentSession) return;

    const finalSession = {
      ...currentSession,
      endTime: new Date(),
      duration: elapsedTime,
      isActive: false,
    };

    saveSession(finalSession);
    setCurrentSession(null);
    setElapsedTime(0);
    setMilliseconds(0);
    onSessionUpdate();
  };

  const resetTimer = () => {
    if (currentSession) {
      stopTimer();
    } else {
      setElapsedTime(0);
      setMilliseconds(0);
    }
  };

  const isActive = currentSession?.isActive || false;
  const isPaused = currentSession && !currentSession.isActive;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-8 text-center">
        <div className="mb-8">
          <div className="text-6xl font-mono font-bold text-primary mb-2">
            {isActive
              ? formatDurationWithMs(elapsedTime, milliseconds)
              : formatDuration(elapsedTime)}
          </div>
          <div className="text-muted-foreground text-sm">
            {isActive && "Timer running..."}
            {isPaused && "Timer paused"}
            {!currentSession && "Ready to start"}
          </div>
        </div>

        <div className="flex justify-center gap-3">
          {!currentSession ? (
            <Button onClick={startTimer} size="lg" className="gap-2">
              <Play className="w-4 h-4" />
              Start
            </Button>
          ) : (
            <>
              {isActive ? (
                <Button
                  onClick={pauseTimer}
                  variant="secondary"
                  size="lg"
                  className="gap-2"
                >
                  <Pause className="w-4 h-4" />
                  Pause
                </Button>
              ) : (
                <Button onClick={resumeTimer} size="lg" className="gap-2">
                  <Play className="w-4 h-4" />
                  Resume
                </Button>
              )}

              <Button
                onClick={stopTimer}
                variant="destructive"
                size="lg"
                className="gap-2"
              >
                <Square className="w-4 h-4" />
                Stop
              </Button>
            </>
          )}

          <Button
            onClick={resetTimer}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
