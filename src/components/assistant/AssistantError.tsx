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
      <div className="max-w-[90%] rounded-[10px] rounded-tl-[4px] px-3.5 py-3 text-xs sm:text-sm bg-[var(--surface)] border border-[var(--danger)]/40 text-[var(--text)] space-y-2">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-[var(--danger)] shrink-0 mt-0.5" />
          <p className="leading-relaxed font-sans text-xs sm:text-sm">{message}</p>
        </div>
        {onRetry && (
          <div className="pt-1 pl-6">
            <button
              type="button"
              onClick={onRetry}
              className="btn btn-secondary !min-h-[30px] !min-w-0 !px-2.5 !py-1 text-[11px] font-mono"
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
