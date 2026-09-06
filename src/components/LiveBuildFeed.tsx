import { useState, useMemo, memo } from "react";
import { 
  Github, ExternalLink, RotateCw, Search, Star, GitFork, 
  AlertCircle, Sparkles, X, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight
} from "lucide-react";
import { useGithub } from "../hooks/useGithub";
import { 
  formatRelativeTime, 
  formatSyncAge,
  GitHubRepo
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

function LiveBuildFeedComponent() {
  const { 
    repos, 
    loading, 
    error, 
    rateLimited, 
    syncedAt, 
    usingCache, 
    refresh 
  } = useGithub();

  // Search and language filter state
  const [query, setQuery] = useState<string>("" );
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number | "ALL">(6);

  // Dynamically compute available languages from the actual fetched repos
  const availableLanguages = useMemo(() => {
    const langs = new Set<string>();
    repos.forEach((repo) => {
      if (repo.language && repo.language.trim().length > 0) {
        langs.add(repo.language.trim());
      }
    });
    return ["ALL", ...Array.from(langs)];
  }, [repos]);

  // Color dot helper
  const getLanguageColor = (lang: string | null) => {
    if (!lang) return "#71717a";
    return LANGUAGE_COLORS[lang] || "#a1a1aa";
  };

  // Filtered repositories based on search and language filter
  const filteredRepos = useMemo(() => {
    return repos.filter((repo) => {
      // Language filter
      if (selectedLanguage !== "ALL" && repo.language !== selectedLanguage) {
        return false;
      }
      // Search filter
      if (query.trim().length > 0) {
        const q = query.toLowerCase();
        const matchesName = repo.name.toLowerCase().includes(q);
        const matchesDesc = (repo.description ?? "").toLowerCase().includes(q);
        const matchesLang = (repo.language ?? "").toLowerCase().includes(q);
        const matchesTopics = repo.topics?.some(t => t.toLowerCase().includes(q)) ?? false;
        if (!matchesName && !matchesDesc && !matchesLang && !matchesTopics) {
          return false;
        }
      }
      return true;
    });
  }, [repos, query, selectedLanguage]);

  // Pagination calculation
  const totalFiltered = filteredRepos.length;
  const isViewAll = pageSize === "ALL" || totalFiltered <= 6;
  const effectivePageSize = isViewAll ? totalFiltered : (pageSize as number);
  const totalPages = Math.max(1, Math.ceil(totalFiltered / (effectivePageSize || 1)));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const displayedRepos = useMemo(() => {
    if (isViewAll) {
      return filteredRepos;
    }
    const start = (safeCurrentPage - 1) * (pageSize as number);
    return filteredRepos.slice(start, start + (pageSize as number));
  }, [filteredRepos, isViewAll, safeCurrentPage, pageSize]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setCurrentPage(1);
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    setCurrentPage(1);
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
          border: 1px solid rgba(255, 255, 255, 0.09);
          box-shadow: 0 24px 60px -15px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08);
          padding: clamp(20px, 3vw, 32px);
        }

        .feed-card-interactive {
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
        }

        .feed-card-interactive:hover {
          transform: translateY(-2px);
        }

        @media (prefers-reduced-motion: reduce) {
          .feed-card-interactive:hover {
            transform: none !important;
          }
        }

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
          background: rgba(255, 255, 255, 0.9) !important;
          border-color: rgba(0, 0, 0, 0.09) !important;
          color: #18181b !important;
        }

        html.light .feed-card-interactive:hover,
        html[data-theme="light"] .feed-card-interactive:hover {
          background: rgba(255, 255, 255, 1) !important;
          border-color: rgba(168, 85, 247, 0.35) !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.06) !important;
        }
      `}</style>

      {/* ==================================================
          TOP CONTROLS & HEADER
          ================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>LIVE FROM GITHUB</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20">
              {repos.length} Public {repos.length === 1 ? "Repository" : "Repositories"}
            </span>
            <span className="text-[10px] font-mono text-zinc-400 hidden sm:inline">
              {formatSyncAge(syncedAt)}
            </span>
          </div>
          <h3 className="feed-heading text-xl sm:text-2xl font-bold font-display tracking-tight text-white flex items-center gap-2">
            <Github className="w-5 h-5 text-purple-400" />
            <span>Repository Explorer</span>
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Real public code repositories synced directly from github.com/codesbysayam.
          </p>
        </div>

        {/* Action Controls: Search & Refresh */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[200px] sm:min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search repositories..."
              aria-label="Search repositories"
              className="w-full pl-8 pr-8 py-1.5 rounded-xl text-xs font-mono bg-white/[0.04] border border-white/10 text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500/50 transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => handleQueryChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => refresh()}
            disabled={loading}
            title="Refresh repositories"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/10 text-xs font-mono transition-colors disabled:opacity-40 cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-purple-400" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Rate limit warning banner */}
      {rateLimited && (
        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>GitHub API rate limit reached. Displaying latest cached data.</span>
        </div>
      )}

      {/* Dynamic Language Filter & View Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-5 pb-2">
        {availableLanguages.length > 1 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold mr-1">
              Language:
            </span>
            {availableLanguages.map((lang) => {
              const isSelected = selectedLanguage === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-purple-600 text-white font-semibold shadow-sm border border-purple-400/30"
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
        )}

        {/* View All / Paginated Toggle when filtered repos exceed 6 */}
        {totalFiltered > 6 && (
          <button
            type="button"
            onClick={() => setPageSize(isViewAll ? 6 : "ALL")}
            className="px-2.5 py-1 text-xs font-mono rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            {isViewAll ? "Show Paginated (6/page)" : `View All (${totalFiltered})`}
          </button>
        )}
      </div>

      {/* ==================================================
          REPOSITORY CARDS GRID (Displays all public repos)
          ================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
        {loading && repos.length === 0 ? (
          /* Skeletons */
          Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-5 bg-white/[0.02] border border-white/10 animate-pulse space-y-3"
            >
              <div className="h-4 w-24 bg-white/10 rounded" />
              <div className="h-6 w-3/4 bg-white/10 rounded" />
              <div className="h-10 w-full bg-white/5 rounded" />
              <div className="h-4 w-1/2 bg-white/10 rounded pt-2" />
            </div>
          ))
        ) : displayedRepos.length > 0 ? (
          displayedRepos.map((repo, idx) => {
            const isLatest = idx === 0 && selectedLanguage === "ALL" && !query && safeCurrentPage === 1;
            return (
              <div
                key={repo.id || repo.name}
                className="feed-card-interactive flex flex-col justify-between rounded-2xl p-5 bg-white/[0.035] border border-white/[0.08] hover:border-purple-500/30 select-text"
              >
                <div className="space-y-2.5">
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between gap-2 text-[10px] font-mono">
                    {isLatest ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30 font-semibold tracking-wider">
                        <Sparkles className="w-2.5 h-2.5 text-purple-400" />
                        <span>LATEST</span>
                      </span>
                    ) : (
                      <span className="text-zinc-500">Repository</span>
                    )}
                    <span className="text-zinc-400">
                      Updated {formatRelativeTime(repo.updated_at)}
                    </span>
                  </div>

                  {/* Repository Title */}
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <h4 className="text-base font-bold font-sans text-white group-hover:text-purple-300 transition-colors flex items-center justify-between gap-2">
                      <span className="break-all">{repo.name}</span>
                      <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-purple-300 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </h4>
                  </a>

                  {/* Description */}
                  <p className="text-xs text-zinc-300/85 leading-relaxed line-clamp-2">
                    {repo.description || "Public open-source repository."}
                  </p>

                  {/* Topic Tags */}
                  {repo.topics && repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {repo.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-white/[0.04] text-zinc-400 border border-white/5"
                        >
                          #{topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer: Language, Stars, Forks, Link */}
                <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-3 text-zinc-400">
                    {repo.language && (
                      <span className="flex items-center gap-1.5 text-zinc-200">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: getLanguageColor(repo.language) }}
                        />
                        <span>{repo.language}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400" />
                      <span>{repo.stargazers_count}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3 h-3 text-zinc-400" />
                      <span>{repo.forks_count}</span>
                    </span>
                  </div>

                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 font-medium inline-flex items-center gap-0.5 transition-colors"
                  >
                    <span>Open ↗</span>
                  </a>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-10 text-center space-y-2">
            <p className="text-sm font-mono text-zinc-400">No repositories matching your filter.</p>
            <button
              type="button"
              onClick={() => {
                handleQueryChange("");
                handleLanguageChange("ALL");
              }}
              className="text-xs font-mono text-purple-400 hover:text-purple-300 underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* ==================================================
          PAGINATION & FOOTER
          ================================================== */}
      <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-400">
        <div>
          Showing {displayedRepos.length} of {totalFiltered} {totalFiltered === 1 ? "repository" : "repositories"}
          {totalFiltered !== repos.length && ` (${repos.length} total on profile)`}
        </div>

        <div className="flex items-center gap-3">
          {!isViewAll && totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={safeCurrentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3 h-3" />
                <span>Prev</span>
              </button>
              <span className="text-[11px] text-zinc-400 px-1">
                {safeCurrentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={safeCurrentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}

          <a
            href={GITHUB_PROFILE_REPOS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 font-semibold transition-colors"
          >
            <span>View All on GitHub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default memo(LiveBuildFeedComponent);

