import React from "react";
import { ExternalLink, Code } from "lucide-react";
import type { ResumeProject } from "../data/resumeData";

interface ResumeProjectCardProps {
  project: ResumeProject;
}

export function ResumeProjectCard({ project }: ResumeProjectCardProps) {
  return (
    <article className="card p-5 sm:p-6 flex flex-col justify-between">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-[11px] font-mono tabular-nums">
          <span className="uppercase tracking-wider font-semibold text-[var(--accent)]">
            {project.role}
          </span>
          <span className="text-[var(--text-muted)]">
            {project.period}
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-[var(--text)] tracking-tight font-display">
          {project.title}
        </h3>
        {project.subtitle && (
          <p className="text-xs font-mono text-[var(--text-muted)] mt-0.5 mb-3">
            {project.subtitle}
          </p>
        )}

        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
          {project.description}
        </p>

        <p className="text-[11px] font-mono text-[var(--text-muted)] mb-5" aria-label="Technologies used">
          {project.technologies.join(" · ")}
        </p>
      </div>

      {(project.demoUrl || project.sourceUrl) && (
        <div className="pt-3 border-t border-[var(--border)] flex flex-wrap items-center gap-2.5">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary min-h-[36px] px-3 py-1.5 text-xs"
              aria-label={`View live demo for ${project.title}`}
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              <span>Live Project</span>
            </a>
          )}

          {project.sourceUrl && (
            <a
              href={project.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary min-h-[36px] px-3 py-1.5 text-xs"
              aria-label={`View source code for ${project.title}`}
            >
              <Code className="w-3.5 h-3.5 shrink-0" />
              <span>Source Code</span>
            </a>
          )}
        </div>
      )}
    </article>
  );
}

export default ResumeProjectCard;
