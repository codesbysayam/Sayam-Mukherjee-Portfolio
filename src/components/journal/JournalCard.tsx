import React, { memo } from "react";
import { ArrowUpRight, Clock, Calendar } from "lucide-react";
import { JournalEntry } from "../../data/journal";

interface JournalCardProps {
  entry: JournalEntry;
  onClick: (slug: string) => void;
  featured?: boolean;
}

export const JournalCard = memo(function JournalCard({
  entry,
  onClick,
  featured = false,
}: JournalCardProps) {
  if (featured) {
    return (
      <article
        onClick={() => onClick(entry.slug)}
        className="group relative rounded-2xl bg-zinc-950/40 dark:bg-zinc-950/50 border border-zinc-800/80 hover:border-zinc-700/90 p-6 sm:p-8 transition-all duration-200 cursor-pointer overflow-hidden backdrop-blur-xs"
        aria-label={`Featured Journal: ${entry.title}`}
      >
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3.5 max-w-3xl">
            {/* Metadata row: unboxed, clean typography */}
            <div className="flex items-center gap-3 text-xs font-mono tracking-wider">
              <span className="text-zinc-300 dark:text-zinc-300 font-semibold uppercase">
                {entry.category}
              </span>
              <span className="text-zinc-600 dark:text-zinc-500">•</span>
              <span className="text-zinc-400 dark:text-zinc-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {entry.date}
              </span>
              <span className="text-zinc-600 dark:text-zinc-500">•</span>
              <span className="text-zinc-400 dark:text-zinc-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {entry.readingTime}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-zinc-100 font-display tracking-tight leading-snug">
              {entry.title}
            </h3>

            {/* Summary */}
            <p className="text-sm text-zinc-300 dark:text-zinc-300 leading-relaxed line-clamp-3">
              {entry.summary}
            </p>
          </div>

          {/* Action indicator */}
          <div className="shrink-0 pt-2 lg:pt-0">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold font-mono text-zinc-300 group-hover:text-white transition-colors">
              <span>Read Journal</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={() => onClick(entry.slug)}
      className="group relative flex flex-col justify-between rounded-xl bg-zinc-950/40 dark:bg-zinc-950/50 border border-zinc-850 hover:border-zinc-700/80 p-5 sm:p-6 transition-all duration-200 cursor-pointer overflow-hidden backdrop-blur-xs"
      aria-label={`Journal: ${entry.title}`}
    >
      <div className="space-y-3">
        {/* Metadata row: unboxed, clean typography */}
        <div className="flex items-center gap-2.5 text-[11px] font-mono tracking-wider">
          <span className="text-zinc-300 dark:text-zinc-300 font-semibold uppercase">
            {entry.category}
          </span>
          <span className="text-zinc-600 dark:text-zinc-500">•</span>
          <span className="text-zinc-400 dark:text-zinc-400">{entry.date}</span>
          <span className="text-zinc-600 dark:text-zinc-500">•</span>
          <span className="text-zinc-400 dark:text-zinc-400">{entry.readingTime}</span>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-zinc-100 font-display tracking-tight leading-snug">
          {entry.title}
        </h3>

        {/* Summary */}
        <p className="text-xs sm:text-sm text-zinc-300 dark:text-zinc-300 leading-relaxed line-clamp-2">
          {entry.summary}
        </p>
      </div>

      {/* Action link */}
      <div className="pt-4 mt-2 border-t border-zinc-850/60 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-xs font-mono text-zinc-400 group-hover:text-white transition-colors">
          <span>Read Journal</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </span>
      </div>
    </article>
  );
});
