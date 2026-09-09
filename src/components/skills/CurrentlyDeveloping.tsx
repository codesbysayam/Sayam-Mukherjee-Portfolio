import React from "react";
import { Terminal, Layout, Brain, Cpu, CheckCircle2 } from "lucide-react";

interface DevelopingArea {
  area: "Advanced DSA" | "React" | "AI / ML" | "System Architecture";
  status: "LEARNING" | "PRACTICING" | "BUILDING" | "EXPLORING";
  description: string;
  context: string;
  icon: React.ReactNode;
  badgeStyle: string;
}

const CURRENTLY_DEVELOPING_DATA: DevelopingArea[] = [
  {
    area: "Advanced DSA",
    status: "PRACTICING",
    description: "Daily C++ LeetCode implementations, algorithmic space-time optimization, and graph algorithms.",
    context: "Focus on dynamic programming, graph traversals, and asymptotic performance.",
    icon: <Terminal className="w-4 h-4 text-emerald-400" />,
    badgeStyle: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
  },
  {
    area: "React",
    status: "BUILDING",
    description: "Production web architectures, component composition, custom hooks, and zero-layout-shift UI systems.",
    context: "Active work across Mausam weather platform and interactive web applications.",
    icon: <Layout className="w-4 h-4 text-sky-400" />,
    badgeStyle: "text-sky-400 bg-sky-500/10 border-sky-500/30"
  },
  {
    area: "AI / ML",
    status: "EXPLORING",
    description: "Edge computer vision models with YOLOv8, PyTorch tensor workflows, and OpenCV frame processing.",
    context: "Building edge camera object detection prototypes and practical inference pipelines.",
    icon: <Brain className="w-4 h-4 text-violet-400" />,
    badgeStyle: "text-violet-400 bg-violet-500/10 border-violet-500/30"
  },
  {
    area: "System Architecture",
    status: "LEARNING",
    description: "Multi-agent autonomous coordination, deterministic state machines, and human-in-the-loop workflows.",
    context: "Developing Operon platform protocols, API routing, and system reliability boundaries.",
    icon: <Cpu className="w-4 h-4 text-cyan-400" />,
    badgeStyle: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30"
  }
];

export function CurrentlyDeveloping() {
  return (
    <section id="currently-developing" className="space-y-6">
      {/* Section Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono font-medium uppercase tracking-[0.14em] text-cyan-400">
            09 — CURRENTLY DEVELOPING
          </span>
          <span className="h-px w-8 bg-zinc-800" />
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider hidden sm:inline">
            Active Focus Areas
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white font-display">
            Currently Developing
          </h2>
          <span className="text-[11px] font-mono text-zinc-500">
            Qualitative Indicators Only · Zero Percentages
          </span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl font-sans leading-relaxed">
          Active technical focus areas. Grounded in genuine daily practice, current codebase builds, and engineering studies.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {CURRENTLY_DEVELOPING_DATA.map((item) => (
          <div
            key={item.area}
            className="p-4 sm:p-5 rounded-xl bg-zinc-950/40 border border-zinc-850 hover:border-zinc-800 transition-colors flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
                    {item.icon}
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-white font-display">
                    {item.area}
                  </h3>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-wider border ${item.badgeStyle}`}>
                  {item.status}
                </span>
              </div>

              <p className="text-xs sm:text-[13px] text-zinc-300 leading-relaxed font-sans">
                {item.description}
              </p>
            </div>

            <div className="pt-2.5 border-t border-zinc-850/80 text-[11px] font-mono text-zinc-400">
              {item.context}
            </div>
          </div>
        ))}
      </div>

      {/* Audit Footnote */}
      <div className="pt-0.5 flex items-center gap-2 text-[11px] font-mono text-zinc-500">
        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
        <span>Grounded in qualitative active states (LEARNING, PRACTICING, BUILDING, EXPLORING). No synthetic completion bars.</span>
      </div>
    </section>
  );
}

export default CurrentlyDeveloping;
