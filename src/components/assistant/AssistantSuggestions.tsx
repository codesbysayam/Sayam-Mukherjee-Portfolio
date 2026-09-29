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
        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-semibold">
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
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-300 bg-white/[0.04] border border-white/[0.08] hover:border-white/20 hover:text-white hover:bg-white/[0.08] active:scale-97 transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none shrink-0"
            >
              <Icon className="w-3.5 h-3.5 text-zinc-400" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
});
