import { useEffect, useState } from 'react';

export const useViewportTooSmall = (minWidth = 1280): boolean => {
  const [tooSmall, setTooSmall] = useState(
    typeof window !== 'undefined' ? window.innerWidth < minWidth : false,
  );

  useEffect(() => {
    const handler = () => setTooSmall(window.innerWidth < minWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [minWidth]);

  return tooSmall;
};
