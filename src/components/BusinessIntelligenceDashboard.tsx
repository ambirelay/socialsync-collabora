import { useState, useMemo } from 'react'
import { Post } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Target,
  Users,
  MessageCircle,
  Heart,
  Share,
  Eye,
  Clock,
  Zap,
  Award,
  AlertTriangle,
  Download,
  Filter
} from 'lucide-react'
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns'
import { toast } from 'sonner'

interface BusinessIntelligenceProps {
  posts: Post[]
}

interface PerformanceMetric {
  name: string
  value: number
  change: number
  trend: 'up' | 'down' | 'stable'
  target?: number
}

interface PlatformInsight {
  platform: string
  posts: number
  engagement: number
  reach: number
  bestTime: string
  topContent: string
  performance: 'excellent' | 'good' | 'average' | 'poor'
}

interface ContentRecommendation {
  type: 'content' | 'timing' | 'platform' | 'hashtag'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  confidence: number
}

interface CompetitorAnalysis {
  competitor: string
  engagement: number
  frequency: number
  topHashtags: string[]
  contentTypes: string[]
  threat: 'high' | 'medium' | 'low'
}

const mockAnalytics = {
  kpis: [
    { name: 'Total Reach', value: 156800, change: 23.5, trend: 'up', target: 150000 },
    { name: 'Engagement Rate', value: 4.8, change: -2.1, trend: 'down', target: 5.0 },
    { name: 'Click-Through Rate', value: 2.3, change: 15.2, trend: 'up', target: 2.0 },
    { name: 'Conversion Rate', value: 3.7, change: 8.9, trend: 'up', target: 3.5 },
    { name: 'Brand Mentions', value: 1247, change: 31.2, trend: 'up', target: 1000 },
    { name: 'Follower Growth', value: 2.4, change: 5.6, trend: 'up', target: 2.0 }
  ] as PerformanceMetric[],

  platformInsights: [
    {
      platform: 'linkedin',
      posts: 18,
      engagement: 8.2,
      reach: 45600,
      bestTime: '9:00 AM',
      topContent: 'Industry insights',
      performance: 'excellent'
    },
    {
      platform: 'instagram',
      posts: 24,
      engagement: 6.7,
      reach: 38900,
      bestTime: '6:00 PM',
      topContent: 'Behind-the-scenes',
      performance: 'good'
    },
    {
      platform: 'twitter',
      posts: 32,
      engagement: 3.4,
      reach: 28300,
      bestTime: '12:00 PM',
      topContent: 'News & updates',
      performance: 'average'
    },
    {
      platform: 'facebook',
      posts: 12,
      engagement: 2.1,
      reach: 15200,
      bestTime: '3:00 PM',
      topContent: 'Company updates',
      performance: 'poor'
    }
  ] as PlatformInsight[],

  recommendations: [
    {
      type: 'timing',
      title: 'Optimize Instagram Posting Time',
      description: 'Your Instagram posts perform 34% better when posted between 6-8 PM. Consider scheduling more content during this window.',
      impact: 'high',
      confidence: 87
    },
    {
      type: 'content',
      title: 'Increase Video Content',
      description: 'Video posts have 2.3x higher engagement than image posts. Consider creating more video content for LinkedIn.',
      impact: 'high',
      confidence: 92
    },
    {
      type: 'platform',
      title: 'Expand LinkedIn Presence',
      description: 'LinkedIn shows highest engagement rates (8.2%). Consider reallocating budget from Facebook to LinkedIn.',
      impact: 'medium',
      confidence: 78
    },
    {
      type: 'hashtag',
      title: 'Trending Hashtag Opportunity',
      description: '#SustainableBusiness is trending in your industry with 156% growth. Consider incorporating it into relevant posts.',
      impact: 'medium',
      confidence: 81
    }
  ] as ContentRecommendation[],

  competitors: [
    {
      competitor: 'TechCorp Inc.',
      engagement: 6.8,
      frequency: 12,
      topHashtags: ['#innovation', '#tech', '#future'],
      contentTypes: ['product demos', 'thought leadership'],
      threat: 'high'
    },
    {
      competitor: 'Digital Solutions',
      engagement: 4.2,
      frequency: 8,
      topHashtags: ['#digital', '#solutions', '#business'],
      contentTypes: ['case studies', 'tutorials'],
      threat: 'medium'
    },
    {
      competitor: 'StartupX',
      engagement: 3.1,
      frequency: 15,
      topHashtags: ['#startup', '#growth', '#entrepreneurship'],
      contentTypes: ['company culture', 'announcements'],
      threat: 'low'
    }
  ] as CompetitorAnalysis[]
}

