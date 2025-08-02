import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bell, MessageCircle, CheckCircle, XCircle, Clock, Eye } from '@phosphor-icons/react'
import { formatDistanceToNow } from 'date-fns'
import { useKV } from '@github/spark/hooks'

interface Notification {
  id: string
  type: 'comment' | 'approval' | 'status_change' | 'mention'
  title: string
  message: string
  postId?: string
  postTitle?: string
  fromUser: {
    name: string
    avatar?: string
  }
  createdAt: string
  read: boolean
}

const sampleNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'comment',
    title: 'New comment on your post',
    message: 'Sarah Chen commented: "Love the creative direction! Can we add more brand colors to the final slide?"',
    postId: 'post-2',
    postTitle: 'Behind the scenes of our creative process ✨',
    fromUser: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face'
    },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    read: false
  },
  {
    id: 'notif-2',
    type: 'approval',
    title: 'Post needs approval',
    message: 'Marcus Rodriguez submitted "Behind the scenes of our creative process ✨" for approval',
    postId: 'post-2',
    postTitle: 'Behind the scenes of our creative process ✨',
    fromUser: {
      name: 'Marcus Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    read: false
  },
  {
    id: 'notif-3',
    type: 'status_change',
    title: 'Post approved',
    message: 'Your LinkedIn post "🚀 Excited to announce our new product launch!" has been approved and is scheduled to publish',
    postId: 'post-1',
    postTitle: '🚀 Excited to announce our new product launch!',
    fromUser: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face'
    },
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    read: true
  },
  {
    id: 'notif-4',
    type: 'status_change',
    title: 'Post rejected',
    message: 'Your Facebook post "Celebrating our amazing team! 🎉" was rejected with feedback',
    postId: 'post-4',
    postTitle: 'Celebrating our amazing team! 🎉',
    fromUser: {
      name: 'Marcus Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    read: true
  },
  {
    id: 'notif-5',
    type: 'mention',
    title: 'You were mentioned',
    message: 'Emma Thompson mentioned you in a comment: "@sarah what do you think about this approach?"',
    postId: 'post-3',
    postTitle: 'Quick thread on content marketing best practices 🧵',
    fromUser: {
      name: 'Emma Thompson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    createdAt: new Date(Date.now() - 18000000).toISOString(),
    read: true
  }
]

const notificationIcons = {
  comment: MessageCircle,
  approval: Clock,
  status_change: CheckCircle,
  mention: Bell
}

const notificationColors = {
  comment: 'bg-blue-100 text-blue-700',
  approval: 'bg-amber-100 text-amber-700',
  status_change: 'bg-green-100 text-green-700',
  mention: 'bg-purple-100 text-purple-700'
}

interface NotificationSystemProps {
  onPostClick?: (postId: string) => void
}

export function NotificationSystem({ onPostClick }: NotificationSystemProps) {
  const [notifications, setNotifications] = useKV<Notification[]>('notifications', sampleNotifications)
  const [showAll, setShowAll] = useState(false)

  const markAsRead = (notificationId: string) => {
    setNotifications(current =>
      current.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(current =>
      current.map(notif => ({ ...notif, read: true }))
    )
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(current =>
      current.filter(notif => notif.id !== notificationId)
    )
  }

  const unreadCount = notifications.filter(n => !n.read).length
  const displayNotifications = showAll ? notifications : notifications.slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell size={20} />
            Notifications
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
            {notifications.length > 5 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAll(!showAll)}
                className="text-xs"
              >
                {showAll ? 'Show less' : `Show all (${notifications.length})`}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {displayNotifications.length > 0 ? (
              displayNotifications.map(notification => {
                const Icon = notificationIcons[notification.type]
                return (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border transition-all ${
                      !notification.read 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-background border-border hover:bg-muted/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarImage src={notification.fromUser.avatar} alt={notification.fromUser.name} />
                        <AvatarFallback className="text-xs">
                          {notification.fromUser.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={`${notificationColors[notification.type]} text-xs`}>
                            <Icon size={10} className="mr-1" />
                            {notification.type.replace('_', ' ')}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </span>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          )}
                        </div>
                        
                        <div className="font-medium text-sm mb-1">
                          {notification.title}
                        </div>
                        
                        <div className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {notification.message}
                        </div>
                        
                        {notification.postTitle && (
                          <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                            <div className="font-medium">Related post:</div>
                            <div className="line-clamp-1">{notification.postTitle}</div>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 mt-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs h-6"
                            >
                              <Eye size={12} className="mr-1" />
                              Mark read
                            </Button>
                          )}
                          {notification.postId && onPostClick && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                onPostClick(notification.postId!)
                                markAsRead(notification.id)
                              }}
                              className="text-xs h-6"
                            >
                              View post
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Bell size={48} className="mx-auto mb-4 opacity-50" />
                <div className="text-sm">No notifications yet</div>
                <div className="text-xs">You're all caught up!</div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}export default NotificationSystem
