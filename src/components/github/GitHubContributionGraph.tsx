import React, { useState, useMemo, useEffect, useRef, memo } from "react";
import * as d3 from "d3";
import { motion, AnimatePresence } from "motion/react";
import { Activity, Flame, CalendarDays, Sparkles } from "lucide-react";
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

interface ContributionCellDatum {
  date: string;
  count: number;
  weekIndex: number;
  dayIndex: number;
}

const CELL_SIZE = 12;
const CELL_GAP = 3;
const WEEK_STEP = CELL_SIZE + CELL_GAP;
const MARGIN_LEFT = 32;
const MARGIN_TOP = 20;
const MARGIN_BOTTOM = 6;
const MARGIN_RIGHT = 6;

const WEEKDAY_LABELS = [
  { row: 1, label: "Mon" },
  { row: 3, label: "Wed" },
  { row: 5, label: "Fri" },
];

export const GitHubContributionGraph = memo(function GitHubContributionGraph({
  calendar,
}: GitHubContributionGraphProps) {
  const { theme } = usePortfolio();
  const isDark = theme === "dark";
  const prefersReduced = usePrefersReducedMotion();
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [filterMode, setFilterMode] = useState<"all" | "active">("all");
  const [selectedDay, setSelectedDay] = useState<ContributionCellDatum | null>(null);
  const [hoveredDay, setHoveredDay] = useState<ContributionCellDatum | null>(null);

  const weeks = useMemo(() => calendar?.weeks || [], [calendar]);

  const analytics = useMemo(() => {
    const flat: ContributionCellDatum[] = [];
    weeks.forEach((week, weekIndex) => {
      week.contributionDays.forEach((day, dayIndex) => {
        flat.push({
          date: day.date,
          count: day.count,
          weekIndex,
          dayIndex,
        });
      });
    });

    let activeDays = 0;
    let peakDay: ContributionCellDatum | null = null;
    let currentStreak = 0;
    let longestStreak = 0;
    let runningStreak = 0;

    for (let i = 0; i < flat.length; i++) {
      const d = flat[i];
      if (d.count > 0) {
        activeDays += 1;
        runningStreak += 1;
        if (runningStreak > longestStreak) longestStreak = runningStreak;
        if (!peakDay || d.count > peakDay.count) {
          peakDay = d;
        }
      } else {
        runningStreak = 0;
      }
    }

    // Current trailing streak from most recent day backwards (allowing today if 0 so far)
    let tail = flat.length - 1;
    if (tail >= 0 && flat[tail].count === 0) {
      tail -= 1;
    }
    while (tail >= 0 && flat[tail].count > 0) {
      currentStreak += 1;
      tail -= 1;
    }

    return {
      cells: flat,
      activeDays,
      peakDay,
      currentStreak,
      longestStreak,
    };
  }, [weeks]);

  const monthLabels = useMemo(() => {
    const labels: Array<{ name: string; weekIndex: number }> = [];
    let currentMonth = -1;

    weeks.forEach((week, index) => {
      const firstDay = week.contributionDays[0];
      if (firstDay) {
        const d = new Date(firstDay.date);
        const m = d.getMonth();
        if (!Number.isNaN(m) && m !== currentMonth && index < weeks.length - 2) {
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

  const colorScale = useMemo(() => {
    const fillColors = isDark
      ? ["#262922", "#3B4229", "#5C683B", "#879E36", "#C7E34A"]
      : ["#EAEAE1", "#D2D7BD", "#9BA86F", "#69734A", "#A9C52F"];
    const strokeColors = isDark
      ? ["#41443A", "#4F5936", "#69734A", "#A9C52F", "#D9EE74"]
      : ["#D6D7CC", "#B5BC98", "#7F8E52", "#4E5834", "#8FA924"];

    const domain = [1, 3, 6, 9];
    return {
      fill: d3.scaleThreshold<number, string>().domain(domain).range(fillColors),
      stroke: d3.scaleThreshold<number, string>().domain(domain).range(strokeColors),
    };
  }, [isDark]);

  const inspectedDay = hoveredDay || selectedDay;

  const formattedInspectedDate = useMemo(() => {
    if (!inspectedDay) return "";
    try {
      const d = new Date(inspectedDay.date);
      return d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return inspectedDay.date;
    }
  }, [inspectedDay]);

  const svgWidth = Math.max(weeks.length * WEEK_STEP - CELL_GAP + MARGIN_LEFT + MARGIN_RIGHT, 740);
  const svgHeight = 7 * WEEK_STEP - CELL_GAP + MARGIN_TOP + MARGIN_BOTTOM;

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl || weeks.length === 0) return;

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();

    const textMuted = isDark ? "#8A8E80" : "#6D7260";
    const textFaint = isDark ? "#6D7260" : "#8A8E80";
    const highlightStroke = isDark ? "#F4F4ED" : "#151713";

    // Month labels group
    const monthsGroup = svg
      .append("g")
      .attr("class", "d3-month-labels")
      .attr("transform", `translate(${MARGIN_LEFT}, 12)`);

    monthsGroup
      .selectAll<SVGTextElement, { name: string; weekIndex: number }>("text")
      .data(monthLabels, (d) => `${d.name}-${d.weekIndex}`)
      .join("text")
      .attr("x", (d) => d.weekIndex * WEEK_STEP)
      .attr("y", 0)
      .attr("fill", textMuted)
      .attr("font-size", "10px")
      .attr("font-family", "var(--font-mono), monospace")
      .text((d) => d.name);

    // Weekday labels group
    const weekdaysGroup = svg
      .append("g")
      .attr("class", "d3-weekday-labels")
      .attr("transform", `translate(0, ${MARGIN_TOP})`);

    weekdaysGroup
      .selectAll<SVGTextElement, { row: number; label: string }>("text")
      .data(WEEKDAY_LABELS)
      .join("text")
      .attr("x", 0)
      .attr("y", (d) => d.row * WEEK_STEP + CELL_SIZE - 2)
      .attr("fill", textFaint)
      .attr("font-size", "10px")
      .attr("font-family", "var(--font-mono), monospace")
      .text((d) => d.label);

    // Heatmap grid group
    const gridGroup = svg
      .append("g")
      .attr("class", "d3-contrib-grid")
      .attr("transform", `translate(${MARGIN_LEFT}, ${MARGIN_TOP})`);

    const activeDate = inspectedDay?.date ?? null;

    const rects = gridGroup
      .selectAll<SVGRectElement, ContributionCellDatum>("rect.contrib-cell")
      .data(analytics.cells, (d) => d.date || `${d.weekIndex}-${d.dayIndex}`)
      .join("rect")
      .attr("class", "contrib-cell")
      .attr("x", (d) => d.weekIndex * WEEK_STEP)
      .attr("y", (d) => d.dayIndex * WEEK_STEP)
      .attr("width", CELL_SIZE)
      .attr("height", CELL_SIZE)
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("tabindex", 0)
      .attr("role", "button")
      .attr(
        "aria-label",
        (d) => `${d.count} ${d.count === 1 ? "contribution" : "contributions"} on ${d.date}`
      )
      .style("cursor", "pointer")
      .style("outline", "none")
      .attr("fill", (d) => colorScale.fill(d.count))
      .attr("stroke", (d) =>
        activeDate === d.date ? highlightStroke : colorScale.stroke(d.count)
      )
      .attr("stroke-width", (d) => (activeDate === d.date ? 1.6 : 1))
      .attr("opacity", (d) => {
        if (filterMode === "active" && d.count === 0) return 0.22;
        return 1;
      });

    if (!prefersReduced) {
      rects
        .on("mouseenter", function (_, d) {
          d3.select(this)
            .transition()
            .duration(120)
            .attr("stroke", highlightStroke)
            .attr("stroke-width", 1.6);
          setHoveredDay(d);
        })
        .on("mouseleave", function (_, d) {
          d3.select(this)
            .transition()
            .duration(150)
            .attr("stroke", selectedDay?.date === d.date ? highlightStroke : colorScale.stroke(d.count))
            .attr("stroke-width", selectedDay?.date === d.date ? 1.6 : 1);
          setHoveredDay((prev) => (prev?.date === d.date ? null : prev));
        });
    } else {
      rects
        .on("mouseenter", (_, d) => setHoveredDay(d))
        .on("mouseleave", (_, d) =>
          setHoveredDay((prev) => (prev?.date === d.date ? null : prev))
        );
    }

    rects
      .on("focus", (_, d) => setHoveredDay(d))
      .on("blur", (_, d) =>
        setHoveredDay((prev) => (prev?.date === d.date ? null : prev))
      )
      .on("click", (_, d) => {
        setSelectedDay((prev) => (prev?.date === d.date ? null : d));
      })
      .on("keydown", (event: KeyboardEvent, d) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setSelectedDay((prev) => (prev?.date === d.date ? null : d));
        }
      });

    rects
      .append("title")
      .text(
        (d) =>
          `${d.count} ${d.count === 1 ? "contribution" : "contributions"} on ${d.date}`
      );
  }, [
    weeks,
    analytics.cells,
    monthLabels,
    isDark,
    colorScale,
    filterMode,
    prefersReduced,
    inspectedDay?.date,
    selectedDay?.date,
  ]);

  if (!calendar || weeks.length === 0) {
    return (
      <div
        className="border-t border-b py-8 text-center space-y-3"
        style={{
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
          The verified 365-day contribution calendar requires GitHub GraphQL API telemetry, synced securely via scheduled repository updates.
        </p>
      </div>
    );
  }

  return (
    <EditorialReveal>
      <section
        aria-label="GitHub 53-week D3 contribution heatmap"
        className="border-t border-b py-6 sm:py-8 space-y-5 min-w-0"
        style={{
          borderColor: "var(--border)",
        }}
      >
        {/* Header + Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <Activity className="w-4 h-4 text-[var(--accent)] shrink-0" />
              <h4 className="text-base font-bold text-[var(--text)] font-display tracking-tight">
                Contribution Calendar
              </h4>
              <span className="text-xs font-mono text-[var(--text-muted)] tabular-nums">
                · {calendar.totalContributions} contributions across 53 weeks
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Interactive D3.js telemetry matrix computed from verified GitHub activity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div
              className="flex items-center gap-1 p-1 rounded-[6px] border"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
              role="group"
              aria-label="Heatmap day filter"
            >
              <button
                type="button"
                onClick={() => setFilterMode("all")}
                className={`min-h-[36px] [@media(pointer:coarse)]:min-h-[44px] px-2.5 py-1 text-[11px] font-mono rounded-[4px] transition-colors cursor-pointer whitespace-nowrap ${
                  filterMode === "all"
                    ? "bg-[var(--accent-fill)] text-[var(--accent-contrast)] font-semibold"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                All Days
              </button>
              <button
                type="button"
                onClick={() => setFilterMode("active")}
                className={`min-h-[36px] [@media(pointer:coarse)]:min-h-[44px] px-2.5 py-1 text-[11px] font-mono rounded-[4px] transition-colors cursor-pointer whitespace-nowrap ${
                  filterMode === "active"
                    ? "bg-[var(--accent-fill)] text-[var(--accent-contrast)] font-semibold"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                Active Only
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-muted)]">
              <span>Less</span>
              {[0, 1, 3, 6, 10].map((sample) => (
                <span
                  key={sample}
                  className="w-2.5 h-2.5 rounded-[2px] border"
                  style={{
                    backgroundColor: colorScale.fill(sample),
                    borderColor: colorScale.stroke(sample),
                  }}
                />
              ))}
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Summary KPI Strip derived cleanly from real calendar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="hairline-row py-2.5 px-3 border rounded-[6px] border-[var(--border)] bg-[var(--surface)]/40">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
              <CalendarDays className="w-3 h-3 text-[var(--accent)]" />
              Active Days
            </span>
            <p className="text-lg font-bold font-display text-[var(--text)] tabular-nums mt-0.5">
              {analytics.activeDays}
            </p>
          </div>
          <div className="hairline-row py-2.5 px-3 border rounded-[6px] border-[var(--border)] bg-[var(--surface)]/40">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[var(--accent)]" />
              Peak Output Day
            </span>
            <p className="text-lg font-bold font-display text-[var(--text)] tabular-nums mt-0.5">
              {analytics.peakDay ? `${analytics.peakDay.count} commits` : "0"}
            </p>
          </div>
          <div className="hairline-row py-2.5 px-3 border rounded-[6px] border-[var(--border)] bg-[var(--surface)]/40">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
              <Flame className="w-3 h-3 text-[var(--accent)]" />
              Longest Streak
            </span>
            <p className="text-lg font-bold font-display text-[var(--text)] tabular-nums mt-0.5">
              {analytics.longestStreak} {analytics.longestStreak === 1 ? "day" : "days"}
            </p>
          </div>
          <div className="hairline-row py-2.5 px-3 border rounded-[6px] border-[var(--border)] bg-[var(--surface)]/40">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-[var(--accent)]" />
              Current Streak
            </span>
            <p className="text-lg font-bold font-display text-[var(--text)] tabular-nums mt-0.5">
              {analytics.currentStreak} {analytics.currentStreak === 1 ? "day" : "days"}
            </p>
          </div>
        </div>

        {/* D3 SVG Contribution Matrix */}
        <div className="relative overflow-x-auto pb-2 scrollbar-thin">
          <svg
            ref={svgRef}
            width={svgWidth}
            height={svgHeight}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="block max-w-none select-none"
            role="img"
            aria-label={`GitHub contribution heatmap showing ${calendar.totalContributions} contributions over 53 weeks`}
          />

          {/* Live Inspection Readout Bar */}
          <div className="min-h-[26px] mt-3 pt-2 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <AnimatePresence mode="wait">
              {inspectedDay ? (
                <motion.span
                  key={inspectedDay.date}
                  initial={prefersReduced ? false : { opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReduced ? undefined : { opacity: 0, y: -3 }}
                  transition={{
                    duration: prefersReduced ? 0 : MOTION_DURATION.fast,
                    ease: MOTION_EASE.out,
                  }}
                  className="text-[var(--text-secondary)]"
                >
                  <strong className="text-[var(--accent)] font-semibold tabular-nums">
                    {inspectedDay.count}
                  </strong>{" "}
                  {inspectedDay.count === 1 ? "contribution" : "contributions"} on{" "}
                  <span className="text-[var(--text)]">{formattedInspectedDate}</span>
                  {selectedDay?.date === inspectedDay.date && (
                    <button
                      type="button"
                      onClick={() => setSelectedDay(null)}
                      className="ml-2.5 min-h-[32px] [@media(pointer:coarse)]:min-h-[44px] inline-flex items-center text-[11px] text-[var(--accent)] hover:underline cursor-pointer"
                    >
                      Clear selection
                    </button>
                  )}
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={prefersReduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={prefersReduced ? undefined : { opacity: 0 }}
                  transition={{ duration: prefersReduced ? 0 : MOTION_DURATION.fast }}
                  className="text-[var(--text-muted)] text-[11px]"
                >
                  Hover, focus, or click any cell to inspect daily GitHub commit counts
                </motion.span>
              )}
            </AnimatePresence>
            <span className="text-[var(--text-muted)] text-[11px] tabular-nums">
              {analytics.peakDay
                ? `Peak: ${analytics.peakDay.count} on ${analytics.peakDay.date}`
                : "D3 v7 GraphQL telemetry"}
            </span>
          </div>
        </div>
      </section>
    </EditorialReveal>
  );
});

export default GitHubContributionGraph;
