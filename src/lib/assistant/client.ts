/**
 * Client service for Sayam's Portfolio Assistant
 * 
 * Handles real-time SSE streaming, chunk aggregation, cancellation via AbortSignal,
 * and error resilience.
 */

import { generatePortfolioAnswer } from "../../utils/portfolioAssistantEngine";

export interface AssistantMessage {
  role: "user" | "assistant";
  content: string;
}

export interface StreamAssistantOptions {
  message: string;
  history?: AssistantMessage[];
  onChunk: (chunkText: string, accumulatedText: string) => void;
  signal?: AbortSignal;
}

/**
 * Streams response from /api/assistant using Server-Sent Events (SSE).
 * Calls onChunk progressively as tokens arrive from the server.
 * Gracefully falls back to client-side portfolio knowledge engine if network fails.
 */
export async function streamAssistantMessage({
  message,
  history = [],
  onChunk,
  signal,
}: StreamAssistantOptions): Promise<string> {
  const recentHistory = history.slice(-12);

  try {
    const response = await fetch("/api/assistant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream, application/json",
      },
      body: JSON.stringify({
        message,
        history: recentHistory,
        stream: true,
      }),
      signal,
    });

    if (!response.ok) {
      throw new Error(`Server status ${response.status}`);
    }

    // Check if server returned fallback JSON
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await response.json();
      const text = data.text || data.response || "";
      onChunk(text, text);
      return text;
    }

    // SSE Stream Processing
    if (!response.body) {
      throw new Error("Empty response body");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let accumulatedText = "";
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data:")) continue;

          const dataStr = trimmed.slice(5).trim();
          if (dataStr === "[DONE]") {
            return accumulatedText;
          }

          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.text) {
              accumulatedText += parsed.text;
              onChunk(parsed.text, accumulatedText);
            }
          } catch {
            // Ignore non-JSON SSE lines
          }
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        return accumulatedText;
      }
      throw err;
    } finally {
      reader.releaseLock();
    }

    if (accumulatedText.trim().length > 0) {
      return accumulatedText;
    }
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw err;
    }
    // Graceful offline/network fallback directly to authoritative portfolio knowledge
    const fallbackAnswer = generatePortfolioAnswer(message);
    let acc = "";
    const words = fallbackAnswer.split(" ");
    for (let i = 0; i < words.length; i++) {
      if (signal?.aborted) break;
      const piece = (i === 0 ? "" : " ") + words[i];
      acc += piece;
      onChunk(piece, acc);
      await new Promise((resolve) => setTimeout(resolve, 12));
    }
    return acc || fallbackAnswer;
  }

  return "";
}

/**
 * Standard non-streaming message sender (used as fallback or for lightweight calls)
 */
export async function sendAssistantMessage(
  message: string,
  history: AssistantMessage[] = [],
  signal?: AbortSignal
): Promise<{ text: string }> {
  try {
    const response = await fetch("/api/assistant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        history: history.slice(-12),
        stream: false,
      }),
      signal,
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (err: any) {
    if (err?.name === "AbortError") throw err;
  }

  return { text: generatePortfolioAnswer(message) };
}
