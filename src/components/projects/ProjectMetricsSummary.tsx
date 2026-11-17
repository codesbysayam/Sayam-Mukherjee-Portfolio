import { Clock, Cpu, Code2 } from "lucide-react";
import { ProjectMetrics } from "../../data/projects";

interface ProjectMetricsSummaryProps {
  metrics: ProjectMetrics;
  projectName?: string;
  darkSurface?: boolean;
}

export function ProjectMetricsSummary({ metrics, projectName, darkSurface = false }: ProjectMetricsSummaryProps) {
  const outerClass = darkSurface
    ? "p-4 rounded-[8px] bg-[#151713] border border-[#41443A] space-y-3"
    : "p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] space-y-3";

  const tileClass = darkSurface
    ? "p-3 rounded-[6px] bg-[#20231D] border border-[#41443A] space-y-1"
    : "p-3 rounded-[6px] bg-[var(--surface-2)] border border-[var(--border)] space-y-1";

  const labelClass = darkSurface
    ? "text-[11px] font-mono text-[#B5B8AA] flex items-center gap-1"
    : "text-[11px] font-mono text-[var(--text-muted)] flex items-center gap-1";

  const valueClass = darkSurface
    ? "text-sm font-bold text-[#F4F4ED] font-mono block tabular-nums"
    : "text-sm font-bold text-[var(--text)] font-mono block tabular-nums";

  const headingAccent = darkSurface ? "text-[#C7E34A]" : "text-[var(--accent)]";

  return (
    <div className={outerClass}>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h4 className={`text-xs font-mono uppercase tracking-widest font-semibold flex items-center gap-1.5 ${headingAccent}`}>
          <Cpu className="w-3.5 h-3.5" aria-hidden="true" />
          Technical Effort &amp; Metrics Summary
        </h4>
        <span className={`text-[11px] font-mono ${darkSurface ? "text-[#B5B8AA]" : "text-[var(--text-muted)]"}`}>
          {projectName || "Engineering Telemetry"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {metrics.developmentTime && (
          <div className={tileClass}>
            <span className={labelClass}>
              <Clock className={`w-3 h-3 shrink-0 ${headingAccent}`} aria-hidden="true" />
              Development Time
            </span>
            <span className={valueClass}>{metrics.developmentTime}</span>
          </div>
        )}

        {metrics.codeComplexityScore && (
          <div className={tileClass}>
            <span className={labelClass}>
              <Cpu className={`w-3 h-3 shrink-0 ${headingAccent}`} aria-hidden="true" />
              Complexity Profile
            </span>
            <span className={valueClass}>{metrics.codeComplexityScore}</span>
          </div>
        )}

        {metrics.linesOfCode && (
          <div className={tileClass}>
            <span className={labelClass}>
              <Code2 className={`w-3 h-3 shrink-0 ${headingAccent}`} aria-hidden="true" />
              Lines of Code
            </span>
            <span className={valueClass}>{metrics.linesOfCode}</span>
          </div>
        )}
      </div>
    </div>
  );
}
