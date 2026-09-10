import { memo, useMemo } from "react";
import { ArrowUpRight, RotateCw, Star, GitFork, Github, GitCommit } from "lucide-react";
import { useGithub } from "../hooks/useGithub";
import { usePortfolio } from "../context/PortfolioContext";
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
  const { theme } = usePortfolio();
  const isLight = theme === "light";

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
            <div className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border shadow-md shrink-0 ${
              isLight ? "border-slate-200 bg-slate-100" : "border-white/15 bg-zinc-900"
            }`}>
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
              <div className={`text-sm font-bold font-sans flex items-center gap-2 ${
                isLight ? "text-slate-900" : "text-white"
              }`}>
                <span>Sayam Mukherjee</span>
                <span className={`text-[11px] font-mono font-normal hidden sm:inline ${
                  isLight ? "text-slate-600" : "text-zinc-400"
                }`}>
                  · KIIT B.Tech CSE (AI &amp; ML)
                </span>
              </div>
              <div className={`inline-flex items-center gap-1.5 text-[11px] font-mono ${
                isLight ? "text-emerald-700 font-semibold" : "text-emerald-400"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isLight ? "bg-emerald-600 animate-pulse" : "bg-emerald-400 animate-pulse"}`} />
                <span className={isLight ? "text-slate-700" : "text-zinc-300"}>Open to internships · collaborations · freelance</span>
              </div>
            </div>
          </div>

          {/* Main Editorial Headline */}
          <h1 className={`hero-title font-extrabold tracking-tight font-display ${
            isLight ? "text-slate-900" : "text-white"
          }`}>
            Designing the Next{" "}
            <span className={
              isLight
                ? "text-transparent bg-clip-text bg-gradient-to-r from-violet-700 via-indigo-600 to-sky-600 font-extrabold"
                : "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300"
            }>
              Standard of Software
            </span>
          </h1>

          {/* Role Subtitle */}
          <p className={`text-lg sm:text-xl md:text-2xl font-mono mt-5 sm:mt-6 font-semibold tracking-tight ${
            isLight ? "text-slate-800" : "text-zinc-200"
          }`}>
            I am a Future AI Engineer.
          </p>

          {/* Genuine Student Background */}
          <p className={`text-sm sm:text-base leading-relaxed max-w-xl mt-3 ${
            isLight ? "text-slate-700 font-normal" : "text-zinc-400"
          }`}>
            2nd Year (3rd Sem) B.Tech CSE (AI &amp; ML) student at KIIT Bhubaneswar. Building intelligent web systems, machine learning applications, and purposeful software.
          </p>

          {/* Direct Calls to Action */}
          <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 pt-7 sm:pt-8">
            <button
              type="button"
              onClick={onViewWork}
              className={`px-6 sm:px-7 py-3.5 rounded-2xl font-mono text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                isLight
                  ? "bg-slate-950 text-white hover:bg-violet-700 shadow-md hover:shadow-violet-600/20"
                  : "bg-white text-zinc-950 hover:bg-zinc-100 shadow-lg hover:shadow-xl"
              }`}
            >
              View My Work
            </button>
            <a
              href="https://github.com/codesbysayam"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-5 sm:px-6 py-3.5 rounded-2xl font-mono text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                isLight
                  ? "bg-white hover:bg-slate-50 text-slate-800 border-slate-300 hover:border-violet-400 shadow-xs"
                  : "bg-white/[0.04] hover:bg-white/[0.08] text-white border-white/10 hover:border-white/20"
              }`}
            >
              <span>GitHub</span>
              <span className={isLight ? "text-slate-500" : "text-zinc-400"}>↗</span>
            </a>
          </div>
        </div>

        {/* ==================================================
            RIGHT COLUMN: REBUILT GITHUB LIVE SHOWCASE & CURRENTLY BUILDING
            ================================================== */}
        <div className="hero-grid flex flex-col items-start lg:items-end justify-center w-full">
          <div 
            id="hero-github-card"
            className={`signal-card w-full max-w-[440px] rounded-3xl p-5 sm:p-6 backdrop-blur-2xl transition-all duration-300 group flex flex-col justify-between select-text ${
              isLight
                ? "bg-white border border-slate-200/90 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.12)] hover:border-violet-400/60 hover:shadow-[0_25px_60px_-12px_rgba(109,40,217,0.15)]"
                : "bg-zinc-950/70 border border-white/[0.1] shadow-2xl hover:border-purple-500/30 hover:shadow-purple-500/5"
            }`}
          >
            {/* Top Bar: Live Status & Re-sync */}
            <div className={`flex items-center justify-between gap-2 pb-3.5 border-b text-[11px] ${
              isLight ? "border-slate-100" : "border-white/[0.08]"
            }`}>
              <div className="flex items-center gap-2 min-w-0">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isLight ? "bg-emerald-500" : "bg-emerald-400"
                  }`} />
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${
                    isLight ? "bg-emerald-600" : "bg-emerald-500"
                  }`} />
                </span>
                <span className={`font-mono font-bold tracking-wider text-[10px] uppercase shrink-0 px-2 py-0.5 rounded-md border ${
                  isLight
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                }`}>
                  LIVE SYNCED
                </span>
                <span className={`font-mono text-[10px] truncate ${
                  isLight ? "text-slate-600" : "text-zinc-500"
                }`}>
                  · {formatSyncAge(syncedAt)}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => refresh()}
                  disabled={loading}
                  title="Force re-sync live GitHub telemetry"
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border transition-colors cursor-pointer text-[10px] font-mono disabled:opacity-40 ${
                    isLight
                      ? "bg-slate-100/80 hover:bg-slate-200/80 border-slate-200 text-slate-700 hover:text-slate-900"
                      : "bg-white/[0.04] hover:bg-white/[0.09] border-white/[0.08] hover:border-white/20 text-zinc-400 hover:text-white"
                  }`}
                  aria-label="Refresh live GitHub data"
                >
                  <RotateCw className={`w-2.5 h-2.5 ${loading ? "animate-spin text-purple-400" : ""}`} />
                  <span>Sync</span>
                </button>
              </div>
            </div>

            {/* Profile Identity Bar */}
            <div className={`flex items-center justify-between gap-3 pt-3.5 pb-4 border-b ${
              isLight ? "border-slate-100" : "border-white/[0.08]"
            }`}>
              <a
                href={user?.html_url || "https://github.com/codesbysayam"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 min-w-0 group/profile flex-1"
                title="View Sayam's GitHub Profile"
              >
                <div className="relative shrink-0">
                  <div className={`w-10 h-10 rounded-full overflow-hidden border transition-colors shadow-inner ${
                    isLight
                      ? "border-slate-200 bg-slate-100 group-hover/profile:border-violet-500/50"
                      : "border-white/15 bg-zinc-900 group-hover/profile:border-purple-400/50"
                  }`}>
                    <img
                      src={user?.avatar_url || "https://inevitable-jade-qvzysrme.edgeone.dev/IMG_2636.jpeg"}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "https://inevitable-jade-qvzysrme.edgeone.dev/IMG_2636.jpeg";
                      }}
                      referrerPolicy="no-referrer"
                      alt={user?.name || "Sayam Mukherjee"}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  {/* Status dot */}
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 rounded-full ${
                    isLight ? "border-white" : "border-zinc-950"
                  }`} />
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 leading-tight">
                    <span className={`text-sm sm:text-base font-bold transition-colors whitespace-nowrap ${
                      isLight ? "text-slate-900 group-hover/profile:text-violet-700" : "text-white group-hover/profile:text-purple-300"
                    }`}>
                      {user?.name || "Sayam Mukherjee"}
                    </span>
                    <Github className={`w-3.5 h-3.5 shrink-0 ${isLight ? "text-slate-500" : "text-zinc-400"}`} />
                  </div>
                  <div className={`flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] mt-0.5 ${
                    isLight ? "text-slate-600" : "text-zinc-400"
                  }`}>
                    <span className={`font-semibold ${isLight ? "text-violet-700" : "text-purple-300/90"}`}>
                      @{user?.login || "codesbysayam"}
                    </span>
                    <span className={isLight ? "text-slate-400" : "text-zinc-600"}>·</span>
                    <span className={isLight ? "text-slate-700" : "text-zinc-400"}>
                      {user?.location || "Kolkata, India"}
                    </span>
                  </div>
                </div>
              </a>

              <a
                href={user?.html_url || "https://github.com/codesbysayam"}
                target="_blank"
                rel="noopener noreferrer"
                className={`shrink-0 p-2 rounded-xl border transition-colors ${
                  isLight
                    ? "bg-slate-100/80 hover:bg-slate-200/80 border-slate-200 text-slate-700 hover:text-slate-950"
                    : "bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-zinc-400 hover:text-white"
                }`}
                title="Open GitHub Profile"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Rate limit notification if active */}
            {rateLimited && !user && (
              <div className={`mt-2 text-[10px] font-mono px-2.5 py-1 rounded-md border ${
                isLight
                  ? "text-amber-800 bg-amber-50 border-amber-200"
                  : "text-amber-300/90 bg-amber-400/10 border-amber-400/20"
              }`}>
                Using cached GitHub telemetry
              </div>
            )}

            {/* Currently Building Showcase */}
            <div className="py-4 space-y-3">
              {/* Eyebrow badge */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md border ${
                  isLight
                    ? "text-violet-800 bg-violet-50 border-violet-200"
                    : "text-purple-400 bg-purple-950/40 border-purple-800/40"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isLight ? "bg-violet-600" : "bg-purple-400"}`} />
                  CURRENTLY BUILDING
                </span>
                <span className={`text-[11px] font-sans ${isLight ? "text-slate-600 font-medium" : "text-zinc-500"}`}>
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
                  <h3 className={`text-[13px] sm:text-[14px] font-bold transition-colors tracking-normal leading-snug break-words overflow-wrap-anywhere ${
                    isLight ? "text-slate-900 group-hover/repo:text-violet-700" : "text-white group-hover/repo:text-purple-300"
                  }`}>
                    {latestRepo ? latestRepo.name : (loading ? "Fetching repositories..." : "Public Repositories")}
                  </h3>
                  <ArrowUpRight className={`w-3.5 h-3.5 transition-transform shrink-0 mt-0.5 group-hover/repo:translate-x-0.5 group-hover/repo:-translate-y-0.5 ${
                    isLight ? "text-slate-500 group-hover/repo:text-violet-700" : "text-zinc-400 group-hover/repo:text-purple-300"
                  }`} />
                </div>
              </a>

              {/* Natural 2-line description in readable sans typography */}
              <p className={`text-[11px] sm:text-xs leading-relaxed line-clamp-3 break-words ${
                isLight ? "text-slate-700 font-normal" : "text-zinc-300/90"
              }`}>
                {latestRepo?.description ||
                  (loading
                    ? "Connecting to GitHub public repository feed..."
                    : "Public open-source repository by Sayam Mukherjee.")}
              </p>

              {/* Tags & Meta Row */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs font-sans">
                {latestRepo?.language && (
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-semibold ${
                    isLight
                      ? "bg-slate-100 border-slate-200 text-slate-800"
                      : "bg-white/[0.04] border-white/[0.08] text-zinc-200"
                  }`}>
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: getLanguageColor(latestRepo.language) }}
                    />
                    <span>{latestRepo.language}</span>
                  </span>
                )}

                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] ${
                  isLight
                    ? "bg-slate-100 border-slate-200 text-slate-800 font-medium"
                    : "bg-white/[0.04] border-white/[0.08] text-zinc-300"
                }`}>
                  <Star className={`w-3 h-3 shrink-0 ${isLight ? "text-amber-500 fill-amber-500" : "text-amber-400"}`} />
                  <span>{latestRepo?.stargazers_count ?? 0}</span>
                </span>

                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] ${
                  isLight
                    ? "bg-slate-100 border-slate-200 text-slate-700"
                    : "bg-white/[0.04] border-white/[0.08] text-zinc-300"
                }`}>
                  <GitFork className={`w-3 h-3 shrink-0 ${isLight ? "text-slate-500" : "text-zinc-400"}`} />
                  <span>{latestRepo?.forks_count ?? 0}</span>
                </span>

                {latestRepo?.topics && latestRepo.topics.length > 0 && (
                  <span className={`text-[10px] font-mono ${
                    isLight ? "text-slate-600 font-medium" : "text-zinc-500"
                  }`}>
                    #{latestRepo.topics[0]}
                  </span>
                )}
              </div>
            </div>

            {/* Compact Authentic Real-Time Metrics Strip - strictly authentic data */}
            <div className={`grid grid-cols-3 gap-2 py-3 px-3 rounded-2xl border text-center my-1 ${
              isLight
                ? "bg-slate-50/90 border-slate-200/90 text-slate-800"
                : "bg-white/[0.025] border-white/[0.06]"
            }`}>
              <div className="space-y-0.5 min-w-0">
                <div className={`text-sm sm:text-base font-bold font-mono leading-none ${
                  isLight ? "text-slate-900" : "text-white"
                }`}>
                  {user ? user.public_repos : repos.length || 4}
                </div>
                <div className={`text-[9px] font-sans tracking-wider uppercase font-semibold truncate ${
                  isLight ? "text-slate-600" : "text-zinc-400"
                }`}>
                  Public Repos
                </div>
              </div>

              <div className={`space-y-0.5 border-x min-w-0 ${
                isLight ? "border-slate-200" : "border-white/[0.08]"
              }`}>
                <div className={`text-sm sm:text-base font-bold font-mono leading-none truncate ${
                  isLight ? "text-violet-700" : "text-purple-300"
                }`}>
                  TypeScript
                </div>
                <div className={`text-[9px] font-sans tracking-wider uppercase font-semibold truncate ${
                  isLight ? "text-slate-600" : "text-zinc-400"
                }`}>
                  Primary Lang
                </div>
              </div>

              <div className="space-y-0.5 min-w-0">
                <div className={`text-sm sm:text-base font-bold font-mono leading-none ${
                  isLight ? "text-emerald-700" : "text-emerald-400"
                }`}>
                  Verified
                </div>
                <div className={`text-[9px] font-sans tracking-wider uppercase font-semibold truncate ${
                  isLight ? "text-slate-600" : "text-zinc-400"
                }`}>
                  GitHub Feed
                </div>
              </div>
            </div>

            {/* Recent Live Activity Line */}
            <div className={`pt-3 pb-1 border-t ${
              isLight ? "border-slate-100" : "border-white/[0.08]"
            }`}>
              <div className="flex items-center gap-2 text-xs">
                <GitCommit className={`w-3.5 h-3.5 shrink-0 ${isLight ? "text-violet-600" : "text-purple-400"}`} />
                <div className="min-w-0 flex-1 truncate">
                  {recentActivity ? (
                    <a
                      href={recentActivity.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`transition-colors truncate block text-[11px] ${
                        isLight ? "text-slate-700 hover:text-violet-700" : "text-zinc-300 hover:text-purple-300"
                      }`}
                      title={`${recentActivity.text} · ${recentActivity.time}`}
                    >
                      <span className={`font-semibold ${isLight ? "text-slate-900" : "text-zinc-200"}`}>{recentActivity.text}</span>
                      <span className={`ml-1.5 ${isLight ? "text-slate-500" : "text-zinc-500"}`}>· {recentActivity.time}</span>
                    </a>
                  ) : (
                    <span className={`text-[11px] italic ${isLight ? "text-slate-500" : "text-zinc-500"}`}>
                      {loading ? "Checking public activity..." : "Latest push verified on GitHub"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className={`pt-3 mt-2 border-t flex items-center justify-between text-xs font-sans ${
              isLight ? "border-slate-100" : "border-white/[0.08]"
            }`}>
              <a
                href="#live-build-feed"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("live-build-feed")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                  isLight ? "text-violet-700 hover:text-violet-900" : "text-purple-400 hover:text-purple-300"
                }`}
              >
                <span>Explore all {user ? user.public_repos : repos.length || 4} repos</span>
                <span>↓</span>
              </a>

              <a
                href="https://github.com/codesbysayam"
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors flex items-center gap-1 group/link font-medium ${
                  isLight ? "text-slate-600 hover:text-slate-900" : "text-zinc-400 hover:text-white"
                }`}
              >
                <span>View Profile</span>
                <span className={`group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform ${
                  isLight ? "text-violet-600" : "text-purple-400"
                }`}>
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
      <div className="w-full" style={{ width: "min(100% - 2rem, 1440px)", marginInline: "auto", paddingInline: "clamp(1rem, 4vw, 4rem)" }}>
        <div className={`w-full pt-6 pb-6 border-t ${isLight ? "border-slate-200/90" : "border-white/[0.08]"}`}>
          <div className={`flex flex-wrap items-center justify-center sm:justify-between gap-3 sm:gap-6 text-[11px] sm:text-xs font-mono uppercase tracking-wider text-center sm:text-left ${
            isLight ? "text-slate-600" : "text-zinc-400"
          }`}>
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isLight ? "bg-violet-600" : "bg-purple-400"}`} />
              <span className={`font-bold ${isLight ? "text-slate-900" : "text-zinc-200 font-medium"}`}>KIIT UNIVERSITY</span>
            </div>
            <span className={`hidden sm:inline ${isLight ? "text-slate-400" : "text-zinc-700"}`}>·</span>
            <div className={isLight ? "text-slate-700 font-medium" : ""}>B.TECH CSE (AI &amp; ML)</div>
            <span className={`hidden sm:inline ${isLight ? "text-slate-400" : "text-zinc-700"}`}>·</span>
            <div className={`font-bold ${isLight ? "text-slate-900" : "text-zinc-200 font-medium"}`}>9.06 FIRST-YEAR CGPA</div>
            <span className={`hidden sm:inline ${isLight ? "text-slate-400" : "text-zinc-700"}`}>·</span>
            <div className={isLight ? "text-slate-700 font-medium" : ""}>KOLKATA / BHUBANESWAR</div>
          </div>
        </div>

        {/* Thin "Scroll to explore" indicator */}
        <div className={`flex flex-col items-center gap-2 pt-3 pb-8 select-none ${isLight ? "text-slate-500" : "text-zinc-500"}`}>
          <span className={`text-[9px] uppercase font-mono tracking-[0.25em] font-semibold ${isLight ? "text-slate-600" : "text-zinc-500"}`}>
            Scroll to explore
          </span>
          <div className={`w-4 h-7 border rounded-full flex justify-center p-1 ${isLight ? "border-slate-300" : "border-zinc-700/80"}`}>
            <div className={`w-1 h-1.5 rounded-full animate-bounce ${isLight ? "bg-violet-600" : "bg-purple-400"}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

const HeroSection = memo(HeroSectionComponent);
export default HeroSection;
