import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Network, Cpu, Layers, GitBranch, ArrowRight, ShieldCheck, 
  Workflow, Database, Radio, CheckCircle2, CloudRain, Truck, 
  Binary, Terminal, Users, Sparkles, ExternalLink
} from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";

type BlueprintId = "operon" | "mausam" | "memory" | "routeledger";

interface SystemBlueprint {
  id: BlueprintId;
  title: string;
  subtitle: string;
  category: string;
  status: string;
  purpose: string;
  nodes: {
    name: string;
    description: string;
    type: "input" | "process" | "decision" | "storage" | "output";
  }[];
  connections: string[];
  invariants: string[];
  repoUrl: string;
  liveUrl?: string;
  stats: { label: string; value: string }[];
}

const BLUEPRINTS: Record<BlueprintId, SystemBlueprint> = {
  operon: {
    id: "operon",
    title: "Operon Multi-Agent Governance Engine",
    subtitle: "Autonomous operations with non-bypassable human checkpoints",
    category: "Autonomous Systems & AI",
    status: "Active Architecture",
    purpose: "Coordinates multiple specialized AI agents across organization workflows while guaranteeing that sensitive actions (payouts, data mutations, terminations) halt at strict human-in-the-loop checkpoints.",
    nodes: [
      { name: "ERP Event / User Trigger", description: "Inbound ticket or system webhook", type: "input" },
      { name: "Agent Task Router", description: "Deconstructs goal and evaluates capabilities", type: "process" },
      { name: "Specialized Agents", description: "Support, Finance, HR isolated workers", type: "process" },
      { name: "Human Approval Checkpoint", description: "Cryptographically verified sign-off gate", type: "decision" },
      { name: "State Machine Ledger", description: "Immutable audit trail of agent executions", type: "storage" },
      { name: "External System Dispatch", description: "API execution on target platforms", type: "output" }
    ],
    connections: [
      "Inbound Event -> Router decomposes task into DAG dependencies",
      "Router -> Dispatches sub-tasks to isolated domain worker agents",
      "Worker Agents -> Synthesize proposed actions and calculate risk score",
      "Risk Score > Threshold -> Halts execution at Human Approval Gate",
      "Approval -> Commits transition to State Machine Ledger & Dispatches"
    ],
    invariants: [
      "Zero autonomous mutations without audit entry in immutable state log",
      "Human authorization required for all irreversible financial or operational actions",
      "Isolated agent contexts prevent cross-tenant memory contamination"
    ],
    repoUrl: "https://github.com/codesbysayam/Operon",
    liveUrl: "https://operonpro.vercel.app",
    stats: [
      { label: "Architecture", value: "Multi-Agent DAG" },
      { label: "Core Runtime", value: "Node.js / TypeScript" },
      { label: "Governance", value: "Human-in-the-Loop" }
    ]
  },
  mausam: {
    id: "mausam",
    title: "Mausam Meteorological Telemetry Pipeline",
    subtitle: "High-density climate aggregation engineered for SIH 2026",
    category: "Geospatial Systems & APIs",
    status: "SIH 2026 Submission",
    purpose: "Normalizes fragmented weather data, ocean tide forecasts, air quality vectors, and soil moisture indices into a single high-signal meteorological dashboard for farmers and coastal workers.",
    nodes: [
      { name: "Multi-Source Sensor Ingestion", description: "Open-Meteo, IMD, and coastal tide feeds", type: "input" },
      { name: "Backoff & Normalizer Worker", description: "Handles API limits and standardizes units", type: "process" },
      { name: "Localized Threshold Engine", description: "Calculates severe weather & AQI alert bands", type: "process" },
      { name: "Client In-Memory Cache", description: "Sub-100ms instant geospatial recall", type: "storage" },
      { name: "Geospatial Canvas & UI", description: "Reactive climate charts & interactive map", type: "output" }
    ],
    connections: [
      "Sensor Ingestion -> Polls meteorological feeds with exponential backoff",
      "Normalizer -> Harmonizes differing unit scales into a canonical schema",
      "Threshold Engine -> Computes localized risk indices for AQI, UV, and tides",
      "Cache -> Stores current observation matrices locally to prevent rate limits",
      "Geospatial UI -> Renders zero-CLS weather widgets and hazard warnings"
    ],
    invariants: [
      "Sub-100ms instant UI responses via optimistic client cache hydration",
      "Deterministic hazard scoring matching Indian Meteorological Department thresholds",
      "Offline-first cached viewing capability for low-bandwidth coastal zones"
    ],
    repoUrl: "https://github.com/codesbysayam/mausam",
    liveUrl: "https://mausamgovt.vercel.app",
    stats: [
      { label: "Data Providers", value: "IMD & Open-Meteo" },
      { label: "Latency Target", value: "< 100ms Cache" },
      { label: "Target Audience", value: "Coastal / Farmers" }
    ]
  },
  memory: {
    id: "memory",
    title: "Memory-in-Motion Recurrent Dynamics",
    subtitle: "Visualizing continuous hidden-state trajectories in recurrent neural networks",
    category: "Neural Mechanics & Simulation",
    status: "Research Prototype",
    purpose: "Simulates how recurrent neural networks compress sequential inputs into continuous latent trajectories, demonstrating mathematical phenomena like memory decay, interference, and phase portraits.",
    nodes: [
      { name: "Sequential Token Ingestion", description: "Discrete character or numerical vectors", type: "input" },
      { name: "Recurrent Transition Matrix", description: "h_t = tanh(W*x_t + U*h_{t-1})", type: "process" },
      { name: "Eigenvalue & Stability Analyzer", description: "Monitors vanishing vs exploding gradients", type: "process" },
      { name: "Latent Trajectory Store", description: "Rolling N-step high-dimensional history", type: "storage" },
      { name: "Phase Portrait Canvas", description: "Interactive 2D projection with vector fields", type: "output" }
    ],
    connections: [
      "Token Ingestion -> Feeds discrete temporal inputs into recurrent cell",
      "Transition Matrix -> Computes affine transformation and non-linear compression",
      "Stability Analyzer -> Computes spectral radius to identify chaotic divergence",
      "Trajectory Store -> Maintains continuous state coordinates across time",
      "Phase Portrait -> Projects multi-dimensional manifolds onto interactive canvas"
    ],
    invariants: [
      "Strict mathematical fidelity to standard Elman and gated recurrent formulations",
      "Real-time 60fps vector field rendering in isolated browser canvas workers",
      "Interactive parameter manipulation without page reload or backend latency"
    ],
    repoUrl: "https://github.com/codesbysayam/Memory-in-Motion",
    liveUrl: "https://memory-in-motion.vercel.app",
    stats: [
      { label: "Math Formulation", value: "Recurrent State Space" },
      { label: "Rendering", value: "60 FPS Web Canvas" },
      { label: "Domain", value: "Deep Learning Mechanics" }
    ]
  },
  routeledger: {
    id: "routeledger",
    title: "RouteLedger Commercial Dispatch & HOS Engine",
    subtitle: "Turn-by-turn commercial fleet routing with federal compliance enforcement",
    category: "Logistics & Constraint Solvers",
    status: "Production Architecture",
    purpose: "Solves multi-waypoint commercial trucking routes while deterministically embedding federal Hours-of-Service (FMCSR 49 CFR § 395) rest periods into the transit timeline.",
    nodes: [
      { name: "Waypoint & Cargo Payload", description: "Origin, destination, and pickup windows", type: "input" },
      { name: "Graph Routing Engine", description: "Calculates road network topology & transit times", type: "process" },
      { name: "HOS Regulatory Solver", description: "Mandates 30-min break at 8hr, 10-hr reset at 11hr", type: "decision" },
      { name: "Corridor Amenity Matcher", description: "Finds compliant truck stops along route", type: "process" },
      { name: "Audit-Ready Driver Ledger", description: "Tamper-resistant digital logbook timeline", type: "output" }
    ],
    connections: [
      "Payload -> Parses spatial coordinates and delivery appointment windows",
      "Graph Engine -> Computes optimal highway corridors minimizing mileage",
      "HOS Solver -> Evaluates driving clock and identifies mandatory rest windows",
      "Corridor Matcher -> Injects verified truck parking facilities into route stops",
      "Driver Ledger -> Outputs compliant dispatch itinerary with zero violations"
    ],
    invariants: [
      "100% mathematical adherence to FMCSR property-carrying driving regulations",
      "No rest stop scheduled outside verified commercial parking buffer radius",
      "Deterministic route recalculation upon user waypoint addition"
    ],
    repoUrl: "https://github.com/codesbysayam/RouteLedger",
    liveUrl: "https://routeledger.vercel.app",
    stats: [
      { label: "Compliance Standard", value: "FMCSR 49 CFR § 395" },
      { label: "Algorithm", value: "Graph Routing + Rest Insertion" },
      { label: "Target Sector", value: "Commercial Logistics" }
    ]
  }
};

