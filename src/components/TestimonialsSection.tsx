import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { EXTENDED_DATA } from "../data/extendedData";
import { Quote, ChevronLeft, ChevronRight, MessageSquare, Star } from "lucide-react";

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 6 seconds
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % EXTENDED_DATA.testimonials.length);
    }, 6000);
    return () => clearInterval(slideInterval);
  }, []);

  const handleManualSlide = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentIndex((prev) => (prev - 1 + EXTENDED_DATA.testimonials.length) % EXTENDED_DATA.testimonials.length);
    } else {
      setCurrentIndex((prev) => (prev + 1) % EXTENDED_DATA.testimonials.length);
    }
  };

  const activeTestimony = EXTENDED_DATA.testimonials[currentIndex];

  return (
    <div className="space-y-8 font-sans" id="testimonials-directory">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs text-purple-400 font-mono uppercase tracking-widest block font-bold">
          PARTNER FEEDBACK
        </span>
        <h2 
          style={{ fontSize: "clamp(1.5rem, 3.5vw, 3.5rem)" }} 
          className="font-bold tracking-tight text-white font-display"
        >
          What Collaborators Say
        </h2>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Feedback and recommendations from peers, project teammates, and clients.
        </p>
      </div>

      {/* Main Glass Testimony Box */}
      <div className="relative max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTestimony && (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="glass-card rounded-2xl border border-zinc-850 p-6 md:p-10 relative overflow-hidden flex flex-col justify-between min-h-[250px] space-y-6"
            >
              <div className="absolute top-6 right-8 text-zinc-800 pointer-events-none select-none">
                <Quote className="w-16 h-16 opacity-30 shrink-0" />
              </div>

              <div className="space-y-4 relative z-10">
                {/* Score badge */}
                <div className="flex gap-0.5 text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-sm md:text-base text-zinc-200 leading-relaxed italic font-sans font-medium">
                  "{activeTestimony.content}"
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-900/60 relative z-10">
                <div>
                  <h4 className="text-sm font-bold text-white font-display leading-tight">{activeTestimony.name}</h4>
                  <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{activeTestimony.role} • <span className="text-purple-400 font-bold">{activeTestimony.organization}</span></p>
                </div>

                <span className="text-[9px] font-mono tracking-wider bg-purple-950/20 text-purple-400 border border-purple-800/20 px-2.5 py-1 rounded-full uppercase font-bold">
                  {activeTestimony.type}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Manual Slide Controls */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => handleManualSlide('prev')}
            className="p-2 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-full border border-zinc-850 cursor-pointer"
            title="Previous testimony"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Indicators bullet points */}
          <div className="flex gap-2">
            {EXTENDED_DATA.testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx 
                    ? "bg-purple-500 w-4" 
                    : "bg-zinc-800 hover:bg-zinc-700"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => handleManualSlide('next')}
            className="p-2 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-full border border-zinc-850 cursor-pointer"
            title="Next testimony"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
