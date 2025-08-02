import { useState } from 'react'
import { Post, Platform } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Target,
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Share,
  Star,
  Award,
  Users,
  Hash,
  Image as ImageIcon,
  Video,
  FileText,
  Globe
} from '@phosphor-icons/react'
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns'

interface ContentInsight {
  id: string
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  category: 'engagement' | 'reach' | 'timing' | 'content'
  actionable: boolean
  recommendation?: string
}

interface PerformanceMetric {
  platform: Platform
  metric: string
  value: number
  change: number
  trend: 'up' | 'down' | 'stable'
  benchmark: number
}

interface ContentAnalysis {
  postId: string
  engagement: {
    likes: number
    comments: number
    shares: number
    views: number
    saves: number
    clickThroughRate: number
  }
  sentiment: {
    positive: number
    neutral: number
    negative: number
  }
  demographics: {
    ageGroups: { [key: string]: number }
    locations: { [key: string]: number }
    interests: string[]
  }
  optimalTiming: {
    bestHour: number
    bestDay: string
    timezone: string
  }
}

interface ContentPerformanceInsightsProps {
  posts: Post[]
}

const sampleInsights: ContentInsight[] = [
  {
    id: 'insight-1',
    title: 'LinkedIn posts perform 34% better with questions',
    description: 'Posts that end with a question generate significantly more engagement',
    impact: 'high',
    category: 'engagement',
    actionable: true,
    recommendation: 'Add thought-provoking questions to your LinkedIn posts to boost engagement'
  },
  {
    id: 'insight-2',
    title: 'Tuesday 2PM is your optimal posting time',
    description: 'Your audience is most active on Tuesday afternoons',
    impact: 'medium',
    category: 'timing',
    actionable: true,
    recommendation: 'Schedule more content for Tuesday 2-4 PM to maximize reach'
  },
  {
    id: 'insight-3',
    title: 'Behind-the-scenes content drives 2x engagement',
    description: 'Authentic, behind-the-scenes posts outperform promotional content',
    impact: 'high',
    category: 'content',
    actionable: true,
    recommendation: 'Create more behind-the-scenes content showing your team and process'
  },
  {
    id: 'insight-4',
    title: 'Video content has 67% higher completion rates',
    description: 'Video posts are watched to completion more often than other formats',
    impact: 'medium',
    category: 'content',
    actionable: true,
    recommendation: 'Incorporate more video content in your strategy'
  }
]

const mockMetrics: PerformanceMetric[] = [
  {
    platform: 'linkedin',
    metric: 'Engagement Rate',
    value: 4.2,
    change: 0.8,
    trend: 'up',
    benchmark: 3.5
  },
  {
    platform: 'instagram',
    metric: 'Reach',
    value: 12540,
    change: -5.2,
    trend: 'down',
    benchmark: 15000
  },
  {
    platform: 'twitter',
    metric: 'Click Rate',
    value: 2.1,
    change: 0.3,
    trend: 'up',
    benchmark: 1.9
  },
  {
    platform: 'facebook',
    metric: 'Shares',
    value: 89,
    change: 12.5,
    trend: 'up',
    benchmark: 75
  }
]

const platformColors = {
  instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
  twitter: 'bg-blue-500',
  linkedin: 'bg-blue-600',
  facebook: 'bg-blue-700'
}

const insightIcons = {
  engagement: Heart,
  reach: Users,
  timing: Calendar,
  content: FileText
}

const impactColors = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-green-100 text-green-700 border-green-200'
}

