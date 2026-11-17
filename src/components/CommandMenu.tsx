import React, { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Terminal,
  FileText,
  Sparkles,
  Code,
  Server,
  AppWindow,
  Cpu,
  Mail,
  ArrowRight,
  Bookmark,
  Award,
  Lock,
  Shield,
  Scale,
  Youtube,
} from "lucide-react";
import { EXTENDED_DATA } from "../data/extendedData";
import { youtubeChannels } from "../data/channels";
import { PROJECTS } from "../data/projects";
import { INITIAL_CERTIFICATES } from "../data/initialCertificates";

export type CommandItemType =
  | "command"
  | "channel"
  | "project"
  | "achievement"
  | "bookmark";
export type MenuTab =
  | "all"
  | "commands"
  | "channels"
  | "projects"
  | "achievements"
  | "bookmarks";

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
  onNavigate: (
    tab:
      | "home"
      | "about"
      | "skills"
      | "ecosystem"
      | "projects"
      | "certificates"
      | "journal"
      | "contact"
      | "privacy"
      | "terms"
      | "showcase"
  ) => void;
  onOpenResume: () => void;
  onTriggerConfetti: () => void;
  onOpenVault?: () => void;
}

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
  onOpenVault,
}: CommandMenuProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const [activeMenuTab, setActiveMenuTab] = useState<MenuTab>("all");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  useEffect(() => {
    const loadBookmarks = () => {
      try {
        const stored = localStorage.getItem("portfolio_reading_list");
        setBookmarkedIds(stored ? JSON.parse(stored) : []);
      } catch {
        setBookmarkedIds([]);
      }
    };

    if (isOpen) loadBookmarks();

    window.addEventListener("portfolio_bookmarks_updated", loadBookmarks);
    return () =>
      window.removeEventListener("portfolio_bookmarks_updated", loadBookmarks);
  }, [isOpen]);

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

  const commandItems = useMemo<UnifiedSearchItem[]>(
    () => [
      {
        id: "nav-home",
        type: "command",
        title: "Navigate to Home Page",
        subtitle: "Editorial introduction, selected projects & GitHub explorer",
        badge: "COMMAND",
        category: "Navigation",
        icon: AppWindow,
        action: () => {
          onNavigate("home");
          onClose();
        },
        searchTarget: "home navigate page hero overview start root",
      },
      {
        id: "nav-about",
        type: "command",
        title: "Navigate to About / Identity Profile",
        subtitle: "Background, academics, experience & story",
        badge: "COMMAND",
        category: "Navigation",
        icon: Code,
        action: () => {
          onNavigate("about");
          onClose();
        },
        searchTarget: "about identity profile background story education routine kiit",
      },
      {
        id: "nav-skills",
        type: "command",
        title: "Navigate to Technical Skills Matrix",
        subtitle: "Languages, frameworks, tools & verified distribution",
        badge: "COMMAND",
        category: "Navigation",
        icon: Cpu,
        action: () => {
          onNavigate("skills");
          onClose();
        },
        searchTarget:
          "skills technical stack matrix languages frameworks tools telemetry c++ python typescript",
      },
      {
        id: "nav-ecosystem",
        type: "command",
        title: "Navigate to Academic Learning & Ecosystem",
        subtitle: "Architecture diagrams & engineering blueprints",
        badge: "COMMAND",
        category: "Navigation",
        icon: Server,
        action: () => {
          onNavigate("ecosystem");
          onClose();
        },
        searchTarget: "ecosystem academic learning architecture diagrams nodes mechanics",
      },
      {
        id: "nav-projects",
        type: "command",
        title: "Navigate to Engineered Case Studies",
        subtitle: "All 8 verified engineering projects",
        badge: "COMMAND",
        category: "Navigation",
        icon: Terminal,
        action: () => {
          onNavigate("projects");
          onClose();
        },
        searchTarget:
          "projects engineered case studies software builds operon mausam sightforge memory-in-motion axiom inkloom campus-connect sayamsolves",
      },
      {
        id: "nav-certificates",
        type: "command",
        title: "Navigate to Certificates & Achievements Vault",
        subtitle: "Verified competition honours, grade reports & credentials",
        badge: "COMMAND",
        category: "Navigation",
        icon: Award,
        action: () => {
          onNavigate("certificates");
          onClose();
        },
        searchTarget:
          "certificates achievements credentials awards honors hackathons competitions dataforge launchpad",
      },
      {
        id: "nav-journal",
        type: "command",
        title: "Navigate to Engineering Notes & Journal",
        subtitle: "Technical articles & personal reflections",
        badge: "COMMAND",
        category: "Navigation",
        icon: FileText,
        action: () => {
          onNavigate("journal");
          onClose();
        },
        searchTarget: "journal engineering notes articles reflections blog writing",
      },
      {
        id: "nav-showcase",
        type: "command",
        title: "Navigate to YouTube Video Showcase",
        subtitle: "Official creator channel directory & Oct 2026 analytics snapshot",
        badge: "COMMAND",
        category: "Navigation",
        icon: Youtube,
        action: () => {
          onNavigate("showcase");
          onClose();
        },
        searchTarget:
          "youtube video showcase content creation channels media platform technical az daily decipher obsidian optics",
      },
      {
        id: "nav-contact",
        type: "command",
        title: "Navigate to Contact & Dispatch Channel",
        subtitle: "Direct message form & email contact",
        badge: "COMMAND",
        category: "Navigation",
        icon: Mail,
        action: () => {
          onNavigate("contact");
          onClose();
        },
        searchTarget: "contact email reach message hire collaborate",
      },
      {
        id: "nav-privacy",
        type: "command",
        title: "Privacy Policy & Transparent Data Disclosure",
        subtitle: "Data telemetry & cookies disclosure",
        badge: "COMMAND",
        category: "Legal & Compliance",
        icon: Shield,
        action: () => {
          onNavigate("privacy");
          onClose();
        },
        searchTarget: "privacy policy data disclosure terms telemetry",
      },
      {
        id: "nav-terms",
        type: "command",
        title: "Terms & Conditions / Acceptable Use",
        subtitle: "Portfolio usage guidelines & legal terms",
        badge: "COMMAND",
        category: "Legal & Compliance",
        icon: Scale,
        action: () => {
          onNavigate("terms");
          onClose();
        },
        searchTarget: "terms conditions acceptable use legal",
      },
      {
        id: "action-resume",
        type: "command",
        title: "View Verified Résumé (PDF)",
        subtitle: "Authoritative document viewer & download",
        badge: "COMMAND",
        category: "Utility",
        icon: FileText,
        action: () => {
          onOpenResume();
          onTriggerConfetti();
          onClose();
        },
        searchTarget: "resume cv view download curriculum vitae pdf",
      },
      {
        id: "action-vault",
        type: "command",
        title: "Owner Vault Access",
        subtitle: "Admin authentication terminal",
        badge: "COMMAND",
        category: "Security & Admin",
        icon: Lock,
        action: () => {
          onClose();
          if (onOpenVault) onOpenVault();
        },
        searchTarget: "vault owner access passkey admin security password lock",
      },
      {
        id: "action-confetti",
        type: "command",
        title: "Trigger Celebration Confetti",
        subtitle: "Interactive particle animation",
        badge: "COMMAND",
        category: "System",
        icon: Sparkles,
        action: () => {
          onTriggerConfetti();
          onClose();
        },
        searchTarget: "confetti celebration particle animation simulate success",
      },
    ],
    [onNavigate, onClose, onOpenResume, onTriggerConfetti, onOpenVault]
  );

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
      ].join(" "),
    }));
  }, [onClose]);

  const projectItems = useMemo<UnifiedSearchItem[]>(() => {
    return PROJECTS.map((proj) => ({
      id: `proj-${proj.id}`,
      type: "project",
      title: proj.title,
      subtitle: `${proj.categoryLabel} · ${proj.subtitle}`,
      badge: "PROJECT",
      category: "Portfolio Projects",
      icon: Terminal,
      action: () => {
        onNavigate("projects");
        onClose();
      },
      searchTarget: [
        proj.title,
        proj.subtitle,
        proj.category,
        proj.categoryLabel,
        proj.shortDescription,
        ...(proj.tags || []),
        ...(proj.techStack || []),
      ].join(" "),
    }));
  }, [onNavigate, onClose]);

  const achievementItems = useMemo<UnifiedSearchItem[]>(() => {
    return INITIAL_CERTIFICATES.slice(0, 12).map((cert) => ({
      id: `cert-${cert.id}`,
      type: "achievement",
      title: cert.title,
      subtitle: `${cert.issuer} · ${cert.category} (${cert.year || cert.issueDate})`,
      badge: "ACHIEVEMENT",
      category: "Achievements & Honors",
      icon: Award,
      action: () => {
        onNavigate("certificates");
        onClose();
      },
      searchTarget: [
        cert.title,
        cert.issuer,
        cert.category,
        cert.event || "",
        cert.credentialId || "",
        cert.description || "",
        ...(cert.skills || []),
      ].join(" "),
    }));
  }, [onNavigate, onClose]);

  const bookmarkedArticles = useMemo(() => {
    return EXTENDED_DATA.blogArticles.filter((art) =>
      bookmarkedIds.includes(art.id)
    );
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
          window.dispatchEvent(
            new CustomEvent("portfolio_select_article", { detail: { id: art.id } })
          );
        } catch {}
        onClose();
      },
      searchTarget: [
        art.title,
        art.excerpt || "",
        art.category || "",
        ...(art.tags || []),
      ].join(" "),
    }));
  }, [bookmarkedArticles, onNavigate, onClose]);

  const normalizedQuery = useMemo(
    () => normalizeSearchText(searchQuery),
    [searchQuery]
  );
  const queryWithoutAt = useMemo(
    () =>
      normalizedQuery.startsWith("@")
        ? normalizedQuery.slice(1).trim()
        : normalizedQuery,
    [normalizedQuery]
  );

  const activePool = useMemo(() => {
    switch (activeMenuTab) {
      case "commands":
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
  }, [
    activeMenuTab,
    commandItems,
    channelItems,
    projectItems,
    achievementItems,
    bookmarkItems,
    normalizedQuery,
  ]);

  const matchesItem = (item: UnifiedSearchItem) => {
    if (!normalizedQuery) return true;
    const itemContent = normalizeSearchText(
      `${item.title} ${item.subtitle || ""} ${item.category} ${item.badge} ${item.type} ${item.searchTarget}`
    );
    const directMatch =
      itemContent.includes(normalizedQuery) ||
      (queryWithoutAt.length > 0 && itemContent.includes(queryWithoutAt));
    if (directMatch) return true;

    const tokens = normalizedQuery.split(" ").filter(Boolean);
    return (
      tokens.length > 1 && tokens.every((token) => itemContent.includes(token))
    );
  };

  const filteredItems = useMemo(
    () => activePool.filter(matchesItem),
    [activePool, matchesItem]
  );

  const crossTabMatches = useMemo(() => {
    if (activeMenuTab === "all" || !normalizedQuery) return [];
    const allItems = [
      ...commandItems,
      ...channelItems,
      ...projectItems,
      ...achievementItems,
      ...bookmarkItems,
    ];
    return allItems
      .filter(matchesItem)
      .filter((item) => !activePool.some((p) => p.id === item.id));
  }, [
    activeMenuTab,
    normalizedQuery,
    commandItems,
    channelItems,
    projectItems,
    achievementItems,
    bookmarkItems,
    activePool,
    matchesItem,
  ]);

  const crossTabChannels = useMemo(
    () => crossTabMatches.filter((item) => item.type === "channel"),
    [crossTabMatches]
  );

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

  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSelectedIndex(0);
      setActiveMenuTab("all");
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery, activeMenuTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filteredItems.length > 0 ? (prev + 1) % filteredItems.length : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filteredItems.length > 0
            ? (prev - 1 + filteredItems.length) % filteredItems.length
            : 0
        );
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

  const getBadgeStyle = (type: CommandItemType) => {
    switch (type) {
      case "channel":
        return "border-red-500/40 bg-red-500/10 text-red-400";
      case "project":
        return "border-[#C7E34A]/60 bg-[#C7E34A]/15 text-[#C7E34A]";
      case "achievement":
        return "border-amber-500/40 bg-amber-500/10 text-amber-300";
      case "bookmark":
        return "border-[#B5B8AA]/40 bg-[#41443A]/40 text-[#F4F4ED]";
      case "command":
      default:
        return "border-[#41443A] bg-[#151713] text-[#B5B8AA]";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command Hub"
          className="fixed inset-0 z-50 flex items-start justify-center pt-[max(1rem,calc(env(safe-area-inset-top,0px)+8svh))] pb-[max(1rem,env(safe-area-inset-bottom,0px))] px-3 sm:px-4 font-sans"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#151713]/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xl bg-[#20231D] text-[#F4F4ED] border border-[#41443A] rounded-[10px] overflow-hidden shadow-2xl flex flex-col max-h-[min(520px,calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-2rem))]"
          >
            {/* Input Bar */}
            <div className="flex items-center gap-3 px-4 border-b border-[#41443A] py-3.5 bg-[#151713]">
              <Search className="w-4 h-4 text-[#B5B8AA] shrink-0" />
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
                        ? "Type a system command or search pages..."
                        : activeMenuTab === "projects"
                          ? "Search verified projects..."
                          : activeMenuTab === "achievements"
                            ? "Search competitions and credentials..."
                            : "Search saved reading list..."
                }
                className="w-full bg-transparent text-base sm:text-sm text-[#F4F4ED] placeholder-[#B5B8AA] outline-none border-none p-0 focus:ring-0"
              />
              <span className="text-[10px] font-mono text-[#B5B8AA] bg-[#20231D] border border-[#41443A] px-2 py-0.5 rounded-[4px] uppercase shrink-0">
                ESC
              </span>
            </div>

            {/* Tabs Navigation */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none px-3 py-2.5 border-b border-[#41443A] bg-[#151713]/80 text-xs">
              {(
                [
                  ["all", "ALL"],
                  ["commands", "COMMANDS"],
                  ["channels", `CHANNELS (${youtubeChannels.length})`],
                  ["projects", `PROJECTS (${PROJECTS.length})`],
                  ["achievements", "ACHIEVEMENTS"],
                  ["bookmarks", `SAVED (${bookmarkedArticles.length})`],
                ] as const
              ).map(([tabKey, label]) => (
                <button
                  key={tabKey}
                  type="button"
                  onClick={() => setActiveMenuTab(tabKey)}
                  className={`min-h-[36px] sm:min-h-0 py-1 px-2.5 text-[10px] font-mono rounded-[4px] transition-all shrink-0 cursor-pointer border active:scale-[0.96] ${
                    activeMenuTab === tabKey
                      ? "bg-[#C7E34A] border-[#C7E34A] text-[#20231D] font-bold"
                      : "bg-transparent border-transparent text-[#B5B8AA] hover:text-[#F4F4ED] hover:bg-[#20231D] active:bg-[#262922]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Results List */}
            <div
              role="listbox"
              className="flex-1 overflow-y-auto p-2 space-y-2 max-h-[340px]"
            >
              {filteredItems.length > 0 ? (
                <div>
                  {Array.from(new Set(filteredItems.map((item) => item.category))).map(
                    (category) => (
                      <div key={category} className="space-y-1 mb-3">
                        <div className="text-[10px] font-mono text-[#B5B8AA] px-3 tracking-wider uppercase font-semibold mt-1">
                          {category}
                        </div>
                        {filteredItems
                          .filter((item) => item.category === category)
                          .map((item) => {
                            const globalIdx = filteredItems.findIndex(
                              (f) => f.id === item.id
                            );
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
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[6px] text-left transition-all cursor-pointer border active:scale-[0.985] active:bg-[#262922] ${
                                  isSelected
                                    ? "bg-[#151713] border-[#C7E34A]/60 text-[#F4F4ED]"
                                    : "bg-transparent text-[#D4D6CA] hover:text-[#F4F4ED] border-transparent"
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0 pr-2">
                                  <div
                                    className={`p-1.5 rounded-[4px] border shrink-0 ${
                                      isSelected
                                        ? "bg-[#C7E34A] border-[#C7E34A] text-[#20231D]"
                                        : "bg-[#151713] border-[#41443A] text-[#B5B8AA]"
                                    }`}
                                  >
                                    <Icon className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-xs font-semibold text-[#F4F4ED] truncate">
                                        {item.title}
                                      </span>
                                      <span
                                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded-[3px] border uppercase tracking-wider shrink-0 ${getBadgeStyle(
                                          item.type
                                        )}`}
                                      >
                                        {item.badge}
                                      </span>
                                    </div>
                                    {item.subtitle && (
                                      <span className="text-[11px] text-[#B5B8AA] block truncate font-sans">
                                        {item.subtitle}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  {item.externalUrl && (
                                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-[#B5B8AA]">
                                      Visit ↗
                                    </span>
                                  )}
                                  {isSelected && (
                                    <div className="flex items-center gap-1">
                                      <span className="text-[9px] text-[#B5B8AA] font-mono bg-[#20231D] border border-[#41443A] px-1.5 py-0.5 rounded">
                                        ENTER
                                      </span>
                                      <ArrowRight className="w-3 h-3 text-[#C7E34A]" />
                                    </div>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="py-8 text-center text-[#B5B8AA] space-y-3">
                  <Terminal className="w-6 h-6 text-[#69734A] mx-auto" />
                  <p className="text-xs font-mono">{emptyStateMessage}</p>

                  {crossTabMatches.length > 0 && (
                    <div className="mt-3 p-3 rounded-[6px] border border-[#41443A] bg-[#151713] max-w-sm mx-auto text-left space-y-2">
                      <p className="text-[11px] text-[#D4D6CA] font-sans">
                        Found{" "}
                        <span className="text-[#C7E34A] font-semibold">
                          {crossTabMatches.length}
                        </span>{" "}
                        matching result{crossTabMatches.length > 1 ? "s" : ""} in other categories:
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {crossTabChannels.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuTab("channels");
                              setSelectedIndex(0);
                            }}
                            className="text-[10px] font-mono px-2.5 py-1 rounded-[4px] border border-[#41443A] text-[#F4F4ED] hover:border-[#C7E34A] active:scale-[0.96] active:border-[#C7E34A] transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Youtube className="w-3 h-3 text-red-400" />
                            <span>Channels ({crossTabChannels.length})</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuTab("all");
                            setSelectedIndex(0);
                          }}
                          className="text-[10px] font-mono px-2.5 py-1 rounded-[4px] bg-[#C7E34A] text-[#20231D] font-bold active:scale-[0.96] active:bg-[#9BB827] transition-all cursor-pointer"
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
            <div className="px-4 py-2.5 border-t border-[#41443A] bg-[#151713] flex items-center justify-between text-[10px] font-mono text-[#B5B8AA]">
              <span className="truncate pr-2">
                Sayam Mukherjee · Command Hub
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <span>
                  Select:{" "}
                  <kbd className="bg-[#20231D] px-1.5 py-0.5 rounded border border-[#41443A]">
                    ↓↑
                  </kbd>
                </span>
                <span>
                  Execute:{" "}
                  <kbd className="bg-[#20231D] px-1.5 py-0.5 rounded border border-[#41443A]">
                    Enter
                  </kbd>
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
