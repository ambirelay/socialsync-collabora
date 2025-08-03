import { useState, useEffect, useCallback, useRef } from 'react'
import { errorHandler } from '@/utils/errorHandling'

interface ResilienceOptions {
  maxRetries?: number
  retryDelay?: number
  fallbackData?: any
  enableRecovery?: boolean
  monitorPerformance?: boolean
}

interface ResilienceState {
  isHealthy: boolean
  errorCount: number
  lastError?: Error
  performanceScore: number
  recoveryAttempts: number
}

export function useAppResilience(options: ResilienceOptions = {}) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    fallbackData = null,
    enableRecovery = true,
    monitorPerformance = true
  } = options

  const [state, setState] = useState<ResilienceState>({
    isHealthy: true,
    errorCount: 0,
    performanceScore: 100,
    recoveryAttempts: 0
  })

  const performanceStart = useRef<number>(0)
  const retryTimeouts = useRef<NodeJS.Timeout[]>([])

  // Monitor app performance
  useEffect(() => {
    if (!monitorPerformance) return

    const measurePerformance = () => {
      performanceStart.current = performance.now()
    }

    const updatePerformanceScore = () => {
      const duration = performance.now() - performanceStart.current
      const score = Math.max(0, 100 - (duration / 100)) // Simple scoring
      
      setState(prev => ({
        ...prev,
        performanceScore: Math.round((prev.performanceScore + score) / 2)
      }))
    }

    measurePerformance()
    
    const observer = new PerformanceObserver(() => {
      updatePerformanceScore()
    })
    
    try {
      observer.observe({ entryTypes: ['measure', 'navigation'] })
    } catch {
      // Fallback for unsupported browsers
    }

    return () => {
      try {
        observer.disconnect()
      } catch {}
    }
  }, [monitorPerformance])

  // Auto-recovery mechanism
  const attemptRecovery = useCallback(async () => {
    if (!enableRecovery || state.recoveryAttempts >= maxRetries) {
      return false
    }

    setState(prev => ({
      ...prev,
      recoveryAttempts: prev.recoveryAttempts + 1
    }))

    try {
      // Clear any pending retry timeouts
      retryTimeouts.current.forEach(clearTimeout)
      retryTimeouts.current = []

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, retryDelay * state.recoveryAttempts))

      // Attempt to restore healthy state
      setState(prev => ({
        ...prev,
        isHealthy: true,
        errorCount: Math.max(0, prev.errorCount - 1)
      }))

      return true
    } catch (error) {
      errorHandler.reportError(error as Error, {
        category: 'unknown',
        severity: 'high',
        recoverable: false,
        metadata: { source: 'recovery-attempt' }
      })
      return false
    }
  }, [enableRecovery, maxRetries, retryDelay, state.recoveryAttempts])

  // Handle errors with automatic recovery
  const handleError = useCallback((error: Error, context?: string) => {
    setState(prev => ({
      ...prev,
      isHealthy: false,
      errorCount: prev.errorCount + 1,
      lastError: error
    }))

    errorHandler.reportError(error, {
      category: 'unknown',
      severity: state.errorCount > 5 ? 'critical' : 'medium',
      recoverable: enableRecovery,
      metadata: { 
        context,
        errorCount: state.errorCount + 1,
        performanceScore: state.performanceScore
      }
    })

    // Attempt automatic recovery
    if (enableRecovery && state.errorCount < maxRetries) {
      const timeout = setTimeout(() => {
        attemptRecovery()
      }, retryDelay)
      
      retryTimeouts.current.push(timeout)
    }
  }, [state.errorCount, state.performanceScore, enableRecovery, maxRetries, retryDelay, attemptRecovery])

  // Reset resilience state
  const reset = useCallback(() => {
    retryTimeouts.current.forEach(clearTimeout)
    retryTimeouts.current = []
    
    setState({
      isHealthy: true,
      errorCount: 0,
      performanceScore: 100,
      recoveryAttempts: 0
    })
  }, [])

  // Get app health status
  const getHealthStatus = useCallback(() => {
    const { isHealthy, errorCount, performanceScore } = state
    
    if (!isHealthy && errorCount > 10) return 'critical'
    if (!isHealthy && errorCount > 5) return 'degraded'
    if (performanceScore < 50) return 'slow'
    if (isHealthy && performanceScore > 80) return 'healthy'
    return 'fair'
  }, [state])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      retryTimeouts.current.forEach(clearTimeout)
    }
  }, [])

  return {
    state,
    handleError,
    attemptRecovery,
    reset,
    getHealthStatus,
    isHealthy: state.isHealthy,
    errorCount: state.errorCount,
    performanceScore: state.performanceScore
  }
}

// Hook for safe component rendering with error boundaries
export function useSafeRender<T>(
  renderFn: () => T,
  fallback: T,
  componentName?: string
): T {
  const { handleError } = useAppResilience()

  try {
    return renderFn()
  } catch (error) {
    handleError(error as Error, `safe-render-${componentName}`)
    return fallback
  }
}

// Hook for safe async operations
export function useSafeAsync() {
  const { handleError } = useAppResilience()

  const safeExecute = useCallback(async <T>(
    operation: () => Promise<T>,
    fallback: T,
    operationName?: string
  ): Promise<T> => {
    try {
      return await operation()
    } catch (error) {
      handleError(error as Error, `async-operation-${operationName}`)
      return fallback
    }
  }, [handleError])

  return { safeExecute }
}

// Hook for monitoring component lifecycle and errors
export function useComponentHealth(componentName: string) {
  const { handleError, state } = useAppResilience()
  const mountTime = useRef(Date.now())
  const renderCount = useRef(0)

  useEffect(() => {
    renderCount.current += 1
    
    // Log excessive re-renders
    if (renderCount.current > 100) {
      handleError(
        new Error(`Excessive re-renders detected in ${componentName}`),
        'performance-issue'
      )
    }
  })

  const reportError = useCallback((error: Error, context?: string) => {
    handleError(error, `${componentName}-${context}`)
  }, [handleError, componentName])

  const getComponentMetrics = useCallback(() => {
    return {
      uptime: Date.now() - mountTime.current,
      renderCount: renderCount.current,
      isHealthy: state.isHealthy,
      errorCount: state.errorCount
    }
  }, [state])

  return {
    reportError,
    getComponentMetrics,
    isHealthy: state.isHealthy
  }
}

export default useAppResilience