import React from "react";
import { Youtube, ExternalLink, CheckCircle2, History, AlertCircle } from "lucide-react";
import type { YouTubeChannel } from "../types/youtube";
import { formatYouTubeStat, getSubscriberDisplayInfo } from "../utils/formatYouTubeStats";

interface YouTubeChannelCardProps {
  channel: YouTubeChannel;
  loading?: boolean;
  featured?: boolean;
  compact?: boolean;
}

export const YouTubeChannelCard: React.FC<YouTubeChannelCardProps> = ({
  channel,
  loading = false,
  featured = false,
  compact = false,
}) => {
  const isVerified = channel.statisticsSource === "live-api" || channel.isVerified;
  const initialLetter = (channel.name || "Y").charAt(0).toUpperCase();
  const subInfo = getSubscriberDisplayInfo(channel);

  const activityPeriod = channel.startYear
    ? `${channel.startYear}–${channel.endYear || "Present"}`
    : null;

  return (
    <div
      className={`card group relative flex flex-col justify-between ${
        compact ? "p-4 sm:p-5" : "p-6 md:p-7"
      }`}
      style={{
        backgroundColor: "var(--surface-2)",
        borderColor: featured ? "var(--border-strong)" : "var(--border)",
      }}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`relative flex shrink-0 items-center justify-center rounded-[8px] border overflow-hidden ${
                compact ? "h-11 w-11" : "h-13 w-13"
              }`}
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              {channel.thumbnailUrl ? (
                <img
                  src={channel.thumbnailUrl}
                  alt={channel.name}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center text-lg font-bold font-display text-[var(--text)]">
                  {initialLetter}
                </div>
              )}
              <div
                className="absolute -bottom-1 -right-1 rounded-full p-0.5 border"
                style={{
                  backgroundColor: "var(--surface-2)",
                  borderColor: "var(--border)",
                }}
              >
                <Youtube className="h-3 w-3 text-[#DC2626]" />
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-display font-bold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)] transition-colors truncate text-sm sm:text-base">
                  {channel.name}
                </h3>
                {isVerified && (
                  <span title="Verified Channel Records">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[var(--accent)] shrink-0" />
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                {channel.handle && (
                  <span className="font-mono text-xs text-[var(--text-muted)] truncate">
                    {channel.handle}
                  </span>
                )}
                {activityPeriod && (
                  <span className="font-mono text-[10px] text-[var(--text-faint)] flex items-center gap-1">
                    <History className="h-2.5 w-2.5" />
                    <span>{activityPeriod}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            {channel.status === "historical" ? (
              <span
                className="rounded-[4px] border px-2 py-0.5 font-mono text-[9px] uppercase font-semibold"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border-strong)",
                  color: "var(--warning)",
                }}
              >
                Historical
              </span>
            ) : channel.category ? (
              <span
                className="rounded-[4px] border px-2 py-0.5 font-mono text-[9px] text-[var(--text-muted)] max-w-[130px] truncate"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                {channel.category}
              </span>
            ) : null}
          </div>
        </div>

        {channel.description && !compact && (
          <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
            {channel.description}
          </p>
        )}

        {/* Stats Grid */}
        <div
          className="grid grid-cols-3 gap-2 rounded-[8px] border p-3"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <div className="space-y-0.5 text-center sm:text-left min-w-0">
            <span
              className="block font-mono text-[9px] uppercase tracking-wider truncate"
              style={{
                color: subInfo.isHistorical ? "var(--warning)" : "var(--text-faint)",
              }}
            >
              {subInfo.label}
            </span>
            <span className="block font-display text-xs sm:text-sm font-bold text-[var(--text)] tabular-nums truncate">
              {loading ? "..." : subInfo.value}
            </span>
          </div>

          <div className="space-y-0.5 text-center sm:text-left min-w-0">
            <span className="block font-mono text-[9px] uppercase tracking-wider text-[var(--text-faint)] truncate">
              Total Views
            </span>
            <span className="block font-display text-xs sm:text-sm font-bold text-[var(--text)] tabular-nums truncate">
              {loading ? "..." : formatYouTubeStat(channel.totalViews)}
            </span>
          </div>

          <div className="space-y-0.5 text-center sm:text-left min-w-0">
            <span className="block font-mono text-[9px] uppercase tracking-wider text-[var(--text-faint)] truncate">
              Videos
            </span>
            <span className="block font-display text-xs sm:text-sm font-bold text-[var(--text)] tabular-nums truncate">
              {loading ? "..." : formatYouTubeStat(channel.videoCount)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className={`flex items-center justify-between border-t ${
          compact ? "mt-4 pt-3" : "mt-5 pt-4"
        }`}
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-1.5 text-[10px] font-mono">
          {subInfo.isHistorical ? (
            <span className="text-[var(--text-faint)]">Archived milestone</span>
          ) : isVerified ? (
            <span className="flex items-center gap-1.5 text-[var(--accent)] font-semibold">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: "var(--accent)" }}
              />
              Verified Telemetry
            </span>
          ) : (
            <span
              className="flex items-center gap-1 text-[var(--text-faint)]"
              title="Statistics awaiting YouTube API verification"
            >
              <AlertCircle className="h-3 w-3" />
              Stats Unverified
            </span>
          )}
        </div>

        {channel.url ? (
          <a
            href={channel.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${channel.name} on YouTube`}
            className="btn btn-secondary min-h-[34px] px-3 py-1.5 font-mono text-xs"
          >
            <span>Visit Channel</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="text-[10px] font-mono text-[var(--text-faint)]">
            Link unavailable
          </span>
        )}
      </div>
    </div>
  );
};
