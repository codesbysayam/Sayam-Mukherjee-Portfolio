import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  GitBranch,
  Layers,
  Shield,
  Database,
} from "lucide-react";
import { EditorialSectionHeader } from "../common/EditorialSectionHeader";
import { ContourBackground } from "../motion/ContourBackground";
import { EditorialReveal, StaggerGroup, StaggerItem } from "../../motion/Reveal";
import { MOTION_DURATION, MOTION_EASE, usePrefersReducedMotion } from "../../motion/tokens";

type PatternId =
  | "api-boundaries"
  | "hitl-governance"
  | "edge-cv-sync"
  | "telemetry-normalization"
  | "bounded-state";

interface ArchitecturePattern {
  id: PatternId;
  index: string;
  label: string;
  title: string;
  subtitle: string;
  overview: string;
  stages: Array<{
    code: string;
    name: string;
    role: string;
  }>;
  invariants: string[];
  failureMode: string;
  exampleNote: string;
}

const ARCHITECTURE_PATTERNS: Record<PatternId, ArchitecturePattern> = {
  "api-boundaries": {
    id: "api-boundaries",
    index: "01",
    label: "API Boundaries",
    title: "Typed Client / Server Contracts & Validation",
    subtitle: "Separating untrusted input from domain logic through explicit schemas",
    overview:
      "Every network boundary starts with runtime validation before touching persistence or downstream APIs. Client state only consumes normalized envelopes, so UI components never break when upstream feeds degrade.",
    stages: [
      {
        code: "01 · INPUT",
        name: "Request & UI Event",
        role: "Unverified form payload or query parameters",
      },
      {
        code: "02 · GUARD",
        name: "Schema & Rate Check",
        role: "Zod validation, sanitization & request throttling",
      },
      {
        code: "03 · CORE",
        name: "Domain Handler",
        role: "Pure business rules isolated from transport details",
      },
      {
        code: "04 · ENVELOPE",
        name: "Normalized Response",
        role: "Predictable typed JSON with explicit error codes",
      },
    ],
    invariants: [
      "Client and server validate against shared TypeScript data shapes.",
      "External upstream timeouts degrade into typed fallback states rather than uncaught UI crashes.",
      "Mutating routes keep side effects idempotent and explicitly logged.",
    ],
    failureMode:
      "If an upstream service stalls or returns malformed data, the adapter layer intercepts it at step 03 and surfaces a clear recovery path.",
    exampleNote: "Applied across full-stack React + Express services and organizer workflows.",
  },
  "hitl-governance": {
    id: "hitl-governance",
    index: "02",
    label: "HITL Governance",
    title: "Human-in-the-Loop Approval State Machines",
    subtitle: "Decoupling automated intent generation from irreversible execution",
    overview:
      "Autonomous agents are effective at triaging context and drafting structured actions, but high-impact mutations require deterministic policy checks, dry-run previews, and human sign-off before execution.",
    stages: [
      {
        code: "01 · INTENT",
        name: "Agent Proposal",
        role: "Worker drafts a typed action payload without mutating state",
      },
      {
        code: "02 · POLICY",
        name: "Sandbox & Rules",
        role: "Evaluates allow/deny rules and previews blast radius",
      },
      {
        code: "03 · GATE",
        name: "Awaiting Human",
        role: "Execution halts cleanly until authorized operator approval",
      },
      {
        code: "04 · LEDGER",
        name: "Auditable Commit",
        role: "Applies change and appends immutable transition trace",
      },
    ],
    invariants: [
      "Intent generation never holds direct write credentials to production sinks.",
      "Every state transition (`PROPOSED -> AWAITING_HUMAN -> APPROVED`) is reversible until commit.",
      "Rejected proposals remain recorded for debugging and policy tuning.",
    ],
    failureMode:
      "If an operator times out or a policy invariant trips, execution remains safely parked in `AWAITING_HUMAN` with zero partial writes.",
    exampleNote: "Explored in multi-agent operations and autonomous policy control-plane builds.",
  },
  "edge-cv-sync": {
    id: "edge-cv-sync",
    index: "03",
    label: "Edge Vision Sync",
    title: "Real-Time Inference & Canvas Synchronization",
    subtitle: "Keeping asynchronous vision models aligned with smooth browser rendering",
    overview:
      "Vision models run at variable frame timings depending on scene density. To prevent stale bounding boxes or skeletal jitter on the client canvas, inference outputs must swap atomically per timestamped frame.",
    stages: [
      {
        code: "01 · STREAM",
        name: "Frame Ingestion",
        role: "Captures source frames with monotonic frame IDs",
      },
      {
        code: "02 · DETECT",
        name: "Detection & Pose",
        role: "Extracts bounding boxes, keypoints & confidence scores",
      },
      {
        code: "03 · TRACK",
        name: "Identity Association",
        role: "Assigns persistent cross-frame track IDs via ByteTrack",
      },
      {
        code: "04 · RENDER",
        name: "Atomic Canvas Swap",
        role: "Replaces complete frame state cleanly on 16:9 canvas",
      },
    ],
    invariants: [
      "Non-Max Suppression thresholds filter duplicate overlapping detections before tracking.",
      "Frame overlays update atomically so old boxes never bleed onto new video frames.",
      "Telemetry persistence stays asynchronous off the critical rendering loop.",
    ],
    failureMode:
      "When backend inference lags behind video playback, frame buffers drop intermediate stale packets instead of queuing unbounded latency.",
    exampleNote: "Applied in dual-service Next.js + FastAPI computer vision workflows.",
  },
  "telemetry-normalization": {
    id: "telemetry-normalization",
    index: "04",
    label: "Data Normalization",
    title: "Multi-Source Aggregation & Resilient Caching",
    subtitle: "Unifying heterogeneous feeds into coherent decision interfaces",
    overview:
      "Real-world domains such as weather, air quality, and coastal advisories originate from incompatible agencies, units, and polling intervals. A normalization layer shields UI components from upstream fragmentation.",
    stages: [
      {
        code: "01 · FEEDS",
        name: "Heterogeneous Sources",
        role: "Radar, air-quality, coastal & advisory streams",
      },
      {
        code: "02 · ADAPTER",
        name: "Unit Normalization",
        role: "Maps inconsistent agency fields into canonical schemas",
      },
      {
        code: "03 · EVALUATE",
        name: "Threshold Rules",
        role: "Computes localized hazard & severity signals",
      },
      {
        code: "04 · CACHE",
        name: "Resilient View Cache",
        role: "Serves fast hydrated slices on flaky connections",
      },
    ],
    invariants: [
      "Upstream unit discrepancies (timestamps, scales, coordinates) are resolved in one shared adapter.",
      "Regional views degrade gracefully to last verified snapshots if a single feed goes offline.",
      "UI surfaces plain-language guidance rather than raw sensor codes alone.",
    ],
    failureMode:
      "Single-provider outages isolate cleanly at the adapter boundary while remaining telemetry domains stay responsive.",
    exampleNote: "Used to coordinate multi-domain civic weather telemetry during sprint builds.",
  },
  "bounded-state": {
    id: "bounded-state",
    index: "05",
    label: "Bounded State",
    title: "Fixed-Capacity State & Deterministic Simulation",
    subtitle: "Comparing O(1) recurrent compression against O(T) linear context growth",
    overview:
      "Interactive scientific models work best when mathematical definitions, parameter controls, and visual plots share one deterministic state loop—making algorithmic trade-offs tangible without server round-trips.",
    stages: [
      {
        code: "01 · INPUT",
        name: "Parameter Controls",
        role: "Sequence length, decay rate & slot capacity sliders",
      },
      {
        code: "02 · KERNEL",
        name: "Recurrent Update",
        role: "Updates fixed-capacity associative memory matrices",
      },
      {
        code: "03 · DERIVE",
        name: "Math Sync",
        role: "Pairs numeric traces with rendered formal equations",
      },
      {
        code: "04 · PLOT",
        name: "Interactive Canvas",
        role: "Visualizes memory cost vs fidelity trade-offs",
      },
    ],
    invariants: [
      "Pure deterministic state computation guarantees identical traces across reloads.",
      "Mathematical notation stays synced directly to active simulation parameters.",
      "Zero external GPU dependency keeps technical explanations immediately accessible in the browser.",
    ],
    failureMode:
      "Extreme parameter ranges clamp cleanly at numerical bounds so simulations never produce NaN graphs.",
    exampleNote: "Developed for interactive mechanistic interpretability exploration.",
  },
};

