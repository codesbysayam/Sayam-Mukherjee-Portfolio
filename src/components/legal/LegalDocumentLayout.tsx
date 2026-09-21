import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowUp, ChevronDown, ChevronUp } from "lucide-react";
import LegalFooter from "./LegalFooter";

export interface TOCSection {
  id: string;
  title: string;
  number?: string;
}

export interface LegalDocumentLayoutProps {
  eyebrow?: string;
  title: string;
  lastUpdated: string;
  intro: string;
  sections: TOCSection[];
  children: React.ReactNode;
  onNavigateHome?: () => void;
  onNavigateTab?: (tab: "privacy" | "terms" | "contact" | "home") => void;
}

export const LegalDocumentLayout: React.FC<LegalDocumentLayoutProps> = ({
  eyebrow = "LEGAL",
  title,
  lastUpdated,
  intro,
  sections,
  children,
  onNavigateHome,
  onNavigateTab,
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string>(
    sections[0]?.id || ""
  );
  const [isMobileTocExpanded, setIsMobileTocExpanded] = useState<boolean>(false);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  // URL Hash support on mount & hashchange for direct linking
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash && sections.some((s) => s.id === hash)) {
        const el = document.getElementById(hash);
        if (el) {
          const prefersReduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches;
          el.scrollIntoView({
            behavior: prefersReduced ? "auto" : "smooth",
            block: "start",
          });
          setActiveSectionId(hash);
        }
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [sections]);

  // Active section tracking via IntersectionObserver
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Find visible section closest to top of viewport
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top) -
              Math.abs(b.boundingClientRect.top)
          );

        if (visible.length > 0) {
          setActiveSectionId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 1],
      }
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  // Scroll listener for "Back to top" button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSelectSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      el.scrollIntoView({
        behavior: prefersReduced ? "auto" : "smooth",
        block: "start",
      });
      setActiveSectionId(id);
      setIsMobileTocExpanded(false);
      if (window.history.pushState) {
        window.history.pushState(null, "", `#${id}`);
      }
    }
  };

  const scrollToTop = () => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? "auto" : "smooth",
    });
  };

  return (
    <div className="w-full min-h-screen select-text font-sans bg-[#FAFAFC] dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <div
        className="w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-20"
        style={{ maxWidth: "min(100% - 2rem, 920px)" }}
      >
        {/* Navigation Breadcrumb / Return */}
        {onNavigateHome && (
          <div className="mb-6 sm:mb-8">
            <button
              type="button"
              onClick={onNavigateHome}
              className="group inline-flex items-center gap-2 min-h-[44px] px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-850 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              aria-label="Return to portfolio home"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Portfolio</span>
            </button>
          </div>
        )}

        {/* Editorial Document Header */}
        <header className="pb-8 sm:pb-10 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div className="space-y-4 max-w-[780px]">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              <span>{eyebrow}</span>
              <span className="text-zinc-300 dark:text-zinc-700 select-none">·</span>
              <span className="text-zinc-500 dark:text-zinc-400 font-sans normal-case tracking-normal">
                Official Document
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 font-display leading-[1.12]">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 pt-1">
              <span>Last updated: {lastUpdated}</span>
              <span className="select-none text-zinc-300 dark:text-zinc-700">·</span>
              <span>Direct Link Support</span>
              <span className="select-none text-zinc-300 dark:text-zinc-700">·</span>
              <span>Fully Synchronous</span>
            </div>

            <p className="text-base sm:text-lg leading-relaxed text-zinc-700 dark:text-zinc-300 pt-2 font-sans">
              {intro}
            </p>
          </div>
        </header>

        {/* Professional Editorial Table of Contents */}
        <section
          aria-label="Table of contents"
          className="my-8 sm:my-10 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/60 p-5 sm:p-7 shadow-xs backdrop-blur-xs transition-colors"
        >
          {/* Header & Mobile Toggle */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
                Contents ({sections.length} Sections)
              </span>
            </div>

            {/* Mobile Expand / Collapse Trigger */}
            <button
              type="button"
              onClick={() => setIsMobileTocExpanded(!isMobileTocExpanded)}
              className="sm:hidden inline-flex items-center gap-1.5 text-xs font-medium text-purple-600 dark:text-purple-400 p-1 min-h-[44px] cursor-pointer"
              aria-expanded={isMobileTocExpanded}
            >
              <span>{isMobileTocExpanded ? "Hide" : "Show All"}</span>
              {isMobileTocExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Table of Contents Grid */}
          <nav
            aria-label="On this page quick links"
            className={`mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 ${
              isMobileTocExpanded ? "block" : "hidden sm:block"
            }`}
          >
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              {sections.map((section) => {
                const isActive = activeSectionId === section.id;
                return (
                  <li key={section.id} className="min-w-0">
                    <a
                      href={`#${section.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelectSection(section.id);
                      }}
                      className={`group flex items-baseline gap-2.5 py-1.5 px-2 -mx-2 rounded-lg text-xs sm:text-[13px] transition-colors cursor-pointer min-h-[40px] ${
                        isActive
                          ? "bg-purple-50/80 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 font-semibold"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/40"
                      }`}
                    >
                      {section.number && (
                        <span
                          className={`font-mono text-[11px] shrink-0 select-none ${
                            isActive
                              ? "text-purple-600 dark:text-purple-400 font-bold"
                              : "text-zinc-400 dark:text-zinc-500 group-hover:text-purple-600 dark:group-hover:text-purple-400"
                          }`}
                        >
                          {section.number}
                        </span>
                      )}
                      <span className="truncate leading-snug">
                        {section.title}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </section>

        {/* Editorial Document Body */}
        <article className="min-w-0 w-full space-y-8 sm:space-y-12">
          {children}
        </article>

        {/* Stationary Editorial Legal Footer */}
        <LegalFooter
          onNavigateHome={onNavigateHome}
          onNavigateTab={onNavigateTab}
        />
      </div>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 shadow-lg hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          title="Scroll back to top"
          aria-label="Scroll back to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default LegalDocumentLayout;
