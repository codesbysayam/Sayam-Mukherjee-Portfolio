import React, { memo } from "react";

export const AssistantTyping = memo(function AssistantTyping() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl rounded-tl-xs bg-zinc-950/70 dark:bg-zinc-900/60 border border-zinc-800/80 w-fit backdrop-blur-xs">
      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "150ms" }} />
      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  );
});
