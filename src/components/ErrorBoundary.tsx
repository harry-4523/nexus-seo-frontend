import { Component, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; message: string; }

// Catches render-time crashes (e.g. a saved scan whose data shape predates a
// schema change) so users see a recoverable message instead of a blank page.
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('NEXUS render error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-void">
          <div className="panel rounded-2xl p-8 max-w-md text-center">
            <AlertTriangle className="mx-auto mb-4 text-solar" size={32} />
            <h2 className="text-lg font-bold text-ink mb-2">This page hit a snag</h2>
            <p className="text-sm text-ink-soft mb-1">
              This is usually caused by opening an old saved scan whose data doesn't match the current app version.
            </p>
            <p className="text-xs text-ink-faint mb-6 font-mono break-words">{this.state.message}</p>
            <div className="flex gap-3 justify-center">
              <a href="/analyze" className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2">
                <RefreshCw size={14} /> Run a new scan
              </a>
              <a href="/" className="btn-ghost text-sm py-2.5 px-5">Go home</a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
