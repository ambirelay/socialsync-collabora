import { useState, useEffect, Suspense, lazy, useMemo, useRef } from 'react'
import { Post, Platform } from '@/types.ts'
import { usePosts } from '@/hooks/useData'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useTheme } from '@/hooks/useTheme'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import { useContentLocks } from '@/hooks/useContentLocks'
import { useAnimations } from '@/hooks/useAnimations'
import { useScrollEnhancements } from '@/hooks/useScrollEnhancements'
import { useGestures } from '@/hooks/useGestures'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { LoadingFallback } from '@/components/LoadingFallback'

// Lazy load components for performance optimization
const CalendarView = lazy(() => import('@/components/CalendarView'))
const FeedView = lazy(() => import('@/components/FeedView'))
const PostEditor = lazy(() => import('@/components/PostEditor'))
const RealtimeCollaboration = lazy(() => import('@/components/RealtimeCollaboration'))
const CommentDialog = lazy(() => import('@/components/CommentDialog'))
const TeamView = lazy(() => import('@/components/TeamView'))
const NotificationSystem = lazy(() => import('@/components/NotificationSystem'))
const AnalyticsView = lazy(() => import('@/components/AnalyticsView'))
const AdvancedAnalytics = lazy(() => import('@/components/AdvancedAnalytics'))
const SettingsModal = lazy(() => import('@/components/SettingsModal'))
const PublishingScheduler = lazy(() => import('@/components/PublishingScheduler'))
const ClientPortal = lazy(() => import('@/components/ClientPortal'))
const AIContentAssistant = lazy(() => import('@/components/AIContentAssistant'))
const ContentSuggestionEngine = lazy(() => import('@/components/ContentSuggestionEngine'))
const WorkflowAutomation = lazy(() => import('@/components/WorkflowAutomation'))
const ContentPerformanceInsights = lazy(() => import('@/components/ContentPerformanceInsights'))
const AdvancedTeamCollaboration = lazy(() => import('@/components/AdvancedTeamCollaboration'))
const EnhancedBrandManagement = lazy(() => import('@/components/EnhancedBrandManagement'))
const EnhancedBusinessIntelligence = lazy(() => import('@/components/EnhancedBusinessIntelligence'))
const AdvancedContentAnalytics = lazy(() => import('@/components/AdvancedContentAnalytics'))
const EnhancedPerformanceMonitoring = lazy(() => import('@/components/EnhancedPerformanceMonitoring'))
const APIIntegrationManager = lazy(() => import('@/components/APIIntegrationManager'))
const Dashboard = lazy(() => import('@/components/Dashboard'))
const KeyboardShortcuts = lazy(() => import('@/components/KeyboardShortcuts'))
const CommandPalette = lazy(() => import('@/components/CommandPalette'))
const OnboardingTour = lazy(() => import('@/components/OnboardingTour'))

