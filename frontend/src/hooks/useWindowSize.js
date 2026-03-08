import { useState, useEffect } from 'react';

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export const useIsMobile = (breakpoint = 768) => {
  const { width } = useWindowSize();
  return width <= breakpoint;
};

export const useIsTablet = () => {
  const { width } = useWindowSize();
  return width > 768 && width <= 1024;
};

export default useWindowSize;
