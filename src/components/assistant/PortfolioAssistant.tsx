import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Bot } from "lucide-react";
import { AssistantHeader } from "./AssistantHeader";
import { AssistantConversation } from "./AssistantConversation";
import { AssistantSuggestions } from "./AssistantSuggestions";
import { AssistantComposer } from "./AssistantComposer";
import { ChatMessage } from "./AssistantMessage";
import { streamAssistantMessage, AssistantMessage as ApiMessage } from "../../lib/assistant/client";
import "./assistant.css";

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
    // If user is more than 80px away from bottom, preserve scroll position
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
  const handleSend = async (queryText: string) => {
    const textToSend = (queryText || "").trim();
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

  const handleRetry = () => {
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
      {/* Floating launcher button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            ref={launcherRef}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-zinc-900/90 text-white border border-white/15 shadow-2xl backdrop-blur-md hover:border-purple-500/50 hover:bg-zinc-850 active:scale-95 transition-all cursor-pointer group"
            aria-label="Open Sayam's Agent"
          >
            <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-zinc-200 group-hover:text-purple-300 transition-colors">
              <Bot className="w-4 h-4" />
              <span
                className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-zinc-900"
                aria-hidden="true"
              />
            </div>
            <span className="text-xs font-semibold font-display tracking-tight pr-1">
              Sayam's Agent
            </span>
            <Sparkles className="w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-300 transition-colors" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Assistant Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="assistant-window"
            role="dialog"
            aria-modal="true"
            aria-labelledby="assistant-panel-title"
          >
            {/* 1. Header (fixed height, never scrolls) */}
            <AssistantHeader
              onClear={handleClear}
              onClose={() => setIsOpen(false)}
              isGenerating={isGenerating}
            />

            {/* 2. Conversation (only vertically scrolling region) */}
            <AssistantConversation
              messages={messages}
              isGenerating={isGenerating}
              onRetry={handleRetry}
              scrollContainerRef={scrollContainerRef}
              messagesEndRef={messagesEndRef}
              onScroll={handleScroll}
            />

            {/* 3. Suggestions (rigid bar above composer when relevant) */}
            {showSuggestions && (
              <AssistantSuggestions
                onSelect={handleSend}
                disabled={isGenerating}
              />
            )}

            {/* 4. Composer / Input (fixed at bottom, never scrolls away) */}
            <AssistantComposer
              onSend={handleSend}
              onStop={handleStop}
              isGenerating={isGenerating}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default PortfolioAssistant;
