import { VALID_PROJECT_IDS, ValidProjectId } from "./projects";

export type SkillCategory =
  | "language"
  | "frontend"
  | "backend"
  | "ai-ml"
  | "data"
  | "tool"
  | "engineering";

export type SkillEvidenceType =
  | "project"
  | "repository"
  | "profile"
  | "learning";

export type SkillStatus =
  | "building"
  | "practicing"
  | "learning"
  | "exploring";

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  status: SkillStatus;
  evidenceType: SkillEvidenceType;
  evidenceSummary: string;
  relatedProjects: ValidProjectId[];
  evidenceProjects?: ValidProjectId[];
  repoEvidence?: string;
  description: string;
  relatedSkills: string[];
  docsUrl?: string;
}

export interface LearningItem {
  id: string;
  title: string;
  domain: string;
  topics: string[];
  status: SkillStatus;
  statusLabel: string;
  context: string;
}

/**
 * Single source of truth for Sayam Mukherjee's verified engineering skills.
 * Strictly adheres to verified evidence: no fabricated proficiency percentages,
 * no invented years of experience, and no fake expert rankings.
 */
export const SKILLS_DATA: SkillItem[] = [
  // ==========================================
  // LANGUAGES (9 verified)
  // ==========================================
  {
    id: "python",
    name: "Python",
    category: "language",
    status: "building",
    evidenceType: "project",
    evidenceSummary: "Used in YOLO edge computer-vision pipeline, AI/ML experimentation, and SIH weather intelligence algorithms.",
    relatedProjects: ["yolo", "mausam"],
    repoEvidence: "Core implementation language for OpenCV detection and meteorological data parsing.",
    description: "Primary language for computer vision, scientific computing, script automation, and machine learning pipelines.",
    relatedSkills: ["Computer Vision", "PyTorch", "YOLO", "Machine Learning"],
    docsUrl: "https://www.python.org/"
  },
  {
    id: "java",
    name: "Java",
    category: "language",
    status: "practicing",
    evidenceType: "profile",
    evidenceSummary: "Academic coursework at KIIT University (B.Tech CSE) and object-oriented systems design practice.",
    relatedProjects: [],
    repoEvidence: "Academic computer science curriculum and object-oriented programming foundations.",
    description: "Strong foundation in object-oriented programming (OOP), multithreading principles, and JVM data structures.",
    relatedSkills: ["DSA", "Algorithms", "Problem Solving"],
    docsUrl: "https://dev.java/"
  },
  {
    id: "c",
    name: "C",
    category: "language",
    status: "practicing",
    evidenceType: "repository",
    evidenceSummary: "Systems programming fundamentals, memory management, pointers, and low-level data structures.",
    relatedProjects: ["sayam-solves"],
    repoEvidence: "Foundational data structures and memory manipulation practice in academic and algorithmic exercises.",
    description: "Low-level procedural programming focusing on pointer arithmetic, dynamic memory allocation, and CPU architecture mechanics.",
    relatedSkills: ["C++", "DSA", "Algorithms"],
    docsUrl: "https://en.cppreference.com/w/c"
  },
  {
    id: "cpp",
    name: "C++",
    category: "language",
    status: "practicing",
    evidenceType: "repository",
    evidenceSummary: "Used in SayamSolves repository for daily LeetCode algorithmic challenges and STL data structure implementations.",
    relatedProjects: ["sayam-solves"],
    repoEvidence: "Active C++ repository 'sayam-solves' with daily algorithmic commits, STL vector/map usage, and runtime optimization.",
    description: "Standard language for algorithmic problem solving, competitive programming, and high-performance computation using STL.",
    relatedSkills: ["DSA", "Algorithms", "Problem Solving", "C"],
    docsUrl: "https://isocpp.org/"
  },
  {
    id: "javascript",
    name: "JavaScript",
    category: "language",
    status: "building",
    evidenceType: "project",
    evidenceSummary: "Full-stack development across Operon, Portfolio, and interactive web client architectures.",
    relatedProjects: ["operon", "portfolio", "mausam"],
    repoEvidence: "Verified repository codebase bytes across Operon and interactive web applications.",
    description: "Modern ECMAScript (ES2023+), asynchronous event loop programming, DOM manipulation, and Node.js server runtimes.",
    relatedSkills: ["TypeScript", "React", "Node.js", "Express.js"],
    docsUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript"
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "language",
    status: "building",
    evidenceType: "repository",
    evidenceSummary: "Dominant codebase language (>97% verified GitHub repository bytes across MAUSAM, Operon, and Portfolio).",
    relatedProjects: ["mausam", "portfolio", "operon"],
    repoEvidence: "Verified in MAUSAM (3.29 MB), Portfolio (716 KB), and Operon (620 KB) repository language statistics.",
    description: "Strict static typing, complex interface hierarchies, generics, and compiler configurations for enterprise web applications.",
    relatedSkills: ["JavaScript", "React", "Next.js", "Node.js"],
    docsUrl: "https://www.typescriptlang.org/"
  },
  {
    id: "html",
    name: "HTML",
    category: "language",
    status: "building",
    evidenceType: "repository",
    evidenceSummary: "Semantic markup, accessible DOM hierarchies, and metadata tagging across all web projects.",
    relatedProjects: ["portfolio", "mausam", "operon"],
    repoEvidence: "Verified across all web repositories for markup structure and responsive layout semantics.",
    description: "Semantic HTML5, ARIA accessibility attributes, web standards, and high-fidelity markup structures.",
    relatedSkills: ["CSS", "React", "Tailwind CSS"],
    docsUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML"
  },
  {
    id: "css",
    name: "CSS",
    category: "language",
    status: "building",
    evidenceType: "repository",
    evidenceSummary: "Custom responsive styling, modern layout grids, flexbox, and liquid glass design systems.",
    relatedProjects: ["portfolio", "mausam", "operon"],
    repoEvidence: "Verified across Portfolio (34 KB), MAUSAM (22 KB), and Operon (11 KB) repository byte statistics.",
    description: "Modern CSS3 specifications, CSS custom properties, responsive typography with clamp(), and smooth animation transitions.",
    relatedSkills: ["Tailwind CSS", "Bootstrap", "HTML"],
    docsUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS"
  },
  {
    id: "sql",
    name: "SQL",
    category: "language",
    status: "practicing",
    evidenceType: "profile",
    evidenceSummary: "Relational database queries, schema design, joins, normalization, and ACID transaction concepts.",
    relatedProjects: ["operon"],
    repoEvidence: "Academic coursework at KIIT and backend persistence architecture explorations for enterprise workflows.",
    description: "Relational database query language for structured filtering, multi-table joins, aggregation, and relational schema optimization.",
    relatedSkills: ["MongoDB", "Backend", "System Architecture"],
    docsUrl: "https://www.postgresql.org/docs/"
  },

  // ==========================================
  // FRONTEND (6 verified)
  // ==========================================
  {
    id: "react",
    name: "React",
    category: "frontend",
    status: "building",
    evidenceType: "project",
    evidenceSummary: "Used as core frontend foundation in MAUSAM (SIH 2026), Operon, and interactive portfolio architecture.",
    relatedProjects: ["mausam", "portfolio", "operon"],
    repoEvidence: "Component architectures, custom hooks, and state management verified across public repositories.",
    description: "Declarative component-based UI engineering, custom hooks, virtual DOM optimization, and reactive application lifecycles.",
    relatedSkills: ["Next.js", "TypeScript", "Tailwind CSS", "JavaScript"],
    docsUrl: "https://react.dev/"
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "frontend",
    status: "learning",
    evidenceType: "learning",
    evidenceSummary: "Exploration of server components, App Router, SSR/SSG rendering patterns, and API routes.",
    relatedProjects: [],
    repoEvidence: "Active study area for scalable full-stack web architectures and edge rendering.",
    description: "Production React framework for server-side rendering, static site generation, and optimized full-stack routing.",
    relatedSkills: ["React", "TypeScript", "Node.js"],
    docsUrl: "https://nextjs.org/"
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "frontend",
    status: "building",
    evidenceType: "project",
    evidenceSummary: "Primary utility-first design system across Portfolio, MAUSAM, and Operon with custom theme tokens.",
    relatedProjects: ["portfolio", "mausam", "operon"],
    repoEvidence: "Configured via Tailwind plugins and CSS utility pipelines across all verified web projects.",
    description: "Modern utility-first CSS framework enabling rapid, highly-maintainable, and responsive interface implementations.",
    relatedSkills: ["CSS", "React", "HTML"],
    docsUrl: "https://tailwindcss.com/"
  },
  {
    id: "bootstrap",
    name: "Bootstrap",
    category: "frontend",
    status: "practicing",
    evidenceType: "profile",
    evidenceSummary: "Grid layouts, foundational responsive styling, and UI component prototyping.",
    relatedProjects: [],
    repoEvidence: "Foundational web development practice and component layout experience.",
    description: "Classic responsive 12-column grid system, utility classes, and prebuilt interface component styling.",
    relatedSkills: ["CSS", "HTML", "Tailwind CSS"],
    docsUrl: "https://getbootstrap.com/"
  },

  // ==========================================
  // BACKEND & DATA (4 verified)
  // ==========================================
  {
    id: "nodejs",
    name: "Node.js",
    category: "backend",
    status: "building",
    evidenceType: "project",
    evidenceSummary: "Backend server runtimes, REST APIs, and asynchronous event orchestration in Operon and Portfolio server.",
    relatedProjects: ["operon", "portfolio"],
    repoEvidence: "Node.js server architecture powering API proxy routes, caching mechanisms, and micro-services.",
    description: "Asynchronous, event-driven JavaScript runtime for scalable network applications, server-side APIs, and build tooling.",
    relatedSkills: ["Express.js", "TypeScript", "JavaScript", "MongoDB"],
    docsUrl: "https://nodejs.org/"
  },
  {
    id: "express",
    name: "Express.js",
    category: "backend",
    status: "building",
    evidenceType: "project",
    evidenceSummary: "Engineered server endpoints, middleware pipelines, and API proxies in Operon and Portfolio.",
    relatedProjects: ["operon", "portfolio"],
    repoEvidence: "Express router configurations, rate-limiting, and middleware layers in server.ts and Operon backend.",
    description: "Minimalist and flexible Node.js web application framework providing robust routing and middleware capabilities.",
    relatedSkills: ["Node.js", "TypeScript", "REST APIs"],
    docsUrl: "https://expressjs.com/"
  },
  {
    id: "mongodb",
    name: "MongoDB",
    category: "data",
    status: "practicing",
    evidenceType: "project",
    evidenceSummary: "Document storage modeling, collections, JSON schema flexibility, and query operators.",
    relatedProjects: ["operon"],
    repoEvidence: "Document schema structures explored for autonomous workflow execution state logs.",
    description: "NoSQL document database engineered for horizontal scaling, flexible JSON-like schemas, and fast querying.",
    relatedSkills: ["Node.js", "SQL", "Backend"],
    docsUrl: "https://www.mongodb.com/"
  },
  {
    id: "firebase",
    name: "Firebase",
    category: "data",
    status: "building",
    evidenceType: "project",
    evidenceSummary: "Firestore real-time document stores, client-side authentication, and cloud event hosting integration.",
    relatedProjects: ["portfolio"],
    repoEvidence: "Realtime data persistence and authentication client integration in modern web applications.",
    description: "Cloud backend platform providing real-time document database (Firestore), user authentication, and serverless hosting.",
    relatedSkills: ["MongoDB", "Backend", "React"],
    docsUrl: "https://firebase.google.com/"
  },

  // ==========================================
  // AI & ML (5 verified)
  // ==========================================
  {
    id: "ml",
    name: "Machine Learning",
    category: "ai-ml",
    status: "learning",
    evidenceType: "learning",
    evidenceSummary: "B.Tech CSE (AI & ML) academic focus, model training fundamentals, feature engineering, and statistical learning.",
    relatedProjects: ["yolo"],
    repoEvidence: "Academic and personal laboratory experiments with algorithmic classifiers, regressions, and evaluation metrics.",
    description: "Mathematical foundations of supervised and unsupervised learning, model evaluation, cross-validation, and feature pipelines.",
    relatedSkills: ["Deep Learning", "Python", "PyTorch"],
    docsUrl: "https://scikit-learn.org/"
  },
  {
    id: "deeplearning",
    name: "Deep Learning",
    category: "ai-ml",
    status: "learning",
    evidenceType: "learning",
    evidenceSummary: "Neural network architectures, forward/backward propagation, activation functions, and gradient descent optimization.",
    relatedProjects: ["yolo"],
    repoEvidence: "Explorations of convolutional neural networks (CNNs) for visual spatial analysis and object classification.",
    description: "Multi-layer artificial neural networks, tensor calculations, backpropagation mechanics, and deep feature representations.",
    relatedSkills: ["PyTorch", "Computer Vision", "Machine Learning"],
    docsUrl: "https://www.deeplearning.ai/"
  },
  {
    id: "computervision",
    name: "Computer Vision",
    category: "ai-ml",
    status: "building",
    evidenceType: "project",
    evidenceSummary: "Applied edge spatial tracking, OpenCV frame processing, bounding box calculations, and image transformations.",
    relatedProjects: ["yolo"],
    repoEvidence: "Real-time edge camera pipeline with OpenCV and YOLO bounding box rendering.",
    description: "Visual computing algorithms including optical transformations, edge filtering, spatial zone tracking, and real-time camera inference.",
    relatedSkills: ["YOLO", "Python", "PyTorch"],
    docsUrl: "https://opencv.org/"
  },
  {
    id: "opencv",
    name: "OpenCV",
    category: "ai-ml",
    status: "building",
    evidenceType: "project",
    evidenceSummary: "Edge camera stream decoding, frame transformation, bounding box rendering, and spatial movement tracking.",
    relatedProjects: ["yolo"],
    evidenceProjects: ["yolo"],
    repoEvidence: "Real-time edge camera pipeline with OpenCV stream transformations and coordinate bounding renders.",
    description: "Open-source computer vision library for image manipulation, matrix operations, and real-time visual streaming.",
    relatedSkills: ["Computer Vision", "Python", "YOLO"],
    docsUrl: "https://opencv.org/"
  },
  {
    id: "yolo",
    name: "YOLO",
    category: "ai-ml",
    status: "building",
    evidenceType: "project",
    evidenceSummary: "Lightweight YOLOv8 model deployment for real-time edge detection and spatial boundary surveillance.",
    relatedProjects: ["yolo"],
    repoEvidence: "YOLOv8 weights loading, inference execution, and spatial coordinate telemetry.",
    description: "State-of-the-art single-stage real-time object detection architecture optimized for low-latency visual inference.",
    relatedSkills: ["Computer Vision", "Python", "PyTorch"],
    docsUrl: "https://github.com/ultralytics/ultralytics"
  },
  {
    id: "pytorch",
    name: "PyTorch",
    category: "ai-ml",
    status: "practicing",
    evidenceType: "learning",
    evidenceSummary: "Tensor manipulation, autograd computation graphs, and neural network module architectures.",
    relatedProjects: ["yolo"],
    repoEvidence: "Model inference execution and tensor processing for computer-vision experimentation.",
    description: "Open-source machine learning framework providing GPU-accelerated tensor computations and flexible dynamic neural network design.",
    relatedSkills: ["Machine Learning", "Deep Learning", "Python"],
    docsUrl: "https://pytorch.org/"
  },

  // ==========================================
  // TOOLS & DEPLOYMENT (6 verified)
  // ==========================================
  {
    id: "git",
    name: "Git",
    category: "tool",
    status: "building",
    evidenceType: "repository",
    evidenceSummary: "Daily version control, branch management, clean commit history, and merge conflict resolution across all repositories.",
    relatedProjects: ["operon", "sayam-solves", "mausam", "portfolio", "yolo"],
    repoEvidence: "Documented commit history and branch management across all 5 verified projects.",
    description: "Distributed version control system for tracking code changes, branching strategies, and collaborative code reviews.",
    relatedSkills: ["GitHub", "VS Code"],
    docsUrl: "https://git-scm.com/"
  },
  {
    id: "github",
    name: "GitHub",
    category: "tool",
    status: "building",
    evidenceType: "repository",
    evidenceSummary: "Host for verified public repositories (OPERON, SAYAMSOLVES, MAUSAM, PORTFOLIO), issue tracking, and releases.",
    relatedProjects: ["operon", "sayam-solves", "mausam", "portfolio", "yolo"],
    repoEvidence: "Public profile @codesbysayam with 4 public repositories and verified commit history.",
    description: "Cloud-hosted software collaboration platform for git repositories, project boards, and release artifact distributions.",
    relatedSkills: ["Git", "VS Code", "Vercel"],
    docsUrl: "https://github.com/codesbysayam"
  },
  {
    id: "vscode",
    name: "VS Code",
    category: "tool",
    status: "building",
    evidenceType: "profile",
    evidenceSummary: "Primary integrated development environment configured with TypeScript language server, ESLint, and Python virtual environments.",
    relatedProjects: ["operon", "sayam-solves", "mausam", "portfolio", "yolo"],
    repoEvidence: "Primary IDE for daily engineering practice, debugging, and full-stack development.",
    description: "Extensible code editor with native TypeScript support, integrated terminal debugging, and extensions workflow.",
    relatedSkills: ["Git", "GitHub"],
    docsUrl: "https://code.visualstudio.com/"
  },
  {
    id: "figma",
    name: "Figma",
    category: "tool",
    status: "practicing",
    evidenceType: "profile",
    evidenceSummary: "Interface wireframing, layout spacing models, design tokens, and user flow architectures.",
    relatedProjects: ["portfolio", "mausam"],
    repoEvidence: "UI wireframes, typography pairings, and layout blueprints guiding frontend implementation.",
    description: "Collaborative interface design tool for vector wireframing, component design systems, and responsive layout prototyping.",
    relatedSkills: ["Canva", "Tailwind CSS"],
    docsUrl: "https://www.figma.com/"
  },
  {
    id: "canva",
    name: "Canva",
    category: "tool",
    status: "practicing",
    evidenceType: "profile",
    evidenceSummary: "Visual asset generation, hackathon presentation decks, diagrams, and branding materials.",
    relatedProjects: ["portfolio"],
    repoEvidence: "Visual assets and technical presentation design for hackathon showcases.",
    description: "Graphic design platform utilized for rapid technical illustrations, social graphics, and pitch deck presentations.",
    relatedSkills: ["Figma"],
    docsUrl: "https://www.canva.com/"
  },
  {
    id: "vercel",
    name: "Vercel",
    category: "tool",
    status: "building",
    evidenceType: "project",
    evidenceSummary: "Deployment platform hosting live production releases of MAUSAM (mausamgovt.vercel.app) and Operon (operonpro.vercel.app).",
    relatedProjects: ["mausam", "operon", "portfolio"],
    repoEvidence: "Live deployments configured with CI/CD triggers on git push events.",
    description: "Cloud platform for serverless frontend and full-stack application hosting with automatic git continuous deployment.",
    relatedSkills: ["GitHub", "React", "Next.js"],
    docsUrl: "https://vercel.com/"
  },

  // ==========================================
  // CORE ENGINEERING (4 verified)
  // ==========================================
  {
    id: "dsa",
    name: "DSA",
    category: "engineering",
    status: "practicing",
    evidenceType: "repository",
    evidenceSummary: "Data Structures & Algorithms practiced via LeetCode and archived in SayamSolves repository.",
    relatedProjects: ["sayam-solves"],
    repoEvidence: "Active 'sayam-solves' repository containing structured LeetCode problem solutions with space-time complexity analysis.",
    description: "Foundational data structures (arrays, linked lists, stacks, queues, hash maps, binary trees) and their operational invariants.",
    relatedSkills: ["Algorithms", "Problem Solving", "C++"],
    docsUrl: "https://github.com/codesbysayam/sayam-solves"
  },
  {
    id: "algorithms",
    name: "Algorithms",
    category: "engineering",
    status: "practicing",
    evidenceType: "repository",
    evidenceSummary: "Algorithmic patterns including binary search, two-pointer techniques, recursion, sorting, and traversal.",
    relatedProjects: ["sayam-solves"],
    repoEvidence: "C++ algorithmic implementations covering asymptotic complexity analysis (Big-O notation).",
    description: "Step-by-step computational procedures analyzed for time and space asymptotic performance bounds.",
    relatedSkills: ["DSA", "Problem Solving", "C++"],
    docsUrl: "https://github.com/codesbysayam/sayam-solves"
  },
  {
    id: "problemsolving",
    name: "Problem Solving",
    category: "engineering",
    status: "practicing",
    evidenceType: "repository",
    evidenceSummary: "Disciplined daily coding practice breaking down complex constraints into testable edge cases.",
    relatedProjects: ["sayam-solves"],
    repoEvidence: "Documented commit history on SayamSolves practicing deliberate algorithmic thinking.",
    description: "Analytical methodology for dissecting ambiguous engineering problems, designing invariants, and validating corner cases.",
    relatedSkills: ["DSA", "Algorithms", "C++"],
    docsUrl: "https://leetcode.com/u/codesbysayam/"
  },
  {
    id: "systemarchitecture",
    name: "System Architecture",
    category: "engineering",
    status: "learning",
    evidenceType: "project",
    evidenceSummary: "Multi-agent orchestration state machines in Operon and modular full-stack client-server separation.",
    relatedProjects: ["operon"],
    repoEvidence: "Operon multi-agent architecture separating agent decision checkpoints, state storage, and governance APIs.",
    description: "High-level structuring of software systems: separating interface, service layers, state persistence, and communication protocols.",
    relatedSkills: ["Node.js", "React", "Express.js"],
    docsUrl: "https://github.com/codesbysayam/Operon"
  },
  {
    id: "apiintegration",
    name: "API Integration",
    category: "engineering",
    status: "building",
    evidenceType: "project",
    evidenceSummary: "Integration of IMD Meteorological APIs in MAUSAM, GitHub REST API in portfolio, and REST endpoints in Operon.",
    relatedProjects: ["mausam", "portfolio", "operon"],
    repoEvidence: "Production API handlers with graceful fallback caching, rate-limiting handlers, and type-safe payload parsers.",
    description: "Architecting resilient client-server integrations with REST APIs, handling error cascades, timeouts, and state synchronization.",
    relatedSkills: ["TypeScript", "Node.js", "Express.js"],
    docsUrl: "https://developer.mozilla.org/en-US/docs/Web/API"
  },
  {
    id: "responsiveweb",
    name: "Responsive Web Development",
    category: "engineering",
    status: "building",
    evidenceType: "project",
    evidenceSummary: "Fluid grid systems, clamp() typography, mobile-first layouts, and zero-layout-shift design in MAUSAM and portfolio.",
    relatedProjects: ["portfolio", "mausam", "operon"],
    repoEvidence: "Production CSS media queries, Tailwind utility pipelines, and touch-accessible mobile navigation.",
    description: "Engineering fluid, device-agnostic user interfaces adhering to WCAG AA accessibility, touch ergonomics, and responsive layout math.",
    relatedSkills: ["React", "Tailwind CSS", "CSS"],
    docsUrl: "https://web.dev/responsive-web-design-basics/"
  },
  {
    id: "versioncontrol",
    name: "Version Control",
    category: "engineering",
    status: "building",
    evidenceType: "repository",
    evidenceSummary: "Branching strategies, semantic atomic commits, pull requests, and repository lifecycle management.",
    relatedProjects: ["operon", "sayam-solves", "mausam", "portfolio", "yolo"],
    repoEvidence: "Continuous git commit history and repository management across 5 verified projects.",
    description: "Disciplined version control workflows utilizing Git and GitHub for history tracking, release tags, and collaborative code hygiene.",
    relatedSkills: ["Git", "GitHub"],
    docsUrl: "https://git-scm.com/book/en/v2"
  }
];

