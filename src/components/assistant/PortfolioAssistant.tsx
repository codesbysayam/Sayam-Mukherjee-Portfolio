import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X, RotateCcw, MessageSquare, Bot } from "lucide-react";
import { AssistantMessage, ChatMessage } from "./AssistantMessage";
import { AssistantSuggestions } from "./AssistantSuggestions";
import { AssistantInput } from "./AssistantInput";
import { AssistantTyping } from "./AssistantTyping";
import { streamAssistantMessage, AssistantMessage as ApiMessage } from "../../lib/assistant/client";

const INITIAL_GREETING = `Hi, I’m Sayam’s Portfolio Assistant.

I can help you explore his projects, education, skills, GitHub activity, certificates, journal entries and other verified portfolio information.

Ask me anything.`;

export function PortfolioAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-welcome",
      role: "assistant",
      content: INITIAL_GREETING,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isUserScrolledUp = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  // Check if user is scrolled up before auto-scrolling
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    // If user is more than 80px away from bottom, they are reading older messages
    isUserScrolledUp.current = distanceToBottom > 80;
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    if (isUserScrolledUp.current) return;
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // Keyboard accessibility: Escape closes panel
  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsOpen(false);
          launcherRef.current?.focus();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  // Clean up ongoing requests on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Send query logic
  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText ?? input).trim();
    if (!textToSend || isGenerating) return;

    // Reset user scroll lock when they ask a new question
    isUserScrolledUp.current = false;

    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `asst-${Date.now()}`;

    const userMsg: ChatMessage = {
      id: userMessageId,
      role: "user",
      content: textToSend,
      timestamp: new Date().toISOString(),
    };

    const asstPlaceholder: ChatMessage = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMsg, asstPlaceholder]);
    setInput("");
    setIsGenerating(true);

    setTimeout(() => {
      isUserScrolledUp.current = false;
      scrollToBottom("smooth");
    }, 40);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const historyPayload: ApiMessage[] = messages
      .filter((m) => !m.error && m.content.trim().length > 0)
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    try {
      await streamAssistantMessage({
        message: textToSend,
        history: historyPayload,
        signal: controller.signal,
        onChunk: (_chunk, accumulated) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: accumulated, isStreaming: true }
                : msg
            )
          );
          scrollToBottom("auto");
        },
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, isStreaming: false }
            : msg
        )
      );
    } catch (err: any) {
      if (err.name === "AbortError") {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, isStreaming: false }
              : msg
          )
        );
      } else {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content:
                    msg.content.trim().length > 0
                      ? msg.content
                      : "I couldn't complete that response. Please try again.",
                  isStreaming: false,
                  error: msg.content.trim().length === 0,
                }
              : msg
          )
        );
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
      setTimeout(() => scrollToBottom("smooth"), 50);
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
  };

  const handleClear = () => {
    if (isGenerating) handleStop();
    setMessages([
      {
        id: "initial-welcome",
        role: "assistant",
        content: INITIAL_GREETING,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const handleRetry = (failedContent: string) => {
    // Find preceding user question
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMsg) {
      // Remove last failed message
      setMessages((prev) => prev.filter((m) => !m.error));
      handleSend(lastUserMsg.content);
    }
  };

  const showSuggestions = messages.length <= 3 && !isGenerating;

  return (
    <>
      {/* Floating launcher trigger */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            ref={launcherRef}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-zinc-900/90 dark:bg-zinc-900/95 text-white border border-zinc-700/80 shadow-xl backdrop-blur-md hover:border-zinc-500 hover:bg-zinc-850 active:scale-95 transition-all cursor-pointer group"
            aria-label="Open Sayam's Agent"
          >
            <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-zinc-200 group-hover:text-white">
              <Bot className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-zinc-900" />
            </div>
            <span className="text-xs font-semibold font-display tracking-tight pr-1">
              Sayam's Agent
            </span>
            <Sparkles className="w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-300 transition-colors" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Assistant Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[min(650px,calc(100vh-2.5rem))] flex flex-col rounded-2xl bg-zinc-950/90 dark:bg-zinc-950/95 border border-zinc-800/90 shadow-2xl backdrop-blur-xl overflow-hidden font-sans"
            role="dialog"
            aria-labelledby="assistant-panel-title"
          >
            {/* Header: compact, native feel */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/80 bg-zinc-900/40 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200 shrink-0 shadow-inner">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 leading-tight">
                    <h2
                      id="assistant-panel-title"
                      className="text-sm font-bold text-white font-display tracking-tight truncate"
                    >
                      Sayam's Agent
                    </h2>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mt-0.5">
                    <span>Portfolio Assistant</span>
                    <span className="text-zinc-600 dark:text-zinc-500">•</span>
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Online
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-2 py-1 rounded-md text-[11px] font-mono text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                  title="Clear conversation"
                  aria-label="Clear conversation"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-850 active:scale-95 transition-all cursor-pointer flex items-center justify-center ml-0.5"
                  title="Close assistant (Esc)"
                  aria-label="Close assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Conversation Messages Area */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3 overscroll-contain"
            >
              {messages.map((msg) => (
                <AssistantMessage
                  key={msg.id}
                  message={msg}
                  onRetry={handleRetry}
                />
              ))}

              {isGenerating && messages[messages.length - 1]?.content === "" && (
                <AssistantTyping />
              )}

              {/* Explore Chips */}
              {showSuggestions && (
                <AssistantSuggestions
                  onSelect={handleSend}
                  disabled={isGenerating}
                />
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <AssistantInput
              value={input}
              onChange={setInput}
              onSend={() => handleSend()}
              onStop={handleStop}
              isGenerating={isGenerating}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
