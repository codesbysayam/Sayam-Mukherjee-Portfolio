import { useId, type SVGProps } from "react";

type ResumeGlyphProps = SVGProps<SVGSVGElement>;

/**
 * Distinctive Resume Glyph combining layered document geometry,
 * an AI/Engineering cyan signature line, and a verified checkmark badge.
 * Uses React useId() to ensure SVG gradient IDs are globally collision-free.
 */
export function ResumeGlyph(props: ResumeGlyphProps) {
  const uniqueId = useId().replace(/:/g, "_");
  const gradientId = `resume-glyph-grad-${uniqueId}`;
  const fillId = `resume-glyph-fill-${uniqueId}`;

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="8"
          y1="8"
          x2="56"
          y2="56"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#D8B4FE" />
          <stop offset="0.52" stopColor="#A855F7" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>

        <linearGradient
          id={fillId}
          x1="12"
          y1="10"
          x2="52"
          y2="56"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#A855F7" stopOpacity=".18" />
          <stop offset="1" stopColor="#22D3EE" stopOpacity=".05" />
        </linearGradient>
      </defs>

      {/* Main Document Body */}
      <rect
        x="9"
        y="7"
        width="39"
        height="49"
        rx="9"
        fill={`url(#${fillId})`}
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
      />

      {/* Primary Highlight Rule */}
      <path
        d="M18 20H37"
        stroke={`url(#${gradientId})`}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Secondary Data Stream */}
      <path
        d="M18 29H39"
        stroke="currentColor"
        strokeOpacity=".82"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Tertiary Rule */}
      <path
        d="M18 37H34"
        stroke="currentColor"
        strokeOpacity=".58"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Verification Seal Badge */}
      <rect
        x="35"
        y="37"
        width="19"
        height="19"
        rx="6"
        fill="#0d0b14"
        stroke="#A855F7"
        strokeWidth="1.5"
      />

      {/* Verified Checkmark Motif */}
      <path
        d="M40 46L44 50L50 43"
        stroke="#22D3EE"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ResumeGlyph;
