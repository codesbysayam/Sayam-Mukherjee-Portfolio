import { useMemo, memo } from "react";
import { motion } from "motion/react";
import { Code2 } from "lucide-react";
import { EditorialReveal, StaggerGroup, StaggerItem } from "../../motion/Reveal";
import { MOTION_DURATION, MOTION_EASE, MOTION_VIEWPORT, usePrefersReducedMotion } from "../../motion/tokens";

interface GitHubLanguageBreakdownProps {
  languageBytes?: Record<string, number>;
  languageCounts?: Record<string, number>;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#d4b429",
  Python: "#3572A5",
  "C++": "#b94a48",
  C: "#585B52",
  HTML: "#d65d3b",
  CSS: "#69734A",
  Shell: "#A9C52F",
  Rust: "#c47d58",
  Go: "#2b8a9c",
  Java: "#9a6621",
};

export const GitHubLanguageBreakdown = memo(function GitHubLanguageBreakdown({
  languageBytes = {},
  languageCounts = {},
}: GitHubLanguageBreakdownProps) {
  const prefersReduced = usePrefersReducedMotion();
  const totalBytes = useMemo(() => {
    return Object.values(languageBytes).reduce((sum, val) => sum + val, 0);
  }, [languageBytes]);

  const hasByteData = totalBytes > 0;

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
        color: LANGUAGE_COLORS[name] || "#69734A",
      }))
      .filter((item) => item.percentage > 0)
      .sort((a, b) => b.count - a.count);
  }, [languageCounts, totalReposWithLang]);

  const byteStats = useMemo(() => {
    if (!hasByteData) return [];
    return Object.entries(languageBytes)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: Number(((bytes / totalBytes) * 100).toFixed(1)),
        color: LANGUAGE_COLORS[name] || "#69734A",
      }))
      .filter((item) => item.percentage > 0)
      .sort((a, b) => b.bytes - a.bytes);
  }, [languageBytes, totalBytes, hasByteData]);

  const activeStats = hasByteData ? byteStats : countStats;

  if (activeStats.length === 0) {
    return null;
  }

  return (
    <EditorialReveal>
      <div
        className="card p-5 sm:p-6 space-y-4"
        style={{
          backgroundColor: "var(--surface-2)",
          borderColor: "var(--border)",
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-[var(--accent)]" />
            <h4 className="text-sm font-bold text-[var(--text)] font-display">
              {hasByteData ? "Codebase Language Distribution" : "Repositories by primary language"}
            </h4>
          </div>

          <span className="text-[11px] font-mono text-[var(--text-muted)] tabular-nums">
            {hasByteData
              ? `${(totalBytes / 1024).toFixed(0)} KB indexed`
              : `${totalReposWithLang} repositories tracked`}
          </span>
        </div>

        {/* Multi-Segment Bar */}
        <motion.div
          initial={prefersReduced ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={MOTION_VIEWPORT}
          transition={{ duration: prefersReduced ? 0 : MOTION_DURATION.scene, ease: MOTION_EASE.out }}
          style={{
            originX: 0,
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
          className="w-full h-2.5 rounded-[4px] overflow-hidden flex border"
        >
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
        </motion.div>

        {/* Language Legend */}
        <StaggerGroup stagger={0.025} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
          {activeStats.map((item) => (
            <StaggerItem key={item.name} className="flex items-start gap-2 text-xs font-mono">
              <span
                className="w-2.5 h-2.5 rounded-[2px] mt-1 shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="min-w-0">
                <div className="text-[var(--text)] font-semibold truncate">{item.name}</div>
                <div className="text-[11px] text-[var(--text-muted)] tabular-nums">
                  {item.percentage}%
                  {"count" in item && (
                    <span className="text-[var(--text-faint)] ml-1">
                      ({item.count} {item.count === 1 ? "repo" : "repos"})
                    </span>
                  )}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </EditorialReveal>
  );
});

export default GitHubLanguageBreakdown;
