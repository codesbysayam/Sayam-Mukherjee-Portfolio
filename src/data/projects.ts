export const VALID_PROJECT_IDS = [
  "mausam",
  "operon",
  "sayam-solves",
  "memory-in-motion",
  "routeledger",
  "portfolio",
  "yolo"
] as const;

export type ValidProjectId = typeof VALID_PROJECT_IDS[number];

export interface ProjectItem {
  id: string;
  name?: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  longDescription: string;
  whyItExists: string;
  whatIBuilt: string;
  category: string;
  categoryLabel: string;
  categoryFilter: "AI / ML" | "FULL-STACK" | "SYSTEMS" | "RESEARCH" | "DSA";
  status: string;
  statusType: "live" | "active" | "hackathon" | "opensource";
  technologies?: string[];
  techStack: string[];
  tech?: string[];
  tags: string[];
  repository?: string;
  githubRepoName?: string;
  githubUrl: string;
  liveUrl?: string;
  demoUrl?: string;
  featured: boolean;
  highlights: string[];
  features?: string[];
  role?: string;
  architecture?: string[];
  evolutionStage: {
    phase: string;
    step: string;
    period: string;
    focus: string;
  };
}

export type RealProject = ProjectItem;
export type VerifiedProject = ProjectItem;

/**
 * Single source of truth for Sayam Mukherjee's verified engineering portfolio projects.
 * Derived from verified public repositories and documented engineering work.
 */
