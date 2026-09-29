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
    <div className="space-y-2 pt-2 pb-1">
      <div className="flex items-center justify-between px-0.5">
        <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-medium">
          Explore
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Suggested topics">
        {ASSISTANT_SUGGESTIONS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(item.query)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 dark:text-zinc-300 bg-zinc-900/80 dark:bg-zinc-900/90 border border-zinc-800/90 hover:border-zinc-700 hover:text-white hover:bg-zinc-850 active:scale-97 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              <Icon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-200" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
});
