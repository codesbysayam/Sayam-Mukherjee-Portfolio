import { memo } from "react";
import { Layers, Terminal, Cpu, Wrench } from "lucide-react";

interface TechGroup {
  category: string;
  icon: React.ElementType;
  items: {
    name: string;
    usedIn: string;
  }[];
}

const VERIFIED_LANDSCAPE: TechGroup[] = [
  {
    category: "Frontend & Interface",
    icon: Layers,
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
    <div className="card p-6 sm:p-7 space-y-6">
      <div className="space-y-1 border-b border-[var(--border)] pb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[var(--accent)]" />
          <h3 className="text-sm sm:text-base font-bold font-display uppercase tracking-wider text-[var(--text)]">
            TECHNOLOGY LANDSCAPE
          </h3>
        </div>
        <p className="text-xs font-sans text-[var(--text-muted)]">
          Taxonomy of verified technologies used across Sayam&apos;s 5 systems. No generic skill bars.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {VERIFIED_LANDSCAPE.map((group, gIdx) => {
          const Icon = group.icon;
          return (
            <div
              key={gIdx}
              className="p-4 rounded-[8px] border bg-[var(--surface)] border-[var(--border)] space-y-3"
            >
              <div className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 text-[var(--accent)]" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text)]">
                  {group.category}
                </h4>
              </div>

              <div className="space-y-2">
                {group.items.map((item, iIdx) => (
                  <div
                    key={iIdx}
                    className="flex items-center justify-between gap-2 text-xs"
                  >
                    <span className="font-mono font-semibold text-[var(--text-secondary)]">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-mono truncate text-right text-[var(--text-faint)]">
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
