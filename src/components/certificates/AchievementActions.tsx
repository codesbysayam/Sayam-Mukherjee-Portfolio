import React from "react";
import { AchievementRecord } from "../../types/certificates";
import { ExternalLink, Eye, FileSearch } from "lucide-react";

interface AchievementActionsProps {
  record: AchievementRecord;
  onViewDetails?: () => void;
  onInspect?: () => void;
  className?: string;
}

export function AchievementActions({
  record,
  onViewDetails,
  onInspect,
  className = "",
}: AchievementActionsProps) {
  const { id, title, credentialUrl, verificationUrl, certificateUrl, pdfUrl } = record;

  const rawSourceUrl = (
    certificateUrl ||
    credentialUrl ||
    pdfUrl ||
    verificationUrl ||
    ""
  ).trim();
  const hasValidSourceUrl =
    /^https?:\/\//i.test(rawSourceUrl) || rawSourceUrl.startsWith("/");

  const handleViewDetails = onViewDetails || onInspect;
  const handleInspect = onInspect || onViewDetails;

  return (
    <footer
      className={`achievement-card__footer ${className}`}
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      <button
        id={`btn-view-details-${id}`}
        type="button"
        onClick={handleViewDetails}
        className="achievement-card__button achievement-card__button--primary"
        aria-label={`View Details for ${title}`}
      >
        <Eye className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>View Details</span>
      </button>

      <button
        id={`btn-inspect-record-${id}`}
        type="button"
        onClick={handleInspect}
        className="achievement-card__button achievement-card__button--secondary"
        aria-label={`Inspect Record for ${title}`}
      >
        <FileSearch className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>Inspect Record</span>
      </button>

      {hasValidSourceUrl ? (
        <a
          id={`btn-open-source-${id}`}
          href={rawSourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="achievement-card__button achievement-card__button--secondary"
          title="Open original certificate or source page"
          aria-label={`Open source for ${title}`}
        >
          <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Open Source</span>
        </a>
      ) : (
        <button
          id={`btn-open-source-unavailable-${id}`}
          type="button"
          disabled
          aria-disabled="true"
          title="No source URL provided for this record"
          className="achievement-card__button achievement-card__button--secondary achievement-card__button--disabled"
          aria-label={`Source unavailable for ${title}`}
        >
          <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Open Source</span>
        </button>
      )}
    </footer>
  );
}

export default AchievementActions;
