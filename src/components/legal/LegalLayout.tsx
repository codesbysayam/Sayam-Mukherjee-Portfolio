import React, { useEffect } from "react";
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
  onNavigateTab?: (tab: "privacy" | "terms" | "contact" | "home") => void;
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
  // URL Hash support on mount & hashchange for direct linking
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash && sections.some((s) => s.id === hash)) {
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

  const handleSelectSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
      if (window.history.pushState) {
        window.history.pushState(null, "", `#${id}`);
      }
    }
  };

  return (
    <div className="w-full min-h-screen legal-document-shell select-text font-sans bg-[#F7F7F8] dark:bg-[#09090B] text-[#18181B] dark:text-[#F5F5F7] transition-colors duration-200">
      <div className="w-full max-w-[780px] mx-auto px-[max(20px,env(safe-area-inset-left))] sm:px-6 pt-6 sm:pt-10 pb-16">
        {/* Dedicated Legal Header */}
        <LegalHeader
          eyebrow={eyebrow}
          title={title}
          lastUpdated={lastUpdated}
          intro={intro}
          onNavigateHome={onNavigateHome}
        />

        {/* Stationary "On this page" directory (Not moveable, fully static within document flow) */}
        <LegalTableOfContents
          sections={sections}
          onSelectSection={handleSelectSection}
        />

        {/* Actual Document Body constrained to 780px */}
        <article className="min-w-0 w-full space-y-6 sm:space-y-8">
          {children}
        </article>

        {/* Compact, Restrained Editorial Legal Footer */}
        <LegalFooter
          onNavigateHome={onNavigateHome}
          onNavigateTab={onNavigateTab}
        />
      </div>
    </div>
  );
};

export default LegalLayout;
