import { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import type { ProjectItem } from "../../data/projects";
import type { ProjectMediaEntry } from "../../data/projectMedia";
import type { GitHubRepo } from "../../services/github";

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
  onPreview,
  className = "",
  imgClassName = "",
  objectPosition = "top",
  priority = false,
}: ProjectMediaProps) {
  const [resolvedSrc, setResolvedSrc] = useState(media.src);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setResolvedSrc(media.src);
    setImgError(false);
  }, [media.src, project.id]);

  const handleImageError = () => {
    if (media.fallbackSrc && resolvedSrc !== media.fallbackSrc) {
      setResolvedSrc(media.fallbackSrc);
      return;
    }
    setImgError(true);
  };

  const hasValidMedia = !imgError && !media.isMissing && Boolean(resolvedSrc);
  const fitClass = media.objectFit === "contain" ? "!object-contain bg-[#151713]" : "object-cover";
  const posClass =
    media.objectPosition ||
    (objectPosition === "top" ? "object-top" : "object-center");

  const mediaVisual = hasValidMedia ? (
    <img
      src={resolvedSrc}
      alt={media.alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={handleImageError}
      className={`transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${fitClass} ${posClass} ${imgClassName}`}
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
            className="absolute bottom-3 right-3 w-9 h-9 rounded-[6px] bg-[#C7E34A] text-[#171B12] flex items-center justify-center opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
          >
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </button>
      ) : (
        mediaVisual
      )}
    </div>
  );
}

export default ProjectMedia;
