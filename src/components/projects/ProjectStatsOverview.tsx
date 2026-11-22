import { useState, useEffect, useMemo, memo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";
import {
  FolderGit2,
  Code2,
  Star,
  Layers,
  GitFork,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  Info,
} from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { useGitHubTelemetry } from "../../hooks/useGitHubTelemetry";
import {
  formatPercentage,
  formatBytesCompact,
  formatBytesAsKB,
  LANGUAGE_PALETTE,
  type GitHubTelemetry,
  type RepositoryMetric,
} from "../../services/githubTelemetry";
import {
  type GitHubRepo,
  type GitHubStatsData,
  type GitHubUser,
  type GitHubRawSnapshot,
} from "../../services/github";
import { EditorialReveal, StaggerGroup, StaggerItem } from "../../motion/Reveal";
import { usePrefersReducedMotion } from "../../motion/tokens";

interface ProjectStatsOverviewProps {
  repos?: GitHubRepo[];
  stats?: GitHubStatsData;
  user?: GitHubUser | null;
  snapshot?: GitHubRawSnapshot | null;
  loading?: boolean;
}

function formatDateShort(iso: string): string {
  if (!iso) return "Unavailable";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

function CustomLanguageTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;
  return (
    <div className="p-3 rounded-[8px] border border-[var(--border-strong)] bg-[var(--surface-2)] text-[var(--text)] text-xs font-mono shadow-lg min-w-[190px]">
      <div className="flex items-center gap-2 mb-1.5 pb-1 border-b border-[var(--border)]">
        <span
          className="w-2.5 h-2.5 rounded-[2px] inline-block shrink-0"
          style={{ backgroundColor: data.color }}
        />
        <span className="font-bold text-sm">{data.name}</span>
      </div>
      <div className="space-y-1 text-[var(--text-secondary)] tabular-nums">
        <div className="flex items-center justify-between gap-4">
          <span>Share:</span>
          <span className="font-bold text-[var(--text)]">{data.formattedPercentage}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Source Code:</span>
          <span className="font-bold text-[var(--text)]">{data.formattedCompact}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Exact Bytes:</span>
          <span className="text-[var(--text)]">{data.bytes.toLocaleString()} B</span>
        </div>
        <div className="flex items-center justify-between gap-4 pt-1 border-t border-[var(--border)]">
          <span>Owned Repos:</span>
          <span className="font-semibold text-[var(--accent)]">{data.repoCount}</span>
        </div>
      </div>
    </div>
  );
}

function CustomRepoTooltip({ active, payload, metricMode }: any) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;
  return (
    <div className="p-3.5 rounded-[8px] border border-[var(--border-strong)] bg-[var(--surface-2)] text-[var(--text)] text-xs font-mono shadow-lg min-w-[230px]">
      <div className="flex items-center justify-between gap-2 mb-1.5 pb-1.5 border-b border-[var(--border)]">
        <span className="font-bold text-[13px] break-all">{data.fullName}</span>
        <span className="text-[11px] text-[var(--text-muted)] shrink-0">
          {data.language || "Markdown"}
        </span>
      </div>
      <div className="space-y-1.5 text-[var(--text-secondary)] tabular-nums">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
            <span>Stars:</span>
          </span>
          <span className="font-bold text-[var(--text)]">{data.stars}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <GitFork className="w-3.5 h-3.5 text-[var(--text-muted)]" aria-hidden="true" />
            <span>Forks:</span>
          </span>
          <span className="font-bold text-[var(--text)]">{data.forks}</span>
        </div>
        <div className="flex items-center justify-between gap-4 pt-1 border-t border-[var(--border)]">
          <span>Language Code:</span>
          <span className="text-[var(--text)] font-medium">
            {data.codeBytes > 0 ? formatBytesCompact(data.codeBytes) : "0 B"}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>GitHub Repo Size:</span>
          <span className="text-[var(--text)] font-medium">
            {data.sizeKB.toLocaleString()} KB
          </span>
        </div>
        {metricMode === "volume" && data.isFork && (
          <div className="text-[11px] text-[var(--accent)] pt-0.5">
            Public fork (excluded from owned code total)
          </div>
        )}
        <div className="flex items-center justify-between gap-4 pt-1 border-t border-[var(--border)] text-[11px] text-[var(--text-muted)]">
          <span>Updated:</span>
          <span>{formatDateShort(data.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
}

function ProjectStatsOverviewComponent(_props: ProjectStatsOverviewProps) {
  const { theme } = usePortfolio();
  const isLight = theme === "light";
  const reduced = usePrefersReducedMotion();

  const { telemetry, loading, refreshing, error, refresh } = useGitHubTelemetry();

  const [repoMetric, setRepoMetric] = useState<"activity" | "volume">("activity");
  const [selectedRepoName, setSelectedRepoName] = useState<string | null>(null);
  const [showAllLanguages, setShowAllLanguages] = useState(false);
  const [isCompactViewport, setIsCompactViewport] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => setIsCompactViewport(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const axisColor = isLight ? "#51564A" : "#B5B8AA";
  const gridColor = isLight ? "#D4D4C7" : "#41483B";
  const primaryBarColor = isLight ? "#4D5E10" : "#C7E34A";
  const secondaryBarColor = isLight ? "#8D947E" : "#8EA82A";
  const repoSizeColor = isLight ? "#20231D" : "#7F8578";

  const languageRows = useMemo(() => {
    if (!telemetry?.languages) return [];
    return telemetry.languages.map((lang) => ({
      ...lang,
      formattedCompact: formatBytesCompact(lang.bytes),
      formattedKB: formatBytesAsKB(lang.bytes),
      color: LANGUAGE_PALETTE[lang.name] || lang.color || primaryBarColor,
    }));
  }, [telemetry?.languages, primaryBarColor]);

  const topLanguagesChart = useMemo(() => languageRows.slice(0, 8), [languageRows]);
  const topLanguage = languageRows[0];

  const repoRows = useMemo(() => {
    if (!telemetry?.repositories) return [];
    const sorted = [...telemetry.repositories].sort((a, b) => {
      if (repoMetric === "activity") {
        if (b.stars !== a.stars) return b.stars - a.stars;
        if (b.forks !== a.forks) return b.forks - a.forks;
        return new Date(b.pushedAt || b.updatedAt).getTime() - new Date(a.pushedAt || a.updatedAt).getTime();
      }
      if (b.codeBytes !== a.codeBytes) return b.codeBytes - a.codeBytes;
      return b.sizeKB - a.sizeKB;
    });

    return sorted.map((repo: RepositoryMetric) => ({
      ...repo,
      codeKB: Number((repo.codeBytes / 1024).toFixed(1)),
      label: repo.name,
    }));
  }, [telemetry?.repositories, repoMetric]);

  const selectedRepo = useMemo(() => {
    if (!repoRows.length) return null;
    if (selectedRepoName) {
      return repoRows.find((r) => r.name === selectedRepoName) || repoRows[0];
    }
    return repoRows[0];
  }, [repoRows, selectedRepoName]);

  const repoChartHeight = Math.max(300, repoRows.length * 31 + 32);

  if (loading) {
    return (
      <section aria-label="GitHub Telemetry" className="w-full space-y-6 pt-1">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div className="space-y-2">
            <div className="h-3.5 w-40 rounded bg-[var(--surface-3)] animate-pulse" />
            <div className="h-7 w-64 rounded bg-[var(--surface-3)] animate-pulse" />
          </div>
          <div className="h-9 w-28 rounded bg-[var(--surface-3)] animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((idx) => (
            <div key={idx} className="card p-5 h-28 animate-pulse bg-[var(--surface)]" />
          ))}
        </div>
        <div className="github-telemetry">
          <div className="telemetry-panel h-80 animate-pulse bg-[var(--surface)]" />
          <div className="telemetry-panel h-80 animate-pulse bg-[var(--surface)]" />
        </div>
      </section>
    );
  }

  if (!telemetry || (error && telemetry.status === "error" && telemetry.repositories.length === 0)) {
    return (
      <section aria-label="GitHub Telemetry" className="w-full pt-1">
        <div className="card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--danger)] font-semibold uppercase tracking-wider">
              <AlertCircle className="w-4 h-4" aria-hidden="true" />
              <span>Telemetry Unavailable</span>
            </div>
            <h2 className="text-xl font-bold font-display text-[var(--text)]">
              GitHub Telemetry Could Not Be Loaded
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              {error || telemetry?.errorMessage || "Unable to read GitHub telemetry from API or snapshot."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void refresh()}
            className="btn btn-primary shrink-0"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            <span>Retry Sync</span>
          </button>
        </div>
      </section>
    );
  }

  const telemetryData: GitHubTelemetry = telemetry;

  if (telemetryData.repositories.length === 0) {
    return (
      <section aria-label="GitHub Telemetry" className="w-full pt-1">
        <div className="card p-6 sm:p-8 text-center space-y-3">
          <h2 className="text-xl font-bold font-display text-[var(--text)]">
            No Public Repositories Found
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            No public repository telemetry records were returned for @{telemetryData.username}.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="GitHub Telemetry" className="w-full space-y-6 pt-1">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="uppercase tracking-wider text-[var(--accent)] font-bold">
              GitHub Telemetry
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-[var(--text-muted)]">
              @{telemetryData.username}
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-[var(--text-muted)]">
              {telemetryData.source === "github-api" ? "Live GitHub API" : "Verified Repository Snapshot"}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-[var(--text)]">
            Verified Repository Statistics &amp; Language Composition
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[var(--text-muted)] tabular-nums">
          <span>Updated {formatDateShort(telemetryData.generatedAt)}</span>
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={refreshing}
            className="btn btn-secondary !min-h-[38px] !py-1.5 !px-3 !text-xs font-mono"
            aria-label="Refresh GitHub telemetry"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${refreshing && !reduced ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            <span>{refreshing ? "Refreshing…" : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* PARTIAL / FALLBACK NOTICE */}
      {(telemetryData.status === "partial" || telemetryData.failedLanguageRepos.length > 0) && (
        <div className="p-3.5 rounded-[8px] border border-[var(--border-strong)] bg-[var(--surface)] flex items-start gap-2.5 text-xs text-[var(--text-secondary)]">
          <Info className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-0.5">
            <span className="font-semibold text-[var(--text)]">
              {telemetryData.source === "snapshot-fallback"
                ? "Verified local repository snapshot active."
                : "Partial language telemetry notice."}
            </span>{" "}
            <span>
              {telemetryData.failedLanguageRepos.length > 0
                ? `Language stats unavailable for: ${telemetryData.failedLanguageRepos.join(", ")}.`
                : telemetryData.errorMessage ||
                  "Showing pre-synced canonical repository data with identical calculation policy."}
            </span>
          </div>
        </div>
      )}

      {/* SUMMARY KPI ROW */}
      <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 tabular-nums">
        <StaggerItem className="card p-4 sm:p-5 flex flex-col justify-between space-y-2 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider font-medium">
              Public Repositories
            </span>
            <FolderGit2 className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--text)]">
              {telemetryData.totalRepos}
            </div>
            <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
              {telemetryData.ownedReposCount} owned · {telemetryData.forkedReposCount} fork ·{" "}
              {telemetryData.activeReposCount} active
            </p>
          </div>
        </StaggerItem>

        <StaggerItem className="card p-4 sm:p-5 flex flex-col justify-between space-y-2 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider font-medium">
              Owned Languages
            </span>
            <Code2 className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--text)]">
              {languageRows.length}
            </div>
            <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
              {topLanguage
                ? `Lead: ${topLanguage.name} (${topLanguage.formattedPercentage})`
                : "No language bytes"}
            </p>
          </div>
        </StaggerItem>

        <StaggerItem className="card p-4 sm:p-5 flex flex-col justify-between space-y-2 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider font-medium">
              Stars &amp; Forks
            </span>
            <Star className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--text)]">
              {telemetryData.totalStars}{" "}
              <span className="text-base font-medium text-[var(--text-muted)]">stars</span>
              <span className="mx-1.5 text-[var(--border-strong)]">/</span>
              {telemetryData.totalForks}{" "}
              <span className="text-base font-medium text-[var(--text-muted)]">forks</span>
            </div>
            <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
              Across {telemetryData.totalRepos} public repositories
            </p>
          </div>
        </StaggerItem>

        <StaggerItem className="card p-4 sm:p-5 flex flex-col justify-between space-y-2 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider font-medium">
              Owned Code Volume
            </span>
            <Layers className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--text)]">
              {formatBytesCompact(telemetryData.totalCodeBytes)}
            </div>
            <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
              {formatBytesAsKB(telemetryData.totalCodeBytes)} · excludes forked source
            </p>
          </div>
        </StaggerItem>
      </StaggerGroup>

      {/* BALANCED 2-PANEL DASHBOARD */}
      <EditorialReveal>
        <div className="github-telemetry">
          {/* PANEL A: LANGUAGE DISTRIBUTION */}
          <div className="card telemetry-panel flex flex-col justify-between space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold font-display tracking-tight text-[var(--text)]">
                  Language Distribution
                </h3>
                <p className="text-xs font-mono text-[var(--text-muted)]">
                  {languageRows.length} languages across {telemetryData.ownedReposCount} owned non-fork repositories
                </p>
              </div>
              <span className="text-xs font-mono text-[var(--accent)] font-semibold tabular-nums">
                {formatBytesCompact(telemetryData.totalCodeBytes)} ({formatBytesAsKB(telemetryData.totalCodeBytes)})
              </span>
            </div>

            <div className="w-full min-w-0 overflow-hidden" style={{ height: Math.max(260, topLanguagesChart.length * 34 + 28) }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={140} minHeight={220}>
                <BarChart
                  layout="vertical"
                  data={topLanguagesChart}
                  margin={{ top: 4, right: isCompactViewport ? 14 : 22, left: 4, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    unit="%"
                    stroke={axisColor}
                    fontSize={isCompactViewport ? 10 : 11}
                    fontFamily="monospace"
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke={axisColor}
                    fontSize={isCompactViewport ? 10 : 11}
                    fontFamily="monospace"
                    width={isCompactViewport ? 88 : 122}
                    tickFormatter={(val: string) =>
                      isCompactViewport && val.length > 11 ? `${val.slice(0, 10)}…` : val
                    }
                    tickLine={false}
                  />
                  <Tooltip
                    content={<CustomLanguageTooltip />}
                    cursor={{ fill: isLight ? "rgba(32,35,29,0.04)" : "rgba(244,244,237,0.04)" }}
                  />
                  <Bar
                    dataKey="percentage"
                    name="Code Share"
                    radius={[0, 4, 4, 0]}
                    minPointSize={4}
                    isAnimationActive={!reduced}
                    animationDuration={500}
                  >
                    {topLanguagesChart.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Complete Readout Table / List so small percentages (<0.1%) never read 0% */}
            <div className="pt-3 border-t border-[var(--border)] space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                <span>All {languageRows.length} Verified Languages</span>
                {languageRows.length > 6 && (
                  <button
                    type="button"
                    onClick={() => setShowAllLanguages((prev) => !prev)}
                    className="text-[var(--accent)] hover:underline font-semibold cursor-pointer"
                  >
                    {showAllLanguages ? "Show top 6" : `Show all ${languageRows.length}`}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono tabular-nums">
                {(showAllLanguages ? languageRows : languageRows.slice(0, 6)).map((lang) => (
                  <div
                    key={lang.name}
                    className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-[6px] bg-[var(--surface)] border border-[var(--border)]"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-[2px] shrink-0"
                        style={{ backgroundColor: lang.color }}
                      />
                      <span className="text-[var(--text)] font-medium break-words">{lang.name}</span>
                    </span>
                    <span className="text-[var(--text-secondary)] shrink-0">
                      {lang.formattedCompact} ·{" "}
                      <strong className="text-[var(--text)]">{formatPercentage(lang.percentage)}</strong>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PANEL B: REPOSITORY ACTIVITY (Horizontal Bar Chart — Full Readable Repo Names) */}
          <div className="card telemetry-panel flex flex-col justify-between space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold font-display tracking-tight text-[var(--text)]">
                  Repository Activity
                </h3>
                <p className="text-xs font-mono text-[var(--text-muted)]">
                  All {telemetryData.totalRepos} public repositories · full horizontal labels
                </p>
              </div>

              <div
                className="flex items-center gap-1 p-1 bg-[var(--surface)] rounded-[6px] border border-[var(--border)] self-start sm:self-auto"
                role="group"
                aria-label="Repository metric toggle"
              >
                <button
                  type="button"
                  aria-pressed={repoMetric === "activity"}
                  onClick={() => setRepoMetric("activity")}
                  className={`px-2.5 py-1.5 text-xs font-mono rounded-[4px] transition-colors cursor-pointer ${
                    repoMetric === "activity"
                      ? "bg-[var(--accent-fill)] text-[var(--accent-contrast)] font-semibold"
                      : "text-[var(--text-muted)] hover:text-[var(--text)]"
                  }`}
                >
                  Stars &amp; Forks
                </button>
                <button
                  type="button"
                  aria-pressed={repoMetric === "volume"}
                  onClick={() => setRepoMetric("volume")}
                  className={`px-2.5 py-1.5 text-xs font-mono rounded-[4px] transition-colors cursor-pointer ${
                    repoMetric === "volume"
                      ? "bg-[var(--accent-fill)] text-[var(--accent-contrast)] font-semibold"
                      : "text-[var(--text-muted)] hover:text-[var(--text)]"
                  }`}
                >
                  Code vs Repo Size
                </button>
              </div>
            </div>

            <div className="w-full min-w-0 overflow-hidden" style={{ height: repoChartHeight }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={140} minHeight={260}>
                <BarChart
                  layout="vertical"
                  data={repoRows}
                  margin={{ top: 4, right: isCompactViewport ? 18 : 34, left: 4, bottom: 4 }}
                  onClick={(state: any) => {
                    if (state?.activePayload?.[0]?.payload?.name) {
                      setSelectedRepoName(state.activePayload[0].payload.name);
                    }
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
                  <XAxis
                    type="number"
                    stroke={axisColor}
                    fontSize={isCompactViewport ? 10 : 11}
                    fontFamily="monospace"
                    allowDecimals={repoMetric === "volume"}
                    unit={repoMetric === "volume" ? " KB" : ""}
                    domain={
                      repoMetric === "activity"
                        ? [0, (dataMax: number) => Math.max(3, dataMax + 1)]
                        : [0, (dataMax: number) => Math.ceil(dataMax * 1.1)]
                    }
                  />
                  <YAxis
                    dataKey="label"
                    type="category"
                    stroke={axisColor}
                    fontSize={isCompactViewport ? 10 : 11}
                    fontFamily="monospace"
                    width={isCompactViewport ? 112 : 175}
                    tickFormatter={(val: string) =>
                      isCompactViewport && val.length > 14 ? `${val.slice(0, 13)}…` : val
                    }
                    interval={0}
                    tickLine={false}
                  />
                  <Tooltip
                    content={<CustomRepoTooltip metricMode={repoMetric} />}
                    cursor={{ fill: isLight ? "rgba(32,35,29,0.04)" : "rgba(244,244,237,0.04)" }}
                  />
                  {repoMetric === "activity" ? (
                    <>
                      <Bar
                        dataKey="stars"
                        name="Stars"
                        fill={primaryBarColor}
                        radius={[0, 4, 4, 0]}
                        minPointSize={3}
                        isAnimationActive={!reduced}
                        animationDuration={500}
                      />
                      <Bar
                        dataKey="forks"
                        name="Forks"
                        fill={secondaryBarColor}
                        radius={[0, 4, 4, 0]}
                        isAnimationActive={!reduced}
                        animationDuration={500}
                      />
                    </>
                  ) : (
                    <>
                      <Bar
                        dataKey="codeKB"
                        name="Language Code (KB)"
                        fill={primaryBarColor}
                        radius={[0, 4, 4, 0]}
                        minPointSize={2}
                        isAnimationActive={!reduced}
                        animationDuration={500}
                      />
                      <Bar
                        dataKey="sizeKB"
                        name="GitHub Size (KB)"
                        fill={repoSizeColor}
                        radius={[0, 4, 4, 0]}
                        minPointSize={2}
                        isAnimationActive={!reduced}
                        animationDuration={500}
                      />
                    </>
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Selected Repository Keyboard-Accessible Inspector */}
            {selectedRepo && (
              <div className="pt-3 border-t border-[var(--border)] space-y-2.5 text-xs font-mono">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[var(--text-muted)] tabular-nums">
                  {repoMetric === "activity" ? (
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-[var(--text)]">
                        <span
                          className="w-2.5 h-2.5 rounded-[2px] inline-block"
                          style={{ backgroundColor: primaryBarColor }}
                        />
                        Stars ({telemetryData.totalStars})
                      </span>
                      <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                        <span
                          className="w-2.5 h-2.5 rounded-[2px] inline-block"
                          style={{ backgroundColor: secondaryBarColor }}
                        />
                        Forks ({telemetryData.totalForks})
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-[var(--text)]">
                        <span
                          className="w-2.5 h-2.5 rounded-[2px] inline-block"
                          style={{ backgroundColor: primaryBarColor }}
                        />
                        Tracked Code (KB)
                      </span>
                      <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                        <span
                          className="w-2.5 h-2.5 rounded-[2px] inline-block"
                          style={{ backgroundColor: repoSizeColor }}
                        />
                        GitHub Repo Size (KB)
                      </span>
                    </div>
                  )}
                  <label className="flex items-center gap-1.5">
                    <span className="sr-only">Inspect repository telemetry</span>
                    <select
                      aria-label="Inspect repository telemetry"
                      value={selectedRepo.name}
                      onChange={(e) => setSelectedRepoName(e.target.value)}
                      className="px-2 py-1 rounded-[4px] bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] text-xs font-mono"
                    >
                      {repoRows.map((repo) => (
                        <option key={repo.name} value={repo.name}>
                          {repo.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="p-2.5 rounded-[6px] bg-[var(--surface)] border border-[var(--border)] flex flex-wrap items-center justify-between gap-2 text-[var(--text-secondary)] tabular-nums">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-[var(--text)] font-semibold">
                      <a
                        href={selectedRepo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[var(--accent)] inline-flex items-center gap-1 underline"
                      >
                        <span>{selectedRepo.fullName}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
                      </a>
                      {selectedRepo.isFork && (
                        <span className="text-[var(--accent)]">· Fork ({selectedRepo.defaultBranch})</span>
                      )}
                      {selectedRepo.isArchived && (
                        <span className="text-[var(--text-muted)]">· Archived</span>
                      )}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      {selectedRepo.stars} stars · {selectedRepo.forks} forks · Code:{" "}
                      {formatBytesCompact(selectedRepo.codeBytes)} · Repo size:{" "}
                      {selectedRepo.sizeKB.toLocaleString()} KB · Updated{" "}
                      {formatDateShort(selectedRepo.updatedAt)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </EditorialReveal>

      {/* TELEMETRY FOOTER SUMMARY */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[var(--text-muted)] tabular-nums">
        <span>{telemetryData.filteringPolicy.description}</span>
        <span>
          Total Code: {formatBytesCompact(telemetryData.totalCodeBytes)} (
          {formatBytesAsKB(telemetryData.totalCodeBytes)})
        </span>
      </div>
    </section>
  );
}

export const ProjectStatsOverview = memo(ProjectStatsOverviewComponent);
