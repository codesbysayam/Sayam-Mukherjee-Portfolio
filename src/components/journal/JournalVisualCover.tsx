import React, { useState } from "react";
import { getProjectMedia } from "../../data/projectMedia";
import { ImageCurtainReveal, ScrollScaleImage } from "../../motion/Reveal";

export type JournalDiagramId =
  | "hitl-state-machine"
  | "memory-tradeoff"
  | "mausam-pipeline"
  | "academic-matrix"
  | "ui-clarity"
  | "ownership-cycle";

interface JournalVisualCoverProps {
  projectId?: string;
  issueNumber?: string;
  category: string;
  title: string;
  caption?: string;
  variant?: "featured" | "card" | "hero";
  immediate?: boolean;
}

export function JournalVisualCover({
  projectId = "portfolio",
  issueNumber = "ISSUE 01",
  category,
  title,
  caption,
  variant = "card",
  immediate = false,
}: JournalVisualCoverProps) {
  const media = getProjectMedia(projectId);
  const [imgSrc, setImgSrc] = useState(media.src);
  const [failed, setFailed] = useState(false);

  const handleImgError = () => {
    if (media.fallbackSrc && imgSrc !== media.fallbackSrc) {
      setImgSrc(media.fallbackSrc);
      return;
    }
    setFailed(true);
  };

  const aspectClass =
    variant === "hero"
      ? "aspect-[16/9] sm:aspect-[21/10]"
      : variant === "featured"
      ? "aspect-[16/10]"
      : "aspect-[16/9]";

  const innerFrame = failed || !imgSrc ? (
    <div className="w-full h-full flex flex-col justify-between p-5 bg-[#171B16] text-[#F2F1E9]">
      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.14em] text-[#C7E34A]">
        <span>{issueNumber}</span>
        <span>{category}</span>
      </div>
      <div className="space-y-1">
        <div className="font-display text-base sm:text-lg font-extrabold leading-snug">
          {title}
        </div>
        <div className="font-mono text-[11px] text-[#B5B8AA]">
          {caption || media.caption}
        </div>
      </div>
    </div>
  ) : (
    <img
      src={imgSrc}
      alt={caption || media.alt || title}
      loading={variant === "card" ? "lazy" : "eager"}
      decoding="async"
      onError={handleImgError}
      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
    />
  );

  return (
    <figure className="space-y-2 w-full">
      <div
        className={`relative w-full ${aspectClass} overflow-hidden rounded-[8px] border border-[var(--border-strong)] bg-[#151713]`}
      >
        {variant === "hero" ? (
          <ScrollScaleImage className="w-full h-full">
            <ImageCurtainReveal immediate={immediate} className="w-full h-full">
              {innerFrame}
            </ImageCurtainReveal>
          </ScrollScaleImage>
        ) : variant === "featured" ? (
          <ImageCurtainReveal immediate={immediate} className="w-full h-full">
            {innerFrame}
          </ImageCurtainReveal>
        ) : (
          innerFrame
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#151713]/80 via-[#151713]/20 to-transparent" />
        <div className="pointer-events-none absolute bottom-2.5 left-3 right-3 flex items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-[0.12em] text-[#F4F4ED]">
          <span className="text-[#C7E34A] font-bold">{issueNumber}</span>
          <span className="truncate opacity-85">{category}</span>
        </div>
      </div>

      {variant === "hero" && (caption || media.caption) && (
        <figcaption className="text-[11px] font-mono text-[var(--text-muted)] leading-relaxed">
          Figure: {caption || media.caption}
        </figcaption>
      )}
    </figure>
  );
}

interface JournalDiagramBlockProps {
  diagramId: JournalDiagramId;
}

export function JournalDiagramBlock({ diagramId }: JournalDiagramBlockProps) {
  return (
    <figure className="my-6 rounded-[10px] border border-[var(--border-strong)] bg-[var(--surface-2)] p-4 sm:p-5 space-y-3 overflow-hidden">
      {diagramId === "hitl-state-machine" && (
        <>
          <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
            <span className="uppercase tracking-wider font-semibold text-[var(--accent)]">
              Diagram · OPERON Approval State Transition
            </span>
            <span>Deterministic Gate</span>
          </div>
          <svg
            viewBox="0 0 760 140"
            role="img"
            aria-label="OPERON agent proposal to human approval gate transition diagram"
            className="w-full h-auto block"
          >
            <defs>
              <marker
                id="arrowHitl"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L0,6 L6,3 z" fill="var(--accent)" />
              </marker>
            </defs>

            {[
              { x: 16, label: "01. AGENT", title: "PROPOSED", sub: "Draft Payload" },
              { x: 204, label: "02. POLICY", title: "AWAITING_HUMAN", sub: "Operator Inspects" },
              { x: 392, label: "03. GATE", title: "SIGN_OFF", sub: "Approve or Halt" },
              { x: 580, label: "04. LEDGER", title: "COMMITTED", sub: "Audit Entry" },
            ].map((box, idx) => (
              <g key={box.title}>
                <rect
                  x={box.x}
                  y={24}
                  width={160}
                  height={88}
                  rx={8}
                  fill={idx === 1 ? "var(--surface)" : "var(--surface-3)"}
                  stroke={idx === 1 ? "var(--accent)" : "var(--border-strong)"}
                  strokeWidth={idx === 1 ? 1.8 : 1.1}
                />
                <text
                  x={box.x + 14}
                  y={45}
                  fill="var(--accent)"
                  fontSize="10"
                  fontWeight="700"
                  fontFamily="var(--font-mono)"
                >
                  {box.label}
                </text>
                <text
                  x={box.x + 14}
                  y={71}
                  fill="var(--text)"
                  fontSize="12"
                  fontWeight="800"
                  fontFamily="var(--font-mono)"
                >
                  {box.title}
                </text>
                <text
                  x={box.x + 14}
                  y={93}
                  fill="var(--text-secondary)"
                  fontSize="10.5"
                  fontFamily="var(--font-sans)"
                >
                  {box.sub}
                </text>
                {idx < 3 && (
                  <line
                    x1={box.x + 162}
                    y1={68}
                    x2={box.x + 186}
                    y2={68}
                    stroke="var(--accent)"
                    strokeWidth="1.8"
                    markerEnd="url(#arrowHitl)"
                  />
                )}
              </g>
            ))}
          </svg>
        </>
      )}

      {diagramId === "memory-tradeoff" && (
        <>
          <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
            <span className="uppercase tracking-wider font-semibold text-[var(--accent)]">
              Diagram · Memory Complexity Envelope
            </span>
            <span>O(T) KV Cache vs O(1) State</span>
          </div>
          <svg
            viewBox="0 0 760 175"
            role="img"
            aria-label="Comparison of O(T) linear cache growth against O(1) fixed recurrent state"
            className="w-full h-auto block"
          >
            <line x1="64" y1="138" x2="700" y2="138" stroke="var(--border-strong)" strokeWidth="1.2" />
            <line x1="64" y1="20" x2="64" y2="138" stroke="var(--border-strong)" strokeWidth="1.2" />
            {/* O(T) growth */}
            <path
              d="M 64 128 L 700 32"
              fill="none"
              stroke="var(--text-muted)"
              strokeWidth="2"
              strokeDasharray="6 5"
            />
            {/* O(1) fixed bound */}
            <path d="M 64 102 L 700 102" fill="none" stroke="var(--accent)" strokeWidth="2.5" />
            <text x="530" y="30" fill="var(--text-secondary)" fontSize="11" fontFamily="var(--font-mono)">
              O(T) KV Cache Growth
            </text>
            <text x="485" y="92" fill="var(--accent)" fontSize="11" fontWeight="700" fontFamily="var(--font-mono)">
              O(1) Fixed Recurrent / Fast-Weight Bound
            </text>
            <text x="340" y="160" fill="var(--text-muted)" fontSize="10.5" fontFamily="var(--font-mono)">
              Sequence Length (Tokens T) →
            </text>
          </svg>
        </>
      )}

      {diagramId === "mausam-pipeline" && (
        <>
          <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
            <span className="uppercase tracking-wider font-semibold text-[var(--accent)]">
              Diagram · MAUSAM Agency Feed Convergence
            </span>
            <span>SIH 2026</span>
          </div>
          <svg
            viewBox="0 0 760 150"
            role="img"
            aria-label="Convergence of IMD Doppler, CPCB NAQI, INCOIS, and SACHET feeds into unified MAUSAM telemetry layer"
            className="w-full h-auto block"
          >
            {["Doppler Radar", "SACHET / NDMA", "CPCB NAQI", "INCOIS Marine"].map((src, i) => {
              const y = 14 + i * 33;
              return (
                <g key={src}>
                  <rect
                    x="16"
                    y={y}
                    width="156"
                    height="26"
                    rx="5"
                    fill="var(--surface)"
                    stroke="var(--border-strong)"
                  />
                  <text
                    x="28"
                    y={y + 17}
                    fill="var(--text)"
                    fontSize="11"
                    fontFamily="var(--font-mono)"
                  >
                    {src}
                  </text>
                  <path
                    d={`M 174 ${y + 13} C 240 ${y + 13}, 250 75, 316 75`}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="1.4"
                    strokeOpacity="0.85"
                  />
                </g>
              );
            })}
            <rect
              x="318"
              y="38"
              width="196"
              height="74"
              rx="8"
              fill="var(--surface-3)"
              stroke="var(--accent)"
              strokeWidth="1.8"
            />
            <text
              x="416"
              y="68"
              textAnchor="middle"
              fill="var(--accent)"
              fontSize="11"
              fontWeight="700"
              fontFamily="var(--font-mono)"
            >
              NORMALIZED SCHEMA
            </text>
            <text
              x="416"
              y="90"
              textAnchor="middle"
              fill="var(--text)"
              fontSize="12"
              fontWeight="700"
              fontFamily="var(--font-sans)"
            >
              Severity-Ranked View
            </text>
            <line x1="516" y1="75" x2="554" y2="75" stroke="var(--accent)" strokeWidth="1.8" />
            <rect
              x="556"
              y="38"
              width="186"
              height="74"
              rx="8"
              fill="var(--surface)"
              stroke="var(--border-strong)"
            />
            <text
              x="649"
              y="68"
              textAnchor="middle"
              fill="var(--text)"
              fontSize="11.5"
              fontWeight="700"
              fontFamily="var(--font-sans)"
            >
              Actionable Advisories
            </text>
            <text
              x="649"
              y="90"
              textAnchor="middle"
              fill="var(--text-muted)"
              fontSize="10.5"
              fontFamily="var(--font-mono)"
            >
              Ask MAUSAM + Hazard UI
            </text>
          </svg>
        </>
      )}

      {(diagramId === "academic-matrix" ||
        diagramId === "ui-clarity" ||
        diagramId === "ownership-cycle") && (
        <>
          <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
            <span className="uppercase tracking-wider font-semibold text-[var(--accent)]">
              Framework · Iterative Engineering Loop
            </span>
            <span>Applied Discipline</span>
          </div>
          <svg
            viewBox="0 0 760 110"
            role="img"
            aria-label="Four-stage iterative discipline loop"
            className="w-full h-auto block"
          >
            {(diagramId === "academic-matrix"
              ? ["Coursework Theory", "Daily 1h C++ / DSA", "Hackathon Prototypes", "Production Review"]
              : diagramId === "ui-clarity"
              ? ["Visual Hierarchy", "Typographic Measure", "Token Contrast", "Predictable Feedback"]
              : ["Problem Boundary", "Edge-Case Validation", "Modular Types", "Shipped Repository"]
            ).map((label, idx) => {
              const x = 16 + idx * 186;
              return (
                <g key={label}>
                  <rect
                    x={x}
                    y={24}
                    width={168}
                    height={60}
                    rx={7}
                    fill="var(--surface)"
                    stroke={idx === 0 ? "var(--accent)" : "var(--border-strong)"}
                  />
                  <text
                    x={x + 14}
                    y={46}
                    fill="var(--accent)"
                    fontSize="10"
                    fontWeight="700"
                    fontFamily="var(--font-mono)"
                  >
                    0{idx + 1}
                  </text>
                  <text
                    x={x + 14}
                    y={67}
                    fill="var(--text)"
                    fontSize="11.5"
                    fontWeight="700"
                    fontFamily="var(--font-sans)"
                  >
                    {label}
                  </text>
                  {idx < 3 && (
                    <line
                      x1={x + 168}
                      y1={54}
                      x2={x + 186}
                      y2={54}
                      stroke="var(--accent)"
                      strokeWidth="1.5"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </>
      )}
    </figure>
  );
}
