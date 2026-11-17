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
        <div className="card w-full p-6 sm:p-8 my-4 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-[8px] bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)] flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-[var(--text)] font-display">
              {this.props.fallbackTitle || (this.props.sectionName ? `${this.props.sectionName} Temporarily Unavailable` : "Component Temporarily Unavailable")}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">
              {this.props.fallbackDescription ||
                "A temporary network or rendering delay occurred while loading this section. You can retry or continue browsing other sections."}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={this.handleReset}
              className="btn btn-primary min-h-[38px] px-4 py-2 text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
            <button
              type="button"
              onClick={this.handleReload}
              className="btn btn-secondary min-h-[38px] px-4 py-2 text-xs"
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
        <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--text)] flex flex-col items-center justify-center p-6 text-center">
          <div className="card max-w-md w-full p-8 shadow-2xl space-y-6">
            <div className="w-14 h-14 mx-auto rounded-[10px] bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)] flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold font-display text-[var(--text)]">
                Sayam Mukherjee · Portfolio
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                The application encountered a temporary display issue during reload. Your session is safe, and reloading will refresh the latest bundle.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="btn btn-primary w-full sm:w-auto text-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reload Website</span>
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="btn btn-secondary w-full sm:w-auto text-xs"
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
