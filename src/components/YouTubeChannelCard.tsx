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
      className={`group relative flex flex-col justify-between rounded-2xl border transition-all duration-300 ${
        featured
          ? "border-red-900/40 bg-zinc-950/70 hover:border-red-500/50 shadow-lg shadow-red-950/15"
          : "border-zinc-900 bg-zinc-950/50 hover:border-zinc-800"
      } ${compact ? "p-4 sm:p-5" : "p-6 md:p-7"}`}
    >
      {/* Header / Brand */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar with fallback */}
            <div className={`relative flex shrink-0 items-center justify-center rounded-xl border border-red-900/30 bg-red-950/20 shadow-inner overflow-hidden ${
              compact ? "h-11 w-11" : "h-13 w-13"
            }`}>
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
                <div className="flex items-center justify-center text-lg font-bold font-display text-red-400">
                  {initialLetter}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 rounded-full bg-zinc-950 p-0.5">
                <Youtube className="h-3 w-3 text-red-500" />
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-display font-bold tracking-tight text-white group-hover:text-red-400 transition-colors truncate text-sm sm:text-base">
                  {channel.name}
                </h3>
                {isVerified && (
                  <span title="Verified Channel Records">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                {channel.handle && (
                  <span className="font-mono text-xs text-zinc-400 truncate">
                    {channel.handle}
                  </span>
                )}
                {activityPeriod && (
                  <span className="font-mono text-[10px] text-zinc-500 flex items-center gap-1">
                    <History className="h-2.5 w-2.5 text-zinc-500" />
                    <span>{activityPeriod}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Status or Category Badge */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            {channel.status === "historical" ? (
              <span className="rounded border border-amber-900/40 bg-amber-950/30 px-2 py-0.5 font-mono text-[9px] text-amber-400 uppercase font-semibold">
                Historical
              </span>
            ) : channel.category ? (
              <span className="rounded border border-zinc-850 bg-zinc-900/80 px-2 py-0.5 font-mono text-[9px] text-zinc-400 max-w-[130px] truncate">
                {channel.category}
              </span>
            ) : null}
          </div>
        </div>

        {/* Description */}
        {channel.description && !compact && (
          <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
            {channel.description}
          </p>
        )}

        {/* Statistics Grid */}
        <div className="grid grid-cols-3 gap-2 rounded-xl border border-zinc-900/80 bg-zinc-900/30 p-2.5 pt-3">
          <div className="space-y-0.5 text-center sm:text-left min-w-0">
            <span className={`block font-mono text-[9px] uppercase tracking-wider truncate ${
              subInfo.isHistorical ? "text-amber-400/90 font-medium" : "text-zinc-500"
            }`}>
              {subInfo.label}
            </span>
            <span className={`block font-display text-xs sm:text-sm font-semibold truncate ${
              subInfo.isHistorical ? "text-amber-200" : "text-white"
            }`}>
              {loading ? (
                <span className="inline-block h-3.5 w-12 animate-pulse rounded bg-zinc-800" />
              ) : (
                subInfo.value
              )}
            </span>
          </div>

          <div className="space-y-0.5 text-center sm:text-left min-w-0">
            <span className="block font-mono text-[9px] uppercase tracking-wider text-zinc-500 truncate">
              Total Views
            </span>
            <span className="block font-display text-xs sm:text-sm font-semibold text-white truncate">
              {loading ? (
                <span className="inline-block h-3.5 w-12 animate-pulse rounded bg-zinc-800" />
              ) : (
                formatYouTubeStat(channel.totalViews)
              )}
            </span>
          </div>

          <div className="space-y-0.5 text-center sm:text-left min-w-0">
            <span className="block font-mono text-[9px] uppercase tracking-wider text-zinc-500 truncate">
              Videos
            </span>
            <span className="block font-display text-xs sm:text-sm font-semibold text-white truncate">
              {loading ? (
                <span className="inline-block h-3.5 w-12 animate-pulse rounded bg-zinc-800" />
              ) : (
                formatYouTubeStat(channel.videoCount)
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions & Status */}
      <div className={`flex items-center justify-between border-t border-zinc-900/90 ${
        compact ? "mt-4 pt-3" : "mt-5 pt-4"
      }`}>
        <div className="flex items-center gap-1.5 text-[10px] font-mono">
          {subInfo.isHistorical ? (
            <span className="text-zinc-500 text-[10px]">
              Archived milestone
            </span>
          ) : isVerified ? (
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Verified Telemetry
            </span>
          ) : (
            <span className="flex items-center gap-1 text-zinc-500" title="Statistics awaiting YouTube API verification">
              <AlertCircle className="h-3 w-3 text-zinc-500" />
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
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-mono text-xs font-medium text-zinc-200 transition-colors hover:border-red-500/40 hover:bg-zinc-850 hover:text-white"
          >
            <span>Visit Channel</span>
            <ExternalLink className="h-3 w-3 text-red-400" />
          </a>
        ) : (
          <span className="text-[10px] font-mono text-zinc-600">
            Link unavailable
          </span>
        )}
      </div>
    </div>
  );
};
