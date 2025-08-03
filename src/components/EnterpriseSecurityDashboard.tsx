import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Lock,
  Key,
  Eye,
  EyeSlash,
  UserCheck,
  Clock,
  Activity,
  Globe,
  Server,
  Database,
  Zap,
  Download,
  RefreshCw,
  Settings,
  Bell,
  TrendingUp,
  Users,
  MapPin,
  Smartphone,
  Monitor,
  Wifi,
  WifiSlash
} from '@phosphor-icons/react'

interface EnterpriseSecurityDashboardProps {
  onSecurityAlert?: (alert: SecurityAlert) => void
  onUpdateSecurityPolicy?: (policy: SecurityPolicy) => void
}

interface SecurityAlert {
  id: string
  type: 'critical' | 'high' | 'medium' | 'low' | 'info'
  title: string
  description: string
  timestamp: string
  source: string
  status: 'active' | 'investigating' | 'resolved'
  affectedUsers?: number
  location?: string
}

interface SecurityPolicy {
  id: string
  name: string
  description: string
  enabled: boolean
  category: string
  lastModified: string
  compliance: string[]
}

interface SecurityMetrics {
  overallScore: number
  threatsBlocked: number
  vulnerabilities: number
  compliance: number
  uptime: number
}

export default function EnterpriseSecurityDashboard({ 
  onSecurityAlert,
  onUpdateSecurityPolicy 
}: EnterpriseSecurityDashboardProps) {
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h')

  // Mock security data
  const securityMetrics: SecurityMetrics = {
    overallScore: 94,
    threatsBlocked: 1247,
    vulnerabilities: 3,
    compliance: 98.5,
    uptime: 99.97
  }

  const securityAlerts: SecurityAlert[] = [
    {
      id: 'alert-1',
      type: 'critical',
      title: 'Suspicious Login Attempt',
      description: 'Multiple failed login attempts detected from IP 192.168.1.100',
      timestamp: '2024-03-15T14:30:00Z',
      source: 'Authentication System',
      status: 'active',
      affectedUsers: 1,
      location: 'New York, US'
    },
    {
      id: 'alert-2',
      type: 'high',
      title: 'Unusual API Activity',
      description: 'API rate limit exceeded by 300% from authenticated user',
      timestamp: '2024-03-15T13:45:00Z',
      source: 'API Gateway',
      status: 'investigating',
      affectedUsers: 1,
      location: 'London, UK'
    },
    {
      id: 'alert-3',
      type: 'medium',
      title: 'Password Policy Violation',
      description: 'User attempted to set weak password multiple times',
      timestamp: '2024-03-15T12:20:00Z',
      source: 'User Management',
      status: 'resolved',
      affectedUsers: 1,
      location: 'Toronto, CA'
    },
    {
      id: 'alert-4',
      type: 'low',
      title: 'Session Timeout',
      description: 'Multiple sessions expired due to inactivity',
      timestamp: '2024-03-15T11:15:00Z',
      source: 'Session Manager',
      status: 'resolved',
      affectedUsers: 12,
      location: 'Various'
    }
  ]

  const securityPolicies: SecurityPolicy[] = [
    {
      id: 'policy-1',
      name: 'Multi-Factor Authentication',
      description: 'Require MFA for all user accounts',
      enabled: true,
      category: 'Authentication',
      lastModified: '2024-03-10T10:00:00Z',
      compliance: ['SOC 2', 'GDPR', 'CCPA']
    },
    {
      id: 'policy-2',
      name: 'Password Complexity',
      description: 'Enforce strong password requirements',
      enabled: true,
      category: 'Authentication',
      lastModified: '2024-03-08T15:30:00Z',
      compliance: ['SOC 2', 'ISO 27001']
    },
    {
      id: 'policy-3',
      name: 'Session Management',
      description: 'Automatic session timeout after 30 minutes of inactivity',
      enabled: true,
      category: 'Access Control',
      lastModified: '2024-03-05T09:20:00Z',
      compliance: ['SOC 2', 'GDPR']
    },
    {
      id: 'policy-4',
      name: 'IP Allowlisting',
      description: 'Restrict access to approved IP addresses',
      enabled: false,
      category: 'Network Security',
      lastModified: '2024-02-28T14:45:00Z',
      compliance: ['SOC 2']
    },
    {
      id: 'policy-5',
      name: 'Data Encryption',
      description: 'Encrypt all data in transit and at rest',
      enabled: true,
      category: 'Data Protection',
      lastModified: '2024-03-12T11:10:00Z',
      compliance: ['SOC 2', 'GDPR', 'CCPA', 'HIPAA']
    }
  ]

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <XCircle className="text-red-500" size={16} />
      case 'high': return <AlertTriangle className="text-orange-500" size={16} />
      case 'medium': return <AlertTriangle className="text-yellow-500" size={16} />
      case 'low': return <CheckCircle className="text-blue-500" size={16} />
      default: return <CheckCircle className="text-gray-500" size={16} />
    }
  }

  const getAlertBadgeVariant = (type: string) => {
    switch (type) {
      case 'critical': return 'destructive'
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="text-red-500" size={14} />
      case 'investigating': return <Eye className="text-yellow-500" size={14} />
      case 'resolved': return <CheckCircle className="text-green-500" size={14} />
      default: return <Clock className="text-gray-500" size={14} />
    }
  }

  const refreshSecurityData = async () => {
    setRefreshing(true)
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="text-primary" size={24} />
            Enterprise Security Dashboard
          </h2>
          <p className="text-muted-foreground mt-1">
            Monitor security threats, manage policies, and ensure compliance
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={refreshSecurityData} 
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </Button>
          
          <Button variant="outline" size="sm">
            <Download size={16} />
            Export Report
          </Button>
          
          <Button variant="outline" size="sm">
            <Settings size={16} />
            Configure
          </Button>
        </div>
      </div>

      {/* Security Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Security Score</p>
                <p className="text-2xl font-bold text-green-600">
                  {securityMetrics.overallScore}/100
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Shield size={20} className="text-green-600" />
              </div>
            </div>
            <Progress value={securityMetrics.overallScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Threats Blocked</p>
                <p className="text-2xl font-bold">
                  {securityMetrics.threatsBlocked.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">+12% vs last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Vulnerabilities</p>
                <p className="text-2xl font-bold text-orange-600">
                  {securityMetrics.vulnerabilities}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <XCircle size={20} className="text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-orange-600 mt-2">2 critical, 1 medium</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Compliance</p>
                <p className="text-2xl font-bold text-blue-600">
                  {securityMetrics.compliance}%
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <CheckCircle size={20} className="text-blue-600" />
              </div>
            </div>
            <Progress value={securityMetrics.compliance} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Uptime</p>
                <p className="text-2xl font-bold text-green-600">
                  {securityMetrics.uptime}%
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Activity size={20} className="text-green-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="alerts">Security Alerts</TabsTrigger>
          <TabsTrigger value="policies">Security Policies</TabsTrigger>
          <TabsTrigger value="monitoring">Real-time Monitoring</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        {/* Security Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          {/* Active Alerts Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { type: 'Critical', count: 1, color: 'text-red-600 bg-red-100' },
              { type: 'High', count: 1, color: 'text-orange-600 bg-orange-100' },
              { type: 'Medium', count: 1, color: 'text-yellow-600 bg-yellow-100' },
              { type: 'Low', count: 1, color: 'text-blue-600 bg-blue-100' }
            ].map((item, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{item.type} Alerts</p>
                      <p className="text-xl font-bold">{item.count}</p>
                    </div>
                    <div className={`p-2 rounded-full ${item.color}`}>
                      <AlertTriangle size={16} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Alerts List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Alerts</CardTitle>
              <CardDescription>
                Latest security events and threat notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityAlerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className="border rounded-lg p-4 hover:bg-muted/20 transition-colors cursor-pointer"
                    onClick={() => setSelectedAlert(alert.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {getAlertIcon(alert.type)}
                        <div>
                          <h4 className="font-medium">{alert.title}</h4>
                          <p className="text-sm text-muted-foreground">{alert.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getAlertBadgeVariant(alert.type)}>
                          {alert.type}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(alert.status)}
                          <span className="text-xs capitalize">{alert.status}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Server size={12} />
                        {alert.source}
                      </div>
                      {alert.location && (
                        <div className="flex items-center gap-1">
                          <MapPin size={12} />
                          {alert.location}
                        </div>
                      )}
                      {alert.affectedUsers && (
                        <div className="flex items-center gap-1">
                          <Users size={12} />
                          {alert.affectedUsers} user{alert.affectedUsers > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Policies Tab */}
        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Policies</CardTitle>
              <CardDescription>
                Manage and configure security policies for your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Compliance</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {securityPolicies.map((policy) => (
                    <TableRow key={policy.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{policy.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {policy.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{policy.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={policy.enabled}
                            onCheckedChange={(checked) => {
                              onUpdateSecurityPolicy?.({
                                ...policy,
                                enabled: checked
                              })
                            }}
                          />
                          <span className="text-sm">
                            {policy.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {policy.compliance.map(comp => (
                            <Badge key={comp} variant="secondary" className="text-xs">
                              {comp}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(policy.lastModified).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Settings size={14} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Real-time Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity size={18} />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { service: 'Authentication Service', status: 'Operational', uptime: '99.99%' },
                    { service: 'API Gateway', status: 'Operational', uptime: '99.97%' },
                    { service: 'Database', status: 'Operational', uptime: '100%' },
                    { service: 'Content Delivery', status: 'Degraded', uptime: '98.2%' },
                    { service: 'Monitoring System', status: 'Operational', uptime: '99.95%' }
                  ].map((service, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          service.status === 'Operational' ? 'bg-green-500' :
                          service.status === 'Degraded' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <span className="font-medium">{service.service}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{service.status}</div>
                        <div className="text-xs text-muted-foreground">{service.uptime} uptime</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Network Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe size={18} />
                  Network Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Sessions</span>
                    <span className="font-bold">1,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Requests per Minute</span>
                    <span className="font-bold">3,892</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Transfer (GB/h)</span>
                    <span className="font-bold">15.7</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Error Rate</span>
                    <span className="font-bold text-green-600">0.02%</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Geographic Distribution</div>
                    {[
                      { region: 'North America', percentage: 65 },
                      { region: 'Europe', percentage: 25 },
                      { region: 'Asia Pacific', percentage: 8 },
                      { region: 'Other', percentage: 2 }
                    ].map((region, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-xs">{region.region}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={region.percentage} className="w-16 h-2" />
                          <span className="text-xs font-medium">{region.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Threat Intelligence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield size={18} />
                Threat Intelligence Feed
              </CardTitle>
              <CardDescription>
                Latest security threats and vulnerabilities relevant to your infrastructure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    title: 'CVE-2024-1234: Remote Code Execution in Web Framework',
                    severity: 'Critical',
                    affected: 'Not Affected',
                    time: '2 hours ago'
                  },
                  {
                    title: 'New Phishing Campaign Targeting Social Media Platforms',
                    severity: 'High',
                    affected: 'Monitoring',
                    time: '4 hours ago'
                  },
                  {
                    title: 'Updated Security Patch Available for Database System',
                    severity: 'Medium',
                    affected: 'Action Required',
                    time: '1 day ago'
                  }
                ].map((threat, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{threat.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={threat.severity === 'Critical' ? 'destructive' : 
                                        threat.severity === 'High' ? 'destructive' : 'default'}>
                            {threat.severity}
                          </Badge>
                          <Badge variant="outline">{threat.affected}</Badge>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{threat.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { standard: 'SOC 2 Type II', compliance: 98, status: 'Compliant' },
              { standard: 'GDPR', compliance: 95, status: 'Compliant' },
              { standard: 'CCPA', compliance: 92, status: 'Compliant' },
              { standard: 'ISO 27001', compliance: 88, status: 'In Progress' }
            ].map((item, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="font-medium">{item.standard}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Compliance</span>
                      <span className="font-bold">{item.compliance}%</span>
                    </div>
                    <Progress value={item.compliance} className="h-2" />
                    <Badge variant={item.status === 'Compliant' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Requirements</CardTitle>
              <CardDescription>
                Track compliance status across different regulatory frameworks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    requirement: 'Data Encryption at Rest',
                    frameworks: ['SOC 2', 'GDPR', 'HIPAA'],
                    status: 'Compliant',
                    lastCheck: '2024-03-15'
                  },
                  {
                    requirement: 'Multi-Factor Authentication',
                    frameworks: ['SOC 2', 'ISO 27001'],
                    status: 'Compliant',
                    lastCheck: '2024-03-15'
                  },
                  {
                    requirement: 'Data Retention Policy',
                    frameworks: ['GDPR', 'CCPA'],
                    status: 'Needs Review',
                    lastCheck: '2024-03-10'
                  },
                  {
                    requirement: 'Access Control Documentation',
                    frameworks: ['SOC 2', 'ISO 27001'],
                    status: 'In Progress',
                    lastCheck: '2024-03-12'
                  }
                ].map((req, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{req.requirement}</h4>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {req.frameworks.map(framework => (
                            <Badge key={framework} variant="outline" className="text-xs">
                              {framework}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={req.status === 'Compliant' ? 'default' :
                                      req.status === 'Needs Review' ? 'destructive' : 'secondary'}>
                          {req.status}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          Last check: {req.lastCheck}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Access Control Tab */}
        <TabsContent value="access" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                    <p className="text-xl font-bold">127</p>
                  </div>
                  <UserCheck size={20} className="text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Failed Logins (24h)</p>
                    <p className="text-xl font-bold text-red-600">23</p>
                  </div>
                  <XCircle size={20} className="text-red-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">MFA Enabled</p>
                    <p className="text-xl font-bold">95%</p>
                  </div>
                  <Lock size={20} className="text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Audit Events</CardTitle>
              <CardDescription>
                Detailed log of security-relevant activities and changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Event Type</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      timestamp: '2024-03-15 14:30:22',
                      eventType: 'Authentication',
                      user: 'sarah.chen@company.com',
                      action: 'Login Successful',
                      ip: '192.168.1.100',
                      status: 'Success'
                    },
                    {
                      timestamp: '2024-03-15 14:25:15',
                      eventType: 'Authorization',
                      user: 'alex.thompson@company.com',
                      action: 'Permission Modified',
                      ip: '192.168.1.105',
                      status: 'Success'
                    },
                    {
                      timestamp: '2024-03-15 14:20:08',
                      eventType: 'Data Access',
                      user: 'maria.garcia@company.com',
                      action: 'Document Downloaded',
                      ip: '192.168.1.110',
                      status: 'Success'
                    },
                    {
                      timestamp: '2024-03-15 14:15:33',
                      eventType: 'Authentication',
                      user: 'unknown@external.com',
                      action: 'Login Failed',
                      ip: '203.0.113.1',
                      status: 'Failed'
                    }
                  ].map((log, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.eventType}</Badge>
                      </TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                      <TableCell>
                        <Badge variant={log.status === 'Success' ? 'default' : 'destructive'}>
                          {log.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default EnterpriseSecurityDashboard
