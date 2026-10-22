import type { YouTubeChannel } from "../types/youtube";

/**
 * Utility to format YouTube statistics with strict verification guarantees.
 * Returns "Not available" when numbers are null, undefined, or unverified.
 * Never invents 0 or placeholder numbers.
 */

export interface FormatStatOptions {
  compact?: boolean;
  fallbackText?: string;
}

export function formatYouTubeStat(
  value: number | null | undefined,
  options: FormatStatOptions = {}
): string {
  const { compact = true, fallbackText = "Not available" } = options;

  if (value === null || value === undefined || isNaN(value)) {
    return fallbackText;
  }

  // If compact format is requested
  if (compact) {
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
    }
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
    }
    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
    }
    return value.toLocaleString();
  }

  return value.toLocaleString();
}

/**
 * Distinguishes historical subscriber metrics from current verified metrics.
 * Ensures historical numbers are never displayed as current real-time counts.
 */
export function getSubscriberDisplayInfo(channel: YouTubeChannel): {
  label: string;
  value: string;
  isHistorical: boolean;
} {
  if (channel.historicalSubscribers !== null && channel.historicalSubscribers !== undefined) {
    return {
      label: "Historical Subs",
      value: `${formatYouTubeStat(channel.historicalSubscribers)}+`,
      isHistorical: true,
    };
  }

  if (channel.currentSubscribers !== null && channel.currentSubscribers !== undefined) {
    return {
      label: "Subscribers",
      value: formatYouTubeStat(channel.currentSubscribers),
      isHistorical: false,
    };
  }

  if (channel.subscribers !== null && channel.subscribers !== undefined) {
    const isHist = channel.status === "historical";
    return {
      label: isHist ? "Historical Subs" : "Subscribers",
      value: `${formatYouTubeStat(channel.subscribers)}${isHist ? "+" : ""}`,
      isHistorical: isHist,
    };
  }

  return {
    label: "Subscribers",
    value: "Not available",
    isHistorical: false,
  };
}

/**
 * Format date string to human-readable month/year or localized date.
 */
export function formatChannelDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "Not available";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Not available";
    return d.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric"
    });
  } catch {
    return "Not available";
  }
}
