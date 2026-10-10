import { useCallback, useEffect, useRef, useState } from 'react';

// Chronomètre en secondes, démarré au montage. stop() fige le compteur.
const useElapsedTimer = () => {
  const [startTime] = useState(Date.now);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return stop;
  }, [startTime, stop]);

  return { elapsed, stop };
};

export default useElapsedTimer;
