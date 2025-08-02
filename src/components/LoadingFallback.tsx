import { Loader2, Sparkles, Zap } from '@phosphor-icons/react'

interface LoadingFallbackProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  showLogo?: boolean
  animated?: boolean
}

export function LoadingFallback({ 
  message = 'Loading...', 
  size = 'md',
  showLogo = true,
  animated = true 
}: LoadingFallbackProps) {
  const sizeClasses = {
    sm: 'h-32',
    md: 'h-48',
    lg: 'h-96'
  }

  const spinnerSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={`flex items-center justify-center ${sizeClasses[size]}`}>
      <div className="text-center space-y-4">
        {showLogo && (
          <div className="relative">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg">
              <Sparkles size={24} className="text-primary-foreground" />
            </div>
            {animated && (
              <div className="absolute -top-1 -right-1">
                <Zap size={12} className="text-yellow-500 animate-pulse" />
              </div>
            )}
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className={`${spinnerSizes[size]} animate-spin text-primary`} />
          </div>
          <p className="text-sm text-muted-foreground font-medium">{message}</p>
        </div>

        {animated && (
          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-primary rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1.4s'
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Skeleton loading components
export function ContentSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-4 bg-muted rounded w-3/4"></div>
      <div className="h-4 bg-muted rounded w-1/2"></div>
      <div className="h-32 bg-muted rounded"></div>
      <div className="flex space-x-2">
        <div className="h-6 bg-muted rounded w-16"></div>
        <div className="h-6 bg-muted rounded w-20"></div>
        <div className="h-6 bg-muted rounded w-12"></div>
      </div>
    </div>
  )
}

export function PostCardSkeleton() {
  return (
    <div className="border rounded-lg p-4 space-y-3 animate-pulse">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-muted rounded-full"></div>
        <div className="space-y-1 flex-1">
          <div className="h-3 bg-muted rounded w-1/4"></div>
          <div className="h-2 bg-muted rounded w-1/6"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-muted rounded w-full"></div>
        <div className="h-3 bg-muted rounded w-4/5"></div>
        <div className="h-3 bg-muted rounded w-3/5"></div>
      </div>
      <div className="h-32 bg-muted rounded"></div>
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <div className="h-6 w-6 bg-muted rounded"></div>
          <div className="h-6 w-6 bg-muted rounded"></div>
          <div className="h-6 w-6 bg-muted rounded"></div>
        </div>
        <div className="h-4 bg-muted rounded w-20"></div>
      </div>
    </div>
  )
}

export function CalendarSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-8 bg-muted rounded w-32"></div>
        <div className="flex space-x-2">
          <div className="h-8 w-8 bg-muted rounded"></div>
          <div className="h-8 w-8 bg-muted rounded"></div>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded">
            <div className="p-2 space-y-1">
              <div className="h-2 bg-background rounded w-4"></div>
              <div className="h-1 bg-background rounded w-full"></div>
              <div className="h-1 bg-background rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-6 bg-muted rounded-lg">
            <div className="space-y-2">
              <div className="h-8 bg-background rounded w-16"></div>
              <div className="h-3 bg-background rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="h-64 bg-muted rounded-lg"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-48 bg-muted rounded-lg"></div>
        <div className="h-48 bg-muted rounded-lg"></div>
      </div>
    </div>
  )
}