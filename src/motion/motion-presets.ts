import { MOTION_DISTANCE, MOTION_DURATION, MOTION_EASE, MOTION_VIEWPORT } from "./tokens";

export const MOTION_PRESETS = {
  revealUp: {
    initial: { opacity: 0, y: MOTION_DISTANCE.md },
    whileInView: { opacity: 1, y: 0 },
    viewport: MOTION_VIEWPORT,
    transition: { duration: MOTION_DURATION.reveal, ease: MOTION_EASE.out },
  },
  staggerGrid: {
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport: MOTION_VIEWPORT,
    variants: {
      hidden: {},
      visible: {
        transition: { staggerChildren: 0.045, delayChildren: 0.03 },
      },
    },
  },
  staggerItem: {
    variants: {
      hidden: { opacity: 0, y: MOTION_DISTANCE.sm + 4 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: MOTION_DURATION.reveal, ease: MOTION_EASE.out },
      },
    },
  },
  modalReveal: {
    initial: { opacity: 0, scale: 0.96, y: 16 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.97, y: 12 },
    transition: { duration: 0.36, ease: MOTION_EASE.emphasis },
  },
  cardHover: {
    y: -2,
    transition: { duration: 0.18, ease: MOTION_EASE.out },
  },
  tapFeedback: {
    scale: 0.975,
    transition: { duration: 0.1 },
  },
} as const;
