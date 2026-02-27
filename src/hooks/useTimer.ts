import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerOptions {
  initialTime: number;
  onTick?: (secondsLeft: number) => void;
  onComplete?: () => void;
  autoStart?: boolean;
}

interface UseTimerReturn {
  secondsLeft: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  restart: () => void;
}

export function useTimer({
  initialTime,
  onTick,
  onComplete,
  autoStart = false,
}: UseTimerOptions): UseTimerReturn {
  const [secondsLeft, setSecondsLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onTickRef = useRef(onTick);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onTickRef.current = onTick;
    onCompleteRef.current = onComplete;
  }, [onTick, onComplete]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (!isRunning && secondsLeft > 0) {
      setIsRunning(true);
    }
  }, [isRunning, secondsLeft]);

  const pause = useCallback(() => {
    setIsRunning(false);
    clearTimer();
  }, [clearTimer]);

  const reset = useCallback(() => {
    setIsRunning(false);
    clearTimer();
    setSecondsLeft(initialTime);
  }, [initialTime, clearTimer]);

  const restart = useCallback(() => {
    clearTimer();
    setSecondsLeft(initialTime);
    setIsRunning(true);
  }, [initialTime, clearTimer]);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          const newValue = prev - 1;
          if (onTickRef.current) {
            onTickRef.current(newValue);
          }
          return newValue;
        });
      }, 1000);
    }

    return clearTimer;
  }, [isRunning, clearTimer]);

  useEffect(() => {
    if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      clearTimer();
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    }
  }, [secondsLeft, isRunning, clearTimer]);

  useEffect(() => {
    setSecondsLeft(initialTime);
  }, [initialTime]);

  return {
    secondsLeft,
    isRunning,
    start,
    pause,
    reset,
    restart,
  };
}
