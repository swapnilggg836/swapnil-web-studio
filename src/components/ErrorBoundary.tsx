import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class SectionErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[ErrorBoundary] Component "${this.props.name || "Unknown"}" crashed:`, error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="py-12 px-6 text-center border border-red-500/20 bg-red-500/5 rounded-xl my-4">
          <p className="text-red-400 font-mono text-xs">
            [Section "{this.props.name || "Component"}": {this.state.error?.message || "Render Error"}]
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SectionErrorBoundary;
