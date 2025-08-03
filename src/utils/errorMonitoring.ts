// Runtime error monitoring and recovery utilities

interface ErrorReport {
  message: string
  stack?: string
  componentStack?: string
  timestamp: string
  userAgent: string
  url: string
  userId?: string
  sessionId?: string
  errorId: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: 'component' | 'network' | 'permission' | 'resource' | 'unknown'
  context?: Record<string, any>
}

class ErrorMonitoring {
  private static instance: ErrorMonitoring
  private reports: ErrorReport[] = []
  private maxReports = 100
  private sessionId: string

  private constructor() {
    this.sessionId = this.generateSessionId()
    this.setupGlobalErrorHandlers()
  }

  static getInstance(): ErrorMonitoring {
    if (!ErrorMonitoring.instance) {
      ErrorMonitoring.instance = new ErrorMonitoring()
    }
    return ErrorMonitoring.instance
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private setupGlobalErrorHandlers(): void {
    // Handle unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.reportError(event.error || new Error(event.message), {
        category: 'unknown',
        severity: 'high',
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      })
    })

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError(
        event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        {
          category: 'unknown',
          severity: 'medium',
          context: {
            type: 'unhandledPromiseRejection'
          }
        }
      )
    })

    // Handle resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.reportError(new Error(`Failed to load resource: ${(event.target as any)?.src || 'unknown'}`), {
          category: 'resource',
          severity: 'low',
          context: {
            resourceType: (event.target as any)?.tagName,
            resourceSrc: (event.target as any)?.src
          }
        })
      }
    }, true)
  }

  reportError(
    error: Error, 
    options: {
      category?: ErrorReport['category']
      severity?: ErrorReport['severity']
      context?: Record<string, any>
      componentStack?: string
    } = {}
  ): string {
    const errorId = this.generateErrorId()
    
    const report: ErrorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: options.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: this.sessionId,
      errorId,
      severity: options.severity || 'medium',
      category: options.category || 'unknown',
      context: options.context
    }

    this.reports.push(report)
    
    // Keep only the most recent reports
    if (this.reports.length > this.maxReports) {
      this.reports = this.reports.slice(-this.maxReports)
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error Report [${report.severity.toUpperCase()}]`)
      console.error('Error:', error)
      console.log('Report:', report)
      console.groupEnd()
    }

    // In production, send to error tracking service
    this.sendToErrorService(report)

    return errorId
  }

  private async sendToErrorService(report: ErrorReport): Promise<void> {
    try {
      // In a real application, send to your error tracking service
      // Example: Sentry, LogRocket, Bugsnag, etc.
      
      if (process.env.NODE_ENV === 'production') {
        // Mock API call - replace with actual service
        await fetch('/api/errors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(report)
        })
      }
    } catch (networkError) {
      console.warn('Failed to send error report:', networkError)
      // Store locally for retry later
      this.storeErrorLocally(report)
    }
  }

  private storeErrorLocally(report: ErrorReport): void {
    try {
      const storedErrors = JSON.parse(localStorage.getItem('pending_error_reports') || '[]')
      storedErrors.push(report)
      
      // Keep only the most recent 50 pending reports
      const recentErrors = storedErrors.slice(-50)
      localStorage.setItem('pending_error_reports', JSON.stringify(recentErrors))
    } catch (storageError) {
      console.warn('Failed to store error locally:', storageError)
    }
  }

  getReports(): ErrorReport[] {
    return [...this.reports]
  }

  getCriticalErrors(): ErrorReport[] {
    return this.reports.filter(report => report.severity === 'critical')
  }

  clearReports(): void {
    this.reports = []
  }

  // Retry sending pending reports
  async retryPendingReports(): Promise<void> {
    try {
      const pendingReports = JSON.parse(localStorage.getItem('pending_error_reports') || '[]')
      
      for (const report of pendingReports) {
        await this.sendToErrorService(report)
      }
      
      // Clear pending reports after successful send
      localStorage.removeItem('pending_error_reports')
    } catch (error) {
      console.warn('Failed to retry pending reports:', error)
    }
  }
}

// Global error monitoring instance
export const errorMonitoring = ErrorMonitoring.getInstance()

// Convenience function for reporting errors
export function reportError(
  error: Error,
  options?: {
    category?: ErrorReport['category']
    severity?: ErrorReport['severity']
    context?: Record<string, any>
    componentStack?: string
  }
): string {
  return errorMonitoring.reportError(error, options)
}

// Hook for React components to report errors
export function useErrorReporting() {
  const reportComponentError = (
    error: Error,
    componentName?: string,
    context?: Record<string, any>
  ) => {
    return reportError(error, {
      category: 'component',
      severity: 'medium',
      context: {
        componentName,
        ...context
      }
    })
  }

  return {
    reportError: reportComponentError,
    reportCriticalError: (error: Error, context?: Record<string, any>) =>
      reportError(error, { severity: 'critical', category: 'component', context }),
    reportNetworkError: (error: Error, context?: Record<string, any>) =>
      reportError(error, { severity: 'medium', category: 'network', context }),
    reportPermissionError: (error: Error, context?: Record<string, any>) =>
      reportError(error, { severity: 'high', category: 'permission', context })
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  startTiming(label: string): () => void {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      if (!this.metrics.has(label)) {
        this.metrics.set(label, [])
      }
      
      const measurements = this.metrics.get(label)!
      measurements.push(duration)
      
      // Keep only the last 100 measurements
      if (measurements.length > 100) {
        measurements.shift()
      }
      
      // Report slow operations
      if (duration > 1000) {
        reportError(new Error(`Slow operation detected: ${label} took ${duration.toFixed(2)}ms`), {
          category: 'unknown',
          severity: 'low',
          context: { operation: label, duration }
        })
      }
    }
  }

  getMetrics(label: string): { avg: number; min: number; max: number; count: number } | null {
    const measurements = this.metrics.get(label)
    if (!measurements || measurements.length === 0) {
      return null
    }
    
    return {
      avg: measurements.reduce((sum, val) => sum + val, 0) / measurements.length,
      min: Math.min(...measurements),
      max: Math.max(...measurements),
      count: measurements.length
    }
  }

  getAllMetrics(): Record<string, ReturnType<PerformanceMonitor['getMetrics']>> {
    const result: Record<string, any> = {}
    
    for (const [label] of this.metrics) {
      result[label] = this.getMetrics(label)
    }
    
    return result
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance()

// HOC for performance monitoring
export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
) {
  return function PerformanceMonitoredComponent(props: P) {
    const endTiming = performanceMonitor.startTiming(
      `render_${componentName || Component.displayName || Component.name}`
    )
    
    React.useEffect(() => {
      endTiming()
    })
    
    return <Component {...props} />
  }
}