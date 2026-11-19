import { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import type { ProjectItem } from "../../data/projects";
import type { ProjectMediaEntry } from "../../data/projectMedia";
import type { GitHubRepo } from "../../services/github";
import { computeProjectLifecycle } from "../../utils/projectLifecycle";

interface ProjectMediaProps {
  project: ProjectItem;
  media: ProjectMediaEntry;
  repo?: GitHubRepo | null;
  isFeaturedCandidate?: boolean;
  onPreview?: () => void;
  className?: string;
  imgClassName?: string;
  objectPosition?: "center" | "top";
  priority?: boolean;
}

export function ProjectMedia({
  project,
  media,
  repo = null,
  isFeaturedCandidate = false,
  onPreview,
  className = "",
  imgClassName = "",
  objectPosition = "top",
  priority = false,
}: ProjectMediaProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [media.src, project.id]);

  const lifecycle = computeProjectLifecycle(project, repo);
  const isForkRepo = repo?.fork ?? project.isFork ?? false;
  const branchName = repo?.default_branch || project.defaultBranch || "main";

  const hasValidMedia = !imgError && !media.isMissing && Boolean(media.src);

  const mediaVisual = hasValidMedia ? (
    <img
      src={media.src}
      alt={media.alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setImgError(true)}
      className={`transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        objectPosition === "top" ? "object-top" : "object-center"
      } ${imgClassName}`}
    />
  ) : (
    <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-4 bg-[#151713] text-center">
      <span className="font-mono text-xs font-semibold text-[#F4F4ED]">{project.title}</span>
      <span className="font-mono text-[10px] text-[#8C8F82] uppercase tracking-wider">Preview Unavailable</span>
    </div>
  );

  return (
    <div className={`project-media aspect-[16/10] border-b border-[var(--border)] bg-[#151713] ${className}`}>
      {onPreview ? (
        <button
          type="button"
          onClick={onPreview}
          aria-label={`Open ${project.title} case study`}
          className="relative block h-full w-full cursor-pointer text-left"
        >
          {mediaVisual}
          <span
            aria-hidden="true"
            className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-[#C7E34A] text-[#20231D] flex items-center justify-center opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
          >
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </button>
      ) : (
        mediaVisual
      )}

      {/* Top-Left Metadata: Feature / Fork Badges */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap pointer-events-none">
        {isFeaturedCandidate && (
          <span className="px-2 py-0.5 rounded-[4px] bg-[#20231D]/92 text-[#C7E34A] border border-[#C7E34A]/60 text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-sm">
            Lead System
          </span>
        )}
        {isForkRepo && (
          <span className="px-2 py-0.5 rounded-[4px] bg-[#20231D]/92 text-[#F4F4ED] border border-[#565A4E] text-[10px] font-mono font-semibold uppercase tracking-wider backdrop-blur-sm">
            Fork · {branchName}
          </span>
        )}
      </div>

      {/* Top-Right Dynamic Lifecycle Status Badge */}
      <div className="absolute top-3 right-3 pointer-events-none">
        <span
          title={lifecycle.title}
          className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-bold uppercase tracking-wider ${lifecycle.badgeClass}`}
        >
          {lifecycle.label}
        </span>
      </div>
    </div>
  );
}

export default ProjectMedia;
