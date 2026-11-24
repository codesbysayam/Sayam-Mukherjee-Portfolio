import React, { useEffect, useState, RefObject } from "react";

export interface ResumeSectionItem {
  id: string;
  label: string;
  icon?: string;
}

export const RESUME_SECTIONS: ResumeSectionItem[] = [
  { id: "resume-overview", label: "Overview" },
  { id: "resume-education", label: "Education" },
  { id: "resume-experience", label: "Experience" },
  { id: "resume-projects", label: "Projects" },
  { id: "resume-achievements", label: "Achievements" },
  { id: "resume-skills", label: "Skills" },
  { id: "resume-profiles", label: "Profiles" },
];

interface ResumeSectionNavProps {
  scrollContainerRef?: RefObject<HTMLDivElement | null>;
  className?: string;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export function ResumeSectionNav({
  scrollContainerRef,
  className = "",
  searchQuery = "",
  onSearchChange,
}: ResumeSectionNavProps) {
  const [activeSection, setActiveSection] = useState("resume-overview");

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const setupListener = () => {
      const container = scrollContainerRef?.current;
      if (!container) {
        if (!cancelled) {
          requestAnimationFrame(setupListener);
        }
        return;
      }

      const handleScroll = () => {
        const scrollPos = container.scrollTop + 80;
        let currentSection = RESUME_SECTIONS[0].id;

        for (const section of RESUME_SECTIONS) {
          const el = document.getElementById(section.id);
          if (el) {
            const elRect = el.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const relativeTop = elRect.top - containerRect.top + container.scrollTop;
            if (scrollPos >= relativeTop - 30) {
              currentSection = section.id;
            }
          }
        }

        setActiveSection(currentSection);
      };

      container.addEventListener("scroll", handleScroll, { passive: true });
      cleanup = () => container.removeEventListener("scroll", handleScroll);
    };

    setupListener();

    return () => {
      cancelled = true;
      if (cleanup) cleanup();
    };
  }, [scrollContainerRef]);

  const navigateToSection = (id: string) => {
    const container = scrollContainerRef?.current;
    const target = document.getElementById(id);
    if (!target) return;

    setActiveSection(id);

    if (container) {
      const targetRect = target.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const scrollTarget = container.scrollTop + (targetRect.top - containerRect.top) - 16;
      container.scrollTo({
        top: Math.max(0, scrollTarget),
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    } else {
      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className={`sticky top-0 z-20 bg-[var(--surface-2)] border-b border-[var(--border)] px-4 sm:px-6 py-2.5 [@media(max-height:440px)]:py-1.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 sm:gap-3 ${className}`}>
      <nav
        aria-label="Resume interactive sections"
        className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5"
      >
        {RESUME_SECTIONS.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => navigateToSection(section.id)}
              aria-current={isActive ? "location" : undefined}
              className={`min-h-[36px] [@media(pointer:coarse)]:min-h-[44px] px-3 py-1.5 rounded-[6px] text-xs whitespace-nowrap transition-colors duration-150 cursor-pointer shrink-0 border ${
                isActive
                  ? "bg-[var(--accent-fill)] text-[var(--accent-contrast)] border-[var(--accent-fill)] font-bold"
                  : "bg-[var(--surface)] hover:bg-[var(--surface-3)] text-[var(--text-muted)] hover:text-[var(--text)] border-[var(--border)] font-medium"
              }`}
            >
              {section.label}
            </button>
          );
        })}
      </nav>

      {onSearchChange && (
        <div className="relative shrink-0 w-full md:w-56">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search resume (React, AI)..."
            aria-label="Filter resume content"
            className="w-full min-h-[44px] sm:min-h-[36px] bg-[var(--surface)] border border-[var(--border)] rounded-[6px] pl-3 pr-10 py-1.5 text-base sm:text-xs text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 [@media(pointer:coarse)]:w-10 [@media(pointer:coarse)]:h-10 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] text-xs cursor-pointer"
              aria-label="Clear filter"
            >
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ResumeSectionNav;
