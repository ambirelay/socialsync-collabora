import React from 'react'
import { AlertTriangle, RefreshCw, Home, FileText, MessageCircle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

interface ErrorBoundaryFallbackProps {
  error: Error
  retry: () => void
  errorId?: string
}

export function ErrorBoundaryFallback({ error, retry, errorId }: ErrorBoundaryFallbackProps) {
  const handleReportError = () => {
    // In a real app, this would send error details to your error tracking service
    const errorReport = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorId
    }
    
    console.log('Error report:', errorReport)
    // You could also copy to clipboard or show a modal with report details
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 animate-in fade-in duration-500">
      <Card className="w-full max-w-lg glass-intense card-elevation-4">
        <CardHeader className="text-center pb-4">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center animate-in zoom-in duration-300 delay-200">
            <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl gradient-text">
            Oops! Something went wrong
          </CardTitle>
          <CardDescription className="text-base">
            We encountered an unexpected error. Don't worry - our team has been automatically notified and we're working on a fix.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              <div className="flex items-center justify-between">
                <span>Error ID: <code className="text-xs bg-red-100 dark:bg-red-800 px-2 py-1 rounded font-mono">{errorId || 'Unknown'}</code></span>
                <Badge variant="outline" className="text-xs border-red-300 text-red-700">
                  Tracked
                </Badge>
              </div>
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 gap-3">
            <Button 
              onClick={retry} 
              className="w-full button-primary hover-lift transition-all duration-300"
              size="lg"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                className="hover-lift transition-all duration-300"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Page
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleGoHome}
                className="hover-lift transition-all duration-300"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </div>

            <Button 
              variant="ghost" 
              onClick={handleReportError}
              className="w-full text-muted-foreground hover:text-foreground transition-colors duration-300"
              size="sm"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Send Detailed Report
            </Button>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 p-4 bg-muted/50 rounded-lg text-xs border transition-all duration-300 hover:bg-muted/70">
              <summary className="cursor-pointer font-medium mb-3 flex items-center gap-2 hover:text-primary transition-colors">
                <FileText className="w-4 h-4" />
                Technical Details (Development Only)
              </summary>
              <div className="space-y-3 mt-3 border-t pt-3">
                <div>
                  <div className="font-semibold text-foreground mb-1">Error Message:</div>
                  <pre className="text-red-600 dark:text-red-400 whitespace-pre-wrap bg-background p-2 rounded border font-mono text-xs">
                    {error.message}
                  </pre>
                </div>
                {error.stack && (
                  <div>
                    <div className="font-semibold text-foreground mb-1">Stack Trace:</div>
                    <pre className="whitespace-pre-wrap overflow-auto max-h-40 bg-background p-2 rounded border font-mono text-xs leading-relaxed">
                      {error.stack}
                    </pre>
                  </div>
                )}
                <div>
                  <div className="font-semibold text-foreground mb-1">Environment:</div>
                  <div className="bg-background p-2 rounded border text-xs space-y-1">
                    <div><strong>URL:</strong> {window.location.href}</div>
                    <div><strong>User Agent:</strong> {navigator.userAgent}</div>
                    <div><strong>Timestamp:</strong> {new Date().toISOString()}</div>
                  </div>
                </div>
              </div>
            </details>
          )}

          <div className="text-center pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              If this problem persists, please contact our support team with the error ID above.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}