import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Sparkles, AlertCircle, Brain, Globe } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
  sources?: { title: string; uri: string }[];
}

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      role: "assistant",
      text: "Hi there! I am Sayam's AI Representative. 🤖\n\nAsk me anything about Sayam's skills, academics at Techno Main Salt Lake (TMSL), computer vision projects like **Obsidian Optics**, or his competition achievements!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { label: "⚡ Core Projects", text: "Tell me about Sayam's main projects." },
    { label: "🎓 Academic Stats", text: "What is Sayam's university, semester, and CGPA?" },
    { label: "🛠️ Skill Matrix", text: "What technical skills and languages does Sayam know?" },
    { label: "✉️ How to Contact", text: "How can I contact Sayam or find his resume?" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setErrorMsg(null);
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const chatHistory = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatHistory,
          userMessage: textToSend,
          webGrounding: false
        }),
      });

      if (!response.ok) {
        let errorDetails = "Failed to communicate with the server";
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorDetails = errorData.details || errorData.error || errorDetails;
          } else {
            errorDetails = await response.text();
          }
        } catch (e) {
          errorDetails = `HTTP error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorDetails);
      }

      const data = await response.json();
      
      const assistantMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        text: data.response,
        timestamp: new Date(),
        sources: data.sources || [],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error("AI Assistant connection error:", err);
      const isMissingKey = err.message?.includes("GEMINI_API_KEY") || 
                           err.message?.includes("apiKey") || 
                           err.message?.includes("API key") ||
                           err.message?.includes("API Key") ||
                           err.message?.includes("api_key");
      setErrorMsg(
        isMissingKey 
          ? "API Key is missing. Please configure the GEMINI_API_KEY in the Settings > Secrets Panel (in AI Studio) or as an Environment Variable in your Vercel Dashboard."
          : `Connection issue: ${err.message || "Please try again!"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {/* Expanded Chat Dialog */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="w-[360px] md:w-[400px] h-[520px] rounded-2xl glass-card flex flex-col overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-purple-500/20"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-purple-900/40 via-zinc-900 to-cyan-900/20 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-zinc-950" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white flex items-center gap-1 font-display">
                    Sayam's Agent <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  </h4>
                  <p className="text-[11px] text-zinc-400">Gemini-Powered AI Ambassador</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950/40">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-purple-600 to-indigo-700 text-white font-medium rounded-tr-none shadow-[0_4px_12px_rgba(139,92,246,0.3)]"
                        : "bg-zinc-900/90 text-zinc-100 border border-zinc-800 rounded-tl-none"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      <>
                        <div className="markdown-body prose prose-invert prose-xs max-w-none text-zinc-200">
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-zinc-800/80 space-y-1">
                            <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono flex items-center gap-1 font-bold">
                              <Globe className="w-2.5 h-2.5 text-cyan-400 animate-pulse" /> Grounding References
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {msg.sources.map((src, sIdx) => (
                                <a
                                  key={sIdx}
                                  href={src.uri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] bg-zinc-950 border border-zinc-800 hover:border-cyan-500/40 text-cyan-400 hover:text-cyan-300 rounded px-1.5 py-0.5 transition-all max-w-[150px] truncate block"
                                  title={src.title}
                                >
                                  {src.title}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    <span
                      className={`block text-[9px] mt-1.5 ${
                        msg.role === "user" ? "text-purple-200 text-right" : "text-zinc-500"
                      }`}
                    >
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-red-950/50 border border-red-500/20 rounded-xl text-red-200 text-xs flex items-start gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Connection Error</p>
                    <p className="text-[10px] text-red-300/80 mt-0.5 leading-relaxed">{errorMsg}</p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions (Only shows when chat has few messages) */}
            {messages.length < 5 && (
              <div className="px-4 py-2 bg-zinc-950/20 border-t border-zinc-900 overflow-x-auto whitespace-nowrap flex gap-2 no-scrollbar">
                {quickPrompts.map((qp, index) => (
                  <button
                    key={index}
                    onClick={() => handleSend(qp.text)}
                    className="text-[11px] bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-purple-500/30 text-zinc-300 hover:text-cyan-300 rounded-full px-3 py-1.5 transition-all duration-200 ease-out cursor-pointer shrink-0"
                  >
                    {qp.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 bg-zinc-950 border-t border-zinc-800 flex flex-col gap-2"
            >
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about Sayam..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-cyan-500/60 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none transition-all duration-200 focus:ring-1 focus:ring-cyan-500/20"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_4px_12px_rgba(139,92,246,0.2)] cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-700 to-cyan-500 flex items-center justify-center text-white shadow-[0_10px_30px_rgba(139,92,246,0.4)] hover:shadow-[0_15px_40px_rgba(34,211,238,0.6)] cursor-pointer relative group border border-white/10"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <MessageSquare className="w-6 h-6 text-white group-hover:scale-105 transition-transform" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Unread dot */}
        {!isOpen && (
          <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-zinc-950 animate-ping" />
        )}
        {!isOpen && (
          <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-zinc-950" />
        )}
      </motion.button>
    </div>
  );
}
