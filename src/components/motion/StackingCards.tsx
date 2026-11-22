import { useEffect, useRef, type ReactNode } from "react";
import {
  ensureGsapRegistered,
  gsap,
  MOTION_BREAKPOINTS,
} from "../../motion/gsapRegistry";
import { usePrefersReducedMotion } from "../../motion/tokens";

export interface StackingCardEntry {
  id: string;
  render: (isMobileOrReduced: boolean, index: number) => ReactNode;
}

interface StackingCardsProps {
  items: StackingCardEntry[];
  className?: string;
}

/**
 * Finite GSAP ScrollTrigger stacking card sequence for desktop (lg+).
 * Keeps transform ownership isolated on outer card shells and degrades
 * cleanly to a standard vertical card flow on tablet/mobile or reduced-motion.
 */
export function StackingCards({ items, className = "" }: StackingCardsProps) {
  const reduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reduced || items.length < 2) return;

    ensureGsapRegistered();

    const mm = gsap.matchMedia();
    mm.add(MOTION_BREAKPOINTS.desktop, () => {
      const cardEls = gsap.utils.toArray<HTMLElement>("[data-stack-card]", container);
      if (cardEls.length < 2) return;

      cardEls.forEach((card, idx) => {
        if (idx === cardEls.length - 1) return;
        const nextCard = cardEls[idx + 1];

        gsap.to(card, {
          scale: 0.94,
          opacity: 0.58,
          ease: "none",
          scrollTrigger: {
            trigger: nextCard,
            start: "top 75%",
            end: "top 22%",
            scrub: true,
          },
        });
      });
    });

    return () => mm.revert();
  }, [items.length, reduced]);

  return (
    <div ref={containerRef} className={`space-y-6 ${className}`}>
      {items.map((item, idx) => (
        <div
          key={item.id}
          data-stack-card
          className={
            reduced
              ? "relative"
              : "relative lg:sticky lg:top-24 will-change-transform origin-top"
          }
          style={{
            zIndex: idx + 1,
          }}
        >
          {item.render(reduced, idx)}
        </div>
      ))}
    </div>
  );
}

export default StackingCards;
