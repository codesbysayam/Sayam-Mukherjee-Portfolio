import React from "react";
import { Home, Mail, Layers } from "lucide-react";

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
      <div className="card w-full max-w-lg mx-auto text-center p-6 sm:p-10">
        <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-[0.14em] text-[var(--accent)] font-semibold mb-5">
          <span>Error 404</span>
          <span className="text-[var(--text-faint)] select-none" aria-hidden="true">/</span>
          <span className="text-[var(--text-muted)]">Route Not Found</span>
        </div>

        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold font-display tracking-tight text-[var(--text)] leading-none tabular-nums">
          404
        </h1>

        <h2 className="mt-4 text-xl sm:text-2xl font-bold font-display tracking-tight text-[var(--text)]">
          Page <span className="font-serif-editorial italic font-normal">not found</span>.
        </h2>

        <p className="mt-3 text-sm sm:text-base text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">
          The requested route does not exist or may have been moved within Sayam Mukherjee&apos;s portfolio.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => handleNavigate("home")}
            className="btn btn-primary"
            aria-label="Return to portfolio home"
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>Return Home</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavigate("projects")}
            className="btn btn-secondary"
            aria-label="Explore engineering projects"
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span>Projects</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavigate("contact")}
            className="btn btn-secondary"
            aria-label="Contact Sayam Mukherjee"
          >
            <Mail className="w-4 h-4 shrink-0" />
            <span>Contact</span>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--border)] text-xs text-[var(--text-muted)]">
          <span>Need direct assistance? Email </span>
          <a
            href="mailto:sayammukherjee1506@gmail.com"
            className="font-semibold text-[var(--accent)] hover:underline underline-offset-4"
          >
            sayammukherjee1506@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