export const PROJECTS: ProjectItem[] = [
  {
    id: "mausam",
    name: "MAUSAM",
    title: "MAUSAM",
    subtitle: "Smart Weather Intelligence Platform • SIH 2026",
    shortDescription: "Smart weather intelligence platform built for SIH 2026 by Team Algnite providing real-time meteorological insights.",
    longDescription: "Mausam is a smart weather intelligence platform engineered for the Smart India Hackathon (SIH 2026) by Team Algnite. It aggregates meteorological data, real-time AQI, UV index, humidity, wind, pollen, sea condition forecasts, tides, and soil moisture analytics into an accessible, high-signal dashboard.",
    whyItExists: "Weather information is often fragmented across multiple disparate sources. Mausam unifies critical meteorological parameters, air quality alerts, and coastal data for agricultural workers, fishermen, and citizens.",
    whatIBuilt: "Constructed a high-signal weather portal in React and TypeScript that ingests meteorological APIs and computes localized severity thresholds for air quality, tides, and UV exposure.",
    category: "Full-Stack & Web",
    categoryLabel: "Hackathon / SIH 2026",
    categoryFilter: "FULL-STACK",
    status: "SIH 2026 Submission",
    statusType: "hackathon",
    technologies: ["TypeScript", "React", "Tailwind CSS", "Weather APIs", "Python", "Vercel", "Git", "GitHub"],
    techStack: ["TypeScript", "React", "Tailwind CSS", "Weather APIs", "Python"],
    tech: ["TypeScript", "React", "Tailwind CSS", "Weather APIs"],
    tags: ["TypeScript", "React", "Tailwind CSS", "Weather APIs", "SIH 2026", "Climate Tech"],
    repository: "mausam",
    githubRepoName: "mausam",
    githubUrl: "https://github.com/codesbysayam/mausam",
    liveUrl: "https://mausamgovt.vercel.app",
    demoUrl: "https://mausamgovt.vercel.app",
    featured: true,
    highlights: [
      "Smart India Hackathon (SIH 2026) verified submission by Team Algnite",
      "Unified climate metrics: AQI, UV index, soil moisture, and ocean tides",
      "Responsive, clean UI engineered in React and TypeScript for citizen accessibility"
    ],
    features: [
      "Smart India Hackathon (SIH 2026) verified submission by Team Algnite",
      "Unified climate metrics: AQI, UV index, soil moisture, and ocean tides",
      "Responsive, clean UI engineered in React and TypeScript for citizen accessibility"
    ],
    role: "Frontend & Integration Developer",
    architecture: [
      "Client-side caching layer for meteorological API endpoints to optimize latency",
      "Interactive climate telemetry widgets with color-coded AQI severity thresholds",
      "Mobile-first responsive layout ensuring accessible data across all screen sizes"
    ],
    evolutionStage: {
      phase: "SYSTEMS & COMPETITION",
      step: "02",
      period: "SIH 2026",
      focus: "High-scale meteorological aggregation & hackathon engineering"
    }
  },
  {
    id: "operon",
    name: "OPERON",
    title: "OPERON",
    subtitle: "Autonomous Operations & Multi-Agent Workflow Engine",
    shortDescription: "Autonomous operations platform built for intelligent, human-controlled workflows across Support, Finance, HR, and Operations.",
    longDescription: "Operon is an autonomous operations platform engineered for complex enterprise operations. It combines multi-agent AI systems with human-in-the-loop governance to automate end-to-end organizational workflows, decision checkpoints, and state orchestration while keeping critical decisions firmly under human oversight.",
    whyItExists: "Complex organizational workflows in support, finance, and operations frequently encounter bottlenecks caused by fragmented tools and rigid automation scripts that fail to involve human decision-makers at critical moments.",
    whatIBuilt: "Architected a multi-agent orchestration engine with role-specific autonomous agents, auditable state machine checkpoints, an Express.js backend service, and a responsive React control interface.",
    category: "Systems & AI",
    categoryLabel: "Systems & Multi-Agent AI",
    categoryFilter: "SYSTEMS",
    status: "Active / In Development",
    statusType: "active",
    technologies: ["TypeScript", "Node.js", "Express", "React", "Multi-Agent AI", "REST API", "Vercel", "Git", "GitHub"],
    techStack: ["TypeScript", "Node.js", "Express", "React", "Multi-Agent AI", "REST API"],
    tech: ["TypeScript", "Node.js", "Express", "React", "Multi-Agent AI"],
    tags: ["TypeScript", "Multi-Agent AI", "Node.js", "Express", "React", "Automation"],
    repository: "Operon",
    githubRepoName: "Operon",
    githubUrl: "https://github.com/codesbysayam/Operon",
    liveUrl: "https://operonpro.vercel.app",
    demoUrl: "https://operonpro.vercel.app",
    featured: true,
    highlights: [
      "Autonomous multi-agent task routing and execution pipelines",
      "Human-in-the-loop governance checkpoints for high-stakes operational actions",
      "Modular backend architecture with Express.js and responsive React frontend"
    ],
    features: [
      "Autonomous multi-agent task routing and execution pipelines",
      "Human-in-the-loop governance checkpoints for high-stakes operational actions",
      "Modular backend architecture with Express.js and responsive React frontend"
    ],
    role: "Lead Architect & Developer",
    architecture: [
      "Multi-Agent Dispatcher coordinating role-specific sub-agents",
      "Human-in-the-loop approval state machine with auditable event logs",
      "Decoupled React client connected to Node.js/Express service layer"
    ],
    evolutionStage: {
      phase: "CURRENT DEVELOPMENT",
      step: "05",
      period: "Current",
      focus: "Autonomous multi-agent systems & enterprise governance"
    }
  },
  {
    id: "memory-in-motion",
    name: "Memory in Motion",
    title: "Memory in Motion",
    subtitle: "Interactive Mechanistic Laboratory for Recurrent Memory",
    shortDescription: "An interactive mechanistic laboratory exploring recurrent memory, hidden-state dynamics, and the compression vs interference trade-off.",
    longDescription: "Memory in Motion is an interactive mechanistic research laboratory focused on understanding how recurrent neural systems retain, compress, and update temporal information. It provides real-time visualizations of recurrent weight updates, eigen-spectrum stability, hidden state trajectories, and the fundamental trade-off between memory retention and catastrophic interference in sequence models.",
    whyItExists: "Recurrent sequence processing and state retention are often treated as black boxes. Developing mechanistic intuition requires interactive simulation of memory states, gating functions, and decay dynamics under controlled input sequences.",
    whatIBuilt: "Designed an interactive simulation engine in TypeScript and React visualizing dynamical trajectories of recurrent states, gating parameters, eigen-decomposition, and interference patterns under sequential task loads.",
    category: "AI Research & Systems",
    categoryLabel: "AI Research / Mechanistic Lab",
    categoryFilter: "RESEARCH",
    status: "Active Research & Demo",
    statusType: "opensource",
    technologies: ["TypeScript", "React", "Dynamical Systems", "Recurrent Networks", "Linear Algebra", "Tailwind CSS", "Git", "GitHub"],
    techStack: ["TypeScript", "React", "Tailwind CSS", "Mathematical Simulation", "Recurrent Networks"],
    tech: ["TypeScript", "React", "Dynamical Systems", "Recurrent Memory"],
    tags: ["AI Research", "Recurrent Memory", "Dynamical Systems", "TypeScript", "React", "Interactive Lab"],
    repository: "Memory-in-Motion",
    githubRepoName: "Memory-in-Motion",
    githubUrl: "https://github.com/codesbysayam/Memory-in-Motion",
    featured: true,
    highlights: [
      "Interactive simulation of recurrent hidden state trajectories and decay dynamics",
      "Mechanistic exploration of the compression versus catastrophic interference trade-off",
      "Mathematical visualizations of matrix eigenvalues and stability regimes"
    ],
    features: [
      "Interactive simulation of recurrent hidden state trajectories and decay dynamics",
      "Mechanistic exploration of the compression versus catastrophic interference trade-off",
      "Mathematical visualizations of matrix eigenvalues and stability regimes"
    ],
    role: "Researcher & Developer",
    architecture: [
      "Vectorized state-evolution loop running client-side with zero latency",
      "Interactive parameter controls for decay rate, gating thresholds, and noise injection",
      "Real-time Phase-space trajectory rendering with canvas and SVG visualizers"
    ],
    evolutionStage: {
      phase: "RESEARCH & LAB",
      step: "06",
      period: "2026",
      focus: "Recurrent dynamics, mechanistic interpretability & sequence modeling"
    }
  },
  {
    id: "routeledger",
    name: "RouteLedger",
    title: "RouteLedger",
    subtitle: "Commercial Driver Route & Hours-of-Service Planner",
    shortDescription: "Commercial fleet logistics engine combining Hours-of-Service compliance tracking with route optimization.",
    longDescription: "RouteLedger is a logistics and fleet operations tool built to plan commercial trucking routes while enforcing strict Hours-of-Service (HOS) regulatory mandates. It optimizes waypoints, computes mandated rest stops, tracks driving and on-duty limits, and calculates fuel economy metrics across interstate transit corridors.",
    whyItExists: "Commercial drivers and dispatchers must balance delivery timetables against stringent legal Hours-of-Service rest requirements. Violations lead to steep fines and driver fatigue.",
    whatIBuilt: "Engineered a full-stack route planning application with algorithmic HOS schedule generation, rest stop insertion, distance and fuel estimation, and clean dispatcher dashboard controls.",
    category: "Full-Stack & Systems",
    categoryLabel: "Logistics & Systems",
    categoryFilter: "FULL-STACK",
    status: "Active Open Source",
    statusType: "opensource",
    technologies: ["TypeScript", "Python", "React", "Tailwind CSS", "Route Optimization", "HOS Compliance", "Git", "GitHub"],
    techStack: ["TypeScript", "Python", "React", "Tailwind CSS", "Logistics Algorithms"],
    tech: ["TypeScript", "Python", "React", "Tailwind CSS"],
    tags: ["TypeScript", "Logistics", "Route Planning", "HOS Compliance", "React", "Python"],
    repository: "RouteLedger",
    githubRepoName: "RouteLedger",
    githubUrl: "https://github.com/codesbysayam/RouteLedger",
    featured: true,
    highlights: [
      "Automated Hours-of-Service (HOS) regulatory driving and rest window calculations",
      "Route optimization with intelligent waypoint and rest-stop sequencing",
      "Interactive route overview with mileage and duty status breakdowns"
    ],
    features: [
      "Automated Hours-of-Service (HOS) regulatory driving and rest window calculations",
      "Route optimization with intelligent waypoint and rest-stop sequencing",
      "Interactive route overview with mileage and duty status breakdowns"
    ],
    role: "Full-Stack Engineer",
    architecture: [
      "Deterministic HOS scheduling algorithm enforcing continuous driving limits",
      "Modular routing service calculating distance, estimated duration, and rest stops",
      "Responsive driver-first dashboard with clear visual status indicators"
    ],
    evolutionStage: {
      phase: "FULL-STACK & LOGISTICS",
      step: "07",
      period: "2026",
      focus: "Fleet scheduling algorithms, HOS compliance & full-stack delivery"
    }
  },
  {
    id: "sayam-solves",
    name: "SayamSolves",
    title: "SayamSolves",
    subtitle: "Algorithmic Problem Solving & LeetCode DSA Repository",
    shortDescription: "Daily coding challenges solved by Sayam, powered by consistent DSA practice and algorithmic decomposition.",
    longDescription: "A structured, open-source algorithmic repository documenting daily problem-solving across LeetCode and competitive programming platforms. Features optimal C++ implementations with comprehensive time and space complexity breakdowns for foundational data structures, two-pointers, arrays, strings, and recursion.",
    whyItExists: "Engineered to establish disciplined problem-solving mastery through daily hands-on practice, focusing on asymptotic optimization, optimal memory allocation, and algorithmic decomposition.",
    whatIBuilt: "Structured open-source repository featuring optimal C++ implementations of LeetCode problems with line-by-line algorithmic complexity annotations and systematic categorizations.",
    category: "Algorithms & DSA",
    categoryLabel: "Algorithms & DSA",
    categoryFilter: "DSA",
    status: "Active Daily Practice",
    statusType: "active",
    technologies: ["C++", "DSA", "Data Structures & Algorithms", "Algorithms", "Git", "GitHub"],
    techStack: ["C++", "DSA", "Algorithms", "LeetCode", "Data Structures"],
    tech: ["C++", "DSA", "Algorithms", "LeetCode"],
    tags: ["C++", "DSA", "Algorithms", "LeetCode", "Data Structures", "Competitive Programming"],
    repository: "sayam-solves",
    githubRepoName: "sayam-solves",
    githubUrl: "https://github.com/codesbysayam/sayam-solves",
    featured: true,
    highlights: [
      "Daily algorithmic solutions in C++ with documented time and space complexity",
      "Comprehensive problem coverage across arrays, strings, two-pointers, and recursion",
      "Organized open-source repository maintaining consistent daily problem-solving cadence"
    ],
    features: [
      "Daily algorithmic solutions in C++ with documented time and space complexity",
      "Comprehensive problem coverage across arrays, strings, two-pointers, and recursion",
      "Organized open-source repository maintaining consistent daily problem-solving cadence"
    ],
    role: "Problem Solver & Maintainer",
    architecture: [
      "Topic-segmented directory structure mirroring standard DSA curricula",
      "Benchmarked asymptotic runtime and memory analysis for each solution",
      "Continuous Git push history reflecting daily algorithmic discipline"
    ],
    evolutionStage: {
      phase: "EARLY BUILDS",
      step: "01",
      period: "Ongoing Daily",
      focus: "Foundational algorithms, optimal data structures & C++"
    }
  },
  {
    id: "portfolio",
    name: "Sayam Mukherjee Interactive Portfolio",
    title: "Sayam Mukherjee — Interactive Portfolio",
    subtitle: "Liquid Glass Portfolio & Systems Architecture",
    shortDescription: "Personal developer portfolio featuring clean editorial typography, live GitHub repository synchronization, and responsive design.",
    longDescription: "An interactive, high-performance developer portfolio built with React, TypeScript, Tailwind CSS, Express, and Motion. Features cached GitHub repository synchronization, language breakdown analysis, command palette shortcuts, and fluid cross-device responsiveness.",
    whyItExists: "Created to present authentic, verified software systems and live GitHub repository metadata in a bespoke, high-performance web experience, eliminating generic templates and mock data.",
    whatIBuilt: "Engineered a full-stack web application with client-side GitHub caching, fluid clamp() typography, dark/light editorial aesthetics, and modular sub-second cold loads.",
    category: "Full-Stack & Web",
    categoryLabel: "Web Engineering",
    categoryFilter: "FULL-STACK",
    status: "Live Deployment",
    statusType: "live",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Express", "HTML", "CSS", "Responsive Development", "Git", "GitHub", "Vercel"],
    techStack: ["React", "TypeScript", "Tailwind CSS", "Express", "Vite", "Motion"],
    tech: ["React", "TypeScript", "Tailwind CSS", "Express", "Motion"],
    tags: ["React", "TypeScript", "Tailwind CSS", "Express", "Vite", "Motion", "Full Stack"],
    repository: "Sayam-Mukherjee-Portfolio",
    githubRepoName: "Sayam-Mukherjee-Portfolio",
    githubUrl: "https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio",
    liveUrl: "https://sayammukherjee.in",
    demoUrl: "https://sayammukherjee.in",
    featured: false,
    highlights: [
      "Live synced repository metadata from GitHub API with intelligent caching",
      "Custom dark editorial aesthetic with seamless light-mode parity",
      "Fluid, responsive CSS architecture designed for all screen ratios and orientations"
    ],
    features: [
      "Live synced repository metadata from GitHub API with intelligent caching",
      "Custom dark editorial aesthetic with seamless light-mode parity",
      "Fluid, responsive CSS architecture designed for all screen ratios and orientations"
    ],
    role: "Full-Stack Engineer & Designer",
    architecture: [
      "Client-side caching layer with local storage fallback for rate limit protection",
      "Vite React client with code-split tabs for optimized sub-second cold loads",
      "Custom design system with clamp() typography and container query flexibility"
    ],
    evolutionStage: {
      phase: "FULL-STACK",
      step: "03",
      period: "Current Live",
      focus: "Production web architecture, live GitHub synchronization & clean UI"
    }
  },
  {
    id: "yolo",
    name: "YOLO / Edge Computer Vision",
    title: "YOLO / YOLOv8 Edge Computer Vision",
    subtitle: "Real-Time Edge Object Detection & Motion Tracking Pipeline",
    shortDescription: "Autonomous edge computer vision pipeline detecting real-time object movement vectors and spatial tracking.",
    longDescription: "A focused computer vision pipeline combining lightweight YOLOv8 models with OpenCV stream processing. Designed to run efficiently on compute-constrained edge hardware, generating real-time bounding vectors, trajectory estimates, and spatial movement metadata for autonomous monitoring without cloud latency.",
    whyItExists: "Cloud-hosted computer vision creates high latency, high bandwidth costs, and privacy vulnerabilities. Edge processing enables instantaneous detection and offline spatial tracking.",
    whatIBuilt: "Constructed a modular Python pipeline combining YOLOv8 model inference with OpenCV frame processing to compute real-time velocity vectors and bounding track telemetry directly on hardware.",
    category: "Computer Vision & AI",
    categoryLabel: "Edge AI / CV",
    categoryFilter: "AI / ML",
    status: "Research & Implementation",
    statusType: "opensource",
    technologies: ["Python", "YOLO / YOLOv8", "OpenCV", "PyTorch", "Computer Vision", "Machine Learning", "Git", "GitHub"],
    techStack: ["Python", "YOLOv8", "OpenCV", "PyTorch", "Computer Vision"],
    tech: ["Python", "YOLOv8", "OpenCV", "PyTorch"],
    tags: ["Python", "YOLOv8", "OpenCV", "PyTorch", "Computer Vision", "Edge AI"],
    repository: "codesbysayam",
    githubRepoName: "codesbysayam",
    githubUrl: "https://github.com/codesbysayam",
    featured: false,
    highlights: [
      "Lightweight YOLOv8 model inference optimized for low-power edge nodes",
      "OpenCV spatial tracking, trajectory logging, and bounding box stabilization",
      "Python-based modular pipeline supporting real-time video feeds"
    ],
    features: [
      "Lightweight YOLOv8 model inference optimized for low-power edge nodes",
      "OpenCV spatial tracking, trajectory logging, and bounding box stabilization",
      "Python-based modular pipeline supporting real-time video feeds"
    ],
    role: "CV Engineer & Researcher",
    architecture: [
      "Stream ingestion pipeline decoding frames at native camera FPS with OpenCV",
      "Quantized YOLOv8 neural network inference producing class confidence and coordinates",
      "Vector trajectory tracking calculating velocity and direction of detected objects"
    ],
    evolutionStage: {
      phase: "AI / ML",
      step: "04",
      period: "Research",
      focus: "Edge inference, OpenCV motion tracking & neural computer vision"
    }
  }
];

export const REAL_PROJECTS: ProjectItem[] = PROJECTS;
export const VERIFIED_PROJECTS: ProjectItem[] = PROJECTS;

// Helper to look up a project by either primary id or historic alias
export function getProjectById(id: string): ProjectItem | undefined {
  const normalized = id.toLowerCase().replace(/[-_]/g, "");
  return PROJECTS.find((p) => {
    const pNorm = p.id.toLowerCase().replace(/[-_]/g, "");
    return pNorm === normalized || p.id === id;
  });
}
