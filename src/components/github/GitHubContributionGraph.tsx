import React, { useState, useMemo, memo } from "react";
import { Activity, Info, Calendar } from "lucide-react";
import { GitHubContributionWeek, GitHubContributionDay } from "../../data/githubTypes";

interface GitHubContributionGraphProps {
  calendar: {
    totalContributions: number;
    weeks: GitHubContributionWeek[];
  } | null;
}

export const GitHubContributionGraph = memo(function GitHubContributionGraph({
  calendar,
}: GitHubContributionGraphProps) {
  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  const formattedTooltipDate = useMemo(() => {
    if (!hoveredDay) return "";
    try {
      const d = new Date(hoveredDay.date);
      return d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return hoveredDay.date;
    }
  }, [hoveredDay]);

  // Color mapper based on count
  const getDayColor = (count: number, defaultColor?: string) => {
    if (count === 0) return "bg-zinc-900 border border-zinc-800/60";
    if (count <= 2) return "bg-emerald-950 border border-emerald-900/60";
    if (count <= 5) return "bg-emerald-800 border border-emerald-700/60";
    if (count <= 8) return "bg-emerald-600 border border-emerald-500/60";
    return "bg-emerald-400 border border-emerald-300/80 shadow-sm shadow-emerald-500/20";
  };

  if (!calendar || !calendar.weeks || calendar.weeks.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 text-center space-y-3">
        <div className="w-10 h-10 mx-auto rounded-xl bg-zinc-800/80 flex items-center justify-center text-zinc-400">
          <Activity className="w-5 h-5 text-emerald-400" />
        </div>
        <h4 className="text-sm font-bold text-white font-display">Contribution Calendar</h4>
        <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
          The verified 365-day contribution calendar requires GitHub GraphQL API telemetry, which runs securely via GitHub Actions background sync to protect API credentials.
        </p>
      </div>
    );
  }

  // Calculate month labels across the 52 weeks
  const monthLabels = useMemo(() => {
    const labels: Array<{ name: string; weekIndex: number }> = [];
    let currentMonth = -1;

    calendar.weeks.forEach((week, index) => {
      const firstDay = week.contributionDays[0];
      if (firstDay) {
        const d = new Date(firstDay.date);
        const m = d.getMonth();
        if (m !== currentMonth && index < 50) {
          currentMonth = m;
          labels.push({
            name: d.toLocaleDateString("en-US", { month: "short" }),
            weekIndex: index,
          });
        }
      }
    });

    return labels;
  }, [calendar.weeks]);

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h4 className="text-sm font-bold text-white font-display">
            Contribution Calendar
          </h4>
          <span className="text-xs font-mono text-zinc-400">
            · {calendar.totalContributions} contributions in the last year
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-500">
          <span>Less</span>
          <span className="w-2.5 h-2.5 rounded-sm bg-zinc-900 border border-zinc-800/60" />
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-950 border border-emerald-900/60" />
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-800 border border-emerald-700/60" />
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600 border border-emerald-500/60" />
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 border border-emerald-300/80" />
          <span>More</span>
        </div>
      </div>

      {/* Relative Tooltip floating area */}
      <div className="relative overflow-x-auto pb-2 scrollbar-thin">
        <div className="min-w-[720px] select-none">
          {/* Month Labels */}
          <div className="flex text-[10px] font-mono text-zinc-500 mb-1.5 pl-7">
            {calendar.weeks.map((_, i) => {
              const label = monthLabels.find((m) => m.weekIndex === i);
              return (
                <div key={i} className="w-[12px] mr-[3px] text-left shrink-0">
                  {label ? label.name : ""}
                </div>
              );
            })}
          </div>

          {/* Matrix: Days of Week + 52 Week Columns */}
          <div className="flex gap-[3px]">
            {/* Days Column */}
            <div className="flex flex-col justify-between text-[9px] font-mono text-zinc-500 pr-1 select-none">
              <span className="h-[12px] leading-[12px]">Mon</span>
              <span className="h-[12px] leading-[12px] opacity-0">Tue</span>
              <span className="h-[12px] leading-[12px]">Wed</span>
              <span className="h-[12px] leading-[12px] opacity-0">Thu</span>
              <span className="h-[12px] leading-[12px]">Fri</span>
              <span className="h-[12px] leading-[12px] opacity-0">Sat</span>
              <span className="h-[12px] leading-[12px] opacity-0">Sun</span>
            </div>

            {/* Weeks */}
            {calendar.weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-[3px]">
                {week.contributionDays.map((day, dIdx) => (
                  <div
                    key={day.date || `${wIdx}-${dIdx}`}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredDay({
                        date: day.date,
                        count: day.count,
                        x: rect.left + rect.width / 2,
                        y: rect.top,
                      });
                    }}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`w-[12px] h-[12px] rounded-sm transition-transform hover:scale-125 cursor-pointer ${getDayColor(
                      day.count,
                      day.color
                    )}`}
                    title={`${day.count} contributions on ${day.date}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Hover summary */}
        <div className="h-6 mt-2 flex items-center justify-between text-xs font-mono">
          {hoveredDay ? (
            <span className="text-zinc-300">
              <strong className="text-emerald-400 font-semibold">{hoveredDay.count}</strong>{" "}
              {hoveredDay.count === 1 ? "contribution" : "contributions"} on{" "}
              <span className="text-zinc-200">{formattedTooltipDate}</span>
            </span>
          ) : (
            <span className="text-zinc-500 text-[11px]">
              Hover over squares to inspect daily contribution counts
            </span>
          )}
          <span className="text-zinc-400 text-[10px]">
            GraphQL sync telemetry
          </span>
        </div>
      </div>
    </div>
  );
});
