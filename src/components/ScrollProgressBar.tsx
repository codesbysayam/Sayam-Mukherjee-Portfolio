import { useRef } from "react";
import { useScrollFrame } from "../utils/useScrollFrame";

export default function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useScrollFrame((scrollY) => {
    if (!barRef.current) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;
    barRef.current.style.transform = `scaleX(${progress})`;
  });

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 z-[100] origin-left pointer-events-none"
      style={{ transform: "scaleX(0)", willChange: "transform" }}
    />
  );
}
