import React, { useState, useMemo, useEffect, useRef } from "react";
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
  Sparkles,
  RotateCcw,
} from "lucide-react";
import {
  FAQ_ITEMS,
  FAQ_CATEGORIES,
  FAQItem,
  FAQCategoryId,
} from "../data/faqData";

// Icon mapping helper for category tags
const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  academics: GraduationCap,
  projects: FolderGit2,
  skills: Cpu,
  architecture: GitBranch,
  career: Briefcase,
  contact: CheckCircle2,
};

export const ExpandableFAQ: React.FC = () => {
  // Active category filter: "all" or specific category ID
  const [selectedCategory, setSelectedCategory] = useState<FAQCategoryId>("all");

  // Search query
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Set of open item IDs (supports multiple open items)
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set(["faq-degree-university"]));

  // Check prefers-reduced-motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  // Filtered FAQ items based on category and search query
  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return FAQ_ITEMS.filter((item) => {
      // 1. Category matching
      if (selectedCategory !== "all" && item.categoryId !== selectedCategory) {
        return false;
      }

      // 2. Search query matching
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

  // Determine state of Expand / Collapse buttons
  const allVisibleOpen =
    visibleIds.length > 0 && visibleIds.every((id) => openIds.has(id));

  const someVisibleOpen =
    visibleIds.length > 0 && visibleIds.some((id) => openIds.has(id));

  // Toggle individual item
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

  // Expand all currently visible items
  const expandAll = () => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      visibleIds.forEach((id) => next.add(id));
      return next;
    });
  };

  // Collapse all currently visible items
  const collapseAll = () => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      visibleIds.forEach((id) => next.delete(id));
      return next;
    });
  };

  // Clear all filters
  const resetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
  };

  // Compute count for each category pill
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
      className="w-full py-12 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto"
    >
      {/* 1. SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-zinc-200/80 dark:border-white/[0.08] pb-6">
        <div className="space-y-2 max-w-2xl">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Answered</span>
          </div>

          {/* Heading */}
          <h2
            id="faq-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-zinc-900 dark:text-white tracking-tight leading-tight"
          >
            Engineering &amp; Portfolio FAQ
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans pt-0.5">
            Verified technical information addressing questions about Sayam&apos;s academic background, engineering initiatives, production architecture, and collaboration availability.
          </p>
        </div>

        {/* Global Expand / Collapse Action Controls */}
        <div className="flex items-center gap-2 self-start md:self-end shrink-0 text-xs font-mono">
          <button
            type="button"
            onClick={expandAll}
            disabled={filteredItems.length === 0 || allVisibleOpen}
            className="px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/80 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer font-medium shadow-xs"
            title="Expand all visible questions"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={collapseAll}
            disabled={filteredItems.length === 0 || !someVisibleOpen}
            className="px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/80 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer font-medium shadow-xs"
            title="Collapse all visible questions"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* 2. SEARCH AND FILTER CONTROLS */}
      <div className="space-y-4 mb-6">
        {/* Search Bar */}
        <div className="relative w-full">
          <label htmlFor="faq-search-input" className="sr-only">
            Search frequently asked questions
          </label>
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input
            id="faq-search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions by topic, technology, or system (e.g., OPERON, CGPA, GitHub, KIIT)..."
            className="w-full rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm font-sans bg-white dark:bg-zinc-900/90 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Clear FAQ search"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-mono font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase shrink-0 mr-1">
            Category:
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
                className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-mono transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-purple-600 text-white font-medium shadow-xs shadow-purple-500/25"
                    : "bg-zinc-100 hover:bg-zinc-200/80 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-white/[0.06]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-purple-500 dark:text-purple-400"}`} />
                <span>{cat.shortLabel}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-zinc-200/80 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Filter State & Result Count */}
        {(selectedCategory !== "all" || searchQuery) && (
          <div className="flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs font-mono">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-purple-700 dark:text-purple-300 font-medium">Filtering by:</span>
              {selectedCategory !== "all" && (
                <span className="px-2 py-0.5 rounded-md bg-purple-600 text-white font-semibold">
                  {FAQ_CATEGORIES.find((c) => c.id === selectedCategory)?.label}
                </span>
              )}
              {searchQuery && (
                <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-white dark:bg-zinc-700">
                  Query: &ldquo;{searchQuery}&rdquo;
                </span>
              )}
              <span className="text-zinc-500 dark:text-zinc-400">
                ({filteredItems.length} of {FAQ_ITEMS.length} questions visible)
              </span>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="text-purple-700 dark:text-purple-300 hover:underline shrink-0 font-medium cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. ACCORDION QUESTION LIST */}
      <div className="space-y-3" role="region" aria-label="Questions list">
        {filteredItems.map((item) => {
          const isOpen = openIds.has(item.id);
          const triggerId = `faq-trigger-${item.id}`;
          const panelId = `faq-panel-${item.id}`;
          const CategoryIcon = CATEGORY_ICONS[item.categoryId] || HelpCircle;

          return (
            <article
              key={item.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? "border-purple-500/50 dark:border-purple-500/40 bg-white dark:bg-[#121218]/95 shadow-sm"
                  : "border-zinc-200/90 dark:border-white/[0.08] bg-white/70 dark:bg-[#0e0e12]/85 hover:border-purple-500/30 dark:hover:border-purple-500/30"
              }`}
            >
              {/* Question Trigger Heading */}
              <h3 className="m-0 font-normal">
                <button
                  type="button"
                  id={triggerId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleItem(item.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-start sm:items-center justify-between gap-3.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-2xl group transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    {/* Category Icon Badge */}
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 border transition-colors mt-0.5 sm:mt-0 ${
                        isOpen
                          ? "bg-purple-500/15 border-purple-500/30 text-purple-600 dark:text-purple-400"
                          : "bg-zinc-100 dark:bg-white/[0.04] border-zinc-200 dark:border-white/[0.06] text-zinc-500 dark:text-zinc-400 group-hover:text-purple-600 dark:group-hover:text-purple-400"
                      }`}
                      aria-hidden="true"
                    >
                      <CategoryIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-purple-600 dark:text-purple-400 font-semibold block">
                        {item.categoryLabel}
                      </span>
                      <span className="text-sm sm:text-base font-semibold font-sans text-zinc-900 dark:text-zinc-100 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors leading-snug block">
                        {item.question}
                      </span>
                    </div>
                  </div>

                  {/* Circular Chevron Indicator */}
                  <span
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 border transition-transform duration-200 ${
                      isOpen
                        ? "bg-purple-600 border-purple-600 text-white rotate-180"
                        : "bg-zinc-100 dark:bg-white/[0.04] border-zinc-200 dark:border-white/[0.08] text-zinc-400 dark:text-zinc-500 group-hover:border-purple-400 group-hover:text-purple-600 dark:group-hover:text-purple-400"
                    }`}
                    aria-hidden="true"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>
              </h3>

              {/* Collapsible Answer Panel */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    initial={prefersReducedMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
                    animate={prefersReducedMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 sm:px-6 sm:pb-5 pt-3 border-t border-zinc-100 dark:border-white/[0.06] text-xs sm:text-sm leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </article>
          );
        })}
      </div>

      {/* 4. EMPTY SEARCH RESULTS STATE */}
      {filteredItems.length === 0 && (
        <div
          role="status"
          className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-8 sm:p-12 text-center space-y-4"
        >
          <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-400">
            <Search className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-mono font-bold tracking-wider text-zinc-800 dark:text-zinc-200">
              No matching questions found
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
              We couldn&apos;t find any questions matching &ldquo;{searchQuery}&rdquo;. Try another technical keyword or clear your active filters.
            </p>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="btn btn-secondary !py-2 !px-4 !text-xs mx-auto cursor-pointer font-mono"
          >
            Clear Filters &amp; Search
          </button>
        </div>
      )}
    </section>
  );
};

export default ExpandableFAQ;
