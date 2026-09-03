import { useEffect, useRef, useState, useMemo, memo } from "react";
import * as d3 from "d3";
import { motion, AnimatePresence } from "motion/react";
import { Code2, GitFork, Sparkles, Layers, Info } from "lucide-react";

export interface LanguageDatum {
  name: string;
  percentage: number;
  lines: string;
  repos: number;
  color: string;
  glowColor: string;
  description: string;
}

interface LanguageRingChartProps {
  className?: string;
  showLegend?: boolean;
}

function LanguageRingChart({
  className = "",
  showLegend = true
}: LanguageRingChartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [metricMode, setMetricMode] = useState<"percentage" | "repos">("percentage");
  const [hoveredLang, setHoveredLang] = useState<LanguageDatum | null>(null);
  const [selectedLang, setSelectedLang] = useState<LanguageDatum | null>(null);
  const [isInView, setIsInView] = useState<boolean>(false);
  const [animationKey, setAnimationKey] = useState<number>(0);

  // Viewport IntersectionObserver to trigger animation only once when entering viewport
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

  const languagesData: LanguageDatum[] = useMemo(() => [
    {
      name: "TypeScript",
      percentage: 44,
      lines: "48.2k",
      repos: 14,
      color: "#38bdf8", // Sky / Cyan
      glowColor: "rgba(56, 189, 248, 0.4)",
      description: "Core full-stack web applications, React architectures, UI state orchestration & AI API interfaces."
    },
    {
      name: "Python",
      percentage: 28,
      lines: "31.5k",
      repos: 9,
      color: "#a855f7", // Purple
      glowColor: "rgba(168, 85, 247, 0.4)",
      description: "Machine learning pipelines, PyTorch computer vision (YOLOv8), data wrangling & automated agents."
    },
    {
      name: "JavaScript",
      percentage: 14,
      lines: "15.8k",
      repos: 7,
      color: "#facc15", // Amber
      glowColor: "rgba(250, 204, 21, 0.4)",
      description: "Node.js runtime services, client-side script modules & interactive DOM engines."
    },
    {
      name: "C++",
      percentage: 8,
      lines: "9.2k",
      repos: 4,
      color: "#f43f5e", // Rose
      glowColor: "rgba(244, 63, 94, 0.4)",
      description: "Data structures & algorithms, competitive problem solving on Codolio/LeetCode & algorithmic optimization."
    },
    {
      name: "C / Systems",
      percentage: 4,
      lines: "4.6k",
      repos: 2,
      color: "#34d399", // Emerald
      glowColor: "rgba(52, 211, 153, 0.4)",
      description: "Undergraduate core coursework in low-level memory allocation, pointer operations & OS primitives."
    },
    {
      name: "SQL & Other",
      percentage: 2,
      lines: "2.4k",
      repos: 3,
      color: "#818cf8", // Indigo
      glowColor: "rgba(129, 140, 248, 0.4)",
      description: "Relational schema definitions, PostgreSQL queries, Prisma models & database indexing."
    }
  ], []);

  // Render D3 Donut Ring
  useEffect(() => {
    if (!svgRef.current || languagesData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 230;
    const height = 230;
    const margin = 10;
    const radius = Math.min(width, height) / 2 - margin;
    const innerRadius = radius * 0.62;
    const cornerRadius = 4;
    const padAngle = 0.035;

    // Filter/Def setup for subtle glow
    const defs = svg.append("defs");
    languagesData.forEach((d, idx) => {
      const filter = defs.append("filter")
        .attr("id", `glow-${idx}`)
        .attr("x", "-20%")
        .attr("y", "-20%")
        .attr("width", "140%")
        .attr("height", "140%");
      
      filter.append("feGaussianBlur")
        .attr("stdDeviation", "3.5")
        .attr("result", "blur");
      
      const feMerge = filter.append("feMerge");
      feMerge.append("feMergeNode").attr("in", "blur");
      feMerge.append("feMergeNode").attr("in", "SourceGraphic");
    });

    const g = svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // D3 Pie Generator
    const pie = d3.pie<LanguageDatum>()
      .value(d => metricMode === "percentage" ? d.percentage : d.repos)
      .sort(null)
      .padAngle(padAngle);

    // D3 Arc Generator
    const arc = d3.arc<d3.PieArcDatum<LanguageDatum>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(cornerRadius);

    const arcHover = d3.arc<d3.PieArcDatum<LanguageDatum>>()
      .innerRadius(innerRadius - 2)
      .outerRadius(radius + 7)
      .cornerRadius(cornerRadius + 1);

    // Base background track ring for polish
    g.append("circle")
      .attr("r", (radius + innerRadius) / 2)
      .attr("fill", "none")
      .attr("stroke", "rgba(255, 255, 255, 0.03)")
      .attr("stroke-width", radius - innerRadius);

    // Arcs group
    const pathGroup = g.selectAll<SVGPathElement, d3.PieArcDatum<LanguageDatum>>(".arc-path")
      .data(pie(languagesData))
      .enter()
      .append("path")
      .attr("class", "arc-path cursor-pointer")
      .attr("fill", d => d.data.color)
      .attr("stroke", d => d.data.color)
      .attr("stroke-width", "1.5")
      .attr("stroke-linejoin", "round")
      .attr("d", arc as any);

    // If in view, run the smooth entrance animation with stroke-dashoffset and angle interpolation
    if (isInView) {
      pathGroup
        .each(function() {
          const totalLength = this.getTotalLength();
          d3.select(this)
            .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
            .attr("stroke-dashoffset", totalLength)
            .style("opacity", 0);
        })
        .transition()
        .duration(950)
        .delay((_, i) => i * 130)
        .ease(d3.easeCubicOut)
        .style("opacity", 1)
        .attr("stroke-dashoffset", 0)
        .attrTween("d", function(d) {
          const i = d3.interpolate({ startAngle: d.startAngle, endAngle: d.startAngle }, d);
          return function(t) {
            return arc(i(t) as any) || "";
          };
        })
        .on("end", function() {
          // After entrance animation completes, reset stroke for clean borders
          d3.select(this)
            .attr("stroke", "#09090b")
            .attr("stroke-width", "1.5")
            .attr("stroke-dasharray", null)
            .attr("stroke-dashoffset", null);
        });
    } else {
      pathGroup.style("opacity", 0);
    }

    // Interactivity
    pathGroup
      .on("mouseenter", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("d", arcHover as any)
          .attr("stroke", "#ffffff")
          .attr("stroke-width", "2")
          .style("filter", `drop-shadow(0 0 10px ${d.data.glowColor})`);

        setHoveredLang(d.data);
      })
      .on("mouseleave", function(event, d) {
        const isSelected = selectedLang?.name === d.data.name;
        if (!isSelected) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("d", arc as any)
            .attr("stroke", "#09090b")
            .attr("stroke-width", "1.5")
            .style("filter", "none");
        }
        setHoveredLang(null);
      })
      .on("click", function(event, d) {
        if (selectedLang?.name === d.data.name) {
          setSelectedLang(null);
        } else {
          setSelectedLang(d.data);
        }
      });

  }, [languagesData, metricMode, selectedLang, isInView, animationKey]);

  const activeFocus = hoveredLang || selectedLang || languagesData[0];

  return (
    <div 
      ref={containerRef}
      className={`space-y-4 font-sans select-none ${className}`}
    >
      {/* Header with Mode Toggle */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span className="text-[11px] font-bold font-mono text-zinc-300 uppercase tracking-widest">
            LANGUAGE SPECTRUM
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAnimationKey(k => k + 1)}
            title="Replay Entrance Animation"
            className="p-1 rounded-lg bg-zinc-950/80 border border-zinc-850 text-zinc-500 hover:text-cyan-400 transition-colors cursor-pointer text-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1 bg-zinc-950/80 p-0.5 border border-zinc-850 rounded-lg text-[9px] font-mono">
            <button
              onClick={() => setMetricMode("percentage")}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                metricMode === "percentage" ? "bg-zinc-800 text-cyan-300 font-bold" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              LINES %
            </button>
            <button
              onClick={() => setMetricMode("repos")}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                metricMode === "repos" ? "bg-zinc-800 text-purple-300 font-bold" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              REPOS
            </button>
          </div>
        </div>
      </div>

      {/* D3 Donut Visualizer and Holographic Centerpiece */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative py-1">
        
        {/* SVG Container */}
        <div className="relative w-[230px] h-[230px] flex items-center justify-center shrink-0">
          <svg 
            ref={svgRef} 
            width={230} 
            height={230} 
            className="overflow-visible"
          />

          {/* Holographic Center Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
            <span 
              className="text-[10px] font-mono font-bold uppercase tracking-wider block transition-colors duration-200"
              style={{ color: activeFocus.color }}
            >
              {activeFocus.name}
            </span>
            <span className="text-2xl font-extrabold text-white font-display mt-0.5 leading-none">
              {metricMode === "percentage" ? `${activeFocus.percentage}%` : `${activeFocus.repos} repos`}
            </span>
            <span className="text-[9px] font-mono text-zinc-500 mt-1 block">
              {activeFocus.lines} lines parsed
            </span>
          </div>
        </div>

        {/* Dynamic Focus Inspector */}
        <div className="flex-1 w-full space-y-2.5 bg-zinc-950/50 border border-zinc-900 p-3.5 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: activeFocus.color }}
              />
              <span className="text-xs font-bold text-white font-mono">
                {activeFocus.name}
              </span>
            </div>
            <span className="text-[9px] font-mono bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded border border-zinc-800">
              {activeFocus.percentage}% Volume
            </span>
          </div>

          <p className="text-[10.5px] text-zinc-400 leading-relaxed font-sans">
            {activeFocus.description}
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-900/80 text-[9.5px] font-mono">
            <div className="bg-zinc-900/60 p-1.5 rounded-lg border border-zinc-850">
              <span className="text-zinc-500 block">REPOSITORIES</span>
              <span className="text-zinc-200 font-bold">{activeFocus.repos} Active Repos</span>
            </div>
            <div className="bg-zinc-900/60 p-1.5 rounded-lg border border-zinc-850">
              <span className="text-zinc-500 block">EST. CODEBASE</span>
              <span className="text-zinc-200 font-bold">{activeFocus.lines} Lines</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Compact Legend Grid */}
      {showLegend && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-zinc-900">
          {languagesData.map((lang) => {
            const isHighlighted = activeFocus.name === lang.name;
            return (
              <button
                key={lang.name}
                onClick={() => setSelectedLang(selectedLang?.name === lang.name ? null : lang)}
                onMouseEnter={() => setHoveredLang(lang)}
                onMouseLeave={() => setHoveredLang(null)}
                className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  isHighlighted 
                    ? "bg-zinc-900/90 border-zinc-700 shadow-sm" 
                    : "bg-zinc-950/40 border-zinc-900 hover:border-zinc-800"
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span 
                    className="w-2 h-2 rounded-full shrink-0" 
                    style={{ backgroundColor: lang.color }}
                  />
                  <span className="text-[10px] font-mono font-medium text-zinc-300 truncate">
                    {lang.name}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-zinc-400 pl-1 shrink-0">
                  {lang.percentage}%
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default memo(LanguageRingChart);
