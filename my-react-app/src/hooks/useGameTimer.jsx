// hooks/useGameTimer.js
import { useEffect, useRef, useState } from 'react';

export default function useGameTimer(duration, onTimeUp) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const timerRef = useRef(null);

  const start = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const reset = () => {
    clearInterval(timerRef.current);
    setTimeLeft(duration);
  };

  return [timeLeft, reset, start];
}
