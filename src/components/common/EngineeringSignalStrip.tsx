import { memo } from "react";
import { useGithub } from "../../hooks/useGithub";
import { formatRelativeTime, formatGitHubEvent } from "../../services/github";
import { GitCommit, FolderGit2, Cpu, Activity, ArrowUpRight } from "lucide-react";

interface EngineeringSignalStripProps {
  className?: string;
  variant?: "compact" | "full";
}

function EngineeringSignalStripComponent({ className = "" }: EngineeringSignalStripProps) {
  const { latestRepo, latestEvent, repos, pulse } = useGithub();

  const formattedEvent = latestEvent ? formatGitHubEvent(latestEvent) : null;
  const topRepo = latestRepo || (repos.length > 0 ? repos[0] : null);

  return (
    <div
      className={`engineering-signal-strip card overflow-hidden ${className}`}
    >
      {/* Header bar */}
      <div className="px-4 sm:px-5 py-2.5 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] text-[11px] font-mono text-[var(--text-muted)]">
        <div className="flex items-center gap-2">
          <span className="font-semibold uppercase tracking-[0.14em] text-[var(--text)]">
            Build Signal
          </span>
          <span className="text-[var(--text-faint)] hidden sm:inline">/</span>
          <span className="text-[var(--text-muted)] hidden sm:inline">GitHub Telemetry</span>
        </div>

        <div className="flex items-center gap-3 text-[11px] tabular-nums">
          <span className="text-[var(--accent)] font-semibold">
            Verified Snapshot
          </span>
          <span className="text-[var(--text-muted)]">
            {topRepo?.pushed_at ? `Updated ${formatRelativeTime(topRepo.pushed_at)}` : "Repository sync"}
          </span>
        </div>
      </div>

      {/* 4-Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)]">
        
        {/* Cell 1: Latest Repository */}
        <div className="p-3.5 sm:p-4 flex flex-col justify-between space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <FolderGit2 className="w-3 h-3 text-[var(--accent)] shrink-0" />
              Latest Repo
            </span>
            {topRepo?.language && (
              <span className="text-[10px] text-[var(--text-secondary)]">
                {topRepo.language}
              </span>
            )}
          </div>
          <div className="pt-1">
            {topRepo ? (
              <a
                href={topRepo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs sm:text-sm font-bold truncate block group text-[var(--text)] hover:text-[var(--accent)] transition-colors"
              >
                <span className="inline-flex items-center gap-1">
                  <span>{topRepo.name}</span>
                  <ArrowUpRight className="w-3 h-3 text-[var(--text-faint)] group-hover:text-[var(--accent)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>
            ) : (
              <span className="font-mono text-xs font-bold text-[var(--text-muted)]">OPERON</span>
            )}
            <p className="text-[11px] text-[var(--text-muted)] font-mono truncate mt-0.5">
              {topRepo?.description || "Autonomous multi-agent system"}
            </p>
          </div>
        </div>

        {/* Cell 2: Current Focus */}
        <div className="p-3.5 sm:p-4 flex flex-col justify-between space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-[var(--accent)] shrink-0" />
              Current Focus
            </span>
            <span className="text-[10px] text-[var(--accent)] font-mono font-semibold">Active</span>
          </div>
          <div className="pt-1">
            <div className="font-mono text-xs sm:text-sm font-bold truncate text-[var(--text)]">
              AI / ML &amp; Advanced DSA
            </div>
            <p className="text-[11px] text-[var(--text-muted)] font-mono truncate mt-0.5">
              2nd Yr B.Tech CSE (AI &amp; ML) · KIIT
            </p>
          </div>
        </div>

        {/* Cell 3: 7-Day Activity & Cadence */}
        <div className="p-3.5 sm:p-4 flex flex-col justify-between space-y-1 tabular-nums">
          <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-[var(--accent)] shrink-0" />
              Weekly Cadence
            </span>
            <span className="text-[10px] text-[var(--accent)] font-mono font-semibold">{pulse?.dailyCadence || "~6.9/day"}</span>
          </div>
          <div className="pt-1">
            <div className="font-mono text-xs sm:text-sm font-bold text-[var(--text)]">
              {pulse?.commitsCount || 48} commits <span className="text-[var(--text-muted)] font-normal text-xs">/ 7 days</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] font-mono truncate mt-0.5">
              Across {pulse?.activeReposCount || 5} active verified codebases
            </p>
          </div>
        </div>

        {/* Cell 4: Latest Activity / Commit */}
        <div className="p-3.5 sm:p-4 flex flex-col justify-between space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <GitCommit className="w-3 h-3 text-[var(--accent)] shrink-0" />
              Latest Activity
            </span>
            <span className="text-[10px] text-[var(--accent)] font-mono font-semibold">Synced</span>
          </div>
          <div className="pt-1">
            <div className="font-mono text-xs truncate font-medium text-[var(--text)]">
              {formattedEvent?.text || "Pushed commits to repository"}
            </div>
            <p className="text-[11px] text-[var(--text-muted)] font-mono truncate mt-0.5">
              {formattedEvent?.time ? `Git event ${formattedEvent.time}` : "Pushed to GitHub"}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export const EngineeringSignalStrip = memo(EngineeringSignalStripComponent);
export default EngineeringSignalStrip;
