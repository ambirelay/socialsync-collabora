import { useState, useMemo } from 'react'
import { Platform } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { 
  Plug,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Key,
  Globe,
  Zap,
  Shield,
  Bell,
  Activity,
  BarChart3,
  Users,
  Calendar,
  Download,
  Upload,
  Link,
  Unlink,
  Lock,
  Unlock,
  Code,
  Database,
  Server,
  Cloud
} from '@phosphor-icons/react'
import { format } from 'date-fns'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface APIConnection {
  id: string
  platform: Platform | 'analytics' | 'crm' | 'email' | 'storage'
  name: string
  status: 'connected' | 'disconnected' | 'error' | 'pending'
  type: 'oauth' | 'api_key' | 'webhook'
  lastSync: string
  permissions: string[]
  rateLimits: {
    requests: number
    remaining: number
    resetTime: string
  }
  credentials: {
    clientId?: string
    apiKey?: string
    webhookUrl?: string
    isValid: boolean
  }
  endpoints: {
    auth: string
    api: string
    webhook?: string
  }
  features: string[]
  metrics: {
    totalRequests: number
    successRate: number
    avgResponseTime: number
    lastError?: string
  }
}

interface WebhookEvent {
  id: string
  platform: string
  type: 'post_published' | 'comment_received' | 'engagement_update' | 'follower_change'
  payload: any
  timestamp: string
  processed: boolean
  status: 'success' | 'failed' | 'pending'
}

interface APILog {
  id: string
  connection: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  endpoint: string
  status: number
  responseTime: number
  timestamp: string
  error?: string
}

const platformConfigs = {
  instagram: {
    name: 'Instagram',
    icon: '📷',
    color: 'from-purple-500 to-pink-500',
    endpoints: {
      auth: 'https://api.instagram.com/oauth/authorize',
      api: 'https://graph.instagram.com/v18.0',
    },
    permissions: ['instagram_basic', 'pages_show_list', 'pages_read_engagement', 'instagram_content_publish'],
    features: ['Post Publishing', 'Stories', 'Analytics', 'Comments Management']
  },
  twitter: {
    name: 'Twitter/X',
    icon: '🐦',
    color: 'from-blue-400 to-blue-600',
    endpoints: {
      auth: 'https://api.twitter.com/oauth/authorize',
      api: 'https://api.twitter.com/2',
    },
    permissions: ['tweet.read', 'tweet.write', 'users.read', 'follows.read'],
    features: ['Tweet Publishing', 'Thread Creation', 'Analytics', 'Direct Messages']
  },
  linkedin: {
    name: 'LinkedIn',
    icon: '💼',
    color: 'from-blue-600 to-blue-800',
    endpoints: {
      auth: 'https://www.linkedin.com/oauth/v2/authorization',
      api: 'https://api.linkedin.com/v2',
    },
    permissions: ['r_liteprofile', 'w_member_social', 'rw_organization_admin'],
    features: ['Post Publishing', 'Company Pages', 'Analytics', 'Lead Generation']
  },
  facebook: {
    name: 'Facebook',
    icon: '📘',
    color: 'from-blue-600 to-blue-700',
    endpoints: {
      auth: 'https://www.facebook.com/v18.0/dialog/oauth',
      api: 'https://graph.facebook.com/v18.0',
    },
    permissions: ['pages_manage_posts', 'pages_read_engagement', 'pages_show_list'],
    features: ['Post Publishing', 'Page Management', 'Analytics', 'Ads Manager']
  },
  analytics: {
    name: 'Google Analytics',
    icon: '📊',
    color: 'from-orange-500 to-red-500',
    endpoints: {
      auth: 'https://accounts.google.com/o/oauth2/auth',
      api: 'https://analyticsreporting.googleapis.com/v4',
    },
    permissions: ['https://www.googleapis.com/auth/analytics.readonly'],
    features: ['Website Analytics', 'Traffic Reports', 'Conversion Tracking']
  },
  crm: {
    name: 'HubSpot CRM',
    icon: '🎯',
    color: 'from-orange-400 to-red-500',
    endpoints: {
      auth: 'https://app.hubspot.com/oauth/authorize',
      api: 'https://api.hubapi.com',
    },
    permissions: ['contacts', 'content', 'social'],
    features: ['Contact Management', 'Lead Tracking', 'Email Marketing']
  }
}

