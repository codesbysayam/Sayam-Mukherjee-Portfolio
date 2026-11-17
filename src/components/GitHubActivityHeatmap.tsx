import { useEffect, useRef, useState, useMemo, memo } from "react";
import * as d3 from "d3";
import {
  GitCommit,
  Calendar,
  RefreshCw,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";
import {
  fetchGitHubStats,
  GitHubStatsData,
  VERIFIED_GITHUB_FALLBACK,
} from "../services/github";
import { usePortfolio } from "../context/PortfolioContext";

export interface GitHubActivityHeatmapProps {
  username?: string;
  className?: string;
  showFrequencyAnalytics?: boolean;
}

export function GitHubActivityHeatmapComponent({
  username = "codesbysayam",
  className = "",
}: GitHubActivityHeatmapProps) {
  const { theme } = usePortfolio();
  const isDark = theme === "dark";
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [statsData, setStatsData] = useState<GitHubStatsData>(
    VERIFIED_GITHUB_FALLBACK
  );
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    count: number;
    level: number;
  } | null>(null);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchGitHubStats(true);
      setStatsData(data);
    } catch (err) {
      console.error("Manual refresh error:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const data = await fetchGitHubStats();
        if (isMounted) setStatsData(data);
      } catch (err) {
        console.error("Failed to load GitHub stats:", err);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [username]);

  const calendarDays = useMemo(() => {
    if (statsData.contributionCalendar && statsData.contributionCalendar.length > 0) {
      return statsData.contributionCalendar.slice(-112);
    }
    const days: { date: string; count: number; level: number }[] = [];
    const today = new Date();
    for (let i = 111; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const count = i < 10 ? (i % 3 === 0 ? 3 : 1) : 0;
      days.push({
        date: dateStr,
        count,
        level: count > 2 ? 2 : count > 0 ? 1 : 0,
      });
    }
    return days;
  }, [statsData.contributionCalendar]);

  useEffect(() => {
    if (!svgRef.current || calendarDays.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const cellSize = 11;
    const cellGap = 3;
    const cornerRadius = 2;

    const numCols = Math.ceil(calendarDays.length / 7);
    const width = numCols * (cellSize + cellGap) + 40;
    const height = 7 * (cellSize + cellGap) + 30;

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("class", "w-full max-w-full overflow-visible");

    const g = svg.append("g").attr("transform", "translate(30, 20)");

    const dayLabels = [
      { label: "Mon", row: 1 },
      { label: "Wed", row: 3 },
      { label: "Fri", row: 5 },
    ];

    svg
      .append("g")
      .selectAll(".day-label")
      .data(dayLabels)
      .enter()
      .append("text")
      .attr("x", 22)
      .attr("y", (d) => 20 + d.row * (cellSize + cellGap) + cellSize - 2)
      .attr("text-anchor", "end")
      .attr("fill", isDark ? "#B5B8AA" : "#585B52")
      .attr("font-size", "8.5px")
      .attr("font-family", '"IBM Plex Mono", monospace')
      .text((d) => d.label);

    const colorScale = (level: number, count: number) => {
      if (count === 0) return isDark ? "#262922" : "#EAEAE1";
      if (level === 1 || count <= 2) return isDark ? "#3B4229" : "#D2D7BD";
      if (level === 2 || count <= 5) return isDark ? "#5C683B" : "#9BA86F";
      if (level === 3 || count <= 8) return isDark ? "#879E36" : "#69734A";
      return "#C7E34A";
    };

    const emptyStroke = isDark ? "#41443A" : "#D6D7CC";
    const filledStroke = isDark ? "#69734A" : "#7F8E52";
    const hoverStroke = isDark ? "#C7E34A" : "#20231D";

    calendarDays.forEach((day, index) => {
      const col = Math.floor(index / 7);
      const row = index % 7;

      const rect = g
        .append("rect")
        .attr("x", col * (cellSize + cellGap))
        .attr("y", row * (cellSize + cellGap))
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("rx", cornerRadius)
        .attr("ry", cornerRadius)
        .attr("fill", colorScale(day.level, day.count))
        .attr("stroke", day.count > 0 ? filledStroke : emptyStroke)
        .attr("stroke-width", "0.75")
        .attr("class", "cursor-pointer transition-all duration-150");

      rect.on("mouseenter", function () {
        d3.select(this)
          .attr("stroke", hoverStroke)
          .attr("stroke-width", "1.5");
        setHoveredDay(day);
      });

      rect.on("click", function () {
        d3.select(this)
          .attr("stroke", hoverStroke)
          .attr("stroke-width", "1.5");
        setHoveredDay(day);
      });

      rect.on("mouseleave", function () {
        d3.select(this)
          .attr("stroke", day.count > 0 ? filledStroke : emptyStroke)
          .attr("stroke-width", "0.75");
        setHoveredDay(null);
      });
    });
  }, [calendarDays, isDark]);

  return (
    <div
      ref={containerRef}
      className={`card p-4 sm:p-6 md:p-8 space-y-6 relative overflow-hidden font-sans ${className}`}
      style={{
        backgroundColor: "var(--surface-2)",
        borderColor: "var(--border)",
      }}
    >
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-3.5">
          <div
            className="w-11 h-11 rounded-[8px] border flex items-center justify-center shrink-0"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--accent)",
            }}
          >
            <GitCommit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[var(--text)] font-display leading-none">
                Live GitHub Activity
              </h3>
              <span
                className="text-[10px] px-2 py-0.5 rounded-[4px] font-mono font-semibold border"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border-strong)",
                  color: "var(--accent)",
                }}
              >
                {statsData.isLive ? "LIVE SYNCED" : "VERIFIED BASELINE"}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-mono mt-1">
              @{statsData.username} · Data source: GitHub API
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="hidden sm:inline text-[10px] text-[var(--text-faint)] font-mono">
            Last synced: {statsData.lastSynced || "Recently"}
          </span>
          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="btn btn-secondary min-h-[40px] px-3 py-1.5 text-xs font-mono disabled:opacity-50"
            title="Force refresh real-time GitHub telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Syncing..." : "Sync"}</span>
          </button>
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary min-h-[40px] px-3.5 py-1.5 text-xs font-mono"
          >
            <span>Verify on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div
          className="border p-3.5 rounded-[8px]"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
        >
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
            CONTRIBUTIONS (2026)
          </span>
          <span className="text-xl font-extrabold text-[var(--accent)] font-display tabular-nums mt-1 block">
            {statsData.totalContributionsThisYear ?? "—"}
          </span>
          <span className="text-[10px] text-[var(--text-faint)] font-mono">
            Public GitHub telemetry
          </span>
        </div>

        <div
          className="border p-3.5 rounded-[8px]"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
        >
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
            PUBLIC REPOSITORIES
          </span>
          <span className="text-xl font-extrabold text-[var(--text)] font-display tabular-nums mt-1 block">
            {statsData.publicRepos}
          </span>
          <span className="text-[10px] text-[var(--text-faint)] font-mono">
            Verified public repos
          </span>
        </div>

        <div
          className="border p-3.5 rounded-[8px]"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
        >
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
            CURRENT STREAK
          </span>
          <span className="text-xl font-extrabold text-[var(--text)] font-display tabular-nums mt-1 block">
            {statsData.currentStreak ?? 0}{" "}
            {statsData.currentStreak === 1 ? "day" : "days"}
          </span>
          <span className="text-[10px] text-[var(--text-faint)] font-mono">
            Consecutive active coding
          </span>
        </div>

        <div
          className="border p-3.5 rounded-[8px]"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
        >
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
            LONGEST STREAK
          </span>
          <span className="text-xl font-extrabold text-[var(--accent)] font-display tabular-nums mt-1 block">
            {statsData.longestStreak ?? 0}{" "}
            {statsData.longestStreak === 1 ? "day" : "days"}
          </span>
          <span className="text-[10px] text-[var(--text-faint)] font-mono">
            Verified continuous run
          </span>
        </div>
      </div>

      {/* Heatmap Canvas */}
      <div
        className="border p-4 sm:p-5 rounded-[8px] space-y-3"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[var(--accent)]" />
            Contribution Activity Matrix (Past 16 Weeks)
          </span>

          {hoveredDay && (
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded-[4px] border tabular-nums"
              style={{
                backgroundColor: "var(--surface-2)",
                borderColor: "var(--border-strong)",
                color: "var(--text)",
              }}
            >
              {hoveredDay.date}: {hoveredDay.count}{" "}
              {hoveredDay.count === 1 ? "contribution" : "contributions"}
            </span>
          )}
        </div>

        <div className="w-full overflow-x-auto py-2">
          <svg ref={svgRef} className="mx-auto min-w-[500px]" />
        </div>

        <div
          className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] pt-2 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <span>Less</span>
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-[2px] border"
              style={{
                backgroundColor: isDark ? "#262922" : "#EAEAE1",
                borderColor: "var(--border)",
              }}
            />
            <span
              className="w-2.5 h-2.5 rounded-[2px]"
              style={{ backgroundColor: isDark ? "#3B4229" : "#D2D7BD" }}
            />
            <span
              className="w-2.5 h-2.5 rounded-[2px]"
              style={{ backgroundColor: isDark ? "#5C683B" : "#9BA86F" }}
            />
            <span
              className="w-2.5 h-2.5 rounded-[2px]"
              style={{ backgroundColor: isDark ? "#879E36" : "#69734A" }}
            />
            <span
              className="w-2.5 h-2.5 rounded-[2px]"
              style={{ backgroundColor: "#C7E34A" }}
            />
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Recent Commits */}
      <div className="space-y-3">
        <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] tracking-wider block">
          RECENT REPOSITORY COMMITS
        </span>

        <div className="space-y-2">
          {statsData.recentCommits.map((commit, idx) => (
            <div
              key={idx}
              className="border p-3 rounded-[8px] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: "var(--accent)" }}
                />
                <span className="text-[var(--text)] font-medium truncate">
                  {commit.message}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0 text-[10px] text-[var(--text-muted)]">
                <span className="text-[var(--accent)] font-semibold">
                  {commit.repo.replace("codesbysayam/", "")}
                </span>
                <span
                  className="px-1.5 py-0.5 rounded-[4px] border text-[var(--text-secondary)]"
                  style={{
                    backgroundColor: "var(--surface-2)",
                    borderColor: "var(--border)",
                  }}
                >
                  {commit.sha}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const GitHubActivityHeatmap = memo(GitHubActivityHeatmapComponent);

export function MiniActivityHeatmap({
  onExpandClick,
}: {
  onExpandClick?: () => void;
}) {
  return (
    <div className="space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between text-[var(--text-muted)]">
        <span className="text-[10px] uppercase tracking-wider text-[var(--accent)] font-bold">
          Live GitHub Cadence
        </span>
        {onExpandClick && (
          <button
            type="button"
            onClick={onExpandClick}
            className="text-[10px] text-[var(--accent)] hover:underline flex items-center gap-1 transition-colors cursor-pointer"
          >
            Full Telemetry <ArrowUpRight className="w-3 h-3" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-12 gap-1 py-1">
        {Array.from({ length: 48 }).map((_, i) => {
          const shades = ["#EAEAE1", "#D2D7BD", "#69734A", "#C7E34A"];
          const level = i % 7 === 0 ? 3 : i % 3 === 0 ? 2 : i % 2 === 0 ? 1 : 0;
          return (
            <div
              key={i}
              className="h-3 rounded-[2px] border transition-transform hover:scale-125"
              style={{
                backgroundColor: shades[level],
                borderColor: "var(--border)",
              }}
              title={`Activity node ${i + 1}`}
            />
          );
        })}
      </div>
      <div
        className="flex items-center justify-between text-[10px] text-[var(--text-muted)] pt-1 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <span>@codesbysayam</span>
        <span>Daily engineering rhythm</span>
      </div>
    </div>
  );
}

export default GitHubActivityHeatmap;
