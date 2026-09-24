import React, { useState, useEffect, useMemo } from "react";
import { Certificate, CertificateCategory, CertificateStats } from "../../types/certificates";
import { INITIAL_CERTIFICATES } from "../../data/initialCertificates";
import { usePortfolio } from "../../context/PortfolioContext";
import CertificateCard from "./CertificateCard";
import CertificateViewerModal from "./CertificateViewerModal";
import {
  Award,
  Search,
  RotateCcw,
  Trophy,
  Layers,
  X,
  ChevronDown,
  ArrowUpDown,
  BookOpen,
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
  const stats: CertificateStats = useMemo(
    () => ({
      total: certificates.length,
      technical: certificates.filter((c) => c.category === "CERTIFICATIONS").length,
      competitions: certificates.filter((c) => c.category === "COMPETITIONS").length,
      achievements: certificates.filter((c) => c.category === "ACHIEVEMENTS").length,
    }),
    [certificates]
  );

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
      if (
        selectedIssuer !== "ALL" &&
        cert.issuer.toLowerCase() !== selectedIssuer.toLowerCase()
      ) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = cert.title.toLowerCase().includes(q);
        const matchesIssuer = cert.issuer.toLowerCase().includes(q);
        const matchesDesc = cert.description
          ? cert.description.toLowerCase().includes(q)
          : false;
        const matchesProject = cert.project
          ? cert.project.toLowerCase().includes(q)
          : false;
        const matchesTheme = cert.theme
          ? cert.theme.toLowerCase().includes(q)
          : false;
        const allTags = cert.tags || cert.skills || [];
        const matchesSkill = allTags.some((s) => s.toLowerCase().includes(q));
        const matchesId = cert.credentialId
          ? cert.credentialId.toLowerCase().includes(q)
          : false;
        if (
          !matchesTitle &&
          !matchesIssuer &&
          !matchesDesc &&
          !matchesProject &&
          !matchesTheme &&
          !matchesSkill &&
          !matchesId
        ) {
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
  }, [
    certificates,
    selectedCategory,
    selectedYear,
    selectedIssuer,
    searchQuery,
    sortBy,
  ]);

  const hasActiveFilters =
    selectedCategory !== "ALL" ||
    selectedYear !== "ALL" ||
    selectedIssuer !== "ALL" ||
    searchQuery.trim() !== "";

  const handleResetFilters = () => {
    setSelectedCategory("ALL");
    setSelectedYear("ALL");
    setSelectedIssuer("ALL");
    setSearchQuery("");
  };

  const CATEGORIES: { id: CertificateCategory; label: string }[] = [
    { id: "ALL", label: "All Credentials" },
    { id: "COMPETITIONS", label: "Competitions" },
    { id: "ACHIEVEMENTS", label: "Achievements" },
    { id: "CERTIFICATIONS", label: "Certifications" },
  ];

  return (
    <div
      className="space-y-8 font-sans pb-20 max-w-[1240px] mx-auto px-4 sm:px-6"
      id="certificates-page"
    >
      {/* 1. EDITORIAL HEADER SECTION */}
      <header
        className={`rounded-2xl border p-6 sm:p-10 transition-colors ${
          isLight
            ? "bg-white border-slate-200/90 shadow-sm"
            : "bg-[#111318]/90 border-white/10"
        }`}
      >
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-sans font-medium text-purple-400">
            <Award className="w-4 h-4 text-purple-500" />
            <span className="tracking-wide uppercase text-[11px] font-semibold">
              Credentials &amp; Milestones
            </span>
          </div>

          <h1
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] ${
              isLight ? "text-slate-900" : "text-[#F5F7FA]"
            }`}
          >
            Certificates &amp; Achievements
          </h1>

          <p
            className={`text-sm sm:text-base leading-relaxed ${
              isLight ? "text-slate-600" : "text-[#A7ADB8]"
            }`}
          >
            A verified record of technical certifications, national competition
            honours, academic milestones, and demonstrated engineering
            competencies.
          </p>
        </div>
      </header>

      {/* 2. REFINED STATISTICS STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            label: "Total Credentials",
            count: stats.total,
            icon: Award,
            category: "ALL" as CertificateCategory,
          },
          {
            label: "Competitions",
            count: stats.competitions,
            icon: Trophy,
            category: "COMPETITIONS" as CertificateCategory,
          },
          {
            label: "Achievements",
            count: stats.achievements,
            icon: BookOpen,
            category: "ACHIEVEMENTS" as CertificateCategory,
          },
          {
            label: "Certifications",
            count: stats.technical,
            icon: Layers,
            category: "CERTIFICATIONS" as CertificateCategory,
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          const isSelected = selectedCategory === item.category;

          return (
            <button
              key={idx}
              onClick={() => setSelectedCategory(item.category)}
              className={`rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-2 transition-all text-left border cursor-pointer ${
                isSelected
                  ? isLight
                    ? "bg-purple-50 border-purple-300 ring-1 ring-purple-300"
                    : "bg-purple-950/20 border-purple-500/40 ring-1 ring-purple-500/30"
                  : isLight
                  ? "bg-white hover:bg-slate-50 border-slate-200"
                  : "bg-[#111318] hover:bg-[#161920] border-white/10"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className={`text-xs font-sans font-medium ${
                    isLight ? "text-slate-500" : "text-[#737A87]"
                  }`}
                >
                  {item.label}
                </span>
                <Icon
                  className={`w-4 h-4 ${
                    isSelected
                      ? "text-purple-500"
                      : isLight
                      ? "text-slate-400"
                      : "text-zinc-500"
                  }`}
                />
              </div>
              <div
                className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                  isLight ? "text-slate-900" : "text-[#F5F7FA]"
                }`}
              >
                {item.count}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. RESTRAINED FILTER CONTROLS */}
      <div
        className={`rounded-2xl p-4 sm:p-5 border space-y-4 ${
          isLight
            ? "bg-white border-slate-200 shadow-sm"
            : "bg-[#111318] border-white/10"
        }`}
      >
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat.id] || 0;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-sans font-medium whitespace-nowrap cursor-pointer flex items-center gap-2 transition-all ${
                  isSelected
                    ? "bg-[#A855F7] text-white"
                    : isLight
                    ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    : "bg-white/[0.05] hover:bg-white/[0.08] text-zinc-300"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-md ${
                    isSelected
                      ? "bg-white/20 text-white font-semibold"
                      : isLight
                      ? "bg-slate-200 text-slate-600"
                      : "bg-white/[0.06] text-zinc-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search and Secondary Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative sm:col-span-2 lg:col-span-2">
            <Search
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
                isLight ? "text-slate-400" : "text-[#737A87]"
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search credentials, projects, issuers..."
              className={`w-full rounded-xl pl-10 pr-9 py-2.5 text-xs font-sans border transition-colors focus:outline-none ${
                isLight
                  ? "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:bg-white"
                  : "bg-[#161920] border-white/10 text-white placeholder-[#737A87] focus:border-purple-500/50"
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
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
              className={`w-full rounded-xl px-3.5 py-2.5 text-xs font-sans transition-colors appearance-none cursor-pointer border focus:outline-none ${
                isLight
                  ? "bg-slate-50 border-slate-200 text-slate-800 focus:border-purple-500"
                  : "bg-[#161920] border-white/10 text-zinc-200 focus:border-purple-500/50"
              }`}
            >
              <option value="ALL">All Years</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  Year: {yr}
                </option>
              ))}
            </select>
            <ChevronDown
              className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${
                isLight ? "text-slate-400" : "text-[#737A87]"
              }`}
            />
          </div>

          {/* Issuer Filter */}
          <div className="relative">
            <select
              value={selectedIssuer}
              onChange={(e) => setSelectedIssuer(e.target.value)}
              className={`w-full rounded-xl px-3.5 py-2.5 text-xs font-sans transition-colors appearance-none cursor-pointer truncate border focus:outline-none ${
                isLight
                  ? "bg-slate-50 border-slate-200 text-slate-800 focus:border-purple-500"
                  : "bg-[#161920] border-white/10 text-zinc-200 focus:border-purple-500/50"
              }`}
            >
              <option value="ALL">All Issuers</option>
              {availableIssuers.map((iss) => (
                <option key={iss} value={iss}>
                  {iss}
                </option>
              ))}
            </select>
            <ChevronDown
              className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${
                isLight ? "text-slate-400" : "text-[#737A87]"
              }`}
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`w-full rounded-xl px-3.5 py-2.5 text-xs font-sans transition-colors appearance-none cursor-pointer truncate border focus:outline-none ${
                isLight
                  ? "bg-slate-50 border-slate-200 text-slate-800 focus:border-purple-500"
                  : "bg-[#161920] border-white/10 text-zinc-200 focus:border-purple-500/50"
              }`}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="title">Sort: Title (A-Z)</option>
            </select>
            <ArrowUpDown
              className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${
                isLight ? "text-slate-400" : "text-[#737A87]"
              }`}
            />
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div
            className={`flex items-center justify-between gap-3 pt-2 text-xs border-t ${
              isLight ? "border-slate-200" : "border-white/[0.08]"
            }`}
          >
            <div
              className={`text-[11px] ${
                isLight ? "text-slate-600" : "text-[#A7ADB8]"
              }`}
            >
              Showing {filteredCertificates.length} matching credential
              {filteredCertificates.length === 1 ? "" : "s"}
            </div>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition-colors font-sans cursor-pointer text-[11px] font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. PROFESSIONAL 2-COLUMN GRID (Desktop 2 cols, mobile 1 col) */}
      <div className="space-y-6">
        {filteredCertificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCertificates.map((cert) => (
              <CertificateCard
                key={cert.id}
                certificate={cert}
                onView={(c) => setViewingCertificate(c)}
              />
            ))}
          </div>
        ) : (
          /* Clean Empty State */
          <div
            className={`rounded-2xl border p-12 text-center max-w-lg mx-auto space-y-4 ${
              isLight
                ? "bg-white border-slate-200 text-slate-900"
                : "bg-[#111318] border-white/10 text-white"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl mx-auto flex items-center justify-center border ${
                isLight
                  ? "bg-slate-100 border-slate-200 text-slate-600"
                  : "bg-white/[0.05] border-white/10 text-purple-400"
              }`}
            >
              <Award className="w-6 h-6 opacity-80" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold">
                No matching credentials found
              </h3>
              <p
                className={`text-xs leading-relaxed max-w-sm mx-auto ${
                  isLight ? "text-slate-500" : "text-[#737A87]"
                }`}
              >
                No certificates match your query. Try resetting your filters to
                view all credentials in the archive.
              </p>
            </div>

            <button
              onClick={handleResetFilters}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-sans transition-all cursor-pointer border ${
                isLight
                  ? "bg-slate-900 hover:bg-slate-800 text-white border-slate-900"
                  : "bg-white/[0.08] hover:bg-white/[0.14] text-white border-white/10"
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* 5. REFINED MODAL VIEWER */}
      <CertificateViewerModal
        certificate={viewingCertificate}
        onClose={() => setViewingCertificate(null)}
      />
    </div>
  );
}
