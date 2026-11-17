import { useEffect, useRef } from "react";

interface CustomCursorProps {
  disabled?: boolean;
}

export default function CustomCursor({ disabled = false }: CustomCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) return;

    const path = typeof window !== "undefined" ? window.location.pathname.toLowerCase() : "";
    if (path.startsWith("/privacy") || path.startsWith("/terms")) return;

    if (
      typeof window === "undefined" ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.innerWidth <= 768
    ) {
      return;
    }

    const cursor = cursorRef.current;
    if (!cursor) return;

    let frame = 0;
    let targetX = -100;
    let targetY = -100;
    let visible = false;

    const render = () => {
      cursor.style.transform = `translate3d(${targetX}px,${targetY}px,0)`;
      frame = 0;
    };

    const move = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) {
        visible = true;
        cursor.style.opacity = "1";
      }
      if (!frame) {
        frame = requestAnimationFrame(render);
      }
    };

    const handleLeave = () => {
      visible = false;
      cursor.style.opacity = "0";
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", handleLeave, { passive: true });

    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", handleLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [disabled]);

  if (disabled) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="fixed top-0 left-0 w-2.5 h-2.5 -ml-1.25 -mt-1.25 rounded-full bg-[#C7E34A] border border-[#20231D] pointer-events-none z-[9999] opacity-0 transition-opacity duration-150 hidden md:block"
      style={{ willChange: "transform" }}
    />
  );
}
