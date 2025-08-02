import { useState, useEffect, useRef } from 'react'
import { Post, User, Comment } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  MessageCircle, 
  Users, 
  Send,
  Pencil,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AtSign,
  Reply,
  Heart,
  MoreHorizontal,
  Pin,
  Flag,
  Archive
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'
import { format } from 'date-fns'

interface RealtimeComment extends Comment {
  reactions: {
    userId: string
    type: 'like' | 'love' | 'laugh' | 'celebrate'
    createdAt: string
  }[]
  isResolved: boolean
  isPinned: boolean
  editHistory: {
    content: string
    editedAt: string
    editedBy: string
  }[]
}

interface ActiveUser {
  id: string
  name: string
  avatar?: string
  cursor?: {
    x: number
    y: number
  }
  isTyping: boolean
  lastSeen: string
}

interface RealtimeCollaborationProps {
  post: Post | null
  open: boolean
  onClose: () => void
}

const mockActiveUsers: ActiveUser[] = [
  {
    id: 'user-1',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    isTyping: false,
    lastSeen: new Date().toISOString()
  },
  {
    id: 'user-2', 
    name: 'Marcus Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    isTyping: true,
    lastSeen: new Date(Date.now() - 300000).toISOString()
  },
  {
    id: 'user-3',
    name: 'Emma Thompson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    isTyping: false,
    lastSeen: new Date(Date.now() - 600000).toISOString()
  }
]

const generateMockComments = (postId: string): RealtimeComment[] => [
  {
    id: 'comment-1',
    postId,
    authorId: 'user-1',
    author: {
      id: 'user-1',
      name: 'Sarah Chen',
      email: 'sarah@company.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
      role: 'admin'
    },
    content: 'This is looking great! I love the direction we\'re taking with the messaging. Could we maybe add a bit more emphasis on the community aspect? 🤔',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    reactions: [
      { userId: 'user-2', type: 'like', createdAt: new Date(Date.now() - 3000000).toISOString() },
      { userId: 'user-3', type: 'love', createdAt: new Date(Date.now() - 2400000).toISOString() }
    ],
    isResolved: false,
    isPinned: true,
    editHistory: []
  },
  {
    id: 'comment-2',
    postId,
    authorId: 'user-2',
    author: {
      id: 'user-2',
      name: 'Marcus Rodriguez',
      email: 'marcus@company.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      role: 'editor'
    },
    content: '@sarah Great point! I was thinking we could add a section about how our users collaborate and support each other. Maybe some user testimonials?',
    createdAt: new Date(Date.now() - 2700000).toISOString(),
    parentId: 'comment-1',
    mentions: ['user-1'],
    reactions: [
      { userId: 'user-1', type: 'celebrate', createdAt: new Date(Date.now() - 2400000).toISOString() }
    ],
    isResolved: false,
    isPinned: false,
    editHistory: []
  },
  {
    id: 'comment-3',
    postId,
    authorId: 'user-3',
    author: {
      id: 'user-3',
      name: 'Emma Thompson',
      email: 'emma@company.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      role: 'editor'
    },
    content: 'I have some great user stories from our recent survey that would be perfect for this! Should I add them to our content library?',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    parentId: 'comment-2',
    reactions: [
      { userId: 'user-1', type: 'like', createdAt: new Date(Date.now() - 1500000).toISOString() },
      { userId: 'user-2', type: 'like', createdAt: new Date(Date.now() - 1200000).toISOString() }
    ],
    isResolved: false,
    isPinned: false,
    editHistory: []
  },
  {
    id: 'comment-4',
    postId,
    authorId: 'user-1',
    author: {
      id: 'user-1',
      name: 'Sarah Chen',
      email: 'sarah@company.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
      role: 'admin'
    },
    content: 'Perfect! Yes, please add them. This is exactly what we need to make the post more authentic and relatable.',
    createdAt: new Date(Date.now() - 900000).toISOString(),
    parentId: 'comment-3',
    reactions: [],
    isResolved: true,
    isPinned: false,
    editHistory: []
  }
]

