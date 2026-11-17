import { useEffect, useRef } from "react";
import { useMotionSettings } from "../../motion/MotionProvider";

interface PointerTrailCanvasProps {
  disabled?: boolean;
}

interface TrailNode {
  x: number;
  y: number;
  life: number;
}

/**
 * Restrained desktop-only pointer trail overlay.
 * Renders brief fading coordinate segments that sleep completely when idle,
 * and disables automatically on touch devices, low-tier hardware, reduced-motion,
 * legal routes, or form input fields.
 */
export default function PointerTrailCanvas({ disabled = false }: PointerTrailCanvasProps) {
  const { reducedMotion, capability, isFinePointer } = useMotionSettings();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const shouldRun =
    !disabled &&
    isFinePointer &&
    capability !== "low" &&
    !reducedMotion;

  useEffect(() => {
    if (!shouldRun || typeof window === "undefined") return;
    if (window.innerWidth <= 900) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const nodes: TrailNode[] = [];
    let rafId = 0;
    let isRunning = false;
    let isPausedOverInput = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = nodes.length - 1; i >= 0; i--) {
        nodes[i].life -= 0.055;
        if (nodes[i].life <= 0) {
          nodes.splice(i, 1);
        }
      }

      if (nodes.length > 1) {
        for (let i = 1; i < nodes.length; i++) {
          const prev = nodes[i - 1];
          const curr = nodes[i];
          const alpha = Math.max(0, Math.min(0.24, curr.life * 0.24));

          ctx.strokeStyle = `rgba(199, 227, 74, ${alpha.toFixed(3)})`;
          ctx.lineWidth = 1.25;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(curr.x, curr.y);
          ctx.stroke();
        }
      }

      if (nodes.length > 0) {
        rafId = requestAnimationFrame(draw);
      } else {
        isRunning = false;
        rafId = 0;
      }
    };

    const startLoop = () => {
      if (!isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(draw);
      }
    };

    const handleMove = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        isPausedOverInput = true;
        return;
      }
      isPausedOverInput = false;

      const last = nodes[nodes.length - 1];
      if (last) {
        const dx = event.clientX - last.x;
        const dy = event.clientY - last.y;
        if (dx * dx + dy * dy < 16) return;
      }

      nodes.push({ x: event.clientX, y: event.clientY, life: 1 });
      if (nodes.length > 14) {
        nodes.shift();
      }
      if (!isPausedOverInput) {
        startLoop();
      }
    };

    const handleLeave = () => {
      nodes.length = 0;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
        isRunning = false;
      }
    };

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", handleMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", handleLeave, { passive: true });

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handleMove);
      document.documentElement.removeEventListener("pointerleave", handleLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [shouldRun]);

  if (!shouldRun) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9990] hidden xl:block"
    />
  );
}
