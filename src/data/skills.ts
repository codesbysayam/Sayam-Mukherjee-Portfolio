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
    evidenceSummary: "Used in SightForge FastAPI + YOLOv8 pipeline, MAUSAM climate utilities, and Memory in Motion supporting scripts.",
    relatedProjects: ["sightforge", "mausam", "memory-in-motion"],
    repoEvidence: "Core implementation language for SightForge YOLOv8 + ByteTrack inference and MAUSAM environmental scripts.",
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
    evidenceSummary: "Used across OPERON, MAUSAM (mausam_sample), SightForge, Memory in Motion, AXIOM, Inkloom, and CampusConnect.",
    relatedProjects: ["operon", "mausam", "sightforge", "memory-in-motion", "axiom", "inkloom", "campus-connect"],
    repoEvidence: "Verified repository JavaScript codebase bytes across MAUSAM (65.9 KB), Inkloom (12.7 KB), SightForge, and web builds.",
    description: "Modern ECMAScript (ES2023+), asynchronous event loop programming, DOM manipulation, and Node.js server runtimes.",
    relatedSkills: ["TypeScript", "React", "Next.js", "Node.js"],
    docsUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript"
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "language",
    status: "building",
    evidenceType: "repository",
    evidenceSummary: "Dominant codebase language (~93.6% / 10.67 MB verified across all 7 full-stack GitHub web repositories).",
    relatedProjects: ["mausam", "memory-in-motion", "operon", "axiom", "sightforge", "inkloom", "campus-connect"],
    repoEvidence: "Verified across MAUSAM (5.14 MB), Memory in Motion (1.71 MB), OPERON (936.6 KB), AXIOM (793.5 KB), SightForge (252.1 KB), and CampusConnect (210.5 KB).",
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
    evidenceSummary: "Semantic markup, 16:9 Canvas host containers, and metadata tagging across verified web projects.",
    relatedProjects: ["mausam", "memory-in-motion", "axiom", "operon", "campus-connect"],
    repoEvidence: "Verified across MAUSAM, Memory in Motion, AXIOM, OPERON, and CampusConnect repositories.",
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
    evidenceSummary: "Custom responsive styling, modern layout grids, flexbox, and editorial token design systems.",
    relatedProjects: ["axiom", "mausam", "memory-in-motion", "inkloom", "campus-connect", "operon", "sightforge"],
    repoEvidence: "Verified across AXIOM (61.2 KB), MAUSAM (50.0 KB), Memory in Motion (29.7 KB), CampusConnect (9.7 KB), and OPERON (8.8 KB).",
    description: "Modern CSS3 specifications, CSS custom properties, responsive typography with clamp(), and smooth animation transitions.",
    relatedSkills: ["Tailwind CSS", "Bootstrap", "HTML"],
    docsUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS"
  },
  {
    id: "sql",
    name: "SQL / PostgreSQL",
    category: "language",
    status: "practicing",
    evidenceType: "project",
    evidenceSummary: "PostgreSQL / PLpgSQL schemas utilized in SightForge CV telemetry, MAUSAM geospatial storage, and Inkloom.",
    relatedProjects: ["sightforge", "mausam", "inkloom", "operon"],
    repoEvidence: "Verified PLpgSQL schemas in codesbysayam/mausam_sample and codesbysayam/inkloom plus PostgreSQL persistence in SightForge.",
    description: "Relational database query language for structured filtering, multi-table joins, indexing, and transactional persistence.",
    relatedSkills: ["PostgreSQL", "FastAPI", "System Architecture"],
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
    evidenceSummary: "Core UI foundation across MAUSAM, OPERON, SightForge (React 19), Memory in Motion, AXIOM, Inkloom, and CampusConnect.",
    relatedProjects: ["operon", "mausam", "sightforge", "memory-in-motion", "axiom", "inkloom", "campus-connect"],
    repoEvidence: "Component architectures, custom hooks, Canvas sync, and state management verified across public repositories.",
    description: "Declarative component-based UI engineering, custom hooks, virtual DOM optimization, and reactive application lifecycles.",
    relatedSkills: ["Next.js", "TypeScript", "Tailwind CSS", "JavaScript"],
    docsUrl: "https://react.dev/"
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "frontend",
    status: "building",
    evidenceType: "project",
    evidenceSummary: "Used in SightForge (Next.js 15 / React 19 Canvas client) and CampusConnect App Router event platform.",
    relatedProjects: ["sightforge", "campus-connect"],
    repoEvidence: "Verified App Router application structure and frontend services in SightForge and CAMPUSCONNECT_1273.",
    description: "Production React framework for App Router full-stack routing, server components, and responsive web applications.",
    relatedSkills: ["React", "TypeScript", "Node.js", "Vitest"],
    docsUrl: "https://nextjs.org/"
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "frontend",
    status: "building",
    evidenceType: "project",
    evidenceSummary: "Utility-first design system used across OPERON, MAUSAM, Memory in Motion, and CampusConnect.",
    relatedProjects: ["operon", "mausam", "memory-in-motion", "campus-connect"],
    repoEvidence: "Configured via Tailwind utility pipelines across verified Vercel production deployments.",
    description: "Modern utility-first CSS framework enabling rapid, highly-maintainable, and responsive interface implementations.",
    relatedSkills: ["CSS", "React", "HTML"],
    docsUrl: "https://tailwindcss.com/"
  },
  {
    id: "katex",
    name: "KaTeX & D3.js",
    category: "frontend",
    status: "building",
    evidenceType: "project",
    evidenceSummary: "Powers live mathematical notation and O(1) vs O(T) SVG/D3 memory visualizations in Memory in Motion.",
    relatedProjects: ["memory-in-motion"],
    repoEvidence: "Verified in codesbysayam/Memory-in-Motion built for DataForge 2026 at IIT Kharagpur.",
    description: "Browser-native math typesetting and data-driven SVG visualization for interactive scientific simulations.",
    relatedSkills: ["TypeScript", "React", "Python"],
    docsUrl: "https://katex.org/"
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
  // BACKEND & DATA
  // ==========================================
  {
    id: "nodejs",
    name: "Node.js",
    category: "backend",
    status: "building",
    evidenceType: "project",
    evidenceSummary: "Backend server runtimes, REST APIs, and multi-agent dispatch orchestration in OPERON.",
    relatedProjects: ["operon", "campus-connect"],
    repoEvidence: "Node.js server architecture powering API dispatch routes, state machines, and HITL gates.",
    description: "Asynchronous, event-driven JavaScript runtime for scalable network applications, server-side APIs, and build tooling.",
    relatedSkills: ["Express.js", "TypeScript", "JavaScript", "Next.js"],
    docsUrl: "https://nodejs.org/"
  },
  {
    id: "fastapi",
    name: "FastAPI",
    category: "backend",
    status: "building",
    evidenceType: "project",
    evidenceSummary: "High-throughput Python CV inference service in SightForge orchestrating YOLOv8 detection, pose estimation, and ByteTrack.",
    relatedProjects: ["sightforge"],
    repoEvidence: "Verified FastAPI backend in codesbysayam/SightForge (Python 149.6 KB) serving atomic CVFrame telemetry.",
    description: "Modern asynchronous Python web framework for low-latency REST endpoints and ML inference microservices.",
    relatedSkills: ["Python", "YOLO", "PostgreSQL", "Next.js"],
    docsUrl: "https://fastapi.tiangolo.com/"
  },
  {
    id: "express",
    name: "Express.js",
    category: "backend",
    status: "building",
    evidenceType: "project",
    evidenceSummary: "Engineered server endpoints, agent routing middleware, and HITL approval gates in OPERON.",
    relatedProjects: ["operon"],
    repoEvidence: "Express router configurations and approval state handlers in codesbysayam/Operon.",
    description: "Minimalist and flexible Node.js web application framework providing robust routing and middleware capabilities.",
    relatedSkills: ["Node.js", "TypeScript", "API Integration"],
    docsUrl: "https://expressjs.com/"
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "data",
    status: "building",
    evidenceType: "project",
    evidenceSummary: "Persistent CV telemetry storage in SightForge plus PLpgSQL schemas in MAUSAM and Inkloom.",
    relatedProjects: ["sightforge", "mausam", "inkloom"],
    repoEvidence: "Verified PostgreSQL integration in SightForge and PLpgSQL modules in mausam_sample & inkloom.",
    description: "Enterprise relational database engine with PL/pgSQL stored procedures, strict schemas, and indexed telemetry persistence.",
    relatedSkills: ["SQL / PostgreSQL", "FastAPI", "Docker"],
    docsUrl: "https://www.postgresql.org/"
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
    relatedSkills: ["Node.js", "SQL / PostgreSQL", "System Architecture"],
    docsUrl: "https://www.mongodb.com/"
  },
  {
    id: "firebase",
    name: "Firebase",
    category: "data",
    status: "practicing",
    evidenceType: "profile",
    evidenceSummary: "Firestore real-time document stores and cloud application patterns.",
    relatedProjects: ["axiom"],
    repoEvidence: "Cloud backend concepts and structured security rule design for client apps.",
    description: "Cloud backend platform providing real-time document database (Firestore), user authentication, and serverless hosting.",
    relatedSkills: ["MongoDB", "React"],
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
    evidenceType: "project",
    evidenceSummary: "B.Tech CSE (AI & ML) academic focus, O(1) vs O(T) sequence modeling (Memory in Motion), and SightForge vision inference.",
    relatedProjects: ["sightforge", "memory-in-motion"],
    repoEvidence: "Verified implementations in codesbysayam/SightForge and IIT KGP DataForge entry codesbysayam/Memory-in-Motion.",
    description: "Mathematical foundations of supervised learning, associative memory fast weights, and model evaluation metrics.",
    relatedSkills: ["Deep Learning", "Python", "PyTorch", "YOLO"],
    docsUrl: "https://scikit-learn.org/"
  },
  {
    id: "deeplearning",
    name: "Deep Learning",
    category: "ai-ml",
    status: "learning",
    evidenceType: "project",
    evidenceSummary: "CNNs for SightForge YOLOv8 detection/pose plus Hebbian fast-weight and Dragon Hatchling (BDH) studies.",
    relatedProjects: ["sightforge", "memory-in-motion"],
    repoEvidence: "Explored in Memory-in-Motion interactive interpretability modules and SightForge inference pipeline.",
    description: "Multi-layer artificial neural networks, tensor calculations, fast-weight plasticity, and spatial feature representations.",
    relatedSkills: ["PyTorch", "Computer Vision", "Machine Learning"],
    docsUrl: "https://www.deeplearning.ai/"
  },
  {
    id: "computervision",
    name: "Computer Vision",
    category: "ai-ml",
    status: "building",
    evidenceType: "project",
    evidenceSummary: "Real-time YOLOv8 COCO Class ID 0 person detection, 17-keypoint pose, IoU 0.45 NMS, and ByteTrack in SightForge.",
    relatedProjects: ["sightforge"],
    repoEvidence: "Verified in codesbysayam/SightForge with atomic CVFrame updates rendered on a 16:9 HTML5 Canvas.",
    description: "Visual computing algorithms including single-stage object detection, keypoint pose regression, NMS, and multi-object tracking.",
    relatedSkills: ["YOLO", "ByteTrack", "Python", "FastAPI"],
    docsUrl: "https://opencv.org/"
  },
  {
    id: "bytetrack",
    name: "ByteTrack",
    category: "ai-ml",
    status: "building",
    evidenceType: "project",
    evidenceSummary: "Persistent multi-frame identity association across low and high-confidence YOLOv8 detections in SightForge.",
    relatedProjects: ["sightforge"],
    evidenceProjects: ["sightforge"],
    repoEvidence: "Integrated into SightForge's FastAPI inference backend with PostgreSQL track telemetry.",
    description: "High-accuracy multi-object tracking algorithm preserving persistent subject track IDs across occlusions.",
    relatedSkills: ["Computer Vision", "YOLO", "FastAPI"],
    docsUrl: "https://github.com/ifzhang/ByteTrack"
  },
  {
    id: "yolo",
    name: "YOLO",
    category: "ai-ml",
    status: "building",
    evidenceType: "project",
    evidenceSummary: "YOLOv8 Person (COCO Class ID 0) and Pose (17 COCO keypoints) + NMS IoU 0.45 pipeline in SightForge.",
    relatedProjects: ["sightforge"],
    repoEvidence: "Dual-service inference weights and frame serialization verified in codesbysayam/SightForge.",
    description: "State-of-the-art single-stage real-time object detection and pose estimation architecture.",
    relatedSkills: ["Computer Vision", "ByteTrack", "Python", "PyTorch"],
    docsUrl: "https://github.com/ultralytics/ultralytics"
  },
  {
    id: "pytorch",
    name: "PyTorch",
    category: "ai-ml",
    status: "practicing",
    evidenceType: "project",
    evidenceSummary: "Tensor execution backing YOLOv8 inference models in SightForge and deep learning coursework.",
    relatedProjects: ["sightforge", "memory-in-motion"],
    repoEvidence: "Underlying tensor runtime executing SightForge detection and skeletal pose extraction.",
    description: "Open-source machine learning framework providing GPU-accelerated tensor computations and neural network execution.",
    relatedSkills: ["Machine Learning", "Deep Learning", "Python"],
    docsUrl: "https://pytorch.org/"
  },

  // ==========================================
  // TOOLS & DEPLOYMENT
  // ==========================================
  {
    id: "git",
    name: "Git",
    category: "tool",
    status: "building",
    evidenceType: "repository",
    evidenceSummary: "Version control, main/master branch workflows, and atomic commits across all 8 verified projects.",
    relatedProjects: ["operon", "mausam", "sightforge", "memory-in-motion", "axiom", "inkloom", "campus-connect", "sayam-solves"],
    repoEvidence: "Documented commit history and branch management across all 8 verified projects.",
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
    evidenceSummary: "Host for 11 public repositories on @codesbysayam (8 core project/algorithm repos + supporting meta repos).",
    relatedProjects: ["operon", "mausam", "sightforge", "memory-in-motion", "axiom", "inkloom", "campus-connect", "sayam-solves"],
    repoEvidence: "Public profile @codesbysayam with 11 public repositories (5 stars) and verified commit history.",
    description: "Cloud-hosted software collaboration platform for git repositories, project boards, and release artifact distributions.",
    relatedSkills: ["Git", "VS Code", "Vercel"],
    docsUrl: "https://github.com/codesbysayam"
  },
  {
    id: "vitest",
    name: "Vitest",
    category: "tool",
    status: "building",
    evidenceType: "project",
    evidenceSummary: "Automated unit and state transition test suite verifying CampusConnect registration & organizer flows.",
    relatedProjects: ["campus-connect"],
    repoEvidence: "Verified Vitest configuration and automated specs inside codesbysayam/CAMPUSCONNECT_1273.",
    description: "Vite-native fast test framework for validating TypeScript logic, React hooks, and application state contracts.",
    relatedSkills: ["TypeScript", "Next.js", "React"],
    docsUrl: "https://vitest.dev/"
  },
  {
    id: "docker",
    name: "Docker",
    category: "tool",
    status: "practicing",
    evidenceType: "project",
    evidenceSummary: "Containerized workspace definitions verified in Inkloom (public fork) and local SightForge orchestration.",
    relatedProjects: ["inkloom", "sightforge"],
    repoEvidence: "Dockerfile configuration in codesbysayam/inkloom and containerizable Makefile flows in SightForge.",
    description: "Container runtime packaging reproducible application dependencies and database services.",
    relatedSkills: ["PostgreSQL", "FastAPI", "Git"],
    docsUrl: "https://www.docker.com/"
  },
  {
    id: "vscode",
    name: "VS Code",
    category: "tool",
    status: "building",
    evidenceType: "profile",
    evidenceSummary: "Primary IDE configured with TypeScript language server, Python/FastAPI debugging, and C++ toolchains.",
    relatedProjects: ["operon", "mausam", "sightforge", "memory-in-motion", "axiom", "inkloom", "campus-connect", "sayam-solves"],
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
    relatedProjects: ["mausam", "memory-in-motion", "axiom"],
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
    relatedProjects: ["mausam", "operon"],
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
    evidenceSummary: "Edge hosting for OPERON (operonpro), MAUSAM (mausamgovt), Memory in Motion, AXIOM, and CampusConnect.",
    relatedProjects: ["operon", "mausam", "memory-in-motion", "axiom", "campus-connect"],
    repoEvidence: "Five verified production Vercel deployments linked directly to public GitHub repositories.",
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
    status: "building",
    evidenceType: "project",
    evidenceSummary: "HITL multi-agent orchestration (OPERON), deterministic policy control planes (AXIOM), and dual-service CV streaming (SightForge).",
    relatedProjects: ["operon", "axiom", "sightforge"],
    repoEvidence: "Verified across codesbysayam/Operon, codesbysayam/AXIOM, and codesbysayam/SightForge.",
    description: "High-level structuring of software systems: separating interface, service layers, state persistence, and communication protocols.",
    relatedSkills: ["Node.js", "Next.js", "FastAPI", "Express.js"],
    docsUrl: "https://github.com/codesbysayam/Operon"
  },
  {
    id: "apiintegration",
    name: "API Integration",
    category: "engineering",
    status: "building",
    evidenceType: "project",
    evidenceSummary: "Meteorological feeds in MAUSAM, FastAPI CV payloads in SightForge, and REST dispatch endpoints in OPERON.",
    relatedProjects: ["mausam", "sightforge", "operon", "axiom"],
    repoEvidence: "Production API handlers with typed schema contracts, fallback caching, and atomic frame streaming.",
    description: "Architecting resilient client-server integrations with REST APIs, handling error cascades, timeouts, and state synchronization.",
    relatedSkills: ["TypeScript", "FastAPI", "Node.js", "Express.js"],
    docsUrl: "https://developer.mozilla.org/en-US/docs/Web/API"
  },
  {
    id: "responsiveweb",
    name: "Responsive Web Development",
    category: "engineering",
    status: "building",
    evidenceType: "project",
    evidenceSummary: "Fluid grid systems, clamp() typography, and accessible layouts across MAUSAM, Memory in Motion, AXIOM, OPERON & CampusConnect.",
    relatedProjects: ["mausam", "memory-in-motion", "axiom", "operon", "campus-connect"],
    repoEvidence: "Production Tailwind CSS pipelines, mobile navigation, and responsive visualization containers.",
    description: "Engineering fluid, device-agnostic user interfaces adhering to WCAG AA accessibility, touch ergonomics, and responsive layout math.",
    relatedSkills: ["React", "Next.js", "Tailwind CSS", "CSS"],
    docsUrl: "https://web.dev/responsive-web-design-basics/"
  },
  {
    id: "versioncontrol",
    name: "Version Control",
    category: "engineering",
    status: "building",
    evidenceType: "repository",
    evidenceSummary: "Branching strategies (main & master fork maintenance), atomic commits, and repository lifecycle hygiene.",
    relatedProjects: ["operon", "mausam", "sightforge", "memory-in-motion", "axiom", "inkloom", "campus-connect", "sayam-solves"],
    repoEvidence: "Continuous git commit history and repository management across all 8 verified projects.",
    description: "Disciplined version control workflows utilizing Git and GitHub for history tracking, release tags, and collaborative code hygiene.",
    relatedSkills: ["Git", "GitHub"],
    docsUrl: "https://git-scm.com/book/en/v2"
  }
];

