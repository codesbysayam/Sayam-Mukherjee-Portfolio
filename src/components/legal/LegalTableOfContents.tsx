import React from "react";

export interface TOCSection {
  id: string;
  title: string;
  number?: string;
}

interface LegalTableOfContentsProps {
  sections: TOCSection[];
  onSelectSection: (id: string) => void;
}

export const LegalTableOfContents: React.FC<LegalTableOfContentsProps> = ({
  sections,
  onSelectSection,
}) => {
  return (
    <nav
      aria-label="On this page navigation"
      className="card w-full my-8 sm:my-10 p-5 sm:p-7 select-none"
    >
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)] mb-4 font-mono">
        On this page
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              onClick={(e) => {
                e.preventDefault();
                onSelectSection(section.id);
              }}
              className="group flex items-baseline gap-2.5 py-1 text-xs sm:text-[13px] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
            >
              {section.number && (
                <span className="font-mono text-[11px] text-[var(--text-faint)] shrink-0 select-none tabular-nums group-hover:text-[var(--accent)] transition-colors">
                  {section.number}
                </span>
              )}
              <span className="break-words group-hover:underline underline-offset-4 leading-snug">
                {section.title}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default LegalTableOfContents;
