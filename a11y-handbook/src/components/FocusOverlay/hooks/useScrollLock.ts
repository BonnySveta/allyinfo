import { useEffect, useRef } from 'react';

export function useScrollLock(isActive: boolean) {
  const lastScrollPosition = useRef(0);

  useEffect(() => {
    if (isActive) {
      lastScrollPosition.current = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.width = '100%';
    } else {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, lastScrollPosition.current);
    }
  }, [isActive]);
} 