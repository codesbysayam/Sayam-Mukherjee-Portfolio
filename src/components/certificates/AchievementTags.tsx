import React from "react";
import { usePortfolio } from "../../context/PortfolioContext";

interface AchievementTagsProps {
  tags?: string[];
  skills?: string[];
  maxVisible?: number;
  onInspect?: () => void;
  className?: string;
}

export function AchievementTags({
  tags = [],
  skills = [],
  maxVisible = 4,
  onInspect,
  className = "",
}: AchievementTagsProps) {
  const { theme } = usePortfolio();
  const isLight = theme === "light";

  const allTags = tags.length > 0 ? tags : skills;
  if (!allTags || allTags.length === 0) return null;

  const visibleTags = allTags.slice(0, maxVisible);
  const remainingCount = allTags.length - visibleTags.length;

  return (
    <ul
      className={`achievement-card__tags flex flex-wrap items-center gap-1.5 list-none p-0 m-0 ${className}`}
      aria-label="Achievement tags"
    >
      {visibleTags.map((tag, idx) => (
        <li
          key={`${tag}-${idx}`}
          className={`px-2.5 py-1 rounded-full text-xs font-sans max-w-full truncate transition-colors ${
            isLight
              ? "bg-slate-100 text-slate-700 border border-slate-200"
              : "bg-white/[0.04] text-zinc-300 border border-white/10"
          }`}
          title={tag}
        >
          {tag}
        </li>
      ))}

      {remainingCount > 0 && (
        <li>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onInspect?.();
            }}
            className={`achievement-card__more px-2 py-1 rounded-full text-xs font-sans transition-colors cursor-pointer border ${
              isLight
                ? "text-purple-700 hover:text-purple-900 border-purple-200 bg-purple-50/50"
                : "text-purple-400 hover:text-purple-300 border-purple-800/40 bg-purple-950/20"
            }`}
            title="Inspect record to view all tags"
            aria-label={`View ${remainingCount} additional tags`}
          >
            +{remainingCount} more
          </button>
        </li>
      )}
    </ul>
  );
}
export default AchievementTags;
