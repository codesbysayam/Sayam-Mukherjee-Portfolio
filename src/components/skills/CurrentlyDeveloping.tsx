import React from "react";
import { Sparkles, BookOpen, Layers, Binary, Cpu, ArrowRight } from "lucide-react";
import { CURRENTLY_DEVELOPING, SkillStatus } from "../../data/skills";

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
    topics: ["Dynamic Programming", "Graph Traversal (BFS / DFS)", "Shortest Path Algorithms", "Disjoint Set Union (DSU)"],
    context: "Systematic practice of complex algorithmic patterns via C++ and LeetCode, focusing on optimal recurrence relations and space-time boundaries."
  },
  {
    id: "react-arch",
    title: "React & Modern Web",
    domain: "Frontend Architecture",
    status: "building",
    statusLabel: "BUILDING",
    topics: ["Component Architecture", "State Management", "Responsive Interfaces", "Performance Optimization"],
    context: "Architecting modular, type-safe web systems using modern React patterns, custom hooks, and zero-layout-shift UI engineering."
  },
  {
    id: "ai-ml-depth",
    title: "AI / ML & Computer Vision",
    domain: "Artificial Intelligence",
    status: "learning",
    statusLabel: "LEARNING / BUILDING",
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-850 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase font-semibold">
              TECHNICAL ROADMAP
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span className="text-[11px] font-mono text-zinc-500">
              4 ACTIVE STUDY DOMAINS
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            CURRENTLY DEVELOPING
          </h2>
          <p className="text-xs text-zinc-400 font-sans">
            Active technical progression and focused study areas
          </p>
        </div>
        <p className="text-xs text-zinc-400 font-mono">
          Qualitative status · No arbitrary completion bars
        </p>
      </div>

      {/* 4 Focus Area Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ROADMAP_ITEMS.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-850 hover:border-zinc-750 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Title & Status */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-white">
                    {item.title}
                  </h3>
                  <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mt-0.5">
                    {item.domain}
                  </span>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold border ${getStatusStyle(
                    item.status
                  )}`}
                >
                  {item.statusLabel}
                </span>
              </div>

              {/* Context Description */}
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                {item.context}
              </p>
            </div>

            {/* Topics Tags */}
            <div className="pt-3 border-t border-zinc-850/80 space-y-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                Target Topics &amp; Practice Vectors:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {item.topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-zinc-900/80 text-zinc-300 border border-zinc-800"
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
