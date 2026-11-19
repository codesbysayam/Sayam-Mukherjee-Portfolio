import type { ReactNode } from "react";
import { EditorialReveal, LineReveal } from "../../motion/Reveal";

interface SectionHeadingProps {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  italicHighlight?: ReactNode;
  description?: string;
  rightSlot?: ReactNode;
  level?: "h1" | "h2";
  immediate?: boolean;
  darkSurface?: boolean;
  className?: string;
  withDivider?: boolean;
}

/**
 * Standardized editorial section header enforcing typographic scale, hairline borders,
 * mono eyebrow index, and unified reveal timing across all routes.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  italicHighlight,
  description,
  rightSlot,
  level = "h2",
  immediate = false,
  darkSurface = false,
  className = "",
  withDivider = true,
}: SectionHeadingProps) {
  const HeadingTag = level;
  const textColor = darkSurface ? "text-[#F4F4ED]" : "text-[var(--text)]";
  const secondaryColor = darkSurface ? "text-[#B5B8AA]" : "text-[var(--text-secondary)]";
  const accentColor = darkSurface ? "text-[#C7E34A]" : "text-[var(--accent)]";
  const dividerColor = darkSurface ? "!bg-[#41443A]" : "";

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <EditorialReveal immediate={immediate} className="space-y-3 max-w-3xl">
          <div className={`flex items-center gap-2.5 editorial-overline ${accentColor}`}>
            {index && <span className="tabular-nums">{index}</span>}
            {index && <span aria-hidden="true">/</span>}
            <span>{eyebrow}</span>
          </div>

          <HeadingTag
            className={`font-display font-extrabold tracking-[-0.03em] leading-[0.98] text-balance ${textColor}`}
            style={{
              fontSize:
                level === "h1"
                  ? "clamp(2.2rem, 5.2vw, 4.4rem)"
                  : "clamp(1.75rem, 3.6vw, 3.1rem)",
            }}
          >
            {title}
            {italicHighlight && (
              <>
                {" "}
                <span className={`font-serif-editorial italic font-normal ${accentColor}`}>
                  {italicHighlight}
                </span>
              </>
            )}
          </HeadingTag>

          {description && (
            <p className={`text-sm sm:text-base leading-relaxed max-w-2xl font-sans ${secondaryColor}`}>
              {description}
            </p>
          )}
        </EditorialReveal>

        {rightSlot && <div className="shrink-0 self-start md:self-end">{rightSlot}</div>}
      </div>

      {withDivider && <LineReveal immediate={immediate} className={dividerColor} />}
    </div>
  );
}

export default SectionHeading;
