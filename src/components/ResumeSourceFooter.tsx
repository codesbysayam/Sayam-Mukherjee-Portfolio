import React from "react";
import { ExternalLink, CheckCircle2 } from "lucide-react";
import { RESUME_CONFIG } from "../config/resume";

interface ResumeSourceFooterProps {
  lastVerified?: string | null;
  className?: string;
}

export function ResumeSourceFooter({
  lastVerified = "2026-10-24",
  className = "",
}: ResumeSourceFooterProps) {
  return (
    <footer className={`w-full pt-6 pb-2 border-t border-[var(--border)] text-xs text-[var(--text-muted)] font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
          <span>Official Document Source:</span>
        </span>
        {RESUME_CONFIG.isPdfAvailable ? (
          <a
            href={RESUME_CONFIG.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline underline-offset-4 transition-colors inline-flex items-center gap-1 break-all font-semibold"
            aria-label="Open authoritative resume document in external tab"
          >
            <span>{RESUME_CONFIG.url}</span>
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
        ) : (
          <span className="text-[var(--text-secondary)] break-all">
            {RESUME_CONFIG.url}
          </span>
        )}
      </div>

      {lastVerified && (
        <div className="shrink-0 text-[var(--text-muted)] tabular-nums">
          Last Verified: <span className="text-[var(--text)] font-semibold">{lastVerified}</span>
        </div>
      )}
    </footer>
  );
}

export default ResumeSourceFooter;
