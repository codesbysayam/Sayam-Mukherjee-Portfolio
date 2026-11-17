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
    category: "Frontend & Interactive Labs",
    icon: Layers,
    items: [
      { name: "TypeScript & React", usedIn: "OPERON, MAUSAM, AXIOM, Inkloom" },
      { name: "Next.js 15 / React 19", usedIn: "SightForge, Campus Connect" },
      { name: "D3.js & KaTeX", usedIn: "Memory in Motion interpretive lab" },
      { name: "HTML5 Canvas (16:9)", usedIn: "SightForge atomic CVFrame renderer" },
      { name: "Tailwind CSS", usedIn: "MAUSAM, Campus Connect, OPERON" },
    ],
  },
  {
    category: "Backend, APIs & Algorithms",
    icon: Terminal,
    items: [
      { name: "FastAPI (Python)", usedIn: "SightForge real-time CV service" },
      { name: "Node.js & Express", usedIn: "OPERON dispatcher & approval API" },
      { name: "PostgreSQL & PLpgSQL", usedIn: "SightForge, MAUSAM, Inkloom" },
      { name: "C++20", usedIn: "SayamSolves (LC 0005, 0033, 0115)" },
      { name: "HITL & Control Planes", usedIn: "OPERON, AXIOM policy & audit chains" },
    ],
  },
  {
    category: "AI, CV & Agentic Research",
    icon: Cpu,
    items: [
      { name: "YOLOv8 & 17-Keypoint Pose", usedIn: "SightForge COCO Class ID 0 + IoU 0.45" },
      { name: "ByteTrack", usedIn: "SightForge persistent tracking" },
      { name: "Multi-Agent Workflows", usedIn: "OPERON Support/Finance/HR/Ops" },
      { name: "Hebbian Fast Weights & BDH", usedIn: "Memory in Motion O(1) vs O(T) lab" },
      { name: "Constructed Brand AI", usedIn: "Inkloom composition & clear-space" },
    ],
  },
  {
    category: "Testing & Infrastructure",
    icon: Wrench,
    items: [
      { name: "Git & GitHub", usedIn: "All 8 product repos (11 public total)" },
      { name: "Vitest", usedIn: "Campus Connect automated test suite" },
      { name: "Docker & Makefile", usedIn: "Inkloom container, SightForge/MAUSAM" },
      { name: "Vercel", usedIn: "OPERON, MAUSAM, AXIOM, MemMotion, Campus" },
    ],
  },
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
          Taxonomy of verified technologies across all 8 engineering repositories. No generic skill bars.
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
