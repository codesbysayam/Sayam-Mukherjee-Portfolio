import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, Mail, Key, ShieldCheck, BarChart3, Plus, Edit3, Trash2, 
  CheckCircle, RefreshCw, Send, Users, FileText, Settings, Award, 
  Layers, Clock, HelpCircle, LogOut, Download, Archive, Eye, 
  Check, X, FileSpreadsheet, ArrowLeft, Github, Laptop, Smartphone, Tablet, AlertCircle
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as ChartTooltip, 
  BarChart, Bar, PieChart, Pie, Cell 
} from "recharts";
import { usePortfolio } from "../context/PortfolioContext";
import { Project, Blog, SkillGroup, ExperienceItem, Certification } from "../data";

export default function AdminDashboard() {
  const { 
    portfolioData, loginAdmin, verify2FA, logoutAdmin, isAdmin, otpRequired, 
    updatePortfolioSection, fetchAdminMessages, actionAdminMessage, fetchAdminSubscribers, 
    deleteAdminSubscriber, actionAdminTestimonial, fetchAdminAnalytics, theme, toggleTheme 
  } = usePortfolio();

  // Authentication states
  const [emailInput, setEmailInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpSimulated, setOtpSimulated] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Active sub-dashboard tab
  const [activeTab, setActiveTab] = useState<"analytics" | "projects" | "blogs" | "skills" | "timeline" | "learning" | "certificates" | "messages" | "newsletter" | "testimonials">("analytics");

  // Local administrative data
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Editors states
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editingBlog, setEditingBlog] = useState<Partial<Blog> | null>(null);
  const [editingSkillGroup, setEditingSkillGroup] = useState<{ groupIndex: number; skillIndex?: number; name?: string; level?: number; icon?: string } | null>(null);
  const [editingCert, setEditingCert] = useState<(Partial<Certification> & { id?: number }) | null>(null);
  const [editingTimeline, setEditingTimeline] = useState<(Partial<ExperienceItem> & { id?: number }) | null>(null);

  // Fresh items template triggers
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isAddingBlog, setIsAddingBlog] = useState(false);
  const [isAddingTimeline, setIsAddingTimeline] = useState(false);
  const [isAddingCert, setIsAddingCert] = useState(false);

  // Newsletter dispatcher mockup
  const [newsSubject, setNewsSubject] = useState("");
  const [newsBody, setNewsBody] = useState("");
  const [newsSent, setNewsSent] = useState(false);

  // Load Administrative Data
  useEffect(() => {
    if (isAdmin) {
      loadAdminPayloads();
    }
  }, [isAdmin]);

  const loadAdminPayloads = async () => {
    setAnalyticsLoading(true);
    try {
      const ann = await fetchAdminAnalytics();
      setAnalyticsData(ann);
      const msgs = await fetchAdminMessages();
      setMessages(msgs);
      const subs = await fetchAdminSubscribers();
      setSubscribers(subs);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Auth steps
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const res = await loginAdmin(emailInput, passInput);
      if (res.success && res.require2FA) {
        setOtpSimulated(res.otpSimulated || "999999");
      } else if (res.error) {
        setAuthError(res.error);
      }
    } catch (err) {
      setAuthError("Auth Node Connection timed out.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const success = await verify2FA(otpInput);
      if (!success) {
        setAuthError("Security verification credentials failed. Review code.");
      }
    } catch (err) {
      setAuthError("Network authorization error.");
    } finally {
      setAuthLoading(false);
    }
  };

  // RECHARTS PIE CHART COLORS
  const COLORS = ["#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"];

  // EXPORT UTILS
  const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) => 
      Object.values(row).map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- ACTIONS ---

  // Projects CMS
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title || !editingProject?.description) return;

    let updatedList = [...portfolioData.projects];
    if (isAddingProject) {
      const newProj: Project = {
        id: editingProject.id || `proj_${Date.now()}`,
        title: editingProject.title,
        description: editingProject.description,
        longDescription: editingProject.longDescription || "",
        tags: editingProject.tags || [],
        category: editingProject.category || "ai_ml",
        imageUrl: editingProject.imageUrl || "https://picsum.photos/seed/default/800/450",
        featured: editingProject.featured || false,
        githubUrl: editingProject.githubUrl || "",
        demoUrl: editingProject.demoUrl || "",
        metrics: editingProject.metrics || []
      };
      updatedList.push(newProj);
    } else {
      updatedList = updatedList.map((p) => p.id === editingProject.id ? { ...p, ...editingProject } : p) as Project[];
    }

    const ok = await updatePortfolioSection({ projects: updatedList });
    if (ok) {
      setEditingProject(null);
      setIsAddingProject(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Confirm deleting this project? This is irreversible.")) return;
    const updated = portfolioData.projects.filter((p) => p.id !== id);
    await updatePortfolioSection({ projects: updated });
  };

  // Blogs CMS
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog?.title || !editingBlog?.content) return;

    let updatedList = [...portfolioData.blogs];
    if (isAddingBlog) {
      const newBlog: Blog = {
        id: editingBlog.id || `blog_${Date.now()}`,
        title: editingBlog.title,
        excerpt: editingBlog.excerpt || "",
        content: editingBlog.content,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        readTime: editingBlog.readTime || "5 min read",
        category: editingBlog.category || "Technology",
        tags: editingBlog.tags || []
      };
      updatedList.push(newBlog);
    } else {
      updatedList = updatedList.map((b) => b.id === editingBlog.id ? { ...b, ...editingBlog } : b) as Blog[];
    }

    const ok = await updatePortfolioSection({ blogs: updatedList });
    if (ok) {
      setEditingBlog(null);
      setIsAddingBlog(false);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    const updated = portfolioData.blogs.filter((b) => b.id !== id);
    await updatePortfolioSection({ blogs: updated });
  };

  // Skills CMS
  const handleSaveSkillLevel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkillGroup) return;

    const { groupIndex, skillIndex, name, level, icon } = editingSkillGroup;
    if (!name || level === undefined) return;

    const groupList = [...portfolioData.skills];
    const group = groupList[groupIndex];

    if (skillIndex !== undefined) {
      // Edit
      group.skills[skillIndex] = { name, level, icon: icon || "Code" };
    } else {
      // Add
      group.skills.push({ name, level, icon: icon || "Code" });
    }

    await updatePortfolioSection({ skills: groupList });
    setEditingSkillGroup(null);
  };

  const handleDeleteSkill = async (gIdx: number, sIdx: number) => {
    if (!confirm("Delete this skill node?")) return;
    const groupList = [...portfolioData.skills];
    groupList[gIdx].skills.splice(sIdx, 1);
    await updatePortfolioSection({ skills: groupList });
  };

  // Certifications CMS
  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert?.name || !editingCert?.issuer) return;

    let updatedList = [...portfolioData.certifications];
    if (isAddingCert) {
      const newCert: Certification = {
        name: editingCert.name,
        issuer: editingCert.issuer,
        date: editingCert.date || "2025",
        verificationUrl: editingCert.verificationUrl || "",
        image: editingCert.image || "https://picsum.photos/seed/cert/100/100"
      };
      updatedList.push(newCert);
    } else {
      updatedList = updatedList.map((c, i) => i === editingCert.id ? { ...c, ...editingCert } : c) as Certification[];
    }

    const ok = await updatePortfolioSection({ certifications: updatedList });
    if (ok) {
      setEditingCert(null);
      setIsAddingCert(false);
    }
  };

  const handleDeleteCert = async (idx: number) => {
    if (!confirm("Delete this certificate node?")) return;
    const updated = portfolioData.certifications.filter((_, i) => i !== idx);
    await updatePortfolioSection({ certifications: updated });
  };

  // Timeline Experience CMS
  const handleSaveTimeline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTimeline?.role || !editingTimeline?.company) return;

    let updatedList = [...portfolioData.experience];
    if (isAddingTimeline) {
      const newExp: ExperienceItem = {
        role: editingTimeline.role,
        company: editingTimeline.company,
        period: editingTimeline.period || "2026 - Present",
        description: editingTimeline.description || [],
        skills: editingTimeline.skills || []
      };
      updatedList.push(newExp);
    } else {
      updatedList = updatedList.map((x, i) => i === editingTimeline.id ? { ...x, ...editingTimeline } : x) as ExperienceItem[];
    }

    const ok = await updatePortfolioSection({ experience: updatedList });
    if (ok) {
      setEditingTimeline(null);
      setIsAddingTimeline(false);
    }
  };

  const handleDeleteTimeline = async (idx: number) => {
    if (!confirm("Delete this timeline milestone?")) return;
    const updated = portfolioData.experience.filter((_, i) => i !== idx);
    await updatePortfolioSection({ experience: updated });
  };

  // Learning Dashboard Progress CMS
  const handleUpdateLearningProgress = async (itemIdx: number, val: number) => {
    const list = { ...portfolioData.learningDashboard };
    list.items[itemIdx].progress = val;
    if (val === 100) list.items[itemIdx].status = "Completed";
    await updatePortfolioSection({ learningDashboard: list });
  };

  // Messages CMS
  const handleMessageAction = async (id: string, action: "archive" | "delete") => {
    const fresh = await actionAdminMessage(id, action);
    setMessages(fresh);
  };

  // Newsletter dispatcher simulator
  const handleSendNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsSubject || !newsBody) return;
    setNewsSent(true);
    setTimeout(() => {
      setNewsSent(false);
      setNewsSubject("");
      setNewsBody("");
      alert(`Automated dispatch successful! Newsletter transmitted to ${subscribers.length} encrypted nodes.`);
    }, 1500);
  };

  // Testimonials approval
  const handleTestimonialAction = async (id: string, action: "approve" | "reject") => {
    await actionAdminTestimonial(id, action);
  };

  // LOGIN PAGE VIEW IF NOT AUTHENTICATED
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center relative font-sans p-6 text-white selection:bg-purple-500/30">
        
        {/* Abstract grids */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-950/20 via-zinc-950 to-zinc-950 pointer-events-none z-0" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none z-0" />
        
        <div className="w-full max-w-md relative z-10 space-y-6">
          
          <div className="text-center space-y-2">
            <a href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs font-mono">
              <ArrowLeft className="w-4.5 h-4.5" /> Return to Terminal
            </a>
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px] flex items-center justify-center mx-auto shadow-lg mt-4">
              <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300">
                S
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight font-display text-white">Administration Node</h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Secure authentication matrix for wrickbusiness@gmail.com
            </p>
          </div>

          <div className="bg-zinc-950/40 border border-zinc-900 p-6 md:p-8 rounded-2xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
            
            {authError && (
              <div className="mb-4 p-3 bg-red-950/50 border border-red-500/20 rounded-xl text-red-200 text-xs flex items-start gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {!otpRequired ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">Security Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                    <input
                      type="email"
                      required
                      placeholder="wrickbusiness@gmail.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-850 focus:border-cyan-500/60 rounded-xl pl-10 pr-3.5 py-3 text-xs text-white placeholder-zinc-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">Cryptographic Password</label>
                  <div className="relative">
                    <Key className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={passInput}
                      onChange={(e) => setPassInput(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-850 focus:border-cyan-500/60 rounded-xl pl-10 pr-3.5 py-3 text-xs text-white placeholder-zinc-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold py-3.5 rounded-xl text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>{authLoading ? "Decrypting credentials..." : "Initialize Session"}</span>
                </button>
                
                <div className="text-center pt-2">
                  <span className="text-[10px] text-zinc-500 font-mono">Default credentials: wrickbusiness@gmail.com / sayam2026</span>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-xl text-purple-200 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold font-display">
                    <ShieldCheck className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span>2FA Verification Required</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                    A verification OTP was transmitted to your encrypted email address. For ease of portfolio review, your simulated OTP code is printed below:
                  </p>
                  <div className="text-center py-1.5 bg-zinc-950 rounded-lg border border-purple-500/10">
                    <span className="text-sm font-bold tracking-widest text-cyan-400 font-mono select-all">{otpSimulated}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">One-Time Security Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-850 focus:border-cyan-500/60 rounded-xl px-3.5 py-3 text-center text-sm font-bold tracking-widest text-white placeholder-zinc-500 outline-none transition-all font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold py-3.5 rounded-xl text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{authLoading ? "Authorizing..." : "Finalize Verification"}</span>
                </button>
              </form>
            )}

          </div>

        </div>
      </div>
    );
  }

  // LOGGED IN DASHBOARD CORE VIEW
  return (
    <div className="min-h-screen bg-[#070709] text-white font-sans selection:bg-purple-500/30 selection:text-cyan-200">
      
      {/* Dynamic SEO Injector for admin page */}
      <title>Admin Dashboard CMS - Sayam Mukherjee</title>

      {/* ADMIN CONTROL PANEL HEADER */}
      <header className="border-b border-zinc-900 bg-zinc-950/40 sticky top-0 z-30 py-4 px-6 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <a href="/" className="p-2 bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors" title="Back to site">
              <ArrowLeft className="w-4 h-4" />
            </a>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white font-display">Sayam's Administrative Node</span>
                <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono text-emerald-400 font-bold uppercase tracking-wider">SECURE_LEVEL_2</span>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono">Logged: wrickbusiness@gmail.com</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAdminPayloads}
              className="p-2 bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Synchronize database parameters"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={logoutAdmin}
              className="flex items-center gap-2 bg-red-950/20 hover:bg-red-950/50 border border-red-900/40 text-red-200 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Terminate Session</span>
            </button>
          </div>

        </div>
      </header>

      {/* DASHBOARD GRID CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SIDE BAR NAVIGATION MODULES */}
        <aside className="lg:col-span-3 space-y-2">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block px-3">CMS Database Entities</span>
          
          {[
            { id: "analytics", label: "Analytics Overview", icon: <BarChart3 className="w-4 h-4" /> },
            { id: "projects", label: "Manage Projects", icon: <Layers className="w-4 h-4" /> },
            { id: "blogs", label: "Manage Blog Posts", icon: <FileText className="w-4 h-4" /> },
            { id: "skills", label: "Manage Skill Matrix", icon: <Settings className="w-4 h-4" /> },
            { id: "timeline", label: "Manage Timeline", icon: <Clock className="w-4 h-4" /> },
            { id: "learning", label: "Learning Dashboard", icon: <Award className="w-4 h-4" /> },
            { id: "certificates", label: "Manage Credentials", icon: <Award className="w-4 h-4" /> },
            { id: "messages", label: "Contact Inquiries", icon: <Mail className="w-4 h-4" />, count: messages.filter(m => m.status === "unread").length },
            { id: "newsletter", label: "Newsletter Matrix", icon: <Users className="w-4 h-4" /> },
            { id: "testimonials", label: "Testimonials Approve", icon: <HelpCircle className="w-4 h-4" />, count: portfolioData.testimonials.filter(t => !t.approved).length }
          ].map((tb) => (
            <button
              key={tb.id}
              onClick={() => {
                setActiveTab(tb.id as any);
                // Clear active editors
                setEditingProject(null);
                setEditingBlog(null);
                setEditingSkillGroup(null);
                setEditingCert(null);
                setEditingTimeline(null);
                setIsAddingProject(false);
                setIsAddingBlog(false);
                setIsAddingCert(false);
                setIsAddingTimeline(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                activeTab === tb.id
                  ? "bg-gradient-to-r from-purple-950/40 to-cyan-950/20 border border-purple-500/20 text-white shadow-md font-semibold"
                  : "bg-transparent border border-transparent hover:bg-zinc-900/40 text-zinc-400 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {tb.icon}
                <span>{tb.label}</span>
              </div>
              {tb.count !== undefined && tb.count > 0 && (
                <span className="bg-cyan-500 text-zinc-950 font-bold font-mono text-[10px] px-2 py-0.5 rounded-full animate-pulse">{tb.count}</span>
              )}
            </button>
          ))}
        </aside>

        {/* ACTIVE CMS BODY NODE */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* ANALYTICS DASHBOARD VIEW */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              
              {/* Header metadata summary metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl relative overflow-hidden">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Total Visitors Count</span>
                  <p className="text-2xl font-bold font-display text-white mt-1">
                    {analyticsData?.totalVisits || 240}
                  </p>
                  <span className="text-[9px] text-emerald-400 font-mono block mt-2">▲ 14.5% vs last week</span>
                </div>

                <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Avg Session Duration</span>
                  <p className="text-2xl font-bold font-display text-white mt-1">
                    {analyticsData ? `${Math.floor(analyticsData.avgDurationSec / 60)}m ${analyticsData.avgDurationSec % 60}s` : "2m 14s"}
                  </p>
                  <span className="text-[9px] text-zinc-500 font-mono block mt-2">Active threshold standard</span>
                </div>

                <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Average Bounce Rate</span>
                  <p className="text-2xl font-bold font-display text-white mt-1">
                    {analyticsData?.bounceRatePct || 28}%
                  </p>
                  <span className="text-[9px] text-emerald-400 font-mono block mt-2">▼ 3.2% optimization rate</span>
                </div>

                <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Inquiry Conversion Rate</span>
                  <p className="text-2xl font-bold font-display text-white mt-1">
                    {analyticsData?.conversionRatePct || 4.2}%
                  </p>
                  <span className="text-[9px] text-cyan-400 font-mono block mt-2">▲ Form dispatched nodes</span>
                </div>

              </div>

              {/* RECHARTS CHANNELS & TIMESERIES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Traffic history AreaChart */}
                <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-3xl space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">Traffic Volume (14-Day rolling)</h3>
                    <p className="text-[10px] text-zinc-500 font-mono">Synchronized daily visits logs</p>
                  </div>
                  <div className="h-56">
                    {analyticsData?.timelineChart ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analyticsData.timelineChart}>
                          <defs>
                            <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="date" stroke="#3f3f46" tick={{ fontSize: 9, fontFamily: 'monospace' }} />
                          <YAxis stroke="#3f3f46" tick={{ fontSize: 9, fontFamily: 'monospace' }} />
                          <ChartTooltip contentStyle={{ background: "#09090b", border: "1px solid #18181b", fontSize: 10, borderRadius: 8 }} />
                          <Area type="monotone" dataKey="Visitors" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorVisits)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-zinc-500">Retrieving charts coordinates...</div>
                    )}
                  </div>
                </div>

                {/* Top Countries BarChart */}
                <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-3xl space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">Top Geographic Locations</h3>
                    <p className="text-[10px] text-zinc-500 font-mono">Crawl session visitor locales</p>
                  </div>
                  <div className="h-56">
                    {analyticsData?.countryChart ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.countryChart}>
                          <XAxis dataKey="name" stroke="#3f3f46" fontSize={9} />
                          <YAxis stroke="#3f3f46" fontSize={9} />
                          <ChartTooltip contentStyle={{ background: "#09090b", border: "1px solid #18181b", fontSize: 10, borderRadius: 8 }} />
                          <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-zinc-500">Compiling regional coordinates...</div>
                    )}
                  </div>
                </div>

              </div>

              {/* DEVICES AND TRAFFIC SOURCES ROW */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Traffic Sources Pie Chart */}
                <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-3xl space-y-4 md:col-span-2">
                  <h3 className="text-sm font-bold text-white">Acquisition Sources Index</h3>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <div className="h-40">
                      {analyticsData?.sourceChart ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={analyticsData.sourceChart}
                              cx="50%"
                              cy="50%"
                              innerRadius={45}
                              outerRadius={65}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {analyticsData.sourceChart.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <ChartTooltip contentStyle={{ background: "#09090b", border: "1px solid #18181b", fontSize: 10, borderRadius: 8 }} />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-xs text-zinc-500">Compiling sources...</div>
                      )}
                    </div>
                    
                    {/* Legend details */}
                    <div className="space-y-1.5 text-xs">
                      {analyticsData?.sourceChart?.map((sc: any, index: number) => (
                        <div key={sc.name} className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          <span className="text-zinc-400 font-mono">{sc.name}</span>
                          <span className="text-white font-bold font-mono ml-auto">{sc.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Device Categories */}
                <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-3xl flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">Device Segments</h3>
                    <p className="text-[10px] text-zinc-500 font-mono">Mobile vs desktop ratios</p>
                  </div>
                  
                  <div className="space-y-3.5 pt-2">
                    {analyticsData?.deviceChart?.map((dv: any) => {
                      const pct = Math.round((dv.value / (analyticsData?.totalVisits || 1)) * 100) || 30;
                      return (
                        <div key={dv.name} className="space-y-1 text-xs">
                          <div className="flex justify-between font-mono">
                            <span className="flex items-center gap-1.5 text-zinc-400 capitalize">
                              {dv.name === "Desktop" ? <Laptop className="w-3.5 h-3.5" /> : dv.name === "Mobile" ? <Smartphone className="w-3.5 h-3.5" /> : <Tablet className="w-3.5 h-3.5" />}
                              {dv.name}
                            </span>
                            <span className="text-white font-bold">{pct}%</span>
                          </div>
                          <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-purple-500 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* PROJECTS CMS TAB VIEW */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white font-display">Manage Portfolio Projects</h3>
                  <p className="text-xs text-zinc-500 font-mono">Manage case study parameters and technology badges</p>
                </div>
                <button
                  onClick={() => {
                    setIsAddingProject(true);
                    setEditingProject({
                      id: `proj_${Date.now()}`,
                      title: "",
                      description: "",
                      longDescription: "",
                      tags: [],
                      category: "ai_ml",
                      imageUrl: "https://picsum.photos/seed/project/800/450",
                      featured: false,
                      githubUrl: "",
                      demoUrl: "",
                      metrics: []
                    });
                  }}
                  className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" /> Add Project
                </button>
              </div>

              {/* EDITOR MODAL */}
              {editingProject && (
                <div className="bg-zinc-950/80 border border-purple-500/20 p-6 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono">
                    {isAddingProject ? "🟢 Add New Project Node" : "⚙️ Edit Project Configuration"}
                  </h4>
                  
                  <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-500 block uppercase">Project Title</span>
                        <input
                          type="text"
                          required
                          value={editingProject.title || ""}
                          onChange={(e) => setEditingProject({...editingProject, title: e.target.value})}
                          className="w-full bg-zinc-900 border border-zinc-850 focus:border-cyan-500/60 rounded-xl px-3 py-2 text-white outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-500 block uppercase">Sector Classification</span>
                        <select
                          value={editingProject.category || "ai_ml"}
                          onChange={(e) => setEditingProject({...editingProject, category: e.target.value as any})}
                          className="w-full bg-zinc-900 border border-zinc-850 focus:border-cyan-500/60 rounded-xl px-3 py-2 text-white outline-none"
                        >
                          <option value="ai_ml">Artificial Intelligence & ML</option>
                          <option value="full_stack">Full-Stack Development</option>
                          <option value="finance">Stock Market Finance</option>
                          <option value="design_media">Branding & Thumbnail Design</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-zinc-500 block uppercase">Short Description (Summary)</span>
                      <input
                        type="text"
                        required
                        value={editingProject.description || ""}
                        onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                        className="w-full bg-zinc-900 border border-zinc-850 focus:border-cyan-500/60 rounded-xl px-3 py-2 text-white outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-zinc-500 block uppercase font-bold">Case Study Long Description (Markdown / Detailed Brief)</span>
                      <textarea
                        rows={6}
                        value={editingProject.longDescription || ""}
                        onChange={(e) => setEditingProject({...editingProject, longDescription: e.target.value})}
                        className="w-full bg-zinc-900 border border-zinc-850 focus:border-cyan-500/60 rounded-xl px-3 py-2 text-white outline-none font-mono text-[11px] leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-500 block uppercase">Image URL</span>
                        <input
                          type="text"
                          value={editingProject.imageUrl || ""}
                          onChange={(e) => setEditingProject({...editingProject, imageUrl: e.target.value})}
                          className="w-full bg-zinc-900 border border-zinc-850 focus:border-cyan-500/60 rounded-xl px-3 py-2 text-white outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-500 block uppercase">GitHub Repository URL</span>
                        <input
                          type="text"
                          value={editingProject.githubUrl || ""}
                          onChange={(e) => setEditingProject({...editingProject, githubUrl: e.target.value})}
                          className="w-full bg-zinc-900 border border-zinc-850 focus:border-cyan-500/60 rounded-xl px-3 py-2 text-white outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-500 block uppercase">Live Demo coordinate</span>
                        <input
                          type="text"
                          value={editingProject.demoUrl || ""}
                          onChange={(e) => setEditingProject({...editingProject, demoUrl: e.target.value})}
                          className="w-full bg-zinc-900 border border-zinc-850 focus:border-cyan-500/60 rounded-xl px-3 py-2 text-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-500 block uppercase">Technology Tags (Comma split)</span>
                        <input
                          type="text"
                          placeholder="React, PyTorch, OpenCV"
                          value={editingProject.tags?.join(", ") || ""}
                          onChange={(e) => setEditingProject({...editingProject, tags: e.target.value.split(",").map(t => t.trim())})}
                          className="w-full bg-zinc-900 border border-zinc-850 focus:border-cyan-500/60 rounded-xl px-3 py-2 text-white outline-none"
                        />
                      </div>
                      <div className="space-y-1 pt-6 flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="feat-chk"
                          checked={editingProject.featured || false}
                          onChange={(e) => setEditingProject({...editingProject, featured: e.target.checked})}
                          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 focus:ring-opacity-20 bg-zinc-900 border-zinc-800"
                        />
                        <label htmlFor="feat-chk" className="text-[10px] uppercase font-mono text-zinc-400 cursor-pointer">Feature on main hero reel</label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProject(null);
                          setIsAddingProject(false);
                        }}
                        className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white px-4 py-2 rounded-xl"
                      >
                        Abort
                      </button>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold px-6 py-2 rounded-xl shadow-md cursor-pointer"
                      >
                        Save Configuration
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* LIST PROJECTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portfolioData.projects.map((proj) => (
                  <div key={proj.id} className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl flex flex-col justify-between hover:border-zinc-800 transition-all">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-white font-display text-sm truncate max-w-[200px]">{proj.title}</h4>
                        <span className="text-[9px] bg-zinc-900 border border-zinc-850 px-2.5 py-1 rounded-full text-zinc-500 uppercase font-mono">{proj.category}</span>
                      </div>
                      <p className="text-zinc-400 text-[11px] line-clamp-2 leading-relaxed">{proj.description}</p>
                    </div>

                    <div className="flex justify-end gap-2.5 pt-4 mt-4 border-t border-zinc-900">
                      <button
                        onClick={() => {
                          setEditingProject(proj);
                          setIsAddingProject(false);
                        }}
                        className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-1.5 bg-red-950/10 hover:bg-red-950/45 border border-red-900/10 rounded-lg text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* BLOGS CMS TAB VIEW */}
          {activeTab === "blogs" && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white font-display">Manage Portfolio Blogs</h3>
                  <p className="text-xs text-zinc-500 font-mono">Create and edit Obsidian journal markdown articles</p>
                </div>
                <button
                  onClick={() => {
                    setIsAddingBlog(true);
                    setEditingBlog({
                      id: `blog_${Date.now()}`,
                      title: "",
                      excerpt: "",
                      content: "",
                      category: "Technology",
                      tags: [],
                      readTime: "5 min read"
                    });
                  }}
                  className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" /> Add Blog Post
                </button>
              </div>

              {/* EDITOR MODAL */}
              {editingBlog && (
                <div className="bg-zinc-950/80 border border-purple-500/20 p-6 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono">
                    {isAddingBlog ? "🟢 Draft New Blog Post" : "⚙️ Edit Blog Post Configuration"}
                  </h4>
                  
                  <form onSubmit={handleSaveBlog} className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-500 block uppercase">Post Title</span>
                        <input
                          type="text"
                          required
                          value={editingBlog.title || ""}
                          onChange={(e) => setEditingBlog({...editingBlog, title: e.target.value})}
                          className="w-full bg-zinc-900 border border-zinc-850 focus:border-cyan-500/60 rounded-xl px-3 py-2 text-white outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-500 block uppercase">Category Index</span>
                        <input
                          type="text"
                          required
                          value={editingBlog.category || ""}
                          onChange={(e) => setEditingBlog({...editingBlog, category: e.target.value})}
                          className="w-full bg-zinc-900 border border-zinc-850 focus:border-cyan-500/60 rounded-xl px-3 py-2 text-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-500 block uppercase">Excerpt Summary</span>
                        <input
                          type="text"
                          required
                          value={editingBlog.excerpt || ""}
                          onChange={(e) => setEditingBlog({...editingBlog, excerpt: e.target.value})}
                          className="w-full bg-zinc-900 border border-zinc-850 focus:border-cyan-500/60 rounded-xl px-3 py-2 text-white outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-500 block uppercase">Estimated Read Time</span>
                        <input
                          type="text"
                          placeholder="6 min read"
                          value={editingBlog.readTime || ""}
                          onChange={(e) => setEditingBlog({...editingBlog, readTime: e.target.value})}
                          className="w-full bg-zinc-900 border border-zinc-850 focus:border-cyan-500/60 rounded-xl px-3 py-2 text-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-zinc-500 block uppercase font-bold">Post Markdown Content</span>
                      <textarea
                        rows={8}
                        required
                        value={editingBlog.content || ""}
                        onChange={(e) => setEditingBlog({...editingBlog, content: e.target.value})}
                        className="w-full bg-zinc-900 border border-zinc-850 focus:border-cyan-500/60 rounded-xl px-3 py-2 text-white outline-none font-mono text-[11px] leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-zinc-500 block uppercase">Keywords & Tags (Comma separated)</span>
                      <input
                        type="text"
                        placeholder="YOLOv8, PyTorch, Edge AI"
                        value={editingBlog.tags?.join(", ") || ""}
                        onChange={(e) => setEditingBlog({...editingBlog, tags: e.target.value.split(",").map(t => t.trim())})}
                        className="w-full bg-zinc-900 border border-zinc-850 focus:border-cyan-500/60 rounded-xl px-3 py-2 text-white outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingBlog(null);
                          setIsAddingBlog(false);
                        }}
                        className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white px-4 py-2 rounded-xl"
                      >
                        Abort
                      </button>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold px-6 py-2 rounded-xl shadow-md cursor-pointer"
                      >
                        Publish Blog Post
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* LIST BLOGS */}
              <div className="grid grid-cols-1 gap-4">
                {portfolioData.blogs.map((b) => (
                  <div key={b.id} className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl flex items-center justify-between gap-6 hover:border-zinc-800 transition-all">
                    <div className="space-y-1 max-w-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] bg-zinc-900 border border-zinc-850 px-2.5 py-1 rounded-full text-zinc-500 font-mono uppercase font-bold">{b.category}</span>
                        <span className="text-[9px] text-zinc-500 font-mono">{b.date}</span>
                      </div>
                      <h4 className="font-bold text-white font-display text-sm truncate">{b.title}</h4>
                      <p className="text-zinc-400 text-[11px] line-clamp-1 leading-relaxed">{b.excerpt}</p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingBlog(b);
                          setIsAddingBlog(false);
                        }}
                        className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(b.id)}
                        className="p-1.5 bg-red-950/10 hover:bg-red-950/45 border border-red-900/10 rounded-lg text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* SKILLS CMS TAB VIEW */}
          {activeTab === "skills" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white font-display">Manage Portfolio Skills Matrix</h3>
                <p className="text-xs text-zinc-500 font-mono">Modulate technical categories and levels percentages</p>
              </div>

              {editingSkillGroup && (
                <div className="bg-zinc-950/80 border border-purple-500/20 p-5 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono">
                    Skill Level Parameters Editor
                  </h4>
                  <form onSubmit={handleSaveSkillLevel} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs items-end">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">Skill Node Name</span>
                      <input
                        type="text"
                        required
                        value={editingSkillGroup.name || ""}
                        onChange={(e) => setEditingSkillGroup({...editingSkillGroup, name: e.target.value})}
                        className="w-full bg-zinc-900 border border-zinc-850 rounded-lg px-2.5 py-1.5 text-white outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">Level (%)</span>
                      <input
                        type="number"
                        required
                        min={0}
                        max={100}
                        value={editingSkillGroup.level || 0}
                        onChange={(e) => setEditingSkillGroup({...editingSkillGroup, level: parseInt(e.target.value)})}
                        className="w-full bg-zinc-900 border border-zinc-850 rounded-lg px-2.5 py-1.5 text-white outline-none font-mono"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setEditingSkillGroup(null)}
                        className="bg-zinc-900 text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-1.5 rounded-lg cursor-pointer"
                      >
                        Apply Node
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {portfolioData.skills.map((group, gIdx) => (
                <div key={gIdx} className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-white font-display tracking-tight">{group.category}</h4>
                    <button
                      onClick={() => setEditingSkillGroup({ groupIndex: gIdx, name: "", level: 80, icon: "Code" })}
                      className="text-[10px] bg-zinc-900 border border-zinc-850 hover:border-zinc-700 px-2.5 py-1 rounded-full text-zinc-400 hover:text-white font-mono cursor-pointer transition-all"
                    >
                      + Add Node
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {group.skills.map((sk, skIdx) => (
                      <div key={skIdx} className="bg-zinc-900/40 border border-zinc-900/60 p-3.5 rounded-xl flex items-center justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <div className="flex justify-between text-xs font-mono font-medium">
                            <span className="text-zinc-300">{sk.name}</span>
                            <span className="text-purple-400 font-bold">{sk.level}%</span>
                          </div>
                          <div className="w-full bg-zinc-950 h-1 rounded-full overflow-hidden">
                            <div className="bg-purple-500 h-full rounded-full" style={{ width: `${sk.level}%` }} />
                          </div>
                        </div>

                        <div className="flex gap-1">
                          <button
                            onClick={() => setEditingSkillGroup({ groupIndex: gIdx, skillIndex: skIdx, name: sk.name, level: sk.level, icon: sk.icon })}
                            className="p-1 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(gIdx, skIdx)}
                            className="p-1 text-red-500/50 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

            </div>
          )}

          {/* TIMELINE CMS TAB VIEW */}
          {activeTab === "timeline" && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white font-display">Manage Career & Research Timeline</h3>
                  <p className="text-xs text-zinc-500 font-mono">Modulate student work, research, and designer milestones</p>
                </div>
                <button
                  onClick={() => {
                    setIsAddingTimeline(true);
                    setEditingTimeline({
                      role: "",
                      company: "",
                      period: "2026 - Present",
                      description: [],
                      skills: []
                    });
                  }}
                  className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" /> Add Milestone
                </button>
              </div>

              {editingTimeline && (
                <div className="bg-zinc-950/80 border border-purple-500/20 p-6 rounded-2xl space-y-4 text-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono">
                    Timeline Milestone Node Editor
                  </h4>
                  <form onSubmit={handleSaveTimeline} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-500 block uppercase">Role Title</span>
                        <input
                          type="text"
                          required
                          value={editingTimeline.role || ""}
                          onChange={(e) => setEditingTimeline({...editingTimeline, role: e.target.value})}
                          className="w-full bg-zinc-900 border border-zinc-850 rounded-lg px-2.5 py-2 text-white outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-500 block uppercase">Company / Group</span>
                        <input
                          type="text"
                          required
                          value={editingTimeline.company || ""}
                          onChange={(e) => setEditingTimeline({...editingTimeline, company: e.target.value})}
                          className="w-full bg-zinc-900 border border-zinc-850 rounded-lg px-2.5 py-2 text-white outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-500 block uppercase">Period</span>
                        <input
                          type="text"
                          required
                          value={editingTimeline.period || ""}
                          onChange={(e) => setEditingTimeline({...editingTimeline, period: e.target.value})}
                          className="w-full bg-zinc-900 border border-zinc-850 rounded-lg px-2.5 py-2 text-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-zinc-500 block uppercase">Key Tasks & achievements (Comma divided lines)</span>
                      <textarea
                        rows={3}
                        value={editingTimeline.description?.join("\n") || ""}
                        onChange={(e) => setEditingTimeline({...editingTimeline, description: e.target.value.split("\n").filter(t => t.trim())})}
                        className="w-full bg-zinc-900 border border-zinc-850 rounded-lg px-2.5 py-2 text-white outline-none font-mono"
                        placeholder="Engineered computer vision tracking pipeline&#10;Built interactive full-stack client applications"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-zinc-500 block uppercase">Applied Technology Toolkit (Comma separated)</span>
                      <input
                        type="text"
                        placeholder="Photoshop, PyTorch, React"
                        value={editingTimeline.skills?.join(", ") || ""}
                        onChange={(e) => setEditingTimeline({...editingTimeline, skills: e.target.value.split(",").map(t => t.trim())})}
                        className="w-full bg-zinc-900 border border-zinc-850 rounded-lg px-2.5 py-2 text-white outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTimeline(null);
                          setIsAddingTimeline(false);
                        }}
                        className="bg-zinc-900 text-zinc-400 hover:text-white px-4 py-2"
                      >
                        Abort
                      </button>
                      <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-xl cursor-pointer"
                      >
                        Save Milestone
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-4">
                {portfolioData.experience.map((exp, idx) => (
                  <div key={idx} className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl flex items-start justify-between gap-6 hover:border-zinc-800 transition-all">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-[10px] bg-zinc-900 px-2.5 py-1 rounded-full text-zinc-500">{exp.period}</span>
                        <span className="text-purple-400 font-bold text-[10px]">{exp.company}</span>
                      </div>
                      <h4 className="font-bold text-white text-sm font-display leading-tight">{exp.role}</h4>
                      <p className="text-zinc-400 text-[11px] leading-relaxed line-clamp-2">{exp.description[0]}</p>
                    </div>

                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingTimeline({ ...exp, id: idx as any });
                          setIsAddingTimeline(false);
                        }}
                        className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 rounded-lg text-zinc-400 hover:text-white"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTimeline(idx)}
                        className="p-1.5 bg-red-950/15 hover:bg-red-950/45 border border-red-900/10 rounded-lg text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* LEARNING DASHBOARD TAB VIEW */}
          {activeTab === "learning" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white font-display">Manage Learning Dashboard Progress</h3>
                <p className="text-xs text-zinc-500 font-mono">Modulate current active coursework and coding progress indicators</p>
              </div>

              <div className="bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl space-y-5">
                <span className="text-[10px] uppercase font-mono text-zinc-500 block">Edit Dynamic Progress Bars</span>
                
                <div className="space-y-4">
                  {portfolioData.learningDashboard.items.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium text-white">{item.name}</span>
                        <div className="flex items-center gap-3 font-mono font-bold">
                          <span className="text-cyan-400">{item.progress}%</span>
                          <span className="text-zinc-500 text-[10px]">({item.status})</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={item.progress}
                          onChange={(e) => handleUpdateLearningProgress(idx, parseInt(e.target.value))}
                          className="flex-1 bg-zinc-900 h-1.5 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* CERTIFICATES CMS TAB VIEW */}
          {activeTab === "certificates" && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white font-display">Manage Academics & Certifications</h3>
                  <p className="text-xs text-zinc-500 font-mono">Modulate Coursera, Google Cloud and academic verification nodes</p>
                </div>
                <button
                  onClick={() => {
                    setIsAddingCert(true);
                    setEditingCert({
                      name: "",
                      issuer: "",
                      date: "2025",
                      verificationUrl: "",
                      image: "https://picsum.photos/seed/cert/100/100"
                    });
                  }}
                  className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" /> Add Certificate
                </button>
              </div>

              {editingCert && (
                <div className="bg-zinc-950/80 border border-purple-500/20 p-6 rounded-2xl space-y-4 text-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono">
                    Academics Credentials Node Editor
                  </h4>
                  <form onSubmit={handleSaveCert} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-500 block uppercase">Certification Name</span>
                        <input
                          type="text"
                          required
                          value={editingCert.name || ""}
                          onChange={(e) => setEditingCert({...editingCert, name: e.target.value})}
                          className="w-full bg-zinc-900 border border-zinc-850 rounded-lg px-2.5 py-2 text-white outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-500 block uppercase">Issuer Authority</span>
                        <input
                          type="text"
                          required
                          value={editingCert.issuer || ""}
                          onChange={(e) => setEditingCert({...editingCert, issuer: e.target.value})}
                          className="w-full bg-zinc-900 border border-zinc-850 rounded-lg px-2.5 py-2 text-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-500 block uppercase">Issue Date</span>
                        <input
                          type="text"
                          required
                          value={editingCert.date || ""}
                          onChange={(e) => setEditingCert({...editingCert, date: e.target.value})}
                          className="w-full bg-zinc-900 border border-zinc-850 rounded-lg px-2.5 py-2 text-white outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-500 block uppercase">Verification Registry URL</span>
                        <input
                          type="text"
                          value={editingCert.verificationUrl || ""}
                          onChange={(e) => setEditingCert({...editingCert, verificationUrl: e.target.value})}
                          className="w-full bg-zinc-900 border border-zinc-850 rounded-lg px-2.5 py-2 text-white outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-500 block uppercase">Badge Icon URL</span>
                        <input
                          type="text"
                          value={editingCert.image || ""}
                          onChange={(e) => setEditingCert({...editingCert, image: e.target.value})}
                          className="w-full bg-zinc-900 border border-zinc-850 rounded-lg px-2.5 py-2 text-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCert(null);
                          setIsAddingCert(false);
                        }}
                        className="bg-zinc-900 text-zinc-400 hover:text-white px-4 py-2"
                      >
                        Abort
                      </button>
                      <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-xl cursor-pointer"
                      >
                        Save Credentials
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portfolioData.certifications.map((cert, idx) => (
                  <div key={idx} className="bg-zinc-950/40 border border-zinc-900 p-4 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img src={cert.image} alt={cert.name} referrerPolicy="no-referrer" className="w-10 h-10 rounded-lg object-cover bg-zinc-900 shrink-0 border border-zinc-800" />
                      <div>
                        <h4 className="font-bold text-white text-xs leading-snug truncate max-w-[200px]">{cert.name}</h4>
                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{cert.issuer}</p>
                      </div>
                    </div>

                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingCert({ ...cert, id: idx as any });
                          setIsAddingCert(false);
                        }}
                        className="p-1 hover:text-white text-zinc-500"
                      >
                        <Edit3 className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCert(idx)}
                        className="p-1 hover:text-red-400 text-red-900/40"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* CONTACT INQUIRIES MESSAGES CMS VIEW */}
          {activeTab === "messages" && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white font-display">Inquiry Transmissions Inbox</h3>
                  <p className="text-xs text-zinc-500 font-mono">Bypassed records from standard contact submittals</p>
                </div>
                <button
                  onClick={() => exportToCSV(messages, "sayam_messages_export")}
                  className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer text-zinc-300 hover:text-white transition-all"
                >
                  <FileSpreadsheet className="w-4 h-4" /> Export CSV
                </button>
              </div>

              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="bg-zinc-950/20 border border-zinc-900 rounded-2xl py-12 text-center text-xs text-zinc-500 font-mono">
                    📭 Archive filters clear. No inbound transmissions recorded yet.
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`bg-zinc-950/40 border p-5 rounded-2xl space-y-4 relative ${
                        msg.status === "unread" ? "border-purple-500/20 shadow-[0_4px_12px_rgba(139,92,246,0.05)]" : "border-zinc-900"
                      }`}
                    >
                      {msg.status === "unread" && (
                        <span className="absolute top-4 right-4 bg-cyan-500 text-zinc-950 font-mono font-bold text-[8px] px-2 py-0.5 rounded-full uppercase">NEW_ALERT</span>
                      )}

                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5 text-xs">
                          <span className="font-bold text-white font-display">{msg.firstName} {msg.lastName}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">• {msg.email}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-zinc-500 font-mono">
                          <span>📍 Loc: {msg.country || "Bhubaneswar, IN"}</span>
                          <span>🏢 Org: {msg.company || "Independent"}</span>
                          <span>💰 Budget: {msg.budget || "None"}</span>
                          <span>🗓️ Timeline: {msg.timeline || "None"}</span>
                          <span>📅 {new Date(msg.timestamp).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="bg-zinc-900/30 border border-zinc-900/60 p-3 rounded-xl text-xs text-zinc-300 leading-relaxed font-mono whitespace-pre-wrap">
                        {msg.message}
                      </div>

                      {msg.attachmentName && (
                        <div className="flex items-center gap-2 text-[10px] text-purple-400 font-mono bg-purple-500/5 border border-purple-500/10 rounded-lg px-3 py-1.5">
                          <FileText className="w-3.5 h-3.5" />
                          <span>Attachment Parameters: {msg.attachmentName}</span>
                        </div>
                      )}

                      <div className="flex justify-end gap-2 pt-2 border-t border-zinc-900/60">
                        {msg.status !== "archived" && (
                          <button
                            onClick={() => handleMessageAction(msg.id, "archive")}
                            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-mono transition-all cursor-pointer"
                          >
                            <Archive className="w-3.5 h-3.5" /> Archive
                          </button>
                        )}
                        <button
                          onClick={() => handleMessageAction(msg.id, "delete")}
                          className="flex items-center gap-1.5 bg-red-950/10 hover:bg-red-950/30 text-red-400 px-3 py-1.5 rounded-lg text-[10px] font-mono transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete Node
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* NEWSLETTER SUB SUBSCRIBERS CMS VIEW */}
          {activeTab === "newsletter" && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Send Newsletter Form */}
                <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-3xl md:col-span-2 space-y-4">
                  <h4 className="text-xs uppercase font-mono tracking-wider text-zinc-400">Broadcast Newsletter Node</h4>
                  
                  <form onSubmit={handleSendNewsletter} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">Subject Header</span>
                      <input
                        type="text"
                        required
                        placeholder="Weekly Deep Learning Brief — YOLOv8 Optimizations"
                        value={newsSubject}
                        onChange={(e) => setNewsSubject(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-850 rounded-xl px-3 py-2 text-white outline-none"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">Newsletter Body (Markdown compatible)</span>
                      <textarea
                        rows={5}
                        required
                        placeholder="Compose technical broadcast content details..."
                        value={newsBody}
                        onChange={(e) => setNewsBody(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-850 rounded-xl px-3 py-2 text-white outline-none font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={subscribers.length === 0 || newsSent}
                      className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold py-2.5 rounded-xl text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {newsSent ? "Broadcasting node packets..." : `Transmit Broadcast to ${subscribers.length} Nodes`}
                    </button>
                  </form>
                </div>

                {/* Subscribers list details */}
                <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-3xl space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                      <h4 className="text-xs uppercase font-mono tracking-wider text-zinc-400">Locked Subscribers</h4>
                      <span className="text-[10px] text-cyan-400 font-mono font-bold">({subscribers.length})</span>
                    </div>

                    <div className="space-y-2 max-h-56 overflow-y-auto pt-2 text-[11px] font-mono no-scrollbar">
                      {subscribers.map((sub) => (
                        <div key={sub.id} className="flex items-center justify-between gap-3 bg-zinc-900/30 p-2 rounded-lg border border-zinc-900/60">
                          <span className="truncate text-zinc-400">{sub.email}</span>
                          <button
                            onClick={async () => {
                              if (!confirm("Remove subscriber email?")) return;
                              const updated = await deleteAdminSubscriber(sub.id);
                              setSubscribers(updated);
                            }}
                            className="text-red-500 hover:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => exportToCSV(subscribers, "sayam_newsletter_subscribers")}
                    className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 py-2 rounded-xl text-xs font-semibold text-zinc-300 transition-all text-center block"
                  >
                    Export Contacts List
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* TESTIMONIALS APPROVAL CMS VIEW */}
          {activeTab === "testimonials" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white font-display">Manage Testimonials Feed</h3>
                <p className="text-xs text-zinc-500 font-mono">Approve, edit, or reject inbound visitor testimonial requests</p>
              </div>

              <div className="space-y-4">
                {portfolioData.testimonials.length === 0 ? (
                  <div className="bg-zinc-950/20 border border-zinc-900 rounded-2xl py-12 text-center text-xs text-zinc-500 font-mono">
                    📭 Testimonials registry empty.
                  </div>
                ) : (
                  portfolioData.testimonials.map((test) => (
                    <div key={test.id} className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl flex items-center justify-between gap-6 hover:border-zinc-800 transition-all">
                      <div className="space-y-2 flex-1 max-w-lg">
                        <div className="flex items-center gap-3">
                          <img src={test.avatar} alt={test.name} referrerPolicy="no-referrer" className="w-8 h-8 rounded-full object-cover shrink-0 bg-zinc-900 border border-zinc-800" />
                          <div>
                            <h4 className="font-bold text-white text-xs leading-none">{test.name}</h4>
                            <p className="text-[10px] text-zinc-500 font-mono mt-1">{test.role}</p>
                          </div>
                          {!test.approved && (
                            <span className="bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded text-[8px] font-bold text-amber-400 font-mono uppercase tracking-wider">PENDING_CMS</span>
                          )}
                        </div>
                        <p className="text-zinc-300 text-xs italic leading-relaxed">"{test.content}"</p>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        {!test.approved && (
                          <button
                            onClick={() => handleTestimonialAction(test.id, "approve")}
                            className="p-1.5 bg-emerald-950/15 hover:bg-emerald-950/40 border border-emerald-900/20 text-emerald-400 rounded-lg cursor-pointer"
                            title="Approve to publish on feed"
                          >
                            <Check className="w-4.5 h-4.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleTestimonialAction(test.id, "reject")}
                          className="p-1.5 bg-red-950/15 hover:bg-red-950/40 border border-red-900/20 text-red-400 rounded-lg cursor-pointer"
                          title="Reject or delete"
                        >
                          <X className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

        </main>

      </div>

    </div>
  );
}