// Ultra-sophisticated new components
const UltraAdvancedContentIntelligence = lazy(() => import('@/components/UltraAdvancedContentIntelligence'))
const EnterpriseComplianceCenter = lazy(() => import('@/components/EnterpriseComplianceCenter'))
const GlobalMarketInsights = lazy(() => import('@/components/GlobalMarketInsights'))
const PredictiveContentOptimizer = lazy(() => import('@/components/PredictiveContentOptimizer'))
const AdvancedAudienceIntelligence = lazy(() => import('@/components/AdvancedAudienceIntelligence'))
const ContentROIAnalyzer = lazy(() => import('@/components/ContentROIAnalyzer'))
const MultiLanguageContentManager = lazy(() => import('@/components/MultiLanguageContentManager'))
const AdvancedWorkflowOrchestrator = lazy(() => import('@/components/AdvancedWorkflowOrchestrator'))
const EnterpriseSecurityDashboard = lazy(() => import('@/components/EnterpriseSecurityDashboard'))
const CampaignPerformanceOptimizer = lazy(() => import('@/components/CampaignPerformanceOptimizer'))
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Input } from '@/components/ui/input'
import { Calendar, Grid3x3, Users, Settings, Bell, BarChart3, Keyboard, Clock, Eye, Sparkles, Workflow, TrendingUp, Home, Palette, Briefcase, Shield, Plug, Search, Command } from '@phosphor-icons/react'
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
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [onboardingOpen, setOnboardingOpen] = useState(false)
  
  // Advanced state management with animations
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [performanceMode, setPerformanceMode] = useState(false)
  const [offlineMode, setOfflineMode] = useState(false)
  
  // Ultra-sophisticated feature states
  const [aiAssistantExpanded, setAiAssistantExpanded] = useState(false)
  const [collaborationPanelOpen, setCollaborationPanelOpen] = useState(false)
  const [analyticsOverlayOpen, setAnalyticsOverlayOpen] = useState(false)
  const [workflowDesignerOpen, setWorkflowDesignerOpen] = useState(false)
  const [complianceAuditOpen, setComplianceAuditOpen] = useState(false)
  
  // Animation and interaction states
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [headerElevated, setHeaderElevated] = useState(false)
  const [floatingButtonVisible, setFloatingButtonVisible] = useState(true)
  
  // Enhanced hooks
  const { theme, toggleTheme } = useTheme()
  const { isOnline, connectionQuality } = useNetworkStatus()
  const { acquireLock, releaseLock, getCollaborators } = useContentLocks()
  const { 
    staggerChildren, 
    fadeIn, 
    fadeOut, 
    scaleIn, 
    slideIn, 
    observeIntersection,
    respectsReducedMotion 
  } = useAnimations()
  const { 
    scrollMetrics, 
    scrollToElement, 
    scrollToTop, 
    useScrollSpy,
    useScrollLock 
  } = useScrollEnhancements()
  const { useSwipe, useLongPress, useDoubleTap } = useGestures()
  
  // Refs for enhanced interactions
  const headerRef = useRef<HTMLElement>(null)
  const mainRef = useRef<HTMLElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  
  // Enhanced scroll spy for navigation
  const activeSection = useScrollSpy([
    '#dashboard-section',
    '#feed-section', 
    '#calendar-section',
    '#analytics-section'
  ])

  // Swipe gestures for mobile tab navigation
  const { handlers: swipeHandlers } = useSwipe({
    onSwipeLeft: () => {
      const tabs = ['dashboard', 'feed', 'calendar', 'scheduler', 'ai-assistant']
      const currentIndex = tabs.indexOf(activeTab)
      if (currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1])
      }
    },
    onSwipeRight: () => {
      const tabs = ['dashboard', 'feed', 'calendar', 'scheduler', 'ai-assistant'] 
      const currentIndex = tabs.indexOf(activeTab)
      if (currentIndex > 0) {
        setActiveTab(tabs[currentIndex - 1])
      }
    }
  }, { threshold: 80, velocity: 0.5 })

  // Long press for quick actions
  const { handlers: longPressHandlers } = useLongPress((e) => {
    setCommandPaletteOpen(true)
  }, 800)

  // Double tap for quick create
  const { handlers: doubleTapHandlers } = useDoubleTap(() => {
    handleCreatePost()
  })

  // Scroll lock for modals
  const { lockScroll, unlockScroll } = useScrollLock()

  // Enhanced header elevation on scroll
  useEffect(() => {
    const unsubscribe = observeIntersection(
      document.body,
      (isIntersecting) => {
        setHeaderElevated(!isIntersecting)
      },
      { rootMargin: '-100px 0px 0px 0px' }
    )

    return unsubscribe
  }, [observeIntersection])

  // Hide/show floating button based on scroll
  useEffect(() => {
    const { scrollDirection, isScrolling } = scrollMetrics
    
    if (isScrolling) {
      setFloatingButtonVisible(scrollDirection !== 'down')
    }
  }, [scrollMetrics])

  // Enhanced tab transition animations
  useEffect(() => {
    if (!respectsReducedMotion()) {
      setIsTransitioning(true)
      
      // Animate tab content change
      const tabContent = document.querySelector(`[data-state="active"]`)
      if (tabContent) {
        slideIn(tabContent as HTMLElement, 'up', 300, 10)
      }

      // Stagger animate list items
      setTimeout(() => {
        const listItems = document.querySelectorAll('.stagger-item')
        if (listItems.length > 0) {
          staggerChildren(listItems, { duration: 200, delay: 50 })
        }
        setIsTransitioning(false)
      }, 100)
    }
  }, [activeTab, staggerChildren, slideIn, respectsReducedMotion])

  // Lock scroll when modals are open
  useEffect(() => {
    const isModalOpen = showPostEditor || !!commentingPost || settingsOpen || 
                       shortcutsOpen || commandPaletteOpen || analyticsOverlayOpen
    
    if (isModalOpen) {
      lockScroll()
    } else {
      unlockScroll()
    }
  }, [showPostEditor, commentingPost, settingsOpen, shortcutsOpen, 
      commandPaletteOpen, analyticsOverlayOpen, lockScroll, unlockScroll])

  // Memoized active collaborators
  const activeCollaborators = useMemo(() => {
    return getCollaborators()
  }, [getCollaborators])

  // Enhanced status indicators with animations
  const statusIndicators = useMemo(() => {
    const pending = posts.filter(p => p.status === 'pending').length
    const scheduled = posts.filter(p => p.scheduledDate && new Date(p.scheduledDate) > new Date()).length
    
    return { pending, scheduled }
  }, [posts])
  
  // Mock enterprise user with enhanced properties
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
      defaultView: 'calendar',
      notifications: true,
      aiAssistance: true,
      advancedFeatures: true
    }
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
      platforms: [platform],
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
    toast.success(`Post approved for ${post.platforms.join(', ')}`)
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
    onShowShortcuts: () => setShortcutsOpen(true),
    onOpenCommandPalette: () => setCommandPaletteOpen(true),
    isDialogOpen: showPostEditor || !!commentingPost || settingsOpen || shortcutsOpen || commandPaletteOpen
  })

  return (
    <ErrorBoundary>
      <TooltipProvider>
        <div 
          className={`min-h-screen bg-background transition-all duration-500 ease-out custom-scrollbar smooth-scroll ${focusMode ? 'focus-mode' : ''} ${performanceMode ? 'performance-mode' : ''}`}
          {...swipeHandlers}
          {...longPressHandlers}
          {...doubleTapHandlers}
        >
          {/* Advanced Network Status Indicator with smooth transitions */}
          {!isOnline && (
            <div className="bg-yellow-500 text-white text-center py-2 text-sm animate-in slide-in-from-top duration-300">
              <span className="inline-flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Working offline - Changes will sync when connection is restored
              </span>
            </div>
          )}

          {/* Ultra-Sophisticated Header with Glass Morphism */}
          <header 
            ref={headerRef}
            className={`glass sticky top-0 z-50 transition-all duration-300 ${
              headerElevated 
                ? 'shadow-lg border-b backdrop-blur-lg' 
                : 'border-b border-transparent'
            }`}
          >
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 group">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg hover-scale group-hover:shadow-xl transition-all duration-300">
                      <Calendar size={20} className="text-primary-foreground" />
                    </div>
                    <div className="transition-all duration-300">
                      <h1 className="text-xl font-bold gradient-text">
                        ContentPlan Pro
                      </h1>
                      <p className="text-xs text-muted-foreground transition-opacity duration-300 group-hover:opacity-80">
                        Enterprise Content Intelligence
                      </p>
                    </div>
                  </div>
                  
                  {/* Enhanced Status Indicators with animations */}
                  <div className="hidden md:flex items-center gap-2 ml-6">
                    <Badge 
                      variant={isOnline ? "default" : "secondary"} 
                      className={`text-xs transition-all duration-300 hover-scale ${
                        isOnline ? 'pulse-glow' : 'opacity-60'
                      }`}
                    >
                      {isOnline ? `Online • ${connectionQuality}` : 'Offline'}
                    </Badge>
                    {statusIndicators.pending > 0 && (
                      <Badge 
                        variant="outline" 
                        className="text-xs hover-lift transition-all duration-300 cursor-pointer"
                        onClick={() => setActiveTab('feed')}
                      >
                        {statusIndicators.pending} Pending Approval
                      </Badge>
                    )}
                    {statusIndicators.scheduled > 0 && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs hover-lift transition-all duration-300 cursor-pointer"
                        onClick={() => setActiveTab('scheduler')}
                      >
                        {statusIndicators.scheduled} Scheduled
                      </Badge>
                    )}
                    {activeCollaborators.length > 0 && (
                      <Badge 
                        variant="outline" 
                        className="text-xs hover-lift transition-all duration-300 cursor-pointer"
                        onClick={() => setCollaborationPanelOpen(true)}
                      >
                        {activeCollaborators.length} Active
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Enhanced AI Assistant with sophisticated hover states */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                            : 'hover:text-primary hover:bg-primary/5'
                        }`}
                        onClick={() => setAiAssistantExpanded(!aiAssistantExpanded)}
                      >
                        <Sparkles 
                        onClick={() => setAiAssistantExpanded(!aiAssistantExpanded)}
                      >l duration-300 ${
                            aiAssistantExpanded ? 'animate-pulse scale-110' : 'hover:scale-110'
                          }`} 
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="glass">
                      </Button>d ? '(Active)' : ''}</p>
                    </TooltipTrigger>
                  </Tooltip>
                      <p>AI Content Assistant {aiAssistantExpanded ? '(Active)' : ''}</p>
                    </TooltipContent>
                  </Tooltip>
