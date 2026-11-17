import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { JournalList } from "../components/journal/JournalList";
import { JournalDetail } from "./JournalDetail";
import { MOTION_DURATION, MOTION_EASE, usePrefersReducedMotion } from "../motion/tokens";

export function Journal() {
  const prefersReduced = usePrefersReducedMotion();

  const getSlugFromPath = (): string | null => {
    if (typeof window === "undefined") return null;
    const path = window.location.pathname.replace(/\/+$/, "");
    if (path.startsWith("/journal/") && path.length > 9) {
      return path.slice(9);
    }
    return null;
  };

  const [activeSlug, setActiveSlug] = useState<string | null>(getSlugFromPath);

  useEffect(() => {
    const handlePopState = () => {
      setActiveSlug(getSlugFromPath());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleSelectEntry = (slug: string) => {
    setActiveSlug(slug);
    window.history.pushState(null, "", `/journal/${slug}`);
  };

  const handleBack = () => {
    setActiveSlug(null);
    window.history.pushState(null, "", "/journal");
  };

  return (
    <div id="journal-section" className="w-full py-4 sm:py-6 scroll-mt-24">
      <AnimatePresence mode="wait" initial={false}>
        {activeSlug ? (
          <motion.div
            key={`detail-${activeSlug}`}
            initial={prefersReduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: prefersReduced ? 0 : MOTION_DURATION.ui, ease: MOTION_EASE.out }}
          >
            <JournalDetail
              slug={activeSlug}
              onBack={handleBack}
              onSelectEntry={handleSelectEntry}
            />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={prefersReduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: prefersReduced ? 0 : MOTION_DURATION.ui, ease: MOTION_EASE.out }}
          >
            <JournalList onSelectEntry={handleSelectEntry} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Journal;
