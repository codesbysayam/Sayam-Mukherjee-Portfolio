import React from "react";
import { AchievementRecord } from "../../types/certificates";
import { ExternalLink, Eye, Download } from "lucide-react";

interface AchievementActionsProps {
  record: AchievementRecord;
  onInspect?: () => void;
  className?: string;
}

export function AchievementActions({
  record,
  onInspect,
  className = "",
}: AchievementActionsProps) {
  const { id, title, credentialUrl, verificationUrl, downloadUrl } = record;

  const primaryUrl = credentialUrl || verificationUrl;
  const primaryLabel = credentialUrl
    ? "View Credential"
    : verificationUrl
      ? "Verify Record"
      : "View Details";

  const effectiveDownloadUrl = downloadUrl;

  return (
    <div
      className={`achievement-card__actions px-6 py-4 border-t flex flex-wrap sm:flex-nowrap items-stretch gap-2.5 ${className}`}
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      {primaryUrl ? (
        <a
          id={`btn-primary-${id}`}
          href={primaryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary flex-1 text-xs sm:text-sm"
          aria-label={`${primaryLabel} for ${title}`}
        >
          <span>{primaryLabel}</span>
          <ExternalLink className="w-4 h-4 shrink-0" />
        </a>
      ) : (
        <button
          id={`btn-primary-inspect-${id}`}
          type="button"
          onClick={onInspect}
          className="btn btn-primary flex-1 text-xs sm:text-sm"
          aria-label={`View Details for ${title}`}
        >
          <Eye className="w-4 h-4 shrink-0" />
          <span>View Details</span>
        </button>
      )}

      <button
        id={`btn-secondary-inspect-${id}`}
        type="button"
        onClick={onInspect}
        className="btn btn-secondary flex-1 text-xs sm:text-sm"
        aria-label={`Inspect Record for ${title}`}
      >
        <Eye className="w-4 h-4 shrink-0" />
        <span>Inspect Record</span>
      </button>

      {effectiveDownloadUrl && (
        <a
          id={`btn-download-${id}`}
          href={effectiveDownloadUrl}
          download={`${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-document`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary px-3.5 text-xs sm:text-sm shrink-0"
          title="Download Official Document"
          aria-label={`Download document for ${title}`}
        >
          <Download className="w-4 h-4 shrink-0" />
          <span className="hidden md:inline">Download</span>
        </a>
      )}
    </div>
  );
}

export default AchievementActions;
