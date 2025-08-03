import { Post } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Target, 
  Calendar,
  Users,
  MessageCircle,
  Heart,
  Share
} from 'lucide-react'
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'
import { useState } from 'react'

interface AnalyticsViewProps {
  posts: Post[]
}

// Mock analytics data - in a real app this would come from social media APIs
const mockAnalytics = {
  overview: {
    totalPosts: 45,
    totalEngagement: 12540,
    avgEngagementRate: 4.2,
    totalReach: 85600,
    growthRate: 15.8
  },
  platformStats: {
    instagram: { posts: 18, engagement: 5240, rate: 6.2 },
    linkedin: { posts: 12, engagement: 3890, rate: 3.8 },
    twitter: { posts: 10, engagement: 2410, rate: 2.9 },
    facebook: { posts: 5, engagement: 1000, rate: 2.1 }
  },
  weeklyEngagement: [
    { day: 'Mon', value: 1240 },
    { day: 'Tue', value: 980 },
    { day: 'Wed', value: 1580 },
    { day: 'Thu', value: 2100 },
    { day: 'Fri', value: 1890 },
    { day: 'Sat', value: 1450 },
    { day: 'Sun', value: 1180 }
  ],
  topPerformingPosts: [
    {
      id: 'post-1',
      content: '🚀 Excited to announce our new product launch!',
      platform: 'linkedin',
      engagement: 2450,
      rate: 8.9
    },
    {
      id: 'post-2',
      content: 'Behind the scenes of our creative process ✨',
      platform: 'instagram',
      engagement: 1890,
      rate: 7.2
    }
  ]
}

const platformColors = {
  instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
  twitter: 'bg-blue-500',
  linkedin: 'bg-blue-600',
  facebook: 'bg-blue-700'
}

const platformNames = {
  instagram: 'Instagram',
  twitter: 'Twitter',
  linkedin: 'LinkedIn',
  facebook: 'Facebook'
}

export function AnalyticsView({ posts }: AnalyticsViewProps) {
  const [timeRange, setTimeRange] = useState('7d')
  
  // Calculate real stats from posts data
  const postsByStatus = {
    draft: posts.filter(p => p.status === 'draft').length,
    pending: posts.filter(p => p.status === 'pending').length,
    approved: posts.filter(p => p.status === 'approved').length,
    rejected: posts.filter(p => p.status === 'rejected').length
  }

  const postsByPlatform = {
    instagram: posts.filter(p => p.platform === 'instagram').length,
    linkedin: posts.filter(p => p.platform === 'linkedin').length,
    twitter: posts.filter(p => p.platform === 'twitter').length,
    facebook: posts.filter(p => p.platform === 'facebook').length
  }

  const totalPosts = posts.length
  const approvalRate = totalPosts > 0 ? (postsByStatus.approved / totalPosts) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Performance insights and content metrics</p>
        </div>
        <div className="flex items-center gap-2">
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
          <Button variant="outline" size="sm">
            <Calendar size={16} className="mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
                <div className="text-2xl font-bold">{totalPosts}</div>
                <p className="text-xs text-muted-foreground">
                  {postsByStatus.approved} published
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approval Rate</p>
                <div className="text-2xl font-bold">{approvalRate.toFixed(1)}%</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp size={12} className="mr-1" />
                  +2.1% vs last period
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Engagement</p>
                <div className="text-2xl font-bold">{mockAnalytics.overview.totalEngagement.toLocaleString()}</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp size={12} className="mr-1" />
                  +{mockAnalytics.overview.growthRate}%
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
                <p className="text-sm font-medium text-muted-foreground">Avg. Engagement Rate</p>
                <div className="text-2xl font-bold">{mockAnalytics.overview.avgEngagementRate}%</div>
                <div className="flex items-center text-xs text-red-600">
                  <TrendingDown size={12} className="mr-1" />
                  -0.3% vs last period
                </div>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(mockAnalytics.platformStats).map(([platform, stats]) => (
                <div key={platform} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${platformColors[platform as keyof typeof platformColors]}`} />
                      <span className="font-medium">{platformNames[platform as keyof typeof platformNames]}</span>
                      <Badge variant="secondary" className="text-xs">
                        {postsByPlatform[platform as keyof typeof postsByPlatform]} posts
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stats.engagement.toLocaleString()} engagements
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={stats.rate * 10} className="flex-1" />
                    <span className="text-sm font-medium">{stats.rate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Content Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Draft</span>
                  <span className="text-sm text-muted-foreground">{postsByStatus.draft} posts</span>
                </div>
                <Progress value={(postsByStatus.draft / totalPosts) * 100} className="[&>div]:bg-gray-500" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Pending Review</span>
                  <span className="text-sm text-muted-foreground">{postsByStatus.pending} posts</span>
                </div>
                <Progress value={(postsByStatus.pending / totalPosts) * 100} className="[&>div]:bg-amber-500" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Approved</span>
                  <span className="text-sm text-muted-foreground">{postsByStatus.approved} posts</span>
                </div>
                <Progress value={(postsByStatus.approved / totalPosts) * 100} className="[&>div]:bg-green-500" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Rejected</span>
                  <span className="text-sm text-muted-foreground">{postsByStatus.rejected} posts</span>
                </div>
                <Progress value={(postsByStatus.rejected / totalPosts) * 100} className="[&>div]:bg-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Engagement Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 size={20} />
            Weekly Engagement Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-4">
              {mockAnalytics.weeklyEngagement.map((day, index) => {
                const maxValue = Math.max(...mockAnalytics.weeklyEngagement.map(d => d.value))
                const height = (day.value / maxValue) * 200
                
                return (
                  <div key={day.day} className="flex flex-col items-center">
                    <div className="flex-1 flex items-end mb-2" style={{ height: '200px' }}>
                      <div 
                        className="w-8 bg-primary rounded-t transition-all hover:bg-primary/80"
                        style={{ height: `${height}px` }}
                        title={`${day.day}: ${day.value} engagements`}
                      />
                    </div>
                    <div className="text-xs font-medium">{day.day}</div>
                    <div className="text-xs text-muted-foreground">{day.value}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp size={20} />
            Top Performing Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAnalytics.topPerformingPosts.map((post, index) => (
              <div key={post.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">#{index + 1}</span>
                </div>
                
                <div className="flex-1">
                  <div className="font-medium line-clamp-1">{post.content}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${platformColors[post.platform]}`} />
                    <span className="text-xs text-muted-foreground">
                      {platformNames[post.platform]}
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold">{post.engagement.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">
                    {post.rate}% engagement rate
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AnalyticsView
