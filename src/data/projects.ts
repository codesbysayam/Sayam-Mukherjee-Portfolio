export const VALID_PROJECT_IDS = [
  "operon",
  "sayam-solves",
  "mausam",
  "portfolio",
  "yolo"
] as const;

export type ValidProjectId = typeof VALID_PROJECT_IDS[number];

export interface ProjectMetrics {
  developmentTime?: string;
  codeComplexityScore?: string;
  linesOfCode?: string;
}

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
  categoryFilter: "AI / ML" | "FULL-STACK" | "SYSTEMS" | "DSA";
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
  metrics?: ProjectMetrics;
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
 * Strictly limited to the 5 verified projects backed by real GitHub code and documented engineering work.
 */
export const PROJECTS: ProjectItem[] = [
  {
    id: "operon",
    name: "OPERON",
    title: "OPERON",
    subtitle: "Autonomous Operations & Multi-Agent Workflow Engine",
    shortDescription: "An agent-driven operations platform I built to explore multi-agent workflows while keeping key decisions under human control.",
    longDescription: "I built OPERON to explore how multiple specialized agents can collaborate on complex business tasks without running unchecked. The platform automates routine handoffs and data passing between roles in Support, Finance, and HR, while pausing high-stakes decisions at explicit checkpoints for human approval, validation, and audit logging.",
    whyItExists: "Routine operational tasks often stall across disconnected tools, but fully autonomous scripts can make unchecked mistakes. OPERON explores an architecture where agents do the heavy lifting while people retain clear approval power.",
    whatIBuilt: "I developed the OPERON website from scratch, implementing the multi-agent task dispatcher, state machine checkpoints, Node.js and Express backend service, and the full responsive React user interface.",
    category: "Autonomous Systems & AI",
    categoryLabel: "Autonomous Systems & AI",
    categoryFilter: "AI / ML",
    status: "Active / In Development",
    statusType: "active",
    technologies: ["TypeScript", "Node.js", "Express", "React", "Multi-Agent AI", "REST API", "Vercel", "Git", "GitHub"],
    techStack: ["TypeScript", "Node.js", "Express", "React", "Multi-Agent AI", "REST API"],
    tech: ["TypeScript", "Node.js", "Express", "React", "Multi-Agent AI"],
    tags: ["Agentic Systems", "Business Process Automation", "Multi-Agent Systems", "Human-in-the-Loop"],
    repository: "Operon",
    githubRepoName: "Operon",
    githubUrl: "https://github.com/codesbysayam/Operon",
    liveUrl: "https://operonpro.vercel.app",
    demoUrl: "https://operonpro.vercel.app",
    featured: true,
    metrics: {
      developmentTime: "4 Weeks (Hackathon to MVP)",
      codeComplexityScore: "Low Coupling | High Cohesion (Multi-Agent)",
      linesOfCode: "4,200+ Lines",
    },
    highlights: [
      "Role-specific agent task routing across support, finance, and operations",
      "Human-in-the-loop approval checkpoints for high-impact actions",
      "Decoupled React interface connected to a modular Node.js/Express service"
    ],
    features: [
      "Role-specific agent task routing across support, finance, and operations",
      "Human-in-the-loop approval checkpoints for high-impact actions",
      "Decoupled React interface connected to a modular Node.js/Express service"
    ],
    role: "Lead Architect & Developer",
    architecture: [
      "Multi-Agent Dispatcher coordinating role-specific sub-agents",
      "Human-in-the-loop approval state machine with auditable event logs",
      "Decoupled React client connected to Node.js/Express service layer"
    ],
    evolutionStage: {
      phase: "SYSTEMS & AI",
      step: "01",
      period: "Current",
      focus: "Autonomous multi-agent systems & enterprise governance"
    }
  },
  {
    id: "sayam-solves",
    name: "SayamSolves",
    title: "SayamSolves",
    subtitle: "Algorithmic Problem Solving & LeetCode DSA Repository",
    shortDescription: "My personal open-source C++ repository documenting daily algorithmic problem solving across LeetCode.",
    longDescription: "A personal, open-source repository where I document my daily C++ practice on LeetCode and competitive programming platforms. Each solution includes asymptotic runtime benchmarks, space complexity notes, and edge-case reflections across arrays, strings, two-pointers, and recursion.",
    whyItExists: "I believe problem-solving skill comes from consistent, deliberate daily practice rather than rushing through tutorials. This repository keeps my progress accountable and transparent.",
    whatIBuilt: "Structured open-source repository featuring optimal C++ implementations of LeetCode problems with line-by-line algorithmic complexity annotations and systematic categorizations.",
    category: "Competitive Programming & DSA",
    categoryLabel: "Competitive Programming & DSA",
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
      phase: "ALGORITHMS",
      step: "02",
      period: "Ongoing Daily",
      focus: "Foundational algorithms, optimal data structures & C++"
    }
  },
  {
    id: "mausam",
    name: "MAUSAM",
    title: "MAUSAM",
    subtitle: "Smart Weather Intelligence Platform | SIH 2026",
    shortDescription: "A weather forecasting and climate telemetry dashboard built for Smart India Hackathon (SIH 2026) by Team Algnite.",
    longDescription: "Mausam was developed for the Smart India Hackathon (SIH 2026) by Team Algnite. It unifies weather forecasts, localized AQI metrics, UV levels, soil moisture estimates, and sea condition forecasts into a clean, accessible interface.",
    whyItExists: "Critical weather data is often spread across separate government portals. We built Mausam to pull essential climate telemetry, air quality alerts, and coastal tide estimates into one place for farmers, fishermen, and local residents.",
    whatIBuilt: "I built the responsive weather portal in React and TypeScript, connecting it to meteorological APIs and setting up localized alert thresholds for air quality, tides, and UV exposure.",
    category: "Weather & Geospatial Systems",
    categoryLabel: "Weather & Geospatial Systems",
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
      phase: "WEATHER & GEOSPATIAL",
      step: "03",
      period: "SIH 2026",
      focus: "High-scale meteorological aggregation & hackathon engineering"
    }
  },
  {
    id: "portfolio",
    name: "Sayam Mukherjee Interactive Portfolio",
    title: "Sayam Mukherjee Interactive Portfolio",
    subtitle: "Interactive Portfolio & Systems UI Architecture",
    shortDescription: "My personal developer portfolio built with React, TypeScript, and Tailwind CSS, featuring live GitHub synchronization.",
    longDescription: "My personal portfolio designed from scratch to show real codebases, verified GitHub activity, and documented engineering notes without relying on boilerplate templates or fake telemetry.",
    whyItExists: "I wanted a clear, fast, and authentic web presence that accurately reflects what I work on, what I study at KIIT, and what I build.",
    whatIBuilt: "Built the complete frontend using React, TypeScript, and Tailwind CSS, configured Vite build optimizations, and implemented client-side caching for GitHub API data.",
    category: "Personal Portfolio & Systems UI",
    categoryLabel: "Personal Portfolio & Systems UI",
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
    featured: true,
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
      step: "04",
      period: "Current Live",
      focus: "Production web architecture, live GitHub synchronization & clean UI"
    }
  },
  {
    id: "yolo",
    name: "YOLO / Edge Computer Vision",
    title: "YOLO / Edge Computer Vision",
    subtitle: "Real-Time Edge Object Detection & Motion Tracking Pipeline",
    shortDescription: "An edge computer vision pipeline pairing lightweight YOLOv8 models with OpenCV for real-time motion and object tracking.",
    longDescription: "A computer vision experiment combining compact YOLOv8 models with OpenCV frame processing to run directly on hardware. It computes bounding boxes, movement vectors, and trajectory estimates locally without relying on cloud servers.",
    whyItExists: "Sending video streams to the cloud introduces latency and bandwidth costs. Running inference locally on the device enables immediate tracking and keeps camera feeds private.",
    whatIBuilt: "I built a Python pipeline combining YOLOv8 inference with OpenCV frame processing to calculate object velocity vectors and track movement paths directly on local hardware.",
    category: "Edge Computer Vision & Tracking",
    categoryLabel: "Edge Computer Vision & Tracking",
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
    featured: true,
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
      phase: "EDGE AI & CV",
      step: "05",
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
