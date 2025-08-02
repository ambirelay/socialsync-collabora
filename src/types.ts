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

// Real-time collaboration types
export interface CollaborationSession {
  id: string
  postId: string
  participants: Participant[]
  document: CollaborativeDocument
  operations: Operation[]
  conflictResolution: ConflictResolution
  cursors: Cursor[]
  selections: Selection[]
  locks: ContentLock[]
  version: number
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

export interface Participant {
  id: string
  userId: string
  user: User
  sessionId: string
  cursor: Cursor
  selection?: Selection
  isActive: boolean
  lastSeen: Date
  permissions: CollaborationPermission[]
  color: string
  joinedAt: Date
}

export interface CollaborativeDocument {
  id: string
  postId: string
  content: DocumentContent
  structure: DocumentStructure
  metadata: DocumentMetadata
  version: number
  checksum: string
  operations: Operation[]
  branches: DocumentBranch[]
  mergeState: MergeState
}

export interface DocumentContent {
  text: string
  formatting: FormatRange[]
  media: MediaReference[]
  links: LinkReference[]
  mentions: MentionReference[]
  hashtags: HashtagReference[]
}

export interface DocumentStructure {
  blocks: ContentBlock[]
  hierarchy: BlockHierarchy[]
  ordering: number[]
  dependencies: BlockDependency[]
}

export interface DocumentMetadata {
  language: string
  wordCount: number
  characterCount: number
  readingTime: number
  complexity: number
  sentiment: number
  lastEditBy: string
  lastEditAt: Date
}

export interface ContentBlock {
  id: string
  type: 'text' | 'media' | 'link' | 'hashtag' | 'mention' | 'poll' | 'location'
  content: any
  position: BlockPosition
  formatting: BlockFormatting
  metadata: BlockMetadata
  version: number
  lockId?: string
  editedBy?: string
  editedAt?: Date
}

export interface BlockPosition {
  line: number
  column: number
  offset: number
  length: number
}

export interface BlockFormatting {
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  color?: string
  backgroundColor?: string
  fontSize?: number
  fontFamily?: string
  alignment?: 'left' | 'center' | 'right' | 'justify'
}

export interface BlockMetadata {
  created: Date
  modified: Date
  author: string
  comments: string[]
  suggestions: string[]
  aiGenerated: boolean
}

export interface BlockHierarchy {
  blockId: string
  parentId?: string
  children: string[]
  level: number
  order: number
}

export interface BlockDependency {
  blockId: string
  dependsOn: string[]
  type: 'reference' | 'sequence' | 'condition'
}

export interface Operation {
  id: string
  type: OperationType
  sessionId: string
  userId: string
  timestamp: Date
  data: OperationData
  position: OperationPosition
  metadata: OperationMetadata
  applied: boolean
  acknowledged: AcknowledgmentStatus
  conflicts: OperationConflict[]
  transformations: OperationTransform[]
}

export type OperationType = 
  | 'insert' 
  | 'delete' 
  | 'retain' 
  | 'format' 
  | 'move' 
  | 'replace'
  | 'split'
  | 'merge'
  | 'lock'
  | 'unlock'

export interface OperationData {
  content?: string
  attributes?: Record<string, any>
  length?: number
  blockId?: string
  newBlockId?: string
  formatting?: BlockFormatting
  media?: MediaReference
  link?: LinkReference
}

export interface OperationPosition {
  start: number
  end?: number
  blockId?: string
  path?: number[]
  anchor?: PositionAnchor
}

export interface PositionAnchor {
  blockId: string
  offset: number
  side: 'before' | 'after'
}

export interface OperationMetadata {
  source: 'user' | 'ai' | 'system' | 'sync'
  device: string
  browser?: string
  intention?: 'typing' | 'paste' | 'format' | 'undo' | 'redo'
  groupId?: string
  priority: number
  retries: number
}

export interface AcknowledgmentStatus {
  sent: boolean
  received: boolean
  applied: boolean
  failed: boolean
  error?: string
  participants: Record<string, boolean>
}

export interface OperationConflict {
  id: string
  conflictingOperation: string
  type: ConflictType
  severity: 'low' | 'medium' | 'high' | 'critical'
  resolution: ConflictResolutionStrategy
  resolvedBy?: string
  resolvedAt?: Date
  data: any
}

export type ConflictType =
  | 'concurrent_edit'
  | 'position_mismatch'
  | 'content_overlap'
  | 'format_conflict'
  | 'structure_change'
  | 'permission_conflict'
  | 'version_mismatch'
  | 'network_partition'

export interface ConflictResolution {
  strategy: ConflictResolutionStrategy
  rules: ResolutionRule[]
  customHandlers: CustomHandler[]
  fallbackStrategy: ConflictResolutionStrategy
  autoResolve: boolean
  requiresManualReview: string[]
}

export type ConflictResolutionStrategy =
  | 'last_write_wins'
  | 'first_write_wins'
  | 'operational_transform'
  | 'three_way_merge'
  | 'manual_resolution'
  | 'priority_based'
  | 'semantic_merge'
  | 'ai_mediated'

export interface ResolutionRule {
  condition: string
  action: string
  priority: number
  automatic: boolean
}

export interface CustomHandler {
  name: string
  type: ConflictType
  handler: string
  config: Record<string, any>
}

export interface OperationTransform {
  originalOp: string
  transformedOp: Operation
  transformType: TransformType
  reason: string
  confidence: number
  appliedAt: Date
}

export type TransformType =
  | 'position_shift'
  | 'content_merge'
  | 'format_override'
  | 'structure_adapt'
  | 'conflict_resolve'
  | 'semantic_preserve'

export interface Cursor {
  id: string
  userId: string
  position: CursorPosition
  selection?: Selection
  color: string
  label: string
  avatar?: string
  isActive: boolean
  lastMoved: Date
  blinkState: boolean
  tool?: EditorTool
}

export interface CursorPosition {
  line: number
  column: number
  offset: number
  blockId?: string
  elementPath?: number[]
  virtualPosition?: VirtualPosition
}

export interface VirtualPosition {
  x: number
  y: number
  height: number
  baseline: number
}

export interface Selection {
  id: string
  userId: string
  start: CursorPosition
  end: CursorPosition
  direction: 'forward' | 'backward'
  type: 'text' | 'block' | 'media' | 'multi'
  content?: string
  blocks?: string[]
  isCollapsed: boolean
  color: string
  opacity: number
  createdAt: Date
  updatedAt: Date
}

export interface ContentLock {
  id: string
  userId: string
  blockId: string
  type: 'edit' | 'format' | 'move' | 'delete'
  position?: OperationPosition
  duration: number
  expiresAt: Date
  reason?: string
  priority: number
  isBreakable: boolean
  metadata: Record<string, any>
}

export interface DocumentBranch {
  id: string
  name: string
  parentBranch?: string
  operations: Operation[]
  participants: string[]
  conflicts: OperationConflict[]
  mergeRequests: MergeRequest[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface MergeState {
  inProgress: boolean
  branches: string[]
  strategy: ConflictResolutionStrategy
  conflicts: OperationConflict[]
  resolution: Record<string, any>
  autoMerge: boolean
  requiredApprovals: string[]
  approvals: Record<string, boolean>
  startedBy: string
  startedAt?: Date
  completedAt?: Date
}

export interface MergeRequest {
  id: string
  sourceBranch: string
  targetBranch: string
  requestedBy: string
  approvers: string[]
  conflicts: OperationConflict[]
  resolutions: Record<string, any>
  status: 'pending' | 'approved' | 'rejected' | 'merged'
  createdAt: Date
  updatedAt: Date
}

export interface EditorTool {
  type: 'cursor' | 'select' | 'format' | 'comment' | 'suggest' | 'ai'
  mode?: 'insert' | 'overwrite' | 'select'
  options?: Record<string, any>
}

export interface CollaborationPermission {
  type: 'read' | 'edit' | 'format' | 'comment' | 'suggest' | 'approve' | 'admin'
  scope: 'global' | 'block' | 'section'
  blockIds?: string[]
  restrictions?: string[]
  expiry?: Date
}

export interface MediaReference {
  id: string
  type: 'image' | 'video' | 'gif' | 'audio' | 'document'
  url: string
  position: BlockPosition
  metadata: Record<string, any>
  alt?: string
  caption?: string
}

export interface LinkReference {
  id: string
  url: string
  title?: string
  position: BlockPosition
  preview?: LinkPreview
  metadata: Record<string, any>
}

export interface LinkPreview {
  title: string
  description: string
  image?: string
  domain: string
  type: string
}

export interface MentionReference {
  id: string
  userId: string
  username: string
  displayName: string
  position: BlockPosition
  notified: boolean
  metadata: Record<string, any>
}

export interface HashtagReference {
  id: string
  hashtag: string
  position: BlockPosition
  trending: boolean
  volume?: number
  metadata: Record<string, any>
}

export interface FormatRange {
  start: number
  end: number
  type: string
  attributes: Record<string, any>
  applied: boolean
  priority: number
}

// Collaboration Analytics
export interface CollaborationAnalytics {
  session: SessionAnalytics
  participants: ParticipantAnalytics[]
  operations: OperationAnalytics
  conflicts: ConflictAnalytics
  performance: PerformanceAnalytics
  insights: CollaborationInsight[]
}

export interface SessionAnalytics {
  duration: number
  activeTime: number
  totalOperations: number
  conflictRate: number
  resolutionTime: number
  participantCount: number
  peakConcurrency: number
  qualityScore: number
}

export interface ParticipantAnalytics {
  userId: string
  operationsCount: number
  conflictsCreated: number
  conflictsResolved: number
  activeTime: number
  effectiveTime: number
  collaborationScore: number
  contributions: ContributionMetrics
}

export interface ContributionMetrics {
  charactersAdded: number
  charactersDeleted: number
  formattingChanges: number
  mediaAdded: number
  commentsAdded: number
  suggestionsAdded: number
  approvalsGiven: number
}

export interface OperationAnalytics {
  totalCount: number
  successRate: number
  averageLatency: number
  transformationRate: number
  conflictRate: number
  typeDistribution: Record<OperationType, number>
  peakOperationsPerSecond: number
  efficiencyScore: number
}

export interface ConflictAnalytics {
  totalConflicts: number
  resolvedConflicts: number
  averageResolutionTime: number
  typeDistribution: Record<ConflictType, number>
  strategyEffectiveness: Record<ConflictResolutionStrategy, number>
  manualInterventions: number
  autoResolutionRate: number
}

export interface PerformanceAnalytics {
  averageLatency: number
  peakLatency: number
  operationThroughput: number
  memoryUsage: number
  networkBandwidth: number
  errorRate: number
  uptime: number
  qualityMetrics: QualityMetrics
}

export interface QualityMetrics {
  consistencyScore: number
  stabilityScore: number
  responsiveness: number
  reliability: number
  userSatisfaction: number
}

export interface CollaborationInsight {
  type: 'performance' | 'behavior' | 'quality' | 'efficiency'
  title: string
  description: string
  severity: 'info' | 'warning' | 'critical'
  recommendations: string[]
  data: Record<string, any>
  confidence: number
  actionable: boolean
}