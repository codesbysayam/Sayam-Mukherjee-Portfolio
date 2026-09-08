import React from "react";
import { 
  Github, ExternalLink, Code2, Linkedin, Terminal, ArrowUpRight 
} from "lucide-react";

interface ProfileItem {
  platform: string;
  username: string;
  url: string;
  focus: string;
  description: string;
  icon: React.ElementType;
}

const PROFILES: ProfileItem[] = [
  {
    platform: "GitHub",
    username: "@codesbysayam",
    url: "https://github.com/codesbysayam",
    focus: "Code Repositories & OSS",
    description: "Primary public repositories, real commit histories, and deployment configurations across production full-stack systems.",
    icon: Github
  },
  {
    platform: "LeetCode",
    username: "@codesbysayam",
    url: "https://leetcode.com/u/codesbysayam/",
    focus: "DSA & Algorithmic Practice",
    description: "Systematic algorithmic solutions implemented in C++, focusing on memory efficiency and optimal recurrence relations.",
    icon: Code2
  },
  {
    platform: "Codolio",
    username: "codesbysayam",
    url: "https://codolio.com/profile/codesbysayam",
    focus: "Competitive Programming Hub",
    description: "Verified multi-platform competitive programming aggregator tracking problem solving progress and contest activities.",
    icon: Terminal
  },
  {
    platform: "LinkedIn",
    username: "Sayam Mukherjee",
    url: "https://www.linkedin.com/in/sayam-mukherjee-b96209324/",
    focus: "Professional & Academic Network",
    description: "B.Tech CSE (AI & ML) student profile at KIIT University (2024–2028). Research milestones and career collaborations.",
    icon: Linkedin
  }
];

export function CodingProfilesSection() {
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.14em] text-cyan-400">
            08 — CODING PROFILES
          </span>
          <span className="h-px w-12 bg-zinc-800" />
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            Verified Platforms
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white font-display">
            External Profiles &amp; Verification
          </h2>
          <span className="text-xs font-mono text-zinc-500">
            Direct profile links · Zero fabricated ratings
          </span>
        </div>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl font-sans">
          Direct access to public code repositories, algorithmic records, and academic background on official external services.
        </p>
      </div>

      {/* Profile Cards Grid (2x2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {PROFILES.map((profile) => {
          const IconComp = profile.icon;

          return (
            <a
              key={profile.platform}
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl bg-zinc-950/40 border border-zinc-850 hover:border-zinc-750 transition-all duration-200 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header: Icon, Platform name, handle, arrow */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center justify-center shrink-0 group-hover:text-white transition-colors">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white font-display group-hover:text-cyan-300 transition-colors">
                        {profile.platform}
                      </h3>
                      <span className="text-xs font-mono text-zinc-500">
                        {profile.username}
                      </span>
                    </div>
                  </div>

                  <span className="text-zinc-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                  {profile.description}
                </p>
              </div>

              {/* Sub-label */}
              <div className="pt-2 border-t border-zinc-850/80 flex items-center justify-between text-xs font-mono text-zinc-500">
                <span>{profile.focus}</span>
                <span className="text-zinc-400 group-hover:text-zinc-200 transition-colors">
                  Open profile ↗
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default CodingProfilesSection;
