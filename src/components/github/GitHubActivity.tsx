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
        return <GitCommit className="w-3.5 h-3.5 text-emerald-400" />;
      case "CreateEvent":
        return <GitBranch className="w-3.5 h-3.5 text-blue-400" />;
      case "PullRequestEvent":
        return <GitPullRequest className="w-3.5 h-3.5 text-purple-400" />;
      case "WatchEvent":
        return <Star className="w-3.5 h-3.5 text-amber-400" />;
      case "ForkEvent":
        return <GitFork className="w-3.5 h-3.5 text-cyan-400" />;
      case "IssueCommentEvent":
      case "IssuesEvent":
        return <MessageSquare className="w-3.5 h-3.5 text-orange-400" />;
      case "ReleaseEvent":
        return <Tag className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <ActivityIcon className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  if (activity.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 text-center space-y-2">
        <ActivityIcon className="w-6 h-6 text-zinc-500 mx-auto" />
        <h4 className="text-xs font-mono font-semibold text-zinc-300">
          Recent public activity is unavailable.
        </h4>
        <p className="text-[11px] text-zinc-500 font-sans max-w-sm mx-auto">
          Public event logs expire on GitHub after 90 days. Inactivity on public event feeds does not indicate absence of active engineering or private development.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ActivityIcon className="w-4 h-4 text-emerald-400" />
          <h4 className="text-sm font-bold text-white font-display">
            Recent Public Activity
          </h4>
        </div>
        <span className="text-[11px] font-mono text-zinc-500">
          {activity.length} verified public events
        </span>
      </div>

      <div className="space-y-2.5">
        {displayItems.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-850 hover:border-zinc-800 transition-colors"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-zinc-850 flex items-center justify-center shrink-0 border border-zinc-800 mt-0.5">
                {getEventIcon(item.type)}
              </div>

              <div className="space-y-0.5 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                  <span className="text-zinc-200 font-medium">
                    {item.actionLabel || "Activity"}
                  </span>
                  {item.repoName && (
                    <>
                      <span className="text-zinc-600">in</span>
                      <a
                        href={`https://github.com/codesbysayam/${item.repoName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-0.5 truncate max-w-[200px]"
                      >
                        <span>{item.repoName}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-60" />
                      </a>
                    </>
                  )}
                </div>

                {item.details && (
                  <p className="text-[11px] text-zinc-400 font-sans truncate max-w-md">
                    {item.details}
                  </p>
                )}
              </div>
            </div>

            <span className="text-[10px] font-mono text-zinc-500 shrink-0 flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3 text-zinc-600" />
              {formatRelativeTime(item.createdAt)}
            </span>
          </div>
        ))}
      </div>

      <p className="text-[10px] font-mono text-zinc-500 text-center pt-1">
        Public event telemetry sourced directly from api.github.com/users/codesbysayam/events/public
      </p>
    </div>
  );
});
