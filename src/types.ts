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
  regulation: string
  status: 'passed' | 'warning' | 'failed'
  issues?: string[]
  fixedAt?: Date
  checkedAt: Date
}

export interface PostVersion {
  id: string
  content: string
  createdAt: Date
  createdBy: string
  changes: string[]
  isActive: boolean
}

export interface Approval {
  id: string
  approverId: string
  approver?: User
  status: 'pending' | 'approved' | 'rejected'
  comment?: string
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  id: string
  authorId: string
  author?: User
  content: string
  parentId?: string
  mentions?: string[]
  reactions?: Reaction[]
  resolved?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Reaction {
  type: 'like' | 'love' | 'laugh' | 'celebrate' | 'support' | 'insightful'
  userId: string
  createdAt: Date
}

export interface TargetAudience {
  demographics: {
    ageRange?: [number, number]
    gender?: 'all' | 'male' | 'female' | 'non-binary'
    locations?: string[]
    languages?: string[]
  }
  interests?: string[]
  behaviors?: string[]
  customAudiences?: string[]
  lookalike?: boolean
}

export interface BrandGuideline {
  id: string
  type: 'color' | 'font' | 'tone' | 'logo' | 'imagery' | 'messaging'
  rules: string[]
  approved: boolean
  createdAt: Date
}

export interface Workspace {
  id: string
  name: string
  description?: string
  ownerId: string
  members: WorkspaceMember[]
  settings: WorkspaceSettings
  brandGuidelines?: BrandGuideline[]
  approvalWorkflows: ApprovalWorkflow[]
  createdAt: Date
  updatedAt: Date
}

export interface WorkspaceMember {
  userId: string
  user?: User
  role: UserRole
  permissions: string[]
  joinedAt: Date
}

export interface WorkspaceSettings {
  timezone: string
  language: string
  currency: string
  approvalRequired: boolean
  aiAssistanceEnabled: boolean
  complianceEnabled: boolean
  analyticsEnabled: boolean
  brandProtectionEnabled: boolean
}

export interface ApprovalWorkflow {
  id: string
  name: string
  steps: ApprovalStep[]
  conditions?: WorkflowCondition[]
  isDefault: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ApprovalStep {
  id: string
  name: string
  approvers: string[]
  requiredApprovals: number
  order: number
  autoApprove?: boolean
  conditions?: string[]
  timeoutHours?: number
}

export interface WorkflowCondition {
  field: string
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than'
  value: any
}

export interface Campaign {
  id: string
  name: string
  description?: string
  objective: string
  budget?: number
  startDate: Date
  endDate?: Date
  posts: string[]
  metrics?: CampaignMetrics
  status: 'draft' | 'active' | 'paused' | 'completed'
  createdAt: Date
  updatedAt: Date
}

export interface CampaignMetrics {
  totalReach: number
  totalImpressions: number
  totalEngagement: number
  totalSpend: number
  roi: number
  conversionRate: number
  costPerEngagement: number
  brandLift?: number
}

export interface AnalyticsReport {
  id: string
  name: string
  type: 'post' | 'campaign' | 'audience' | 'competitor' | 'custom'
  dateRange: { start: Date; end: Date }
  filters: Record<string, any>
  data: any
  insights: string[]
  recommendations: string[]
  createdAt: Date
  scheduled?: boolean
  recipients?: string[]
}

export interface Notification {
  id: string
  userId: string
  type: 'post_approved' | 'post_rejected' | 'comment_added' | 'mention' | 'campaign_complete' | 'compliance_issue'
  title: string
  message: string
  data?: any
  read: boolean
  actionUrl?: string
  createdAt: Date
}

export interface Integration {
  id: string
  platform: Platform
  accountId: string
  accountName: string
  accessToken?: string
  refreshToken?: string
  expiresAt?: Date
  status: 'connected' | 'expired' | 'error' | 'disconnected'
  permissions: string[]
  lastSync?: Date
  createdAt: Date
  updatedAt: Date
}

export interface ContentTemplate {
  id: string
  name: string
  category: string
  content: string
  platforms: Platform[]
  tags?: string[]
  variables?: TemplateVariable[]
  previewImage?: string
  usage: number
  rating?: number
  createdBy: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

export interface TemplateVariable {
  name: string
  type: 'text' | 'number' | 'date' | 'select' | 'media'
  required: boolean
  defaultValue?: any
  options?: string[]
  description?: string
}

export interface ContentCalendar {
  id: string
  workspaceId: string
  view: 'month' | 'week' | 'day' | 'agenda'
  filters: CalendarFilter[]
  settings: CalendarSettings
  createdAt: Date
  updatedAt: Date
}

export interface CalendarFilter {
  field: string
  value: any
  operator: 'equals' | 'contains' | 'in'
}

export interface CalendarSettings {
  showWeekends: boolean
  startWeek: 'sunday' | 'monday'
  timeFormat: '12h' | '24h'
  showPlatformColors: boolean
  showMetrics: boolean
  compactView: boolean
}

export interface AIPrompt {
  id: string
  type: 'content_generation' | 'optimization' | 'analysis' | 'translation'
  input: string
  output: string
  model: string
  parameters: Record<string, any>
  confidence?: number
  feedback?: 'positive' | 'negative' | 'neutral'
  createdAt: Date
}

// Enhanced types for ultra-advanced features
export interface ContentIntelligence {
  sentimentAnalysis: SentimentAnalysis
  performancePrediction: PerformancePrediction
  trendAnalysis: TrendAnalysis
  competitorInsights: CompetitorInsights
  audienceInsights: AudienceInsights
}

export interface SentimentAnalysis {
  overall: number
  emotions: Record<string, number>
  tone: 'professional' | 'casual' | 'humorous' | 'serious' | 'inspirational'
  brandVoiceAlignment: number
  recommendations: string[]
}

export interface PerformancePrediction {
  expectedReach: number
  expectedEngagement: number
  confidenceInterval: [number, number]
  factors: PredictionFactor[]
  optimalTiming: Date[]
  scoringModel: string
}

export interface PredictionFactor {
  name: string
  impact: number
  confidence: number
  description: string
}

export interface TrendAnalysis {
  emergingHashtags: TrendingHashtag[]
  topicTrends: TopicTrend[]
  seasonalPatterns: SeasonalPattern[]
  viralContent: ViralContent[]
}

export interface TrendingHashtag {
  hashtag: string
  growth: number
  volume: number
  engagement: number
  relevanceScore: number
}

export interface TopicTrend {
  topic: string
  momentum: number
  peakPrediction: Date
  relatedKeywords: string[]
  opportunityScore: number
}

export interface SeasonalPattern {
  pattern: string
  months: number[]
  multiplier: number
  confidence: number
}

export interface ViralContent {
  id: string
  platform: Platform
  type: string
  characteristics: string[]
  viralityScore: number
  replicabilityScore: number
}

export interface CompetitorInsights {
  competitors: Competitor[]
  benchmarks: Benchmark[]
  opportunities: Opportunity[]
  threats: Threat[]
}

export interface Competitor {
  id: string
  name: string
  platforms: Platform[]
  followers: Record<Platform, number>
  engagement: Record<Platform, number>
  postingFrequency: Record<Platform, number>
  topContent: CompetitorContent[]
  strengths: string[]
  weaknesses: string[]
}

export interface CompetitorContent {
  id: string
  platform: Platform
  content: string
  engagement: number
  viralityScore: number
  insights: string[]
}

export interface Benchmark {
  metric: string
  industry: number
  competitors: number
  yourValue: number
  percentile: number
}

export interface Opportunity {
  type: string
  description: string
  potential: number
  effort: number
  priority: 'low' | 'medium' | 'high'
  timeline: string
}

export interface Threat {
  type: string
  description: string
  severity: number
  likelihood: number
  mitigation: string[]
}

export interface AudienceInsights {
  demographics: AudienceDemographics
  psychographics: AudiencePsychographics
  behavior: AudienceBehavior
  preferences: AudiencePreferences
  segments: AudienceSegment[]
}

export interface AudienceDemographics {
  age: Record<string, number>
  gender: Record<string, number>
  location: Record<string, number>
  education: Record<string, number>
  income: Record<string, number>
}

export interface AudiencePsychographics {
  interests: Record<string, number>
  values: Record<string, number>
  lifestyle: Record<string, number>
  personality: Record<string, number>
}

export interface AudienceBehavior {
  activeHours: Record<string, number>
  platformUsage: Record<Platform, number>
  contentPreferences: Record<string, number>
  engagementPatterns: Record<string, number>
}

export interface AudiencePreferences {
  contentTypes: Record<string, number>
  topics: Record<string, number>
  formats: Record<string, number>
  tones: Record<string, number>
}

export interface AudienceSegment {
  id: string
  name: string
  size: number
  characteristics: string[]
  preferences: AudiencePreferences
  value: number
  growth: number
}

export interface GlobalMarketData {
  regions: MarketRegion[]
  currencies: Currency[]
  regulations: Regulation[]
  culturalFactors: CulturalFactor[]
  localizationOpportunities: LocalizationOpportunity[]
}

export interface MarketRegion {
  id: string
  name: string
  countries: string[]
  marketSize: number
  growth: number
  competitionLevel: number
  entryBarriers: string[]
  opportunities: string[]
  platforms: PlatformData[]
}

export interface PlatformData {
  platform: Platform
  users: number
  growth: number
  demographics: Record<string, number>
  adCosts: Record<string, number>
}

export interface Currency {
  code: string
  name: string
  exchangeRate: number
  volatility: number
}

export interface Regulation {
  id: string
  name: string
  region: string
  type: 'privacy' | 'advertising' | 'content' | 'accessibility'
  requirements: string[]
  penalties: string[]
  compliance: boolean
}

export interface CulturalFactor {
  region: string
  factor: string
  impact: number
  recommendations: string[]
}

export interface LocalizationOpportunity {
  region: string
  language: string
  marketSize: number
  competition: number
  effort: 'low' | 'medium' | 'high'
  roi: number
  recommendations: string[]
}

export interface MultiLanguageContent {
  originalLanguage: string
  translations: Translation[]
  globalStrategy: GlobalStrategy
  culturalAdaptations: CulturalAdaptation[]
}

export interface Translation {
  language: string
  content: string
  translator: 'ai' | 'human' | 'hybrid'
  quality: number
  reviewed: boolean
  culturallyAdapted: boolean
  createdAt: Date
  updatedAt: Date
}

export interface GlobalStrategy {
  primaryMarkets: string[]
  secondaryMarkets: string[]
  contentStrategy: 'global' | 'glocal' | 'local'
  brandConsistency: number
  localRelevance: number
}

export interface CulturalAdaptation {
  region: string
  adaptations: {
    colors?: string[]
    imagery?: string[]
    messaging?: string[]
    timing?: string[]
    holidays?: string[]
    customs?: string[]
  }
  approvalRequired: boolean
}

// Advanced workflow types
export interface WorkflowOrchestration {
  workflows: AdvancedWorkflow[]
  triggers: WorkflowTrigger[]
  conditions: WorkflowCondition[]
  actions: WorkflowAction[]
  integrations: WorkflowIntegration[]
}

export interface AdvancedWorkflow {
  id: string
  name: string
  description: string
  type: 'content' | 'approval' | 'publishing' | 'analytics' | 'compliance'
  steps: WorkflowStep[]
  triggers: string[]
  conditions: string[]
  schedule?: WorkflowSchedule
  isActive: boolean
  metrics: WorkflowMetrics
  createdAt: Date
  updatedAt: Date
}

export interface WorkflowStep {
  id: string
  name: string
  type: 'manual' | 'automated' | 'ai' | 'integration'
  config: Record<string, any>
  nextSteps: string[]
  failureSteps: string[]
  timeout?: number
  retries?: number
}

export interface WorkflowTrigger {
  id: string
  type: 'event' | 'schedule' | 'webhook' | 'manual'
  config: Record<string, any>
  isActive: boolean
}

export interface WorkflowAction {
  id: string
  type: 'notification' | 'api_call' | 'content_update' | 'approval_request' | 'publish'
  config: Record<string, any>
  retryPolicy?: RetryPolicy
}

export interface WorkflowIntegration {
  id: string
  service: string
  config: Record<string, any>
  authentication: Record<string, any>
  status: 'active' | 'inactive' | 'error'
}

export interface WorkflowSchedule {
  type: 'once' | 'recurring'
  startDate: Date
  endDate?: Date
  pattern?: string
  timezone: string
}

export interface WorkflowMetrics {
  executions: number
  successRate: number
  averageDuration: number
  errorRate: number
  lastExecution?: Date
}

export interface RetryPolicy {
  maxRetries: number
  backoffStrategy: 'fixed' | 'exponential' | 'linear'
  baseDelay: number
  maxDelay: number
}