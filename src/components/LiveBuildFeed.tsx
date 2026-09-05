import { useState, useEffect, useMemo, useCallback } from "react";
import { 
  Github, ExternalLink, RotateCw, Search, Star, GitFork, 
  AlertCircle, Sparkles, X, ArrowRight, ChevronDown 
} from "lucide-react";
import { 
  GitHubRepo, 
  getGitHubRepos, 
  formatRelativeTime, 
  formatSyncAge 
} from "../services/github";

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

const GITHUB_PROFILE_REPOS_URL = "https://github.com/codesbysayam?tab=repositories";

export default function LiveBuildFeed() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState<boolean>(false);
  const [lastSyncedTimestamp, setLastSyncedTimestamp] = useState<number | null>(null);
  const [isLiveFetch, setIsLiveFetch] = useState<boolean>(false);

  // User filter & search state
  const [query, setQuery] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ALL");
  const [showAllMobile, setShowAllMobile] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Sync age ticker so "synced X ago" updates in real-time
  const [, setTicker] = useState<number>(0);

  // Detect mobile screen width (< 640px)
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= 640);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load repositories handler
  const fetchRepos = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    setRateLimited(false);

    try {
      const result = await getGitHubRepos(forceRefresh);
      setRepos(result.repos || []);
      setLastSyncedTimestamp(result.timestamp);
      setIsLiveFetch(!result.fromCache);
      if (result.rateLimited) {
        setRateLimited(true);
      }
    } catch (err: any) {
      console.warn("GitHub repos fetch error:", err);
      setError(err?.message || "GitHub data is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch only on mount
  useEffect(() => {
    fetchRepos(false);
  }, [fetchRepos]);

  // Periodic interval (every 30s) to update relative "synced X ago" timestamp text
  useEffect(() => {
    const timer = setInterval(() => {
      setTicker((prev) => prev + 1);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Compute available languages from actual fetched repos
  const availableLanguages = useMemo(() => {
    const langs = new Set<string>();
    repos.forEach((repo) => {
      if (repo.language && repo.language.trim().length > 0) {
        langs.add(repo.language.trim());
      }
    });
    return ["ALL", ...Array.from(langs)];
  }, [repos]);

  // First repo is the latest build by updated date
  const latestBuild = useMemo(() => {
    return repos.length > 0 ? repos[0] : null;
  }, [repos]);

  // Filtered repositories based on search and language filter
  const filteredRepos = useMemo(() => {
    return repos.filter((repo) => {
      // Language filter
      if (selectedLanguage !== "ALL" && repo.language !== selectedLanguage) {
        return false;
      }
      // Search query filter
      if (query.trim().length > 0) {
        const q = query.toLowerCase();
        const matchesName = repo.name.toLowerCase().includes(q);
        const matchesDesc = (repo.description ?? "").toLowerCase().includes(q);
        const matchesLang = (repo.language ?? "").toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesLang) {
          return false;
        }
      }
      return true;
    });
  }, [repos, query, selectedLanguage]);

  // Slice visible repositories: max 4 on mobile unless expanded, up to 6 on desktop
  const visibleRepos = useMemo(() => {
    if (isMobile && !showAllMobile) {
      return filteredRepos.slice(0, 4);
    }
    return filteredRepos.slice(0, 6);
  }, [filteredRepos, isMobile, showAllMobile]);

  // Format relative time helper
  const getRepoRelativeTime = (updatedAt: string) => {
    return formatRelativeTime(updatedAt);
  };

  // Language color dot helper
  const getLanguageColor = (lang: string | null) => {
    if (!lang) return "#71717a";
    return LANGUAGE_COLORS[lang] || "#a1a1aa";
  };

  return (
    <section 
      id="live-build-feed" 
      className="live-build-feed-panel relative w-full rounded-3xl overflow-hidden font-sans text-zinc-100 select-none"
      aria-label="Live Build Feed from GitHub"
    >
      <style>{`
        .live-build-feed-panel {
          background: linear-gradient(160deg, rgba(20, 20, 26, 0.92) 0%, rgba(10, 10, 14, 0.97) 100%);
          border: 1px solid rgba(255, 255, 255, 0.10);
          box-shadow: 0 24px 60px -15px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08);
          padding: clamp(20px, 3vw, 28px);
        }

        .build-feed-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
          gap: 20px;
          align-items: start;
        }

        @media (max-width: 850px) {
          .build-feed-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }

        .feed-card-interactive {
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, background-color 0.2s ease;
        }

        .feed-card-interactive:hover {
          transform: translateY(-2px);
        }

        @media (prefers-reduced-motion: reduce) {
          .feed-card-interactive:hover {
            transform: none !important;
          }
        }

        /* Light mode adaptations */
        html.light .live-build-feed-panel,
        html[data-theme="light"] .live-build-feed-panel {
          background: linear-gradient(160deg, rgba(255, 255, 255, 0.97) 0%, rgba(244, 244, 248, 0.98) 100%) !important;
          border-color: rgba(0, 0, 0, 0.09) !important;
          box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1) !important;
          color: #18181b !important;
        }

        html.light .live-build-feed-panel h3,
        html[data-theme="light"] .live-build-feed-panel h3,
        html.light .live-build-feed-panel .feed-heading,
        html[data-theme="light"] .live-build-feed-panel .feed-heading {
          color: #09090b !important;
        }

        html.light .live-build-feed-panel p,
        html[data-theme="light"] .live-build-feed-panel p {
          color: #52525b !important;
        }

        html.light .feed-card-interactive,
        html[data-theme="light"] .feed-card-interactive {
          background: rgba(255, 255, 255, 0.85) !important;
          border-color: rgba(0, 0, 0, 0.08) !important;
          color: #18181b !important;
        }

        html.light .feed-card-interactive:hover,
        html[data-theme="light"] .feed-card-interactive:hover {
          background: rgba(255, 255, 255, 1) !important;
          border-color: rgba(168, 85, 247, 0.35) !important;
        }

        html.light .feed-card-interactive span.text-white,
        html[data-theme="light"] .feed-card-interactive span.text-white {
          color: #09090b !important;
        }
      `}</style>

      {/* ==================================================
          TOP ROW / GRID: HEADER & LATEST BUILD
          ================================================== */}
      <div className="build-feed-grid">
        
        {/* LEFT COLUMN: TITLE, STATUS & SEARCH */}
        <div className="space-y-4">
          
          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div 
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold tracking-wider uppercase border border-emerald-500/25 bg-emerald-950/30 text-emerald-400"
              role="status"
              aria-label="Live from GitHub"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE FROM GITHUB</span>
            </div>

            <span className="text-[10px] font-mono text-zinc-400 font-medium">
              Public repository activity
            </span>

            {/* Manual Refresh Button */}
            <button
              type="button"
              onClick={() => fetchRepos(true)}
              disabled={loading}
              aria-label="Refresh GitHub repositories"
              title="Refresh repositories from GitHub"
              className="ml-auto inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.09] text-zinc-400 hover:text-white border border-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-purple-400" : ""}`} />
            </button>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h3 className="feed-heading text-xl sm:text-2xl font-bold font-display tracking-tight text-white flex items-center gap-2">
              <Github className="w-5 h-5 text-purple-400" />
              <span>LIVE BUILD FEED</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 leading-relaxed">
              “See what I’m building and maintaining on GitHub.”
            </p>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="⌕ Search repositories..."
              aria-label="Search repositories by name, description, or language"
              className="w-full pl-9 pr-8 py-2 rounded-xl text-xs font-mono bg-white/[0.035] border border-white/10 text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search query"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dynamic Language Filter Tabs (only if languages occur in fetched data) */}
          {availableLanguages.length > 1 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-semibold block">
                FILTER BY LANGUAGE
              </span>
              <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter by language">
                {availableLanguages.map((lang) => {
                  const isSelected = selectedLanguage === lang;
                  return (
                    <button
                      key={lang}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-purple-600 text-white font-semibold shadow-[0_2px_8px_rgba(168,85,247,0.3)] border border-purple-400/30"
                          : "bg-white/[0.035] hover:bg-white/[0.07] text-zinc-400 hover:text-zinc-200 border border-white/10"
                      }`}
                    >
                      {lang !== "ALL" && (
                        <span 
                          className="w-1.5 h-1.5 rounded-full shrink-0" 
                          style={{ backgroundColor: getLanguageColor(lang) }} 
                        />
                      )}
                      <span>{lang}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: HIGHLIGHTED "LATEST BUILD" CARD */}
        <div>
          {loading && repos.length === 0 ? (
            /* Skeleton for latest build */
            <div className="rounded-2xl p-4 bg-white/[0.02] border border-white/10 animate-pulse space-y-3">
              <div className="h-4 w-24 bg-white/10 rounded" />
              <div className="h-6 w-3/4 bg-white/10 rounded" />
              <div className="h-10 w-full bg-white/5 rounded" />
              <div className="h-4 w-1/2 bg-white/10 rounded" />
            </div>
          ) : latestBuild ? (
            <div className="feed-card-interactive relative rounded-2xl p-4 sm:p-5 bg-white/[0.035] border border-purple-500/25 hover:border-purple-500/40 space-y-3 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
              {/* Top Accent & Label */}
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>LATEST BUILD</span>
                </div>
                <span className="text-[11px] font-mono text-zinc-400">
                  {getRepoRelativeTime(latestBuild.updated_at)}
                </span>
              </div>

              {/* Repo Name & Description */}
              <div>
                <a
                  href={latestBuild.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base sm:text-lg font-bold font-mono text-white hover:text-purple-300 transition-colors inline-flex items-center gap-1.5 group"
                >
                  <span className="break-all">{latestBuild.name}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-purple-300 shrink-0" />
                </a>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed line-clamp-3">
                  {latestBuild.description || "No description provided."}
                </p>
              </div>

              {/* Language & Stats */}
              <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-3 text-zinc-300">
                  <div className="flex items-center gap-1.5">
                    <span 
                      className="w-2 h-2 rounded-full shrink-0" 
                      style={{ backgroundColor: getLanguageColor(latestBuild.language) }} 
                    />
                    <span>{latestBuild.language || "Language unavailable"}</span>
                  </div>
                  <div className="flex items-center gap-1 text-zinc-400" title="Stars">
                    <Star className="w-3 h-3 text-amber-400" />
                    <span>★ {latestBuild.stargazers_count}</span>
                  </div>
                  <div className="flex items-center gap-1 text-zinc-400" title="Forks">
                    <GitFork className="w-3 h-3" />
                    <span>Fork {latestBuild.forks_count}</span>
                  </div>
                </div>

                <a
                  href={latestBuild.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer shadow-[0_2px_8px_rgba(168,85,247,0.3)]"
                  aria-label={`View repository ${latestBuild.name} on GitHub`}
                >
                  <span>View Repository</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          ) : null}
        </div>

      </div>

      {/* ==================================================
          NOTICE BANNERS (Rate limit warning with cached data)
          ================================================== */}
      {rateLimited && (
        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>GitHub rate limit reached. Showing the latest cached data.</span>
        </div>
      )}

      {/* ==================================================
          ERROR STATE (When fetch fails and no cache exists)
          ================================================== */}
      {error && repos.length === 0 && !loading && (
        <div className="mt-5 p-6 rounded-2xl bg-white/[0.02] border border-red-500/20 text-center space-y-3">
          <AlertCircle className="w-6 h-6 text-red-400 mx-auto" />
          <div className="text-sm font-semibold text-white">
            {error.includes("rate limit")
              ? "GitHub rate limit reached. Try again later."
              : "GitHub data is temporarily unavailable."}
          </div>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            You can still explore all source repositories directly on Sayam’s GitHub profile.
          </p>
          <a
            href={GITHUB_PROFILE_REPOS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/10 transition-colors"
          >
            <span>Open GitHub →</span>
          </a>
        </div>
      )}

      {/* ==================================================
          EMPTY STATE (If user profile has zero public repos)
          ================================================== */}
      {!loading && !error && repos.length === 0 && (
        <div className="mt-5 p-6 rounded-2xl bg-white/[0.02] border border-white/10 text-center text-xs font-mono text-zinc-400">
          No public repositories available.
        </div>
      )}

      {/* ==================================================
          LOADING SKELETON ROWS (Initial or during refresh)
          ================================================== */}
      {loading && repos.length === 0 && (
        <div className="mt-5 space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-semibold block">
            LOADING REPOSITORIES...
          </span>
          {[1, 2, 3].map((n) => (
            <div key={n} className="rounded-xl p-4 bg-white/[0.02] border border-white/10 animate-pulse space-y-2">
              <div className="h-4 w-32 bg-white/10 rounded" />
              <div className="h-3 w-3/4 bg-white/5 rounded" />
              <div className="h-3 w-1/4 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* ==================================================
          RECENT REPOSITORIES LIST
          ================================================== */}
      {!loading && repos.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-semibold block">
              RECENT REPOSITORIES
            </span>
            <span className="text-[11px] font-mono text-zinc-400">
              Showing {visibleRepos.length} of {repos.length}
            </span>
          </div>

          {filteredRepos.length === 0 ? (
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 text-center text-xs font-mono text-zinc-400">
              No matching repositories.
            </div>
          ) : (
            <div className="space-y-2.5">
              {visibleRepos.map((repo) => {
                const isLatest = latestBuild?.id === repo.id;
                return (
                  <div
                    key={repo.id}
                    className="feed-card-interactive group p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 hover:border-purple-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    {/* Left: Info */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs sm:text-sm font-semibold text-white hover:text-purple-300 transition-colors inline-flex items-center gap-1.5"
                        >
                          <span className="break-all">{repo.name}</span>
                          <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-purple-300 shrink-0" />
                        </a>

                        {isLatest && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-purple-500/15 text-purple-300 border border-purple-500/30">
                            LATEST
                          </span>
                        )}

                        <span className="text-[10px] font-mono text-zinc-400 ml-auto sm:ml-0">
                          {getRepoRelativeTime(repo.updated_at)}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {repo.description || "No description provided."}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-zinc-400">
                        <div className="flex items-center gap-1.5">
                          <span 
                            className="w-1.5 h-1.5 rounded-full shrink-0" 
                            style={{ backgroundColor: getLanguageColor(repo.language) }} 
                          />
                          <span className="text-zinc-300">{repo.language || "Language unavailable"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400" />
                          <span>★ {repo.stargazers_count}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <GitFork className="w-3 h-3" />
                          <span>Fork {repo.forks_count}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Open Repository Link */}
                    <div className="shrink-0 flex items-center justify-end sm:justify-start pt-1 sm:pt-0">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-mono font-medium border border-white/10 bg-white/[0.04] text-zinc-300 group-hover:text-white group-hover:border-purple-500/40 transition-colors"
                        aria-label={`Open repository ${repo.name} on GitHub`}
                      >
                        <span className="hidden sm:inline">Open Repository</span>
                        <span className="sm:hidden">Open</span>
                        <span>→</span>
                      </a>
                    </div>
                  </div>
                );
              })}

              {/* Mobile "View more" toggle if more than 4 items */}
              {isMobile && filteredRepos.length > 4 && !showAllMobile && (
                <button
                  type="button"
                  onClick={() => setShowAllMobile(true)}
                  className="w-full py-2.5 rounded-xl text-xs font-mono text-zinc-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span>View more ({filteredRepos.length - 4} more)</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ==================================================
          BOTTOM FOOTER: "VIEW ALL ON GITHUB" & "LAST SYNCED"
          ================================================== */}
      <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        
        {/* Last Synced Status */}
        <div className="flex items-center gap-2 text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>GitHub connected</span>
          <span className="text-zinc-600">·</span>
          <span>
            {lastSyncedTimestamp ? formatSyncAge(lastSyncedTimestamp, isLiveFetch) : "Connecting..."}
          </span>
        </div>

        {/* View All Button */}
        <a
          href={GITHUB_PROFILE_REPOS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-mono text-xs font-medium text-purple-300 hover:text-white bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 hover:border-purple-500/40 transition-colors cursor-pointer w-fit"
          aria-label="View all repositories on GitHub"
        >
          <span>View all repositories on GitHub</span>
          <ArrowRight className="w-3 h-3" />
        </a>

      </div>

    </section>
  );
}
