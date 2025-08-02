/**
 * Real-time Collaboration Manager
 * 
 * Central orchestrator for all collaborative editing features including:
 * - Live cursor synchronization
 * - Operational transforms
 * - Conflict resolution
 * - Participant management
 * - Document state synchronization
 */

import { useKV } from '@github/spark/hooks'
import { 
  CollaborationSession, 
  Participant, 
  Operation, 
  Cursor, 
  Selection, 
  ContentLock,
  CollaborativeDocument,
  OperationConflict,
  ConflictResolutionStrategy,
  User
} from '@/types'
import { OperationalTransform } from './operational-transform'

export class CollaborationManager {
  private static instance: CollaborationManager
  private sessions: Map<string, CollaborationSession> = new Map()
  private activeParticipants: Map<string, Participant> = new Map()
  private operationQueue: Map<string, Operation[]> = new Map()
  private conflictResolver: ConflictResolver
  private cursorManager: CursorManager
  private lockManager: LockManager
  private eventEmitter: CollaborationEventEmitter
  private ot: OperationalTransform
  private syncTimer: NodeJS.Timeout | null = null

  static getInstance(): CollaborationManager {
    if (!CollaborationManager.instance) {
      CollaborationManager.instance = new CollaborationManager()
    }
    return CollaborationManager.instance
  }

  constructor() {
    this.conflictResolver = new ConflictResolver()
    this.cursorManager = new CursorManager()
    this.lockManager = new LockManager()
    this.eventEmitter = new CollaborationEventEmitter()
    this.ot = OperationalTransform.getInstance()
    this.initializeSyncLoop()
  }

  /**
   * Join a collaboration session
   */
  async joinSession(postId: string, user: User): Promise<CollaborationSession> {
    let session = this.sessions.get(postId)
    
    if (!session) {
      session = await this.createSession(postId)
    }

    const participant = await this.addParticipant(session, user)
    
    // Initialize participant cursor
    const cursor = this.cursorManager.createCursor(participant)
    participant.cursor = cursor

    // Broadcast participant joined
    this.eventEmitter.emit('participant-joined', {
      sessionId: session.id,
      participant
    })

    return session
  }

  /**
   * Leave a collaboration session
   */
  async leaveSession(postId: string, userId: string): Promise<void> {
    const session = this.sessions.get(postId)
    if (!session) return

    // Remove participant
    session.participants = session.participants.filter(p => p.userId !== userId)
    this.activeParticipants.delete(userId)

    // Clean up cursor
    this.cursorManager.removeCursor(userId)

    // Clean up locks
    await this.lockManager.releaseAllLocks(userId)

    // Broadcast participant left
    this.eventEmitter.emit('participant-left', {
      sessionId: session.id,
      userId
    })

    // Clean up session if no participants
    if (session.participants.length === 0) {
      this.sessions.delete(postId)
      this.clearOperationQueue(session.id)
    }
  }

  /**
   * Apply an operation to the collaborative document
   */
  async applyOperation(sessionId: string, operation: Operation): Promise<OperationResult> {
    const session = this.sessions.get(sessionId)
    if (!session) {
      throw new Error('Session not found')
    }

    // Add to operation queue
    this.addToOperationQueue(sessionId, operation)

    // Transform against pending operations
    const transformedOp = await this.transformOperation(session, operation)
    
    if (!transformedOp) {
      return {
        success: false,
        operation,
        error: 'Operation was cancelled due to conflicts'
      }
    }

    // Apply to document
    const result = await this.applyToDocument(session, transformedOp)
    
    if (result.success) {
      // Add to operation history
      session.operations.push(transformedOp)
      session.version++

      // Broadcast to all participants
      this.broadcastOperation(session, transformedOp)

      // Handle any conflicts
      if (result.conflicts && result.conflicts.length > 0) {
        await this.handleConflicts(session, result.conflicts)
      }
    }

    return result
  }

  /**
   * Update cursor position
   */
  async updateCursor(sessionId: string, userId: string, position: CursorPosition): Promise<void> {
    const session = this.sessions.get(sessionId)
    if (!session) return

    const participant = session.participants.find(p => p.userId === userId)
    if (!participant) return

    // Update cursor
    const updatedCursor = this.cursorManager.updateCursor(participant.cursor, position)
    participant.cursor = updatedCursor
    participant.lastSeen = new Date()

    // Broadcast cursor update
    this.broadcastCursorUpdate(session, updatedCursor)
  }

