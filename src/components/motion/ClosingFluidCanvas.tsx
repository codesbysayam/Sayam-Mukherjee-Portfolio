import { useEffect, useRef } from "react";
import { useDeviceCapability, usePrefersReducedMotion } from "../../motion/tokens";

interface ClosingFluidCanvasProps {
  tone?: "dark" | "adaptive";
  className?: string;
}

interface RippleNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  life: number;
  hue: "lime" | "moss";
}

/**
 * Restrained pointer-reactive backdrop canvas for closing/contact sections.
 * Sleeps at zero RAF frames when idle, resumes on pointermove, and respects
 * offscreen/hidden tab states and reduced-motion / low-tier devices.
 */
export default function ClosingFluidCanvas({
  tone = "adaptive",
  className = "",
}: ClosingFluidCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const capability = useDeviceCapability();

  useEffect(() => {
    if (reduced || capability === "low") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarsePointer) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const ripples: RippleNode[] = [];
    let rafId = 0;
    let isVisible = true;
    let isTabVisible = !document.hidden;
    let width = 1;
    let height = 1;
    let dpr = 1;
    let lastEmit = 0;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    function scheduleFrame() {
      if (!rafId && isVisible && isTabVisible && ripples.length > 0) {
        rafId = requestAnimationFrame(render);
      }
    }

    const spawnNode = (x: number, y: number, vx = 0, vy = 0) => {
      if (ripples.length > 26) ripples.shift();
      ripples.push({
        x,
        y,
        vx: vx * 0.14,
        vy: vy * 0.14,
        radius: 68,
        life: 1,
        hue: ripples.length % 3 === 0 ? "lime" : "moss",
      });
      scheduleFrame();
    };

    let lastX = 0;
    let lastY = 0;
    let hasLast = false;

    const onPointerMove = (e: PointerEvent) => {
      if (!isVisible || !isTabVisible) return;
      const now = performance.now();
      if (now - lastEmit < 42) return;
      lastEmit = now;

      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

      const vx = hasLast ? x - lastX : 0;
      const vy = hasLast ? y - lastY : 0;
      lastX = x;
      lastY = y;
      hasLast = true;

      spawnNode(x, y, vx, vy);
    };

    parent.addEventListener("pointermove", onPointerMove, { passive: true });

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        scheduleFrame();
      },
      { threshold: 0.05 }
    );
    io.observe(parent);

    const onVisChange = () => {
      isTabVisible = !document.hidden;
      scheduleFrame();
    };
    document.addEventListener("visibilitychange", onVisChange);

    function render() {
      rafId = 0;
      if (!ctx || !isVisible || !isTabVisible) return;

      ctx.clearRect(0, 0, width, height);

      for (let i = ripples.length - 1; i >= 0; i--) {
        const node = ripples[i];
        node.x += node.vx;
        node.y += node.vy;
        node.vx *= 0.94;
        node.vy *= 0.94;
        node.radius += 1.35;
        node.life -= 0.014;

        if (node.life <= 0) {
          ripples.splice(i, 1);
          continue;
        }

        const alpha = node.life * (tone === "dark" ? 0.14 : 0.1);
        const grad = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          node.radius
        );

        if (node.hue === "lime") {
          grad.addColorStop(0, `rgba(199, 227, 74, ${alpha})`);
          grad.addColorStop(1, "rgba(199, 227, 74, 0)");
        } else {
          grad.addColorStop(0, `rgba(105, 115, 74, ${alpha})`);
          grad.addColorStop(1, "rgba(105, 115, 74, 0)");
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (ripples.length > 0) {
        rafId = requestAnimationFrame(render);
      }
    }

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisChange);
      parent.removeEventListener("pointermove", onPointerMove);
    };
  }, [reduced, capability, tone]);

  if (reduced || capability === "low") {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
