import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, ArrowUpRight, Send } from "lucide-react";

interface FloatingContactButtonProps {
  onNavigateContact?: () => void;
}

export const FloatingContactButton: React.FC<FloatingContactButtonProps> = ({
  onNavigateContact,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onNavigateContact) {
      onNavigateContact();
    } else {
      const contactEl = document.getElementById("contact");
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = "/contact";
      }
    }
  };

  return (
    <div 
      className="fixed z-40 transition-all duration-200 bottom-[calc(clamp(56px,10vh,68px)+env(safe-area-inset-bottom,0px)+0.75rem)] left-[max(0.75rem,calc(env(safe-area-inset-left,0px)+0.5rem))] sm:left-4 xl:bottom-6 xl:left-6"
    >
      <motion.button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="group relative flex items-center gap-2 min-h-[44px] h-11 px-3 sm:px-3.5 rounded-full bg-zinc-900/90 dark:bg-zinc-900/90 text-zinc-100 border border-white/15 dark:border-white/15 shadow-2xl backdrop-blur-md hover:border-purple-500/50 hover:bg-zinc-850 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
        aria-label="Direct contact and dispatch"
      >
        <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
          <Mail className="w-3.5 h-3.5" />
        </div>

        <span className="text-xs font-mono font-medium tracking-tight">
          Get in Touch
        </span>

        <ArrowUpRight className="w-3 h-3 text-zinc-400 group-hover:text-purple-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </motion.button>
    </div>
  );
};

export default FloatingContactButton;