const PATTERN_LIST = Object.values(ARCHITECTURE_PATTERNS);

const DELIVERY_STAGES = [
  {
    step: "01",
    title: "Constraints & Scope",
    desc: "Define boundaries, latency budgets, and failure modes before selecting abstractions.",
  },
  {
    step: "02",
    title: "Typed Contracts",
    desc: "Establish clear data schemas between frontend views, backend handlers, and storage.",
  },
  {
    step: "03",
    title: "Isolated Modules",
    desc: "Keep UI rendering, business rules, and external adapters decoupled so changes stay local.",
  },
  {
    step: "04",
    title: "Verification & Tests",
    desc: "Exercise edge cases with unit tests, API assertions, and graceful fallback checks.",
  },
  {
    step: "05",
    title: "Deployment & Observation",
    desc: "Ship incrementally with repeatable builds and clear diagnostic feedback.",
  },
];

const CROSS_CUTTING_BOUNDARIES = [
  {
    icon: Shield,
    title: "Validation & Reliability",
    body: "Untrusted payloads are validated at system boundaries before state changes occur. Network requests carry timeouts and structured error paths so interfaces stay honest during partial outages.",
  },
  {
    icon: Database,
    title: "State & Data Flow",
    body: "Shared state belongs in single canonical stores rather than duplicated views. Separating fetched telemetry from derived presentation prevents contradictory numbers across screens.",
  },
  {
    icon: GitBranch,
    title: "Modularity & Team Collaboration",
    body: "Clear interface contracts let contributors build data utilities, backend APIs, and frontend views in parallel without stepping on each other's implementation details.",
  },
  {
    icon: Layers,
    title: "Deployment & Iteration",
    body: "Automated linting, type checking, and reproducible build scripts ensure rapid iteration during sprints never breaks core navigation or data integrity.",
  },
];

