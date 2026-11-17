import type { ReactNode } from "react";
import { motion } from "motion/react";
import {
  MOTION_DURATION,
  MOTION_EASE,
  MOTION_VIEWPORT,
  usePrefersReducedMotion,
} from "./tokens";

interface EditorialRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
}

/**
 * Restrained section/block reveal anchored to shared motion tokens.
 * Respects prefers-reduced-motion and triggers cleanly once in viewport.
 */
export function EditorialReveal({
  children,
  className = "",
  delay = 0,
  distance = 18,
}: EditorialRevealProps) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={MOTION_VIEWPORT}
      transition={{
        duration: MOTION_DURATION.enter,
        delay,
        ease: MOTION_EASE.out,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface TextLineRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Line-masked headline typography reveal for hero & chapter titles.
 */
export function TextLineReveal({
  children,
  className = "",
  delay = 0,
}: TextLineRevealProps) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <span className={`inline-block ${className}`}>{children}</span>;
  }

  return (
    <span className={`inline-block overflow-hidden align-bottom ${className}`}>
      <motion.span
        className="inline-block"
        initial={{ y: "105%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{
          duration: MOTION_DURATION.enter,
          delay,
          ease: MOTION_EASE.out,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

interface MaskMediaRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Geometric inset mask + 1.04 -> 1.0 scale media reveal on scroll entry.
 */
export function MaskMediaReveal({
  children,
  className = "",
  delay = 0,
}: MaskMediaRevealProps) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{
        clipPath: "inset(6% 0% 6% 0% round 8px)",
        scale: 1.04,
        opacity: 0.85,
      }}
      whileInView={{
        clipPath: "inset(0% 0% 0% 0% round 0px)",
        scale: 1,
        opacity: 1,
      }}
      viewport={MOTION_VIEWPORT}
      transition={{
        duration: MOTION_DURATION.scene,
        delay,
        ease: MOTION_EASE.out,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
