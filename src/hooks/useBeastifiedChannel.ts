import { useState, useEffect, useCallback } from "react";
import { beastifiedChannel } from "../data/channels";
import type { YouTubeChannel, YouTubeStatsResponse } from "../types/youtube";

export interface UseBeastifiedChannelResult {
  channel: YouTubeChannel;
  loading: boolean;
  error: string | null;
  source: string;
  refresh: () => Promise<void>;
}

export function useBeastifiedChannel(): UseBeastifiedChannelResult {
  const [channel, setChannel] = useState<YouTubeChannel>(beastifiedChannel);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string>("unverified");

  const fetchChannelData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/youtube/beastified");
      if (!res.ok) {
        throw new Error(`API responded with HTTP ${res.status}`);
      }

      const data: YouTubeStatsResponse = await res.json();
      if (data?.channel) {
        setChannel(data.channel);
        setSource(data.source || (data.channel.statisticsSource ?? "unverified"));
      } else {
        setChannel(beastifiedChannel);
      }
    } catch (err: any) {
      console.warn("Could not fetch live YouTube channel metrics; using default record:", err.message);
      setError(err?.message || "Failed to load channel telemetry");
      setChannel(beastifiedChannel);
      setSource("unverified");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChannelData();
  }, [fetchChannelData]);

  return {
    channel,
    loading,
    error,
    source,
    refresh: fetchChannelData,
  };
}