export function ContentPerformanceInsights({ posts }: ContentPerformanceInsightsProps) {
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all')
  const [activeTab, setActiveTab] = useState('insights')

  // Calculate performance metrics
  const totalPosts = posts.length
  const approvedPosts = posts.filter(p => p.status === 'approved').length
  const postsWithMedia = posts.filter(p => p.mediaUrl).length
  const avgApprovalTime = 2.5 // hours - mock data

  const topPerformingPosts = posts
    .filter(p => p.status === 'approved')
    .slice(0, 5)
    .map(post => ({
      ...post,
      engagementScore: Math.floor(Math.random() * 100) + 50, // mock engagement
      reach: Math.floor(Math.random() * 5000) + 1000, // mock reach
      comments: Math.floor(Math.random() * 50) + 5 // mock comments
    }))

  const contentTypeAnalysis = {
    text: posts.filter(p => !p.mediaUrl).length,
    image: posts.filter(p => p.mediaUrl && p.mediaType === 'image').length,
    video: posts.filter(p => p.mediaUrl && p.mediaType === 'video').length
  }

  const platformDistribution = {
    instagram: posts.filter(p => p.platform === 'instagram').length,
    linkedin: posts.filter(p => p.platform === 'linkedin').length,
    twitter: posts.filter(p => p.platform === 'twitter').length,
    facebook: posts.filter(p => p.platform === 'facebook').length
  }

  const weeklyPostCount = [
    { week: 'Week 1', count: 8 },
    { week: 'Week 2', count: 12 },
    { week: 'Week 3', count: 15 },
    { week: 'Week 4', count: 10 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 size={32} className="text-purple-600" />
            Performance Insights
          </h1>
          <p className="text-muted-foreground">AI-powered insights to optimize your content strategy</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPlatform} onValueChange={(value: Platform | 'all') => setSelectedPlatform(value)}>
            <SelectTrigger className="w-[140px]">
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
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
                <div className="text-2xl font-bold">{totalPosts}</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp size={12} className="mr-1" />
                  +15% vs last period
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Engagement</p>
                <div className="text-2xl font-bold">4.2%</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp size={12} className="mr-1" />
                  +0.8% vs benchmark
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Heart size={24} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reach</p>
                <div className="text-2xl font-bold">45.2K</div>
                <div className="flex items-center text-xs text-red-600">
                  <TrendingDown size={12} className="mr-1" />
                  -2.1% vs last period
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Globe size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approval Time</p>
                <div className="text-2xl font-bold">{avgApprovalTime}h</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp size={12} className="mr-1" />
                  23% faster
                </div>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Target size={24} className="text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="content">Content Analysis</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {sampleInsights.map(insight => {
              const Icon = insightIcons[insight.category]
              return (
                <Card key={insight.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Icon size={20} className="text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{insight.title}</CardTitle>
                        </div>
                      </div>
                      <Badge className={impactColors[insight.impact]}>
                        {insight.impact} impact
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {insight.description}
                    </p>
                    {insight.recommendation && (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start gap-2">
                          <Star size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-blue-900 text-sm mb-1">
                              Recommendation
                            </div>
                            <div className="text-sm text-blue-700">
                              {insight.recommendation}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Platform Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockMetrics.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${platformColors[metric.platform]}`} />
                          <span className="font-medium capitalize">{metric.platform}</span>
                          <span className="text-sm text-muted-foreground">- {metric.metric}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">
                            {typeof metric.value === 'number' && metric.value > 100 
                              ? metric.value.toLocaleString() 
                              : `${metric.value}${metric.metric.includes('Rate') ? '%' : ''}`
                            }
                          </span>
                          <div className={`flex items-center text-xs ${
                            metric.trend === 'up' ? 'text-green-600' :
                            metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {metric.trend === 'up' ? <TrendingUp size={12} /> :
                             metric.trend === 'down' ? <TrendingDown size={12} /> : null}
                            <span className="ml-1">
                              {metric.change > 0 ? '+' : ''}{metric.change}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <Progress 
                        value={(metric.value / metric.benchmark) * 100} 
                        className="h-2"
                      />
                      <div className="text-xs text-muted-foreground">
                        Benchmark: {metric.benchmark}{metric.metric.includes('Rate') ? '%' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

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
                  {topPerformingPosts.map((post, index) => (
                    <div key={post.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        #{index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {post.platform}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {post.engagementScore}% engagement
                          </span>
                        </div>
                        <div className="text-sm line-clamp-2">
                          {post.content}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye size={12} />
                            {post.reach}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle size={12} />
                            {post.comments}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Content Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Content Type Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-blue-600" />
                        <span>Text Only</span>
                      </div>
                      <span className="font-medium">{contentTypeAnalysis.text}</span>
                    </div>
                    <Progress value={(contentTypeAnalysis.text / totalPosts) * 100} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageIcon size={16} className="text-green-600" />
                        <span>With Images</span>
                      </div>
                      <span className="font-medium">{contentTypeAnalysis.image}</span>
                    </div>
                    <Progress value={(contentTypeAnalysis.image / totalPosts) * 100} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Video size={16} className="text-purple-600" />
                        <span>With Videos</span>
                      </div>
                      <span className="font-medium">{contentTypeAnalysis.video}</span>
                    </div>
                    <Progress value={(contentTypeAnalysis.video / totalPosts) * 100} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(platformDistribution).map(([platform, count]) => (
                    <div key={platform} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${platformColors[platform as Platform]}`} />
                          <span className="capitalize">{platform}</span>
                        </div>
                        <span className="font-medium">{count}</span>
                      </div>
                      <Progress value={(count / totalPosts) * 100} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Publishing Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {weeklyPostCount.map((week, index) => {
                  const maxCount = Math.max(...weeklyPostCount.map(w => w.count))
                  const height = (week.count / maxCount) * 100
                  
                  return (
                    <div key={week.week} className="text-center">
                      <div className="mb-2 flex items-end justify-center" style={{ height: '100px' }}>
                        <div 
                          className="w-12 bg-primary rounded-t transition-all"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <div className="text-sm font-medium">{week.week}</div>
                      <div className="text-xs text-muted-foreground">{week.count} posts</div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Optimization Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target size={20} />
                  Optimization Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Optimize Posting Schedule</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Your audience is most active on Tuesday 2-4 PM
                        </p>
                        <Button size="sm" variant="outline">
                          Apply Schedule
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Hash size={16} className="text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Improve Hashtag Strategy</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Add 3-5 trending hashtags to increase reach by 25%
                        </p>
                        <Button size="sm" variant="outline">
                          Get Hashtags
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Video size={16} className="text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Increase Video Content</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Video posts get 67% more engagement than text posts
                        </p>
                        <Button size="sm" variant="outline">
                          Create Video
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* A/B Testing Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle>A/B Testing Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border">
                    <h4 className="font-medium mb-2">Test Call-to-Action Placement</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Compare CTAs at the beginning vs. end of posts
                    </p>
                    <div className="flex items-center gap-2">
                      <Button size="sm">Start Test</Button>
                      <span className="text-xs text-muted-foreground">
                        Estimated impact: +15% CTR
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border">
                    <h4 className="font-medium mb-2">Test Post Length</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Compare short (under 100 chars) vs. long-form content
                    </p>
                    <div className="flex items-center gap-2">
                      <Button size="sm">Start Test</Button>
                      <span className="text-xs text-muted-foreground">
                        Suggested duration: 2 weeks
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg border">
                    <h4 className="font-medium mb-2">Test Visual Styles</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Compare bright vs. muted color palettes in images
                    </p>
                    <div className="flex items-center gap-2">
                      <Button size="sm">Start Test</Button>
                      <span className="text-xs text-muted-foreground">
                        Estimated impact: +8% engagement
                      </span>
                    </div>
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