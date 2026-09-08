import React from "react";
import { SkillStatus } from "../../data/skills";

interface FocusArea {
  id: string;
  title: string;
  domain: string;
  status: SkillStatus;
  statusLabel: string;
  topics: string[];
  context: string;
}

const ROADMAP_ITEMS: FocusArea[] = [
  {
    id: "adv-dsa",
    title: "Advanced DSA",
    domain: "Core Computer Science",
    status: "practicing",
    statusLabel: "PRACTICING",
    topics: ["Dynamic Programming", "Graph Traversal (BFS/DFS)", "Shortest Paths", "Disjoint Set Union (DSU)"],
    context: "Systematic problem solving in C++ on LeetCode, focusing on optimal recurrence relations, algorithmic invariants, and memory bounds."
  },
  {
    id: "react-arch",
    title: "React & Modern Web",
    domain: "Frontend Architecture",
    status: "building",
    statusLabel: "BUILDING",
    topics: ["Component Architecture", "State Management", "Responsive Interfaces", "Performance Optimization"],
    context: "Architecting modular, type-safe web systems using modern React, custom hooks, zero-layout-shift design, and strict TypeScript contracts."
  },
  {
    id: "ai-ml-depth",
    title: "AI / ML & Computer Vision",
    domain: "Artificial Intelligence",
    status: "learning",
    statusLabel: "LEARNING",
    topics: ["Computer Vision Pipelines", "Model Integration", "Applied ML", "Edge Inference (YOLO)"],
    context: "Deepening mathematical foundations of convolution operations, feature maps, and real-time bounding box prediction models."
  },
  {
    id: "sys-arch",
    title: "System Architecture",
    domain: "Systems Engineering",
    status: "exploring",
    statusLabel: "EXPLORING",
    topics: ["Scalable APIs", "Service Design", "Application Architecture", "Resilient State Engines"],
    context: "High-level structuring of software systems: separating interface, service layers, multi-agent orchestration, and communication protocols."
  }
];

function getStatusStyle(status: SkillStatus) {
  switch (status) {
    case "building":
      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    case "practicing":
      return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
    case "learning":
      return "text-purple-400 bg-purple-500/10 border-purple-500/20";
    case "exploring":
      return "text-amber-400 bg-amber-500/10 border-amber-500/20";
  }
}

export function CurrentlyDeveloping() {
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.14em] text-cyan-400">
            06 — CURRENTLY DEVELOPING
          </span>
          <span className="h-px w-12 bg-zinc-800" />
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            Active Focus
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white font-display">
            Active Technical Progression
          </h2>
          <span className="text-xs font-mono text-zinc-500">
            Qualitative status · No fabricated progress bars
          </span>
        </div>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl font-sans">
          Four areas of deliberate ongoing study and engineering practice. Focus is placed on mastery through code rather than arbitrary completion metrics.
        </p>
      </div>

      {/* 2x2 Editorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ROADMAP_ITEMS.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-850 hover:border-zinc-750 transition-all duration-200 flex flex-col justify-between space-y-5"
          >
            <div className="space-y-3">
              {/* Header: Title & Status */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white font-display">
                    {item.title}
                  </h3>
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block mt-0.5">
                    {item.domain}
                  </span>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${getStatusStyle(
                    item.status
                  )}`}
                >
                  {item.statusLabel}
                </span>
              </div>

              {/* Context Description */}
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                {item.context}
              </p>
            </div>

            {/* Topics Tags */}
            <div className="pt-3 border-t border-zinc-850/80 space-y-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                FOCUSED PRACTICE VECTORS:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(item.topics || []).map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-0.5 rounded text-xs font-mono bg-zinc-900 text-zinc-400 border border-zinc-800"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CurrentlyDeveloping;
