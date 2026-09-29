import React, { memo } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

interface AssistantErrorProps {
  message?: string;
  onRetry?: () => void;
}

export const AssistantError = memo(function AssistantError({
  message = "I couldn't complete that response. Please try again.",
  onRetry,
}: AssistantErrorProps) {
  return (
    <div className="flex flex-col items-start w-full my-1.5 animate-fadeIn">
      <div className="max-w-[90%] rounded-2xl rounded-tl-xs px-3.5 py-3 text-xs sm:text-sm bg-rose-950/40 border border-rose-900/60 text-rose-200/90 shadow-xs backdrop-blur-xs space-y-2">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-sans">{message}</p>
        </div>
        {onRetry && (
          <div className="pt-1 pl-6">
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono text-rose-300 hover:text-white bg-rose-900/40 hover:bg-rose-900/60 border border-rose-800/60 transition-all cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-rose-400"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retry Query</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
});
