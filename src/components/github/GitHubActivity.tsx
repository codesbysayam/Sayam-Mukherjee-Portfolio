import React, { memo } from "react";
import {
  GitCommit,
  GitBranch,
  GitPullRequest,
  Star,
  GitFork,
  MessageSquare,
  Tag,
  Clock,
  ExternalLink,
  Activity as ActivityIcon,
} from "lucide-react";
import { GitHubActivity as IGitHubActivity } from "../../data/githubTypes";
import { formatRelativeTime } from "../../lib/githubCache";
import { EditorialReveal, StaggerGroup, StaggerItem } from "../../motion/Reveal";

interface GitHubActivityProps {
  activity: IGitHubActivity[];
  limit?: number;
}

export const GitHubActivity = memo(function GitHubActivity({
  activity,
  limit = 8,
}: GitHubActivityProps) {
  const displayItems = limit ? activity.slice(0, limit) : activity;

  const getEventIcon = (type: string) => {
    switch (type) {
      case "PushEvent":
        return <GitCommit className="w-3.5 h-3.5 text-[var(--accent)]" />;
      case "CreateEvent":
        return <GitBranch className="w-3.5 h-3.5 text-[var(--accent)]" />;
      case "PullRequestEvent":
        return <GitPullRequest className="w-3.5 h-3.5 text-[var(--text)]" />;
      case "WatchEvent":
        return <Star className="w-3.5 h-3.5 text-[var(--accent)]" />;
      case "ForkEvent":
        return <GitFork className="w-3.5 h-3.5 text-[var(--accent)]" />;
      case "IssueCommentEvent":
      case "IssuesEvent":
        return <MessageSquare className="w-3.5 h-3.5 text-[var(--text-secondary)]" />;
      case "ReleaseEvent":
        return <Tag className="w-3.5 h-3.5 text-[var(--accent)]" />;
      default:
        return <ActivityIcon className="w-3.5 h-3.5 text-[var(--text-muted)]" />;
    }
  };

  if (activity.length === 0) {
    return (
      <div
        className="card p-6 text-center space-y-2"
        style={{
          backgroundColor: "var(--surface-2)",
          borderColor: "var(--border)",
        }}
      >
        <ActivityIcon className="w-6 h-6 text-[var(--text-muted)] mx-auto" />
        <h4 className="text-xs font-mono font-semibold text-[var(--text)]">
          Recent public activity is unavailable.
        </h4>
        <p className="text-[11px] text-[var(--text-muted)] font-sans max-w-sm mx-auto">
          Public event logs expire on GitHub after 90 days. Inactivity on public event feeds does not indicate absence of active engineering or private development.
        </p>
      </div>
    );
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
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ActivityIcon className="w-4 h-4 text-[var(--accent)]" />
            <h4 className="text-sm font-bold text-[var(--text)] font-display">
              Recent Public Activity
            </h4>
          </div>
          <span className="text-[11px] font-mono text-[var(--text-muted)] tabular-nums">
            {activity.length} verified public events
          </span>
        </div>

        <StaggerGroup stagger={0.03} className="space-y-2.5">
          {displayItems.map((item) => (
            <StaggerItem key={item.id}>
              <div
                className="flex items-start justify-between gap-3 p-3 rounded-[8px] border transition-colors hover:border-[var(--border-strong)]"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
            <div className="flex items-start gap-3 min-w-0">
              <div
                className="w-7 h-7 rounded-[6px] flex items-center justify-center shrink-0 border mt-0.5"
                style={{
                  backgroundColor: "var(--surface-2)",
                  borderColor: "var(--border)",
                }}
              >
                {getEventIcon(item.type)}
              </div>

              <div className="space-y-0.5 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                  <span className="text-[var(--text)] font-medium">
                    {item.actionLabel || "Activity"}
                  </span>
                  {item.repoName && (
                    <>
                      <span className="text-[var(--text-faint)]">in</span>
                      <a
                        href={`https://github.com/codesbysayam/${item.repoName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--accent)] hover:underline inline-flex items-center gap-0.5 truncate max-w-[200px]"
                      >
                        <span>{item.repoName}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
                      </a>
                    </>
                  )}
                </div>

                {item.details && (
                  <p className="text-[11px] text-[var(--text-muted)] font-sans truncate max-w-md">
                    {item.details}
                  </p>
                )}
              </div>
            </div>

            <span className="text-[10px] font-mono text-[var(--text-muted)] shrink-0 flex items-center gap-1 mt-1 tabular-nums">
              <Clock className="w-3 h-3 text-[var(--text-faint)]" />
              {formatRelativeTime(item.createdAt)}
            </span>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <p className="text-[10px] font-mono text-[var(--text-faint)] text-center pt-1">
          Public event telemetry sourced directly from api.github.com/users/codesbysayam/events/public
        </p>
      </div>
    </EditorialReveal>
  );
});

export default GitHubActivity;
