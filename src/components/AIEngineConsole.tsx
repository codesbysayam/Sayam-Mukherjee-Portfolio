import { useState, useEffect, useMemo, useRef, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cpu, Activity, Database, TrendingUp, RefreshCw, Layers, CheckCircle, Sliders, Play, Check } from "lucide-react";

function AIEngineConsole() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);
  const [activeTab, setActiveTab] = useState<"inference" | "telemetry" | "convergence" | "sandbox" | "devverse">("inference");
  const [epoch, setEpoch] = useState(142);
  const [loss, setLoss] = useState(0.245);
  const [accuracy, setAccuracy] = useState(94.22);

  // Sandbox states
  const [sandboxLr, setSandboxLr] = useState<"1e-2" | "1e-3" | "1e-4">("1e-3");
  const [sandboxOptimizer, setSandboxOptimizer] = useState<"AdamW" | "SGD" | "RMSprop">("AdamW");
  const [sandboxBatch, setSandboxBatch] = useState<"16" | "32" | "64">("32");
  const [isSandboxTraining, setIsSandboxTraining] = useState(false);
  const [sandboxEpoch, setSandboxEpoch] = useState(0);
  const [sandboxLoss, setSandboxLoss] = useState(1.85);
  const [sandboxAcc, setSandboxAcc] = useState(12.4);
  const [hasTuned, setHasTuned] = useState(false);

  // DevVerse game states
  const [devverseSubTab, setDevverseSubTab] = useState<"skills" | "quiz">("skills");
  const [selectedTech, setSelectedTech] = useState<string>("Python");
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [quizSelectedAnswer, setQuizSelectedAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const techCompatibility = useMemo(() => {
    return [
      { 
        name: "Python", 
        synergy: 99, 
        icon: "🐍", 
        scenario: "Unstoppable Neural Synergy! You and Sayam will train deep networks, automate algorithmic trading setups, and design intelligent agents that run on edge nodes." 
      },
      { 
        name: "React/Vite", 
        synergy: 98, 
        icon: "⚛️", 
        scenario: "Zero-Lag Render Warriors! You two will engineer ultra-responsive layouts with native browser virtualization, tactile glass beveling, and silky smooth 144 FPS animations." 
      },
      { 
        name: "C++ & DSA", 
        synergy: 95, 
        icon: "💻", 
        scenario: "Core Pointer Precision! You two will craft memory-optimized binary search trees and solve complex dynamic programming problems at $O(1)$ runtime speed." 
      },
      { 
        name: "Stock Markets", 
        synergy: 96, 
        icon: "📈", 
        scenario: "Financial & Market Modeling! Exploring candlestick trends, volume indicators, and disciplined market analytics." 
      },
      { 
        name: "Django/Kotlin", 
        synergy: 92, 
        icon: "⚙️", 
        scenario: "Full-Stack Architects! You'll build resilient multi-threaded backends connected to secure, responsive mobile app layouts." 
      }
    ];
  }, []);

  const quizQuestions = useMemo(() => {
    return [
      {
        question: "Where does Sayam pursue his undergraduate B.Tech in Computer Science?",
        options: ["IIT Bombay", "Techno Main Salt Lake (TMSL)", "BITS Pilani", "NIT Durgapur"],
        correct: "Techno Main Salt Lake (TMSL)",
        explanation: "Sayam is currently in his 1st year pursuing a B.Tech in Computer Science Engineering at Techno Main Salt Lake (TMSL), Kolkata."
      },
      {
        question: "Which national innovation competition did Sayam reach the finals as a Top 15 team in 2021?",
        options: ["Toycathon", "Smart India Hackathon", "Imagine Cup", "Flipkart GRIDs"],
        correct: "Toycathon",
        explanation: "In 2021, Sayam reached the finals and secured a Top 15 national position in Toycathon."
      },
      {
        question: "What achievement did Sayam secure at IIT BHU Technex'26?",
        options: ["Finalist in 5 out of 6 competitions", "Attended as spectator", "2nd Runner-up", "Hackathon mentor"],
        correct: "Finalist in 5 out of 6 competitions",
        explanation: "At IIT BHU Techfest (Technex'26), Sayam stood as a finalist across 5 out of 6 competitions."
      }
    ];
  }, []);

  // Trigger tuning simulation
  const startSandboxTuning = () => {
    if (isSandboxTraining) return;
    setIsSandboxTraining(true);
    setHasTuned(true);
    setSandboxEpoch(0);
    setSandboxLoss(1.85);
    setSandboxAcc(12.4);

    let currentEpoch = 0;
    const maxEpoch = 100;
    
    const interval = setInterval(() => {
      currentEpoch += 2;
      if (currentEpoch > maxEpoch) {
        clearInterval(interval);
        setIsSandboxTraining(false);
        // Set final metrics depending on combinations
        if (sandboxOptimizer === "AdamW" && sandboxLr === "1e-3") {
          setSandboxLoss(0.018);
          setSandboxAcc(99.45);
        } else if (sandboxLr === "1e-2") {
          setSandboxLoss(0.42);
          setSandboxAcc(90.12);
        } else if (sandboxLr === "1e-4") {
          setSandboxLoss(0.185);
          setSandboxAcc(94.60);
        } else if (sandboxOptimizer === "SGD") {
          setSandboxLoss(0.125);
          setSandboxAcc(96.15);
        } else {
          setSandboxLoss(0.054);
          setSandboxAcc(98.10);
        }
        return;
      }

      setSandboxEpoch(currentEpoch);

      // Interpolation logic with realistic mathematical noise
      const progress = currentEpoch / maxEpoch;
      let targetLoss = 0.05;
      let targetAcc = 98.0;

      if (sandboxLr === "1e-2") {
        targetLoss = 0.35;
        targetAcc = 91.0;
      } else if (sandboxLr === "1e-4") {
        targetLoss = 0.15;
        targetAcc = 95.0;
      } else if (sandboxOptimizer === "SGD") {
        targetLoss = 0.11;
        targetAcc = 96.5;
      }

      const noiseAmpLoss = sandboxLr === "1e-2" ? 0.18 : sandboxLr === "1e-4" ? 0.01 : 0.04;
      const noiseAmpAcc = sandboxLr === "1e-2" ? 6.0 : sandboxLr === "1e-4" ? 0.4 : 1.2;

      const lossStep = 1.85 - (1.85 - targetLoss) * Math.pow(progress, 0.7);
      const accStep = 12.4 + (targetAcc - 12.4) * Math.pow(progress, 0.5);

      const noiseLoss = (Math.random() - 0.5) * noiseAmpLoss;
      const noiseAcc = (Math.random() - 0.5) * noiseAmpAcc;

      setSandboxLoss(Number(Math.max(0.01, lossStep + noiseLoss).toFixed(3)));
      setSandboxAcc(Number(Math.min(100, accStep + noiseAcc).toFixed(2)));
    }, 40);
  };

  // Pause training updates when off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Simulate training loop only when convergence tab is actively viewed and in viewport
  useEffect(() => {
    if (activeTab !== "convergence" || !isInView) return;
    const interval = setInterval(() => {
      setEpoch((prev) => (prev >= 400 ? 120 : prev + 1));
      setLoss((prev) => {
        const nextLoss = prev - 0.001 * Math.random();
        return nextLoss < 0.045 ? 0.245 : Number(nextLoss.toFixed(4));
      });
      setAccuracy((prev) => {
        const nextAcc = prev + 0.04 * Math.random();
        return nextAcc > 99.85 ? 94.22 : Number(nextAcc.toFixed(2));
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [activeTab, isInView]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full max-w-md glass-card rounded-2xl overflow-hidden p-5 space-y-4 font-sans text-xs"
    >
      {/* Decorative Blur Backing */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-400 font-mono font-bold tracking-wider uppercase">MODEL SIMULATOR</span>
            <span className="text-[9px] text-zinc-500 font-mono uppercase">Interactive Sandbox</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-zinc-900 px-2.5 py-1 rounded-full border border-zinc-850">
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
          <span className="text-[9px] text-cyan-400 font-mono font-bold tracking-widest uppercase">ACTIVE</span>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex bg-zinc-950 p-1 border border-zinc-900 rounded-xl overflow-x-auto scrollbar-none">
        {(["inference", "telemetry", "convergence", "sandbox", "devverse"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-[10px] font-mono py-1.5 px-1 rounded-lg transition-all capitalize font-bold whitespace-nowrap shrink-0 ${
              activeTab === tab
                ? "bg-zinc-900 text-white border border-zinc-800 shadow"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="min-h-[170px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {activeTab === "inference" && (
            <motion.div
              key="inference"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center bg-zinc-900/30 p-2.5 rounded-xl border border-zinc-900">
                <span className="text-zinc-500 font-mono text-[10px]">Active Neural Pipeline State:</span>
                <span className="text-emerald-400 font-mono font-bold uppercase tracking-widest text-[9px] bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-900/40">
                  Stable Convergence
                </span>
              </div>

              {/* Neural Net SVG Nodes Map */}
              <div className="relative h-24 w-full bg-zinc-950 rounded-xl border border-zinc-900/80 p-2 overflow-hidden flex items-center justify-between">
                {/* SVG Connections & Animated Pulses */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {/* Lines */}
                  <line x1="15%" y1="50%" x2="45%" y2="25%" stroke="#374151" strokeWidth="1" />
                  <line x1="15%" y1="50%" x2="45%" y2="50%" stroke="#374151" strokeWidth="1" />
                  <line x1="15%" y1="50%" x2="45%" y2="75%" stroke="#374151" strokeWidth="1" />

                  <line x1="45%" y1="25%" x2="80%" y2="50%" stroke="#374151" strokeWidth="1" />
                  <line x1="45%" y1="50%" x2="80%" y2="50%" stroke="#374151" strokeWidth="1" />
                  <line x1="45%" y1="75%" x2="80%" y2="50%" stroke="#374151" strokeWidth="1" />

                  {/* Pulsing particles running on paths */}
                  <motion.circle
                    r="2"
                    fill="#22d3ee"
                    animate={{
                      cx: ["15%", "45%", "80%"],
                      cy: ["50%", "25%", "50%"],
                    }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
                  />
                  <motion.circle
                    r="2"
                    fill="#a78bfa"
                    animate={{
                      cx: ["15%", "45%", "80%"],
                      cy: ["50%", "75%", "50%"],
                    }}
                    transition={{ repeat: Infinity, duration: 2.8, ease: "linear", delay: 0.5 }}
                  />
                  <motion.circle
                    r="1.5"
                    fill="#34d399"
                    animate={{
                      cx: ["15%", "45%", "80%"],
                      cy: ["50%", "50%", "50%"],
                    }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "linear", delay: 1 }}
                  />
                </svg>

                {/* Input Layer */}
                <div className="flex flex-col items-center z-10">
                  <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[9px] font-mono font-bold text-zinc-300">
                    IN
                  </div>
                  <span className="text-[8px] text-zinc-500 font-mono mt-1">Feature Space</span>
                </div>

                {/* Hidden Layers */}
                <div className="flex flex-col gap-2.5 z-10">
                  <div className="w-5 h-5 rounded-full bg-zinc-900/80 border border-cyan-500/20 flex items-center justify-center text-[7px] font-mono text-cyan-400">
                    H1
                  </div>
                  <div className="w-5 h-5 rounded-full bg-zinc-900/80 border border-purple-500/20 flex items-center justify-center text-[7px] font-mono text-purple-400">
                    H2
                  </div>
                  <div className="w-5 h-5 rounded-full bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-[7px] font-mono text-zinc-500">
                    H3
                  </div>
                </div>

                {/* Output Layer */}
                <div className="flex flex-col items-center z-10">
                  <div className="w-7 h-7 rounded-full bg-zinc-900 border border-cyan-500/50 flex items-center justify-center text-[9px] font-mono font-bold text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                    OUT
                  </div>
                  <span className="text-[8px] text-cyan-400 font-mono mt-1">Predictions</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "telemetry" && (
            <motion.div
              key="telemetry"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 gap-3"
            >
              {[
                { label: "Core Focus", value: "Deep Learning", icon: <Cpu className="w-3.5 h-3.5 text-purple-400" /> },
                { label: "AI Framework", value: "PyTorch & Python", icon: <RefreshCw className="w-3.5 h-3.5 text-cyan-400" /> },
                { label: "Main Solvers", value: "AdamW / Stochastic SGD", icon: <Layers className="w-3.5 h-3.5 text-emerald-400" /> },
                { label: "Architecture", value: "CNNs / Transformers", icon: <Database className="w-3.5 h-3.5 text-amber-400" /> },
              ].map((spec, i) => (
                <div key={i} className="bg-zinc-900/30 border border-zinc-900/80 p-3 rounded-xl flex items-center gap-3">
                  <div className="p-2 bg-zinc-950 border border-zinc-850 rounded-lg">
                    {spec.icon}
                  </div>
                  <div>
                    <span className="text-[8px] text-zinc-500 block uppercase font-mono">{spec.label}</span>
                    <span className="text-[10px] text-zinc-200 font-mono font-bold block mt-0.5">{spec.value}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "convergence" && (
            <motion.div
              key="convergence"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {/* Dynamic stats row */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-zinc-900/40 p-2 rounded-lg border border-zinc-900">
                  <span className="text-[8px] text-zinc-500 block font-mono">EPOCH</span>
                  <span className="text-xs text-white font-mono font-bold">{epoch}/400</span>
                </div>
                <div className="bg-zinc-900/40 p-2 rounded-lg border border-zinc-900">
                  <span className="text-[8px] text-zinc-500 block font-mono">TRAIN LOSS</span>
                  <span className="text-xs text-rose-400 font-mono font-bold">{loss}</span>
                </div>
                <div className="bg-zinc-900/40 p-2 rounded-lg border border-zinc-900">
                  <span className="text-[8px] text-zinc-500 block font-mono">ACCURACY</span>
                  <span className="text-xs text-emerald-400 font-mono font-bold">{accuracy}%</span>
                </div>
              </div>

              {/* Dynamic Convergence Line Chart */}
              <div className="h-20 bg-zinc-950 rounded-xl border border-zinc-900 p-2 flex items-end relative overflow-hidden">
                <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                  {/* Loss path */}
                  <motion.path
                    d="M 0 60 Q 50 45 100 35 T 200 20 T 300 15 T 400 10"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="1.5"
                    strokeDasharray="400"
                    strokeDashoffset="400"
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  {/* Accuracy path */}
                  <motion.path
                    d="M 0 70 Q 50 65 100 50 T 200 30 T 300 18 T 400 8"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeDasharray="400"
                    strokeDashoffset="400"
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 1.8, ease: "easeOut", delay: 0.2 }}
                  />
                </svg>
                {/* Labels */}
                <div className="absolute top-2 left-2 flex gap-3 text-[8px] font-mono">
                  <span className="flex items-center gap-1 text-rose-400">
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                    Loss Curve
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    Accuracy Curve
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "sandbox" && (
            <motion.div
              key="sandbox"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="grid grid-cols-3 gap-2">
                {/* Learning Rate Picker */}
                <div className="space-y-1">
                  <span className="text-[8px] text-zinc-500 font-mono uppercase block text-left">Learn Rate</span>
                  <div className="flex flex-col gap-1">
                    {(["1e-2", "1e-3", "1e-4"] as const).map((lr) => (
                      <button
                        key={lr}
                        type="button"
                        onClick={() => !isSandboxTraining && setSandboxLr(lr)}
                        disabled={isSandboxTraining}
                        className={`text-[9px] font-mono py-1 rounded border transition-all cursor-pointer ${
                          sandboxLr === lr
                            ? "bg-purple-950/40 border-purple-500/40 text-purple-400 font-bold"
                            : "bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        {lr}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optimizer Picker */}
                <div className="space-y-1">
                  <span className="text-[8px] text-zinc-500 font-mono uppercase block text-left">Optimizer</span>
                  <div className="flex flex-col gap-1">
                    {(["AdamW", "SGD", "RMSprop"] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => !isSandboxTraining && setSandboxOptimizer(opt)}
                        disabled={isSandboxTraining}
                        className={`text-[9px] font-mono py-1 rounded border transition-all cursor-pointer ${
                          sandboxOptimizer === opt
                            ? "bg-cyan-950/40 border-cyan-500/40 text-cyan-400 font-bold"
                            : "bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Batch Picker */}
                <div className="space-y-1">
                  <span className="text-[8px] text-zinc-500 font-mono uppercase block text-left">Batch Size</span>
                  <div className="flex flex-col gap-1">
                    {(["16", "32", "64"] as const).map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => !isSandboxTraining && setSandboxBatch(sz)}
                        disabled={isSandboxTraining}
                        className={`text-[9px] font-mono py-1 rounded border transition-all cursor-pointer ${
                          sandboxBatch === sz
                            ? "bg-indigo-950/40 border-indigo-500/40 text-indigo-400 font-bold"
                            : "bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Training Progress Display OR Start CTA */}
              <div className="bg-zinc-950 rounded-xl border border-zinc-900 p-2.5 flex flex-col justify-between min-h-[75px] relative overflow-hidden">
                {isSandboxTraining || hasTuned ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-zinc-400 flex items-center gap-1">
                        {isSandboxTraining ? (
                          <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin" />
                        ) : (
                          <Check className="w-3 h-3 text-emerald-400 animate-pulse" />
                        )}
                        {isSandboxTraining ? `Optimizing Epoch ${sandboxEpoch}/100...` : "Optimization Converged!"}
                      </span>
                      <span className="text-purple-400 font-mono">Batch={sandboxBatch}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="bg-zinc-900/40 py-1 px-2 rounded border border-zinc-900">
                        <span className="text-[8px] text-zinc-500 block font-mono">Loss</span>
                        <span className="text-[11px] text-rose-400 font-mono font-bold">{sandboxLoss}</span>
                      </div>
                      <div className="bg-zinc-900/40 py-1 px-2 rounded border border-zinc-900">
                        <span className="text-[8px] text-zinc-500 block font-mono">Accuracy</span>
                        <span className="text-[11px] text-emerald-400 font-mono font-bold">{sandboxAcc}%</span>
                      </div>
                    </div>

                    {isSandboxTraining && (
                      <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-75"
                          style={{ width: `${sandboxEpoch}%` }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center h-full py-1.5 space-y-1.5">
                    <p className="text-[9px] text-zinc-500 font-mono text-center">
                      Configure parameters and simulate stochastic training convergence graph
                    </p>
                    <button
                      type="button"
                      onClick={startSandboxTuning}
                      className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-mono text-[9px] font-bold uppercase py-1 px-3 rounded-lg flex items-center justify-center gap-1 transition-all duration-300 shadow-[0_2px_8px_rgba(139,92,246,0.2)] cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      Optimize Node
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "devverse" && (
            <motion.div
              key="devverse"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="space-y-3 font-sans"
            >
              {/* Inner Tabs: Skill Matcher or Sayam Trivia */}
              <div className="flex bg-zinc-950/80 p-0.5 border border-zinc-900 rounded-lg max-w-[200px] mx-auto mb-2">
                <button
                  type="button"
                  onClick={() => setDevverseSubTab("skills")}
                  className={`flex-1 text-[9px] font-mono py-1 rounded transition-all cursor-pointer font-bold ${
                    devverseSubTab === "skills"
                      ? "bg-zinc-900 text-white border border-zinc-850"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Skill Matcher
                </button>
                <button
                  type="button"
                  onClick={() => setDevverseSubTab("quiz")}
                  className={`flex-1 text-[9px] font-mono py-1 rounded transition-all cursor-pointer font-bold ${
                    devverseSubTab === "quiz"
                      ? "bg-zinc-900 text-white border border-zinc-850"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Sayam Quiz
                </button>
              </div>

              {devverseSubTab === "skills" ? (
                <div className="space-y-2">
                  <span className="text-[9px] text-zinc-400 font-mono block text-center">Select your tech stack to check developer synergy:</span>
                  <div className="flex flex-wrap justify-center gap-1.5 py-1">
                    {techCompatibility.map((tech) => (
                      <button
                        key={tech.name}
                        type="button"
                        onClick={() => setSelectedTech(tech.name)}
                        className={`text-[9px] font-mono px-2 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                          selectedTech === tech.name
                            ? "bg-purple-950/40 border-purple-500/40 text-purple-400 font-bold shadow-[0_0_8px_rgba(168,85,247,0.15)]"
                            : "bg-zinc-900/30 border-zinc-900/80 text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        <span>{tech.icon}</span>
                        <span>{tech.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Compatibility Card */}
                  {selectedTech && (
                    <motion.div
                      key={selectedTech}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-zinc-950/50 rounded-xl border border-zinc-900 p-3 space-y-2 text-left"
                    >
                      <div className="flex justify-between items-center border-b border-zinc-900/50 pb-1.5">
                        <span className="text-[10px] font-mono font-bold text-zinc-300">
                          Synergy Forecast: <span className="text-purple-400">{selectedTech}</span>
                        </span>
                        <span className="text-[10px] font-mono font-black text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-950">
                          {techCompatibility.find(t => t.name === selectedTech)?.synergy}% Match
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">
                        {techCompatibility.find(t => t.name === selectedTech)?.scenario}
                      </p>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {!quizFinished ? (
                    <div className="space-y-2.5 text-left">
                      <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500">
                        <span>QUESTION {quizIndex + 1} OF {quizQuestions.length}</span>
                        <span>SCORE: {quizScore}/{quizQuestions.length}</span>
                      </div>

                      <p className="text-[11px] font-medium text-zinc-200 leading-snug">
                        {quizQuestions[quizIndex].question}
                      </p>

                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        {quizQuestions[quizIndex].options.map((opt) => {
                          const isSelected = quizSelectedAnswer === opt;
                          const isCorrect = opt === quizQuestions[quizIndex].correct;
                          const showResultColors = quizSelectedAnswer !== null;

                          let btnStyle = "bg-zinc-900/30 border-zinc-900 text-zinc-300 hover:text-white";
                          if (showResultColors) {
                            if (isCorrect) {
                              btnStyle = "bg-emerald-950/40 border-emerald-500/50 text-emerald-400 font-bold";
                            } else if (isSelected) {
                              btnStyle = "bg-rose-950/40 border-rose-500/50 text-rose-400 font-bold";
                            } else {
                              btnStyle = "bg-zinc-900/20 border-zinc-950 text-zinc-600 opacity-60";
                            }
                          }

                          return (
                            <button
                              key={opt}
                              type="button"
                              disabled={quizSelectedAnswer !== null}
                              onClick={() => {
                                setQuizSelectedAnswer(opt);
                                if (opt === quizQuestions[quizIndex].correct) {
                                  setQuizScore(prev => prev + 1);
                                }
                                setShowExplanation(true);
                              }}
                              className={`text-[9.5px] font-mono py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer ${btnStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {showExplanation && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="bg-zinc-900/10 border border-zinc-900/80 rounded-lg p-2 text-[9px] text-zinc-400 mt-1.5"
                        >
                          <span className="text-zinc-300 font-bold block mb-0.5">
                            {quizSelectedAnswer === quizQuestions[quizIndex].correct ? "✨ Correct!" : "❌ Not quite:"}
                          </span>
                          {quizQuestions[quizIndex].explanation}

                          <button
                            type="button"
                            onClick={() => {
                              setShowExplanation(false);
                              setQuizSelectedAnswer(null);
                              if (quizIndex + 1 < quizQuestions.length) {
                                setQuizIndex(prev => prev + 1);
                              } else {
                                setQuizFinished(true);
                              }
                            }}
                            className="mt-2 w-full bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 text-[8.5px] py-1 rounded font-mono font-bold cursor-pointer transition-colors"
                          >
                            {quizIndex + 1 < quizQuestions.length ? "Next Question" : "View Results"}
                          </button>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-2 space-y-2.5"
                    >
                      <div className="w-9 h-9 bg-purple-950/40 border border-purple-500/30 rounded-full flex items-center justify-center mx-auto shadow-[0_0_12px_rgba(168,85,247,0.2)]">
                        <CheckCircle className="w-5 h-5 text-purple-400 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-xs font-mono font-bold text-zinc-100">Dev-Verse Quiz Cleared!</h4>
                        <p className="text-[9.5px] text-zinc-400 mt-1 font-mono">
                          You scored <span className="text-emerald-400 font-bold">{quizScore}/{quizQuestions.length}</span>!
                        </p>
                      </div>

                      <p className="text-[9px] text-zinc-500 leading-normal max-w-[240px] mx-auto font-sans">
                        {quizScore === quizQuestions.length 
                          ? "Master Architect! You know Sayam's academic focus and stats flawlessly. Let's build something epic!" 
                          : "Awesome job! You are officially in sync with Sayam's tech journey. Check out his other portfolio tabs!"}
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          setQuizIndex(0);
                          setQuizScore(0);
                          setQuizFinished(false);
                          setQuizSelectedAnswer(null);
                          setShowExplanation(false);
                        }}
                        className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white px-3 py-1 text-[9px] rounded-lg font-mono font-bold transition-all cursor-pointer"
                      >
                        Reset Challenge
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Active Telemetry status bar */}
        <div className="bg-zinc-950 border border-zinc-900 p-3 rounded-xl space-y-2 mt-4">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-zinc-500 font-mono uppercase tracking-wider">Model Optimization Target:</span>
            <span className="text-cyan-400 font-mono font-bold">98.82% Accuracy</span>
          </div>
          <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-900">
            <div className="w-[98.82%] h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Footer Meta Row */}
      <div className="flex justify-between items-center pt-2.5 border-t border-zinc-900 text-[10px] text-zinc-500 font-mono">
        <div className="flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-cyan-400 shrink-0 animate-pulse" />
          <span>REAL-TIME LEARNING SIMULATION</span>
        </div>
        <ConsoleClock />
      </div>
    </motion.div>
  );
}

// Isolated IST Clock for console footer to avoid whole-component re-renders
function ConsoleClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tickTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { 
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false 
      }));
    };
    tickTime();
    const clockInterval = setInterval(tickTime, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  return <span>IST-CLOCK: {time || "00:00:00"}</span>;
}

export default memo(AIEngineConsole);
