import React, { memo, useMemo } from "react";
import { ArrowUpRight, Clock, Calendar } from "lucide-react";
import { JournalEntry } from "../../data/journal";
import { calculateReadingTime } from "../../utils/readingTime";

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
  const indexFormatted = typeof index === "number" ? String(index + 1).padStart(2, "0") : null;
  const readingStats = useMemo(() => calculateReadingTime(entry), [entry]);

  if (featured) {
    return (
      <article
        onClick={() => onClick(entry.slug)}
        className="group relative rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/[0.12] hover:border-purple-500/40 p-6 sm:p-8 transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-md shadow-xl hover:shadow-2xl hover:shadow-purple-950/20"
        aria-label={`Featured Note: ${entry.title}`}
      >
        {/* Subtle decorative background glow */}
        <div
          className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/15 transition-all duration-500"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            {/* Metadata row */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono tracking-wider">
              <span className="px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/25 font-semibold uppercase text-[11px]">
                Featured Entry
              </span>
              <span className="text-zinc-300 font-semibold uppercase">
                {entry.category}
              </span>
              <span className="text-zinc-600" aria-hidden="true">&bull;</span>
              <span className="text-zinc-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                {entry.date}
              </span>
              <span className="text-zinc-600" aria-hidden="true">&bull;</span>
              <span
                className="text-zinc-400 flex items-center gap-1"
                title={`Estimated reading time based on standard 200 WPM (${readingStats.words} words)`}
              >
                <Clock className="w-3.5 h-3.5 text-purple-400" aria-hidden="true" />
                <span>{readingStats.formatted}</span>
                <span className="text-zinc-500 text-[11px]">({readingStats.words} words)</span>
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white group-hover:text-purple-200 font-display tracking-tight leading-snug transition-colors">
              {entry.title}
            </h3>

            {/* Summary */}
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed line-clamp-3">
              {entry.summary}
            </p>

            {/* Read action */}
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold font-mono text-purple-300 group-hover:text-white transition-colors">
                <span>Read Full Entry</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={() => onClick(entry.slug)}
      className="group relative flex flex-col justify-between rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] hover:border-purple-500/35 p-5 sm:p-6 transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-xs shadow-sm hover:shadow-md"
      aria-label={`Journal Entry: ${entry.title}`}
    >
      <div className="space-y-3">
        {/* Header: index number, category, reading time */}
        <div className="flex items-center justify-between gap-2 text-[11px] font-mono tracking-wider">
          <div className="flex items-center gap-2">
            {indexFormatted && (
              <span className="text-purple-400/80 font-bold">
                № {indexFormatted}
              </span>
            )}
            <span className="text-zinc-300 font-semibold uppercase">
              {entry.category}
            </span>
          </div>

          <div
            className="flex items-center gap-1.5 text-zinc-400"
            title={`Standard average reading speed of 200 WPM (${readingStats.words} words)`}
          >
            <span>{entry.date}</span>
            <span className="text-zinc-600" aria-hidden="true">&bull;</span>
            <span className="flex items-center gap-1 text-zinc-300">
              <Clock className="w-3 h-3 text-purple-400" aria-hidden="true" />
              {readingStats.formatted}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-purple-200 font-display tracking-tight leading-snug transition-colors">
          {entry.title}
        </h3>

        {/* Summary */}
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed line-clamp-2">
          {entry.summary}
        </p>
      </div>

      {/* Footer action link */}
      <div className="pt-4 mt-3 border-t border-white/[0.06] flex items-center justify-between">
        <span className="text-[11px] font-mono text-zinc-400 group-hover:text-purple-300 transition-colors inline-flex items-center gap-1">
          <span>Read Entry</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </span>
        <span className="text-[10px] font-mono text-zinc-500">
          {readingStats.words} words
        </span>
      </div>
    </article>
  );
});
