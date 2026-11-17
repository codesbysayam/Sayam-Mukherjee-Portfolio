import { ReactNode } from "react";

interface SectionHeaderProps {
  id?: string;
  eyebrow?: string;
  title: string | ReactNode;
  description?: string | ReactNode;
  action?: ReactNode;
  badge?: string;
  className?: string;
  level?: "h1" | "h2" | "h3";
}

export function SectionHeader({
  id,
  eyebrow,
  title,
  description,
  action,
  badge,
  className = "",
  level = "h2"
}: SectionHeaderProps) {
  const HeadingTag = level;

  return (
    <div id={id} className={`space-y-3 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2.5 max-w-3xl">
          {(eyebrow || badge) && (
            <div className="flex items-center gap-2.5 flex-wrap text-xs font-mono">
              {eyebrow && (
                <span className="font-semibold tracking-wider uppercase text-[var(--accent)]">
                  {eyebrow}
                </span>
              )}
              {badge && (
                <>
                  <span className="text-[var(--text-faint)]" aria-hidden="true">/</span>
                  <span className="text-[var(--text-muted)] font-medium">{badge}</span>
                </>
              )}
            </div>
          )}

          <HeadingTag
            className="font-extrabold text-[var(--text)] font-display tracking-tight leading-[1.06] text-balance"
            style={{ fontSize: "clamp(2rem, 3.6vw, 3.35rem)" }}
          >
            {title}
          </HeadingTag>

          {description && (
            <div className="text-sm sm:text-base text-[var(--text-secondary)] font-sans leading-relaxed pt-0.5 max-w-2xl">
              {description}
            </div>
          )}
        </div>

        {action && <div className="shrink-0 pt-1 sm:pt-0">{action}</div>}
      </div>
    </div>
  );
}

export default SectionHeader;
