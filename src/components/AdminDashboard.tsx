import { useState, useEffect } from "react";
import {
  Mail, ShieldCheck, BarChart3, Plus, Edit3, Trash2,
  RefreshCw, Users, FileText, Settings, Award,
  Layers, Clock, HelpCircle, LogOut, Archive,
  Check, X, FileSpreadsheet, ArrowLeft, Laptop, Smartphone, Tablet, AlertCircle
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as ChartTooltip,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";
import { usePortfolio } from "../context/PortfolioContext";
import { Project, Blog, ExperienceItem } from "../data";
import { Certificate, CertificateCategory } from "../types/certificates";
import ConfirmationModal from "./common/ConfirmationModal";
import { showToast } from "./Toast";

export default function AdminDashboard() {
  const {
    portfolioData, authReady, isAdmin, adminEmail, signInWithAdminGoogle, logoutAdmin,
    updatePortfolioSection, fetchAdminMessages, actionAdminMessage, fetchAdminSubscribers,
    deleteAdminSubscriber, sendAdminNewsletterBroadcast, fetchAdminTestimonials,
    actionAdminTestimonial, fetchAdminAnalytics,
    fetchAdminCertificates, createAdminCertificate, updateAdminCertificate, deleteAdminCertificate
  } = usePortfolio();

  // Confirmation modal state
  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const triggerConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmModalState({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
        onConfirm();
      },
    });
  };

  // Authentication states
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Active sub-dashboard tab
  const [activeTab, setActiveTab] = useState<"analytics" | "projects" | "blogs" | "skills" | "timeline" | "learning" | "certificates" | "messages" | "newsletter" | "testimonials">("analytics");

  // Local administrative data
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [adminTestimonials, setAdminTestimonials] = useState<any[]>([]);
  const [adminCertificates, setAdminCertificates] = useState<Certificate[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Editors states
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editingBlog, setEditingBlog] = useState<Partial<Blog> | null>(null);
  const [editingSkillGroup, setEditingSkillGroup] = useState<{ groupIndex: number; skillIndex?: number; name?: string; level?: number; icon?: string } | null>(null);
  const [editingCert, setEditingCert] = useState<Partial<Certificate> | null>(null);
  const [editingTimeline, setEditingTimeline] = useState<(Partial<ExperienceItem> & { id?: number }) | null>(null);

  // Fresh items template triggers
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isAddingBlog, setIsAddingBlog] = useState(false);
  const [isAddingTimeline, setIsAddingTimeline] = useState(false);
  const [isAddingCert, setIsAddingCert] = useState(false);

  // Newsletter dispatcher state
  const [newsSubject, setNewsSubject] = useState("");
  const [newsBody, setNewsBody] = useState("");
  const [newsSending, setNewsSending] = useState(false);

  // Load Administrative Data
  useEffect(() => {
    if (isAdmin) {
      loadAdminPayloads();
    }
  }, [isAdmin]);

  const loadAdminPayloads = async () => {
    setAnalyticsLoading(true);
    try {
      const [ann, msgs, subs, tests, certs] = await Promise.all([
        fetchAdminAnalytics(),
        fetchAdminMessages(),
        fetchAdminSubscribers(),
        fetchAdminTestimonials(),
        fetchAdminCertificates(),
      ]);
      setAnalyticsData(ann);
      setMessages(msgs);
      setSubscribers(subs);
      setAdminTestimonials(tests);
      setAdminCertificates(certs);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Real Firebase Google Sign-In handler
  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setAuthLoading(true);
    try {
      const res = await signInWithAdminGoogle();
      if (!res.success && res.error) {
        setAuthError(res.error);
      }
    } catch {
      setAuthError("Unable to complete Firebase Google authentication.");
    } finally {
      setAuthLoading(false);
    }
  };

  // RECHARTS PIE CHART COLORS
  const COLORS = ["#69734A", "#C7E34A", "#4E5834", "#A16207", "#B91C1C"];

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
        imageUrl: editingProject.imageUrl || "",
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

  const handleDeleteProject = (id: string) => {
    triggerConfirm(
      "Delete Project",
      "Are you sure you want to delete this project? This change cannot be undone.",
      async () => {
        const updated = portfolioData.projects.filter((p) => p.id !== id);
        await updatePortfolioSection({ projects: updated });
      }
    );
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

  const handleDeleteBlog = (id: string) => {
    triggerConfirm("Delete Blog Post", "Are you sure you want to delete this blog post?", async () => {
      const updated = portfolioData.blogs.filter((b) => b.id !== id);
      await updatePortfolioSection({ blogs: updated });
    });
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

  const handleDeleteSkill = (gIdx: number, sIdx: number) => {
    triggerConfirm("Delete Skill Node", "Are you sure you want to delete this skill node?", async () => {
      const groupList = [...portfolioData.skills];
      groupList[gIdx].skills.splice(sIdx, 1);
      await updatePortfolioSection({ skills: groupList });
    });
  };

  // Certifications CRUD (Firestore via /api/certificates)
  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert?.title || !editingCert?.issuer) return;

    const payload: Partial<Certificate> = {
      title: editingCert.title.trim(),
      issuer: editingCert.issuer.trim(),
      category: (editingCert.category || "CERTIFICATIONS") as Exclude<CertificateCategory, "ALL">,
      issueDate: (editingCert.issueDate || "2026").trim(),
      description: editingCert.description?.trim() || undefined,
      credentialId: editingCert.credentialId?.trim() || undefined,
      credentialUrl: editingCert.credentialUrl?.trim() || undefined,
      imageUrl: editingCert.imageUrl?.trim() || undefined,
      skills: Array.isArray(editingCert.skills)
        ? editingCert.skills.filter(Boolean)
        : [],
      featured: Boolean(editingCert.featured),
    };

    const result = isAddingCert
      ? await createAdminCertificate(payload)
      : editingCert.id
        ? await updateAdminCertificate(editingCert.id, payload)
        : { success: false, error: "Missing certificate id" };

    if (result.success) {
      const fresh = await fetchAdminCertificates();
      setAdminCertificates(fresh);
      setEditingCert(null);
      setIsAddingCert(false);
      showToast(
        isAddingCert ? "Credential created in Firestore." : "Credential updated in Firestore.",
        "success"
      );
    } else {
      showToast(result.error || "Failed to save credential.", "error");
    }
  };

  const handleDeleteCert = (id: string) => {
    triggerConfirm(
      "Delete Certificate",
      "Are you sure you want to remove this credential from the public vault?",
      async () => {
        const res = await deleteAdminCertificate(id);
        if (res.success) {
          const fresh = await fetchAdminCertificates();
          setAdminCertificates(fresh);
          showToast("Credential deleted.", "success");
        } else {
          showToast(res.error || "Failed to delete credential.", "error");
        }
      }
    );
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

  const handleDeleteTimeline = (idx: number) => {
    triggerConfirm("Delete Milestone", "Are you sure you want to delete this timeline milestone?", async () => {
      const updated = portfolioData.experience.filter((_, i) => i !== idx);
      await updatePortfolioSection({ experience: updated });
    });
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

  // Newsletter broadcaster (email provider optional/disabled by default)
  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsSubject.trim() || !newsBody.trim() || newsSending) return;
    setNewsSending(true);
    try {
      const result = await sendAdminNewsletterBroadcast(newsSubject.trim(), newsBody.trim());
      if (result.success) {
        setNewsSubject("");
        setNewsBody("");
        showToast(
          `Newsletter delivered to ${result.sentCount ?? subscribers.length} subscriber(s).`,
          "success"
        );
      } else {
        showToast(
          result.error ||
            "Newsletter email dispatch is currently disabled because no external email provider is configured.",
          "error"
        );
      }
    } finally {
      setNewsSending(false);
    }
  };

  // Testimonials approval
  const handleTestimonialAction = async (id: string, action: "approve" | "reject") => {
    const updated = await actionAdminTestimonial(id, action);
    if (Array.isArray(updated)) {
      setAdminTestimonials(updated);
    }
  };

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono text-xs bg-[var(--bg)] text-[var(--text-muted)]">
        Checking Firebase Authentication session...
      </div>
    );
  }

  // LOGIN PAGE VIEW IF NOT AUTHENTICATED
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center relative font-sans p-6 bg-[var(--bg)] text-[var(--text)]">
        <div className="w-full max-w-md relative z-10 space-y-6">
          <div className="text-center space-y-3">
            <a href="/" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors text-xs font-mono">
              <ArrowLeft className="w-4 h-4" /> Return to Portfolio
            </a>
            <div className="w-12 h-12 rounded-[10px] bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center mx-auto text-sm font-extrabold font-mono text-[var(--text)] mt-4">
              SM
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight font-display text-[var(--text)]">Administration Console</h1>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Protected via Firebase Authentication for <span className="font-mono text-[var(--text)]">wrickbusiness@gmail.com</span>
            </p>
          </div>

          <div className="card p-6 md:p-8 relative overflow-hidden space-y-5">
            {authError && (
              <div className="p-3 bg-[var(--surface)] border border-[var(--danger)]/40 rounded-[6px] text-[var(--danger)] text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <div className="p-3.5 bg-[var(--surface)] border border-[var(--border)] rounded-[6px] space-y-1.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-[var(--text)] font-display">
                <ShieldCheck className="w-4 h-4 text-[var(--accent)]" />
                <span>Server-Verified Firebase ID Token</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                Sign in with the authorized owner Google account. API requests carry a short-lived Bearer token verified server-side.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={authLoading}
              className="btn btn-primary w-full text-xs tracking-wider uppercase"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{authLoading ? "Verifying Google Session..." : "Sign in with Google"}</span>
            </button>

            <div className="text-center">
              <span className="text-[10px] text-[var(--text-faint)] font-mono">
                Unauthorized Google accounts are rejected server-side (403)
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans">
      <title>Admin Dashboard CMS - Sayam Mukherjee</title>

      <header className="border-b border-[var(--border)] bg-[var(--bg)]/95 sticky top-0 z-30 py-4 px-6 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a href="/" className="p-2 bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-strong)] rounded-[6px] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors" title="Back to site">
              <ArrowLeft className="w-4 h-4" />
            </a>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[var(--text)] font-display">Administrative Console</span>
                <span className="text-[10px] font-mono text-[var(--success)] uppercase tracking-wider">· FIREBASE_VERIFIED</span>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] font-mono">Signed in: {adminEmail || "wrickbusiness@gmail.com"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAdminPayloads}
              className="p-2 bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-strong)] text-[var(--text-muted)] hover:text-[var(--text)] rounded-[6px] transition-colors cursor-pointer"
              title="Synchronize database parameters"
            >
              <RefreshCw className={`w-4 h-4 ${analyticsLoading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => void logoutAdmin()}
              className="btn btn-secondary !min-h-[36px] !px-3 !py-1.5 text-xs border-[var(--danger)]/40 text-[var(--danger)] hover:!bg-[var(--danger)] hover:!text-white hover:!border-[var(--danger)]"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3 space-y-1.5">
          <span className="text-[10px] font-mono text-[var(--text-faint)] uppercase tracking-widest block px-3 pb-1">CMS Database Entities</span>

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
            { id: "testimonials", label: "Testimonials Approve", icon: <HelpCircle className="w-4 h-4" />, count: adminTestimonials.filter(t => !t.approved).length }
          ].map((tb) => (
            <button
              key={tb.id}
              onClick={() => {
                setActiveTab(tb.id as any);
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
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[6px] text-xs font-medium cursor-pointer transition-colors ${
                activeTab === tb.id
                  ? "bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--text)] font-bold"
                  : "bg-transparent border border-transparent hover:bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {tb.icon}
                <span>{tb.label}</span>
              </div>
              {tb.count !== undefined && tb.count > 0 && (
                <span className="bg-[#C7E34A] text-[#20231D] font-bold font-mono text-[10px] px-2 py-0.5 rounded-[4px] tabular-nums">{tb.count}</span>
              )}
            </button>
          ))}
        </aside>

        <main className="lg:col-span-9 space-y-6">
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card p-5 relative overflow-hidden">
                  <span className="text-[10px] font-mono text-[var(--text-faint)] uppercase">Recorded Page Views</span>
                  <p className="text-2xl font-bold font-display text-[var(--text)] mt-1 tabular-nums">
                    {analyticsData?.totalVisits ?? 0}
                  </p>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono block mt-2">
                    {analyticsData?.uniqueSessions ?? 0} unique session(s)
                  </span>
                </div>

                <div className="card p-5">
                  <span className="text-[10px] font-mono text-[var(--text-faint)] uppercase">Avg Session Duration</span>
                  <p className="text-2xl font-bold font-display text-[var(--text)] mt-1 tabular-nums">
                    {analyticsData && analyticsData.avgDurationSec > 0
                      ? `${Math.floor(analyticsData.avgDurationSec / 60)}m ${analyticsData.avgDurationSec % 60}s`
                      : "0m 0s"}
                  </p>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono block mt-2">Measured via dwell beacons</span>
                </div>

                <div className="card p-5">
                  <span className="text-[10px] font-mono text-[var(--text-faint)] uppercase">Bounce Rate</span>
                  <p className="text-2xl font-bold font-display text-[var(--text)] mt-1 tabular-nums">
                    {analyticsData?.bounceRatePct ?? 0}%
                  </p>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono block mt-2">Single-page exits &lt;10s</span>
                </div>

                <div className="card p-5">
                  <span className="text-[10px] font-mono text-[var(--text-faint)] uppercase">Inquiry Conversion</span>
                  <p className="text-2xl font-bold font-display text-[var(--text)] mt-1 tabular-nums">
                    {analyticsData?.conversionRatePct ?? 0}%
                  </p>
                  <span className="text-[10px] text-[var(--accent)] font-mono block mt-2">Persisted contact dispatches</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text)]">Traffic Volume (14-Day rolling)</h3>
                    <p className="text-[10px] text-[var(--text-muted)] font-mono">Consent-gated Firestore visit events</p>
                  </div>
                  <div className="h-56">
                    {analyticsData?.timelineChart && analyticsData.timelineChart.some((p: any) => p.Visitors > 0) ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analyticsData.timelineChart}>
                          <defs>
                            <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#69734A" stopOpacity={0.28} />
                              <stop offset="95%" stopColor="#69734A" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="date" stroke="var(--chart-axis)" tick={{ fontSize: 9, fontFamily: "monospace" }} />
                          <YAxis stroke="var(--chart-axis)" tick={{ fontSize: 9, fontFamily: "monospace" }} allowDecimals={false} />
                          <ChartTooltip contentStyle={{ background: "var(--chart-tooltip-bg)", border: "1px solid var(--chart-tooltip-border)", color: "var(--chart-tooltip-text)", fontSize: 10, borderRadius: 6 }} />
                          <Area type="monotone" dataKey="Visitors" stroke="#69734A" fillOpacity={1} fill="url(#colorVisits)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-[var(--text-muted)] font-mono">
                        No recorded analytics events yet.
                      </div>
                    )}
                  </div>
                </div>

                <div className="card p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text)]">Top Visited Views</h3>
                    <p className="text-[10px] text-[var(--text-muted)] font-mono">Measured page views without geo-IP profiling</p>
                  </div>
                  <div className="h-56">
                    {analyticsData?.pageChart && analyticsData.pageChart.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.pageChart.slice(0, 6)}>
                          <XAxis dataKey="name" stroke="var(--chart-axis)" fontSize={9} />
                          <YAxis stroke="var(--chart-axis)" fontSize={9} allowDecimals={false} />
                          <ChartTooltip contentStyle={{ background: "var(--chart-tooltip-bg)", border: "1px solid var(--chart-tooltip-border)", color: "var(--chart-tooltip-text)", fontSize: 10, borderRadius: 6 }} />
                          <Bar dataKey="value" fill="#C7E34A" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-[var(--text-muted)] font-mono">
                        No page view events recorded yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-5 space-y-4 md:col-span-2">
                  <h3 className="text-sm font-bold text-[var(--text)]">Acquisition Sources Index</h3>
                  {analyticsData?.sourceChart && analyticsData.sourceChart.length > 0 ? (
                    <div className="grid grid-cols-2 items-center gap-4">
                      <div className="h-40">
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
                              {analyticsData.sourceChart.map((_entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <ChartTooltip contentStyle={{ background: "var(--chart-tooltip-bg)", border: "1px solid var(--chart-tooltip-border)", color: "var(--chart-tooltip-text)", fontSize: 10, borderRadius: 6 }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        {analyticsData.sourceChart.map((sc: any, index: number) => (
                          <div key={sc.name} className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-[2px] shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span className="text-[var(--text-muted)] font-mono">{sc.name}</span>
                            <span className="text-[var(--text)] font-bold font-mono ml-auto tabular-nums">{sc.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-32 flex items-center justify-center text-xs text-[var(--text-muted)] font-mono">
                      No acquisition source events recorded yet.
                    </div>
                  )}
                </div>

                <div className="card p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text)]">Device Segments</h3>
                    <p className="text-[10px] text-[var(--text-muted)] font-mono">Mobile, tablet &amp; desktop breakdown</p>
                  </div>

                  <div className="space-y-3.5 pt-2">
                    {analyticsData?.deviceChart && analyticsData.deviceChart.length > 0 ? (
                      analyticsData.deviceChart.map((dv: any) => {
                        const pct = analyticsData?.totalVisits > 0
                          ? Math.round((dv.value / analyticsData.totalVisits) * 100)
                          : 0;
                        return (
                          <div key={dv.name} className="space-y-1 text-xs">
                            <div className="flex justify-between font-mono">
                              <span className="flex items-center gap-1.5 text-[var(--text-muted)] capitalize">
                                {dv.name === "Desktop" ? <Laptop className="w-3.5 h-3.5" /> : dv.name === "Mobile" ? <Smartphone className="w-3.5 h-3.5" /> : <Tablet className="w-3.5 h-3.5" />}
                                {dv.name}
                              </span>
                              <span className="text-[var(--text)] font-bold tabular-nums">{pct}%</span>
                            </div>
                            <div className="w-full bg-[var(--surface-3)] h-1.5 rounded-[4px] overflow-hidden">
                              <div className="bg-[var(--accent)] h-full rounded-[4px] transition-all" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-6 text-center text-xs text-[var(--text-muted)] font-mono">
                        No device telemetry recorded yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-[var(--text)] font-display">Manage Portfolio Projects</h3>
                  <p className="text-xs text-[var(--text-muted)] font-mono">Manage case study parameters and technology tags</p>
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
                      imageUrl: "",
                      featured: false,
                      githubUrl: "",
                      demoUrl: "",
                      metrics: []
                    });
                  }}
                  className="btn btn-primary !min-h-[36px] !px-3.5 !py-1.5 text-xs"
                >
                  <Plus className="w-4 h-4" /> Add Project
                </button>
              </div>

              {editingProject && (
                <div className="card p-6 space-y-4 border-[var(--border-strong)]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] font-mono">
                    {isAddingProject ? "Add New Project" : "Edit Project Configuration"}
                  </h4>

                  <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Project Title</span>
                        <input
                          type="text"
                          required
                          value={editingProject.title || ""}
                          onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                          className="w-full bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--accent)] rounded-[6px] px-3 py-2 text-[var(--text)] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Sector Classification</span>
                        <select
                          value={editingProject.category || "ai_ml"}
                          onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                          className="w-full bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--accent)] rounded-[6px] px-3 py-2 text-[var(--text)] outline-none"
                        >
                          <option value="ai_ml">Artificial Intelligence & ML</option>
                          <option value="full_stack">Full-Stack Development</option>
                          <option value="systems">Systems & Algorithms</option>
                          <option value="design_media">Branding & Media</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Short Description (Summary)</span>
                      <input
                        type="text"
                        required
                        value={editingProject.description || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                        className="w-full bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--accent)] rounded-[6px] px-3 py-2 text-[var(--text)] outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase font-bold">Case Study Long Description (Markdown / Detailed Brief)</span>
                      <textarea
                        rows={6}
                        value={editingProject.longDescription || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, longDescription: e.target.value })}
                        className="w-full bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--accent)] rounded-[6px] px-3 py-2 text-[var(--text)] outline-none font-mono text-[11px] leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Image URL</span>
                        <input
                          type="text"
                          value={editingProject.imageUrl || ""}
                          onChange={(e) => setEditingProject({ ...editingProject, imageUrl: e.target.value })}
                          className="w-full bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--accent)] rounded-[6px] px-3 py-2 text-[var(--text)] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">GitHub Repository URL</span>
                        <input
                          type="text"
                          value={editingProject.githubUrl || ""}
                          onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                          className="w-full bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--accent)] rounded-[6px] px-3 py-2 text-[var(--text)] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Live Demo URL</span>
                        <input
                          type="text"
                          value={editingProject.demoUrl || ""}
                          onChange={(e) => setEditingProject({ ...editingProject, demoUrl: e.target.value })}
                          className="w-full bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--accent)] rounded-[6px] px-3 py-2 text-[var(--text)] outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Technology Tags (Comma split)</span>
                        <input
                          type="text"
                          placeholder="React, PyTorch, OpenCV"
                          value={editingProject.tags?.join(", ") || ""}
                          onChange={(e) => setEditingProject({ ...editingProject, tags: e.target.value.split(",").map(t => t.trim()) })}
                          className="w-full bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--accent)] rounded-[6px] px-3 py-2 text-[var(--text)] outline-none"
                        />
                      </div>
                      <div className="space-y-1 pt-6 flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="feat-chk"
                          checked={editingProject.featured || false}
                          onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                          className="w-4 h-4 accent-[#69734A] rounded-[4px]"
                        />
                        <label htmlFor="feat-chk" className="text-[10px] uppercase font-mono text-[var(--text-muted)] cursor-pointer">Feature on main hero reel</label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProject(null);
                          setIsAddingProject(false);
                        }}
                        className="btn btn-secondary !min-h-[36px] !px-4 !py-1.5 text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary !min-h-[36px] !px-5 !py-1.5 text-xs"
                      >
                        Save Configuration
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portfolioData.projects.map((proj) => (
                  <div key={proj.id} className="card p-5 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-[var(--text)] font-display text-sm truncate max-w-[220px]">{proj.title}</h4>
                        <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] shrink-0">{proj.category}</span>
                      </div>
                      <p className="text-[var(--text-muted)] text-[11px] line-clamp-2 leading-relaxed">{proj.description}</p>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-[var(--border)]">
                      <button
                        onClick={() => {
                          setEditingProject(proj);
                          setIsAddingProject(false);
                        }}
                        className="p-1.5 bg-[var(--surface)] hover:bg-[var(--surface-3)] border border-[var(--border)] rounded-[6px] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-1.5 bg-[var(--surface)] hover:bg-[var(--danger)]/15 border border-[var(--border)] hover:border-[var(--danger)]/40 rounded-[6px] text-[var(--danger)] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "blogs" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-[var(--text)] font-display">Manage Portfolio Blogs</h3>
                  <p className="text-xs text-[var(--text-muted)] font-mono">Create and edit engineering journal markdown articles</p>
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
                  className="btn btn-primary !min-h-[36px] !px-3.5 !py-1.5 text-xs"
                >
                  <Plus className="w-4 h-4" /> Add Blog Post
                </button>
              </div>

              {editingBlog && (
                <div className="card p-6 space-y-4 border-[var(--border-strong)]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] font-mono">
                    {isAddingBlog ? "Draft New Blog Post" : "Edit Blog Post Configuration"}
                  </h4>

                  <form onSubmit={handleSaveBlog} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Post Title</span>
                        <input
                          type="text"
                          required
                          value={editingBlog.title || ""}
                          onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                          className="w-full bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--accent)] rounded-[6px] px-3 py-2 text-[var(--text)] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Category</span>
                        <input
                          type="text"
                          required
                          value={editingBlog.category || ""}
                          onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                          className="w-full bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--accent)] rounded-[6px] px-3 py-2 text-[var(--text)] outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Excerpt Summary</span>
                        <input
                          type="text"
                          required
                          value={editingBlog.excerpt || ""}
                          onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                          className="w-full bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--accent)] rounded-[6px] px-3 py-2 text-[var(--text)] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Estimated Read Time</span>
                        <input
                          type="text"
                          placeholder="6 min read"
                          value={editingBlog.readTime || ""}
                          onChange={(e) => setEditingBlog({ ...editingBlog, readTime: e.target.value })}
                          className="w-full bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--accent)] rounded-[6px] px-3 py-2 text-[var(--text)] outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase font-bold">Post Markdown Content</span>
                      <textarea
                        rows={8}
                        required
                        value={editingBlog.content || ""}
                        onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                        className="w-full bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--accent)] rounded-[6px] px-3 py-2 text-[var(--text)] outline-none font-mono text-[11px] leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Keywords & Tags (Comma separated)</span>
                      <input
                        type="text"
                        placeholder="YOLOv8, PyTorch, Edge AI"
                        value={editingBlog.tags?.join(", ") || ""}
                        onChange={(e) => setEditingBlog({ ...editingBlog, tags: e.target.value.split(",").map(t => t.trim()) })}
                        className="w-full bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--accent)] rounded-[6px] px-3 py-2 text-[var(--text)] outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingBlog(null);
                          setIsAddingBlog(false);
                        }}
                        className="btn btn-secondary !min-h-[36px] !px-4 !py-1.5 text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary !min-h-[36px] !px-5 !py-1.5 text-xs"
                      >
                        Publish Blog Post
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                {portfolioData.blogs.map((b) => (
                  <div key={b.id} className="card p-5 flex items-center justify-between gap-6">
                    <div className="space-y-1 max-w-lg min-w-0">
                      <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] font-mono uppercase">
                        <span className="font-bold text-[var(--accent)]">{b.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{b.date}</span>
                      </div>
                      <h4 className="font-bold text-[var(--text)] font-display text-sm truncate">{b.title}</h4>
                      <p className="text-[var(--text-muted)] text-[11px] line-clamp-1 leading-relaxed">{b.excerpt}</p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingBlog(b);
                          setIsAddingBlog(false);
                        }}
                        className="p-1.5 bg-[var(--surface)] hover:bg-[var(--surface-3)] border border-[var(--border)] rounded-[6px] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(b.id)}
                        className="p-1.5 bg-[var(--surface)] hover:bg-[var(--danger)]/15 border border-[var(--border)] hover:border-[var(--danger)]/40 rounded-[6px] text-[var(--danger)] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "skills" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[var(--text)] font-display">Manage Portfolio Skills Matrix</h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">Update technical categories and proficiency percentages</p>
              </div>

              {editingSkillGroup && (
                <div className="card p-5 space-y-3 border-[var(--border-strong)]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] font-mono">
                    Skill Level Parameters Editor
                  </h4>
                  <form onSubmit={handleSaveSkillLevel} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs items-end">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Skill Name</span>
                      <input
                        type="text"
                        required
                        value={editingSkillGroup.name || ""}
                        onChange={(e) => setEditingSkillGroup({ ...editingSkillGroup, name: e.target.value })}
                        className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-[6px] px-2.5 py-2 text-[var(--text)] outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Level (%)</span>
                      <input
                        type="number"
                        required
                        min={0}
                        max={100}
                        value={editingSkillGroup.level || 0}
                        onChange={(e) => setEditingSkillGroup({ ...editingSkillGroup, level: parseInt(e.target.value) })}
                        className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-[6px] px-2.5 py-2 text-[var(--text)] outline-none font-mono"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setEditingSkillGroup(null)}
                        className="btn btn-secondary !min-h-[34px] !px-3 !py-1.5 text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary !min-h-[34px] !px-4 !py-1.5 text-xs"
                      >
                        Apply
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {portfolioData.skills.map((group, gIdx) => (
                <div key={gIdx} className="card p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-[var(--text)] font-display tracking-tight">{group.category}</h4>
                    <button
                      onClick={() => setEditingSkillGroup({ groupIndex: gIdx, name: "", level: 80, icon: "Code" })}
                      className="btn btn-secondary !min-h-[30px] !px-3 !py-1 text-[11px] font-mono"
                    >
                      + Add Skill
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {group.skills.map((sk, skIdx) => (
                      <div key={skIdx} className="bg-[var(--surface)] border border-[var(--border)] p-3.5 rounded-[8px] flex items-center justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex justify-between text-xs font-mono font-medium">
                            <span className="text-[var(--text)]">{sk.name}</span>
                            <span className="text-[var(--accent)] font-bold tabular-nums">{sk.level}%</span>
                          </div>
                          <div className="w-full bg-[var(--surface-3)] h-1.5 rounded-[4px] overflow-hidden">
                            <div className="bg-[var(--accent)] h-full rounded-[4px]" style={{ width: `${sk.level}%` }} />
                          </div>
                        </div>

                        <div className="flex gap-1">
                          <button
                            onClick={() => setEditingSkillGroup({ groupIndex: gIdx, skillIndex: skIdx, name: sk.name, level: sk.level, icon: sk.icon })}
                            className="p-1 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(gIdx, skIdx)}
                            className="p-1 text-[var(--danger)]/70 hover:text-[var(--danger)] transition-colors cursor-pointer"
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

          {activeTab === "timeline" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-[var(--text)] font-display">Manage Career & Research Timeline</h3>
                  <p className="text-xs text-[var(--text-muted)] font-mono">Update engineering work, research, and milestones</p>
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
                  className="btn btn-primary !min-h-[36px] !px-3.5 !py-1.5 text-xs"
                >
                  <Plus className="w-4 h-4" /> Add Milestone
                </button>
              </div>

              {editingTimeline && (
                <div className="card p-6 space-y-4 text-xs border-[var(--border-strong)]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] font-mono">
                    Timeline Milestone Editor
                  </h4>
                  <form onSubmit={handleSaveTimeline} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Role Title</span>
                        <input
                          type="text"
                          required
                          value={editingTimeline.role || ""}
                          onChange={(e) => setEditingTimeline({ ...editingTimeline, role: e.target.value })}
                          className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-[6px] px-2.5 py-2 text-[var(--text)] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Company / Group</span>
                        <input
                          type="text"
                          required
                          value={editingTimeline.company || ""}
                          onChange={(e) => setEditingTimeline({ ...editingTimeline, company: e.target.value })}
                          className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-[6px] px-2.5 py-2 text-[var(--text)] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Period</span>
                        <input
                          type="text"
                          required
                          value={editingTimeline.period || ""}
                          onChange={(e) => setEditingTimeline({ ...editingTimeline, period: e.target.value })}
                          className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-[6px] px-2.5 py-2 text-[var(--text)] outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Key Tasks & Achievements (One per line)</span>
                      <textarea
                        rows={3}
                        value={editingTimeline.description?.join("\n") || ""}
                        onChange={(e) => setEditingTimeline({ ...editingTimeline, description: e.target.value.split("\n").filter(t => t.trim()) })}
                        className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-[6px] px-2.5 py-2 text-[var(--text)] outline-none font-mono"
                        placeholder="Engineered computer vision tracking pipeline&#10;Built interactive full-stack client applications"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Applied Technology Toolkit (Comma separated)</span>
                      <input
                        type="text"
                        placeholder="PyTorch, React, TypeScript"
                        value={editingTimeline.skills?.join(", ") || ""}
                        onChange={(e) => setEditingTimeline({ ...editingTimeline, skills: e.target.value.split(",").map(t => t.trim()) })}
                        className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-[6px] px-2.5 py-2 text-[var(--text)] outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTimeline(null);
                          setIsAddingTimeline(false);
                        }}
                        className="btn btn-secondary !min-h-[36px] !px-4 !py-1.5 text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary !min-h-[36px] !px-5 !py-1.5 text-xs"
                      >
                        Save Milestone
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-4">
                {portfolioData.experience.map((exp, idx) => (
                  <div key={idx} className="card p-5 flex items-start justify-between gap-6">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 font-mono text-[10px]">
                        <span className="text-[var(--text-muted)]">{exp.period}</span>
                        <span aria-hidden="true" className="text-[var(--text-faint)]">·</span>
                        <span className="text-[var(--accent)] font-bold">{exp.company}</span>
                      </div>
                      <h4 className="font-bold text-[var(--text)] text-sm font-display leading-tight">{exp.role}</h4>
                      <p className="text-[var(--text-muted)] text-[11px] leading-relaxed line-clamp-2">{exp.description[0]}</p>
                    </div>

                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          setEditingTimeline({ ...exp, id: idx as any });
                          setIsAddingTimeline(false);
                        }}
                        className="p-1.5 bg-[var(--surface)] hover:bg-[var(--surface-3)] border border-[var(--border)] rounded-[6px] text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTimeline(idx)}
                        className="p-1.5 bg-[var(--surface)] hover:bg-[var(--danger)]/15 border border-[var(--border)] hover:border-[var(--danger)]/40 rounded-[6px] text-[var(--danger)] cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "learning" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[var(--text)] font-display">Manage Learning Dashboard Progress</h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">Update active coursework and coding progress indicators</p>
              </div>

              <div className="card p-6 space-y-5">
                <span className="text-[10px] uppercase font-mono text-[var(--text-faint)] block">Edit Dynamic Progress Bars</span>

                <div className="space-y-4">
                  {portfolioData.learningDashboard.items.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium text-[var(--text)]">{item.name}</span>
                        <div className="flex items-center gap-3 font-mono font-bold tabular-nums">
                          <span className="text-[var(--accent)]">{item.progress}%</span>
                          <span className="text-[var(--text-muted)] text-[10px]">({item.status})</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={item.progress}
                          onChange={(e) => handleUpdateLearningProgress(idx, parseInt(e.target.value))}
                          className="flex-1 bg-[var(--surface-3)] h-1.5 rounded-[4px] appearance-none cursor-pointer accent-[#69734A]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "certificates" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-[var(--text)] font-display">Manage Credentials Vault (Firestore)</h3>
                  <p className="text-xs text-[var(--text-muted)] font-mono">Create, edit, or unpublish credentials via /api/certificates</p>
                </div>
                <button
                  onClick={() => {
                    setIsAddingCert(true);
                    setEditingCert({
                      title: "",
                      issuer: "",
                      category: "CERTIFICATIONS",
                      issueDate: new Date().getFullYear().toString(),
                      description: "",
                      credentialId: "",
                      credentialUrl: "",
                      imageUrl: "",
                      skills: [],
                      featured: false,
                    });
                  }}
                  className="btn btn-primary !min-h-[36px] !px-3.5 !py-1.5 text-xs"
                >
                  <Plus className="w-4 h-4" /> Add Certificate
                </button>
              </div>

              {editingCert && (
                <div className="card p-6 space-y-4 text-xs border-[var(--border-strong)]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] font-mono">
                    {isAddingCert ? "Add New Credential" : "Edit Credential Record"}
                  </h4>
                  <form onSubmit={handleSaveCert} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Credential Title</span>
                        <input
                          type="text"
                          required
                          value={editingCert.title || ""}
                          onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                          className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-[6px] px-2.5 py-2 text-[var(--text)] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Issuer Authority</span>
                        <input
                          type="text"
                          required
                          value={editingCert.issuer || ""}
                          onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                          className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-[6px] px-2.5 py-2 text-[var(--text)] outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Category</span>
                        <select
                          value={(editingCert.category as string) || "CERTIFICATIONS"}
                          onChange={(e) => setEditingCert({ ...editingCert, category: e.target.value as any })}
                          className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-[6px] px-2.5 py-2 text-[var(--text)] outline-none"
                        >
                          <option value="CERTIFICATIONS">CERTIFICATIONS</option>
                          <option value="ACHIEVEMENTS">ACHIEVEMENTS</option>
                          <option value="COMPETITIONS">COMPETITIONS</option>
                          <option value="COURSES">COURSES</option>
                          <option value="WORKSHOPS">WORKSHOPS</option>
                          <option value="ACADEMIC RECORD">ACADEMIC RECORD</option>
                          <option value="OTHER">OTHER</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Issue Date</span>
                        <input
                          type="text"
                          required
                          placeholder="2026-03"
                          value={editingCert.issueDate || ""}
                          onChange={(e) => setEditingCert({ ...editingCert, issueDate: e.target.value })}
                          className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-[6px] px-2.5 py-2 text-[var(--text)] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Credential ID</span>
                        <input
                          type="text"
                          value={editingCert.credentialId || ""}
                          onChange={(e) => setEditingCert({ ...editingCert, credentialId: e.target.value })}
                          className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-[6px] px-2.5 py-2 text-[var(--text)] outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Verification URL</span>
                        <input
                          type="text"
                          value={editingCert.credentialUrl || ""}
                          onChange={(e) => setEditingCert({ ...editingCert, credentialUrl: e.target.value })}
                          className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-[6px] px-2.5 py-2 text-[var(--text)] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Certificate Image URL</span>
                        <input
                          type="text"
                          value={editingCert.imageUrl || ""}
                          onChange={(e) => setEditingCert({ ...editingCert, imageUrl: e.target.value })}
                          className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-[6px] px-2.5 py-2 text-[var(--text)] outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Description</span>
                      <textarea
                        rows={2}
                        value={editingCert.description || ""}
                        onChange={(e) => setEditingCert({ ...editingCert, description: e.target.value })}
                        className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-[6px] px-2.5 py-2 text-[var(--text)] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Skills (Comma separated)</span>
                        <input
                          type="text"
                          placeholder="Python, Computer Vision"
                          value={editingCert.skills?.join(", ") || ""}
                          onChange={(e) => setEditingCert({ ...editingCert, skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                          className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-[6px] px-2.5 py-2 text-[var(--text)] outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-4">
                        <input
                          type="checkbox"
                          id="cert-feat-chk"
                          checked={Boolean(editingCert.featured)}
                          onChange={(e) => setEditingCert({ ...editingCert, featured: e.target.checked })}
                          className="w-4 h-4 accent-[#69734A] rounded-[4px]"
                        />
                        <label htmlFor="cert-feat-chk" className="text-[10px] uppercase font-mono text-[var(--text-muted)] cursor-pointer">Featured Credential</label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCert(null);
                          setIsAddingCert(false);
                        }}
                        className="btn btn-secondary !min-h-[36px] !px-4 !py-1.5 text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary !min-h-[36px] !px-5 !py-1.5 text-xs"
                      >
                        Save Credentials
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {adminCertificates.map((cert) => (
                  <div key={cert.id} className="card p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      {cert.imageUrl ? (
                        <img src={cert.imageUrl} alt={cert.title} referrerPolicy="no-referrer" className="w-10 h-10 rounded-[6px] object-cover bg-[var(--surface)] shrink-0 border border-[var(--border)]" />
                      ) : (
                        <div className="w-10 h-10 rounded-[6px] bg-[var(--surface)] shrink-0 border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
                          <Award className="w-4 h-4" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="font-bold text-[var(--text)] text-xs leading-snug truncate max-w-[200px]">{cert.title}</h4>
                        <p className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">{cert.issuer} · {cert.issueDate}</p>
                      </div>
                    </div>

                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingCert(cert);
                          setIsAddingCert(false);
                        }}
                        className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
                        aria-label={`Edit ${cert.title}`}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCert(cert.id)}
                        className="p-1.5 text-[var(--danger)]/70 hover:text-[var(--danger)] cursor-pointer"
                        aria-label={`Delete ${cert.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "messages" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-[var(--text)] font-display">Inquiry Transmissions Inbox</h3>
                  <p className="text-xs text-[var(--text-muted)] font-mono">Recorded submissions from the contact form</p>
                </div>
                <button
                  onClick={() => exportToCSV(messages, "sayam_messages_export")}
                  className="btn btn-secondary !min-h-[36px] !px-3.5 !py-1.5 text-xs"
                >
                  <FileSpreadsheet className="w-4 h-4" /> Export CSV
                </button>
              </div>

              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="card py-12 text-center text-xs text-[var(--text-muted)] font-mono">
                    Archive filters clear. No inbound transmissions recorded yet.
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`card p-5 space-y-4 relative ${
                        msg.status === "unread" ? "border-[var(--accent)]" : ""
                      }`}
                    >
                      {msg.status === "unread" && (
                        <span className="absolute top-4 right-4 bg-[#C7E34A] text-[#20231D] font-mono font-bold text-[9px] px-2 py-0.5 rounded-[4px] uppercase">UNREAD</span>
                      )}

                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5 text-xs">
                          <span className="font-bold text-[var(--text)] font-display">{msg.firstName} {msg.lastName}</span>
                          <span className="text-[10px] text-[var(--text-muted)] font-mono">· {msg.email}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[var(--text-muted)] font-mono">
                          <span>Loc: {msg.country || "Bhubaneswar, IN"}</span>
                          <span>· Org: {msg.company || "Independent"}</span>
                          {msg.topic && <span>· Topic: {msg.topic}</span>}
                          <span>· Budget: {msg.budget || "None"}</span>
                          <span>· Timeline: {msg.timeline || "None"}</span>
                          <span>· {msg.createdAt || msg.timestamp ? new Date(msg.createdAt || msg.timestamp).toLocaleString() : "Recent"}</span>
                        </div>
                      </div>

                      <div className="bg-[var(--surface)] border border-[var(--border)] p-3 rounded-[6px] text-xs text-[var(--text-secondary)] leading-relaxed font-mono whitespace-pre-wrap">
                        {msg.message}
                      </div>

                      {msg.attachmentName && (
                        <div className="flex items-center gap-2 text-[10px] text-[var(--accent)] font-mono bg-[var(--surface)] border border-[var(--border)] rounded-[6px] px-3 py-1.5">
                          <FileText className="w-3.5 h-3.5" />
                          <span>Attachment: {msg.attachmentName}</span>
                        </div>
                      )}

                      <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
                        {msg.status !== "archived" && (
                          <button
                            onClick={() => handleMessageAction(msg.id, "archive")}
                            className="btn btn-secondary !min-h-[30px] !px-3 !py-1 text-[11px] font-mono"
                          >
                            <Archive className="w-3.5 h-3.5" /> Archive
                          </button>
                        )}
                        <button
                          onClick={() => handleMessageAction(msg.id, "delete")}
                          className="btn btn-secondary !min-h-[30px] !px-3 !py-1 text-[11px] font-mono border-[var(--danger)]/40 text-[var(--danger)] hover:!bg-[var(--danger)] hover:!text-white hover:!border-[var(--danger)]"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "newsletter" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-5 md:col-span-2 space-y-4">
                  <h4 className="text-xs uppercase font-mono tracking-wider text-[var(--text-muted)]">Broadcast Newsletter</h4>

                  <form onSubmit={handleSendNewsletter} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Subject Header</span>
                      <input
                        type="text"
                        required
                        placeholder="Weekly Deep Learning Brief | YOLOv8 Optimizations"
                        value={newsSubject}
                        onChange={(e) => setNewsSubject(e.target.value)}
                        className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-[6px] px-3 py-2 text-[var(--text)] outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Newsletter Body (Markdown compatible)</span>
                      <textarea
                        rows={5}
                        required
                        placeholder="Compose technical broadcast content details..."
                        value={newsBody}
                        onChange={(e) => setNewsBody(e.target.value)}
                        className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-[6px] px-3 py-2 text-[var(--text)] outline-none font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={subscribers.length === 0 || newsSending}
                      className="btn btn-primary w-full text-xs tracking-wider uppercase disabled:opacity-50"
                    >
                      {newsSending ? "Processing Broadcast..." : `Transmit Broadcast to ${subscribers.length} Subscribers`}
                    </button>
                  </form>
                </div>

                <div className="card p-5 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
                      <h4 className="text-xs uppercase font-mono tracking-wider text-[var(--text-muted)]">Subscribers</h4>
                      <span className="text-[10px] text-[var(--accent)] font-mono font-bold tabular-nums">({subscribers.length})</span>
                    </div>

                    <div className="space-y-2 max-h-56 overflow-y-auto pt-2 text-[11px] font-mono no-scrollbar">
                      {subscribers.map((sub) => (
                        <div key={sub.id} className="flex items-center justify-between gap-3 bg-[var(--surface)] p-2 rounded-[6px] border border-[var(--border)]">
                          <span className="truncate text-[var(--text-secondary)]">{sub.email}</span>
                          <button
                            onClick={() => {
                              triggerConfirm(
                                "Remove Subscriber",
                                `Are you sure you want to remove ${sub.email} from subscribers?`,
                                async () => {
                                  const updated = await deleteAdminSubscriber(sub.id);
                                  setSubscribers(updated);
                                }
                              );
                            }}
                            className="text-[var(--danger)] hover:opacity-80 cursor-pointer"
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
                    className="btn btn-secondary w-full text-xs"
                  >
                    Export Contacts List
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "testimonials" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[var(--text)] font-display">Manage Testimonials Feed</h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">Approve, edit, or reject inbound visitor testimonial requests</p>
              </div>

              <div className="space-y-4">
                {adminTestimonials.length === 0 ? (
                  <div className="card py-12 text-center text-xs text-[var(--text-muted)] font-mono">
                    Testimonials registry empty.
                  </div>
                ) : (
                  adminTestimonials.map((test) => (
                    <div key={test.id} className="card p-5 flex items-center justify-between gap-6">
                      <div className="space-y-2 flex-1 max-w-lg">
                        <div className="flex items-center gap-3">
                          <img src={test.avatar} alt={test.name} referrerPolicy="no-referrer" className="w-8 h-8 rounded-[6px] object-cover shrink-0 bg-[var(--surface)] border border-[var(--border)]" />
                          <div>
                            <h4 className="font-bold text-[var(--text)] text-xs leading-none">{test.name}</h4>
                            <p className="text-[10px] text-[var(--text-muted)] font-mono mt-1">{test.role}</p>
                          </div>
                          {!test.approved && (
                            <span className="bg-[var(--surface)] border border-[var(--warning)]/40 px-2 py-0.5 rounded-[4px] text-[9px] font-bold text-[var(--warning)] font-mono uppercase tracking-wider">PENDING</span>
                          )}
                        </div>
                        <p className="text-[var(--text-secondary)] text-xs italic leading-relaxed">&ldquo;{test.content}&rdquo;</p>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        {!test.approved && (
                          <button
                            onClick={() => handleTestimonialAction(test.id, "approve")}
                            className="p-1.5 bg-[var(--surface)] hover:bg-[var(--success)]/15 border border-[var(--border)] hover:border-[var(--success)]/40 text-[var(--success)] rounded-[6px] cursor-pointer"
                            title="Approve to publish on feed"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleTestimonialAction(test.id, "reject")}
                          className="p-1.5 bg-[var(--surface)] hover:bg-[var(--danger)]/15 border border-[var(--border)] hover:border-[var(--danger)]/40 text-[var(--danger)] rounded-[6px] cursor-pointer"
                          title="Reject or delete"
                        >
                          <X className="w-4 h-4" />
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

      <ConfirmationModal
        isOpen={confirmModalState.isOpen}
        title={confirmModalState.title}
        message={confirmModalState.message}
        confirmLabel="Confirm Delete"
        isDestructive={true}
        onConfirm={confirmModalState.onConfirm}
        onCancel={() => setConfirmModalState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
