import React, { useState, memo } from "react";
import { Copy, Check, RotateCcw, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isStreaming?: boolean;
  error?: boolean;
}

interface AssistantMessageProps {
  message: ChatMessage;
  onRetry?: (content: string) => void;
  isDark?: boolean;
}

export const AssistantMessage = memo(function AssistantMessage({
  message,
  onRetry,
  isDark = true,
}: AssistantMessageProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!message.content) return;
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback
    }
  };

  if (isUser) {
    return (
      <div className="flex justify-end w-full group">
        <div className="max-w-[85%] sm:max-w-[80%] rounded-2xl rounded-tr-xs px-4 py-2.5 text-sm leading-relaxed bg-zinc-900 text-white border border-zinc-700/60 dark:bg-zinc-800 dark:border-zinc-700/80 shadow-xs">
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start w-full group space-y-1.5">
      <div className="max-w-[92%] sm:max-w-[88%] rounded-2xl rounded-tl-xs px-4 py-3 text-sm leading-relaxed bg-zinc-950/70 dark:bg-zinc-900/60 border border-zinc-800/80 dark:border-zinc-800/90 text-zinc-200 dark:text-zinc-200 shadow-sm backdrop-blur-xs">
        {message.error ? (
          <div className="space-y-2 text-rose-400 dark:text-rose-300">
            <p>{message.content || "I couldn't complete that response. Please try again."}</p>
            {onRetry && (
              <button
                type="button"
                onClick={() => onRetry(message.content)}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer pt-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            )}
          </div>
        ) : (
          <div className="markdown-prose prose-invert prose-sm max-w-none text-zinc-300 dark:text-zinc-200 space-y-2">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-base font-semibold text-white mt-2 mb-1.5 font-display tracking-tight">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-sm font-semibold text-white mt-2 mb-1 font-display tracking-tight">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xs font-semibold text-white mt-1.5 mb-1 font-display">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="leading-relaxed text-[13.5px] mb-1.5 last:mb-0 text-zinc-200 dark:text-zinc-200">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-4 space-y-1 my-1.5 text-[13px] text-zinc-300">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-4 space-y-1 my-1.5 text-[13px] text-zinc-300">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li className="leading-snug">{children}</li>,
                strong: ({ children }) => (
                  <strong className="font-semibold text-white dark:text-zinc-100">
                    {children}
                  </strong>
                ),
                code: ({ children }) => (
                  <code className="px-1.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-xs">
                    {children}
                  </code>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 text-zinc-300 hover:text-white underline underline-offset-3 font-medium transition-colors"
                  >
                    <span>{children}</span>
                    <ExternalLink className="w-3 h-3 inline-block opacity-70" />
                  </a>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>

            {message.isStreaming && (
              <span className="inline-block w-1.5 h-3.5 bg-emerald-400 animate-pulse ml-0.5 align-middle" />
            )}
          </div>
        )}
      </div>

      {/* Message action controls (Copy) */}
      {!message.error && message.content && !message.isStreaming && (
        <div className="flex items-center gap-2 pl-1 opacity-70 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors py-0.5 px-1.5 rounded-md hover:bg-zinc-850 cursor-pointer"
            title="Copy message"
            aria-label="Copy response"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-mono">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span className="font-mono">Copy</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
});
