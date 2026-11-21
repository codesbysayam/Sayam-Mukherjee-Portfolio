import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  MOTION_DURATION,
  MOTION_EASE,
  useFinePointer,
  usePrefersReducedMotion,
} from "../../motion/tokens";

export type EngineeringVizMode = "recurrent" | "topology" | "vector";

interface ModeMeta {
  id: EngineeringVizMode;
  label: string;
  footerLeft: string;
  ariaLabel: string;
}

const MODE_OPTIONS: readonly ModeMeta[] = [
  {
    id: "recurrent",
    label: "Recurrent",
    footerLeft: "FIXED-CAPACITY RING STATE",
    ariaLabel: "Recurrent fixed-capacity memory ring model",
  },
  {
    id: "topology",
    label: "Topology",
    footerLeft: "LAYERED EXECUTION TOPOLOGY",
    ariaLabel: "Interactive layered engineering graph topology",
  },
  {
    id: "vector",
    label: "Vector Field",
    footerLeft: "COORDINATE VECTOR FIELD",
    ariaLabel: "Interactive calibrated coordinate vector field",
  },
] as const;

/* ============================================================================
   MODE A DATA: RECURRENT — BOUNDED FIXED-CAPACITY MEMORY RING
   ============================================================================ */

interface RecurrentNodeData {
  index: number;
  code: string;
  label: string;
  retention: number; // 0..1 normalized slot energy
  description: string;
  angleDeg: number;
  targets: readonly number[];
}

const RECURRENT_NODES: readonly RecurrentNodeData[] = [
  {
    index: 0,
    code: "S0",
    label: "Ingest Gate",
    retention: 0.92,
    description: "Projects incoming tokens into fixed-dimension ring coordinates.",
    angleDeg: -90,
    targets: [1, 4],
  },
  {
    index: 1,
    code: "S1",
    label: "Hebbian Trace",
    retention: 0.78,
    description: "Updates associative bindings in place without growing state length.",
    angleDeg: -45,
    targets: [2, 5],
  },
  {
    index: 2,
    code: "S2",
    label: "Context Lock",
    retention: 0.96,
    description: "Preserves invariant task constraints across bounded recurrent steps.",
    angleDeg: 0,
    targets: [3, 6],
  },
  {
    index: 3,
    code: "S3",
    label: "Decay Kernel",
    retention: 0.54,
    description: "Attenuates stale slot energy so fixed ring capacity stays unsaturated.",
    angleDeg: 45,
    targets: [4, 7],
  },
  {
    index: 4,
    code: "S4",
    label: "Phase Key",
    retention: 0.84,
    description: "Encodes relative sequence position via orthogonal rotational phase.",
    angleDeg: 90,
    targets: [5, 0],
  },
  {
    index: 5,
    code: "S5",
    label: "Norm Anchor",
    retention: 0.71,
    description: "Bounds latent norm variance across arbitrarily long rollout windows.",
    angleDeg: 135,
    targets: [6, 1],
  },
  {
    index: 6,
    code: "S6",
    label: "Residual Tap",
    retention: 0.88,
    description: "Routes compressed state deltas back into the central h(t) accumulator.",
    angleDeg: 180,
    targets: [7, 2],
  },
  {
    index: 7,
    code: "S7",
    label: "Output Read",
    retention: 0.9,
    description: "Queries the bounded ring manifold to emit calibrated output logits.",
    angleDeg: 225,
    targets: [0, 3],
  },
];

/* ============================================================================
   MODE B DATA: TOPOLOGY — LAYERED CHAMFERED SYSTEMS SCHEMATIC (NON-CIRCULAR)
   ============================================================================ */

interface TopologyNodeData {
  id: string;
  code: string;
  label: string;
  tier: 1 | 2 | 3;
  col: number; // 0..3
  x: number;
  y: number;
  w: number;
  h: number;
  description: string;
}

interface TopologyEdgeData {
  id: string;
  from: string;
  to: string;
  weight: 1 | 2 | 3;
  directed: boolean;
  path: string; // Explicit chamfered architectural routing trace (zero label collision)
}

const TOPOLOGY_NODES: readonly TopologyNodeData[] = [
  {
    id: "ingest",
    code: "INGEST",
    label: "Intent Parser",
    tier: 3,
    col: 0,
    x: 68,
    y: 136,
    w: 84,
    h: 46,
    description: "Normalizes unstructured requests into schema-verified execution contracts.",
  },
  {
    id: "memory",
    code: "STATE",
    label: "State Store",
    tier: 2,
    col: 0,
    x: 68,
    y: 312,
    w: 84,
    h: 50,
    description: "Maintains deterministic session snapshots and idempotent transition logs.",
  },
  {
    id: "policy",
    code: "POLICY",
    label: "Policy Gate",
    tier: 2,
    col: 1,
    x: 186,
    y: 136,
    w: 88,
    h: 50,
    description: "Evaluates capability permissions and risk thresholds before mutation.",
  },
  {
    id: "audit",
    code: "AUDIT",
    label: "Trace Ledger",
    tier: 3,
    col: 1,
    x: 186,
    y: 356,
    w: 88,
    h: 46,
    description: "Records signed causal step traces for deterministic replay and audit.",
  },
  {
    id: "router",
    code: "CORE",
    label: "Graph Router",
    tier: 1,
    col: 2,
    x: 312,
    y: 214,
    w: 98,
    h: 60,
    description: "Central orchestrator routing typed execution plans under bounded latency.",
  },
  {
    id: "human",
    code: "HITL",
    label: "Approval Gate",
    tier: 2,
    col: 2,
    x: 312,
    y: 356,
    w: 94,
    h: 48,
    description: "Enforces human sign-off checkpoints prior to high-impact execution.",
  },
  {
    id: "worker",
    code: "WORKER",
    label: "Agent Pool",
    tier: 3,
    col: 3,
    x: 434,
    y: 136,
    w: 84,
    h: 46,
    description: "Runs isolated tool invocations and model inference inside strict timeouts.",
  },
  {
    id: "verify",
    code: "VERIFY",
    label: "Invariant Check",
    tier: 3,
    col: 3,
    x: 434,
    y: 292,
    w: 84,
    h: 46,
    description: "Validates output schemas and invariants before committing state transitions.",
  },
];

