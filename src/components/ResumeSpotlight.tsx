import React from "react";
import { FileText, ArrowUpRight } from "lucide-react";
import { RESUME_CONFIG } from "../config/resume";
import "../styles/resume-spotlight.css";

interface ResumeSpotlightProps {
  className?: string;
  onOpenViewer?: () => void;
  label?: string;
}

/**
 * Premium Minimal Resume CTA Button
 * Compact, restrained button with refined typography, purple accent,
 * accessible interactive touch targets, and zero unnecessary visual clutter.
 */
export function ResumeSpotlight({
  className = "",
  onOpenViewer,
  label = "Resume",
}: ResumeSpotlightProps) {
  const handleClick = (e: React.MouseEvent) => {
    // If viewer callback is provided, prioritize opening the interactive in-app resume viewer
    if (onOpenViewer) {
      e.preventDefault();
      onOpenViewer();
    } else {
      // Fallback: direct secure new-tab navigation to authoritative CDN URL
      window.open(RESUME_CONFIG.url, "_blank", "noopener,noreferrer");
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
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`resume-btn group ${className}`}
      aria-label="View official verified resume"
      title="Open official verified resume viewer"
    >
      <span className="resume-btn__icon" aria-hidden="true">
        <FileText className="w-4 h-4" />
      </span>

      <span className="resume-btn__label">{label}</span>

      <span className="resume-btn__arrow" aria-hidden="true">
        <ArrowUpRight className="w-3.5 h-3.5" />
      </span>
    </button>
  );
}

export default ResumeSpotlight;
