import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ensureGsapRegistered,
  gsap,
  MOTION_BREAKPOINTS,
} from "../../motion/gsapRegistry";
import { usePrefersReducedMotion } from "../../motion/tokens";

export interface NarrativeStop {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  body: string;
  meta?: string;
  accent?: ReactNode;
}

interface HorizontalNarrativeProps {
  stops: NarrativeStop[];
  title: string;
  eyebrow: string;
  className?: string;
}

/**
 * Sideways / Horizontal Scroll Narrative:
 * - Desktop (lg+) & motion enabled: GSAP ScrollTrigger pinned sideways track with scrubbed progress bar.
 * - Mobile / Tablet (<lg): Touch-native horizontal CSS scroll-snap track (.horizontal-narrative-mobile-track).
 * - Reduced motion: Clean accessible multi-column grid with zero forced horizontal scroll.
 */
export function HorizontalNarrative({
  stops,
  title,
  eyebrow,
  className = "",
}: HorizontalNarrativeProps) {
  const reduced = usePrefersReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const activeStepRef = useRef(0);
  const [activeStep, setActiveStep] = useState(0);
  const [mobileStep, setMobileStep] = useState(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!wrapper || !viewport || !track || reduced || stops.length < 2) return;

    ensureGsapRegistered();

    const mm = gsap.matchMedia();
    mm.add(MOTION_BREAKPOINTS.desktop, () => {
      const getShift = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
      if (getShift() <= 8) return;

      gsap.to(track, {
        x: () => -getShift(),
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top 88px",
          end: () => `+=${Math.max(420, getShift() * 1.15)}`,
          pin: true,
          scrub: 0.55,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressBarRef.current) {
              progressBarRef.current.style.transform = `scaleX(${self.progress})`;
            }
            const nextIdx = Math.min(
              stops.length - 1,
              Math.floor(self.progress * stops.length)
            );
            if (activeStepRef.current !== nextIdx) {
              activeStepRef.current = nextIdx;
              setActiveStep(nextIdx);
            }
          },
        },
      });
    });

    return () => mm.revert();
  }, [stops.length, reduced]);

  const scrollMobileTo = (targetIndex: number) => {
    const track = mobileTrackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(stops.length - 1, targetIndex));
    const cards = Array.from(track.children) as HTMLElement[];
    const card = cards[clamped];
    if (!card) return;
    setMobileStep(clamped);
    track.scrollTo({
      left: card.offsetLeft,
      behavior: reduced ? "auto" : "smooth",
    });
  };

  if (reduced) {
    return (
      <section className={`space-y-5 ${className}`}>
        <div className="space-y-1">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--accent)] font-semibold">
            {eyebrow}
          </span>
          <h3 className="font-display text-2xl font-extrabold text-[var(--text)]">
            {title}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stops.map((stop) => (
            <article
              key={stop.id}
              className="card p-5 space-y-2.5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[var(--accent)] font-bold">{stop.index}</span>
                  <span className="text-[var(--text-muted)]">{stop.eyebrow}</span>
                </div>
                <h4 className="font-display text-base font-bold text-[var(--text)]">
                  {stop.title}
                </h4>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {stop.body}
                </p>
              </div>
              {stop.meta && (
                <div className="pt-2 border-t border-[var(--border)] text-[11px] font-mono text-[var(--text-muted)]">
                  {stop.meta}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={`space-y-5 ${className}`}>
      {/* Desktop Pinned Horizontal Stage */}
      <div
        ref={wrapperRef}
        className="hidden lg:block rounded-[12px] border border-[var(--border-strong)] bg-[var(--surface-2)] p-6 space-y-5 overflow-hidden"
      >
        <div className="flex items-end justify-between gap-4 border-b border-[var(--border)] pb-4">
          <div className="space-y-1">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--accent)] font-semibold block">
              {eyebrow}
            </span>
            <h3 className="font-display text-2xl font-extrabold text-[var(--text)] tracking-tight">
              {title}
            </h3>
          </div>
          <div className="font-mono text-xs text-[var(--text-muted)] tabular-nums">
            Step{" "}
            <span className="text-[var(--accent)] font-bold">
              {String(activeStep + 1).padStart(2, "0")}
            </span>{" "}
            / {String(stops.length).padStart(2, "0")}
          </div>
        </div>

        <div ref={viewportRef} className="overflow-hidden w-full">
          <div
            ref={trackRef}
            className="flex gap-5 w-max will-change-transform py-1"
          >
            {stops.map((stop, idx) => (
              <article
                key={stop.id}
                className={`w-[360px] shrink-0 rounded-[10px] border p-5 flex flex-col justify-between gap-4 transition-colors ${
                  idx === activeStep
                    ? "bg-[var(--surface)] border-[var(--accent)]"
                    : "bg-[var(--surface)]/75 border-[var(--border)]"
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 text-xs font-mono">
                    <span className="px-2 py-0.5 rounded-[4px] bg-[var(--surface-2)] border border-[var(--border)] text-[var(--accent)] font-bold tabular-nums">
                      {stop.index}
                    </span>
                    <span className="text-[var(--text-muted)] uppercase tracking-wider text-[10px]">
                      {stop.eyebrow}
                    </span>
                  </div>
                  <h4 className="font-display text-lg font-extrabold text-[var(--text)] leading-snug">
                    {stop.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    {stop.body}
                  </p>
                </div>

                {stop.meta && (
                  <div className="pt-3 border-t border-[var(--border)] text-[11px] font-mono text-[var(--text-muted)]">
                    {stop.meta}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>

        {/* Continuous Scrubbed Track Progress */}
        <div className="h-[2px] w-full bg-[var(--border)] rounded-full overflow-hidden">
          <div
            ref={progressBarRef}
            className="h-full w-full bg-[var(--accent)] origin-left"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>

      {/* Tablet / Mobile Touch Scroll-Snap Fallback with Keyboard Controls */}
      <div className="lg:hidden space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--accent)] font-semibold block">
              {eyebrow}
            </span>
            <h3 className="font-display text-xl font-extrabold text-[var(--text)]">
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
              {String(mobileStep + 1).padStart(2, "0")} / {String(stops.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => scrollMobileTo(mobileStep - 1)}
              disabled={mobileStep <= 0}
              aria-label="Previous milestone"
              className="px-2.5 py-1.5 rounded-[6px] border border-[var(--border-strong)] bg-[var(--surface)] text-xs font-mono font-bold text-[var(--text)] disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => scrollMobileTo(mobileStep + 1)}
              disabled={mobileStep >= stops.length - 1}
              aria-label="Next milestone"
              className="px-2.5 py-1.5 rounded-[6px] border border-[var(--border-strong)] bg-[var(--surface)] text-xs font-mono font-bold text-[var(--text)] disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>

        <div
          ref={mobileTrackRef}
          tabIndex={0}
          role="region"
          aria-label={title}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              scrollMobileTo(mobileStep + 1);
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              scrollMobileTo(mobileStep - 1);
            }
          }}
          onScroll={() => {
            const track = mobileTrackRef.current;
            if (!track) return;
            const cards = Array.from(track.children) as HTMLElement[];
            if (!cards.length) return;
            const center = track.scrollLeft + track.clientWidth * 0.3;
            let best = 0;
            let bestDist = Infinity;
            cards.forEach((c, idx) => {
              const d = Math.abs(c.offsetLeft - center);
              if (d < bestDist) {
                bestDist = d;
                best = idx;
              }
            });
            setMobileStep(best);
          }}
          className="horizontal-narrative-mobile-track focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-[8px]"
        >
          {stops.map((stop) => (
            <article
              key={stop.id}
              className="card p-4 space-y-2.5 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[var(--accent)] font-bold">{stop.index}</span>
                  <span className="text-[var(--text-muted)] text-[10px] uppercase">{stop.eyebrow}</span>
                </div>
                <h4 className="font-display text-base font-bold text-[var(--text)]">
                  {stop.title}
                </h4>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {stop.body}
                </p>
              </div>
              {stop.meta && (
                <div className="pt-2 border-t border-[var(--border)] text-[11px] font-mono text-[var(--text-muted)]">
                  {stop.meta}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HorizontalNarrative;
