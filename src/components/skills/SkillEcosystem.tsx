import React, { useState, useEffect } from "react";
import { 
  ExternalLink, CheckCircle2, ArrowUpRight, 
  X, Code2, FolderGit2, Compass, Sparkles, Layers
} from "lucide-react";
import { SkillItem, SkillStatus } from "../../data/skills";
import { PROJECTS, ProjectItem } from "../../data/projects";

interface SkillEcosystemProps {
  skills: SkillItem[];
  onSelectProject?: (projectId: string) => void;
  selectedSkillId?: string | null;
  onClearSelection?: () => void;
  onSkillSelect?: (skillId: string) => void;
}

function getStatusBadge(status: SkillStatus) {
  switch (status) {
    case "building":
      return {
        label: "BUILDING",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        dot: "bg-emerald-400"
      };
    case "practicing":
      return {
        label: "PRACTICING",
        color: "text-cyan-400",
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/20",
        dot: "bg-cyan-400"
      };
    case "learning":
      return {
        label: "LEARNING",
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20",
        dot: "bg-purple-400"
      };
    case "exploring":
      return {
        label: "EXPLORING",
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        dot: "bg-amber-400"
      };
  }
}

export function SkillEcosystem({
  skills = [],
  onSelectProject,
  selectedSkillId,
  onClearSelection,
  onSkillSelect,
}: SkillEcosystemProps) {
  const [activeSkill, setActiveSkill] = useState<SkillItem | null>(null);

  // Sync external selection if any
  useEffect(() => {
    if (selectedSkillId) {
      const match = (skills || []).find(
        (s) => s.id.toLowerCase() === selectedSkillId.toLowerCase() || s.name.toLowerCase() === selectedSkillId.toLowerCase()
      );
      if (match) {
        setActiveSkill(match);
      }
    }
  }, [selectedSkillId, skills]);

  const handleCardClick = (skill: SkillItem) => {
    if (activeSkill?.id === skill.id) {
      // Toggle off
      setActiveSkill(null);
      onClearSelection?.();
    } else {
      setActiveSkill(skill);
      onSkillSelect?.(skill.id);
    }
  };

  const handleClear = () => {
    setActiveSkill(null);
    onClearSelection?.();
  };

  // Resolve projects for active inspection
  const resolvedProjects: ProjectItem[] = activeSkill
    ? (activeSkill.relatedProjects || [])
        .map((pid) => (PROJECTS || []).find((p) => p.id === pid))
        .filter((p): p is ProjectItem => Boolean(p))
    : [];

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.14em] text-cyan-400">
            03 — SKILL ECOSYSTEM
          </span>
          <span className="h-px w-12 bg-zinc-800" />
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            Interactive Centerpiece
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white font-display">
            Interactive Skill &amp; Architecture Explorer
          </h2>
          <span className="text-xs font-mono text-zinc-500">
            Click any skill to inspect architectural evidence
          </span>
        </div>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl font-sans">
          Inspect concrete evidence, related technologies, and repository links for each engineering competency. 
          Selecting a skill highlights its architectural context while peripheral items visually recede.
        </p>
      </div>

      {/* ACTIVE SKILL DETAIL INSPECTOR PANEL (Appears seamlessly when a skill is active) */}
      {activeSkill && (
        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 shadow-2xl relative space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Close button */}
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-5 right-5 p-2 rounded-lg text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-750 border border-zinc-700 transition-colors cursor-pointer"
            title="Clear inspection view"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Top metadata row */}
          <div className="space-y-2 pr-10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                {activeSkill.category}
              </span>
              <span className="text-zinc-600">·</span>
              {(() => {
                const b = getStatusBadge(activeSkill.status);
                return (
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono ${b.bg} ${b.border} ${b.color} border`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${b.dot}`} />
                    <span>{b.label}</span>
                  </span>
                );
              })()}
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
              {activeSkill.name}
            </h3>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans max-w-3xl">
              {activeSkill.description}
            </p>
          </div>

          {/* Evidence Grid: Implementation details & Codebase link */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Where It Is Used / Evidence */}
            <div className="p-5 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 font-semibold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Architectural Implementation &amp; Evidence</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                {activeSkill.evidenceSummary}
              </p>
              {activeSkill.repoEvidence && (
                <div className="pt-2 border-t border-zinc-850 text-xs font-mono text-zinc-400">
                  <span className="text-zinc-500">Repository Evidence: </span>
                  <span className="text-zinc-200">{activeSkill.repoEvidence}</span>
                </div>
              )}
            </div>

            {/* Verified Linked Projects */}
            <div className="p-5 rounded-xl bg-zinc-950/60 border border-zinc-850 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 font-semibold uppercase tracking-wider">
                <FolderGit2 className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>Verified Codebases ({resolvedProjects.length})</span>
              </div>

              {resolvedProjects.length > 0 ? (
                <div className="space-y-2">
                  {resolvedProjects.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate font-sans">
                          {p.title}
                        </div>
                        <div className="text-[11px] text-zinc-400 truncate font-sans">
                          {p.subtitle}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {p.githubUrl && (
                          <a
                            href={p.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-md bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white border border-zinc-700 transition-colors"
                            title="View GitHub Repository"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {onSelectProject && (
                          <button
                            type="button"
                            onClick={() => onSelectProject(p.id)}
                            className="px-2.5 py-1 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono transition-colors cursor-pointer"
                          >
                            Explore
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-500 italic font-mono pt-1">
                  Practiced in foundational algorithmic problem solving and core engineering coursework.
                </p>
              )}
            </div>
          </div>

          {/* Related Skills & Documentation Row */}
          <div className="pt-2 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            {/* Related chips */}
            {activeSkill.relatedSkills && activeSkill.relatedSkills.length > 0 ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-zinc-500">Related:</span>
                {activeSkill.relatedSkills.map((rel) => (
                  <button
                    key={rel}
                    type="button"
                    onClick={() => {
                      const match = (skills || []).find(
                        (s) => s.name.toLowerCase() === rel.toLowerCase() || s.id.toLowerCase() === rel.toLowerCase()
                      );
                      if (match) setActiveSkill(match);
                    }}
                    className="px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
                  >
                    {rel}
                  </button>
                ))}
              </div>
            ) : (
              <div />
            )}

            {/* Documentation Reference */}
            {activeSkill.docsUrl && (
              <a
                href={activeSkill.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors shrink-0"
              >
                <span>Documentation Reference</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Empty State if filter returned 0 */}
      {(!skills || skills.length === 0) ? (
        <div className="p-8 rounded-2xl bg-zinc-950/40 border border-zinc-850 text-center space-y-3">
          <div className="w-10 h-10 mx-auto rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-white font-mono">No matching skills found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Try adjusting your search terms or selecting another category filter above.
          </p>
        </div>
      ) : (
        /* Skills Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {skills.map((skill) => {
            const badge = getStatusBadge(skill.status);
            const isSelected = activeSkill?.id === skill.id;
            const isDimmed = activeSkill !== null && !isSelected;

            return (
              <div
                key={skill.id}
                onClick={() => handleCardClick(skill)}
                className={`group p-4 rounded-xl transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 border ${
                  isSelected
                    ? "bg-zinc-900 border-cyan-500/80 shadow-lg shadow-cyan-500/10 scale-[1.01]"
                    : isDimmed
                    ? "bg-zinc-950/30 border-zinc-850/60 opacity-45 hover:opacity-100 hover:border-zinc-750"
                    : "bg-zinc-950/40 hover:bg-zinc-900/60 border-zinc-850 hover:border-zinc-750"
                }`}
              >
                {/* Top Row: Name + Status Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className={`text-sm font-semibold transition-colors truncate font-sans ${
                      isSelected ? "text-cyan-300" : "text-white group-hover:text-zinc-200"
                    }`}>
                      {skill.name}
                    </h3>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mt-0.5">
                      {skill.category}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium shrink-0 ${badge.bg} ${badge.border} ${badge.color} border`}
                  >
                    <span className={`w-1 h-1 rounded-full ${badge.dot}`} />
                    <span>{badge.label}</span>
                  </span>
                </div>

                {/* Evidence snippet */}
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-sans">
                  {skill.evidenceSummary}
                </p>

                {/* Bottom Row: Project Count & Link indicator */}
                <div className="pt-2 border-t border-zinc-850/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span className="truncate">
                    {skill.relatedProjects && skill.relatedProjects.length > 0
                      ? `${skill.relatedProjects.length} verified project${
                          skill.relatedProjects.length > 1 ? "s" : ""
                        }`
                      : "Coursework practice"}
                  </span>
                  <span className={`flex items-center gap-0.5 transition-colors ${
                    isSelected ? "text-cyan-400" : "text-zinc-500 group-hover:text-zinc-300"
                  }`}>
                    <span>{isSelected ? "Inspecting" : "Inspect"}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SkillEcosystem;
