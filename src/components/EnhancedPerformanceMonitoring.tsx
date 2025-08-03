import { useState, useMemo } from 'react'
import { Post, Platform } from '@/types.ts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Legend,
  ScatterChart,
  Scatter
} from 'recharts'
import { 
  Activity,
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Eye,
  Heart,
  MessageCircle,
  Share,
  Users,
  BarChart3,
  Zap,
  Award,
  Globe,
  Calendar,
  Download,
  RefreshCw,
  Settings,
  Bell,
  ArrowUp,
  ArrowDown,
  Minus,
  Star,
  Flame,
  ShieldCheck,
  AlertCircle
} from '@phosphor-icons/react'
import { format, subDays, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'

interface PerformanceMonitoringProps {
  posts: Post[]
}

interface PerformanceAlert {
  id: string
  type: 'performance_drop' | 'unusual_activity' | 'engagement_spike' | 'reach_decline' | 'quality_issue'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  affectedPosts: string[]
  platform?: Platform
  metric?: string
  threshold?: number
  currentValue?: number
  detectedAt: string
  status: 'active' | 'acknowledged' | 'resolved'
  recommendedActions: string[]
}

interface QualityMetric {
  postId: string
  overallScore: number
  factors: {
    contentClarity: number
    brandCompliance: number
    engagementPotential: number
    visualQuality: number
    accessibilityScore: number
    hashtagRelevance: number
  }
  issues: string[]
  recommendations: string[]
}

interface ComplianceCheck {
  postId: string
  status: 'compliant' | 'warning' | 'violation'
  checks: {
    brandGuidelines: boolean
    contentPolicy: boolean
    accessibility: boolean
    languageAppropriate: boolean
    copyrightClear: boolean
  }
  violations: string[]
  warnings: string[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

// Mock performance data generator
const generateMockPerformanceData = (posts: Post[]) => {
  return posts.map(post => ({
    ...post,
    metrics: {
      impressions: Math.floor(Math.random() * 10000) + 1000,
      reach: Math.floor(Math.random() * 8000) + 800,
      engagement: Math.floor(Math.random() * 500) + 50,
      likes: Math.floor(Math.random() * 300) + 30,
      comments: Math.floor(Math.random() * 50) + 5,
      shares: Math.floor(Math.random() * 100) + 10,
      saves: Math.floor(Math.random() * 80) + 8,
      clickThroughRate: Math.random() * 5 + 1,
      engagementRate: Math.random() * 10 + 2,
      sentimentScore: Math.random() * 100,
      viralityIndex: Math.random() * 100
    },
    quality: {
      score: Math.floor(Math.random() * 30) + 70,
      issues: Math.random() > 0.7 ? ['Long text blocks', 'Missing alt text'] : [],
      grade: 'A'
    }
  }))
}

export function PerformanceMonitoring({ posts }: PerformanceMonitoringProps) {
  const [dateRange, setDateRange] = useState('7')
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all')
  const [activeTab, setActiveTab] = useState('overview')
  const [alertsFilter, setAlertsFilter] = useState<'all' | 'active' | 'critical'>('active')

  const performanceData = useMemo(() => generateMockPerformanceData(posts), [posts])

  // Mock alerts data
  const performanceAlerts: PerformanceAlert[] = useMemo(() => [
    {
      id: '1',
      type: 'performance_drop',
      severity: 'high',
      title: 'Engagement Rate Drop Detected',
      description: 'Instagram posts showing 35% decrease in engagement rate over the last 3 days',
      affectedPosts: ['post-1', 'post-2'],
      platform: 'instagram',
      metric: 'engagement_rate',
      threshold: 5.0,
      currentValue: 3.2,
      detectedAt: new Date(Date.now() - 3600000).toISOString(),
      status: 'active',
      recommendedActions: [
        'Review recent content themes for audience fatigue',
        'Check posting times alignment with audience activity',
        'Consider A/B testing different content formats'
      ]
    },
    {
      id: '2',
      type: 'unusual_activity',
      severity: 'medium',
      title: 'Unusual Comment Pattern',
      description: 'Spike in negative comments detected across LinkedIn posts',
      affectedPosts: ['post-3', 'post-4'],
      platform: 'linkedin',
      detectedAt: new Date(Date.now() - 7200000).toISOString(),
      status: 'acknowledged',
      recommendedActions: [
        'Monitor comment sentiment closely',
        'Prepare response strategy for negative feedback',
        'Review content for potential controversial elements'
      ]
    },
    {
      id: '3',
      type: 'reach_decline',
      severity: 'critical',
      title: 'Severe Reach Decline',
      description: 'Organic reach dropped by 60% across all platforms in the last 48 hours',
      affectedPosts: ['post-1', 'post-2', 'post-3', 'post-4', 'post-5'],
      threshold: 10000,
      currentValue: 4000,
      detectedAt: new Date(Date.now() - 1800000).toISOString(),
      status: 'active',
      recommendedActions: [
        'Investigate potential algorithm changes',
        'Review content for policy violations',
        'Increase engagement with audience to boost signals'
      ]
    }
  ], [])

  // Quality metrics
  const qualityMetrics: QualityMetric[] = useMemo(() => 
    posts.slice(0, 5).map(post => ({
      postId: post.id,
      overallScore: Math.floor(Math.random() * 30) + 70,
      factors: {
        contentClarity: Math.floor(Math.random() * 30) + 70,
        brandCompliance: Math.floor(Math.random() * 30) + 70,
        engagementPotential: Math.floor(Math.random() * 30) + 70,
        visualQuality: Math.floor(Math.random() * 30) + 70,
        accessibilityScore: Math.floor(Math.random() * 30) + 70,
        hashtagRelevance: Math.floor(Math.random() * 30) + 70
      },
      issues: Math.random() > 0.6 ? ['Missing alt text', 'Long paragraphs'] : [],
      recommendations: [
        'Add more engaging call-to-action',
        'Include relevant trending hashtags',
        'Optimize for mobile viewing'
      ]
    }))
  , [posts])

  // Generate time series data for monitoring
  const timeSeriesData = useMemo(() => {
    const days = eachDayOfInterval({
      start: subDays(new Date(), parseInt(dateRange)),
      end: new Date()
    })
    
    return days.map(day => ({
      date: format(day, 'MMM dd'),
      engagement: Math.floor(Math.random() * 1000) + 500,
      reach: Math.floor(Math.random() * 5000) + 2000,
      impressions: Math.floor(Math.random() * 8000) + 4000,
      qualityScore: Math.floor(Math.random() * 20) + 75,
      sentimentScore: Math.floor(Math.random() * 30) + 60,
      alertsCount: Math.floor(Math.random() * 5)
    }))
  }, [dateRange])

  const filteredAlerts = performanceAlerts.filter(alert => {
    if (alertsFilter === 'all') return true
    if (alertsFilter === 'active') return alert.status === 'active'
    if (alertsFilter === 'critical') return alert.severity === 'critical'
    return true
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default: return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-5 h-5" />
      case 'high': return <AlertCircle className="w-5 h-5" />
      case 'medium': return <Clock className="w-5 h-5" />
      default: return <Bell className="w-5 h-5" />
    }
  }

  const getQualityGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', color: 'text-green-600' }
    if (score >= 80) return { grade: 'A', color: 'text-green-500' }
    if (score >= 70) return { grade: 'B', color: 'text-blue-500' }
    if (score >= 60) return { grade: 'C', color: 'text-yellow-500' }
    return { grade: 'D', color: 'text-red-500' }
  }

  const getTrendIcon = (current: number | undefined, threshold: number | undefined) => {
    if (!current || !threshold) return <Minus size={16} className="text-gray-500" />
    if (current > threshold) return <ArrowUp size={16} className="text-green-500" />
    if (current < threshold * 0.8) return <ArrowDown size={16} className="text-red-500" />
    return <Minus size={16} className="text-gray-500" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Performance Monitoring</h1>
          <p className="text-muted-foreground">Real-time monitoring and quality assurance</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedPlatform} onValueChange={(value: Platform | 'all') => setSelectedPlatform(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Last 24h</SelectItem>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Alert Summary */}
      {filteredAlerts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>{performanceAlerts.filter(a => a.severity === 'critical' && a.status === 'active').length} critical alerts</strong> require immediate attention
            </AlertDescription>
          </Alert>
          <Alert className="border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>{performanceAlerts.filter(a => a.severity === 'high' && a.status === 'active').length} high priority alerts</strong> detected
            </AlertDescription>
          </Alert>
          <Alert className="border-blue-200 bg-blue-50">
            <Activity className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>System monitoring</strong> is active across all platforms
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Performance</p>
                <p className="text-2xl font-bold text-green-600">Good</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2">
              <Progress value={82} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">82% of targets met</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
                <p className="text-2xl font-bold text-orange-600">{filteredAlerts.length}</p>
              </div>
              <Bell className="w-8 h-8 text-orange-500" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {performanceAlerts.filter(a => a.severity === 'critical').length} critical, {performanceAlerts.filter(a => a.severity === 'high').length} high priority
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Quality Score</p>
                <p className="text-2xl font-bold text-blue-600">87%</p>
              </div>
              <Star className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mt-2 flex items-center text-xs">
              <ArrowUp size={12} className="text-green-500 mr-1" />
              <span className="text-green-600">+5% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compliance Rate</p>
                <p className="text-2xl font-bold text-purple-600">94%</p>
              </div>
              <ShieldCheck className="w-8 h-8 text-purple-500" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {posts.filter(() => Math.random() > 0.06).length} posts compliant
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Monitoring Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity size={16} />
            Overview
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Bell size={16} />
            Alerts ({filteredAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="quality" className="flex items-center gap-2">
            <Star size={16} />
            Quality
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <ShieldCheck size={16} />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="realtime" className="flex items-center gap-2">
            <Zap size={16} />
            Real-time
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={20} />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Area yAxisId="left" type="monotone" dataKey="engagement" fill="#8884d8" fillOpacity={0.6} />
                    <Line yAxisId="right" type="monotone" dataKey="qualityScore" stroke="#ff7300" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Platform Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 size={20} />
                  Platform Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { platform: 'Instagram', performance: 88, alerts: 2 },
                    { platform: 'LinkedIn', performance: 92, alerts: 1 },
                    { platform: 'Twitter', performance: 75, alerts: 3 },
                    { platform: 'Facebook', performance: 83, alerts: 1 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="platform" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="performance" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Key Metrics Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target size={20} />
                Key Performance Indicators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { metric: 'Engagement Rate', current: 8.5, target: 10, unit: '%', trend: 'up' },
                  { metric: 'Reach Growth', current: 15.2, target: 12, unit: '%', trend: 'up' },
                  { metric: 'Response Time', current: 2.1, target: 3, unit: 'hrs', trend: 'down' },
                  { metric: 'Content Quality', current: 87, target: 85, unit: '%', trend: 'up' }
                ].map((kpi) => (
                  <div key={kpi.metric} className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">{kpi.metric}</p>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-2xl font-bold">{kpi.current}{kpi.unit}</span>
                      {getTrendIcon(kpi.current, kpi.target)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Target: {kpi.target}{kpi.unit}
                    </div>
                    <Progress 
                      value={Math.min((kpi.current / kpi.target) * 100, 100)} 
                      className="h-2 mt-2" 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Performance Alerts</h2>
            <div className="flex items-center gap-3">
              <Select value={alertsFilter} onValueChange={(value: typeof alertsFilter) => setAlertsFilter(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Alerts</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="critical">Critical Only</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                Mark All Read
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity)}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                      {getSeverityIcon(alert.severity)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{alert.title}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                            {alert.severity}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {alert.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-3">{alert.description}</p>
                      
                      {alert.metric && alert.currentValue && alert.threshold && (
                        <div className="bg-muted/30 p-3 rounded-lg mb-3">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Metric</p>
                              <p className="font-medium capitalize">{alert.metric.replace('_', ' ')}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Current Value</p>
                              <p className="font-medium text-red-600">{alert.currentValue}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Threshold</p>
                              <p className="font-medium">{alert.threshold}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Recommended Actions:</h4>
                        <ul className="space-y-1 text-sm">
                          {alert.recommendedActions.map((action, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Detected {format(new Date(alert.detectedAt), 'MMM dd, yyyy h:mm a')}
                          {alert.platform && ` • ${alert.platform}`}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            Acknowledge
                          </Button>
                          <Button size="sm">
                            Resolve
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Quality Tab */}
        <TabsContent value="quality" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Content Quality Analysis</h2>
            <Button variant="outline">
              <Settings size={16} className="mr-2" />
              Quality Settings
            </Button>
          </div>

          <div className="space-y-4">
            {qualityMetrics.map((quality) => {
              const post = posts.find(p => p.id === quality.postId)
              if (!post) return null
              
              const gradeInfo = getQualityGrade(quality.overallScore)
              
              return (
                <Card key={quality.postId}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-center">
                        <div className={`text-4xl font-bold ${gradeInfo.color} mb-1`}>
                          {gradeInfo.grade}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {quality.overallScore}%
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2 line-clamp-2">{post.content}</h3>
                        <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                          <Badge variant="outline">{post.platform}</Badge>
                          <span>{format(new Date(post.scheduledDate), 'MMM dd, yyyy')}</span>
                          <Badge variant={post.status === 'approved' ? 'default' : 'secondary'}>
                            {post.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          {Object.entries(quality.factors).map(([factor, score]) => (
                            <div key={factor}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs capitalize">{factor.replace(/([A-Z])/g, ' $1').trim()}</span>
                                <span className="text-xs font-medium">{score}%</span>
                              </div>
                              <Progress value={score} className="h-1" />
                            </div>
                          ))}
                        </div>

                        {quality.issues.length > 0 && (
                          <div className="mb-3">
                            <h4 className="text-sm font-medium mb-2 text-orange-600">Issues Found:</h4>
                            <div className="flex flex-wrap gap-2">
                              {quality.issues.map((issue, index) => (
                                <Badge key={index} variant="outline" className="text-orange-600">
                                  {issue}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-2">Recommendations:</h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {quality.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye size={14} className="mr-1" />
                            Review
                          </Button>
                          <Button variant="outline" size="sm">
                            Improve
                          </Button>
                          <Button variant="outline" size="sm">
                            Re-analyze
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck size={20} />
                Compliance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { check: 'Brand Guidelines', passed: 18, total: 20, percentage: 90 },
                  { check: 'Content Policy', passed: 19, total: 20, percentage: 95 },
                  { check: 'Accessibility', passed: 16, total: 20, percentage: 80 },
                  { check: 'Copyright', passed: 20, total: 20, percentage: 100 }
                ].map((compliance) => (
                  <div key={compliance.check} className="text-center">
                    <div className="mb-2">
                      <div className={`text-2xl font-bold ${
                        compliance.percentage >= 95 ? 'text-green-600' :
                        compliance.percentage >= 80 ? 'text-blue-600' :
                        compliance.percentage >= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {compliance.percentage}%
                      </div>
                      <p className="text-sm text-muted-foreground">{compliance.check}</p>
                    </div>
                    <Progress value={compliance.percentage} className="h-2 mb-2" />
                    <p className="text-xs text-muted-foreground">
                      {compliance.passed}/{compliance.total} posts compliant
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Real-time Tab */}
        <TabsContent value="realtime" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap size={20} />
                Real-time Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="font-medium">System Status</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    All Systems Operational
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">2.3s</div>
                    <p className="text-sm text-muted-foreground">Avg Response Time</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">99.9%</div>
                    <p className="text-sm text-muted-foreground">Uptime</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">0</div>
                    <p className="text-sm text-muted-foreground">Failed Requests</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Recent Activity</h3>
                  <ScrollArea className="h-64">
                    <div className="space-y-2">
                      {Array.from({ length: 20 }, (_, i) => (
                        <div key={i} className="flex items-center justify-between p-2 text-sm border rounded">
                          <span>Post quality check completed for Instagram post</span>
                          <span className="text-muted-foreground">
                            {Math.floor(Math.random() * 60)} seconds ago
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default EnhancedPerformanceMonitoring
