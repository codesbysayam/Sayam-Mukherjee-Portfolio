import React from "react";
import { AchievementRecord } from "../../types/certificates";
import { Calendar, Users, Award, Clock, MapPin, Hash } from "lucide-react";

interface AchievementMetadataProps {
  record: AchievementRecord;
  className?: string;
}

export function AchievementMetadata({ record, className = "" }: AchievementMetadataProps) {
  const {
    format,
    eventFormat,
    duration,
    date,
    eventDateDisplay,
    issueDate,
    year,
    team,
    role,
    recipient,
    participant,
    credentialId,
    session,
    venue,
  } = record;

  const displayFormat = eventFormat || format;
  const rawRecipient = (recipient || participant || "").trim();
  const isTeammate =
    Boolean(rawRecipient) && rawRecipient.toLowerCase() !== "sayam mukherjee";
  const teamRole = team && role ? `${team} · ${role}` : team ? team : role ? role : null;
  const displayDate = eventDateDisplay || date;

  const chipStyle: React.CSSProperties = {
    backgroundColor: "var(--surface)",
    borderColor: "var(--border)",
    color: "var(--text-secondary)",
  };

  const hasSpecificChips = Boolean(
    isTeammate ||
      displayFormat ||
      (duration && !displayFormat?.toLowerCase().includes(duration.toLowerCase())) ||
      teamRole ||
      (displayDate && displayDate !== String(year)) ||
      session ||
      credentialId ||
      venue
  );

  const fallbackYearLabel = !hasSpecificChips && (issueDate || year) ? String(issueDate || year) : null;

  return (
    <div
      className={`achievement-card__metadata flex flex-wrap items-center gap-2 min-w-0 ${className}`}
    >
      {isTeammate && (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border text-xs font-mono font-semibold max-w-full"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border-strong)",
            color: "var(--text)",
          }}
          title={`Credential awarded to ${rawRecipient}`}
        >
          <Award className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
          <span className="break-words">Recipient: {rawRecipient}</span>
        </span>
      )}

      {displayFormat && (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border text-xs font-medium max-w-full"
          style={chipStyle}
          title={displayFormat}
        >
          <Clock className="w-3 h-3 text-[var(--accent)] shrink-0" />
          <span className="break-words">{displayFormat}</span>
        </span>
      )}

      {duration && !displayFormat?.toLowerCase().includes(duration.toLowerCase()) && (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border text-xs font-medium max-w-full"
          style={chipStyle}
        >
          <Clock className="w-3 h-3 text-[var(--accent)] shrink-0" />
          <span>{duration}</span>
        </span>
      )}

      {teamRole && (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border text-xs font-semibold max-w-full"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border-strong)",
            color: "var(--text)",
          }}
          title={`Participation: ${teamRole}`}
        >
          <Users className="w-3 h-3 text-[var(--accent)] shrink-0" />
          <span className="break-words">{teamRole}</span>
        </span>
      )}

      {displayDate && displayDate !== String(year) && (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border text-xs font-mono max-w-full"
          style={chipStyle}
          title={`Date: ${displayDate}`}
        >
          <Calendar className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
          <span>{displayDate}</span>
        </span>
      )}

      {fallbackYearLabel && (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border text-xs font-mono max-w-full"
          style={chipStyle}
          title={`Year: ${fallbackYearLabel}`}
        >
          <Calendar className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
          <span>{fallbackYearLabel}</span>
        </span>
      )}

      {session && (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border text-xs font-mono max-w-full"
          style={chipStyle}
          title={`Academic Session: ${session}`}
        >
          <span>Session: {session}</span>
        </span>
      )}

      {credentialId && (
        <span
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] border text-xs font-mono font-medium max-w-full"
          style={chipStyle}
          title={`Credential ID: ${credentialId}`}
        >
          <Hash className="w-3 h-3 text-[var(--accent)] shrink-0" />
          <span className="break-all">{credentialId}</span>
        </span>
      )}

      {venue && (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border text-xs font-medium max-w-full"
          style={chipStyle}
          title={`Venue: ${venue}`}
        >
          <MapPin className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
          <span className="break-words">{venue}</span>
        </span>
      )}
    </div>
  );
}

export default AchievementMetadata;
