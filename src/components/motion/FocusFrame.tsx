import { useId, useRef, useState, type ReactNode } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { usePrefersReducedMotion } from "../../motion/tokens";
import { Flip, requestScrollTriggerRefresh } from "../../motion/gsapRegistry";

interface FocusFrameProps {
  title: string;
  eyebrow?: string;
  summary?: string;
  children: ReactNode;
  expandedContent?: ReactNode;
  darkSurface?: boolean;
  className?: string;
}

/**
 * GSAP Flip-powered architectural focus-frame expand/collapse container.
 * Animates shared-layout expansion cleanly without overlapping page sections
 * and degrades instantly under prefers-reduced-motion.
 */
export function FocusFrame({
  title,
  eyebrow = "Focus Frame",
  summary,
  children,
  expandedContent,
  darkSurface = false,
  className = "",
}: FocusFrameProps) {
  const reduced = usePrefersReducedMotion();
  const [focused, setFocused] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const toggleFocus = () => {
    const el = frameRef.current;
    if (!reduced && el) {
      const state = Flip.getState(el);
      setFocused((prev) => !prev);
      requestAnimationFrame(() => {
        Flip.from(state, {
          duration: 0.42,
          ease: "power3.out",
          nested: true,
          onComplete: () => requestScrollTriggerRefresh(60),
        });
      });
    } else {
      setFocused((prev) => !prev);
      requestScrollTriggerRefresh(60);
    }
  };

  return (
    <div
      ref={frameRef}
      data-focused={focused}
      className={`focus-frame-shell ${
        darkSurface ? "!bg-[#151713] !border-[#41443A] text-[#F4F4ED]" : ""
      } ${className}`}
    >
      <div
        className={`flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b ${
          darkSurface
            ? "border-[#41443A] bg-[#20231D]"
            : "border-[var(--border)] bg-[var(--surface)]"
        }`}
      >
        <div className="min-w-0 space-y-0.5">
          <span
            className={`font-mono text-[10px] font-semibold uppercase tracking-[0.12em] block ${
              darkSurface ? "text-[#C7E34A]" : "text-[var(--accent)]"
            }`}
          >
            {eyebrow}
          </span>
          <h3
            className={`font-display text-sm sm:text-base font-bold truncate ${
              darkSurface ? "text-[#F4F4ED]" : "text-[var(--text)]"
            }`}
          >
            {title}
          </h3>
        </div>

        <button
          type="button"
          onClick={toggleFocus}
          aria-expanded={focused}
          aria-controls={panelId}
          className={`inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1 rounded-[6px] border text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
            darkSurface
              ? "border-[#41443A] bg-[#151713] hover:border-[#C7E34A] text-[#F4F4ED]"
              : "border-[var(--border-strong)] bg-[var(--surface-2)] hover:border-[var(--accent)] text-[var(--text)]"
          }`}
        >
          {focused ? (
            <>
              <Minimize2
                className={`w-3.5 h-3.5 ${darkSurface ? "text-[#C7E34A]" : "text-[var(--accent)]"}`}
              />
              <span>Exit Focus</span>
            </>
          ) : (
            <>
              <Maximize2
                className={`w-3.5 h-3.5 ${darkSurface ? "text-[#C7E34A]" : "text-[var(--accent)]"}`}
              />
              <span>Focus View</span>
            </>
          )}
        </button>
      </div>

      <div id={panelId} className="focus-frame-panel">
        <div className={focused ? "p-4 sm:p-6 space-y-5" : ""}>
          {children}

          {focused && (expandedContent || summary) && (
            <div
              className={`pt-4 border-t space-y-3 ${
                darkSurface ? "border-[#41443A]" : "border-[var(--border)]"
              }`}
            >
              {summary && (
                <p
                  className={`text-xs sm:text-sm leading-relaxed ${
                    darkSurface ? "text-[#D4D6CA]" : "text-[var(--text-secondary)]"
                  }`}
                >
                  {summary}
                </p>
              )}
              {expandedContent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FocusFrame;