// Carefully routed mitered PCB-style paths between module ports (never crossing boxes or text)
const TOPOLOGY_EDGES: readonly TopologyEdgeData[] = [
  {
    id: "e1",
    from: "ingest",
    to: "policy",
    weight: 3,
    directed: true,
    path: "M 110 136 L 138 136",
  },
  {
    id: "e2",
    from: "policy",
    to: "router",
    weight: 3,
    directed: true,
    path: "M 230 136 L 286 136 L 286 179",
  },
  {
    id: "e3",
    from: "memory",
    to: "router",
    weight: 2,
    directed: false,
    path: "M 110 312 L 144 312 L 160 296 L 160 226 L 263 226",
  },
  {
    id: "e4",
    from: "memory",
    to: "audit",
    weight: 1,
    directed: true,
    path: "M 110 326 L 128 326 L 138 356",
  },
  {
    id: "e5",
    from: "router",
    to: "worker",
    weight: 3,
    directed: true,
    path: "M 361 200 L 376 200 L 386 190 L 386 136 L 387 136",
  },
  {
    id: "e6",
    from: "router",
    to: "human",
    weight: 3,
    directed: true,
    path: "M 312 244 L 312 327",
  },
  {
    id: "e7",
    from: "human",
    to: "verify",
    weight: 2,
    directed: true,
    path: "M 359 356 L 378 356 L 378 302 L 387 302",
  },
  {
    id: "e8",
    from: "worker",
    to: "verify",
    weight: 2,
    directed: true,
    path: "M 434 159 L 434 264",
  },
  {
    id: "e9",
    from: "verify",
    to: "router",
    weight: 2,
    directed: true,
    path: "M 392 282 L 374 282 L 374 232 L 366 232",
  },
  {
    id: "e10",
    from: "human",
    to: "audit",
    weight: 1,
    directed: true,
    path: "M 265 356 L 234 356",
  },
  {
    id: "e11",
    from: "policy",
    to: "audit",
    weight: 1,
    directed: false,
    path: "M 186 161 L 186 327",
  },
];

/* ============================================================================
   SUBCOMPONENT A: RECURRENT RING SVG
   ============================================================================ */

interface RecurrentRingDiagramProps {
  selectedIdx: number;
  onSelect: (idx: number) => void;
  reduced: boolean;
  isActive: boolean;
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number
): string {
  const s = (startDeg * Math.PI) / 180;
  const e = (endDeg * Math.PI) / 180;
  const x1 = cx + r * Math.cos(s);
  const y1 = cy + r * Math.sin(s);
  const x2 = cx + r * Math.cos(e);
  const y2 = cy + r * Math.sin(e);
  const large = endDeg - startDeg <= 180 ? "0" : "1";
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

const RecurrentRingDiagram = memo(function RecurrentRingDiagram({
  selectedIdx,
  onSelect,
  reduced,
  isActive,
}: RecurrentRingDiagramProps) {
  const cx = 250;
  const cy = 238;
  const ringR = 136;
  const innerOrbitR = 78;
  const capacityArcR = 166;
  const outerBoundR = 186;

  const coords = useMemo(
    () =>
      RECURRENT_NODES.map((n) => {
        const rad = (n.angleDeg * Math.PI) / 180;
        return {
          ...n,
          x: cx + Math.cos(rad) * ringR,
          y: cy + Math.sin(rad) * ringR,
          lx: cx + Math.cos(rad) * (outerBoundR + 14),
          ly: cy + Math.sin(rad) * (outerBoundR + 14),
        };
      }),
    []
  );

  const selectedNode = coords[selectedIdx] ?? coords[0];
  const connectedTargetSet = useMemo(
    () => new Set(selectedNode.targets),
    [selectedNode]
  );
  const incomingSourceSet = useMemo(() => {
    const incoming = new Set<number>();
    coords.forEach((n) => {
      if (n.targets.includes(selectedIdx)) incoming.add(n.index);
    });
    return incoming;
  }, [coords, selectedIdx]);

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      onSelect(idx);
    } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      e.stopPropagation();
      onSelect((idx + 1) % coords.length);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      e.stopPropagation();
      onSelect((idx - 1 + coords.length) % coords.length);
    }
  };

  return (
    <g>
      <defs>
        <marker
          id="rec-arrow-dim"
          viewBox="0 0 8 8"
          refX="6"
          refY="4"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 7 4 L 0 7 z" fill="rgba(181, 184, 170, 0.42)" />
        </marker>
        <marker
          id="rec-arrow-lime"
          viewBox="0 0 8 8"
          refX="6"
          refY="4"
          markerWidth="5.5"
          markerHeight="5.5"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 7 4 L 0 7 z" fill="#C7E34A" />
        </marker>
      </defs>

      {/* Outer Fixed-Capacity Boundary Shell */}
      <text
        x={cx}
        y={24}
        textAnchor="middle"
        fill="#8C8F82"
        fontSize="9"
        fontFamily="var(--font-mono)"
        letterSpacing="0.16em"
      >
        BOUNDED CAPACITY · N = 8 SLOTS · O(1)
      </text>

      <circle
        cx={cx}
        cy={cy}
        r={outerBoundR}
        fill="none"
        stroke="rgba(220, 225, 190, 0.14)"
        strokeWidth="1"
        strokeDasharray="3 5"
      />

      {/* Per-slot Bounded Energy Arcs around Capacity Perimeter */}
      {coords.map((node) => {
        const isSelected = node.index === selectedIdx;
        const span = 28 * node.retention;
        const startA = node.angleDeg - span * 0.5;
        const endA = node.angleDeg + span * 0.5;
        return (
          <path
            key={`cap-${node.code}`}
            d={describeArc(cx, cy, capacityArcR, startA, endA)}
            fill="none"
            stroke={isSelected ? "#C7E34A" : "rgba(105, 115, 74, 0.48)"}
            strokeWidth={isSelected ? 3.2 : 2}
            strokeLinecap="round"
            style={{ transition: "stroke 220ms ease, stroke-width 220ms ease" }}
          />
        );
      })}

      {/* Main Ring & Inner Orbit */}
      <circle
        cx={cx}
        cy={cy}
        r={ringR}
        fill="none"
        stroke="rgba(105, 115, 74, 0.3)"
        strokeWidth="1.1"
      />
      <circle
        cx={cx}
        cy={cy}
        r={innerOrbitR}
        fill="none"
        stroke="rgba(244, 244, 237, 0.08)"
        strokeWidth="1"
      />

      {/* Directed Ring & Skip Connections */}
      {coords.map((src) =>
        src.targets.map((targetIdx) => {
          const dst = coords[targetIdx];
          const isOutgoing = src.index === selectedIdx;
          const isIncoming = targetIdx === selectedIdx;
          const isHighlighted = isOutgoing || isIncoming;

          const isRingStep = (src.index + 1) % coords.length === targetIdx;
          const midX = (src.x + dst.x) * 0.5;
          const midY = (src.y + dst.y) * 0.5;
          const pull = isRingStep ? 0.18 : 0.44;
          const ctrlX = midX + (cx - midX) * pull;
          const ctrlY = midY + (cy - midY) * pull;

          const dx = dst.x - ctrlX;
          const dy = dst.y - ctrlY;
          const len = Math.hypot(dx, dy) || 1;
          const endX = dst.x - (dx / len) * 19;
          const endY = dst.y - (dy / len) * 19;

          const sx = src.x - cx;
          const sy = src.y - cy;
          const slen = Math.hypot(sx, sy) || 1;
          const startX = src.x - (sx / slen) * 4;
          const startY = src.y - (sy / slen) * 4;

          const d = `M ${startX.toFixed(1)} ${startY.toFixed(1)} Q ${ctrlX.toFixed(1)} ${ctrlY.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`;

          return (
            <g key={`${src.index}-${targetIdx}`}>
              <path
                d={d}
                fill="none"
                stroke={
                  isOutgoing
                    ? "#C7E34A"
                    : isIncoming
                      ? "rgba(244, 244, 237, 0.55)"
                      : "rgba(181, 184, 170, 0.13)"
                }
                strokeWidth={isOutgoing ? 1.85 : isIncoming ? 1.3 : 0.85}
                markerEnd={
                  isHighlighted ? "url(#rec-arrow-lime)" : "url(#rec-arrow-dim)"
                }
                style={{ transition: "stroke 240ms ease, stroke-width 240ms ease" }}
              />
              {isOutgoing && !reduced && isActive && (
                <path
                  d={d}
                  fill="none"
                  stroke="#F4F4ED"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="6 22"
                  className="viz-signal-flow"
                />
              )}
            </g>
          );
        })
      )}

      {/* Radial Coupling Vector from Core to Selected Slot */}
      <line
        x1={cx}
        y1={cy}
        x2={selectedNode.x}
        y2={selectedNode.y}
        stroke="rgba(199, 227, 74, 0.58)"
        strokeWidth="1.35"
        strokeDasharray="3 4"
      />

      {/* Central State Indicator (h_t) */}
      <g>
        {!reduced && isActive && (
          <circle
            cx={cx}
            cy={cy}
            r={40}
            fill="none"
            stroke="rgba(199, 227, 74, 0.35)"
            strokeWidth="1"
            className="viz-pulse-ring"
          />
        )}
        <circle
          cx={cx}
          cy={cy}
          r={31}
          fill="#20231D"
          stroke="#C7E34A"
          strokeWidth="1.5"
        />
        <text
          x={cx}
          y={cy - 2}
          textAnchor="middle"
          fill="#F4F4ED"
          fontSize="11.5"
          fontWeight="700"
          fontFamily="var(--font-mono)"
        >
          h(t)
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fill="#C7E34A"
          fontSize="8.5"
          fontFamily="var(--font-mono)"
          letterSpacing="0.08em"
        >
          {Math.round(selectedNode.retention * 100)}% LOCK
        </text>
      </g>

      {/* Interactive Circular Memory Nodes + Clear External Radial Labels */}
      {coords.map((node) => {
        const isSelected = node.index === selectedIdx;
        const isNeighbor =
          connectedTargetSet.has(node.index) || incomingSourceSet.has(node.index);

        return (
          <g
            key={node.code}
            role="button"
            tabIndex={0}
            aria-label={`${node.code} ${node.label}: ${node.description}`}
            aria-pressed={isSelected}
            onClick={() => onSelect(node.index)}
            onMouseEnter={() => onSelect(node.index)}
            onFocus={() => onSelect(node.index)}
            onKeyDown={(e) => handleKeyDown(e, node.index)}
            className="cursor-pointer focus:outline-none"
          >
            <circle cx={node.x} cy={node.y} r={25} fill="transparent" />

            {isSelected && !reduced && isActive && (
              <circle
                cx={node.x}
                cy={node.y}
                r={21}
                fill="none"
                stroke="#C7E34A"
                strokeWidth="1.2"
                className="viz-pulse-ring"
              />
            )}

            <circle
              cx={node.x}
              cy={node.y}
              r={isSelected ? 16 : isNeighbor ? 13.5 : 12}
              fill={isSelected ? "#C7E34A" : "#20231D"}
              stroke={
                isSelected
                  ? "#F4F4ED"
                  : isNeighbor
                    ? "#C7E34A"
                    : "rgba(220, 225, 190, 0.36)"
              }
              strokeWidth={isSelected ? 2 : 1.25}
              style={{ transition: "all 200ms cubic-bezier(0.22, 1, 0.36, 1)" }}
            />

            <text
              x={node.x}
              y={node.y + 3.5}
              textAnchor="middle"
              fill={isSelected ? "#151713" : isNeighbor ? "#C7E34A" : "#F4F4ED"}
              fontSize="9"
              fontWeight={isSelected ? "800" : "600"}
              fontFamily="var(--font-mono)"
            >
              {node.code}
            </text>
          </g>
        );
      })}
    </g>
  );
});

