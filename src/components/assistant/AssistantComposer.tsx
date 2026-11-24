import React, { useState, useRef, useEffect, memo } from "react";
import { ArrowUp, Square } from "lucide-react";

interface AssistantComposerProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isGenerating: boolean;
  disabled?: boolean;
}

const MAX_CHAR_LIMIT = 1000;

export const AssistantComposer = memo(function AssistantComposer({
  onSend,
  onStop,
  isGenerating,
  disabled = false,
}: AssistantComposerProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const nextHeight = Math.min(el.scrollHeight, 110);
    el.style.height = `${Math.max(nextHeight, 38)}px`;
  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const trimmed = text.trim();
      if (!isGenerating && trimmed.length > 0 && !disabled) {
        setText("");
        onSend(trimmed);
      }
    }
  };

  const handleSendClick = () => {
    const trimmed = text.trim();
    if (!isGenerating && trimmed.length > 0 && !disabled) {
      setText("");
      onSend(trimmed);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    if (next.length <= MAX_CHAR_LIMIT) {
      setText(next);
    }
  };

  const isOverWarningThreshold = text.length > 800;

  return (
    <div className="assistant-composer-bar p-2.5 sm:p-3 border-t border-[var(--border)] bg-[var(--surface-2)]">
      <div className="relative flex items-end gap-2 bg-[var(--bg)] border border-[var(--border)] focus-within:border-[var(--accent)] rounded-[8px] px-2.5 py-1.5 transition-colors">
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          disabled={disabled}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask about Sayam’s projects, education, skills, GitHub..."
          className="w-full bg-transparent text-base sm:text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] resize-none outline-none leading-relaxed max-h-[110px] py-1 font-sans"
          aria-label="Ask Sayam's Portfolio Guide"
        />

        <div className="flex items-center gap-1.5 shrink-0 pb-0.5">
          {isOverWarningThreshold && (
            <span className="text-[11px] font-mono text-[var(--warning)] pr-1 tabular-nums">
              {text.length}/{MAX_CHAR_LIMIT}
            </span>
          )}

          {isGenerating ? (
            <button
              type="button"
              onClick={onStop}
              className="w-11 h-11 min-w-[44px] min-h-[44px] sm:w-10 sm:h-10 sm:min-w-[40px] sm:min-h-[40px] rounded-[6px] flex items-center justify-center bg-[var(--surface)] border border-[var(--border-strong)] text-[var(--text)] hover:bg-[var(--text)] hover:text-[var(--bg)] transition-colors cursor-pointer"
              title="Stop generating"
              aria-label="Stop response"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSendClick}
              disabled={text.trim().length === 0 || disabled}
              className="w-11 h-11 min-w-[44px] min-h-[44px] sm:w-10 sm:h-10 sm:min-w-[40px] sm:min-h-[40px] rounded-[6px] flex items-center justify-center bg-[var(--accent-fill)] text-[var(--accent-contrast)] hover:bg-[var(--accent-strong)] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              title="Send message (Enter)"
              aria-label="Send message"
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      <div className="assistant-composer-hint flex items-center justify-between px-1 pt-1.5 text-[11px] text-[var(--text-muted)] font-mono">
        <span>Enter = send · Shift + Enter = new line</span>
        <span className="text-[var(--text-faint)]">Verified data</span>
      </div>
    </div>
  );
});

export default AssistantComposer;
