import { ReactNode } from "react";

interface SectionHeaderProps {
  id?: string;
  eyebrow?: string;
  title: string | ReactNode;
  description?: string | ReactNode;
  action?: ReactNode;
  badge?: string;
  className?: string;
}

export function SectionHeader({
  id,
  eyebrow,
  title,
  description,
  action,
  badge,
  className = ""
}: SectionHeaderProps) {
  return (
    <div id={id} className={`space-y-3 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          {(eyebrow || badge) && (
            <div className="flex items-center gap-2 flex-wrap">
              {eyebrow && (
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                  {eyebrow}
                </span>
              )}
              {badge && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 text-purple-700 dark:text-purple-300 font-medium">
                  {badge}
                </span>
              )}
            </div>
          )}

          <h2 
            className="font-extrabold text-zinc-900 dark:text-white font-display tracking-tight leading-[1.12]"
            style={{ fontSize: "clamp(2rem, 3.2vw, 3rem)" }}
          >
            {title}
          </h2>

          {description && (
            <div className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed pt-0.5">
              {description}
            </div>
          )}
        </div>

        {action && (
          <div className="shrink-0 pt-1 sm:pt-0">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}

export default SectionHeader;
