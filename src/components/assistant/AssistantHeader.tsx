import React, { memo } from "react";
import { Bot, Sparkles, RotateCcw, X } from "lucide-react";

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
    <header className="assistant-header flex items-center justify-between px-3.5 sm:px-4 py-2.5 sm:py-3 border-b border-white/[0.08] bg-zinc-900/60 backdrop-blur-md">
      {/* Title & Status */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 text-zinc-200 shrink-0 shadow-inner">
          <Bot className="w-4 h-4 text-purple-300" />
          <span
            className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-zinc-950"
            aria-hidden="true"
          />
        </div>
        <div className="min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 leading-none">
            <h2
              id="assistant-panel-title"
              className="text-sm font-bold text-white font-display tracking-tight truncate"
            >
              Sayam's Agent
            </h2>
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" aria-hidden="true" />
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mt-1 leading-none">
            <span className="truncate">Portfolio Assistant</span>
            <span className="text-zinc-600" aria-hidden="true">•</span>
            <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              Online
            </span>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-1 shrink-0 ml-2">
        <button
          type="button"
          onClick={onClear}
          disabled={isGenerating}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-mono text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-white/20"
          title="Clear conversation"
          aria-label="Clear conversation"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden xs:inline">Clear</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08] active:scale-95 transition-all cursor-pointer flex items-center justify-center focus:outline-hidden focus:ring-1 focus:ring-white/20"
          title="Close assistant (Esc)"
          aria-label="Close assistant"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
});
