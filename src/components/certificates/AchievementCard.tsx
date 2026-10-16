import React from "react";
import { AchievementRecord, Certificate } from "../../types/certificates";
import { usePortfolio } from "../../context/PortfolioContext";
import { AchievementMetadata } from "./AchievementMetadata";
import { CredentialPreview } from "./CredentialPreview";
import { AchievementTags } from "./AchievementTags";
import { AchievementActions } from "./AchievementActions";

export interface AchievementCardProps {
  record?: AchievementRecord;
  certificate?: Certificate;
  onInspect?: (record: AchievementRecord) => void;
  onView?: (cert: Certificate) => void;
  className?: string;
}

export function AchievementCard({
  record,
  certificate,
  onInspect,
  onView,
  className = "",
}: AchievementCardProps) {
  const { theme } = usePortfolio();
  const isLight = theme === "light";

  // Seamlessly accept either 'record' or legacy 'certificate' prop
  const item: AchievementRecord = (record || certificate) as AchievementRecord;
  if (!item) return null;

  const handleInspect = () => {
    if (onInspect) {
      onInspect(item);
    } else if (onView) {
      onView(item as Certificate);
    }
  };

  const {
    id,
    title,
    issuer,
    organizer,
    sponsor,
    coOrganizer,
    associatedOrganizer,
    category,
    issueDate,
    year,
    description,
    fullDescription,
    overview,
    skills = [],
    tags = [],
    event,
    platform,
  } = item;

  // Clean title for card headline
  const cleanTitle = (rawTitle: string) => {
    if (!rawTitle) return "";
    return rawTitle
      .replace(/^Certificate of Participation\s*[-|:]\s*/i, "")
      .replace(/^Certificate of Completion\s*[-|:]\s*/i, "")
      .replace(/^Certificate of Participation$/i, "")
      .replace(/^Certificate of Completion$/i, "")
      .trim();
  };

  const displayTitle = (() => {
    const cleaned = cleanTitle(title || "");
    if (!cleaned && event) return event;
    if (cleaned.toLowerCase() === "certificate of participation" && event) return event;
    return cleaned || title;
  })();

  // Standardized Organizer / Sponsor line
  const effectiveSponsor = sponsor || coOrganizer || associatedOrganizer;
  const organizerSponsor = organizer || effectiveSponsor
    ? [organizer, effectiveSponsor].filter(Boolean).join(" / ")
    : issuer;

  // Standardized Description preview
  const displayDescription = overview || description || fullDescription || "";

  // Category eyebrow
  const displayCategory = category ? category.replace(/S$/, "") : "ACHIEVEMENT";
  const displayYear = issueDate || year ? `${issueDate || year}` : "";

  return (
    <article
      id={`achievement-card-${id}`}
      className={`achievement-card group relative flex flex-col justify-between rounded-[20px] border transition-all duration-200 overflow-hidden h-full ${
        isLight
          ? "bg-white border-slate-200/90 hover:border-purple-300 hover:shadow-[0_16px_36px_rgba(109,40,217,0.08)] hover:-translate-y-1"
          : "bg-[#111318]/95 border-white/10 hover:border-purple-500/35 hover:shadow-[0_18px_50px_rgba(0,0,0,0.35)] hover:-translate-y-1"
      } ${className}`}
    >
      {/* 1. Main Card Body */}
      <div className="achievement-card__body p-6 flex flex-col flex-1 gap-3.5">
        {/* 1.1 Category & Year Eyebrow */}
        <div className="achievement-card__eyebrow flex items-center justify-between gap-3 text-xs">
          <span
            className={`font-semibold tracking-wide uppercase text-[11px] ${
              isLight ? "text-purple-600" : "text-purple-400"
            }`}
          >
            {displayCategory}
            {displayYear ? ` · ${displayYear}` : ""}
          </span>

          {platform && (
            <span
              className={`font-sans text-xs ${
                isLight ? "text-slate-500" : "text-[#A7ADB8]"
              }`}
            >
              {platform}
            </span>
          )}
        </div>

        {/* 1.2 Event or Achievement Title */}
        <h3
          onClick={handleInspect}
          className={`achievement-card__title text-lg sm:text-xl font-bold tracking-tight leading-snug cursor-pointer transition-colors m-0 ${
            isLight
              ? "text-slate-900 group-hover:text-purple-700"
              : "text-[#F5F7FA] group-hover:text-white"
          }`}
          style={{ fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"' }}
        >
          {displayTitle}
        </h3>

        {/* 1.3 Organizer / Sponsor Subtitle */}
        {organizerSponsor && (
          <p
            className={`achievement-card__organizer text-sm font-medium -mt-1 m-0 ${
              isLight ? "text-slate-700" : "text-[#C4C9D2]"
            }`}
          >
            {organizerSponsor}
          </p>
        )}

        {/* 1.4 Standardized Metadata Strip (Duration, Format, Dates, Role, Team, Recipient, Credential ID) */}
        <AchievementMetadata record={item} />

        {/* 1.5 Credential Preview or Associated Engineering Projects */}
        <CredentialPreview record={item} onInspect={handleInspect} />

        {/* 1.6 Balanced Description Preview */}
        {displayDescription && (
          <p
            className={`achievement-card__description text-sm leading-relaxed m-0 line-clamp-3 ${
              isLight ? "text-slate-600" : "text-[#A7ADB8]"
            }`}
          >
            {displayDescription}
          </p>
        )}

        {/* 1.7 Technology, Category, and Event Tags */}
        <div className="mt-auto pt-1">
          <AchievementTags
            tags={tags}
            skills={skills}
            maxVisible={4}
            onInspect={handleInspect}
          />
        </div>
      </div>

      {/* 2. Standardized Card Action Footer */}
      <AchievementActions record={item} onInspect={handleInspect} />
    </article>
  );
}

export default AchievementCard;
