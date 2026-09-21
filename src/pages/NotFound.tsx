import React from "react";
import { Home, Mail, ArrowLeft, Layers } from "lucide-react";

interface NotFoundProps {
  onNavigateTab?: (tab: string) => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ onNavigateTab }) => {
  const handleNavigate = (tab: string) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
    } else {
      window.location.href = tab === "home" ? "/" : `/${tab}`;
    }
  };

  return (
    <div
      role="main"
      className="w-full min-h-[70vh] flex items-center justify-center py-12 sm:py-20 px-4 sm:px-6 select-text"
    >
      <div className="w-full max-w-lg mx-auto text-center rounded-2xl p-6 sm:p-10 border border-zinc-200/90 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/80 shadow-md dark:shadow-2xl backdrop-blur-xs transition-colors">
        {/* Subtle Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide mb-6 bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
          <span>Error 404</span>
          <span className="text-zinc-300 dark:text-zinc-700 select-none">·</span>
          <span>Route Not Found</span>
        </div>

        {/* Large 404 Display */}
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black font-display tracking-tight text-zinc-950 dark:text-zinc-50 leading-none">
          404
        </h1>

        {/* Primary Subheading */}
        <h2 className="mt-4 text-xl sm:text-2xl font-bold font-sans tracking-tight text-zinc-850 dark:text-zinc-150">
          Page not found.
        </h2>

        {/* Clear, Professional Description */}
        <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
          The requested page does not exist or may have been relocated within Sayam Mukherjee&apos;s portfolio.
        </p>

        {/* Primary Action Controls */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => handleNavigate("home")}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl text-sm font-medium bg-purple-600 hover:bg-purple-500 text-white shadow-xs hover:shadow-md transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 active:scale-[0.98]"
            aria-label="Return to portfolio home"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavigate("projects")}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-medium border border-zinc-200 dark:border-zinc-750 bg-zinc-50 dark:bg-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-750 text-zinc-800 dark:text-zinc-200 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 active:scale-[0.98]"
            aria-label="Explore engineering projects"
          >
            <Layers className="w-4 h-4" />
            <span>Projects</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavigate("contact")}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-medium border border-zinc-200 dark:border-zinc-750 bg-zinc-50 dark:bg-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-750 text-zinc-800 dark:text-zinc-200 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 active:scale-[0.98]"
            aria-label="Contact Sayam Mukherjee"
          >
            <Mail className="w-4 h-4" />
            <span>Contact</span>
          </button>
        </div>

        {/* Direct Email Link */}
        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800/80 text-xs text-zinc-500 dark:text-zinc-400">
          <span>Need direct assistance? Email </span>
          <a
            href="mailto:sayammukherjee1506@gmail.com"
            className="font-medium text-purple-600 dark:text-purple-400 hover:underline"
          >
            sayammukherjee1506@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
