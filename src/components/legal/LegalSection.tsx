import React from "react";

interface LegalSectionProps {
  id: string;
  number?: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const LegalSection: React.FC<LegalSectionProps> = ({
  id,
  number,
  title,
  children,
  className = "",
}) => {
  return (
    <section
      id={id}
      className={`scroll-mt-24 sm:scroll-mt-28 pt-8 sm:pt-12 first:pt-0 border-t first:border-t-0 border-[var(--border)] ${className}`}
    >
      <div className="flex items-baseline gap-3 mb-4">
        {number && (
          <span className="text-xs font-mono font-semibold text-[var(--accent)] select-none shrink-0 tabular-nums">
            {number}
          </span>
        )}
        <h2 className="text-[clamp(1.35rem,2.2vw,1.85rem)] font-bold tracking-[-0.025em] text-[var(--text)] font-display">
          {title}
        </h2>
      </div>

      <div className="text-[16px] sm:text-[17px] leading-[1.75] text-[var(--text-secondary)] font-sans space-y-4 max-w-[760px]">
        {children}
      </div>
    </section>
  );
};

export default LegalSection;
