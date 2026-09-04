import { useEffect, useRef, useState, useMemo, memo } from "react";
import * as d3 from "d3";
import { motion, AnimatePresence } from "motion/react";
import { Code2, GitFork, Sparkles, Layers, Info } from "lucide-react";
import { fetchGitHubStats, GitHubLanguageShare } from "../services/github";
import { usePortfolio } from "../context/PortfolioContext";

export interface LanguageDatum {
  name: string;
  percentage: number;
  color: string;
  glowColor: string;
  description: string;
}

interface LanguageRingChartProps {
  className?: string;
  showLegend?: boolean;
}

function LanguageRingChartComponent({
  className = "",
  showLegend = true
}: LanguageRingChartProps) {
  const { theme } = usePortfolio();
  const isDark = theme === "dark";
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [hoveredLang, setHoveredLang] = useState<LanguageDatum | null>(null);
  const [selectedLang, setSelectedLang] = useState<LanguageDatum | null>(null);
  const [isInView, setIsInView] = useState<boolean>(false);
  const [rawLanguages, setRawLanguages] = useState<GitHubLanguageShare[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadLangs() {
      try {
        const stats = await fetchGitHubStats();
        if (isMounted && stats.languages?.length) {
          setRawLanguages(stats.languages);
        }
      } catch (err) {
        console.warn("Could not load dynamic repo languages:", err);
      }
    }
    loadLangs();
    return () => { isMounted = false; };
  }, []);

  // Viewport IntersectionObserver
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(node);
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const languagesData: LanguageDatum[] = useMemo(() => {
    if (rawLanguages.length > 0) {
      const descriptions: Record<string, string> = {
        TypeScript: "Primary language for full-stack architecture, React frontend, and type-safe systems.",
        JavaScript: "Modern ES6+ scripting, Node.js runtime operations, and dynamic UI interactions.",
        CSS: "Tailwind CSS styling, custom animations, and responsive visual design.",
        HTML: "Semantic web structure, DOM hierarchies, and accessibility standards.",
        Python: "Computer vision research (YOLOv8/OpenCV) and systems programming."
      };
      const colors: Record<string, string> = {
        TypeScript: "#38bdf8",
        JavaScript: "#facc15",
        CSS: "#c084fc",
        HTML: "#fb923c",
        Python: "#a855f7"
      };

      return rawLanguages.map(l => ({
        name: l.name,
        percentage: l.percent,
        color: colors[l.name] || "#94a3b8",
        glowColor: `${colors[l.name] || "#94a3b8"}66`,
        description: descriptions[l.name] || `Verified codebase share across public repositories.`
      }));
    }

    // Default verified baseline
    return [
      {
        name: "TypeScript",
        percentage: 85,
        color: "#38bdf8",
        glowColor: "rgba(56, 189, 248, 0.4)",
        description: "Primary language across public repositories (Mausam, Portfolio, Operon)."
      },
      {
        name: "JavaScript",
        percentage: 8,
        color: "#facc15",
        glowColor: "rgba(250, 204, 21, 0.4)",
        description: "Node.js runtime services, client scripts, and build configurations."
      },
      {
        name: "CSS",
        percentage: 5,
        color: "#c084fc",
        glowColor: "rgba(192, 132, 252, 0.4)",
        description: "Tailwind CSS utilities, glassmorphism filters, and design tokens."
      },
      {
        name: "HTML",
        percentage: 2,
        color: "#fb923c",
        glowColor: "rgba(251, 146, 60, 0.4)",
        description: "Semantic HTML templates, accessibility landmarks, and layouts."
      }
    ];
  }, [rawLanguages]);

  // Render D3 Donut Ring
  useEffect(() => {
    if (!svgRef.current || languagesData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 220;
    const height = 220;
    const margin = 10;
    const radius = Math.min(width, height) / 2 - margin;
    const innerRadius = radius * 0.64;
    const cornerRadius = 4;
    const padAngle = 0.04;

    const g = svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie<LanguageDatum>()
      .value(d => d.percentage)
      .sort(null)
      .padAngle(padAngle);

    const arc = d3.arc<d3.PieArcDatum<LanguageDatum>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(cornerRadius);

    const arcHover = d3.arc<d3.PieArcDatum<LanguageDatum>>()
      .innerRadius(innerRadius - 2)
      .outerRadius(radius + 5)
      .cornerRadius(cornerRadius + 1);

    // Background track ring
    g.append("circle")
      .attr("r", (radius + innerRadius) / 2)
      .attr("fill", "none")
      .attr("stroke", isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(20, 20, 35, 0.05)")
      .attr("stroke-width", radius - innerRadius);

    const segmentStroke = isDark ? "#09090b" : "#ffffff";
    const segmentHoverStroke = isDark ? "#ffffff" : "#4338ca";

    const pathGroup = g.selectAll<SVGPathElement, d3.PieArcDatum<LanguageDatum>>(".arc-path")
      .data(pie(languagesData))
      .enter()
      .append("path")
      .attr("class", "arc-path cursor-pointer")
      .attr("fill", d => d.data.color)
      .attr("stroke", segmentStroke)
      .attr("stroke-width", "2")
      .attr("d", arc as any);

    pathGroup
      .on("mouseenter", function(_, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr("d", arcHover as any)
          .attr("stroke", segmentHoverStroke);
        setHoveredLang(d.data);
      })
      .on("mouseleave", function(_, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr("d", arc as any)
          .attr("stroke", segmentStroke);
        setHoveredLang(null);
      })
      .on("click", function(_, d) {
        setSelectedLang(d.data);
      });

  }, [languagesData, isDark]);

  const activeDisplay = hoveredLang || selectedLang || languagesData[0];

  return (
    <div ref={containerRef} className={`space-y-4 font-sans ${className}`}>
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5 text-cyan-400" />
          Codebase Language Breakdown
        </span>
        <span className="text-[9px] font-mono text-zinc-500">Live Git Distribution</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        {/* Donut Ring Canvas */}
        <div className="relative shrink-0">
          <svg ref={svgRef} width={220} height={220} className="overflow-visible" />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-xl font-bold text-white font-display">
              {activeDisplay?.percentage}%
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">
              {activeDisplay?.name}
            </span>
          </div>
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="space-y-2.5 w-full sm:w-auto">
            {languagesData.map((lang, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedLang(lang)}
                className="flex items-center justify-between gap-4 p-2 rounded-xl bg-zinc-950/40 border border-zinc-900/60 hover:border-zinc-800 transition-colors cursor-pointer text-xs font-mono"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lang.color }} />
                  <span className="text-zinc-200 font-medium">{lang.name}</span>
                </div>
                <span className="text-zinc-400 font-bold">{lang.percentage}%</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeDisplay && (
        <p className="text-[11px] text-zinc-400 leading-relaxed font-mono bg-zinc-950/50 p-3 rounded-xl border border-zinc-900">
          <span className="text-white font-semibold">{activeDisplay.name}:</span> {activeDisplay.description}
        </p>
      )}
    </div>
  );
}

const LanguageRingChart = memo(LanguageRingChartComponent);
export default LanguageRingChart;
