import { useState, useEffect } from "react";
import {
  ExternalLink,
  CheckCircle2,
  ArrowUpRight,
  X,
  FolderGit2,
  Compass,
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

function getStatusMeta(status: SkillStatus) {
  switch (status) {
    case "building":
      return {
        label: "Building",
        color: "text-[var(--success)]",
        marker: "bg-[var(--success)]",
      };
    case "practicing":
      return {
        label: "Practicing",
        color: "text-[var(--accent)]",
        marker: "bg-[var(--accent)]",
      };
    case "learning":
      return {
        label: "Learning",
        color: "text-[var(--warning)]",
        marker: "bg-[var(--warning)]",
      };
    case "exploring":
      return {
        label: "Exploring",
        color: "text-[var(--text-secondary)]",
        marker: "bg-[var(--text-muted)]",
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

  useEffect(() => {
    if (selectedSkillId) {
      const match = (skills || []).find(
        (s) =>
          s.id.toLowerCase() === selectedSkillId.toLowerCase() ||
          s.name.toLowerCase() === selectedSkillId.toLowerCase()
      );
      if (match) {
        setActiveSkill(match);
      }
    }
  }, [selectedSkillId, skills]);

  const handleCardClick = (skill: SkillItem) => {
    if (activeSkill?.id === skill.id) {
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

  const resolvedProjects: ProjectItem[] = activeSkill
    ? (activeSkill.relatedProjects || [])
        .map((pid) => (PROJECTS || []).find((p) => p.id === pid))
        .filter((p): p is ProjectItem => Boolean(p))
    : [];

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="font-semibold text-[var(--accent)]">
            03. Skill Ecosystem
          </span>
          <span className="h-px w-10 bg-[var(--border)]" />
          <span className="text-[var(--text-muted)]">
            Interactive Explorer
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--text)] font-display">
            Interactive Skill &amp; Architecture Explorer
          </h2>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            Select any skill to inspect architectural evidence
          </span>
        </div>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl font-sans leading-relaxed">
          Inspect concrete evidence, related technologies, and repository links for each engineering competency.
          Selecting a skill highlights its architectural context while peripheral items visually recede.
        </p>
      </div>

      {/* Active Skill Detail Inspector Panel */}
      {activeSkill && (
        <div className="card p-6 sm:p-8 relative space-y-6 border-[var(--border-strong)]">
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-5 right-5 p-2 rounded-[6px] text-[var(--text-secondary)] hover:text-[var(--text)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] active:scale-95 border border-[var(--border)] transition-all cursor-pointer"
            title="Clear inspection view"
            aria-label="Clear inspection view"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Top metadata row */}
          <div className="space-y-2 pr-12">
            <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
              <span className="text-[var(--accent)] font-semibold">
                {activeSkill.category}
              </span>
              <span className="text-[var(--text-muted)]" aria-hidden="true">·</span>
              {(() => {
                const status = getStatusMeta(activeSkill.status);
                return (
                  <span className={`inline-flex items-center gap-1.5 font-medium ${status.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-[2px] ${status.marker}`} />
                    <span>{status.label}</span>
                  </span>
                );
              })()}
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text)] font-display tracking-tight">
              {activeSkill.name}
            </h3>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-sans max-w-3xl">
              {activeSkill.description}
            </p>
          </div>

          {/* Evidence Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[var(--border)]">
            <div className="p-5 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)] font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Architectural Implementation &amp; Evidence</span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
                {activeSkill.evidenceSummary}
              </p>
              {activeSkill.repoEvidence && (
                <div className="pt-2.5 border-t border-[var(--border)] text-xs font-mono text-[var(--text-muted)]">
                  <span>Repository Evidence: </span>
                  <span className="text-[var(--text)]">{activeSkill.repoEvidence}</span>
                </div>
              )}
            </div>

            <div className="p-5 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)] font-semibold tabular-nums">
                <FolderGit2 className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                <span>Verified Codebases ({resolvedProjects.length})</span>
              </div>

              {resolvedProjects.length > 0 ? (
                <div className="space-y-2">
                  {resolvedProjects.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-[6px] bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[var(--text)] truncate font-sans">
                          {p.title}
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)] truncate font-sans">
                          {p.subtitle}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {p.githubUrl && (
                          <a
                            href={p.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-[6px] bg-[var(--surface)] hover:bg-[var(--surface-hover)] active:scale-95 text-[var(--text-secondary)] hover:text-[var(--text)] border border-[var(--border)] transition-all"
                            title="View GitHub Repository"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {onSelectProject && (
                          <button
                            type="button"
                            onClick={() => onSelectProject(p.id)}
                            className="btn btn-primary px-2.5 py-1 text-xs font-mono rounded-[6px] whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            Explore
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[var(--text-muted)] italic font-mono pt-1">
                  Practiced in foundational algorithmic problem solving and core engineering coursework.
                </p>
              )}
            </div>
          </div>

          {/* Related Skills & Documentation Row */}
          <div className="pt-3 border-t border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            {activeSkill.relatedSkills && activeSkill.relatedSkills.length > 0 ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[var(--text-muted)]">Related:</span>
                {activeSkill.relatedSkills.map((rel) => (
                  <button
                    key={rel}
                    type="button"
                    onClick={() => {
                      const match = (skills || []).find(
                        (s) =>
                          s.name.toLowerCase() === rel.toLowerCase() ||
                          s.id.toLowerCase() === rel.toLowerCase()
                      );
                      if (match) setActiveSkill(match);
                    }}
                    className="px-2.5 py-1 rounded-[6px] bg-[var(--surface)] hover:bg-[var(--surface-hover)] active:scale-[0.96] text-[var(--text-secondary)] hover:text-[var(--text)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-all cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {rel}
                  </button>
                ))}
              </div>
            ) : (
              <div />
            )}

            {activeSkill.docsUrl && (
              <a
                href={activeSkill.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[var(--accent)] hover:underline active:opacity-75 transition-colors shrink-0 whitespace-nowrap"
              >
                <span>Documentation Reference</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!skills || skills.length === 0 ? (
        <div className="card p-8 text-center space-y-3">
          <div className="w-10 h-10 mx-auto rounded-[6px] bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-[var(--text)] font-mono">
            No matching skills found
          </h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
            Try adjusting your search terms or selecting another category filter above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {skills.map((skill) => {
            const status = getStatusMeta(skill.status);
            const isSelected = activeSkill?.id === skill.id;
            const isDimmed = activeSkill !== null && !isSelected;

            return (
              <button
                key={skill.id}
                type="button"
                onClick={() => handleCardClick(skill)}
                className={`group text-left p-4 rounded-[10px] transition-all duration-150 cursor-pointer flex flex-col justify-between space-y-3 border active:scale-[0.985] ${
                  isSelected
                    ? "bg-[var(--surface-2)] border-[var(--accent)] ring-1 ring-[var(--accent)]"
                    : isDimmed
                    ? "bg-[var(--surface)] border-[var(--border)] opacity-55 hover:opacity-100 hover:border-[var(--border-strong)]"
                    : "bg-[var(--surface-2)] border-[var(--border)] hover:border-[var(--border-strong)]"
                }`}
              >
                <div className="flex items-start justify-between gap-2 w-full">
                  <div className="min-w-0">
                    <h3
                      className={`text-sm font-semibold transition-colors truncate font-sans ${
                        isSelected
                          ? "text-[var(--accent)]"
                          : "text-[var(--text)] group-hover:text-[var(--accent)]"
                      }`}
                    >
                      {skill.name}
                    </h3>
                    <span className="text-[11px] font-mono text-[var(--text-muted)] block mt-0.5 truncate">
                      {skill.category}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-mono font-medium shrink-0 whitespace-nowrap ${status.color}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-[2px] ${status.marker}`} />
                    <span>{status.label}</span>
                  </span>
                </div>

                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed font-sans">
                  {skill.evidenceSummary}
                </p>

                <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] w-full tabular-nums">
                  <span className="truncate">
                    {skill.relatedProjects && skill.relatedProjects.length > 0
                      ? `${skill.relatedProjects.length} verified project${
                          skill.relatedProjects.length > 1 ? "s" : ""
                        }`
                      : "Coursework practice"}
                  </span>
                  <span
                    className={`flex items-center gap-0.5 transition-colors shrink-0 ${
                      isSelected
                        ? "text-[var(--accent)] font-medium"
                        : "text-[var(--text-muted)] group-hover:text-[var(--text)]"
                    }`}
                  >
                    <span>{isSelected ? "Inspecting" : "Inspect"}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SkillEcosystem;

