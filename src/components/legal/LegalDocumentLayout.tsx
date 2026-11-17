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

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
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
    <div className="w-full min-h-screen select-text font-sans bg-[var(--bg)] text-[var(--text)] transition-colors duration-200">
      <div
        className="w-full mx-auto px-[var(--page-gutter,16px)] pt-6 sm:pt-10 pb-[calc(6rem+env(safe-area-inset-bottom,0px))]"
        style={{ maxWidth: "min(100%, 920px)" }}
      >
        {onNavigateHome && (
          <div className="mb-6 sm:mb-8">
            <button
              type="button"
              onClick={onNavigateHome}
              className="btn btn-ghost px-3 -ml-3 text-xs sm:text-sm"
              aria-label="Return to portfolio home"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>Back to Portfolio</span>
            </button>
          </div>
        )}

        <header className="pb-8 sm:pb-10 border-b border-[var(--border)]">
          <div className="space-y-4 max-w-[780px]">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
              <span>{eyebrow}</span>
              <span className="text-[var(--text-faint)] select-none" aria-hidden="true">/</span>
              <span className="text-[var(--text-muted)] font-sans normal-case tracking-normal font-medium">
                Official Document
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text)] font-display leading-[1.08]">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[var(--text-muted)] font-mono pt-1">
              <span>Last updated: {lastUpdated}</span>
              <span className="select-none text-[var(--text-faint)]" aria-hidden="true">/</span>
              <span>Direct Section Anchors</span>
            </div>

            <p className="text-base sm:text-lg leading-relaxed text-[var(--text-secondary)] pt-2 font-sans">
              {intro}
            </p>
          </div>
        </header>

        <section
          aria-label="Table of contents"
          className="card my-8 sm:my-10 p-5 sm:p-7"
        >
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)] font-mono tabular-nums">
              Contents ({sections.length} Sections)
            </span>

            <button
              type="button"
              onClick={() => setIsMobileTocExpanded(!isMobileTocExpanded)}
              className="sm:hidden inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] p-1 min-h-[44px] cursor-pointer"
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

          <nav
            aria-label="On this page quick links"
            className={`mt-4 pt-4 border-t border-[var(--border)] ${
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
                      className={`group flex items-baseline gap-2.5 py-1.5 px-2.5 -mx-2 rounded-[6px] text-xs sm:text-[13px] transition-colors cursor-pointer min-h-[40px] ${
                        isActive
                          ? "bg-[var(--surface)] text-[var(--text)] font-bold"
                          : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]/70"
                      }`}
                    >
                      {section.number && (
                        <span
                          className={`font-mono text-[11px] shrink-0 select-none tabular-nums ${
                            isActive
                              ? "text-[var(--accent)] font-bold"
                              : "text-[var(--text-faint)] group-hover:text-[var(--accent)]"
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

        <article className="min-w-0 w-full space-y-8 sm:space-y-12">
          {children}
        </article>

        <LegalFooter
          onNavigateHome={onNavigateHome}
          onNavigateTab={onNavigateTab}
        />
      </div>

      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom,1.5rem))] right-[max(1rem,env(safe-area-inset-right,1rem))] z-40 p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-[6px] bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--text)] shadow-md hover:bg-[var(--text)] hover:text-[var(--bg)] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C7E34A]"
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
