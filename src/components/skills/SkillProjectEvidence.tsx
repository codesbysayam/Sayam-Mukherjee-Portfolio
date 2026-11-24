import React, { useState, useEffect } from "react";
import { ExternalLink, Github, ArrowUpRight, Filter } from "lucide-react";
import { StaggerGroup, StaggerItem } from "../../motion/Reveal";
import { PinnedHeadingSection } from "../motion/PinnedHeadingSection";
import { requestScrollTriggerRefresh } from "../../motion/gsapRegistry";

interface EvidenceRow {
  id: string;
  projectTitle: string;
  projectSubtitle: string;
  skills: string[];
  evidence: string;
  githubUrl?: string;
  liveUrl?: string;
  statusBadge: string;
}

const PROJECT_EVIDENCE_DATA: EvidenceRow[] = [
  {
    id: "operon",
    projectTitle: "OPERON",
    projectSubtitle: "Multi-Agent Operations Platform",
    skills: ["TypeScript", "React", "Node.js", "Express.js", "Multi-Agent AI", "Tailwind CSS"],
    evidence: "Architected Support, Finance, HR & Ops agents with deterministic Human-in-the-Loop (HITL) approval gates and audit logging (Deploy or Die, Team NEXUS).",
    githubUrl: "https://github.com/codesbysayam/Operon",
    liveUrl: "https://operonpro.vercel.app",
    statusBadge: "Live · Deploy or Die"
  },
  {
    id: "mausam",
    projectTitle: "MAUSAM",
    projectSubtitle: "Weather Intelligence (SIH 2026)",
    skills: ["TypeScript", "React", "Python", "Tailwind CSS", "Weather APIs", "PLpgSQL"],
    evidence: "Unified Doppler nowcasting, SACHET/NDMA alerts, CPCB NAQI, INCOIS marine state, and Ask MAUSAM in active repo codesbysayam/mausam_sih-26 (alongside SIH snapshot mausam_sample).",
    githubUrl: "https://github.com/codesbysayam/mausam_sih-26",
    liveUrl: "https://mausamgovt.vercel.app",
    statusBadge: "Live · SIH 2026"
  },
  {
    id: "sightforge",
    projectTitle: "SIGHTFORGE",
    projectSubtitle: "Dual-Service YOLOv8 & ByteTrack CV",
    skills: ["Next.js 15", "React 19", "TypeScript", "FastAPI", "Python", "YOLOv8", "ByteTrack", "PostgreSQL"],
    evidence: "Dual-service CV platform pairing a 16:9 HTML5 Canvas client with FastAPI YOLOv8 COCO Class ID 0, 17-keypoint pose, IoU 0.45 NMS, ByteTrack, and PostgreSQL (self-hosted, no public live URL).",
    githubUrl: "https://github.com/codesbysayam/SightForge",
    statusBadge: "Open Source · Dual-Service"
  },
  {
    id: "memory-in-motion",
    projectTitle: "MEMORY IN MOTION",
    projectSubtitle: "Interactive Mechanistic Lab (IIT KGP)",
    skills: ["TypeScript", "React", "KaTeX", "D3.js", "Python", "Tailwind CSS"],
    evidence: "DataForge 2026 interactive lab with Team ALGNITE contrasting O(1) recurrent state, Hebbian fast weights & Dragon Hatchling (BDH) against O(T) KV caches.",
    githubUrl: "https://github.com/codesbysayam/Memory-in-Motion",
    liveUrl: "https://memoryinmotion.vercel.app",
    statusBadge: "Live · IIT KGP DataForge"
  },
  {
    id: "axiom",
    projectTitle: "AXIOM",
    projectSubtitle: "Autonomous Operations Control Plane",
    skills: ["TypeScript", "React", "Policy Engine", "Audit Chain", "CSS"],
    evidence: "Built in 36h at WCC Launchpad 30 (Team ALGNITE) with policy rules, approval gates, dry-run sandboxes, failure recovery, and tamper-evident audit structures.",
    githubUrl: "https://github.com/codesbysayam/AXIOM",
    liveUrl: "https://axiomwcc.vercel.app",
    statusBadge: "Live · WCC Launchpad 30"
  },
  {
    id: "inkloom",
    projectTitle: "INKLOOM",
    projectSubtitle: "Constructed AI Identity Workspace (Fork)",
    skills: ["TypeScript", "React", "PLpgSQL", "Docker", "CSS"],
    evidence: "Public fork (isFork: true, default branch: master) exploring constructed typography/symbol marks, lockups & clear-space rules; specialized models under active construction.",
    githubUrl: "https://github.com/codesbysayam/inkloom",
    liveUrl: "https://inkloom.art",
    statusBadge: "Early Access · Fork (master)"
  },
  {
    id: "campus-connect",
    projectTitle: "CAMPUS CONNECT",
    projectSubtitle: "Event Discovery & Organizer Console",
    skills: ["Next.js", "TypeScript", "React", "Vitest", "Tailwind CSS"],
    evidence: "Full-stack Next.js event discovery/registration and organizer CRUD dashboard verified with Vitest; uses README-disclosed seeded in-memory storage (resets on restart).",
    githubUrl: "https://github.com/codesbysayam/CAMPUSCONNECT_1273",
    liveUrl: "https://campusconnect1273.vercel.app/",
    statusBadge: "Live · Demo Deployed"
  },
  {
    id: "sayam-solves",
    projectTitle: "SAYAMSOLVES",
    projectSubtitle: "C++ DSA & LeetHub V2 Repository",
    skills: ["C++", "DSA", "Algorithms", "LeetHub V2"],
    evidence: "LeetHub V2 synced C++ archive tracking 3 committed solution files in stats.json (LC 0005, 0033, 0115) alongside a verified 4-problem LeetCode baseline.",
    githubUrl: "https://github.com/codesbysayam/sayam-solves",
    statusBadge: "Active · 3 Repo / 4 LC"
  }
];

