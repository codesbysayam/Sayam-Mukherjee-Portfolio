import React, { useState, useMemo, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Activity } from "lucide-react";
import { GitHubContributionWeek } from "../../data/githubTypes";
import { usePortfolio } from "../../context/PortfolioContext";
import { EditorialReveal } from "../../motion/Reveal";
import { MOTION_DURATION, MOTION_EASE, usePrefersReducedMotion } from "../../motion/tokens";

interface GitHubContributionGraphProps {
  calendar: {
    totalContributions: number;
    weeks: GitHubContributionWeek[];
  } | null;
}

export const GitHubContributionGraph = memo(function GitHubContributionGraph({
  calendar,
}: GitHubContributionGraphProps) {
  const { theme } = usePortfolio();
  const isDark = theme === "dark";
  const prefersReduced = usePrefersReducedMotion();

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

  const weeks = useMemo(() => calendar?.weeks || [], [calendar]);

  const monthLabels = useMemo(() => {
    const labels: Array<{ name: string; weekIndex: number }> = [];
    let currentMonth = -1;

    weeks.forEach((week, index) => {
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
  }, [weeks]);

  // Signal / Moss / Paper contribution ramp
  const getDayStyle = (count: number): React.CSSProperties => {
    if (count === 0) {
      return {
        backgroundColor: isDark ? "#262922" : "#EAEAE1",
        borderColor: isDark ? "#41443A" : "#D6D7CC",
      };
    }
    if (count <= 2) {
      return {
        backgroundColor: isDark ? "#3B4229" : "#D2D7BD",
        borderColor: isDark ? "#4F5936" : "#B5BC98",
      };
    }
    if (count <= 5) {
      return {
        backgroundColor: isDark ? "#5C683B" : "#9BA86F",
        borderColor: isDark ? "#69734A" : "#7F8E52",
      };
    }
    if (count <= 8) {
      return {
        backgroundColor: isDark ? "#879E36" : "#69734A",
        borderColor: isDark ? "#A9C52F" : "#4E5834",
      };
    }
    return {
      backgroundColor: "#C7E34A",
      borderColor: isDark ? "#D9EE74" : "#8FA924",
    };
  };

  if (!calendar || weeks.length === 0) {
    return (
      <div
        className="card p-6 text-center space-y-3"
        style={{
          backgroundColor: "var(--surface-2)",
          borderColor: "var(--border)",
        }}
      >
        <div
          className="w-10 h-10 mx-auto rounded-[8px] border flex items-center justify-center"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--accent)",
          }}
        >
          <Activity className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-bold text-[var(--text)] font-display">
          Contribution Calendar
        </h4>
        <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">
          The verified 365-day contribution calendar requires GitHub GraphQL API telemetry, which runs securely via GitHub Actions background sync to protect API credentials.
        </p>
      </div>
    );
  }

  return (
    <EditorialReveal>
      <div
        className="card p-4 sm:p-6 space-y-4 min-w-0 overflow-hidden"
        style={{
          backgroundColor: "var(--surface-2)",
          borderColor: "var(--border)",
        }}
      >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 min-w-0">
          <Activity className="w-4 h-4 text-[var(--accent)] shrink-0" />
          <h4 className="text-sm font-bold text-[var(--text)] font-display">
            Contribution Calendar
          </h4>
          <span className="text-xs font-mono text-[var(--text-muted)] tabular-nums">
            · {calendar.totalContributions} contributions in the last year
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-muted)]">
          <span>Less</span>
          {[0, 1, 3, 6, 10].map((sample) => (
            <span
              key={sample}
              className="w-2.5 h-2.5 rounded-[2px] border"
              style={getDayStyle(sample)}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Heatmap Matrix */}
      <div className="relative overflow-x-auto pb-2 scrollbar-thin">
        <div className="min-w-[720px] select-none">
          <div className="flex text-[10px] font-mono text-[var(--text-muted)] mb-1.5 pl-7">
            {weeks.map((_, i) => {
              const label = monthLabels.find((m) => m.weekIndex === i);
              return (
                <div key={i} className="w-[12px] mr-[3px] text-left shrink-0">
                  {label ? label.name : ""}
                </div>
              );
            })}
          </div>

          <div className="flex gap-[3px]">
            <div className="flex flex-col justify-between text-[9px] font-mono text-[var(--text-faint)] pr-1 select-none">
              <span className="h-[12px] leading-[12px]">Mon</span>
              <span className="h-[12px] leading-[12px] opacity-0">Tue</span>
              <span className="h-[12px] leading-[12px]">Wed</span>
              <span className="h-[12px] leading-[12px] opacity-0">Thu</span>
              <span className="h-[12px] leading-[12px]">Fri</span>
              <span className="h-[12px] leading-[12px] opacity-0">Sat</span>
              <span className="h-[12px] leading-[12px] opacity-0">Sun</span>
            </div>

            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-[3px]">
                {week.contributionDays.map((day, dIdx) => {
                  const inspectDay = (el: HTMLDivElement) => {
                    const rect = el.getBoundingClientRect();
                    setHoveredDay({
                      date: day.date,
                      count: day.count,
                      x: rect.left + rect.width / 2,
                      y: rect.top,
                    });
                  };
                  return (
                    <div
                      key={day.date || `${wIdx}-${dIdx}`}
                      role="button"
                      tabIndex={0}
                      aria-label={`${day.count} ${day.count === 1 ? "contribution" : "contributions"} on ${day.date}`}
                      onMouseEnter={(e) => inspectDay(e.currentTarget)}
                      onMouseLeave={() => setHoveredDay(null)}
                      onFocus={(e) => inspectDay(e.currentTarget)}
                      onBlur={() => setHoveredDay(null)}
                      onClick={(e) => inspectDay(e.currentTarget)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          inspectDay(e.currentTarget);
                        }
                      }}
                      className="w-[12px] h-[12px] rounded-[2px] border transition-transform hover:scale-125 focus:scale-125 focus:outline-none cursor-pointer"
                      style={getDayStyle(day.count)}
                      title={`${day.count} contributions on ${day.date}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="min-h-[24px] mt-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <AnimatePresence mode="wait">
            {hoveredDay ? (
              <motion.span
                key={hoveredDay.date}
                initial={prefersReduced ? false : { opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReduced ? undefined : { opacity: 0, y: -3 }}
                transition={{ duration: prefersReduced ? 0 : MOTION_DURATION.fast, ease: MOTION_EASE.out }}
                className="text-[var(--text-secondary)]"
              >
                <strong className="text-[var(--accent)] font-semibold tabular-nums">
                  {hoveredDay.count}
                </strong>{" "}
                {hoveredDay.count === 1 ? "contribution" : "contributions"} on{" "}
                <span className="text-[var(--text)]">{formattedTooltipDate}</span>
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={prefersReduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={prefersReduced ? undefined : { opacity: 0 }}
                transition={{ duration: prefersReduced ? 0 : MOTION_DURATION.fast }}
                className="text-[var(--text-faint)] text-[11px]"
              >
                Hover or tap squares to inspect daily contribution counts
              </motion.span>
            )}
          </AnimatePresence>
          <span className="text-[var(--text-muted)] text-[10px]">
            GraphQL sync telemetry
          </span>
        </div>
      </div>
    </div>
    </EditorialReveal>
  );
});

export default GitHubContributionGraph;
