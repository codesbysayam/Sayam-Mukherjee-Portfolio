import { useState, useMemo, memo } from "react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  CartesianGrid 
} from "recharts";
import { 
  FolderGit2, 
  Code2, 
  Star, 
  Layers, 
  GitFork, 
  Activity, 
  Sparkles,
  Terminal,
  ExternalLink
} from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { GitHubRepo, GitHubStatsData, GitHubUser, GitHubRawSnapshot } from "../../services/github";

interface ProjectStatsOverviewProps {
  repos: GitHubRepo[];
  stats: GitHubStatsData;
  user?: GitHubUser | null;
  snapshot?: GitHubRawSnapshot | null;
  loading?: boolean;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  Python: "#3572A5",
  CSS: "#563d7c",
  "C++": "#f34b7d",
  JavaScript: "#f7df1e",
  HTML: "#e34c26",
  C: "#555555",
  "Jupyter Notebook": "#da5b0b",
  PLpgSQL: "#336791",
  Makefile: "#427819"
};

function formatByteSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Custom Accessible Recharts Tooltip for Languages
function CustomLanguageTooltip({ active, payload, isLight }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div 
        className={`p-3 rounded-xl border text-xs font-mono shadow-xl backdrop-blur-md transition-all ${
          isLight 
            ? "bg-white/95 border-zinc-200 text-zinc-900" 
            : "bg-zinc-950/95 border-zinc-800 text-zinc-100"
        }`}
      >
        <div className="flex items-center gap-2 mb-1.5 pb-1 border-b border-zinc-200/60 dark:border-zinc-800">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: data.color }} />
          <span className="font-bold text-sm">{data.name}</span>
        </div>
        <div className="space-y-1 text-zinc-600 dark:text-zinc-400">
          <div className="flex items-center justify-between gap-4">
            <span>Share:</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100">{data.percent}%</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>Volume:</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100">{data.formattedSize}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

