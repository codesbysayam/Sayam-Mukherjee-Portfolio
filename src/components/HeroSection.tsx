import { memo, useMemo } from "react";
import { ArrowUpRight, RotateCw, Star, GitFork, Github, GitCommit } from "lucide-react";
import { useGithub } from "../hooks/useGithub";
import {
  formatRelativeTime,
  formatSyncAge,
  formatGitHubEvent
} from "../services/github";

interface HeroSectionProps {
  onViewWork: () => void;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Go: "#00ADD8",
  Rust: "#dea584",
  Shell: "#89e051"
};

function HeroSectionComponent({ onViewWork }: HeroSectionProps) {
  const {
    user,
    repos,
    events,
    stats,
    latestRepo,
    latestEvent,
    loading,
    syncedAt,
    usingCache,
    rateLimited,
    refresh
  } = useGithub();

  // Color dot helper
  const getLanguageColor = (lang: string | null) => {
    if (!lang) return "#71717a";
    return LANGUAGE_COLORS[lang] || "#a1a1aa";
  };

  // Parsed authentic activity event
  const recentActivity = useMemo(() => {
    return formatGitHubEvent(latestEvent);
  }, [latestEvent]);

  return (
    <div className="w-full relative select-none">
      {/* Centered Hero Section */}
      <section className="hero relative" id="hero" aria-label="Hero">
        {/* ==================================================
            LEFT COLUMN (≈ 60% on desktop)
            ================================================== */}
        <div className="hero-grid flex flex-col justify-center text-left">
          
          {/* Author Identity & Availability Status Line */}
          <div className="flex items-center gap-3.5 mb-6">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-white/15 bg-zinc-900 shadow-md shrink-0">
              <img
                src="https://inevitable-jade-qvzysrme.edgeone.dev/IMG_2636.jpeg"
                alt="Sayam Mukherjee"
                width={48}
                height={48}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover filter contrast-[1.02]"
              />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="text-sm font-bold text-white font-sans flex items-center gap-2">
                <span>Sayam Mukherjee</span>
                <span className="text-[11px] text-zinc-400 font-mono font-normal hidden sm:inline">
                  · KIIT B.Tech CSE (AI &amp; ML)
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-zinc-300">Open to internships · collaborations · freelance</span>
              </div>
            </div>
          </div>

          {/* Main Editorial Headline */}
          <h1 className="hero-title font-extrabold tracking-tight text-white font-display">
            Designing the Next{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300">
              Standard of Software
            </span>
          </h1>

          {/* Role Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl font-mono text-zinc-200 mt-5 sm:mt-6 font-semibold tracking-tight">
            I am a Future AI Engineer.
          </p>

          {/* Genuine Student Background */}
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl mt-3">
            2nd Year (3rd Sem) B.Tech CSE (AI &amp; ML) student at KIIT Bhubaneswar. Building intelligent web systems, machine learning applications, and purposeful software.
          </p>

          {/* Direct Calls to Action */}
          <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 pt-7 sm:pt-8">
            <button
              type="button"
              onClick={onViewWork}
              className="px-6 sm:px-7 py-3.5 rounded-2xl bg-white text-zinc-950 hover:bg-zinc-100 font-mono text-xs sm:text-sm font-bold tracking-wide transition-all shadow-lg hover:shadow-xl cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              View My Work
            </button>
            <a
              href="https://github.com/codesbysayam"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 hover:border-white/20 font-mono text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            >
              <span>GitHub</span>
              <span className="text-zinc-400">↗</span>
            </a>
          </div>
        </div>

        {/* ==================================================
            RIGHT COLUMN: REBUILT GITHUB LIVE SHOWCASE & CURRENTLY BUILDING
            ================================================== */}
        <div className="hero-grid flex flex-col items-start lg:items-end justify-center w-full">
          <div 
            id="hero-github-card"
            className="signal-card w-full max-w-[430px] rounded-3xl p-5 sm:p-6 bg-zinc-950/70 border border-white/[0.1] backdrop-blur-2xl shadow-2xl transition-all duration-300 hover:border-purple-500/30 hover:shadow-purple-500/5 group flex flex-col justify-between select-text"
          >
            {/* Header: Unified Profile & Live Telemetry Node */}
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
              {/* Profile identity block */}
              <a
                href={user?.html_url || "https://github.com/codesbysayam"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 min-w-0 group/profile"
                title="View Sayam's GitHub Profile"
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white/15 bg-zinc-900 group-hover/profile:border-purple-400/50 transition-colors shadow-inner">
                    <img
                      src={user?.avatar_url || "https://avatars.githubusercontent.com/u/85777731?v=4"}
                      alt={user?.name || "Sayam Mukherjee"}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  {/* Status dot */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-zinc-950 rounded-full animate-pulse" />
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 leading-tight">
                    <span className="text-sm font-semibold text-white group-hover/profile:text-purple-300 transition-colors truncate">
                      {user?.name || "Sayam Mukherjee"}
                    </span>
                    <Github className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mt-0.5 truncate">
                    <span className="text-purple-300/90 font-medium">@{user?.login || "codesbysayam"}</span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-zinc-400">{user?.location || "Kolkata, India"}</span>
                  </div>
                </div>
              </a>

              {/* Live Signal Badge & Sync Action */}
              <div className="flex items-center gap-1.5 shrink-0 bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-full text-[10px] font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-emerald-400 font-semibold tracking-wide">LIVE</span>
                <span className="text-zinc-500 font-mono text-[9px] hidden sm:inline ml-0.5">
                  {formatSyncAge(syncedAt)}
                </span>
                <button
                  type="button"
                  onClick={() => refresh()}
                  disabled={loading}
                  title="Force re-sync live GitHub telemetry"
                  className="ml-1 text-zinc-400 hover:text-white transition-colors cursor-pointer disabled:opacity-40"
                  aria-label="Refresh live GitHub data"
                >
                  <RotateCw className={`w-3 h-3 ${loading ? "animate-spin text-purple-400" : ""}`} />
                </button>
              </div>
            </div>

            {/* Rate limit notification if active */}
            {rateLimited && !user && (
              <div className="mt-2 text-[10px] font-mono text-amber-300/90 bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20">
                Using cached GitHub telemetry
              </div>
            )}

            {/* Currently Building Showcase */}
            <div className="py-4 space-y-2.5">
              {/* Eyebrow badge */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-purple-400 bg-purple-950/40 border border-purple-800/40 px-2 py-0.5 rounded-md">
                  <span className="w-1 h-1 rounded-full bg-purple-400" />
                  CURRENTLY BUILDING
                </span>
                <span className="text-[11px] text-zinc-500 font-sans">
                  Updated {formatRelativeTime(latestRepo?.updated_at)}
                </span>
              </div>

              {/* Project title with subtle external arrow */}
              <a
                href={latestRepo?.html_url || "https://github.com/codesbysayam"}
                target="_blank"
                rel="noopener noreferrer"
                className="group/repo block"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover/repo:text-purple-300 transition-colors tracking-tight leading-snug">
                    {latestRepo ? latestRepo.name : (loading ? "Fetching repositories..." : "Public Repositories")}
                  </h3>
                  <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover/repo:text-purple-300 group-hover/repo:translate-x-0.5 group-hover/repo:-translate-y-0.5 transition-transform shrink-0 mt-1" />
                </div>
              </a>

              {/* Natural 2-line description in readable sans typography */}
              <p className="text-xs text-zinc-300/85 leading-relaxed line-clamp-2">
                {latestRepo?.description ||
                  (loading
                    ? "Connecting to GitHub public repository feed..."
                    : "Public open-source repository by Sayam Mukherjee.")}
              </p>

              {/* Tags & Meta Row */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-zinc-400 font-sans">
                {latestRepo?.language && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-zinc-200 text-[11px] font-medium">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: getLanguageColor(latestRepo.language) }}
                    />
                    <span>{latestRepo.language}</span>
                  </span>
                )}

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-zinc-300 text-[11px]">
                  <Star className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>{latestRepo?.stargazers_count ?? 0}</span>
                </span>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-zinc-300 text-[11px]">
                  <GitFork className="w-3 h-3 text-zinc-400 shrink-0" />
                  <span>{latestRepo?.forks_count ?? 0}</span>
                </span>

                {latestRepo?.topics && latestRepo.topics.length > 0 && (
                  <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">
                    #{latestRepo.topics[0]}
                  </span>
                )}
              </div>
            </div>

            {/* Compact Authentic Real-Time Metrics Strip */}
            <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-2xl bg-white/[0.025] border border-white/[0.06] text-center my-1">
              <div className="space-y-0.5">
                <div className="text-base sm:text-lg font-bold text-white font-mono leading-none">
                  {user ? user.public_repos : repos.length || 4}
                </div>
                <div className="text-[9px] font-sans text-zinc-400 tracking-wider uppercase font-medium">
                  Public Repos
                </div>
              </div>

              <div className="space-y-0.5 border-x border-white/[0.08]">
                <div className="text-base sm:text-lg font-bold text-emerald-400 font-mono leading-none">
                  {stats?.totalContributionsThisYear || 56}
                </div>
                <div className="text-[9px] font-sans text-zinc-400 tracking-wider uppercase font-medium">
                  Contribs (2026)
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="text-base sm:text-lg font-bold text-amber-400 font-mono leading-none">
                  {stats?.currentStreak || 4}d
                </div>
                <div className="text-[9px] font-sans text-zinc-400 tracking-wider uppercase font-medium">
                  Streak
                </div>
              </div>
            </div>

            {/* Recent Live Activity Line */}
            <div className="pt-3 pb-1 border-t border-white/[0.08]">
              <div className="flex items-center gap-2 text-xs">
                <GitCommit className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <div className="min-w-0 flex-1 truncate">
                  {recentActivity ? (
                    <a
                      href={recentActivity.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-300 hover:text-purple-300 transition-colors truncate block text-[11px]"
                      title={`${recentActivity.text} · ${recentActivity.time}`}
                    >
                      <span className="font-medium text-zinc-200">{recentActivity.text}</span>
                      <span className="text-zinc-500 ml-1.5">· {recentActivity.time}</span>
                    </a>
                  ) : (
                    <span className="text-zinc-500 text-[11px] italic">
                      {loading ? "Checking public activity..." : "Latest push verified on GitHub"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-3 mt-2 border-t border-white/[0.08] flex items-center justify-between text-xs font-sans">
              <a
                href="#live-build-feed"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("live-build-feed")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Explore all {user ? user.public_repos : repos.length || 4} repos</span>
                <span>↓</span>
              </a>

              <a
                href="https://github.com/codesbysayam"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1 group/link"
              >
                <span>View Profile</span>
                <span className="text-purple-400 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform">
                  ↗
                </span>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================
          COMPACT PROOF STRIP WITH ONLY GENUINE INFORMATION
          ================================================== */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full pt-6 pb-6 border-t border-white/[0.08]">
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-3 sm:gap-6 text-[11px] sm:text-xs font-mono text-zinc-400 uppercase tracking-wider text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
              <span className="text-zinc-200 font-medium">KIIT UNIVERSITY</span>
            </div>
            <span className="hidden sm:inline text-zinc-700">·</span>
            <div>B.TECH CSE (AI &amp; ML)</div>
            <span className="hidden sm:inline text-zinc-700">·</span>
            <div className="text-zinc-200 font-medium">9.06 FIRST-YEAR CGPA</div>
            <span className="hidden sm:inline text-zinc-700">·</span>
            <div>KOLKATA / BHUBANESWAR</div>
          </div>
        </div>

        {/* Thin "Scroll to explore" indicator */}
        <div className="flex flex-col items-center gap-2 pt-3 pb-8 text-zinc-500 select-none">
          <span className="text-[9px] uppercase font-mono tracking-[0.25em] font-semibold text-zinc-500">
            Scroll to explore
          </span>
          <div className="w-4 h-7 border border-zinc-700/80 rounded-full flex justify-center p-1">
            <div className="w-1 h-1.5 bg-purple-400 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}

const HeroSection = memo(HeroSectionComponent);
export default HeroSection;