export function BusinessIntelligenceDashboard({ posts }: BusinessIntelligenceProps) {
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [activeTab, setActiveTab] = useState('overview')

  // Calculate real metrics from posts data
  const metrics = useMemo(() => {
    const totalPosts = posts.length
    const approvedPosts = posts.filter(p => p.status === 'approved').length
    const pendingPosts = posts.filter(p => p.status === 'pending').length
    const rejectedPosts = posts.filter(p => p.status === 'rejected').length
    
    const platformDistribution = {
      instagram: posts.filter(p => p.platform === 'instagram').length,
      linkedin: posts.filter(p => p.platform === 'linkedin').length,
      twitter: posts.filter(p => p.platform === 'twitter').length,
      facebook: posts.filter(p => p.platform === 'facebook').length
    }

    return {
      totalPosts,
      approvedPosts,
      pendingPosts,
      rejectedPosts,
      approvalRate: totalPosts > 0 ? (approvedPosts / totalPosts) * 100 : 0,
      platformDistribution
    }
  }, [posts])

  const exportReport = () => {
    toast.success('Analytics report exported successfully')
  }

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'text-green-600'
      case 'good': return 'text-blue-600'
      case 'average': return 'text-yellow-600'
      case 'poor': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getPerformanceBadge = (performance: string) => {
    const colors = {
      excellent: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      good: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      average: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      poor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[performance as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <TrendingUp className="text-green-500" size={16} />
      case 'medium': return <Target className="text-yellow-500" size={16} />
      case 'low': return <AlertTriangle className="text-red-500" size={16} />
      default: return <Zap size={16} />
    }
  }

  const getThreatColor = (threat: string) => {
    switch (threat) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Business Intelligence</h2>
          <p className="text-muted-foreground">
            Advanced analytics and competitive insights for strategic decision making
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport} variant="outline">
            <Download size={16} className="mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {mockAnalytics.kpis.map((kpi, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{kpi.name}</span>
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="text-green-500" size={16} />
                    ) : kpi.trend === 'down' ? (
                      <TrendingDown className="text-red-500" size={16} />
                    ) : (
                      <div className="w-4 h-4 bg-gray-300 rounded-full" />
                    )}
                  </div>
                  <div className="text-2xl font-bold mb-1">
                    {kpi.name.includes('Rate') || kpi.name.includes('Growth') 
                      ? `${kpi.value}%` 
                      : kpi.value.toLocaleString()}
                  </div>
                  <div className={`text-xs flex items-center gap-1 ${
                    kpi.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.change > 0 ? '+' : ''}{kpi.change}% vs last period
                  </div>
                  {kpi.target && (
                    <Progress 
                      value={(kpi.value / kpi.target) * 100} 
                      className="mt-2 h-1"
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Stats from Real Data */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Posts</p>
                    <p className="text-2xl font-bold">{metrics.totalPosts}</p>
                  </div>
                  <BarChart3 className="text-blue-500" size={24} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Approval Rate</p>
                    <p className="text-2xl font-bold">{metrics.approvalRate.toFixed(1)}%</p>
                  </div>
                  <Award className="text-green-500" size={24} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Review</p>
                    <p className="text-2xl font-bold">{metrics.pendingPosts}</p>
                  </div>
                  <Clock className="text-orange-500" size={24} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Top Platform</p>
                    <p className="text-2xl font-bold">
                      {Object.entries(metrics.platformDistribution)
                        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                    </p>
                  </div>
                  <Target className="text-purple-500" size={24} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Platform Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mockAnalytics.platformInsights.map(insight => (
                  <div key={insight.platform} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium capitalize">{insight.platform}</h4>
                      <Badge className={getPerformanceBadge(insight.performance)}>
                        {insight.performance}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Posts</span>
                        <span className="font-medium">{insight.posts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Engagement</span>
                        <span className="font-medium">{insight.engagement}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reach</span>
                        <span className="font-medium">{insight.reach.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Best Time</span>
                        <span className="font-medium">{insight.bestTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Detailed Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { metric: 'Likes', value: 12540, change: 15.2 },
                    { metric: 'Comments', value: 3280, change: -3.1 },
                    { metric: 'Shares', value: 1890, change: 22.7 },
                    { metric: 'Saves', value: 890, change: 8.9 }
                  ].map(item => (
                    <div key={item.metric} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-sm font-medium">{item.metric}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{item.value.toLocaleString()}</span>
                        <span className={`text-xs ${item.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.change > 0 ? '+' : ''}{item.change}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: 'Video', posts: 12, avgEngagement: 8.4, performance: 'excellent' },
                    { type: 'Carousel', posts: 18, avgEngagement: 6.2, performance: 'good' },
                    { type: 'Single Image', posts: 24, avgEngagement: 4.1, performance: 'average' },
                    { type: 'Text Only', posts: 8, avgEngagement: 2.8, performance: 'poor' }
                  ].map(item => (
                    <div key={item.type} className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium">{item.type}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {item.posts} posts
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{item.avgEngagement}%</span>
                        <Badge className={getPerformanceBadge(item.performance)}>
                          {item.performance}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timing Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Optimal Posting Times</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="text-center">
                    <div className="text-xs font-medium mb-2">{day}</div>
                    <div className="space-y-1">
                      {[9, 12, 15, 18, 21].map(hour => (
                        <div 
                          key={hour}
                          className={`h-6 rounded text-xs flex items-center justify-center text-white ${
                            (day === 'Wed' && hour === 12) || (day === 'Thu' && hour === 15) 
                              ? 'bg-green-500' 
                              : (day === 'Tue' && hour === 9) || (day === 'Fri' && hour === 18)
                              ? 'bg-blue-500'
                              : 'bg-gray-300'
                          }`}
                        >
                          {hour}:00
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded" />
                  <span>Peak performance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded" />
                  <span>Good performance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300 rounded" />
                  <span>Average performance</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.recommendations.slice(0, 2).map((rec, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      {getImpactIcon(rec.impact)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{rec.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {rec.confidence}% confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {rec.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge className={
                            rec.impact === 'high' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : rec.impact === 'medium'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }>
                            {rec.impact} impact
                          </Badge>
                          <Button size="sm" variant="outline">
                            Apply Recommendation
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trend Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Trending Topics & Hashtags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Trending Hashtags</h4>
                  <div className="space-y-2">
                    {[
                      { tag: '#AI', growth: 156, posts: 2890 },
                      { tag: '#Sustainability', growth: 89, posts: 1240 },
                      { tag: '#Innovation', growth: 67, posts: 3450 },
                      { tag: '#Leadership', growth: 45, posts: 1890 }
                    ].map(item => (
                      <div key={item.tag} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.tag}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {item.posts.toLocaleString()} posts
                          </span>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            +{item.growth}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Industry Trends</h4>
                  <div className="space-y-2">
                    {[
                      { topic: 'Remote Work Solutions', score: 94 },
                      { topic: 'Digital Transformation', score: 87 },
                      { topic: 'Customer Experience', score: 78 },
                      { topic: 'Data Privacy', score: 65 }
                    ].map(item => (
                      <div key={item.topic} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.topic}</span>
                          <span className="text-xs text-muted-foreground">{item.score}/100</span>
                        </div>
                        <Progress value={item.score} className="h-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Competitive Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.competitors.map((competitor, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{competitor.competitor}</h4>
                      <Badge className={
                        competitor.threat === 'high' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : competitor.threat === 'medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }>
                        {competitor.threat} threat
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Performance</p>
                        <p className="text-sm font-medium">{competitor.engagement}% engagement</p>
                        <p className="text-sm font-medium">{competitor.frequency} posts/week</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Top Hashtags</p>
                        <div className="flex flex-wrap gap-1">
                          {competitor.topHashtags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Content Focus</p>
                        <div className="flex flex-wrap gap-1">
                          {competitor.contentTypes.map(type => (
                            <Badge key={type} variant="secondary" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid gap-4">
            {mockAnalytics.recommendations.map((rec, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {getImpactIcon(rec.impact)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{rec.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {rec.type}
                        </Badge>
                        <Badge className={
                          rec.impact === 'high' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : rec.impact === 'medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }>
                          {rec.impact} impact
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">{rec.description}</p>
                      <div className="flex items-center gap-3">
                        <Progress value={rec.confidence} className="flex-1 max-w-32" />
                        <span className="text-sm text-muted-foreground">
                          {rec.confidence}% confidence
                        </span>
                        <Button size="sm">Apply</Button>
                        <Button size="sm" variant="outline">Dismiss</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}