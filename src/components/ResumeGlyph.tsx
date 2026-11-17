import { type SVGProps } from "react";

type ResumeGlyphProps = SVGProps<SVGSVGElement>;

/**
 * Minimal architectural Resume icon aligned with DESIGN.md Ink/Moss/Signal palette.
 */
export function ResumeGlyph(props: ResumeGlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <rect
        x="4"
        y="3"
        width="14"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M8 8H14M8 12H14M8 16H11"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="17.5" cy="17.5" r="3.5" fill="#C7E34A" stroke="#20231D" strokeWidth="1.25" />
    </svg>
  );
}

export default ResumeGlyph;
