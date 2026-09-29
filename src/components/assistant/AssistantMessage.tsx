import React, { useState, memo } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { AssistantError } from "./AssistantError";

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
}

export const AssistantMessage = memo(function AssistantMessage({
  message,
  onRetry,
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
        <div className="max-w-[85%] sm:max-w-[78%] rounded-2xl rounded-tr-xs px-3.5 py-2.5 text-[13px] sm:text-sm leading-relaxed bg-gradient-to-r from-purple-600/90 to-indigo-600/90 text-white shadow-md border border-purple-500/20">
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
      </div>
    );
  }

  if (message.error) {
    return (
      <AssistantError
        message={message.content || "I couldn't complete that response. Please try again."}
        onRetry={onRetry ? () => onRetry(message.content) : undefined}
      />
    );
  }

  return (
    <div className="flex flex-col items-start w-full group space-y-1">
      <div className="max-w-[94%] sm:max-w-[90%] rounded-2xl rounded-tl-xs px-3.5 sm:px-4 py-3 text-[13px] sm:text-sm leading-relaxed bg-white/[0.04] border border-white/[0.08] text-zinc-200 shadow-sm backdrop-blur-xs">
        <div className="markdown-prose prose-invert prose-sm max-w-none text-zinc-200 space-y-2 font-sans">
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
                <p className="leading-relaxed text-[13px] sm:text-[13.5px] mb-1.5 last:mb-0 text-zinc-200">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-4 space-y-1 my-1.5 text-[12.5px] sm:text-[13px] text-zinc-300">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-4 space-y-1 my-1.5 text-[12.5px] sm:text-[13px] text-zinc-300">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li className="leading-snug">{children}</li>,
              strong: ({ children }) => (
                <strong className="font-semibold text-white">
                  {children}
                </strong>
              ),
              code: ({ children }) => (
                <code className="px-1.5 py-0.5 rounded-md bg-white/[0.08] border border-white/[0.1] text-purple-300 font-mono text-xs">
                  {children}
                </code>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-purple-300 hover:text-white underline underline-offset-3 font-medium transition-colors"
                >
                  <span>{children}</span>
                  <ExternalLink className="w-3 h-3 inline-block opacity-70" aria-hidden="true" />
                </a>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>

          {message.isStreaming && (
            <span
              className="inline-block w-1.5 h-3.5 bg-purple-400 animate-pulse ml-0.5 align-middle"
              aria-hidden="true"
            />
          )}
        </div>
      </div>

      {/* Message action controls (Copy) */}
      {message.content && !message.isStreaming && (
        <div className="flex items-center gap-2 pl-1 opacity-70 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors py-0.5 px-1.5 rounded-md hover:bg-white/[0.06] cursor-pointer"
            title="Copy message"
            aria-label="Copy response"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" aria-hidden="true" />
                <span className="text-emerald-400 font-mono">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" aria-hidden="true" />
                <span className="font-mono">Copy</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
});
