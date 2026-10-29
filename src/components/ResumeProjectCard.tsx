import React from "react";
import { ExternalLink, Code, Calendar, Award } from "lucide-react";
import type { ResumeProject } from "../data/resumeData";

interface ResumeProjectCardProps {
  project: ResumeProject;
}

export function ResumeProjectCard({ project }: ResumeProjectCardProps) {
  return (
    <article className="group relative p-5 sm:p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5 flex flex-col justify-between">
      {/* Subtle radial ambient highlight */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-purple-500/10 to-transparent rounded-tr-2xl pointer-events-none" />

      <div>
        {/* Top Header Row: Role & Date */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-500/25">
            <Award className="w-3 h-3 text-purple-400" />
            <span>{project.role}</span>
          </span>

          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500">
            <Calendar className="w-3 h-3 text-zinc-500" />
            <span>{project.period}</span>
          </span>
        </div>

        {/* Project Name and Subtitle */}
        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-purple-200 transition-colors tracking-tight font-display">
          {project.title}
        </h3>
        {project.subtitle && (
          <p className="text-xs font-mono text-cyan-400 mt-0.5 mb-3">
            {project.subtitle}
          </p>
        )}

        {/* Narrative Description */}
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed text-justify mb-4">
          {project.description}
        </p>

        {/* Technology Stack Chips */}
        <div className="flex flex-wrap gap-1.5 mb-5" aria-label="Technologies used">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-zinc-950 border border-zinc-800/80 text-zinc-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Verified Project Actions: Live Project & Source Code */}
      {(project.demoUrl || project.sourceUrl) && (
        <div className="pt-3 border-t border-zinc-900 flex flex-wrap items-center gap-2.5">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-500/15 hover:bg-purple-500/25 text-purple-200 border border-purple-500/30 hover:border-purple-400/50 transition-all cursor-pointer"
              aria-label={`View live demo for ${project.title}`}
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              <span>Live Project ↗</span>
            </a>
          )}

          {project.sourceUrl && (
            <a
              href={project.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 transition-all cursor-pointer"
              aria-label={`View source code for ${project.title}`}
            >
              <Code className="w-3.5 h-3.5 text-purple-400" />
              <span>Source Code ↗</span>
            </a>
          )}
        </div>
      )}
    </article>
  );
}

export default ResumeProjectCard;
