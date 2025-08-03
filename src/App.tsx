import { useState, useEffect, Suspense, lazy, useMemo, useRef, useCallback } from 'react'
import { Post, Platform } from '@/types'
import { usePosts } from '@/hooks/useData'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useTheme } from '@/hooks/useTheme'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import { useContentLocks } from '@/hooks/useContentLocks'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { LoadingFallback } from '@/components/LoadingFallback'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Calendar, Grid3X3, Users, Settings, Bell, BarChart3, Home, Sparkles, Plus, X } from 'lucide-react'
import { toast, Toaster } from 'sonner'

// Safely lazy load major components with error handling
const Dashboard = lazy(() => 
  import('@/components/Dashboard').catch(() => ({
    default: () => <div className="p-8 text-center text-muted-foreground">Dashboard temporarily unavailable</div>
  }))
)
const FeedView = lazy(() => 
  import('@/components/FeedView').catch(() => ({
    default: () => <div className="p-8 text-center text-muted-foreground">Feed view temporarily unavailable</div>
  }))
)
const CalendarView = lazy(() => 
  import('@/components/CalendarView').catch(() => ({
    default: () => <div className="p-8 text-center text-muted-foreground">Calendar view temporarily unavailable</div>
  }))
)
const AIContentAssistant = lazy(() => 
  import('@/components/AIContentAssistant').catch(() => ({
    default: () => <div className="p-8 text-center text-muted-foreground">AI Assistant temporarily unavailable</div>
  }))
)
const PostEditor = lazy(() => 
  import('@/components/PostEditor').catch(() => ({
    default: () => <div className="p-8 text-center text-muted-foreground">Post editor temporarily unavailable</div>
  }))
)
const SettingsModal = lazy(() => 
  import('@/components/SettingsModal').catch(() => ({
    default: () => <div className="p-8 text-center text-muted-foreground">Settings temporarily unavailable</div>
  }))
)
const NotificationSystem = lazy(() => 
  import('@/components/NotificationSystem').catch(() => ({
    default: () => <div className="p-8 text-center text-muted-foreground">Notifications temporarily unavailable</div>
  }))
)
const IconShowcase = lazy(() => 
  import('@/components/IconShowcase').catch(() => ({
    default: () => <div className="p-8 text-center text-muted-foreground">Icon showcase temporarily unavailable</div>
  }))
)

