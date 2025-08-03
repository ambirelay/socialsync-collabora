import { useState, useMemo } from 'react'
import { Post, Platform } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users,
  Calendar,
  Target,
  Award,
  Clock,
  MessageCircle,
  Share,
  Heart,
  Eye,
  Download,
  RefreshCw
} from '@phosphor-icons/react'
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from 'recharts'

interface AdvancedAnalyticsProps {
  posts: Post[]
}

interface AnalyticsData {
  date: string
  posts: number
  engagement: number
  reach: number
  clicks: number
  shares: number
  comments: number
  likes: number
}

interface PlatformPerformance {
  platform: Platform
  posts: number
  avgEngagement: number
  totalReach: number
  bestPerformingPost: Post | null
  engagement_rate: number
  growth: number
}

interface ContentTypePerformance {
  type: string
  count: number
  avgEngagement: number
  successRate: number
}

interface OptimalPostingTime {
  hour: number
  dayOfWeek: number
  averageEngagement: number
  postCount: number
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

// Mock analytics data - in a real app this would come from platform APIs
const generateAnalyticsData = (posts: Post[]): AnalyticsData[] => {
  const last30Days = eachDayOfInterval({
    start: subDays(new Date(), 30),
    end: new Date()
  })

  return last30Days.map(date => ({
    date: format(date, 'MMM dd'),
    posts: Math.floor(Math.random() * 5) + 1,
    engagement: Math.floor(Math.random() * 200) + 50,
    reach: Math.floor(Math.random() * 1000) + 200,
    clicks: Math.floor(Math.random() * 50) + 10,
    shares: Math.floor(Math.random() * 20) + 2,
    comments: Math.floor(Math.random() * 15) + 1,
    likes: Math.floor(Math.random() * 100) + 20
  }))
}

const generatePlatformData = (posts: Post[]): PlatformPerformance[] => {
  const platforms: Platform[] = ['instagram', 'twitter', 'linkedin', 'facebook']
  
  return platforms.map(platform => {
    const platformPosts = posts.filter(p => p.platform === platform)
    const bestPost = platformPosts.sort((a, b) => Math.random() - 0.5)[0] || null
    
    return {
      platform,
      posts: platformPosts.length,
      avgEngagement: Math.floor(Math.random() * 150) + 50,
      totalReach: Math.floor(Math.random() * 5000) + 1000,
      bestPerformingPost: bestPost,
      engagement_rate: Math.floor(Math.random() * 8) + 2,
      growth: Math.floor(Math.random() * 40) - 10 // Can be negative
    }
  })
}

const generateContentTypeData = (): ContentTypePerformance[] => {
  return [
    { type: 'Educational', count: 12, avgEngagement: 145, successRate: 78 },
    { type: 'Behind the Scenes', count: 8, avgEngagement: 189, successRate: 85 },
    { type: 'User Generated', count: 6, avgEngagement: 234, successRate: 92 },
    { type: 'Product Updates', count: 15, avgEngagement: 98, successRate: 65 },
    { type: 'Industry News', count: 9, avgEngagement: 112, successRate: 72 },
    { type: 'Team Spotlights', count: 5, avgEngagement: 167, successRate: 80 }
  ]
}

const generateOptimalTimes = (): OptimalPostingTime[] => {
  const times = []
  for (let day = 0; day < 7; day++) {
    for (let hour of [9, 12, 15, 18, 21]) {
      times.push({
        hour,
        dayOfWeek: day,
        averageEngagement: Math.floor(Math.random() * 200) + 50,
        postCount: Math.floor(Math.random() * 10) + 1
      })
    }
  }
  return times.sort((a, b) => b.averageEngagement - a.averageEngagement).slice(0, 10)
}

export function AdvancedAnalytics({ posts }: AdvancedAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [selectedMetric, setSelectedMetric] = useState<'engagement' | 'reach' | 'clicks'>('engagement')

  const analyticsData = useMemo(() => generateAnalyticsData(posts), [posts])
  const platformData = useMemo(() => generatePlatformData(posts), [posts])
  const contentTypeData = useMemo(() => generateContentTypeData(), [])
  const optimalTimes = useMemo(() => generateOptimalTimes(), [])

  // Calculate key metrics
  const totalPosts = posts.length
  const totalEngagement = analyticsData.reduce((sum, day) => sum + day.engagement, 0)
  const totalReach = analyticsData.reduce((sum, day) => sum + day.reach, 0)
  const averageEngagementRate = totalPosts > 0 ? (totalEngagement / totalPosts) : 0
  const engagementGrowth = 23.5 // Mock growth percentage

  const bestPerformingPlatform = platformData.reduce((best, current) => 
    current.avgEngagement > best.avgEngagement ? current : best
  )

  const getDayName = (dayNum: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[dayNum]
  }

  const getTimeString = (hour: number) => {
    return `${hour}:00`
  }

  const MetricCard = ({ title, value, subtitle, icon: Icon, trend = null, color = "text-primary" }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="text-2xl font-bold">{value}</div>
            {trend && (
              <div className={`flex items-center text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend > 0 ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                {Math.abs(trend)}% from last period
              </div>
            )}
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={`w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center ${color}`}>
            <Icon size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="text-primary" />
            Advanced Analytics
          </h1>
          <p className="text-muted-foreground">Deep insights into your content performance and audience engagement</p>
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
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Engagement"
          value={totalEngagement.toLocaleString()}
          icon={Heart}
          trend={23.5}
          color="text-red-600"
        />
        <MetricCard
          title="Total Reach"
          value={totalReach.toLocaleString()}
          icon={Eye}
          trend={15.2}
          color="text-blue-600"
        />
        <MetricCard
          title="Avg. Engagement Rate"
          value={`${averageEngagementRate.toFixed(1)}%`}
          icon={Target}
          trend={8.7}
          color="text-green-600"
        />
        <MetricCard
          title="Content Pieces"
          value={totalPosts.toString()}
          icon={BarChart3}
          subtitle="Published this period"
          color="text-purple-600"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="content">Content Types</TabsTrigger>
          <TabsTrigger value="timing">Optimal Timing</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Engagement Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="engagement" stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Post Performance Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Post Performance Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.slice(-7)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="likes" fill="#8884d8" />
                    <Bar dataKey="comments" fill="#82ca9d" />
                    <Bar dataKey="shares" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="platforms">
          <div className="space-y-6">
            {/* Platform Performance Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {platformData.map(platform => (
                    <div key={platform.platform} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium capitalize">{platform.platform}</span>
                        <Badge variant={platform.growth > 0 ? "default" : "destructive"}>
                          {platform.growth > 0 ? '+' : ''}{platform.growth}%
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Posts:</span>
                          <span>{platform.posts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Avg Engagement:</span>
                          <span>{platform.avgEngagement}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Reach:</span>
                          <span>{platform.totalReach.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Engagement Rate:</span>
                          <span>{platform.engagement_rate}%</span>
                        </div>
                      </div>
                      <Progress value={platform.engagement_rate * 10} className="mt-3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Platform Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Content Distribution by Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ platform, posts }) => `${platform}: ${posts}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="posts"
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content Type Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentTypeData.map(content => (
                  <div key={content.type} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{content.type}</span>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{content.count} posts</span>
                          <span>{content.avgEngagement} avg engagement</span>
                          <Badge variant={content.successRate > 80 ? "default" : content.successRate > 70 ? "secondary" : "destructive"}>
                            {content.successRate}% success
                          </Badge>
                        </div>
                      </div>
                      <Progress value={content.successRate} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timing">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Optimal Posting Times */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Times</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {optimalTimes.slice(0, 10).map((time, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">
                            {getDayName(time.dayOfWeek)} at {getTimeString(time.hour)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {time.postCount} posts analyzed
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{time.averageEngagement}</div>
                          <div className="text-sm text-muted-foreground">avg engagement</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Weekly Engagement Pattern */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Engagement Pattern</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={264}>
                  <LineChart data={[
                    { day: 'Mon', engagement: 120 },
                    { day: 'Tue', engagement: 145 },
                    { day: 'Wed', engagement: 189 },
                    { day: 'Thu', engagement: 167 },
                    { day: 'Fri', engagement: 198 },
                    { day: 'Sat', engagement: 89 },
                    { day: 'Sun', engagement: 76 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="engagement" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audience">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Audience Demographics */}
            <Card>
              <CardHeader>
                <CardTitle>Audience Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>25-34 years</span>
                      <span>42%</span>
                    </div>
                    <Progress value={42} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>35-44 years</span>
                      <span>28%</span>
                    </div>
                    <Progress value={28} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>18-24 years</span>
                      <span>19%</span>
                    </div>
                    <Progress value={19} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>45+ years</span>
                      <span>11%</span>
                    </div>
                    <Progress value={11} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Locations */}
            <Card>
              <CardHeader>
                <CardTitle>Top Audience Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { location: 'United States', percentage: 35 },
                    { location: 'United Kingdom', percentage: 18 },
                    { location: 'Canada', percentage: 12 },
                    { location: 'Australia', percentage: 9 },
                    { location: 'Germany', percentage: 8 },
                    { location: 'Other', percentage: 18 }
                  ].map(item => (
                    <div key={item.location} className="flex items-center justify-between">
                      <span>{item.location}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20">
                          <Progress value={item.percentage} className="h-2" />
                        </div>
                        <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdvancedAnalytics
