import React from "react";
import { AchievementRecord, Certificate } from "../../types/certificates";
import { AchievementCard } from "./AchievementCard";
import { Award, RotateCcw } from "lucide-react";
import { EditorialReveal, StaggerGroup, StaggerItem } from "../../motion/Reveal";

export interface AchievementGridProps {
  records?: (AchievementRecord | Certificate)[];
  certificates?: Certificate[];
  onInspect?: (record: AchievementRecord) => void;
  onView?: (cert: Certificate) => void;
  onResetFilters?: () => void;
  columns?: 2 | 3;
  className?: string;
  emptyTitle?: string;
  emptyMessage?: string;
}

export function AchievementGrid({
  records,
  certificates,
  onInspect,
  onView,
  onResetFilters,
  columns = 2,
  className = "",
  emptyTitle = "No matching credentials found",
  emptyMessage = "No certificates match your query. Try resetting your filters to view all credentials in the archive.",
}: AchievementGridProps) {
  const items = (records || certificates || []) as (AchievementRecord | Certificate)[];

  if (items.length === 0) {
    return (
      <EditorialReveal immediate>
        <div
          className={`card p-10 sm:p-12 text-center max-w-lg mx-auto space-y-4 ${className}`}
          style={{ backgroundColor: "var(--surface-2)", borderColor: "var(--border)" }}
        >
          <div
            className="w-12 h-12 rounded-[10px] mx-auto flex items-center justify-center border"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--accent)",
            }}
          >
            <Award className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-[var(--text)] font-display">{emptyTitle}</h3>
            <p className="text-xs leading-relaxed max-w-sm mx-auto text-[var(--text-muted)]">
              {emptyMessage}
            </p>
          </div>

          {onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="btn btn-primary text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>
      </EditorialReveal>
    );
  }

  const gridColsClass =
    columns === 3
      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      : "grid grid-cols-1 md:grid-cols-2 gap-6";

  const gridSignature = `${items.length}-${items[0]?.id ?? "none"}-${items[items.length - 1]?.id ?? "none"}`;

  return (
    <StaggerGroup
      key={gridSignature}
      stagger={0.045}
      className={`achievement-grid ${gridColsClass} w-full min-w-0 ${className}`}
    >
      {items.map((item) => (
        <StaggerItem key={item.id} className="h-full">
          <AchievementCard
            record={item as AchievementRecord}
            onInspect={onInspect}
            onView={onView}
          />
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}

export default AchievementGrid;
