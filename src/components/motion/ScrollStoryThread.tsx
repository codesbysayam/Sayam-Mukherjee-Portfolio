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
 * Sticky desktop editorial chapter spine + continuous scroll progress thread.
 * Lives inside its own CSS Grid track in .site-layout so it NEVER overlaps content.
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

    let intersectionObserver: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const bindObserver = () => {
      if (intersectionObserver) intersectionObserver.disconnect();

      const elements = chapters
        .map((c) => document.getElementById(c.id))
        .filter((el): el is HTMLElement => Boolean(el));

      setAvailableIds(elements.map((el) => el.id));
      if (elements.length === 0) return false;

      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

          if (visible[0]?.target?.id) {
            setActiveId(visible[0].target.id);
          }
        },
        {
          rootMargin: "-20% 0px -45% 0px",
          threshold: [0.06, 0.25, 0.55],
        }
      );

      elements.forEach((el) => intersectionObserver?.observe(el));
      return elements.length === chapters.length;
    };

    const rafId = requestAnimationFrame(() => {
      const complete = bindObserver();
      if (!complete) {
        retryTimer = setTimeout(bindObserver, 350);
      }
    });

    const observeTarget = document.getElementById("main-content") || document.body;
    mutationObserver = new MutationObserver(() => {
      const presentCount = chapters.filter((c) => Boolean(document.getElementById(c.id))).length;
      if (presentCount > 0) {
        bindObserver();
      }
    });
    mutationObserver.observe(observeTarget, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(rafId);
      if (retryTimer) clearTimeout(retryTimer);
      if (intersectionObserver) intersectionObserver.disconnect();
      if (mutationObserver) mutationObserver.disconnect();
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
      className="section-navigation hidden xl:flex flex-col items-end gap-2 select-none pt-3"
    >
      <nav aria-label="Section chapters" className="relative flex flex-col gap-3 pr-3.5 py-1">
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
              className="group flex items-center justify-end gap-2 text-right cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C7E34A] rounded px-1 py-0.5 active:scale-[0.97] transition-transform"
            >
              <span
                className={`font-mono text-[10px] tracking-[0.08em] uppercase whitespace-nowrap transition-colors duration-150 ${
                  isActive
                    ? "text-[var(--text)] font-bold opacity-100"
                    : "text-[var(--text-faint)] opacity-80 group-hover:opacity-100 group-hover:text-[var(--text-muted)]"
                }`}
              >
                {chapter.code} {chapter.label}
              </span>
              <span className="relative flex items-center justify-center w-2.5 h-2.5 shrink-0">
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
      </nav>
    </aside>
  );
}