/**
 * Genuine learning and development roadmap areas.
 * Real active learning focus — NO fake percentage completions.
 */
export const CURRENTLY_DEVELOPING: LearningItem[] = [
  {
    id: "adv-dsa",
    title: "Advanced DSA",
    domain: "Core Computer Science",
    topics: ["Dynamic Programming", "Graph Traversal (BFS / DFS)", "Shortest Path Algorithms", "Disjoint Set Union (DSU)"],
    status: "practicing",
    statusLabel: "PRACTICING",
    context: "Systematic deep-dive into complex algorithmic patterns via C++ and LeetCode, focusing on optimal recurrence relations."
  },
  {
    id: "ai-ml-depth",
    title: "AI / ML Foundations",
    domain: "Artificial Intelligence",
    topics: ["Model Architecture Understanding", "Feature Transformation", "Computer Vision Pipelines", "Loss Function Optimization"],
    status: "exploring",
    statusLabel: "EXPLORING",
    context: "Deepening mathematical foundations of convolution operations, feature maps, and spatial tracking models."
  },
  {
    id: "react-arch",
    title: "React Architecture",
    domain: "Frontend Systems",
    topics: ["Advanced State Management", "Custom Hook Patterns", "Performance Profiling", "Render Tree Optimization"],
    status: "building",
    statusLabel: "BUILDING",
    context: "Refining modular enterprise component hierarchies, accessibility compliance, and zero-layout-shift UI engineering."
  },
  {
    id: "system-design",
    title: "System Architecture",
    domain: "Software Engineering",
    topics: ["Scalable Software Design", "Asynchronous Event Loops", "API Gateway Patterns", "State Machine Governance"],
    status: "learning",
    statusLabel: "LEARNING",
    context: "Studying distributed system invariants, caching strategies, and resilient human-in-the-loop workflows."
  }
];

