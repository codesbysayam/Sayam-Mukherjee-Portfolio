import React, { useEffect, useState, useRef } from "react";
import LegalHeader from "./LegalHeader";
import LegalTableOfContents, { TOCSection } from "./LegalTableOfContents";
import LegalFooter from "./LegalFooter";

interface LegalLayoutProps {
  eyebrow?: string;
  title: string;
  lastUpdated: string;
  intro: string;
  sections: TOCSection[];
  children: React.ReactNode;
  onNavigateHome?: () => void;
  onNavigateTab?: (tab: "privacy" | "terms" | "contact") => void;
}

export const LegalLayout: React.FC<LegalLayoutProps> = ({
  eyebrow = "LEGAL",
  title,
  lastUpdated,
  intro,
  sections,
  children,
  onNavigateHome,
  onNavigateTab,
}) => {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || "");
  const isUserScrollingRef = useRef(false);

  // URL Hash support on mount & hashchange
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash && sections.some((s) => s.id === hash)) {
        setActiveId(hash);
        const el = document.getElementById(hash);
        if (el) {
          const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
        }
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [sections]);

  // IntersectionObserver to highlight active section without per-frame state
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isUserScrollingRef.current) return;
        // Find visible section closest to top
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          const topEntry = visibleEntries.reduce((prev, curr) =>
            prev.boundingClientRect.top < curr.boundingClientRect.top ? prev : curr
          );
          if (topEntry.target.id) {
            setActiveId(topEntry.target.id);
          }
        }
      },
      {
        rootMargin: "-100px 0px -50% 0px",
        threshold: [0, 0.1, 0.5],
      }
    );

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const handleSelectSection = (id: string) => {
    setActiveId(id);
    const el = document.getElementById(id);
    if (el) {
      isUserScrollingRef.current = true;
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
      if (window.history.pushState) {
        window.history.pushState(null, "", `#${id}`);
      }
      setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 600);
    }
  };

  return (
    <div className="w-full min-h-screen legal-document-shell select-text font-sans bg-[#F7F7F8] dark:bg-[#09090B] text-[#18181B] dark:text-[#F5F5F7] transition-colors duration-200">
      <div className="w-full max-w-[1180px] mx-auto px-[max(20px,env(safe-area-inset-left))] sm:px-8 pt-6 sm:pt-10 pb-16">
        {/* Dedicated Legal Header */}
        <LegalHeader
          eyebrow={eyebrow}
          title={title}
          lastUpdated={lastUpdated}
          intro={intro}
          onNavigateHome={onNavigateHome}
        />

        {/* Two-column layout on Desktop, Single column on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] gap-8 lg:gap-14 items-start mt-8 sm:mt-12">
          {/* Left Column: Table of Contents */}
          <LegalTableOfContents
            sections={sections}
            activeId={activeId}
            onSelectSection={handleSelectSection}
          />

          {/* Right Column: Actual Document Body constrained to 780px */}
          <article className="min-w-0 max-w-[780px] w-full space-y-6 sm:space-y-8">
            {children}
          </article>
        </div>

        {/* Compact, Restrained Legal Footer */}
        <LegalFooter
          onNavigateHome={onNavigateHome}
          onNavigateTab={onNavigateTab}
        />
      </div>
    </div>
  );
};

export default LegalLayout;
