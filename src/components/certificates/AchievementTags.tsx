import React from "react";

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
          className="px-2.5 py-1 rounded-[4px] border text-[11px] font-mono max-w-full truncate"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--text-secondary)",
          }}
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
            className="achievement-card__more px-2 py-1 rounded-[4px] border text-[11px] font-mono font-semibold transition-all cursor-pointer hover:border-[var(--border-strong)] active:scale-[0.96] active:opacity-80"
            style={{
              backgroundColor: "var(--surface-2)",
              borderColor: "var(--border)",
              color: "var(--accent)",
            }}
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
