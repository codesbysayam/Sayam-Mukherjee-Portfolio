import React, { useState } from "react";
import { ExternalLink, Github, ArrowUpRight, Filter, ArrowRight } from "lucide-react";
import { EditorialReveal, StaggerGroup, StaggerItem } from "../../motion/Reveal";

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
}

export function SkillProjectEvidence({ onSelectProject }: SkillProjectEvidenceProps) {
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string | null>(null);

  const keySkills = [
    "TypeScript", "React", "Next.js 15", "Next.js", "FastAPI", "Python",
    "YOLOv8", "ByteTrack", "KaTeX", "PostgreSQL", "Vitest", "Node.js", "C++"
  ];

  const filteredRows = selectedSkillFilter
    ? PROJECT_EVIDENCE_DATA.filter((r) =>
        (r.skills || []).some(
          (s) => s.toLowerCase() === selectedSkillFilter.toLowerCase()
        )
      )
    : PROJECT_EVIDENCE_DATA;

  return (
    <section id="skill-evidence" className="space-y-6">
      {/* Section Header */}
      <EditorialReveal className="space-y-2">
        <div className="flex items-center gap-2.5 text-xs font-mono text-[var(--text-muted)]">
          <span className="font-semibold uppercase tracking-wider text-[var(--accent)]">
            Project Evidence
          </span>
          <span aria-hidden="true">/</span>
          <span>{PROJECT_EVIDENCE_DATA.length} Verified Projects</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)] font-display">
            Skill Application &amp; Evidence Matrix
          </h2>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            Skill → Project → Evidence
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl font-sans leading-relaxed">
          How engineering capabilities translate directly into verified production repositories and documented system designs.
        </p>
      </EditorialReveal>

      {/* Filter Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-mono">
        <span className="text-[var(--text-muted)] flex items-center gap-1 shrink-0 mr-1">
          <Filter className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Filter:</span>
        </span>

        <button
          type="button"
          onClick={() => setSelectedSkillFilter(null)}
          className={`btn !min-h-[36px] !py-1 !px-3 !text-xs active:scale-[0.97] ${
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
            className={`btn !min-h-[36px] !py-1 !px-3 !text-xs whitespace-nowrap active:scale-[0.97] ${
              selectedSkillFilter === skill ? "btn-primary" : "btn-secondary"
            }`}
          >
            {skill}
          </button>
        ))}
      </div>

      {/* Relationship Matrix */}
      <StaggerGroup key={selectedSkillFilter || "all"} className="space-y-3.5">
        {filteredRows.map((row) => (
          <StaggerItem
            key={row.id}
            className="card p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5 transition-colors hover:border-[var(--border-strong)]"
          >
            {/* Column 1: SKILL STACK */}
            <div className="lg:w-1/4 space-y-1.5 shrink-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold block">
                Skills Applied
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(row.skills || []).map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded-[4px] text-xs font-mono bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="hidden lg:flex items-center text-[var(--text-muted)] shrink-0">
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </div>

            {/* Column 2: VERIFIED PROJECT */}
            <div className="lg:w-1/4 space-y-1 shrink-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold block">
                Verified Project
              </span>
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-[var(--text)] font-display">
                  {row.projectTitle}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] font-sans">
                  {row.projectSubtitle}
                </p>
                <span className="inline-block text-[11px] font-mono text-[var(--accent)] font-semibold pt-0.5">
                  {row.statusBadge}
                </span>
              </div>
            </div>

            <div className="hidden lg:flex items-center text-[var(--text-muted)] shrink-0">
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </div>

            {/* Column 3: ARCHITECTURAL EVIDENCE */}
            <div className="lg:w-2/5 flex flex-col justify-between space-y-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold block">
                  Architectural Evidence
                </span>
                <p className="text-xs sm:text-[13px] text-[var(--text-secondary)] leading-relaxed font-sans">
                  {row.evidence}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-0.5 flex-wrap">
                {row.githubUrl && (
                  <a
                    href={row.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary !min-h-[36px] !py-1.5 !px-3 !text-xs"
                    title="View GitHub Repository"
                  >
                    <Github className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Repository</span>
                  </a>
                )}
                {row.liveUrl && (
                  <a
                    href={row.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary !min-h-[36px] !py-1.5 !px-3 !text-xs"
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
                    className="btn btn-primary !min-h-[36px] !py-1.5 !px-3 !text-xs"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}

export default SkillProjectEvidence;
