import React from "react";

interface LegalFooterProps {
  onNavigateHome?: () => void;
  onNavigateTab?: (tab: "privacy" | "terms" | "contact" | "home") => void;
}

export const LegalFooter: React.FC<LegalFooterProps> = ({
  onNavigateHome,
  onNavigateTab,
}) => {
  const handleNav = (tab: "privacy" | "terms" | "contact" | "home") => {
    if (tab === "home" && onNavigateHome) {
      onNavigateHome();
      return;
    }
    if (onNavigateTab) {
      onNavigateTab(tab);
    }
  };

  return (
    <footer className="mt-16 pt-8 pb-12 border-t border-zinc-200/80 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-400 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="flex flex-col items-start gap-1 text-left">
          {onNavigateHome ? (
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                handleNav("home");
              }}
              className="font-display font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Sayam Mukherjee
            </a>
          ) : (
            <span className="font-display font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
              Sayam Mukherjee
            </span>
          )}
          <p className="text-xs text-zinc-500 dark:text-zinc-400 tracking-normal font-sans">
            AI &amp; ML CSE Undergraduate · Developer Portfolio
          </p>
          <p className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 mt-0.5">
            © 2026 Sayam Mukherjee. All rights reserved.
          </p>
        </div>

        <nav
          aria-label="Footer Legal Navigation"
          className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-xs sm:text-[13px] font-medium"
        >
          <a
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              handleNav("contact");
            }}
            className="inline-flex items-center min-h-[44px] px-2.5 py-1.5 rounded-md text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:underline underline-offset-4 transition-colors"
          >
            Contact
          </a>
          <span className="text-zinc-300 dark:text-zinc-700 select-none text-xs px-0.5" aria-hidden="true">
            ·
          </span>
          <a
            href="/privacy"
            onClick={(e) => {
              e.preventDefault();
              handleNav("privacy");
            }}
            className="inline-flex items-center min-h-[44px] px-2.5 py-1.5 rounded-md text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:underline underline-offset-4 transition-colors"
          >
            Privacy Policy
          </a>
          <span className="text-zinc-300 dark:text-zinc-700 select-none text-xs px-0.5" aria-hidden="true">
            ·
          </span>
          <a
            href="/terms"
            onClick={(e) => {
              e.preventDefault();
              handleNav("terms");
            }}
            className="inline-flex items-center min-h-[44px] px-2.5 py-1.5 rounded-md text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:underline underline-offset-4 transition-colors"
          >
            Terms
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default LegalFooter;
