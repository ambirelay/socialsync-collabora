import { useState, useMemo } from 'react'
import { Post, Platform } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  ComposedChart,
  Legend,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart as PieChartIcon,
  Calendar,
  Users,
  Heart,
  MessageCircle,
  Share,
  Eye,
  Download,
  Filter,
  Target,
  Zap,
  Clock,
  Award,
  Activity,
  Gauge,
  Brain,
  Lightning,
  Flame,
  Star,
  ArrowUp,
  ArrowDown,
  Minus
} from '@phosphor-icons/react'
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, addDays } from 'date-fns'

interface AdvancedContentAnalyticsProps {
  posts: Post[]
}

interface EngagementMetrics {
  likes: number
  comments: number
  shares: number
  impressions: number
  reach: number
  saves: number
  clickThroughRate: number
  engagementRate: number
}

interface PostWithMetrics extends Post {
  metrics: EngagementMetrics
  publishedAt?: string
  sentiment: 'positive' | 'neutral' | 'negative'
  viralScore: number
  hashtagPerformance: { tag: string; score: number }[]
}

interface PlatformInsight {
  platform: Platform
  totalPosts: number
  avgEngagement: number
  topPerformingTime: string
  bestHashtags: string[]
  audienceGrowth: number
  trend: 'up' | 'down' | 'stable'
  reachGoal: number
  reachAchieved: number
}

interface ContentTheme {
  theme: string
  posts: number
  avgEngagement: number
  trend: 'up' | 'down' | 'stable'
  color: string
}

