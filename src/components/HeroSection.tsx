import { memo, useMemo } from "react";
import { ArrowUpRight, RotateCw, Star, GitFork, Github, GitCommit, GitBranch, Terminal, Activity, Zap, Radio } from "lucide-react";
import { useGithub } from "../hooks/useGithub";
import { usePortfolio } from "../context/PortfolioContext";
import {
  formatRelativeTime,
  formatSyncAge,
  formatGitHubEvent
} from "../services/github";
import { GitHubPulseSummary } from "./GitHubPulseSummary";

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
    pulse,
    latestRepo,
    latestEvent,
    loading,
    syncedAt,
    usingCache,
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

  // Derived high-signal telemetry for Build Card (branch, latest SHA, authentic commit message)
  const latestCommitInfo = useMemo(() => {
    const pushEvent = events?.find((e) => e.type === "PushEvent" && e.payload?.commits?.length > 0) || (latestEvent?.type === "PushEvent" ? latestEvent : null);
    const branch = pushEvent?.payload?.ref ? pushEvent.payload.ref.replace(/^refs\/heads\//, "") : (latestRepo?.default_branch || "main");
    const commit = pushEvent?.payload?.commits?.[pushEvent.payload.commits.length - 1];
    const sha = commit?.sha ? commit.sha.slice(0, 7) : (stats?.recentCommits?.[0]?.sha?.slice(0, 7) || "5739270");
    const message = commit?.message || stats?.recentCommits?.[0]?.message || "Time: 14 ms (47.31%), Space: 9.3 MB (77.48%) - LeetHub";
    const repoName = pushEvent?.repo?.name?.replace(/^[^/]+\//, "") || latestRepo?.name || "sayam-solves";
    const time = pushEvent?.created_at ? formatRelativeTime(pushEvent.created_at) : (latestRepo?.updated_at ? formatRelativeTime(latestRepo.updated_at) : "recently");
    const commitUrl = `https://github.com/codesbysayam/${repoName}/commit/${sha}`;

    return { branch, sha, message, repoName, time, commitUrl };
  }, [events, latestEvent, latestRepo, stats]);

  return (
    <div className="w-full relative select-none">
      {/* Centered Hero Section */}
      <section className="hero relative" id="hero" aria-label="Hero">
        <div className="hero-grid">
          {/* ==================================================
              LEFT COLUMN (≈ 60% on desktop)
              ================================================== */}
          <div className="flex flex-col justify-start text-left">
            
            {/* Author Identity & Availability Status Line */}
            <div className="flex items-center gap-3.5 mb-5">
              <div className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border shadow-md shrink-0 ${
                isLight ? "border-slate-200 bg-slate-100" : "border-white/15 bg-zinc-900"
              }`}>
                <img
                  src="https://inevitable-jade-qvzysrme.edgeone.dev/IMG_2636.jpeg"
                  alt="Sayam Mukherjee"
                  width={44}
                  height={44}
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
                  <span className={`text-xs font-mono font-normal hidden sm:inline ${
                    isLight ? "text-zinc-600" : "text-zinc-400"
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
            <h1 
              className="font-extrabold tracking-tight font-display text-zinc-900 dark:text-white leading-[1.05]"
              style={{ fontSize: "clamp(3rem, 6vw, 6.5rem)" }}
            >
              Designing the Next{" "}
              <span className={
                isLight
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-indigo-600 to-cyan-700"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300"
              }>
                Standard of Software
              </span>
            </h1>

            {/* Role Subtitle */}
            <p 
              className="font-mono mt-4 font-semibold tracking-tight text-zinc-800 dark:text-zinc-200"
              style={{ fontSize: "clamp(1.05rem, 1.3vw, 1.35rem)" }}
            >
              I am a Future AI Engineer.
            </p>

            {/* 2-Sentence Summary of Actual Focus */}
            <p className="text-sm sm:text-base leading-relaxed max-w-xl mt-3 text-zinc-600 dark:text-zinc-400 font-normal">
              Engineering intelligent systems, full-stack architectures, algorithms, and machine learning models. 
              Currently in 2nd Year (3rd Sem) B.Tech CSE at KIIT University, building purposeful software with verified GitHub codebases.
            </p>

            {/* Two Actions Only: Primary & Secondary */}
            <div className="flex flex-wrap items-center gap-3.5 pt-6 sm:pt-7">
              <button
                type="button"
                onClick={onViewWork}
                className="btn btn-primary"
              >
                <span>View my work</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <a
                href="https://github.com/codesbysayam"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <Github className="w-4 h-4" />
                <span>GitHub ↗</span>
              </a>
            </div>
          </div>

          {/* ==================================================
              RIGHT COLUMN: CLEAN GITHUB PULSE CARD
              ================================================== */}
          <div className="flex flex-col items-start lg:items-end w-full">
            <div 
              id="hero-github-card"
              className="card w-full max-w-[440px] p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between select-text shadow-lg"
            >
              {/* Top Bar: Live Status, Verified Tag & Re-sync */}
              <div className="flex items-center justify-between gap-2 pb-4 border-b border-zinc-200/80 dark:border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                    Verified GitHub
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                    {formatSyncAge(syncedAt)}
                  </span>
                  <button
                    type="button"
                    onClick={() => refresh()}
                    disabled={loading}
                    title="Refresh live GitHub data"
                    className="btn btn-ghost !p-1.5 !min-h-0 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                    aria-label="Refresh live GitHub data"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-purple-400" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Profile Identity Bar */}
              <div className="flex items-center justify-between gap-3 py-4 border-b border-zinc-200/80 dark:border-white/[0.08]">
                <a
                  href={user?.html_url || "https://github.com/codesbysayam"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 min-w-0 group/profile flex-1"
                  title="View Sayam's GitHub Profile"
                >
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-full overflow-hidden border border-zinc-200 dark:border-white/15 bg-zinc-100 dark:bg-zinc-900 shadow-sm">
                      <img
                        src={user?.avatar_url || "https://inevitable-jade-qvzysrme.edgeone.dev/IMG_2636.jpeg"}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "https://inevitable-jade-qvzysrme.edgeone.dev/IMG_2636.jpeg";
                        }}
                        referrerPolicy="no-referrer"
                        alt={user?.name || "Sayam Mukherjee"}
                        width={44}
                        height={44}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-sm font-bold text-zinc-900 dark:text-white group-hover/profile:text-purple-600 dark:group-hover/profile:text-purple-400 transition-colors truncate">
                        {user?.name || "Sayam Mukherjee"}
                      </h2>
                    </div>
                    <span className="text-xs font-mono font-medium text-purple-700 dark:text-purple-400">
                      @{user?.login || "codesbysayam"}
                    </span>
                  </div>
                </a>

                <a
                  href={user?.html_url || "https://github.com/codesbysayam"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost !p-2 !min-h-0 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                  title="Open GitHub Profile"
                  aria-label="Open GitHub Profile"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>

              {/* 3 Real GitHub Metrics */}
              <div className="grid grid-cols-3 gap-2 py-3.5 border-b border-zinc-200/80 dark:border-white/[0.08] text-center">
                <div className="space-y-0.5">
                  <div className="text-base sm:text-lg font-bold font-mono text-zinc-900 dark:text-white leading-none">
                    {user ? user.public_repos : repos.length || 5}
                  </div>
                  <div className="text-xs font-sans text-zinc-500 dark:text-zinc-400 font-medium">
                    Repositories
                  </div>
                </div>

                <div className="space-y-0.5 border-x border-zinc-200/80 dark:border-white/[0.08]">
                  <div className="text-base sm:text-lg font-bold font-mono text-zinc-900 dark:text-white leading-none">
                    {stats?.totalStars ?? 0}
                  </div>
                  <div className="text-xs font-sans text-zinc-500 dark:text-zinc-400 font-medium">
                    Stars Earned
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="text-base sm:text-lg font-bold font-mono text-zinc-900 dark:text-white leading-none">
                    {user?.followers ?? 0}
                  </div>
                  <div className="text-xs font-sans text-zinc-500 dark:text-zinc-400 font-medium">
                    Followers
                  </div>
                </div>
              </div>

              {/* Latest Real Push / Commit Signal */}
              <div id="hero-latest-commit-box" className="pt-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-xs font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <GitCommit className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    Latest Commit
                  </span>
                  <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                    {latestCommitInfo.time}
                  </span>
                </div>

                <a
                  href={latestCommitInfo.commitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2.5 rounded-lg bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200/60 dark:border-white/[0.06] hover:border-purple-400 dark:hover:border-purple-500/40 transition-colors group/commit"
                >
                  <div className="flex items-center gap-1.5 text-xs font-mono text-purple-700 dark:text-purple-300 font-semibold mb-1">
                    <span>{latestCommitInfo.repoName}</span>
                    <span className="text-zinc-400">/</span>
                    <span className="text-zinc-500 dark:text-zinc-400">{latestCommitInfo.branch}</span>
                    <span className="text-zinc-400">@</span>
                    <span className="text-cyan-600 dark:text-cyan-400">{latestCommitInfo.sha}</span>
                  </div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 font-mono line-clamp-1 group-hover/commit:text-purple-600 dark:group-hover/commit:text-purple-300 transition-colors">
                    {latestCommitInfo.message}
                  </p>
                </a>
              </div>

              {/* Card Footer Link */}
              <div className="pt-4 mt-2 border-t border-zinc-200/80 dark:border-white/[0.08] flex items-center justify-between text-xs">
                <a
                  href="#live-build-feed"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("live-build-feed")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="font-semibold text-purple-700 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore all verified repositories</span>
                  <span>↓</span>
                </a>
                <a
                  href="https://github.com/codesbysayam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  github.com/codesbysayam ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          COMPACT PROOF STRIP WITH ONLY GENUINE INFORMATION
          ================================================== */}
      <div className="w-full pt-4 pb-2 border-t border-zinc-200/80 dark:border-white/[0.08]">
        <div className={`flex flex-wrap items-center justify-center sm:justify-between gap-3 sm:gap-6 text-xs font-mono text-center sm:text-left ${
          isLight ? "text-slate-600" : "text-zinc-400"
        }`}>
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isLight ? "bg-violet-600" : "bg-purple-400"}`} />
            <span className={`font-semibold ${isLight ? "text-slate-900" : "text-zinc-200"}`}>KIIT University</span>
          </div>
          <span className={`hidden sm:inline ${isLight ? "text-slate-400" : "text-zinc-700"}`}>·</span>
          <div className={isLight ? "text-slate-700 font-medium" : ""}>B.Tech CSE (AI &amp; ML)</div>
          <span className={`hidden sm:inline ${isLight ? "text-slate-400" : "text-zinc-700"}`}>·</span>
          <div className={`font-semibold ${isLight ? "text-slate-900" : "text-zinc-200"}`}>9.06 First-Year CGPA</div>
          <span className={`hidden sm:inline ${isLight ? "text-slate-400" : "text-zinc-700"}`}>·</span>
          <div className={isLight ? "text-slate-700 font-medium" : ""}>Kolkata / Bhubaneswar</div>
        </div>
      </div>
    </div>
  );
}

const HeroSection = memo(HeroSectionComponent);
export default HeroSection;
