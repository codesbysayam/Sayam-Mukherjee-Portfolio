import React, { useMemo, useState } from "react";
import {
  ENGINEERING_STACK_CATEGORIES,
  TOTAL_VERIFIED_TECHNOLOGIES,
  type TechnologyItem,
} from "../../data/skills";
import { PROJECTS, type ProjectItem } from "../../data/projects";
import {
  Code2,
  Layout,
  Database,
  ScanEye,
  Wrench,
  Cpu,
  CheckCircle2,
  Search,
  RotateCcw,
  ExternalLink,
  ArrowUpRight,
  FolderGit2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { EditorialReveal } from "../../motion/Reveal";
import { MOTION_DURATION, MOTION_EASE, usePrefersReducedMotion } from "../../motion/tokens";

interface EngineeringStackSectionProps {
  selectedTech?: string | null;
  onSelectTech?: (tech: string | null) => void;
  onNavigateToProject?: (projectId: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  languages: <Code2 className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />,
  frontend: <Layout className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />,
  "backend-data": <Database className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />,
  "ml-cv": <ScanEye className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />,
  tools: <Wrench className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />,
  "core-cs": <Cpu className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />,
};

const SCOPE_LABELS: Record<TechnologyItem["evidenceScope"], string> = {
  project: "Verified in Shipped Projects",
  repository: "Verified in Public Repositories",
  coursework: "Academic Coursework (KIIT CSE)",
  toolchain: "Active Engineering Toolchain",
};

export function EngineeringStackSection({
  selectedTech,
  onSelectTech,
  onNavigateToProject,
}: EngineeringStackSectionProps) {
  const reduced = usePrefersReducedMotion();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ENGINEERING_STACK_CATEGORIES.filter(
      (grp) => activeCategory === "all" || grp.id === activeCategory
    )
      .map((grp) => {
        if (!q) return grp;
        const categoryMatches =
          grp.category.toLowerCase().includes(q) ||
          grp.label.toLowerCase().includes(q) ||
          grp.description.toLowerCase().includes(q);

        const matchingItems = categoryMatches
          ? grp.items
          : grp.items.filter(
              (item) =>
                item.name.toLowerCase().includes(q) ||
                item.evidenceSummary.toLowerCase().includes(q)
            );

        return {
          ...grp,
          items: matchingItems,
          skills: matchingItems.map((i) => i.name),
        };
      })
      .filter((grp) => grp.items.length > 0);
  }, [activeCategory, searchQuery]);

  const visibleCount = useMemo(
    () => filteredGroups.reduce((sum, g) => sum + g.items.length, 0),
    [filteredGroups]
  );

  const selectedDetail = useMemo(() => {
    if (!selectedTech) return null;
    const normalized = selectedTech.trim().toLowerCase();
    for (const grp of ENGINEERING_STACK_CATEGORIES) {
      const match = grp.items.find((item) => item.name.toLowerCase() === normalized);
      if (match) {
        const projects: ProjectItem[] = match.evidenceProjects
          .map((pid) => PROJECTS.find((p) => p.id === pid))
          .filter((p): p is ProjectItem => Boolean(p));
        return { group: grp, item: match, projects };
      }
    }
    return null;
  }, [selectedTech]);

  const hasActiveFilter = activeCategory !== "all" || searchQuery.trim().length > 0 || Boolean(selectedTech);

  const handleResetFilters = () => {
    setActiveCategory("all");
    setSearchQuery("");
    onSelectTech?.(null);
  };

  return (
    <section id="engineering-stack" className="technology-ledger space-y-6">
      <EditorialReveal className="space-y-2.5">
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-[var(--text-muted)]">
          <span className="font-semibold uppercase tracking-wider text-[var(--accent)]">
            Engineering Stack
          </span>
          <span className="hidden sm:inline" aria-hidden="true">·</span>
          <span className="hidden sm:inline uppercase tracking-wider">
            Verified Technologies &amp; Foundations
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)] font-display">
            CORE TECHNOLOGIES &amp; ENGINEERING DOMAINS
          </h2>
          <span className="text-xs font-mono text-[var(--text-muted)] tabular-nums">
            {ENGINEERING_STACK_CATEGORIES.length} Disciplines · {TOTAL_VERIFIED_TECHNOLOGIES} Verified Technologies
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-3xl font-sans leading-relaxed">
          Technology ledger organized strictly around audited repositories, deployed applications, and B.Tech Computer Science coursework. Select any chip below to inspect linked project evidence and sync the architecture map.
        </p>
      </EditorialReveal>

      {/* Search & Category Filter Controls */}
      <div className="card p-4 space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search
              className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter technologies (e.g., FastAPI, ByteTrack, PostgreSQL)…"
              aria-label="Filter technologies"
              className="w-full min-h-[40px] pl-9 pr-3 py-2 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] text-xs font-mono text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 text-xs font-mono text-[var(--text-muted)] tabular-nums">
            <span>
              Showing {visibleCount} of {TOTAL_VERIFIED_TECHNOLOGIES} verified entries
            </span>
            {hasActiveFilter && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--accent)] cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        <div
          className="flex flex-wrap items-center gap-1.5"
          role="group"
          aria-label="Filter technologies by engineering discipline"
        >
          <button
            type="button"
            aria-pressed={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
            className={`px-3 py-1.5 rounded-[6px] text-xs font-mono border transition-colors cursor-pointer ${
              activeCategory === "all"
                ? "bg-[var(--accent-fill)] text-[var(--accent-contrast)] border-[var(--accent-fill)] font-semibold"
                : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text)] hover:border-[var(--border-strong)]"
            }`}
          >
            All Disciplines ({TOTAL_VERIFIED_TECHNOLOGIES})
          </button>

          {ENGINEERING_STACK_CATEGORIES.map((grp) => {
            const isActive = activeCategory === grp.id;
            return (
              <button
                key={grp.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveCategory(isActive ? "all" : grp.id)}
                className={`px-3 py-1.5 rounded-[6px] text-xs font-mono border transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[var(--accent-fill)] text-[var(--accent-contrast)] border-[var(--accent-fill)] font-semibold"
                    : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text)] hover:border-[var(--border-strong)]"
                }`}
              >
                {grp.code} · {grp.label} ({grp.items.length})
              </button>
            );
          })}
        </div>
      </div>

      {/* Inline Verified Project Evidence Panel */}
      <AnimatePresence mode="wait" initial={false}>
      {selectedDetail && (
        <motion.div
          key={selectedDetail.item.id}
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: reduced ? 0 : MOTION_DURATION.fast, ease: MOTION_EASE.out }}
          className="card p-5 space-y-4 border border-[var(--accent)] bg-[var(--surface-2)]"
          role="region"
          aria-label={`Verified evidence for ${selectedDetail.item.name}`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-[var(--border)]">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[var(--accent)]">
                <span className="font-semibold uppercase tracking-wider">
                  {selectedDetail.group.category}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-[var(--text-muted)]">
                  {SCOPE_LABELS[selectedDetail.item.evidenceScope]}
                </span>
              </div>
              <h3 className="text-lg font-bold font-display text-[var(--text)]">
                {selectedDetail.item.name}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans leading-relaxed max-w-3xl">
                {selectedDetail.item.evidenceSummary}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onSelectTech?.(null)}
              aria-label={`Close ${selectedDetail.item.name} evidence panel`}
              className="p-2 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {selectedDetail.projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedDetail.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-3.5 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold font-display text-[var(--text)]">
                        {proj.title}
                      </span>
                      <span className="text-[11px] font-mono text-[var(--accent)]">
                        {proj.categoryLabel}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                      {proj.shortDescription}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <div className="flex flex-wrap items-center gap-3">
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--accent)] underline"
                      >
                        <FolderGit2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{proj.githubRepoName || proj.repository}</span>
                      </a>
                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--accent)] underline"
                        >
                          <span>Live</span>
                          <ExternalLink className="w-3 h-3" aria-hidden="true" />
                        </a>
                      )}
                    </div>

                    {onNavigateToProject && (
                      <button
                        type="button"
                        onClick={() => onNavigateToProject(proj.id)}
                        className="inline-flex items-center gap-1 text-[var(--accent)] font-semibold hover:underline cursor-pointer"
                      >
                        <span>Inspect Project</span>
                        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3.5 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] text-xs font-sans text-[var(--text-secondary)]">
              Verified academic engineering foundation at KIIT University (B.Tech CSE) rather than a standalone deployed web repository.
            </div>
          )}
        </motion.div>
      )}
      </AnimatePresence>

      {/* Equal-Height 6-Category Technology Grid */}
      {filteredGroups.length === 0 ? (
        <div className="card p-6 sm:p-8 text-center space-y-3">
          <p className="text-sm font-semibold text-[var(--text)] font-display">
            No matching verified technologies found
          </p>
          <p className="text-xs text-[var(--text-secondary)] font-sans">
            Try another query or reset the active discipline filter.
          </p>
          <button type="button" onClick={handleResetFilters} className="btn btn-secondary">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="technology-grid">
          <AnimatePresence mode="popLayout" initial={false}>
          {filteredGroups.map((group) => {
            const icon = CATEGORY_ICONS[group.id] || (
              <Code2 className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
            );

            return (
              <motion.article
                key={group.id}
                layout={!reduced}
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, scale: 0.98 }}
                transition={{ duration: reduced ? 0 : MOTION_DURATION.fast, ease: MOTION_EASE.out }}
                className="card technology-card"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="p-2 rounded-[6px] bg-[var(--surface)] border border-[var(--border)] shrink-0">
                        {icon}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs font-mono font-bold tracking-wider text-[var(--text)] uppercase break-words leading-snug">
                          {group.category}
                        </h3>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-[var(--text-muted)] tabular-nums shrink-0 pt-0.5">
                      {group.items.length}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                    {group.description}
                  </p>
                </div>

                <div className="pt-3.5 mt-4 border-t border-[var(--border)] flex flex-wrap gap-2">
                  {group.items.map((item) => {
                    const isSelected =
                      selectedTech?.toLowerCase() === item.name.toLowerCase();

                    return (
                      <button
                        key={item.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => onSelectTech?.(isSelected ? null : item.name)}
                        className={`technology-chip ${
                          isSelected
                            ? "technology-chip--active"
                            : ""
                        }`}
                      >
                        <span>{item.name}</span>
                        {isSelected && (
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.article>
            );
          })}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}

export default EngineeringStackSection;
