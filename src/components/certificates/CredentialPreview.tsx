import React, { useState } from "react";
import { AchievementRecord } from "../../types/certificates";
import { usePortfolio } from "../../context/PortfolioContext";
import { ExternalLink, Sparkles, Code2, FileText } from "lucide-react";

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
  const { theme } = usePortfolio();
  const isLight = theme === "light";
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

  // 1. Real Certificate Image (when available)
  if (actualImage && !imageError) {
    return (
      <div
        onClick={onInspect}
        className={`achievement-card__credential group/img relative w-full h-44 rounded-2xl border overflow-hidden cursor-pointer flex items-center justify-center p-2 transition-all ${
          isLight
            ? "bg-slate-50 border-slate-200 hover:border-purple-300"
            : "bg-black/30 border-white/10 hover:border-purple-500/40"
        } ${className}`}
        title="Click to inspect credential image"
      >
        <img
          src={actualImage}
          alt={actualAlt}
          loading="lazy"
          decoding="async"
          onError={() => setImageError(true)}
          className="w-full h-full object-contain transition-transform duration-300 group-hover/img:scale-105"
        />
      </div>
    );
  }

  // 2. Associated Engineering Projects (e.g. AXIOM, AlertSetu, CampusConnect, Memory in Motion, OPERON)
  const hasProjects = (associatedProjects && associatedProjects.length > 0) || project;

  if (hasProjects) {
    return (
      <div
        className={`rounded-xl border p-3.5 space-y-2 transition-colors ${
          isLight
            ? "bg-purple-50/40 border-purple-200/80 hover:border-purple-300"
            : "bg-white/[0.02] border-white/[0.08] hover:border-purple-500/30"
        } ${className}`}
      >
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-purple-400">
            <Code2 className="w-3.5 h-3.5" />
            <span>
              {associatedProjects && associatedProjects.length > 1
                ? "Associated Engineering Projects"
                : "Associated Project"}
            </span>
          </div>

          {(pathway || track) && (
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                isLight
                  ? "bg-slate-100 text-slate-600 border border-slate-200"
                  : "bg-white/[0.04] text-zinc-400 border border-white/5"
              }`}
            >
              {pathway || track}
            </span>
          )}
        </div>

        {associatedProjects && associatedProjects.length > 0 ? (
          <div className="space-y-1.5">
            {associatedProjects.map((proj, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                  <span
                    className={`font-medium truncate ${
                      isLight ? "text-slate-900" : "text-zinc-200"
                    }`}
                  >
                    {proj.name}
                  </span>
                </div>

                {proj.url && (
                  <a
                    href={proj.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-purple-400 hover:text-purple-300 hover:underline shrink-0"
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
            <span
              className={`font-medium truncate ${
                isLight ? "text-slate-900" : "text-zinc-200"
              }`}
            >
              {project}
            </span>
          </div>
        ) : null}
      </div>
    );
  }

  // 3. Fallback: No visual preview needed, clean layout preservation
  return null;
}
export default CredentialPreview;
