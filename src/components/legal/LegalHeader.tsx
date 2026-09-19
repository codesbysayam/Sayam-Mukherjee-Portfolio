import React from "react";
import { ArrowLeft } from "lucide-react";

interface LegalHeaderProps {
  eyebrow?: string;
  title: string;
  lastUpdated: string;
  intro: string;
  onNavigateHome?: () => void;
}

export const LegalHeader: React.FC<LegalHeaderProps> = ({
  eyebrow = "LEGAL",
  title,
  lastUpdated,
  intro,
  onNavigateHome,
}) => {
  return (
    <header className="pt-2 sm:pt-4 pb-8 sm:pb-12 border-b border-zinc-200/80 dark:border-zinc-800/80">
      {onNavigateHome && (
        <div className="mb-6 sm:mb-8">
          <button
            onClick={onNavigateHome}
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Back to portfolio</span>
          </button>
        </div>
      )}

      <div className="space-y-4 max-w-[780px]">
        <div className="text-[12px] sm:text-[13px] uppercase font-semibold tracking-[0.08em] text-zinc-500 dark:text-zinc-400 font-sans">
          {eyebrow}
        </div>

        <h1 className="text-[clamp(2.5rem,5.5vw,4.75rem)] font-bold tracking-[-0.045em] leading-[0.98] text-zinc-900 dark:text-zinc-50 font-sans">
          {title}
        </h1>

        <div className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-sans pt-1">
          Last updated · {lastUpdated}
        </div>

        <p className="text-[18px] sm:text-[20px] leading-[1.65] text-zinc-700 dark:text-zinc-300 font-sans pt-2">
          {intro}
        </p>
      </div>
    </header>
  );
};

export default LegalHeader;
