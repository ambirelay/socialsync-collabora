import { useState, useEffect } from 'react'
import { Post, User } from '@/types.ts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageCircle, 
  Eye,
  Calendar,
  Share,
  Download,
  Star,
  ThumbsUp,
  ThumbsDown
} from '@phosphor-icons/react'
import { format, formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'

interface ClientPortalProps {
  posts: Post[]
  onApprovePost: (post: Post, feedback?: string) => void
  onRejectPost: (post: Post, feedback: string) => void
  onAddComment: (postId: string, comment: string) => void
}

interface ClientFeedback {
  id: string
  postId: string
  clientId: string
  rating: number
  feedback: string
  decision: 'approved' | 'rejected' | 'pending'
  createdAt: string
}

const mockClient: User = {
  id: 'client-1',
  name: 'Jennifer Walsh',
  email: 'jennifer@acmecorp.com',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
  role: 'viewer'
}

export function ClientPortal({ posts, onApprovePost, onRejectPost, onAddComment }: ClientPortalProps) {
  const [feedback, setFeedback] = useKV<ClientFeedback[]>('client-feedback', [])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [reviewFeedback, setReviewFeedback] = useState('')
  const [rating, setRating] = useState<number>(0)
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed'>('pending')

  // Filter posts for client view (only pending and approved posts)
  const clientPosts = posts.filter(post => 
    post.status === 'pending' || post.status === 'approved' || post.status === 'rejected'
  )

  const filteredPosts = clientPosts.filter(post => {
    if (filter === 'pending') return post.status === 'pending'
    if (filter === 'reviewed') return post.status === 'approved' || post.status === 'rejected'
    return true
  })

  const handleApprove = (post: Post) => {
    const newFeedback: ClientFeedback = {
      id: `feedback-${Date.now()}`,
      postId: post.id,
      clientId: mockClient.id,
      rating: rating || 5,
      feedback: reviewFeedback || 'Approved',
      decision: 'approved',
      createdAt: new Date().toISOString()
    }

    setFeedback(current => [...current, newFeedback])
    onApprovePost(post, reviewFeedback)
    setSelectedPost(null)
    setReviewFeedback('')
    setRating(0)
    toast.success('Post approved successfully')
  }

  const handleReject = (post: Post) => {
    if (!reviewFeedback.trim()) {
      toast.error('Please provide feedback for rejection')
      return
    }

    const newFeedback: ClientFeedback = {
      id: `feedback-${Date.now()}`,
      postId: post.id,
      clientId: mockClient.id,
      rating: rating || 1,
      feedback: reviewFeedback,
      decision: 'rejected',
      createdAt: new Date().toISOString()
    }

    setFeedback(current => [...current, newFeedback])
    onRejectPost(post, reviewFeedback)
    setSelectedPost(null)
    setReviewFeedback('')
    setRating(0)
    toast.success('Feedback submitted')
  }

  const handleAddComment = (postId: string) => {
    if (!reviewFeedback.trim()) return
    
    onAddComment(postId, reviewFeedback)
    setReviewFeedback('')
    toast.success('Comment added')
  }

  const getPostFeedback = (postId: string) => {
    return feedback.find(f => f.postId === postId)
  }

  const generateShareableLink = (post: Post) => {
    const baseUrl = window.location.origin
    const shareUrl = `${baseUrl}/client/post/${post.id}?token=preview`
    navigator.clipboard.writeText(shareUrl)
    toast.success('Shareable link copied to clipboard')
  }

  const exportReport = () => {
    const report = {
      client: mockClient.name,
      generatedAt: new Date().toISOString(),
      posts: filteredPosts.map(post => ({
        id: post.id,
        content: post.content,
        platform: post.platform,
        status: post.status,
        scheduledDate: post.scheduledDate,
        feedback: getPostFeedback(post.id)
      }))
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `content-review-${format(new Date(), 'yyyy-MM-dd')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Report exported successfully')
  }

  const StarRating = ({ value, onChange }: { value: number, onChange: (value: number) => void }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <Button
          key={star}
          variant="ghost"
          size="sm"
          onClick={() => onChange(star)}
          className="p-1 h-auto"
        >
          <Star
            size={20}
            className={star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        </Button>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Client Review Portal</h1>
          <p className="text-muted-foreground">Review and approve your content before publishing</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={mockClient.avatar} alt={mockClient.name} />
              <AvatarFallback>
                {mockClient.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <div className="font-medium">{mockClient.name}</div>
              <div className="text-muted-foreground">Client</div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={exportReport}>
            <Download size={16} className="mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <div className="text-2xl font-bold">
                  {clientPosts.filter(p => p.status === 'pending').length}
                </div>
              </div>
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock size={20} className="text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <div className="text-2xl font-bold text-green-600">
                  {clientPosts.filter(p => p.status === 'approved').length}
                </div>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle size={20} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                <div className="text-2xl font-bold text-red-600">
                  {clientPosts.filter(p => p.status === 'rejected').length}
                </div>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle size={20} className="text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Rating</p>
                <div className="text-2xl font-bold">
                  {feedback.length > 0 
                    ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
                    : '0.0'
                  }
                </div>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star size={20} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={filter} onValueChange={(value: 'all' | 'pending' | 'reviewed') => setFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Posts</SelectItem>
            <SelectItem value="pending">Pending Review</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="text-sm text-muted-foreground">
          Showing {filteredPosts.length} of {clientPosts.length} posts
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPosts.map(post => {
          const postFeedback = getPostFeedback(post.id)
          
          return (
            <Card key={post.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{post.platform}</Badge>
                    <Badge 
                      variant={
                        post.status === 'approved' ? 'default' :
                        post.status === 'rejected' ? 'destructive' :
                        'secondary'
                      }
                    >
                      {post.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => generateShareableLink(post)}
                    >
                      <Share size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPost(post)}
                    >
                      <Eye size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Content Preview */}
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed line-clamp-4">
                    {post.content}
                  </p>
                  
                  {post.mediaUrl && (
                    <div className="w-full h-48 bg-muted rounded-lg overflow-hidden">
                      <img 
                        src={post.mediaUrl} 
                        alt="Post media" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Schedule Info */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar size={14} />
                  <span>Scheduled: {format(new Date(post.scheduledDate), 'MMM d, yyyy h:mm a')}</span>
                </div>

                {/* Author */}
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={post.author.avatar} alt={post.author.name} />
                    <AvatarFallback className="text-xs">
                      {post.author.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    Created by {post.author.name}
                  </span>
                </div>

                {/* Previous Feedback */}
                {postFeedback && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        Your Review
                      </Badge>
                      <StarRating value={postFeedback.rating} onChange={() => {}} />
                    </div>
                    <p className="text-sm">{postFeedback.feedback}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(postFeedback.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                {post.status === 'pending' && !postFeedback && (
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Button
                      size="sm"
                      onClick={() => setSelectedPost(post)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Review
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddComment(post.id)}
                      disabled={!reviewFeedback.trim()}
                    >
                      <MessageCircle size={16} className="mr-2" />
                      Comment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Review Dialog */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Review Post</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPost(null)}
                >
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            
            <ScrollArea className="max-h-[60vh]">
              <CardContent className="space-y-4">
                {/* Post Content */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{selectedPost.platform}</Badge>
                    <span className="text-sm text-muted-foreground">
                      Scheduled: {format(new Date(selectedPost.scheduledDate), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedPost.content}
                    </p>
                    
                    {selectedPost.mediaUrl && (
                      <img 
                        src={selectedPost.mediaUrl} 
                        alt="Post media" 
                        className="w-full h-64 object-cover rounded-lg mt-3"
                      />
                    )}
                  </div>
                </div>

                {/* Rating */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rate this content:</label>
                  <StarRating value={rating} onChange={setRating} />
                </div>

                {/* Feedback */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Feedback:</label>
                  <Textarea
                    placeholder="Share your thoughts, suggestions, or concerns..."
                    value={reviewFeedback}
                    onChange={(e) => setReviewFeedback(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4">
                  <Button
                    onClick={() => handleApprove(selectedPost)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <ThumbsUp size={16} className="mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(selectedPost)}
                    variant="destructive"
                    className="flex-1"
                  >
                    <ThumbsDown size={16} className="mr-2" />
                    Request Changes
                  </Button>
                </div>
              </CardContent>
            </ScrollArea>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <div className="text-lg font-medium mb-2">No posts to review</div>
            <div>Check back later for new content to review</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientPortal
