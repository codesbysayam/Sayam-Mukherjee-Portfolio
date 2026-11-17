import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class AppErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[Portfolio Error]", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className="app-error-state min-h-[40vh] flex items-center justify-center p-6">
        <div className="card max-w-md w-full p-6 sm:p-8 text-center space-y-4">
          <span className="text-[11px] font-mono font-semibold tracking-[0.14em] text-[var(--accent)] uppercase block">
            Page Error
          </span>

          <h1 className="text-xl font-bold text-[var(--text)] font-display">
            Something went wrong
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
            This section could not be loaded correctly. The rest of the portfolio remains unaffected.
          </p>

          <button
            type="button"
            onClick={this.handleReload}
            className="btn btn-primary text-xs"
          >
            Reload Page
          </button>
        </div>
      </main>
    );
  }
}

export default AppErrorBoundary;
