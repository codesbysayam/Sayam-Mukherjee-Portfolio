import React, { memo, useMemo } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Clock, Calendar } from "lucide-react";
import { JournalEntry } from "../../data/journal";
import { calculateReadingTime } from "../../utils/readingTime";
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
        whileHover={prefersReduced ? undefined : { y: -3 }}
        transition={{ duration: MOTION_DURATION.fast, ease: MOTION_EASE.out }}
        onClick={() => onClick(entry.slug)}
        className="group relative rounded-[10px] border p-6 sm:p-8 transition-colors duration-200 cursor-pointer overflow-hidden"
        style={{
          backgroundColor: "#20231D",
          borderColor: "#41443A",
          color: "#F4F4ED",
        }}
        aria-label={`Featured Note: ${entry.title}`}
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono tracking-wider">
              <span
                className="px-2.5 py-0.5 rounded-[4px] font-semibold uppercase text-[11px]"
                style={{
                  backgroundColor: "#C7E34A",
                  color: "#20231D",
                }}
              >
                Featured Entry
              </span>
              <span className="text-[#EAEAE1] font-semibold uppercase">
                {entry.category}
              </span>
              <span className="text-[#8C8F82]" aria-hidden="true">
                &bull;
              </span>
              <span className="text-[#B5B8AA] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                {entry.date}
              </span>
              <span className="text-[#8C8F82]" aria-hidden="true">
                &bull;
              </span>
              <span
                className="text-[#B5B8AA] flex items-center gap-1 tabular-nums"
                title={`Estimated reading time (${readingStats.words} words)`}
              >
                <Clock className="w-3.5 h-3.5 text-[#C7E34A]" aria-hidden="true" />
                <span>{readingStats.formatted}</span>
                <span className="text-[#8C8F82] text-[11px]">
                  ({readingStats.words} words)
                </span>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#F4F4ED] group-hover:text-[#C7E34A] font-display tracking-tight leading-snug transition-colors">
              {entry.title}
            </h3>

            <p className="text-sm sm:text-base text-[#D4D6CA] leading-relaxed line-clamp-3">
              {entry.summary}
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold font-mono text-[#C7E34A]">
                <span>Read Full Entry</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </div>
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
      className="card group relative flex flex-col justify-between p-5 sm:p-6 cursor-pointer overflow-hidden h-full"
      style={{
        backgroundColor: "var(--surface-2)",
        borderColor: "var(--border)",
      }}
      aria-label={`Journal Entry: ${entry.title}`}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 text-[11px] font-mono tracking-wider">
          <div className="flex items-center gap-2">
            {indexFormatted && (
              <span className="text-[var(--accent)] font-bold">
                № {indexFormatted}
              </span>
            )}
            <span className="text-[var(--text-secondary)] font-semibold uppercase">
              {entry.category}
            </span>
          </div>

          <div
            className="flex items-center gap-1.5 text-[var(--text-muted)] tabular-nums"
            title={`Estimated reading speed of 200 WPM (${readingStats.words} words)`}
          >
            <span>{entry.date}</span>
            <span className="text-[var(--text-faint)]" aria-hidden="true">
              &bull;
            </span>
            <span className="flex items-center gap-1 text-[var(--text-secondary)]">
              <Clock className="w-3 h-3 text-[var(--accent)]" aria-hidden="true" />
              {readingStats.formatted}
            </span>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-[var(--text)] group-hover:text-[var(--accent)] font-display tracking-tight leading-snug transition-colors">
          {entry.title}
        </h3>

        <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed line-clamp-2">
          {entry.summary}
        </p>
      </div>

      <div
        className="pt-4 mt-3 border-t flex items-center justify-between"
        style={{ borderColor: "var(--border)" }}
      >
        <span className="text-[11px] font-mono font-semibold text-[var(--accent)] inline-flex items-center gap-1">
          <span>Read Entry</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </span>
        <span className="text-[10px] font-mono text-[var(--text-faint)] tabular-nums">
          {readingStats.words} words
        </span>
      </div>
    </motion.article>
  );
});
