import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Cpu, GitBranch, Users, ExternalLink, Eye, Globe, CloudRain, Binary, CheckCircle2
} from "lucide-react";
import { SectionHeader } from "../common/SectionHeader";
import { EditorialReveal, LineReveal, StaggerGroup, StaggerItem } from "../../motion/Reveal";
import { MOTION_DURATION, MOTION_EASE, usePrefersReducedMotion } from "../../motion/tokens";

type BlueprintId = "operon" | "sayamsolves" | "mausam" | "yolo" | "portfolio";

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
  sayamsolves: {
    id: "sayamsolves",
    title: "SayamSolves Algorithmic Engine & DSA Architecture",
    subtitle: "High-performance C++ algorithmic problem solving and data structures repository",
    category: "Algorithmic Engineering & C++ DSA",
    status: "Active Practice",
    purpose: "Systematic algorithmic repository cataloging optimal C++ solutions, time/space complexity invariants, graph traversal mechanics, and dynamic programming patterns across competitive platforms.",
    nodes: [
      { name: "Problem Invariant Modeling", description: "Constraint deconstruction, bounds checking & edge case mapping", type: "input" },
      { name: "Data Structure Selection", description: "Segment trees, Trie, Fenwick trees, Disjoint Set Union", type: "process" },
      { name: "Complexity Optimization Engine", description: "Pruning redundant branches, cache locality & vector allocations", type: "process" },
      { name: "Asymptotic Proof & Verification", description: "Formal big-O time and space complexity validation", type: "decision" },
      { name: "Annotated Solution Corpus", description: "Documented C++ templates and pattern classification", type: "storage" },
      { name: "Verified Execution Matrix", description: "Sub-millisecond runtime execution on benchmark test suites", type: "output" }
    ],
    connections: [
      "Problem Constraints -> Evaluates worst-case bounds to select asymptotic targets",
      "Structure Selection -> Instantiates optimal memory layout (Trees, Graphs, Queues)",
      "Optimization -> Applies two-pointer, DP bitmask, or greedy invariants",
      "Proof Engine -> Verifies monotonic invariants and non-trivial edge conditions",
      "Execution -> Benchmarks against LeetCode & Codeforces automated grading harnesses"
    ],
    invariants: [
      "Strict asymptotic guarantees: all solutions verified against worst-case input bounds",
      "Zero dynamic memory leaks: RAII and modern C++ standard library structures",
      "Deterministic reproducible benchmarks with sub-millisecond execution runtime"
    ],
    repoUrl: "https://github.com/codesbysayam/sayam-solves",
    stats: [
      { label: "Language", value: "Modern C++ (C++17/20)" },
      { label: "Specialization", value: "Algorithms & Data Structures" },
      { label: "Evaluation", value: "Verified Invariant Proofs" }
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
      { label: "Frontend", value: "React 19 / Tailwind" },
      { label: "Backend", value: "Express API Proxy" },
      { label: "Data Integrity", value: "Live GitHub Telemetry" }
    ]
  }
};

