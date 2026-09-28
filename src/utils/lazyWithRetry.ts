import React from "react";

const RELOAD_KEY = "__portfolio_chunk_reload__";

export function lazyWithRetry<T extends React.ComponentType<any>>(
  importer: () => Promise<{ default: T }>
) {
  return React.lazy(async () => {
    try {
      return await importer();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error);

      const chunkError =
        message.includes("Failed to fetch dynamically imported module") ||
        message.includes("Importing a module script failed") ||
        message.includes("ChunkLoadError") ||
        message.includes("Loading chunk");

      if (chunkError) {
        let alreadyRetried = false;

        try {
          alreadyRetried =
            sessionStorage.getItem(RELOAD_KEY) === "1";
        } catch {
          alreadyRetried = false;
        }

        if (!alreadyRetried) {
          try {
            sessionStorage.setItem(RELOAD_KEY, "1");
          } catch {}

          window.location.reload();

          await new Promise<never>(() => {});
        }
      }

      throw error;
    }
  });
}

export function clearChunkReloadFlag() {
  try {
    sessionStorage.removeItem(RELOAD_KEY);
  } catch {}
}
