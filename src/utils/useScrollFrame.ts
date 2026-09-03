import { useEffect } from "react";

export function useScrollFrame(callback: (scrollY: number) => void) {
  useEffect(() => {
    let frame = 0;
    let latestScrollY = window.scrollY;

    const handleScroll = () => {
      latestScrollY = window.scrollY;

      if (frame) return;

      frame = requestAnimationFrame(() => {
        callback(latestScrollY);
        frame = 0;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (frame) {
        cancelAnimationFrame(frame);
      }
    };
  }, [callback]);
}