/* ============================================================================
   SUBCOMPONENT B: TOPOLOGY — LAYERED CHAMFERED SYSTEMS SCHEMATIC
   ============================================================================ */

interface TopologyGraphDiagramProps {
  selectedId: string;
  onSelect: (id: string) => void;
  reduced: boolean;
  isActive: boolean;
}

function chamferedBoxPath(cx: number, cy: number, w: number, h: number, c = 7): string {
  const x0 = cx - w * 0.5;
  const x1 = cx + w * 0.5;
  const y0 = cy - h * 0.5;
  const y1 = cy + h * 0.5;
  return [
    `M ${(x0 + c).toFixed(1)} ${y0.toFixed(1)}`,
    `L ${(x1 - c).toFixed(1)} ${y0.toFixed(1)}`,
    `L ${x1.toFixed(1)} ${(y0 + c).toFixed(1)}`,
    `L ${x1.toFixed(1)} ${(y1 - c).toFixed(1)}`,
    `L ${(x1 - c).toFixed(1)} ${y1.toFixed(1)}`,
    `L ${(x0 + c).toFixed(1)} ${y1.toFixed(1)}`,
    `L ${x0.toFixed(1)} ${(y1 - c).toFixed(1)}`,
    `L ${x0.toFixed(1)} ${(y0 + c).toFixed(1)}`,
    "Z",
  ].join(" ");
}

const LAYER_HEADERS = [
  { x: 68, label: "01 INGEST" },
  { x: 186, label: "02 GATE" },
  { x: 312, label: "03 CONTROL" },
  { x: 434, label: "04 EXECUTE" },
] as const;

