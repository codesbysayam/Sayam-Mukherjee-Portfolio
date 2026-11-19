import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import {
  MOTION_DISTANCE,
  MOTION_DURATION,
  MOTION_EASE,
  MOTION_VIEWPORT,
  useFinePointer,
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
  immediate?: boolean;
}

/**
 * Masked editorial display line reveal sliding upward out of its baseline clip.
 */
export function TextMaskReveal({
  children,
  className = "",
  delay = 0,
  immediate = true,
}: TextLineRevealProps) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <span className={`inline-block ${className}`}>{children}</span>;
  }

  return (
    <span className={`inline-block overflow-hidden align-bottom ${className}`}>
      <motion.span
        className="inline-block"
        initial={{ y: "108%", opacity: 0.25 }}
        animate={immediate ? { y: "0%", opacity: 1 } : undefined}
        whileInView={immediate ? undefined : { y: "0%", opacity: 1 }}
        viewport={immediate ? undefined : MOTION_VIEWPORT}
        transition={{
          duration: MOTION_DURATION.scene,
          delay,
          ease: MOTION_EASE.out,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export const TextLineReveal = TextMaskReveal;

interface MaskMediaRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  immediate?: boolean;
  direction?: "up" | "left" | "center";
}

/**
 * Architectural curtain reveal using clip-path inset + gentle scale settle (1.05 -> 1.0).
 */
export function ImageCurtainReveal({
  children,
  className = "",
  delay = 0,
  immediate = false,
  direction = "up",
}: MaskMediaRevealProps) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const initialClip =
    direction === "left"
      ? "inset(0% 100% 0% 0%)"
      : direction === "center"
      ? "inset(8% 4% 8% 4% round 8px)"
      : "inset(14% 0% 0% 0% round 6px)";

  const initialState = {
    clipPath: initialClip,
    scale: 1.05,
    opacity: 0.72,
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
          ease: MOTION_EASE.emphasis,
        }}
        className={`overflow-hidden ${className}`}
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
        ease: MOTION_EASE.emphasis,
      }}
      className={`overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}

export const MaskMediaReveal = ImageCurtainReveal;
export const ImageMaskReveal = ImageCurtainReveal;

interface ScrollScaleImageProps {
  children: ReactNode;
  className?: string;
  scaleRange?: [number, number];
  yRange?: [number, number];
}

/**
 * Scroll-linked media frame scrubbing subtle scale & vertical drift while in viewport.
 */
export function ScrollScaleImage({
  children,
  className = "",
  scaleRange = [1.06, 1],
  yRange = [14, -14],
}: ScrollScaleImageProps) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 32,
    mass: 0.35,
  });
  const scale = useTransform(smoothProgress, [0, 1], scaleRange);
  const y = useTransform(smoothProgress, [0, 1], yRange);

  if (reduced) {
    return (
      <div ref={ref} className={`overflow-hidden ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ scale, y }} className="w-full h-full will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}

interface ScrollParallaxLayerProps {
  children: ReactNode;
  className?: string;
  offset?: number;
}

export function ScrollParallaxLayer({
  children,
  className = "",
  offset = 24,
}: ScrollParallaxLayerProps) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

interface HorizontalTrackProps {
  children: ReactNode;
  className?: string;
  shiftPx?: number;
}

/**
 * Scroll-linked lateral exhibition track on desktop inside clipping container; stacks cleanly on mobile.
 */
export function HorizontalTrack({
  children,
  className = "",
  shiftPx = -90,
}: HorizontalTrackProps) {
  const reduced = usePrefersReducedMotion();
  const finePointer = useFinePointer();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.4,
  });
  const x = useTransform(smooth, [0, 1], [0, shiftPx]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <motion.div
        style={!reduced && finePointer ? { x } : undefined}
        className="w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}

interface MagneticActionProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

/**
 * Tactile fine-pointer micro-attraction wrapper for primary CTAs. Resets cleanly on blur/leave.
 */
export function MagneticAction({
  children,
  className = "",
  strength = 6,
}: MagneticActionProps) {
  const reduced = usePrefersReducedMotion();
  const finePointer = useFinePointer();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 320, damping: 24, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 320, damping: 24, mass: 0.35 });

  if (reduced || !finePointer) {
    return <div className={`inline-flex ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onPointerMove={(e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        x.set(nx * strength * 2);
        y.set(ny * strength * 2);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      onBlur={() => {
        x.set(0);
        y.set(0);
      }}
      className={`inline-flex ${className}`}
    >
      {children}
    </motion.div>
  );
}

interface PointerReactiveVisualProps {
  children: ReactNode;
  className?: string;
  maxTiltDeg?: number;
}

/**
 * Pointer-reactive editorial stage (Lusion-style depth tilt + soft specular spot) with keyboard/focus support.
 */
export function PointerReactiveVisual({
  children,
  className = "",
  maxTiltDeg = 4,
}: PointerReactiveVisualProps) {
  const reduced = usePrefersReducedMotion();
  const finePointer = useFinePointer();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 200, damping: 24, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 200, damping: 24, mass: 0.4 });

  const rotateX = useTransform(sy, [-0.5, 0.5], [maxTiltDeg, -maxTiltDeg]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-maxTiltDeg, maxTiltDeg]);

  const handleReset = () => {
    px.set(0);
    py.set(0);
    setActive(false);
  };

  if (reduced || !finePointer) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        px.set((e.clientX - rect.left) / rect.width - 0.5);
        py.set((e.clientY - rect.top) / rect.height - 0.5);
        if (!active) setActive(true);
      }}
      onPointerLeave={handleReset}
      onBlur={handleReset}
      className="[perspective:1100px]"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={`relative transition-shadow duration-300 ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
}

interface LineRevealProps {
  className?: string;
  delay?: number;
  immediate?: boolean;
}

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
