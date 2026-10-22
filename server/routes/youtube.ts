import { Request, Response } from "express";
import { beastifiedChannel, youtubeChannels } from "../../src/data/channels.ts";
import type { YouTubeChannel, YouTubeStatsResponse } from "../../src/types/youtube.ts";

interface CacheEntry {
  timestamp: number;
  data: YouTubeChannel;
}

const channelCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes cache

/**
 * Safely queries YouTube Data API v3 for a channel handle.
 * If API key is absent, invalid, or quota exceeded, falls back gracefully.
 */
async function fetchChannelFromYouTubeApi(handle: string): Promise<Partial<YouTubeChannel> | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return null;
  }

  // Sanitize handle (remove leading @ if present)
  const cleanHandle = handle.startsWith("@") ? handle.slice(1) : handle;

  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/channels");
    url.searchParams.set("part", "snippet,statistics");
    url.searchParams.set("forHandle", cleanHandle);
    url.searchParams.set("key", apiKey);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      console.warn(`[YouTube API] Fetch failed for @${cleanHandle}: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: any = await response.json();
    if (!data.items || data.items.length === 0) {
      return null;
    }

    const item = data.items[0];
    const snippet = item.snippet || {};
    const stats = item.statistics || {};

    return {
      name: snippet.title || undefined,
      description: snippet.description || null,
      publishedAt: snippet.publishedAt || null,
      thumbnailUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || null,
      subscribers: stats.hiddenSubscriberCount ? null : stats.subscriberCount ? Number(stats.subscriberCount) : null,
      totalViews: stats.viewCount ? Number(stats.viewCount) : null,
      videoCount: stats.videoCount ? Number(stats.videoCount) : null,
      statisticsSource: "live-api",
      lastChecked: new Date().toISOString(),
      isVerified: true,
    };
  } catch (err: any) {
    console.warn(`[YouTube API] Error fetching @${cleanHandle}:`, err?.message || err);
    return null;
  }
}

/**
 * Resolves channel data by ID, merging live telemetry if available with default record.
 */
export async function getResolvedChannel(channelId: string): Promise<YouTubeChannel> {
  const defaultChannel = youtubeChannels.find((c) => c.id === channelId) || (channelId === "beastified" ? beastifiedChannel : null);
  
  if (!defaultChannel) {
    throw new Error(`Channel not found: ${channelId}`);
  }

  const now = Date.now();
  const cached = channelCache.get(channelId);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  // Attempt live API resolution if handle exists
  const liveData = await fetchChannelFromYouTubeApi(defaultChannel.handle);

  const merged: YouTubeChannel = {
    ...defaultChannel,
    ...(liveData || {}),
    // Ensure essential identifiers are always immutable
    id: defaultChannel.id,
    handle: defaultChannel.handle,
    url: defaultChannel.url,
    category: defaultChannel.category,
    lastChecked: liveData?.lastChecked || new Date().toISOString(),
    statisticsSource: liveData ? "live-api" : (defaultChannel.statisticsSource || "unverified"),
  };

  channelCache.set(channelId, { timestamp: now, data: merged });
  return merged;
}

/**
 * Route handler: GET /api/youtube/beastified
 */
export async function getBeastifiedHandler(req: Request, res: Response) {
  try {
    const channel = await getResolvedChannel("beastified");
    const responsePayload: YouTubeStatsResponse = {
      success: true,
      channel,
      source: channel.statisticsSource === "live-api" ? "live-api" : "unverified",
      message: channel.statisticsSource === "live-api"
        ? "Live statistics retrieved from YouTube API."
        : "Statistics unverified. Public metrics unavailable or YouTube API key not configured.",
      retrievedAt: new Date().toISOString(),
    };
    return res.json(responsePayload);
  } catch (err: any) {
    console.error("GET /api/youtube/beastified error:", err);
    return res.status(500).json({
      success: false,
      channel: beastifiedChannel,
      source: "unverified",
      error: err?.message || "Internal server error resolving BEASTIFIED channel",
      retrievedAt: new Date().toISOString(),
    });
  }
}

/**
 * Route handler: GET /api/youtube/channels
 */
export async function getAllChannelsHandler(req: Request, res: Response) {
  try {
    const channels = await Promise.all(
      youtubeChannels.map((c) => getResolvedChannel(c.id).catch(() => c))
    );
    return res.json({
      success: true,
      channels,
      retrievedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      channels: youtubeChannels,
      error: err?.message || "Error resolving YouTube channels",
      retrievedAt: new Date().toISOString(),
    });
  }
}