export const CURRENTLY_LEARNING = CURRENTLY_DEVELOPING;

/**
 * Engineering Toolchain stages mapping genuine tools to workflow phases
 */
export const ENGINEERING_TOOLCHAIN = [
  {
    step: "01",
    phase: "IDEATION & RESEARCH",
    tools: ["Figma", "Canva", "Technical Documentation"],
    description: "Deconstructing problem requirements, researching algorithmic constraints, and sketching interface wireframes.",
    icon: "Lightbulb"
  },
  {
    step: "02",
    phase: "INTERFACE & ARCHITECTURE DESIGN",
    tools: ["Figma", "Tailwind CSS Tokens", "Design System Spacing"],
    description: "Establishing mathematically sound typography scales, liquid glass color palettes, and responsive layout grids.",
    icon: "Layout"
  },
  {
    step: "03",
    phase: "ENGINEERING & DEVELOPMENT",
    tools: ["VS Code", "TypeScript", "React", "Python", "C++"],
    description: "Writing clean, type-safe implementations, optimizing data structures, and building modular component trees.",
    icon: "Code2"
  },
  {
    step: "04",
    phase: "VERSION CONTROL & INTEGRATION",
    tools: ["Git", "GitHub (@codesbysayam)", "CI Triggers"],
    description: "Atomic commit history, branch reviews, issue tracking, and repository documentation.",
    icon: "GitBranch"
  },
  {
    step: "05",
    phase: "DEPLOYMENT & OBSERVABILITY",
    tools: ["Vercel", "Express Server Proxy", "Cloud Run"],
    description: "Serving production builds with server-side caching, edge delivery, and verified live telemetry.",
    icon: "Rocket"
  }
];

