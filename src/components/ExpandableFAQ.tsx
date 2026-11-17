import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  HelpCircle,
  Search,
  X,
  ChevronDown,
  GraduationCap,
  FolderGit2,
  Cpu,
  GitBranch,
  Briefcase,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import {
  FAQ_ITEMS,
  FAQ_CATEGORIES,
  FAQCategoryId,
} from "../data/faqData";
import { EditorialReveal, LineReveal } from "../motion/Reveal";
import {
  MOTION_DURATION,
  MOTION_EASE,
  usePrefersReducedMotion,
} from "../motion/tokens";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  academics: GraduationCap,
  projects: FolderGit2,
  skills: Cpu,
  architecture: GitBranch,
  career: Briefcase,
  contact: CheckCircle2,
};

const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const ExpandableFAQ: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<FAQCategoryId>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set(["faq-degree-university"])
  );
  const prefersReducedMotion = usePrefersReducedMotion();

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return FAQ_ITEMS.filter((item) => {
      if (selectedCategory !== "all" && item.categoryId !== selectedCategory) {
        return false;
      }
      if (!query) return true;

      const searchableText = [
        item.question,
        item.plainTextAnswer,
        item.categoryLabel,
        ...item.keywords,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [selectedCategory, searchQuery]);

  const visibleIds = useMemo(() => filteredItems.map((item) => item.id), [filteredItems]);

  const allVisibleOpen =
    visibleIds.length > 0 && visibleIds.every((id) => openIds.has(id));
  const someVisibleOpen =
    visibleIds.length > 0 && visibleIds.some((id) => openIds.has(id));

  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      visibleIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const collapseAll = () => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      visibleIds.forEach((id) => next.delete(id));
      return next;
    });
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: FAQ_ITEMS.length };
    FAQ_ITEMS.forEach((item) => {
      counts[item.categoryId] = (counts[item.categoryId] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <section
      id="faq-section"
      aria-labelledby="faq-heading"
      className="w-full py-12 sm:py-16 pb-20 sm:pb-24 max-w-5xl mx-auto"
    >
      {/* SECTION HEADER */}
      <EditorialReveal>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 pb-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.12em] text-[var(--accent)] font-semibold">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Frequently Answered · Index</span>
            </div>

            <h2
              id="faq-heading"
              className="text-2xl sm:text-4xl font-extrabold font-display text-[var(--text)] tracking-tight leading-[1.08]"
            >
              Engineering &amp; Portfolio{" "}
              <span className="font-serif-editorial italic font-normal text-[var(--accent)]">
                FAQ
              </span>
            </h2>

            <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed font-sans pt-0.5">
              Verified technical details addressing Sayam&apos;s academic track, production systems, architecture patterns, and collaboration availability.
            </p>
          </div>

          {/* Global Expand / Collapse Controls */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-end shrink-0 text-xs font-mono">
            <button
              type="button"
              onClick={expandAll}
              disabled={filteredItems.length === 0 || allVisibleOpen}
              className="min-h-[40px] px-4 py-2 rounded-[6px] border border-[var(--border-strong)] bg-transparent hover:bg-[var(--text)] hover:text-[var(--bg)] active:scale-[0.97] active:bg-[var(--surface-3)] active:text-[var(--text)] text-[var(--text)] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer font-semibold"
              title="Expand all visible questions"
            >
              Expand All
            </button>
            <button
              type="button"
              onClick={collapseAll}
              disabled={filteredItems.length === 0 || !someVisibleOpen}
              className="min-h-[40px] px-4 py-2 rounded-[6px] border border-[var(--border-strong)] bg-transparent hover:bg-[var(--text)] hover:text-[var(--bg)] active:scale-[0.97] active:bg-[var(--surface-3)] active:text-[var(--text)] text-[var(--text)] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer font-semibold"
              title="Collapse all visible questions"
            >
              Collapse All
            </button>
          </div>
        </div>
        <LineReveal className="mb-8" />
      </EditorialReveal>

      {/* SEARCH AND CATEGORY FILTERS */}
      <div className="space-y-4 mb-6">
        <div className="relative w-full">
          <label htmlFor="faq-search-input" className="sr-only">
            Search frequently asked questions
          </label>
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)] pointer-events-none" />
          <input
            id="faq-search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions by topic, technology, or system (e.g., OPERON, CGPA, GitHub, KIIT)..."
            className="w-full rounded-[6px] pl-10 pr-11 py-3 text-base sm:text-sm font-sans bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--text)] focus:ring-2 focus:ring-[#C7E34A]/50 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded text-[var(--text-faint)] hover:text-[var(--text)] active:scale-[0.92] transition-all cursor-pointer"
              aria-label="Clear FAQ search"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Clean Tab-Line Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-mono font-semibold tracking-wider text-[var(--text-faint)] uppercase shrink-0 mr-1">
            Filter:
          </span>
          {FAQ_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const Icon = cat.icon;
            const count = categoryCounts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 min-h-[40px] sm:min-h-[36px] py-1.5 px-3 rounded-[6px] text-xs font-mono transition-all shrink-0 cursor-pointer border active:scale-[0.96] ${
                  isSelected
                    ? "bg-[#C7E34A] border-[#C7E34A] text-[#20231D] font-bold"
                    : "bg-transparent hover:bg-[var(--surface)] active:bg-[var(--surface-3)] text-[var(--text-muted)] hover:text-[var(--text)] border-[var(--border)]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.shortLabel}</span>
                <span
                  className={`text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded ${
                    isSelected
                      ? "bg-[#20231D]/15 text-[#20231D]"
                      : "bg-[var(--surface)] text-[var(--text-faint)]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {(selectedCategory !== "all" || searchQuery) && (
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: MOTION_DURATION.fast, ease: MOTION_EASE.out }}
              className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-[6px] bg-[var(--surface)] border border-[var(--border-strong)] text-xs font-mono"
            >
              <div className="flex items-center gap-2 flex-wrap text-[var(--text-secondary)]">
                <span className="font-semibold text-[var(--text)]">Active filter:</span>
                {selectedCategory !== "all" && (
                  <span className="px-2 py-0.5 rounded bg-[#20231D] text-[#F4F4ED] dark:bg-[#C7E34A] dark:text-[#20231D] font-semibold">
                    {FAQ_CATEGORIES.find((c) => c.id === selectedCategory)?.label}
                  </span>
                )}
                {searchQuery && (
                  <span className="px-2 py-0.5 rounded border border-[var(--border-strong)] bg-[var(--surface-2)]">
                    &ldquo;{searchQuery}&rdquo;
                  </span>
                )}
                <span className="text-[var(--text-muted)] tabular-nums">
                  ({filteredItems.length} of {FAQ_ITEMS.length})
                </span>
              </div>

              <button
                type="button"
                onClick={resetFilters}
                className="text-[var(--text)] hover:underline shrink-0 font-semibold cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ACCORDION QUESTION LIST WITH SMOOTH HEIGHT & OPACITY ANIMATION */}
      <div className="space-y-3" role="region" aria-label="Questions list">
        {filteredItems.map((item) => {
          const isOpen = openIds.has(item.id);
          const triggerId = `faq-trigger-${item.id}`;
          const panelId = `faq-panel-${item.id}`;
          const CategoryIcon = CATEGORY_ICONS[item.categoryId] || HelpCircle;

          return (
            <article
              key={item.id}
              className={`rounded-[10px] border transition-colors duration-200 overflow-hidden ${
                isOpen
                  ? "border-[var(--text)] bg-[var(--surface-2)] shadow-[var(--shadow)]"
                  : "border-[var(--border)] bg-[var(--surface-2)]/70 hover:border-[var(--border-strong)]"
              }`}
            >
              <h3 className="m-0 font-normal">
                <button
                  type="button"
                  id={triggerId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleItem(item.id)}
                  className="w-full text-left min-h-[56px] p-4 sm:p-5 flex items-start sm:items-center justify-between gap-3.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C7E34A] rounded-[10px] group transition-all active:bg-[var(--surface)] active:scale-[0.995]"
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-[6px] flex items-center justify-center shrink-0 border transition-colors mt-0.5 sm:mt-0 ${
                        isOpen
                          ? "bg-[#C7E34A] border-[#C7E34A] text-[#20231D]"
                          : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] group-hover:text-[var(--text)]"
                      }`}
                      aria-hidden="true"
                    >
                      <CategoryIcon className="w-4 h-4" />
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[11px] font-mono uppercase tracking-[0.08em] text-[var(--accent)] font-semibold block">
                        {item.categoryLabel}
                      </span>
                      <span className="text-sm sm:text-base font-bold font-sans text-[var(--text)] leading-snug block">
                        {item.question}
                      </span>
                    </div>
                  </div>

                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { duration: MOTION_DURATION.normal, ease: EDITORIAL_EASE }
                    }
                    className={`w-8 h-8 rounded-[6px] flex items-center justify-center shrink-0 border transition-colors ${
                      isOpen
                        ? "bg-[#20231D] border-[#20231D] text-[#F4F4ED] dark:bg-[#C7E34A] dark:border-[#C7E34A] dark:text-[#20231D]"
                        : "bg-transparent border-[var(--border)] text-[var(--text-muted)] group-hover:border-[var(--border-strong)] group-hover:text-[var(--text)]"
                    }`}
                    aria-hidden="true"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.span>
                </button>
              </h3>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    initial={
                      prefersReducedMotion
                        ? { opacity: 1, height: "auto" }
                        : { height: 0, opacity: 0 }
                    }
                    animate={
                      prefersReducedMotion
                        ? { opacity: 1, height: "auto" }
                        : {
                            height: "auto",
                            opacity: 1,
                            transition: {
                              height: { duration: 0.32, ease: MOTION_EASE.out },
                              opacity: { duration: MOTION_DURATION.normal, delay: 0.04, ease: MOTION_EASE.out },
                            },
                          }
                    }
                    exit={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : {
                            height: 0,
                            opacity: 0,
                            transition: {
                              height: { duration: MOTION_DURATION.normal, ease: MOTION_EASE.out },
                              opacity: { duration: MOTION_DURATION.fast, ease: MOTION_EASE.standard },
                            },
                          }
                    }
                    style={{ overflow: "hidden" }}
                  >
                    <div className="px-4 pb-5 sm:px-6 sm:pb-6 pt-3.5 border-t border-[var(--border)] text-sm leading-relaxed text-[var(--text-secondary)]">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </article>
          );
        })}
      </div>

      {/* EMPTY SEARCH RESULTS STATE */}
      {filteredItems.length === 0 && (
        <div
          role="status"
          className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-12 text-center space-y-4"
        >
          <div className="w-11 h-11 rounded-[6px] mx-auto flex items-center justify-center border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)]">
            <Search className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-mono font-bold tracking-wider uppercase text-[var(--text)]">
              No matching questions found
            </h3>
            <p className="text-sm text-[var(--text-muted)] max-w-sm mx-auto">
              No questions matched &ldquo;{searchQuery}&rdquo;. Try another keyword or clear active filters.
            </p>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="btn btn-secondary text-xs mx-auto font-mono"
          >
            Clear Filters &amp; Search
          </button>
        </div>
      )}
    </section>
  );
};

export default ExpandableFAQ;
