import React from "react";

export interface PageLoadingProps {
  title?: string;
  blocks?: number;
}

/**
 * PageLoading Component
 * 
 * Apple/iOS-inspired subtle skeleton loader for route-level Suspense boundaries.
 * Keeps the header/navigation shell intact, prevents black/blank screens,
 * and maintains layout stability with gentle, low-intensity pulse animations.
 */
export function PageLoading({ title, blocks = 3 }: PageLoadingProps) {
  return (
    <div
      className="w-full space-y-8 py-6 animate-pulse"
      aria-label="Loading page content"
      role="status"
    >
      {/* Title & Eyebrow Placeholder */}
      <div className="space-y-3 max-w-xl">
        <div className="w-24 h-4 rounded-md bg-zinc-200 dark:bg-zinc-800/80" />
        <div className="w-64 sm:w-80 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="w-full max-w-md h-4 rounded-md bg-zinc-150 dark:bg-zinc-850" />
      </div>

      {/* Content Blocks Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 space-y-4">
          <div className="h-44 sm:h-56 rounded-2xl border border-zinc-200 dark:border-zinc-800/60 bg-zinc-100/60 dark:bg-zinc-900/40 p-6 space-y-4">
            <div className="w-48 h-5 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="space-y-2">
              <div className="w-full h-3.5 rounded bg-zinc-150 dark:bg-zinc-850" />
              <div className="w-5/6 h-3.5 rounded bg-zinc-150 dark:bg-zinc-850" />
              <div className="w-4/6 h-3.5 rounded bg-zinc-150 dark:bg-zinc-850" />
            </div>
            <div className="flex gap-2 pt-2">
              <div className="w-20 h-6 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="w-24 h-6 rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>

          {blocks >= 2 && (
            <div className="h-40 rounded-2xl border border-zinc-200 dark:border-zinc-800/60 bg-zinc-100/40 dark:bg-zinc-900/30 p-6 space-y-3">
              <div className="w-36 h-4 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="space-y-2">
                <div className="w-full h-3 rounded bg-zinc-150 dark:bg-zinc-850" />
                <div className="w-3/4 h-3 rounded bg-zinc-150 dark:bg-zinc-850" />
              </div>
            </div>
          )}
        </div>

        {/* Aside Sidebar Skeleton */}
        <div className="md:col-span-4 space-y-4">
          <div className="h-64 rounded-2xl border border-zinc-200 dark:border-zinc-800/60 bg-zinc-100/60 dark:bg-zinc-900/40 p-5 space-y-3">
            <div className="w-28 h-4 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="space-y-2.5 pt-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="w-20 h-3 rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="w-12 h-3 rounded bg-zinc-150 dark:bg-zinc-850" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageLoading;
