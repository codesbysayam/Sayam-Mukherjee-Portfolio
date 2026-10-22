import React, { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, Terminal, FileText, Sparkles, Code, Server, AppWindow, Cpu, 
  Mail, ArrowRight, Bookmark, Award, Lock, Shield, Scale, Youtube, 
  ExternalLink, Layers, CheckCircle2
} from "lucide-react";
import { EXTENDED_DATA } from "../data/extendedData";
import { youtubeChannels } from "../data/channels";
import { PROJECTS } from "../data/projects";
import { INITIAL_CERTIFICATES } from "../data/initialCertificates";

export type CommandItemType = "command" | "channel" | "project" | "achievement" | "bookmark";
export type MenuTab = "all" | "commands" | "channels" | "projects" | "achievements" | "bookmarks";

export interface UnifiedSearchItem {
  id: string;
  type: CommandItemType;
  title: string;
  subtitle?: string;
  badge: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  externalUrl?: string;
  searchTarget: string;
}

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: "home" | "about" | "skills" | "ecosystem" | "projects" | "certificates" | "journal" | "contact" | "privacy" | "terms" | "showcase") => void;
  onOpenResume: () => void;
  onTriggerConfetti: () => void;
  onOpenVault?: () => void;
}

/**
 * Robust case-insensitive search normalization utility.
 * Normalizes unicode, trims leading/trailing spaces, converts to lowercase,
 * and collapses repeated whitespace.
 */
export function normalizeSearchText(value: string): string {
  if (!value) return "";
  return value
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("en")
    .replace(/\s+/g, " ");
}

