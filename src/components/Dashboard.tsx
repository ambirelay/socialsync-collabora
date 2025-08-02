import { useState } from 'react'
import { Post, Platform, PostStatus } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Users,
  CheckCircle,
  AlertCircle,
  Eye,
  MessageCircle,
  Zap,
  Target,
  BarChart3,
  Plus,
  Settings,
  Bell,
  ArrowRight
} from '@phosphor-icons/react'
import { format, isToday, isTomorrow, addDays, startOfWeek, endOfWeek } from 'date-fns'

interface DashboardProps {
  posts: Post[]
  onCreatePost: () => void
  onViewPost: (post: Post) => void
  onSwitchTab: (tab: string) => void
}

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ size: number }>
  color: string
  action: () => void
}

interface ActivityItem {
  id: string
  type: 'post_created' | 'post_approved' | 'comment_added' | 'post_scheduled'
  title: string
  description: string
  time: string
  user: {
    name: string
    avatar?: string
  }
  relatedPost?: Post
}

const mockActivity: ActivityItem[] = [
  {
    id: 'activity-1',
    type: 'post_approved',
    title: 'Post approved',
    description: 'LinkedIn post about product launch has been approved',
    time: new Date(Date.now() - 1800000).toISOString(),
    user: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face'
    }
  },
  {
    id: 'activity-2',
    type: 'post_created',
    title: 'New post created',
    description: 'Instagram story about team celebration',
    time: new Date(Date.now() - 3600000).toISOString(),
    user: {
      name: 'Marcus Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    }
  },
  {
    id: 'activity-3',
    type: 'comment_added',
    title: 'Comment added',
    description: 'Feedback provided on Twitter thread draft',
    time: new Date(Date.now() - 7200000).toISOString(),
    user: {
      name: 'Emma Thompson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  }
]

export function Dashboard({ posts, onCreatePost, onViewPost, onSwitchTab }: DashboardProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'today' | 'week' | 'month'>('today')

  // Calculate dashboard metrics
  const totalPosts = posts.length
  const pendingPosts = posts.filter(p => p.status === 'pending')
  const approvedPosts = posts.filter(p => p.status === 'approved')
  const scheduledToday = posts.filter(p => isToday(new Date(p.scheduledDate)))
  const scheduledTomorrow = posts.filter(p => isTomorrow(new Date(p.scheduledDate)))
  
  // Platform distribution
  const platformStats = {
    instagram: posts.filter(p => p.platform === 'instagram').length,
    linkedin: posts.filter(p => p.platform === 'linkedin').length,
    twitter: posts.filter(p => p.platform === 'twitter').length,
    facebook: posts.filter(p => p.platform === 'facebook').length
  }

  // Approval rate
  const approvalRate = totalPosts > 0 ? (approvedPosts.length / totalPosts) * 100 : 0

  // Weekly progress
  const weekStart = startOfWeek(new Date())
  const weekEnd = endOfWeek(new Date())
  const postsThisWeek = posts.filter(p => {
    const postDate = new Date(p.createdAt)
    return postDate >= weekStart && postDate <= weekEnd
  })

  const quickActions: QuickAction[] = [
    {
      id: 'create-post',
      title: 'Create Post',
      description: 'Start a new social media post',
      icon: Plus,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: onCreatePost
    },
    {
      id: 'view-calendar',
      title: 'View Calendar',
      description: 'See your content schedule',
      icon: Calendar,
      color: 'bg-green-600 hover:bg-green-700',
      action: () => onSwitchTab('calendar')
    },
    {
      id: 'ai-assistant',
      title: 'AI Assistant',
      description: 'Generate content with AI',
      icon: Zap,
      color: 'bg-purple-600 hover:bg-purple-700',
      action: () => onSwitchTab('ai-assistant')
    },
    {
      id: 'analytics',
      title: 'View Analytics',
      description: 'Check performance metrics',
      icon: BarChart3,
      color: 'bg-amber-600 hover:bg-amber-700',
      action: () => onSwitchTab('analytics')
    }
  ]

  const upcomingPosts = posts
    .filter(p => new Date(p.scheduledDate) > new Date())
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
    .slice(0, 5)

  const recentPosts = posts
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  const activityIcons = {
    post_created: Plus,
    post_approved: CheckCircle,
    comment_added: MessageCircle,
    post_scheduled: Clock
  }

  const activityColors = {
    post_created: 'text-blue-600',
    post_approved: 'text-green-600',
    comment_added: 'text-purple-600',
    post_scheduled: 'text-amber-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your content.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings size={16} className="mr-2" />
            Settings
          </Button>
          <Button onClick={onCreatePost}>
            <Plus size={16} className="mr-2" />
            New Post
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
                <div className="text-2xl font-bold">{totalPosts}</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp size={12} className="mr-1" />
                  +12% from last week
                </div>
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
                <p className="text-sm font-medium text-muted-foreground">Pending Approval</p>
                <div className="text-2xl font-bold">{pendingPosts.length}</div>
                {pendingPosts.length > 0 && (
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto text-xs"
                    onClick={() => onSwitchTab('feed')}
                  >
                    Review now
                  </Button>
                )}
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock size={24} className="text-amber-600" />
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
                  +5.2% improvement
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
                <p className="text-sm font-medium text-muted-foreground">Scheduled Today</p>
                <div className="text-2xl font-bold">{scheduledToday.length}</div>
                <p className="text-xs text-muted-foreground">
                  {scheduledTomorrow.length} tomorrow
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar size={24} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map(action => {
                const Icon = action.icon
                return (
                  <Button
                    key={action.id}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2"
                    onClick={action.action}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-sm">{action.title}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Platform Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(platformStats).map(([platform, count]) => (
                <div key={platform} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="capitalize font-medium">{platform}</span>
                    <span className="text-sm text-muted-foreground">{count} posts</span>
                  </div>
                  <Progress value={(count / totalPosts) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockActivity.map(activity => {
                const Icon = activityIcons[activity.type]
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center ${activityColors[activity.type]}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{activity.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(activity.time), 'h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Avatar className="w-4 h-4">
                          <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                          <AvatarFallback className="text-xs">
                            {activity.user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{activity.user.name}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Posts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Posts</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSwitchTab('calendar')}
              >
                View all
                <ArrowRight size={14} className="ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingPosts.length > 0 ? (
                upcomingPosts.map(post => (
                  <div
                    key={post.id}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => onViewPost(post)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {post.platform}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(post.scheduledDate), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <div className="text-sm line-clamp-2">{post.content}</div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        post.status === 'approved' ? 'bg-green-100 text-green-700' :
                        post.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                      }
                    >
                      {post.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                  <div className="text-sm">No upcoming posts</div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={onCreatePost}
                  >
                    Create your first post
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Posts</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSwitchTab('feed')}
              >
                View all
                <ArrowRight size={14} className="ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPosts.length > 0 ? (
                recentPosts.map(post => (
                  <div
                    key={post.id}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => onViewPost(post)}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={post.author.avatar} alt={post.author.name} />
                      <AvatarFallback className="text-xs">
                        {post.author.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {post.platform}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(post.updatedAt), 'MMM d')}
                        </span>
                      </div>
                      <div className="text-sm line-clamp-2">{post.content}</div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        post.status === 'approved' ? 'bg-green-100 text-green-700' :
                        post.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        post.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }
                    >
                      {post.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
                  <div className="text-sm">No posts yet</div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={onCreatePost}
                  >
                    Create your first post
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle>This Week's Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {Array.from({ length: 7 }, (_, i) => {
              const date = addDays(weekStart, i)
              const dayPosts = postsThisWeek.filter(p => 
                format(new Date(p.createdAt), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
              )
              const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
              
              return (
                <div key={i} className="text-center">
                  <div className={`text-sm font-medium mb-2 ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                    {format(date, 'EEE')}
                  </div>
                  <div className={`text-xs mb-2 ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                    {format(date, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayPosts.slice(0, 3).map(post => (
                      <div
                        key={post.id}
                        className="w-full h-2 bg-primary/20 rounded cursor-pointer hover:bg-primary/40 transition-colors"
                        title={post.content.slice(0, 50) + '...'}
                        onClick={() => onViewPost(post)}
                      />
                    ))}
                    {dayPosts.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayPosts.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}