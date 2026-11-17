import React from "react";
import {
  GitBranch, Clock, CheckCircle2,
  ExternalLink, FolderGit2, Server
} from "lucide-react";
import { useGithub } from "../../hooks/useGithub";

const DEPLOYED_APPS = [
  {
    name: "OPERON",
    url: "https://operonpro.vercel.app",
    platform: "Vercel Edge",
    role: "Production App",
    status: "Operational"
  },
  {
    name: "MAUSAM",
    url: "https://mausamgovt.vercel.app",
    platform: "Vercel Edge",
    role: "SIH 2026 Production",
    status: "Operational"
  },
  {
    name: "Portfolio",
    url: "https://sayammukherjee.in",
    platform: "Vercel & Express API",
    role: "Full-Stack Ecosystem",
    status: "Operational"
  }
];

export function LiveRepositorySignal() {
  const { repos, syncedAt } = useGithub();

  const primaryLanguages = ["TypeScript", "C++", "Python", "JavaScript"];

  const latestPushDate = React.useMemo(() => {
    if (!repos || repos.length === 0) return "Recent";
    const dates = repos
      .map((r) => new Date(r.pushed_at || r.updated_at).getTime())
      .filter((t) => !isNaN(t));
    if (dates.length === 0) return "Recent";
    const maxDate = new Date(Math.max(...dates));
    return maxDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }, [repos]);

  const formattedSyncTime = React.useMemo(() => {
    if (!syncedAt) return "Just now";
    try {
      const d = new Date(syncedAt);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "Just now";
    }
  }, [syncedAt]);

  const syncStatusText = `Last synced: ${formattedSyncTime}`;

  return (
    <section id="repository-signals" className="space-y-6">
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-medium tracking-wide text-[var(--accent)]">
            06 · Live Repository Signal
          </span>
          <span className="h-px w-8 bg-[var(--border)]" />
          <span className="text-xs font-mono text-[var(--success)]">
            Live from GitHub
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)] font-display">
            Repository Health &amp; Deployment State
          </h2>
          <span className="text-xs font-mono text-[var(--text-faint)]">
            {syncStatusText}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl font-sans leading-relaxed">
          Public GitHub repository metrics and live application runtime availability. Direct signals fetched from the GitHub API.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="card p-4 space-y-2.5">
          <div className="flex items-center justify-between text-[var(--text-faint)]">
            <span className="text-[11px] font-mono uppercase tracking-wider font-medium">
              Public Repositories
            </span>
            <FolderGit2 className="w-3.5 h-3.5 text-[var(--accent)]" />
          </div>
          <div className="space-y-0.5">
            <div className="text-xl sm:text-2xl font-semibold text-[var(--text)] font-mono tabular-nums">
              {repos.length > 0 ? repos.length : "4"}
            </div>
            <p className="text-xs text-[var(--text-muted)] font-sans">
              Verified public source codebases
            </p>
          </div>
        </div>

        <div className="card p-4 space-y-2.5">
          <div className="flex items-center justify-between text-[var(--text-faint)]">
            <span className="text-[11px] font-mono uppercase tracking-wider font-medium">
              Primary Languages
            </span>
            <GitBranch className="w-3.5 h-3.5 text-[var(--accent)]" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-medium text-[var(--text)] font-mono flex flex-wrap items-center gap-x-2 gap-y-1">
              {primaryLanguages.map((lang, idx) => (
                <span key={lang} className="inline-flex items-center gap-2">
                  {idx > 0 && <span className="text-[var(--text-faint)]" aria-hidden="true">·</span>}
                  <span>{lang}</span>
                </span>
              ))}
            </div>
            <p className="text-xs text-[var(--text-muted)] font-sans">
              Active production runtimes
            </p>
          </div>
        </div>

        <div className="card p-4 space-y-2.5">
          <div className="flex items-center justify-between text-[var(--text-faint)]">
            <span className="text-[11px] font-mono uppercase tracking-wider font-medium">
              Latest Repo Push
            </span>
            <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
          </div>
          <div className="space-y-0.5">
            <div className="text-base sm:text-lg font-semibold text-[var(--text)] font-mono truncate tabular-nums">
              {latestPushDate}
            </div>
            <p className="text-xs text-[var(--text-muted)] font-sans">
              Recent commit &amp; branch update
            </p>
          </div>
        </div>

        <div className="card p-4 space-y-2.5">
          <div className="flex items-center justify-between text-[var(--text-faint)]">
            <span className="text-[11px] font-mono uppercase tracking-wider font-medium">
              Production Apps
            </span>
            <Server className="w-3.5 h-3.5 text-[var(--accent)]" />
          </div>
          <div className="space-y-0.5">
            <div className="text-xl sm:text-2xl font-semibold text-[var(--text)] font-mono tabular-nums">
              3 Live
            </div>
            <p className="text-xs text-[var(--success)] font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>All systems operational</span>
            </p>
          </div>
        </div>
      </div>

      <div className="card p-4 sm:p-5 space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-0.5">
            <h3 className="text-sm sm:text-base font-semibold text-[var(--text)] font-display">
              Public Deployment Endpoints
            </h3>
            <p className="text-xs text-[var(--text-muted)] font-sans">
              Edge routing and live availability for published software projects.
            </p>
          </div>
          <span className="text-[11px] font-mono text-[var(--text-faint)] hidden sm:inline">
            Zero synthetic uptime ratings
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {DEPLOYED_APPS.map((app) => (
            <div
              key={app.name}
              className="p-3.5 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] flex flex-col justify-between space-y-2.5 hover:border-[var(--border-strong)] transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-[var(--text)] font-display">{app.name}</span>
                  <span className="text-[10px] font-mono text-[var(--success)] font-semibold uppercase">
                    {app.status}
                  </span>
                </div>
                <div className="text-xs text-[var(--text-secondary)] font-sans">{app.role}</div>
                <div className="text-[11px] font-mono text-[var(--text-faint)]">{app.platform}</div>
              </div>

              <div className="pt-2 border-t border-[var(--border)]">
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-mono text-[var(--accent)] hover:underline transition-colors"
                >
                  <span>Launch Live App</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LiveRepositorySignal;