function App() {
  // Core application state with error handling
  let posts: Post[] = []
  let addPost: ((post: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'author'>) => Post) | undefined
  let updatePost: ((postId: string, updates: Partial<Post>) => void) | undefined
  
  try {
    const postsHook = usePosts()
    posts = Array.isArray(postsHook.posts) ? postsHook.posts : []
    addPost = postsHook.addPost
    updatePost = postsHook.updatePost
  } catch (error) {
    console.error('Failed to initialize posts:', error)
    toast.error('Failed to load posts data')
  }

  // Enhanced state management
  const [activeTab, setActiveTab] = useState('dashboard')
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [showPostEditor, setShowPostEditor] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [aiAssistantExpanded, setAiAssistantExpanded] = useState(false)

  // Hook usage with error handling
  const theme = useTheme() || {
    theme: 'light' as const,
    systemTheme: 'light' as const,
    effectiveTheme: 'light' as const,
    reducedMotion: false,
    highContrast: false,
    setTheme: () => {},
    toggleTheme: () => {},
    setAccentColor: () => {},
    setHighContrast: () => {},
    resetTheme: () => {},
    isDark: false,
    isLight: true,
    isAuto: false
  }

  const networkStatus = useNetworkStatus() || {
    isOnline: true,
    connectionQuality: 'good' as const,
    connectionStable: true
  }
  
  // Safe content locks hook
  const contentLocks = useContentLocks() || {
    acquireLock: async () => false,
    releaseLock: async () => {},
    getCollaborators: () => [],
    isLocked: () => false,
    getLockInfo: () => null,
    currentLocks: []
  }

  // Mock current user
  const currentUser = {
    name: 'Sarah Chen',
    email: 'sarah@company.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    role: 'admin' as const,
    permissions: ['all'],
    timezone: 'America/New_York',
    language: 'en-US',
    department: 'Marketing',
    lastActive: new Date(),
    preferences: {
      defaultView: 'calendar' as const,
      notifications: true,
      aiAssistance: true,
      advancedFeatures: true,
      theme: 'light' as const,
      timezone: 'America/New_York',
      language: 'en-US',
      compactMode: false,
      focusMode: false
    }
  }

  // Event handlers with error handling
  const handleCreatePost = useCallback((date?: Date) => {
    try {
      setEditingPost(null)
      setShowPostEditor(true)
    } catch (error) {
      console.error('Failed to create post:', error)
      toast.error('Failed to create post')
    }
  }, [])

  const handleEditPost = useCallback((post: Post) => {
    try {
      if (!post || typeof post !== 'object') throw new Error('Invalid post data')
      setEditingPost(post)
      setShowPostEditor(true)
    } catch (error) {
      console.error('Failed to edit post:', error)
      toast.error('Failed to edit post')
    }
  }, [])

  const handleSavePost = useCallback((postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'author'>) => {
    try {
      if (!addPost || !updatePost) {
        throw new Error('Post management functions not available')
      }
      
      if (!postData || typeof postData !== 'object') {
        throw new Error('Invalid post data provided')
      }
      
      if (editingPost) {
        updatePost(editingPost.id, postData)
        toast.success('Post updated successfully')
      } else {
        addPost(postData)
        toast.success('Post created successfully')
      }
      setShowPostEditor(false)
      setEditingPost(null)
    } catch (error) {
      console.error('Failed to save post:', error)
      toast.error('Failed to save post')
    }
  }, [editingPost, updatePost, addPost])

  const handleUseAIContent = useCallback((content: string, platform: Platform) => {
    try {
      if (!addPost) {
        throw new Error('Unable to add post - post management not available')
      }
      
      if (!content || typeof content !== 'string') {
        throw new Error('Invalid content provided')
      }
      
      if (!platform) {
        throw new Error('Platform not specified')
      }
      
      const newPost = {
        content,
        platforms: [platform],
        scheduledDate: new Date(Date.now() + 86400000).toISOString(),
        status: 'draft' as const,
        authorId: 'user-1'
      }
      addPost(newPost)
      setActiveTab('feed')
      toast.success('AI content added as new post!')
    } catch (error) {
      console.error('Failed to use AI content:', error)
      toast.error('Failed to use AI content')
    }
  }, [addPost, setActiveTab])

  const handleViewPost = useCallback((postId: string) => {
    try {
      if (!postId || typeof postId !== 'string') {
        throw new Error('Invalid post ID')
      }
      
      const post = Array.isArray(posts) ? posts.find(p => p?.id === postId) : null
      if (post) {
        handleEditPost(post)
        setNotificationsOpen(false)
      } else {
        throw new Error('Post not found')
      }
    } catch (error) {
      console.error('Failed to view post:', error)
      toast.error('Post not found')
    }
  }, [posts, handleEditPost])

  // Keyboard shortcuts with error handling
  try {
    useKeyboardShortcuts({
      onCreatePost: () => handleCreatePost(),
      onOpenSettings: () => setSettingsOpen(true),
      onToggleNotifications: () => setNotificationsOpen(!notificationsOpen),
      isDialogOpen: showPostEditor || settingsOpen || notificationsOpen
    })
  } catch (error) {
    console.error('Failed to initialize keyboard shortcuts:', error)
  }

  // Status indicators with error handling
  const statusIndicators = useMemo(() => {
    try {
      if (!Array.isArray(posts)) {
        return { pending: 0, scheduled: 0 }
      }
      
      const pending = posts.filter(p => {
        try {
          return p && typeof p === 'object' && p.status === 'pending'
        } catch {
          return false
        }
      }).length
      
      const scheduled = posts.filter(p => {
        try {
          return p && 
                 typeof p === 'object' && 
                 p.scheduledDate && 
                 typeof p.scheduledDate === 'string' &&
                 new Date(p.scheduledDate) > new Date()
        } catch {
          return false
        }
      }).length
      
      return { pending, scheduled }
    } catch (error) {
      console.error('Failed to calculate status indicators:', error)
      return { pending: 0, scheduled: 0 }
    }
  }, [posts])

  return (
    <ErrorBoundary>
      <TooltipProvider>
        <div className="min-h-screen bg-background transition-all duration-500 ease-out">
          {/* Network Status Indicator */}
          {networkStatus && !networkStatus.isOnline && (
            <div className="bg-yellow-500 text-white text-center py-2 text-sm">
              <span className="inline-flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Working offline - Changes will sync when connection is restored
              </span>
            </div>
          )}

          {/* Header */}
          <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg">
                      <Calendar size={18} className="text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold gradient-text">
                        ContentPlan Pro
                      </h1>
                      <p className="text-xs text-muted-foreground">
                        Enterprise Content Intelligence
                      </p>
                    </div>
                  </div>
                  
                  {/* Status Indicators */}
                  <div className="hidden md:flex items-center gap-2 ml-6">
                    <Badge variant={networkStatus?.isOnline ? "default" : "secondary"} className="text-xs">
                      {networkStatus?.isOnline ? `Online • ${networkStatus.connectionQuality}` : 'Offline'}
                    </Badge>
                    {statusIndicators.pending > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {statusIndicators.pending} Pending Approval
                      </Badge>
                    )}
                    {statusIndicators.scheduled > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {statusIndicators.scheduled} Scheduled
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* AI Assistant Toggle */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`text-muted-foreground hover:text-primary ${
                          aiAssistantExpanded ? 'text-primary bg-primary/10' : ''
                        }`}
                        onClick={() => setAiAssistantExpanded(!aiAssistantExpanded)}
                      >
                        <Sparkles size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>AI Content Assistant {aiAssistantExpanded ? '(Active)' : ''}</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Notifications */}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`text-muted-foreground hover:text-primary ${
                        notificationsOpen ? 'text-primary bg-primary/10' : ''
                      }`}
                      onClick={() => setNotificationsOpen(!notificationsOpen)}
                    >
                      <Bell size={18} />
                    </Button>
                    {statusIndicators.pending > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 text-xs"
                      >
                        {statusIndicators.pending}
                      </Badge>
                    )}
                  </div>

                  {/* User Profile */}
                  <div className="flex items-center gap-3 pl-3 border-l">
                    <div className="relative">
                      <Avatar className="w-9 h-9 ring-2 ring-primary/20">
                        <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white">
                          {currentUser.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    </div>
                    <div className="text-sm hidden md:block">
                      <div className="font-medium">{currentUser.name}</div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs capitalize">
                          {currentUser.role}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {currentUser.department}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Settings */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-primary"
                    onClick={() => setSettingsOpen(true)}
                  >
                    <Settings size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <main className="container mx-auto px-6 py-6">
            <Suspense fallback={<LoadingFallback message="Loading application..." />}>
              <ErrorBoundary>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <TabsList className="inline-flex h-9 items-center justify-start rounded-lg bg-muted p-1 text-xs">
                    <TabsTrigger value="dashboard" className="flex items-center gap-1">
                      <Home size={14} />
                      <span className="hidden lg:inline">Dashboard</span>
                    </TabsTrigger>
                    <TabsTrigger value="feed" className="flex items-center gap-1">
                      <Grid3X3 size={14} />
                      <span className="hidden lg:inline">Feed</span>
                    </TabsTrigger>
                    <TabsTrigger value="calendar" className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span className="hidden lg:inline">Calendar</span>
                    </TabsTrigger>
                    <TabsTrigger value="ai-assistant" className="flex items-center gap-1">
                      <Sparkles size={14} />
                      <span className="hidden lg:inline">AI Assistant</span>
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="flex items-center gap-1">
                      <BarChart3 size={14} />
                      <span className="hidden lg:inline">Analytics</span>
                    </TabsTrigger>
                    <TabsTrigger value="team" className="flex items-center gap-1">
                      <Users size={14} />
                      <span className="hidden lg:inline">Team</span>
                    </TabsTrigger>
                    <TabsTrigger value="icons" className="flex items-center gap-1">
                      <Sparkles size={14} />
                      <span className="hidden lg:inline">Icons</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Tab Contents */}
                  <TabsContent value="dashboard">
                    <ErrorBoundary>
                      <Dashboard
                        posts={posts}
                        onCreatePost={() => handleCreatePost()}
                        onViewPost={handleEditPost}
                        onSwitchTab={setActiveTab}
                      />
                    </ErrorBoundary>
                  </TabsContent>

                  <TabsContent value="feed">
                    <ErrorBoundary>
                      <FeedView
                        posts={posts}
                        onEditPost={handleEditPost}
                        onCreatePost={() => handleCreatePost()}
                        onCommentPost={() => {}}
                        onApprovePost={() => {}}
                        onRejectPost={() => {}}
                        onSubmitForApproval={() => {}}
                      />
                    </ErrorBoundary>
                  </TabsContent>

                  <TabsContent value="calendar">
                    <ErrorBoundary>
                      <CalendarView
                        posts={posts}
                        onEditPost={handleEditPost}
                        onCreatePost={handleCreatePost}
                        onApprovePost={() => {}}
                        onRejectPost={() => {}}
                      />
                    </ErrorBoundary>
                  </TabsContent>

                  <TabsContent value="ai-assistant">
                    <ErrorBoundary>
                      <AIContentAssistant
                        onUseContent={handleUseAIContent}
                      />
                    </ErrorBoundary>
                  </TabsContent>

                  <TabsContent value="analytics">
                    <ErrorBoundary>
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Analytics</h2>
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">Analytics coming soon...</p>
                        </div>
                      </div>
                    </ErrorBoundary>
                  </TabsContent>

                  <TabsContent value="team">
                    <ErrorBoundary>
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Team Collaboration</h2>
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">Team features coming soon...</p>
                        </div>
                      </div>
                    </ErrorBoundary>
                  </TabsContent>

                  <TabsContent value="icons">
                    <ErrorBoundary>
                      <IconShowcase />
                    </ErrorBoundary>
                  </TabsContent>
                </Tabs>
              </ErrorBoundary>
            </Suspense>

            {/* Floating Action Button */}
            <Button
              onClick={() => handleCreatePost()}
              className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-40 fab"
              size="lg"
            >
              <Plus size={24} />
            </Button>
          </main>

          {/* Dialogs */}
          <Suspense fallback={<LoadingFallback />}>
            <PostEditor
              post={editingPost}
              open={showPostEditor}
              onClose={() => {
                setShowPostEditor(false)
                setEditingPost(null)
              }}
              onSave={handleSavePost}
              aiAssistance={currentUser.preferences.aiAssistance}
              advancedFeatures={currentUser.preferences.advancedFeatures}
            />

            <SettingsModal
              open={settingsOpen}
              onClose={() => setSettingsOpen(false)}
              user={currentUser}
              onUpdatePreferences={(prefs) => {
                toast.success('Settings updated successfully')
              }}
              enterpriseFeatures={true}
            />

            {notificationsOpen && (
              <div className="fixed top-16 right-6 w-96 bg-card border rounded-lg shadow-lg z-50">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Bell size={16} />
                      Notifications
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setNotificationsOpen(false)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
                <div className="max-h-96 overflow-auto">
                  <NotificationSystem onPostClick={handleViewPost} />
                </div>
              </div>
            )}

          </Suspense>

          {/* Toast System */}
          <Toaster position="top-right" />
        </div>
      </TooltipProvider>
    </ErrorBoundary>
  )
}

export default App
