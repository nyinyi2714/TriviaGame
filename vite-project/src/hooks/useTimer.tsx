import { useState } from 'react';

function useTimer() {
  const [timeLeft, setTimeLeft] = useState(0);
  let timerRef: NodeJS.Timeout | undefined;

  const timer = (sec: number): Promise<void> => {
    return new Promise((resolve) => {
      // decrease the timeLeft by 1 every sec
      timerRef = setInterval(() => {
        // Time is up
        if (timeLeft - 1 <= 0) {
          clearInterval(timerRef);
          resolve();
        }
        setTimeLeft((prev) => prev - 1);
      }, sec * 1000);
    });
  };

  const cancelTimer = () => {
    clearInterval(timerRef);
  };

  return {
    timer,
    cancelTimer,
  };
}

export default useTimer;
