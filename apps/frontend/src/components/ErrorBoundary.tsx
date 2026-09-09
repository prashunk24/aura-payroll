import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message?: string;
}

/**
 * Keeps a failing subtree (e.g. a missing wallet extension) from taking down
 * the whole render tree.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error?.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Caught render error:", error, info?.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) return this.props.fallback;
      return (
        <div className="glass rounded-2xl p-5 text-sm">
          <p className="font-semibold">Something didn't load correctly.</p>
          <p className="text-muted-foreground mt-1">
            Please refresh the page. If it keeps happening, try again in a moment.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
