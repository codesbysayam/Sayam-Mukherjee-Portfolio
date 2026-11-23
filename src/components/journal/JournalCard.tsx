import React, { memo, useMemo } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Clock, Calendar } from "lucide-react";
import { JournalEntry } from "../../data/journal";
import { calculateReadingTime } from "../../utils/readingTime";
import { JournalVisualCover } from "./JournalVisualCover";
import { MOTION_DURATION, MOTION_EASE, usePrefersReducedMotion } from "../../motion/tokens";

interface JournalCardProps {
  entry: JournalEntry;
  onClick: (slug: string) => void;
  featured?: boolean;
  index?: number;
}

export const JournalCard = memo(function JournalCard({
  entry,
  onClick,
  featured = false,
  index,
}: JournalCardProps) {
  const prefersReduced = usePrefersReducedMotion();
  const indexFormatted =
    typeof index === "number" ? String(index + 1).padStart(2, "0") : null;
  const readingStats = useMemo(() => calculateReadingTime(entry), [entry]);

  if (featured) {
    return (
      <motion.article
        whileHover={prefersReduced ? undefined : { y: -2 }}
        transition={{ duration: MOTION_DURATION.fast, ease: MOTION_EASE.out }}
        onClick={() => onClick(entry.slug)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick(entry.slug);
          }
        }}
        className="group relative rounded-[10px] border border-[var(--border-strong)] bg-[var(--surface-2)] p-5 sm:p-7 lg:p-8 transition-colors duration-200 cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        aria-label={`Lead Essay: ${entry.title}`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Editorial Lead Copy */}
          <div className="lg:col-span-6 space-y-4 min-w-0">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] font-mono tracking-wider uppercase text-[var(--text-muted)]">
              <span className="font-bold text-[var(--accent)]">
                Lead Essay · {entry.issueNumber || "ISSUE 06"}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-[var(--text)]">
                {entry.category}
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3 h-3" aria-hidden="true" />
                {entry.date}
              </span>
              <span aria-hidden="true">·</span>
              <span
                className="inline-flex items-center gap-1 tabular-nums text-[var(--text)]"
                title={`Estimated reading time (${readingStats.words} words)`}
              >
                <Clock className="w-3 h-3 text-[var(--accent)]" aria-hidden="true" />
                <span>{readingStats.formatted}</span>
              </span>
            </div>

            <div className="space-y-2.5">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[var(--text)] group-hover:text-[var(--accent)] font-display tracking-tight leading-[1.14] transition-colors">
                {entry.title}
              </h2>
              {entry.subtitle && (
                <p className="text-sm sm:text-base font-serif-editorial italic text-[var(--text-secondary)] leading-snug">
                  {entry.subtitle}
                </p>
              )}
            </div>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3">
              {entry.summary}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)]">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold font-mono text-[var(--accent)]">
                <span>Read Full Essay</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
              <span className="text-[11px] font-mono text-[var(--text-muted)] tabular-nums">
                {readingStats.words} words
              </span>
            </div>
          </div>

          {/* Visual Publication Cover */}
          <div className="lg:col-span-6 min-w-0">
            <JournalVisualCover
              projectId={entry.coverProjectId}
              issueNumber={entry.issueNumber}
              category={entry.category}
              title={entry.title}
              caption={entry.coverCaption}
              variant="featured"
              immediate
            />
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      whileHover={prefersReduced ? undefined : { y: -3 }}
      transition={{ duration: MOTION_DURATION.fast, ease: MOTION_EASE.out }}
      onClick={() => onClick(entry.slug)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(entry.slug);
        }
      }}
      className="card group relative flex flex-col justify-between p-4 sm:p-5 cursor-pointer overflow-hidden h-full gap-4 bg-[var(--surface-2)] border-[var(--border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      aria-label={`Journal Essay: ${entry.title}`}
    >
      <div className="space-y-3.5">
        <JournalVisualCover
          projectId={entry.coverProjectId}
          issueNumber={entry.issueNumber || (indexFormatted ? `NOTE ${indexFormatted}` : undefined)}
          category={entry.category}
          title={entry.title}
          caption={entry.coverCaption}
          variant="card"
        />

        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono tracking-wider text-[var(--text-muted)]">
          <div className="flex items-center gap-2 min-w-0">
            {indexFormatted && (
              <span className="text-[var(--accent)] font-bold tabular-nums">
                № {indexFormatted}
              </span>
            )}
            <span className="text-[var(--text-secondary)] font-semibold uppercase truncate">
              {entry.category}
            </span>
          </div>

          <div
            className="flex items-center gap-1.5 tabular-nums shrink-0"
            title={`Estimated reading speed of 200 WPM (${readingStats.words} words)`}
          >
            <span>{entry.date}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 text-[var(--text)]">
              <Clock className="w-3 h-3 text-[var(--accent)]" aria-hidden="true" />
              {readingStats.formatted}
            </span>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-[var(--text)] group-hover:text-[var(--accent)] font-display tracking-tight leading-snug transition-colors">
          {entry.title}
        </h3>

        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">
          {entry.summary}
        </p>
      </div>

      <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-[11px] font-mono">
        <span className="font-semibold text-[var(--accent)] inline-flex items-center gap-1">
          <span>Read Essay</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </span>
        <span className="text-[10px] text-[var(--text-muted)] tabular-nums">
          {readingStats.words} words
        </span>
      </div>
    </motion.article>
  );
});
