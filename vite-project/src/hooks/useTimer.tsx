import { useState, useEffect, useRef } from 'react'

function useTimer() {
  const [timeLeft, setTimeLeft] = useState(1)
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const startTimer = (sec: number): void => {
    // Clear any existing interval
    cancelTimer()

    // Set the initial timeLeft
    setTimeLeft(sec)

    // Start the countdown
    timerRef.current = setInterval(() => {
      // Update timeLeft every second
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
  }

  const cancelTimer = () => {
    // Clear the interval using the mutable timerRef
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = undefined
    }
  }

  useEffect(() => {
    // Cleanup function to clear the interval when component unmounts
    return () => {
      cancelTimer()
    }
  }, [])

  return {
    startTimer,
    cancelTimer,
    timeLeft,
  }
}

export default useTimer
