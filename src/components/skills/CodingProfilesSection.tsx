import React from "react";
import { 
  Github, ExternalLink, Code2, ShieldCheck, 
  Linkedin, Terminal, CheckCircle2, ArrowUpRight 
} from "lucide-react";

interface ProfileItem {
  platform: string;
  username: string;
  url: string;
  badge: string;
  badgeColor: string;
  description: string;
  verifiedDetails: string[];
  buttonText: string;
  icon: React.ElementType;
}

const PROFILES: ProfileItem[] = [
  {
    platform: "GitHub",
    username: "@codesbysayam",
    url: "https://github.com/codesbysayam",
    badge: "PUBLIC REPOSITORIES",
    badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    description: "Open-source projects, system orchestration codebases, and production application repositories.",
    verifiedDetails: [
      "4 Public Codebases (Operon, MAUSAM, SayamSolves, Portfolio)",
      "Primary Codebase Volume: TypeScript & JavaScript",
      "Public git commits & verifiable release histories"
    ],
    buttonText: "Open GitHub Profile",
    icon: Github
  },
  {
    platform: "LeetCode",
    username: "@codesbysayam",
    url: "https://leetcode.com/u/codesbysayam/",
    badge: "DSA & PROBLEM SOLVING",
    badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    description: "Algorithmic practice focusing on time complexity, data structures, and edge-case testing in C++.",
    verifiedDetails: [
      "Verified Solved Problems: 4 fundamental solutions",
      "Focus: Arrays, String Hashing & Optimal Recurrence",
      "Deliberate practice over superficial grind"
    ],
    buttonText: "Verify on LeetCode",
    icon: Code2
  },
  {
    platform: "Codolio",
    username: "codesbysayam",
    url: "https://codolio.com/profile/codesbysayam",
    badge: "DEVELOPER PROFILE",
    badgeColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    description: "Multi-platform competitive programming aggregator and engineering portfolio presence.",
    verifiedDetails: [
      "Live telemetry unavailable without proprietary session keys",
      "Aggregates cross-platform coding metrics and contest participation",
      "Direct verification on official platform"
    ],
    buttonText: "Open Codolio Profile",
    icon: Terminal
  },
  {
    platform: "LinkedIn",
    username: "Sayam Mukherjee",
    url: "https://www.linkedin.com/in/sayam-mukherjee-b96209324/",
    badge: "PROFESSIONAL NETWORK",
    badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    description: "Professional networking, academic milestones at KIIT University, and career collaborations.",
    verifiedDetails: [
      "B.Tech CSE (AI & ML) student at KIIT University (2024–2028)",
      "Certified in Python, Machine Learning & Web Architecture",
      "Available for internships and engineering hackathons"
    ],
    buttonText: "Connect on LinkedIn",
    icon: Linkedin
  }
];

export function CodingProfilesSection() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-850 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase font-semibold">
              EXTERNAL VERIFICATION
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span className="text-[11px] font-mono text-zinc-500">
              4 OFFICIAL PROFILES
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            CODING &amp; PROFESSIONAL PROFILES
          </h2>
        </div>
        <p className="text-xs text-zinc-400 font-mono">
          Authentic links · No fabricated ranking metrics
        </p>
      </div>

      {/* Profiles 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROFILES.map((profile) => {
          const IconComp = profile.icon;

          return (
            <div
              key={profile.platform}
              className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-850 hover:border-zinc-750 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Top Row: Icon, Platform, Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 flex items-center justify-center shrink-0">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white leading-tight">
                        {profile.platform}
                      </h3>
                      <span className="text-xs font-mono text-zinc-400">
                        {profile.username}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold border ${profile.badgeColor}`}
                  >
                    {profile.badge}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {profile.description}
                </p>

                {/* Verified Bullet Points */}
                <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-850 space-y-1.5">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block font-semibold">
                    Verified Baseline:
                  </span>
                  <ul className="space-y-1">
                    {profile.verifiedDetails.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-zinc-300 flex items-start gap-1.5 leading-snug"
                      >
                        <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <a
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-xs font-mono text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer group"
                >
                  <span>{profile.buttonText}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CodingProfilesSection;
