import { useState, useMemo, memo } from "react";
import { 
  Github, ExternalLink, RotateCw, Search, Star, GitFork, 
  AlertCircle, Sparkles, X, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight
} from "lucide-react";
import { useGithub } from "../hooks/useGithub";
import { usePortfolio } from "../context/PortfolioContext";
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
  const { theme } = usePortfolio();
  const isLight = theme === "light";

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
  const [query, setQuery] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number | "ALL">(6);
  const [rateLimitDismissed, setRateLimitDismissed] = useState<boolean>(false);

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
      className={`relative w-full rounded-3xl overflow-hidden font-sans select-none border transition-all p-5 sm:p-7 md:p-8 ${
        isLight
          ? "bg-white border-slate-200/90 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.08)] text-slate-800"
          : "bg-[#11131c]/90 border-white/[0.08] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)] text-zinc-100"
      }`}
      aria-label="Live Build Feed from GitHub"
    >
      {/* ==================================================
          TOP CONTROLS & HEADER
          ================================================== */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b ${
        isLight ? "border-slate-200/80" : "border-white/[0.08]"
      }`}>
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold tracking-wide border ${
              isLight
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse shrink-0 ${isLight ? "bg-emerald-600" : "bg-emerald-400"}`} />
              <span>Live from GitHub</span>
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-mono border ${
              isLight
                ? "bg-violet-50 text-violet-800 border-violet-200"
                : "bg-purple-500/10 text-purple-300 border-purple-500/20"
            }`}>
              {repos.length} Public {repos.length === 1 ? "Repository" : "Repositories"}
            </span>
            <span className={`text-xs font-mono hidden sm:inline ${
              isLight ? "text-slate-500" : "text-zinc-400"
            }`}>
              {formatSyncAge(syncedAt)}
            </span>
          </div>
          <h2 className={`text-xl sm:text-2xl font-bold font-display tracking-tight flex items-center gap-2 ${
            isLight ? "text-slate-900" : "text-white"
          }`}>
            <Github className={`w-5 h-5 ${isLight ? "text-violet-600" : "text-purple-400"}`} />
            <span>Repository Explorer</span>
          </h2>
          <p className={`text-xs sm:text-sm mt-0.5 ${
            isLight ? "text-slate-600" : "text-zinc-400"
          }`}>
            Real public code repositories synced directly from github.com/codesbysayam.
          </p>
        </div>
      </div>

      {/* Dismissible Rate limit notification */}
      {rateLimited && !rateLimitDismissed && (
        <div className={`mt-4 px-3.5 py-2.5 rounded-xl border text-xs font-mono flex items-center justify-between gap-3 ${
          isLight
            ? "bg-amber-50/90 border-amber-200 text-amber-800"
            : "bg-amber-500/10 border-amber-500/20 text-amber-300"
        }`}>
          <div className="flex items-center gap-2 min-w-0">
            <AlertCircle className={`w-4 h-4 shrink-0 ${isLight ? "text-amber-600" : "text-amber-400"}`} />
            <span className="truncate">GitHub API rate limit reached. Displaying latest cached data.</span>
          </div>
          <button
            type="button"
            onClick={() => setRateLimitDismissed(true)}
            className="p-1 hover:opacity-75 transition-opacity cursor-pointer shrink-0"
            aria-label="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Unified Repository Controls Toolbar (Search, Filter, View All, Refresh) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-5 pb-2">
        {/* Left: Language filter pills */}
        {availableLanguages.length > 1 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`text-xs font-mono tracking-wider font-semibold mr-1 ${
              isLight ? "text-slate-500" : "text-zinc-400"
            }`}>
              Language:
            </span>
            {availableLanguages.map((lang) => {
              const isSelected = selectedLanguage === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? isLight
                        ? "bg-violet-600 text-white font-semibold shadow-xs"
                        : "bg-purple-600 text-white font-semibold shadow-xs border border-purple-400/30"
                      : isLight
                        ? "bg-slate-100 hover:bg-slate-200/70 text-slate-700 border border-slate-200/80"
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

        {/* Right: Consolidated Search, View All & Refresh */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[200px] sm:min-w-[240px]">
            <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
              isLight ? "text-slate-400" : "text-zinc-400"
            }`} />
            <input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search repositories..."
              aria-label="Search repositories"
              className={`w-full pl-8 pr-8 py-2 rounded-xl text-xs font-mono transition-all focus:outline-none ${
                isLight
                  ? "bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-violet-500 focus:bg-white"
                  : "bg-white/[0.04] border border-white/10 text-white placeholder-zinc-500 focus:border-purple-500/50"
              }`}
            />
            {query && (
              <button
                type="button"
                onClick={() => handleQueryChange("")}
                className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 ${
                  isLight ? "text-slate-400 hover:text-slate-700" : "text-zinc-400 hover:text-white"
                }`}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* View All / Paginated Toggle */}
          {totalFiltered > 6 && (
            <button
              type="button"
              onClick={() => setPageSize(isViewAll ? 6 : "ALL")}
              className={`px-3 py-2 text-xs font-mono rounded-xl border transition-colors cursor-pointer ${
                isLight
                  ? "bg-slate-100 hover:bg-slate-200/70 text-slate-700 border-slate-200"
                  : "bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border-white/10"
              }`}
            >
              {isViewAll ? "Show Paginated (6/page)" : `View All (${totalFiltered})`}
            </button>
          )}

          <button
            type="button"
            onClick={() => refresh()}
            disabled={loading}
            title="Refresh repositories"
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono border transition-colors disabled:opacity-40 cursor-pointer ${
              isLight
                ? "bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 hover:text-slate-950 border-slate-200"
                : "bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border-white/10"
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-purple-400" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* ==================================================
          REPOSITORY CARDS GRID (Displays all public repos)
          ================================================== */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4 pt-4">
        {loading && repos.length === 0 ? (
          /* Skeletons */
          Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-5 animate-pulse space-y-3 min-w-0 border ${
                isLight ? "bg-slate-100 border-slate-200" : "bg-white/[0.02] border-white/10"
              }`}
            >
              <div className={`h-4 w-24 rounded ${isLight ? "bg-slate-200" : "bg-white/10"}`} />
              <div className={`h-6 w-3/4 rounded ${isLight ? "bg-slate-200" : "bg-white/10"}`} />
              <div className={`h-10 w-full rounded ${isLight ? "bg-slate-200/60" : "bg-white/5"}`} />
              <div className={`h-4 w-1/2 rounded pt-2 ${isLight ? "bg-slate-200" : "bg-white/10"}`} />
            </div>
          ))
        ) : displayedRepos.length > 0 ? (
          displayedRepos.map((repo, idx) => {
            const isLatest = idx === 0 && selectedLanguage === "ALL" && !query && safeCurrentPage === 1;
            return (
              <div
                key={repo.id || repo.name}
                className={`flex flex-col justify-between rounded-2xl p-5 border transition-all duration-200 hover:-translate-y-0.5 select-text min-w-0 w-full ${
                  isLight
                    ? "bg-slate-50/70 border-slate-200/90 hover:bg-white hover:border-violet-400/60 hover:shadow-md"
                    : "bg-white/[0.025] border-white/[0.07] hover:bg-white/[0.05] hover:border-purple-500/30 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                }`}
              >
                <div className="space-y-2.5 min-w-0">
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between gap-2 text-[10px] font-mono">
                    {isLatest ? (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold tracking-wider border ${
                        isLight
                          ? "bg-violet-50 text-violet-800 border-violet-200"
                          : "bg-purple-500/15 text-purple-300 border-purple-500/30"
                      }`}>
                        <Sparkles className={`w-2.5 h-2.5 ${isLight ? "text-violet-600" : "text-purple-400"}`} />
                        <span>LATEST</span>
                      </span>
                    ) : (
                      <span className={isLight ? "text-slate-500" : "text-zinc-500"}>Repository</span>
                    )}
                    <span className={isLight ? "text-slate-500" : "text-zinc-400"}>
                      Updated {formatRelativeTime(repo.updated_at)}
                    </span>
                  </div>

                  {/* Repository Title */}
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group min-w-0"
                  >
                    <h4 className={`text-base font-bold font-sans transition-colors flex items-center justify-between gap-2 min-w-0 ${
                      isLight ? "text-slate-900 group-hover:text-violet-700" : "text-white group-hover:text-purple-300"
                    }`}>
                      <span className="break-all overflow-wrap-anywhere min-w-0">{repo.name}</span>
                      <ArrowUpRight className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                        isLight ? "text-slate-400 group-hover:text-violet-700" : "text-zinc-500 group-hover:text-purple-300"
                      }`} />
                    </h4>
                  </a>

                  {/* Description */}
                  <p className={`text-xs leading-relaxed line-clamp-2 break-words ${
                    isLight ? "text-slate-600" : "text-zinc-300/85"
                  }`}>
                    {repo.description || "Public open-source repository."}
                  </p>

                  {/* Topic Tags */}
                  {repo.topics && repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {repo.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className={`px-1.5 py-0.5 text-[9px] font-mono rounded border ${
                            isLight
                              ? "bg-slate-100 text-slate-700 border-slate-200"
                              : "bg-white/[0.04] text-zinc-400 border-white/5"
                          }`}
                        >
                          #{topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer: Language, Stars, Forks, Link */}
                <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-mono ${
                  isLight ? "border-slate-200/80 text-slate-600" : "border-white/[0.08] text-zinc-400"
                }`}>
                  <div className="flex items-center gap-3">
                    {repo.language && (
                      <span className={`flex items-center gap-1.5 ${isLight ? "text-slate-800 font-medium" : "text-zinc-200"}`}>
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: getLanguageColor(repo.language) }}
                        />
                        <span>{repo.language}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star className={`w-3 h-3 ${isLight ? "text-amber-500" : "text-amber-400"}`} />
                      <span>{repo.stargazers_count}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className={`w-3 h-3 ${isLight ? "text-slate-400" : "text-zinc-400"}`} />
                      <span>{repo.forks_count}</span>
                    </span>
                  </div>

                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`font-semibold inline-flex items-center gap-0.5 transition-colors ${
                      isLight ? "text-violet-700 hover:text-violet-900" : "text-purple-400 hover:text-purple-300"
                    }`}
                  >
                    <span>Open ↗</span>
                  </a>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-10 text-center space-y-2">
            <p className={`text-sm font-mono ${isLight ? "text-slate-600" : "text-zinc-400"}`}>No repositories matching your filter.</p>
            <button
              type="button"
              onClick={() => {
                handleQueryChange("");
                handleLanguageChange("ALL");
              }}
              className={`text-xs font-mono underline cursor-pointer ${
                isLight ? "text-violet-700 hover:text-violet-900" : "text-purple-400 hover:text-purple-300"
              }`}
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* ==================================================
          PAGINATION & FOOTER
          ================================================== */}
      <div className={`mt-6 pt-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs font-mono ${
        isLight ? "border-slate-200/80 text-slate-600" : "border-white/[0.08] text-zinc-400"
      }`}>
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
                className={`px-2 py-1 rounded-md disabled:opacity-30 disabled:cursor-not-allowed border transition-colors flex items-center gap-1 cursor-pointer ${
                  isLight
                    ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                    : "bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border-white/10"
                }`}
              >
                <ChevronLeft className="w-3 h-3" />
                <span>Prev</span>
              </button>
              <span className={`text-[11px] px-1 ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
                {safeCurrentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={safeCurrentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={`px-2 py-1 rounded-md disabled:opacity-30 disabled:cursor-not-allowed border transition-colors flex items-center gap-1 cursor-pointer ${
                  isLight
                    ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                    : "bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border-white/10"
                }`}
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
            className={`inline-flex items-center gap-1 font-semibold transition-colors ${
              isLight ? "text-violet-700 hover:text-violet-900" : "text-purple-400 hover:text-purple-300"
            }`}
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

