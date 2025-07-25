import React from 'react';
import { FiAlertTriangle, FiRefreshCw, FiHome } from 'react-icons/fi';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            {/* Error Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse">
                <FiAlertTriangle className="w-12 h-12 text-red-500" />
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-3xl sm:text-4xl font-bold text-text mb-4">
              Oops! Something went wrong
            </h1>
            
            <p className="text-lg text-gray-400 mb-8 max-w-lg mx-auto">
              We encountered an unexpected error. Don't worry, our team has been notified and we're working on a fix.
            </p>

            {/* Error Details (Development only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-8 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-left">
                <h3 className="text-red-400 font-semibold mb-2">Error Details:</h3>
                <pre className="text-sm text-red-300 overflow-auto">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="text-red-400 cursor-pointer">Stack Trace</summary>
                    <pre className="text-xs text-red-300 mt-2 overflow-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={() => window.location.reload()}
                className="btn-primary flex items-center justify-center gap-3 px-8 py-4 text-lg font-medium hover:scale-105 transition-all duration-300"
              >
                <FiRefreshCw className="w-5 h-5" />
                Reload Page
              </button>
              
              <Link
                to="/"
                className="btn-secondary flex items-center justify-center gap-3 px-8 py-4 text-lg font-medium hover:scale-105 transition-all duration-300"
              >
                <FiHome className="w-5 h-5" />
                Go Home
              </Link>
            </div>

            {/* Help Text */}
            <div className="text-sm text-gray-500">
              <p>If this problem persists, please contact our support team.</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
