import React, { useState } from "react";
import { motion } from "motion/react";
import { AlertCircle, RotateCw, ExternalLink, ArrowUpRight, FolderGit2 } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

export interface UnavailableProps {
  /** Callback triggered when user clicks 'Retry' */
  onRetry?: () => void | Promise<void>;
  /** Whether a retry or refresh action is currently in flight */
  isRetrying?: boolean;
  /** Link to public GitHub profile (defaults to Sayam's profile) */
  profileUrl?: string;
  /** Title header for the unavailable message */
  title?: string;
  /** Detailed explanatory description */
  message?: string;
  /** Current snapshot or system status, e.g. 'error' or 'empty' */
  status?: string;
  /** Optional extra CSS classes */
  className?: string;
  /** Compact rendering suitable for smaller containers or widgets */
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
  compact = false
}: UnavailableProps) {
  const { theme } = usePortfolio();
  const isLight = theme === "light";
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
        className={`rounded-xl p-4 border text-center space-y-3 ${
          isLight
            ? "bg-slate-50/90 border-slate-200 text-slate-800"
            : "bg-zinc-950/60 border-zinc-800/80 text-zinc-300"
        } ${className}`}
      >
        <div className="flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider">
            {title}
          </span>
        </div>
        <p className={`text-xs ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
          {effectiveMessage}
        </p>
        <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
          {onRetry && (
            <button
              id="unavailable-retry-button"
              type="button"
              onClick={handleRetry}
              disabled={activeLoading}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                isLight
                  ? "bg-slate-200/90 hover:bg-slate-300 text-slate-900"
                  : "bg-white/10 hover:bg-white/15 text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <RotateCw className={`w-3 h-3 ${activeLoading ? "animate-spin text-purple-400" : ""}`} />
              <span>{activeLoading ? "Retrying..." : "Retry"}</span>
            </button>
          )}
          <a
            id="unavailable-github-profile-link"
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              isLight
                ? "bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200"
                : "bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 border border-purple-500/30"
            }`}
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
      transition={{ duration: 0.25 }}
      className={`rounded-2xl p-6 sm:p-8 border select-text transition-colors text-center max-w-2xl mx-auto my-6 ${
        isLight
          ? "bg-slate-50/90 border-slate-200/90 shadow-sm"
          : "bg-zinc-950/60 border-zinc-800/80 shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
      } ${className}`}
    >
      {/* Icon and status badge */}
      <div className="flex flex-col items-center justify-center space-y-3">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
            isLight
              ? "bg-amber-50 border-amber-200 text-amber-600"
              : "bg-amber-500/10 border-amber-500/25 text-amber-400"
          }`}
        >
          <FolderGit2 className="w-6 h-6" />
        </div>

        <div className="flex items-center gap-2">
          <span
            id="unavailable-status-badge"
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border ${
              isLight
                ? "bg-amber-100/70 text-amber-800 border-amber-200"
                : "bg-amber-500/15 text-amber-300 border-amber-500/30"
            }`}
          >
            <AlertCircle className="w-3 h-3" />
            <span>SNAPSHOT STATUS: {status.toUpperCase()}</span>
          </span>
        </div>
      </div>

      {/* Heading and explanation */}
      <div className="mt-4 space-y-2">
        <h3
          className={`text-base sm:text-lg font-bold font-display ${
            isLight ? "text-slate-900" : "text-white"
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-xs sm:text-sm leading-relaxed max-w-lg mx-auto ${
            isLight ? "text-slate-600" : "text-zinc-400"
          }`}
        >
          {effectiveMessage}
        </p>
      </div>

      {/* Action buttons: Retry and GitHub Profile */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            id="unavailable-retry-button"
            type="button"
            onClick={handleRetry}
            disabled={activeLoading}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-semibold transition-all cursor-pointer shadow-sm ${
              isLight
                ? "bg-slate-900 hover:bg-slate-800 text-white active:scale-95"
                : "bg-white hover:bg-zinc-100 text-zinc-900 active:scale-95"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
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
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-semibold transition-all border shadow-sm ${
            isLight
              ? "bg-white hover:bg-slate-100 text-slate-800 border-slate-300 active:scale-95"
              : "bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-700 active:scale-95"
          }`}
        >
          <span>View Public GitHub Profile</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Subtle reassurance note */}
      <p
        className={`mt-4 text-[10px] font-mono ${
          isLight ? "text-slate-500" : "text-zinc-400"
        }`}
      >
        Verified public codebases remain accessible 24/7 on github.com/codesbysayam
      </p>
    </motion.div>
  );
}

export default Unavailable;
