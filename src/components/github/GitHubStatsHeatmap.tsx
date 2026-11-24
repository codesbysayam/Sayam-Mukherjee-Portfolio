import { memo, useEffect, useId, useMemo, useRef, useState } from "react";
import { select } from "d3-selection";
import { scaleBand, scaleThreshold } from "d3-scale";
import { Activity, Calendar, Flame } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { GitHubContributionWeek } from "../../data/githubTypes";
import { EditorialReveal } from "../../motion/Reveal";
import { usePrefersReducedMotion } from "../../motion/tokens";

export interface ContributionDayDatum {
  date: string;
  count: number;
  color?: string;
  level?: number;
}

export interface ContributionCalendarData {
  totalContributions?: number;
  weeks: GitHubContributionWeek[];
}

export type ContributionDataInput =
  | ContributionCalendarData
  | ContributionDayDatum[]
  | null
  | undefined;

export interface GitHubStatsHeatmapProps {
  contributions: ContributionDataInput;
  totalContributions?: number;
  title?: string;
  subtitle?: string;
  className?: string;
}

interface NormalizedHeatmapCell {
  date: string;
  count: number;
  weekIndex: number;
  dayOfWeek: number;
}

interface NormalizedHeatmapGrid {
  cells: NormalizedHeatmapCell[];
  weekCount: number;
  total: number;
  activeDays: number;
  maxCount: number;
  peakDay: NormalizedHeatmapCell | null;
  monthMarkers: Array<{ label: string; weekIndex: number }>;
}

const WEEKDAY_LABELS: ReadonlyArray<{ label: string; row: number }> = [
  { label: "Mon", row: 1 },
  { label: "Wed", row: 3 },
  { label: "Fri", row: 5 },
];

function parseUtcDayIndex(dateStr: string, fallback: number): number {
  const parsed = Date.parse(`${dateStr}T00:00:00Z`);
  if (Number.isNaN(parsed)) return fallback;
  return new Date(parsed).getUTCDay();
}

