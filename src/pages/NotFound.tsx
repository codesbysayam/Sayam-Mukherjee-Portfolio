import React from "react";
import { ArrowLeft, Home, Layers, Mail, Compass } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

interface NotFoundProps {
  onNavigateTab?: (tab: string) => void;
}

export default function NotFound({ onNavigateTab }: NotFoundProps) {
  const { theme } = usePortfolio();
  const isLight = theme === "light";

  const handleNavigate = (tab: string) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
    } else {
      window.location.href = tab === "home" ? "/" : `/${tab}`;
    }
  };

  return (
    <div className="w-full min-h-[65vh] flex items-center justify-center py-16 px-4 select-text">
      <div className={`w-full max-w-xl text-center rounded-3xl p-8 sm:p-12 border ${
        isLight
          ? "bg-white/90 border-slate-200 shadow-xl"
          : "bg-zinc-950/60 border-zinc-800/80 shadow-[0_16px_50px_rgba(0,0,0,0.5)]"
      }`}>
        {/* Status Chip */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider mb-6 bg-red-500/10 text-red-400 border border-red-500/20">
          <Compass className="w-3.5 h-3.5" />
          <span>404 · Route Not Found</span>
        </div>

        {/* Hero Code */}
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black font-display tracking-tight text-zinc-900 dark:text-white">
          404
        </h1>

        <h2 className="mt-3 text-lg sm:text-xl font-bold font-display uppercase tracking-wide text-zinc-800 dark:text-zinc-200">
          PAGE DOESN'T EXIST
        </h2>

        <p className="mt-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
          The coordinate or route you are attempting to access is unavailable or has been relocated within Sayam Mukherjee's engineering portfolio.
        </p>

        {/* Action Controls */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => handleNavigate("home")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-sm cursor-pointer active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Back Home</span>
          </button>

          <button
            onClick={() => handleNavigate("projects")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-semibold transition-all border cursor-pointer active:scale-95 ${
              isLight
                ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
                : "bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-750"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Explore Projects</span>
          </button>

          <button
            onClick={() => handleNavigate("contact")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-semibold transition-all border cursor-pointer active:scale-95 ${
              isLight
                ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
                : "bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-750"
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Contact</span>
          </button>
        </div>

        <p className="mt-8 text-[11px] font-mono text-zinc-500">
          Need direct assistance? Email{" "}
          <a href="mailto:sayammukherjee1506@gmail.com" className="text-purple-400 hover:underline">
            sayammukherjee1506@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
