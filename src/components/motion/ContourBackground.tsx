import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../../motion/tokens";

interface ContourBackgroundProps {
  className?: string;
  density?: "subtle" | "medium";
  tone?: "adaptive" | "lime-on-dark";
}

/**
 * Animated organic SVG contour-line layer inspired by topographic field plots.
 * Uses pure CSS stroke-dashoffset transforms and automatically pauses offscreen
 * or under prefers-reduced-motion.
 */
export function ContourBackground({
  className = "",
  density = "subtle",
  tone = "adaptive",
}: ContourBackgroundProps) {
  const reduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.02 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const strokeClass =
    tone === "lime-on-dark"
      ? density === "medium"
        ? "stroke-[#C7E34A]/[0.18]"
        : "stroke-[#C7E34A]/[0.11]"
      : density === "medium"
        ? "stroke-[#69734A]/[0.16] dark:stroke-[#C7E34A]/[0.16]"
        : "stroke-[#69734A]/[0.10] dark:stroke-[#C7E34A]/[0.11]";

  const secondaryStrokeClass =
    tone === "lime-on-dark"
      ? "stroke-[#F4F4ED]/[0.07]"
      : "stroke-[var(--text)]/[0.06]";

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${
        !inView || reduced ? "contour-paused" : ""
      } ${className}`}
    >
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        className="h-full w-full"
      >
        <path
          d="M-120 680C120 560 280 730 560 610C830 495 960 210 1540 270"
          className={`${strokeClass} contour-path`}
          strokeWidth="1.25"
        />
        <path
          d="M-90 745C170 635 340 790 615 675C885 560 1020 295 1560 350"
          className={`${secondaryStrokeClass} contour-path--slow`}
          strokeWidth="1"
        />
        <path
          d="M-140 190C150 260 365 75 675 160C960 240 1120 420 1520 155"
          className={`${strokeClass} contour-path--slow`}
          strokeWidth="1.15"
        />
        <path
          d="M-110 260C185 330 410 145 715 225C1005 300 1165 480 1550 225"
          className={`${secondaryStrokeClass} contour-path`}
          strokeWidth="0.95"
        />
        <path
          d="M180 -60C290 180 510 210 610 420C705 620 540 810 740 960"
          className={`${secondaryStrokeClass} contour-path`}
          strokeWidth="0.9"
        />
        <path
          d="M960 -50C860 175 1090 360 990 595C910 785 1130 890 1320 960"
          className={`${strokeClass} contour-path--slow`}
          strokeWidth="1.05"
        />
      </svg>
    </div>
  );
}

export default ContourBackground;
