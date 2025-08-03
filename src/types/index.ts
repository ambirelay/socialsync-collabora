export type Platform = 
  | 'instagram' 
  | 'facebook' 
  | 'twitter' 
  | 'linkedin' 
  | 'tiktok' 
  | 'youtube' 
  | 'pinterest'
  | 'snapchat'
  | 'threads'
  | 'google-business'
  | 'telegram'

export type PostStatus = 
  | 'draft' 
  | 'scheduled' 
  | 'published' 
  | 'failed' 
  | 'pending' 
  | 'approved' 
  | 'rejected'
  | 'archived'
  | 'paused'

export type UserRole = 
  | 'admin' 
  | 'editor' 
  | 'viewer' 
  | 'client'
  | 'content-creator'
  | 'brand-manager'
  | 'compliance-officer'
  | 'analyst'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
  permissions: string[]
  timezone: string
  language: string
  department?: string
  lastActive: Date
  preferences: UserPreferences
  createdAt: Date
  updatedAt: Date
}

export interface UserPreferences {
  defaultView: 'dashboard' | 'calendar' | 'feed'
  notifications: boolean
  aiAssistance: boolean
  advancedFeatures: boolean
  theme: 'light' | 'dark' | 'auto'
  timezone: string
  language: string
  compactMode: boolean
  focusMode: boolean
}

export interface Post {
  id: string
  content: string
  platforms: Platform[]
  status: PostStatus
  scheduledDate?: string
  publishedDate?: string
  createdAt: string
  updatedAt: string
  authorId: string
  author?: User
  media?: MediaAsset[]
  hashtags?: string[]
  mentions?: string[]
  location?: Location
  campaign?: string
  tags?: string[]
  metrics?: PostMetrics
  aiOptimizations?: AIOptimization[]
  complianceChecks?: ComplianceCheck[]
  versions?: PostVersion[]
  collaborators?: string[]
  approvals?: Approval[]
  comments?: Comment[]
  language?: string
  targetAudience?: TargetAudience
  brandGuidelines?: BrandGuideline[]
}