/**
 * Genuine learning and development roadmap areas.
 * Focused on deliberate practice without artificial completion metrics.
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
    skills: ["TypeScript", "Python", "C++", "JavaScript", "C", "Java", "SQL / PLpgSQL", "HTML", "CSS"]
  },
  {
    id: "frontend",
    category: "FRONTEND",
    label: "Frontend",
    description: "Component frameworks, scientific visualization libraries, and responsive design systems.",
    skills: ["React", "Next.js 15", "Tailwind CSS", "KaTeX", "D3.js", "HTML5 Canvas", "Bootstrap"]
  },
  {
    id: "backend-data",
    category: "BACKEND & DATA",
    label: "Backend & Data",
    description: "Server-side runtimes, async Python APIs, relational persistence, and state stores.",
    skills: ["Node.js", "FastAPI", "Express.js", "PostgreSQL", "MongoDB", "Firebase"]
  },
  {
    id: "ai-ml",
    category: "AI / MACHINE LEARNING",
    label: "AI / Machine Learning",
    description: "Computer vision detection & pose tracking, multi-agent systems, and mechanistic interpretability.",
    skills: ["YOLOv8", "ByteTrack", "Multi-Agent HITL", "PyTorch", "Machine Learning", "Deep Learning"]
  },
  {
    id: "tools",
    category: "TOOLS",
    label: "Tools & DevOps",
    description: "Version control, automated testing, containerization, design tooling, and edge deployment.",
    skills: ["Git", "GitHub", "Vitest", "Docker", "VS Code", "Figma", "Vercel"]
  },
  {
    id: "core-engineering",
    category: "CORE ENGINEERING",
    label: "Core Engineering",
    description: "Foundational computer science principles, policy governance, complexity bounds, and API integration.",
    skills: ["Data Structures & Algorithms", "Control Planes & Audit", "API Integration", "Responsive Development", "Version Control", "System Architecture"]
  }
];
