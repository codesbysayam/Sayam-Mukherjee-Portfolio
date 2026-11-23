import { useState, useEffect } from "react";
import {
  Github,
  Linkedin,
  ExternalLink,
  Code,
  Layers,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import GitHubStats from "./GitHubStats";
import { fetchLeetCodeStats, LeetCodeStatsData, VERIFIED_LEETCODE_FALLBACK } from "../services/leetcode";
import { fetchCodolioProfile, VERIFIED_CODOLIO_DATA } from "../services/codolio";

export default function CodingProfiles() {
  const [activeTab, setActiveTab] = useState<"github" | "leetcode" | "codolio" | "linkedin">("github");

  const [leetcodeData, setLeetcodeData] = useState<LeetCodeStatsData>(VERIFIED_LEETCODE_FALLBACK);
  const [, setCodolioData] = useState(VERIFIED_CODOLIO_DATA);
  const [, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadAllTelemetry() {
      setLoading(true);
      try {
        const [lc, cd] = await Promise.allSettled([
          fetchLeetCodeStats(),
          fetchCodolioProfile(),
        ]);

        if (isMounted) {
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
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-10 font-sans" id="coding-profiles">
      {/* Header */}
      <div className="space-y-2.5">
        <p className="text-xs font-mono font-semibold tracking-[0.14em] uppercase text-[var(--accent)]">
          Verified Telemetry · Live Proxies
        </p>
        <h2
          style={{ fontSize: "clamp(1.75rem, 3.5vw, 3.25rem)" }}
          className="font-extrabold tracking-tight text-[var(--text)] font-display"
        >
          Coding Profiles &amp;{" "}
          <span className="font-serif-editorial italic font-normal">Telemetry</span>
        </h2>
        <p className="text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
          Authentic metrics aggregated via server-side proxies from GitHub, LeetCode, and verified developer registries. Zero fabricated numbers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side Controller Tabs */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-col gap-2 card p-3">
          <button
            type="button"
            onClick={() => setActiveTab("github")}
            className={`w-full min-h-[44px] flex items-center justify-between p-3.5 rounded-[8px] border text-left transition-colors cursor-pointer ${
              activeTab === "github"
                ? "bg-[var(--accent-fill)] border-[var(--accent-fill)] text-[var(--accent-contrast)]"
                : "bg-transparent border-transparent text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Github className="w-4 h-4 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold font-display">GitHub Workspace</span>
                <span className={`text-[11px] font-mono ${activeTab === "github" ? "text-[var(--accent-contrast)]/80" : "text-[var(--text-faint)]"}`}>
                  @codesbysayam
                </span>
              </div>
            </div>
            <span className="text-[11px] font-mono font-semibold shrink-0">Live</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("leetcode")}
            className={`w-full min-h-[44px] flex items-center justify-between p-3.5 rounded-[8px] border text-left transition-colors cursor-pointer ${
              activeTab === "leetcode"
                ? "bg-[var(--accent-fill)] border-[var(--accent-fill)] text-[var(--accent-contrast)]"
                : "bg-transparent border-transparent text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Code className="w-4 h-4 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold font-display">LeetCode Challenges</span>
                <span className={`text-[11px] font-mono ${activeTab === "leetcode" ? "text-[var(--accent-contrast)]/80" : "text-[var(--text-faint)]"}`}>
                  Deliberate DSA
                </span>
              </div>
            </div>
            <span className="text-[11px] font-mono font-semibold tabular-nums shrink-0">
              {leetcodeData.totalSolved} Solved
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("codolio")}
            className={`w-full min-h-[44px] flex items-center justify-between p-3.5 rounded-[8px] border text-left transition-colors cursor-pointer group ${
              activeTab === "codolio"
                ? "bg-[var(--accent-fill)] border-[var(--accent-fill)] text-[var(--accent-contrast)]"
                : "bg-transparent border-transparent text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Layers className="w-4 h-4 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold font-display">Codolio Registry</span>
                <span className={`text-[11px] font-mono ${activeTab === "codolio" ? "text-[var(--accent-contrast)]/80" : "text-[var(--text-faint)]"}`}>
                  Verified Profile
                </span>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("linkedin")}
            className={`w-full min-h-[44px] flex items-center justify-between p-3.5 rounded-[8px] border text-left transition-colors cursor-pointer group ${
              activeTab === "linkedin"
                ? "bg-[var(--accent-fill)] border-[var(--accent-fill)] text-[var(--accent-contrast)]"
                : "bg-transparent border-transparent text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Linkedin className="w-4 h-4 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold font-display">LinkedIn Connect</span>
                <span className={`text-[11px] font-mono ${activeTab === "linkedin" ? "text-[var(--accent-contrast)]/80" : "text-[var(--text-faint)]"}`}>
                  Professional Network
                </span>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
          </button>
        </div>

        {/* Right Side Details Frame */}
        <div className="lg:col-span-9 min-w-0">
          {activeTab === "github" && (
            <div className="card p-6 md:p-8">
              <GitHubStats />
            </div>
          )}

          {activeTab === "leetcode" && (
            <div className="card p-6 md:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center">
                    <Code className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[var(--text)] font-display leading-none">
                      LeetCode Profile · @codesbysayam
                    </h3>
                    <p className="text-[11px] text-[var(--text-muted)] font-mono mt-1">
                      Deliberate algorithmic practice · Focus on mastery over volume
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-[var(--text-muted)] font-mono tabular-nums">
                    Last synced: {leetcodeData.lastSynced}
                  </span>
                  <a
                    href="https://leetcode.com/u/codesbysayam/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary min-h-[44px] px-4 py-2 text-xs"
                  >
                    <span>Verify on LeetCode</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 tabular-nums">
                <div className="bg-[var(--surface)] border border-[var(--border)] p-4 rounded-[8px] text-center">
                  <span className="text-[11px] text-[var(--text-muted)] uppercase font-mono block">
                    Total Solved
                  </span>
                  <span className="text-2xl font-bold text-[var(--text)] block mt-1 font-display">
                    {leetcodeData.totalSolved}
                  </span>
                  <span className="text-[11px] text-[var(--text-faint)] font-mono">Verified count</span>
                </div>
                <div className="bg-[var(--surface)] border border-[var(--border)] p-4 rounded-[8px] text-center">
                  <span className="text-[11px] text-[var(--text-muted)] uppercase font-mono block">
                    Easy
                  </span>
                  <span className="text-2xl font-bold text-[var(--success)] block mt-1 font-display">
                    {leetcodeData.easySolved}
                  </span>
                  <span className="text-[11px] text-[var(--text-faint)] font-mono">Foundations</span>
                </div>
                <div className="bg-[var(--surface)] border border-[var(--border)] p-4 rounded-[8px] text-center">
                  <span className="text-[11px] text-[var(--text-muted)] uppercase font-mono block">
                    Medium
                  </span>
                  <span className="text-2xl font-bold text-[var(--warning)] block mt-1 font-display">
                    {leetcodeData.mediumSolved}
                  </span>
                  <span className="text-[11px] text-[var(--text-faint)] font-mono">Intuition</span>
                </div>
                <div className="bg-[var(--surface)] border border-[var(--border)] p-4 rounded-[8px] text-center">
                  <span className="text-[11px] text-[var(--text-muted)] uppercase font-mono block">
                    Hard
                  </span>
                  <span className="text-2xl font-bold text-[var(--danger)] block mt-1 font-display">
                    {leetcodeData.hardSolved}
                  </span>
                  <span className="text-[11px] text-[var(--text-faint)] font-mono">Optimization</span>
                </div>
              </div>

              <div className="bg-[var(--surface)] border border-[var(--border)] p-4 rounded-[8px] space-y-2">
                <span className="text-[11px] font-mono uppercase text-[var(--accent)] tracking-wider font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Authentic Algorithmic Roadmap
                </span>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  &ldquo;I prioritize deep conceptual understanding over inflated problem counts. Solving problems thoroughly, analyzing pointer mechanics, memory layouts, and runtime complexity, lays the foundation for solid engineering problem-solving.&rdquo;
                </p>
              </div>

              <div className="space-y-3">
                <span className="text-[11px] font-mono uppercase text-[var(--text-muted)] tracking-wider block">
                  Recent Accepted Submissions
                </span>

                <div className="space-y-2">
                  {leetcodeData.recentSubmissions.map((sub, idx) => (
                    <div
                      key={idx}
                      className="bg-[var(--surface)] border border-[var(--border)] p-3.5 rounded-[8px] flex flex-wrap justify-between items-center gap-2 text-xs font-mono"
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0" />
                        <span className="text-[var(--text)] font-bold">{sub.title}</span>
                        {sub.lang && (
                          <span className="text-[11px] text-[var(--text-muted)]">
                            · {sub.lang}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-semibold text-[var(--text-secondary)]">
                          {sub.difficulty || "Accepted"}
                        </span>
                        <span className="text-[var(--success)] font-bold uppercase text-[11px]">
                          Accepted
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "codolio" && (
            <div className="card p-6 md:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center">
                    <Layers className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[var(--text)] font-display leading-none">
                      Codolio Developer Registry
                    </h3>
                    <p className="text-[11px] text-[var(--text-muted)] font-mono mt-1">
                      Codolio username: @codesbysayam
                    </p>
                  </div>
                </div>

                <a
                  href="https://codolio.com/profile/codesbysayam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary min-h-[44px] px-4 py-2 text-xs"
                >
                  <span>View Codolio Profile</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>

              <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-[10px] space-y-4 text-center">
                <div className="w-12 h-12 rounded-[10px] bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-6 h-6 text-[var(--accent)]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-[var(--text)] font-display">
                    Verified Codolio Developer Profile
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] font-mono">
                    Profile handle: codesbysayam
                  </p>
                </div>
                <div className="p-3 bg-[var(--surface-2)] rounded-[8px] max-w-md mx-auto border border-[var(--border)]">
                  <p className="text-xs text-[var(--text-muted)] font-mono flex items-center justify-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Live summary available directly on profile</span>
                  </p>
                </div>
                <div>
                  <a
                    href="https://codolio.com/profile/codesbysayam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary text-xs"
                  >
                    <span>Open External Profile</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === "linkedin" && (
            <div className="card p-6 md:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center">
                    <Linkedin className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[var(--text)] font-display leading-none">
                      Professional Network Connection
                    </h3>
                    <p className="text-[11px] text-[var(--text-muted)] font-mono mt-1">
                      LinkedIn Profile Hub · Sayam Mukherjee
                    </p>
                  </div>
                </div>

                <a
                  href="https://www.linkedin.com/in/sayammukherjee-portfolio/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary min-h-[44px] px-4 py-2 text-xs"
                >
                  <span>Connect on LinkedIn</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-[var(--text)] font-display">
                    Let&apos;s Connect &amp; Collaborate
                  </h4>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    I publish technical project breakdowns, computer vision research notes, and full-stack architecture insights on LinkedIn.
                  </p>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    Whether you are an engineering lead, fellow undergraduate, researcher, or open-source contributor, feel free to connect or send a message.
                  </p>
                </div>

                <div className="bg-[var(--surface)] border border-[var(--border)] p-5 rounded-[10px] space-y-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] text-[var(--accent)] font-mono font-semibold block uppercase tracking-wider">
                      Collaboration Focus
                    </span>
                    <ul className="space-y-1.5 mt-2.5 text-xs sm:text-sm text-[var(--text-secondary)] list-disc pl-4">
                      <li>AI &amp; Computer Vision Teams</li>
                      <li>Full-Stack Web Engineering Leads</li>
                      <li>Hackathon Collaborators</li>
                    </ul>
                  </div>

                  <span className="text-[11px] text-[var(--text-muted)] font-mono">
                    Open to internships &amp; applied engineering roles
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
