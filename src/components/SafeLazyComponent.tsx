import React, { Suspense, lazy, ComponentType } from 'react'
import { LoadingFallback } from './LoadingFallback'
import { ErrorBoundary } from './ErrorBoundary'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, RefreshCw } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

interface SafeLazyComponentProps {
  importFunc: () => Promise<{ default: ComponentType<any> }>
  fallbackComponent?: ComponentType<any>
  loadingMessage?: string
  errorMessage?: string
  name?: string
}

// Create a fallback component for when imports fail
function ComponentFallback({ 
  error, 
  retry, 
  componentName 
}: { 
  error?: Error
  retry?: () => void
  componentName?: string 
}) {
  return (
    <div className="flex items-center justify-center p-8">
      <Alert className="max-w-md">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="space-y-2">
          <p>Failed to load {componentName || 'component'}.</p>
          {error && (
            <p className="text-sm text-muted-foreground">
              {error.message}
            </p>
          )}
          {retry && (
            <Button onClick={retry} size="sm" variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          )}
        </AlertDescription>
      </Alert>
    </div>
  )
}

export function createSafeLazyComponent({
  importFunc,
  fallbackComponent,
  loadingMessage = "Loading component...",
  errorMessage = "Failed to load component",
  name = "Component"
}: SafeLazyComponentProps) {
  const LazyComponent = lazy(async () => {
    try {
      const module = await importFunc()
      return module
    } catch (error) {
      console.error(`Failed to load ${name}:`, error)
      // Return a fallback component instead of failing
      return {
        default: fallbackComponent || (() => (
          <ComponentFallback 
            error={error as Error}
            componentName={name}
          />
        ))
      }
    }
  })

  return function SafeComponent(props: any) {
    return (
      <ErrorBoundary
        fallback={({ error, retry }) => (
          <ComponentFallback 
            error={error}
            retry={retry}
            componentName={name}
          />
        )}
      >
        <Suspense fallback={<LoadingFallback message={loadingMessage} />}>
          <LazyComponent {...props} />
        </Suspense>
      </ErrorBoundary>
    )
  }
}

// Utility to safely import components with automatic fallbacks
export function safeLazyImport(
  importFunc: () => Promise<{ default: ComponentType<any> }>,
  name?: string
) {
  return createSafeLazyComponent({
    importFunc,
    name,
    loadingMessage: `Loading ${name || 'component'}...`
  })
}

// HOC to make any component "safer" by wrapping it with error boundaries
export function withSafeRendering<P extends object>(
  Component: ComponentType<P>,
  componentName?: string
) {
  return function SafeComponent(props: P) {
    return (
      <ErrorBoundary
        fallback={({ error, retry }) => (
          <ComponentFallback 
            error={error}
            retry={retry}
            componentName={componentName || Component.displayName || Component.name}
          />
        )}
      >
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}

// Utility for creating mock/placeholder components during development
export function createPlaceholderComponent(
  name: string,
  description?: string
) {
  return function PlaceholderComponent() {
    return (
      <div className="flex items-center justify-center p-8 border-2 border-dashed border-muted rounded-lg">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-muted-foreground">
            {name}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
          <div className="text-xs text-muted-foreground/70">
            Placeholder Component
          </div>
        </div>
      </div>
    )
  }
}