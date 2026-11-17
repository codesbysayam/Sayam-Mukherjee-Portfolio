import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { MOTION_EASE, usePrefersReducedMotion } from "../../motion/tokens";

export interface ChapterAnchor {
  id: string;
  code: string;
  label: string;
}

export const HOME_CHAPTERS: ChapterAnchor[] = [
  { id: "hero", code: "00", label: "Intro" },
  { id: "home-about-chapter", code: "01", label: "About" },
  { id: "home-work-chapter", code: "02", label: "Work" },
  { id: "home-duality-chapter", code: "03", label: "Explore" },
  { id: "live-build-feed", code: "04", label: "GitHub" },
  { id: "credentials-home-preview", code: "05", label: "Proof" },
  { id: "faq-section", code: "06", label: "FAQ" },
];

interface ScrollStoryThreadProps {
  chapters?: ChapterAnchor[];
  routeKey?: string;
}

/**
 * Restrained desktop editorial chapter spine + continuous scroll progress thread.
 * Compact dot index at xl (1280-1535px, expanding labels on hover/focus) and
 * full persistent editorial index at 2xl (>= 1536px).
 */
export default function ScrollStoryThread({
  chapters = HOME_CHAPTERS,
  routeKey = "home",
}: ScrollStoryThreadProps) {
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  const [activeId, setActiveId] = useState<string>(chapters[0]?.id ?? "hero");
  const [availableIds, setAvailableIds] = useState<string[]>([]);

  useEffect(() => {
    setActiveId(chapters[0]?.id ?? "");
  }, [routeKey, chapters]);

  useEffect(() => {
    if (typeof window === "undefined" || chapters.length === 0) return;

    let observer: IntersectionObserver | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const bindObserver = () => {
      if (observer) observer.disconnect();

      const elements = chapters
        .map((c) => document.getElementById(c.id))
        .filter((el): el is HTMLElement => Boolean(el));

      setAvailableIds(elements.map((el) => el.id));
      if (elements.length === 0) return false;

      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

          if (visible[0]?.target?.id) {
            setActiveId(visible[0].target.id);
          }
        },
        {
          rootMargin: "-22% 0px -45% 0px",
          threshold: [0.08, 0.3, 0.6],
        }
      );

      elements.forEach((el) => observer?.observe(el));
      return elements.length === chapters.length;
    };

    const rafId = requestAnimationFrame(() => {
      const complete = bindObserver();
      if (!complete) {
        retryTimer = setTimeout(bindObserver, 420);
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (retryTimer) clearTimeout(retryTimer);
      if (observer) observer.disconnect();
    };
  }, [chapters, routeKey]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    setActiveId(id);
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  const renderedChapters =
    availableIds.length > 0
      ? chapters.filter((c) => availableIds.includes(c.id))
      : chapters;

  if (renderedChapters.length < 2) return null;

  return (
    <aside
      aria-label="Page chapters index"
      className="hidden xl:flex fixed right-3 2xl:right-5 top-1/2 -translate-y-1/2 z-30 flex-col items-end gap-2 select-none"
    >
      <div className="relative flex flex-col gap-2.5 pr-3 py-1">
        {/* Background track */}
        <span
          aria-hidden="true"
          className="absolute right-0 top-1 bottom-1 w-[2px] rounded-full bg-[var(--border)]"
        />

        {/* Continuous scroll thread */}
        {!reduced && (
          <motion.span
            aria-hidden="true"
            style={{ scaleY, originY: 0 }}
            className="absolute right-0 top-1 bottom-1 w-[2px] rounded-full bg-[#C7E34A]"
          />
        )}

        {renderedChapters.map((chapter) => {
          const isActive = activeId === chapter.id;
          return (
            <button
              key={chapter.id}
              type="button"
              onClick={() => scrollToSection(chapter.id)}
              aria-current={isActive ? "location" : undefined}
              title={`${chapter.code} ${chapter.label}`}
              className="group flex items-center gap-2 text-right cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C7E34A] rounded px-1"
            >
              <span
                className={`font-mono text-[10px] tracking-[0.08em] uppercase transition-all duration-150 ${
                  isActive
                    ? "text-[var(--text)] font-bold opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 2xl:opacity-100"
                    : "text-[var(--text-faint)] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 2xl:opacity-75 2xl:group-hover:opacity-100 group-hover:text-[var(--text-muted)]"
                } px-1.5 py-0.5 rounded-[4px] bg-[var(--bg)]/85 2xl:bg-transparent backdrop-blur-sm 2xl:backdrop-blur-none`}
              >
                {chapter.code} {chapter.label}
              </span>
              <span className="relative flex items-center justify-center w-2.5 h-2.5">
                {isActive && !reduced ? (
                  <motion.span
                    layoutId={`scrollStoryDot-${routeKey}`}
                    transition={{ duration: 0.22, ease: MOTION_EASE.out }}
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full bg-[#C7E34A] ring-2 ring-[#C7E34A]/30"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 rounded-full transition-transform ${
                      isActive
                        ? "bg-[#C7E34A] scale-125"
                        : "bg-[var(--border-strong)] group-hover:bg-[var(--text-muted)]"
                    }`}
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
