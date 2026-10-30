import type { YouTubeChannel } from "../types/youtube";
import { youtubeChannelAnalytics } from "../data/youtubeAnalytics";

export interface CreatorSummaryMetric {
  label: string;
  value: string;
  detail: string;
}

function formatCount(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "Not available";
  }

  return new Intl.NumberFormat("en-IN").format(value);
}

/**
 * Generates an evidence-backed summary from documented channel records.
 * Historical subscribers are deliberately excluded from the current
 * subscriber total. Different channels represent distinct periods,
 * and their audiences are never presented as a combined total.
 */
export function getCreatorSummary(
  channels: YouTubeChannel[]
): CreatorSummaryMetric[] {
  const activeChannels = channels.filter(
    (channel) => channel.status === "active"
  );

  const recordedAnalytics = youtubeChannelAnalytics;

  return [
    {
      label: "DOCUMENTED CHANNELS",
      value: formatCount(channels.length),
      detail: "Current and historical channel records",
    },
    {
      label: "ACTIVE CHANNEL RECORDS",
      value: formatCount(activeChannels.length),
      detail: "Based on portfolio's verified channel status",
    },
    {
      label: "RECORDED STUDIO SNAPSHOTS",
      value: formatCount(recordedAnalytics.length),
      detail: "Static historical snapshot (21 Oct 2026)",
    },
  ];
}

/**
 * Formats an individual channel metric without converting unknown values
 * into fabricated zeros.
 */
export function formatChannelMetric(
  value: number | null | undefined
): string {
  return formatCount(value);
}
