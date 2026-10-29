import React from "react";

const RELOAD_KEY = "__portfolio_chunk_reload__";

/**
 * Resilient lazy component loader with automatic in-memory retries
 * and exponential backoff. Handles transient network delays, dev-server
 * module transformation latency, and chunk invalidation.
 */
export function lazyWithRetry<T extends React.ComponentType<any>>(
  importer: () => Promise<{ default: T }>,
  maxRetries = 3,
  baseDelayMs = 400
) {
  return React.lazy(async () => {
    let lastError: unknown;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const module = await importer();
        // Clear reload flag on successful load
        try {
          sessionStorage.removeItem(RELOAD_KEY);
        } catch {}
        return module;
      } catch (error) {
        lastError = error;
        const message = error instanceof Error ? error.message : String(error);

        const isModuleOrNetworkError =
          message.includes("Failed to fetch dynamically imported module") ||
          message.includes("Importing a module script failed") ||
          message.includes("error loading dynamically imported module") ||
          message.includes("ChunkLoadError") ||
          message.includes("Loading chunk") ||
          message.includes("NetworkError") ||
          message.includes("Failed to fetch");

        if (attempt < maxRetries && isModuleOrNetworkError) {
          // Exponential backoff before next in-memory retry
          const delay = baseDelayMs * Math.pow(1.6, attempt);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        // If all in-memory attempts exhausted and it's a chunk error, try a single page reload if allowed
        if (isModuleOrNetworkError && typeof window !== "undefined") {
          let alreadyRetried = false;
          try {
            alreadyRetried = sessionStorage.getItem(RELOAD_KEY) === "1";
          } catch {
            alreadyRetried = false;
          }

          if (!alreadyRetried) {
            try {
              sessionStorage.setItem(RELOAD_KEY, "1");
              window.location.reload();
              return await new Promise<never>(() => {});
            } catch {}
          }
        }

        break;
      }
    }

    throw lastError;
  });
}

export function clearChunkReloadFlag() {
  try {
    sessionStorage.removeItem(RELOAD_KEY);
  } catch {}
}
