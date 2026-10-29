import React from "react";
import { RESUME_CONFIG } from "../config/resume";
import { ResumeGlyph } from "./ResumeGlyph";
import "../styles/resume-spotlight.css";

interface ResumeSpotlightProps {
  className?: string;
  onOpenViewer?: () => void;
}

/**
 * Premium Resume Spotlight Component
 * Replaces generic document buttons with a distinctive, interactive entry point
 * featuring custom glyph geometry, cyan/purple glow edge, and keyboard accessibility.
 */
export function ResumeSpotlight({
  className = "",
  onOpenViewer,
}: ResumeSpotlightProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    // If interactive viewer callback is available, always prioritize opening it
    if (onOpenViewer) {
      e.preventDefault();
      onOpenViewer();
    } else {
      // Safe external navigation fallback
      window.open(RESUME_CONFIG.url, "_blank", "noopener,noreferrer");
    }
  };

  const handleArrowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const win = window.open(RESUME_CONFIG.url, "_blank", "noopener,noreferrer");
      if (!win || win.closed || typeof win.closed === "undefined") {
        // If iframe popups are blocked by browser sandbox, open in-app viewer as guaranteed fallback
        if (onOpenViewer) {
          e.preventDefault();
          onOpenViewer();
        }
      }
    } catch {
      if (onOpenViewer) {
        e.preventDefault();
        onOpenViewer();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (onOpenViewer) {
        onOpenViewer();
      } else {
        window.open(RESUME_CONFIG.url, "_blank", "noopener,noreferrer");
      }
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className={`resume-spotlight group cursor-pointer ${className}`}
      aria-label="Explore my verified resume: opens interactive resume viewer"
      title="Click to explore interactive resume, projects, and credentials"
    >
      <span className="resume-spotlight__icon">
        <ResumeGlyph className="resume-spotlight__glyph group-hover:scale-105 transition-transform duration-300" />
      </span>

      <div className="resume-spotlight__content">
        <span className="resume-spotlight__eyebrow">
          VERIFIED RESUME
        </span>

        <span className="resume-spotlight__title">
          EXPLORE MY RESUME
        </span>

        <span className="resume-spotlight__description">
          Engineering, projects &amp; achievements
        </span>
      </div>

      {/* External Direct PDF Action with iframe popup fallback */}
      <a
        href={RESUME_CONFIG.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleArrowClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.stopPropagation();
          }
        }}
        className="resume-spotlight__arrow"
        aria-label="Open official verified resume PDF in external tab"
        title="Open official verified resume PDF in new tab"
      >
        <span aria-hidden="true">↗</span>
      </a>

      <span
        className="resume-spotlight__shine"
        aria-hidden="true"
      />
    </div>
  );
}

export default ResumeSpotlight;
