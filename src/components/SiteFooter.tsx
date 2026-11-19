import React from "react";
import { Sun, Moon, ArrowUpRight, ArrowUp } from "lucide-react";
import { SAYAM_DATA } from "../data";
import { SOCIAL_LINKS } from "../data/siteContent";
import ClosingFluidCanvas from "./motion/ClosingFluidCanvas";
import { EditorialReveal, LineReveal } from "../motion/Reveal";

export interface SiteFooterProps {
  onNavigateTab: (
    tab:
      | "home"
      | "about"
      | "projects"
      | "skills"
      | "ecosystem"
      | "certificates"
      | "journal"
      | "github"
      | "contact"
      | "privacy"
      | "terms"
  ) => void;
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
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    tab:
      | "home"
      | "about"
      | "projects"
      | "skills"
      | "ecosystem"
      | "certificates"
      | "journal"
      | "github"
      | "contact"
      | "privacy"
      | "terms"
  ) => {
    e.preventDefault();
    onNavigateTab(tab);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      id="site-footer"
      className="relative overflow-hidden w-full bg-[#151713] text-[#F4F4ED] border-t border-[#41443A] font-sans pb-[calc(76px+env(safe-area-inset-bottom,0px))] xl:pb-[max(2.5rem,env(safe-area-inset-bottom,2.5rem))]"
      style={{
        paddingTop: "clamp(3rem, 5vw, 4.5rem)",
      }}
    >
      <ClosingFluidCanvas tone="dark" />
      <div
        className="relative z-10 w-full mx-auto space-y-10"
        style={{
          width: "min(100%, var(--content-max, 1440px))",
          paddingInline: "var(--page-gutter, clamp(1rem, 4vw, 3rem))",
        }}
      >
        {/* TOP EDITORIAL MANIFESTO ROW */}
        <EditorialReveal distance={14}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10">
            <div className="lg:col-span-7 space-y-3">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#C7E34A] font-semibold block">
                Engineering Portfolio · Sayam Mukherjee
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-[1.08] text-[#F4F4ED]">
                Engineered in{" "}
                <span className="font-serif-editorial italic font-normal text-[#C7E34A]">
                  Bhubaneswar &amp; Hooghly.
                </span>{" "}
                Open to thoughtful software work.
              </h2>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col lg:items-end justify-between gap-4">
              <div className="lg:text-right space-y-1">
                <div className="text-xs font-mono uppercase tracking-[0.1em] text-[#B5B8AA]">
                  Direct Dispatch
                </div>
                <a
                  href={`mailto:${SAYAM_DATA.socials.email}`}
                  className="text-base sm:text-lg font-bold text-[#F4F4ED] hover:text-[#C7E34A] active:text-[#C7E34A] active:opacity-80 transition-all inline-flex items-center gap-1.5 group break-all sm:break-normal max-w-full"
                >
                  <span>{SAYAM_DATA.socials.email}</span>
                  <ArrowUpRight className="w-4 h-4 shrink-0 text-[#C7E34A] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                {toggleTheme && (
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="min-h-[44px] px-3.5 rounded-[6px] border border-[#41443A] bg-[#20231D] text-[#F4F4ED] hover:border-[#C7E34A] hover:text-[#C7E34A] active:scale-[0.97] active:border-[#C7E34A] active:bg-[#262922] transition-all cursor-pointer inline-flex items-center gap-2 text-xs font-mono"
                    title={theme === "dark" ? "Switch to Paper theme" : "Switch to Ink theme"}
                    aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="w-3.5 h-3.5 text-[#C7E34A]" />
                        <span>Paper Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-3.5 h-3.5 text-[#C7E34A]" />
                        <span>Ink Mode</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={scrollToTop}
                  className="min-h-[44px] px-3.5 rounded-[6px] border border-[#41443A] bg-transparent text-[#B5B8AA] hover:text-[#F4F4ED] hover:border-[#F4F4ED] active:scale-[0.97] active:border-[#C7E34A] active:text-[#F4F4ED] transition-all cursor-pointer inline-flex items-center gap-1.5 text-xs font-mono group"
                  aria-label="Back to top"
                >
                  <ArrowUp className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
                  <span>Top</span>
                </button>
              </div>
            </div>
          </div>
          <LineReveal className="!bg-[#41443A]" />
        </EditorialReveal>

        {/* NAVIGATION & SOCIAL LINKS */}
        <EditorialReveal delay={0.08} distance={14}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-[#41443A] text-sm">
          <div className="md:col-span-4 space-y-2">
            <a
              href="/"
              onClick={(e) => handleLinkClick(e, "home")}
              className="font-display font-extrabold text-base tracking-tight text-[#F4F4ED] hover:text-[#C7E34A] active:opacity-80 transition-all inline-block"
            >
              SAYAM MUKHERJEE
            </a>
            <p className="text-xs text-[#B5B8AA] leading-relaxed max-w-xs">
              B.Tech CSE (AI &amp; ML) undergraduate at KIIT University building multi-agent workflows, full-stack TypeScript systems, and C++ algorithms.
            </p>
          </div>

          <div className="md:col-span-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#B5B8AA] mb-3">
              Directory
            </div>
            <nav
              aria-label="Footer Navigation"
              className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 text-xs font-medium"
            >
              {(
                [
                  ["home", "Home"],
                  ["about", "About"],
                  ["projects", "Projects"],
                  ["skills", "Skills"],
                  ["ecosystem", "Ecosystem"],
                  ["certificates", "Certificates"],
                  ["journal", "Journal"],
                  ["github", "GitHub Activity"],
                  ["contact", "Contact"],
                  ["privacy", "Privacy Policy"],
                  ["terms", "Terms"],
                ] as const
              ).map(([tab, label]) => (
                <a
                  key={tab}
                  href={tab === "home" ? "/" : `/${tab}`}
                  onClick={(e) => handleLinkClick(e, tab)}
                  className={`py-1 transition-all active:opacity-75 active:text-[#C7E34A] ${
                    activeTab === tab
                      ? "text-[#C7E34A] font-bold"
                      : "text-[#D4D6CA] hover:text-[#C7E34A]"
                  }`}
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          <div className="md:col-span-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#B5B8AA] mb-3">
              Verified Profiles
            </div>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-mono">
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4D6CA] hover:text-[#C7E34A] active:text-[#C7E34A] active:opacity-75 py-1 transition-all"
              >
                GitHub ↗
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4D6CA] hover:text-[#C7E34A] active:text-[#C7E34A] active:opacity-75 py-1 transition-all"
              >
                LinkedIn ↗
              </a>
              <a
                href={SOCIAL_LINKS.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4D6CA] hover:text-[#C7E34A] active:text-[#C7E34A] active:opacity-75 py-1 transition-all"
              >
                LeetCode ↗
              </a>
              <a
                href={SOCIAL_LINKS.codolio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4D6CA] hover:text-[#C7E34A] active:text-[#C7E34A] active:opacity-75 py-1 transition-all"
              >
                Codolio ↗
              </a>
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4D6CA] hover:text-[#C7E34A] active:text-[#C7E34A] active:opacity-75 py-1 transition-all"
              >
                YouTube ↗
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4D6CA] hover:text-[#C7E34A] active:text-[#C7E34A] active:opacity-75 py-1 transition-all"
              >
                Instagram ↗
              </a>
            </div>
          </div>
        </div>
        </EditorialReveal>

        {/* BOTTOM LEGAL LINE */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-[#B5B8AA]">
          <span>© {currentYear} Sayam Mukherjee. All rights reserved.</span>
          <span>Verified Static &amp; Live GitHub Records · sayammukherjee.in</span>
        </div>
      </div>

      {/* Print-only summary */}
      <div className="hidden print:block max-w-7xl mx-auto px-6 pt-6 mt-6 border-t border-zinc-300 text-black">
        <h2 className="text-lg font-bold font-display">Sayam Mukherjee</h2>
        <p className="text-xs font-mono mt-0.5 text-zinc-600">
          AI &amp; ML CSE Undergraduate · Developer Portfolio
        </p>
        <div className="mt-3 flex flex-col gap-1 text-xs text-zinc-800">
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
