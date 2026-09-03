import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on desktop devices with fine pointer
    if (
      typeof window === "undefined" ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.innerWidth <= 768
    ) {
      return;
    }

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let frame = 0;
    let isVisible = false;

    const render = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;

      cursor.style.transform = `translate3d(${targetX}px,${targetY}px,0)`;
      ring.style.transform = `translate3d(${currentX}px,${currentY}px,0)`;

      frame = 0;

      if (
        Math.abs(targetX - currentX) > 0.1 ||
        Math.abs(targetY - currentY) > 0.1
      ) {
        frame = requestAnimationFrame(render);
      }
    };

    const move = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;

      if (!isVisible) {
        isVisible = true;
        cursor.style.opacity = "1";
        ring.style.opacity = "1";
        currentX = targetX;
        currentY = targetY;
      }

      if (!frame) {
        frame = requestAnimationFrame(render);
      }
    };

    const handlePointerLeave = () => {
      isVisible = false;
      cursor.style.opacity = "0";
      ring.style.opacity = "0";
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
      if (frame) {
        cancelAnimationFrame(frame);
      }
    };
  }, []);

  return (
    <div className="pointer-events-none hidden md:block">
      {/* Precision inner center dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 bg-cyan-400 rounded-full pointer-events-none z-[99999] opacity-0 transition-opacity duration-200"
        style={{ willChange: "transform" }}
      />
      {/* Fluid spring tracking ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 border border-purple-400/50 bg-purple-500/10 rounded-full pointer-events-none z-[99998] opacity-0 transition-opacity duration-200"
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
