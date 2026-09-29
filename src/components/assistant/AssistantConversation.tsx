import React, { memo } from "react";
import { AssistantMessage, ChatMessage } from "./AssistantMessage";
import { AssistantTyping } from "./AssistantTyping";

interface AssistantConversationProps {
  messages: ChatMessage[];
  isGenerating: boolean;
  onRetry: (content: string) => void;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onScroll: () => void;
}

export const AssistantConversation = memo(function AssistantConversation({
  messages,
  isGenerating,
  onRetry,
  scrollContainerRef,
  messagesEndRef,
  onScroll,
}: AssistantConversationProps) {
  const isTyping =
    isGenerating &&
    messages.length > 0 &&
    messages[messages.length - 1]?.role === "assistant" &&
    messages[messages.length - 1]?.content.trim().length === 0;

  return (
    <div
      ref={scrollContainerRef}
      onScroll={onScroll}
      className="assistant-conversation-viewport space-y-3"
      role="log"
      aria-live="polite"
      aria-label="Conversation history"
    >
      {messages.map((msg) => (
        <AssistantMessage
          key={msg.id}
          message={msg}
          onRetry={onRetry}
        />
      ))}

      {isTyping && <AssistantTyping />}

      <div ref={messagesEndRef} aria-hidden="true" className="h-px" />
    </div>
  );
});
