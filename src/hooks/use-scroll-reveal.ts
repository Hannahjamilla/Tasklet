import { useEffect, useState, useRef, type RefObject } from 'react';

/**
 * Hook to detect when an element enters the viewport
 * @returns [ref, is_visible]
 */
export const useScrollReveal = (threshold = 0.1): [RefObject<HTMLDivElement | null>, boolean] => {
  const [is_visible, set_is_visible] = useState(false);
  const element_ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          set_is_visible(true);
          // Once it's visible, we can stop observing if we only want one-time reveal
          if (element_ref.current) observer.unobserve(element_ref.current);
        }
      },
      { threshold }
    );

    if (element_ref.current) {
      observer.observe(element_ref.current);
    }

    return () => {
      if (element_ref.current) observer.unobserve(element_ref.current);
    };
  }, [threshold]);

  return [element_ref, is_visible];
};
