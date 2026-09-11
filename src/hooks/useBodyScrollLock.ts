import { useEffect } from "react";

/**
 * Custom hook to lock body scrolling when a modal/overlay is open.
 * - Saves previous overflow and paddingRight values.
 * - Prevents layout jump by compensating for the scrollbar width.
 * - Cleans up reliably on close, unmount, or route change.
 */
export function useBodyScrollLock(isLocked: boolean): void {
  useEffect(() => {
    if (!isLocked || typeof document === "undefined") return;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isLocked]);
}
