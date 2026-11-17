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
  Terminal
} from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { GitHubRepo, GitHubStatsData, GitHubUser, GitHubRawSnapshot } from "../../services/github";
import { EditorialReveal, StaggerGroup, StaggerItem } from "../../motion/Reveal";

interface ProjectStatsOverviewProps {
  repos: GitHubRepo[];
  stats: GitHubStatsData;
  user?: GitHubUser | null;
  snapshot?: GitHubRawSnapshot | null;
  loading?: boolean;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#69734A",
  Python: "#4B5D3F",
  CSS: "#8D947E",
  "C++": "#C7E34A",
  JavaScript: "#A9C52F",
  HTML: "#585B52",
  C: "#777A70",
  "Jupyter Notebook": "#B5B8AA",
  PLpgSQL: "#69734A",
  Makefile: "#41443A"
};

function formatByteSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function CustomLanguageTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-3 rounded-[8px] border border-[var(--border-strong)] bg-[var(--surface-2)] text-[var(--text)] text-xs font-mono shadow-lg">
        <div className="flex items-center gap-2 mb-1.5 pb-1 border-b border-[var(--border)]">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: data.color }} />
          <span className="font-bold text-sm">{data.name}</span>
        </div>
        <div className="space-y-1 text-[var(--text-secondary)] tabular-nums">
          <div className="flex items-center justify-between gap-4">
            <span>Share:</span>
            <span className="font-bold text-[var(--text)]">{data.percent}%</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>Volume:</span>
            <span className="font-bold text-[var(--text)]">{data.formattedSize}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

function CustomRepoTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-3.5 rounded-[8px] border border-[var(--border-strong)] bg-[var(--surface-2)] text-[var(--text)] text-xs font-mono shadow-lg min-w-[200px]">
        <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-[var(--border)]">
          <span className="font-bold text-sm">{data.shortName}</span>
          <span className="text-[11px] text-[var(--text-muted)]">{data.language}</span>
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
              <GitFork className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
              <span>Forks:</span>
            </span>
            <span className="font-bold text-[var(--text)]">{data.forks}</span>
          </div>
          {data.sizeKb > 0 && (
            <div className="flex items-center justify-between gap-4 pt-1 border-t border-[var(--border)] text-[11px]">
              <span>Code Volume:</span>
              <span className="text-[var(--text)] font-medium">~{data.sizeKb} KB</span>
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
  snapshot
}: ProjectStatsOverviewProps) {
  const { theme } = usePortfolio();
  const isLight = theme === "light";

  const [repoMetric, setRepoMetric] = useState<"stars" | "size">("stars");

  const axisColor = isLight ? "#585B52" : "#B5B8AA";
  const gridColor = isLight ? "#D6D7CC" : "#41443A";
  const primaryBarColor = isLight ? "#69734A" : "#C7E34A";
  const secondaryBarColor = isLight ? "#20231D" : "#8D947E";

  const totalRepos = useMemo(() => {
    return repos.length > 0 ? repos.length : user?.public_repos || 11;
  }, [repos.length, user?.public_repos]);

  const totalStars = useMemo(() => {
    const sum = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
    return sum || stats?.totalStars || 0;
  }, [repos, stats?.totalStars]);

  const totalForks = useMemo(() => {
    const sum = repos.reduce((acc, r) => acc + (r.forks_count || 0), 0);
    return sum || stats?.totalForks || 0;
  }, [repos, stats?.totalForks]);

  const { languageData, totalVolumeBytes, topLanguage } = useMemo(() => {
    const aggregated: Record<string, number> = {};

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

    if (Object.keys(aggregated).length === 0 && stats?.languages && stats.languages.length > 0) {
      stats.languages.forEach((l) => {
        aggregated[l.name] = l.bytes;
      });
    }

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
          color: LANGUAGE_COLORS[name] || (isLight ? "#69734A" : "#C7E34A")
        };
      })
      .sort((a, b) => b.bytes - a.bytes);

    return {
      languageData: sorted,
      totalVolumeBytes: totalBytes,
      topLanguage: sorted[0] || { name: "TypeScript", percent: 82.1 }
    };
  }, [snapshot, stats, isLight]);

  const repoChartData = useMemo(() => {
    return repos.map((repo) => {
      let shortName = repo.name;
      if (shortName === "Sayam-Mukherjee-Portfolio") shortName = "Portfolio";
      else if (shortName === "Memory-in-Motion") shortName = "MemMotion";
      else if (shortName === "codesbysayam") shortName = "Config";
      else if (shortName === "sayam-solves") shortName = "DSA Solves";
      else if (shortName === "mausam_sample") shortName = "Mausam";
      else if (shortName === "mausam_demo") shortName = "M.Demo";
      else if (shortName === "CAMPUSCONNECT_1273") shortName = "Campus";
      else if (shortName === "SightForge") shortName = "SightForge";
      else if (shortName === "AXIOM") shortName = "AXIOM";
      else if (shortName === "inkloom") shortName = "Inkloom";
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
        langColor: LANGUAGE_COLORS[repo.language || "TypeScript"] || primaryBarColor,
        sizeKb,
        htmlUrl: repo.html_url
      };
    });
  }, [repos, snapshot, primaryBarColor]);

  return (
    <section aria-label="Project Stats and Metrics Overview" className="w-full space-y-6 pt-1">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="uppercase tracking-wider text-[var(--accent)] font-bold">
              Telemetry &amp; Analytics
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-[var(--text-muted)]">GitHub Synced</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-[var(--text)]">
            Project Stats
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] tabular-nums">
          <span>{totalRepos} Repositories</span>
          <span aria-hidden="true">·</span>
          <span>{languageData.length} Languages</span>
          <span aria-hidden="true">·</span>
          <span className="text-[var(--text)] font-semibold">
            {totalStars} {totalStars === 1 ? "Star" : "Stars"}
          </span>
        </div>
      </div>

      {/* METRIC KPI TILES */}
      <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 tabular-nums">
        <StaggerItem className="card p-4 sm:p-5 flex flex-col justify-between space-y-2 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider font-medium">
              Repositories
            </span>
            <FolderGit2 className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--text)]">
              {totalRepos}
            </div>
            <p className="text-xs font-mono text-[var(--text-muted)] mt-0.5">
              Open-source codebases
            </p>
          </div>
        </StaggerItem>

        <StaggerItem className="card p-5 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider font-medium">
              Languages
            </span>
            <Code2 className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--text)]">
              {languageData.length}
            </div>
            <p className="text-xs font-mono text-[var(--text-muted)] mt-0.5">
              Lead: {topLanguage.name} ({topLanguage.percent}%)
            </p>
          </div>
        </StaggerItem>

        <StaggerItem className="card p-5 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider font-medium">
              Total Stars
            </span>
            <Star className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--text)]">
              {totalStars}
            </div>
            <p className="text-xs font-mono text-[var(--text-muted)] mt-0.5">
              Community GitHub Stargazers
            </p>
          </div>
        </StaggerItem>

        <StaggerItem className="card p-5 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider font-medium">
              Code Volume
            </span>
            <Layers className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--text)]">
              {formatByteSize(totalVolumeBytes)}
            </div>
            <p className="text-xs font-mono text-[var(--text-muted)] mt-0.5">
              Multi-stack architecture
            </p>
          </div>
        </StaggerItem>
      </StaggerGroup>

      {/* CHARTS GRID */}
      <EditorialReveal>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 card p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
                <h3 className="text-sm font-bold font-display tracking-tight text-[var(--text)]">
                  Languages Used Distribution
                </h3>
              </div>
              <p className="text-xs font-mono text-[var(--text-muted)]">
                Code volume share across {languageData.length} languages
              </p>
            </div>

            <span className="text-xs font-mono text-[var(--accent)] font-semibold tabular-nums">
              {formatByteSize(totalVolumeBytes)} total
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full min-w-0 overflow-hidden pt-2">
            <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={200}>
              <BarChart
                layout="vertical"
                data={languageData.slice(0, 6)}
                margin={{ top: 5, right: 20, left: 4, bottom: 5 }}
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
                  width={76}
                  tickLine={false}
                />
                <Tooltip
                  content={<CustomLanguageTooltip />}
                  cursor={{ fill: isLight ? "rgba(32,35,29,0.04)" : "rgba(244,244,237,0.04)" }}
                />
                <Bar dataKey="percent" radius={[0, 4, 4, 0]} isAnimationActive animationDuration={600}>
                  {languageData.slice(0, 6).map((entry, index) => (
                    <Cell key={`lang-cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-[var(--border)] flex items-center gap-3 flex-wrap text-xs font-mono text-[var(--text-muted)] tabular-nums">
            {languageData.slice(0, 5).map((lang) => (
              <div key={lang.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ backgroundColor: lang.color }} />
                <span className="text-[var(--text)] font-medium">{lang.name}</span>
                <span>{lang.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 card p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
                <h3 className="text-sm font-bold font-display tracking-tight text-[var(--text)]">
                  Repositories &amp; Activity
                </h3>
              </div>
              <p className="text-xs font-mono text-[var(--text-muted)]">
                GitHub telemetry across {totalRepos} repositories
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-[var(--surface)] rounded-[6px] border border-[var(--border)] self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setRepoMetric("stars")}
                className={`px-2.5 py-1 text-xs font-mono rounded-[4px] transition-all cursor-pointer active:scale-[0.97] ${
                  repoMetric === "stars"
                    ? "bg-[#20231D] dark:bg-[#C7E34A] text-[#F4F4ED] dark:text-[#20231D] font-semibold"
                    : "text-[var(--text-muted)] hover:text-[var(--text)] active:bg-[var(--surface-2)]"
                }`}
              >
                Stars &amp; Forks
              </button>
              <button
                type="button"
                onClick={() => setRepoMetric("size")}
                className={`px-2.5 py-1 text-xs font-mono rounded-[4px] transition-all cursor-pointer active:scale-[0.97] ${
                  repoMetric === "size"
                    ? "bg-[#20231D] dark:bg-[#C7E34A] text-[#F4F4ED] dark:text-[#20231D] font-semibold"
                    : "text-[var(--text-muted)] hover:text-[var(--text)] active:bg-[var(--surface-2)]"
                }`}
              >
                Code Size
              </button>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full min-w-0 overflow-hidden pt-2">
            <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={200}>
              <BarChart data={repoChartData} margin={{ top: 10, right: 12, left: -12, bottom: 25 }}>
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
                  content={<CustomRepoTooltip />}
                  cursor={{ fill: isLight ? "rgba(32,35,29,0.04)" : "rgba(244,244,237,0.04)" }}
                />
                {repoMetric === "stars" ? (
                  <>
                    <Bar dataKey="stars" name="Star Count" fill={primaryBarColor} radius={[4, 4, 0, 0]} isAnimationActive animationDuration={600} />
                    <Bar dataKey="forks" name="Forks" fill={secondaryBarColor} radius={[4, 4, 0, 0]} isAnimationActive animationDuration={600} />
                  </>
                ) : (
                  <Bar dataKey="sizeKb" name="Size (KB)" fill={primaryBarColor} radius={[4, 4, 0, 0]} isAnimationActive animationDuration={600}>
                    {repoChartData.map((entry, index) => (
                      <Cell key={`repo-cell-${index}`} fill={entry.langColor} />
                    ))}
                  </Bar>
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between gap-2 flex-wrap text-xs font-mono text-[var(--text-muted)] tabular-nums">
            {repoMetric === "stars" ? (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[var(--text)]">
                  <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: primaryBarColor }} />
                  Stars ({totalStars})
                </span>
                <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                  <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: secondaryBarColor }} />
                  Forks ({totalForks})
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                <Activity className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
                <span>Code volume per repository (KB)</span>
              </div>
            )}

            <span className="text-[11px]">Interactive Tooltips Enabled</span>
          </div>
        </div>
      </div>
      </EditorialReveal>
    </section>
  );
}

export const ProjectStatsOverview = memo(ProjectStatsOverviewComponent);
