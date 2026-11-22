import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { JournalList } from "../components/journal/JournalList";
import { JournalDetail } from "./JournalDetail";
import { MOTION_DURATION, MOTION_EASE, usePrefersReducedMotion } from "../motion/tokens";

import { journalEntries } from "../data/journal";

export function Journal() {
  const prefersReduced = usePrefersReducedMotion();

  const resolveSlug = (candidate?: string | null): string | null => {
    if (!candidate) return null;
    const match = journalEntries.find(
      (entry) => entry.slug === candidate || entry.id === candidate
    );
    return match ? match.slug : candidate;
  };

  const getSlugFromPath = (customPath?: string): string | null => {
    if (typeof window === "undefined") return null;
    const path = (customPath ?? window.location.pathname).replace(/\/+$/, "");
    if (path.startsWith("/journal/") && path.length > 9) {
      return resolveSlug(path.slice(9));
    }
    return null;
  };

  const [activeSlug, setActiveSlug] = useState<string | null>(() => {
    const fromPath = getSlugFromPath();
    if (fromPath) return fromPath;
    if (typeof window !== "undefined") {
      try {
        const storedId = localStorage.getItem("portfolio_selected_article_id");
        if (storedId) {
          localStorage.removeItem("portfolio_selected_article_id");
          return resolveSlug(storedId);
        }
      } catch {}
    }
    return null;
  });

  useEffect(() => {
    const handlePopState = () => {
      setActiveSlug(getSlugFromPath());
    };
    const handleReset = () => {
      setActiveSlug(null);
    };
    const handleSync = (e: CustomEvent<{ path?: string }>) => {
      setActiveSlug(getSlugFromPath(e.detail?.path));
    };
    const handleSelectArticle = (e: CustomEvent<{ id?: string; slug?: string }>) => {
      const target = resolveSlug(e.detail?.slug || e.detail?.id);
      if (target) {
        setActiveSlug(target);
        try {
          localStorage.removeItem("portfolio_selected_article_id");
        } catch {}
        const targetPath = `/journal/${target}`;
        if (window.location.pathname !== targetPath) {
          window.history.pushState(null, "", targetPath);
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("portfolio-journal-reset", handleReset);
    window.addEventListener("portfolio-journal-sync", handleSync as EventListener);
    window.addEventListener("portfolio_select_article", handleSelectArticle as EventListener);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("portfolio-journal-reset", handleReset);
      window.removeEventListener("portfolio-journal-sync", handleSync as EventListener);
      window.removeEventListener("portfolio_select_article", handleSelectArticle as EventListener);
    };
  }, []);

  const handleSelectEntry = (slug: string) => {
    const resolved = resolveSlug(slug) || slug;
    setActiveSlug(resolved);
    window.history.pushState(null, "", `/journal/${resolved}`);
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
