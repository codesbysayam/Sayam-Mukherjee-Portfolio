import React, { useState } from "react";
import { 
  Cpu, Layers, GitBranch, ArrowRight, ShieldCheck, 
  Database, CheckCircle2, CloudRain, Binary, Users, 
  ExternalLink, Eye, Globe
} from "lucide-react";
import { SectionHeader } from "../common/SectionHeader";
import { Card } from "../common/Card";

type BlueprintId = "operon" | "mausam" | "yolo" | "portfolio";

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
    status: "Active Production",
    purpose: "Coordinates multiple specialized AI agents across organizational workflows while guaranteeing that sensitive actions (payouts, data mutations, terminations) halt at strict human-in-the-loop checkpoints.",
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
  yolo: {
    id: "yolo",
    title: "YOLO Edge Vision Pipeline",
    subtitle: "Real-time edge computer vision and spatial inference",
    category: "Computer Vision & Edge AI",
    status: "Research Prototype",
    purpose: "Implements real-time bounding box detection, polygon region-of-interest monitoring, and optimized frame inference latency for embedded camera feeds.",
    nodes: [
      { name: "Video Stream Ingestion", description: "RTSP camera stream or local video frame feed", type: "input" },
      { name: "Pre-processing & Tensor Normalization", description: "Resizing, RGB standardization, CUDA memory staging", type: "process" },
      { name: "YOLOv8 Backbone & Head", description: "Feature extraction with anchor-free bounding box regression", type: "process" },
      { name: "Spatial ROI Evaluation", description: "Polygon containment and crossing boundary detection", type: "decision" },
      { name: "Inference Log Matrix", description: "Frame-by-frame coordinate and confidence scores", type: "storage" },
      { name: "Bounding Box Canvas Render", description: "Low-latency visual tracking overlay", type: "output" }
    ],
    connections: [
      "Stream Ingestion -> Normalizes frame rates and feeds image buffer",
      "Pre-processing -> Converts raw pixels to optimized tensors",
      "Backbone -> Infers class probabilities and coordinates in single pass",
      "ROI Evaluation -> Evaluates intersections against user-defined zones",
      "Canvas Render -> Overlays high-confidence detections at edge speeds"
    ],
    invariants: [
      "Sub-30ms per-frame inference target on accelerated edge runtimes",
      "Non-maximum suppression thresholding to eliminate duplicate detections",
      "Strict separation between camera feed decoding and visual inference overlays"
    ],
    repoUrl: "https://github.com/codesbysayam/yolo",
    stats: [
      { label: "Core Model", value: "YOLOv8 / PyTorch" },
      { label: "Inference Target", value: "Real-Time Embedded" },
      { label: "Specialization", value: "Spatial ROI Monitoring" }
    ]
  },
  portfolio: {
    id: "portfolio",
    title: "Interactive Portfolio Ecosystem",
    subtitle: "Full-stack client and server architecture with live GitHub sync",
    category: "Full-Stack Web Architecture",
    status: "Live Production",
    purpose: "Architected around strict zero-CLS layout stability, server-side caching proxies, live GitHub API commit pipelines, and mathematical typography clamp systems.",
    nodes: [
      { name: "Live GitHub GraphQL / REST API", description: "Real repo metadata, commit histories, and byte counts", type: "input" },
      { name: "Express Proxy & Caching Layer", description: "In-memory LRU cache preventing API rate-limiting", type: "process" },
      { name: "Theme Token State Engine", description: "CSS custom properties with light/dark runtime parity", type: "process" },
      { name: "Route & Modal Controller", description: "Deep-linkable modal views and single-screen tabs", type: "decision" },
      { name: "Local Storage Fallback Store", description: "Resilient cache hydration for zero-network conditions", type: "storage" },
      { name: "Fluid Design System UI", description: "Semantic, accessible presentation with Tailwind tokens", type: "output" }
    ],
    connections: [
      "GitHub API -> Express server fetches commit logs and repo metrics",
      "Server Proxy -> Evaluates cache age and returns sanitized payloads",
      "Token Engine -> Synchronizes documentElement attributes and CSS variables",
      "Route Controller -> Smoothly mounts active views with zero layout shifts",
      "Design System -> Delivers verified engineering telemetry directly to user"
    ],
    invariants: [
      "Zero fabricated metrics, fake stars, or synthetic commit counts",
      "Zero Cumulative Layout Shift (CLS) on initial paint across all viewports",
      "100% theme variable parity across light and dark color modes"
    ],
    repoUrl: "https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio",
    liveUrl: "https://sayammukherjee.in",
    stats: [
      { label: "Frontend", value: "React 18 / Tailwind" },
      { label: "Backend", value: "Express API Proxy" },
      { label: "Data Integrity", value: "Live GitHub Telemetry" }
    ]
  }
};

