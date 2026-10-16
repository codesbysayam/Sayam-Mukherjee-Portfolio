import React from "react";
import { AchievementRecord } from "../../types/certificates";
import { usePortfolio } from "../../context/PortfolioContext";
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
  const { theme } = usePortfolio();
  const isLight = theme === "light";

  const {
    id,
    title,
    credentialUrl,
    verificationUrl,
    downloadUrl,
    pdfUrl,
  } = record;

  const primaryUrl = credentialUrl || verificationUrl;
  const primaryLabel = credentialUrl
    ? "View Credential"
    : verificationUrl
      ? "Verify Record"
      : "View Details";

  // Check if an explicit downloadable file link is specified
  const effectiveDownloadUrl = downloadUrl;

  return (
    <div
      className={`achievement-card__actions px-6 py-4 border-t flex flex-wrap sm:flex-nowrap items-stretch gap-2.5 ${
        isLight
          ? "bg-slate-50/70 border-slate-200"
          : "bg-[#0d0e12]/80 border-white/[0.08]"
      } ${className}`}
    >
      {/* 1. Primary Action */}
      {primaryUrl ? (
        <a
          id={`btn-primary-${id}`}
          href={primaryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="achievement-card__button achievement-card__button--primary flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#A855F7] hover:bg-[#9333EA] text-white font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer shadow-sm hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-purple-400"
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
          className="achievement-card__button achievement-card__button--primary flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#A855F7] hover:bg-[#9333EA] text-white font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer shadow-sm hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-purple-400"
          aria-label={`View Details for ${title}`}
        >
          <Eye className="w-4 h-4 text-white shrink-0" />
          <span>View Details</span>
        </button>
      )}

      {/* 2. Secondary Action: Inspect Record (internal rich detail modal) */}
      <button
        id={`btn-secondary-inspect-${id}`}
        type="button"
        onClick={onInspect}
        className={`achievement-card__button achievement-card__button--secondary flex-1 min-h-[44px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer border focus-visible:outline-2 focus-visible:outline-purple-400 ${
          isLight
            ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
            : "bg-white/[0.06] hover:bg-white/[0.12] text-zinc-200 border-white/10"
        }`}
        aria-label={`Inspect Record for ${title}`}
      >
        <Eye className="w-4 h-4 text-purple-400 shrink-0" />
        <span>Inspect Record</span>
      </button>

      {/* 3. Optional Download Action (when explicit download URL is provided) */}
      {effectiveDownloadUrl && (
        <a
          id={`btn-download-${id}`}
          href={effectiveDownloadUrl}
          download={`${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-document`}
          target="_blank"
          rel="noopener noreferrer"
          className={`achievement-card__download min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer border shrink-0 focus-visible:outline-2 focus-visible:outline-purple-400 ${
            isLight
              ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
              : "bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 border-white/10"
          }`}
          title="Download Official Document"
          aria-label={`Download document for ${title}`}
        >
          <Download className="w-4 h-4 text-zinc-400 shrink-0" />
          <span className="hidden md:inline">Download</span>
        </a>
      )}
    </div>
  );
}
export default AchievementActions;
