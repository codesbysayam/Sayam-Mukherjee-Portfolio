import type { RefObject } from "react";
import { useScroll, useSpring } from "motion/react";

export function useScrollProgress(targetRef?: RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll(
    targetRef ? { target: targetRef, offset: ["start start", "end end"] } : undefined
  );

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  return { scrollYProgress, smoothProgress };
}