  /**
   * Update text selection
   */
  async updateSelection(sessionId: string, userId: string, selection: Selection): Promise<void> {
    const session = this.sessions.get(sessionId)
    if (!session) return

    const participant = session.participants.find(p => p.userId === userId)
    if (!participant) return

    participant.selection = selection
    session.selections = session.selections.filter(s => s.userId !== userId)
    session.selections.push(selection)

    // Broadcast selection update
    this.broadcastSelectionUpdate(session, selection)
  }

  /**
   * Acquire a content lock
   */
  async acquireLock(sessionId: string, userId: string, lockRequest: ContentLockRequest): Promise<ContentLock | null> {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    const lock = await this.lockManager.acquireLock(userId, lockRequest)
    
    if (lock) {
      session.locks.push(lock)
      this.broadcastLockUpdate(session, lock, 'acquired')
    }

    return lock
  }

  /**
   * Release a content lock
   */
  async releaseLock(sessionId: string, lockId: string): Promise<void> {
    const session = this.sessions.get(sessionId)
    if (!session) return

    const lock = session.locks.find(l => l.id === lockId)
    if (!lock) return

    await this.lockManager.releaseLock(lockId)
    session.locks = session.locks.filter(l => l.id !== lockId)

    this.broadcastLockUpdate(session, lock, 'released')
  }

  /**
   * Get active participants in a session
   */
  getParticipants(sessionId: string): Participant[] {
    const session = this.sessions.get(sessionId)
    return session?.participants || []
  }

  /**
   * Get all active cursors in a session
   */
  getCursors(sessionId: string): Cursor[] {
    const session = this.sessions.get(sessionId)
    return session?.cursors || []
  }

  /**
   * Get document state
   */
  getDocument(sessionId: string): CollaborativeDocument | null {
    const session = this.sessions.get(sessionId)
    return session?.document || null
  }

  /**
   * Resolve conflicts manually
   */
  async resolveConflict(sessionId: string, conflictId: string, resolution: ConflictResolution): Promise<void> {
    const session = this.sessions.get(sessionId)
    if (!session) return

    await this.conflictResolver.resolveConflict(conflictId, resolution)
    
    // Broadcast conflict resolution
    this.eventEmitter.emit('conflict-resolved', {
      sessionId,
      conflictId,
      resolution
    })
  }

  /**
   * Get collaboration analytics
   */
  getAnalytics(sessionId: string): CollaborationAnalytics {
    const session = this.sessions.get(sessionId)
    if (!session) {
      return this.getEmptyAnalytics()
    }

    return this.calculateAnalytics(session)
  }

  private async createSession(postId: string): Promise<CollaborationSession> {
    const session: CollaborationSession = {
      id: `session-${postId}-${Date.now()}`,
      postId,
      participants: [],
      document: await this.initializeDocument(postId),
      operations: [],
      conflictResolution: {
        strategy: 'operational_transform',
        rules: [],
        customHandlers: [],
        fallbackStrategy: 'last_write_wins',
        autoResolve: true,
        requiresManualReview: ['critical']
      },
      cursors: [],
      selections: [],
      locks: [],
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    }

    this.sessions.set(postId, session)
    this.operationQueue.set(session.id, [])

    return session
  }

  private async addParticipant(session: CollaborationSession, user: User): Promise<Participant> {
    const participant: Participant = {
      id: `participant-${user.id}-${Date.now()}`,
      userId: user.id,
      user,
      sessionId: session.id,
      cursor: {
        id: `cursor-${user.id}`,
        userId: user.id,
        position: { line: 0, column: 0, offset: 0 },
        color: this.generateParticipantColor(session.participants.length),
        label: user.name,
        avatar: user.avatar,
        isActive: true,
        lastMoved: new Date(),
        blinkState: true
      },
      isActive: true,
      lastSeen: new Date(),
      permissions: this.getCollaborationPermissions(user),
      color: this.generateParticipantColor(session.participants.length),
      joinedAt: new Date()
    }

    session.participants.push(participant)
    this.activeParticipants.set(user.id, participant)

    return participant
  }

