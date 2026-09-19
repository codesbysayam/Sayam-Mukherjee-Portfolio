import React, { useState } from "react";
import { ChevronDown, List } from "lucide-react";

export interface TOCSection {
  id: string;
  title: string;
  number?: string;
}

interface LegalTableOfContentsProps {
  sections: TOCSection[];
  activeId: string;
  onSelectSection: (id: string) => void;
}

export const LegalTableOfContents: React.FC<LegalTableOfContentsProps> = ({
  sections,
  activeId,
  onSelectSection,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeItem = sections.find((s) => s.id === activeId) || sections[0];

  const handleItemClick = (id: string) => {
    onSelectSection(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Collapsible Navigation (Accordion before document) */}
      <div className="block lg:hidden w-full mb-8">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-2">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-full min-h-[44px] px-3.5 py-2.5 flex items-center justify-between text-left text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100 cursor-pointer rounded-lg hover:bg-zinc-200/50 dark:hover:bg-zinc-800/60 transition-colors"
            aria-expanded={mobileOpen}
            aria-controls="mobile-toc-dropdown"
          >
            <div className="flex items-center gap-2 truncate pr-2">
              <List className="w-4 h-4 text-zinc-400 shrink-0" />
              <span className="text-zinc-400 text-xs uppercase tracking-wider font-mono">
                On this page:
              </span>
              <span className="truncate font-medium text-zinc-800 dark:text-zinc-200">
                {activeItem ? activeItem.title : "Sections"}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform duration-200 ${
                mobileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {mobileOpen && (
            <nav
              id="mobile-toc-dropdown"
              aria-label="Table of contents (mobile)"
              className="mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-1 max-h-72 overflow-y-auto"
            >
              {sections.map((section) => {
                const isActive = activeId === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => handleItemClick(section.id)}
                    className={`w-full min-h-[44px] text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-center gap-2.5 cursor-pointer ${
                      isActive
                        ? "text-purple-600 dark:text-purple-400 bg-purple-500/10 font-semibold"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/40 dark:hover:bg-zinc-800/40"
                    }`}
                  >
                    {section.number && (
                      <span className="font-mono text-[11px] opacity-70 w-5">
                        {section.number}
                      </span>
                    )}
                    <span className="truncate">{section.title}</span>
                  </button>
                );
              })}
            </nav>
          )}
        </div>
      </div>

      {/* Desktop Static Sidebar Navigation (Fixed in document flow, not floating/moving with scroll) */}
      <aside className="hidden lg:block w-full pr-4 select-none">
        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-400 dark:text-zinc-500 mb-3 font-sans">
          On this page
        </div>

        <nav aria-label="Table of contents">
          <ul className="space-y-1 border-l border-zinc-200 dark:border-zinc-800/80 pl-0">
            {sections.map((section) => {
              const isActive = activeId === section.id;
              return (
                <li key={section.id}>
                  <button
                    onClick={() => onSelectSection(section.id)}
                    className={`group flex items-start w-full text-left py-1 text-[13px] leading-snug cursor-pointer relative pl-3 -ml-[1px] ${
                      isActive
                        ? "text-zinc-900 dark:text-zinc-100 font-medium"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                    }`}
                  >
                    {/* Active vertical accent bar */}
                    <span
                      className={`absolute left-0 top-1 bottom-1 w-[2px] rounded-full ${
                        isActive
                          ? "bg-purple-600 dark:bg-purple-400"
                          : "bg-transparent group-hover:bg-zinc-300 dark:group-hover:bg-zinc-700"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="break-words">{section.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default LegalTableOfContents;
