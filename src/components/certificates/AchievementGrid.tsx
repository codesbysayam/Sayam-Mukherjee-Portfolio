import React from "react";
import { AchievementRecord, Certificate } from "../../types/certificates";
import { AchievementCard } from "./AchievementCard";
import { Award, RotateCcw } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";

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
  const { theme } = usePortfolio();
  const isLight = theme === "light";

  const items = (records || certificates || []) as (AchievementRecord | Certificate)[];

  if (items.length === 0) {
    return (
      <div
        className={`achievement-grid__empty rounded-2xl border p-12 text-center max-w-lg mx-auto space-y-4 ${
          isLight
            ? "bg-white border-slate-200 text-slate-900"
            : "bg-[#111318] border-white/10 text-white"
        } ${className}`}
      >
        <div
          className={`w-12 h-12 rounded-xl mx-auto flex items-center justify-center border ${
            isLight
              ? "bg-slate-100 border-slate-200 text-slate-600"
              : "bg-white/[0.05] border-white/10 text-purple-400"
          }`}
        >
          <Award className="w-6 h-6 opacity-80" />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-bold">{emptyTitle}</h3>
          <p
            className={`text-xs leading-relaxed max-w-sm mx-auto ${
              isLight ? "text-slate-500" : "text-[#737A87]"
            }`}
          >
            {emptyMessage}
          </p>
        </div>

        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-sans transition-all cursor-pointer border ${
              isLight
                ? "bg-slate-900 hover:bg-slate-800 text-white border-slate-900"
                : "bg-white/[0.08] hover:bg-white/[0.14] text-white border-white/10"
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    );
  }

  const gridColsClass =
    columns === 3
      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      : "grid grid-cols-1 md:grid-cols-2 gap-6";

  return (
    <div className={`achievement-grid ${gridColsClass} w-full min-w-0 ${className}`}>
      {items.map((item) => (
        <AchievementCard
          key={item.id}
          record={item as AchievementRecord}
          onInspect={onInspect}
          onView={onView}
        />
      ))}
    </div>
  );
}

export default AchievementGrid;