const TopologyGraphDiagram = memo(function TopologyGraphDiagram({
  selectedId,
  onSelect,
  reduced,
  isActive,
}: TopologyGraphDiagramProps) {
  const neighborIds = useMemo(() => {
    const neighbors = new Set<string>();
    TOPOLOGY_EDGES.forEach((e) => {
      if (e.from === selectedId) neighbors.add(e.to);
      if (e.to === selectedId) neighbors.add(e.from);
    });
    return neighbors;
  }, [selectedId]);

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      onSelect(TOPOLOGY_NODES[idx].id);
    } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      e.stopPropagation();
      onSelect(TOPOLOGY_NODES[(idx + 1) % TOPOLOGY_NODES.length].id);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      e.stopPropagation();
      onSelect(
        TOPOLOGY_NODES[(idx - 1 + TOPOLOGY_NODES.length) % TOPOLOGY_NODES.length].id
      );
    }
  };

  return (
    <g>
      <defs>
        <marker
          id="topo-arrow-dim"
          viewBox="0 0 8 8"
          refX="6"
          refY="4"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 7 4 L 0 7 z" fill="rgba(181, 184, 170, 0.42)" />
        </marker>
        <marker
          id="topo-arrow-active"
          viewBox="0 0 8 8"
          refX="6"
          refY="4"
          markerWidth="5.5"
          markerHeight="5.5"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 7 4 L 0 7 z" fill="#C7E34A" />
        </marker>
      </defs>

      <text
        x={250}
        y={24}
        textAnchor="middle"
        fill="#8C8F82"
        fontSize="9"
        fontFamily="var(--font-mono)"
        letterSpacing="0.16em"
      >
        LAYERED EXECUTION TOPOLOGY · WEIGHTED BUS
      </text>

      {/* Architectural Vertical Stage Columns & Labels */}
      {LAYER_HEADERS.map((col, i) => (
        <g key={col.label}>
          {i > 0 && (
            <line
              x1={col.x - 59}
              y1={56}
              x2={col.x - 59}
              y2={424}
              stroke="rgba(220, 225, 190, 0.06)"
              strokeWidth="1"
              strokeDasharray="3 6"
            />
          )}
          <text
            x={col.x}
            y={64}
            textAnchor="middle"
            fill="#69734A"
            fontSize="8.5"
            fontWeight="600"
            fontFamily="var(--font-mono)"
            letterSpacing="0.1em"
          >
            {col.label}
          </text>
        </g>
      ))}

      {/* Weighted Mitered Bus Traces */}
      {TOPOLOGY_EDGES.map((edge) => {
        const isIncident = edge.from === selectedId || edge.to === selectedId;
        const baseWidth = edge.weight === 3 ? 2.1 : edge.weight === 2 ? 1.45 : 1.05;

        return (
          <g key={edge.id}>
            <path
              d={edge.path}
              fill="none"
              stroke={
                isIncident
                  ? "#C7E34A"
                  : edge.weight === 3
                    ? "rgba(244, 244, 237, 0.22)"
                    : "rgba(181, 184, 170, 0.14)"
              }
              strokeWidth={isIncident ? baseWidth + 0.5 : baseWidth}
              strokeLinejoin="round"
              strokeDasharray={edge.directed ? undefined : "4 4"}
              markerEnd={
                edge.directed
                  ? isIncident
                    ? "url(#topo-arrow-active)"
                    : "url(#topo-arrow-dim)"
                  : undefined
              }
              style={{ transition: "stroke 220ms ease, stroke-width 220ms ease" }}
            />
            {isIncident && !reduced && isActive && (
              <path
                d={edge.path}
                fill="none"
                stroke="#F4F4ED"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="6 20"
                className="viz-signal-flow"
              />
            )}
          </g>
        );
      })}

      {/* Chamfered Multi-Tier Module Nodes (Labels cleanly inside modules — zero trace overlap) */}
      {TOPOLOGY_NODES.map((node, idx) => {
        const isSelected = node.id === selectedId;
        const isNeighbor = neighborIds.has(node.id);
        const outerD = chamferedBoxPath(node.x, node.y, node.w, node.h, node.tier === 1 ? 10 : 7);
        const haloD = chamferedBoxPath(
          node.x,
          node.y,
          node.w + 8,
          node.h + 8,
          node.tier === 1 ? 12 : 9
        );

        return (
          <g
            key={node.id}
            role="button"
            tabIndex={0}
            aria-label={`${node.label} (Tier ${node.tier}): ${node.description}`}
            aria-pressed={isSelected}
            onClick={() => onSelect(node.id)}
            onMouseEnter={() => onSelect(node.id)}
            onFocus={() => onSelect(node.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className="cursor-pointer focus:outline-none"
          >
            {/* Generous touch target */}
            <rect
              x={node.x - node.w * 0.5 - 6}
              y={node.y - node.h * 0.5 - 8}
              width={node.w + 12}
              height={node.h + 16}
              fill="transparent"
            />

            {/* Outer Tier Frame / Selection Halo */}
            {(node.tier <= 2 || isSelected) && (
              <path
                d={haloD}
                fill="none"
                stroke={
                  isSelected
                    ? "#C7E34A"
                    : "rgba(220, 225, 190, 0.16)"
                }
                strokeWidth={isSelected ? 1.2 : 0.9}
                strokeDasharray={node.tier === 2 && !isSelected ? "3 3" : undefined}
                className={isSelected && !reduced && isActive ? "viz-pulse-ring" : undefined}
              />
            )}

            {/* Main Module Chassis */}
            <path
              d={outerD}
              fill={
                isSelected
                  ? "#C7E34A"
                  : node.tier === 1
                    ? "#262A21"
                    : "#1B1E18"
              }
              stroke={
                isSelected
                  ? "#F4F4ED"
                  : isNeighbor
                    ? "#C7E34A"
                    : node.tier === 1
                      ? "#C7E34A"
                      : "rgba(220, 225, 190, 0.34)"
              }
              strokeWidth={isSelected ? 1.9 : node.tier === 1 ? 1.7 : 1.2}
              style={{ transition: "all 220ms cubic-bezier(0.22, 1, 0.36, 1)" }}
            />

            {/* Tier Corner Notch Accent */}
            <circle
              cx={node.x - node.w * 0.5 + 9}
              cy={node.y - node.h * 0.5 + 9}
              r={2}
              fill={
                isSelected
                  ? "#151713"
                  : node.tier === 1 || isNeighbor
                    ? "#C7E34A"
                    : "#69734A"
              }
            />

            {/* Module Code */}
            <text
              x={node.x}
              y={node.y - 3}
              textAnchor="middle"
              fill={
                isSelected
                  ? "#151713"
                  : isNeighbor || node.tier === 1
                    ? "#C7E34A"
                    : "#F4F4ED"
              }
              fontSize={node.tier === 1 ? "10.5" : "9"}
              fontWeight="800"
              fontFamily="var(--font-mono)"
              letterSpacing="0.06em"
            >
              {node.code}
            </text>

            {/* Module Human Name cleanly inside chassis */}
            <text
              x={node.x}
              y={node.y + 11}
              textAnchor="middle"
              fill={
                isSelected
                  ? "#20231D"
                  : isNeighbor
                    ? "#D4D6CA"
                    : "#8C8F82"
              }
              fontSize="7.5"
              fontWeight="600"
              fontFamily="var(--font-sans)"
            >
              {node.label}
            </text>
          </g>
        );
      })}
    </g>
  );
});

/* ============================================================================
   SUBCOMPONENT C: VECTOR FIELD SVG (CALIBRATED COORDINATE INSTRUMENT)
   ============================================================================ */