sChild>
                      <Button 
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button elative hover-glow transition-all duration-300 focus-ring"
                        variant="ghost" etCollaborationPanelOpen(!collaborationPanelOpen)}
                        size="sm" 
                        <Users size={16} className="transition-transform hover:scale-110" />
                        onClick={() => setCollaborationPanelOpen(!collaborationPanelOpen)}
                      > -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center pulse-glow">
                            <span className="text-[10px] text-white font-bold">
                              {activeCollaborators.length}
                            </span>
                            <span className="text-[10px] text-white font-bold">
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="glass">
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="glass">
                      <p>{activeCollaborators.length} team members active • Click to view</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Enhanced Performance Analytics */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-muted-foreground hover-glow transition-all duration-300 focus-ring"
                        onClick={() => setAnalyticsOverlayOpen(!analyticsOverlayOpen)}
                      >
                        <TrendingUp size={16} className="transition-transform hover:scale-110" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="glass">
                      <p>Quick analytics overlay</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Enhanced Keyboard Shortcuts */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-muted-foreground hover-glow transition-all duration-300 focus-ring"
                        onClick={() => setShortcutsOpen(true)}
                      >
                        <Keyboard size={16} className="transition-transform hover:scale-110" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="glass">
                      <p>Keyboard shortcuts (⌘/)</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Ultra-Enhanced Command Palette */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className="relative max-w-sm cursor-pointer group transition-all duration-300"
                        onClick={() => setCommandPaletteOpen(true)}
                      >
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-all duration-300" />
                        <Input
                          placeholder="Search, create, or ask AI..."
                          className="pl-10 pr-20 glass border-muted cursor-pointer hover:border-primary/50 focus:border-primary transition-all duration-300 focus-ring"
                          readOnly
                            ⌘K
                          </Badge>
                          <Badge variant="outline" className="text-xs px-1.5 py-0.5 glass transition-all duration-300 group-hover:bg-primary/10">
                            ⌘K
                    </TooltipTrigger>
                    <TooltipContent className="glass">
                      <p>Universal command palette with AI</p>
                    </TooltipTrigger>
                    <TooltipContent className="glass">

                  {/* Enhanced Notifications with sophisticated animations */}
                  <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                    <PopoverTrigger asChild>
                  {/* Enhanced Notifications with sophisticated animations */}
                        variant="ghost" 
                        size="sm" 
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="relative hover-glow transition-all duration-300 focus-ring"
                      >
                        <Bell size={18} className="transition-transform hover:scale-110" />
                    <PopoverContent className="w-96 p-0 glass-intense card-elevation-4" align="end">
                      </Button>
                        <NotificationSystem onPostClick={handleViewPost} />
                    <PopoverContent className="w-96 p-0 glass-intense card-elevation-4" align="end">
                    </PopoverContent>
                  </Popover>
                      </Suspense>
                  {/* Ultra-Enhanced User Profile */}
                  <div className="flex items-center gap-3 pl-3 border-l transition-all duration-300">
                    <div className="relative group">
                  {/* Ultra-Enhanced User Profile */}tion-all duration-300 hover-scale">
                  <div className="flex items-center gap-3 pl-3 border-l transition-all duration-300">
                    <div className="relative group">
                      <Avatar className="w-9 h-9 ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300 hover-scale">
                        </AvatarFallback>
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white">
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background pulse-glow" />
                    </div>
                      </Avatar>00">
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background pulse-glow" />
                      <div className="flex items-center gap-2">
                    <div className="text-sm hidden md:block transition-all duration-300">
                          {currentUser.role}
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs capitalize hover-scale transition-all duration-300">
                          {currentUser.department}
                        </span>
                        <span className="text-xs text-muted-foreground">
                    </div>
                  </div>
                      </div>
                  {/* Ultra-Enhanced Settings */}
                  <Button 

                  {/* Ultra-Enhanced Settings */}
                    onClick={() => setSettingsOpen(true)}
                    className="hover:bg-primary/5 transition-all duration-300 hover-lift focus-ring"
                    size="sm" 
                    <Settings size={16} className="mr-2 transition-transform hover:rotate-90" />
                    className="hover:bg-primary/5 transition-all duration-300 hover-lift focus-ring"
                  </Button>
                    <Settings size={16} className="mr-2 transition-transform hover:rotate-90" />
              </div>
                  </Button>
          </header>

          {/* Ultra-Advanced Main Content with Professional Animations */}
          <main 

            className="container mx-auto px-6 py-6 transition-all duration-500"
          >
            <Suspense fallback={<LoadingFallback />}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="inline-flex h-9 items-center justify-start rounded-lg bg-muted/30 p-1 text-xs w-full overflow-x-auto scrollbar-hide">
                  <div className="flex gap-1 min-w-fit">
                  <TabsTrigger value="dashboard" className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200">
                    <Home size={14} />
                <div className="relative">
                  <TabsList className="inline-flex h-9 items-center justify-start rounded-lg glass p-1 text-xs w-full overflow-x-auto custom-scrollbar transition-all duration-300">
                    <div 
                    <Grid3x3 size={14} />
                      className="flex gap-1 min-w-fit"
                    >
                    <TabsTrigger 
                      value="dashboard" 
                      className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 hover-scale interactive focus-ring stagger-item"
                      style={{'--stagger-delay': 0} as React.CSSProperties}
                  <TabsTrigger value="scheduler" className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Clock size={14} />
                    <span className="hidden lg:inline">Scheduler</span>
                  </TabsTrigger>
                    <TabsTrigger 
                      value="feed" 
                      className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 hover-scale interactive focus-ring stagger-item"
                      style={{'--stagger-delay': 1} as React.CSSProperties}
                    >
                    <Sparkles size={14} />
                      <span className="hidden lg:inline">Feed</span>
                  </TabsTrigger>
                    <TabsTrigger 
                      value="calendar" 
                    <span className="hidden lg:inline">Workflows</span>g stagger-item"
                      style={{'--stagger-delay': 2} as React.CSSProperties}
                    >
                      <Calendar size={14} className="transition-transform group-hover:scale-110" />
                      <span className="hidden lg:inline">Calendar</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="scheduler" 
                      className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 hover-scale interactive focus-ring stagger-item"
                      style={{'--stagger-delay': 3} as React.CSSProperties}
                  <TabsTrigger value="brand" className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <Clock size={14} className="transition-transform group-hover:scale-110" />
                      <span className="hidden lg:inline">Scheduler</span>
                    </TabsTrigger>
                    <TabsTrigger 
                    <Briefcase size={14} />
                      className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 hover-scale interactive focus-ring stagger-item"
                  </TabsTrigger>
                    >
                      <Sparkles size={14} className="transition-transform group-hover:scale-110" />
                      <span className="hidden lg:inline">AI Assistant</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="content-engine" 
                      className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 hover-scale interactive focus-ring stagger-item"
                      style={{'--stagger-delay': 5} as React.CSSProperties}
                    >
                      <Sparkles size={14} className="transition-transform group-hover:scale-110" />
                      <span className="hidden lg:inline">Content Engine</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="workflows" 
                      className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 hover-scale interactive focus-ring stagger-item"
                      style={{'--stagger-delay': 6} as React.CSSProperties}
                    >
                      <Workflow size={14} className="transition-transform group-hover:scale-110" />
                      <span className="hidden lg:inline">Workflows</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="insights" 
                      className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 hover-scale interactive focus-ring stagger-item"
                      style={{'--stagger-delay': 7} as React.CSSProperties}
                    >
                      <TrendingUp size={14} className="transition-transform group-hover:scale-110" />
                      <span className="hidden lg:inline">Insights</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="analytics" 
                      className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 hover-scale interactive focus-ring stagger-item"
                      style={{'--stagger-delay': 8} as React.CSSProperties}
                    >
                      <BarChart3 size={14} className="transition-transform group-hover:scale-110" />
                      <span className="hidden lg:inline">Analytics</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="brand" 
                      className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 hover-scale interactive focus-ring stagger-item"
                      style={{'--stagger-delay': 9} as React.CSSProperties}
                    >
                      <Palette size={14} className="transition-transform group-hover:scale-110" />
                      <span className="hidden lg:inline">Brand</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="business-intelligence" 
                      className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 hover-scale interactive focus-ring stagger-item"
                      style={{'--stagger-delay': 10} as React.CSSProperties}
                    >
                      <Briefcase size={14} className="transition-transform group-hover:scale-110" />
                      <span className="hidden lg:inline">Business Intel</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="monitoring" 
                      className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 hover-scale interactive focus-ring stagger-item"
                      style={{'--stagger-delay': 11} as React.CSSProperties}
                    >
                      <Shield size={14} className="transition-transform group-hover:scale-110" />
                      <span className="hidden lg:inline">Monitoring</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="integrations" 
                      className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 hover-scale interactive focus-ring stagger-item"
                      style={{'--stagger-delay': 12} as React.CSSProperties}
                    >
                      <Plug size={14} className="transition-transform group-hover:scale-110" />
                      <span className="hidden lg:inline">Integrations</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="team" 
                      className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 hover-scale interactive focus-ring stagger-item"
                      style={{'--stagger-delay': 13} as React.CSSProperties}
                    >
                      <Users size={14} className="transition-transform group-hover:scale-110" />
                      <span className="hidden lg:inline">Team</span>
                    </TabsTrigger>
                    {/* Ultra-Advanced New Tabs with enhanced animations */}
                    <TabsTrigger 
                      value="content-intelligence" 
                      className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 hover-scale interactive focus-ring stagger-item"
                      style={{'--stagger-delay': 14} as React.CSSProperties}
                    >
                      <Sparkles size={14} className="transition-transform group-hover:scale-110" />
                      <span className="hidden lg:inline">AI Intelligence</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="compliance" 
                      className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 hover-scale interactive focus-ring stagger-item"
                      style={{'--stagger-delay': 15} as React.CSSProperties}
                    >
                      <Shield size={14} className="transition-transform group-hover:scale-110" />
                      <span className="hidden lg:inline">Compliance</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="global-insights" 
                      className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 hover-scale interactive focus-ring stagger-item"
                      style={{'--stagger-delay': 16} as React.CSSProperties}
                    >
                      <TrendingUp size={14} className="transition-transform group-hover:scale-110" />
                      <span className="hidden lg:inline">Global Insights</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="multilingual" 
                      className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 hover-scale interactive focus-ring stagger-item"
                      style={{'--stagger-delay': 17} as React.CSSProperties}
                    >
                      <Palette size={14} className="transition-transform group-hover:scale-110" />
                      <span className="hidden lg:inline">Multilingual</span>
                    </TabsTrigger>
                    </div>
                  </TabsList>
                  
                  {/* Scroll Progress Indicator */}
                  <div className="absolute bottom-0 left-0 h-0.5 bg-primary/20 w-full">
                    <div 
                      className="h-full bg-primary transition-all duration-300"
                      style={{ 
                        width: `${scrollMetrics.progress * 100}%`,
                        opacity: scrollMetrics.isScrolling ? 1 : 0
                      }}
                    />
                  </div>
                </div>

                {/* Enhanced Tab Contents with smooth transitions */}
                <div className="relative overflow-hidden">
                  <TabsContent value="dashboard" className="reveal-up data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95 data-[state=active]:slide-in-from-bottom-2 duration-300">
                    <Dashboard
                      posts={posts}
                      onCreatePost={() => handleCreatePost()}
                      onViewPost={handleEditPost}
                      onSwitchTab={setActiveTab}
                    />
                  </TabsContent>

                  <TabsContent value="feed" className="reveal-up data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95 data-[state=active]:slide-in-from-bottom-2 duration-300">
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

                  <TabsContent value="calendar" className="reveal-up data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95 data-[state=active]:slide-in-from-bottom-2 duration-300">
                    <CalendarView
                      posts={posts}
                      onEditPost={handleEditPost}
                      onCreatePost={handleCreatePost}
                      onApprovePost={handleApprovePost}
                      onRejectPost={handleRejectPost}
                    />
                  </TabsContent>

                  <TabsContent value="scheduler" className="reveal-up data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95 data-[state=active]:slide-in-from-bottom-2 duration-300">
                    <PublishingScheduler
                      posts={posts}
                      onSchedulePost={handleSchedulePost}
                      onUpdatePost={updatePost}
                    />
                  </TabsContent>

                  <TabsContent value="ai-assistant" className="reveal-up data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95 data-[state=active]:slide-in-from-bottom-2 duration-300">
                    <AIContentAssistant
                      onUseContent={handleUseAIContent}
                    />
                  </TabsContent>

                  <TabsContent value="content-engine" className="reveal-up data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95 data-[state=active]:slide-in-from-bottom-2 duration-300">
                    <ContentSuggestionEngine
                      posts={posts}
                      onUseContent={handleUseAIContent}
                    />
                  </TabsContent>

                  <TabsContent value="workflows" className="reveal-up data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95 data-[state=active]:slide-in-from-bottom-2 duration-300">
                    <WorkflowAutomation
                      posts={posts}
                      onUpdatePost={updatePost}
                    />
                  </TabsContent>

                  <TabsContent value="insights" className="reveal-up data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95 data-[state=active]:slide-in-from-bottom-2 duration-300">
                    <ContentPerformanceInsights
                      posts={posts}
                    />
                  </TabsContent>

                  <TabsContent value="analytics" className="reveal-up data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95 data-[state=active]:slide-in-from-bottom-2 duration-300">
                    <AdvancedContentAnalytics posts={posts} />
                  </TabsContent>

                  <TabsContent value="brand" className="reveal-up data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95 data-[state=active]:slide-in-from-bottom-2 duration-300">
                    <EnhancedBrandManagement />
                  </TabsContent>

                  <TabsContent value="business-intelligence" className="reveal-up data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95 data-[state=active]:slide-in-from-bottom-2 duration-300">
                    <EnhancedBusinessIntelligence posts={posts} />
                  </TabsContent>

                  <TabsContent value="monitoring" className="reveal-up data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95 data-[state=active]:slide-in-from-bottom-2 duration-300">
                    <EnhancedPerformanceMonitoring posts={posts} />
                  </TabsContent>

                  <TabsContent value="integrations" className="reveal-up data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95 data-[state=active]:slide-in-from-bottom-2 duration-300">
                    <APIIntegrationManager />
                  </TabsContent>

                  {/* Ultra-Advanced New Tab Contents with enhanced animations */}
                  <TabsContent value="content-intelligence" className="reveal-up data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95 data-[state=active]:slide-in-from-bottom-2 duration-300">
                    <UltraAdvancedContentIntelligence
                      posts={posts}
                      onOptimizeContent={(postId, optimizations) => {
                        const post = posts.find(p => p.id === postId)
                        if (post) {
                          updatePost(postId, { ...optimizations })
                          toast.success('Content optimized with AI intelligence')
                        }
                      }}
                      onGenerateVariants={(post) => {
                        // Generate multiple content variants
                        const variants = Array.from({ length: 3 }, (_, i) => ({
                          ...post,
                          id: `${post.id}-variant-${i + 1}`,
                          content: `${post.content} (Variant ${i + 1})`
                        }))
                        variants.forEach(variant => addPost(variant))
                        toast.success(`Generated ${variants.length} content variants`)
                      }}
                    />
                  </TabsContent>

                  <TabsContent value="compliance" className="reveal-up data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95 data-[state=active]:slide-in-from-bottom-2 duration-300">
                    <EnterpriseComplianceCenter
                      posts={posts}
                      onComplianceCheck={(postId, issues) => {
                        if (issues.length > 0) {
                          toast.warning(`${issues.length} compliance issues found`)
                        } else {
                          toast.success('Content meets all compliance requirements')
                        }
                      }}
                      onAutoRemediate={(postId, fixes) => {
                        updatePost(postId, fixes)
                        toast.success('Compliance issues automatically resolved')
                      }}
                    />
                  </TabsContent>

                  <TabsContent value="global-insights" className="reveal-up data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95 data-[state=active]:slide-in-from-bottom-2 duration-300">
                    <GlobalMarketInsights
                      posts={posts}
                      onMarketExpansion={(markets) => {
                        toast.success(`Identified ${markets.length} expansion opportunities`)
                      }}
                    />
                  </TabsContent>

                  <TabsContent value="multilingual" className="reveal-up data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95 data-[state=active]:slide-in-from-bottom-2 duration-300">
                    <MultiLanguageContentManager
                      posts={posts}
                      onTranslateContent={(postId, languages) => {
                        const post = posts.find(p => p.id === postId)
                        if (post) {
                          languages.forEach(lang => {
                            const translatedPost = {
                              ...post,
                              id: `${post.id}-${lang}`,
                              content: `${post.content} (${lang.toUpperCase()})`,
                              language: lang
                            }
                            addPost(translatedPost)
                          })
                          toast.success(`Content translated to ${languages.length} languages`)
                        }
                      }}
                    />
                  </TabsContent>

                  {/* Predictive Content Optimizer Tab with enhanced transitions */}
                  {activeTab === 'predictive-optimizer' && (
                    <div className="reveal-up">
                      <Suspense fallback={<LoadingFallback />}>
                        <PredictiveContentOptimizer
                          posts={posts}
                          onOptimizeContent={(postId, optimizations) => {
                            updatePost(postId, optimizations)
                            toast.success('Content optimized with AI predictions')
                          }}
                          onGenerateVariants={(post) => {
                            const variants = Array.from({ length: 3 }, (_, i) => ({
                              ...post,
                              id: `${post.id}-variant-${i + 1}`,
                              content: `${post.content} (Optimized Variant ${i + 1})`
                            }))
                            variants.forEach(variant => addPost(variant))
                            toast.success(`Generated ${variants.length} optimized variants`)
                          }}
                        />
                      </Suspense>
                    </div>
                  )}

                  <TabsContent value="team" className="reveal-up data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95 data-[state=active]:slide-in-from-bottom-2 duration-300">
                    <AdvancedTeamCollaboration 
                      posts={posts}
                      onCollaborationUpdate={(update) => {
                        toast.success('Team collaboration updated')
                      }}
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </Suspense>

            {/* Ultra-Advanced Floating Panels with sophisticated animations */}
            {aiAssistantExpanded && (
              <div className="fixed right-6 top-20 w-96 h-[600px] glass-intense rounded-lg card-elevation-4 z-40 animate-in slide-in-from-right-full duration-500 ease-out">
                <div className="p-4 border-b glass flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Sparkles size={16} className="text-primary animate-pulse" />
                    AI Content Assistant
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAiAssistantExpanded(false)}
                    className="hover-scale transition-all duration-300 focus-ring"
                  >
                    ×
                  </Button>
                </div>
                <div className="p-4 h-full overflow-auto custom-scrollbar">
                  <Suspense fallback={<LoadingFallback />}>
                    <AIContentAssistant
                      onUseContent={handleUseAIContent}
                      compact={true}
                    />
                  </Suspense>
                </div>
              </div>
            )}

            {collaborationPanelOpen && (
              <div className="fixed right-6 top-20 w-80 h-96 glass-intense rounded-lg card-elevation-4 z-40 animate-in slide-in-from-right-full duration-500 ease-out">
                <div className="p-4 border-b glass flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Users size={16} className="text-primary" />
                    Active Collaborators
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCollaborationPanelOpen(false)}
                    className="hover-scale transition-all duration-300 focus-ring"
                  >
                    ×
                  </Button>
                </div>
                <div className="p-4 custom-scrollbar">
                  {/* Enhanced real-time collaboration indicators */}
                  <div className="space-y-3">
                    {[
                      { name: 'Alex Thompson', status: 'Editing Post #1234', avatar: 'AT', color: 'bg-blue-500' },
                      { name: 'Maria Garcia', status: 'Reviewing Calendar', avatar: 'MG', color: 'bg-green-500' },
                      { name: 'David Kim', status: 'In Analytics Dashboard', avatar: 'DK', color: 'bg-purple-500' }
                    ].map((user, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-all duration-300 hover-lift cursor-pointer stagger-item"
                        style={{'--stagger-delay': index} as React.CSSProperties}
                      >
                        <div className="relative">
                          <Avatar className="w-8 h-8 hover-scale transition-all duration-300">
                            <AvatarFallback className={`text-xs ${user.color} text-white`}>
                              {user.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${user.color} rounded-full border-2 border-background pulse-glow`} />
                        </div>
                        <div className="flex-1 text-sm">
                          <div className="font-medium">{user.name}</div>
                          <div className="text-muted-foreground text-xs">{user.status}</div>
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {analyticsOverlayOpen && (
              <div className="fixed inset-6 glass-intense rounded-lg card-elevation-4 z-50 animate-in fade-in-0 zoom-in-95 duration-500 ease-out modal-backdrop">
                <div className="p-6 border-b glass flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <TrendingUp size={20} className="text-primary" />
                    Real-time Performance Analytics
                  </h2>
                  <Button
                    variant="ghost"
                    onClick={() => setAnalyticsOverlayOpen(false)}
                    className="hover-scale transition-all duration-300 focus-ring"
                  >
                    ×
                  </Button>
                </div>
                <div className="p-6 h-full overflow-auto custom-scrollbar">
                  <Suspense fallback={<LoadingFallback />}>
                    <AdvancedContentAnalytics posts={posts} overlay={true} />
                  </Suspense>
                </div>
              </div>
            )}

            {/* Enhanced Floating Action Button */}
            {floatingButtonVisible && (
              <Button
                onClick={() => handleCreatePost()}
                className={`fab button-primary transition-all duration-500 ${
                  floatingButtonVisible ? 'animate-in zoom-in-0' : 'animate-out zoom-out-0'
                }`}
                size="lg"
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  className="transition-transform group-hover:scale-110"
                >
                  <path 
                    d="M12 5v14m-7-7h14" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            )}

            {/* Client Portal - Hidden tab accessible via direct URL */}
            {activeTab === 'client-portal' && (
              <Suspense fallback={<LoadingFallback />}>
                <ClientPortal
                  posts={posts}
                  onApprovePost={handleApprovePost}
                  onRejectPost={handleRejectPost}
                  onAddComment={(postId, comment) => {
                    toast.success('Comment added successfully')
                  }}
                />
              </Suspense>
            )}
          </main>

          {/* Ultra-Sophisticated Dialog System with enhanced animations */}
          <Suspense fallback={<LoadingFallback />}>
            <PostEditor
              post={editingPost}
              open={showPostEditor}
              onClose={() => {
                setShowPostEditor(false)
                setEditingPost(null)
                setSelectedDate(null)
              }}
              onSave={handleSavePost}
              aiAssistance={currentUser.preferences.aiAssistance}
              advancedFeatures={currentUser.preferences.advancedFeatures}
            />

            <RealtimeCollaboration
              post={commentingPost}
              open={!!commentingPost}
              onClose={() => setCommentingPost(null)}
              currentUser={currentUser}
              collaborators={activeCollaborators}
            />

            <SettingsModal
              open={settingsOpen}
              onClose={() => setSettingsOpen(false)}
              user={currentUser}
              onUpdatePreferences={(prefs) => {
                // Update user preferences with smooth animation
                toast.success('Settings updated successfully')
              }}
              enterpriseFeatures={true}
            />

            <KeyboardShortcuts
              open={shortcutsOpen}
              onClose={() => setShortcutsOpen(false)}
              customShortcuts={[
                { key: '⌘ + ⇧ + A', action: 'Open AI Assistant', category: 'AI' },
                { key: '⌘ + ⇧ + C', action: 'Open Collaboration Panel', category: 'Team' },
                { key: '⌘ + ⇧ + P', action: 'Quick Analytics', category: 'Analytics' },
                { key: '⌘ + ⇧ + W', action: 'Workflow Designer', category: 'Workflows' },
                { key: '⌘ + G', action: 'Toggle Gesture Mode', category: 'Navigation' },
                { key: '⌘ + F', action: 'Toggle Focus Mode', category: 'Productivity' }
              ]}
            />

            <CommandPalette
              open={commandPaletteOpen}
              onClose={() => setCommandPaletteOpen(false)}
              onSwitchTab={setActiveTab}
              onCreatePost={() => handleCreatePost()}
              onOpenSettings={() => setSettingsOpen(true)}
              aiEnabled={true}
              customCommands={[
                {
                  id: 'ai-optimize',
                  title: 'AI Optimize Content',
                  subtitle: 'Use AI to improve your content',
                  action: () => setAiAssistantExpanded(true)
                },
                {
                  id: 'collaboration',
                  title: 'View Active Collaborators',
                  subtitle: 'See who\'s working on content',
                  action: () => setCollaborationPanelOpen(true)
                },
                {
                  id: 'analytics-overlay',
                  title: 'Quick Analytics View',
                  subtitle: 'Real-time performance data',
                  action: () => setAnalyticsOverlayOpen(true)
                },
                {
                  id: 'scroll-to-top',
                  title: 'Scroll to Top',
                  subtitle: 'Smooth scroll to page top',
                  action: () => scrollToTop({ smooth: true, duration: 600 })
                },
                {
                  id: 'toggle-focus',
                  title: 'Toggle Focus Mode',
                  subtitle: 'Minimize distractions',
                  action: () => setFocusMode(!focusMode)
                }
              ]}
            />

            <OnboardingTour
              open={onboardingOpen}
              onClose={() => setOnboardingOpen(false)}
              user={currentUser}
              advancedMode={currentUser.preferences.advancedFeatures}
            />
          </Suspense>

          {/* Ultra-Advanced Toast System with sophisticated styling */}
          <Toaster 
            richColors 
            position="top-right" 
            theme={theme}
            duration={4000}
            toastOptions={{
              className: 'glass-intense card-elevation-2',
              style: {
                background: 'oklch(var(--card))',
                border: '1px solid oklch(var(--border) / 0.5)',
                color: 'oklch(var(--foreground))',
                backdropFilter: 'blur(12px)'
              },
              // Enhanced animations for toasts
              descriptionClassName: 'text-muted-foreground',
              actionProps: {
                className: 'button-primary text-xs'
              }
            }}
          />

          {/* Enhanced Performance Monitoring Overlay */}
          {process.env.NODE_ENV === 'development' && (
            <div className="fixed bottom-4 left-4 glass rounded-lg p-3 text-xs text-muted-foreground z-50 card-elevation-2 transition-all duration-300 hover-lift">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full pulse-glow" />
                  Posts: {posts.length}
                </div>
                <div>Active Tab: {activeTab}</div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
                  Network: {isOnline ? `Online (${connectionQuality})` : 'Offline'}
                </div>
                <div>Theme: {theme}</div>
                <div>Scroll: {Math.round(scrollMetrics.progress * 100)}%</div>
                <div>Collaborators: {activeCollaborators.length}</div>
                {scrollMetrics.isScrolling && (
                  <div className="text-primary animate-pulse">
                    Scrolling {scrollMetrics.scrollDirection}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Scroll Progress Indicator */}
          <div 
            className="fixed top-0 left-0 h-1 bg-gradient-to-r from-primary to-accent z-50 transition-all duration-300"
            style={{ 
              width: `${scrollMetrics.progress * 100}%`,
              opacity: scrollMetrics.isScrolling ? 1 : 0
            }}
          />

          {/* Back to Top Button */}
          {scrollMetrics.scrollY > 500 && (
            <Button
              onClick={() => scrollToTop({ smooth: true, duration: 800 })}
              className="fixed bottom-20 right-6 w-12 h-12 rounded-full glass-intense hover-scale transition-all duration-300 focus-ring z-40"
              size="sm"
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                className="transition-transform group-hover:-translate-y-1"
              >
                <path 
                  d="m18 15-6-6-6 6" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          )}
        </div>
      </TooltipProvider>
    </ErrorBoundary>
  )
}

export default App