import { memo } from "react";
import { Layers, Terminal, Cpu, Wrench } from "lucide-react";

interface TechGroup {
  category: string;
  icon: React.ElementType;
  color: string;
  items: {
    name: string;
    usedIn: string;
  }[];
}

const VERIFIED_LANDSCAPE: TechGroup[] = [
  {
    category: "Frontend & Interface",
    icon: Layers,
    color: "text-cyan-400",
    items: [
      { name: "React", usedIn: "Mausam, Operon, Portfolio" },
      { name: "TypeScript", usedIn: "Mausam, Operon, Portfolio" },
      { name: "Tailwind CSS", usedIn: "Mausam, Portfolio" },
      { name: "Vite", usedIn: "Portfolio, Mausam" },
      { name: "Motion", usedIn: "Portfolio micro-interactions" }
    ]
  },
  {
    category: "Backend & Systems",
    icon: Terminal,
    color: "text-emerald-400",
    items: [
      { name: "Node.js", usedIn: "Operon, Portfolio proxy" },
      { name: "Express.js", usedIn: "Operon backend, API proxy" },
      { name: "C++", usedIn: "SayamSolves algorithmic engine" },
      { name: "REST APIs", usedIn: "Operon, Mausam weather integration" },
      { name: "Human-in-the-Loop", usedIn: "Operon governance checkpoints" }
    ]
  },
  {
    category: "AI, ML & Computer Vision",
    icon: Cpu,
    color: "text-purple-400",
    items: [
      { name: "YOLOv8", usedIn: "Edge Computer Vision pipeline" },
      { name: "OpenCV", usedIn: "Spatial motion & frame processing" },
      { name: "PyTorch", usedIn: "Model loading & tensor inference" },
      { name: "Python", usedIn: "YOLO pipeline & telemetry scripts" },
      { name: "Multi-Agent AI", usedIn: "Operon autonomous workflow engine" }
    ]
  },
  {
    category: "Tools & Infrastructure",
    icon: Wrench,
    color: "text-amber-400",
    items: [
      { name: "Git & GitHub", usedIn: "Version control across all 5 repos" },
      { name: "Vercel", usedIn: "Mausam, Operon, Portfolio deployment" },
      { name: "Linux / POSIX", usedIn: "Edge CV and backend runtime" },
      { name: "LeetCode Engine", usedIn: "SayamSolves DSA benchmarking" }
    ]
  }
];

function TechnologyLandscapeComponent() {
  return (
    <div className="glass-card rounded-2xl p-6 sm:p-7 border border-zinc-850 bg-zinc-950/70 space-y-6">
      {/* Section Header */}
      <div className="space-y-1 border-b border-zinc-900 pb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm sm:text-base font-bold text-white font-display uppercase tracking-wider">
            TECHNOLOGY LANDSCAPE
          </h3>
        </div>
        <p className="text-xs text-zinc-400 font-sans">
          Taxonomy of verified technologies used across Sayam's 5 systems. No generic skill bars.
        </p>
      </div>

      {/* Grid of Verified Technology Constellations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {VERIFIED_LANDSCAPE.map((group, gIdx) => {
          const Icon = group.icon;
          return (
            <div 
              key={gIdx} 
              className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-850/80 space-y-3"
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-3.5 h-3.5 ${group.color}`} />
                <h4 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">
                  {group.category}
                </h4>
              </div>

              <div className="space-y-2">
                {group.items.map((item, iIdx) => (
                  <div 
                    key={iIdx} 
                    className="flex items-center justify-between gap-2 text-xs"
                  >
                    <span className="font-mono font-semibold text-zinc-300">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 truncate text-right">
                      {item.usedIn}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const TechnologyLandscape = memo(TechnologyLandscapeComponent);
