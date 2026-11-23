import { useEffect, useRef, type ReactNode } from "react";
import {
  ensureGsapRegistered,
  gsap,
  MOTION_BREAKPOINTS,
  requestScrollTriggerRefresh,
  ScrollTrigger,
} from "../../motion/gsapRegistry";
import { usePrefersReducedMotion } from "../../motion/tokens";

interface PinnedHeadingSectionProps {
  heading: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
}

/**
 * Editorial 2-column chapter where the left column heading stays pinned
 * while the right column steps through content on desktop (lg+), and stacks
 * cleanly on tablet/mobile or under prefers-reduced-motion.
 */
export function PinnedHeadingSection({
  heading,
  children,
  className = "",
  id,
}: PinnedHeadingSectionProps) {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const pinColumnRef = useRef<HTMLDivElement>(null);
  const contentColumnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pinEl = pinColumnRef.current;
    const contentEl = contentColumnRef.current;
    if (!section || !pinEl || !contentEl || reduced) return;

    ensureGsapRegistered();

    const mm = gsap.matchMedia();
    mm.add(MOTION_BREAKPOINTS.desktopTall, () => {
      const distance = () =>
        Math.max(0, contentEl.offsetHeight - pinEl.offsetHeight);

      if (distance() <= 24) return;

      ScrollTrigger.create({
        trigger: section,
        start: "top 96px",
        end: () => `+=${Math.max(0, contentEl.offsetHeight - pinEl.offsetHeight)}`,
        pin: pinEl,
        pinSpacing: false,
        invalidateOnRefresh: true,
      });
    });

    const ro = new ResizeObserver(() => {
      requestScrollTriggerRefresh(90);
    });
    ro.observe(contentEl);
    ro.observe(pinEl);

    return () => {
      ro.disconnect();
      mm.revert();
    };
  }, [reduced]);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start ${className}`}
    >
      <div ref={pinColumnRef} className="desktop-only-pinning lg:col-span-5 min-w-0">
        {heading}
      </div>
      <div ref={contentColumnRef} className="lg:col-span-7 min-w-0">
        {children}
      </div>
    </section>
  );
}

export default PinnedHeadingSection;
