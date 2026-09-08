import { useEffect, useRef, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      el.classList.add("visible");
      return;
    }

    // Safety fallback: ensure elements become visible even if IntersectionObserver fails in iframes
    const safetyTimer = setTimeout(() => {
      if (el && !el.classList.contains("visible")) {
        el.classList.add("visible");
      }
    }, delay * 1000 + 300);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => {
              entry.target.classList.add("visible");
            }, delay * 1000);
          } else {
            entry.target.classList.add("visible");
          }
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.02,
        rootMargin: "50px 0px 50px 0px",
      }
    );

    observer.observe(el);

    return () => {
      clearTimeout(safetyTimer);
      observer.disconnect();
    };
  }, [delay]);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
