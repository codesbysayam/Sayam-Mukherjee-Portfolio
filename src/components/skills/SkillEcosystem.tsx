import React, { useState } from "react";
import { 
  ExternalLink, Layers, CheckCircle2, ArrowUpRight, 
  Sparkles, X, Code2, FolderGit2, BookOpen, Compass
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
  skills,
  onSelectProject,
  selectedSkillId,
  onClearSelection,
  onSkillSelect,
}: SkillEcosystemProps) {
  const [activeModalSkill, setActiveModalSkill] = useState<SkillItem | null>(null);

  // If a skill was selected from outside
  React.useEffect(() => {
    if (selectedSkillId) {
      const match = skills.find(
        (s) => s.id.toLowerCase() === selectedSkillId.toLowerCase() || s.name.toLowerCase() === selectedSkillId.toLowerCase()
      );
      if (match) {
        setActiveModalSkill(match);
      }
    }
  }, [selectedSkillId, skills]);

  const handleOpenDetail = (skill: SkillItem) => {
    setActiveModalSkill(skill);
    onSkillSelect?.(skill.id);
  };

  const handleCloseDetail = () => {
    setActiveModalSkill(null);
    onClearSelection?.();
  };

  // Resolve projects for modal
  const resolvedProjects: ProjectItem[] = activeModalSkill
    ? activeModalSkill.relatedProjects
        .map((pid) => PROJECTS.find((p) => p.id === pid))
        .filter((p): p is ProjectItem => Boolean(p))
    : [];

  return (
    <div className="space-y-4">
      {/* Sub-header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-850 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase font-semibold">
              INTERACTIVE ECOSYSTEM
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span className="text-[11px] font-mono text-zinc-500">CLICK ANY SKILL FOR EVIDENCE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            SKILL EXPLORER &amp; ARCHITECTURE
          </h2>
        </div>
        <p className="text-xs text-zinc-400 font-mono">
          Interactive evidence cards · Direct project links
        </p>
      </div>

      {/* Empty State if filter returned 0 */}
      {skills.length === 0 ? (
        <div className="p-8 rounded-2xl bg-zinc-950/40 border border-zinc-850 text-center space-y-3">
          <div className="w-10 h-10 mx-auto rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-white font-mono">No matching skills found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Try adjusting your search terms or selecting another category filter.
          </p>
        </div>
      ) : (
        /* Skills Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {skills.map((skill) => {
            const badge = getStatusBadge(skill.status);

            return (
              <div
                key={skill.id}
                onClick={() => handleOpenDetail(skill)}
                className="group p-4 rounded-xl bg-zinc-950/60 hover:bg-zinc-900/60 border border-zinc-850 hover:border-zinc-700 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3"
              >
                {/* Top Row: Name + Status Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
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
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {skill.evidenceSummary}
                </p>

                {/* Bottom Row: Related Projects & Arrow */}
                <div className="pt-2 border-t border-zinc-850/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span className="truncate">
                    {skill.relatedProjects.length > 0
                      ? `${skill.relatedProjects.length} verified project${
                          skill.relatedProjects.length > 1 ? "s" : ""
                        }`
                      : "Academic practice"}
                  </span>
                  <span className="text-zinc-400 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all flex items-center gap-0.5">
                    <span>Evidence</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Skill Evidence Modal */}
      {activeModalSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg rounded-2xl bg-zinc-950 border border-zinc-800 p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleCloseDetail}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 pr-8">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                  {activeModalSkill.category}
                </span>
                <span className="text-zinc-600">·</span>
                {(() => {
                  const b = getStatusBadge(activeModalSkill.status);
                  return (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono ${b.bg} ${b.border} ${b.color} border`}>
                      <span className={`w-1 h-1 rounded-full ${b.dot}`} />
                      <span>{b.label}</span>
                    </span>
                  );
                })()}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                {activeModalSkill.name}
              </h2>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {activeModalSkill.description}
              </p>
            </div>

            {/* Where It Is Used / Evidence Summary */}
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-850 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-300 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>WHERE IT IS USED / EVIDENCE</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                {activeModalSkill.evidenceSummary}
              </p>
              {activeModalSkill.repoEvidence && (
                <p className="text-[11px] text-zinc-400 font-mono border-t border-zinc-800/80 pt-2">
                  <strong className="text-zinc-300">Codebase Evidence: </strong>
                  {activeModalSkill.repoEvidence}
                </p>
              )}
            </div>

            {/* Verified Projects */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider block">
                Verified Projects ({resolvedProjects.length})
              </span>
              {resolvedProjects.length > 0 ? (
                <div className="space-y-2">
                  {resolvedProjects.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-850 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          {p.title}
                        </div>
                        <div className="text-[11px] text-zinc-400 truncate">
                          {p.subtitle}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {p.githubUrl && (
                          <a
                            href={p.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-750 transition-colors"
                            title="View GitHub Repository"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {onSelectProject && (
                          <button
                            onClick={() => {
                              onSelectProject(p.id);
                              handleCloseDetail();
                            }}
                            className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono cursor-pointer transition-colors"
                          >
                            Explore
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-500 italic font-mono">
                  No full portfolio project linked; practiced in foundational coursework and algorithmic exercises.
                </p>
              )}
            </div>

            {/* Related Technologies */}
            {activeModalSkill.relatedSkills && activeModalSkill.relatedSkills.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider block">
                  Related Technologies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeModalSkill.relatedSkills.map((rel) => (
                    <span
                      key={rel}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-zinc-900 border border-zinc-800 text-zinc-300"
                    >
                      {rel}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Documentation Link */}
            {activeModalSkill.docsUrl && (
              <div className="pt-3 border-t border-zinc-850 flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-500">Official Reference</span>
                <a
                  href={activeModalSkill.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>Open Documentation</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SkillEcosystem;
