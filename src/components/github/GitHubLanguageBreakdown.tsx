import { useMemo, memo } from "react";
import { Code2 } from "lucide-react";

interface GitHubLanguageBreakdownProps {
  languageBytes?: Record<string, number>;
  languageCounts?: Record<string, number>;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  "C++": "#f34b7d",
  C: "#555555",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
};

export const GitHubLanguageBreakdown = memo(function GitHubLanguageBreakdown({
  languageBytes = {},
  languageCounts = {},
}: GitHubLanguageBreakdownProps) {
  const totalBytes = useMemo(() => {
    return Object.values(languageBytes).reduce((sum, val) => sum + val, 0);
  }, [languageBytes]);

  const hasByteData = totalBytes > 0;

  // Fallback: Primary repository language counts
  const totalReposWithLang = useMemo(() => {
    return Object.values(languageCounts).reduce((sum, val) => sum + val, 0);
  }, [languageCounts]);

  const countStats = useMemo(() => {
    if (totalReposWithLang === 0) return [];
    return Object.entries(languageCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Number(((count / totalReposWithLang) * 100).toFixed(1)),
        color: LANGUAGE_COLORS[name] || "#888888",
      }))
      .filter((item) => item.percentage > 0)
      .sort((a, b) => b.count - a.count);
  }, [languageCounts, totalReposWithLang]);

  // If byte data exists, calculate exact byte percentages
  const byteStats = useMemo(() => {
    if (!hasByteData) return [];
    return Object.entries(languageBytes)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: Number(((bytes / totalBytes) * 100).toFixed(1)),
        color: LANGUAGE_COLORS[name] || "#888888",
      }))
      .filter((item) => item.percentage > 0)
      .sort((a, b) => b.bytes - a.bytes);
  }, [languageBytes, totalBytes, hasByteData]);

  const activeStats = hasByteData ? byteStats : countStats;

  if (activeStats.length === 0) {
    return null;
  }

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-purple-400" />
          <h4 className="text-sm font-bold text-white font-display">
            {hasByteData ? "Codebase Language Distribution" : "Repositories by primary language"}
          </h4>
        </div>

        <span className="text-[11px] font-mono text-zinc-400">
          {hasByteData
            ? `${(totalBytes / 1024).toFixed(0)} KB indexed`
            : `${totalReposWithLang} repositories tracked`}
        </span>
      </div>

      {/* Proportional Multi-Segment Bar */}
      <div className="w-full h-2.5 rounded-full bg-zinc-800/80 overflow-hidden flex">
        {activeStats.map((item) => (
          <div
            key={item.name}
            className="h-full transition-all duration-300"
            style={{
              width: `${item.percentage}%`,
              backgroundColor: item.color,
            }}
            title={`${item.name}: ${item.percentage}%`}
          />
        ))}
      </div>

      {/* Language Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
        {activeStats.map((item) => (
          <div key={item.name} className="flex items-start gap-2 text-xs font-mono">
            <span
              className="w-2 h-2 rounded-full mt-1.5 shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <div className="min-w-0">
              <div className="text-zinc-200 font-medium truncate">{item.name}</div>
              <div className="text-[11px] text-zinc-400">
                {item.percentage}%
                {"count" in item && (
                  <span className="text-zinc-400 ml-1">
                    ({item.count} {item.count === 1 ? "repo" : "repos"})
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default GitHubLanguageBreakdown;
