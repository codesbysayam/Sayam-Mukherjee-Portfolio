import { useState } from "react";
import { motion } from "motion/react";
import { 
  Github, Linkedin, BarChart2, GitCommit, Users, Star, 
  ExternalLink, Code, Layers, Sparkles, Terminal, CheckCircle2 
} from "lucide-react";
import GitHubActivityHeatmap from "./GitHubActivityHeatmap";
import LanguageRingChart from "./LanguageRingChart";

export default function CodingProfiles() {
  const [activeTab, setActiveTab] = useState<'github' | 'codolio' | 'linkedin'>('github');

  // Simulated live stats
  const githubStats = {
    repositories: 24,
    followers: 84,
    stars: 52,
    commitsThisYear: 850,
    pinnedRepos: [
      { name: "obsidian-optics", desc: "Real-time edge computer vision pipeline using YOLOv8 & PyTorch for multi-object tracking.", stars: 22, forks: 4, lang: "Python" },
      { name: "daily-decipher", desc: "Automated AI digest summary engine parsing arXiv publications via Gemini API.", stars: 16, forks: 3, lang: "TypeScript" },
      { name: "fitness-os-pro", desc: "Comprehensive central HealthTech tracking and workout dashboard system.", stars: 14, forks: 2, lang: "Next.js" }
    ]
  };

  const codolioStats = {
    globalRating: 1642,
    problemsSolved: 312,
    activeDays: 142,
    ranking: "Top 8%",
    recentSubmissions: [
      { title: "Binary Tree Level Order Traversal", diff: "Medium", status: "Accepted" },
      { title: "Longest Palindromic Substring", diff: "Medium", status: "Accepted" },
      { title: "Edit Distance", diff: "Hard", status: "Accepted" },
      { title: "Two Sum", diff: "Easy", status: "Accepted" }
    ]
  };

  return (
    <div className="space-y-10 font-sans" id="coding-profiles">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs text-purple-400 font-mono uppercase tracking-widest block font-bold">
          LIVE TELEMETRY
        </span>
        <h2 
          style={{ fontSize: "clamp(1.5rem, 3.5vw, 3.5rem)" }} 
          className="font-bold tracking-tight text-white font-display"
        >
          Coding Profiles & Activity
        </h2>
        <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
          Aggregating and parsing continuous development metrics across open source, algorithmic challenges, and professional networking nodes.
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
              <span className="text-xs font-bold font-display">GitHub Workspace</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
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
              <Code className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold font-display">Codolio Profile</span>
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
              <span className="text-xs font-bold font-display">LinkedIn Connect</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Right Side Details Frame */}
        <div className="lg:col-span-9">
          {activeTab === 'github' && (
            <div className="glass-card p-6 md:p-8 rounded-2xl space-y-6">
              
              {/* GitHub Metrics Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-850 flex items-center justify-center">
                    <Github className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-display leading-none">@codesbysayam</h3>
                    <p className="text-[10px] text-zinc-500 font-mono mt-1">Sayam Mukherjee • Open Source Node</p>
                  </div>
                </div>

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

              {/* Grid statistics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl text-center">
                  <span className="text-[9px] text-zinc-500 uppercase font-mono block">COMMITS THIS YEAR</span>
                  <span className="text-xl font-bold text-emerald-400 block mt-1 font-display">{githubStats.commitsThisYear}</span>
                </div>
                <div className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl text-center">
                  <span className="text-[9px] text-zinc-500 uppercase font-mono block">REPOSITORIES</span>
                  <span className="text-xl font-bold text-white block mt-1 font-display">{githubStats.repositories}</span>
                </div>
                <div className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl text-center">
                  <span className="text-[9px] text-zinc-500 uppercase font-mono block">STARS GAINED</span>
                  <span className="text-xl font-bold text-yellow-400 block mt-1 font-display">{githubStats.stars}</span>
                </div>
                <div className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl text-center">
                  <span className="text-[9px] text-zinc-500 uppercase font-mono block">FOLLOWERS</span>
                  <span className="text-xl font-bold text-cyan-400 block mt-1 font-display">{githubStats.followers}</span>
                </div>
              </div>

              {/* Pinned Repos and Language splits */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                
                {/* Repositories columns */}
                <div className="md:col-span-7 space-y-4">
                  <span className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider block">PINNED ECOSYSTEM CODEPORTS</span>
                  
                  <div className="space-y-3">
                    {githubStats.pinnedRepos.map((repo, idx) => (
                      <div key={idx} className="bg-zinc-950/50 border border-zinc-900/80 p-4 rounded-xl space-y-2 hover:border-purple-500/20 transition-all">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-purple-400" />
                            {repo.name}
                          </h4>
                          <span className="text-[9px] font-mono bg-zinc-900 text-zinc-500 px-2 py-0.5 rounded border border-zinc-850">
                            {repo.lang}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-normal">{repo.desc}</p>
                        
                        <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-mono pt-1">
                          <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500" /> {repo.stars} stars</span>
                          <span className="flex items-center gap-1"><GitCommit className="w-3 h-3 text-purple-500" /> {repo.forks} forks</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* D3.js Language Ring Chart */}
                <div className="md:col-span-5 bg-zinc-950/50 border border-zinc-900/80 p-5 rounded-2xl">
                  <LanguageRingChart showLegend={true} />
                </div>

              </div>

              {/* Live D3 GitHub Heatmap representation */}
              <div className="pt-2">
                <GitHubActivityHeatmap username="codesbysayam" />
              </div>

            </div>
          )}

          {activeTab === 'codolio' && (
            <div className="glass-card p-6 md:p-8 rounded-2xl space-y-6">
              
              {/* LeetCode Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-850 flex items-center justify-center">
                    <Code className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-display leading-none">Codolio Coding Activity</h3>
                    <p className="text-[10px] text-zinc-500 font-mono mt-1">Continuous algorithm parsing registry</p>
                  </div>
                </div>

                <a 
                  href="https://codolio.com/profile/codesbysayam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <span>Open Live Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Codolio key statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl text-center">
                  <span className="text-[9px] text-zinc-500 uppercase font-mono block">CODLIO GLOBAL SCORE</span>
                  <span className="text-xl font-bold text-cyan-400 block mt-1 font-display">{codolioStats.globalRating}</span>
                </div>
                <div className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl text-center">
                  <span className="text-[9px] text-zinc-500 uppercase font-mono block">PROBLEMS SOLVED (ALGORITHMS)</span>
                  <span className="text-xl font-bold text-white block mt-1 font-display">{codolioStats.problemsSolved} / 500</span>
                </div>
                <div className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl text-center">
                  <span className="text-[9px] text-zinc-500 uppercase font-mono block">DAILY ACTIVE STREAK</span>
                  <span className="text-xl font-bold text-purple-400 block mt-1 font-display">{codolioStats.activeDays} Days</span>
                </div>
              </div>

              {/* Recent algorithm solutions logs */}
              <div className="space-y-4">
                <span className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider block">RECENT ACCEPTED TRANSACTIONS</span>
                
                <div className="space-y-2">
                  {codolioStats.recentSubmissions.map((sub, idx) => (
                    <div key={idx} className="bg-zinc-950/50 border border-zinc-900 p-3.5 rounded-xl flex justify-between items-center text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-zinc-200 font-bold">{sub.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[9px] font-bold border px-2 py-0.5 rounded-full ${
                          sub.diff === "Easy" 
                            ? "bg-emerald-950/40 border-emerald-800/40 text-emerald-400" 
                            : sub.diff === "Medium"
                            ? "bg-amber-950/40 border-amber-800/40 text-amber-400"
                            : "bg-red-950/40 border-red-800/40 text-red-400"
                        }`}>
                          {sub.diff}
                        </span>
                        <span className="text-emerald-400 font-bold uppercase text-[9px]">ACCEPTED</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Future-ready list */}
              <div className="bg-zinc-900/20 border border-zinc-900 p-4 rounded-xl">
                <span className="text-[9px] font-mono text-zinc-500 uppercase block mb-2">TARGET ALGORITHMIC PLATFORMS (Q4 2026)</span>
                <div className="flex flex-wrap gap-2 text-xs font-mono text-zinc-400">
                  <span className="bg-zinc-950 border border-zinc-900 px-3 py-1 rounded-lg">Codeforces</span>
                  <span className="bg-zinc-950 border border-zinc-900 px-3 py-1 rounded-lg">HackerRank</span>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'linkedin' && (
            <div className="glass-card p-6 md:p-8 rounded-2xl space-y-6">
              
              {/* LinkedIn Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-850 flex items-center justify-center">
                    <Linkedin className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-display leading-none">Professional Network Connection</h3>
                    <p className="text-[10px] text-zinc-500 font-mono mt-1">LinkedIn Profile Hub • Sayam Mukherjee</p>
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
                    I actively publish technical post breakdowns, summaries of deep learning algorithms studied, project previews, and freelancing accomplishments directly to my LinkedIn connection feed.
                  </p>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Whether you are an engineering professor, professional researcher, digital content producer, or fellow undergraduate, I am always excited to discuss software innovations.
                  </p>
                </div>

                <div className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl space-y-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 font-mono block uppercase">TARGET CONNECTIONS</span>
                    <ul className="space-y-1.5 mt-2.5 text-xs text-zinc-300">
                      <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-purple-400 shrink-0" /> AI Research Teams</li>
                      <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-cyan-400 shrink-0" /> Web Engineering Leads</li>
                      <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-emerald-400 shrink-0" /> Freelance Content Partners</li>
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
