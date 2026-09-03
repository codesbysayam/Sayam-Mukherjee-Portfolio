import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Elegant, buttery-fast delay for professional, instant entry
    const timer = setTimeout(() => {
      setIsDone(true);
      setTimeout(() => {
        onComplete();
      }, 200); // Wait for fade-out transition
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          className="fixed inset-0 bg-[#09090B] z-50 flex flex-col items-center justify-center overflow-hidden"
          exit={{ opacity: 0, scale: 0.97, filter: "blur(10px)" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Glowing Ambient Core Accent (Linear/Stripe style) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-tr from-purple-500/10 to-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Minimal Glass Card Monogram */}
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative p-8 rounded-2xl glass-card flex flex-col items-center justify-center"
          >
            {/* Corner Tech Accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-purple-500/40 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-purple-500/40 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-purple-500/40 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-purple-500/40 rounded-br-lg" />

            {/* Glowing Initials Display */}
            <div className="w-16 h-16 rounded-full bg-zinc-900/60 border border-zinc-800 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.15)] relative overflow-hidden group">
              <img 
                src="https://inevitable-jade-qvzysrme.edgeone.dev/IMG_2636.jpeg" 
                alt="Sayam Mukherjee" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Premium Micro Loading Bar */}
            <div className="mt-6 w-32 h-[1px] bg-zinc-900/60 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{ duration: 1.1, ease: "easeInOut", repeat: 0 }}
                className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-cyan-400 to-purple-500"
              />
            </div>
          </motion.div>

          {/* Subtle bottom telemetry signature */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute bottom-10 font-mono text-[9px] text-zinc-500 tracking-widest uppercase"
          >
            SAYAM MUKHERJEE • TECHNICAL ECOSYSTEM
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
