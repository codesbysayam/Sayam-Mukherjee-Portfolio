import { useEffect, useRef, useState, useMemo, memo } from "react";
import * as d3 from "d3";
import { Code2 } from "lucide-react";
import { useGitHubTelemetry } from "../hooks/useGitHubTelemetry";
import { formatPercentage } from "../services/githubTelemetry";
import { usePortfolio } from "../context/PortfolioContext";

export interface LanguageDatum {
  name: string;
  percentage: number;
  formattedPercentage: string;
  color: string;
  description: string;
}

interface LanguageRingChartProps {
  className?: string;
  showLegend?: boolean;
}

function LanguageRingChartComponent({
  className = "",
  showLegend = true,
}: LanguageRingChartProps) {
  const { theme } = usePortfolio();
  const isDark = theme === "dark";
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [hoveredLang, setHoveredLang] = useState<LanguageDatum | null>(null);
  const [selectedLang, setSelectedLang] = useState<LanguageDatum | null>(null);
  const { telemetry } = useGitHubTelemetry();

  const languagesData: LanguageDatum[] = useMemo(() => {
    const palette: Record<string, string> = {
      TypeScript: "#69734A",
      Python: "#3E4A35",
      CSS: "#8D947E",
      JavaScript: "#A9C52F",
      HTML: "#585B52",
      C: "#777A70",
      "Jupyter Notebook": "#B5B8AA",
      PLpgSQL: "#4D5E10",
      Makefile: "#51564A",
      "C++": "#C7E34A",
      Shell: "#8EA82A",
    };

    const descriptions: Record<string, string> = {
      TypeScript:
        "Primary language for full-stack architecture, React interfaces, and server APIs.",
      Python:
        "YOLOv8 computer vision inference, FastAPI backend, and climate utilities.",
      CSS: "Design token architecture, typography clamp scales, and responsive layout grids.",
      JavaScript:
        "Build automation, serverless scripts, and browser/runtime utilities.",
      HTML: "Semantic entry points, accessibility landmarks, and document metadata.",
      C: "Systems programming utilities and low-level metrics helpers.",
      "Jupyter Notebook": "Exploratory data notebooks and telemetry experiments.",
      PLpgSQL: "Relational schemas and database migrations across hosted platforms.",
      Makefile: "Containerized workspace automation and inference build commands.",
      "C++": "Data structures and algorithmic solutions in sayam-solves.",
      Shell: "Workflow and environment setup scripts.",
    };

    if (telemetry?.languages?.length) {
      return telemetry.languages.slice(0, 8).map((l) => ({
        name: l.name,
        percentage: l.percentage,
        formattedPercentage: l.formattedPercentage || formatPercentage(l.percentage),
        color: palette[l.name] || l.color || "#69734A",
        description:
          descriptions[l.name] ||
          `Verified across ${l.repoCount} public owned ${l.repoCount === 1 ? "repository" : "repositories"}.`,
      }));
    }

    return [
      {
        name: "TypeScript",
        percentage: 93.8,
        formattedPercentage: "93.8%",
        color: "#69734A",
        description: descriptions.TypeScript,
      },
      {
        name: "Python",
        percentage: 2.3,
        formattedPercentage: "2.3%",
        color: "#3E4A35",
        description: descriptions.Python,
      },
    ];
  }, [telemetry]);

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

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3
      .pie<LanguageDatum>()
      .value((d) => d.percentage)
      .sort(null)
      .padAngle(padAngle);

    const arc = d3
      .arc<d3.PieArcDatum<LanguageDatum>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(cornerRadius);

    const arcHover = d3
      .arc<d3.PieArcDatum<LanguageDatum>>()
      .innerRadius(innerRadius - 2)
      .outerRadius(radius + 5)
      .cornerRadius(cornerRadius + 1);

    g.append("circle")
      .attr("r", (radius + innerRadius) / 2)
      .attr("fill", "none")
      .attr("stroke", isDark ? "rgba(244, 244, 237, 0.06)" : "rgba(32, 35, 29, 0.08)")
      .attr("stroke-width", radius - innerRadius);

    const segmentStroke = isDark ? "#20231D" : "#FFFFFF";
    const segmentHoverStroke = isDark ? "#C7E34A" : "#20231D";

    const pathGroup = g
      .selectAll<SVGPathElement, d3.PieArcDatum<LanguageDatum>>(".arc-path")
      .data(pie(languagesData))
      .enter()
      .append("path")
      .attr("class", "arc-path cursor-pointer")
      .attr("fill", (d) => d.data.color)
      .attr("stroke", segmentStroke)
      .attr("stroke-width", "2")
      .attr("d", arc as any);

    pathGroup
      .on("mouseenter", function (_, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr("d", arcHover as any)
          .attr("stroke", segmentHoverStroke);
        setHoveredLang(d.data);
      })
      .on("mouseleave", function () {
        d3.select(this)
          .transition()
          .duration(150)
          .attr("d", arc as any)
          .attr("stroke", segmentStroke);
        setHoveredLang(null);
      })
      .on("click", function (_, d) {
        setSelectedLang(d.data);
      });
  }, [languagesData, isDark]);

  const activeDisplay = hoveredLang || selectedLang || languagesData[0];

  return (
    <div ref={containerRef} className={`space-y-4 font-sans ${className}`}>
      <div
        className="flex items-center justify-between border-b pb-3"
        style={{ borderColor: "var(--border)" }}
      >
        <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5 text-[var(--accent)]" />
          Codebase Language Breakdown
        </span>
        <span className="text-[10px] font-mono text-[var(--text-faint)]">
          Live Git Distribution
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        <div className="relative shrink-0">
          <svg ref={svgRef} width={220} height={220} className="overflow-visible" />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-1">
            <span className="text-base font-extrabold text-[var(--text)] font-display tabular-nums leading-tight">
              {activeDisplay?.formattedPercentage}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-mono tracking-tight mt-0.5 truncate max-w-[90px]">
              {activeDisplay?.name}
            </span>
          </div>
        </div>

        {showLegend && (
          <div className="space-y-2 w-full sm:w-auto">
            {languagesData.map((lang, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedLang(lang)}
                className="flex items-center justify-between gap-4 p-2.5 rounded-[6px] border hover:border-[var(--border-strong)] transition-colors cursor-pointer text-xs font-mono"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-[2px]"
                    style={{ backgroundColor: lang.color }}
                  />
                  <span className="text-[var(--text)] font-medium">{lang.name}</span>
                </div>
                <span className="text-[var(--text-muted)] font-bold tabular-nums">
                  {lang.formattedPercentage}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeDisplay && (
        <p
          className="text-[11px] text-[var(--text-muted)] leading-relaxed font-mono p-3 rounded-[8px] border"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <span className="text-[var(--text)] font-semibold">
            {activeDisplay.name}:
          </span>{" "}
          {activeDisplay.description}
        </p>
      )}
    </div>
  );
}

const LanguageRingChart = memo(LanguageRingChartComponent);
export default LanguageRingChart;
