import React, { useState, useRef, useEffect, memo } from "react";
import { ArrowUp, Square } from "lucide-react";

interface AssistantComposerProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isGenerating: boolean;
  disabled?: boolean;
}

const MAX_CHAR_LIMIT = 1000;

/**
 * AssistantComposer
 * Completely isolates the text input state locally.
 * Prevents re-rendering the parent PortfolioAssistant or the message history on every keystroke!
 */
export const AssistantComposer = memo(function AssistantComposer({
  onSend,
  onStop,
  isGenerating,
  disabled = false,
}: AssistantComposerProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height up to 110px
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
    <div className="assistant-composer-bar p-2.5 sm:p-3 border-t border-white/[0.08] bg-zinc-950/85 backdrop-blur-md">
      <div className="relative flex items-end gap-2 bg-white/[0.04] border border-white/[0.10] focus-within:border-white/25 focus-within:bg-white/[0.06] rounded-xl px-2.5 py-1.5 transition-all shadow-xs">
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          disabled={disabled}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask about Sayam’s projects, education, skills, GitHub..."
          className="w-full bg-transparent text-[13px] sm:text-sm text-zinc-100 placeholder:text-zinc-500 resize-none outline-none leading-relaxed max-h-[110px] py-1 font-sans"
          aria-label="Ask Sayam's Portfolio Assistant"
        />

        <div className="flex items-center gap-1.5 shrink-0 pb-0.5">
          {isOverWarningThreshold && (
            <span className="text-[10px] font-mono text-amber-400/80 pr-1">
              {text.length}/{MAX_CHAR_LIMIT}
            </span>
          )}

          {isGenerating ? (
            <button
              type="button"
              onClick={onStop}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white transition-all cursor-pointer shadow-xs focus:outline-hidden focus:ring-1 focus:ring-white/20"
              title="Stop generating"
              aria-label="Stop response"
            >
              <Square className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSendClick}
              disabled={text.trim().length === 0 || disabled}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-white text-zinc-950 hover:bg-zinc-200 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-xs focus:outline-hidden focus:ring-1 focus:ring-purple-400"
              title="Send message (Enter)"
              aria-label="Send message"
            >
              <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-1 pt-1.5 text-[10px] text-zinc-400 font-mono">
        <span>Enter = send &bull; Shift + Enter = new line</span>
        <span className="text-zinc-500">Verified portfolio data</span>
      </div>
    </div>
  );
});

export default AssistantComposer;
