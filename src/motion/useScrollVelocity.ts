import { useEffect, useRef, useState } from "react";
import { useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import { usePrefersReducedMotion } from "./tokens";

/**
 * Throttled normalized scroll velocity in range [-1, 1].
 * Positive = scrolling down, negative = scrolling up, smoothly decays to 0 on pause.
 */
export function useScrollVelocity(): number {
  const reduced = usePrefersReducedMotion();
  const [velocity, setVelocity] = useState(0);
  const lastYRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined" || reduced) {
      setVelocity(0);
      return;
    }

    lastYRef.current = window.scrollY;
    lastTimeRef.current = performance.now();

    const stepDecay = () => {
      rafRef.current = 0;
      velocityRef.current *= 0.84;
      if (Math.abs(velocityRef.current) < 0.015) {
        velocityRef.current = 0;
        setVelocity(0);
        return;
      }
      setVelocity(Number(velocityRef.current.toFixed(3)));
      rafRef.current = requestAnimationFrame(stepDecay);
    };

    const onScroll = () => {
      const now = performance.now();
      const dt = Math.max(12, now - lastTimeRef.current);
      const dy = window.scrollY - lastYRef.current;
      lastYRef.current = window.scrollY;
      lastTimeRef.current = now;

      const raw = (dy / dt) * 0.45;
      const clamped = Math.max(-1, Math.min(1, raw));
      velocityRef.current = velocityRef.current * 0.4 + clamped * 0.6;
      setVelocity(Number(velocityRef.current.toFixed(3)));

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(stepDecay);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

  return velocity;
}

/**
 * Zero-re-render MotionValue spring velocity hook for scroll-coupled transforms.
 */
export function useScrollVelocityMotion(maxOutput = 18) {
  const { scrollY } = useScroll();
  const rawVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(rawVelocity, {
    damping: 36,
    stiffness: 260,
    mass: 0.4,
  });
  return useTransform(smoothVelocity, [-2400, 0, 2400], [-maxOutput, 0, maxOutput]);
}
