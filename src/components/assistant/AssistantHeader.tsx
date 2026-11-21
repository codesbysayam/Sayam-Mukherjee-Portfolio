import React, { memo } from "react";
import { Compass, RotateCcw, X } from "lucide-react";

interface AssistantHeaderProps {
  onClear: () => void;
  onClose: () => void;
  isGenerating?: boolean;
}

export const AssistantHeader = memo(function AssistantHeader({
  onClear,
  onClose,
  isGenerating = false,
}: AssistantHeaderProps) {
  return (
    <header className="assistant-header flex items-center justify-between px-3.5 sm:px-4 py-2.5 sm:py-3 border-b border-[var(--border)] bg-[var(--surface-2)]">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-[6px] bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)] shrink-0">
          <Compass className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex flex-col justify-center">
          <h2
            id="assistant-panel-title"
            className="text-sm font-bold text-[var(--text)] font-display tracking-tight truncate leading-none"
          >
            Sayam&apos;s Guide
          </h2>
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] mt-1 leading-none font-mono">
            <span className="truncate">Portfolio Guide</span>
            <span className="text-[var(--text-faint)]" aria-hidden="true">·</span>
            <span className="text-[var(--accent)] font-semibold">Ready</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0 ml-2">
        <button
          type="button"
          onClick={onClear}
          disabled={isGenerating}
          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-[6px] text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          title="Clear conversation"
          aria-label="Clear conversation"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden xs:inline">Clear</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-[6px] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-colors cursor-pointer flex items-center justify-center"
          title="Close assistant (Esc)"
          aria-label="Close assistant"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
});
