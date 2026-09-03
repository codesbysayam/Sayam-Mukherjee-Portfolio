import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Terminal, FileText, Send, Sparkles, Code, Server, AppWindow, Cpu, Mail, Globe, ArrowRight, Bookmark } from "lucide-react";
import { EXTENDED_DATA } from "../data/extendedData";

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: "home" | "about" | "skills" | "ecosystem" | "projects" | "journal" | "contact") => void;
  onOpenResume: () => void;
  onTriggerConfetti: () => void;
}

export default function CommandMenu({
  isOpen,
  onClose,
  onNavigate,
  onOpenResume,
  onTriggerConfetti
}: CommandMenuProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const [activeMenuTab, setActiveMenuTab] = useState<"commands" | "bookmarks">("commands");
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

  const commandItems = [
    { id: "home", label: "Navigate to Home Page", category: "Navigation", icon: AppWindow, action: () => onNavigate("home") },
    { id: "about", label: "Navigate to About / Identity Profile", category: "Navigation", icon: Code, action: () => onNavigate("about") },
    { id: "skills", label: "Navigate to Technical Skills Matrix", category: "Navigation", icon: Cpu, action: () => onNavigate("skills") },
    { id: "ecosystem", label: "Navigate to Academic Learning & Ecosystem", category: "Navigation", icon: Server, action: () => onNavigate("ecosystem") },
    { id: "projects", label: "Navigate to Engineered Case Studies", category: "Navigation", icon: Terminal, action: () => onNavigate("projects") },
    { id: "journal", label: "Navigate to Obsidian Notes & Journal", category: "Navigation", icon: FileText, action: () => onNavigate("journal") },
    { id: "contact", label: "Navigate to Contact & Telemetry Channel", category: "Navigation", icon: Mail, action: () => onNavigate("contact") },
    { id: "resume", label: "Download Technical Resume (PDF)", category: "Utility", icon: FileText, action: () => { onOpenResume(); onTriggerConfetti(); } },
    { id: "confetti", label: "Simulate Success Event (Trigger Confetti)", category: "System", icon: Sparkles, action: () => { onTriggerConfetti(); } },
  ];

  const bookmarkedArticles = EXTENDED_DATA.blogArticles.filter(art => 
    bookmarkedIds.includes(art.id)
  );

  const bookmarkItems = bookmarkedArticles.map(art => ({
    id: art.id,
    label: `Read Note: ${art.title}`,
    category: "Saved Reading List",
    icon: Bookmark,
    action: () => {
      onNavigate("journal");
      localStorage.setItem("portfolio_selected_article_id", art.id);
      window.dispatchEvent(new CustomEvent("portfolio_select_article", { detail: { id: art.id } }));
    }
  }));

  const currentItems = activeMenuTab === "commands" ? commandItems : bookmarkItems;

  const filteredItems = currentItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSelectedIndex(0);
      setActiveMenuTab("commands");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
          onClose();
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredItems, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 font-sans">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#030303]/80 backdrop-blur-md"
          />

          {/* Raycast Styled Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[450px]"
          >
            {/* Corner Indicators */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-zinc-800 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-zinc-800 rounded-tr-lg" />

            {/* Input Bar */}
            <div className="flex items-center gap-3 px-4 border-b border-zinc-900 py-3.5 bg-zinc-950">
              <Search className="w-4 h-4 text-zinc-500 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder={activeMenuTab === "commands" ? "Type a command or page tab name to search..." : "Search saved bookmarks..."}
                className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 outline-none border-none p-0 focus:ring-0"
              />
              <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded uppercase">
                ESC
              </span>
            </div>

            {/* Sub-menu Tabs Selection */}
            <div className="flex border-b border-zinc-900 px-2 bg-zinc-950/80">
              <button
                onClick={() => {
                  setActiveMenuTab("commands");
                  setSelectedIndex(0);
                  setSearchQuery("");
                }}
                className={`py-2 px-3 text-[10px] font-mono border-b-2 transition-all cursor-pointer ${
                  activeMenuTab === "commands"
                    ? "border-purple-500 text-purple-400 font-bold"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                SYSTEM COMMANDS
              </button>
              <button
                onClick={() => {
                  setActiveMenuTab("bookmarks");
                  setSelectedIndex(0);
                  setSearchQuery("");
                }}
                className={`py-2 px-3 text-[10px] font-mono border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeMenuTab === "bookmarks"
                    ? "border-cyan-500 text-cyan-400 font-bold"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                SAVED READING LIST ({bookmarkedArticles.length})
              </button>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2 max-h-[300px] scrollbar-thin">
              {filteredItems.length > 0 ? (
                <div>
                  {/* Category Grouping */}
                  {Array.from(new Set(filteredItems.map(item => item.category))).map(category => (
                    <div key={category} className="space-y-1 mb-3">
                      <div className="text-[9px] font-mono text-zinc-600 px-3 tracking-wider uppercase font-bold mt-1">
                        {category}
                      </div>
                      {filteredItems
                        .filter(item => item.category === category)
                        .map((item, idx) => {
                          const globalIdx = filteredItems.findIndex(f => f.id === item.id);
                          const isSelected = globalIdx === selectedIndex;
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                item.action();
                                onClose();
                              }}
                              onMouseEnter={() => setSelectedIndex(globalIdx)}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                                isSelected
                                  ? "bg-zinc-900 border border-zinc-800 text-white"
                                  : "bg-transparent text-zinc-400 hover:text-zinc-200 border border-transparent"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded-lg border ${
                                  isSelected ? "bg-zinc-950 border-zinc-800" : "bg-zinc-900/40 border-zinc-900"
                                }`}>
                                  <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-purple-400" : "text-zinc-500"}`} />
                                </div>
                                <span className="text-xs font-medium">{item.label}</span>
                              </div>
                              {isSelected && (
                                <div className="flex items-center gap-1">
                                  <span className="text-[9px] text-zinc-500 font-mono bg-zinc-950 border border-zinc-800 px-1.5 py-0.5 rounded">
                                    ENTER
                                  </span>
                                  <ArrowRight className="w-3 h-3 text-purple-400" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-zinc-500 space-y-2">
                  <Terminal className="w-6 h-6 text-zinc-700 mx-auto" />
                  <p className="text-xs font-mono">No matching system command found.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-zinc-900 bg-zinc-950/40 flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                Sayam Mukherjee Tech Workspace Command Hub
              </span>
              <div className="flex items-center gap-2">
                <span>Select: <kbd className="bg-zinc-900 px-1 rounded">↓↑</kbd></span>
                <span>Execute: <kbd className="bg-zinc-900 px-1 rounded">Enter</kbd></span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
