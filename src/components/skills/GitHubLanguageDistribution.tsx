import React, { useState, useEffect } from "react";
import { RefreshCw, Info } from "lucide-react";
import { 
  fetchGithubLanguages, 
  GithubLanguageDistributionResponse,
  GitHubLanguageItem
} from "../../services/github";

function formatBytes(bytes: number): string {
  if (!bytes || isNaN(bytes) || bytes <= 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function GitHubLanguageDistribution() {
  const [data, setData] = useState<GithubLanguageDistributionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const loadLanguages = async (forceSync = false) => {
    try {
      if (forceSync) setSyncing(true);
      else setLoading(true);

      const res = await fetchGithubLanguages(forceSync);
      setData(res);
    } catch (err) {
      console.error("Error loading GitHub languages:", err);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    loadLanguages();
  }, []);

  const languages: GitHubLanguageItem[] = (data && Array.isArray(data.languages)) ? data.languages : [];
  const totalBytes = data?.totalBytes || 0;
  const isLive = data?.source === "live";

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.14em] text-cyan-400">
            05 — CODEBASE LANGUAGE DISTRIBUTION
          </span>
          <span className="h-px w-12 bg-zinc-800" />
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            Repository Byte Volume
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white font-display">
            Public Codebase Language Volume
          </h2>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
            <span>{data?.lastSynced ? `Synced: ${data.lastSynced}` : "Verified Baseline"}</span>
            <button
              type="button"
              onClick={() => loadLanguages(true)}
              disabled={syncing || loading}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh from GitHub API"
            >
              <RefreshCw className={`w-3 h-3 ${syncing ? "animate-spin" : ""}`} />
              <span>{syncing ? "Syncing..." : "Sync"}</span>
            </button>
          </div>
        </div>
        <p className="text-xs font-mono text-zinc-500">
          Calculated from GitHub repository language statistics.
        </p>
      </div>

      {/* Main Container */}
      <div className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-850 space-y-6">
        {/* Horizontal Segmented Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Aggregated Volume: {formatBytes(totalBytes)}</span>
            <span>{languages.length} detected languages</span>
          </div>

          <div className="w-full h-3 rounded-full overflow-hidden flex bg-zinc-900 border border-zinc-800 p-0.5 gap-0.5">
            {languages.map((lang) => {
              const langName = lang.language || (lang as any).name || "Other";
              const percent = lang.percentage || 0;

              return (
                <div
                  key={langName}
                  style={{
                    width: `${Math.max(percent, 1.2)}%`,
                    backgroundColor: lang.color || "#6b7280",
                  }}
                  className="h-full rounded-sm transition-all duration-500"
                  title={`${langName}: ${percent}% (${formatBytes(lang.bytes)})`}
                />
              );
            })}
          </div>
        </div>

        {/* Compact Distribution List (Clean horizontal or multi-column row layout) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
          {languages.map((lang) => {
            const langName = lang.language || (lang as any).name || "Other";
            const percent = lang.percentage || 0;

            return (
              <div
                key={langName}
                className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col justify-between space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: lang.color || "#6b7280" }}
                  />
                  <span className="text-xs font-semibold text-white truncate font-sans">
                    {langName}
                  </span>
                </div>

                <div className="space-y-0.5 font-mono">
                  <div className="text-sm font-bold text-zinc-200">
                    {percent}%
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    {formatBytes(lang.bytes)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Prominent Editorial Disclaimer Note */}
        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 flex items-start gap-3">
          <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            <strong className="text-zinc-300 font-semibold">Note:</strong> These metrics represent proportional source code byte volume committed across public repositories on GitHub. They reflect codebase weight (e.g. TypeScript in full-stack web applications) rather than subjective skill proficiency or personal mastery levels.
          </p>
        </div>
      </div>
    </div>
  );
}

export default GitHubLanguageDistribution;
