import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Users, 
  MessageCircle, 
  Eye, 
  Edit3, 
  CheckCircle, 
  XCircle,
  Clock,
  Bell,
  Plus,
  Send,
  AtSign
} from '@phosphor-icons/react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'

interface CollaboratorStatus {
  id: string
  name: string
  avatar?: string
  status: 'online' | 'offline' | 'idle'
  currentPage?: string
  lastSeen: string
}

interface LiveComment {
  id: string
  postId: string
  authorId: string
  authorName: string
  authorAvatar?: string
  content: string
  timestamp: string
  mentions: string[]
  resolved: boolean
  position?: { x: number; y: number }
}

interface CollaborationActivity {
  id: string
  type: 'edit' | 'comment' | 'approve' | 'reject' | 'schedule'
  userId: string
  userName: string
  userAvatar?: string
  description: string
  timestamp: string
  postId?: string
}

const mockCollaborators: CollaboratorStatus[] = [
  {
    id: 'user-1',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    status: 'online',
    currentPage: 'Calendar',
    lastSeen: new Date().toISOString()
  },
  {
    id: 'user-2',
    name: 'Marcus Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    status: 'online',
    currentPage: 'Feed View',
    lastSeen: new Date(Date.now() - 300000).toISOString()
  },
  {
    id: 'user-3',
    name: 'Emma Thompson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    status: 'idle',
    currentPage: 'Analytics',
    lastSeen: new Date(Date.now() - 600000).toISOString()
  },
  {
    id: 'user-4',
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    status: 'offline',
    lastSeen: new Date(Date.now() - 7200000).toISOString()
  }
]

const mockActivities: CollaborationActivity[] = [
  {
    id: 'activity-1',
    type: 'comment',
    userId: 'user-2',
    userName: 'Marcus Rodriguez',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    description: 'Added a comment on "Product Launch Post"',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    postId: 'post-1'
  },
  {
    id: 'activity-2',
    type: 'approve',
    userId: 'user-1',
    userName: 'Sarah Chen',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    description: 'Approved "Monday Motivation" for LinkedIn',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    postId: 'post-5'
  },
  {
    id: 'activity-3',
    type: 'edit',
    userId: 'user-3',
    userName: 'Emma Thompson',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    description: 'Edited "Twitter Thread" content',
    timestamp: new Date(Date.now() - 900000).toISOString(),
    postId: 'post-3'
  }
]

