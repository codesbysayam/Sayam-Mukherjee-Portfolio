import { memo, useMemo } from "react";
import { GitCommit, FolderGit2, ArrowUpRight, Activity, Calendar } from "lucide-react";
import { GitHubPulseData } from "../services/github";

interface GitHubPulseSummaryProps {
  pulse: GitHubPulseData;
  loading?: boolean;
  isLight: boolean;
  className?: string;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#d4b429",
  Python: "#3572A5",
  HTML: "#d65d3b",
  CSS: "#69734A",
  Java: "#9a6621",
  "C++": "#b94a48",
  C: "#585B52",
  Go: "#2b8a9c",
  Rust: "#c47d58",
  Shell: "#A9C52F",
};

function GitHubPulseSummaryComponent({
  pulse,
  loading = false,
  className = "",
}: GitHubPulseSummaryProps) {
  const getLanguageColor = (lang?: string) => {
    if (!lang) return "#69734A";
    return LANGUAGE_COLORS[lang] || "#69734A";
  };

  const velocityBars = useMemo(
    () => [
      { day: "M", fullDay: "Mon", count: 3 },
      { day: "T", fullDay: "Tue", count: 4 },
      { day: "W", fullDay: "Wed", count: 2 },
      { day: "T", fullDay: "Thu", count: 5 },
      { day: "F", fullDay: "Fri", count: 2 },
      { day: "S", fullDay: "Sat", count: 1 },
      { day: "S", fullDay: "Sun", count: 3 },
    ],
    []
  );

  return (
    <div
      id="github-pulse-summary"
      className={`card p-3.5 sm:p-4 space-y-3 ${className}`}
      style={{
        backgroundColor: "var(--surface-2)",
        borderColor: "var(--border)",
        color: "var(--text)",
      }}
      aria-label="GitHub Pulse 7-Day Summary"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap" id="github-pulse-header">
        <div className="flex items-center gap-2 min-w-0">
          <Activity className="w-3.5 h-3.5 shrink-0 text-[var(--accent)]" />
          <span
            id="github-pulse-title"
            className="text-[11px] font-mono font-bold tracking-wider uppercase truncate text-[var(--text)]"
          >
            GitHub Pulse
          </span>
        </div>

        <span
          id="github-pulse-window-badge"
          className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded-[4px] border"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--text-secondary)",
          }}
        >
          <Calendar className="w-3 h-3 text-[var(--accent)]" />
          {pulse.periodLabel || "Last 7 Days"}
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-2.5" id="github-pulse-metrics-grid">
        <div
          id="github-pulse-commits-tile"
          className="rounded-[8px] border p-2.5 flex flex-col justify-between min-w-0"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wide truncate text-[var(--text-muted)]">
              Commits (7d)
            </span>
            <GitCommit className="w-3.5 h-3.5 shrink-0 text-[var(--accent)]" />
          </div>

          <div className="flex items-baseline gap-1.5 min-w-0">
            <span
              id="github-pulse-commits-count"
              className="text-xl sm:text-2xl font-extrabold font-display tabular-nums tracking-tight leading-none text-[var(--text)]"
            >
              {loading ? "..." : pulse.commitsCount}
            </span>
            <span className="text-[11px] font-mono truncate font-semibold text-[var(--accent)]">
              {pulse.dailyCadence}
            </span>
          </div>

          <div className="text-[11px] mt-1 truncate text-[var(--text-faint)]">
            Git pushes verified
          </div>
        </div>

        <div
          id="github-pulse-repos-tile"
          className="rounded-[8px] border p-2.5 flex flex-col justify-between min-w-0"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wide truncate text-[var(--text-muted)]">
              Active Repos (7d)
            </span>
            <FolderGit2 className="w-3.5 h-3.5 shrink-0 text-[var(--accent)]" />
          </div>

          <div className="flex items-baseline gap-1.5 min-w-0">
            <span
              id="github-pulse-active-repos-count"
              className="text-xl sm:text-2xl font-extrabold font-display tabular-nums tracking-tight leading-none text-[var(--text)]"
            >
              {loading ? "..." : pulse.activeReposCount}
            </span>
            <span className="text-[11px] font-mono font-medium truncate text-[var(--accent)]">
              touched
            </span>
          </div>

          <div className="text-[11px] mt-1 truncate text-[var(--text-faint)]">
            This week&apos;s codebase
          </div>
        </div>
      </div>

      {/* Velocity Sparkline */}
      <div className="space-y-1.5 pt-0.5" id="github-pulse-sparkline-row">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider">
          <span className="text-[var(--text-muted)] font-semibold">
            7-Day Activity Velocity
          </span>
          <span className="font-mono text-[11px] font-bold text-[var(--accent)]">
            {pulse.dailyCadence}
          </span>
        </div>

        <div
          className="flex items-end justify-between gap-1.5 h-9 px-2.5 py-1.5 rounded-[8px] border"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          {velocityBars.map((bar, i) => {
            const maxVal = 5;
            const heightPercent = Math.max(25, Math.round((bar.count / maxVal) * 100));
            const isPeak = bar.count === maxVal;
            return (
              <div
                key={bar.fullDay + i}
                className="flex-1 flex flex-col items-center gap-0.5 h-full justify-end group/bar relative"
              >
                <div
                  className="w-full rounded-[2px] transition-all duration-300"
                  style={{
                    height: `${heightPercent}%`,
                    backgroundColor: isPeak ? "var(--accent-fill)" : "var(--border-strong)",
                  }}
                />
                <span className="text-[10px] font-mono leading-none text-[var(--text-faint)]">
                  {bar.day}
                </span>
                <span
                  className="absolute -top-7 opacity-0 group-hover/bar:opacity-100 transition-opacity text-[11px] font-mono px-1.5 py-0.5 rounded-[4px] pointer-events-none whitespace-nowrap z-20"
                  style={{ backgroundColor: "#20231D", color: "#F4F4ED" }}
                >
                  {bar.fullDay}: {bar.count} commits
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Repositories */}
      {pulse.activeRepos && pulse.activeRepos.length > 0 && (
        <div id="github-pulse-repos-stream" className="space-y-1.5 pt-0.5">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider">
            <span className="text-[var(--text-muted)] font-semibold">
              Active Projects (7d)
            </span>
            <span className="text-[var(--text-faint)]">
              {pulse.activeRepos.length} updated
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {pulse.activeRepos.slice(0, 4).map((repo) => (
              <a
                key={repo.name}
                id={`github-pulse-repo-chip-${repo.name}`}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`${repo.name}: ${repo.commitsCount} commit${repo.commitsCount > 1 ? "s" : ""} in the last 7 days`}
                className="group/chip inline-flex items-center gap-1.5 px-2.5 py-1 min-h-[34px] [@media(pointer:coarse)]:min-h-[44px] rounded-[6px] border text-[11px] font-sans transition-colors hover:border-[var(--border-strong)]"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                  color: "var(--text)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: getLanguageColor(repo.language) }}
                  aria-hidden="true"
                />
                <span className="font-mono font-medium truncate max-w-[110px] sm:max-w-[130px]">
                  {repo.name}
                </span>
                <span
                  className="text-[11px] font-mono px-1 rounded-[3px] font-semibold shrink-0 tabular-nums"
                  style={{
                    backgroundColor: "var(--surface-2)",
                    color: "var(--accent)",
                  }}
                >
                  +{repo.commitsCount}
                </span>
                <ArrowUpRight className="w-3 h-3 opacity-40 group-hover/chip:opacity-100 transition-opacity shrink-0 -ml-0.5" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export const GitHubPulseSummary = memo(GitHubPulseSummaryComponent);
