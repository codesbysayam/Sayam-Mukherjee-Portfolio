import React, { useState } from "react";
import { AchievementRecord } from "../../types/certificates";
import { ExternalLink, Code2 } from "lucide-react";

interface CredentialPreviewProps {
  record: AchievementRecord;
  onInspect?: () => void;
  className?: string;
}

export function CredentialPreview({
  record,
  onInspect,
  className = "",
}: CredentialPreviewProps) {
  const [imageError, setImageError] = useState(false);

  const {
    imageUrl,
    credentialImage,
    imageAlt,
    credentialAlt,
    title,
    project,
    associatedProjects,
    track,
    pathway,
  } = record;

  const actualImage = credentialImage || imageUrl;
  const actualAlt = credentialAlt || imageAlt || `${title} credential`;

  if (actualImage && !imageError) {
    return (
      <div
        onClick={onInspect}
        className={`achievement-card__credential group/img relative w-full h-44 rounded-[10px] border overflow-hidden cursor-pointer flex items-center justify-center p-2 transition-colors ${className}`}
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
        }}
        title="Click to inspect credential image"
      >
        <img
          src={actualImage}
          alt={actualAlt}
          loading="lazy"
          decoding="async"
          onError={() => setImageError(true)}
          className="w-full h-full object-contain transition-transform duration-300 group-hover/img:scale-[1.03]"
        />
      </div>
    );
  }

  const hasProjects = (associatedProjects && associatedProjects.length > 0) || project;

  if (hasProjects) {
    return (
      <div
        className={`rounded-[10px] border p-3.5 space-y-2 transition-colors ${className}`}
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-mono font-semibold uppercase tracking-wider text-[11px] text-[var(--accent)]">
            <Code2 className="w-3.5 h-3.5" />
            <span>
              {associatedProjects && associatedProjects.length > 1
                ? "Associated Projects"
                : "Associated Project"}
            </span>
          </div>

          {(pathway || track) && (
            <span
              className="text-[11px] font-mono px-2 py-0.5 rounded-[4px] border"
              style={{
                backgroundColor: "var(--surface-2)",
                borderColor: "var(--border)",
                color: "var(--text-muted)",
              }}
            >
              {pathway || track}
            </span>
          )}
        </div>

        {associatedProjects && associatedProjects.length > 0 ? (
          <div className="space-y-1.5">
            {associatedProjects.map((proj, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: "var(--accent)" }}
                  />
                  <span className="font-medium truncate text-[var(--text)]">
                    {proj.name}
                  </span>
                </div>

                {proj.url && (
                  <a
                    href={proj.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-[var(--accent)] hover:underline shrink-0"
                    title={`Open ${proj.name}`}
                  >
                    <span>Launch</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : project ? (
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-medium truncate text-[var(--text)]">{project}</span>
          </div>
        ) : null}
      </div>
    );
  }

  return null;
}

export default CredentialPreview;
