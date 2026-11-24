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
  const rawTags = tags.length > 0 ? tags : skills;
  const seenTags = new Set<string>();
  const allTags = rawTags.filter((tag) => {
    const key = tag.trim().toLowerCase();
    if (!key || seenTags.has(key)) return false;
    seenTags.add(key);
    return true;
  });

  const visibleTags = allTags.slice(0, maxVisible);
  const remainingCount = allTags.length - visibleTags.length;

  return (
    <ul
      className={`achievement-card__tags flex flex-wrap items-center gap-2 list-none p-0 m-0 ${className}`}
      aria-label="Relevant topics"
    >
      {visibleTags.length > 0 ? (
        visibleTags.map((tag, idx) => (
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
        ))
      ) : (
        <li
          className="px-2.5 py-1 rounded-[4px] border text-[11px] font-mono"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--text-muted)",
          }}
        >
          Verified Record
        </li>
      )}

      {remainingCount > 0 && (
        <li>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onInspect?.();
            }}
            className="achievement-card__more px-2.5 py-1 min-h-[34px] [@media(pointer:coarse)]:min-h-[44px] rounded-[4px] border text-[11px] font-mono font-semibold transition-all cursor-pointer hover:border-[var(--border-strong)] active:scale-[0.96] active:opacity-80"
            style={{
              backgroundColor: "var(--surface-2)",
              borderColor: "var(--border)",
              color: "var(--accent)",
            }}
            title="Inspect record to view all topics"
            aria-label={`View ${remainingCount} additional topics`}
          >
            +{remainingCount} more
          </button>
        </li>
      )}
    </ul>
  );
}

export default AchievementTags;
