import { type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useMotionSettings } from "../../motion/MotionProvider";
import { MOTION_DURATION, MOTION_EASE } from "../../motion/tokens";

interface RouteTransitionProps {
  routeKey: string;
  children: ReactNode;
}

/**
 * Architectural cross-route transition:
 * Pairs GPU-composited scene entry/exit with an asymmetric Ink curtain wipe
 * and a Signal Lime top rule, strictly non-blocking and reduced-motion safe.
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
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{
          duration: MOTION_DURATION.normal,
          ease: MOTION_EASE.out,
        }}
        className="relative w-full min-h-[60vh]"
      >
        {/* Architectural Ink curtain pass on route entry */}
        <motion.div
          key={`curtain-${routeKey}`}
          aria-hidden="true"
          initial={{ scaleY: 0.24, opacity: 0.45 }}
          animate={{ scaleY: 0, opacity: 0 }}
          transition={{
            duration: MOTION_DURATION.reveal,
            ease: MOTION_EASE.out,
          }}
          style={{ originY: 0 }}
          className="pointer-events-none fixed inset-x-0 top-0 z-[65] h-28 bg-[#151713] dark:bg-[#0E100C]"
        />

        {/* Signal Lime hairline rule */}
        <motion.span
          key={`sweep-${routeKey}`}
          aria-hidden="true"
          initial={{ scaleX: 0, opacity: 0.95 }}
          animate={{ scaleX: [0, 1, 1], opacity: [0.95, 0.95, 0] }}
          transition={{
            duration: MOTION_DURATION.medium + 0.16,
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