function normalizeContributions(
  input: ContributionDataInput,
  explicitTotal?: number
): NormalizedHeatmapGrid {
  const cells: NormalizedHeatmapCell[] = [];
  let weekCount = 0;

  if (Array.isArray(input)) {
    const sorted = [...input].sort((a, b) => a.date.localeCompare(b.date));
    let currentWeek = -1;
    let prevWeekKey = "";

    sorted.forEach((day, index) => {
      const parsedMs = Date.parse(`${day.date}T00:00:00Z`);
      const dayOfWeek = Number.isNaN(parsedMs)
        ? index % 7
        : new Date(parsedMs).getUTCDay();

      // Anchor weeks to Sunday boundaries when valid dates are provided
      if (!Number.isNaN(parsedMs)) {
        const sundayMs = parsedMs - dayOfWeek * 86_400_000;
        const weekKey = new Date(sundayMs).toISOString().slice(0, 10);
        if (weekKey !== prevWeekKey) {
          currentWeek += 1;
          prevWeekKey = weekKey;
        }
      } else {
        currentWeek = Math.floor(index / 7);
      }

      cells.push({
        date: day.date,
        count: Math.max(0, Number(day.count) || 0),
        weekIndex: Math.max(0, currentWeek),
        dayOfWeek,
      });
    });

    weekCount = cells.length > 0 ? cells[cells.length - 1].weekIndex + 1 : 0;
  } else if (input && Array.isArray(input.weeks)) {
    weekCount = input.weeks.length;
    input.weeks.forEach((week, weekIndex) => {
      const days = Array.isArray(week.contributionDays)
        ? week.contributionDays
        : [];
      days.forEach((day, dIdx) => {
        const dayOfWeek = parseUtcDayIndex(day.date, dIdx % 7);
        cells.push({
          date: day.date,
          count: Math.max(0, Number(day.count) || 0),
          weekIndex,
          dayOfWeek,
        });
      });
    });
  }

  let sum = 0;
  let activeDays = 0;
  let maxCount = 0;
  let peakDay: NormalizedHeatmapCell | null = null;

  for (const cell of cells) {
    sum += cell.count;
    if (cell.count > 0) activeDays += 1;
    if (cell.count >= maxCount && cell.count > 0) {
      maxCount = cell.count;
      peakDay = cell;
    }
  }

  const calendarTotal =
    !Array.isArray(input) && typeof input?.totalContributions === "number"
      ? input.totalContributions
      : undefined;

  const total =
    typeof explicitTotal === "number"
      ? explicitTotal
      : typeof calendarTotal === "number"
      ? calendarTotal
      : sum;

  // Compute month markers separated by at least 3 columns to prevent text overlap
  const monthMarkers: Array<{ label: string; weekIndex: number }> = [];
  let lastMonth = -1;
  let lastMarkerWeek = -4;

  const firstCellPerWeek = new Map<number, NormalizedHeatmapCell>();
  for (const cell of cells) {
    if (!firstCellPerWeek.has(cell.weekIndex)) {
      firstCellPerWeek.set(cell.weekIndex, cell);
    }
  }

  for (let w = 0; w < weekCount; w++) {
    const sample = firstCellPerWeek.get(w);
    if (!sample) continue;
    const ms = Date.parse(`${sample.date}T00:00:00Z`);
    if (Number.isNaN(ms)) continue;
    const dateObj = new Date(ms);
    const month = dateObj.getUTCMonth();
    if (month !== lastMonth && w - lastMarkerWeek >= 3 && w < weekCount - 1) {
      lastMonth = month;
      lastMarkerWeek = w;
      monthMarkers.push({
        label: dateObj.toLocaleDateString("en-US", {
          month: "short",
          timeZone: "UTC",
        }),
        weekIndex: w,
      });
    }
  }

  return {
    cells,
    weekCount,
    total,
    activeDays,
    maxCount,
    peakDay,
    monthMarkers,
  };
}

function buildPalette(isDark: boolean): {
  fills: [string, string, string, string, string];
  idleStroke: string;
  activeStroke: string;
  hoverStroke: string;
  axisFill: string;
} {
  if (isDark) {
    return {
      fills: [
        "color-mix(in srgb, var(--color-paper) 7%, var(--color-ink))",
        "color-mix(in srgb, var(--color-signal) 26%, var(--color-ink))",
        "color-mix(in srgb, var(--color-signal) 52%, var(--color-ink))",
        "color-mix(in srgb, var(--color-signal) 78%, var(--color-ink))",
        "var(--color-signal)",
      ],
      idleStroke: "color-mix(in srgb, var(--color-paper) 15%, var(--color-ink))",
      activeStroke: "color-mix(in srgb, var(--color-signal) 45%, var(--color-ink))",
      hoverStroke: "var(--color-paper)",
      axisFill: "color-mix(in srgb, var(--color-paper) 64%, var(--color-ink))",
    };
  }

  return {
    fills: [
      "color-mix(in srgb, var(--color-ink) 7%, var(--color-paper))",
      "color-mix(in srgb, var(--color-signal) 34%, var(--color-paper))",
      "color-mix(in srgb, var(--color-signal) 64%, var(--color-paper))",
      "color-mix(in srgb, var(--color-signal) 78%, var(--color-ink))",
      "var(--color-signal)",
    ],
    idleStroke: "color-mix(in srgb, var(--color-ink) 16%, var(--color-paper))",
    activeStroke: "color-mix(in srgb, var(--color-ink) 32%, var(--color-signal))",
    hoverStroke: "var(--color-ink)",
    axisFill: "color-mix(in srgb, var(--color-ink) 68%, var(--color-paper))",
  };
}

