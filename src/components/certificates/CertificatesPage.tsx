import React, { useState, useEffect, useMemo } from "react";
import { Certificate, CertificateCategory, CertificateStats } from "../../types/certificates";
import { usePortfolio } from "../../context/PortfolioContext";
import CertificateCard from "./CertificateCard";
import CertificateViewerModal from "./CertificateViewerModal";
import AddCertificateModal from "./AddCertificateModal";
import OwnerAccessModal from "./OwnerAccessModal";
import VaultAdminMenuModal from "./VaultAdminMenuModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { 
  Award, Search, Filter, Plus, Lock, Unlock, RotateCcw, 
  Sparkles, CheckCircle2, ShieldCheck, Trophy, Layers, BookOpen, 
  Calendar, KeyRound, AlertCircle, X, ChevronDown, Check,
  SlidersHorizontal, ArrowUpDown
} from "lucide-react";

export default function CertificatesPage() {
  const { theme } = usePortfolio();
  const isLight = theme === "light";

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [stats, setStats] = useState<CertificateStats>({ total: 0, technical: 0, competitions: 0, achievements: 0 });
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<CertificateCategory>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("ALL");
  const [selectedIssuer, setSelectedIssuer] = useState<string>("ALL");
  const [selectedSkill, setSelectedSkill] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");

  // Modals & Viewer State
  const [viewingCertificate, setViewingCertificate] = useState<Certificate | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [deletingCert, setDeletingCert] = useState<Certificate | null>(null);

  // Owner Authentication State
  const [isOwner, setIsOwner] = useState(false);
  const [vaultToken, setVaultToken] = useState("");
  const [isOwnerAccessModalOpen, setIsOwnerAccessModalOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  // Check existing session status on mount via /api/admin/session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const savedToken = typeof window !== "undefined" ? sessionStorage.getItem("vault_token") : null;
        const headers: Record<string, string> = {};
        if (savedToken) headers["Authorization"] = `Bearer ${savedToken}`;

        const res = await fetch("/api/admin/session", {
          credentials: "include",
          headers,
        });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setIsOwner(true);
            const activeToken = data.token || savedToken || "";
            setVaultToken(activeToken);
            if (activeToken) {
              try {
                sessionStorage.setItem("vault_token", activeToken);
              } catch {}
            }
          } else {
            setIsOwner(false);
            setVaultToken("");
            try {
              sessionStorage.removeItem("vault_token");
            } catch {}
          }
        }
      } catch (err) {
        console.error("Session verification error:", err);
      }
    };
    checkSession();
  }, []);

  // Fetch certificates and stats
  const fetchData = async () => {
    setLoading(true);
    try {
      const [certsRes, statsRes] = await Promise.all([
        fetch("/api/certificates"),
        fetch("/api/certificates/stats"),
      ]);
      if (certsRes.ok) {
        const certsData = await certsRes.json();
        setCertificates(certsData);
      }
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err) {
      console.error("Failed to load certificates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Extract unique filter options from data
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    certificates.forEach((c) => {
      if (c.issueDate) {
        const match = c.issueDate.match(/\b(19\d\d|20\d\d)\b/);
        if (match) years.add(match[1]);
      }
    });
    return Array.from(years).sort().reverse();
  }, [certificates]);

  const availableIssuers = useMemo(() => {
    const issuers = new Set<string>();
    certificates.forEach((c) => {
      if (c.issuer) issuers.add(c.issuer);
    });
    return Array.from(issuers).sort();
  }, [certificates]);

  const availableSkills = useMemo(() => {
    const skills = new Set<string>();
    certificates.forEach((c) => {
      if (Array.isArray(c.skills)) {
        c.skills.forEach((s) => skills.add(s));
      }
    });
    return Array.from(skills).sort();
  }, [certificates]);

  // Category Counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: certificates.length };
    certificates.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return counts;
  }, [certificates]);

  // Filtered & Sorted Certificates
  const filteredCertificates = useMemo(() => {
    const result = certificates.filter((cert) => {
      // Category filter
      if (selectedCategory !== "ALL" && cert.category !== selectedCategory) {
        return false;
      }
      // Year filter
      if (selectedYear !== "ALL" && !cert.issueDate.includes(selectedYear)) {
        return false;
      }
      // Issuer filter
      if (selectedIssuer !== "ALL" && cert.issuer.toLowerCase() !== selectedIssuer.toLowerCase()) {
        return false;
      }
      // Skill filter
      if (selectedSkill !== "ALL" && !cert.skills.some((s) => s.toLowerCase() === selectedSkill.toLowerCase())) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = cert.title.toLowerCase().includes(q);
        const matchesIssuer = cert.issuer.toLowerCase().includes(q);
        const matchesDesc = cert.description ? cert.description.toLowerCase().includes(q) : false;
        const matchesSkill = cert.skills.some((s) => s.toLowerCase().includes(q));
        const matchesId = cert.credentialId ? cert.credentialId.toLowerCase().includes(q) : false;
        if (!matchesTitle && !matchesIssuer && !matchesDesc && !matchesSkill && !matchesId) {
          return false;
        }
      }
      return true;
    });

    // Sorting
    return result.sort((a, b) => {
      if (sortBy === "newest") {
        return (b.issueDate || "").localeCompare(a.issueDate || "");
      }
      if (sortBy === "oldest") {
        return (a.issueDate || "").localeCompare(b.issueDate || "");
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [certificates, selectedCategory, selectedYear, selectedIssuer, selectedSkill, searchQuery, sortBy]);

  const hasActiveFilters = 
    selectedCategory !== "ALL" || 
    selectedYear !== "ALL" || 
    selectedIssuer !== "ALL" || 
    selectedSkill !== "ALL" || 
    searchQuery.trim() !== "";

  const handleResetFilters = () => {
    setSelectedCategory("ALL");
    setSelectedYear("ALL");
    setSelectedIssuer("ALL");
    setSelectedSkill("ALL");
    setSearchQuery("");
  };

  const handleLockVault = async () => {
    try {
      const headers: Record<string, string> = {};
      const token = vaultToken || (typeof window !== "undefined" ? sessionStorage.getItem("vault_token") : null);
      if (token) headers["Authorization"] = `Bearer ${token}`;

      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
        headers,
      });
    } catch (err) {
      console.error("Logout request error:", err);
    } finally {
      setIsOwner(false);
      setVaultToken("");
      try {
        sessionStorage.removeItem("vault_token");
      } catch {}
    }
  };

  // Card Operations
  const handleEdit = (cert: Certificate) => {
    setEditingCertificate(cert);
    setIsAddModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    const cert = certificates.find((c) => c.id === id);
    if (cert) {
      setDeletingCert(cert);
    }
  };

  const handleConfirmDelete = async (id: string) => {
    const headers: Record<string, string> = {};
    const token = vaultToken || (typeof window !== "undefined" ? sessionStorage.getItem("vault_token") : null);
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`/api/certificates/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers,
    });

    if (res.ok) {
      await fetchData();
    } else if (res.status === 401) {
      setIsOwner(false);
      setVaultToken("");
      try {
        sessionStorage.removeItem("vault_token");
      } catch {}
      throw new Error("Session expired. Please unlock owner access again.");
    } else {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || data.error || "Failed to remove certificate.");
    }
  };

  const handleToggleFeatured = async (cert: Certificate) => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      const token = vaultToken || (typeof window !== "undefined" ? sessionStorage.getItem("vault_token") : null);
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const res = await fetch(`/api/certificates/${cert.id}`, {
        method: "PATCH",
        credentials: "include",
        headers,
        body: JSON.stringify({ featured: !cert.featured }),
      });
      if (res.ok) {
        await fetchData();
      } else if (res.status === 401) {
        setIsOwner(false);
        setVaultToken("");
        try {
          sessionStorage.removeItem("vault_token");
        } catch {}
        setIsOwnerAccessModalOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const CATEGORIES: CertificateCategory[] = [
    "ALL",
    "CERTIFICATIONS",
    "ACHIEVEMENTS",
    "COMPETITIONS",
    "COURSES",
    "WORKSHOPS",
    "OTHER"
  ];

  return (
    <div className="space-y-6 sm:space-y-8 font-sans pb-16" id="certificates-vault-page">
      {/* 1. COMPACT EDITORIAL HERO (25-30vh) */}
      <div 
        className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border p-6 sm:p-8 md:p-10 transition-all ${
          isLight
            ? "bg-gradient-to-b from-white via-white to-slate-50 border-slate-200/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
            : "bg-gradient-to-b from-[#0f0f18] via-[#0a0a12] to-[#07070b] border-zinc-800/90 shadow-2xl"
        }`}
      >
        {/* Discreet stealth lock icon in top-right corner */}
        <button
          id="stealth-vault-access-lock"
          onClick={() => {
            if (isOwner) {
              setIsAdminMenuOpen(true);
            } else {
              setIsOwnerAccessModalOpen(true);
            }
          }}
          className={`absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-xl transition-all cursor-pointer z-20 ${
            isOwner
              ? isLight
                ? "bg-purple-100 text-purple-700 border border-purple-200 shadow-sm"
                : "bg-purple-950/60 text-purple-300 border border-purple-800/60"
              : isLight
                ? "text-slate-400 hover:text-slate-700 hover:bg-slate-100 opacity-60 hover:opacity-100"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.05] opacity-40 hover:opacity-100"
          }`}
          title={isOwner ? "Owner Session Active — Click for controls" : "Vault Access Key"}
          aria-label="Owner Access Key"
        >
          {isOwner ? <Unlock className="w-4 h-4 text-purple-500" /> : <Lock className="w-4 h-4" />}
        </button>

        {/* Ambient background accents */}
        <div className="absolute inset-0 tech-grid-bg opacity-15 pointer-events-none" />
        <div className={`absolute top-0 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none ${isLight ? "bg-purple-300/20" : "bg-purple-600/10"}`} />
        <div className={`absolute bottom-0 left-10 w-72 h-72 rounded-full blur-3xl pointer-events-none ${isLight ? "bg-cyan-300/20" : "bg-cyan-600/10"}`} />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div 
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-widest uppercase font-bold border ${
              isLight 
                ? "bg-purple-50 border-purple-200 text-purple-700 shadow-xs" 
                : "bg-purple-950/40 border-purple-800/40 text-purple-300"
            }`}
          >
            <Award className="w-3.5 h-3.5 text-purple-500" />
            <span>VERIFIED ARCHIVE • CREDENTIAL REGISTRY</span>
          </div>

          <h1 
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)" }}
            className={`font-bold tracking-tight font-display leading-[1.12] ${
              isLight ? "text-slate-900" : "text-white"
            }`}
          >
            Certificates &amp; Achievements
          </h1>

          <p className={`text-xs sm:text-sm leading-relaxed max-w-2xl font-sans ${
            isLight ? "text-slate-600" : "text-zinc-400"
          }`}>
            A verified record of technical certifications, national competition honours, academic milestones, and demonstrated engineering competencies.
          </p>
        </div>
      </div>

      {/* Owner Mode Action Bar (Only visible when owner is authenticated) */}
      {isOwner && (
        <div 
          id="vault-owner-toolbar"
          className={`flex flex-wrap items-center justify-between gap-3 px-5 py-3 rounded-2xl text-xs border animate-fade-in ${
            isLight
              ? "bg-purple-50/80 border-purple-200 shadow-sm"
              : "bg-purple-950/30 border-purple-800/50"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className={`font-mono font-bold uppercase tracking-wider ${isLight ? "text-purple-800" : "text-purple-300"}`}>
              VAULT ADMIN ACTIVE
            </span>
            <span className={`font-sans hidden sm:inline ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
              · Full credentials management unlocked
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="owner-toolbar-add-certificate-btn"
              onClick={() => {
                setEditingCertificate(null);
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-purple-600/20 transition-all cursor-pointer font-mono"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Certificate</span>
            </button>
            <button
              id="owner-toolbar-lock-vault-btn"
              onClick={handleLockVault}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono transition-colors cursor-pointer border ${
                isLight
                  ? "bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-sm"
                  : "bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border-zinc-800"
              }`}
              title="Lock Vault & Return to Public View"
            >
              <Lock className="w-3.5 h-3.5 text-purple-500" />
              <span>Lock Vault</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. DYNAMIC STATISTICS DASHBOARD STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[
          { 
            label: "TOTAL CREDENTIALS", 
            count: stats.total, 
            icon: Award, 
            color: isLight ? "text-purple-600" : "text-purple-400",
            category: "ALL" as CertificateCategory
          },
          { 
            label: "TECHNICAL", 
            count: stats.technical, 
            icon: Layers, 
            color: isLight ? "text-cyan-600" : "text-cyan-400",
            category: "CERTIFICATIONS" as CertificateCategory
          },
          { 
            label: "COMPETITIONS", 
            count: stats.competitions, 
            icon: Trophy, 
            color: isLight ? "text-amber-600" : "text-amber-400",
            category: "COMPETITIONS" as CertificateCategory
          },
          { 
            label: "ACHIEVEMENTS", 
            count: stats.achievements, 
            icon: CheckCircle2, 
            color: isLight ? "text-emerald-600" : "text-emerald-400",
            category: "ACHIEVEMENTS" as CertificateCategory
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          const isSelected = selectedCategory === item.category;

          return (
            <button
              key={idx}
              onClick={() => setSelectedCategory(item.category)}
              className={`rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-2.5 transition-all text-left border cursor-pointer ${
                isSelected
                  ? isLight
                    ? "bg-purple-50/70 border-purple-400 shadow-sm ring-2 ring-purple-400/20"
                    : "bg-purple-950/25 border-purple-700/80 ring-2 ring-purple-700/30"
                  : isLight
                    ? "bg-white hover:bg-slate-50 border-slate-200 shadow-xs hover:border-slate-300"
                    : "bg-[#0b0b12] hover:bg-[#101018] border-zinc-850 hover:border-zinc-750"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`text-[10px] font-mono tracking-wider uppercase font-semibold ${
                  isLight ? "text-slate-500" : "text-zinc-400"
                }`}>
                  {item.label}
                </span>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div className={`text-2xl sm:text-3xl font-bold font-display ${
                isLight ? "text-slate-900" : "text-white"
              }`}>
                {loading ? "..." : item.count}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. SEARCH & FILTER CONTROLS */}
      <div 
        className={`rounded-2xl p-4 sm:p-5 border space-y-4 ${
          isLight
            ? "bg-white border-slate-200/90 shadow-xs"
            : "bg-[#09090f]/90 border-zinc-850"
        }`}
      >
        {/* Category Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat] || 0;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono tracking-wider uppercase font-semibold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-purple-600 text-white border-purple-500 shadow-sm"
                    : isLight
                      ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                      : "bg-zinc-900/90 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 border-zinc-800"
                }`}
              >
                <span>{cat}</span>
                <span 
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : isLight
                      ? "bg-slate-200 text-slate-700"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search and Secondary Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {/* Search Input */}
          <div className="relative sm:col-span-2 lg:col-span-2">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-slate-400" : "text-zinc-500"}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search credentials, skills, issuers..."
              className={`w-full rounded-xl pl-10 pr-9 py-2 text-xs transition-colors font-sans border focus:outline-none ${
                isLight
                  ? "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:bg-white"
                  : "bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500 focus:border-purple-500"
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Year Filter */}
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className={`w-full rounded-xl px-3.5 py-2 text-xs transition-colors appearance-none cursor-pointer border focus:outline-none ${
                isLight
                  ? "bg-slate-50 border-slate-300 text-slate-800 focus:border-purple-500"
                  : "bg-zinc-950 border-zinc-800 text-zinc-300 focus:border-purple-500"
              }`}
            >
              <option value="ALL">All Years</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  Year: {yr}
                </option>
              ))}
            </select>
            <ChevronDown className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${isLight ? "text-slate-500" : "text-zinc-500"}`} />
          </div>

          {/* Issuer Filter */}
          <div className="relative">
            <select
              value={selectedIssuer}
              onChange={(e) => setSelectedIssuer(e.target.value)}
              className={`w-full rounded-xl px-3.5 py-2 text-xs transition-colors appearance-none cursor-pointer truncate border focus:outline-none ${
                isLight
                  ? "bg-slate-50 border-slate-300 text-slate-800 focus:border-purple-500"
                  : "bg-zinc-950 border-zinc-800 text-zinc-300 focus:border-purple-500"
              }`}
            >
              <option value="ALL">All Issuers</option>
              {availableIssuers.map((iss) => (
                <option key={iss} value={iss}>
                  {iss}
                </option>
              ))}
            </select>
            <ChevronDown className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${isLight ? "text-slate-500" : "text-zinc-500"}`} />
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`w-full rounded-xl px-3.5 py-2 text-xs transition-colors appearance-none cursor-pointer truncate border focus:outline-none ${
                isLight
                  ? "bg-slate-50 border-slate-300 text-slate-800 focus:border-purple-500"
                  : "bg-zinc-950 border-zinc-800 text-zinc-300 focus:border-purple-500"
              }`}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="title">Sort: Title (A-Z)</option>
            </select>
            <ArrowUpDown className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${isLight ? "text-slate-500" : "text-zinc-500"}`} />
          </div>
        </div>

        {/* Active Filters Summary & Reset Button */}
        {hasActiveFilters && (
          <div className={`flex items-center justify-between gap-3 pt-2 text-xs border-t ${isLight ? "border-slate-200" : "border-zinc-850"}`}>
            <div className={`font-mono text-[11px] ${isLight ? "text-slate-600" : "text-zinc-400"}`}>
              Showing {filteredCertificates.length} matching credential{filteredCertificates.length === 1 ? "" : "s"}
            </div>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 text-purple-500 hover:text-purple-400 transition-colors font-mono cursor-pointer text-[11px] font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. ALL CERTIFICATES GRID */}
      <div className="space-y-6">
        {loading ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className={`h-80 rounded-2xl border animate-pulse p-6 space-y-4 ${
                  isLight ? "bg-white border-slate-200" : "bg-zinc-900/50 border-zinc-800/80"
                }`}
              >
                <div className={`w-24 h-5 rounded ${isLight ? "bg-slate-200" : "bg-zinc-800"}`} />
                <div className={`w-full h-36 rounded-xl ${isLight ? "bg-slate-100" : "bg-zinc-850"}`} />
                <div className={`w-3/4 h-5 rounded ${isLight ? "bg-slate-200" : "bg-zinc-800"}`} />
                <div className={`w-1/2 h-4 rounded ${isLight ? "bg-slate-100" : "bg-zinc-850"}`} />
              </div>
            ))}
          </div>
        ) : filteredCertificates.length > 0 ? (
          /* Real Certificates Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredCertificates.map((cert) => (
              <CertificateCard
                key={cert.id}
                certificate={cert}
                onView={(c) => setViewingCertificate(c)}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onToggleFeatured={handleToggleFeatured}
                isOwner={isOwner}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div 
            className={`rounded-3xl border border-dashed p-10 sm:p-14 text-center max-w-xl mx-auto space-y-5 ${
              isLight
                ? "bg-white border-slate-300 text-slate-900"
                : "bg-[#09090f]/70 border-zinc-800 text-white"
            }`}
          >
            <div 
              className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center border shadow-inner ${
                isLight ? "bg-purple-50 border-purple-200 text-purple-600" : "bg-zinc-900 border-zinc-800 text-purple-400"
              }`}
            >
              <Award className="w-8 h-8 opacity-80" />
            </div>

            <div className="space-y-1.5">
              <span className={`text-[11px] font-mono uppercase tracking-widest font-bold ${isLight ? "text-purple-600" : "text-cyan-400"}`}>
                NO MATCHING CREDENTIALS
              </span>
              <h3 className="text-xl font-bold font-display">
                No certificates match your query.
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed max-w-md mx-auto ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                Try resetting your filters or adjusting your search parameters to explore all verified credentials in the archive.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={handleResetFilters}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer border ${
                  isLight
                    ? "bg-slate-900 hover:bg-slate-800 text-white border-slate-900 shadow-sm"
                    : "bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border-zinc-800"
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. MODALS & POPUPS */}
      {/* Certificate Viewer Modal */}
      <CertificateViewerModal
        certificate={viewingCertificate}
        onClose={() => setViewingCertificate(null)}
      />

      {/* Add / Edit Certificate Modal */}
      <AddCertificateModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingCertificate(null);
        }}
        onSaved={fetchData}
        editingCertificate={editingCertificate}
        vaultToken={vaultToken}
      />

      {/* Owner Access Passkey Authentication Modal */}
      <OwnerAccessModal
        isOpen={isOwnerAccessModalOpen}
        onClose={() => setIsOwnerAccessModalOpen(false)}
        onSuccess={(token) => {
          setIsOwner(true);
          setVaultToken(token);
        }}
      />

      {/* Vault Owner Admin Controls Popover / Menu */}
      <VaultAdminMenuModal
        isOpen={isAdminMenuOpen}
        onClose={() => setIsAdminMenuOpen(false)}
        onAddNewCertificate={() => {
          setEditingCertificate(null);
          setIsAddModalOpen(true);
        }}
        onLockVault={handleLockVault}
        totalCertificates={stats.total}
      />

      {/* In-App Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(deletingCert)}
        certificate={deletingCert}
        onClose={() => setDeletingCert(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