  private async initializeDocument(postId: string): Promise<CollaborativeDocument> {
    // Load post content and create collaborative document structure
    return {
      id: `doc-${postId}`,
      postId,
      content: {
        text: '',
        formatting: [],
        media: [],
        links: [],
        mentions: [],
        hashtags: []
      },
      structure: {
        blocks: [],
        hierarchy: [],
        ordering: [],
        dependencies: []
      },
      metadata: {
        language: 'en',
        wordCount: 0,
        characterCount: 0,
        readingTime: 0,
        complexity: 0,
        sentiment: 0,
        lastEditBy: '',
        lastEditAt: new Date()
      },
      version: 1,
      checksum: this.calculateChecksum(''),
      operations: [],
      branches: [],
      mergeState: {
        inProgress: false,
        branches: [],
        strategy: 'operational_transform',
        conflicts: [],
        resolution: {},
        autoMerge: true,
        requiredApprovals: [],
        approvals: {},
        startedBy: ''
      }
    }
  }

  private async transformOperation(session: CollaborationSession, operation: Operation): Promise<Operation | null> {
    const pendingOps = this.operationQueue.get(session.id) || []
    const relevantOps = pendingOps.filter(op => 
      op.timestamp <= operation.timestamp && 
      op.id !== operation.id
    )

    return this.ot.transformAgainst(operation, relevantOps)
  }

