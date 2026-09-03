import { useState, useEffect, useRef, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, Tooltip 
} from "recharts";
import { 
  Code, Server, Database, Brain, Terminal, Heart, Sparkles, 
  Layers, Settings, Laptop, ArrowRight, UserCheck, Eye, HelpCircle,
  Search, ZoomIn, ZoomOut, RotateCcw, Compass, ArrowUpRight, GitFork, Award, Zap, Maximize2, Activity, PieChart
} from "lucide-react";
import GitHubActivityHeatmap, { MiniActivityHeatmap } from "./GitHubActivityHeatmap";
import LanguageRingChart from "./LanguageRingChart";

interface SkillNode {
  id: string;
  label: string;
  level: number;
  type: "root" | "hub" | "skill";
  category: "core" | "languages" | "frontend" | "backend" | "ai" | "tools" | "soft";
  icon: string;
  years: string;
  exp: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  x: number;
  y: number;
  desc: string;
}

interface SkillEdge {
  source: string;
  target: string;
  type: "structural" | "dependency";
}

function SkillsSection() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("root");
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"inspect" | "radar" | "languages" | "heatmap">("inspect");
  const [highlightMode, setHighlightMode] = useState<"all" | "dependencies">("all");

  // Pan & Zoom state
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.95);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgContainerRef = useRef<HTMLDivElement>(null);

  // Trigger brief node animation when query changes
  const [searchMatches, setSearchMatches] = useState<string[]>([]);

  const skillNodes: SkillNode[] = [
    {
      id: "root",
      label: "SAYAM'S SYSTEM CORE",
      level: 98,
      type: "root",
      category: "core",
      icon: "⚡",
      years: "3+ Years",
      exp: "Expert",
      x: 500,
      y: 300,
      desc: "The central processing hub coordinating all modern computational, deep learning, and engineering modules."
    },
    // Hubs
    {
      id: "languages_hub",
      label: "Languages Hub",
      level: 85,
      type: "hub",
      category: "languages",
      icon: "💻",
      years: "2.5 Years",
      exp: "Advanced",
      x: 320,
      y: 180,
      desc: "Syntax layers for systemic scripts, memory optimization, and functional software engineering."
    },
    {
      id: "frontend_hub",
      label: "Frontend Hub",
      level: 89,
      type: "hub",
      category: "frontend",
      icon: "🎨",
      years: "3 Years",
      exp: "Expert",
      x: 500,
      y: 110,
      desc: "User-facing view architectures, fluid motions, state pipelines, and responsive design systems."
    },
    {
      id: "backend_hub",
      label: "Backend Hub",
      level: 84,
      type: "hub",
      category: "backend",
      icon: "⚙️",
      years: "2 Years",
      exp: "Advanced",
      x: 680,
      y: 180,
      desc: "Server structures, secure REST APIs, persistent caching, database indexes, and cloud environments."
    },
    {
      id: "ai_hub",
      label: "AI & ML Hub",
      level: 82,
      type: "hub",
      category: "ai",
      icon: "🧠",
      years: "1.5 Years",
      exp: "Advanced",
      x: 680,
      y: 420,
      desc: "Deep Neural Networks, mathematical regressions, vector spaces, and analytical model runtimes."
    },
    {
      id: "tools_hub",
      label: "Tools & DevOps Hub",
      level: 88,
      type: "hub",
      category: "tools",
      icon: "🛠️",
      years: "3 Years",
      exp: "Expert",
      x: 500,
      y: 490,
      desc: "Continuous integration, source versioning, visual UI design tools, and telemetry analytics."
    },
    {
      id: "soft_hub",
      label: "Human Systems Hub",
      level: 88,
      type: "hub",
      category: "soft",
      icon: "🤝",
      years: "Lifetime",
      exp: "Expert",
      x: 320,
      y: 420,
      desc: "Core cognitive capabilities, team synergy, system diagnostics, and communication channels."
    },
    // Sub-skills for Languages
    {
      id: "python",
      label: "Python",
      level: 90,
      type: "skill",
      category: "languages",
      icon: "🐍",
      years: "2.5 Years",
      exp: "Advanced",
      x: 170,
      y: 110,
      desc: "Primary language for analytical workflows, scripting automations, and training neural net weights."
    },
    {
      id: "javascript",
      label: "JavaScript",
      level: 85,
      type: "skill",
      category: "languages",
      icon: "🟨",
      years: "2 Years",
      exp: "Advanced",
      x: 180,
      y: 220,
      desc: "Dynamic scripting for client behavior, asynchronous logic loops, and interactive web elements."
    },
    {
      id: "typescript",
      label: "TypeScript",
      level: 80,
      type: "skill",
      category: "languages",
      icon: "🟦",
      years: "1.5 Years",
      exp: "Intermediate",
      x: 310,
      y: 70,
      desc: "Strong static typing compiled to JavaScript, providing strict system contracts and self-documenting APIs."
    },
    {
      id: "java",
      label: "Java",
      level: 75,
      type: "skill",
      category: "languages",
      icon: "☕",
      years: "2 Years",
      exp: "Intermediate",
      x: 160,
      y: 170,
      desc: "Object-oriented software development, robust compiler safety, and platform-independent services."
    },
    {
      id: "cpp",
      label: "C++",
      level: 75,
      type: "skill",
      category: "languages",
      icon: "🛠️",
      years: "1.5 Years",
      exp: "Intermediate",
      x: 270,
      y: 280,
      desc: "High-performance systems programming, manual memory management, and computational efficiency."
    },
    // Sub-skills for Frontend
    {
      id: "react",
      label: "React",
      level: 85,
      type: "skill",
      category: "frontend",
      icon: "⚛️",
      years: "2 Years",
      exp: "Advanced",
      x: 440,
      y: 40,
      desc: "Component-driven rendering, client-side state caching, and responsive reactive lifecycles."
    },
    {
      id: "nextjs",
      label: "Next.js",
      level: 70,
      type: "skill",
      category: "frontend",
      icon: "🚀",
      years: "1 Year",
      exp: "Intermediate",
      x: 560,
      y: 40,
      desc: "Server-side rendering, folder-based layout routing, and static generation optimizations."
    },
    {
      id: "tailwind",
      label: "Tailwind CSS",
      level: 95,
      type: "skill",
      category: "frontend",
      icon: "💧",
      years: "2 Years",
      exp: "Expert",
      x: 500,
      y: 30,
      desc: "Utility-first design layers, high-performance compilation, and responsive media interfaces."
    },
    {
      id: "html_css",
      label: "HTML & CSS",
      level: 93,
      type: "skill",
      category: "frontend",
      icon: "🌐",
      years: "3 Years",
      exp: "Expert",
      x: 370,
      y: 100,
      desc: "Semantic webpage layout, accessibility specifications, and pixel-perfect rendering controls."
    },
    // Sub-skills for Backend
    {
      id: "nodejs",
      label: "Node.js",
      level: 80,
      type: "skill",
      category: "backend",
      icon: "🟢",
      years: "1.5 Years",
      exp: "Advanced",
      x: 830,
      y: 110,
      desc: "Server runtime environment enabling high-throughput backend services and non-blocking I/O queues."
    },
    {
      id: "express",
      label: "Express.js",
      level: 85,
      type: "skill",
      category: "backend",
      icon: "🛤️",
      years: "1.5 Years",
      exp: "Advanced",
      x: 840,
      y: 180,
      desc: "Minimalist server route handler routing network requests and managing custom API middleware chains."
    },
    {
      id: "mongodb",
      label: "MongoDB",
      level: 80,
      type: "skill",
      category: "backend",
      icon: "🍃",
      years: "1.5 Years",
      exp: "Intermediate",
      x: 830,
      y: 250,
      desc: "Document-oriented NoSQL database for unstructured JSON schemas, dynamic collections, and rapid scaling."
    },
    {
      id: "firebase",
      label: "Firebase",
      level: 85,
      type: "skill",
      category: "backend",
      icon: "🔥",
      years: "1.5 Years",
      exp: "Advanced",
      x: 740,
      y: 280,
      desc: "Suite of serverless technologies providing synchronized databases, authentications, and secure storage."
    },
    // Sub-skills for AI & ML
    {
      id: "ml",
      label: "Machine Learning",
      level: 80,
      type: "skill",
      category: "ai",
      icon: "🧠",
      years: "1.5 Years",
      exp: "Advanced",
      x: 830,
      y: 390,
      desc: "Constructing regression curves, decision trees, cluster categorizations, and descriptive data fits."
    },
    {
      id: "dl",
      label: "Deep Learning",
      level: 75,
      type: "skill",
      category: "ai",
      icon: "🧬",
      years: "1 Year",
      exp: "Intermediate",
      x: 810,
      y: 470,
      desc: "Building artificial neural nets, backpropagating loss weights, and structuring dense visual layers."
    },
    {
      id: "numpy_pandas",
      label: "NumPy & Pandas",
      level: 85,
      type: "skill",
      category: "ai",
      icon: "🐼",
      years: "1.5 Years",
      exp: "Advanced",
      x: 640,
      y: 510,
      desc: "Mathematical array vectors, data manipulation frames, mathematical operations, and clean dataset loaders."
    },
    // Sub-skills for Tools
    {
      id: "git_github",
      label: "Git & GitHub",
      level: 90,
      type: "skill",
      category: "tools",
      icon: "🐙",
      years: "2 Years",
      exp: "Expert",
      x: 390,
      y: 510,
      desc: "Distributed revision controls, concurrent feature branching, pull request auditing, and action workflows."
    },
    {
      id: "vercel",
      label: "Vercel",
      level: 85,
      type: "skill",
      category: "tools",
      icon: "🔺",
      years: "1.5 Years",
      exp: "Advanced",
      x: 500,
      y: 570,
      desc: "Deploying applications directly from source repositories with instant edge network caching and continuous rollouts."
    },
    {
      id: "figma",
      label: "Figma",
      level: 80,
      type: "skill",
      category: "tools",
      icon: "📐",
      years: "1.5 Years",
      exp: "Advanced",
      x: 590,
      y: 510,
      desc: "Vector ui design mockups, wireframing, layout components, interactive prototypes, and design systems."
    },
    // Sub-skills for Soft Skills
    {
      id: "problem_solving",
      label: "Problem Solving",
      level: 90,
      type: "skill",
      category: "soft",
      icon: "🧩",
      years: "Lifetime",
      exp: "Expert",
      x: 180,
      y: 390,
      desc: "Methodical systemic diagnostics, tracking stacktraces, analyzing complexity bounds, and elegant solutions."
    },
    {
      id: "communication",
      label: "Communication",
      level: 92,
      type: "skill",
      category: "soft",
      icon: "💬",
      years: "Lifetime",
      exp: "Expert",
      x: 230,
      y: 470,
      desc: "Articulating complex computational topics to multi-disciplinary teams with crisp clarity and structured insights."
    }
  ];

  const skillEdges: SkillEdge[] = [
    // Core to Hubs
    { source: "root", target: "languages_hub", type: "structural" },
    { source: "root", target: "frontend_hub", type: "structural" },
    { source: "root", target: "backend_hub", type: "structural" },
    { source: "root", target: "ai_hub", type: "structural" },
    { source: "root", target: "tools_hub", type: "structural" },
    { source: "root", target: "soft_hub", type: "structural" },

    // Languages Hub to its sub-skills
    { source: "languages_hub", target: "python", type: "structural" },
    { source: "languages_hub", target: "javascript", type: "structural" },
    { source: "languages_hub", target: "typescript", type: "structural" },
    { source: "languages_hub", target: "java", type: "structural" },
    { source: "languages_hub", target: "cpp", type: "structural" },

    // Frontend Hub to its sub-skills
    { source: "frontend_hub", target: "react", type: "structural" },
    { source: "frontend_hub", target: "nextjs", type: "structural" },
    { source: "frontend_hub", target: "tailwind", type: "structural" },
    { source: "frontend_hub", target: "html_css", type: "structural" },

    // Backend Hub to its sub-skills
    { source: "backend_hub", target: "nodejs", type: "structural" },
    { source: "backend_hub", target: "express", type: "structural" },
    { source: "backend_hub", target: "mongodb", type: "structural" },
    { source: "backend_hub", target: "firebase", type: "structural" },

    // AI Hub to its sub-skills
    { source: "ai_hub", target: "ml", type: "structural" },
    { source: "ai_hub", target: "dl", type: "structural" },
    { source: "ai_hub", target: "numpy_pandas", type: "structural" },

    // Tools Hub to its sub-skills
    { source: "tools_hub", target: "git_github", type: "structural" },
    { source: "tools_hub", target: "vercel", type: "structural" },
    { source: "tools_hub", target: "figma", type: "structural" },

    // Soft Hub to its sub-skills
    { source: "soft_hub", target: "problem_solving", type: "structural" },
    { source: "soft_hub", target: "communication", type: "structural" },

    // Operational/Learning Interdependencies (glowing overlay paths)
    { source: "javascript", target: "react", type: "dependency" },
    { source: "typescript", target: "react", type: "dependency" },
    { source: "react", target: "nextjs", type: "dependency" },
    { source: "html_css", target: "tailwind", type: "dependency" },
    { source: "javascript", target: "nodejs", type: "dependency" },
    { source: "nodejs", target: "express", type: "dependency" },
    { source: "express", target: "mongodb", type: "dependency" },
    { source: "python", target: "ml", type: "dependency" },
    { source: "ml", target: "dl", type: "dependency" },
    { source: "python", target: "numpy_pandas", type: "dependency" },
    { source: "git_github", target: "vercel", type: "dependency" },
    { source: "figma", target: "html_css", type: "dependency" }
  ];

  // Dynamic filter matches
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchMatches([]);
      return;
    }
    const matches = skillNodes
      .filter(n => n.label.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(n => n.id);
    setSearchMatches(matches);
  }, [searchQuery]);

  // Handle Drag / Pan events on background
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left-click
    const target = e.target as HTMLElement;
    // Don't drag if user clicked on node groups or controls
    if (target.closest(".node-element-group") || target.closest(".svg-controls-panel")) {
      return;
    }
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setPan({ x: 0, y: 0 });
    setZoom(0.95);
  };

  // Node helper: trace if a node or edge is active
  const selectedNode = skillNodes.find(n => n.id === selectedNodeId) || skillNodes[0];

  // Map dependencies
  const incomingDependencies = skillEdges
    .filter(e => e.target === selectedNodeId && e.type === "dependency")
    .map(e => skillNodes.find(n => n.id === e.source))
    .filter((n): n is SkillNode => !!n);

  const outgoingDependencies = skillEdges
    .filter(e => e.source === selectedNodeId && e.type === "dependency")
    .map(e => skillNodes.find(n => n.id === e.target))
    .filter((n): n is SkillNode => !!n);

  // Checks if node has a connection to the selected node
  const isNodeConnected = (nodeId: string) => {
    if (nodeId === selectedNodeId) return true;
    
    // Find matching edge
    return skillEdges.some(e => {
      const matchesEdge = (e.source === selectedNodeId && e.target === nodeId) ||
                          (e.target === selectedNodeId && e.source === nodeId);
      
      if (!matchesEdge) return false;
      if (highlightMode === "dependencies") {
        return e.type === "dependency";
      }
      return true;
    });
  };

  // Check if edge is active (connected to current selection)
  const isEdgeActive = (edge: SkillEdge) => {
    const isRelated = edge.source === selectedNodeId || edge.target === selectedNodeId;
    if (!isRelated) return false;
    
    if (highlightMode === "dependencies" && edge.type !== "dependency") {
      return false;
    }
    return true;
  };

  // Radial map stats for overall profile
  const overallProfileData = [
    { subject: "Languages", A: 84, B: 100 },
    { subject: "Frontend Dev", A: 89, B: 100 },
    { subject: "Backend & DB", A: 83, B: 100 },
    { subject: "AI & ML", A: 82, B: 100 },
    { subject: "Tools & Deploy", A: 87, B: 100 },
    { subject: "Human Systems", A: 91, B: 100 }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "core": return "text-purple-400 border-purple-500/30 bg-purple-950/20";
      case "languages": return "text-amber-400 border-amber-500/30 bg-amber-950/20";
      case "frontend": return "text-cyan-400 border-cyan-500/30 bg-cyan-950/20";
      case "backend": return "text-green-400 border-green-500/30 bg-green-950/20";
      case "ai": return "text-pink-400 border-pink-500/30 bg-pink-950/20";
      case "tools": return "text-indigo-400 border-indigo-500/30 bg-indigo-950/20";
      case "soft": return "text-teal-400 border-teal-500/30 bg-teal-950/20";
      default: return "text-zinc-400 border-zinc-800 bg-zinc-900/20";
    }
  };

  return (
    <div className="relative font-sans space-y-10">
      {/* Background glow matrix */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-8">
        <div>
          <span className="text-xs text-cyan-400 font-mono uppercase tracking-[0.2em] font-bold block">
            CONSTELLATION INDEX v2.8
          </span>
          <h2 
            style={{ fontSize: "clamp(1.5rem, 3.2vw, 3rem)" }} 
            className="font-bold tracking-tight text-white font-display mt-1"
          >
            Capabilities Tree Mesh
          </h2>
        </div>
        <p className="text-xs text-zinc-400 max-w-sm md:text-right font-mono leading-relaxed">
          Interactive SVG network tree visualizing core languages, runtime architectures, artificial neural stacks, and interdependency pathways.
        </p>
      </div>

      {/* SEARCH AND CONTROLS ROW */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4.5 glass-card rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search node systems (e.g. TypeScript, React)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-950/60 border border-zinc-900 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")} 
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-[11px] font-mono"
            >
              CLEAR
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Highlight toggle */}
          <div className="flex items-center gap-1.5 bg-zinc-950/80 p-1 border border-zinc-900 rounded-xl">
            <button
              onClick={() => setHighlightMode("all")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                highlightMode === "all" ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              All Links
            </button>
            <button
              onClick={() => setHighlightMode("dependencies")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                highlightMode === "dependencies" ? "bg-zinc-900 text-purple-400" : "text-zinc-500 hover:text-zinc-300"
              }`}
              title="Show only causal technology prerequisite pipelines"
            >
              Prerequisites Only
            </button>
          </div>

          {/* Quick instructions indicator */}
          <span className="hidden lg:inline text-[10px] text-zinc-500 font-mono">
            💡 Drag canvas to pan • Click nodes to inspect
          </span>
        </div>
      </div>

      {/* CORE BENTO SYSTEM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* SVG Skill Tree Canvas Container */}
        <div className="lg:col-span-8 flex flex-col glass-card rounded-3xl overflow-hidden min-h-[500px] lg:min-h-[580px] relative">
          
          {/* Holographic Header Bar */}
          <div className="absolute top-0 left-0 right-0 p-4.5 bg-zinc-950/60 border-b border-white/[0.03] backdrop-blur-md flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase">System Mapping Radar</span>
            </div>
            
            {/* Viewport Control Actions */}
            <div className="flex items-center gap-1.5 svg-controls-panel">
              <button 
                onClick={() => setZoom(z => Math.min(z + 0.1, 1.8))}
                className="p-1.5 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-850 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setZoom(z => Math.max(z - 0.1, 0.4))}
                className="p-1.5 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-850 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={resetView}
                className="p-1.5 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-850 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive SVG Canvas Area */}
          <div 
            ref={svgContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`flex-1 w-full relative bg-[#010103] cursor-grab ${isDragging ? "cursor-grabbing" : ""}`}
            style={{ touchAction: "none" }}
          >
            {/* Ambient vignette shading overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/20 via-transparent to-zinc-950/60 pointer-events-none" />
            
            <svg 
              className="w-full h-full select-none"
              viewBox="0 0 1000 620"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* SVG Definitions for Gradients and Markers */}
              <defs>
                {/* Flow paths glow gradients */}
                <linearGradient id="selectedGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.8" />
                </linearGradient>

                <linearGradient id="dependencyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.6" />
                </linearGradient>

                {/* Marker Arrows for dependency directions */}
                <marker
                  id="arrow-active"
                  viewBox="0 0 10 10"
                  refX="22"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#22d3ee" />
                </marker>

                <marker
                  id="arrow-inactive"
                  viewBox="0 0 10 10"
                  refX="22"
                  refY="5"
                  markerWidth="4"
                  markerHeight="4"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#27272a" />
                </marker>
              </defs>

              {/* Dynamic Coordinate Group for Pan & Zoom */}
              <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} style={{ transition: isDragging ? "none" : "transform 0.15s cubic-bezier(0.1, 0.8, 0.2, 1)" }}>
                
                {/* Base Grid Pattern */}
                <g className="opacity-20 pointer-events-none">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <line 
                      key={`v-${i}`} 
                      x1={i * 40} y1={0} 
                      x2={i * 40} y2={700} 
                      stroke="#27272a" 
                      strokeWidth="0.5" 
                    />
                  ))}
                  {Array.from({ length: 20 }).map((_, i) => (
                    <line 
                      key={`h-${i}`} 
                      x1={0} y1={i * 40} 
                      x2={1100} y2={i * 40} 
                      stroke="#27272a" 
                      strokeWidth="0.5" 
                    />
                  ))}
                </g>

                {/* EDGES / CONNECTIONS LAYER */}
                <g id="edges-group">
                  {skillEdges.map((edge, idx) => {
                    const sourceNode = skillNodes.find(n => n.id === edge.source);
                    const targetNode = skillNodes.find(n => n.id === edge.target);
                    if (!sourceNode || !targetNode) return null;

                    const isDependency = edge.type === "dependency";
                    const active = isEdgeActive(edge);
                    
                    // Style attributes
                    let strokeColor = "#18181b";
                    let strokeWidth = "1";
                    let dashArray = "";
                    let glowOpacity = 0;

                    if (active) {
                      strokeColor = isDependency ? "url(#selectedGlow)" : "#c084fc";
                      strokeWidth = isDependency ? "2" : "1.5";
                      glowOpacity = isDependency ? 0.8 : 0.3;
                    } else if (isDependency) {
                      strokeColor = "#27272a";
                      strokeWidth = "1.2";
                    } else {
                      strokeColor = "#0f0f12";
                      dashArray = "4,4";
                    }

                    return (
                      <g key={`edge-${idx}`}>
                        {/* Glow backing path if active */}
                        {glowOpacity > 0 && (
                          <line
                            x1={sourceNode.x}
                            y1={sourceNode.y}
                            x2={targetNode.x}
                            y2={targetNode.y}
                            stroke={isDependency ? "#06b6d4" : "#a855f7"}
                            strokeWidth="5"
                            strokeOpacity={glowOpacity * 0.3}
                            className="blur-md"
                          />
                        )}

                        <line
                          x1={sourceNode.x}
                          y1={sourceNode.y}
                          x2={targetNode.x}
                          y2={targetNode.y}
                          stroke={strokeColor}
                          strokeWidth={strokeWidth}
                          strokeDasharray={dashArray}
                          markerEnd={isDependency ? (active ? "url(#arrow-active)" : "url(#arrow-inactive)") : undefined}
                          style={{ transition: "all 0.3s" }}
                        />

                        {/* Animated flowing dashboard particle for selected interdependency path */}
                        {active && isDependency && (
                          <line
                            x1={sourceNode.x}
                            y1={sourceNode.y}
                            x2={targetNode.x}
                            y2={targetNode.y}
                            stroke="#22d3ee"
                            strokeWidth="2"
                            strokeDasharray="6, 12"
                            style={{
                              animation: "dash 1.2s linear infinite",
                            }}
                          />
                        )}
                      </g>
                    );
                  })}
                </g>

                {/* NODES LAYER */}
                <g id="nodes-group">
                  {skillNodes.map((node) => {
                    const isSelected = selectedNodeId === node.id;
                    const isHovered = hoveredNodeId === node.id;
                    const isSearchResult = searchMatches.includes(node.id);
                    const connected = isNodeConnected(node.id);

                    // Dim non-connected nodes when something is selected and query/highlight is active
                    const dim = selectedNodeId && !connected;
                    const opacityValue = dim ? 0.25 : 1;

                    // Styles based on node type
                    let circleRadius = 11;
                    let strokeColor = "rgba(255, 255, 255, 0.08)";
                    let fillColor = "#09090c";
                    let ringScale = 1;

                    if (node.type === "root") {
                      circleRadius = 24;
                      fillColor = "#050509";
                      strokeColor = isSelected ? "#a855f7" : "rgba(168, 85, 247, 0.4)";
                    } else if (node.type === "hub") {
                      circleRadius = 16;
                      fillColor = "#090910";
                      strokeColor = isSelected ? "#22d3ee" : "rgba(255, 255, 255, 0.2)";
                    } else {
                      circleRadius = 10;
                      fillColor = "#020205";
                      strokeColor = isSelected ? "#a855f7" : "rgba(255, 255, 255, 0.1)";
                    }

                    // Hover effects
                    if (isHovered) {
                      strokeColor = "#e9d5ff";
                      ringScale = 1.15;
                    }

                    return (
                      <g
                        key={node.id}
                        transform={`translate(${node.x}, ${node.y})`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNodeId(node.id);
                        }}
                        onMouseEnter={() => setHoveredNodeId(node.id)}
                        onMouseLeave={() => setHoveredNodeId(null)}
                        className="node-element-group cursor-pointer"
                        style={{
                          opacity: opacityValue,
                          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                        }}
                      >
                        {/* Selected/Hovered Outer Ripple Ring */}
                        {(isSelected || isHovered || isSearchResult) && (
                          <circle
                            r={circleRadius + 7}
                            fill="none"
                            stroke={isSearchResult ? "#f43f5e" : (node.type === "root" ? "#a855f7" : "#06b6d4")}
                            strokeWidth="1.5"
                            strokeOpacity={isSearchResult ? "0.8" : "0.5"}
                            className="animate-ping"
                            style={{ animationDuration: "3s" }}
                          />
                        )}

                        {/* Soft ambient back-glow ring */}
                        <circle
                          r={circleRadius + 4}
                          fill="none"
                          stroke={node.type === "root" ? "#a855f7" : (node.type === "hub" ? "#06b6d4" : "#ffffff")}
                          strokeWidth="1"
                          strokeOpacity={isSelected ? "0.4" : "0.08"}
                        />

                        {/* Primary Circle backing */}
                        <circle
                          r={circleRadius}
                          fill={fillColor}
                          stroke={strokeColor}
                          strokeWidth={isSelected ? "2.5" : "1.2"}
                          className="shadow-2xl transition-all duration-300"
                        />

                        {/* Internal Icon/Emoji representation */}
                        <text
                          y={node.type === "root" ? 6 : (node.type === "hub" ? 4.5 : 3.5)}
                          textAnchor="middle"
                          fontSize={node.type === "root" ? "15px" : (node.type === "hub" ? "12px" : "10px")}
                          className="select-none"
                        >
                          {node.icon}
                        </text>

                        {/* Labels (Structured nicely to avoid collision) */}
                        <text
                          y={node.type === "root" ? 38 : (node.type === "hub" ? 28 : 22)}
                          textAnchor="middle"
                          fill={isSelected ? "#ffffff" : "#a1a1aa"}
                          fontSize={node.type === "root" ? "11px" : (node.type === "hub" ? "9.5px" : "8px")}
                          fontWeight={isSelected || isHovered ? "bold" : "normal"}
                          className="font-mono tracking-widest uppercase transition-colors"
                        >
                          {node.label}
                        </text>

                        {/* Overlay miniature percentage indicators for skill nodes */}
                        {node.type === "skill" && (
                          <text
                            y={-18}
                            textAnchor="middle"
                            fill="#71717a"
                            fontSize="6.5px"
                            className="font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {node.level}%
                          </text>
                        )}
                      </g>
                    );
                  })}
                </g>
              </g>
            </svg>
          </div>

          {/* Quick Stats Footer Bar */}
          <div className="p-4 bg-zinc-950/80 border-t border-white/[0.03] flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <span>CHIPS SELECTED: <span className="text-white font-bold">{selectedNode.label}</span></span>
            <span className="hidden sm:inline">NODES: {skillNodes.length} • PATH CONNECTIONS: {skillEdges.length}</span>
          </div>
        </div>

        {/* Right Column (Diagnostics Inspector Panel / Holo-Terminal) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-6">
          <div className="glass-card rounded-3xl p-5 space-y-4 flex flex-col justify-between h-full">
            
            {/* Holographic Tab Selector */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest block">TELEMETRY PANEL</span>
              
              <div className="flex gap-1 p-0.5 bg-zinc-900/80 border border-zinc-850 rounded-lg">
                <button
                  onClick={() => setActiveTab("inspect")}
                  className={`px-2 py-1 rounded text-[8.5px] font-mono transition-all cursor-pointer ${
                    activeTab === "inspect" ? "bg-zinc-950 text-white font-bold" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  INSPECT
                </button>
                <button
                  onClick={() => setActiveTab("radar")}
                  className={`px-2 py-1 rounded text-[8.5px] font-mono transition-all cursor-pointer ${
                    activeTab === "radar" ? "bg-zinc-950 text-cyan-400 font-bold" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  RADAR
                </button>
                <button
                  onClick={() => setActiveTab("languages")}
                  className={`px-2 py-1 rounded text-[8.5px] font-mono transition-all cursor-pointer ${
                    activeTab === "languages" ? "bg-zinc-950 text-emerald-400 font-bold" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  LANGS
                </button>
                <button
                  onClick={() => setActiveTab("heatmap")}
                  className={`px-2 py-1 rounded text-[8.5px] font-mono transition-all cursor-pointer ${
                    activeTab === "heatmap" ? "bg-zinc-950 text-emerald-400 font-bold" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  HEATMAP
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "inspect" ? (
                <motion.div
                  key="inspect-content"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4 flex-1 flex flex-col justify-between"
                >
                  {/* Skill Node Core Inspector */}
                  <div className="space-y-4">
                    {/* Node Header Info */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-zinc-900 border border-zinc-850 shadow-inner">
                          {selectedNode.icon}
                        </div>
                        <div>
                          <div className={`px-2 py-0.5 rounded-md text-[8px] uppercase tracking-wider font-mono font-bold inline-block border ${getCategoryColor(selectedNode.category)}`}>
                            {selectedNode.category} Node
                          </div>
                          <h4 className="text-sm font-extrabold text-white font-display tracking-tight mt-1">
                            {selectedNode.label}
                          </h4>
                        </div>
                      </div>

                      {/* Micro circular progress ring */}
                      {selectedNode.type !== "root" && (
                        <div className="relative w-12 h-12 flex items-center justify-center">
                          <svg className="absolute w-full h-full -rotate-90">
                            <circle
                              cx="24"
                              cy="24"
                              r="18"
                              fill="transparent"
                              stroke="rgba(255,255,255,0.03)"
                              strokeWidth="3.5"
                            />
                            <motion.circle
                              cx="24"
                              cy="24"
                              r="18"
                              fill="transparent"
                              stroke="#a855f7"
                              strokeWidth="3.5"
                              strokeDasharray={2 * Math.PI * 18}
                              initial={{ strokeDashoffset: 2 * Math.PI * 18 }}
                              animate={{ strokeDashoffset: 2 * Math.PI * 18 * (1 - selectedNode.level / 100) }}
                              transition={{ duration: 0.85, ease: "easeOut" }}
                            />
                          </svg>
                          <span className="text-[10px] font-mono font-bold text-white relative z-10">
                            {selectedNode.level}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Metadata Diagnostics */}
                    <div className="grid grid-cols-2 gap-3 glass-card p-3 rounded-2xl text-[10px] font-mono">
                      <div>
                        <span className="text-zinc-600 block uppercase text-[8px]">ACTIVE LEVEL</span>
                        <span className="text-zinc-300 font-bold">{selectedNode.level}%</span>
                      </div>
                      <div>
                        <span className="text-zinc-600 block uppercase text-[8px]">DURA ESTIMATION</span>
                        <span className="text-zinc-300 font-bold">{selectedNode.years}</span>
                      </div>
                      <div>
                        <span className="text-zinc-600 block uppercase text-[8px]">INDEX BAND</span>
                        <span className="text-zinc-300 font-bold">{selectedNode.exp}</span>
                      </div>
                      <div>
                        <span className="text-zinc-600 block uppercase text-[8px]">ARCHITECTURE</span>
                        <span className="text-zinc-300 font-bold capitalize">{selectedNode.type}</span>
                      </div>
                    </div>

                    {/* Node Description Telemetry */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] text-zinc-500 uppercase font-mono tracking-widest block">System Synthesis</span>
                      <p className="text-[11px] text-zinc-400 leading-relaxed glass-card p-3.5 rounded-2xl">
                        {selectedNode.desc}
                      </p>
                    </div>

                    {/* Interdependencies linked panels */}
                    <div className="space-y-3 pt-1">
                      {/* Incoming prerequisites */}
                      {incomingDependencies.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[8.5px] text-zinc-500 uppercase font-mono tracking-widest block flex items-center gap-1.5">
                            <Compass className="w-3 h-3 text-purple-400" />
                            <span>Required Prerequisites</span>
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {incomingDependencies.map(dep => (
                              <button
                                key={dep.id}
                                onClick={() => setSelectedNodeId(dep.id)}
                                className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 rounded-lg text-[9.5px] text-purple-300 font-mono transition flex items-center gap-1 cursor-pointer"
                              >
                                <span>{dep.icon}</span>
                                <span>{dep.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Outgoing successors */}
                      {outgoingDependencies.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[8.5px] text-zinc-500 uppercase font-mono tracking-widest block flex items-center gap-1.5">
                            <ArrowUpRight className="w-3 h-3 text-cyan-400" />
                            <span>Unlockable Operations</span>
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {outgoingDependencies.map(dep => (
                              <button
                                key={dep.id}
                                onClick={() => setSelectedNodeId(dep.id)}
                                className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 rounded-lg text-[9.5px] text-cyan-300 font-mono transition flex items-center gap-1 cursor-pointer"
                              >
                                <span>{dep.icon}</span>
                                <span>{dep.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-[9.5px] text-zinc-600 font-mono text-center pt-3 border-t border-zinc-900 mt-2">
                    SELECT INTERCONNECTED NODES TO TRACE DATA PATHWAYS
                  </div>
                </motion.div>
              ) : activeTab === "radar" ? (
                <motion.div
                  key="radar-content"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4 flex-1 flex flex-col justify-between"
                >
                  {/* Recharts Overall Systems Radar Index Chart */}
                  <div className="space-y-2">
                    <h5 className="text-[11px] font-bold font-mono text-zinc-300 uppercase tracking-widest">
                      SYSTEM RADAR PROFILE
                    </h5>
                    <p className="text-[10px] text-zinc-500 leading-relaxed font-sans">
                      Weighted vector index mapped symmetrically across Sayam's core structural sectors.
                    </p>
                  </div>

                  {/* Radar Graph */}
                  <div className="w-full h-56 mt-4 relative z-10 select-none">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={overallProfileData}>
                        <PolarGrid stroke="#222" strokeDasharray="3 3" />
                        <PolarAngleAxis 
                          dataKey="subject" 
                          tick={{ fill: '#71717a', fontSize: 7, fontFamily: 'monospace' }}
                        />
                        <PolarRadiusAxis 
                          angle={30} 
                          domain={[0, 100]} 
                          tick={{ fill: '#3f3f46', fontSize: 6 }} 
                          axisLine={false}
                        />
                        <Radar
                          name="Competence"
                          dataKey="A"
                          stroke="#a855f7"
                          fill="#c084fc"
                          fillOpacity={0.15}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#09090b', borderColor: '#222', borderRadius: '8px' }}
                          labelStyle={{ color: '#ffffff', fontSize: '8px', fontFamily: 'monospace' }}
                          itemStyle={{ color: '#22d3ee', fontSize: '8px', fontFamily: 'monospace' }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="p-3 glass-card rounded-xl space-y-1 text-[10px] font-mono text-zinc-500 leading-normal">
                    <span className="text-white block font-semibold text-[10.5px]">Synthesized Evaluation</span>
                    <span>System is fully operational with key optimization vectors peak in Frontend and Human Channels.</span>
                  </div>
                </motion.div>
              ) : activeTab === "languages" ? (
                <motion.div
                  key="languages-content"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4 flex-1 flex flex-col justify-between"
                >
                  <LanguageRingChart />
                </motion.div>
              ) : (
                <motion.div
                  key="heatmap-content"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4 flex-1 flex flex-col justify-between"
                >
                  <MiniActivityHeatmap 
                    onExpandClick={() => {
                      const el = document.getElementById("coding-activity-heatmap");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }} 
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* GitHub Contribution Heatmap & Coding Activity Frequency Section */}
      <div id="coding-activity-heatmap" className="pt-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-900 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono uppercase tracking-widest font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CODING CADENCE & FREQUENCY • D3.JS ENGINE</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-display mt-1">
              GitHub Contribution Heatmap & Coding Frequency
            </h3>
          </div>
          <p className="text-xs text-zinc-400 font-mono max-w-md sm:text-right leading-relaxed">
            Continuous 365-day commit telemetry analyzing code cadence, pull request frequency, and daily problem-solving velocity across @codesbysayam.
          </p>
        </div>

        <GitHubActivityHeatmap username="codesbysayam" showFrequencyAnalytics={true} />
      </div>

      {/* SVG Animation Keyframe helper */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -18;
          }
        }
      `}</style>
    </div>
  );
}

export default memo(SkillsSection);