/**
 * Categories list with verified count helper
 */
export const CATEGORY_LABELS: { key: SkillCategory | "all"; label: string }[] = [
  { key: "all", label: "ALL" },
  { key: "language", label: "LANGUAGES" },
  { key: "frontend", label: "FRONTEND" },
  { key: "backend", label: "BACKEND" },
  { key: "ai-ml", label: "AI / ML" },
  { key: "data", label: "DATA" },
  { key: "tool", label: "TOOLS" },
  { key: "engineering", label: "ENGINEERING" }
];

export type SkillFilterKey =
  | "all"
  | "languages"
  | "frontend"
  | "backend-data"
  | "ai-ml"
  | "tools-devops"
  | "core-engineering";

export interface SkillFilterTab {
  key: SkillFilterKey;
  label: string;
  categoryMatch: (cat: SkillCategory) => boolean;
}

export const SKILL_FILTER_TABS: SkillFilterTab[] = [
  { key: "all", label: "All", categoryMatch: () => true },
  { key: "languages", label: "Languages", categoryMatch: (cat) => cat === "language" },
  { key: "frontend", label: "Frontend", categoryMatch: (cat) => cat === "frontend" },
  { key: "backend-data", label: "Backend & Data", categoryMatch: (cat) => cat === "backend" || cat === "data" },
  { key: "ai-ml", label: "AI / ML", categoryMatch: (cat) => cat === "ai-ml" },
  { key: "tools-devops", label: "Tools & DevOps", categoryMatch: (cat) => cat === "tool" },
  { key: "core-engineering", label: "Core Engineering", categoryMatch: (cat) => cat === "engineering" },
];

