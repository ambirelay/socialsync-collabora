import React, { Component, ReactNode } from 'react'
import { ErrorBoundaryFallback } from './ErrorBoundaryFallback'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: any
  errorId: string
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: React.ComponentType<{ error: Error; retry: () => void; errorId?: string }>
  onError?: (error: Error, errorInfo: any) => void
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: Math.random().toString(36).substring(7) + Date.now().toString(36)
    }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.setState({
      error,
      errorInfo
    })

    // Log error to monitoring service
    this.logError(error, errorInfo)

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  private logError(error: Error, errorInfo: any) {
    // In a real app, send to error monitoring service like Sentry
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Mock error reporting
    try {
      // Send to monitoring service
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: 'current-user-id', // Get from context
        sessionId: 'current-session-id',
        errorId: this.state.errorId
      }
      
      // In production, send to your error tracking service
      console.log('Error report:', errorReport)
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError)
    }
  }

  retry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} retry={this.retry} errorId={this.state.errorId} />
      }

      // Use our improved default error UI
      return <ErrorBoundaryFallback error={this.state.error} retry={this.retry} errorId={this.state.errorId} />
    }

    return this.props.children
  }
}

// HOC for function components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}

// Hook for error handling in function components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const handleError = React.useCallback((error: Error) => {
    setError(error)
  }, [])

  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  // Throw error to be caught by ErrorBoundary
  if (error) {
    throw error
  }

  return { handleError, clearError }
}