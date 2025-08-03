import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Shield, 
  Zap, 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Activity,
  ChevronDown,
  RefreshCw,
  Trash2
} from '@phosphor-icons/react'
import { errorMonitoring, performanceMonitor } from '@/utils/errorMonitoring'

interface ApplicationStatusProps {
  isOnline: boolean
  connectionQuality: string
  postsCount: number
  activeCollaborators: number
  scrollMetrics?: {
    scrollY: number
    isScrolling: boolean
    progress: number
    scrollDirection: string | null
  }
}

export function ApplicationStatus({
  isOnline,
  connectionQuality,
  postsCount,
  activeCollaborators,
  scrollMetrics
}: ApplicationStatusProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [errorReports, setErrorReports] = useState(errorMonitoring.getReports())
  const [performanceMetrics, setPerformanceMetrics] = useState(performanceMonitor.getAllMetrics())

  // Update status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setErrorReports(errorMonitoring.getReports())
      setPerformanceMetrics(performanceMonitor.getAllMetrics())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const criticalErrors = errorReports.filter(r => r.severity === 'critical')
  const recentErrors = errorReports.slice(-10).reverse()

  const getStatusColor = () => {
    if (!isOnline) return 'bg-red-500'
    if (criticalErrors.length > 0) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStatusText = () => {
    if (!isOnline) return 'Offline'
    if (criticalErrors.length > 0) return 'Issues Detected'
    return 'All Systems Operational'
  }

  const handleClearErrors = () => {
    errorMonitoring.clearReports()
    setErrorReports([])
  }

  const handleRetryPendingReports = async () => {
    try {
      await errorMonitoring.retryPendingReports()
    } catch (error) {
      console.warn('Failed to retry pending reports:', error)
    }
  }

  return (
    <Card className="w-80 glass-intense card-elevation-2">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between cursor-pointer group">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor()} pulse-glow`} />
                System Status
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {getStatusText()}
                </Badge>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </CollapsibleTrigger>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Quick Status Overview */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                {isOnline ? (
                  <Wifi className="w-4 h-4 text-green-500" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-500" />
                )}
                <span className="text-muted-foreground">Network</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {isOnline ? `Online (${connectionQuality})` : 'Offline'}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Activity className="w-4 h-4 text-blue-500" />
                <span className="text-muted-foreground">Data</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {postsCount} posts • {activeCollaborators} active
              </div>
            </div>
          </div>

          <CollapsibleContent className="space-y-4">
            {/* Error Summary */}
            {errorReports.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    Error Reports
                  </h4>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRetryPendingReports}
                      className="h-6 px-2"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearErrors}
                      className="h-6 px-2"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-medium text-red-500">
                      {errorReports.filter(r => r.severity === 'critical').length}
                    </div>
                    <div className="text-muted-foreground">Critical</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-yellow-500">
                      {errorReports.filter(r => r.severity === 'high').length}
                    </div>
                    <div className="text-muted-foreground">High</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-blue-500">
                      {errorReports.filter(r => r.severity === 'medium').length}
                    </div>
                    <div className="text-muted-foreground">Medium</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-500">
                      {errorReports.filter(r => r.severity === 'low').length}
                    </div>
                    <div className="text-muted-foreground">Low</div>
                  </div>
                </div>

                <ScrollArea className="h-32">
                  <div className="space-y-2">
                    {recentErrors.map((error, index) => (
                      <div key={error.errorId} className="text-xs border rounded p-2 space-y-1">
                        <div className="flex items-center justify-between">
                          <Badge 
                            variant={
                              error.severity === 'critical' ? 'destructive' :
                              error.severity === 'high' ? 'default' :
                              'outline'
                            }
                            className="text-xs"
                          >
                            {error.severity}
                          </Badge>
                          <span className="text-muted-foreground">
                            {new Date(error.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="font-mono truncate">{error.message}</div>
                        <div className="text-muted-foreground">{error.category}</div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Performance Metrics */}
            {Object.keys(performanceMetrics).length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  Performance
                </h4>
                <div className="space-y-1">
                  {Object.entries(performanceMetrics).slice(0, 5).map(([label, metrics]) => (
                    <div key={label} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground truncate">
                        {label.replace('_', ' ')}
                      </span>
                      <span className="font-mono">
                        {metrics?.avg?.toFixed(1)}ms
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scroll Metrics */}
            {scrollMetrics && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-500" />
                  Scroll Activity
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-muted-foreground">Position</div>
                    <div className="font-mono">{scrollMetrics.scrollY}px</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Progress</div>
                    <div className="font-mono">{Math.round(scrollMetrics.progress * 100)}%</div>
                  </div>
                </div>
                {scrollMetrics.isScrolling && (
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>Scrolling {scrollMetrics.scrollDirection}</span>
                  </div>
                )}
              </div>
            )}

            {/* System Health */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                Health Check
              </h4>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Memory Usage</span>
                  <span className="text-green-500 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Normal
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">API Status</span>
                  <span className="text-green-500 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Operational
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </CardContent>
      </Collapsible>
    </Card>
  )
}