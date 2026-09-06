import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Github, Linkedin, BarChart2, GitCommit, Users, Star, 
  ExternalLink, Code, Layers, Sparkles, Terminal, CheckCircle2,
  GitFork, ShieldCheck, Flame, AlertCircle, RefreshCw
} from "lucide-react";
import GitHubActivityHeatmap from "./GitHubActivityHeatmap";
import LanguageRingChart from "./LanguageRingChart";
import { fetchGitHubStats, GitHubStatsData, VERIFIED_GITHUB_FALLBACK } from "../services/github";
import { fetchLeetCodeStats, LeetCodeStatsData, VERIFIED_LEETCODE_FALLBACK } from "../services/leetcode";
import { fetchCodolioProfile, CodolioProfileData, VERIFIED_CODOLIO_DATA } from "../services/codolio";

export default function CodingProfiles() {
  const [activeTab, setActiveTab] = useState<'github' | 'leetcode' | 'codolio' | 'linkedin'>('github');
  
  // Real live telemetry states
  const [githubData, setGithubData] = useState<GitHubStatsData>(VERIFIED_GITHUB_FALLBACK);
  const [leetcodeData, setLeetcodeData] = useState<LeetCodeStatsData>(VERIFIED_LEETCODE_FALLBACK);
  const [codolioData, setCodolioData] = useState<CodolioProfileData>(VERIFIED_CODOLIO_DATA);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshingGitHub, setRefreshingGitHub] = useState<boolean>(false);

  const handleRefreshGitHub = async () => {
    setRefreshingGitHub(true);
    try {
      const data = await fetchGitHubStats(true);
      setGithubData(data);
    } catch (err) {
      console.error("Manual GitHub refresh error:", err);
    } finally {
      setRefreshingGitHub(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function loadAllTelemetry() {
      setLoading(true);
      try {
        const [gh, lc, cd] = await Promise.allSettled([
          fetchGitHubStats(),
          fetchLeetCodeStats(),
          fetchCodolioProfile()
        ]);

        if (isMounted) {
          if (gh.status === "fulfilled") setGithubData(gh.value);
          if (lc.status === "fulfilled") setLeetcodeData(lc.value);
          if (cd.status === "fulfilled") setCodolioData(cd.value);
        }
      } catch (err) {
        console.error("Telemetry sync error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAllTelemetry();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="space-y-10 font-sans" id="coding-profiles">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-950/80 border border-zinc-900 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">
            LIVE VERIFIED TELEMETRY
          </span>
        </div>
        <h2 
          style={{ fontSize: "clamp(1.5rem, 3.5vw, 3.5rem)" }} 
          className="font-bold tracking-tight text-white font-display"
        >
          Coding Profiles & Telemetry
        </h2>
        <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
          Authentic metrics aggregated via live server-side proxies from GitHub, LeetCode, and verified developer registries. Zero fabricated numbers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side Controller Tabs */}
        <div className="lg:col-span-3 flex flex-col gap-2 glass-card p-3 rounded-2xl">
          <button
            onClick={() => setActiveTab('github')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer group ${
              activeTab === 'github'
                ? "bg-zinc-900 border-zinc-800 text-white shadow-md"
                : "bg-transparent border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <Github className="w-4 h-4 text-purple-400" />
              <div className="flex flex-col">
                <span className="text-xs font-bold font-display">GitHub Workspace</span>
                <span className="text-[10px] text-zinc-500 font-mono">@{githubData.username}</span>
              </div>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-900/40">
              Live
            </span>
          </button>

          <button
            onClick={() => setActiveTab('leetcode')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer group ${
              activeTab === 'leetcode'
                ? "bg-zinc-900 border-zinc-800 text-white shadow-md"
                : "bg-transparent border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <Code className="w-4 h-4 text-amber-400" />
              <div className="flex flex-col">
                <span className="text-xs font-bold font-display">LeetCode Challenges</span>
                <span className="text-[10px] text-zinc-500 font-mono">4 Solved • Deliberate DSA</span>
              </div>
            </div>
            <span className="text-[9px] font-mono text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-900/40">
              {leetcodeData.totalSolved} Solved
            </span>
          </button>

          <button
            onClick={() => setActiveTab('codolio')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer group ${
              activeTab === 'codolio'
                ? "bg-zinc-900 border-zinc-800 text-white shadow-md"
                : "bg-transparent border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4 text-cyan-400" />
              <div className="flex flex-col">
                <span className="text-xs font-bold font-display">Codolio Registry</span>
                <span className="text-[10px] text-zinc-500 font-mono">Verified Node</span>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <button
            onClick={() => setActiveTab('linkedin')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer group ${
              activeTab === 'linkedin'
                ? "bg-zinc-900 border-zinc-800 text-white shadow-md"
                : "bg-transparent border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <Linkedin className="w-4 h-4 text-blue-400" />
              <div className="flex flex-col">
                <span className="text-xs font-bold font-display">LinkedIn Connect</span>
                <span className="text-[10px] text-zinc-500 font-mono">Professional Network</span>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Right Side Details Frame */}
        <div className="lg:col-span-9">
          {/* GITHUB TAB */}
          {activeTab === 'github' && (
            <div className="glass-card p-6 md:p-8 rounded-2xl space-y-6">
              {/* GitHub Metrics Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-850 flex items-center justify-center">
                    <Github className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-display leading-none">
                      @{githubData.username}
                    </h3>
                    <p className="text-[10px] text-zinc-400 font-mono mt-1">
                      {githubData.name} • {githubData.location || "Kolkata, India"} • {githubData.publicRepos || 4} Public Repositories
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="hidden sm:inline text-[10px] text-zinc-500 font-mono">
                    Last synced: {githubData.lastSynced}
                  </span>
                  <button
                    onClick={handleRefreshGitHub}
                    disabled={refreshingGitHub}
                    className="bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/50 text-purple-300 hover:text-white text-xs font-mono font-medium px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    title="Force refresh real-time GitHub telemetry"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${refreshingGitHub ? "animate-spin" : ""}`} />
                    <span>{refreshingGitHub ? "Syncing..." : "Sync Realtime"}</span>
                  </button>
                  <a 
                    href="https://github.com/codesbysayam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <span>Verify Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Grid statistics (Real Counts) */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
                <div className="bg-zinc-900/40 border border-zinc-850 p-3.5 rounded-xl text-center">
                  <span className="text-[9px] text-zinc-500 uppercase font-mono block">COMMITS / CONTRIBS</span>
                  <span className="text-xl font-bold text-emerald-400 block mt-1 font-display">
                    {githubData.totalContributionsThisYear}
                  </span>
                  <span className="text-[9px] text-zinc-500 font-mono">2026 telemetry</span>
                </div>
                <div className="bg-zinc-900/40 border border-zinc-850 p-3.5 rounded-xl text-center">
                  <span className="text-[9px] text-zinc-500 uppercase font-mono block">PUBLIC REPOSITORIES</span>
                  <span className="text-xl font-bold text-white block mt-1 font-display">
                    {githubData.publicRepos}
                  </span>
                  <span className="text-[9px] text-zinc-500 font-mono">4 verified repos</span>
                </div>
                <div className="bg-zinc-900/40 border border-zinc-850 p-3.5 rounded-xl text-center">
                  <span className="text-[9px] text-zinc-500 uppercase font-mono block">ACTIVE STREAK</span>
                  <span className="text-xl font-bold text-amber-400 block mt-1 font-display">
                    {githubData.currentStreak}d
                  </span>
                  <span className="text-[9px] text-zinc-500 font-mono">Best: {githubData.longestStreak}d</span>
                </div>
                <div className="bg-zinc-900/40 border border-zinc-850 p-3.5 rounded-xl text-center">
                  <span className="text-[9px] text-zinc-500 uppercase font-mono block">FOLLOWERS / FOLLOWING</span>
                  <span className="text-xl font-bold text-cyan-400 block mt-1 font-display">
                    {githubData.followers} / {githubData.following}
                  </span>
                  <span className="text-[9px] text-zinc-500 font-mono">Network nodes</span>
                </div>
                <div className="bg-zinc-900/40 border border-zinc-850 p-3.5 rounded-xl text-center col-span-2 sm:col-span-1">
                  <span className="text-[9px] text-zinc-500 uppercase font-mono block">TOTAL STARS</span>
                  <span className="text-xl font-bold text-purple-400 block mt-1 font-display">
                    {githubData.totalStars}
                  </span>
                  <span className="text-[9px] text-zinc-500 font-mono">Public stars</span>
                </div>
              </div>

              {/* Verified Public Repositories & Real Languages */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-7 space-y-4">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider block">
                    VERIFIED PUBLIC REPOSITORIES
                  </span>
                  
                  <div className="space-y-3">
                    {githubData.repositories.map((repo, idx) => (
                      <div key={idx} className="bg-zinc-950/50 border border-zinc-900/80 p-4 rounded-xl space-y-2 hover:border-purple-500/30 transition-all">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-purple-400" />
                            {repo.name}
                          </h4>
                          <a 
                            href={repo.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[10px] font-mono bg-zinc-900 text-zinc-300 hover:text-white px-2 py-0.5 rounded border border-zinc-800 flex items-center gap-1"
                          >
                            <span>Open</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-normal">{repo.description}</p>
                        
                        <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-mono pt-1">
                          <span className="text-cyan-400 font-medium">{repo.language}</span>
                          <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500" /> {repo.stars} stars</span>
                          <span className="flex items-center gap-1"><GitFork className="w-3 h-3 text-purple-500" /> {repo.forks} forks</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Real Language Ring Chart */}
                <div className="md:col-span-5 bg-zinc-950/50 border border-zinc-900/80 p-5 rounded-2xl">
                  <LanguageRingChart showLegend={true} />
                </div>
              </div>

              {/* GitHub Activity Heatmap */}
              <div className="pt-2">
                <GitHubActivityHeatmap username="codesbysayam" />
              </div>
            </div>
          )}

          {/* LEETCODE TAB */}
          {activeTab === 'leetcode' && (
            <div className="glass-card p-6 md:p-8 rounded-2xl space-y-6">
              {/* LeetCode Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-850 flex items-center justify-center">
                    <Code className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-display leading-none">
                      LeetCode Profile • @codesbysayam
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-mono mt-1">
                      Deliberate algorithmic practice • Focus on mastery over volume
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-zinc-500 font-mono">
                    Last synced: {leetcodeData.lastSynced}
                  </span>
                  <a 
                    href="https://leetcode.com/u/codesbysayam/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <span>Verify on LeetCode</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* LeetCode Key Statistics (Verified 4 Solved) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl text-center">
                  <span className="text-[9px] text-zinc-500 uppercase font-mono block">TOTAL PROBLEMS SOLVED</span>
                  <span className="text-2xl font-bold text-amber-400 block mt-1 font-display">
                    {leetcodeData.totalSolved}
                  </span>
                  <span className="text-[9px] text-zinc-500 font-mono">Verified live count</span>
                </div>
                <div className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl text-center">
                  <span className="text-[9px] text-zinc-500 uppercase font-mono block">EASY</span>
                  <span className="text-2xl font-bold text-emerald-400 block mt-1 font-display">
                    {leetcodeData.easySolved}
                  </span>
                  <span className="text-[9px] text-zinc-500 font-mono">Foundational concepts</span>
                </div>
                <div className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl text-center">
                  <span className="text-[9px] text-zinc-500 uppercase font-mono block">MEDIUM</span>
                  <span className="text-2xl font-bold text-amber-400 block mt-1 font-display">
                    {leetcodeData.mediumSolved}
                  </span>
                  <span className="text-[9px] text-zinc-500 font-mono">Algorithmic intuition</span>
                </div>
                <div className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl text-center">
                  <span className="text-[9px] text-zinc-500 uppercase font-mono block">HARD</span>
                  <span className="text-2xl font-bold text-red-400 block mt-1 font-display">
                    {leetcodeData.hardSolved}
                  </span>
                  <span className="text-[9px] text-zinc-500 font-mono">Advanced query optimization</span>
                </div>
              </div>

              {/* Philosophy & Progress Context */}
              <div className="bg-zinc-950/50 border border-zinc-900 p-4 rounded-xl space-y-2">
                <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  AUTHENTIC ALGORITHMIC ROADMAP
                </span>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  "I prioritize deep conceptual understanding over inflated problem counts. Solving 4 problems thoroughly—analyzing pointer mechanics, memory layouts, and runtime complexity—lays the foundation for sustainable engineering problem solving as I advance into B.Tech CSE algorithms."
                </p>
              </div>

              {/* Recent Verified Accepted Submissions */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider block">
                  RECENT ACCEPTED SUBMISSIONS
                </span>
                
                <div className="space-y-2">
                  {leetcodeData.recentSubmissions.map((sub, idx) => (
                    <div key={idx} className="bg-zinc-950/50 border border-zinc-900 p-3.5 rounded-xl flex justify-between items-center text-xs font-mono">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-zinc-200 font-bold">{sub.title}</span>
                        {sub.lang && (
                          <span className="text-[9px] bg-zinc-900 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-800">
                            {sub.lang}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[9px] font-bold border px-2 py-0.5 rounded-full ${
                          sub.difficulty === "Easy" 
                            ? "bg-emerald-950/40 border-emerald-800/40 text-emerald-400" 
                            : sub.difficulty === "Medium"
                            ? "bg-amber-950/40 border-amber-800/40 text-amber-400"
                            : "bg-red-950/40 border-red-800/40 text-red-400"
                        }`}>
                          {sub.difficulty || "Accepted"}
                        </span>
                        <span className="text-emerald-400 font-bold uppercase text-[9px]">ACCEPTED</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CODOLIO TAB */}
          {activeTab === 'codolio' && (
            <div className="glass-card p-6 md:p-8 rounded-2xl space-y-6">
              {/* Codolio Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-850 flex items-center justify-center">
                    <Layers className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-display leading-none">
                      Codolio Developer Registry
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-mono mt-1">
                      Codolio username: @codesbysayam
                    </p>
                  </div>
                </div>

                <a 
                  href="https://codolio.com/profile/codesbysayam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <span>View Verified Codolio Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Clean Codolio Card */}
              <div className="bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl space-y-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white font-display">
                    Verified Codolio Developer Node
                  </h4>
                  <p className="text-xs text-zinc-400 font-mono">
                    Profile handle: codesbysayam
                  </p>
                </div>
                <div className="p-3 bg-zinc-900/50 rounded-xl max-w-md mx-auto border border-zinc-850">
                  <p className="text-xs text-zinc-400 font-mono flex items-center justify-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Live statistics unavailable (Manual verification enabled)</span>
                  </p>
                </div>
                <div>
                  <a
                    href="https://codolio.com/profile/codesbysayam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono font-bold text-white transition-all shadow-md"
                  >
                    <span>View Verified Codolio Profile</span>
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* LINKEDIN TAB */}
          {activeTab === 'linkedin' && (
            <div className="glass-card p-6 md:p-8 rounded-2xl space-y-6">
              {/* LinkedIn Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-850 flex items-center justify-center">
                    <Linkedin className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-display leading-none">
                      Professional Network Connection
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-mono mt-1">
                      LinkedIn Profile Hub • Sayam Mukherjee
                    </p>
                  </div>
                </div>

                <a 
                  href="https://www.linkedin.com/in/sayam-mukherjee-b96209324/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0077b5] hover:bg-[#006699] text-white text-xs font-mono font-semibold px-4.5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>Connect on LinkedIn</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Networking details summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-white font-display">Let's Connect & Collaborate!</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    I publish technical project breakdowns, computer vision research notes, and full-stack architecture insights to my LinkedIn feed.
                  </p>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Whether you are an engineering lead, fellow undergraduate, researcher, or open-source contributor, feel free to connect or send a message.
                  </p>
                </div>

                <div className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl space-y-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 font-mono block uppercase">TARGET CONNECTIONS</span>
                    <ul className="space-y-1.5 mt-2.5 text-xs text-zinc-300">
                      <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-purple-400 shrink-0" /> AI & Computer Vision Teams</li>
                      <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-cyan-400 shrink-0" /> Full-Stack Web Engineering Leads</li>
                      <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-emerald-400 shrink-0" /> Hackathon Collaborators</li>
                    </ul>
                  </div>

                  <span className="text-[9px] text-zinc-500 font-mono italic">Verified status: 🟢 Active networking online</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
