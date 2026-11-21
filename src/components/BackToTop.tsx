import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp } from "lucide-react";

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        setIsVisible(window.scrollY > 450);
        rafId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const scrollToTop = () => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.2 }}
          className="fixed z-30 bottom-[calc(64px+env(safe-area-inset-bottom,0px)+3.5rem)] right-[max(0.75rem,calc(env(safe-area-inset-right,0px)+0.5rem))] sm:right-5 xl:bottom-20 xl:right-6 flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-[6px] bg-[#20231D] text-[#F4F4ED] dark:bg-[#F4F4ED] dark:text-[#20231D] border border-[#41443A] dark:border-[#D6D7CC] shadow-lg hover:bg-[var(--accent-fill)] hover:text-[var(--accent-contrast)] hover:border-[var(--accent-fill)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          title="Scroll back to top"
          aria-label="Back to top"
        >
          <ArrowUp className="w-4 h-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