// Custom Accessible Recharts Tooltip for Repositories & Star Count
function CustomRepoTooltip({ active, payload, isLight, metric }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div 
        className={`p-3.5 rounded-xl border text-xs font-mono shadow-xl backdrop-blur-md transition-all min-w-[200px] ${
          isLight 
            ? "bg-white/95 border-zinc-200 text-zinc-900" 
            : "bg-zinc-950/95 border-zinc-800 text-zinc-100"
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-zinc-200/60 dark:border-zinc-800">
          <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{data.shortName}</span>
          <span className="text-[10px] text-zinc-400">{data.language}</span>
        </div>
        <div className="space-y-1.5 text-zinc-600 dark:text-zinc-400">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
              <span>Star Count:</span>
            </span>
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">
              {data.stars} {data.stars === 1 ? "star" : "stars"}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <GitFork className="w-3.5 h-3.5 text-purple-500" />
              <span>Forks:</span>
            </span>
            <span className="font-bold text-purple-600 dark:text-purple-400 font-mono">
              {data.forks}
            </span>
          </div>
          {data.sizeKb > 0 && (
            <div className="flex items-center justify-between gap-4 pt-1 border-t border-zinc-200/40 dark:border-zinc-800/60 text-[11px]">
              <span>Code Volume:</span>
              <span className="font-mono text-zinc-800 dark:text-zinc-200 font-medium">~{data.sizeKb} KB</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
}

function ProjectStatsOverviewComponent({
  repos,
  stats,
  user,
  snapshot,
  loading = false
}: ProjectStatsOverviewProps) {
  const { theme } = usePortfolio();
  const isLight = theme === "light";

  // Repos metric view toggle (Stars & Forks vs Code Size in KB)
  const [repoMetric, setRepoMetric] = useState<"stars" | "size">("stars");

  // Colors for charts
  const axisColor = isLight ? "#71717a" : "#a1a1aa";
  const gridColor = isLight ? "#e4e4e7" : "#27272a";

  // 1. Quantitative Aggregate Metrics
  const totalRepos = useMemo(() => {
    return repos.length > 0 ? repos.length : (user?.public_repos || 7);
  }, [repos.length, user?.public_repos]);

  const totalStars = useMemo(() => {
    const sum = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
    return sum || stats?.totalStars || 0;
  }, [repos, stats?.totalStars]);

  const totalForks = useMemo(() => {
    const sum = repos.reduce((acc, r) => acc + (r.forks_count || 0), 0);
    return sum || stats?.totalForks || 0;
  }, [repos, stats?.totalForks]);

  // 2. Languages Used Aggregation
  const { languageData, totalVolumeBytes, topLanguage } = useMemo(() => {
    const aggregated: Record<string, number> = {};

    // Source 1: Check snapshot languages map
    if (snapshot?.languages) {
      Object.values(snapshot.languages).forEach((langMap) => {
        if (langMap && typeof langMap === "object") {
          Object.entries(langMap).forEach(([lang, bytes]) => {
            if (typeof bytes === "number") {
              aggregated[lang] = (aggregated[lang] || 0) + bytes;
            }
          });
        }
      });
    }

    // Source 2: If snapshot wasn't available, check stats.languages
    if (Object.keys(aggregated).length === 0 && stats?.languages && stats.languages.length > 0) {
      stats.languages.forEach((l) => {
        aggregated[l.name] = l.bytes;
      });
    }

    // Fallback baseline if empty
    if (Object.keys(aggregated).length === 0) {
      aggregated["TypeScript"] = 7655896;
      aggregated["Python"] = 215252;
      aggregated["CSS"] = 142327;
      aggregated["C++"] = 86400;
      aggregated["JavaScript"] = 78194;
      aggregated["HTML"] = 38573;
      aggregated["C"] = 37466;
      aggregated["Jupyter Notebook"] = 19587;
    }

    const totalBytes = Object.values(aggregated).reduce((a, b) => a + b, 0);

    const sorted = Object.entries(aggregated)
      .map(([name, bytes]) => {
        const percent = totalBytes > 0 ? Number(((bytes / totalBytes) * 100).toFixed(1)) : 0;
        return {
          name,
          bytes,
          percent,
          formattedSize: formatByteSize(bytes),
          color: LANGUAGE_COLORS[name] || "#38bdf8"
        };
      })
      .sort((a, b) => b.bytes - a.bytes);

    return {
      languageData: sorted,
      totalVolumeBytes: totalBytes,
      topLanguage: sorted[0] || { name: "TypeScript", percent: 82.1 }
    };
  }, [snapshot, stats]);

  // 3. Repository Data for Chart Visualization
  const repoChartData = useMemo(() => {
    return repos.map((repo) => {
      let shortName = repo.name;
      if (shortName === "Sayam-Mukherjee-Portfolio") shortName = "Portfolio";
      else if (shortName === "Memory-in-Motion") shortName = "MemMotion";
      else if (shortName === "codesbysayam") shortName = "Config";
      else if (shortName === "RouteLedger") shortName = "RouteLedger";
      else if (shortName === "sayam-solves") shortName = "DSA Solves";
      else if (shortName === "mausam") shortName = "Mausam";
      else if (shortName === "Operon") shortName = "Operon";

      let repoBytes = 0;
      const langMap = snapshot?.languages?.[repo.full_name] || snapshot?.languages?.[`codesbysayam/${repo.name}`];
      if (langMap) {
        repoBytes = Object.values(langMap).reduce((a: number, b: any) => a + (typeof b === "number" ? b : 0), 0);
      }
      const sizeKb = repoBytes > 0 ? Math.round(repoBytes / 1024) : 0;

      return {
        name: repo.name,
        shortName,
        fullName: repo.full_name,
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        language: repo.language || "TypeScript",
        langColor: LANGUAGE_COLORS[repo.language || "TypeScript"] || "#38bdf8",
        sizeKb,
        htmlUrl: repo.html_url
      };
    });
  }, [repos, snapshot]);

  return (
    <section 
      aria-label="Project Stats and Metrics Overview"
      className="w-full space-y-6 pt-1"
    >
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200/80 dark:border-white/[0.08] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-purple-700 dark:text-purple-400 font-bold">
              Telemetry &amp; Analytics
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              Live GitHub Synced
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-zinc-900 dark:text-white">
            Project Stats
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
          <span>{totalRepos} Repositories</span>
          <span>·</span>
          <span>{languageData.length} Languages</span>
          <span>·</span>
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-500/20" />
            {totalStars} {totalStars === 1 ? "Star" : "Stars"}
          </span>
        </div>
      </div>

      {/* METRIC KPI TILES (4 Responsive Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Tile 1: Total Repositories */}
        <div className="card p-4 sm:p-5 flex flex-col justify-between space-y-2 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-medium">
              Repositories
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-zinc-900 dark:text-white">
              {totalRepos}
            </div>
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
              100% Open-source codebases
            </p>
          </div>
        </div>

        {/* Tile 2: Languages Used */}
        <div className="card p-4 sm:p-5 flex flex-col justify-between space-y-2 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-medium">
              Languages Used
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Code2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-zinc-900 dark:text-white">
              {languageData.length}
            </div>
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
              Lead: {topLanguage.name} ({topLanguage.percent}%)
            </p>
          </div>
        </div>

        {/* Tile 3: Total Star Count */}
        <div className="card p-4 sm:p-5 flex flex-col justify-between space-y-2 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-medium">
              Total Stars
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Star className="w-4 h-4 fill-amber-500/20" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-zinc-900 dark:text-white flex items-center gap-1.5">
              <span>{totalStars}</span>
              <span className="text-xs font-normal text-amber-600 dark:text-amber-400">★</span>
            </div>
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
              Community GitHub Stargazers
            </p>
          </div>
        </div>

        {/* Tile 4: Code Volume */}
        <div className="card p-4 sm:p-5 flex flex-col justify-between space-y-2 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-medium">
              Code Volume
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-zinc-900 dark:text-white">
              {formatByteSize(totalVolumeBytes)}
            </div>
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
              Multi-stack architecture footprint
            </p>
          </div>
        </div>
      </div>

      {/* RECHARTS VISUALIZATION GRID (2 Responsive Chart Panels) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* CHART 1: LANGUAGES USED DISTRIBUTION (7 Cols on LG) */}
        <div className="lg:col-span-6 card p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-sm font-bold font-display tracking-tight text-zinc-900 dark:text-white">
                  Languages Used Distribution
                </h3>
              </div>
              <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                Code volume share across {languageData.length} distinct languages
              </p>
            </div>

            <span className="text-xs font-mono text-purple-700 dark:text-purple-300 font-medium">
              {formatByteSize(totalVolumeBytes)} total
            </span>
          </div>

          {/* Recharts Horizontal Bar Chart */}
          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={200}>
              <BarChart
                layout="vertical"
                data={languageData.slice(0, 6)}
                margin={{ top: 5, right: 35, left: 15, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
                <XAxis 
                  type="number" 
                  domain={[0, 100]} 
                  unit="%" 
                  stroke={axisColor} 
                  fontSize={10} 
                  fontFamily="monospace" 
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke={axisColor} 
                  fontSize={11} 
                  fontFamily="monospace" 
                  width={85}
                  tickLine={false}
                />
                <Tooltip 
                  content={<CustomLanguageTooltip isLight={isLight} />} 
                  cursor={{ fill: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)' }}
                />
                <Bar 
                  dataKey="percent" 
                  radius={[0, 4, 4, 0]} 
                  isAnimationActive={true}
                  animationDuration={700}
                >
                  {languageData.slice(0, 6).map((entry, index) => (
                    <Cell key={`lang-cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Clean Language Chips List */}
          <div className="pt-2 border-t border-zinc-200/60 dark:border-white/[0.06] flex items-center gap-2 flex-wrap text-xs font-mono text-zinc-500 dark:text-zinc-400">
            {languageData.slice(0, 5).map((lang) => (
              <div key={lang.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ backgroundColor: lang.color }} />
                <span className="text-zinc-800 dark:text-zinc-200 font-medium">{lang.name}</span>
                <span className="text-zinc-400 dark:text-zinc-500">{lang.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* CHART 2: REPOSITORIES & STAR COUNT TELEMETRY (6 Cols on LG) */}
        <div className="lg:col-span-6 card p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                <h3 className="text-sm font-bold font-display tracking-tight text-zinc-900 dark:text-white">
                  Repositories &amp; Star Count
                </h3>
              </div>
              <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                Live GitHub telemetry across all {totalRepos} repositories
              </p>
            </div>

            {/* Interactive Metric Toggle (Stars & Forks vs Code Size) */}
            <div className="flex items-center gap-1 p-0.5 bg-zinc-100 dark:bg-zinc-800/80 rounded-lg border border-zinc-200 dark:border-zinc-700/60 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setRepoMetric("stars")}
                className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors cursor-pointer ${
                  repoMetric === "stars"
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs font-semibold"
                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                }`}
              >
                Stars &amp; Forks
              </button>
              <button
                type="button"
                onClick={() => setRepoMetric("size")}
                className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors cursor-pointer ${
                  repoMetric === "size"
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs font-semibold"
                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                }`}
              >
                Code Size
              </button>
            </div>
          </div>

          {/* Recharts Bar Chart */}
          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={200}>
              <BarChart
                data={repoChartData}
                margin={{ top: 10, right: 15, left: -15, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis 
                  dataKey="shortName" 
                  stroke={axisColor} 
                  fontSize={10} 
                  fontFamily="monospace"
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  height={45}
                  tickLine={false}
                />
                <YAxis 
                  stroke={axisColor} 
                  fontSize={10} 
                  fontFamily="monospace"
                  allowDecimals={false}
                  domain={
                    repoMetric === "stars" 
                      ? [0, (dataMax: number) => Math.max(5, dataMax + 1)]
                      : [0, (dataMax: number) => Math.ceil(dataMax * 1.15)]
                  }
                  unit={repoMetric === "size" ? "k" : ""}
                />
                <Tooltip 
                  content={<CustomRepoTooltip isLight={isLight} metric={repoMetric} />} 
                  cursor={{ fill: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)' }}
                />
                {repoMetric === "stars" ? (
                  <>
                    <Bar 
                      dataKey="stars" 
                      name="Star Count" 
                      fill="#f59e0b" 
                      radius={[4, 4, 0, 0]} 
                      isAnimationActive={true}
                      animationDuration={700}
                    />
                    <Bar 
                      dataKey="forks" 
                      name="Forks" 
                      fill="#8b5cf6" 
                      radius={[4, 4, 0, 0]} 
                      isAnimationActive={true}
                      animationDuration={700}
                    />
                  </>
                ) : (
                  <Bar 
                    dataKey="sizeKb" 
                    name="Size (KB)" 
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]} 
                    isAnimationActive={true}
                    animationDuration={700}
                  >
                    {repoChartData.map((entry, index) => (
                      <Cell key={`repo-cell-${index}`} fill={entry.langColor} />
                    ))}
                  </Bar>
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend and Active State Note */}
          <div className="pt-2 border-t border-zinc-200/60 dark:border-white/[0.06] flex items-center justify-between gap-2 flex-wrap text-xs font-mono text-zinc-500 dark:text-zinc-400">
            {repoMetric === "stars" ? (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  Stars Count ({totalStars})
                </span>
                <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                  <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
                  Forks Count ({totalForks})
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                <Activity className="w-3.5 h-3.5 text-blue-500" />
                <span>Code volume per repository (KB)</span>
              </div>
            )}

            <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
              Interactive Tooltips Enabled
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export const ProjectStatsOverview = memo(ProjectStatsOverviewComponent);
