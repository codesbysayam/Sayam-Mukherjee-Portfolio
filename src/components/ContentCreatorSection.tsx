import { useState, useRef, memo } from "react";
import { EXTENDED_DATA } from "../data/extendedData";
import { LINKS } from "../config/links";
import { youtubeChannels } from "../data/channels";
import { YouTubeChannelCard } from "./YouTubeChannelCard";
import { YouTubeChannelAnalyticsSection } from "./YouTubeAnalyticsCard";
import { getCreatorSummary } from "../utils/contentCreatorStats";
import { 
  Youtube, Eye, Play, Compass, ArrowRight, ArrowLeft, ChevronLeft, ChevronRight,
  ShieldCheck, Calendar, Clock, Users, Sparkles, Activity
} from "lucide-react";

interface ContentCreatorSectionProps {
  onBack?: () => void;
}

function ContentCreatorSection({ onBack }: ContentCreatorSectionProps) {
  const [decipherNotice, setDecipherNotice] = useState<string | null>(null);
  const channels = youtubeChannels;
  const creatorSummary = getCreatorSummary(channels);

  // Verified categories representing actual channel areas
  const documentedCategories = [
    "Technology & Tutorials",
    "Computer Science",
    "Visual Media & Optics",
    "Algorithmic Explanations"
  ];

  // Carousel scroll handling
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="space-y-12 font-sans py-2" id="creator-showcase">
      {/* Anchor for video showcase links */}
      <span id="video-showcase" className="block -mt-12 pt-12" aria-hidden="true" />

      {/* Back button if opened as dedicated showcase view */}
      {onBack && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-850 hover:border-zinc-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Experience</span>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs text-red-500 font-mono uppercase tracking-widest block font-bold">
          MEDIA PLATFORM &amp; VIDEO SHOWCASE
        </span>
        <h2 
          style={{ fontSize: "clamp(1.5rem, 3.5vw, 3.5rem)" }} 
          className="font-bold tracking-tight text-white font-display"
        >
          YouTube Video Showcase
        </h2>
        <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
          Sharing knowledge beyond code. Creating high-signal visual guides surrounding software architecture, algorithm breakdowns, and creative media formats across dedicated YouTube channels.
        </p>
      </div>

      {/* Brand card & Key Verified Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Content Brand details card */}
        <div className="lg:col-span-8 bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-950/20 border border-red-900/30 flex items-center justify-center shadow-inner">
                <Youtube className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-display tracking-tight leading-none">CodesBySayam Media</h3>
                <span className="text-[10px] text-zinc-500 font-mono tracking-wider mt-1 block">TECHNICAL EDUCATION &amp; CREATIVE MEDIA PRODUCTION</span>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed max-w-2xl">
              I operate and maintain channels as educational and creative hubs to explain software concepts, document algorithms, and build visual narrative content for diverse audiences. Historical channel audiences are catalogued transparently without misleading combined aggregate figures.
            </p>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {documentedCategories.map((cat, idx) => (
                <span key={idx} className="text-[10px] bg-zinc-900 text-zinc-400 border border-zinc-800 px-2.5 py-1 rounded-md font-mono">
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Evidence-based Summary Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-zinc-900 pt-6">
            {creatorSummary.map((metric) => (
              <article
                key={metric.label}
                className="min-w-0 rounded-xl border border-zinc-900 bg-zinc-900/30 p-4 transition-colors hover:border-purple-500/40"
              >
                <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                  {metric.label}
                </p>
                <p className="mt-2 break-words text-2xl font-bold text-white font-display">
                  {metric.value}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500 font-mono">
                  {metric.detail}
                </p>
              </article>
            ))}
          </div>
        </div>

        {/* Daily Decipher card (specialized custom block) */}
        <div className="lg:col-span-4 bg-gradient-to-br from-red-950/10 to-zinc-950 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between hover:border-red-500/20 transition-all duration-300">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-red-400">
              <Compass className="w-4 h-4" />
              <span>DAILY DECIPHER PROMPT</span>
            </div>

            <h3 className="text-lg font-bold text-white font-display tracking-tight">
              Exploring Travel &amp; Culture
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              An educational channel focused on travel metrics, geographical culture, knowledge extraction, and dynamic landscape explorations. Scaled organically to an archive of 10,000+ subscribers (2023–2026).
            </p>

            {decipherNotice && (
              <div className="rounded-lg border border-red-900/40 bg-red-950/30 p-2.5 text-xs text-red-300 font-mono">
                {decipherNotice}
              </div>
            )}
          </div>

          <button 
            type="button"
            onClick={() => setDecipherNotice("Localized geopolitical explorer notes are currently archived. Visit @dailydecipher on YouTube for video releases.")}
            className="w-full mt-6 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-200 text-xs font-mono font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>Decipher Database</span>
            <ArrowRight className="w-3.5 h-3.5 text-red-400" />
          </button>
        </div>

      </div>

      {/* Centralized Channels Ecosystem Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">
              OFFICIAL CREATOR CHANNELS
            </span>
            <h3 className="font-display text-lg font-bold tracking-tight text-white">
              Channel Directory &amp; Platforms
            </h3>
          </div>
          <span className="font-mono text-xs text-zinc-500">
            {channels.length} Channels Listed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {channels.map((channel) => (
            <YouTubeChannelCard
              key={channel.id}
              channel={channel}
              featured={channel.id === "obsidianoptics"}
            />
          ))}
        </div>
      </div>

      {/* Verified YouTube Studio Analytics Section (Obsidian Optics 21 Oct 2026 Snapshot) */}
      <YouTubeChannelAnalyticsSection />

      {/* YouTube Video Carousel Gallery */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">
            FEATURED VIDEO LIBRARY
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => scrollCarousel('left')}
              aria-label="Scroll left"
              className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg border border-zinc-800 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              aria-label="Scroll right"
              className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg border border-zinc-800 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div 
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-none snap-x"
        >
          {EXTENDED_DATA.youtubeVideos.map((video) => (
            <div
              key={video.id}
              className="w-72 shrink-0 snap-start bg-zinc-950/40 border border-zinc-900 rounded-2xl overflow-hidden hover:border-red-500/20 transition-all duration-300 flex flex-col justify-between group h-full"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                
                {/* Duration indicator */}
                <span className="absolute bottom-2.5 right-2.5 bg-zinc-950/90 border border-zinc-800 text-[9px] text-zinc-300 font-mono px-1.5 py-0.5 rounded">
                  {video.duration}
                </span>

                {/* Watch player hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-zinc-950/60 transition-opacity">
                  <a 
                    href={video.watchUrl || LINKS.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Watch ${video.title} on YouTube`}
                    className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Play className="w-5 h-5 ml-0.5" />
                  </a>
                </div>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <h4 className="text-xs font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2">
                  {video.title}
                </h4>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-900 text-[10px] font-mono text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-zinc-600" />
                    {video.views} views
                  </span>

                  <a
                    href={video.watchUrl || LINKS.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-400 hover:text-red-300 transition-colors font-bold cursor-pointer"
                  >
                    Watch Now ↗
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verified YouTube Studio Analytics Overview Strip */}
      <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 md:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-900 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">
                HISTORICAL STUDIO AUDIT
              </span>
            </div>
            <h3 className="text-lg font-bold text-white font-display tracking-tight">
              Obsidian Optics · Recorded Milestone Telemetry
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-lg">
            Snapshot Date: 21 October 2026
          </span>
        </div>

        {/* 6 Verified Snapshot Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-900">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Lifetime Views</span>
            <span className="text-base sm:text-lg font-bold text-white font-display block mt-1">153,049</span>
            <span className="text-[10px] font-mono text-zinc-500 mt-0.5 block">Overview Header</span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-900">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Subscribers</span>
            <span className="text-base sm:text-lg font-bold text-white font-display block mt-1">1,305</span>
            <span className="text-[10px] font-mono text-zinc-500 mt-0.5 block">Realtime Panel</span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-900">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Watch Time</span>
            <span className="text-base sm:text-lg font-bold text-white font-display block mt-1">3.5K hrs</span>
            <span className="text-[10px] font-mono text-zinc-500 mt-0.5 block">13 Jan – 21 Oct</span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-900">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Subs Gained</span>
            <span className="text-base sm:text-lg font-bold text-emerald-400 font-display block mt-1">+1.1K</span>
            <span className="text-[10px] font-mono text-zinc-500 mt-0.5 block">Selected Period</span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-900">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Views (48h)</span>
            <span className="text-base sm:text-lg font-bold text-white font-display block mt-1">1,967</span>
            <span className="text-[10px] font-mono text-zinc-500 mt-0.5 block">Realtime Metric</span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-900">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Engaged Views</span>
            <span className="text-base sm:text-lg font-bold text-cyan-400 font-display block mt-1">1,200</span>
            <span className="text-[10px] font-mono text-zinc-500 mt-0.5 block">Realtime Panel</span>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-zinc-500 font-mono pt-2">
          Note: These figures reflect a recorded YouTube Studio snapshot from 21 October 2026 and may not represent current channel analytics. Historical channel figures are preserved separately.
        </p>
      </div>
    </div>
  );
}

export default memo(ContentCreatorSection);
