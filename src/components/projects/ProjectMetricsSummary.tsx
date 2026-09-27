import { Clock, Cpu, Code2 } from "lucide-react";
import { ProjectMetrics } from "../../data/projects";

interface ProjectMetricsSummaryProps {
  metrics: ProjectMetrics;
  projectName?: string;
}

export function ProjectMetricsSummary({ metrics, projectName }: ProjectMetricsSummaryProps) {
  return (
    <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-white/[0.03] border border-purple-200/80 dark:border-white/[0.08] space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-mono uppercase tracking-widest text-purple-700 dark:text-purple-400 font-semibold flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5" />
          Technical Effort &amp; Metrics Summary
        </h4>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40">
          {projectName || "Engineering Telemetry"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {metrics.developmentTime && (
          <div className="p-3 rounded-lg bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 space-y-1">
            <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-purple-500 shrink-0" />
              Development Time
            </span>
            <span className="text-sm font-bold text-zinc-900 dark:text-white font-mono block">
              {metrics.developmentTime}
            </span>
          </div>
        )}

        {metrics.codeComplexityScore && (
          <div className="p-3 rounded-lg bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 space-y-1">
            <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-cyan-500 shrink-0" />
              Code Complexity Score
            </span>
            <span className="text-sm font-bold text-zinc-900 dark:text-white font-mono block">
              {metrics.codeComplexityScore}
            </span>
          </div>
        )}

        {metrics.linesOfCode && (
          <div className="p-3 rounded-lg bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 space-y-1">
            <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
              <Code2 className="w-3 h-3 text-emerald-500 shrink-0" />
              Lines of Code
            </span>
            <span className="text-sm font-bold text-zinc-900 dark:text-white font-mono block">
              {metrics.linesOfCode}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
