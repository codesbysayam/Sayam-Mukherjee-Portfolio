import { useEffect, useState } from "react";

export const MOTION_DURATION = {
  instant: 0.1,
  fast: 0.16,
  ui: 0.22,
  normal: 0.26,
  medium: 0.36,
  enter: 0.62,
  reveal: 0.62,
  scene: 0.82,
} as const;

export const MOTION_DISTANCE = {
  sm: 10,
  md: 18,
  lg: 28,
} as const;

export const MOTION_EASE = {
  standard: [0.2, 0.7, 0.2, 1] as [number, number, number, number],
  out: [0.22, 1, 0.36, 1] as [number, number, number, number],
  inOut: [0.76, 0, 0.24, 1] as [number, number, number, number],
  emphasis: [0.76, 0, 0.24, 1] as [number, number, number, number],
};

export const MOTION_VIEWPORT = {
  once: true,
  amount: "some" as const,
};

export const MOTION = {
  duration: MOTION_DURATION,
  distance: MOTION_DISTANCE,
  ease: MOTION_EASE,
  viewport: MOTION_VIEWPORT,
} as const;

export type DeviceCapabilityTier = "high" | "standard" | "low";

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export function useDeviceCapability(): DeviceCapabilityTier {
  const prefersReduced = usePrefersReducedMotion();
  const [tier, setTier] = useState<DeviceCapabilityTier>("standard");

  useEffect(() => {
    if (prefersReduced) {
      setTier("low");
      return;
    }
    if (typeof window === "undefined") return;

    const coarseMq = window.matchMedia("(pointer: coarse)");

    const evaluate = () => {
      const nav = navigator as Navigator & { deviceMemory?: number };
      const cores = nav.hardwareConcurrency || 4;
      const memory = nav.deviceMemory || 4;
      const isCoarsePointer = coarseMq.matches;
      const isSmallScreen = window.innerWidth < 640;

      if (cores <= 2 || memory <= 2) {
        setTier("low");
      } else if (isCoarsePointer || isSmallScreen || cores <= 4) {
        setTier("standard");
      } else {
        setTier("high");
      }
    };

    evaluate();
    window.addEventListener("resize", evaluate, { passive: true });
    coarseMq.addEventListener("change", evaluate);
    return () => {
      window.removeEventListener("resize", evaluate);
      coarseMq.removeEventListener("change", evaluate);
    };
  }, [prefersReduced]);

  return tier;
}

export function useFinePointer(): boolean {
  const [isFine, setIsFine] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsFine(mq.matches);

    const onChange = (event: MediaQueryListEvent) => setIsFine(event.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isFine;
}
