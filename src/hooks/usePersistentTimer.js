import { useState, useEffect, useRef } from 'react';

const usePersistentTimer = (storageKey = 'persistent-timer-start') => {
  const [startTime, setStartTime] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? parseInt(saved, 10) : Date.now();
  });

  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const updateTimer = () => setSeconds(Math.floor((Date.now() - startTime) / 1000));
    updateTimer();
    intervalRef.current = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalRef.current);
  }, [startTime]);

  useEffect(() => {
    localStorage.setItem(storageKey, startTime.toString());
  }, [startTime, storageKey]);

  const reset = () => {
    const now = Date.now();
    setStartTime(now);
    setSeconds(0);
  };

  return { seconds, reset };
};

export default usePersistentTimer;