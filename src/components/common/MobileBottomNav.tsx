import React, { memo } from "react";
import { 
  Home, 
  FolderKanban, 
  Award, 
  BookOpen, 
  Mail, 
  Search,
  Sparkles
} from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";

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
  | "404";

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
  const { theme } = usePortfolio();
  const isDark = theme === "dark";

  if (disabled) return null;

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="xl:hidden fixed bottom-0 left-0 right-0 z-40 select-none pb-[env(safe-area-inset-bottom,0px)]"
      style={{
        maxHeight: "clamp(56px, 12vh, 68px)",
      }}
    >
      <div
        className={`w-full border-t backdrop-blur-xl transition-all duration-200 px-2 py-1.5 flex items-center justify-around shadow-[0_-8px_24px_rgba(0,0,0,0.15)] ${
          isDark
            ? "bg-[#08080c]/90 border-zinc-800/80 text-zinc-400"
            : "bg-white/92 border-zinc-200 text-zinc-600"
        }`}
      >
        {PRIMARY_DESTINATIONS.map((dest) => {
          const isActive = activeTab === dest.id;
          const Icon = dest.icon;

          return (
            <button
              key={dest.id}
              type="button"
              onClick={() => onNavigate(dest.id)}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex flex-col items-center justify-center flex-1 min-h-[44px] py-1 px-1 rounded-xl transition-all duration-150 cursor-pointer ${
                isActive
                  ? isDark
                    ? "text-purple-400 font-bold"
                    : "text-purple-700 font-bold"
                  : isDark
                    ? "hover:text-zinc-200 active:scale-95"
                    : "hover:text-zinc-900 active:scale-95"
              }`}
            >
              {/* Active Ambient Glow Background */}
              {isActive && (
                <div
                  className={`absolute inset-0 rounded-xl -z-10 ${
                    isDark ? "bg-purple-500/10" : "bg-purple-100/70"
                  }`}
                />
              )}

              <Icon
                className={`w-5 h-5 transition-transform duration-150 ${
                  isActive ? "scale-110" : "scale-100"
                }`}
              />

              <span className="text-[10px] tracking-tight leading-none mt-1 font-sans">
                {dest.label}
              </span>

              {/* Active Tiny Dot */}
              {isActive && (
                <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-purple-500" />
              )}
            </button>
          );
        })}

        {/* Quick Search Trigger */}
        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Open command palette search"
          className={`flex flex-col items-center justify-center flex-1 min-h-[44px] py-1 px-1 rounded-xl transition-all duration-150 cursor-pointer ${
            isDark
              ? "text-zinc-400 hover:text-zinc-200 active:scale-95"
              : "text-zinc-600 hover:text-zinc-900 active:scale-95"
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] tracking-tight leading-none mt-1 font-sans">
            Search
          </span>
        </button>
      </div>
    </nav>
  );
}

export const MobileBottomNav = memo(MobileBottomNavComponent);
export default MobileBottomNav;
