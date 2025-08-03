import { useState } from 'react'
import { Post, Comment } from '@/types'
import { useComments } from '@/hooks/useData'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Send } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface CommentDialogProps {
  post: Post | null
  open: boolean
  onClose: () => void
}

export function CommentDialog({ post, open, onClose }: CommentDialogProps) {
  const [newComment, setNewComment] = useState('')
  const { comments, addComment } = useComments(post?.id)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !post) return

    addComment({
      postId: post.id,
      authorId: 'user-1', // Mock current user
      content: newComment.trim()
    })

    setNewComment('')
  }

  if (!post) return null

  // Group comments by thread (for future threading support)
  const rootComments = comments.filter(comment => !comment.parentId)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle size={20} />
            Comments
          </DialogTitle>
        </DialogHeader>

        {/* Post Preview */}
        <div className="border rounded-lg p-3 bg-muted/30 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">
              {post.platform}
            </Badge>
            <Badge 
              variant="secondary" 
              className={`text-xs ${
                post.status === 'approved' ? 'bg-green-100 text-green-700' :
                post.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                post.status === 'rejected' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}
            >
              {post.status}
            </Badge>
          </div>
          <p className="text-sm line-clamp-3">{post.content}</p>
        </div>

        {/* Comments List */}
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {rootComments.length > 0 ? (
              rootComments.map(comment => (
                <CommentItem key={comment.id} comment={comment} />
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                <div className="text-sm">No comments yet</div>
                <div className="text-xs">Be the first to leave feedback</div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Comment Form */}
        <form onSubmit={handleSubmit} className="flex gap-2 pt-4 border-t">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleSubmit(e)
              }
            }}
          />
          <Button 
            type="submit" 
            disabled={!newComment.trim()}
            className="self-end"
          >
            <Send size={16} />
          </Button>
        </form>

        <div className="text-xs text-muted-foreground">
          Press Cmd/Ctrl + Enter to submit
        </div>
      </DialogContent>
    </Dialog>
  )
}

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="flex gap-3">
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
        <AvatarFallback className="text-xs">
          {comment.author.name.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{comment.author.name}</span>
          <Badge variant="outline" className="text-xs">
            {comment.author.role}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        </div>
        
        <div className="text-sm bg-muted/50 rounded-lg p-3">
          {comment.content}
        </div>
      </div>
    </div>
  )
}

export default CommentDialog
