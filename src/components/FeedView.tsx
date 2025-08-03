import { Post } from '@/types'
import { PostCard } from '@/components/PostCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Plus } from 'lucide-react'
import { useState } from 'react'

interface FeedViewProps {
  posts: Post[]
  onEditPost: (post: Post) => void
  onCreatePost: () => void
  onCommentPost: (post: Post) => void
  onApprovePost: (post: Post) => void
  onRejectPost: (post: Post) => void
  onSubmitForApproval?: (post: Post) => void
}

export function FeedView({ 
  posts, 
  onEditPost, 
  onCreatePost,
  onCommentPost,
  onApprovePost,
  onRejectPost,
  onSubmitForApproval 
}: FeedViewProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [platformFilter, setPlatformFilter] = useState<string>('all')

  // Filter posts based on search and filters
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author?.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter
    const matchesPlatform = platformFilter === 'all' || post.platforms.includes(platformFilter as any)

    return matchesSearch && matchesStatus && matchesPlatform
  })

  // Sort posts by update date (most recent first)
  const sortedPosts = [...filteredPosts].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )

  const statusCounts = {
    draft: posts.filter(p => p.status === 'draft').length,
    pending: posts.filter(p => p.status === 'pending').length,
    approved: posts.filter(p => p.status === 'approved').length,
    rejected: posts.filter(p => p.status === 'rejected').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Feed</h1>
          <p className="text-muted-foreground">Manage all your social media content</p>
        </div>
        <Button onClick={onCreatePost}>
          <Plus size={16} className="mr-2" />
          New Post
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-4 gap-4">
        <div className="flex items-center gap-3 p-4 rounded-lg border">
          <div className="w-3 h-3 rounded-full bg-gray-500" />
          <div>
            <div className="text-2xl font-semibold">{statusCounts.draft}</div>
            <div className="text-sm text-muted-foreground">Drafts</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-lg border">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <div>
            <div className="text-2xl font-semibold">{statusCounts.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-lg border">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <div>
            <div className="text-2xl font-semibold">{statusCounts.approved}</div>
            <div className="text-sm text-muted-foreground">Approved</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-lg border">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div>
            <div className="text-2xl font-semibold">{statusCounts.rejected}</div>
            <div className="text-sm text-muted-foreground">Rejected</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/30">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search posts or authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <Filter size={16} className="mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="twitter">Twitter</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
          </SelectContent>
        </Select>

        {(searchQuery || statusFilter !== 'all' || platformFilter !== 'all') && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('')
              setStatusFilter('all')
              setPlatformFilter('all')
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {sortedPosts.length} of {posts.length} posts
        </div>
        
        {searchQuery && (
          <Badge variant="secondary">
            Search: "{searchQuery}"
          </Badge>
        )}
      </div>

      {/* Posts Grid */}
      {sortedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onEdit={onEditPost}
              onComment={onCommentPost}
              onApprove={onApprovePost}
              onReject={onRejectPost}
              onSubmitForApproval={onSubmitForApproval}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            {posts.length === 0 ? (
              <>
                <div className="text-lg font-medium mb-2">No posts yet</div>
                <div>Create your first post to get started</div>
              </>
            ) : (
              <>
                <div className="text-lg font-medium mb-2">No posts match your filters</div>
                <div>Try adjusting your search or filter criteria</div>
              </>
            )}
          </div>
          {posts.length === 0 && (
            <Button onClick={onCreatePost}>
              <Plus size={16} className="mr-2" />
              Create First Post
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default FeedView