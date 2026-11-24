import React from "react";
import { motion } from "motion/react";
import { AchievementRecord, Certificate } from "../../types/certificates";
import { AchievementMetadata } from "./AchievementMetadata";
import { AchievementRecordDetails } from "./CredentialPreview";
import { AchievementTags } from "./AchievementTags";
import { AchievementActions } from "./AchievementActions";
import { MOTION_DURATION, MOTION_EASE, usePrefersReducedMotion } from "../../motion/tokens";

export interface CertificateAchievementCardProps {
  record?: AchievementRecord;
  certificate?: Certificate;
  onViewDetails?: (record: AchievementRecord) => void;
  onInspect?: (record: AchievementRecord) => void;
  onView?: (cert: Certificate) => void;
  className?: string;
}

export type AchievementCardProps = CertificateAchievementCardProps;

export function CertificateAchievementCard({
  record,
  certificate,
  onViewDetails,
  onInspect,
  onView,
  className = "",
}: CertificateAchievementCardProps) {
  const prefersReduced = usePrefersReducedMotion();
  const item: AchievementRecord = (record || certificate) as AchievementRecord;
  if (!item) return null;

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(item);
    } else if (onInspect) {
      onInspect(item);
    } else if (onView) {
      onView(item as Certificate);
    }
  };

  const handleInspect = () => {
    if (onInspect) {
      onInspect(item);
    } else if (onViewDetails) {
      onViewDetails(item);
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
    credentialType,
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
  const displayYear = year ? String(year) : issueDate ? `${issueDate}` : "";
  const categoryLabel = displayYear ? `${displayCategory} · ${displayYear}` : displayCategory;
  const credentialLabel = credentialType
    ? platform
      ? `${credentialType} · ${platform}`
      : credentialType
    : platform || "Verified Credential";

  return (
    <motion.article
      id={`achievement-card-${id}`}
      whileHover={prefersReduced ? undefined : { y: -3 }}
      transition={{ duration: MOTION_DURATION.fast, ease: MOTION_EASE.out }}
      className={`achievement-card card group relative overflow-hidden ${className}`}
      style={{
        backgroundColor: "var(--surface-2)",
        borderColor: "var(--border)",
      }}
    >
      <div className="achievement-card__body">
        {/* A. Header */}
        <header className="achievement-card__header">
          <span className="achievement-card__category font-mono font-semibold tracking-wider uppercase text-[11px] text-[var(--accent)]">
            {categoryLabel}
          </span>

          <span
            className="achievement-card__credential font-mono text-[11px] text-[var(--text-muted)] text-right uppercase tracking-wider"
            title={credentialLabel}
          >
            {credentialLabel}
          </span>
        </header>

        {/* B. Identity */}
        <section className="achievement-card__identity space-y-1">
          <h3
            onClick={handleViewDetails}
            className="achievement-card__title text-lg sm:text-xl font-bold tracking-tight leading-snug cursor-pointer transition-colors text-[var(--text)] group-hover:text-[var(--accent)] active:opacity-75 font-display"
          >
            {displayTitle}
          </h3>

          {organizerSponsor && (
            <p className="achievement-card__organizer text-sm font-medium text-[var(--text-secondary)]">
              {organizerSponsor}
            </p>
          )}
        </section>

        {/* C. Metadata */}
        <AchievementMetadata record={item} />

        {/* D. Overview */}
        <section className="achievement-card__overview">
          <p className="achievement-card__description text-sm leading-relaxed m-0 text-[var(--text-muted)]">
            {displayDescription}
          </p>
        </section>

        {/* E. Record Details (Consistent text-only information area; no project panels) */}
        <section className="achievement-card__details">
          <AchievementRecordDetails record={item} />
        </section>

        {/* F. Relevant Topics */}
        <section className="achievement-card__topics">
          <AchievementTags
            tags={tags}
            skills={skills}
            maxVisible={4}
            onInspect={handleInspect}
          />
        </section>
      </div>

      {/* G. Footer */}
      <AchievementActions
        record={item}
        onViewDetails={handleViewDetails}
        onInspect={handleInspect}
      />
    </motion.article>
  );
}

export const AchievementCard = CertificateAchievementCard;
export default CertificateAchievementCard;
