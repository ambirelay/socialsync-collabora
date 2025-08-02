import { useState, useEffect, useMemo } from 'react'
import { Post, Platform } from '@/types.ts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Zap, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Target,
  Eye,
  MessageCircle,
  Share,
  Heart,
  Users,
  Calendar,
  Award,
  Lightbulb,
  RefreshCw,
  Download,
  Settings
} from '@phosphor-icons/react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { format, subDays, subWeeks, subMonths } from 'date-fns'
import { toast } from 'sonner'

interface PerformanceMetric {
  id: string
  name: string
  value: number
  previousValue: number
  target: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  status: 'excellent' | 'good' | 'warning' | 'critical'
  description: string
}

interface OptimizationSuggestion {
  id: string
  type: 'content' | 'timing' | 'platform' | 'engagement' | 'workflow'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  expectedImpact: string
  effort: 'low' | 'medium' | 'high'
  actionItems: string[]
}

interface ContentRecommendation {
  id: string
  platform: Platform
  contentType: string
  topic: string
  reasoning: string
  expectedEngagement: number
  confidence: number
}

interface PerformanceMonitoringProps {
  posts: Post[]
}

const mockMetrics: PerformanceMetric[] = [
  {
    id: 'engagement-rate',
    name: 'Engagement Rate',
    value: 4.8,
    previousValue: 4.2,
    target: 5.0,
    unit: '%',
    trend: 'up',
    status: 'good',
    description: 'Average engagement rate across all platforms'
  },
  {
    id: 'reach-growth',
    name: 'Reach Growth',
    value: 23.5,
    previousValue: 18.2,
    target: 25.0,
    unit: '%',
    trend: 'up',
    status: 'good',
    description: 'Month-over-month reach growth'
  },
  {
    id: 'content-velocity',
    name: 'Content Velocity',
    value: 12,
    previousValue: 15,
    target: 14,
    unit: 'posts/week',
    trend: 'down',
    status: 'warning',
    description: 'Average posts published per week'
  },
  {
    id: 'approval-speed',
    name: 'Approval Speed',
    value: 2.3,
    previousValue: 3.1,
    target: 2.0,
    unit: 'days',
    trend: 'up',
    status: 'good',
    description: 'Average time from creation to approval'
  },
  {
    id: 'quality-score',
    name: 'Content Quality Score',
    value: 8.2,
    previousValue: 7.8,
    target: 8.5,
    unit: '/10',
    trend: 'up',
    status: 'good',
    description: 'AI-assessed content quality score'
  },
  {
    id: 'team-productivity',
    name: 'Team Productivity',
    value: 85,
    previousValue: 78,
    target: 90,
    unit: '%',
    trend: 'up',
    status: 'good',
    description: 'Team productivity and collaboration score'
  }
]

const mockSuggestions: OptimizationSuggestion[] = [
  {
    id: 'suggestion-1',
    type: 'timing',
    priority: 'high',
    title: 'Optimize Posting Schedule',
    description: 'Your current posting times are missing peak engagement windows on LinkedIn and Instagram.',
    expectedImpact: '+18% engagement increase',
    effort: 'low',
    actionItems: [
      'Shift LinkedIn posts to 10-11 AM on Tuesday-Thursday',
      'Schedule Instagram posts for 2-3 PM and 7-8 PM',
      'Reduce weekend posting by 40%'
    ]
  },
  {
    id: 'suggestion-2',
    type: 'content',
    priority: 'high',
    title: 'Increase Video Content',
    description: 'Video posts are generating 2.3x more engagement than image posts across all platforms.',
    expectedImpact: '+35% engagement increase',
    effort: 'medium',
    actionItems: [
      'Create 2-3 short-form videos per week',
      'Repurpose existing blog content into video format',
      'Invest in basic video editing tools and training'
    ]
  },
  {
    id: 'suggestion-3',
    type: 'engagement',
    priority: 'medium',
    title: 'Improve Comment Response Rate',
    description: 'Your comment response rate is below industry average, impacting algorithmic visibility.',
    expectedImpact: '+12% reach increase',
    effort: 'low',
    actionItems: [
      'Set up comment monitoring alerts',
      'Respond to comments within 2 hours during business hours',
      'Create comment response templates for common questions'
    ]
  },
  {
    id: 'suggestion-4',
    type: 'platform',
    priority: 'medium',
    title: 'Expand Twitter Presence',
    description: 'Twitter is underutilized in your content mix but shows high potential for your industry.',
    expectedImpact: '+25% total reach',
    effort: 'medium',
    actionItems: [
      'Increase Twitter posting frequency from 2 to 5 posts per week',
      'Engage with industry leaders and trending topics',
      'Create Twitter-specific content like threads and polls'
    ]
  },
  {
    id: 'suggestion-5',
    type: 'workflow',
    priority: 'low',
    title: 'Streamline Approval Process',
    description: 'Average approval time has increased. Consider implementing automated workflows.',
    expectedImpact: '+30% faster publishing',
    effort: 'high',
    actionItems: [
      'Set up automatic approval for certain content types',
      'Create approval priority queues',
      'Implement deadline-based auto-escalation'
    ]
  }
]

