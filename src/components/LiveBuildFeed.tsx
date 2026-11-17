import { useState, useMemo, memo } from "react";
import {
  Github,
  RotateCw,
  Search,
  Star,
  GitFork,
  X,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useGithub } from "../hooks/useGithub";
import { formatRelativeTime, formatSyncAge } from "../services/github";
import { Unavailable } from "./Unavailable";
import { EditorialReveal } from "../motion/Reveal";

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#ca8a04",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Java: "#b07219",
  "C++": "#be185d",
  C: "#555555",
  Go: "#0284c7",
  Rust: "#b45309",
  Shell: "#4d7c0f",
};

const GITHUB_PROFILE_REPOS_URL =
  "https://github.com/codesbysayam?tab=repositories";

function LiveBuildFeedComponent() {
  const {
    repos,
    loading,
    syncedAt,
    refresh,
    snapshotStatus,
    snapshot,
  } = useGithub();

  const [query, setQuery] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number | "ALL">(6);

  const availableLanguages = useMemo(() => {
    const langs = new Set<string>();
    repos.forEach((repo) => {
      if (repo.language && repo.language.trim().length > 0) {
        langs.add(repo.language.trim());
      }
    });
    return ["ALL", ...Array.from(langs)];
  }, [repos]);

  const getLanguageColor = (lang: string | null) => {
    if (!lang) return "#777A70";
    return LANGUAGE_COLORS[lang] || "#69734A";
  };

  const filteredRepos = useMemo(() => {
    return repos.filter((repo) => {
      if (selectedLanguage !== "ALL" && repo.language !== selectedLanguage) {
        return false;
      }
      if (query.trim().length > 0) {
        const q = query.toLowerCase();
        const matchesName = repo.name.toLowerCase().includes(q);
        const matchesDesc = (repo.description ?? "").toLowerCase().includes(q);
        const matchesLang = (repo.language ?? "").toLowerCase().includes(q);
        const matchesTopics =
          repo.topics?.some((t) => t.toLowerCase().includes(q)) ?? false;
        if (!matchesName && !matchesDesc && !matchesLang && !matchesTopics) {
          return false;
        }
      }
      return true;
    });
  }, [repos, query, selectedLanguage]);

  const totalFiltered = filteredRepos.length;
  const isViewAll = pageSize === "ALL" || totalFiltered <= 6;
  const effectivePageSize = isViewAll ? totalFiltered : (pageSize as number);
  const totalPages = Math.max(1, Math.ceil(totalFiltered / (effectivePageSize || 1)));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const displayedRepos = useMemo(() => {
    if (isViewAll) return filteredRepos;
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
      className="relative w-full rounded-[12px] overflow-hidden font-sans border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] p-5 sm:p-8 lg:p-10"
      aria-label="Live Build Feed from GitHub"
    >
      {/* TOP HEADER */}
      <EditorialReveal>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[var(--border)]">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[var(--text-muted)]">
              <span className="uppercase tracking-[0.12em] font-semibold text-[var(--accent)]">
                04 / Live Telemetry · GitHub Sync
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums font-semibold text-[var(--text)]">
                {repos.length} Public {repos.length === 1 ? "Repository" : "Repositories"}
              </span>
              <span className="hidden sm:inline" aria-hidden="true">·</span>
              <span className="hidden sm:inline">{formatSyncAge(syncedAt)}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight flex items-center gap-2.5 text-[var(--text)]">
              <Github className="w-6 h-6 text-[var(--accent)]" />
              <span>Repository Explorer</span>
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Public open-source repositories synced directly from github.com/codesbysayam.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refresh()}
            disabled={loading}
            title="Refresh repositories"
            className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-[6px] text-xs font-mono font-semibold border border-[var(--border-strong)] bg-transparent hover:bg-[var(--text)] hover:text-[var(--bg)] transition-colors disabled:opacity-40 cursor-pointer self-start md:self-auto"
          >
            <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync Feed</span>
          </button>
        </div>
      </EditorialReveal>

      {!loading && repos.length === 0 ? (
        <Unavailable
          onRetry={refresh}
          isRetrying={loading}
          status={
            snapshotStatus === "error" || snapshot?.status === "error"
              ? "error"
              : "empty"
          }
          profileUrl="https://github.com/codesbysayam"
        />
      ) : (
        <>
          {/* CONTROLS TOOLBAR */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-5 pb-2">
            {availableLanguages.length > 1 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[var(--text-faint)] mr-1">
                  Lang:
                </span>
                {availableLanguages.map((lang) => {
                  const isSelected = selectedLanguage === lang;
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => handleLanguageChange(lang)}
                      className={`px-3 py-1.5 min-h-[34px] rounded-[6px] text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5 border ${
                        isSelected
                          ? "bg-[#C7E34A] border-[#C7E34A] text-[#20231D] font-bold"
                          : "bg-transparent hover:bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] border-[var(--border)]"
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

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative min-w-[200px] sm:min-w-[250px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-faint)]" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  placeholder="Filter repositories..."
                  aria-label="Search repositories"
                  className="w-full pl-8 pr-8 py-2 rounded-[6px] text-xs font-mono bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--text)]"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => handleQueryChange("")}
                    aria-label="Clear repository filter"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-[var(--text-faint)] hover:text-[var(--text)]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {totalFiltered > 6 && (
                <button
                  type="button"
                  onClick={() => setPageSize(isViewAll ? 6 : "ALL")}
                  className="px-3 py-2 min-h-[36px] text-xs font-mono font-semibold rounded-[6px] border border-[var(--border-strong)] bg-transparent hover:bg-[var(--surface)] text-[var(--text)] transition-colors cursor-pointer"
                >
                  {isViewAll ? "Show 6 / page" : `View All (${totalFiltered})`}
                </button>
              )}
            </div>
          </div>

          {/* REPOSITORY CARDS GRID */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4 pt-4">
            {loading && repos.length === 0 ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-[10px] p-5 space-y-3 min-w-0 border border-[var(--border)] bg-[var(--surface)]"
                >
                  <div className="h-4 w-24 rounded bg-[var(--border)]" />
                  <div className="h-6 w-3/4 rounded bg-[var(--border)]" />
                  <div className="h-10 w-full rounded bg-[var(--border)]" />
                  <div className="h-4 w-1/2 rounded pt-2 bg-[var(--border)]" />
                </div>
              ))
            ) : displayedRepos.length > 0 ? (
              displayedRepos.map((repo, idx) => {
                const isLatest =
                  idx === 0 &&
                  selectedLanguage === "ALL" &&
                  !query &&
                  safeCurrentPage === 1;
                return (
                  <div
                    key={repo.id || repo.name}
                    className="flex flex-col justify-between rounded-[10px] p-5 border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--text)] transition-colors select-text min-w-0 w-full"
                  >
                    <div className="space-y-2.5 min-w-0">
                      <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                        {isLatest ? (
                          <span className="px-2 py-0.5 rounded-[4px] bg-[#C7E34A] text-[#20231D] font-bold tracking-wider uppercase">
                            Latest Push
                          </span>
                        ) : (
                          <span className="text-[var(--text-faint)] uppercase tracking-wider">
                            Repository
                          </span>
                        )}
                        <span className="text-[var(--text-muted)]">
                          {formatRelativeTime(repo.updated_at)}
                        </span>
                      </div>

                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group min-w-0"
                      >
                        <h3 className="text-base font-bold font-sans text-[var(--text)] group-hover:underline flex items-center justify-between gap-2 min-w-0">
                          <span className="break-all min-w-0">{repo.name}</span>
                          <ArrowUpRight className="w-4 h-4 shrink-0 text-[var(--text-muted)] group-hover:text-[var(--text)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </h3>
                      </a>

                      <p className="text-xs leading-relaxed text-[var(--text-secondary)] line-clamp-2 break-words">
                        {repo.description || "Public open-source repository."}
                      </p>

                      {repo.topics && repo.topics.length > 0 && (
                        <div className="flex flex-wrap gap-x-2.5 gap-y-1 pt-1 text-[11px] font-mono text-[var(--text-faint)]">
                          {repo.topics.slice(0, 3).map((topic) => (
                            <span key={topic}>#{topic}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                      <div className="flex items-center gap-3">
                        {repo.language && (
                          <span className="flex items-center gap-1.5 text-[var(--text)] font-medium">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: getLanguageColor(repo.language) }}
                            />
                            <span>{repo.language}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1 tabular-nums">
                          <Star className="w-3 h-3 text-[var(--accent)]" />
                          <span>{repo.stargazers_count}</span>
                        </span>
                        <span className="flex items-center gap-1 tabular-nums">
                          <GitFork className="w-3 h-3" />
                          <span>{repo.forks_count}</span>
                        </span>
                      </div>

                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[var(--text)] hover:underline inline-flex items-center gap-0.5"
                      >
                        <span>Open ↗</span>
                      </a>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-10 text-center space-y-2">
                <p className="text-sm font-mono text-[var(--text-muted)]">
                  No repositories matching your filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    handleQueryChange("");
                    handleLanguageChange("ALL");
                  }}
                  className="text-xs font-mono underline font-semibold text-[var(--text)] cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>

          {/* PAGINATION & FOOTER */}
          <div className="mt-6 pt-4 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[var(--text-muted)]">
            <div className="tabular-nums">
              Showing {displayedRepos.length} of {totalFiltered}{" "}
              {totalFiltered === 1 ? "repository" : "repositories"}
              {totalFiltered !== repos.length && ` (${repos.length} total)`}
            </div>

            <div className="flex items-center gap-3">
              {!isViewAll && totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={safeCurrentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-2.5 py-1.5 rounded-[4px] disabled:opacity-30 disabled:cursor-not-allowed border border-[var(--border-strong)] bg-transparent hover:bg-[var(--surface)] text-[var(--text)] flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-3 h-3" />
                    <span>Prev</span>
                  </button>
                  <span className="text-xs px-1 tabular-nums">
                    {safeCurrentPage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={safeCurrentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-2.5 py-1.5 rounded-[4px] disabled:opacity-30 disabled:cursor-not-allowed border border-[var(--border-strong)] bg-transparent hover:bg-[var(--surface)] text-[var(--text)] flex items-center gap-1 cursor-pointer"
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
                className="inline-flex items-center gap-1 font-semibold text-[var(--text)] hover:underline"
              >
                <span>View All on GitHub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default memo(LiveBuildFeedComponent);