// Generate realistic mock metrics for posts
const generateMockMetrics = (post: Post): PostWithMetrics => {
  const baseEngagement = Math.random() * 1000 + 100
  const platformMultipliers = {
    instagram: 1.2,
    linkedin: 0.8,
    twitter: 1.5,
    facebook: 0.9
  }
  
  const multiplier = platformMultipliers[post.platform]
  const metrics: EngagementMetrics = {
    likes: Math.floor(baseEngagement * multiplier * (0.7 + Math.random() * 0.6)),
    comments: Math.floor(baseEngagement * multiplier * 0.1 * (0.5 + Math.random())),
    shares: Math.floor(baseEngagement * multiplier * 0.05 * (0.3 + Math.random() * 0.7)),
    impressions: Math.floor(baseEngagement * multiplier * 10 * (0.8 + Math.random() * 0.4)),
    reach: Math.floor(baseEngagement * multiplier * 8 * (0.7 + Math.random() * 0.6)),
    saves: Math.floor(baseEngagement * multiplier * 0.08 * (0.4 + Math.random() * 0.6)),
    clickThroughRate: Math.random() * 5 + 1,
    engagementRate: Math.random() * 8 + 2
  }

  return {
    ...post,
    metrics,
    publishedAt: post.status === 'approved' ? post.scheduledDate : undefined,
    sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as any,
    viralScore: Math.floor(Math.random() * 100),
    hashtagPerformance: [
      { tag: '#marketing', score: Math.floor(Math.random() * 100) },
      { tag: '#content', score: Math.floor(Math.random() * 100) },
      { tag: '#social', score: Math.floor(Math.random() * 100) }
    ]
  }
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export function AdvancedContentAnalytics({ posts }: AdvancedContentAnalyticsProps) {
  const [dateRange, setDateRange] = useState('30')
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all')
  const [activeTab, setActiveTab] = useState('overview')

  const postsWithMetrics = useMemo(() => {
    return posts.map(generateMockMetrics)
  }, [posts])

  const filteredPosts = useMemo(() => {
    let filtered = postsWithMetrics
    
    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(post => post.platform === selectedPlatform)
    }
    
    const daysAgo = parseInt(dateRange)
    const cutoffDate = subDays(new Date(), daysAgo)
    filtered = filtered.filter(post => 
      post.publishedAt && new Date(post.publishedAt) >= cutoffDate
    )
    
    return filtered
  }, [postsWithMetrics, selectedPlatform, dateRange])

  // Generate time series data
  const timeSeriesData = useMemo(() => {
    const days = eachDayOfInterval({
      start: subDays(new Date(), parseInt(dateRange)),
      end: new Date()
    })
    
    return days.map(day => {
      const dayPosts = filteredPosts.filter(post => 
        post.publishedAt && 
        format(new Date(post.publishedAt), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      )
      
      const totalEngagement = dayPosts.reduce((sum, post) => 
        sum + post.metrics.likes + post.metrics.comments + post.metrics.shares, 0
      )
      const totalImpressions = dayPosts.reduce((sum, post) => sum + post.metrics.impressions, 0)
      const totalReach = dayPosts.reduce((sum, post) => sum + post.metrics.reach, 0)
      
      return {
        date: format(day, 'MMM dd'),
        engagement: totalEngagement,
        impressions: totalImpressions,
        reach: totalReach,
        posts: dayPosts.length,
        avgEngagementRate: dayPosts.length > 0 
          ? dayPosts.reduce((sum, post) => sum + post.metrics.engagementRate, 0) / dayPosts.length 
          : 0
      }
    })
  }, [filteredPosts, dateRange])

  // Platform performance data
  const platformData = useMemo(() => {
    const platforms = ['instagram', 'twitter', 'linkedin', 'facebook'] as Platform[]
    
    return platforms.map(platform => {
      const platformPosts = postsWithMetrics.filter(post => post.platform === platform)
      const totalEngagement = platformPosts.reduce((sum, post) => 
        sum + post.metrics.likes + post.metrics.comments + post.metrics.shares, 0
      )
      const avgEngagement = platformPosts.length > 0 ? totalEngagement / platformPosts.length : 0
      
      return {
        platform: platform.charAt(0).toUpperCase() + platform.slice(1),
        posts: platformPosts.length,
        engagement: Math.floor(avgEngagement),
        reach: Math.floor(platformPosts.reduce((sum, post) => sum + post.metrics.reach, 0) / Math.max(platformPosts.length, 1)),
        impressions: Math.floor(platformPosts.reduce((sum, post) => sum + post.metrics.impressions, 0) / Math.max(platformPosts.length, 1))
      }
    })
  }, [postsWithMetrics])

  // Content themes analysis
  const contentThemes: ContentTheme[] = useMemo(() => {
    const themes = [
      { theme: 'Product Updates', color: '#0088FE' },
      { theme: 'Behind the Scenes', color: '#00C49F' },
      { theme: 'Industry Insights', color: '#FFBB28' },
      { theme: 'Team Content', color: '#FF8042' },
      { theme: 'Educational', color: '#8884D8' },
      { theme: 'User Generated', color: '#82CA9D' }
    ]
    
    return themes.map(theme => ({
      ...theme,
      posts: Math.floor(Math.random() * 20) + 5,
      avgEngagement: Math.floor(Math.random() * 500) + 100,
      trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as any
    }))
  }, [])

  // Top performing posts
  const topPosts = useMemo(() => {
    return [...filteredPosts]
      .sort((a, b) => b.metrics.engagementRate - a.metrics.engagementRate)
      .slice(0, 5)
  }, [filteredPosts])

  // Performance metrics summary
  const summaryMetrics = useMemo(() => {
    if (filteredPosts.length === 0) {
      return {
        totalEngagement: 0,
        avgEngagementRate: 0,
        totalReach: 0,
        totalImpressions: 0,
        growthRate: 0,
        viralityScore: 0
      }
    }

    const totalEngagement = filteredPosts.reduce((sum, post) => 
      sum + post.metrics.likes + post.metrics.comments + post.metrics.shares, 0
    )
    const avgEngagementRate = filteredPosts.reduce((sum, post) => 
      sum + post.metrics.engagementRate, 0
    ) / filteredPosts.length
    const totalReach = filteredPosts.reduce((sum, post) => sum + post.metrics.reach, 0)
    const totalImpressions = filteredPosts.reduce((sum, post) => sum + post.metrics.impressions, 0)
    const viralityScore = filteredPosts.reduce((sum, post) => sum + post.viralScore, 0) / filteredPosts.length

    return {
      totalEngagement,
      avgEngagementRate,
      totalReach,
      totalImpressions,
      growthRate: Math.random() * 20 + 5, // Mock growth rate
      viralityScore
    }
  }, [filteredPosts])

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <ArrowUp size={16} className="text-green-500" />
      case 'down': return <ArrowDown size={16} className="text-red-500" />
      default: return <Minus size={16} className="text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics</h1>
          <p className="text-muted-foreground">Deep insights into your content performance</p>
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
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Engagement</p>
                <p className="text-2xl font-bold">{summaryMetrics.totalEngagement.toLocaleString()}</p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              {getTrendIcon('up')}
              <span className="ml-1 text-green-600">+12.5%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Engagement Rate</p>
                <p className="text-2xl font-bold">{summaryMetrics.avgEngagementRate.toFixed(1)}%</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              {getTrendIcon('up')}
              <span className="ml-1 text-green-600">+8.3%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reach</p>
                <p className="text-2xl font-bold">{(summaryMetrics.totalReach / 1000).toFixed(1)}K</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              {getTrendIcon('up')}
              <span className="ml-1 text-green-600">+15.7%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Impressions</p>
                <p className="text-2xl font-bold">{(summaryMetrics.totalImpressions / 1000).toFixed(1)}K</p>
              </div>
              <Eye className="w-8 h-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              {getTrendIcon('up')}
              <span className="ml-1 text-green-600">+22.1%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Growth Rate</p>
                <p className="text-2xl font-bold">{summaryMetrics.growthRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              {getTrendIcon('up')}
              <span className="ml-1 text-green-600">+3.2%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Virality Score</p>
                <p className="text-2xl font-bold">{summaryMetrics.viralityScore.toFixed(0)}/100</p>
              </div>
              <Flame className="w-8 h-8 text-red-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              {getTrendIcon('stable')}
              <span className="ml-1 text-gray-600">±0.5%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 size={16} />
            Overview
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Target size={16} />
            Performance
          </TabsTrigger>
          <TabsTrigger value="audience" className="flex items-center gap-2">
            <Users size={16} />
            Audience
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Brain size={16} />
            Content Analysis
          </TabsTrigger>
          <TabsTrigger value="competitive" className="flex items-center gap-2">
            <Zap size={16} />
            Competitive
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Engagement Over Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={20} />
                  Engagement Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="engagement" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </AreaChart>
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
                  <BarChart data={platformData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="platform" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="engagement" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Content Themes Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon size={20} />
                Content Themes Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={contentThemes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ theme, posts }) => `${theme}: ${posts}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="posts"
                    >
                      {contentThemes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-4">
                  {contentThemes.map((theme, index) => (
                    <div key={theme.theme} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.color }} />
                        <div>
                          <p className="font-medium">{theme.theme}</p>
                          <p className="text-sm text-muted-foreground">{theme.posts} posts</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{theme.avgEngagement}</span>
                        {getTrendIcon(theme.trend)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Top Performing Posts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award size={20} />
                Top Performing Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPosts.map((post, index) => (
                  <div key={post.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium line-clamp-2">{post.content}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <Badge variant="secondary">{post.platform}</Badge>
                        <span className="flex items-center gap-1">
                          <Heart size={14} /> {post.metrics.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle size={14} /> {post.metrics.comments}
                        </span>
                        <span className="flex items-center gap-1">
                          <Share size={14} /> {post.metrics.shares}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{post.metrics.engagementRate.toFixed(1)}%</p>
                      <p className="text-sm text-muted-foreground">engagement rate</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target size={20} />
                Performance Radar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={[
                  { subject: 'Engagement', value: summaryMetrics.avgEngagementRate, fullMark: 10 },
                  { subject: 'Reach', value: 8, fullMark: 10 },
                  { subject: 'Impressions', value: 7.5, fullMark: 10 },
                  { subject: 'Growth', value: summaryMetrics.growthRate / 2, fullMark: 10 },
                  { subject: 'Virality', value: summaryMetrics.viralityScore / 10, fullMark: 10 },
                  { subject: 'Quality', value: 8.5, fullMark: 10 }
                ]}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={60} domain={[0, 10]} />
                  <Radar name="Performance" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Audience Growth */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users size={20} />
                  Audience Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="reach" fill="#8884d8" name="Daily Reach" />
                    <Line type="monotone" dataKey="avgEngagementRate" stroke="#ff7300" name="Engagement Rate" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Engagement Patterns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock size={20} />
                  Best Posting Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { day: 'Monday', time: '9:00 AM', engagement: '8.5%' },
                    { day: 'Tuesday', time: '11:00 AM', engagement: '9.2%' },
                    { day: 'Wednesday', time: '2:00 PM', engagement: '7.8%' },
                    { day: 'Thursday', time: '10:00 AM', engagement: '8.9%' },
                    { day: 'Friday', time: '3:00 PM', engagement: '6.5%' },
                    { day: 'Saturday', time: '12:00 PM', engagement: '5.2%' },
                    { day: 'Sunday', time: '7:00 PM', engagement: '4.8%' }
                  ].map((item) => (
                    <div key={item.day} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.day}</p>
                        <p className="text-sm text-muted-foreground">{item.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{item.engagement}</p>
                        <p className="text-xs text-muted-foreground">avg engagement</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          {/* Content Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain size={20} />
                  Content Sentiment Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Positive', value: 65, fill: '#00C49F' },
                        { name: 'Neutral', value: 25, fill: '#FFBB28' },
                        { name: 'Negative', value: 10, fill: '#FF8042' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Positive', value: 65, fill: '#00C49F' },
                        { name: 'Neutral', value: 25, fill: '#FFBB28' },
                        { name: 'Negative', value: 10, fill: '#FF8042' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightning size={20} />
                  Hashtag Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { tag: '#marketing', score: 92, posts: 15 },
                    { tag: '#content', score: 87, posts: 12 },
                    { tag: '#socialmedia', score: 83, posts: 18 },
                    { tag: '#branding', score: 79, posts: 8 },
                    { tag: '#digital', score: 75, posts: 10 }
                  ].map((hashtag) => (
                    <div key={hashtag.tag} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-blue-600">{hashtag.tag}</p>
                        <p className="text-sm text-muted-foreground">{hashtag.posts} posts</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={hashtag.score} className="w-20" />
                        <span className="text-sm font-medium">{hashtag.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="competitive" className="space-y-6">
          {/* Competitive Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap size={20} />
                Competitive Benchmarking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Your Brand', followers: 12500, engagement: 8.5, posts: 45, growth: 15.2, isYou: true },
                  { name: 'Competitor A', followers: 15600, engagement: 6.2, posts: 52, growth: 12.8, isYou: false },
                  { name: 'Competitor B', followers: 9800, engagement: 9.1, posts: 38, growth: 18.5, isYou: false },
                  { name: 'Competitor C', followers: 18200, engagement: 5.8, posts: 64, growth: 8.9, isYou: false },
                  { name: 'Industry Avg', followers: 13500, engagement: 7.2, posts: 48, growth: 11.5, isYou: false }
                ].map((brand) => (
                  <div key={brand.name} className={`p-4 border rounded-lg ${brand.isYou ? 'border-primary bg-primary/5' : ''}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className={`font-medium ${brand.isYou ? 'text-primary' : ''}`}>
                          {brand.name}
                          {brand.isYou && <Badge className="ml-2">You</Badge>}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {brand.growth > 12 ? getTrendIcon('up') : brand.growth < 10 ? getTrendIcon('down') : getTrendIcon('stable')}
                        <span className="text-sm">{brand.growth}% growth</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Followers</p>
                        <p className="font-medium">{brand.followers.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Engagement Rate</p>
                        <p className="font-medium">{brand.engagement}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Posts/Month</p>
                        <p className="font-medium">{brand.posts}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Growth</p>
                        <p className="font-medium">{brand.growth}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}