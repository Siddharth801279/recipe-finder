import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo
    });

    // You can also log the error to an error reporting service here
    if (import.meta.env.PROD) {
      // Example: logErrorToService(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white p-6">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">🍳💥</div>
            <h1 className="text-2xl font-bold text-primary-light mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-300 mb-6">
              We're sorry, but something unexpected happened while preparing your recipes.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-all shadow-food"
              >
                🔄 Refresh Page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-6 py-3 bg-secondary hover:bg-secondary-light text-white rounded-lg font-medium transition-all shadow-food"
              >
                🏠 Go Home
              </button>
            </div>

            {/* Show error details in development */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-primary-light font-medium">
                  Show Error Details (Development)
                </summary>
                <div className="mt-3 p-4 bg-gray-900 rounded-lg text-xs overflow-auto">
                  <div className="text-red-400 font-bold mb-2">Error:</div>
                  <pre className="whitespace-pre-wrap mb-4">{this.state.error.toString()}</pre>

                  <div className="text-red-400 font-bold mb-2">Stack Trace:</div>
                  <pre className="whitespace-pre-wrap text-gray-400">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
