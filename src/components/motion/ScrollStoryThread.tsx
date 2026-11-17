import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { usePrefersReducedMotion } from "../../motion/tokens";

interface ChapterAnchor {
  id: string;
  code: string;
  label: string;
}

const CHAPTERS: ChapterAnchor[] = [
  { id: "hero", code: "00", label: "Intro" },
  { id: "home-about-chapter", code: "01", label: "About" },
  { id: "home-work-chapter", code: "02", label: "Work" },
  { id: "home-duality-chapter", code: "03", label: "Explore" },
  { id: "live-build-feed", code: "04", label: "GitHub" },
  { id: "credentials-home-preview", code: "05", label: "Proof" },
  { id: "faq-section", code: "06", label: "FAQ" },
];

/**
 * Restrained desktop editorial chapter spine + continuous scroll progress thread.
 * Hidden below 2xl to prevent overlap with main 1280px container or utility actions.
 */
export default function ScrollStoryThread() {
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  const [activeId, setActiveId] = useState<string>("hero");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const elements = CHAPTERS.map((c) => document.getElementById(c.id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-25% 0px -45% 0px",
        threshold: [0.1, 0.35, 0.65],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  return (
    <aside
      aria-label="Page chapters index"
      className="hidden 2xl:flex fixed right-5 top-1/2 -translate-y-1/2 z-30 flex-col items-end gap-2 select-none"
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

        {CHAPTERS.map((chapter) => {
          const isActive = activeId === chapter.id;
          return (
            <button
              key={chapter.id}
              type="button"
              onClick={() => scrollToSection(chapter.id)}
              aria-current={isActive ? "location" : undefined}
              className="group flex items-center gap-2 text-right cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C7E34A] rounded px-1"
            >
              <span
                className={`font-mono text-[10px] tracking-[0.08em] uppercase transition-colors ${
                  isActive
                    ? "text-[var(--text)] font-bold"
                    : "text-[var(--text-faint)] opacity-75 group-hover:opacity-100 group-hover:text-[var(--text-muted)]"
                }`}
              >
                {chapter.code} {chapter.label}
              </span>
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full transition-transform ${
                  isActive
                    ? "bg-[#C7E34A] scale-125"
                    : "bg-[var(--border-strong)] group-hover:bg-[var(--text-muted)]"
                }`}
              />
            </button>
          );
        })}
      </div>
    </aside>
  );
}
