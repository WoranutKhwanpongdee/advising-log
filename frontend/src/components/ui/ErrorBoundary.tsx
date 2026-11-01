import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  showDetails: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AdvisingLog Uncaught Error:', error, errorInfo)
    this.setState({ errorInfo })
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false })
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      const errorMessage = this.state.error?.message || 'Unknown error occurred'
      const stack = this.state.error?.stack || this.state.errorInfo?.componentStack || ''

      return (
        <div className="min-h-[380px] p-6 sm:p-8 flex flex-col items-center justify-center text-center bg-white dark:bg-[#0e1424] rounded-2xl border border-red-200/80 dark:border-red-900/40 shadow-premium my-4 max-w-2xl mx-auto">
          <div className="h-14 w-14 rounded-2xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200/70 dark:border-red-800/60 flex items-center justify-center shadow-xs mb-4">
            <AlertTriangle className="h-7 w-7" />
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
            เกิดข้อผิดพลาดในการแสดงผลหน้านี้
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-md">
            Something went wrong while rendering this section. You can try recovering or return to the main dashboard.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6">
            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition-all cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              ลองใหม่อีกครั้ง (Try Again)
            </button>
            <button
              type="button"
              onClick={this.handleGoHome}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <Home className="h-3.5 w-3.5" />
              กลับหน้าหลัก (Dashboard)
            </button>
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
            >
              รีโหลดหน้าเว็บ (Reload)
            </button>
          </div>

          {/* Error detail collapse */}
          <div className="w-full mt-6 text-left">
            <button
              type="button"
              onClick={() => this.setState(prev => ({ showDetails: !prev.showDetails }))}
              className="flex items-center justify-between w-full px-3.5 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              <span className="font-mono truncate mr-2">Error: {errorMessage}</span>
              {this.state.showDetails ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
            </button>

            {this.state.showDetails && (
              <pre className="mt-2 p-3.5 bg-slate-950 text-red-300 rounded-xl text-[11px] font-mono overflow-x-auto max-h-56 leading-relaxed border border-slate-800 shadow-inner">
                {errorMessage}
                {'\n\n'}
                {stack}
              </pre>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