export default function CommandMenu({
  isOpen,
  onClose,
  onNavigate,
  onOpenResume,
  onTriggerConfetti,
  onOpenVault
}: CommandMenuProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const [activeMenuTab, setActiveMenuTab] = useState<MenuTab>("all");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // Sync bookmarks from localStorage
  useEffect(() => {
    const loadBookmarks = () => {
      try {
        const stored = localStorage.getItem("portfolio_reading_list");
        setBookmarkedIds(stored ? JSON.parse(stored) : []);
      } catch {
        setBookmarkedIds([]);
      }
    };

    if (isOpen) {
      loadBookmarks();
    }

    window.addEventListener("portfolio_bookmarks_updated", loadBookmarks);
    return () => window.removeEventListener("portfolio_bookmarks_updated", loadBookmarks);
  }, [isOpen]);

  // Safe external URL opener
  const handleOpenExternal = (url: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    onClose();
  };

  // 1. System Command Items
  const commandItems = useMemo<UnifiedSearchItem[]>(() => [
    {
      id: "nav-home",
      type: "command",
      title: "Navigate to Home Page",
      subtitle: "Hero introduction & engineering overview",
      badge: "COMMAND",
      category: "Navigation",
      icon: AppWindow,
      action: () => { onNavigate("home"); onClose(); },
      searchTarget: "home navigate page hero overview start root"
    },
    {
      id: "nav-about",
      type: "command",
      title: "Navigate to About / Identity Profile",
      subtitle: "Background, routine, education & story",
      badge: "COMMAND",
      category: "Navigation",
      icon: Code,
      action: () => { onNavigate("about"); onClose(); },
      searchTarget: "about identity profile background story education routine kiit"
    },
    {
      id: "nav-skills",
      type: "command",
      title: "Navigate to Technical Skills Matrix",
      subtitle: "Languages, frameworks, tools & live telemetry",
      badge: "COMMAND",
      category: "Navigation",
      icon: Cpu,
      action: () => { onNavigate("skills"); onClose(); },
      searchTarget: "skills technical stack matrix languages frameworks tools telemetry c++ python typescript"
    },
    {
      id: "nav-ecosystem",
      type: "command",
      title: "Navigate to Academic Learning & Ecosystem",
      subtitle: "Architecture diagrams & engineering mechanics",
      badge: "COMMAND",
      category: "Navigation",
      icon: Server,
      action: () => { onNavigate("ecosystem"); onClose(); },
      searchTarget: "ecosystem academic learning architecture diagrams nodes mechanics"
    },
    {
      id: "nav-projects",
      type: "command",
      title: "Navigate to Engineered Case Studies",
      subtitle: "All 5 verified production builds",
      badge: "COMMAND",
      category: "Navigation",
      icon: Terminal,
      action: () => { onNavigate("projects"); onClose(); },
      searchTarget: "projects engineered case studies software builds operon mausam sayamsolves portfolio yolo"
    },
    {
      id: "nav-certificates",
      type: "command",
      title: "Navigate to Certificates & Achievements Vault",
      subtitle: "Verified competition honours, grade reports & credentials",
      badge: "COMMAND",
      category: "Navigation",
      icon: Award,
      action: () => { onNavigate("certificates"); onClose(); },
      searchTarget: "certificates achievements credentials awards honors hackathons competitions dataforge launchpad"
    },
    {
      id: "nav-journal",
      type: "command",
      title: "Navigate to Engineering Notes & Journal",
      subtitle: "Technical articles & personal reflections",
      badge: "COMMAND",
      category: "Navigation",
      icon: FileText,
      action: () => { onNavigate("journal"); onClose(); },
      searchTarget: "journal engineering notes articles reflections blog writing"
    },
    {
      id: "nav-showcase",
      type: "command",
      title: "Navigate to YouTube Video Showcase",
      subtitle: "Official creator channel directory & video library",
      badge: "COMMAND",
      category: "Navigation",
      icon: Youtube,
      action: () => { onNavigate("showcase"); onClose(); },
      searchTarget: "youtube video showcase content creation channels media platform beastified technical az daily decipher obsidian optics"
    },
    {
      id: "nav-contact",
      type: "command",
      title: "Navigate to Contact & Telemetry Channel",
      subtitle: "Direct message form & email contact",
      badge: "COMMAND",
      category: "Navigation",
      icon: Mail,
      action: () => { onNavigate("contact"); onClose(); },
      searchTarget: "contact email reach message hire collaborate"
    },
    {
      id: "nav-privacy",
      type: "command",
      title: "Privacy Policy & Transparent Data Disclosure",
      subtitle: "Data telemetry & cookies disclosure",
      badge: "COMMAND",
      category: "Legal & Compliance",
      icon: Shield,
      action: () => { onNavigate("privacy"); onClose(); },
      searchTarget: "privacy policy data disclosure terms telemetry"
    },
    {
      id: "nav-terms",
      type: "command",
      title: "Terms & Conditions / Acceptable Use",
      subtitle: "Portfolio usage guidelines & legal terms",
      badge: "COMMAND",
      category: "Legal & Compliance",
      icon: Scale,
      action: () => { onNavigate("terms"); onClose(); },
      searchTarget: "terms conditions acceptable use legal"
    },
    {
      id: "action-resume",
      type: "command",
      title: "Download Technical Resume (PDF)",
      subtitle: "EdgeOne verified document link",
      badge: "COMMAND",
      category: "Utility",
      icon: FileText,
      action: () => { onOpenResume(); onTriggerConfetti(); onClose(); },
      searchTarget: "resume cv download curriculum vitae pdf"
    },
    {
      id: "action-vault",
      type: "command",
      title: "Owner Vault Access (Passkey Unlock 🔒)",
      subtitle: "Admin authentication terminal",
      badge: "COMMAND",
      category: "Security & Admin",
      icon: Lock,
      action: () => { onClose(); if (onOpenVault) onOpenVault(); },
      searchTarget: "vault owner access passkey admin security password lock"
    },
    {
      id: "action-confetti",
      type: "command",
      title: "Simulate Success Event (Trigger Confetti)",
      subtitle: "Interactive visual particle celebration",
      badge: "COMMAND",
      category: "System",
      icon: Sparkles,
      action: () => { onTriggerConfetti(); onClose(); },
      searchTarget: "confetti celebration particle animation simulate success"
    },
  ], [onNavigate, onClose, onOpenResume, onTriggerConfetti, onOpenVault]);

  // 2. YouTube Channel Items (Canonical Source: youtubeChannels)
  const channelItems = useMemo<UnifiedSearchItem[]>(() => {
    return youtubeChannels.map((ch) => ({
      id: `channel-${ch.id}`,
      type: "channel",
      title: ch.name,
      subtitle: `${ch.handle}${ch.category ? ` · ${ch.category}` : ""}`,
      badge: "CHANNEL",
      category: "YouTube Channels",
      icon: Youtube,
      externalUrl: ch.url,
      action: () => handleOpenExternal(ch.url),
      searchTarget: [
        ch.name,
        ch.handle,
        ch.handle.replace(/^@/, ""),
        ch.url,
        ch.category || "",
        ch.description || "",
        "youtube",
        "channel",
        "video",
        "creator",
        "media",
        "entertainment"
      ].join(" ")
    }));
  }, [onClose]);

  // 3. Project Items
  const projectItems = useMemo<UnifiedSearchItem[]>(() => {
    return PROJECTS.map((proj) => ({
      id: `proj-${proj.id}`,
      type: "project",
      title: proj.title,
      subtitle: `${proj.categoryLabel} · ${proj.subtitle}`,
      badge: "PROJECT",
      category: "Portfolio Projects",
      icon: Terminal,
      action: () => { onNavigate("projects"); onClose(); },
      searchTarget: [
        proj.title,
        proj.subtitle,
        proj.category,
        proj.categoryLabel,
        proj.shortDescription,
        ...(proj.tags || []),
        ...(proj.techStack || [])
      ].join(" ")
    }));
  }, [onNavigate, onClose]);

  // 4. Achievement & Certificate Items
  const achievementItems = useMemo<UnifiedSearchItem[]>(() => {
    return INITIAL_CERTIFICATES.slice(0, 12).map((cert) => ({
      id: `cert-${cert.id}`,
      type: "achievement",
      title: cert.title,
      subtitle: `${cert.issuer} · ${cert.category} (${cert.year || cert.issueDate})`,
      badge: "ACHIEVEMENT",
      category: "Achievements & Honors",
      icon: Award,
      action: () => { onNavigate("certificates"); onClose(); },
      searchTarget: [
        cert.title,
        cert.issuer,
        cert.category,
        cert.event || "",
        cert.credentialId || "",
        cert.description || "",
        ...(cert.skills || [])
      ].join(" ")
    }));
  }, [onNavigate, onClose]);

  // 5. Saved Reading List Items
  const bookmarkedArticles = useMemo(() => {
    return EXTENDED_DATA.blogArticles.filter((art) => bookmarkedIds.includes(art.id));
  }, [bookmarkedIds]);

  const bookmarkItems = useMemo<UnifiedSearchItem[]>(() => {
    return bookmarkedArticles.map((art) => ({
      id: `bookmark-${art.id}`,
      type: "bookmark",
      title: art.title,
      subtitle: `Saved Article · ${art.category || "Journal"}`,
      badge: "SAVED",
      category: "Saved Reading List",
      icon: Bookmark,
      action: () => {
        onNavigate("journal");
        try {
          localStorage.setItem("portfolio_selected_article_id", art.id);
          window.dispatchEvent(new CustomEvent("portfolio_select_article", { detail: { id: art.id } }));
        } catch {}
        onClose();
      },
      searchTarget: [
        art.title,
        art.excerpt || "",
        art.category || "",
        ...(art.tags || [])
      ].join(" ")
    }));
  }, [bookmarkedArticles, onNavigate, onClose]);

  // Active pool based on selected tab (includes YouTube channel registry in search results)
  const normalizedQuery = useMemo(() => normalizeSearchText(searchQuery), [searchQuery]);
  const queryWithoutAt = useMemo(() => (normalizedQuery.startsWith("@") ? normalizedQuery.slice(1).trim() : normalizedQuery), [normalizedQuery]);

  const activePool = useMemo(() => {
    switch (activeMenuTab) {
      case "commands":
        // When searching, include YouTube channel registry alongside system commands
        return normalizedQuery ? [...commandItems, ...channelItems] : commandItems;
      case "channels":
        return channelItems;
      case "projects":
        return projectItems;
      case "achievements":
        return achievementItems;
      case "bookmarks":
        return bookmarkItems;
      case "all":
      default:
        return [
          ...commandItems,
          ...channelItems,
          ...projectItems,
          ...achievementItems,
          ...bookmarkItems,
        ];
    }
  }, [activeMenuTab, commandItems, channelItems, projectItems, achievementItems, bookmarkItems, normalizedQuery]);

  // Search matching logic using case-insensitive normalization with multi-word whitespace handling
  const matchesItem = (item: UnifiedSearchItem) => {
    if (!normalizedQuery) return true;
    const itemContent = normalizeSearchText(
      `${item.title} ${item.subtitle || ""} ${item.category} ${item.badge} ${item.type} ${item.searchTarget}`
    );
    const directMatch = itemContent.includes(normalizedQuery) || (queryWithoutAt.length > 0 && itemContent.includes(queryWithoutAt));
    if (directMatch) return true;

    // Check individual whitespace-separated tokens
    const tokens = normalizedQuery.split(" ").filter(Boolean);
    return tokens.length > 1 && tokens.every((token) => itemContent.includes(token));
  };

  const filteredItems = useMemo(() => {
    return activePool.filter(matchesItem);
  }, [activePool, matchesItem]);

  // Cross-tab match detection (to guide user when a specific tab yields no results)
  const crossTabMatches = useMemo(() => {
    if (activeMenuTab === "all" || !normalizedQuery) return [];
    const allItems = [
      ...commandItems,
      ...channelItems,
      ...projectItems,
      ...achievementItems,
      ...bookmarkItems,
    ];
    return allItems.filter(matchesItem).filter((item) => !activePool.some((p) => p.id === item.id));
  }, [activeMenuTab, normalizedQuery, commandItems, channelItems, projectItems, achievementItems, bookmarkItems, activePool, matchesItem]);

  const crossTabChannels = useMemo(() => {
    return crossTabMatches.filter((item) => item.type === "channel");
  }, [crossTabMatches]);

  // Empty state messaging per tab
  const emptyStateMessage = useMemo(() => {
    switch (activeMenuTab) {
      case "commands":
        return "No matching system command found.";
      case "channels":
        return "No matching YouTube channel found.";
      case "projects":
        return "No matching project found.";
      case "achievements":
        return "No matching achievement or certificate found.";
      case "bookmarks":
        return "No matching saved reading list item found.";
      case "all":
      default:
        return "No matching commands, channels, or projects found.";
    }
  }, [activeMenuTab]);

  // Reset state on modal open
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSelectedIndex(0);
      setActiveMenuTab("all");
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  // Reset selectedIndex on query or tab change
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery, activeMenuTab]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (filteredItems.length > 0 ? (prev + 1) % filteredItems.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (filteredItems.length > 0 ? (prev - 1 + filteredItems.length) % filteredItems.length : 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredItems, onClose]);

  // Render badge style
  const getBadgeStyle = (type: CommandItemType) => {
    switch (type) {
      case "channel":
        return "border-red-900/60 bg-red-950/40 text-red-400";
      case "project":
        return "border-emerald-900/60 bg-emerald-950/40 text-emerald-400";
      case "achievement":
        return "border-amber-900/60 bg-amber-950/40 text-amber-400";
      case "bookmark":
        return "border-cyan-900/60 bg-cyan-950/40 text-cyan-400";
      case "command":
      default:
        return "border-purple-900/60 bg-purple-950/40 text-purple-400";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-label="Command Hub"
          className="fixed inset-0 z-50 flex items-start justify-center pt-[max(1rem,8vh)] px-3 sm:px-4 font-sans"
        >
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#030303]/80 backdrop-blur-md"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[min(520px,calc(100dvh-2rem))]"
          >
            {/* Corner Indicators */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-zinc-800 rounded-tl-lg pointer-events-none" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-zinc-800 rounded-tr-lg pointer-events-none" />

            {/* Input Bar */}
            <div className="flex items-center gap-3 px-4 border-b border-zinc-900 py-3.5 bg-zinc-950">
              <Search className="w-4 h-4 text-zinc-500 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeMenuTab === "all"
                    ? "Search commands, channels, projects, or achievements..."
                    : activeMenuTab === "channels"
                    ? "Search YouTube channels by name, handle (@...), or topic..."
                    : activeMenuTab === "commands"
                    ? "Type a system command or search channels / pages..."
                    : activeMenuTab === "projects"
                    ? "Search verified projects..."
                    : activeMenuTab === "achievements"
                    ? "Search competitions and credentials..."
                    : "Search saved reading list..."
                }
                className="command-menu-search-input w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 outline-none border-none p-0 focus:ring-0"
              />
              <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded uppercase shrink-0">
                ESC
              </span>
            </div>

            {/* Tabs Navigation */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none px-3 py-2 border-b border-zinc-900 bg-zinc-950/90 text-xs">
              <button
                type="button"
                onClick={() => setActiveMenuTab("all")}
                className={`py-1 px-2.5 text-[10px] font-mono rounded-lg transition-all shrink-0 cursor-pointer ${
                  activeMenuTab === "all"
                    ? "bg-zinc-800 text-white font-bold border border-zinc-700"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                }`}
              >
                ALL
              </button>
              <button
                type="button"
                onClick={() => setActiveMenuTab("commands")}
                className={`py-1 px-2.5 text-[10px] font-mono rounded-lg transition-all shrink-0 cursor-pointer ${
                  activeMenuTab === "commands"
                    ? "bg-purple-950/60 text-purple-300 font-bold border border-purple-800/60"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                }`}
              >
                SYSTEM COMMANDS
              </button>
              <button
                type="button"
                onClick={() => setActiveMenuTab("channels")}
                className={`py-1 px-2.5 text-[10px] font-mono rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  activeMenuTab === "channels"
                    ? "bg-red-950/60 text-red-300 font-bold border border-red-800/60"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                }`}
              >
                <Youtube className="w-3 h-3 text-red-400" />
                <span>CHANNELS ({youtubeChannels.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMenuTab("projects")}
                className={`py-1 px-2.5 text-[10px] font-mono rounded-lg transition-all shrink-0 cursor-pointer ${
                  activeMenuTab === "projects"
                    ? "bg-emerald-950/60 text-emerald-300 font-bold border border-emerald-800/60"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                }`}
              >
                PROJECTS ({PROJECTS.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveMenuTab("achievements")}
                className={`py-1 px-2.5 text-[10px] font-mono rounded-lg transition-all shrink-0 cursor-pointer ${
                  activeMenuTab === "achievements"
                    ? "bg-amber-950/60 text-amber-300 font-bold border border-amber-800/60"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                }`}
              >
                ACHIEVEMENTS
              </button>
              <button
                type="button"
                onClick={() => setActiveMenuTab("bookmarks")}
                className={`py-1 px-2.5 text-[10px] font-mono rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  activeMenuTab === "bookmarks"
                    ? "bg-cyan-950/60 text-cyan-300 font-bold border border-cyan-800/60"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                }`}
              >
                <Bookmark className="w-3 h-3 text-cyan-400" />
                <span>SAVED ({bookmarkedArticles.length})</span>
              </button>
            </div>

            {/* Results List */}
            <div 
              role="listbox"
              className="flex-1 overflow-y-auto p-2 space-y-2 max-h-[340px] scrollbar-thin"
            >
              {filteredItems.length > 0 ? (
                <div>
                  {/* Category Grouping */}
                  {Array.from(new Set(filteredItems.map((item) => item.category))).map((category) => (
                    <div key={category} className="space-y-1 mb-3">
                      <div className="text-[9px] font-mono text-zinc-500 px-3 tracking-wider uppercase font-bold mt-1">
                        {category}
                      </div>
                      {filteredItems
                        .filter((item) => item.category === category)
                        .map((item) => {
                          const globalIdx = filteredItems.findIndex((f) => f.id === item.id);
                          const isSelected = globalIdx === selectedIndex;
                          const Icon = item.icon;

                          return (
                            <button
                              key={item.id}
                              type="button"
                              role="option"
                              aria-selected={isSelected}
                              onClick={item.action}
                              onMouseEnter={() => setSelectedIndex(globalIdx)}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-zinc-900 border border-zinc-800 text-white shadow-sm"
                                  : "bg-transparent text-zinc-400 hover:text-zinc-200 border border-transparent"
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0 pr-2">
                                <div className={`p-1.5 rounded-lg border shrink-0 ${
                                  isSelected ? "bg-zinc-950 border-zinc-800" : "bg-zinc-900/40 border-zinc-900"
                                }`}>
                                  <Icon className={`w-3.5 h-3.5 ${
                                    item.type === "channel"
                                      ? "text-red-400"
                                      : item.type === "project"
                                      ? "text-emerald-400"
                                      : item.type === "achievement"
                                      ? "text-amber-400"
                                      : item.type === "bookmark"
                                      ? "text-cyan-400"
                                      : isSelected
                                      ? "text-purple-400"
                                      : "text-zinc-500"
                                  }`} />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-medium text-zinc-100 truncate">
                                      {item.title}
                                    </span>
                                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border uppercase tracking-wider shrink-0 ${getBadgeStyle(item.type)}`}>
                                      {item.badge}
                                    </span>
                                  </div>
                                  {item.subtitle && (
                                    <span className="text-[11px] text-zinc-500 block truncate font-sans">
                                      {item.subtitle}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {item.externalUrl && (
                                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-zinc-400 hover:text-red-300">
                                    Visit ↗
                                  </span>
                                )}
                                {isSelected && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-[9px] text-zinc-500 font-mono bg-zinc-950 border border-zinc-800 px-1.5 py-0.5 rounded">
                                      ENTER
                                    </span>
                                    <ArrowRight className="w-3 h-3 text-purple-400" />
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-zinc-500 space-y-3">
                  <Terminal className="w-6 h-6 text-zinc-700 mx-auto" />
                  <p className="text-xs font-mono">{emptyStateMessage}</p>

                  {/* Cross-tab hint when user is on a specific tab */}
                  {crossTabMatches.length > 0 && (
                    <div className="mt-3 p-3 rounded-xl border border-zinc-850 bg-zinc-900/50 max-w-sm mx-auto text-left space-y-2">
                      <p className="text-[11px] text-zinc-400 font-sans">
                        Found <span className="text-white font-semibold">{crossTabMatches.length}</span> matching result{crossTabMatches.length > 1 ? "s" : ""} in other categories:
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {crossTabChannels.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuTab("channels");
                              setSelectedIndex(0);
                            }}
                            className="text-[10px] font-mono px-2 py-1 rounded bg-red-950/40 border border-red-800/60 text-red-300 hover:bg-red-900/50 cursor-pointer flex items-center gap-1 transition-colors"
                          >
                            <Youtube className="w-3 h-3 text-red-400" />
                            <span>View in Channels ({crossTabChannels.length})</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuTab("all");
                            setSelectedIndex(0);
                          }}
                          className="text-[10px] font-mono px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 hover:bg-zinc-700 cursor-pointer transition-colors"
                        >
                          Search Across All
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-zinc-900 bg-zinc-950/40 flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <span className="flex items-center gap-1.5 truncate pr-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse shrink-0" />
                Sayam Mukherjee Tech Workspace Command Hub
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <span>Select: <kbd className="bg-zinc-900 px-1 py-0.5 rounded border border-zinc-800">↓↑</kbd></span>
                <span>Execute: <kbd className="bg-zinc-900 px-1 py-0.5 rounded border border-zinc-800">Enter</kbd></span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
