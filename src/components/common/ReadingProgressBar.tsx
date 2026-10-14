import React, { useEffect, useState, useRef } from "react";

export interface ReadingProgressBarProps {
  /**
   * Optional ref to a scrollable container (e.g. inside a modal).
   * If omitted, calculates progress based on window scroll through targetElementRef or the whole document.
   */
  containerRef?: React.RefObject<HTMLElement | null>;
  /**
   * Optional ref to the specific content/article element to track.
   */
  targetRef?: React.RefObject<HTMLElement | null>;
  /**
   * Height in px of the progress bar (default: 3px).
   */
  height?: number;
  /**
   * Custom CSS class name for styling container.
   */
  className?: string;
  /**
   * Whether to show a floating or embedded percentage pill.
   */
  showPercentage?: boolean;
}

export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({
  containerRef,
  targetRef,
  height = 3,
  className = "",
  showPercentage = false,
}) => {
  const [progress, setProgress] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Container-based scrolling (e.g. inside a modal dialog)
    if (containerRef && containerRef.current) {
      const container = containerRef.current;
      const handleContainerScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = container;
        const maxScroll = scrollHeight - clientHeight;
        if (maxScroll <= 0) {
          setProgress(100);
          return;
        }
        const pct = Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
        setProgress(pct);
      };

      container.addEventListener("scroll", handleContainerScroll, { passive: true });
      handleContainerScroll();
      return () => {
        container.removeEventListener("scroll", handleContainerScroll);
      };
    }

    // 2. Window-based scrolling through a target element or entire document
    const handleWindowScroll = () => {
      if (targetRef && targetRef.current) {
        const rect = targetRef.current.getBoundingClientRect();
        const elementHeight = rect.height;
        const windowHeight = window.innerHeight;

        // Article starts at top of viewport
        const totalDistance = elementHeight - windowHeight + 100;
        if (totalDistance <= 0) {
          setProgress(100);
          return;
        }

        const scrolled = -rect.top + 60; // offset for sticky header
        const pct = Math.min(100, Math.max(0, (scrolled / totalDistance) * 100));
        setProgress(pct);
      } else {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight <= 0) {
          setProgress(0);
          return;
        }
        const pct = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
        setProgress(pct);
      }
    };

    window.addEventListener("scroll", handleWindowScroll, { passive: true });
    window.addEventListener("resize", handleWindowScroll, { passive: true });
    handleWindowScroll();

    return () => {
      window.removeEventListener("scroll", handleWindowScroll);
      window.removeEventListener("resize", handleWindowScroll);
    };
  }, [containerRef, targetRef]);

  return (
    <div
      className={`w-full bg-zinc-200/50 dark:bg-zinc-800/40 relative z-30 overflow-hidden ${className}`}
      style={{ height: `${height}px` }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <div
        ref={progressBarRef}
        className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 transition-[width] duration-75 ease-out rounded-r-full shadow-[0_0_8px_rgba(168,85,247,0.4)]"
        style={{ width: `${progress}%` }}
      />
      {showPercentage && progress > 2 && (
        <span className="absolute right-2 top-1 text-[9px] font-mono text-zinc-400 bg-zinc-900/80 px-1 rounded border border-zinc-800 pointer-events-none">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
};

export default ReadingProgressBar;
