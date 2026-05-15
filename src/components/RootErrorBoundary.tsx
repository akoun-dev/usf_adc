import { Component, type ErrorInfo, type ReactNode } from "react";

export class RootErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  state = { hasError: false, error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    // Also show in tab title for easy copying
    document.title = "ERROR: " + error.message.substring(0, 100);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[RootErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 32, fontFamily: "sans-serif", color: "#333" }}>
          <h1 style={{ color: "red", fontSize: 20 }}>Erreur au chargement</h1>
          <pre style={{ background: "#f5f5f5", padding: 16, borderRadius: 8, overflow: "auto", fontSize: 13 }}>
            {this.state.error?.message}
            {"\n"}
            {this.state.error?.stack}
          </pre>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ marginTop: 16, padding: "8px 16px", cursor: "pointer" }}
          >
            Réessayer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
