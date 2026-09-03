import { useState, useEffect, useRef, memo } from "react";
import { motion } from "motion/react";
import { EXTENDED_DATA } from "../data/extendedData";
import { 
  Youtube, Video, Users, Eye, Sparkles, Play, Clock, 
  ArrowRight, Compass, HelpCircle, BarChart, TrendingUp, ChevronLeft, ChevronRight 
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

function ContentCreatorSection() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // Simulated live stats
  const creatorStats = {
    subscribers: "1.1K+",
    views: "150K+",
    videosCount: "50+",
    frequency: "1–2 Weekly",
    categories: [
      "Technology", "Artificial Intelligence", "Finance", 
      "Psychology", "Sports", "Travel", "Current Affairs"
    ]
  };

  // Channel growth analytics coordinates
  const analyticsData = [
    { month: "Jan", subscribers: 240, views: 18000 },
    { month: "Feb", subscribers: 380, views: 29000 },
    { month: "Mar", subscribers: 550, views: 48000 },
    { month: "Apr", subscribers: 720, views: 78000 },
    { month: "May", subscribers: 910, views: 110000 },
    { month: "Jun", subscribers: 1100, views: 150000 }
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
    <div className="space-y-12 font-sans" id="creator-showcase">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs text-red-500 font-mono uppercase tracking-widest block font-bold">
          MEDIA PLATFORM
        </span>
        <h2 
          style={{ fontSize: "clamp(1.5rem, 3.5vw, 3.5rem)" }} 
          className="font-bold tracking-tight text-white font-display"
        >
          Content Creation
        </h2>
        <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
          Sharing knowledge beyond code. Creating high-signal visual guides surrounding software architecture, personal finance, and deep-dive psychological breakdowns.
        </p>
      </div>

      {/* Brand card & Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Obsidian Optics Brand details card */}
        <div className="lg:col-span-8 bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-950/20 border border-red-900/30 flex items-center justify-center shadow-inner">
                <Youtube className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-display tracking-tight leading-none">Obsidian Optics</h3>
                <span className="text-[10px] text-zinc-500 font-mono tracking-wider mt-1 block">YOUTUBE EDUCATION PORTAL</span>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed max-w-2xl">
              I established **Obsidian Optics** as an academic hub to simplify dense software topics, track market indices using sentiment analysis tools, and deliver educational content to fellow tech enthusiasts.
            </p>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {creatorStats.categories.map((cat, idx) => (
                <span key={idx} className="text-[10px] bg-zinc-900 text-zinc-400 border border-zinc-850 px-2.5 py-1 rounded-full font-mono">
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Core counts grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-zinc-900 pt-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[9px] text-zinc-500 font-mono block">SUBSCRIBERS</span>
              <span className="text-xl font-bold text-white font-display block">{creatorStats.subscribers}</span>
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[9px] text-zinc-500 font-mono block">COMBINED VIEWS</span>
              <span className="text-xl font-bold text-white font-display block">{creatorStats.views}</span>
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[9px] text-zinc-500 font-mono block">VIDEOS UPLOADED</span>
              <span className="text-xl font-bold text-white font-display block">{creatorStats.videosCount}</span>
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[9px] text-zinc-500 font-mono block">UPLOAD FREQUENCY</span>
              <span className="text-xs font-semibold text-red-400 mt-1 block font-mono uppercase">{creatorStats.frequency}</span>
            </div>
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
              Exploring Travel & Culture
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              An interactive sub-category focusing on travel metrics, geographical culture, knowledge extraction, and dynamic landscape explorations. Translating global adventures into high-signal blog notes.
            </p>
          </div>

          <button 
            onClick={() => alert("Launching localized geopolitical explorer module... Simulating culture records...")}
            className="w-full mt-6 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 text-xs font-mono font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>Decipher Database</span>
            <ArrowRight className="w-3.5 h-3.5 text-red-400" />
          </button>
        </div>

      </div>

      {/* YouTube Video Carousel Gallery */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">
            FEATURED VIDEO LIBRARY
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => scrollCarousel('left')}
              className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg border border-zinc-850 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg border border-zinc-850 cursor-pointer"
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

                {/* Simulated watch player hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-zinc-950/60 transition-opacity">
                  <button 
                    onClick={() => alert(`Redirecting securely to Obsidian Optics YouTube node to watch: "${video.title}"`)}
                    className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Play className="w-5 h-5 ml-0.5" />
                  </button>
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

                  <button
                    onClick={() => alert(`Launching YouTube player container...`)}
                    className="text-red-400 hover:text-red-300 transition-colors font-bold cursor-pointer"
                  >
                    Watch Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Channel Growth Analytics Area Graphs */}
      <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase block">
            AUDIENCE INSIGHTS & TELEMETRY
          </span>
          <h3 className="text-lg font-bold text-white font-display tracking-tight">
            Channel Analytics Dashboard
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Auditing cumulative view growth against subcounts. Maintaining steady weekly trends.
          </p>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsData}>
              <defs>
                <linearGradient id="creatorSubscribers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#52525b" fontSize={10} fontFamily="monospace" />
              <YAxis stroke="#52525b" fontSize={10} fontFamily="monospace" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#1f1f23', borderRadius: '12px' }}
                labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                itemStyle={{ fontSize: '11px', fontFamily: 'monospace' }}
              />
              <Area 
                type="monotone" 
                dataKey="subscribers" 
                stroke="#ef4444" 
                fillOpacity={1} 
                fill="url(#creatorSubscribers)" 
                name="Subscribers Count"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default memo(ContentCreatorSection);
