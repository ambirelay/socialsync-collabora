// Comprehensive error handling and monitoring utilities
import React from 'react'

export interface ErrorReport {
  id: string
  message: string
  stack?: string
  componentStack?: string
  timestamp: string
  userAgent: string
  url: string
  userId?: string
  sessionId?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: 'ui' | 'network' | 'data' | 'auth' | 'unknown'
  recoverable: boolean
  metadata?: Record<string, any>
}

class ErrorHandler {
  private errors: ErrorReport[] = []
  private maxErrors = 100
  
  constructor() {
    // Listen for unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this))
    
    // Listen for global errors
    window.addEventListener('error', this.handleGlobalError.bind(this))
  }

  private handleUnhandledRejection(event: PromiseRejectionEvent) {
    this.reportError(new Error(event.reason || 'Unhandled Promise Rejection'), {
      category: 'unknown',
      severity: 'high',
      recoverable: false,
      metadata: { 
        type: 'unhandledPromiseRejection',
        reason: event.reason 
      }
    })
  }

  private handleGlobalError(event: ErrorEvent) {
    this.reportError(new Error(event.message), {
      category: 'unknown',
      severity: 'high',
      recoverable: false,
      metadata: {
        type: 'globalError',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    })
  }

  public reportError(
    error: Error, 
    options: Partial<Omit<ErrorReport, 'id' | 'message' | 'stack' | 'timestamp' | 'userAgent' | 'url'>> = {}
  ): string {
    const errorId = this.generateErrorId()
    
    const report: ErrorReport = {
      id: errorId,
      message: error.message || 'Unknown error',
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      severity: 'medium',
      category: 'unknown',
      recoverable: true,
      ...options
    }

    // Add to local storage for persistence
    this.errors.push(report)
    
    // Keep only the most recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors)
    }

    // Store in localStorage for crash recovery
    try {
      localStorage.setItem('app-errors', JSON.stringify(this.errors.slice(-10)))
    } catch {
      // Ignore localStorage errors
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error reported:', report)
    }

    // In production, send to monitoring service
    this.sendToMonitoring(report)

    return errorId
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
  }

  private async sendToMonitoring(report: ErrorReport): Promise<void> {
    // In a real app, send to error monitoring service like Sentry, LogRocket, etc.
    try {
      // Example: await fetch('/api/errors', { method: 'POST', body: JSON.stringify(report) })
      console.log('Would send error report to monitoring service:', report.id)
    } catch {
      // Don't throw errors from error reporting
    }
  }

  public getRecentErrors(limit = 10): ErrorReport[] {
    return this.errors.slice(-limit)
  }

  public clearErrors(): void {
    this.errors = []
    try {
      localStorage.removeItem('app-errors')
    } catch {
      // Ignore localStorage errors
    }
  }

  public getCrashRecoveryData(): ErrorReport[] {
    try {
      const stored = localStorage.getItem('app-errors')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }
}

// Global error handler instance
export const errorHandler = new ErrorHandler()

// Utility functions for common error scenarios
export function withErrorBoundary<T extends (...args: any[]) => any>(
  fn: T,
  fallback?: any,
  options?: Partial<ErrorReport>
): T {
  return ((...args: Parameters<T>) => {
    try {
      const result = fn(...args)
      
      // Handle async functions
      if (result instanceof Promise) {
        return result.catch((error) => {
          errorHandler.reportError(error, {
            category: 'unknown',
            severity: 'medium',
            recoverable: true,
            ...options
          })
          return fallback
        })
      }
      
      return result
    } catch (error) {
      errorHandler.reportError(error as Error, {
        category: 'unknown',
        severity: 'medium',
        recoverable: true,
        ...options
      })
      return fallback
    }
  }) as T
}

export function safeCall<T>(
  fn: () => T,
  fallback: T,
  errorOptions?: Partial<ErrorReport>
): T {
  try {
    return fn()
  } catch (error) {
    errorHandler.reportError(error as Error, {
      category: 'unknown',
      severity: 'low',
      recoverable: true,
      ...errorOptions
    })
    return fallback
  }
}

export async function safeAsyncCall<T>(
  fn: () => Promise<T>,
  fallback: T,
  errorOptions?: Partial<ErrorReport>
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    errorHandler.reportError(error as Error, {
      category: 'network',
      severity: 'medium',
      recoverable: true,
      ...errorOptions
    })
    return fallback
  }
}

// Hook for using error handler in React components
export function useErrorHandler() {
  const reportError = (error: Error, options?: Partial<ErrorReport>) => {
    return errorHandler.reportError(error, options)
  }

  const getRecentErrors = (limit?: number) => {
    return errorHandler.getRecentErrors(limit)
  }

  const clearErrors = () => {
    errorHandler.clearErrors()
  }

  return {
    reportError,
    getRecentErrors,
    clearErrors
  }
}

// Type guard utilities
export function isValidArray<T>(value: unknown): value is T[] {
  return Array.isArray(value)
}

export function isValidObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isValidString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0
}

// Recovery utilities
export function createFallbackComponent(name: string, message?: string) {
  return function FallbackComponent() {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-muted-foreground">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {message || 'This component is temporarily unavailable'}
          </p>
        </div>
      </div>
    )
  }
}

export default errorHandler