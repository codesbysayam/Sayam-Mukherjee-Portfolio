import React, { memo } from "react";
import {
  Home,
  FolderKanban,
  Award,
  BookOpen,
  Mail,
  Search,
} from "lucide-react";

export type NavTabType =
  | "home"
  | "about"
  | "skills"
  | "ecosystem"
  | "projects"
  | "certificates"
  | "journal"
  | "contact"
  | "github"
  | "privacy"
  | "terms"
  | "404"
  | "showcase";

interface MobileBottomNavProps {
  activeTab: NavTabType;
  onNavigate: (tab: NavTabType) => void;
  onOpenSearch: () => void;
  disabled?: boolean;
}

interface BottomNavItem {
  id: NavTabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PRIMARY_DESTINATIONS: BottomNavItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "certificates", label: "Certs", icon: Award },
  { id: "journal", label: "Journal", icon: BookOpen },
  { id: "contact", label: "Contact", icon: Mail },
];

function MobileBottomNavComponent({
  activeTab,
  onNavigate,
  onOpenSearch,
  disabled = false,
}: MobileBottomNavProps) {
  if (disabled) return null;

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="xl:hidden fixed bottom-0 left-0 right-0 z-40 select-none border-t border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-md text-[var(--text)] pb-[env(safe-area-inset-bottom,0px)] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)] shadow-[0_-6px_20px_rgba(32,35,29,0.08)]"
    >
      <div className="w-full min-h-[56px] px-1 sm:px-2 py-1 flex items-center justify-around gap-0.5">
        {PRIMARY_DESTINATIONS.map((dest) => {
          const isActive = activeTab === dest.id;
          const Icon = dest.icon;

          return (
            <button
              key={dest.id}
              type="button"
              onClick={() => onNavigate(dest.id)}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex flex-col items-center justify-center flex-1 min-w-0 min-h-[48px] py-1 px-0.5 rounded-[6px] transition-all duration-150 cursor-pointer active:scale-[0.95] ${
                isActive
                  ? "bg-[var(--accent-fill)] text-[var(--accent-contrast)] font-bold"
                  : "text-[var(--text-muted)] hover:text-[var(--text)] active:bg-[var(--surface)]"
              }`}
            >
              <Icon className="w-[18px] h-[18px] sm:w-5 sm:h-5 shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-medium tracking-tight leading-tight mt-1 font-sans truncate max-w-full text-center">
                {dest.label}
              </span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Open command palette search"
          className="flex flex-col items-center justify-center flex-1 min-w-0 min-h-[48px] py-1 px-0.5 rounded-[6px] text-[var(--text-muted)] hover:text-[var(--text)] active:scale-[0.95] active:bg-[var(--surface)] transition-all duration-150 cursor-pointer"
        >
          <Search className="w-[18px] h-[18px] sm:w-5 sm:h-5 shrink-0" />
          <span className="text-[10px] sm:text-[11px] font-medium tracking-tight leading-tight mt-1 font-sans truncate max-w-full text-center">
            Search
          </span>
        </button>
      </div>
    </nav>
  );
}

export const MobileBottomNav = memo(MobileBottomNavComponent);
export default MobileBottomNav;