export function RealtimeCollaboration({ post, open, onClose }: RealtimeCollaborationProps) {
  const [comments, setComments] = useKV<RealtimeComment[]>('collaboration-comments', [])
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>(mockActiveUsers)
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [mentionSuggestions, setMentionSuggestions] = useState<User[]>([])
  const typingTimeoutRef = useRef<NodeJS.Timeout>()
  const commentsEndRef = useRef<HTMLDivElement>(null)

  // Load comments for the current post
  useEffect(() => {
    if (post) {
      const postComments = generateMockComments(post.id)
      setComments(postComments)
    }
  }, [post, setComments])

  // Auto-scroll to bottom when new comments are added
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [comments])

  // Simulate typing indicator
  const handleTyping = (content: string) => {
    setNewComment(content)
    
    if (!isTyping && content.length > 0) {
      setIsTyping(true)
    }
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
    }, 2000)
  }

  // Handle mention detection
  useEffect(() => {
    const lastWord = newComment.split(' ').pop()
    if (lastWord?.startsWith('@') && lastWord.length > 1) {
      // In a real app, this would search users
      const allUsers = activeUsers.map(u => ({
        id: u.id,
        name: u.name,
        email: `${u.name.toLowerCase().replace(' ', '.')}@company.com`,
        avatar: u.avatar,
        role: 'editor' as const
      }))
      setMentionSuggestions(allUsers)
    } else {
      setMentionSuggestions([])
    }
  }, [newComment, activeUsers])

  const handleSubmitComment = () => {
    if (!newComment.trim() || !post) return

    const currentUser = {
      id: 'current-user',
      name: 'You',
      email: 'you@company.com',
      avatar: undefined,
      role: 'admin' as const
    }

    const comment: RealtimeComment = {
      id: `comment-${Date.now()}`,
      postId: post.id,
      authorId: currentUser.id,
      author: currentUser,
      content: newComment,
      createdAt: new Date().toISOString(),
      parentId: replyTo || undefined,
      mentions: extractMentions(newComment),
      reactions: [],
      isResolved: false,
      isPinned: false,
      editHistory: []
    }

    setComments(current => [...current, comment])
    setNewComment('')
    setReplyTo(null)
    setIsTyping(false)
    toast.success('Comment added successfully')
  }

  const extractMentions = (content: string): string[] => {
    const mentionRegex = /@(\w+)/g
    const mentions = []
    let match
    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.push(match[1])
    }
    return mentions
  }

  const handleReaction = (commentId: string, reactionType: 'like' | 'love' | 'laugh' | 'celebrate') => {
    setComments(current =>
      current.map(comment => {
        if (comment.id === commentId) {
          const existingReaction = comment.reactions.find(r => r.userId === 'current-user')
          if (existingReaction) {
            // Remove reaction if same type, or update if different
            if (existingReaction.type === reactionType) {
              return {
                ...comment,
                reactions: comment.reactions.filter(r => r.userId !== 'current-user')
              }
            } else {
              return {
                ...comment,
                reactions: comment.reactions.map(r =>
                  r.userId === 'current-user'
                    ? { ...r, type: reactionType, createdAt: new Date().toISOString() }
                    : r
                )
              }
            }
          } else {
            // Add new reaction
            return {
              ...comment,
              reactions: [
                ...comment.reactions,
                {
                  userId: 'current-user',
                  type: reactionType,
                  createdAt: new Date().toISOString()
                }
              ]
            }
          }
        }
        return comment
      })
    )
  }

  const handleResolveComment = (commentId: string) => {
    setComments(current =>
      current.map(comment =>
        comment.id === commentId
          ? { ...comment, isResolved: !comment.isResolved }
          : comment
      )
    )
    toast.success('Comment status updated')
  }

  const handlePinComment = (commentId: string) => {
    setComments(current =>
      current.map(comment =>
        comment.id === commentId
          ? { ...comment, isPinned: !comment.isPinned }
          : comment
      )
    )
    toast.success('Comment pinned')
  }

  const renderComment = (comment: RealtimeComment, depth = 0) => {
    const replies = comments.filter(c => c.parentId === comment.id)
    const isReplying = replyTo === comment.id
    
    return (
      <div key={comment.id} className={`${depth > 0 ? 'ml-8 border-l-2 border-muted pl-4' : ''}`}>
        <div className={`flex gap-3 p-3 rounded-lg transition-colors ${comment.isPinned ? 'bg-blue-50 border border-blue-200' : 'hover:bg-muted/30'}`}>
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
            <AvatarFallback className="text-xs">
              {comment.author.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">{comment.author.name}</span>
              <Badge variant="secondary" className="text-xs">{comment.author.role}</Badge>
              {comment.isPinned && <Pin size={12} className="text-blue-600" />}
              {comment.isResolved && <CheckCircle size={12} className="text-green-600" />}
              <span className="text-xs text-muted-foreground">
                {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
              </span>
            </div>
            
            <div className="text-sm mb-2 whitespace-pre-wrap">
              {comment.content}
            </div>
            
            {/* Reactions */}
            {comment.reactions.length > 0 && (
              <div className="flex items-center gap-1 mb-2">
                {comment.reactions.map((reaction, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs cursor-pointer hover:bg-secondary/80"
                    onClick={() => handleReaction(comment.id, reaction.type)}
                  >
                    {reaction.type === 'like' && '👍'}
                    {reaction.type === 'love' && '❤️'}
                    {reaction.type === 'laugh' && '😄'}
                    {reaction.type === 'celebrate' && '🎉'}
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Actions */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <button
                onClick={() => handleReaction(comment.id, 'like')}
                className="hover:text-foreground flex items-center gap-1"
              >
                <Heart size={12} />
                React
              </button>
              <button
                onClick={() => setReplyTo(comment.id)}
                className="hover:text-foreground flex items-center gap-1"
              >
                <Reply size={12} />
                Reply
              </button>
              <button
                onClick={() => handleResolveComment(comment.id)}
                className="hover:text-foreground flex items-center gap-1"
              >
                {comment.isResolved ? <XCircle size={12} /> : <CheckCircle size={12} />}
                {comment.isResolved ? 'Unresolve' : 'Resolve'}
              </button>
              <button
                onClick={() => handlePinComment(comment.id)}
                className="hover:text-foreground flex items-center gap-1"
              >
                <Pin size={12} />
                {comment.isPinned ? 'Unpin' : 'Pin'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Reply form */}
        {isReplying && (
          <div className="ml-11 mt-2">
            <div className="flex gap-2">
              <Textarea
                placeholder={`Reply to ${comment.author.name}...`}
                value={newComment}
                onChange={(e) => handleTyping(e.target.value)}
                className="min-h-[60px] text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    handleSubmitComment()
                  }
                }}
              />
              <div className="flex flex-col gap-1">
                <Button size="sm" onClick={handleSubmitComment} disabled={!newComment.trim()}>
                  <Send size={14} />
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  setReplyTo(null)
                  setNewComment('')
                }}>
                  <XCircle size={14} />
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Render replies */}
        {replies.map(reply => renderComment(reply, depth + 1))}
      </div>
    )
  }

  if (!post) return null

  // Sort comments: pinned first, then by creation date
  const sortedComments = comments
    .filter(c => !c.parentId) // Only show top-level comments
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })

  const activeViewers = activeUsers.filter(u => u.id !== 'current-user')
  const typingUsers = activeUsers.filter(u => u.isTyping && u.id !== 'current-user')

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle size={20} />
              Collaboration: {post.platform} Post
            </DialogTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Users size={16} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {activeViewers.length} collaborating
                </span>
              </div>
              <div className="flex -space-x-2">
                {activeViewers.slice(0, 3).map(user => (
                  <Avatar key={user.id} className="w-6 h-6 border-2 border-background">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-xs">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {activeViewers.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                    +{activeViewers.length - 3}
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex gap-4 min-h-0">
          {/* Post Preview */}
          <div className="w-1/3 border-r pr-4">
            <div className="space-y-3">
              <div className="text-sm font-medium">Post Preview</div>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{post.platform}</Badge>
                      <Badge className={
                        post.status === 'approved' ? 'bg-green-100 text-green-700' :
                        post.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        post.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }>
                        {post.status}
                      </Badge>
                    </div>
                    <div className="text-sm whitespace-pre-wrap">
                      {post.content}
                    </div>
                    {post.mediaUrl && (
                      <div className="rounded border overflow-hidden">
                        <img src={post.mediaUrl} alt="Post media" className="w-full h-24 object-cover" />
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      Scheduled: {format(new Date(post.scheduledDate), 'MMM d, h:mm a')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Comments Section */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium">
                Comments ({comments.length})
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {typingUsers.length > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" />
                      <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                    <span>
                      {typingUsers.map(u => u.name).join(', ')} typing...
                    </span>
                  </div>
                )}
              </div>
            </div>

            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-3">
                {sortedComments.map(comment => renderComment(comment))}
                <div ref={commentsEndRef} />
              </div>
            </ScrollArea>

            {/* New Comment Form */}
            {!replyTo && (
              <div className="border-t pt-4 mt-4">
                <div className="flex gap-2">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Add a comment... Use @name to mention someone"
                      value={newComment}
                      onChange={(e) => handleTyping(e.target.value)}
                      className="min-h-[80px] text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                          handleSubmitComment()
                        }
                      }}
                    />
                    
                    {/* Mention Suggestions */}
                    {mentionSuggestions.length > 0 && (
                      <div className="mt-1 border rounded-md bg-popover shadow-md">
                        {mentionSuggestions.map(user => (
                          <button
                            key={user.id}
                            className="w-full px-3 py-2 text-left hover:bg-muted flex items-center gap-2 text-sm"
                            onClick={() => {
                              const words = newComment.split(' ')
                              words[words.length - 1] = `@${user.name.toLowerCase().replace(' ', '')}`
                              setNewComment(words.join(' ') + ' ')
                              setMentionSuggestions([])
                            }}
                          >
                            <Avatar className="w-5 h-5">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback className="text-xs">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            {user.name}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-xs text-muted-foreground">
                        Press Ctrl+Enter to send • Use @name to mention
                      </div>
                      <Button
                        size="sm"
                        onClick={handleSubmitComment}
                        disabled={!newComment.trim()}
                      >
                        <Send size={14} className="mr-1" />
                        Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}