export function EcosystemPage() {
  const { theme } = usePortfolio();
  const isLight = theme === "light";
  const [activeBlueprint, setActiveBlueprint] = useState<BlueprintId>("operon");

  const blueprint = BLUEPRINTS[activeBlueprint];

  return (
    <div className="w-full space-y-12 sm:space-y-16 pb-12">
      {/* 1. EDITORIAL SYSTEM ARCHITECTURE HEADER */}
      <header className="space-y-4 pt-2">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono font-medium uppercase tracking-[0.16em] text-cyan-600 dark:text-cyan-400">
            SYSTEM ARCHITECTURE · PROCESS &amp; RELATIONSHIPS
          </span>
          <span className="h-px w-8 bg-zinc-300 dark:bg-zinc-800" />
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider hidden sm:inline">
            How I Connect Ideas Into Software
          </span>
        </div>

        <div className="space-y-2 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white font-display leading-[1.1]">
            ENGINEERING ECOSYSTEM <br />
            <span className="text-zinc-500 dark:text-zinc-400">&amp; SYSTEM BLUEPRINTS</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans pt-1">
            Software is rarely an isolated card—it is an interconnected ecosystem of state machines, telemetry pipelines, mathematical invariants, and human-in-the-loop governance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono text-zinc-500 pt-1">
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">4 Verified Architectures</span>
          <span>·</span>
          <span>End-to-End Delivery Lifecycle</span>
          <span>·</span>
          <span className="text-cyan-600 dark:text-cyan-400">SIH 2026 Collaboration Case Study</span>
        </div>
      </header>

      {/* 2. THE 5-STAGE ENGINEERING DELIVERY LIFECYCLE */}
      <section className="space-y-6">
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
            PHASE 01 — DELIVERY LIFECYCLE
          </span>
          <h2 className="text-2xl font-bold font-display text-zinc-900 dark:text-white">
            The Engineering Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl font-sans">
            How I progress an abstract requirement into a verified, resilient production system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            {
              step: "01",
              name: "Constraint Modeling",
              focus: "Scope & Mathematical Invariants",
              desc: "Deconstruct the core problem into boundary conditions, rate limits, and failure modes before writing any code."
            },
            {
              step: "02",
              name: "Schema & Architecture",
              focus: "Type Contracts & DAGs",
              desc: "Define strict TypeScript interfaces, REST contracts, state machine transitions, and database schemas."
            },
            {
              step: "03",
              name: "Edge Prototyping",
              focus: "Micro-benchmarks & Isolation",
              desc: "Validate algorithmic bottlenecks, API response latencies, and critical paths in isolated test harnesses."
            },
            {
              step: "04",
              name: "Production Hardening",
              focus: "Resilience & Zero CLS",
              desc: "Wrap network calls with exponential backoffs, enforce sub-100ms cached views, and guarantee fluid responsive layout."
            },
            {
              step: "05",
              name: "Telemetry & Audit",
              focus: "Continuous Observability",
              desc: "Expose real-time health checkpoints, live GitHub commit logs, and auditable execution journals."
            }
          ].map((phase, idx) => (
            <div
              key={phase.step}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                isLight 
                  ? "bg-white border-slate-200/90 shadow-sm hover:border-slate-300" 
                  : "bg-zinc-950/40 border-zinc-850 hover:border-zinc-800"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                    STEP {phase.step}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {idx < 4 ? "→" : "✔"}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-display">
                  {phase.name}
                </h3>
                <span className="text-[11px] font-mono text-zinc-500 block">
                  {phase.focus}
                </span>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans pt-1">
                  {phase.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. INTERACTIVE SYSTEM BLUEPRINTS (THE 4 CORE SYSTEMS) */}
      <section className="space-y-6">
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
            PHASE 02 — ARCHITECTURAL BLUEPRINTS
          </span>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h2 className="text-2xl font-bold font-display text-zinc-900 dark:text-white">
              Core System Blueprints
            </h2>
            <span className="text-xs font-mono text-zinc-500">
              Interactive architectural exploration
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl font-sans">
            Deep-dive into the architectural mechanics, node flows, and mathematical invariants of my four flagship platforms.
          </p>
        </div>

        {/* Blueprint Selector Tabs */}
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            { id: "operon", label: "Operon: Multi-Agent AI", icon: Cpu },
            { id: "mausam", label: "Mausam: Weather Telemetry", icon: CloudRain },
            { id: "memory", label: "Memory-in-Motion: RNN Lab", icon: Binary },
            { id: "routeledger", label: "RouteLedger: HOS Router", icon: Truck }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeBlueprint === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveBlueprint(tab.id as BlueprintId)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-cyan-500 text-white font-semibold shadow-sm"
                    : isLight
                    ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                    : "bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Blueprint Detail Card */}
        <div className={`p-6 sm:p-8 rounded-2xl border transition-all space-y-8 ${
          isLight ? "bg-white border-slate-200 shadow-sm" : "bg-zinc-950/40 border-zinc-850"
        }`}>
          {/* Header & Meta */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-850">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold border border-cyan-500/20">
                  {blueprint.category}
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  {blueprint.status}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-white">
                {blueprint.title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                {blueprint.purpose}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href={blueprint.repoUrl}
                target="_blank"
                rel="noreferrer"
                className={`px-3 py-1.5 rounded-lg text-xs font-mono border flex items-center gap-1.5 transition-colors ${
                  isLight 
                    ? "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300" 
                    : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800"
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>Source Code</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
              {blueprint.liveUrl && (
                <a
                  href={blueprint.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg text-xs font-mono bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5 transition-colors font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Live App</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          </div>

          {/* Key Metric Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {blueprint.stats.map((st) => (
              <div
                key={st.label}
                className={`p-3 rounded-xl border ${
                  isLight ? "bg-slate-50 border-slate-200/80" : "bg-zinc-900/40 border-zinc-850"
                }`}
              >
                <span className="text-[10px] font-mono text-zinc-500 block uppercase">
                  {st.label}
                </span>
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-sans">
                  {st.value}
                </span>
              </div>
            ))}
          </div>

          {/* Architectural Nodes & Visual Flow */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold">
                System Topology &amp; Discrete Processing Stages
              </h4>
              <span className="text-[11px] font-mono text-zinc-500">
                Left-to-Right Execution Pipeline
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {blueprint.nodes.map((node, i) => {
                const typeColors = {
                  input: isLight ? "bg-sky-50 text-sky-700 border-sky-200" : "bg-sky-950/30 text-sky-400 border-sky-800/40",
                  process: isLight ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-purple-950/30 text-purple-400 border-purple-800/40",
                  decision: isLight ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-amber-950/30 text-amber-400 border-amber-800/40",
                  storage: isLight ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-emerald-950/30 text-emerald-400 border-emerald-800/40",
                  output: isLight ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-rose-950/30 text-rose-400 border-rose-800/40"
                }[node.type];

                return (
                  <div
                    key={node.name}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 ${
                      isLight ? "bg-slate-50/70 border-slate-200/90" : "bg-zinc-900/30 border-zinc-850"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-zinc-400 font-bold">
                          STAGE 0{i + 1}
                        </span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase font-semibold ${typeColors}`}>
                          {node.type}
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-sans">
                        {node.name}
                      </h5>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                      {node.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Data Flow Chains */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold">
              Data Flow Transitions &amp; State Handshakes
            </h4>
            <div className={`p-4 rounded-xl border space-y-2 text-xs font-mono ${
              isLight ? "bg-slate-50 border-slate-200 text-slate-700" : "bg-zinc-900/20 border-zinc-850 text-zinc-300"
            }`}>
              {blueprint.connections.map((conn, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span className="text-cyan-500 font-bold mt-0.5">↳</span>
                  <span className="leading-relaxed">{conn}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Architectural Invariants & Guarantees */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold">
              Architectural Invariants &amp; Safety Guarantees
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {blueprint.invariants.map((inv, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs font-sans leading-relaxed ${
                    isLight 
                      ? "bg-emerald-50/50 border-emerald-200/80 text-emerald-900" 
                      : "bg-emerald-950/20 border-emerald-800/30 text-emerald-300"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                  <span>{inv}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. RELATIONAL INTERCONNECT MATRIX */}
      <section className="space-y-6">
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
            PHASE 03 — INTERDISCIPLINARY COUPLING
          </span>
          <h2 className="text-2xl font-bold font-display text-zinc-900 dark:text-white">
            Relational Interconnect Matrix
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl font-sans">
            How disparate technical layers communicate across my software systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              domainA: "AI & Computer Vision",
              domainB: "Full-Stack Web Platforms",
              relation: "Edge Vector Streaming",
              details: "OpenCV and YOLO detection bounding boxes in Python are converted to standardized coordinate payloads and rendered via low-latency Canvas overlays in React."
            },
            {
              domainA: "Algorithmic Foundations (C++)",
              domainB: "Graph & Logistics Engines",
              relation: "Asymptotic Complexity Bounds",
              details: "Optimal space-time recurrence relations proven in LeetCode practice are translated into commercial fleet routing solvers (RouteLedger) to prevent combinatorial explosion."
            },
            {
              domainA: "Multi-Agent Systems",
              domainB: "Human-in-the-Loop Safeguards",
              relation: "Cryptographic Decision Gates",
              details: "Autonomous LLM workers plan and synthesize actions, but critical database writes are halted until authenticated human operators approve the state transition."
            },
            {
              domainA: "Geospatial Telemetry",
              domainB: "Resilient Offline Caching",
              relation: "Sub-100ms Hydration",
              details: "Multi-provider weather APIs are normalized through resilient edge workers and cached in client IndexedDB / localStorage to provide instant responsiveness in rural connectivity zones."
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border space-y-3 transition-all ${
                isLight ? "bg-white border-slate-200 shadow-sm" : "bg-zinc-950/40 border-zinc-850"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">{item.domainA}</span>
                <span className="text-zinc-400">↔</span>
                <span className="text-purple-600 dark:text-purple-400 font-bold">{item.domainB}</span>
              </div>
              <h4 className="text-base font-bold font-display text-zinc-900 dark:text-white">
                {item.relation}
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                {item.details}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TEAM COLLABORATION CASE STUDY: SIH 2026 */}
      <section className="space-y-6">
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
            PHASE 04 — RAPID COLLABORATION CASE STUDY
          </span>
          <h2 className="text-2xl font-bold font-display text-zinc-900 dark:text-white">
            Smart India Hackathon (SIH 2026) Architecture
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl font-sans">
            How Team Algnite coordinated rapid-fire full-stack system delivery under competition deadlines.
          </p>
        </div>

        <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${
          isLight ? "bg-white border-slate-200 shadow-sm" : "bg-zinc-950/40 border-zinc-850"
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-zinc-200 dark:border-zinc-850">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-zinc-900 dark:text-white">
                  Team Algnite Collaboration Mechanics
                </h3>
                <span className="text-xs font-mono text-zinc-500">
                  SIH 2026 Verified National Hackathon Entry
                </span>
              </div>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold self-start sm:self-auto">
              Verified Submission
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl border space-y-2 ${
              isLight ? "bg-slate-50 border-slate-200" : "bg-zinc-900/30 border-zinc-850"
            }`}>
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold">
                01. Contract-First API Mocking
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                Defined strict TypeScript interfaces for meteorological payloads in hour 1. This allowed frontend UI development to proceed simultaneously with data ingestion pipelines without blocking.
              </p>
            </div>

            <div className={`p-4 rounded-xl border space-y-2 ${
              isLight ? "bg-slate-50 border-slate-200" : "bg-zinc-900/30 border-zinc-850"
            }`}>
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold">
                02. Feature Isolation &amp; Git Hygiene
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                Used scoped branch naming (<span className="font-mono text-cyan-600 dark:text-cyan-400">feat/aqi-thresholds</span>, <span className="font-mono text-cyan-600 dark:text-cyan-400">feat/tide-chart</span>) and pull request peer reviews to ensure atomic commits and zero merge conflicts during deadline crunches.
              </p>
            </div>

            <div className={`p-4 rounded-xl border space-y-2 ${
              isLight ? "bg-slate-50 border-slate-200" : "bg-zinc-900/30 border-zinc-850"
            }`}>
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold">
                03. Automated Edge CI/CD
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                Every push triggered preview deployments on Vercel with automated TypeScript type checking, ensuring the judging panel always accessed a pristine, operational live build.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EcosystemPage;
