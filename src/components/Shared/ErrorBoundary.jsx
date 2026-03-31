import React from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Secure AI Hub caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-red-500/30">
          <div className="max-w-md w-full bg-white p-8 rounded-[2rem] shadow-2xl border-t-8 border-red-500 text-center space-y-6">
            <div className="mx-auto bg-red-50 w-20 h-20 rounded-full flex items-center justify-center text-red-500 shadow-inner">
              <ShieldAlert className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">System Glitch</h1>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                Our resilience framework caught an unexpected error. This is a secure fallback state.
              </p>
            </div>
            {this.state.error && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-left overflow-x-auto text-[10px] font-mono text-gray-400">
                {this.state.error.toString()}
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-gray-900 text-white font-black rounded-xl hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Restart Protocol
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
