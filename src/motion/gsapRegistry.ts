import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

let registered = false;

export const MOTION_BREAKPOINTS = {
  desktop: "(min-width: 1024px)",
  wide: "(min-width: 1280px)",
  tabletUp: "(min-width: 768px)",
  mobile: "(max-width: 1023px)",
  reducedMotion: "(prefers-reduced-motion: reduce)",
} as const;

export function ensureGsapRegistered() {
  if (typeof window === "undefined") return;
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger, Flip);
    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    });
    registered = true;
  }
}

let refreshTimer: number | null = null;

/**
 * Debounced ScrollTrigger recalculation helper used after route changes,
 * font loads, filter layout shifts, and image decodes.
 */
export function requestScrollTriggerRefresh(delayMs = 90) {
  if (typeof window === "undefined") return;
  ensureGsapRegistered();
  if (refreshTimer !== null) {
    window.clearTimeout(refreshTimer);
  }
  refreshTimer = window.setTimeout(() => {
    refreshTimer = null;
    ScrollTrigger.refresh();
  }, delayMs);
}

/**
 * Checks whether reduced motion is currently preferred at call time.
 */
export function isReducedMotionPreferred(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger, Flip };
