import React, { Component, ErrorInfo, ReactNode } from "react";
import { ArrowLeft, AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
  onNavigateHome?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class LegalRouteErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("LegalRoute caught an error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-[60vh] flex items-center justify-center px-4 py-16 font-sans select-text">
          <section className="route-error max-w-xl mx-auto p-8 text-center rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
            <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
              Something went wrong.
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6 leading-relaxed">
              This page could not be displayed. Please return to the portfolio and try again.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={this.props.onNavigateHome || (() => (window.location.href = "/"))}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Portfolio</span>
              </button>
              <button
                onClick={this.handleReset}
                className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </section>
        </div>
      );
    }

    return this.props.children;
  }
}

export default LegalRouteErrorBoundary;
