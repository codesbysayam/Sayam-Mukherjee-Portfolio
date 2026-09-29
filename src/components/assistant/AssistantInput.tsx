import React, { useRef, useEffect } from "react";
import { ArrowUp, Square } from "lucide-react";

interface AssistantInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onStop: () => void;
  isGenerating: boolean;
  disabled?: boolean;
}

const MAX_CHAR_LIMIT = 1000;

export const AssistantInput: React.FC<AssistantInputProps> = ({
  value,
  onChange,
  onSend,
  onStop,
  isGenerating,
  disabled = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height up to 120px
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const nextHeight = Math.min(el.scrollHeight, 120);
    el.style.height = `${Math.max(nextHeight, 44)}px`;
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isGenerating && value.trim().length > 0) {
        onSend();
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    if (next.length <= MAX_CHAR_LIMIT) {
      onChange(next);
    }
  };

  const isOverWarningThreshold = value.length > 800;

  return (
    <div className="chat-input-container relative p-3 border-t border-zinc-800/80 bg-zinc-950/80 dark:bg-zinc-950/90 backdrop-blur-md">
      <div className="relative flex items-end gap-2 bg-zinc-900/90 dark:bg-zinc-900/90 border border-zinc-800/90 focus-within:border-zinc-700 rounded-xl px-3 py-2 transition-all shadow-xs">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          disabled={disabled}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask about Sayam’s projects, education, skills, GitHub..."
          className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 resize-none outline-none leading-relaxed max-h-[120px] py-1 font-sans"
          aria-label="Ask Sayam's Portfolio Assistant"
        />

        <div className="flex items-center gap-1.5 shrink-0 pb-0.5">
          {isOverWarningThreshold && (
            <span className="text-[10px] font-mono text-amber-400/80 pr-1">
              {value.length}/{MAX_CHAR_LIMIT}
            </span>
          )}

          {isGenerating ? (
            <button
              type="button"
              onClick={onStop}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white transition-all cursor-pointer shadow-xs"
              title="Stop generating"
              aria-label="Stop response"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onSend}
              disabled={value.trim().length === 0 || disabled}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-white text-zinc-950 hover:bg-zinc-200 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-xs"
              title="Send message (Enter)"
              aria-label="Send message"
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between px-1 pt-1.5 text-[10px] text-zinc-400 font-mono">
        <span>Press Enter to send, Shift + Enter for new line</span>
      </div>
    </div>
  );
};
