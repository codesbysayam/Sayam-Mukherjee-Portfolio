import React, { useEffect, useState, useRef } from "react";

export interface ReadingProgressBarProps {
  containerRef?: React.RefObject<HTMLElement | null>;
  targetRef?: React.RefObject<HTMLElement | null>;
  height?: number;
  className?: string;
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
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    if (containerRef) {
      const attachToContainer = () => {
        const container = containerRef.current;
        if (!container) {
          if (!cancelled) {
            requestAnimationFrame(attachToContainer);
          }
          return;
        }

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
        cleanup = () => {
          container.removeEventListener("scroll", handleContainerScroll);
        };
      };

      attachToContainer();

      return () => {
        cancelled = true;
        if (cleanup) cleanup();
      };
    }

    const handleWindowScroll = () => {
      if (targetRef && targetRef.current) {
        const rect = targetRef.current.getBoundingClientRect();
        const elementHeight = rect.height;
        const windowHeight = window.innerHeight;

        const totalDistance = elementHeight - windowHeight + 100;
        if (totalDistance <= 0) {
          setProgress(100);
          return;
        }

        const scrolled = -rect.top + 60;
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
      className={`w-full bg-[var(--surface)] relative z-30 overflow-hidden ${className}`}
      style={{ height: `${height}px` }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <div
        ref={progressBarRef}
        className="h-full bg-[#C7E34A] transition-[width] duration-75 ease-out"
        style={{ width: `${progress}%` }}
      />
      {showPercentage && progress > 2 && (
        <span className="absolute right-2 top-1 text-[9px] font-mono text-[var(--text-muted)] bg-[var(--surface-2)] px-1 rounded-[4px] border border-[var(--border)] pointer-events-none tabular-nums">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
};

export default ReadingProgressBar;
