import React from "react";
import { Sun, Moon } from "lucide-react";
import { SAYAM_DATA } from "../data";

export interface SiteFooterProps {
  onNavigateTab: (tab: "home" | "contact" | "privacy" | "terms") => void;
  activeTab?: string;
  theme?: "dark" | "light";
  toggleTheme?: () => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({
  onNavigateTab,
  activeTab,
  theme,
  toggleTheme,
}) => {
  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    tab: "contact" | "privacy" | "terms" | "home"
  ) => {
    e.preventDefault();
    onNavigateTab(tab);
  };

  return (
    <footer
      id="site-footer"
      className="w-full border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-[#070709]/80 backdrop-blur-sm transition-colors duration-200 text-zinc-600 dark:text-zinc-400 font-sans"
      style={{
        paddingTop: "clamp(1.75rem, 3.5vw, 2.75rem)",
        paddingBottom: "max(1.75rem, env(safe-area-inset-bottom, 1.75rem))",
      }}
    >
      <div
        className="w-full mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        style={{
          width: "min(100% - 2.5rem, 1200px)",
          paddingInline: "clamp(0.25rem, 1.5vw, 1.5rem)",
        }}
      >
        {/* Left: Brand & Copyright Information */}
        <div className="flex flex-col items-start gap-1 text-left">
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, "home")}
            className="font-display font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100 hover:text-purple-600 dark:hover:text-purple-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded"
          >
            Sayam Mukherjee
          </a>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 tracking-normal font-sans">
            AI &amp; ML CSE Undergraduate · Developer Portfolio
          </p>
          <p className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 mt-0.5">
            © 2026 Sayam Mukherjee. All rights reserved.
          </p>
        </div>

        {/* Right: Only Contact, Privacy Policy, Terms & Preserved Theme Switcher */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
          <nav
            aria-label="Footer Navigation"
            className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-xs sm:text-[13px] font-medium"
          >
            <a
              href="/contact"
              onClick={(e) => handleLinkClick(e, "contact")}
              className={`inline-flex items-center min-h-[44px] px-2.5 py-1.5 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                activeTab === "contact"
                  ? "text-purple-600 dark:text-purple-400 font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:underline underline-offset-4"
              }`}
            >
              Contact
            </a>

            <span
              className="text-zinc-300 dark:text-zinc-700 select-none text-xs px-0.5"
              aria-hidden="true"
            >
              ·
            </span>

            <a
              href="/privacy"
              onClick={(e) => handleLinkClick(e, "privacy")}
              className={`inline-flex items-center min-h-[44px] px-2.5 py-1.5 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                activeTab === "privacy"
                  ? "text-purple-600 dark:text-purple-400 font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:underline underline-offset-4"
              }`}
            >
              Privacy Policy
            </a>

            <span
              className="text-zinc-300 dark:text-zinc-700 select-none text-xs px-0.5"
              aria-hidden="true"
            >
              ·
            </span>

            <a
              href="/terms"
              onClick={(e) => handleLinkClick(e, "terms")}
              className={`inline-flex items-center min-h-[44px] px-2.5 py-1.5 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                activeTab === "terms"
                  ? "text-purple-600 dark:text-purple-400 font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:underline underline-offset-4"
              }`}
            >
              Terms
            </a>
          </nav>

          {/* Preserved Theme Switcher Control */}
          {toggleTheme && (
            <div className="flex items-center pl-2 sm:pl-3 border-l border-zinc-200 dark:border-zinc-800/80">
              <button
                type="button"
                onClick={toggleTheme}
                className="min-h-[44px] min-w-[44px] p-2.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
                aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-500" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Print-only details */}
      <div className="hidden print:block max-w-7xl mx-auto px-6 pt-6 mt-6 border-t border-zinc-300 dark:border-zinc-800 text-black dark:text-white">
        <h2 className="text-lg font-bold font-display">Sayam Mukherjee</h2>
        <p className="text-xs font-mono mt-0.5 text-zinc-600 dark:text-zinc-400">
          AI &amp; ML CSE Undergraduate · Developer Portfolio
        </p>
        <div className="mt-3 flex flex-col gap-1 text-xs text-zinc-800 dark:text-zinc-300">
          <p>
            <strong>Email:</strong> {SAYAM_DATA.socials.email}
          </p>
          <p>
            <strong>LinkedIn:</strong> {SAYAM_DATA.socials.linkedin}
          </p>
          <p>
            <strong>GitHub:</strong> {SAYAM_DATA.socials.github}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
