import React from "react";

interface LegalFooterProps {
  onNavigateHome?: () => void;
  onNavigateTab?: (tab: "privacy" | "terms" | "contact") => void;
}

export const LegalFooter: React.FC<LegalFooterProps> = ({
  onNavigateHome,
  onNavigateTab,
}) => {
  return (
    <footer className="mt-16 pt-8 pb-12 border-t border-zinc-200/80 dark:border-zinc-800/80 text-zinc-500 dark:text-zinc-400 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          {onNavigateHome ? (
            <button
              onClick={onNavigateHome}
              className="font-semibold text-zinc-900 dark:text-zinc-100 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer text-left text-sm"
            >
              Sayam Mukherjee
            </button>
          ) : (
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
              Sayam Mukherjee
            </span>
          )}
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            AI &amp; ML Student · Full-Stack Developer
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
          {onNavigateTab && (
            <>
              <button
                onClick={() => onNavigateTab("privacy")}
                className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
              >
                Privacy
              </button>
              <button
                onClick={() => onNavigateTab("terms")}
                className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
              >
                Terms
              </button>
              <button
                onClick={() => onNavigateTab("contact")}
                className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
              >
                Contact
              </button>
              <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline select-none">
                ·
              </span>
            </>
          )}

          <a
            href="https://github.com/codesbysayam"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/sayam-mukherjee-b96209324/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>

      <div className="mt-6 text-xs text-zinc-400 dark:text-zinc-500">
        © 2026 Sayam Mukherjee. All rights reserved.
      </div>
    </footer>
  );
};

export default LegalFooter;