interface VectorFieldDiagramProps {
  anchor: { x: number; y: number };
  onSetAnchor: (pt: { x: number; y: number }) => void;
  reduced: boolean;
  isFinePointer: boolean;
  isActive: boolean;
}

const GRID_SIZE = 9;
const FIELD_POINTS = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, idx) => {
  const row = Math.floor(idx / GRID_SIZE);
  const col = idx % GRID_SIZE;
  const x = 74 + col * 44;
  const y = 72 + row * 41;
  return { idx, row, col, x, y };
});

function computeFieldVector(
  px: number,
  py: number,
  ax: number,
  ay: number
): { angleDeg: number; highlight: number } {
  const nx = (px - 250) / 185;
  const ny = (py - 236) / 185;
  const baseRad = Math.atan2(
    Math.cos(nx * 2.15) * 0.72 - ny * 0.52,
    Math.sin(ny * 2.2) * 0.76 + nx * 0.44
  );

  const dx = ax - px;
  const dy = ay - py;
  const dist = Math.hypot(dx, dy);
  const influence = Math.max(0, 1 - dist / 205);
  const curlAngle = Math.atan2(dy, dx) + Math.PI * 0.34;

  let diff = curlAngle - baseRad;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;

  const finalRad = baseRad + diff * influence * 0.85;
  return {
    angleDeg: (finalRad * 180) / Math.PI,
    highlight: influence,
  };
}

