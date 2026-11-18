import type { CSSProperties, ReactNode } from "react";
import { motion } from "motion/react";
import {
  MOTION_DISTANCE,
  MOTION_DURATION,
  MOTION_EASE,
  MOTION_VIEWPORT,
  usePrefersReducedMotion,
} from "./tokens";

interface EditorialRevealProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  distance?: number;
  immediate?: boolean;
}

/**
 * Restrained section/block reveal anchored to shared motion tokens.
 * Respects prefers-reduced-motion and triggers cleanly on mount (immediate) or once in viewport.
 */
export function EditorialReveal({
  children,
  className = "",
  style,
  delay = 0,
  distance = MOTION_DISTANCE.md,
  immediate = false,
}: EditorialRevealProps) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      animate={immediate ? { opacity: 1, y: 0 } : undefined}
      whileInView={immediate ? undefined : { opacity: 1, y: 0 }}
      viewport={immediate ? undefined : MOTION_VIEWPORT}
      transition={{
        duration: MOTION_DURATION.reveal,
        delay,
        ease: MOTION_EASE.out,
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export const SectionReveal = EditorialReveal;

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
          duration: MOTION_DURATION.reveal,
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
  immediate?: boolean;
}

/**
 * Geometric inset mask + 1.04 -> 1.0 scale media reveal on scroll or immediate entry.
 */
export function MaskMediaReveal({
  children,
  className = "",
  delay = 0,
  immediate = false,
}: MaskMediaRevealProps) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const initialState = {
    clipPath: "inset(6% 0% 6% 0% round 8px)",
    scale: 1.04,
    opacity: 0.85,
  };
  const visibleState = {
    clipPath: "inset(0% 0% 0% 0% round 0px)",
    scale: 1,
    opacity: 1,
  };

  if (immediate) {
    return (
      <motion.div
        initial={initialState}
        animate={visibleState}
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

  return (
    <motion.div
      initial={initialState}
      whileInView={visibleState}
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

export const ImageMaskReveal = MaskMediaReveal;

interface LineRevealProps {
  className?: string;
  delay?: number;
  immediate?: boolean;
}

/**
 * Architectural horizontal hairline draw-in from left to right.
 */
export function LineReveal({
  className = "",
  delay = 0,
  immediate = false,
}: LineRevealProps) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return (
      <div
        aria-hidden="true"
        className={`h-px w-full bg-[var(--border)] ${className}`}
      />
    );
  }

  return (
    <motion.div
      aria-hidden="true"
      initial={{ scaleX: 0 }}
      animate={immediate ? { scaleX: 1 } : undefined}
      whileInView={immediate ? undefined : { scaleX: 1 }}
      viewport={immediate ? undefined : MOTION_VIEWPORT}
      transition={{
        duration: MOTION_DURATION.reveal,
        delay,
        ease: MOTION_EASE.inOut,
      }}
      style={{ originX: 0 }}
      className={`h-px w-full bg-[var(--border)] ${className}`}
    />
  );
}

interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  stagger?: number;
  delayChildren?: number;
  immediate?: boolean;
}

export function StaggerGroup({
  children,
  className = "",
  style,
  stagger = 0.045,
  delayChildren = 0.03,
  immediate = false,
}: StaggerGroupProps) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  const variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren,
      },
    },
  };

  if (immediate) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={variants}
        className={className}
        style={style}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={MOTION_VIEWPORT}
      variants={variants}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  distance?: number;
}

export function StaggerItem({
  children,
  className = "",
  distance = MOTION_DISTANCE.sm + 4,
}: StaggerItemProps) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: distance },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: MOTION_DURATION.reveal,
            ease: MOTION_EASE.out,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
