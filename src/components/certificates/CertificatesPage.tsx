import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Certificate, CertificateCategory, CertificateStats } from "../../types/certificates";
import { INITIAL_CERTIFICATES } from "../../data/initialCertificates";
import AchievementGrid from "./AchievementGrid";
import CertificateViewerModal from "./CertificateViewerModal";
import AcademicRecord from "../AcademicRecord";
import { LineReveal, EditorialReveal } from "../../motion/Reveal";
import { ContourBackground } from "../motion/ContourBackground";
import { EditorialSectionHeader } from "../common/EditorialSectionHeader";
import { MOTION_DURATION, MOTION_EASE, usePrefersReducedMotion } from "../../motion/tokens";
import {
  Search,
  RotateCcw,
  X,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";

export default function CertificatesPage() {
  const prefersReduced = usePrefersReducedMotion();
  const [certificates, setCertificates] = useState<Certificate[]>(() => INITIAL_CERTIFICATES);

  const [selectedCategory, setSelectedCategory] = useState<CertificateCategory>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("ALL");
  const [selectedIssuer, setSelectedIssuer] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");
  const [viewingCertificate, setViewingCertificate] = useState<Certificate | null>(null);
  const [modalMode, setModalMode] = useState<"details" | "inspect">("details");

  useEffect(() => {
    fetch("/api/certificates")
      .then((res) => {
        if (res.ok && res.headers.get("content-type")?.includes("application/json")) {
          return res.json();
        }
        return null;
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCertificates(data);
        }
      })
      .catch(() => {});
  }, []);

  const stats: CertificateStats = useMemo(
    () => ({
      total: certificates.length,
      competitions: certificates.filter((c) => c.category === "COMPETITIONS").length,
      academic: certificates.filter(
        (c) => c.category === "ACADEMIC RECORD" || c.category === "Academic Record"
      ).length,
      achievements: certificates.filter((c) => c.category === "ACHIEVEMENTS").length,
      technical: certificates.filter(
        (c) => c.category === "CERTIFICATIONS" || c.category === "COURSES"
      ).length,
    }),
    [certificates]
  );

  const availableYears = useMemo(() => {
    const years = new Set<string>();
    certificates.forEach((c) => {
      if (c.year) {
        years.add(String(c.year));
      }
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

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: certificates.length };
    certificates.forEach((c) => {
      const catKey = c.category.toUpperCase();
      counts[catKey] = (counts[catKey] || 0) + 1;
    });
    return counts;
  }, [certificates]);

  const filteredCertificates = useMemo(() => {
    const result = certificates.filter((cert) => {
      if (selectedCategory !== "ALL") {
        const catA = cert.category.toUpperCase().replace(/S$/, "");
        const catB = selectedCategory.toUpperCase().replace(/S$/, "");
        if (catA !== catB) return false;
      }
      if (
        selectedYear !== "ALL" &&
        !(cert.issueDate || "").includes(selectedYear) &&
        String(cert.year || "") !== selectedYear
      ) {
        return false;
      }
      if (
        selectedIssuer !== "ALL" &&
        cert.issuer.toLowerCase() !== selectedIssuer.toLowerCase()
      ) {
        return false;
      }
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = cert.title.toLowerCase().includes(q);
        const matchesIssuer = cert.issuer.toLowerCase().includes(q);
        const matchesDesc = cert.description ? cert.description.toLowerCase().includes(q) : false;
        const matchesOverview = cert.overview ? cert.overview.toLowerCase().includes(q) : false;
        const matchesFullDesc = cert.fullDescription ? cert.fullDescription.toLowerCase().includes(q) : false;
        const matchesProject = cert.project ? cert.project.toLowerCase().includes(q) : false;
        const matchesEvent = cert.event ? cert.event.toLowerCase().includes(q) : false;
        const matchesTrack = cert.track ? cert.track.toLowerCase().includes(q) : false;
        const matchesTeam = cert.team ? cert.team.toLowerCase().includes(q) : false;
        const matchesContribution = cert.contribution ? cert.contribution.toLowerCase().includes(q) : false;
        const matchesTheme = cert.theme ? cert.theme.toLowerCase().includes(q) : false;
        const matchesSession = cert.session ? cert.session.toLowerCase().includes(q) : false;
        const matchesCredentialType = cert.credentialType ? cert.credentialType.toLowerCase().includes(q) : false;
        const matchesVenue = cert.venue ? cert.venue.toLowerCase().includes(q) : false;
        const matchesOrganizer = cert.organizer ? cert.organizer.toLowerCase().includes(q) : false;
        const matchesCoOrganizer =
          cert.coOrganizer || cert.associatedOrganizer
            ? (cert.coOrganizer || cert.associatedOrganizer)!.toLowerCase().includes(q)
            : false;
        const matchesParticipant = cert.participant ? cert.participant.toLowerCase().includes(q) : false;
        const matchesRecipient = cert.recipient ? cert.recipient.toLowerCase().includes(q) : false;
        const matchesRole = cert.role ? cert.role.toLowerCase().includes(q) : false;
        const matchesDate = cert.date ? cert.date.toLowerCase().includes(q) : false;
        const matchesFacilitator = cert.facilitator ? cert.facilitator.toLowerCase().includes(q) : false;
        const matchesSessionLeader = cert.sessionLeader ? cert.sessionLeader.toLowerCase().includes(q) : false;
        const matchesAchievementClaim = cert.achievementClaim
          ? cert.achievementClaim.toLowerCase().includes(q)
          : false;
        const matchesSourceNote = cert.sourceNote ? cert.sourceNote.toLowerCase().includes(q) : false;
        const matchesSignatories = Array.isArray(cert.signatories)
          ? cert.signatories.some((s) =>
              typeof s === "string"
                ? s.toLowerCase().includes(q)
                : (s as any).name?.toLowerCase().includes(q) ||
                  (s as any).designation?.toLowerCase().includes(q)
            )
          : false;
        const matchesAssociatedProjects = Array.isArray(cert.associatedProjects)
          ? cert.associatedProjects.some(
              (p) =>
                p.name.toLowerCase().includes(q) ||
                (p.description && p.description.toLowerCase().includes(q))
            )
          : false;
        const matchesSubjects = cert.subjects
          ? cert.subjects.some((sub) => sub.toLowerCase().includes(q))
          : false;
        const matchesTeamMembers = Array.isArray(cert.teamMembers)
          ? cert.teamMembers.some((m) => m.toLowerCase().includes(q))
          : false;
        const allTags = cert.tags || cert.skills || [];
        const matchesSkill = allTags.some((s) => s.toLowerCase().includes(q));
        const matchesId = cert.credentialId ? cert.credentialId.toLowerCase().includes(q) : false;

        if (
          !matchesTitle &&
          !matchesIssuer &&
          !matchesDesc &&
          !matchesOverview &&
          !matchesFullDesc &&
          !matchesProject &&
          !matchesEvent &&
          !matchesTrack &&
          !matchesTeam &&
          !matchesContribution &&
          !matchesTeamMembers &&
          !matchesTheme &&
          !matchesSkill &&
          !matchesId &&
          !matchesSession &&
          !matchesCredentialType &&
          !matchesSubjects &&
          !matchesVenue &&
          !matchesOrganizer &&
          !matchesCoOrganizer &&
          !matchesParticipant &&
          !matchesRecipient &&
          !matchesRole &&
          !matchesDate &&
          !matchesFacilitator &&
          !matchesSessionLeader &&
          !matchesAchievementClaim &&
          !matchesSourceNote &&
          !matchesSignatories &&
          !matchesAssociatedProjects
        ) {
          return false;
        }
      }
      return true;
    });

    return result.sort((a, b) => {
      const dateA = a.issueDate || (a.year ? String(a.year) : "");
      const dateB = b.issueDate || (b.year ? String(b.year) : "");
      if (sortBy === "newest") {
        if (!dateA && !dateB) return a.title.localeCompare(b.title);
        if (!dateA) return 1;
        if (!dateB) return -1;
        return dateB.localeCompare(dateA);
      }
      if (sortBy === "oldest") {
        if (!dateA && !dateB) return a.title.localeCompare(b.title);
        if (!dateA) return 1;
        if (!dateB) return -1;
        return dateA.localeCompare(dateB);
      }
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });
  }, [certificates, selectedCategory, selectedYear, selectedIssuer, searchQuery, sortBy]);

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

  const CATEGORIES: { id: CertificateCategory; label: string }[] = useMemo(() => {
    const list: { id: CertificateCategory; label: string }[] = [
      { id: "ALL", label: "All Credentials" },
      { id: "COMPETITIONS", label: "Competitions" },
      { id: "ACHIEVEMENTS", label: "Achievements" },
    ];
    const hasWorkshops = certificates.some(
      (c) => c.category.toUpperCase() === "WORKSHOPS" || c.category.toUpperCase() === "WORKSHOP"
    );
    if (hasWorkshops) list.push({ id: "WORKSHOPS", label: "Workshops" });
    if (stats.academic && stats.academic > 0) {
      list.push({ id: "ACADEMIC RECORD", label: "Grade Reports" });
    }
    if (stats.technical > 0) {
      list.push({ id: "CERTIFICATIONS", label: "Certifications" });
    }
    return list;
  }, [certificates, stats.academic, stats.technical]);

  return (
    <div
      className="w-full space-y-12 font-sans pb-16 sm:pb-20"
      id="certificates-page"
    >
      {/* 1. Editorial Header */}
      <header
        id="certificates-hero"
        className="relative py-4 sm:py-6 border-b border-[var(--border)] scroll-mt-24"
      >
        <ContourBackground density="subtle" />

        <div className="relative z-10">
          <EditorialSectionHeader
            level="h1"
            eyebrow="05 · Credentials & Academic Records"
            title="Certificates &"
            italicHighlight="verified milestones."
            description="An organized ledger of academic transcripts, competition honors, and verified technical credentials with issuer details and source records."
          />
        </div>
      </header>

      {/* 2. Academic Record */}
      <div id="academics-section" className="space-y-4">
        <AcademicRecord />
      </div>

      {/* 3. Credentials Ledger */}
      <section
        className="space-y-6 pt-8 scroll-mt-24"
        id="credentials-vault"
      >
        <LineReveal />
        <EditorialReveal>
          <EditorialSectionHeader
            eyebrow="Archival Ledger"
            title="Competitions &"
            italicHighlight="credentials."
            description="Filter by category, issuer, or year, or inspect full credential documents."
          />
        </EditorialReveal>

        {/* Filter Controls */}
        <div
          className="card p-4 sm:p-5 space-y-4"
          style={{ backgroundColor: "var(--surface-2)", borderColor: "var(--border)" }}
        >
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const count = categoryCounts[cat.id] || 0;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className="px-3.5 py-2 min-h-[44px] sm:min-h-[38px] rounded-[6px] text-xs font-sans font-semibold whitespace-nowrap cursor-pointer flex items-center gap-2 transition-all border active:scale-[0.97]"
                  style={{
                    backgroundColor: isSelected ? "var(--accent-fill)" : "var(--surface)",
                    borderColor: isSelected ? "var(--accent-fill)" : "var(--border)",
                    color: isSelected ? "var(--accent-contrast)" : "var(--text-secondary)",
                  }}
                >
                  <span>{cat.label}</span>
                  <span
                    className="text-[11px] px-1.5 py-0.5 rounded-[4px] font-mono tabular-nums"
                    style={{
                      backgroundColor: isSelected ? "rgba(23,27,18,0.14)" : "var(--surface-2)",
                      color: isSelected ? "var(--accent-contrast)" : "var(--text-muted)",
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Secondary Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="relative sm:col-span-2 lg:col-span-2">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-faint)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search credentials, projects, issuers..."
                className="w-full min-h-[44px] sm:min-h-[40px] rounded-[6px] pl-10 pr-11 py-2 text-base sm:text-xs font-sans border transition-colors focus:outline-none"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                  color: "var(--text)",
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-0.5 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] active:scale-95 active:opacity-80 cursor-pointer"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full min-h-[44px] sm:min-h-[40px] rounded-[6px] px-3.5 py-2 text-base sm:text-xs font-sans transition-colors appearance-none cursor-pointer border focus:outline-none"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                  color: "var(--text)",
                }}
                aria-label="Filter by year"
              >
                <option value="ALL">All Years</option>
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    Year: {yr}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-[var(--text-muted)]" />
            </div>

            <div className="relative">
              <select
                value={selectedIssuer}
                onChange={(e) => setSelectedIssuer(e.target.value)}
                className="w-full min-h-[44px] sm:min-h-[40px] rounded-[6px] px-3.5 py-2 text-base sm:text-xs font-sans transition-colors appearance-none cursor-pointer truncate border focus:outline-none"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                  color: "var(--text)",
                }}
                aria-label="Filter by issuer"
              >
                <option value="ALL">All Issuers</option>
                {availableIssuers.map((iss) => (
                  <option key={iss} value={iss}>
                    {iss}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-[var(--text-muted)]" />
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "title")}
                className="w-full min-h-[44px] sm:min-h-[40px] rounded-[6px] px-3.5 py-2 text-base sm:text-xs font-sans transition-colors appearance-none cursor-pointer truncate border focus:outline-none"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                  color: "var(--text)",
                }}
                aria-label="Sort credentials"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="title">Sort: Title (A-Z)</option>
              </select>
              <ArrowUpDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-[var(--text-muted)]" />
            </div>
          </div>

          {/* Active Filters Summary */}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div
                initial={prefersReduced ? false : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={prefersReduced ? undefined : { opacity: 0, height: 0 }}
                transition={{ duration: prefersReduced ? 0 : MOTION_DURATION.fast, ease: MOTION_EASE.out }}
                className="overflow-hidden"
              >
                <div
                  className="flex items-center justify-between gap-3 pt-3 text-xs border-t"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="font-mono text-[11px] text-[var(--text-muted)]">
                    Showing {filteredCertificates.length} matching credential
                    {filteredCertificates.length === 1 ? "" : "s"}
                  </div>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1.5 min-h-[44px] sm:min-h-[36px] px-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)] hover:underline active:scale-95 active:opacity-80 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Filters</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2-Column Grid */}
        <div className="space-y-6">
          <AchievementGrid
            records={filteredCertificates}
            onViewDetails={(record) => {
              setModalMode("details");
              setViewingCertificate(record as Certificate);
            }}
            onInspect={(record) => {
              setModalMode("inspect");
              setViewingCertificate(record as Certificate);
            }}
            onResetFilters={handleResetFilters}
            columns={2}
          />
        </div>
      </section>

      <CertificateViewerModal
        certificate={viewingCertificate}
        certificates={filteredCertificates}
        initialMode={modalMode}
        onSelectCertificate={setViewingCertificate}
        onClose={() => setViewingCertificate(null)}
      />
    </div>
  );
}
