import React from "react";

export interface EditorialSectionHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  italicHighlight?: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  level?: "h1" | "h2";
  className?: string;
  children?: React.ReactNode;
}

export function EditorialSectionHeader({
  eyebrow,
  title,
  italicHighlight,
  description,
  align = "left",
  level = "h2",
  className = "",
  children,
}: EditorialSectionHeaderProps) {
  const isCentered = align === "center";
  const HeadingTag = level;

  return (
    <div
      className={`space-y-3 ${
        isCentered ? "text-center mx-auto max-w-3xl" : "text-left"
      } ${className}`}
    >
      {eyebrow && (
        <span className="block font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
          {eyebrow}
        </span>
      )}

      <div
        className={`flex flex-col gap-4 ${
          isCentered
            ? "items-center"
            : "md:flex-row md:items-end md:justify-between"
        }`}
      >
        <div className={`space-y-2.5 ${isCentered ? "max-w-2xl" : "max-w-3xl"}`}>
          <HeadingTag
            className="font-display font-extrabold tracking-[-0.03em] leading-[1.06] text-[var(--text)] text-balance"
            style={{
              fontSize:
                level === "h1"
                  ? "clamp(2rem, 4.4vw, 3.6rem)"
                  : "clamp(1.5rem, 3vw, 2.5rem)",
            }}
          >
            {title}
            {italicHighlight ? (
              <>
                {" "}
                <span className="font-serif-editorial italic font-normal text-[var(--accent)]">
                  {italicHighlight}
                </span>
              </>
            ) : null}
          </HeadingTag>

          {description && (
            <p
              className={`text-sm sm:text-base leading-relaxed text-[var(--text-secondary)] font-sans ${
                isCentered ? "mx-auto max-w-[60ch]" : "max-w-[62ch]"
              }`}
            >
              {description}
            </p>
          )}
        </div>

        {children && <div className="shrink-0">{children}</div>}
      </div>
    </div>
  );
}

export default EditorialSectionHeader;
