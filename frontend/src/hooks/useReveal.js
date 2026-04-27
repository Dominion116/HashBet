import { useEffect, useRef } from "react";

export function useReveal() {
  const ref = useRef();

  useEffect(() => {
    // Check if IntersectionObserver is supported
    if (!window.IntersectionObserver) {
      // Fallback for older browsers - just add visible class immediately
      if (ref.current) {
        ref.current.classList.add("visible");
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return ref;
}