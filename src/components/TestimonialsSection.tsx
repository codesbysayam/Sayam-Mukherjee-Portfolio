import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { EXTENDED_DATA } from "../data/extendedData";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % EXTENDED_DATA.testimonials.length);
    }, 6000);
    return () => clearInterval(slideInterval);
  }, []);

  const handleManualSlide = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentIndex(
        (prev) =>
          (prev - 1 + EXTENDED_DATA.testimonials.length) %
          EXTENDED_DATA.testimonials.length
      );
    } else {
      setCurrentIndex((prev) => (prev + 1) % EXTENDED_DATA.testimonials.length);
    }
  };

  const activeTestimony = EXTENDED_DATA.testimonials[currentIndex];

  return (
    <div className="space-y-8 font-sans" id="testimonials-directory">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs text-[var(--accent)] font-mono uppercase tracking-widest block font-semibold">
          PARTNER FEEDBACK
        </span>
        <h2
          style={{ fontSize: "clamp(1.6rem, 3.4vw, 3rem)" }}
          className="font-extrabold tracking-tight text-[var(--text)] font-display"
        >
          What Collaborators{" "}
          <span className="font-serif-editorial italic font-normal text-[var(--accent)]">
            Say
          </span>
        </h2>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          Feedback and recommendations from peers, project teammates, and clients.
        </p>
      </div>

      <div className="relative max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTestimony && (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="card rounded-[10px] p-6 md:p-10 relative overflow-hidden flex flex-col justify-between min-h-[240px] space-y-6"
              style={{
                backgroundColor: "var(--surface-2)",
                borderColor: "var(--border)",
              }}
            >
              <div
                className="absolute top-6 right-8 pointer-events-none select-none"
                style={{ color: "var(--border)" }}
              >
                <Quote className="w-14 h-14 opacity-60 shrink-0" />
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex gap-1 text-[var(--accent)]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-base md:text-lg text-[var(--text)] leading-relaxed font-serif-editorial italic">
                  &ldquo;{activeTestimony.content}&rdquo;
                </p>
              </div>

              <div
                className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t relative z-10"
                style={{ borderColor: "var(--border)" }}
              >
                <div>
                  <h3 className="text-sm font-bold text-[var(--text)] font-display leading-tight">
                    {activeTestimony.name}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                    {activeTestimony.role} &bull;{" "}
                    <span className="text-[var(--accent)] font-semibold">
                      {activeTestimony.organization}
                    </span>
                  </p>
                </div>

                <span
                  className="text-[11px] font-mono tracking-wider px-2.5 py-1 rounded-[4px] border uppercase font-semibold"
                  style={{
                    backgroundColor: "var(--surface)",
                    borderColor: "var(--border)",
                    color: "var(--accent)",
                  }}
                >
                  {activeTestimony.type}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            type="button"
            onClick={() => handleManualSlide("prev")}
            className="btn btn-secondary min-h-[38px] min-w-[38px] p-2"
            title="Previous testimony"
            aria-label="Previous testimony"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex gap-2">
            {EXTENDED_DATA.testimonials.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Show testimonial ${idx + 1}`}
                className="h-2 rounded-[2px] transition-all cursor-pointer"
                style={{
                  width: currentIndex === idx ? "24px" : "8px",
                  backgroundColor:
                    currentIndex === idx ? "#C7E34A" : "var(--border-strong)",
                }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleManualSlide("next")}
            className="btn btn-secondary min-h-[38px] min-w-[38px] p-2"
            title="Next testimony"
            aria-label="Next testimony"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