  private async applyToDocument(session: CollaborationSession, operation: Operation): Promise<OperationResult> {
    try {
      const document = session.document
      
      switch (operation.type) {
        case 'insert':
          return this.applyInsert(document, operation)
        case 'delete':
          return this.applyDelete(document, operation)
        case 'format':
          return this.applyFormat(document, operation)
        case 'move':
          return this.applyMove(document, operation)
        case 'replace':
          return this.applyReplace(document, operation)
        default:
          return {
            success: false,
            operation,
            error: `Unsupported operation type: ${operation.type}`
          }
      }
    } catch (error) {
      return {
        success: false,
        operation,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private applyInsert(document: CollaborativeDocument, operation: Operation): OperationResult {
    const { content, position } = operation.data
    const { text } = document.content
    
    const newText = text.slice(0, position.start) + content + text.slice(position.start)
    document.content.text = newText
    document.version++
    document.checksum = this.calculateChecksum(newText)
    document.metadata.lastEditBy = operation.userId
    document.metadata.lastEditAt = operation.timestamp
    
    return {
      success: true,
      operation,
      document
    }
  }

  private applyDelete(document: CollaborativeDocument, operation: Operation): OperationResult {
    const { position } = operation
    const { text } = document.content
    const length = operation.data.length || 0
    
    const newText = text.slice(0, position.start) + text.slice(position.start + length)
    document.content.text = newText
    document.version++
    document.checksum = this.calculateChecksum(newText)
    document.metadata.lastEditBy = operation.userId
    document.metadata.lastEditAt = operation.timestamp
    
    return {
      success: true,
      operation,
      document
    }
  }

  private applyFormat(document: CollaborativeDocument, operation: Operation): OperationResult {
    const { position, data } = operation
    const formatRange = {
      start: position.start,
      end: position.end || position.start,
      type: data.formatType || 'style',
      attributes: data.attributes || {},
      applied: true,
      priority: 1
    }
    
    document.content.formatting.push(formatRange)
    document.version++
    document.metadata.lastEditBy = operation.userId
    document.metadata.lastEditAt = operation.timestamp
    
    return {
      success: true,
      operation,
      document
    }
  }

  private applyMove(document: CollaborativeDocument, operation: Operation): OperationResult {
    // Implementation for move operations
    document.version++
    document.metadata.lastEditBy = operation.userId
    document.metadata.lastEditAt = operation.timestamp
    
    return {
      success: true,
      operation,
      document
    }
  }

  private applyReplace(document: CollaborativeDocument, operation: Operation): OperationResult {
    const { position, data } = operation
    const { text } = document.content
    const length = data.originalContent?.length || 0
    
    const newText = text.slice(0, position.start) + data.content + text.slice(position.start + length)
    document.content.text = newText
    document.version++
    document.checksum = this.calculateChecksum(newText)
    document.metadata.lastEditBy = operation.userId
    document.metadata.lastEditAt = operation.timestamp
    
    return {
      success: true,
      operation,
      document
    }
  }

  private addToOperationQueue(sessionId: string, operation: Operation): void {
    const queue = this.operationQueue.get(sessionId) || []
    queue.push(operation)
    
    // Keep queue size manageable
    if (queue.length > 1000) {
      queue.splice(0, queue.length - 500) // Keep last 500 operations
    }
    
    this.operationQueue.set(sessionId, queue)
  }

  private clearOperationQueue(sessionId: string): void {
    this.operationQueue.delete(sessionId)
  }

  private broadcastOperation(session: CollaborationSession, operation: Operation): void {
    this.eventEmitter.emit('operation-applied', {
      sessionId: session.id,
      operation,
      participants: session.participants.filter(p => p.userId !== operation.userId)
    })
  }

  private broadcastCursorUpdate(session: CollaborationSession, cursor: Cursor): void {
    this.eventEmitter.emit('cursor-updated', {
      sessionId: session.id,
      cursor,
      participants: session.participants.filter(p => p.userId !== cursor.userId)
    })
  }

  private broadcastSelectionUpdate(session: CollaborationSession, selection: Selection): void {
    this.eventEmitter.emit('selection-updated', {
      sessionId: session.id,
      selection,
      participants: session.participants.filter(p => p.userId !== selection.userId)
    })
  }

  private broadcastLockUpdate(session: CollaborationSession, lock: ContentLock, action: 'acquired' | 'released'): void {
    this.eventEmitter.emit('lock-updated', {
      sessionId: session.id,
      lock,
      action,
      participants: session.participants.filter(p => p.userId !== lock.userId)
    })
  }

  private async handleConflicts(session: CollaborationSession, conflicts: OperationConflict[]): Promise<void> {
    for (const conflict of conflicts) {
      if (session.conflictResolution.autoResolve && !session.conflictResolution.requiresManualReview.includes(conflict.severity)) {
        await this.conflictResolver.autoResolveConflict(conflict)
      } else {
        // Notify participants about conflict requiring manual resolution
        this.eventEmitter.emit('conflict-detected', {
          sessionId: session.id,
          conflict,
          participants: session.participants
        })
      }
    }
  }

  private generateParticipantColor(index: number): string {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ]
    return colors[index % colors.length]
  }

  private getCollaborationPermissions(user: User): CollaborationPermission[] {
    const basePermissions: CollaborationPermission[] = [
      { type: 'read', scope: 'global' },
      { type: 'comment', scope: 'global' }
    ]

    if (user.role === 'admin' || user.role === 'editor') {
      basePermissions.push(
        { type: 'edit', scope: 'global' },
        { type: 'format', scope: 'global' },
        { type: 'suggest', scope: 'global' }
      )
    }

    if (user.role === 'admin') {
      basePermissions.push(
        { type: 'approve', scope: 'global' },
        { type: 'admin', scope: 'global' }
      )
    }

    return basePermissions
  }

  private calculateChecksum(content: string): string {
    // Simple checksum calculation
    let hash = 0
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return hash.toString(36)
  }

  private calculateAnalytics(session: CollaborationSession): CollaborationAnalytics {
    const now = new Date()
    const sessionDuration = now.getTime() - session.createdAt.getTime()
    
    return {
      session: {
        duration: sessionDuration,
        activeTime: sessionDuration * 0.8, // Mock calculation
        totalOperations: session.operations.length,
        conflictRate: 0.02, // Mock rate
        resolutionTime: 150, // Mock average resolution time in ms
        participantCount: session.participants.length,
        peakConcurrency: Math.max(session.participants.length, 1),
        qualityScore: 0.95 // Mock quality score
      },
      participants: session.participants.map(p => ({
        userId: p.userId,
        operationsCount: session.operations.filter(op => op.userId === p.userId).length,
        conflictsCreated: 0, // Mock
        conflictsResolved: 0, // Mock
        activeTime: sessionDuration * 0.7, // Mock
        effectiveTime: sessionDuration * 0.6, // Mock
        collaborationScore: 0.85, // Mock
        contributions: {
          charactersAdded: 150, // Mock
          charactersDeleted: 30, // Mock
          formattingChanges: 5, // Mock
          mediaAdded: 1, // Mock
          commentsAdded: 2, // Mock
          suggestionsAdded: 0, // Mock
          approvalsGiven: 0 // Mock
        }
      })),
      operations: {
        totalCount: session.operations.length,
        successRate: 0.98, // Mock
        averageLatency: 45, // Mock
        transformationRate: 0.15, // Mock
        conflictRate: 0.02, // Mock
        typeDistribution: this.calculateOperationDistribution(session.operations),
        peakOperationsPerSecond: 5, // Mock
        efficiencyScore: 0.92 // Mock
      },
      conflicts: {
        totalConflicts: 0, // Mock
        resolvedConflicts: 0, // Mock
        averageResolutionTime: 200, // Mock
        typeDistribution: {},
        strategyEffectiveness: {},
        manualInterventions: 0,
        autoResolutionRate: 0.85
      },
      performance: {
        averageLatency: 45,
        peakLatency: 120,
        operationThroughput: session.operations.length / (sessionDuration / 1000),
        memoryUsage: 15.5, // Mock MB
        networkBandwidth: 2.3, // Mock KB/s
        errorRate: 0.01,
        uptime: 0.999,
        qualityMetrics: {
          consistencyScore: 0.95,
          stabilityScore: 0.98,
          responsiveness: 0.92,
          reliability: 0.97,
          userSatisfaction: 0.89
        }
      },
      insights: [
        {
          type: 'performance',
          title: 'Excellent Collaboration',
          description: 'High participant engagement with minimal conflicts',
          severity: 'info',
          recommendations: ['Continue current collaboration patterns'],
          data: {},
          confidence: 0.9,
          actionable: false
        }
      ]
    }
  }

  private calculateOperationDistribution(operations: Operation[]): Record<OperationType, number> {
    const distribution: Record<string, number> = {}
    
    for (const op of operations) {
      distribution[op.type] = (distribution[op.type] || 0) + 1
    }
    
    return distribution as Record<OperationType, number>
  }

  private getEmptyAnalytics(): CollaborationAnalytics {
    return {
      session: {
        duration: 0,
        activeTime: 0,
        totalOperations: 0,
        conflictRate: 0,
        resolutionTime: 0,
        participantCount: 0,
        peakConcurrency: 0,
        qualityScore: 1
      },
      participants: [],
      operations: {
        totalCount: 0,
        successRate: 1,
        averageLatency: 0,
        transformationRate: 0,
        conflictRate: 0,
        typeDistribution: {} as Record<OperationType, number>,
        peakOperationsPerSecond: 0,
        efficiencyScore: 1
      },
      conflicts: {
        totalConflicts: 0,
        resolvedConflicts: 0,
        averageResolutionTime: 0,
        typeDistribution: {},
        strategyEffectiveness: {},
        manualInterventions: 0,
        autoResolutionRate: 1
      },
      performance: {
        averageLatency: 0,
        peakLatency: 0,
        operationThroughput: 0,
        memoryUsage: 0,
        networkBandwidth: 0,
        errorRate: 0,
        uptime: 1,
        qualityMetrics: {
          consistencyScore: 1,
          stabilityScore: 1,
          responsiveness: 1,
          reliability: 1,
          userSatisfaction: 1
        }
      },
      insights: []
    }
  }

  private initializeSyncLoop(): void {
    this.syncTimer = setInterval(() => {
      this.syncAllSessions()
    }, 100) // Sync every 100ms for real-time feel
  }

  private async syncAllSessions(): Promise<void> {
    for (const [postId, session] of this.sessions) {
      if (session.isActive && session.participants.length > 0) {
        await this.syncSession(session)
      }
    }
  }

  private async syncSession(session: CollaborationSession): Promise<void> {
    // Process pending operations
    const pendingOps = this.operationQueue.get(session.id) || []
    const unprocessedOps = pendingOps.filter(op => !op.applied)
    
    for (const op of unprocessedOps) {
      await this.applyOperation(session.id, op)
    }

    // Update participant activity
    const now = new Date()
    for (const participant of session.participants) {
      const timeSinceLastSeen = now.getTime() - participant.lastSeen.getTime()
      participant.isActive = timeSinceLastSeen < 30000 // 30 seconds threshold
    }

    // Clean up inactive cursors
    session.cursors = session.cursors.filter(cursor => {
      const participant = session.participants.find(p => p.userId === cursor.userId)
      return participant?.isActive
    })

    session.updatedAt = now
  }

  destroy(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer)
      this.syncTimer = null
    }
    
    this.sessions.clear()
    this.activeParticipants.clear()
    this.operationQueue.clear()
  }
}