export function EcosystemPage() {
  const [activeBlueprint, setActiveBlueprint] = useState<BlueprintId>("operon");
  const reduced = usePrefersReducedMotion();
  const blueprint = BLUEPRINTS[activeBlueprint];

  return (
    <div className="w-full space-y-12 sm:space-y-16 pb-12">
      {/* 1. HEADER */}
      <header id="ecosystem-hero" className="space-y-4 pt-2 pb-6 border-b border-[var(--border)]">
        <SectionHeader
          level="h1"
          eyebrow="04 · System Architecture"
          badge="Process & Blueprints"
          title={
            <>
              Engineering Ecosystem{" "}
              <span className="font-serif-editorial italic font-normal text-[var(--text-secondary)]">
                &amp; system blueprints.
              </span>
            </>
          }
          description="Software works best as an interconnected system of state machines, telemetry pipelines, mathematical invariants, and explicit human oversight."
        />

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono text-[var(--text-muted)]">
          <span className="font-semibold text-[var(--text)]">5 Verified Architectures</span>
          <span aria-hidden="true">·</span>
          <span>End-to-End Delivery Lifecycle</span>
          <span aria-hidden="true">·</span>
          <span className="text-[var(--accent)] font-semibold">SIH 2026 Collaboration Case Study</span>
        </div>
      </header>

      {/* 2. DELIVERY LIFECYCLE */}
      <section id="ecosystem-pipeline" className="space-y-6">
        <EditorialReveal className="space-y-2">
          <span className="text-xs font-mono font-semibold text-[var(--accent)] tracking-wider uppercase">
            Phase 01 · Delivery Lifecycle
          </span>
          <h2 className="text-2xl font-bold font-display text-[var(--text)]">
            The Engineering Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl font-sans">
            How abstract requirements progress into verified, resilient production software.
          </p>
        </EditorialReveal>

        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {[
            {
              step: "01",
              name: "Constraint Modeling",
              focus: "Scope & Invariants",
              desc: "Deconstruct core requirements into boundary conditions, rate limits, and failure modes before writing code."
            },
            {
              step: "02",
              name: "Schema & Architecture",
              focus: "Type Contracts & DAGs",
              desc: "Define strict TypeScript interfaces, REST contracts, state machine transitions, and data models."
            },
            {
              step: "03",
              name: "Edge Prototyping",
              focus: "Micro-benchmarks",
              desc: "Validate algorithmic bottlenecks, API latencies, and critical execution paths in isolated harnesses."
            },
            {
              step: "04",
              name: "Production Hardening",
              focus: "Resilience & Zero CLS",
              desc: "Wrap network calls with exponential backoffs, enforce sub-100ms cached views, and guarantee stable responsive UI."
            },
            {
              step: "05",
              name: "Telemetry & Audit",
              focus: "Observability",
              desc: "Expose health checkpoints, commit logs, and auditable execution ledgers."
            }
          ].map((phase, idx) => (
            <StaggerItem key={phase.step} className="card p-4 flex flex-col justify-between space-y-3 transition-colors hover:border-[var(--border-strong)]">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                  <span className="font-bold text-[var(--accent)]">STEP {phase.step}</span>
                  <span className="text-[var(--text-muted)]">{idx < 4 ? "→" : "✔"}</span>
                </div>
                <h3 className="text-sm font-bold text-[var(--text)] font-display">{phase.name}</h3>
                <span className="text-xs font-mono text-[var(--text-muted)] block">{phase.focus}</span>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans pt-1">
                  {phase.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* 3. INTERACTIVE SYSTEM BLUEPRINTS */}
      <section id="ecosystem-blueprints" className="space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-mono font-semibold text-[var(--accent)] uppercase tracking-wider">
            Phase 02 · Architectural Blueprints
          </span>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h2 className="text-2xl font-bold font-display text-[var(--text)]">
              Core System Blueprints
            </h2>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              Interactive architecture explorer
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl font-sans">
            Inspect the processing stages, data handshakes, and formal invariants across all five documented platforms.
          </p>
        </div>

        {/* Selector Tabs */}
        <div className="flex flex-wrap gap-2 pt-1" role="tablist" aria-label="System blueprints">
          {[
            { id: "operon", label: "Operon: Multi-Agent AI", icon: Cpu },
            { id: "sayamsolves", label: "SayamSolves: C++ Algorithms", icon: Binary },
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
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveBlueprint(tab.id as BlueprintId)}
                className={`btn !min-h-[40px] !py-2 !px-3.5 !text-xs font-mono ${
                  isSelected ? "btn-primary" : "btn-secondary"
                }`}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Blueprint Detail Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBlueprint}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: MOTION_DURATION.normal, ease: MOTION_EASE.out }}
            className="card p-4 sm:p-8 space-y-6 sm:space-y-8"
          >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-[var(--border)]">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2.5 flex-wrap text-xs font-mono">
                <span className="text-[var(--accent)] font-semibold uppercase tracking-wider">
                  {blueprint.category}
                </span>
                <span className="text-[var(--text-faint)]" aria-hidden="true">·</span>
                <span className="text-[var(--text-muted)]">{blueprint.status}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-[var(--text)]">
                {blueprint.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] font-sans leading-relaxed">
                {blueprint.purpose}
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <a
                href={blueprint.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary !py-2 !px-3.5 !text-xs font-mono"
              >
                <GitBranch className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Source Code</span>
                <ExternalLink className="w-3 h-3 opacity-60" aria-hidden="true" />
              </a>
              {blueprint.liveUrl && (
                <a
                  href={blueprint.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary !py-2 !px-3.5 !text-xs font-mono"
                >
                  <span>Live App</span>
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {blueprint.stats.map((st) => (
              <div key={st.label} className="p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] space-y-0.5">
                <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase tracking-wider">
                  {st.label}
                </span>
                <span className="text-sm font-semibold text-[var(--text)] font-sans">
                  {st.value}
                </span>
              </div>
            ))}
          </div>

          {/* Architectural Nodes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
              <h4 className="uppercase tracking-wider font-semibold">
                System Topology &amp; Processing Stages
              </h4>
              <span>Left-to-Right Pipeline</span>
            </div>

            <StaggerGroup immediate stagger={0.035} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {blueprint.nodes.map((node, i) => (
                <StaggerItem
                  key={node.name}
                  className="p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] flex flex-col justify-between space-y-2 transition-colors hover:border-[var(--border-strong)]"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono tabular-nums">
                      <span className="text-[var(--text-muted)] font-bold">STAGE 0{i + 1}</span>
                      <span className="text-[var(--accent)] uppercase font-semibold">{node.type}</span>
                    </div>
                    <h5 className="text-sm font-bold text-[var(--text)] font-sans">{node.name}</h5>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                    {node.description}
                  </p>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>

          {/* Data Flow Chains */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold">
              Data Flow Transitions &amp; State Handshakes
            </h4>
            <div className="p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] space-y-2 text-xs font-mono text-[var(--text-secondary)]">
              {blueprint.connections.map((conn, idx) => (
                <div key={idx} className="flex items-start gap-2.5 min-w-0">
                  <span className="text-[var(--accent)] font-bold mt-0.5 shrink-0">↳</span>
                  <span className="leading-relaxed break-words min-w-0">{conn}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Invariants */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold">
              Architectural Invariants &amp; Safety Guarantees
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {blueprint.invariants.map((inv, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border-strong)] text-[var(--text)] flex items-start gap-2.5 text-xs font-sans leading-relaxed"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[var(--accent)] mt-0.5" aria-hidden="true" />
                  <span>{inv}</span>
                </div>
              ))}
            </div>
          </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* 4. RELATIONAL INTERCONNECT MATRIX */}
      <section id="ecosystem-matrix" className="space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-mono font-semibold text-[var(--accent)] uppercase tracking-wider">
            Phase 03 · Interdisciplinary Coupling
          </span>
          <h2 className="text-2xl font-bold font-display text-[var(--text)]">
            Relational Interconnect Matrix
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl font-sans">
            How distinct engineering layers coordinate across my software systems.
          </p>
        </div>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              domainA: "AI & Computer Vision",
              domainB: "Full-Stack Web Platforms",
              relation: "Edge Vector Streaming",
              details: "OpenCV and YOLO bounding boxes in Python are normalized to compact coordinate payloads and rendered smoothly in React."
            },
            {
              domainA: "Algorithmic Foundations (C++)",
              domainB: "State Machine Ledgers",
              relation: "Asymptotic Complexity Bounds",
              details: "Optimal space-time recurrence relations and graph traversals proven in algorithmic practice inform state transition routines."
            },
            {
              domainA: "Multi-Agent Systems",
              domainB: "Human-in-the-Loop Safeguards",
              relation: "Approval Decision Gates",
              details: "Autonomous LLM workers plan and draft actions, while critical mutations pause until authenticated human operators sign off."
            },
            {
              domainA: "Geospatial Telemetry",
              domainB: "Resilient Offline Caching",
              relation: "Sub-100ms Hydration",
              details: "Multi-provider weather APIs are normalized via worker layers and cached locally for reliable low-bandwidth responsiveness."
            }
          ].map((item, idx) => (
            <StaggerItem key={idx} className="card p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <span className="text-[var(--accent)] font-semibold">{item.domainA}</span>
                <span className="text-[var(--text-muted)]">↔</span>
                <span className="text-[var(--text)] font-semibold">{item.domainB}</span>
              </div>
              <h4 className="text-base font-bold font-display text-[var(--text)]">{item.relation}</h4>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
                {item.details}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* 5. SIH 2026 CASE STUDY */}
      <section id="ecosystem-sih" className="space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-mono font-semibold text-[var(--accent)] uppercase tracking-wider">
            Phase 04 · Team Collaboration Case Study
          </span>
          <h2 className="text-2xl font-bold font-display text-[var(--text)]">
            Smart India Hackathon (SIH 2026) Architecture
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl font-sans">
            How Team Algnite coordinated rapid full-stack delivery under competition constraints.
          </p>
        </div>

        <div className="card p-4 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-[6px] bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)]">
                <Users className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-[var(--text)]">
                  Team Algnite Collaboration Mechanics
                </h3>
                <span className="text-xs font-mono text-[var(--text-muted)]">
                  SIH 2026 National Hackathon Qualification
                </span>
              </div>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-[4px] bg-[#C7E34A] text-[#20231D] font-bold self-start sm:self-auto">
              Verified Submission
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text)] font-bold">
                01. Contract-First API Mocking
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                Defined strict TypeScript interfaces for meteorological payloads in hour one, letting UI development proceed in parallel with data ingestion.
              </p>
            </div>

            <div className="p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text)] font-bold">
                02. Feature Isolation &amp; Git Hygiene
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                Used scoped branch naming (<span className="font-mono text-[var(--accent)]">feat/aqi-thresholds</span>, <span className="font-mono text-[var(--accent)]">feat/tide-chart</span>) and pull request reviews for conflict-free shipping.
              </p>
            </div>

            <div className="p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text)] font-bold">
                03. Automated Edge CI/CD
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                Continuous preview deployments on Vercel with strict TypeScript checking ensured judges always accessed a working live build.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EcosystemPage;
