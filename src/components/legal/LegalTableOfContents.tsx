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
      className="w-full my-8 sm:my-10 p-5 sm:p-7 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/40 select-none transition-colors"
    >
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-400 dark:text-zinc-500 mb-4 font-sans">
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
              className="group flex items-baseline gap-2.5 py-1 text-xs sm:text-[13px] text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            >
              {section.number && (
                <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 shrink-0 select-none group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
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
