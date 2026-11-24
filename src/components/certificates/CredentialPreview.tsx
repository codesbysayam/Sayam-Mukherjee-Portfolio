import React from "react";
import { AchievementRecord } from "../../types/certificates";

interface CredentialPreviewProps {
  record: AchievementRecord;
  className?: string;
}

const VERIFICATION_LABELS: Record<string, string> = {
  VERIFIED: "Verified Credential",
  "LINK AVAILABLE": "Issuer Verification Available",
  "NO VERIFICATION LINK": "Archival Certificate Record",
};

function formatSignatoriesSummary(
  signatories?: (string | { name: string; designation?: string })[]
): string | null {
  if (!signatories || signatories.length === 0) return null;
  const names = signatories
    .map((sig) => {
      if (typeof sig === "string") {
        return sig.split(",")[0].trim();
      }
      return (sig.name || "").trim();
    })
    .filter(Boolean);
  if (names.length === 0) return null;
  return names.join(", ");
}

/**
 * AchievementRecordDetails (exported as CredentialPreview for backward compatibility)
 * Renders a uniform, text-only record details summary across every certificate and achievement card.
 * Associated engineering projects are intentionally excluded from cards and displayed in the Inspect Record modal.
 */
export function AchievementRecordDetails({
  record,
  className = "",
}: CredentialPreviewProps) {
  const {
    issuer,
    organizer,
    coOrganizer,
    associatedOrganizer,
    platform,
    event,
    format,
    track,
    theme,
    pathway,
    session,
    sessionLeader,
    facilitator,
    subjects,
    signatories,
    team,
    teamMembers,
    credentialId,
    achievementClaim,
    verificationStatus,
    issueDate,
    year,
  } = record;

  const effectiveCoOrg = coOrganizer || associatedOrganizer;
  const organizerText = organizer
    ? effectiveCoOrg && !organizer.toLowerCase().includes(effectiveCoOrg.toLowerCase())
      ? `${organizer} · ${effectiveCoOrg}`
      : organizer
    : issuer;

  const issuedLineValue =
    platform && !organizerText.toLowerCase().includes(platform.toLowerCase())
      ? `${organizerText} (${platform})`
      : organizerText;

  let contextLabel = "Context";
  let contextValue = "";

  if (track && theme) {
    contextLabel = "Track & Theme";
    contextValue = `${track} · ${theme}`;
  } else if (track) {
    contextLabel = "Track";
    contextValue = track;
  } else if (theme) {
    contextLabel = "Theme";
    contextValue = theme;
  } else if (pathway) {
    contextLabel = "Pathway";
    contextValue = pathway;
  } else if (sessionLeader) {
    contextLabel = "Session Lead";
    contextValue = sessionLeader;
  } else if (facilitator) {
    contextLabel = "Facilitator";
    contextValue = facilitator;
  } else if (subjects && subjects.length > 0) {
    contextLabel = "Coursework";
    contextValue = `${subjects.length} evaluated subjects (${session || issueDate || year || "Academic Record"})`;
  } else if (achievementClaim) {
    contextLabel = "Highlight";
    contextValue = achievementClaim;
  } else if (event && format) {
    contextLabel = "Event";
    contextValue = `${event} · ${format}`;
  } else if (event || format) {
    contextLabel = "Event";
    contextValue = (event || format)!;
  } else {
    contextLabel = "Recognition";
    contextValue = record.category
      ? `${record.category.replace(/S$/, "")}${issueDate || year ? ` · ${issueDate || year}` : ""}`
      : "Verified Milestone";
  }

  let secondaryLabel = "Status";
  let secondaryValue =
    (verificationStatus && VERIFICATION_LABELS[verificationStatus]) || "Archival Record";

  const signatorySummary = formatSignatoriesSummary(signatories);
  if (signatorySummary) {
    secondaryLabel = signatories && signatories.length > 1 ? "Signatories" : "Signatory";
    secondaryValue = signatorySummary;
  } else if (teamMembers && teamMembers.length > 0) {
    secondaryLabel = "Team";
    secondaryValue = team
      ? `${team} (${teamMembers.length} members)`
      : `${teamMembers.length} members`;
  } else if (credentialId) {
    secondaryLabel = "Credential ID";
    secondaryValue = credentialId;
  }

  return (
    <div
      className={`rounded-[8px] border p-3.5 space-y-2 ${className}`}
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">
        Record Details
      </div>

      <dl className="m-0 space-y-1.5 text-xs leading-relaxed">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 min-w-0">
          <dt className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)] shrink-0">
            Organizer:
          </dt>
          <dd className="m-0 text-[var(--text-secondary)] font-medium break-words min-w-0">
            {issuedLineValue}
          </dd>
        </div>

        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 min-w-0">
          <dt className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)] shrink-0">
            {contextLabel}:
          </dt>
          <dd className="m-0 text-[var(--text-secondary)] break-words min-w-0">
            {contextValue}
          </dd>
        </div>

        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 min-w-0">
          <dt className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)] shrink-0">
            {secondaryLabel}:
          </dt>
          <dd className="m-0 text-[var(--text-secondary)] break-words min-w-0">
            {secondaryValue}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export const CredentialPreview = AchievementRecordDetails;
export default AchievementRecordDetails;
