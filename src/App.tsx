import { useState, useEffect } from 'react'
import { Post, Platform } from '@/types'
import { usePosts } from '@/hooks/useData'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { CalendarView } from '@/components/CalendarView'
import { FeedView } from '@/components/FeedView'
import { PostEditor } from '@/components/PostEditor'
import { RealtimeCollaboration } from '@/components/RealtimeCollaboration'
import { CommentDialog } from '@/components/CommentDialog'
import { TeamView } from '@/components/TeamView'
import { NotificationSystem } from '@/components/NotificationSystem'
import { AnalyticsView } from '@/components/AnalyticsView'
import { AdvancedAnalytics } from '@/components/AdvancedAnalytics'
import { SettingsModal } from '@/components/SettingsModal'
import { PublishingScheduler } from '@/components/PublishingScheduler'
import { ClientPortal } from '@/components/ClientPortal'
import { AIContentAssistant } from '@/components/AIContentAssistant'
import { ContentSuggestionEngine } from '@/components/ContentSuggestionEngine'
import { WorkflowAutomation } from '@/components/WorkflowAutomation'
import { ContentPerformanceInsights } from '@/components/ContentPerformanceInsights'
import { TeamCollaborationSystem } from '@/components/TeamCollaborationSystem'
import { Dashboard } from '@/components/Dashboard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Calendar, Grid3x3, Users, Settings, Bell, BarChart3, Keyboard, Clock, Eye, Sparkles, Workflow, TrendingUp, Home } from '@phosphor-icons/react'
import { toast, Toaster } from 'sonner'

function App() {
  const { posts, addPost, updatePost } = usePosts()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [showPostEditor, setShowPostEditor] = useState(false)
  const [commentingPost, setCommentingPost] = useState<Post | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

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

  const handleSchedulePost = (post: Post, publishAt: Date) => {
    updatePost(post.id, { scheduledDate: publishAt.toISOString() })
    toast.success('Post scheduled successfully')
  }

  const handleUseAIContent = (content: string, platform: Platform) => {
    const newPost = {
      content,
      platform,
      scheduledDate: new Date(Date.now() + 86400000).toISOString(), // Default to tomorrow
      status: 'draft' as const,
      authorId: 'user-1' // Use the same user ID as in the data hook
    }
    addPost(newPost)
    setActiveTab('feed')
    toast.success('AI content added as new post!')
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

  const handleViewPost = (postId: string) => {
    const post = posts.find(p => p.id === postId)
    if (post) {
      handleEditPost(post)
      setNotificationsOpen(false)
    }
  }

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onCreatePost: () => handleCreatePost(),
    onOpenSettings: () => setSettingsOpen(true),
    onToggleNotifications: () => setNotificationsOpen(!notificationsOpen),
    isDialogOpen: showPostEditor || !!commentingPost || settingsOpen
  })

  return (
    <TooltipProvider>
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Keyboard size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Press ? for keyboard shortcuts</p>
                </TooltipContent>
              </Tooltip>

              <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell size={18} />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-0" align="end">
                  <NotificationSystem onPostClick={handleViewPost} />
                </PopoverContent>
              </Popover>

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

              <Button variant="outline" size="sm" onClick={() => setSettingsOpen(true)}>
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
          <TabsList className="grid w-full max-w-6xl grid-cols-10 text-xs">
            <TabsTrigger value="dashboard" className="flex items-center gap-1">
              <Home size={14} />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="feed" className="flex items-center gap-1">
              <Grid3x3 size={14} />
              Feed
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-1">
              <Calendar size={14} />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="scheduler" className="flex items-center gap-1">
              <Clock size={14} />
              Scheduler
            </TabsTrigger>
            <TabsTrigger value="ai-assistant" className="flex items-center gap-1">
              <Sparkles size={14} />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="content-engine" className="flex items-center gap-1">
              <Sparkles size={14} />
              Content Engine
            </TabsTrigger>
            <TabsTrigger value="workflows" className="flex items-center gap-1">
              <Workflow size={14} />
              Workflows
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-1">
              <TrendingUp size={14} />
              Insights
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1">
              <BarChart3 size={14} />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-1">
              <Users size={14} />
              Team
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard
              posts={posts}
              onCreatePost={() => handleCreatePost()}
              onViewPost={handleEditPost}
              onSwitchTab={setActiveTab}
            />
          </TabsContent>

          <TabsContent value="feed">
            <FeedView
              posts={posts}
              onEditPost={handleEditPost}
              onCreatePost={() => handleCreatePost()}
              onCommentPost={handleCommentPost}
              onApprovePost={handleApprovePost}
              onRejectPost={handleRejectPost}
              onSubmitForApproval={handleSubmitForApproval}
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

          <TabsContent value="scheduler">
            <PublishingScheduler
              posts={posts}
              onSchedulePost={handleSchedulePost}
              onUpdatePost={updatePost}
            />
          </TabsContent>

          <TabsContent value="ai-assistant">
            <AIContentAssistant
              onUseContent={handleUseAIContent}
            />
          </TabsContent>

          <TabsContent value="content-engine">
            <ContentSuggestionEngine
              posts={posts}
              onUseContent={handleUseAIContent}
            />
          </TabsContent>

          <TabsContent value="workflows">
            <WorkflowAutomation
              posts={posts}
              onUpdatePost={updatePost}
            />
          </TabsContent>

          <TabsContent value="insights">
            <ContentPerformanceInsights
              posts={posts}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <AdvancedAnalytics posts={posts} />
          </TabsContent>

          <TabsContent value="team">
            <TeamCollaborationSystem posts={posts} />
          </TabsContent>
        </Tabs>

        {/* Client Portal - Hidden tab accessible via direct URL */}
        {activeTab === 'client-portal' && (
          <ClientPortal
            posts={posts}
            onApprovePost={handleApprovePost}
            onRejectPost={handleRejectPost}
            onAddComment={(postId, comment) => {
              // Handle adding comment
              toast.success('Comment added successfully')
            }}
          />
        )}
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

      <RealtimeCollaboration
        post={commentingPost}
        open={!!commentingPost}
        onClose={() => setCommentingPost(null)}
      />

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <Toaster richColors position="top-right" />
    </div>
    </TooltipProvider>
  )
}

export default App