import React, { useState } from "react";
import { motion } from "motion/react";
import { AlertCircle, RotateCw, ArrowUpRight, FolderGit2 } from "lucide-react";

export interface UnavailableProps {
  onRetry?: () => void | Promise<void>;
  isRetrying?: boolean;
  profileUrl?: string;
  title?: string;
  message?: string;
  status?: string;
  className?: string;
  compact?: boolean;
}

export function Unavailable({
  onRetry,
  isRetrying = false,
  profileUrl = "https://github.com/codesbysayam",
  title = "Repository Telemetry Unavailable",
  message,
  status = "error",
  className = "",
  compact = false,
}: UnavailableProps) {
  const [internalLoading, setInternalLoading] = useState(false);

  const activeLoading = isRetrying || internalLoading;

  const handleRetry = async () => {
    if (!onRetry || activeLoading) return;
    try {
      setInternalLoading(true);
      await Promise.resolve(onRetry());
    } finally {
      setInternalLoading(false);
    }
  };

  const defaultMessage =
    status === "error"
      ? "The GitHub data snapshot could not be loaded or returned an error status. You can retry syncing or explore the repositories directly on GitHub."
      : "No public repositories were returned in the current snapshot. Check back shortly or view the verified codebases directly on GitHub.";

  const effectiveMessage = message || defaultMessage;

  if (compact) {
    return (
      <div
        id="repositories-unavailable-container"
        className={`card p-4 text-center space-y-3 bg-[var(--surface)] ${className}`}
      >
        <div className="flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-[var(--warning)]" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text)]">
            {title}
          </span>
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          {effectiveMessage}
        </p>
        <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
          {onRetry && (
            <button
              id="unavailable-retry-button"
              type="button"
              onClick={handleRetry}
              disabled={activeLoading}
              className="btn btn-primary min-h-[44px] sm:min-h-[38px] px-3 py-1.5 text-xs disabled:opacity-50"
            >
              <RotateCw className={`w-3 h-3 ${activeLoading ? "animate-spin" : ""}`} />
              <span>{activeLoading ? "Retrying..." : "Retry"}</span>
            </button>
          )}
          <a
            id="unavailable-github-profile-link"
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary min-h-[44px] sm:min-h-[38px] px-3 py-1.5 text-xs"
          >
            <span>GitHub Profile</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      id="repositories-unavailable-container"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`card p-6 sm:p-8 select-text text-center max-w-2xl mx-auto my-6 bg-[var(--surface)] ${className}`}
    >
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="w-12 h-12 rounded-[8px] flex items-center justify-center border border-[var(--border)] bg-[var(--surface-2)] text-[var(--warning)]">
          <FolderGit2 className="w-6 h-6" />
        </div>

        <span
          id="unavailable-status-badge"
          className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.12em] font-semibold text-[var(--warning)]"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Snapshot Status: {status.toUpperCase()}</span>
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="text-base sm:text-lg font-bold font-display text-[var(--text)]">
          {title}
        </h3>
        <p className="text-xs sm:text-sm leading-relaxed max-w-lg mx-auto text-[var(--text-muted)]">
          {effectiveMessage}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            id="unavailable-retry-button"
            type="button"
            onClick={handleRetry}
            disabled={activeLoading}
            className="btn btn-primary min-h-[40px] px-4 py-2 text-xs sm:text-sm disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${activeLoading ? "animate-spin" : ""}`} />
            <span>{activeLoading ? "Retrying Sync..." : "Retry"}</span>
          </button>
        )}

        <a
          id="unavailable-github-profile-link"
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary min-h-[40px] px-4 py-2 text-xs sm:text-sm"
        >
          <span>View Public GitHub Profile</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <p className="mt-4 text-[11px] font-mono text-[var(--text-muted)]">
        Verified public codebases remain accessible 24/7 on github.com/codesbysayam
      </p>
    </motion.div>
  );
}

export default Unavailable;
