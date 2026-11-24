import React, { memo } from "react";
import { FolderGit2, GraduationCap, Code2, Layers, Award, BookOpen } from "lucide-react";

export interface SuggestionItem {
  id: string;
  label: string;
  query: string;
  icon: React.ElementType;
}

export const ASSISTANT_SUGGESTIONS: SuggestionItem[] = [
  {
    id: "projects",
    label: "Projects",
    query: "What projects has Sayam worked on?",
    icon: FolderGit2,
  },
  {
    id: "education",
    label: "Education",
    query: "What is Sayam's educational background?",
    icon: GraduationCap,
  },
  {
    id: "github",
    label: "GitHub",
    query: "What can you tell me about Sayam's GitHub activity?",
    icon: Code2,
  },
  {
    id: "skills",
    label: "Skills",
    query: "What technologies and skills does Sayam work with?",
    icon: Layers,
  },
  {
    id: "certificates",
    label: "Certificates",
    query: "What certificates and credentials are listed in Sayam's portfolio?",
    icon: Award,
  },
  {
    id: "journal",
    label: "Journal",
    query: "What has Sayam written about recently?",
    icon: BookOpen,
  },
];

interface AssistantSuggestionsProps {
  onSelect: (query: string) => void;
  disabled?: boolean;
}

export const AssistantSuggestions = memo(function AssistantSuggestions({
  onSelect,
  disabled = false,
}: AssistantSuggestionsProps) {
  return (
    <div className="assistant-suggestions-bar">
      <div className="flex items-center justify-between pb-1.5 px-0.5">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--text-faint)] font-semibold">
          Explore
        </span>
      </div>

      <div
        className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none sm:flex-wrap"
        role="group"
        aria-label="Suggested topics"
      >
        {ASSISTANT_SUGGESTIONS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(item.query)}
              className="inline-flex items-center gap-1.5 min-h-[38px] [@media(pointer:coarse)]:min-h-[44px] px-3 py-1.5 rounded-[6px] text-xs font-medium text-[var(--text-secondary)] bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-strong)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] active:scale-97 transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none shrink-0"
            >
              <Icon className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
});
