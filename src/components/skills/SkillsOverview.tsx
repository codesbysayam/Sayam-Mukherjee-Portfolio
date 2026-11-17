import type { ElementType } from "react";
import {
  Code2,
  Layout,
  Database,
  Cpu,
  Wrench,
  Binary,
} from "lucide-react";

interface CategoryBlock {
  title: string;
  subtitle: string;
  icon: ElementType;
  skills: string[];
}

const OVERVIEW_CATEGORIES: CategoryBlock[] = [
  {
    title: "Languages",
    subtitle: "Core syntax & system programming",
    icon: Code2,
    skills: ["Python", "C++", "Java", "TypeScript", "JavaScript", "HTML", "CSS"],
  },
  {
    title: "Frontend",
    subtitle: "Reactive interfaces & design systems",
    icon: Layout,
    skills: ["React", "TypeScript", "Tailwind CSS", "JavaScript", "HTML/CSS", "Bootstrap"],
  },
  {
    title: "Backend & Data",
    subtitle: "APIs, microservices & persistence",
    icon: Database,
    skills: ["Node.js", "Express.js", "MongoDB", "Firebase", "REST APIs"],
  },
  {
    title: "AI / Machine Learning",
    subtitle: "Neural vision models & inference",
    icon: Cpu,
    skills: ["Computer Vision", "PyTorch", "YOLO / YOLOv8", "Deep Learning", "Machine Learning"],
  },
  {
    title: "Tools & DevOps",
    subtitle: "Development environment & delivery",
    icon: Wrench,
    skills: ["Git", "GitHub", "VS Code", "Vercel", "Figma", "Canva"],
  },
  {
    title: "Core Engineering",
    subtitle: "Algorithms, architecture & protocols",
    icon: Binary,
    skills: [
      "Data Structures & Algorithms",
      "System Architecture",
      "API Integration",
      "Responsive Web Design",
      "State Management",
    ],
  },
];

interface SkillsOverviewProps {
  onSelectSkill?: (skillName: string) => void;
}

export function SkillsOverview({ onSelectSkill }: SkillsOverviewProps) {
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="font-semibold text-[var(--accent)]">
            02. Technology Stack
          </span>
          <span className="h-px w-8 bg-[var(--border)]" />
          <span className="text-[var(--text-muted)] tabular-nums">
            6 Core Domains
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)] font-display">
            Organized Technical Domains
          </h2>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            Select any technology to inspect implementation evidence
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl font-sans leading-relaxed">
          A structured matrix of active engineering domains. Focus is on depth of implementation rather than superficial familiarity.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {OVERVIEW_CATEGORIES.map((cat) => {
          const IconComponent = cat.icon;

          return (
            <div
              key={cat.title}
              className="card p-5 flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-semibold text-[var(--text)] font-sans tracking-tight">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] font-sans">
                    {cat.subtitle}
                  </p>
                </div>
                <div className="w-7 h-7 rounded-[6px] bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)] flex items-center justify-center shrink-0">
                  <IconComponent className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {cat.skills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => onSelectSkill?.(skill)}
                    className="px-2.5 py-1 rounded-[6px] text-[11px] font-mono bg-[var(--surface)] hover:bg-[#C7E34A] text-[var(--text-secondary)] hover:text-[#20231D] border border-[var(--border)] hover:border-[#A9C52F] transition-colors cursor-pointer text-left whitespace-nowrap shrink-0"
                    title={`Inspect evidence for ${skill}`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SkillsOverview;

