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

  // Track active section as modal container scrolls
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
    <div className={`sticky top-0 z-20 backdrop-blur-md bg-zinc-950/90 border-b border-zinc-900/80 px-4 sm:px-6 py-2.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 ${className}`}>
      {/* Horizontally scrollable navigation tabs */}
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
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 cursor-pointer shrink-0 border ${
                isActive
                  ? "bg-purple-500/15 text-purple-300 border-purple-500/40 shadow-xs font-semibold"
                  : "bg-zinc-900/50 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 border-zinc-800/60"
              }`}
            >
              {section.label}
            </button>
          );
        })}
      </nav>

      {/* In-viewer fast filter/search input */}
      {onSearchChange && (
        <div className="relative shrink-0 w-full md:w-56">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search resume (e.g. React, AI)..."
            aria-label="Filter resume content"
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs px-1"
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
