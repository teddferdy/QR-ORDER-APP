import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen bg-secondary dark:bg-gray-900 flex items-center justify-center p-6">
          <div className="text-center space-y-6 max-w-sm">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30">
              <span className="text-4xl">⚠️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Ups, ada error!
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                Terjadi kesalahan yang tidak terduga. Coba refresh halaman ya.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={this.handleRetry}
                className="bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20"
              >
                Coba Lagi
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-2xl font-bold"
              >
                Refresh Halaman
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