interface SkillProjectEvidenceProps {
  onSelectProject?: (projectId: string) => void;
  selectedSkillFilter?: string | null;
  onSkillFilterChange?: (skill: string | null) => void;
}

export function SkillProjectEvidence({
  onSelectProject,
  selectedSkillFilter: controlledFilter,
  onSkillFilterChange,
}: SkillProjectEvidenceProps) {
  const [internalFilter, setInternalFilter] = useState<string | null>(null);
  const selectedSkillFilter =
    controlledFilter !== undefined ? controlledFilter : internalFilter;

  const setSelectedSkillFilter = (next: string | null) => {
    setInternalFilter(next);
    onSkillFilterChange?.(next);
  };

  const keySkills = [
    "TypeScript", "React", "Next.js 15", "Next.js", "FastAPI", "Python",
    "YOLOv8", "ByteTrack", "KaTeX", "PostgreSQL", "Vitest", "Node.js", "C++"
  ];

  const filteredRows = selectedSkillFilter
    ? PROJECT_EVIDENCE_DATA.filter((r) => {
        const needle = selectedSkillFilter.toLowerCase();
        return (
          (r.skills || []).some(
            (s) => s.toLowerCase() === needle || s.toLowerCase().includes(needle) || needle.includes(s.toLowerCase())
          ) ||
          r.evidence.toLowerCase().includes(needle)
        );
      })
    : PROJECT_EVIDENCE_DATA;

  useEffect(() => {
    requestScrollTriggerRefresh(90);
  }, [selectedSkillFilter]);

  return (
    <PinnedHeadingSection
      id="skill-evidence"
      heading={
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 text-xs font-mono text-[var(--text-muted)]">
              <span className="font-semibold uppercase tracking-wider text-[var(--accent)]">
                Project Evidence
              </span>
              <span aria-hidden="true">/</span>
              <span>{filteredRows.length} of {PROJECT_EVIDENCE_DATA.length} Verified Projects</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)] font-display leading-tight">
              Skill Application &amp;{" "}
              <span className="font-serif-editorial italic font-normal text-[var(--accent)]">
                Evidence Matrix
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans leading-relaxed max-w-md">
              How engineering capabilities translate directly into verified production repositories and documented system designs.
            </p>
          </div>

          {/* Filter Row (Pinned alongside rows on lg+) */}
          <div className="space-y-2.5 pt-3 border-t border-[var(--border)]">
            <span className="text-[11px] font-mono text-[var(--text-muted)] flex items-center gap-1.5 uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
              <span>Filter by Capability</span>
            </span>

            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => setSelectedSkillFilter(null)}
                className={`btn !min-h-[44px] sm:!min-h-[36px] !py-1 !px-2.5 !text-xs active:scale-[0.97] ${
                  selectedSkillFilter === null ? "btn-primary" : "btn-secondary"
                }`}
              >
                All ({PROJECT_EVIDENCE_DATA.length})
              </button>

              {keySkills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => setSelectedSkillFilter(selectedSkillFilter === skill ? null : skill)}
                  className={`btn !min-h-[44px] sm:!min-h-[36px] !py-1 !px-2.5 !text-xs whitespace-nowrap active:scale-[0.97] ${
                    selectedSkillFilter === skill ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>
      }
    >
      {filteredRows.length === 0 ? (
        <div className="card p-6 sm:p-8 text-center space-y-3">
          <p className="text-sm font-semibold text-[var(--text)] font-display">
            No standalone shipped project card directly matched &ldquo;{selectedSkillFilter}&rdquo;
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            This foundation supports academic coursework or underlying tooling across the workspace.
          </p>
          <button
            type="button"
            onClick={() => setSelectedSkillFilter(null)}
            className="btn btn-secondary !min-h-[44px] sm:!min-h-[38px] !py-1.5 !px-3 !text-xs font-mono"
          >
            Show All Verified Projects
          </button>
        </div>
      ) : (
      <StaggerGroup key={selectedSkillFilter || "all"} immediate className="space-y-4">
        {filteredRows.map((row) => (
          <StaggerItem
            key={row.id}
            className="card p-5 sm:p-6 space-y-4 transition-colors hover:border-[var(--border-strong)]"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-[var(--border)]">
              <div className="space-y-0.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                  <span className="text-[var(--accent)] font-semibold uppercase tracking-wider">
                    {row.statusBadge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[var(--text)] font-display">
                  {row.projectTitle}
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-sans">
                  {row.projectSubtitle}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap shrink-0">
                {row.githubUrl && (
                  <a
                    href={row.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary !min-h-[44px] sm:!min-h-[38px] !py-1.5 !px-3 !text-xs"
                    title="View GitHub Repository"
                  >
                    <Github className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Repo</span>
                  </a>
                )}
                {row.liveUrl && (
                  <a
                    href={row.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary !min-h-[44px] sm:!min-h-[38px] !py-1.5 !px-3 !text-xs"
                    title="Open Live Deployment"
                  >
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Live</span>
                  </a>
                )}
                {onSelectProject && (
                  <button
                    type="button"
                    onClick={() => onSelectProject(row.id)}
                    className="btn btn-primary !min-h-[44px] sm:!min-h-[38px] !py-1.5 !px-3 !text-xs"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
              {row.evidence}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {(row.skills || []).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSkillFilter(selectedSkillFilter === s ? null : s)}
                  className={`min-h-[34px] [@media(pointer:coarse)]:min-h-[44px] px-2.5 py-1 rounded-[4px] text-[11px] font-mono border cursor-pointer transition-colors ${
                    selectedSkillFilter?.toLowerCase() === s.toLowerCase()
                      ? "bg-[var(--accent-fill)] text-[var(--accent-contrast)] border-[var(--accent-fill)] font-semibold"
                      : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>
      )}
    </PinnedHeadingSection>
  );
}

export default SkillProjectEvidence;
