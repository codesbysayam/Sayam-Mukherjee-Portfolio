import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  Sparkles,
  RotateCcw,
  ExternalLink,
  ArrowUpRight,
  ArrowRight,
  Github,
  Linkedin,
  Code2,
  Globe,
  Youtube,
  FileText,
  Mail,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { usePortfolio } from "../context/PortfolioContext";
import {
  INITIAL_WELCOME,
  PROFILE_LINKS,
  IntentAction,
} from "../data/assistantKnowledge";
import { findIntent, MatcherResult } from "../utils/assistantMatcher";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  suggestions?: string[];
  action?: IntentAction;
}

const STORAGE_KEY = "sayam-agent-chat";

const createInitialMessage = (): ChatMessage => ({
  id: "initial",
  role: "assistant",
  text: `${INITIAL_WELCOME.greeting}\n\n${INITIAL_WELCOME.subtext}`,
  timestamp: new Date().toISOString(),
  suggestions: [
    "What projects has he built?",
    "What technologies does he use?",
    "Tell me about his education",
    "What are his achievements?",
    "Show me his GitHub",
    "How can I contact him?",
  ],
});

export default function AssistantChat() {
  const { theme } = usePortfolio();
  const isDark = theme === "dark";

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn("Could not load chat history from localStorage", e);
    }
    return [createInitialMessage()];
  });

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync with localStorage
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      }
    } catch (e) {
      console.warn("Could not save chat history to localStorage", e);
    }
  }, [messages]);

  // Clean up any pending typing timer on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Smooth auto-scroll
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // Keyboard navigation: focus input on open, close on Escape
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom("auto");
      }, 100);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsOpen(false);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, scrollToBottom]);

  // Handle sending a user query
  const handleSend = (textToSend?: string) => {
    const query = (textToSend ?? input).trim();
    if (!query || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      role: "user",
      text: query,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      scrollToBottom("smooth");
    }, 40);

    // Realistic micro-delay: 280ms local lookup
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      const matched: MatcherResult = findIntent(query);

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        role: "assistant",
        text: matched.answer,
        timestamp: new Date().toISOString(),
        action: matched.action,
        suggestions: matched.suggestions,
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);

      setTimeout(() => {
        scrollToBottom("smooth");
      }, 50);
    }, 280);
  };

  // Clear chat handler: resets to initial welcome screen
  const handleClearChat = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setIsTyping(false);
    setInput("");
    const resetMsg = createInitialMessage();
    setMessages([resetMsg]);

    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.warn("Could not clear localStorage", e);
    }

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  // Action click handler
  const handleActionClick = (action: IntentAction) => {
    if (action.url.startsWith("#contact")) {
      const el = document.getElementById("contact");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    if (action.url.startsWith("#resume")) {
      window.dispatchEvent(new CustomEvent("open-resume-modal"));
      return;
    }

    if (action.url.startsWith("http")) {
      window.open(action.url, "_blank", "noopener,noreferrer");
    }
  };

  // Time formatter
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  // Render action icon
  const renderActionIcon = (type?: string) => {
    switch (type) {
      case "github":
        return <Github className="w-4 h-4 text-zinc-100" />;
      case "linkedin":
        return <Linkedin className="w-4 h-4 text-[#0a66c2]" />;
      case "leetcode":
        return <Code2 className="w-4 h-4 text-[#ffa116]" />;
      case "codolio":
        return <Globe className="w-4 h-4 text-cyan-400" />;
      case "youtube":
        return <Youtube className="w-4 h-4 text-red-500" />;
      case "resume":
        return <FileText className="w-4 h-4 text-purple-400" />;
      case "contact":
      default:
        return <Mail className="w-4 h-4 text-emerald-400" />;
    }
  };

  // Profile Action Card Component (Section 15)
  const renderActionCard = (action: IntentAction) => {
    const isExternal = action.url.startsWith("http");

    return (
      <div
        className={`mt-2.5 p-2.5 rounded-xl border transition-all ${
          isDark
            ? "bg-zinc-900/80 border-purple-500/20 hover:border-purple-500/40"
            : "bg-white border-purple-200/80 shadow-xs hover:border-purple-300"
        }`}
      >
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                isDark
                  ? "bg-zinc-950 border-zinc-800"
                  : "bg-zinc-100 border-zinc-200"
              }`}
            >
              {renderActionIcon(action.type)}
            </div>
            <div className="min-w-0">
              <div
                className={`text-[10px] font-semibold uppercase tracking-wider ${
                  isDark ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                {action.label}
              </div>
              {action.handle && (
                <div
                  className={`text-[11px] font-mono truncate ${
                    isDark ? "text-zinc-200" : "text-zinc-800"
                  }`}
                >
                  {action.handle}
                </div>
              )}
            </div>
          </div>

          {isExternal ? (
            <a
              href={action.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-xs hover:shadow-sm transition-all shrink-0 cursor-pointer"
            >
              <span>Open profile</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          ) : (
            <button
              type="button"
              onClick={() => handleActionClick(action)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xs hover:shadow-sm transition-all shrink-0 cursor-pointer"
            >
              <span>{action.label}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  };

  // Get contextual suggestions for bottom quick bar (from the latest assistant message)
  const latestAssistantMessage = [...messages].reverse().find((m) => m.role === "assistant");
  const activeSuggestions = latestAssistantMessage?.suggestions || INITIAL_WELCOME.chips.map((c) => c.label);

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={`w-[calc(100vw-24px)] sm:w-[410px] h-[580px] max-h-[min(640px,calc(100vh-100px))] rounded-2xl flex flex-col overflow-hidden mb-3 border shadow-2xl backdrop-blur-xl transition-colors ${
              isDark
                ? "bg-[#09090f]/95 border-purple-500/30 text-white shadow-[0_20px_60px_rgba(0,0,0,0.65)]"
                : "bg-white/95 border-purple-300/40 text-zinc-900 shadow-[0_20px_50px_rgba(30,25,60,0.14)]"
            }`}
          >
            {/* Header (Section 7) */}
            <div
              className={`py-3 px-4 border-b flex items-center justify-between transition-colors shrink-0 ${
                isDark
                  ? "bg-gradient-to-r from-purple-950/40 via-zinc-900/80 to-cyan-950/30 border-zinc-800/80"
                  : "bg-gradient-to-r from-purple-100/50 via-white to-cyan-100/40 border-zinc-200/80"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div
                    className={`w-8 h-8 rounded-full overflow-hidden flex items-center justify-center border ${
                      isDark
                        ? "bg-zinc-900 border-purple-500/30 text-purple-400"
                        : "bg-purple-50 border-purple-200 text-purple-600"
                    }`}
                  >
                    <Bot className="w-4 h-4" />
                  </div>
                  {/* Status Indicator */}
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-zinc-950"
                    title="Online"
                  />
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-semibold flex items-center gap-1 font-display tracking-tight leading-tight">
                    Sayam’s Agent
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span
                      className={`text-[10px] font-medium leading-none ${
                        isDark ? "text-zinc-400" : "text-zinc-600"
                      }`}
                    >
                      Local Portfolio Assistant
                    </span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                      ● Online
                    </span>
                  </div>
                </div>
              </div>

              {/* Header Action Controls */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleClearChat}
                  title="Clear chat history"
                  aria-label="Clear chat history"
                  className={`px-2 py-1 rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer ${
                    isDark
                      ? "text-zinc-400 hover:text-white hover:bg-zinc-800/70"
                      : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono hidden sm:inline">Clear</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close assistant dialog (Escape)"
                  aria-label="Close assistant dialog"
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isDark
                      ? "text-zinc-400 hover:text-white hover:bg-zinc-800/70"
                      : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div
              className={`flex-1 overflow-y-auto overscroll-contain p-3.5 sm:p-4 space-y-3.5 text-xs ${
                isDark ? "bg-zinc-950/50" : "bg-[#f8f9fc]/80"
              }`}
            >
              {messages.map((msg, index) => {
                const isUser = msg.role === "user";
                const isInitial = msg.id === "initial" || msg.id.startsWith("welcome");

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[88%] sm:max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-xs ${
                        isUser
                          ? "bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-tr-none font-medium shadow-[0_4px_14px_rgba(139,92,246,0.3)]"
                          : isDark
                          ? "bg-zinc-900/90 text-zinc-100 border border-zinc-800/90 rounded-tl-none"
                          : "bg-white text-zinc-800 border border-purple-100/80 rounded-tl-none shadow-[0_2px_8px_rgba(20,20,40,0.06)]"
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                      ) : (
                        <div className="space-y-1.5">
                          <div
                            className={`markdown-body prose prose-xs max-w-none ${
                              isDark ? "prose-invert text-zinc-200" : "text-zinc-800"
                            }`}
                          >
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                          </div>

                          {/* Profile Action Card / Button (Section 15) */}
                          {msg.action && renderActionCard(msg.action)}
                        </div>
                      )}

                      {/* Timestamp */}
                      <span
                        className={`block text-[9px] mt-1 font-mono ${
                          isUser
                            ? "text-purple-200 text-right"
                            : isDark
                            ? "text-zinc-500"
                            : "text-zinc-400"
                        }`}
                      >
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>

                    {/* Welcome Quick Chips (Section 8) */}
                    {isInitial && index === 0 && (
                      <div className="mt-3 max-w-full">
                        <span
                          className={`text-[10px] uppercase font-mono tracking-wider block mb-1.5 ${
                            isDark ? "text-zinc-400" : "text-zinc-500"
                          }`}
                        >
                          Quick Topics:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {INITIAL_WELCOME.chips.map((chip, cIdx) => (
                            <button
                              key={cIdx}
                              type="button"
                              onClick={() => handleSend(chip.query)}
                              className={`text-[11px] px-2.5 py-1 rounded-full border transition-all duration-150 cursor-pointer ${
                                isDark
                                  ? "bg-zinc-900/80 hover:bg-zinc-800 border-zinc-800 hover:border-purple-500/40 text-zinc-300 hover:text-white"
                                  : "bg-white hover:bg-purple-50 border-purple-100 hover:border-purple-300 text-zinc-700 hover:text-purple-900 shadow-2xs"
                              }`}
                            >
                              {chip.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contextual Follow-up Chips for non-initial assistant messages (Section 10) */}
                    {!isUser && !isInitial && msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                        {msg.suggestions.slice(0, 3).map((suggestion, sIdx) => (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => handleSend(suggestion)}
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                              isDark
                                ? "bg-zinc-900/70 hover:bg-zinc-800 border-zinc-800/80 text-zinc-300 hover:text-cyan-300 hover:border-cyan-500/30"
                                : "bg-purple-50/70 hover:bg-purple-100 border-purple-200/60 text-purple-900"
                            }`}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Realistic Micro-Typing Indicator (Section 12: 250-350ms) */}
              {isTyping && (
                <div className="flex justify-start">
                  <div
                    className={`rounded-2xl rounded-tl-none px-3.5 py-2.5 flex items-center gap-1.5 border ${
                      isDark
                        ? "bg-zinc-900/90 border-zinc-800"
                        : "bg-white border-purple-100 shadow-xs"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Context-Aware Follow-Up Suggestion Bar (Section 10) */}
            {!isTyping && activeSuggestions.length > 0 && (
              <div
                className={`px-3 py-1.5 border-t overflow-x-auto whitespace-nowrap flex gap-1.5 no-scrollbar transition-colors shrink-0 ${
                  isDark ? "bg-zinc-950/80 border-zinc-900" : "bg-white border-zinc-100"
                }`}
              >
                {activeSuggestions.slice(0, 4).map((suggestion, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => handleSend(suggestion)}
                    className={`text-[10px] font-medium px-2.5 py-1 rounded-full border transition-all duration-150 cursor-pointer shrink-0 ${
                      isDark
                        ? "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 hover:border-cyan-500/40 text-zinc-300 hover:text-cyan-300"
                        : "bg-purple-50/70 hover:bg-purple-100/80 border-purple-200/60 text-purple-900"
                    }`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Input Composer (Section 11) */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className={`p-3 border-t flex gap-2 items-center transition-colors shrink-0 ${
                isDark ? "bg-zinc-950 border-zinc-800/90" : "bg-white border-zinc-200/80"
              }`}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask about Sayam…"
                aria-label="Ask about Sayam"
                disabled={isTyping}
                className={`flex-1 rounded-xl px-3.5 py-2 text-xs outline-none transition-all duration-200 border focus:ring-2 ${
                  isDark
                    ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-white placeholder-zinc-500 focus:border-purple-500/60 focus:ring-purple-500/20"
                    : "bg-zinc-50 border-zinc-200 hover:border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-purple-500 focus:ring-purple-500/15"
                }`}
              />

              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                aria-label="Send message"
                className="p-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 rounded-xl text-white disabled:opacity-35 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_4px_12px_rgba(139,92,246,0.25)] cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Close portfolio assistant" : "Open portfolio assistant"}
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-[0_10px_30px_rgba(139,92,246,0.45)] hover:shadow-[0_15px_40px_rgba(34,211,238,0.55)] cursor-pointer relative group border border-white/20"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.16 }}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.16 }}
              className="flex items-center justify-center"
            >
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-105 transition-transform" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse indicator when closed */}
        {!isOpen && (
          <>
            <span className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-cyan-400 border-2 border-zinc-950 animate-ping opacity-75" />
            <span className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-cyan-400 border-2 border-zinc-950" />
          </>
        )}
      </motion.button>
    </div>
  );
}