const VectorFieldDiagram = memo(function VectorFieldDiagram({
  anchor,
  onSetAnchor,
  reduced,
  isFinePointer,
  isActive,
}: VectorFieldDiagramProps) {
  const groupRef = useRef<SVGGElement | null>(null);
  const needleRefs = useRef<(SVGGElement | null)[]>([]);
  const headRefs = useRef<(SVGPathElement | null)[]>([]);
  const markerRingRef = useRef<SVGGElement | null>(null);

  const currentFocusRef = useRef({ x: anchor.x, y: anchor.y });
  const targetFocusRef = useRef({ x: anchor.x, y: anchor.y });
  const rafRef = useRef(0);

  const applyFieldTransforms = useCallback((fx: number, fy: number) => {
    for (let i = 0; i < FIELD_POINTS.length; i++) {
      const pt = FIELD_POINTS[i];
      const { angleDeg, highlight } = computeFieldVector(pt.x, pt.y, fx, fy);
      const group = needleRefs.current[i];
      if (group) {
        const scale = 0.86 + highlight * 0.34;
        group.setAttribute(
          "transform",
          `translate(${pt.x} ${pt.y}) rotate(${angleDeg.toFixed(1)}) scale(${scale.toFixed(2)})`
        );
      }
      const path = headRefs.current[i];
      if (path) {
        path.setAttribute(
          "stroke",
          highlight > 0.25
            ? `rgba(199, 227, 74, ${(0.48 + highlight * 0.52).toFixed(2)})`
            : "rgba(181, 184, 170, 0.34)"
        );
      }
    }
    if (markerRingRef.current) {
      markerRingRef.current.setAttribute(
        "transform",
        `translate(${fx.toFixed(1)} ${fy.toFixed(1)})`
      );
    }
  }, []);

  useEffect(() => {
    targetFocusRef.current = { x: anchor.x, y: anchor.y };
    if (reduced || !isFinePointer) {
      currentFocusRef.current = { x: anchor.x, y: anchor.y };
      applyFieldTransforms(anchor.x, anchor.y);
    }
  }, [anchor, reduced, isFinePointer, applyFieldTransforms]);

  useEffect(() => {
    applyFieldTransforms(anchor.x, anchor.y);
  }, [applyFieldTransforms, anchor.x, anchor.y]);

  useEffect(() => {
    const svg = groupRef.current?.ownerSVGElement;
    if (!svg || reduced || !isFinePointer || !isActive) return;

    const scheduleStep = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(step);
    };

    const step = () => {
      rafRef.current = 0;
      const cur = currentFocusRef.current;
      const tgt = targetFocusRef.current;
      const dx = tgt.x - cur.x;
      const dy = tgt.y - cur.y;

      if (Math.abs(dx) < 0.35 && Math.abs(dy) < 0.35) {
        cur.x = tgt.x;
        cur.y = tgt.y;
        applyFieldTransforms(cur.x, cur.y);
        return;
      }

      cur.x += dx * 0.16;
      cur.y += dy * 0.16;
      applyFieldTransforms(cur.x, cur.y);
      scheduleStep();
    };

    const toSvgPoint = (e: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;
      const x = Math.min(430, Math.max(70, ((e.clientX - rect.left) / rect.width) * 500));
      const y = Math.min(404, Math.max(68, ((e.clientY - rect.top) / rect.height) * 470));
      return { x, y };
    };

    const onPointerMove = (e: PointerEvent) => {
      const pt = toSvgPoint(e);
      if (!pt) return;
      targetFocusRef.current = pt;
      scheduleStep();
    };

    const onPointerLeave = () => {
      targetFocusRef.current = { x: anchor.x, y: anchor.y };
      scheduleStep();
    };

    svg.addEventListener("pointermove", onPointerMove, { passive: true });
    svg.addEventListener("pointerleave", onPointerLeave, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      svg.removeEventListener("pointermove", onPointerMove);
      svg.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [anchor, reduced, isFinePointer, isActive, applyFieldTransforms]);

  const handleGroupClick = (e: React.MouseEvent<SVGGElement>) => {
    const svg = e.currentTarget.ownerSVGElement;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = Math.min(426, Math.max(74, ((e.clientX - rect.left) / rect.width) * 500));
    const y = Math.min(400, Math.max(72, ((e.clientY - rect.top) / rect.height) * 470));
    onSetAnchor({ x: Math.round(x), y: Math.round(y) });
  };

  return (
    <g ref={groupRef} onClick={handleGroupClick} className="cursor-crosshair">
      <rect x={0} y={0} width={500} height={470} fill="transparent" />

      <text
        x={250}
        y={24}
        textAnchor="middle"
        fill="#8C8F82"
        fontSize="9"
        fontFamily="var(--font-mono)"
        letterSpacing="0.16em"
      >
        VECTOR GRADIENT · 9×9 COORDINATE LATTICE
      </text>

      {/* Calibrated Coordinate Rulers & Origin Frame */}
      <rect
        x={50}
        y={48}
        width={400}
        height={376}
        rx={4}
        fill="none"
        stroke="rgba(220, 225, 190, 0.1)"
        strokeWidth="1"
      />
      <line
        x1={50}
        y1={236}
        x2={450}
        y2={236}
        stroke="rgba(220, 225, 190, 0.08)"
        strokeWidth="1"
      />
      <line
        x1={250}
        y1={48}
        x2={250}
        y2={424}
        stroke="rgba(220, 225, 190, 0.08)"
        strokeWidth="1"
      />
      <text x={58} y={60} fill="#69734A" fontSize="7.5" fontFamily="var(--font-mono)">
        (-1, +1)
      </text>
      <text x={442} y={60} textAnchor="end" fill="#69734A" fontSize="7.5" fontFamily="var(--font-mono)">
        (+1, +1)
      </text>
      <text x={58} y={416} fill="#69734A" fontSize="7.5" fontFamily="var(--font-mono)">
        (-1, -1)
      </text>
      <text x={442} y={416} textAnchor="end" fill="#69734A" fontSize="7.5" fontFamily="var(--font-mono)">
        (+1, -1)
      </text>

      {/* Streamline particle flow ribbons */}
      <path
        d="M 68 148 C 145 108, 220 186, 290 152 C 360 118, 405 148, 434 188"
        fill="none"
        stroke="rgba(199, 227, 74, 0.24)"
        strokeWidth="1.2"
        strokeDasharray="10 18"
        className={!reduced && isActive ? "viz-signal-flow" : undefined}
      />
      <path
        d="M 70 330 C 140 364, 215 280, 290 314 C 365 348, 405 314, 434 268"
        fill="none"
        stroke="rgba(105, 115, 74, 0.42)"
        strokeWidth="1.2"
        strokeDasharray="8 16"
        className={!reduced && isActive ? "viz-signal-flow-slow" : undefined}
      />

      {/* 81 Directional Field Vectors */}
      {FIELD_POINTS.map((pt, i) => (
        <g
          key={pt.idx}
          ref={(el) => {
            needleRefs.current[i] = el;
          }}
          transform={`translate(${pt.x} ${pt.y})`}
        >
          <path
            ref={(el) => {
              headRefs.current[i] = el;
            }}
            d="M -9 0 L 9 0 M 4.5 -3.5 L 9.5 0 L 4.5 3.5"
            fill="none"
            stroke="rgba(181, 184, 170, 0.35)"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ))}

      {/* Dynamic Focal Attractor Singularity */}
      <g ref={markerRingRef} transform={`translate(${anchor.x} ${anchor.y})`}>
        {!reduced && isActive && (
          <circle
            cx={0}
            cy={0}
            r={23}
            fill="none"
            stroke="rgba(199, 227, 74, 0.48)"
            strokeWidth="1"
            className="viz-pulse-ring"
          />
        )}
        <circle
          cx={0}
          cy={0}
          r={13}
          fill="rgba(21, 23, 19, 0.85)"
          stroke="#C7E34A"
          strokeWidth="1.5"
        />
        <circle cx={0} cy={0} r={3.5} fill="#C7E34A" />
      </g>
    </g>
  );
});

/* ============================================================================
   MAIN EXPORTED INSTRUMENT COMPONENT
   ============================================================================ */

export const EngineeringVisualization: React.FC = () => {
  const [mode, setMode] = useState<EngineeringVizMode>("recurrent");
  const [selectedRecurrentIdx, setSelectedRecurrentIdx] = useState<number>(2);
  const [selectedTopologyId, setSelectedTopologyId] = useState<string>("router");
  const [vectorAnchor, setVectorAnchor] = useState<{ x: number; y: number }>({
    x: 250,
    y: 236,
  });
  const [isInView, setIsInView] = useState<boolean>(true);
  const [isTabVisible, setIsTabVisible] = useState<boolean>(() =>
    typeof document === "undefined" ? true : !document.hidden
  );

  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const isFinePointer = useFinePointer();

  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const onVis = () => setIsTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const isAnimationActive = isInView && isTabVisible && !reduced;
  const activeMeta = MODE_OPTIONS.find((m) => m.id === mode) ?? MODE_OPTIONS[0];

  const readout = useMemo(() => {
    if (mode === "recurrent") {
      const node = RECURRENT_NODES[selectedRecurrentIdx] ?? RECURRENT_NODES[0];
      return {
        indexLabel: `${node.code} · ${node.label.toUpperCase()}`,
        text: node.description,
      };
    }
    if (mode === "topology") {
      const node =
        TOPOLOGY_NODES.find((n) => n.id === selectedTopologyId) ?? TOPOLOGY_NODES[0];
      const degree = TOPOLOGY_EDGES.filter(
        (e) => e.from === node.id || e.to === node.id
      ).length;
      return {
        indexLabel: `T${node.tier} · ${node.label.toUpperCase()} · ${degree} LINKS`,
        text: node.description,
      };
    }
    const nx = (((vectorAnchor.x - 250) / 180) || 0).toFixed(2);
    const ny = (((236 - vectorAnchor.y) / 180) || 0).toFixed(2);
    return {
      indexLabel: `ATTRACTOR (${nx}, ${ny})`,
      text: isFinePointer
        ? "Move pointer to perturb directional flow vectors; click to lock focal singularity."
        : "Tap anywhere in the grid to reposition the directional flow attractor.",
    };
  }, [mode, selectedRecurrentIdx, selectedTopologyId, vectorAnchor, isFinePointer]);

  const footerRight = reduced
    ? "STATIC MODE"
    : isFinePointer
      ? mode === "vector"
        ? "POINTER / CLICK"
        : "HOVER / SELECT"
      : "TAP MODULE";

  return (
    <div
      ref={stageRef}
      className={`w-full max-w-[540px] mx-auto lg:max-w-none flex flex-col gap-3 min-w-0 ${
        !isAnimationActive ? "viz-paused" : ""
      }`}
    >
      {/* Mode Selector Tabs */}
      <div
        role="tablist"
        aria-label="Engineering visualization models"
        className="grid grid-cols-3 gap-1 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] p-1"
      >
        {MODE_OPTIONS.map((option) => {
          const isSelected = option.id === mode;
          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setMode(option.id)}
              className={`relative min-h-[44px] px-1.5 sm:px-3 py-2 rounded-[6px] font-mono text-[9.5px] min-[390px]:text-[10.5px] sm:text-[11px] tracking-[0.04em] sm:tracking-[0.1em] uppercase whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C7E34A] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--surface)] ${
                isSelected
                  ? "text-[#151713] font-bold"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              {isSelected && (
                <motion.span
                  layoutId={reduced ? undefined : "engineeringVizActiveTab"}
                  transition={{ duration: MOTION_DURATION.ui, ease: MOTION_EASE.out }}
                  aria-hidden="true"
                  className="absolute inset-0 rounded-[6px] bg-[#C7E34A]"
                />
              )}
              <span className="relative z-10">{option.label}</span>
            </button>
          );
        })}
      </div>

      {/* Instrument Stage Frame */}
      <div className="relative flex flex-col rounded-[8px] border border-[var(--border)] bg-[#151713] overflow-hidden">
        {/* Technical Grid & Corner Registration Brackets */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.22]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(220,225,190,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(220,225,190,0.08) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-3 left-3 w-3 h-3 border-t border-l border-[#C7E34A]/65"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-3 right-3 w-3 h-3 border-t border-r border-[#C7E34A]/65"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[68px] left-3 w-3 h-3 border-b border-l border-[#C7E34A]/45"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[68px] right-3 w-3 h-3 border-b border-r border-[#C7E34A]/45"
        />

        {/* SVG Visualization Canvas */}
        <div className="relative w-full aspect-[1/0.94] min-h-[280px] sm:min-h-[340px] flex items-center justify-center p-2 sm:p-4">
          <AnimatePresence mode="wait">
            <motion.svg
              key={mode}
              viewBox="0 0 500 470"
              role="img"
              aria-label={activeMeta.ariaLabel}
              initial={reduced ? false : { opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, scale: 0.985 }}
              transition={{ duration: MOTION_DURATION.ui, ease: MOTION_EASE.out }}
              className="w-full h-full max-h-[460px] select-none"
            >
              {mode === "recurrent" && (
                <RecurrentRingDiagram
                  selectedIdx={selectedRecurrentIdx}
                  onSelect={setSelectedRecurrentIdx}
                  reduced={reduced}
                  isActive={isAnimationActive}
                />
              )}
              {mode === "topology" && (
                <TopologyGraphDiagram
                  selectedId={selectedTopologyId}
                  onSelect={setSelectedTopologyId}
                  reduced={reduced}
                  isActive={isAnimationActive}
                />
              )}
              {mode === "vector" && (
                <VectorFieldDiagram
                  anchor={vectorAnchor}
                  onSetAnchor={setVectorAnchor}
                  reduced={reduced}
                  isFinePointer={isFinePointer}
                  isActive={isAnimationActive}
                />
              )}
            </motion.svg>
          </AnimatePresence>
        </div>

        {/* Active Node / Field Inspector Readout */}
        <div className="relative z-10 border-t border-[#41443A]/80 bg-[#151713]/95 px-4 py-3 min-h-[64px] flex flex-col justify-center gap-1">
          <div className="flex items-center justify-between gap-2 text-[10px] font-mono tracking-[0.12em] uppercase">
            <span className="text-[#C7E34A] font-semibold truncate">
              {readout.indexLabel}
            </span>
            <span className="text-[#8C8F82] shrink-0">
              0{MODE_OPTIONS.findIndex((m) => m.id === mode) + 1} / 03
            </span>
          </div>
          <p className="text-xs leading-snug text-[#D4D6CA] line-clamp-2 m-0">
            {readout.text}
          </p>
        </div>
      </div>

      {/* Bottom Technical Status Strip */}
      <div className="flex items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-muted)] pt-1 border-t border-[var(--border)]">
        <span className="truncate">{activeMeta.footerLeft}</span>
        <span className="text-[var(--accent)] font-semibold shrink-0">{footerRight}</span>
      </div>
    </div>
  );
};

export default EngineeringVisualization;
