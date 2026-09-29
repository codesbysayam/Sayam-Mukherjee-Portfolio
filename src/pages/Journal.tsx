import React, { useState, useEffect } from "react";
import { JournalList } from "../components/journal/JournalList";
import { JournalDetail } from "./JournalDetail";

export function Journal() {
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

  if (activeSlug) {
    return (
      <div className="w-full py-4 sm:py-6">
        <JournalDetail
          slug={activeSlug}
          onBack={handleBack}
          onSelectEntry={handleSelectEntry}
        />
      </div>
    );
  }

  return (
    <div className="w-full py-4 sm:py-6">
      <JournalList onSelectEntry={handleSelectEntry} />
    </div>
  );
}

export default Journal;
