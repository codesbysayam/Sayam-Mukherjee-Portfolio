import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Compass } from "lucide-react";
import { AssistantHeader } from "./AssistantHeader";
import { AssistantConversation } from "./AssistantConversation";
import { AssistantSuggestions } from "./AssistantSuggestions";
import { AssistantComposer } from "./AssistantComposer";
import { ChatMessage } from "./AssistantMessage";
import { streamAssistantMessage, AssistantMessage as ApiMessage } from "../../lib/assistant/client";
import "./assistant.css";

const INITIAL_GREETING = `Hi, I’m Sayam’s Portfolio Guide.

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

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isUserScrolledUp.current = distanceToBottom > 80;
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    if (isUserScrolledUp.current) return;
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

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

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSend = async (queryText: string) => {
    const textToSend = (queryText || "").trim();
    if (!textToSend || isGenerating) return;

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
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMsg) {
      setMessages((prev) => prev.filter((m) => !m.error));
      handleSend(lastUserMsg.content);
    }
  };

  const showSuggestions = messages.length <= 3 && !isGenerating;

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            ref={launcherRef}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setIsOpen(true)}
            className="floating-dock-right fixed z-40 bottom-[calc(64px+env(safe-area-inset-bottom,0px)+0.5rem)] right-[max(0.75rem,calc(env(safe-area-inset-right,0px)+0.5rem))] sm:right-5 md:bottom-6 md:right-6 flex items-center gap-2 min-h-[44px] px-3.5 sm:px-4 py-2 rounded-[6px] bg-[#20231D] text-[#F4F4ED] border border-[#41443A] shadow-lg hover:bg-[#151713] hover:border-[#C7E34A] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            aria-label="Open Portfolio Guide"
          >
            <Compass className="w-4 h-4 text-[#C7E34A] shrink-0" />
            <span className="text-xs font-bold font-display tracking-tight">
              <span className="hidden sm:inline">Portfolio Guide</span>
              <span className="sm:hidden">Guide</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="assistant-window"
            role="dialog"
            aria-modal="true"
            aria-labelledby="assistant-panel-title"
          >
            <AssistantHeader
              onClear={handleClear}
              onClose={() => setIsOpen(false)}
              isGenerating={isGenerating}
            />

            <AssistantConversation
              messages={messages}
              isGenerating={isGenerating}
              onRetry={handleRetry}
              scrollContainerRef={scrollContainerRef}
              messagesEndRef={messagesEndRef}
              onScroll={handleScroll}
            />

            {showSuggestions && (
              <AssistantSuggestions
                onSelect={handleSend}
                disabled={isGenerating}
              />
            )}

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