export function CollaborationSystem() {
  const [collaborators] = useKV<CollaboratorStatus[]>('collaborators', mockCollaborators)
  const [activities] = useKV<CollaborationActivity[]>('activities', mockActivities)
  const [liveComments, setLiveComments] = useKV<LiveComment[]>('liveComments', [])
  const [newComment, setNewComment] = useState('')
  const [mentionSuggestions, setMentionSuggestions] = useState<CollaboratorStatus[]>([])

  const onlineCollaborators = collaborators.filter(c => c.status === 'online')
  const totalCollaborators = collaborators.length

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const mentions = extractMentions(newComment)
    const comment: LiveComment = {
      id: `comment-${Date.now()}`,
      postId: 'current-post',
      authorId: 'current-user',
      authorName: 'You',
      content: newComment,
      timestamp: new Date().toISOString(),
      mentions,
      resolved: false
    }

    setLiveComments(prev => [...prev, comment])
    setNewComment('')
    
    // Notify mentioned users
    mentions.forEach(mentionId => {
      const user = collaborators.find(c => c.id === mentionId)
      if (user) {
        toast.info(`Mentioned ${user.name} in comment`)
      }
    })
  }

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+)/g
    const mentions = []
    let match
    while ((match = mentionRegex.exec(text)) !== null) {
      const mentionedUser = collaborators.find(c => 
        c.name.toLowerCase().includes(match[1].toLowerCase())
      )
      if (mentionedUser) {
        mentions.push(mentionedUser.id)
      }
    }
    return mentions
  }

  const handleMention = (text: string) => {
    const lastAtIndex = text.lastIndexOf('@')
    if (lastAtIndex !== -1) {
      const query = text.slice(lastAtIndex + 1).toLowerCase()
      const suggestions = collaborators.filter(c =>
        c.name.toLowerCase().includes(query)
      )
      setMentionSuggestions(suggestions)
    } else {
      setMentionSuggestions([])
    }
  }

  const insertMention = (user: CollaboratorStatus) => {
    const lastAtIndex = newComment.lastIndexOf('@')
    const beforeMention = newComment.slice(0, lastAtIndex)
    const afterMention = newComment.slice(newComment.indexOf(' ', lastAtIndex) + 1) || ''
    setNewComment(`${beforeMention}@${user.name} ${afterMention}`.trim())
    setMentionSuggestions([])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'idle': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'edit': return <Edit3 size={16} className="text-blue-500" />
      case 'comment': return <MessageCircle size={16} className="text-purple-500" />
      case 'approve': return <CheckCircle size={16} className="text-green-500" />
      case 'reject': return <XCircle size={16} className="text-red-500" />
      case 'schedule': return <Clock size={16} className="text-orange-500" />
      default: return <Bell size={16} />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Team Collaboration</h2>
          <p className="text-muted-foreground">
            {onlineCollaborators.length} of {totalCollaborators} team members online
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Plus size={16} className="mr-2" />
            Invite Member
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Online Collaborators */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={20} />
              Online Now
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {onlineCollaborators.map(collaborator => (
                <div key={collaborator.id} className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                      <AvatarFallback>
                        {collaborator.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(collaborator.status)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{collaborator.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {collaborator.currentPage && (
                        <span className="inline-flex items-center gap-1">
                          <Eye size={12} />
                          {collaborator.currentPage}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
              
              {onlineCollaborators.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No team members online
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Live Comments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle size={20} />
              Live Comments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64 mb-4">
              <div className="space-y-2">
                {liveComments.map(comment => (
                  <div key={comment.id} className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={comment.authorAvatar} alt={comment.authorName} />
                        <AvatarFallback className="text-xs">
                          {comment.authorName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium">{comment.authorName}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(comment.timestamp), 'HH:mm')}
                          </span>
                        </div>
                        <p className="text-xs text-foreground">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="relative">
              <Textarea
                placeholder="Add a comment... (@mention team members)"
                value={newComment}
                onChange={(e) => {
                  setNewComment(e.target.value)
                  handleMention(e.target.value)
                }}
                className="pr-12 text-xs"
                rows={2}
              />
              <Button
                size="sm"
                onClick={handleAddComment}
                className="absolute bottom-2 right-2 h-6 w-6 p-0"
                disabled={!newComment.trim()}
              >
                <Send size={12} />
              </Button>
              
              {/* Mention Suggestions */}
              {mentionSuggestions.length > 0 && (
                <Card className="absolute bottom-full left-0 right-0 mb-1 z-10">
                  <CardContent className="p-2">
                    {mentionSuggestions.map(user => (
                      <Button
                        key={user.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => insertMention(user)}
                        className="w-full justify-start text-xs"
                      >
                        <Avatar className="w-4 h-4 mr-2">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="text-xs">
                            {user.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        {user.name}
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell size={20} />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {activities.map((activity, index) => (
                  <div key={activity.id}>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Avatar className="w-5 h-5">
                            <AvatarImage src={activity.userAvatar} alt={activity.userName} />
                            <AvatarFallback className="text-xs">
                              {activity.userName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium">{activity.userName}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(activity.timestamp), 'MMM d, HH:mm')}
                        </p>
                      </div>
                    </div>
                    {index < activities.length - 1 && <Separator className="mt-3" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Team Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Team Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {collaborators.filter(c => c.status === 'online').length}
              </div>
              <div className="text-sm text-muted-foreground">Online</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {collaborators.filter(c => c.status === 'idle').length}
              </div>
              <div className="text-sm text-muted-foreground">Idle</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {collaborators.filter(c => c.status === 'offline').length}
              </div>
              <div className="text-sm text-muted-foreground">Offline</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {liveComments.length}
              </div>
              <div className="text-sm text-muted-foreground">Active Comments</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}