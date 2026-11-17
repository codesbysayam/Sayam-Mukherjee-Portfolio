import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDone(true);
      setTimeout(() => {
        onComplete();
      }, 200);
    }, 280);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          className="fixed inset-0 bg-[var(--bg)] z-50 flex flex-col items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="card p-8 flex flex-col items-center justify-center"
          >
            <div className="w-16 h-16 rounded-full bg-[var(--surface)] border border-[var(--border-strong)] flex items-center justify-center overflow-hidden">
              <img
                src="https://inevitable-jade-qvzysrme.edgeone.dev/IMG_2636.jpeg"
                alt="Sayam Mukherjee avatar"
                width={64}
                height={64}
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-6 w-32 h-[2px] bg-[var(--surface)] overflow-hidden relative">
              <motion.div
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{ duration: 0.9, ease: "easeInOut", repeat: 0 }}
                className="absolute top-0 bottom-0 w-1/2 bg-[#C7E34A]"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="absolute bottom-10 font-mono text-[10px] text-[var(--text-muted)] tracking-[0.16em] uppercase"
          >
            Sayam Mukherjee · Portfolio
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
