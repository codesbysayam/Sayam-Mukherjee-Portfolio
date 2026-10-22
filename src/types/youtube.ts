/**
 * Centralized YouTube Channel Interface
 * Standardized across all portfolio creator displays, experience sections, and live API proxies.
 */
export type ChannelStatus = "active" | "historical" | "unknown";

export interface YouTubeChannel {
  id: string;
  name: string;
  handle: string | null;
  url: string;

  status?: ChannelStatus;

  startYear?: number | null;
  endYear?: number | null;

  category?: string | null;
  description?: string | null;

  currentSubscribers?: number | null;
  historicalSubscribers?: number | null;
  subscribers?: number | null; // Backward-compatible alias

  totalViews?: number | null;
  videoCount?: number | null;

  thumbnailUrl?: string | null;
  bannerUrl?: string | null;
  publishedAt?: string | null;

  statisticsSource?: string | null;
  lastChecked?: string | null;
  isVerified?: boolean;
}

export interface YouTubeStatsResponse {
  success: boolean;
  channel: YouTubeChannel;
  source: 'live-api' | 'verified-baseline' | 'unverified';
  message?: string;
  retrievedAt: string;
}
