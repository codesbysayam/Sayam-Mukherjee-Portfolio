import React from "react";
import { Terminal, Layout, Brain, Cpu, CheckCircle2 } from "lucide-react";

interface DevelopingArea {
  area: "Advanced DSA" | "React" | "AI / ML" | "System Architecture";
  status: "LEARNING" | "PRACTICING" | "BUILDING" | "EXPLORING";
  description: string;
  context: string;
  icon: React.ReactNode;
}

const CURRENTLY_DEVELOPING_DATA: DevelopingArea[] = [
  {
    area: "Advanced DSA",
    status: "PRACTICING",
    description: "C++ LeetCode implementations synced via LeetHub V2 (3 repo files: LC 0005, 0033, 0115; 4 LC solved baseline).",
    context: "Focus on string DP, rotated binary search, graph traversals, and asymptotic performance.",
    icon: <Terminal className="w-4 h-4 text-[var(--accent)]" />
  },
  {
    area: "React",
    status: "BUILDING",
    description: "Production Next.js 15 / React 19 & Vite interfaces, KaTeX + D3.js visualizations, and zero-layout-shift UI systems.",
    context: "Active work across Mausam (mausam_sample), SightForge Canvas, Memory in Motion, and CampusConnect.",
    icon: <Layout className="w-4 h-4 text-[var(--accent)]" />
  },
  {
    area: "AI / ML",
    status: "EXPLORING",
    description: "YOLOv8 person & 17-keypoint pose detection with ByteTrack (SightForge) and O(1) Hebbian fast-weight interpretability.",
    context: "Building FastAPI + Next.js computer vision pipelines and interactive BDH research visualizations.",
    icon: <Brain className="w-4 h-4 text-[var(--accent)]" />
  },
  {
    area: "System Architecture",
    status: "LEARNING",
    description: "Multi-agent HITL coordination, policy control planes, sandbox simulation, and tamper-evident audit chains.",
    context: "Developing Operon and AXIOM governance protocols, approval gates, and resilient API routing.",
    icon: <Cpu className="w-4 h-4 text-[var(--accent)]" />
  }
];

export function CurrentlyDeveloping() {
  return (
    <section id="currently-developing" className="space-y-6">
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
            09 · CURRENTLY DEVELOPING
          </span>
          <span className="h-px w-8 bg-[var(--border)]" />
          <span className="text-[11px] font-mono text-[var(--text-faint)] uppercase tracking-wider hidden sm:inline">
            Active Focus Areas
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)] font-display">
            Currently Developing
          </h2>
          <span className="text-[11px] font-mono text-[var(--text-faint)]">
            Qualitative Indicators Only · Zero Percentages
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl font-sans leading-relaxed">
          Active technical focus areas. Grounded in genuine daily practice, current codebase builds, and engineering studies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {CURRENTLY_DEVELOPING_DATA.map((item) => (
          <div
            key={item.area}
            className="card p-4 sm:p-5 flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-[6px] bg-[var(--surface)] border border-[var(--border)]">
                    {item.icon}
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-[var(--text)] font-display">
                    {item.area}
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-[var(--accent)]">
                  {item.status}
                </span>
              </div>

              <p className="text-xs sm:text-[13px] text-[var(--text-secondary)] leading-relaxed font-sans">
                {item.description}
              </p>
            </div>

            <div className="pt-2.5 border-t border-[var(--border)] text-[11px] font-mono text-[var(--text-muted)]">
              {item.context}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-0.5 flex items-center gap-2 text-[11px] font-mono text-[var(--text-faint)]">
        <CheckCircle2 className="w-3 h-3 text-[var(--success)] shrink-0" />
        <span>Grounded in qualitative active states (LEARNING, PRACTICING, BUILDING, EXPLORING). No synthetic completion bars.</span>
      </div>
    </section>
  );
}

export default CurrentlyDeveloping;
