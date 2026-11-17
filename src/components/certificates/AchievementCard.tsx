import React from "react";
import { AchievementRecord, Certificate } from "../../types/certificates";
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

  const effectiveSponsor = sponsor || coOrganizer || associatedOrganizer;
  const organizerSponsor =
    organizer || effectiveSponsor
      ? [organizer, effectiveSponsor].filter(Boolean).join(" / ")
      : issuer;

  const displayDescription = overview || description || fullDescription || "";
  const displayCategory = category ? category.replace(/S$/, "") : "ACHIEVEMENT";
  const displayYear = issueDate || year ? `${issueDate || year}` : "";

  return (
    <article
      id={`achievement-card-${id}`}
      className={`achievement-card card group relative flex flex-col justify-between overflow-hidden h-full hover:-translate-y-0.5 ${className}`}
      style={{
        backgroundColor: "var(--surface-2)",
        borderColor: "var(--border)",
      }}
    >
      {/* Main Card Body */}
      <div className="achievement-card__body p-6 flex flex-col flex-1 gap-3.5">
        {/* Category & Year Eyebrow */}
        <div className="achievement-card__eyebrow flex items-center justify-between gap-3 text-xs">
          <span className="font-mono font-semibold tracking-wider uppercase text-[11px] text-[var(--accent)]">
            {displayCategory}
            {displayYear ? ` · ${displayYear}` : ""}
          </span>

          {platform && (
            <span className="font-mono text-[11px] text-[var(--text-muted)]">
              {platform}
            </span>
          )}
        </div>

        {/* Event / Achievement Title */}
        <h3
          onClick={handleInspect}
          className="achievement-card__title text-lg sm:text-xl font-bold tracking-tight leading-snug cursor-pointer transition-colors m-0 text-[var(--text)] group-hover:text-[var(--accent)] font-display"
        >
          {displayTitle}
        </h3>

        {/* Organizer / Sponsor Subtitle */}
        {organizerSponsor && (
          <p className="achievement-card__organizer text-sm font-medium -mt-1 m-0 text-[var(--text-secondary)]">
            {organizerSponsor}
          </p>
        )}

        {/* Standardized Metadata Strip */}
        <AchievementMetadata record={item} />

        {/* Credential Preview or Associated Engineering Projects */}
        <CredentialPreview record={item} onInspect={handleInspect} />

        {/* Balanced Description Preview */}
        {displayDescription && (
          <p className="achievement-card__description text-sm leading-relaxed m-0 line-clamp-3 text-[var(--text-muted)]">
            {displayDescription}
          </p>
        )}

        {/* Tags */}
        <div className="mt-auto pt-1">
          <AchievementTags
            tags={tags}
            skills={skills}
            maxVisible={4}
            onInspect={handleInspect}
          />
        </div>
      </div>

      {/* Standardized Card Action Footer */}
      <AchievementActions record={item} onInspect={handleInspect} />
    </article>
  );
}

export default AchievementCard;
