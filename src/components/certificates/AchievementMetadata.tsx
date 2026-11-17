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
  const isTeammate =
    (recipient || participant) && (recipient || participant) !== "Sayam Mukherjee";
  const displayRecipient = recipient || participant;
  const teamRole = team && role ? `${team} · ${role}` : team ? team : role ? role : null;

  const chipStyle: React.CSSProperties = {
    backgroundColor: "var(--surface)",
    borderColor: "var(--border)",
    color: "var(--text-secondary)",
  };

  return (
    <div
      className={`achievement-card__metadata flex flex-wrap items-center gap-2 min-w-0 ${className}`}
    >
      {isTeammate && (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border text-xs font-mono font-semibold"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border-strong)",
            color: "var(--text)",
          }}
          title={`Credential awarded to ${displayRecipient}`}
        >
          <Award className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
          <span>Recipient: {displayRecipient}</span>
        </span>
      )}

      {displayFormat && (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border text-xs font-medium"
          style={chipStyle}
          title={displayFormat}
        >
          <Clock className="w-3 h-3 text-[var(--accent)] shrink-0" />
          <span className="truncate max-w-[260px]">{displayFormat}</span>
        </span>
      )}

      {duration && !displayFormat?.toLowerCase().includes(duration.toLowerCase()) && (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border text-xs font-medium"
          style={chipStyle}
        >
          <Clock className="w-3 h-3 text-[var(--accent)] shrink-0" />
          <span>{duration}</span>
        </span>
      )}

      {teamRole && (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border text-xs font-semibold"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border-strong)",
            color: "var(--text)",
          }}
          title={`Team participation: ${teamRole}`}
        >
          <Users className="w-3 h-3 text-[var(--accent)] shrink-0" />
          <span className="truncate max-w-[240px]">{teamRole}</span>
        </span>
      )}

      {date && date !== String(year) && (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border text-xs font-mono"
          style={chipStyle}
          title={`Date: ${date}`}
        >
          <Calendar className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
          <span>{date}</span>
        </span>
      )}

      {session && (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border text-xs font-mono"
          style={chipStyle}
          title={`Academic Session: ${session}`}
        >
          <span>Session: {session}</span>
        </span>
      )}

      {credentialId && (
        <span
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] border text-xs font-mono font-medium"
          style={chipStyle}
          title={`Credential ID: ${credentialId}`}
        >
          <Hash className="w-3 h-3 text-[var(--accent)] shrink-0" />
          <span>{credentialId}</span>
        </span>
      )}

      {venue && (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border text-xs font-medium"
          style={chipStyle}
          title={`Venue: ${venue}`}
        >
          <MapPin className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
          <span className="truncate max-w-[200px]">{venue}</span>
        </span>
      )}
    </div>
  );
}

export default AchievementMetadata;