export function EcosystemPage() {
  const [activeBlueprint, setActiveBlueprint] = useState<BlueprintId>("operon");
  const blueprint = BLUEPRINTS[activeBlueprint];

  return (
    <div className="w-full space-y-12 sm:space-y-16 pb-12">
      {/* 1. EDITORIAL SYSTEM ARCHITECTURE HEADER */}
      <header className="space-y-4 pt-2">
        <SectionHeader
          level="h1"
          eyebrow="System Architecture · Process &amp; Relationships"
          title={<>Engineering Ecosystem <br /><span className="text-zinc-400 dark:text-zinc-500 font-normal">&amp; System Blueprints</span></>}
          description="Software is rarely an isolated card—it is an interconnected ecosystem of state machines, telemetry pipelines, mathematical invariants, and human-in-the-loop governance."
        />

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono text-zinc-500 pt-1">
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">4 Verified Architectures</span>
          <span>·</span>
          <span>End-to-End Delivery Lifecycle</span>
          <span>·</span>
          <span className="text-purple-700 dark:text-purple-400 font-medium">SIH 2026 Collaboration Case Study</span>
        </div>
      </header>

      {/* 2. THE 5-STAGE ENGINEERING DELIVERY LIFECYCLE */}
      <section className="space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-mono font-semibold text-purple-700 dark:text-purple-400 tracking-wide">
            Phase 01 — Delivery Lifecycle
          </span>
          <h2 className="text-2xl font-bold font-display text-zinc-900 dark:text-white">
            The Engineering Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl font-sans">
            How I progress an abstract requirement into a verified, resilient production system.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            {
              step: "01",
              name: "Constraint Modeling",
              focus: "Scope & Invariants",
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
              focus: "Micro-benchmarks",
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
              focus: "Observability",
              desc: "Expose real-time health checkpoints, live GitHub commit logs, and auditable execution journals."
            }
          ].map((phase, idx) => (
            <div
              key={phase.step}
              className="card p-4 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-purple-700 dark:text-purple-400">
                    STEP {phase.step}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">
                    {idx < 4 ? "→" : "✔"}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-display">
                  {phase.name}
                </h3>
                <span className="text-xs font-mono text-zinc-500 block">
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

      {/* 3. INTERACTIVE SYSTEM BLUEPRINTS (THE 4 VERIFIED SYSTEMS) */}
      <section className="space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-mono font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
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
            { id: "yolo", label: "YOLO: Edge Computer Vision", icon: Eye },
            { id: "portfolio", label: "Portfolio: Full-Stack Architecture", icon: Globe }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeBlueprint === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveBlueprint(tab.id as BlueprintId)}
                className={`px-3.5 py-2 rounded-lg text-xs font-mono flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? "btn-primary !py-2 !px-3.5"
                    : "btn-secondary !py-2 !px-3.5"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Blueprint Detail Card */}
        <div className="card p-6 sm:p-8 space-y-8">
          {/* Header & Meta */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-zinc-250/70 dark:border-white/[0.08]">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800/40">
                  {blueprint.category}
                </span>
                <span className="text-xs font-mono text-zinc-500">
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

            <div className="flex items-center gap-2.5 shrink-0">
              <a
                href={blueprint.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary !py-2 !px-3.5 !text-xs font-mono"
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>Source Code</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
              {blueprint.liveUrl && (
                <a
                  href={blueprint.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary !py-2 !px-3.5 !text-xs font-mono"
                >
                  <span>Live App</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Key Metric Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {blueprint.stats.map((st) => (
              <div
                key={st.label}
                className="p-3.5 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-250/70 dark:border-white/[0.06] space-y-0.5"
              >
                <span className="text-[10px] font-mono text-zinc-500 block uppercase tracking-wider">
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
              <span className="text-xs font-mono text-zinc-500">
                Left-to-Right Execution Pipeline
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {blueprint.nodes.map((node, i) => {
                const typeColors = {
                  input: "bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800/40",
                  process: "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/40",
                  decision: "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/40",
                  storage: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40",
                  output: "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/40"
                }[node.type];

                return (
                  <div
                    key={node.name}
                    className="p-3.5 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-250/70 dark:border-white/[0.06] flex flex-col justify-between space-y-2"
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
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-250/70 dark:border-white/[0.06] space-y-2 text-xs font-mono text-zinc-700 dark:text-zinc-300">
              {blueprint.connections.map((conn, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span className="text-purple-600 dark:text-purple-400 font-bold mt-0.5">↳</span>
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
                  className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/30 text-emerald-900 dark:text-emerald-300 flex items-start gap-2.5 text-xs font-sans leading-relaxed"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                  <span>{inv}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. RELATIONAL INTERCONNECT MATRIX */}
      <section className="space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-mono font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
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
              domainB: "State Machine Ledgers",
              relation: "Asymptotic Complexity Bounds",
              details: "Optimal space-time recurrence relations and graph traversals proven in algorithmic practice are embedded directly into state machine execution routines to prevent latency spikes."
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
              details: "Multi-provider weather APIs are normalized through resilient edge workers and cached in client storage to provide instant responsiveness even in rural connectivity zones."
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="card p-5 space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-purple-700 dark:text-purple-400 font-semibold">{item.domainA}</span>
                <span className="text-zinc-400">↔</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{item.domainB}</span>
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
        <div className="space-y-2">
          <span className="text-xs font-mono font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
            PHASE 04 — RAPID COLLABORATION CASE STUDY
          </span>
          <h2 className="text-2xl font-bold font-display text-zinc-900 dark:text-white">
            Smart India Hackathon (SIH 2026) Architecture
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl font-sans">
            How Team Algnite coordinated rapid-fire full-stack system delivery under competition deadlines.
          </p>
        </div>

        <div className="card p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-zinc-250/70 dark:border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 text-purple-700 dark:text-purple-300">
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
            <span className="text-xs font-mono px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-semibold self-start sm:self-auto">
              Verified Submission
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-250/70 dark:border-white/[0.06] space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold">
                01. Contract-First API Mocking
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                Defined strict TypeScript interfaces for meteorological payloads in hour 1. This allowed frontend UI development to proceed simultaneously with data ingestion pipelines without blocking.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-250/70 dark:border-white/[0.06] space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold">
                02. Feature Isolation &amp; Git Hygiene
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                Used scoped branch naming (<span className="font-mono text-purple-700 dark:text-purple-400">feat/aqi-thresholds</span>, <span className="font-mono text-purple-700 dark:text-purple-400">feat/tide-chart</span>) and pull request peer reviews to ensure atomic commits and zero merge conflicts during deadline crunches.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-250/70 dark:border-white/[0.06] space-y-2">
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
