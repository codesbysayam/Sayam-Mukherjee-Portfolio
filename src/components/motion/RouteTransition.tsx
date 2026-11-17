import { type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useMotionSettings } from "../../motion/MotionProvider";
import { MOTION_DURATION, MOTION_EASE } from "../../motion/tokens";

interface RouteTransitionProps {
  routeKey: string;
  children: ReactNode;
}

/**
 * Coordinates clean cross-route transitions using GPU-only transform/opacity
 * plus an architectural Signal Lime hairline sweep across the top edge.
 */
export default function RouteTransition({ routeKey, children }: RouteTransitionProps) {
  const { reducedMotion } = useMotionSettings();

  if (reducedMotion) {
    return (
      <div key={routeKey} className="w-full min-h-[60vh]">
        {children}
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routeKey}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{
          duration: MOTION_DURATION.normal,
          ease: MOTION_EASE.out,
        }}
        className="relative w-full min-h-[60vh]"
      >
        {/* Architectural hairline sweep along route entry */}
        <motion.span
          key={`sweep-${routeKey}`}
          aria-hidden="true"
          initial={{ scaleX: 0, opacity: 0.9 }}
          animate={{ scaleX: [0, 1, 1], opacity: [0.9, 0.9, 0] }}
          transition={{
            duration: MOTION_DURATION.medium + 0.14,
            times: [0, 0.55, 1],
            ease: MOTION_EASE.inOut,
          }}
          style={{ originX: 0 }}
          className="pointer-events-none fixed top-0 left-0 right-0 z-[70] h-[2px] bg-[#C7E34A]"
        />
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
