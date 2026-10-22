import type { YouTubeChannel } from "../types/youtube";

/**
 * BEASTIFIED Official Channel Record
 * Primary source: https://www.youtube.com/@Beastified_in/
 * Unverified statistics remain explicitly null and will display as "Not available".
 */
export const beastifiedChannel: YouTubeChannel = {
  id: "beastified",
  name: "BEASTIFIED",
  handle: "@Beastified_in",
  url: "https://www.youtube.com/@Beastified_in/",

  status: "active",
  startYear: 2026,
  endYear: null,

  category: "MrBeast-oriented content",
  description: "Official channel for MrBeast-oriented high-energy challenges, interactive concepts, and dynamic entertainment content.",

  currentSubscribers: 1, // Realtime snapshot as of 21 Oct 2026
  historicalSubscribers: null,
  subscribers: 1,

  totalViews: null, // Not displayed in 2026 selected period view; kept null
  videoCount: null,

  thumbnailUrl: null,
  bannerUrl: null,
  publishedAt: null,

  statisticsSource: "YouTube Studio screenshot snapshot (21 Oct 2026)",
  lastChecked: "2026-10-21",
  isVerified: true,
};

/**
 * Existing Portfolio YouTube Channels
 * Preserved from verified portfolio records.
 * Historical figures are explicitly labelled as historical, not live counts.
 */
export const existingYouTubeChannels: YouTubeChannel[] = [
  {
    id: "technicalaz",
    name: "Technical AZ",
    handle: "@technicalaz",
    url: "https://youtube.com/@technicalaz",
    status: "historical",
    startYear: 2021,
    endYear: 2023,
    category: "Technology & CS Tutorials",
    description: "Started at age 16; scaled to over 2,000 subscribers producing clear, hands-on tutorials on technology, consumer software, and developer tools.",
    currentSubscribers: null,
    historicalSubscribers: 2060,
    subscribers: 2060, // Kept for backward compatibility
    totalViews: 150000,
    videoCount: 50,
    thumbnailUrl: null,
    statisticsSource: "Previously supplied historical information",
    lastChecked: "2026-09-01",
    isVerified: true,
  },
  {
    id: "dailydecipher",
    name: "Daily Decipher",
    handle: "@dailydecipher",
    url: "https://youtube.com/@dailydecipher",
    status: "historical",
    startYear: 2023,
    endYear: 2026,
    category: "Algorithmic & Educational Breakdowns",
    description: "Educational channel scaled to an organic community of 10,000+ subscribers, focusing on distilling complex computer science concepts into clear visual narratives.",
    currentSubscribers: null,
    historicalSubscribers: 10000,
    subscribers: 10000, // Kept for backward compatibility
    totalViews: null,
    videoCount: null,
    thumbnailUrl: null,
    statisticsSource: "Previously supplied historical information",
    lastChecked: "2026-09-01",
    isVerified: true,
  },
  {
    id: "obsidianoptics",
    name: "Obsidian Optics",
    handle: "@ObsidianOptics_in",
    url: "https://www.youtube.com/@ObsidianOptics_in",
    status: "active",
    startYear: 2026,
    endYear: null,
    category: "Visual Storytelling & Media",
    description: "Official channel exploring visual arts, digital optics, and creative media production.",
    currentSubscribers: 1305, // Realtime snapshot as of 21 Oct 2026
    historicalSubscribers: null,
    subscribers: 1305,
    totalViews: 153049, // Exact lifetime views from Studio dashboard
    videoCount: null,
    thumbnailUrl: null,
    statisticsSource: "YouTube Studio screenshot snapshot (21 Oct 2026)",
    lastChecked: "2026-10-21",
    isVerified: true,
  },
];

/**
 * Centralized list of all portfolio YouTube channels.
 * Deduplicates channels by ID to prevent repeated entries.
 */
export const youtubeChannels: YouTubeChannel[] = [
  ...existingYouTubeChannels.filter((c) => c.id !== beastifiedChannel.id),
  beastifiedChannel,
];