export function APIIntegrationManager() {
  const [connections, setConnections] = useKV<APIConnection[]>('api-connections', [])
  const [webhookEvents, setWebhookEvents] = useKV<WebhookEvent[]>('webhook-events', [])
  const [apiLogs, setApiLogs] = useKV<APILog[]>('api-logs', [])
  
  const [activeTab, setActiveTab] = useState('connections')
  const [showConnectionDialog, setShowConnectionDialog] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<string>('')
  const [connectionType, setConnectionType] = useState<'oauth' | 'api_key' | 'webhook'>('oauth')
  
  const [newConnection, setNewConnection] = useState({
    platform: '' as Platform | 'analytics' | 'crm' | 'email' | 'storage',
    name: '',
    clientId: '',
    clientSecret: '',
    apiKey: '',
    webhookUrl: ''
  })

  // Initialize sample data
  useMemo(() => {
    if (connections.length === 0) {
      const sampleConnections: APIConnection[] = [
        {
          id: '1',
          platform: 'instagram',
          name: 'Instagram Business',
          status: 'connected',
          type: 'oauth',
          lastSync: new Date(Date.now() - 3600000).toISOString(),
          permissions: ['instagram_basic', 'pages_show_list', 'instagram_content_publish'],
          rateLimits: {
            requests: 200,
            remaining: 145,
            resetTime: new Date(Date.now() + 3600000).toISOString()
          },
          credentials: {
            clientId: 'your_instagram_client_id',
            isValid: true
          },
          endpoints: platformConfigs.instagram.endpoints,
          features: platformConfigs.instagram.features,
          metrics: {
            totalRequests: 1247,
            successRate: 98.5,
            avgResponseTime: 234,
            lastError: undefined
          }
        },
        {
          id: '2',
          platform: 'twitter',
          name: 'Twitter API v2',
          status: 'connected',
          type: 'oauth',
          lastSync: new Date(Date.now() - 1800000).toISOString(),
          permissions: ['tweet.read', 'tweet.write', 'users.read'],
          rateLimits: {
            requests: 300,
            remaining: 287,
            resetTime: new Date(Date.now() + 900000).toISOString()
          },
          credentials: {
            clientId: 'your_twitter_client_id',
            isValid: true
          },
          endpoints: platformConfigs.twitter.endpoints,
          features: platformConfigs.twitter.features,
          metrics: {
            totalRequests: 856,
            successRate: 97.2,
            avgResponseTime: 412
          }
        },
        {
          id: '3',
          platform: 'linkedin',
          name: 'LinkedIn Company Pages',
          status: 'error',
          type: 'oauth',
          lastSync: new Date(Date.now() - 7200000).toISOString(),
          permissions: ['r_liteprofile', 'w_member_social'],
          rateLimits: {
            requests: 100,
            remaining: 0,
            resetTime: new Date(Date.now() + 1800000).toISOString()
          },
          credentials: {
            clientId: 'your_linkedin_client_id',
            isValid: false
          },
          endpoints: platformConfigs.linkedin.endpoints,
          features: platformConfigs.linkedin.features,
          metrics: {
            totalRequests: 234,
            successRate: 85.3,
            avgResponseTime: 678,
            lastError: 'Token expired - requires re-authentication'
          }
        }
      ]
      setConnections(sampleConnections)
    }
  }, [connections.length, setConnections])

  const createConnection = () => {
    if (!newConnection.platform || !newConnection.name) return

    const connection: APIConnection = {
      id: Date.now().toString(),
      platform: newConnection.platform,
      name: newConnection.name,
      status: 'pending',
      type: connectionType,
      lastSync: new Date().toISOString(),
      permissions: [],
      rateLimits: {
        requests: 100,
        remaining: 100,
        resetTime: new Date(Date.now() + 3600000).toISOString()
      },
      credentials: {
        clientId: newConnection.clientId,
        apiKey: newConnection.apiKey,
        webhookUrl: newConnection.webhookUrl,
        isValid: true
      },
      endpoints: platformConfigs[newConnection.platform as keyof typeof platformConfigs]?.endpoints || { auth: '', api: '' },
      features: platformConfigs[newConnection.platform as keyof typeof platformConfigs]?.features || [],
      metrics: {
        totalRequests: 0,
        successRate: 0,
        avgResponseTime: 0
      }
    }

    setConnections(current => [...current, connection])
    setNewConnection({
      platform: '' as any,
      name: '',
      clientId: '',
      clientSecret: '',
      apiKey: '',
      webhookUrl: ''
    })
    setShowConnectionDialog(false)
    toast.success(`${connection.name} connection created successfully`)
  }

  const toggleConnection = (id: string) => {
    setConnections(current =>
      current.map(conn =>
        conn.id === id
          ? { ...conn, status: conn.status === 'connected' ? 'disconnected' : 'connected' }
          : conn
      )
    )
  }

  const testConnection = (id: string) => {
    // Simulate API test
    setConnections(current =>
      current.map(conn =>
        conn.id === id
          ? { 
              ...conn, 
              status: Math.random() > 0.8 ? 'error' : 'connected',
              lastSync: new Date().toISOString() 
            }
          : conn
      )
    )
    toast.success('Connection test completed')
  }

  const removeConnection = (id: string) => {
    setConnections(current => current.filter(conn => conn.id !== id))
    toast.success('Connection removed successfully')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'disconnected': return <XCircle className="w-5 h-5 text-gray-500" />
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-500" />
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />
      default: return <XCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-50 border-green-200'
      case 'disconnected': return 'text-gray-600 bg-gray-50 border-gray-200'
      case 'error': return 'text-red-600 bg-red-50 border-red-200'
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const connectedCount = connections.filter(conn => conn.status === 'connected').length
  const errorCount = connections.filter(conn => conn.status === 'error').length
  const totalRequests = connections.reduce((sum, conn) => sum + conn.metrics.totalRequests, 0)
  const avgSuccessRate = connections.length > 0 
    ? connections.reduce((sum, conn) => sum + conn.metrics.successRate, 0) / connections.length 
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Integration Manager</h1>
          <p className="text-muted-foreground">Manage your social media platform connections and integrations</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <RefreshCw size={16} className="mr-2" />
            Sync All
          </Button>
          <Dialog open={showConnectionDialog} onOpenChange={setShowConnectionDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={16} className="mr-2" />
                Add Connection
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New API Connection</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Select value={newConnection.platform} onValueChange={(value: any) => setNewConnection(prev => ({ ...prev, platform: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(platformConfigs).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.icon} {config.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="connection-name">Connection Name</Label>
                  <Input
                    id="connection-name"
                    value={newConnection.name}
                    onChange={(e) => setNewConnection(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="My Instagram Business Account"
                  />
                </div>

                <div>
                  <Label>Authentication Type</Label>
                  <Select value={connectionType} onValueChange={(value: typeof connectionType) => setConnectionType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="oauth">OAuth 2.0</SelectItem>
                      <SelectItem value="api_key">API Key</SelectItem>
                      <SelectItem value="webhook">Webhook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {connectionType === 'oauth' && (
                  <>
                    <div>
                      <Label htmlFor="client-id">Client ID</Label>
                      <Input
                        id="client-id"
                        value={newConnection.clientId}
                        onChange={(e) => setNewConnection(prev => ({ ...prev, clientId: e.target.value }))}
                        placeholder="your_client_id"
                      />
                    </div>
                    <div>
                      <Label htmlFor="client-secret">Client Secret</Label>
                      <Input
                        id="client-secret"
                        type="password"
                        value={newConnection.clientSecret}
                        onChange={(e) => setNewConnection(prev => ({ ...prev, clientSecret: e.target.value }))}
                        placeholder="your_client_secret"
                      />
                    </div>
                  </>
                )}

                {connectionType === 'api_key' && (
                  <div>
                    <Label htmlFor="api-key">API Key</Label>
                    <Input
                      id="api-key"
                      type="password"
                      value={newConnection.apiKey}
                      onChange={(e) => setNewConnection(prev => ({ ...prev, apiKey: e.target.value }))}
                      placeholder="your_api_key"
                    />
                  </div>
                )}

                {connectionType === 'webhook' && (
                  <div>
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <Input
                      id="webhook-url"
                      value={newConnection.webhookUrl}
                      onChange={(e) => setNewConnection(prev => ({ ...prev, webhookUrl: e.target.value }))}
                      placeholder="https://your-app.com/webhooks"
                    />
                  </div>
                )}

                <Button onClick={createConnection} className="w-full">
                  Create Connection
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Connected APIs</p>
                <p className="text-2xl font-bold text-green-600">{connectedCount}</p>
              </div>
              <Plug className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">of {connections.length} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">API Errors</p>
                <p className="text-2xl font-bold text-red-600">{errorCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">requiring attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-bold text-blue-600">{totalRequests.toLocaleString()}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold text-purple-600">{avgSuccessRate.toFixed(1)}%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">average across all APIs</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="connections" className="flex items-center gap-2">
            <Plug size={16} />
            Connections
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Activity size={16} />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center gap-2">
            <Zap size={16} />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Database size={16} />
            Logs
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings size={16} />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Connections Tab */}
        <TabsContent value="connections" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connections.map((connection) => {
              const config = platformConfigs[connection.platform as keyof typeof platformConfigs]
              
              return (
                <Card key={connection.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${config?.color} flex items-center justify-center text-white text-lg`}>
                          {config?.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold">{connection.name}</h3>
                          <p className="text-sm text-muted-foreground capitalize">{connection.platform}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(connection.status)}
                        <Badge variant="outline" className={getStatusColor(connection.status)}>
                          {connection.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Last Sync:</span>
                        <span className="text-muted-foreground">
                          {format(new Date(connection.lastSync), 'MMM dd, h:mm a')}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span>Rate Limit:</span>
                        <span className="text-muted-foreground">
                          {connection.rateLimits.remaining}/{connection.rateLimits.requests}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Success Rate:</span>
                          <span className="font-medium">{connection.metrics.successRate}%</span>
                        </div>
                        <Progress value={connection.metrics.successRate} className="h-2" />
                      </div>

                      {connection.status === 'error' && connection.metrics.lastError && (
                        <Alert className="border-red-200 bg-red-50">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-red-800 text-xs">
                            {connection.metrics.lastError}
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground mb-2">Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {connection.features.slice(0, 3).map((feature) => (
                            <Badge key={feature} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {connection.features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{connection.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => testConnection(connection.id)}
                        >
                          <Zap size={14} className="mr-1" />
                          Test
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => toggleConnection(connection.id)}
                        >
                          {connection.status === 'connected' ? (
                            <>
                              <Unlink size={14} className="mr-1" />
                              Disconnect
                            </>
                          ) : (
                            <>
                              <Link size={14} className="mr-1" />
                              Connect
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeConnection(connection.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {connections.filter(conn => conn.status === 'connected').map((connection) => (
              <Card key={connection.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity size={20} />
                    {connection.name} Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{connection.metrics.totalRequests}</div>
                      <p className="text-sm text-muted-foreground">Total Requests</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{connection.metrics.avgResponseTime}ms</div>
                      <p className="text-sm text-muted-foreground">Avg Response</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Rate Limit Usage</span>
                      <span className="text-sm font-medium">
                        {connection.rateLimits.requests - connection.rateLimits.remaining}/{connection.rateLimits.requests}
                      </span>
                    </div>
                    <Progress 
                      value={((connection.rateLimits.requests - connection.rateLimits.remaining) / connection.rateLimits.requests) * 100} 
                      className="h-2" 
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Resets {format(new Date(connection.rateLimits.resetTime), 'h:mm a')}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Success Rate</span>
                      <span className="text-sm font-medium">{connection.metrics.successRate}%</span>
                    </div>
                    <Progress value={connection.metrics.successRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Webhooks Tab */}
        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap size={20} />
                Webhook Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="webhook-url">Webhook Endpoint URL</Label>
                  <Input 
                    id="webhook-url"
                    value="https://your-app.com/api/webhooks"
                    readOnly
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This is your webhook endpoint for receiving real-time updates
                  </p>
                </div>
                <div>
                  <Label htmlFor="webhook-secret">Webhook Secret</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="webhook-secret"
                      type="password"
                      value="your_webhook_secret_key"
                      readOnly
                    />
                    <Button variant="outline" size="sm">
                      <Eye size={14} />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Webhook Events</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { event: 'post_published', label: 'Post Published', enabled: true },
                    { event: 'comment_received', label: 'New Comment', enabled: true },
                    { event: 'engagement_update', label: 'Engagement Update', enabled: false },
                    { event: 'follower_change', label: 'Follower Change', enabled: true }
                  ].map((webhook) => (
                    <div key={webhook.event} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{webhook.label}</p>
                        <p className="text-xs text-muted-foreground">{webhook.event}</p>
                      </div>
                      <Switch checked={webhook.enabled} />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Webhook Events</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Post Published</p>
                        <p className="text-xs text-muted-foreground">Instagram • {Math.floor(Math.random() * 60)} minutes ago</p>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Success
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Database size={20} />
                  API Request Logs
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="200">Success (200)</SelectItem>
                      <SelectItem value="400">Client Error</SelectItem>
                      <SelectItem value="500">Server Error</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Download size={14} className="mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {Array.from({ length: 20 }, (_, i) => {
                    const methods = ['GET', 'POST', 'PUT', 'DELETE']
                    const statuses = [200, 201, 400, 401, 404, 500]
                    const connections = ['Instagram', 'Twitter', 'LinkedIn']
                    
                    const method = methods[Math.floor(Math.random() * methods.length)]
                    const status = statuses[Math.floor(Math.random() * statuses.length)]
                    const connection = connections[Math.floor(Math.random() * connections.length)]
                    const responseTime = Math.floor(Math.random() * 1000) + 100
                    
                    return (
                      <div key={i} className="flex items-center justify-between p-3 text-sm border rounded">
                        <div className="flex items-center gap-4">
                          <Badge variant={status < 300 ? 'default' : status < 500 ? 'secondary' : 'destructive'}>
                            {method}
                          </Badge>
                          <span className="font-mono text-xs">{connection}/api/posts</span>
                          <Badge variant="outline" className={
                            status < 300 ? 'text-green-600' : 
                            status < 500 ? 'text-yellow-600' : 'text-red-600'
                          }>
                            {status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <span>{responseTime}ms</span>
                          <span>{Math.floor(Math.random() * 60)} min ago</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings size={20} />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-retry failed requests</p>
                    <p className="text-sm text-muted-foreground">Automatically retry failed API requests</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Rate limit warnings</p>
                    <p className="text-sm text-muted-foreground">Get notified when approaching rate limits</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Detailed logging</p>
                    <p className="text-sm text-muted-foreground">Log detailed request/response information</p>
                  </div>
                  <Switch />
                </div>

                <div>
                  <Label htmlFor="retry-attempts">Max Retry Attempts</Label>
                  <Select defaultValue="3">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 attempt</SelectItem>
                      <SelectItem value="3">3 attempts</SelectItem>
                      <SelectItem value="5">5 attempts</SelectItem>
                      <SelectItem value="10">10 attempts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield size={20} />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Encrypt stored credentials</p>
                    <p className="text-sm text-muted-foreground">Encrypt API keys and tokens at rest</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Token rotation</p>
                    <p className="text-sm text-muted-foreground">Automatically rotate access tokens</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div>
                  <Label htmlFor="token-expiry">Token Expiry Warning</Label>
                  <Select defaultValue="7">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day before</SelectItem>
                      <SelectItem value="7">7 days before</SelectItem>
                      <SelectItem value="30">30 days before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="webhook-signature">Webhook Signature Verification</Label>
                  <div className="flex gap-2 mt-1">
                    <Input 
                      id="webhook-signature"
                      placeholder="Signature verification key"
                      type="password"
                    />
                    <Button variant="outline" size="sm">
                      Generate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}