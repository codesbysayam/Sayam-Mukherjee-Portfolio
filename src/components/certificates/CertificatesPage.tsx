import React, { useState, useEffect, useMemo } from "react";
import { Certificate, CertificateCategory, CertificateStats } from "../../types/certificates";
import { INITIAL_CERTIFICATES } from "../../data/initialCertificates";
import { usePortfolio } from "../../context/PortfolioContext";
import CertificateCard from "./CertificateCard";
import CertificateViewerModal from "./CertificateViewerModal";
import { 
  Award, Search, RotateCcw, 
  CheckCircle2, Trophy, Layers, 
  X, ChevronDown,
  ArrowUpDown
} from "lucide-react";

export default function CertificatesPage() {
  const { theme } = usePortfolio();
  const isLight = theme === "light";

  // Initial Data from clean local archive, with optional background sync
  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    return INITIAL_CERTIFICATES;
  });

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<CertificateCategory>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("ALL");
  const [selectedIssuer, setSelectedIssuer] = useState<string>("ALL");
  const [selectedSkill, setSelectedSkill] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");

  // Modal State for inspecting certificates
  const [viewingCertificate, setViewingCertificate] = useState<Certificate | null>(null);

  // Background sync if /api/certificates is available
  useEffect(() => {
    fetch("/api/certificates")
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCertificates(data);
        }
      })
      .catch(() => {});
  }, []);

  // Reactive Stats derived directly from current certificate data
  const stats: CertificateStats = useMemo(() => ({
    total: certificates.length,
    technical: certificates.filter((c) => c.category === "CERTIFICATIONS").length,
    competitions: certificates.filter((c) => c.category === "COMPETITIONS").length,
    achievements: certificates.filter((c) => c.category === "ACHIEVEMENTS").length,
  }), [certificates]);

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
    <div className="space-y-6 sm:space-y-8 font-sans pb-16" id="certificates-page">
      {/* 1. COMPACT EDITORIAL HERO (25-30vh) */}
      <div 
        className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border p-6 sm:p-8 md:p-10 transition-all ${
          isLight
            ? "bg-gradient-to-b from-white via-white to-slate-50 border-slate-200/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
            : "bg-gradient-to-b from-[#0f0f18] via-[#0a0a12] to-[#07070b] border-zinc-800/90 shadow-2xl"
        }`}
      >
        {/* Ambient background accents */}
        <div className="absolute inset-0 tech-grid-bg opacity-15 pointer-events-none" />
        <div className={`absolute top-0 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none ${isLight ? "bg-purple-300/20" : "bg-purple-600/10"}`} />
        <div className={`absolute bottom-0 left-10 w-72 h-72 rounded-full blur-3xl pointer-events-none ${isLight ? "bg-cyan-300/20" : "bg-cyan-600/10"}`} />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div 
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-wider font-semibold border ${
              isLight 
                ? "bg-purple-50 border-purple-200 text-purple-700 shadow-xs" 
                : "bg-purple-950/40 border-purple-800/40 text-purple-300"
            }`}
          >
            <Award className="w-3.5 h-3.5 text-purple-500" />
            <span>Verified Archive • Credential Registry</span>
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

      {/* 2. DYNAMIC STATISTICS DASHBOARD STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[
          { 
            label: "Total Credentials", 
            count: stats.total, 
            icon: Award, 
            color: isLight ? "text-purple-600" : "text-purple-400",
            category: "ALL" as CertificateCategory
          },
          { 
            label: "Technical", 
            count: stats.technical, 
            icon: Layers, 
            color: isLight ? "text-cyan-600" : "text-cyan-400",
            category: "CERTIFICATIONS" as CertificateCategory
          },
          { 
            label: "Competitions", 
            count: stats.competitions, 
            icon: Trophy, 
            color: isLight ? "text-amber-600" : "text-amber-400",
            category: "COMPETITIONS" as CertificateCategory
          },
          { 
            label: "Achievements", 
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
              className={`rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-2.5 transition-all text-left border cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-500 ${
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
                <span className={`text-xs font-mono tracking-wider font-semibold ${
                  isLight ? "text-slate-500" : "text-zinc-400"
                }`}>
                  {item.label}
                </span>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div className={`text-2xl sm:text-3xl font-bold font-display ${
                isLight ? "text-slate-900" : "text-white"
              }`}>
                {item.count}
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
                className={`btn !py-1.5 !px-3.5 !text-xs whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isSelected ? "btn-primary" : "btn-secondary"
                }`}
              >
                <span>{cat}</span>
                <span 
                  className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
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
        {filteredCertificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredCertificates.map((cert) => (
              <CertificateCard
                key={cert.id}
                certificate={cert}
                onView={(c) => setViewingCertificate(c)}
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

      {/* 5. MODAL VIEWER */}
      <CertificateViewerModal
        certificate={viewingCertificate}
        onClose={() => setViewingCertificate(null)}
      />
    </div>
  );
}
