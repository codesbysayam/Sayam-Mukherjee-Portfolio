import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, RotateCcw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
  onReset?: () => void;
  sectionName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Section-level Error Boundary that catches component exceptions
 * and prevents whole-page unmounting / black screen.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`ErrorBoundary caught an error${this.props.sectionName ? ` in ${this.props.sectionName}` : ""}:`, error, errorInfo);
  }

  private handleReset = () => {
    if (this.props.onReset) {
      try {
        this.props.onReset();
      } catch (e) {
        console.error("ErrorBoundary onReset error:", e);
      }
    }
    this.setState({ hasError: false, error: null });
  };

  private handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full p-6 sm:p-8 my-4 rounded-2xl bg-zinc-950/90 dark:bg-zinc-950/90 border border-zinc-800 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 mx-auto rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-white font-mono uppercase tracking-wider">
              {this.props.fallbackTitle || (this.props.sectionName ? `${this.props.sectionName} Temporarily Unavailable` : "Component Temporarily Unavailable")}
            </h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
              {this.props.fallbackDescription ||
                "A temporary network or rendering delay occurred while loading this section. You can retry or continue browsing other sections."}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold font-mono cursor-pointer transition-all shadow-md active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white cursor-pointer transition-colors active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reload Page</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Top-level application root Error Boundary to prevent any full-screen blackouts.
 */
export class RootErrorBoundary extends Component<{ children: ReactNode }, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("RootErrorBoundary caught fatal error:", error, errorInfo);
  }

  private handleReload = () => {
    if (typeof window !== "undefined") {
      // Clear potential stale reload keys and reload cleanly
      try {
        sessionStorage.clear();
      } catch {}
      window.location.reload();
    }
  };

  private handleGoHome = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#05050a] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full p-8 rounded-3xl bg-zinc-950 border border-zinc-800/80 shadow-2xl space-y-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold font-display text-white">
                Sayam Mukherjee | Portfolio
              </h1>
              <p className="text-xs text-zinc-400 leading-relaxed">
                The application encountered a temporary display issue during reload. Your session is safe, and reloading will refresh the latest code bundle.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold font-mono cursor-pointer transition-all shadow-lg active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reload Website</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white cursor-pointer transition-colors active:scale-95"
              >
                <Home className="w-4 h-4" />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
