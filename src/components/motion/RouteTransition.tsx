import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useMotionSettings } from "../../motion/MotionProvider";
import { MOTION_DURATION, MOTION_EASE } from "../../motion/tokens";
import { requestScrollTriggerRefresh } from "../../motion/gsapRegistry";

interface RouteTransitionProps {
  routeKey: string;
  children: ReactNode;
}

/**
 * Architectural cross-route transition:
 * Uses opacity fade on the route flow container (keeping it transform-free so
 * GSAP ScrollTrigger pins always measure against the viewport cleanly) paired
 * with a non-blocking Ink curtain wipe and Signal Lime hairline sweep.
 */
export default function RouteTransition({ routeKey, children }: RouteTransitionProps) {
  const { reducedMotion } = useMotionSettings();

  useEffect(() => {
    requestScrollTriggerRefresh(140);
  }, [routeKey]);

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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: MOTION_DURATION.normal,
          ease: MOTION_EASE.out,
        }}
        onAnimationComplete={() => requestScrollTriggerRefresh(60)}
        className="relative w-full min-h-[60vh]"
      >
        {/* Architectural Ink curtain pass on route entry */}
        <motion.div
          key={`curtain-${routeKey}`}
          aria-hidden="true"
          initial={{ scaleY: 0.22, opacity: 0.42 }}
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
