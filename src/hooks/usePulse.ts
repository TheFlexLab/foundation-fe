import { useState, useEffect } from 'react';

type UsePulseReturn = [boolean, () => void];

const usePulse = (duration: number = 5000): UsePulseReturn => {
  const [isPulse, setIsPulse] = useState<boolean>(false);

  useEffect(() => {
    if (isPulse) {
      const timer = setTimeout(() => {
        setIsPulse(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isPulse, duration]);

  const triggerPulse = () => setIsPulse(true);

  return [isPulse, triggerPulse];
};

export default usePulse;
