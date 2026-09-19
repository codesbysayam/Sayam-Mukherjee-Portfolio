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
      className={`scroll-mt-24 sm:scroll-mt-28 pt-8 sm:pt-12 first:pt-0 border-t first:border-t-0 border-zinc-200/80 dark:border-zinc-800/80 ${className}`}
    >
      <div className="flex items-baseline gap-3 mb-4">
        {number && (
          <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500 select-none shrink-0">
            {number}
          </span>
        )}
        <h2 className="text-[clamp(1.35rem,2.2vw,1.85rem)] font-semibold tracking-[-0.025em] text-zinc-900 dark:text-zinc-100 font-sans">
          {title}
        </h2>
      </div>

      <div className="text-[16px] sm:text-[17px] leading-[1.75] text-zinc-600 dark:text-zinc-300 font-sans space-y-4 max-w-[760px]">
        {children}
      </div>
    </section>
  );
};

export default LegalSection;
