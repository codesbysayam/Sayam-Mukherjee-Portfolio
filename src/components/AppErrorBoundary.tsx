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
        <div className="app-error-card max-w-md w-full p-6 sm:p-8 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-center space-y-4 shadow-xl">
          <span className="app-error-eyebrow text-[10px] font-mono font-bold tracking-widest text-purple-400 uppercase">
            PAGE ERROR
          </span>

          <h1 className="text-xl font-bold text-white font-display">
            Something went wrong
          </h1>

          <p className="text-xs text-zinc-400 leading-relaxed">
            This section could not be loaded correctly.
            The rest of the portfolio is still safe.
          </p>

          <button
            type="button"
            onClick={this.handleReload}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold cursor-pointer transition-all shadow-md active:scale-95"
          >
            Reload Page
          </button>
        </div>
      </main>
    );
  }
}

export default AppErrorBoundary;
