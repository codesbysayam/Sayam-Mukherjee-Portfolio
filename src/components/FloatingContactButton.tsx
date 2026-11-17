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
    <div className="hidden xl:block fixed z-40 transition-all duration-200 xl:bottom-6 xl:left-[max(1.5rem,env(safe-area-inset-left,1.5rem))]">
      <motion.button
        type="button"
        onClick={handleClick}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="group relative flex items-center gap-2 min-h-[44px] h-11 px-3.5 rounded-[6px] bg-[#20231D] text-[#F4F4ED] dark:bg-[#F4F4ED] dark:text-[#20231D] border border-[#41443A] dark:border-[#D6D7CC] shadow-lg hover:bg-[#C7E34A] hover:text-[#20231D] hover:border-[#C7E34A] active:bg-[#A9C52F] active:text-[#20231D] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C7E34A]"
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
