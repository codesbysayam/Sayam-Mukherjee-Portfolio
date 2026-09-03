export interface RealProject {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  longDescription: string;
  techStack: string[];
  tech?: string[];
  tags: string[];
  category: "fitness" | "finance" | "ai" | "web" | "systems" | string;
  categoryLabel: string;
  status: string;
  statusType: "active" | "completed" | "hackathon" | "live" | "opensource" | string;
  githubUrl?: string;
  liveUrl?: string;
  demoUrl?: string;
  featured: boolean;
  highlights: string[];
  features?: string[];
}

export const REAL_PROJECTS: RealProject[] = [
  {
    id: "fitness-os-pro",
    title: "Fitness OS Pro",
    description: "Comprehensive health, workout, and nutrition tracking system designed for progressive overload and personal fitness analytics.",
    shortDescription: "Personal health, workout, and progressive overload tracking platform.",
    longDescription: "Fitness OS Pro is a structured HealthTech tracking ecosystem engineered for active fitness practitioners. It focuses on workout session logging, volume progression, macronutrient tracking, and localized analytics without bloat. Built with a responsive, modern interface and disciplined architectural design.",
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "HealthTech"],
    category: "fitness",
    categoryLabel: "Health & Fitness",
    status: "In Active Development / Alpha",
    statusType: "active",
    featured: true,
    highlights: [
      "Progressive overload workout logging and volume analytics",
      "Macro and nutritional consumption calculators",
      "Offline-first client state and modular components"
    ]
  },
  {
    id: "finance-os-pro",
    title: "Finance OS Pro",
    description: "Financial analytics and portfolio tracking dashboard exploring stock market trends and technical indicators.",
    shortDescription: "Financial analytics dashboard tracking market indices and technical trends.",
    longDescription: "Finance OS Pro is an analytical financial dashboard designed for systematic portfolio review, market trend observation, and quantitative metric tracking. Explores technical indicator implementations and clean financial data visual representations.",
    techStack: ["React", "TypeScript", "Tailwind CSS", "Financial APIs"],
    tags: ["React", "TypeScript", "Tailwind CSS", "Fintech", "APIs"],
    category: "finance",
    categoryLabel: "Fintech & Markets",
    status: "In Active Development",
    statusType: "active",
    featured: true,
    highlights: [
      "Interactive technical charts and moving average overlays",
      "Asset allocation visualization and tracking",
      "Modern dark glassmorphism dashboard UI"
    ]
  },
  {
    id: "obsidian-optics",
    title: "Obsidian Optics",
    description: "Computer Vision edge-tracking system utilizing YOLOv8, OpenCV, and PyTorch for real-time motion and object analysis.",
    shortDescription: "Real-time edge computer vision tracking system using YOLOv8 & PyTorch.",
    longDescription: "Obsidian Optics is a computer vision research project implementing deep neural object detection pipelines on edge nodes. It integrates custom YOLOv8 model runs with OpenCV frame processing to analyze bounding vectors, trajectories, and object counts in real time.",
    techStack: ["Python", "YOLOv8", "OpenCV", "PyTorch", "React"],
    tags: ["Python", "YOLOv8", "OpenCV", "PyTorch", "Computer Vision"],
    category: "ai",
    categoryLabel: "Computer Vision / AI",
    status: "Completed / Research Project",
    statusType: "completed",
    githubUrl: "https://github.com/codesbysayam",
    featured: true,
    highlights: [
      "YOLOv8 real-time spatial object bounding and tracking",
      "OpenCV stream processing with vector coordinates",
      "Interactive web telemetry dashboard"
    ]
  },
  {
    id: "interactive-portfolio",
    title: "Interactive Portfolio",
    description: "Personal developer portfolio featuring liquid glass aesthetics, real telemetry integration, and responsive micro-interactions.",
    shortDescription: "Liquid glass portfolio with live GitHub & LeetCode telemetry.",
    longDescription: "An interactive, performant developer portfolio built with React, Vite, Express, and Tailwind CSS. Features live GitHub activity tracking, LeetCode profile metrics, and an editorial journal, while strictly presenting authentic, verified statistics.",
    techStack: ["React", "TypeScript", "Tailwind CSS", "Express", "Motion"],
    tags: ["React", "TypeScript", "Tailwind CSS", "Express", "Full Stack"],
    category: "web",
    categoryLabel: "Web Engineering",
    status: "Live",
    statusType: "live",
    githubUrl: "https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio",
    liveUrl: "https://sayammukherjee.in",
    featured: true,
    highlights: [
      "Live server-proxied telemetry from GitHub & LeetCode",
      "Apple-inspired dark liquid-glass aesthetics and micro-animations",
      "Modular full-stack architecture with server caching"
    ]
  },
  {
    id: "yolov8-edge-cv",
    title: "YOLOv8 Edge CV Motion Tracker",
    description: "Autonomous edge camera system detecting movement vectors and telemetry.",
    shortDescription: "Autonomous edge vision pipeline detecting motion vectors.",
    longDescription: "A focused edge camera pipeline combining YOLOv8 lightweight models with motion trajectory calculation. Designed to run on embedded hardware with limited compute overhead, producing bounding metadata for downstream analytical systems.",
    techStack: ["Python", "OpenCV", "YOLOv8"],
    tags: ["Python", "OpenCV", "YOLOv8", "Edge AI"],
    category: "ai",
    categoryLabel: "Edge AI / CV",
    status: "Open Source",
    statusType: "opensource",
    githubUrl: "https://github.com/codesbysayam",
    featured: false,
    highlights: [
      "Optimized lightweight YOLOv8 weights for low-power edge compute",
      "Motion trajectory logging and bounding box stabilization",
      "Open-source Python implementation"
    ]
  },
  {
    id: "operon",
    title: "OPERON",
    description: "Academic and systems level project exploring computational architecture and systems programming.",
    shortDescription: "Academic systems project exploring compute architecture.",
    longDescription: "Operon is an academic systems exploration hosted in a public GitHub repository. It investigates systems programming concepts, algorithmic routines, and structured data handling.",
    techStack: ["Python", "Systems"],
    tags: ["Python", "Systems", "Architecture"],
    category: "systems",
    categoryLabel: "Systems & Architecture",
    status: "Prototype / GitHub Repository",
    statusType: "opensource",
    githubUrl: "https://github.com/codesbysayam/Operon",
    featured: false,
    highlights: [
      "Structured system programming and algorithmic pipelines",
      "Academic research repository with modular architecture",
      "Publicly accessible source on GitHub"
    ]
  },
  {
    id: "mausam",
    title: "MAUSAM",
    description: "Smart India Hackathon (SIH 2026) Project. Weather forecasting and localized climate analytics dashboard.",
    shortDescription: "SIH 2026 weather forecasting and climate analytics dashboard.",
    longDescription: "Mausam is a comprehensive weather forecasting and localized climate dashboard developed as a submission for Smart India Hackathon (SIH 2026). It combines meteorological API data, localized sensor inputs, and predictive visualization layers into an intuitive user dashboard.",
    techStack: ["React", "Python", "Weather APIs", "TypeScript", "Tailwind CSS"],
    tags: ["React", "Python", "Weather APIs", "Hackathon", "SIH 2026"],
    category: "web",
    categoryLabel: "Hackathon / Web",
    status: "SIH 2026 Project / GitHub Repository",
    statusType: "hackathon",
    githubUrl: "https://github.com/codesbysayam/mausam",
    featured: true,
    highlights: [
      "Smart India Hackathon (SIH 2026) verified project",
      "Real-time meteorological data synthesis and climate visualization",
      "Interactive modern UI with responsive forecasting charts"
    ]
  }
];

export type VerifiedProject = RealProject;
export const VERIFIED_PROJECTS = REAL_PROJECTS;

