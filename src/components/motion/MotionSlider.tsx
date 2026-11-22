import React, { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePrefersReducedMotion } from "../../motion/tokens";

interface MotionSliderProps {
  children: ReactNode[];
  label: string;
  itemClassName?: string;
  columnsClassName?: string;
  className?: string;
  showCounter?: boolean;
}

/**
 * Reusable accessible CSS scroll-snap carousel supporting touch swipe,
 * wheel horizontal scroll, keyboard arrows, prev/next buttons, and dot indicators.
 */
export function MotionSlider({
  children,
  label,
  itemClassName = "",
  columnsClassName = "auto-cols-[88%] sm:auto-cols-[54%] lg:auto-cols-[44%]",
  className = "",
  showCounter = true,
}: MotionSliderProps) {
  const reduced = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const total = children.length;

  const updateActiveFromScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const slides = Array.from(track.children) as HTMLElement[];
    if (slides.length === 0) return;

    const scrollLeft = track.scrollLeft;
    let bestIdx = 0;
    let bestDist = Infinity;

    slides.forEach((slide, idx) => {
      const dist = Math.abs(slide.offsetLeft - scrollLeft);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = idx;
      }
    });

    setActiveSlide(bestIdx);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => updateActiveFromScroll();
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [updateActiveFromScroll]);

  const scrollToSlide = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track || total === 0) return;
      const clamped = Math.max(0, Math.min(total - 1, index));
      const target = track.children[clamped] as HTMLElement | undefined;
      if (!target) return;

      track.scrollTo({
        left: target.offsetLeft,
        behavior: reduced ? "auto" : "smooth",
      });
      setActiveSlide(clamped);
    },
    [reduced, total]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollToSlide(activeSlide - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollToSlide(activeSlide + 1);
    }
  };

  if (total === 0) return null;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`space-y-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-[10px] ${className}`}
    >
      {/* Track Controls */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
          <span className="uppercase tracking-[0.12em] font-semibold text-[var(--accent)]">
            {label}
          </span>
          {showCounter && (
            <>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                {String(activeSlide + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scrollToSlide(activeSlide - 1)}
            disabled={activeSlide === 0}
            aria-label={`Previous ${label}`}
            className="w-9 h-9 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] text-[var(--text)] flex items-center justify-center transition-colors cursor-pointer disabled:opacity-35"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollToSlide(activeSlide + 1)}
            disabled={activeSlide >= total - 1}
            aria-label={`Next ${label}`}
            className="w-9 h-9 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] text-[var(--text)] flex items-center justify-center transition-colors cursor-pointer disabled:opacity-35"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Snap Track */}
      <div
        ref={trackRef}
        className={`motion-slider-track ${columnsClassName} pb-1`}
      >
        {children.map((child, idx) => (
          <div
            key={idx}
            role="group"
            aria-roledescription="slide"
            aria-label={`${idx + 1} of ${total}`}
            className={`motion-slider-slide ${itemClassName}`}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      {total > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {children.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={idx === activeSlide ? "true" : undefined}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === activeSlide
                  ? "w-5 bg-[var(--accent)]"
                  : "w-1.5 bg-[var(--border-strong)] hover:bg-[var(--text-muted)]"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MotionSlider;