export function filterSkills(filterKey: SkillFilterKey, searchQuery = ""): SkillItem[] {
  const tab = SKILL_FILTER_TABS.find((t) => t.key === filterKey) || SKILL_FILTER_TABS[0];
  const query = searchQuery.trim().toLowerCase();

  return SKILLS_DATA.filter((skill) => {
    const matchesCategory = tab.categoryMatch(skill.category);
    if (!matchesCategory) return false;
    if (!query) return true;

    return (
      skill.name.toLowerCase().includes(query) ||
      skill.category.toLowerCase().includes(query) ||
      skill.description.toLowerCase().includes(query) ||
      skill.evidenceSummary.toLowerCase().includes(query) ||
      skill.relatedSkills.some((s) => s.toLowerCase().includes(query))
    );
  });
}

export function getSkillsByCategory(cat: SkillCategory | "all"): SkillItem[] {
  if (cat === "all") return SKILLS_DATA;
  return SKILLS_DATA.filter((s) => s.category === cat);
}

export function getSkillById(id: string): SkillItem | undefined {
  return SKILLS_DATA.find((s) => s.id.toLowerCase() === id.toLowerCase());
}

export interface EngineeringStackGroup {
  id: string;
  category: string;
  label: string;
  description: string;
  skills: string[];
}

