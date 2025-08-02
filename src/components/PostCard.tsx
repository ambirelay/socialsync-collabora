import { Post, Platform } from '@/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Calendar, MessageCircle, Eye, CheckCircle, Clock, XCircle, Send } from '@phosphor-icons/react'
import { format } from 'date-fns'

interface PostCardProps {
  post: Post
  onEdit?: (post: Post) => void
  onComment?: (post: Post) => void
  onApprove?: (post: Post) => void
  onReject?: (post: Post) => void
  onSubmitForApproval?: (post: Post) => void
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

const statusConfig = {
  draft: { color: 'bg-gray-500', icon: Clock, label: 'Draft' },
  pending: { color: 'bg-amber-500', icon: Clock, label: 'Pending Review' },
  approved: { color: 'bg-green-500', icon: CheckCircle, label: 'Approved' },
  rejected: { color: 'bg-red-500', icon: XCircle, label: 'Rejected' }
}

export function PostCard({ post, onEdit, onComment, onApprove, onReject, onSubmitForApproval }: PostCardProps) {
  const status = statusConfig[post.status]
  const StatusIcon = status.icon
  const currentUser = { role: 'admin' } // Mock current user role

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${platformColors[post.platform]}`} />
            <span className="text-sm font-medium text-muted-foreground">
              {platformNames[post.platform]}
            </span>
          </div>
          <Badge variant="secondary" className={`${status.color} text-white`}>
            <StatusIcon size={12} className="mr-1" />
            {status.label}
          </Badge>
        </div>

        {/* Content Preview */}
        <div className="space-y-2">
          <p className="text-sm leading-relaxed line-clamp-3">
            {post.content}
          </p>
          {post.mediaUrl && (
            <div className="w-full h-32 bg-muted rounded-md flex items-center justify-center">
              <img 
                src={post.mediaUrl} 
                alt="Post media" 
                className="max-w-full max-h-full object-cover rounded-md"
              />
            </div>
          )}
        </div>

        {/* Schedule Info */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar size={14} />
          <span>{format(new Date(post.scheduledDate), 'MMM d, yyyy h:mm a')}</span>
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
            {post.author.name}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(post)}
                className="text-xs"
              >
                <Eye size={14} className="mr-1" />
                Edit
              </Button>
            )}
            {onComment && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onComment(post)}
                className="text-xs"
              >
                <MessageCircle size={14} className="mr-1" />
                Comment
              </Button>
            )}
          </div>

          {/* Approval Actions */}
          {post.status === 'pending' && currentUser.role === 'admin' && (
            <div className="flex items-center gap-1">
              {onApprove && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onApprove(post)}
                  className="text-xs text-green-600 border-green-600 hover:bg-green-50"
                >
                  <CheckCircle size={14} className="mr-1" />
                  Approve
                </Button>
              )}
              {onReject && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReject(post)}
                  className="text-xs text-red-600 border-red-600 hover:bg-red-50"
                >
                  <XCircle size={14} className="mr-1" />
                  Reject
                </Button>
              )}
            </div>
          )}

          {/* Submit for Approval */}
          {post.status === 'draft' && onSubmitForApproval && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSubmitForApproval(post)}
              className="text-xs text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              <Send size={14} className="mr-1" />
              Submit for Review
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}