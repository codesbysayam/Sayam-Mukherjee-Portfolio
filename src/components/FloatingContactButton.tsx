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
    <div className="fixed bottom-[max(1.25rem,calc(env(safe-area-inset-bottom,0px)+0.75rem))] left-[max(1rem,calc(env(safe-area-inset-left,0px)+0.75rem))] sm:left-6 z-30">
      <motion.button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="group relative flex items-center gap-2.5 h-11 px-3.5 rounded-full bg-white/80 dark:bg-zinc-900/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-800 shadow-lg hover:shadow-xl backdrop-blur-md hover:border-purple-500/50 hover:text-purple-600 dark:hover:text-purple-400 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
        aria-label="Direct contact and dispatch"
      >
        <div className="w-6 h-6 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
          <Mail className="w-3.5 h-3.5" />
        </div>

        <span className="text-xs font-mono font-medium tracking-tight">
          Get in Touch
        </span>

        <ArrowUpRight className="w-3 h-3 text-zinc-400 group-hover:text-purple-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </motion.button>
    </div>
  );
};

export default FloatingContactButton;