/**
 * Verified Engineering Stack divided into the 6 verified core categories.
 * Strict: These are technologies and foundational tools, NOT unverified proficiency claims.
 */
export const ENGINEERING_STACK_CATEGORIES: EngineeringStackGroup[] = [
  {
    id: "languages",
    category: "LANGUAGES",
    label: "Languages",
    description: "Core programming languages for algorithmic problem-solving, systems development, and full-stack software.",
    skills: ["Python", "Java", "JavaScript", "TypeScript", "C++", "HTML", "CSS"]
  },
  {
    id: "frontend",
    category: "FRONTEND",
    label: "Frontend",
    description: "Component frameworks, type systems, and responsive design systems for accessible web applications.",
    skills: ["React", "TypeScript", "Tailwind CSS", "Bootstrap"]
  },
  {
    id: "backend-data",
    category: "BACKEND & DATA",
    label: "Backend & Data",
    description: "Server-side runtimes, RESTful routing, document persistence, and cloud event stores.",
    skills: ["Node.js", "Express.js", "MongoDB", "Firebase"]
  },
  {
    id: "ai-ml",
    category: "AI / MACHINE LEARNING",
    label: "AI / Machine Learning",
    description: "Neural models, computer vision pipelines, real-time object detection, and edge inference.",
    skills: ["Machine Learning", "Deep Learning", "Computer Vision", "YOLO / YOLOv8", "PyTorch", "OpenCV"]
  },
  {
    id: "tools",
    category: "TOOLS",
    label: "Tools",
    description: "Version control, code editing environments, interface design tooling, and production deployment networks.",
    skills: ["Git", "GitHub", "VS Code", "Figma", "Canva", "Vercel"]
  },
  {
    id: "core-engineering",
    category: "CORE ENGINEERING",
    label: "Core Engineering",
    description: "Foundational software principles, complexity bounds, API contract integration, and system architecture.",
    skills: ["Data Structures & Algorithms", "API Integration", "Responsive Development", "Version Control", "System Architecture"]
  }
];
