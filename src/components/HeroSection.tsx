import { useState, useEffect, memo } from "react";
import { ArrowUpRight } from "lucide-react";
import { GitHubRepo, getGithubRepos } from "../services/github";

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
  const [latest, setLatest] = useState<GitHubRepo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch real GitHub repos with 15m client-side cache
  useEffect(() => {
    let isMounted = true;
    getGithubRepos()
      .then((repos) => {
        if (isMounted) {
          setLatest(repos?.[0] ?? null);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Hero GitHub card fetch:", err);
        if (isMounted) {
          setLatest(null);
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const getLanguageColor = (lang: string | null) => {
    if (!lang) return "#71717a";
    return LANGUAGE_COLORS[lang] || "#a1a1aa";
  };

  return (
    <div className="w-full relative select-none">
      {/* Centered Hero Container */}
      <section className="hero relative" id="hero" aria-label="Hero">
        {/* ==================================================
            LEFT COLUMN (≈ 65% on desktop)
            ================================================== */}
        <div className="hero-grid flex flex-col justify-center text-left">
          {/* Status Line */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-zinc-300 text-xs font-mono w-fit mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="truncate">Open to internships · collaborations · freelance</span>
          </div>

          {/* Main Editorial Heading */}
          <h1 className="hero-title font-extrabold tracking-tight text-white font-display">
            Designing the Next{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300">
              Standard of Software
            </span>
          </h1>

          {/* Role subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl font-mono text-zinc-200 mt-5 sm:mt-6 font-semibold tracking-tight">
            I am a Future AI Engineer.
          </p>

          {/* Genuine concise intro */}
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl mt-3">
            2nd Year (3rd Sem) B.Tech CSE (AI &amp; ML) student at KIIT Bhubaneswar. Building intelligent web systems, machine learning applications, and purposeful software.
          </p>

          {/* 2 Clear CTAs */}
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
            RIGHT COLUMN (≈ 35% on desktop): VISUAL PROFILE & CURRENTLY BUILDING
            ================================================== */}
        <div className="hero-grid flex flex-col items-start lg:items-end justify-center w-full">
          <div className="w-full max-w-[390px]">
            
            {/* Small Subtle Profile Area */}
            <div className="flex items-center gap-3.5 mb-4 px-1">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 shadow-md shrink-0">
                <img
                  src="https://inevitable-jade-qvzysrme.edgeone.dev/IMG_2636.jpeg"
                  alt="Sayam Mukherjee"
                  width={56}
                  height={56}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover filter contrast-[1.02]"
                />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="text-sm font-bold text-white font-sans truncate">Sayam Mukherjee</div>
                <div className="text-[11px] text-zinc-400 font-mono truncate">B.Tech CSE (AI &amp; ML) · KIIT</div>
                <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1.5 pt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span>Active Developer</span>
                </div>
              </div>
            </div>

            {/* ONE Elegant "CURRENTLY BUILDING" Card */}
            {isLoading ? (
              <div className="build-card space-y-3 animate-pulse">
                <div className="flex justify-between">
                  <div className="h-4 w-28 bg-white/10 rounded" />
                  <div className="h-4 w-24 bg-white/10 rounded" />
                </div>
                <div className="h-6 w-3/4 bg-white/10 rounded mt-2" />
                <div className="h-12 w-full bg-white/5 rounded" />
                <div className="h-4 w-1/2 bg-white/10 rounded pt-3" />
              </div>
            ) : latest ? (
              <a
                href={latest.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="build-card block group relative overflow-hidden"
              >
                {/* Header: Status and Badge */}
                <div className="flex items-center justify-between text-xs font-mono mb-3.5">
                  <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span>LIVE FROM GITHUB</span>
                  </span>
                  <span className="text-purple-300/90 tracking-wider uppercase font-semibold text-[10px] px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/25 shrink-0">
                    CURRENTLY BUILDING
                  </span>
                </div>

                {/* Repository Title */}
                <h3 className="text-xl sm:text-2xl font-bold font-mono text-white group-hover:text-purple-300 transition-colors flex items-center justify-between gap-2">
                  <span className="break-all">{latest.name}</span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-purple-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
                </h3>

                {/* Repository Description */}
                <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed line-clamp-3">
                  {latest.description || "Active repository on GitHub."}
                </p>

                {/* Footer: Language, Date & CTA */}
                <div className="mt-5 pt-3.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
                    {latest.language && (
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: getLanguageColor(latest.language) }}
                        />
                        <span className="text-zinc-200 font-medium">{latest.language}</span>
                        <span>·</span>
                      </span>
                    )}
                    <span>Updated {new Date(latest.updated_at).toLocaleDateString()}</span>
                  </div>

                  <span className="text-purple-400 group-hover:text-purple-300 font-medium inline-flex items-center gap-0.5 text-xs">
                    Open Repository ↗
                  </span>
                </div>
              </a>
            ) : (
              <a
                href="https://github.com/codesbysayam"
                target="_blank"
                rel="noopener noreferrer"
                className="build-card block group text-center py-8"
              >
                <div className="text-xs font-mono text-zinc-400 mb-2">● GITHUB ACTIVITY</div>
                <h3 className="text-sm sm:text-base font-mono font-medium text-white group-hover:text-purple-300">
                  GitHub activity temporarily unavailable ↗
                </h3>
                <p className="text-xs text-zinc-500 mt-1">Visit github.com/codesbysayam directly.</p>
              </a>
            )}

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