export function EcosystemPage() {
  const [activePatternId, setActivePatternId] = useState<PatternId>("api-boundaries");
  const reduced = usePrefersReducedMotion();
  const pattern = ARCHITECTURE_PATTERNS[activePatternId];

  const handleOpenProjects = () => {
    window.dispatchEvent(new CustomEvent("portfolio-navigate-tab", { detail: "projects" }));
  };

  return (
    <div className="w-full space-y-14 pb-16">
      {/* 1. EDITORIAL HEADER */}
      <header
        id="ecosystem-hero"
        className="relative py-4 sm:py-6 border-b border-[var(--border)] space-y-5"
      >
        <ContourBackground density="subtle" />

        <div className="relative z-10">
          <EditorialSectionHeader
            level="h1"
            eyebrow="04 · System Thinking & Architecture"
            title="How software systems"
            italicHighlight="interact and hold up."
            description="Engineering principles behind how I structure data flow, API contracts, state management, human-in-the-loop checkpoints, and reliable team delivery—independent of individual project listings."
          />
        </div>
      </header>

      {/* 2. ENGINEERING LIFECYCLE */}
      <section id="ecosystem-pipeline" className="space-y-6">
        <EditorialReveal className="space-y-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
            01 · Engineering Workflow
          </span>
          <h2 className="text-2xl font-bold font-display text-[var(--text)]">
            From requirements to resilient software
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            A repeatable progression for turning ambiguous problem statements into clear, testable architecture.
          </p>
        </EditorialReveal>

        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {DELIVERY_STAGES.map((stage) => (
            <StaggerItem
              key={stage.step}
              className="card p-4 sm:p-5 flex flex-col justify-between space-y-2.5"
            >
              <div className="space-y-1.5">
                <span className="font-mono text-xs font-bold text-[var(--accent)] tabular-nums">
                  STEP {stage.step}
                </span>
                <h3 className="text-sm font-bold font-display text-[var(--text)]">
                  {stage.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {stage.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* 3. INTERACTIVE SYSTEM ARCHITECTURE PATTERNS */}
      <section id="ecosystem-patterns" className="space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
            02 · Architecture Patterns
          </span>
          <h2 className="text-2xl font-bold font-display text-[var(--text)]">
            Data Flow, Boundaries &amp; Control Planes
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            Select an architectural pattern to inspect its four-stage pipeline, system invariants, and failure handling.
          </p>
        </div>

        {/* Pattern Tabs */}
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="System architecture patterns"
        >
          {PATTERN_LIST.map((item) => {
            const isSelected = item.id === activePatternId;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActivePatternId(item.id)}
                className={`btn !min-h-[40px] !py-1.5 !px-3.5 !text-xs font-mono ${
                  isSelected ? "btn-primary" : "btn-secondary"
                }`}
              >
                <span>{item.index} · {item.label}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={pattern.id}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: MOTION_DURATION.normal, ease: MOTION_EASE.out }}
            className="card p-5 sm:p-8 space-y-7"
          >
            <div className="space-y-2 pb-5 border-b border-[var(--border)]">
              <span className="font-mono text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
                Pattern {pattern.index} · {pattern.subtitle}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-[var(--text)]">
                {pattern.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] max-w-3xl leading-relaxed">
                {pattern.overview}
              </p>
            </div>

            {/* Clean Conceptual SVG Flow Diagram */}
            <div className="p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] overflow-x-auto">
              <svg
                role="img"
                aria-label={`${pattern.title} data flow diagram`}
                viewBox="0 0 920 156"
                className="w-full min-w-[600px] h-auto"
              >
                <defs>
                  <marker
                    id={`eco-arrow-${pattern.id}`}
                    markerWidth="8"
                    markerHeight="8"
                    refX="7"
                    refY="4"
                    orient="auto"
                  >
                    <path d="M 0 1 L 7 4 L 0 7 z" fill="var(--accent)" />
                  </marker>
                </defs>

                {pattern.stages.map((stage, idx) => {
                  const x = 12 + idx * 230;
                  const isGate = idx === 2;
                  return (
                    <motion.g
                      key={stage.code}
                      initial={reduced ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: reduced ? 0 : MOTION_DURATION.normal,
                        delay: reduced ? 0 : idx * 0.06,
                        ease: MOTION_EASE.out,
                      }}
                    >
                      <rect
                        x={x}
                        y={16}
                        width={200}
                        height={124}
                        rx={8}
                        fill="var(--surface-2)"
                        stroke={isGate ? "var(--accent)" : "var(--border-strong)"}
                        strokeWidth={isGate ? 1.5 : 1.2}
                      />
                      <text
                        x={x + 14}
                        y={40}
                        fill="var(--accent)"
                        fontSize="10"
                        fontWeight="700"
                        fontFamily="monospace"
                      >
                        {stage.code}
                      </text>
                      <text
                        x={x + 14}
                        y={64}
                        fill="var(--text)"
                        fontSize="13"
                        fontWeight="700"
                        fontFamily="sans-serif"
                      >
                        {stage.name}
                      </text>
                      <foreignObject x={x + 14} y={74} width={172} height={56}>
                        <div
                          style={{
                            color: "var(--text-secondary)",
                            fontSize: "11px",
                            lineHeight: "1.45",
                            fontFamily: "sans-serif",
                          }}
                        >
                          {stage.role}
                        </div>
                      </foreignObject>

                      {idx < pattern.stages.length - 1 && (
                        <motion.line
                          x1={x + 200}
                          y1={78}
                          x2={x + 228}
                          y2={78}
                          stroke="var(--accent)"
                          strokeWidth="1.6"
                          markerEnd={`url(#eco-arrow-${pattern.id})`}
                          initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{
                            duration: reduced ? 0 : MOTION_DURATION.normal,
                            delay: reduced ? 0 : idx * 0.08 + 0.08,
                            ease: MOTION_EASE.out,
                          }}
                        />
                      )}
                    </motion.g>
                  );
                })}
              </svg>
            </div>

            {/* System Invariants & Failure Handling */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-2.5">
                <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Core Invariants
                </h4>
                <ul className="space-y-2">
                  {pattern.invariants.map((inv, idx) => (
                    <li
                      key={idx}
                      className="text-xs sm:text-sm text-[var(--text-secondary)] flex items-start gap-2.5 leading-relaxed"
                    >
                      <span className="text-[var(--accent)] font-mono font-bold mt-0.5">·</span>
                      <span>{inv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-5 p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] space-y-2">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)] block">
                  Failure &amp; Recovery Behavior
                </span>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {pattern.failureMode}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <span className="text-[var(--text-muted)]">{pattern.exampleNote}</span>
              <button
                type="button"
                onClick={handleOpenProjects}
                className="inline-flex items-center gap-1.5 text-[var(--accent)] font-semibold hover:underline cursor-pointer"
              >
                <span>Inspect Case Studies in Projects</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* 4. CROSS-CUTTING ARCHITECTURAL BOUNDARIES */}
      <section id="ecosystem-boundaries" className="space-y-6">
        <EditorialReveal className="space-y-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
            03 · Reliability &amp; Boundaries
          </span>
          <h2 className="text-2xl font-bold font-display text-[var(--text)]">
            Cross-Cutting Engineering Practices
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            Foundational habits that keep multi-component systems understandable as they scale.
          </p>
        </EditorialReveal>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {CROSS_CUTTING_BOUNDARIES.map((item) => {
            const Icon = item.icon;
            return (
              <StaggerItem key={item.title} className="card p-6 space-y-2.5">
                <div className="flex items-center gap-2.5 text-[var(--accent)]">
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <h3 className="text-base font-bold font-display text-[var(--text)]">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {item.body}
                </p>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </section>

    </div>
  );
}

export default EcosystemPage;