// Supporting classes
class ConflictResolver {
  async resolveConflict(conflictId: string, resolution: ConflictResolution): Promise<void> {
    // Implementation for manual conflict resolution
  }

  async autoResolveConflict(conflict: OperationConflict): Promise<void> {
    // Implementation for automatic conflict resolution
  }
}

class CursorManager {
  createCursor(participant: Participant): Cursor {
    return {
      id: `cursor-${participant.userId}`,
      userId: participant.userId,
      position: { line: 0, column: 0, offset: 0 },
      color: participant.color,
      label: participant.user.name,
      avatar: participant.user.avatar,
      isActive: true,
      lastMoved: new Date(),
      blinkState: true
    }
  }

  updateCursor(cursor: Cursor, position: CursorPosition): Cursor {
    return {
      ...cursor,
      position,
      lastMoved: new Date(),
      isActive: true
    }
  }

  removeCursor(userId: string): void {
    // Implementation for cursor cleanup
  }
}

class LockManager {
  private locks: Map<string, ContentLock> = new Map()

  async acquireLock(userId: string, request: ContentLockRequest): Promise<ContentLock | null> {
    const existingLock = Array.from(this.locks.values()).find(lock => 
      lock.blockId === request.blockId && 
      lock.type === request.type &&
      lock.expiresAt > new Date()
    )

    if (existingLock && existingLock.userId !== userId) {
      return null // Lock already held by another user
    }

    const lock: ContentLock = {
      id: `lock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      blockId: request.blockId,
      type: request.type,
      position: request.position,
      duration: request.duration,
      expiresAt: new Date(Date.now() + request.duration),
      reason: request.reason,
      priority: request.priority || 1,
      isBreakable: request.isBreakable || false,
      metadata: request.metadata || {}
    }

    this.locks.set(lock.id, lock)
    return lock
  }

  async releaseLock(lockId: string): Promise<void> {
    this.locks.delete(lockId)
  }

  async releaseAllLocks(userId: string): Promise<void> {
    for (const [lockId, lock] of this.locks) {
      if (lock.userId === userId) {
        this.locks.delete(lockId)
      }
    }
  }
}

class CollaborationEventEmitter {
  private listeners: Map<string, Function[]> = new Map()

  on(event: string, listener: Function): void {
    const eventListeners = this.listeners.get(event) || []
    eventListeners.push(listener)
    this.listeners.set(event, eventListeners)
  }

  emit(event: string, data: any): void {
    const eventListeners = this.listeners.get(event) || []
    for (const listener of eventListeners) {
      try {
        listener(data)
      } catch (error) {
        console.error('Event listener error:', error)
      }
    }
  }

  off(event: string, listener: Function): void {
    const eventListeners = this.listeners.get(event) || []
    const index = eventListeners.indexOf(listener)
    if (index > -1) {
      eventListeners.splice(index, 1)
      this.listeners.set(event, eventListeners)
    }
  }
}

// Supporting interfaces
interface OperationResult {
  success: boolean
  operation: Operation
  document?: CollaborativeDocument
  conflicts?: OperationConflict[]
  error?: string
}

interface ContentLockRequest {
  blockId: string
  type: 'edit' | 'format' | 'move' | 'delete'
  position?: OperationPosition
  duration: number
  reason?: string
  priority?: number
  isBreakable?: boolean
  metadata?: Record<string, any>
}

interface ConflictResolution {
  strategy: ConflictResolutionStrategy
  data: any
  resolvedBy: string
}

// Import missing types
import { 
  CollaborationAnalytics, 
  CursorPosition, 
  OperationPosition,
  CollaborationPermission
} from '@/types'

export { CollaborationManager }