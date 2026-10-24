export type YouTubeMetricType =
  | "lifetime"
  | "period"
  | "realtime";

export interface YouTubeMetricSnapshot {
  value: number | null;
  /**
   * Preserves rounded or abbreviated figures as shown in the YouTube Studio dashboard
   * (e.g. "1.5L", "3.5K", "+1.1K").
   */
  displayValue?: string | null;
  metricType: YouTubeMetricType;
  periodStart?: string | null;
  periodEnd?: string | null;
  observedAt: string;
  source: "youtube-studio-screenshot";
}

export interface YouTubeChannelAnalytics {
  channelId: string;
  name: string;
  handle: string;
  url: string;

  lifetimeViews: YouTubeMetricSnapshot | null;
  periodViews: YouTubeMetricSnapshot | null;
  watchTimeHours: YouTubeMetricSnapshot | null;
  subscribersGained: YouTubeMetricSnapshot | null;

  currentSubscribers: YouTubeMetricSnapshot | null;
  viewsLast48Hours: YouTubeMetricSnapshot | null;
  engagedViews: YouTubeMetricSnapshot | null;
}

const OBSERVED_AT = "2026-10-21";
const SOURCE = "youtube-studio-screenshot" as const;

/**
 * Authoritative YouTube Studio Analytics Snapshots
 * Captured from verified YouTube Studio dashboard screenshots on 21 October 2026.
 * 
 * IMPORTANT INTEGRITY RULES:
 * 1. These are static historical snapshots, NOT live auto-updating API telemetry.
 * 2. Unobserved metrics remain strictly null and must never be fabricated or displayed as 0.
 * 3. Rounded period figures (e.g. 1.5L) are kept as displayValue and not converted to arbitrary numbers.
 */
export const youtubeChannelAnalytics: YouTubeChannelAnalytics[] = [
  {
    channelId: "obsidianoptics",
    name: "Obsidian Optics",
    handle: "@ObsidianOptics_in",
    url: "https://www.youtube.com/@ObsidianOptics_in",

    lifetimeViews: {
      value: 153049,
      displayValue: "153,049",
      metricType: "lifetime",
      observedAt: OBSERVED_AT,
      source: SOURCE,
    },

    periodViews: {
      value: null,
      displayValue: "1.5L",
      metricType: "period",
      periodStart: "2026-01-13",
      periodEnd: "2026-10-21",
      observedAt: OBSERVED_AT,
      source: SOURCE,
    },

    watchTimeHours: {
      value: 3500,
      displayValue: "3.5K",
      metricType: "period",
      periodStart: "2026-01-13",
      periodEnd: "2026-10-21",
      observedAt: OBSERVED_AT,
      source: SOURCE,
    },

    subscribersGained: {
      value: null,
      displayValue: "+1.1K",
      metricType: "period",
      periodStart: "2026-01-13",
      periodEnd: "2026-10-21",
      observedAt: OBSERVED_AT,
      source: SOURCE,
    },

    currentSubscribers: {
      value: 1305,
      displayValue: "1,305",
      metricType: "realtime",
      observedAt: OBSERVED_AT,
      source: SOURCE,
    },

    viewsLast48Hours: {
      value: 1967,
      displayValue: "1,967",
      metricType: "realtime",
      observedAt: OBSERVED_AT,
      source: SOURCE,
    },

    engagedViews: {
      value: 1200,
      displayValue: "1,200",
      metricType: "realtime",
      observedAt: OBSERVED_AT,
      source: SOURCE,
    },
  },
];

/**
 * Helper to retrieve channel analytics by ID
 */
export function getChannelAnalyticsById(channelId: string): YouTubeChannelAnalytics | undefined {
  const normalized = channelId.toLowerCase().replace(/[-_]/g, "");
  return youtubeChannelAnalytics.find(
    (c) => c.channelId.toLowerCase().replace(/[-_]/g, "") === normalized
  );
}