const mockRecommendations: ContentRecommendation[] = [
  {
    id: 'rec-1',
    platform: 'linkedin',
    contentType: 'Industry Insight',
    topic: 'AI in Marketing Automation',
    reasoning: 'High engagement topic with 89% relevance to your audience',
    expectedEngagement: 245,
    confidence: 92
  },
  {
    id: 'rec-2',
    platform: 'instagram',
    contentType: 'Behind the Scenes',
    topic: 'Team Collaboration Process',
    reasoning: 'Your audience loves authentic team content (+156% engagement)',
    expectedEngagement: 189,
    confidence: 87
  },
  {
    id: 'rec-3',
    platform: 'twitter',
    contentType: 'Thread',
    topic: 'Content Marketing Tips',
    reasoning: 'Thread format performs 3x better than single tweets for your account',
    expectedEngagement: 167,
    confidence: 84
  }
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d']

export function PerformanceMonitoring({ posts }: PerformanceMonitoringProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [selectedMetric, setSelectedMetric] = useState('engagement-rate')
  const [refreshing, setRefreshing] = useState(false)

  // Generate performance data based on time range
  const performanceData = useMemo(() => {
    const days = {
      '7d': 7,
      '30d': 30,
      '90d': 90
    }[timeRange]

    return Array.from({ length: days }, (_, i) => {
      const date = subDays(new Date(), days - i - 1)
      return {
        date: format(date, 'MMM dd'),
        engagement: Math.floor(Math.random() * 100) + 50,
        reach: Math.floor(Math.random() * 1000) + 500,
        posts: Math.floor(Math.random() * 5) + 1,
        clicks: Math.floor(Math.random() * 50) + 20
      }
    })
  }, [timeRange])

  // Platform performance comparison
  const platformComparison = useMemo(() => {
    const platforms = ['instagram', 'linkedin', 'twitter', 'facebook']
    return platforms.map(platform => ({
      platform,
      engagement: Math.floor(Math.random() * 200) + 100,
      reach: Math.floor(Math.random() * 2000) + 1000,
      posts: posts.filter(p => p.platform === platform).length
    }))
  }, [posts])

  // Content type performance
  const contentTypeData = [
    { type: 'Video', performance: 95, count: 8 },
    { type: 'Carousel', performance: 87, count: 12 },
    { type: 'Single Image', performance: 72, count: 24 },
    { type: 'Text Only', performance: 65, count: 6 },
    { type: 'Link Post', performance: 58, count: 15 }
  ]

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setRefreshing(false)
    toast.success('Performance data refreshed')
  }

  const handleExport = () => {
    toast.success('Performance report exported')
  }

  const getMetricStatus = (status: string) => {
    const statusConfig = {
      excellent: { color: 'text-green-600', bg: 'bg-green-100', icon: Award },
      good: { color: 'text-blue-600', bg: 'bg-blue-100', icon: CheckCircle },
      warning: { color: 'text-amber-600', bg: 'bg-amber-100', icon: AlertTriangle },
      critical: { color: 'text-red-600', bg: 'bg-red-100', icon: AlertTriangle }
    }
    return statusConfig[status] || statusConfig.good
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-amber-100 text-amber-700',
      low: 'bg-green-100 text-green-700'
    }
    return colors[priority] || colors.medium
  }

  const getEffortColor = (effort: string) => {
    const colors = {
      low: 'bg-green-100 text-green-700',
      medium: 'bg-amber-100 text-amber-700',
      high: 'bg-red-100 text-red-700'
    }
    return colors[effort] || colors.medium
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Zap className="text-primary" />
            Performance Monitoring
          </h1>
          <p className="text-muted-foreground">Monitor, analyze, and optimize your content performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download size={16} className="mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw size={16} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Key Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {mockMetrics.map(metric => {
              const statusConfig = getMetricStatus(metric.status)
              const StatusIcon = statusConfig.icon
              const percentChange = ((metric.value - metric.previousValue) / metric.previousValue) * 100
              
              return (
                <Card key={metric.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${statusConfig.bg}`}>
                        <StatusIcon size={24} className={statusConfig.color} />
                      </div>
                      <Badge className={getPriorityColor(metric.status)}>
                        {metric.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{metric.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">
                          {metric.value}{metric.unit}
                        </span>
                        <div className={`flex items-center text-sm ${percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {percentChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          {Math.abs(percentChange).toFixed(1)}%
                        </div>
                      </div>
                      <Progress value={(metric.value / metric.target) * 100} className="h-2" />
                      <p className="text-sm text-muted-foreground">{metric.description}</p>
                      <div className="text-xs text-muted-foreground">
                        Target: {metric.target}{metric.unit}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="engagement" stroke="#8884d8" strokeWidth={2} name="Engagement" />
                    <Line type="monotone" dataKey="reach" stroke="#82ca9d" strokeWidth={2} name="Reach" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Platform Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={platformComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="platform" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="engagement" fill="#8884d8" name="Engagement" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Content Type Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Content Type Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentTypeData.map(item => (
                  <div key={item.type} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="font-medium">{item.type}</div>
                      <Badge variant="secondary">{item.count} posts</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32">
                        <Progress value={item.performance} />
                      </div>
                      <div className="text-sm font-medium w-12 text-right">
                        {item.performance}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization">
          <div className="space-y-6">
            {/* Optimization Score */}
            <Card>
              <CardHeader>
                <CardTitle>Overall Optimization Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-8">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        strokeDasharray="78, 100"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">78%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Good Performance</h3>
                    <p className="text-muted-foreground">
                      Your content strategy is performing well with room for improvement in timing and engagement.
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span>Strengths: 4</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-amber-500 rounded-full" />
                        <span>Opportunities: 3</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        <span>Issues: 1</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Optimization Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle>Optimization Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSuggestions.map(suggestion => (
                    <div key={suggestion.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{suggestion.title}</h3>
                            <Badge className={getPriorityColor(suggestion.priority)}>
                              {suggestion.priority} priority
                            </Badge>
                            <Badge className={getEffortColor(suggestion.effort)}>
                              {suggestion.effort} effort
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Target size={14} className="text-green-600" />
                              <span className="font-medium text-green-600">{suggestion.expectedImpact}</span>
                            </div>
                            <Badge variant="secondary" className="capitalize">
                              {suggestion.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="font-medium text-sm">Action Items:</div>
                        <ul className="space-y-1">
                          {suggestion.actionItems.map((item, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                              <CheckCircle size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          Learn More
                        </Button>
                        <Button size="sm">
                          Implement
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations">
          <div className="space-y-6">
            {/* AI Content Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="text-amber-500" />
                  AI-Powered Content Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockRecommendations.map(rec => (
                    <Card key={rec.id}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="capitalize">
                              {rec.platform}
                            </Badge>
                            <div className="text-sm text-muted-foreground">
                              {rec.confidence}% confidence
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-semibold">{rec.contentType}</h3>
                            <p className="text-sm text-muted-foreground">{rec.topic}</p>
                          </div>
                          
                          <div className="text-sm">
                            <div className="font-medium mb-1">Expected Engagement:</div>
                            <div className="flex items-center gap-2">
                              <Progress value={(rec.expectedEngagement / 300) * 100} className="flex-1" />
                              <span>{rec.expectedEngagement}</span>
                            </div>
                          </div>
                          
                          <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
                            {rec.reasoning}
                          </div>
                          
                          <Button size="sm" className="w-full">
                            Create Content
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Best Performing Content */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Content This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {posts.slice(0, 5).map((post, index) => (
                    <div key={post.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold">#{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="capitalize">
                            {post.platform}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(post.createdAt), 'MMM d')}
                          </span>
                        </div>
                        <p className="text-sm line-clamp-2">{post.content}</p>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-medium">{Math.floor(Math.random() * 500) + 100}</div>
                        <div className="text-muted-foreground">engagement</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts">
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Content Velocity Alert:</strong> Your posting frequency has dropped 20% this week. Consider scheduling more content to maintain audience engagement.
              </AlertDescription>
            </Alert>
            
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Engagement Milestone:</strong> Great job! Your average engagement rate has increased by 15% compared to last month.
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <strong>Approval Backlog:</strong> You have 3 posts pending approval for more than 24 hours. Consider reviewing your approval workflow.
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Users className="h4 w-4" />
              <AlertDescription>
                <strong>Team Activity:</strong> Marcus Rodriguez hasn't been active in the last 48 hours. You might want to check in with them.
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}