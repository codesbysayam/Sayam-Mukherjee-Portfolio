import React from "react";
import { AchievementRecord } from "../../types/certificates";
import { usePortfolio } from "../../context/PortfolioContext";
import { Calendar, Users, Award, ShieldCheck, Clock, MapPin, Hash } from "lucide-react";

interface AchievementMetadataProps {
  record: AchievementRecord;
  className?: string;
}

export function AchievementMetadata({ record, className = "" }: AchievementMetadataProps) {
  const { theme } = usePortfolio();
  const isLight = theme === "light";

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
  const isTeammate = (recipient || participant) && (recipient || participant) !== "Sayam Mukherjee";
  const displayRecipient = recipient || participant;

  // Format team and role cleanly
  const teamRole = team && role ? `${team} · ${role}` : team ? team : role ? role : null;

  const chipBase = `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
    isLight
      ? "bg-slate-100 border border-slate-200 text-slate-700"
      : "bg-white/[0.04] border border-white/10 text-zinc-300"
  }`;

  return (
    <div className={`achievement-card__metadata flex flex-wrap items-center gap-2 min-w-0 ${className}`}>
      {/* 1. Teammate Recipient Badge (Preserves teammate distinction without confusion) */}
      {isTeammate && (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
            isLight
              ? "bg-blue-50 text-blue-700 border border-blue-200"
              : "bg-blue-950/50 text-blue-300 border border-blue-800/50"
          }`}
          title={`Credential awarded to ${displayRecipient}`}
        >
          <Award className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span>Recipient: {displayRecipient}</span>
        </span>
      )}

      {/* 2. Format / Duration */}
      {displayFormat && (
        <span className={chipBase} title={displayFormat}>
          <Clock className="w-3 h-3 text-purple-400 shrink-0" />
          <span className="truncate max-w-[260px]">{displayFormat}</span>
        </span>
      )}

      {/* 3. Duration if separate from format */}
      {duration && !displayFormat?.toLowerCase().includes(duration.toLowerCase()) && (
        <span className={chipBase}>
          <Clock className="w-3 h-3 text-purple-400 shrink-0" />
          <span>{duration}</span>
        </span>
      )}

      {/* 4. Team & Role Context */}
      {teamRole && (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            isLight
              ? "bg-purple-50 text-purple-700 border border-purple-200"
              : "bg-purple-950/30 text-purple-300 border border-purple-800/40"
          }`}
          title={`Team participation: ${teamRole}`}
        >
          <Users className="w-3 h-3 text-purple-400 shrink-0" />
          <span className="truncate max-w-[240px]">{teamRole}</span>
        </span>
      )}

      {/* 5. Date (if distinct from year) */}
      {date && date !== String(year) && (
        <span className={chipBase} title={`Date: ${date}`}>
          <Calendar className="w-3 h-3 text-zinc-400 shrink-0" />
          <span>{date}</span>
        </span>
      )}

      {/* 6. Academic Session */}
      {session && (
        <span className={chipBase} title={`Academic Session: ${session}`}>
          <span>Session: {session}</span>
        </span>
      )}

      {/* 7. Credential ID */}
      {credentialId && (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-medium ${
            isLight
              ? "bg-slate-100 border border-slate-200 text-slate-700"
              : "bg-white/[0.04] border border-white/10 text-zinc-300"
          }`}
          title={`Credential ID: ${credentialId}`}
        >
          <Hash className="w-3 h-3 text-purple-400 shrink-0" />
          <span>{credentialId}</span>
        </span>
      )}

      {/* 8. Venue */}
      {venue && (
        <span className={chipBase} title={`Venue: ${venue}`}>
          <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
          <span className="truncate max-w-[200px]">{venue}</span>
        </span>
      )}
    </div>
  );
}
export default AchievementMetadata;