export interface MediaAsset {
  id: string
  type: 'image' | 'video' | 'gif' | 'document'
  url: string
  thumbnailUrl?: string
  altText?: string
  caption?: string
  size: number
  dimensions?: { width: number; height: number }
  duration?: number
  metadata?: Record<string, any>
  tags?: string[]
  aiGenerated?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Location {
  id: string
  name: string
  coordinates?: { lat: number; lng: number }
  address?: string
  placeId?: string
}

export interface PostMetrics {
  reach: number
  impressions: number
  engagement: number
  likes: number
  comments: number
  shares: number
  saves: number
  clicks: number
  views?: number
  engagementRate: number
  ctr?: number
  cpm?: number
  spend?: number
  conversions?: number
  revenue?: number
  sentimentScore?: number
  viralityScore?: number
  qualityScore?: number
  lastUpdated: Date
}

export interface AIOptimization {
  id: string
  type: 'hashtags' | 'timing' | 'content' | 'media' | 'targeting'
  recommendation: string
  impact: 'low' | 'medium' | 'high'
  confidence: number
  appliedAt?: Date
  results?: any
}

export interface ComplianceCheck {
  id: string
  type: 'content' | 'media' | 'legal' | 'brand' | 'accessibility'
  status: 'pending' | 'passed' | 'failed' | 'warning'
  issues: ComplianceIssue[]
  checkedAt: Date
  checkedBy: string
}

export interface ComplianceIssue {
  id: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: string
  description: string
  recommendation?: string
  autoFixable: boolean
}

export interface PostVersion {
  id: string
  version: number
  content: string
  changes: string[]
  createdAt: Date
  createdBy: string
}

export interface Approval {
  id: string
  postId: string
  reviewerId: string
  reviewer: User
  status: 'pending' | 'approved' | 'rejected'
  note?: string
  createdAt: string
  decidedAt?: string
}

export interface Comment {
  id: string
  postId: string
  authorId: string
  author: User
  content: string
  createdAt: string
  updatedAt?: string
  parentId?: string
  mentions?: string[]
  reactions?: Reaction[]
}

export interface Reaction {
  id: string
  type: 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry'
  userId: string
  createdAt: string
}

export interface TargetAudience {
  id: string
  name: string
  demographics: {
    ageRange: string
    gender: string[]
    location: string[]
    interests: string[]
    languages: string[]
  }
  behaviors: {
    deviceUsage: string[]
    platformPreferences: Platform[]
    engagementPatterns: string[]
  }
}

export interface BrandGuideline {
  id: string
  type: 'tone' | 'visual' | 'messaging' | 'compliance'
  title: string
  description: string
  rules: string[]
  examples: any[]
  mandatory: boolean
}

export interface Campaign {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  budget?: number
  objectives: string[]
  platforms: Platform[]
  targetAudience: TargetAudience
  posts: string[]
  metrics: CampaignMetrics
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface CampaignMetrics {
  reach: number
  impressions: number
  engagement: number
  clicks: number
  conversions: number
  spend: number
  roi: number
  cpa: number
  ctr: number
  engagementRate: number
}

export interface Workspace {
  id: string
  name: string
  description?: string
  ownerId: string
  members: WorkspaceMember[]
  settings: WorkspaceSettings
  subscription: WorkspaceSubscription
  createdAt: string
  updatedAt: string
}

export interface WorkspaceMember {
  userId: string
  user: User
  role: UserRole
  permissions: string[]
  joinedAt: string
  invitedBy: string
}

export interface WorkspaceSettings {
  timezone: string
  defaultLanguage: string
  brandColors: string[]
  logoUrl?: string
  requireApproval: boolean
  allowClientAccess: boolean
  aiFeatures: boolean
  complianceChecks: boolean
}

export interface WorkspaceSubscription {
  plan: 'free' | 'pro' | 'enterprise'
  status: 'active' | 'cancelled' | 'suspended'
  currentPeriodStart: string
  currentPeriodEnd: string
  limits: {
    posts: number
    users: number
    storage: number
    aiRequests: number
  }
}

export interface Notification {
  id: string
  type: 'comment' | 'approval' | 'mention' | 'publish' | 'schedule' | 'system'
  title: string
  message: string
  data?: any
  read: boolean
  userId: string
  createdAt: string
  actionUrl?: string
}

export interface APIIntegration {
  id: string
  platform: Platform
  name: string
  status: 'connected' | 'disconnected' | 'error'
  credentials: any
  permissions: string[]
  lastSync?: string
  createdAt: string
  updatedAt: string
}

// Analytics and insights interfaces
export interface ContentInsight {
  id: string
  type: 'performance' | 'audience' | 'optimization' | 'trend'
  title: string
  description: string
  data: any
  confidence: number
  actionable: boolean
  recommendations: string[]
  generatedAt: string
}

export interface AudienceInsight {
  id: string
  segment: string
  demographics: any
  interests: string[]
  behavior: any
  growth: number
  engagement: number
  recommendations: string[]
}

export interface TrendInsight {
  id: string
  trend: string
  category: string
  momentum: 'rising' | 'falling' | 'stable'
  confidence: number
  relevanceScore: number
  suggestions: string[]
  data: any
}

// Workflow and automation interfaces
export interface Workflow {
  id: string
  name: string
  description: string
  trigger: WorkflowTrigger
  actions: WorkflowAction[]
  conditions?: WorkflowCondition[]
  status: 'active' | 'inactive' | 'error'
  runsCount: number
  lastRun?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface WorkflowTrigger {
  type: 'schedule' | 'post_created' | 'post_approved' | 'comment_added' | 'metric_threshold'
  config: any
}

export interface WorkflowAction {
  id: string
  type: 'publish' | 'notify' | 'approve' | 'assign' | 'tag' | 'ai_optimize'
  config: any
  order: number
}

export interface WorkflowCondition {
  id: string
  field: string
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in'
  value: any
}

// AI and ML interfaces
export interface AIModel {
  id: string
  name: string
  type: 'content_generation' | 'optimization' | 'analysis' | 'translation' | 'moderation'
  version: string
  capabilities: string[]
  limits: {
    requestsPerHour: number
    requestsPerDay: number
    maxTokens: number
  }
  config: any
}

export interface AIRequest {
  id: string
  modelId: string
  type: string
  input: any
  output?: any
  status: 'pending' | 'processing' | 'completed' | 'failed'
  tokensUsed?: number
  processingTime?: number
  createdAt: string
  completedAt?: string
}

// Security and compliance interfaces
export interface SecurityEvent {
  id: string
  type: 'login' | 'permission_change' | 'data_access' | 'export' | 'deletion'
  severity: 'low' | 'medium' | 'high' | 'critical'
  userId: string
  description: string
  metadata: any
  ipAddress: string
  userAgent: string
  createdAt: string
}

export interface ComplianceReport {
  id: string
  type: 'gdpr' | 'ccpa' | 'brand' | 'content' | 'accessibility'
  status: 'compliant' | 'non_compliant' | 'needs_review'
  issues: ComplianceIssue[]
  recommendations: string[]
  generatedAt: string
  generatedBy: string
  validUntil: string
}

// Performance and monitoring interfaces
export interface PerformanceMetric {
  id: string
  type: 'response_time' | 'error_rate' | 'throughput' | 'availability' | 'memory_usage'
  value: number
  unit: string
  timestamp: string
  metadata?: any
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down'
  uptime: number
  responseTime: number
  errorRate: number
  lastCheck: string
  services: ServiceHealth[]
}

export interface ServiceHealth {
  name: string
  status: 'healthy' | 'degraded' | 'down'
  responseTime: number
  errorRate: number
  lastCheck: string
}

// Global Market Intelligence interfaces
export interface GlobalMarketData {
  regions: MarketRegion[]
  trends: MarketTrend[]
  opportunities: LocalizationOpportunity[]
  competitiveInsights: CompetitiveInsight[]
  lastUpdated: string
}

export interface MarketRegion {
  id: string
  name: string
  code: string
  countries: string[]
  demographics: {
    population: number
    internetPenetration: number
    socialMediaUsage: number
    primaryLanguages: string[]
    averageAge: number
    incomeLevel: 'low' | 'medium' | 'high'
  }
  platforms: {
    platform: Platform
    userCount: number
    growthRate: number
    engagementRate: number
    primaryAgeGroups: string[]
  }[]
  culturalFactors: {
    communicationStyle: string
    colorPreferences: string[]
    contentPreferences: string[]
    timeZones: string[]
    businessHours: string
  }
  competitiveLevel: 'low' | 'medium' | 'high' | 'saturated'
  entryBarriers: string[]
  opportunities: string[]
  risks: string[]
}

export interface MarketTrend {
  id: string
  name: string
  category: string
  regions: string[]
  momentum: 'rising' | 'falling' | 'stable'
  confidence: number
  timeframe: string
  description: string
  implications: string[]
  relevantPlatforms: Platform[]
}

export interface LocalizationOpportunity {
  id: string
  region: string
  platform: Platform
  opportunity: string
  potentialReach: number
  estimatedROI: number
  difficulty: 'easy' | 'medium' | 'hard'
  timeline: string
  requirements: string[]
  successMetrics: string[]
  examples: {
    brand: string
    approach: string
    results: string
  }[]
}

export interface CompetitiveInsight {
  id: string
  region: string
  platform: Platform
  competitorCount: number
  marketShare: {
    brand: string
    percentage: number
    strategy: string
  }[]
  contentGaps: string[]
  pricingInsights: any
  recommendedStrategy: string
}

// Multi-language content interfaces
export interface MultiLanguageContent {
  id: string
  originalPostId: string
  language: string
  content: string
  status: 'draft' | 'translated' | 'reviewed' | 'approved'
  translator: string
  reviewedBy?: string
  culturalAdaptations: CulturalAdaptation[]
  qualityScore: number
  translatedAt: string
  reviewedAt?: string
}

export interface Translation {
  id: string
  sourceText: string
  targetLanguage: string
  translatedText: string
  confidence: number
  method: 'human' | 'ai' | 'hybrid'
  context: string
  glossaryTerms: GlossaryTerm[]
  culturalNotes: string[]
  createdAt: string
  updatedAt: string
}

export interface CulturalAdaptation {
  type: 'color' | 'imagery' | 'messaging' | 'timing' | 'platform'
  original: string
  adapted: string
  reason: string
  confidence: number
}

export interface GlossaryTerm {
  term: string
  translation: string
  context: string
  domain: string
  approved: boolean
}

export interface GlobalStrategy {
  id: string
  name: string
  description: string
  targetRegions: string[]
  phases: StrategyPhase[]
  budget: {
    total: number
    byRegion: { region: string; amount: number }[]
    byPhase: { phase: string; amount: number }[]
  }
  timeline: {
    start: string
    end: string
    milestones: Milestone[]
  }
  success: SuccessMetric[]
  risks: Risk[]
  status: 'planning' | 'active' | 'paused' | 'completed'
}

export interface StrategyPhase {
  id: string
  name: string
  description: string
  duration: string
  deliverables: string[]
  success: string[]
  dependencies: string[]
}

export interface Milestone {
  id: string
  name: string
  description: string
  dueDate: string
  status: 'pending' | 'in-progress' | 'completed' | 'delayed'
  dependencies: string[]
}

export interface SuccessMetric {
  name: string
  target: number
  current: number
  unit: string
  trend: 'up' | 'down' | 'stable'
}

export interface Risk {
  id: string
  description: string
  probability: 'low' | 'medium' | 'high'
  impact: 'low' | 'medium' | 'high'
  mitigation: string
  status: 'identified' | 'mitigated' | 'realized'
}

// Operational Transform and Collaboration interfaces
export interface Operation {
  id: string
  type: OperationType
  position: number
  content?: string
  length?: number
  userId: string
  timestamp: number
  clientId: string
  version: number
  metadata?: OperationMetadata
}

export type OperationType = 
  | 'insert'
  | 'delete' 
  | 'retain'
  | 'format'
  | 'move'
  | 'replace'
  | 'attribute'

export interface OperationMetadata {
  cursor?: { start: number; end: number }
  formatting?: TextFormatting
  selection?: TextSelection
  context?: string
}

export interface TextFormatting {
  bold?: boolean
  italic?: boolean
  underline?: boolean
  color?: string
  backgroundColor?: string
  fontSize?: number
  fontFamily?: string
}

export interface TextSelection {
  start: number
  end: number
  direction: 'forward' | 'backward' | 'none'
}

export interface OperationTransform {
  original: Operation
  transformed: Operation
  priority: number
  conflictResolution?: ConflictResolution
}

export type ConflictType =
  | 'concurrent_edit'
  | 'position_shift'
  | 'content_overlap'
  | 'format_conflict'
  | 'permission_conflict'

export interface OperationConflict {
  id: string
  type: ConflictType
  operations: Operation[]
  severity: 'low' | 'medium' | 'high' | 'critical'
  resolution: ConflictResolution
  detectedAt: number
  resolvedAt?: number
}

export interface ConflictResolution {
  strategy: 'merge' | 'override' | 'revert' | 'manual'
  winner?: Operation
  merged?: Operation
  reason: string
  confidence: number
}