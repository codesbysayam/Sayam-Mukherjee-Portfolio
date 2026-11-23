import React from "react";
import { Terminal, Layout, Brain, Cpu, CheckCircle2 } from "lucide-react";
import { EditorialReveal, StaggerGroup, StaggerItem } from "../../motion/Reveal";

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
    context: "Focus on string DP, rotated binary search, graph traversals, and asymptotic performance alongside 4th Semester CSE coursework.",
    icon: <Terminal className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
  },
  {
    area: "React",
    status: "BUILDING",
    description: "Production Next.js 15 / React 19 & Vite interfaces, KaTeX + D3.js visualizations, and zero-layout-shift UI systems.",
    context: "Active work across Mausam (mausam_sih-26), SightForge Canvas, Memory in Motion, and CampusConnect.",
    icon: <Layout className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
  },
  {
    area: "AI / ML",
    status: "EXPLORING",
    description: "YOLOv8 person & 17-keypoint pose detection with ByteTrack (SightForge) and O(1) Hebbian fast-weight interpretability.",
    context: "Building FastAPI + Next.js computer vision pipelines and interactive BDH research visualizations during 2nd Year, 4th Semester.",
    icon: <Brain className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
  },
  {
    area: "System Architecture",
    status: "LEARNING",
    description: "Multi-agent HITL coordination, policy control planes, sandbox simulation, and tamper-evident audit chains.",
    context: "Developing Operon and AXIOM governance protocols, approval gates, and resilient API routing.",
    icon: <Cpu className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
  }
];

export function CurrentlyDeveloping() {
  return (
    <section id="currently-developing" className="space-y-6">
      <EditorialReveal className="space-y-1.5">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
            04 · CURRENTLY DEVELOPING
          </span>
          <span className="h-px w-8 bg-[var(--border)]" />
          <span className="text-[11px] font-mono text-[var(--text-faint)] uppercase tracking-wider hidden sm:inline">
            2nd Year, 4th Semester · Active Focus
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)] font-display">
            Currently Developing
          </h2>
          <span className="text-[11px] font-mono text-[var(--text-muted)]">
            Qualitative States Only · No Arbitrary Percentages
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl font-sans leading-relaxed">
          Active technical focus areas during B.Tech CSE (AI &amp; ML), 2nd Year, 4th Semester at KIIT University—grounded in daily practice, live repositories, and architectural study.
        </p>
      </EditorialReveal>

      <StaggerGroup stagger={0.05} className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {CURRENTLY_DEVELOPING_DATA.map((item) => (
          <StaggerItem
            key={item.area}
            className="card p-4 sm:p-5 flex flex-col justify-between space-y-3 h-full"
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
                <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-[4px] border border-[var(--border)] bg-[var(--surface)] text-[var(--accent)]">
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
          </StaggerItem>
        ))}
      </StaggerGroup>

      <div className="pt-0.5 flex items-center gap-2 text-[11px] font-mono text-[var(--text-muted)]">
        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)] shrink-0" aria-hidden="true" />
        <span>Grounded strictly in qualitative states (LEARNING, PRACTICING, BUILDING, EXPLORING). No synthetic proficiency bars.</span>
      </div>
    </section>
  );
}

export default CurrentlyDeveloping;
