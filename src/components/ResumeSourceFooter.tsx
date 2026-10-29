import React from "react";
import { ExternalLink, CheckCircle2 } from "lucide-react";
import { RESUME_CONFIG } from "../config/resume";

interface ResumeSourceFooterProps {
  lastVerified?: string | null;
  className?: string;
}

/**
 * Non-obtrusive, accessible resume provenance footer.
 * Renders naturally in the document flow to avoid covering content or overlapping mobile navigation.
 */
export function ResumeSourceFooter({
  lastVerified = "2026-10-24",
  className = "",
}: ResumeSourceFooterProps) {
  return (
    <footer className={`w-full pt-6 pb-2 border-t border-zinc-900/80 text-xs text-zinc-500 font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 text-zinc-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Authoritative Source:</span>
        </span>
        <a
          href={RESUME_CONFIG.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1 break-all underline underline-offset-2"
          aria-label="Open authoritative resume document in external tab"
        >
          <span>{RESUME_CONFIG.url}</span>
          <ExternalLink className="w-3 h-3 shrink-0" />
        </a>
      </div>

      {lastVerified && (
        <div className="shrink-0 text-zinc-500">
          Last Verified: <span className="text-zinc-400 font-semibold">{lastVerified}</span>
        </div>
      )}
    </footer>
  );
}

export default ResumeSourceFooter;
