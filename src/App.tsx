import { useState, useEffect } from 'react'
import { Post } from '@/types'
import { usePosts } from '@/hooks/useData'
import { CalendarView } from '@/components/CalendarView'
import { FeedView } from '@/components/FeedView'
import { PostEditor } from '@/components/PostEditor'
import { CommentDialog } from '@/components/CommentDialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Calendar, Grid3x3, Users, Settings } from '@phosphor-icons/react'
import { toast } from 'sonner'

function App() {
  const { posts, addPost, updatePost } = usePosts()
  const [activeTab, setActiveTab] = useState('feed')
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [showPostEditor, setShowPostEditor] = useState(false)
  const [commentingPost, setCommentingPost] = useState<Post | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Mock current user
  const currentUser = {
    name: 'Sarah Chen',
    email: 'sarah@company.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    role: 'admin' as const
  }

  const handleCreatePost = (date?: Date) => {
    setEditingPost(null)
    setSelectedDate(date || null)
    setShowPostEditor(true)
  }

  const handleEditPost = (post: Post) => {
    setEditingPost(post)
    setSelectedDate(null)
    setShowPostEditor(true)
  }

  const handleSavePost = (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'author'>) => {
    if (editingPost) {
      updatePost(editingPost.id, postData)
      toast.success('Post updated successfully')
    } else {
      // If we have a selected date, use it as the scheduled date
      const finalPostData = selectedDate 
        ? { ...postData, scheduledDate: selectedDate.toISOString() }
        : postData
      
      addPost(finalPostData)
      toast.success('Post created successfully')
    }
  }

  const handleApprovePost = (post: Post) => {
    updatePost(post.id, { status: 'approved' })
    toast.success(`Post approved for ${post.platform}`)
  }

  const handleRejectPost = (post: Post) => {
    updatePost(post.id, { status: 'rejected' })
    toast.success(`Post rejected with feedback`)
  }

  const handleCommentPost = (post: Post) => {
    setCommentingPost(post)
  }

  const handleSubmitForApproval = (post: Post) => {
    updatePost(post.id, { status: 'pending' })
    toast.success('Post submitted for approval')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Calendar size={20} className="text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">ContentPlan</h1>
                  <p className="text-xs text-muted-foreground">Collaborative Content Planning</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback>
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium">{currentUser.name}</div>
                  <Badge variant="secondary" className="text-xs">
                    {currentUser.role}
                  </Badge>
                </div>
              </div>

              <Button variant="outline" size="sm">
                <Settings size={16} className="mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="feed" className="flex items-center gap-2">
              <Grid3x3 size={16} />
              Feed
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar size={16} />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users size={16} />
              Team
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed">
            <FeedView
              posts={posts}
              onEditPost={handleEditPost}
              onCreatePost={() => handleCreatePost()}
              onCommentPost={handleCommentPost}
              onApprovePost={handleApprovePost}
              onRejectPost={handleRejectPost}
            />
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarView
              posts={posts}
              onEditPost={handleEditPost}
              onCreatePost={handleCreatePost}
              onApprovePost={handleApprovePost}
              onRejectPost={handleRejectPost}
            />
          </TabsContent>

          <TabsContent value="team">
            <div className="text-center py-12">
              <Users size={48} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Team Management</h3>
              <p className="text-muted-foreground mb-4">
                Invite team members and manage roles and permissions
              </p>
              <Button variant="outline">Coming Soon</Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialogs */}
      <PostEditor
        post={editingPost}
        open={showPostEditor}
        onClose={() => {
          setShowPostEditor(false)
          setEditingPost(null)
          setSelectedDate(null)
        }}
        onSave={handleSavePost}
      />

      <CommentDialog
        post={commentingPost}
        open={!!commentingPost}
        onClose={() => setCommentingPost(null)}
      />
      <Toaster richColors position="top-right" />
    </div>
  )
}

export default App