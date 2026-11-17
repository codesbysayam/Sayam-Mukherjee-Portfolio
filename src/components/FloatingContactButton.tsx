import React from "react";
import { motion } from "motion/react";
import { Mail, ArrowUpRight } from "lucide-react";

interface FloatingContactButtonProps {
  onNavigateContact?: () => void;
}

export const FloatingContactButton: React.FC<FloatingContactButtonProps> = ({
  onNavigateContact,
}) => {
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
    <div className="fixed z-40 transition-all duration-200 bottom-[calc(clamp(56px,10vh,68px)+env(safe-area-inset-bottom,0px)+0.75rem)] left-[max(0.75rem,calc(env(safe-area-inset-left,0px)+0.5rem))] sm:left-4 xl:bottom-6 xl:left-6">
      <motion.button
        type="button"
        onClick={handleClick}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="group relative flex items-center gap-2 min-h-[44px] h-11 px-3.5 rounded-[6px] bg-[#20231D] text-[#F4F4ED] dark:bg-[#F4F4ED] dark:text-[#20231D] border border-[#41443A] dark:border-[#D6D7CC] shadow-lg hover:bg-[#C7E34A] hover:text-[#20231D] hover:border-[#C7E34A] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C7E34A]"
        aria-label="Direct contact and dispatch"
      >
        <Mail className="w-3.5 h-3.5 shrink-0" />
        <span className="text-xs font-mono font-semibold tracking-tight">
          Get in Touch
        </span>
        <ArrowUpRight className="w-3.5 h-3.5 opacity-75 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </motion.button>
    </div>
  );
};

export default FloatingContactButton;
