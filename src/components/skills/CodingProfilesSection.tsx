import React from "react";
import { Github, Code2, Linkedin, Terminal, ArrowUpRight } from "lucide-react";
import { EditorialReveal, StaggerGroup, StaggerItem } from "../../motion/Reveal";

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
    url: "https://www.linkedin.com/in/sayammukherjee-portfolio/",
    focus: "Professional & Academic Network",
    description: "B.Tech CSE (AI & ML) student profile at KIIT University. Research milestones and career collaborations.",
    icon: Linkedin
  }
];

export function CodingProfilesSection() {
  return (
    <section id="coding-profiles" className="space-y-6">
      <EditorialReveal className="space-y-2">
        <div className="flex items-center gap-2.5 text-xs font-mono text-[var(--text-muted)]">
          <span className="font-semibold uppercase tracking-wider text-[var(--accent)]">
            Coding Profiles
          </span>
          <span aria-hidden="true">/</span>
          <span>Verified Platforms</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)] font-display">
            External Profiles &amp; Verification
          </h2>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            Direct profile links · Zero fabricated ratings
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl font-sans leading-relaxed">
          Direct access to public code repositories, algorithmic records, and academic background on official external platforms.
        </p>
      </EditorialReveal>

      <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROFILES.map((profile) => {
          const IconComp = profile.icon;

          return (
            <StaggerItem key={profile.platform}>
            <a
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card card-interactive p-5 h-full group flex flex-col justify-between space-y-4 hover:border-[var(--accent)] active:scale-[0.985] active:border-[var(--accent)] transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-[6px] bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] flex items-center justify-center shrink-0 group-hover:border-[var(--accent)] transition-colors">
                      <IconComp className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[var(--text)] font-display group-hover:text-[var(--accent)] transition-colors">
                        {profile.platform}
                      </h3>
                      <span className="text-xs font-mono text-[var(--text-muted)]">{profile.username}</span>
                    </div>
                  </div>

                  <span className="text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </span>
                </div>

                <p className="text-xs sm:text-[13px] text-[var(--text-secondary)] leading-relaxed font-sans">
                  {profile.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                <span>{profile.focus}</span>
                <span className="text-[var(--text)] font-semibold group-hover:text-[var(--accent)]">
                  Open profile ↗
                </span>
              </div>
            </a>
            </StaggerItem>
          );
        })}
      </StaggerGroup>
    </section>
  );
}

export default CodingProfilesSection;
