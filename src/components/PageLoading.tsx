import React from "react";

export interface PageLoadingProps {
  title?: string;
  blocks?: number;
}

export function PageLoading({ title, blocks = 3 }: PageLoadingProps) {
  return (
    <div
      className="w-full space-y-8 py-6"
      aria-label={title ? `Loading ${title}` : "Loading page content"}
      role="status"
    >
      <div className="space-y-3 max-w-xl">
        <div className="w-24 h-4 rounded-[4px] bg-[var(--surface)]" />
        <div className="w-64 sm:w-80 h-8 rounded-[6px] bg-[var(--surface)]" />
        <div className="w-full max-w-md h-4 rounded-[4px] bg-[var(--surface)]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 space-y-4">
          <div className="h-44 sm:h-56 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
            <div className="w-48 h-5 rounded-[4px] bg-[var(--surface-3)]" />
            <div className="space-y-2">
              <div className="w-full h-3.5 rounded-[4px] bg-[var(--surface-3)]" />
              <div className="w-5/6 h-3.5 rounded-[4px] bg-[var(--surface-3)]" />
              <div className="w-4/6 h-3.5 rounded-[4px] bg-[var(--surface-3)]" />
            </div>
            <div className="flex gap-2 pt-2">
              <div className="w-20 h-6 rounded-[4px] bg-[var(--surface-3)]" />
              <div className="w-24 h-6 rounded-[4px] bg-[var(--surface-3)]" />
            </div>
          </div>

          {blocks >= 2 && (
            <div className="h-40 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-6 space-y-3">
              <div className="w-36 h-4 rounded-[4px] bg-[var(--surface-3)]" />
              <div className="space-y-2">
                <div className="w-full h-3 rounded-[4px] bg-[var(--surface-3)]" />
                <div className="w-3/4 h-3 rounded-[4px] bg-[var(--surface-3)]" />
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-4 space-y-4">
          <div className="h-64 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
            <div className="w-28 h-4 rounded-[4px] bg-[var(--surface-3)]" />
            <div className="space-y-2.5 pt-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="w-20 h-3 rounded-[4px] bg-[var(--surface-3)]" />
                  <div className="w-12 h-3 rounded-[4px] bg-[var(--surface-3)]" />
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