function formatReadableDate(dateStr: string): string {
  const ms = Date.parse(`${dateStr}T00:00:00Z`);
  if (Number.isNaN(ms)) return dateStr;
  return new Date(ms).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export const GitHubStatsHeatmap = memo(function GitHubStatsHeatmap({
  contributions,
  totalContributions,
  title = "Contribution Activity Matrix",
  subtitle,
  className = "",
}: GitHubStatsHeatmapProps) {
  const { theme } = usePortfolio();
  const isDark = theme === "dark";
  const prefersReduced = usePrefersReducedMotion();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const titleId = useId();
  const descId = useId();

  const [inspectedDay, setInspectedDay] = useState<NormalizedHeatmapCell | null>(
    null
  );

  const grid = useMemo(
    () => normalizeContributions(contributions, totalContributions),
    [contributions, totalContributions]
  );

  const palette = useMemo(() => buildPalette(isDark), [isDark]);

  // Threshold scale calibrated dynamically to peak daily volume
  const thresholds = useMemo<[number, number, number, number]>(() => {
    const peak = Math.max(8, grid.maxCount);
    return [
      1,
      Math.max(2, Math.round(peak * 0.28)),
      Math.max(4, Math.round(peak * 0.56)),
      Math.max(7, Math.round(peak * 0.82)),
    ];
  }, [grid.maxCount]);

  const colorScale = useMemo(
    () =>
      scaleThreshold<number, string>()
        .domain(thresholds)
        .range(palette.fills),
    [thresholds, palette.fills]
  );

  const legendSamples = useMemo(
    () => [0, thresholds[0], thresholds[1], thresholds[2], thresholds[3]],
    [thresholds]
  );

  useEffect(() => {
    const svgNode = svgRef.current;
    if (!svgNode || grid.cells.length === 0 || grid.weekCount === 0) return;

    const marginLeft = 34;
    const marginTop = 22;
    const marginRight = 6;
    const marginBottom = 6;
    const pitch = 15;
    const gridWidth = Math.max(150, grid.weekCount * pitch);
    const gridHeight = 7 * pitch;
    const totalWidth = marginLeft + gridWidth + marginRight;
    const totalHeight = marginTop + gridHeight + marginBottom;

    const weekDomain = Array.from({ length: grid.weekCount }, (_, idx) => idx);
    const xScale = scaleBand<number>()
      .domain(weekDomain)
      .range([0, gridWidth])
      .paddingInner(0.22);

    const yScale = scaleBand<number>()
      .domain([0, 1, 2, 3, 4, 5, 6])
      .range([0, gridHeight])
      .paddingInner(0.22);

    const cellWidth = Math.max(8, xScale.bandwidth());
    const cellHeight = Math.max(8, yScale.bandwidth());

    const svg = select(svgNode)
      .attr("viewBox", `0 0 ${totalWidth} ${totalHeight}`)
      .attr("width", "100%")
      .attr("role", "grid")
      .attr("aria-labelledby", `${titleId} ${descId}`);

    // Clear and rebuild deterministic D3 layers on data/theme updates
    svg.selectAll("g.heatmap-layer").remove();

    const rootGroup = svg
      .append("g")
      .attr("class", "heatmap-layer")
      .attr("transform", `translate(${marginLeft}, ${marginTop})`);

    // Month column labels anchored to scaleBand positions
    svg
      .append("g")
      .attr("class", "heatmap-layer")
      .attr("transform", `translate(${marginLeft}, ${marginTop - 8})`)
      .selectAll<SVGTextElement, { label: string; weekIndex: number }>(
        "text.month-label"
      )
      .data(grid.monthMarkers, (d) => `${d.label}-${d.weekIndex}`)
      .join("text")
      .attr("class", "month-label")
      .attr("x", (d) => xScale(d.weekIndex) ?? 0)
      .attr("y", 0)
      .attr("fill", palette.axisFill)
      .attr("font-size", "10px")
      .attr("font-family", "var(--font-mono)")
      .text((d) => d.label);

    // Weekday row labels anchored vertically via yScale
    svg
      .append("g")
      .attr("class", "heatmap-layer")
      .attr("transform", `translate(${marginLeft - 6}, ${marginTop})`)
      .selectAll<SVGTextElement, { label: string; row: number }>(
        "text.day-label"
      )
      .data(WEEKDAY_LABELS, (d) => d.label)
      .join("text")
      .attr("class", "day-label")
      .attr("x", 0)
      .attr("y", (d) => (yScale(d.row) ?? 0) + cellHeight * 0.78)
      .attr("text-anchor", "end")
      .attr("fill", palette.axisFill)
      .attr("font-size", "10.5px")
      .attr("font-family", "var(--font-mono)")
      .text((d) => d.label);

    // Contribution cells joined via d3-selection and colored via d3-scale
    const cellSelection = rootGroup
      .selectAll<SVGRectElement, NormalizedHeatmapCell>("rect.heatmap-cell")
      .data(grid.cells, (d) => `${d.weekIndex}-${d.dayOfWeek}-${d.date}`)
      .join("rect")
      .attr("class", "heatmap-cell")
      .attr("x", (d) => xScale(d.weekIndex) ?? 0)
      .attr("y", (d) => yScale(d.dayOfWeek) ?? 0)
      .attr("width", cellWidth)
      .attr("height", cellHeight)
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("fill", (d) => colorScale(d.count))
      .attr("stroke", (d) =>
        d.count > 0 ? palette.activeStroke : palette.idleStroke
      )
      .attr("stroke-width", 1)
      .attr("tabindex", 0)
      .attr("role", "gridcell")
      .attr(
        "aria-label",
        (d) =>
          `${d.count} ${
            d.count === 1 ? "contribution" : "contributions"
          } on ${d.date}`
      )
      .style("cursor", "pointer")
      .style(
        "transition",
        prefersReduced
          ? "none"
          : "stroke 140ms ease, stroke-width 140ms ease, opacity 140ms ease"
      );

    cellSelection.append("title").text((d) => {
      const noun = d.count === 1 ? "contribution" : "contributions";
      return `${d.count} ${noun} on ${formatReadableDate(d.date)}`;
    });

    const highlightCell = (el: SVGRectElement, datum: NormalizedHeatmapCell) => {
      select(el)
        .attr("stroke", palette.hoverStroke)
        .attr("stroke-width", 1.75);
      setInspectedDay(datum);
    };

    const resetCell = (el: SVGRectElement, datum: NormalizedHeatmapCell) => {
      select(el)
        .attr(
          "stroke",
          datum.count > 0 ? palette.activeStroke : palette.idleStroke
        )
        .attr("stroke-width", 1);
      setInspectedDay(null);
    };

    cellSelection
      .on("mouseenter", function (_event, d) {
        highlightCell(this, d);
      })
      .on("mouseleave", function (_event, d) {
        resetCell(this, d);
      })
      .on("focus", function (_event, d) {
        highlightCell(this, d);
      })
      .on("blur", function (_event, d) {
        resetCell(this, d);
      })
      .on("click", function (_event, d) {
        highlightCell(this, d);
      })
      .on("keydown", function (event: KeyboardEvent, d) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          highlightCell(this, d);
        }
      });
  }, [
    grid,
    colorScale,
    palette,
    prefersReduced,
    titleId,
    descId,
  ]);

  if (grid.cells.length === 0) {
    return (
      <div
        className={`card p-6 sm:p-8 text-center space-y-3 ${className}`}
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
            color: "var(--color-signal)",
          }}
        >
          <Activity className="w-5 h-5" aria-hidden="true" />
        </div>
        <h4 className="text-sm font-bold text-[var(--text)] font-display">
          {title}
        </h4>
        <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">
          No contribution timeline entries are available yet for this window.
        </p>
      </div>
    );
  }

  return (
    <EditorialReveal>
      <section
        aria-labelledby={titleId}
        className={`card p-5 sm:p-7 space-y-5 min-w-0 overflow-hidden ${className}`}
        style={{
          backgroundColor: isDark ? "var(--color-ink)" : "var(--color-paper)",
          color: isDark ? "var(--color-paper)" : "var(--color-ink)",
          borderColor: isDark
            ? "color-mix(in srgb, var(--color-paper) 16%, var(--color-ink))"
            : "color-mix(in srgb, var(--color-ink) 16%, var(--color-paper))",
        }}
      >
        {/* Header & Theme-Aware Scale Legend */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-4"
          style={{
            borderColor: isDark
              ? "color-mix(in srgb, var(--color-paper) 14%, var(--color-ink))"
              : "color-mix(in srgb, var(--color-ink) 14%, var(--color-paper))",
          }}
        >
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Calendar
                className="w-4 h-4 shrink-0"
                style={{
                  color: isDark ? "var(--color-signal)" : "var(--accent)",
                }}
                aria-hidden="true"
              />
              <h4
                id={titleId}
                className="text-base font-bold font-display tracking-tight"
              >
                {title}
              </h4>
              <span
                className="text-xs font-mono tabular-nums opacity-75"
                id={descId}
              >
                · {grid.total.toLocaleString()} contributions across{" "}
                {grid.weekCount} weeks
              </span>
            </div>
            {subtitle && (
              <p className="text-xs opacity-70 font-sans">{subtitle}</p>
            )}
          </div>

          {/* Swatches generated strictly from d3-scale */}
          <div
            className="flex items-center gap-1.5 text-[11px] font-mono opacity-80"
            aria-label="Contribution intensity legend"
          >
            <span>Less</span>
            {legendSamples.map((sample, idx) => (
              <span
                key={idx}
                className="w-3 h-3 rounded-[2px] border"
                style={{
                  backgroundColor: colorScale(sample),
                  borderColor:
                    sample > 0 ? palette.activeStroke : palette.idleStroke,
                }}
              />
            ))}
            <span>More</span>
          </div>
        </div>

        {/* D3 Contribution Grid */}
        <div className="relative overflow-x-auto pb-1 scrollbar-thin">
          <div className="min-w-[580px] sm:min-w-0 select-none">
            <svg ref={svgRef} className="block w-full h-auto overflow-visible" />
          </div>
        </div>

        {/* Footer Telemetry & Live Inspection Strip */}
        <div
          className="pt-3 border-t flex flex-wrap items-center justify-between gap-3 text-xs font-mono"
          style={{
            borderColor: isDark
              ? "color-mix(in srgb, var(--color-paper) 14%, var(--color-ink))"
              : "color-mix(in srgb, var(--color-ink) 14%, var(--color-paper))",
          }}
        >
          <div aria-live="polite" className="min-h-[20px] flex items-center">
            {inspectedDay ? (
              <span>
                <strong
                  className="font-bold tabular-nums"
                  style={{
                    color: isDark ? "var(--color-signal)" : "var(--accent)",
                  }}
                >
                  {inspectedDay.count}
                </strong>{" "}
                {inspectedDay.count === 1 ? "contribution" : "contributions"} on{" "}
                <span className="font-medium">
                  {formatReadableDate(inspectedDay.date)}
                </span>
              </span>
            ) : (
              <span className="opacity-65">
                Hover, focus, or tap any cell to inspect daily activity
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] opacity-80 tabular-nums">
            <span>{grid.activeDays} active days</span>
            {grid.peakDay && (
              <span className="inline-flex items-center gap-1">
                <Flame
                  className="w-3.5 h-3.5"
                  style={{
                    color: isDark ? "var(--color-signal)" : "var(--accent)",
                  }}
                  aria-hidden="true"
                />
                Peak: {grid.peakDay.count} ({grid.peakDay.date})
              </span>
            )}
          </div>
        </div>
      </section>
    </EditorialReveal>
  );
});

export default GitHubStatsHeatmap;
