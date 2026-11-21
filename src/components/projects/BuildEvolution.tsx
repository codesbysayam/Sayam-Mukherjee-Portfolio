import { memo } from "react";
import { GitBranch } from "lucide-react";
import { ProjectItem, PROJECTS } from "../../data/projects";

interface BuildEvolutionProps {
  onSelectProject?: (project: ProjectItem) => void;
}

interface EvolutionStage {
  stage: string;
  step: string;
  title: string;
  projectId: string;
  domain: string;
  narrative: string;
  tech: string[];
}

const EVOLUTION_STAGES: EvolutionStage[] = [
  {
    stage: "ALGORITHMS",
    step: "01",
    title: "SayamSolves",
    projectId: "sayam-solves",
    domain: "C++ & LeetHub V2",
    narrative:
      "Consistent C++ DSA problem solving synced via LeetHub V2 (3 repo files covering LC 0005, 0033, and 0115; 4-problem LeetCode baseline).",
    tech: ["C++", "DSA", "LeetHub V2", "Dynamic Programming"],
  },
  {
    stage: "CAMPUS WEB",
    step: "02",
    title: "CAMPUS CONNECT",
    projectId: "campus-connect",
    domain: "Next.js Event Platform",
    narrative:
      "Full-stack Next.js and TypeScript campus event discovery, registration, and organizer seat management verified with Vitest.",
    tech: ["Next.js", "TypeScript", "React", "Vitest"],
  },
  {
    stage: "CIVIC CLIMATE TECH",
    step: "03",
    title: "MAUSAM",
    projectId: "mausam",
    domain: "SIH 2026 / Team ALGNITE",
    narrative:
      "Engineered for Smart India Hackathon 2026 unifying Doppler radar nowcasting, SACHET/NDMA alerts, NAQI, INCOIS marine state, and Ask MAUSAM.",
    tech: ["TypeScript", "React", "Python", "Tailwind CSS"],
  },
  {
    stage: "MECHANISTIC LAB",
    step: "04",
    title: "MEMORY IN MOTION",
    projectId: "memory-in-motion",
    domain: "DataForge 2026 · IIT KGP",
    narrative:
      "Interactive lab comparing fixed-size O(1) recurrent states, Hebbian fast weights, and BDH against O(T) KV caches.",
    tech: ["TypeScript", "KaTeX", "D3.js", "Python"],
  },
  {
    stage: "EDGE COMPUTER VISION",
    step: "05",
    title: "SIGHTFORGE",
    projectId: "sightforge",
    domain: "YOLOv8 & ByteTrack",
    narrative:
      "Dual-service Next.js 15 + FastAPI system pairing YOLOv8 COCO-0 detection, 17-keypoint pose, IoU 0.45 NMS, ByteTrack, and atomic CVFrame rendering.",
    tech: ["Next.js 15", "FastAPI", "YOLOv8", "ByteTrack"],
  },
  {
    stage: "GENERATIVE SYSTEMS",
    step: "06",
    title: "INKLOOM",
    projectId: "inkloom",
    domain: "Public Fork (master) · Early Access",
    narrative:
      "Forked AI logo construction workspace decomposing brand constraints, typography/symbol geometry, and lockup clear-space rules.",
    tech: ["TypeScript", "PLpgSQL", "Docker", "Composition Engine"],
  },
  {
    stage: "CONTROL PLANES",
    step: "07",
    title: "AXIOM",
    projectId: "axiom",
    domain: "WCC Launchpad 30 (36h)",
    narrative:
      "Autonomous operations control plane featuring deterministic policy enforcement, approval gates, failure recovery, sandboxes, and audit chains.",
    tech: ["TypeScript", "Policy Engine", "Sandbox", "Audit Chain"],
  },
  {
    stage: "MULTI-AGENT AI",
    step: "08",
    title: "OPERON",
    projectId: "operon",
    domain: "Deploy or Die · Team NEXUS",
    narrative:
      "Lead multi-agent operations platform routing Support, Finance, HR, and Ops workflows through deterministic human-in-the-loop checkpoints.",
    tech: ["TypeScript", "Multi-Agent AI", "Node.js", "Express"],
  },
];

function BuildEvolutionComponent({ onSelectProject }: BuildEvolutionProps) {
  const handleSelect = (projectId: string) => {
    if (!onSelectProject) return;
    const match = PROJECTS.find((p) => p.id === projectId);
    if (match) onSelectProject(match);
  };

  return (
    <div className="card p-6 sm:p-7 space-y-6">
      <div className="space-y-1 border-b border-[var(--border)] pb-4">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-[var(--accent)]" />
          <h3 className="text-sm sm:text-base font-bold font-display uppercase tracking-wider text-[var(--text)]">
            BUILD EVOLUTION &amp; ARCHITECTURAL LIFECYCLE
          </h3>
        </div>
        <p className="text-xs font-sans text-[var(--text-muted)]">
          Progression across all 8 verified repositories—from C++20 DSA discipline to edge CV pipelines and human-governed multi-agent systems.
        </p>
      </div>

      <div className="space-y-3 relative">
        <div className="absolute left-[19px] top-4 bottom-4 w-px bg-[var(--border)] -z-0" />

        {EVOLUTION_STAGES.map((stage, idx) => {
          const isLast = idx === EVOLUTION_STAGES.length - 1;
          return (
            <div key={stage.step} className="relative z-10 flex items-start gap-4 group">
              <div
                className={`w-10 h-10 rounded-[8px] flex items-center justify-center font-mono text-xs font-bold shrink-0 border transition-colors tabular-nums ${
                  isLast
                    ? "bg-[#C7E34A] text-[#20231D] border-[#A9C52F]"
                    : "bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] group-hover:border-[var(--border-strong)]"
                }`}
              >
                {stage.step}
              </div>

              <button
                type="button"
                onClick={() => handleSelect(stage.projectId)}
                disabled={!onSelectProject}
                className={`flex-1 text-left p-3.5 rounded-[10px] border bg-[var(--surface)] border-[var(--border)] transition-all space-y-1.5 ${
                  onSelectProject
                    ? "hover:border-[var(--border-strong)] active:scale-[0.99] active:border-[var(--accent)] cursor-pointer"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[10px] font-mono uppercase tracking-widest font-semibold text-[var(--accent)]">
                    {stage.stage}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text-faint)]">
                    {stage.domain}
                  </span>
                </div>

                <h4 className="text-sm font-bold font-display text-[var(--text)]">
                  {stage.title}
                </h4>

                <p className="text-xs leading-relaxed font-sans text-[var(--text-muted)]">
                  {stage.narrative}
                </p>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 text-[10px] font-mono text-[var(--text-secondary)]">
                  {stage.tech.map((t, tIdx) => (
                    <span key={tIdx} className="inline-flex items-center gap-2">
                      {tIdx > 0 && <span className="text-[var(--text-faint)]" aria-hidden="true">·</span>}
                      <span>{t}</span>
                    </span>
                  ))}
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const BuildEvolution = memo(BuildEvolutionComponent);
