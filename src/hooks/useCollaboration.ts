/**
 * Real-time Collaboration Hook
 * 
 * React hook that provides real-time collaborative editing capabilities
 * with live cursors, conflict resolution, and seamless synchronization.
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import CollaborationManager from '@/lib/collaboration/collaboration-manager'
import { 
  CollaborationSession, 
  Participant, 
  Operation, 
  Cursor, 
  Selection, 
  ContentLock,
  CollaborativeDocument,
  OperationConflict,
  User,
  Post,
  CursorPosition,
  OperationType,
  CollaborationAnalytics
} from '@/types'

interface UseCollaborationOptions {
  postId: string
  user: User
  autoJoin?: boolean
  syncInterval?: number
  conflictResolution?: 'automatic' | 'manual' | 'hybrid'
  enableLiveCursors?: boolean
  enableLocks?: boolean
  enableConflictHighlighting?: boolean
}

interface CollaborationState {
  session: CollaborationSession | null
  participants: Participant[]
  cursors: Cursor[]
  selections: Selection[]
  locks: ContentLock[]
  conflicts: OperationConflict[]
  document: CollaborativeDocument | null
  isConnected: boolean
  isLoading: boolean
  error: string | null
  analytics: CollaborationAnalytics | null
}

interface CollaborationActions {
  joinSession: () => Promise<void>
  leaveSession: () => Promise<void>
  applyOperation: (operation: Omit<Operation, 'id' | 'timestamp' | 'applied' | 'acknowledged' | 'conflicts' | 'transformations'>) => Promise<boolean>
  updateCursor: (position: CursorPosition) => Promise<void>
  updateSelection: (selection: Omit<Selection, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>
  acquireLock: (blockId: string, type: 'edit' | 'format' | 'move' | 'delete', duration?: number) => Promise<ContentLock | null>
  releaseLock: (lockId: string) => Promise<void>
  resolveConflict: (conflictId: string, resolution: any) => Promise<void>
  insertText: (text: string, position: number) => Promise<boolean>
  deleteText: (start: number, length: number) => Promise<boolean>
  formatText: (start: number, end: number, attributes: Record<string, any>) => Promise<boolean>
  replaceText: (start: number, end: number, newText: string) => Promise<boolean>
  undo: () => Promise<boolean>
  redo: () => Promise<boolean>
}

export function useCollaboration(options: UseCollaborationOptions): [CollaborationState, CollaborationActions] {
  const { postId, user, autoJoin = true, syncInterval = 100, conflictResolution = 'hybrid' } = options
  
  const [state, setState] = useState<CollaborationState>({
    session: null,
    participants: [],
    cursors: [],
    selections: [],
    locks: [],
    conflicts: [],
    document: null,
    isConnected: false,
    isLoading: false,
    error: null,
    analytics: null
  })

  const [collaborationHistory] = useKV(`collaboration-history-${postId}`, [])
  const [personalCursor, setPersonalCursor] = useKV(`cursor-${user.id}`, null)
  const [operationHistory, setOperationHistory] = useKV(`operations-${postId}`, [])

  const collaborationManager = useRef<CollaborationManager>(CollaborationManager.getInstance())
  const operationQueue = useRef<Operation[]>([])
  const undoStack = useRef<Operation[]>([])
  const redoStack = useRef<Operation[]>([])
  const syncTimer = useRef<NodeJS.Timeout | null>(null)
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null)

  // Initialize collaboration session
  useEffect(() => {
    if (autoJoin && !state.session && !state.isLoading) {
      joinSession()
    }

    return () => {
      if (state.isConnected) {
        leaveSession()
      }
    }
  }, [postId, user.id, autoJoin])

  // Set up event listeners
  useEffect(() => {
    const manager = collaborationManager.current

    const handleParticipantJoined = (event: any) => {
      if (event.sessionId === state.session?.id) {
        setState(prev => ({
          ...prev,
          participants: [...prev.participants, event.participant]
        }))
      }
    }

    const handleParticipantLeft = (event: any) => {
      if (event.sessionId === state.session?.id) {
        setState(prev => ({
          ...prev,
          participants: prev.participants.filter(p => p.userId !== event.userId),
          cursors: prev.cursors.filter(c => c.userId !== event.userId),
          selections: prev.selections.filter(s => s.userId !== event.userId)
        }))
      }
    }

    const handleOperationApplied = (event: any) => {
      if (event.sessionId === state.session?.id) {
        setState(prev => ({
          ...prev,
          document: event.document || prev.document
        }))
        
        // Add to operation history
        setOperationHistory(prev => [...prev.slice(-99), event.operation])
      }
    }

    const handleCursorUpdated = (event: any) => {
      if (event.sessionId === state.session?.id) {
        setState(prev => ({
          ...prev,
          cursors: prev.cursors.map(c => 
            c.userId === event.cursor.userId ? event.cursor : c
          ).concat(
            prev.cursors.find(c => c.userId === event.cursor.userId) ? [] : [event.cursor]
          )
        }))
      }
    }

    const handleSelectionUpdated = (event: any) => {
      if (event.sessionId === state.session?.id) {
        setState(prev => ({
          ...prev,
          selections: prev.selections.map(s => 
            s.userId === event.selection.userId ? event.selection : s
          ).concat(
            prev.selections.find(s => s.userId === event.selection.userId) ? [] : [event.selection]
          )
        }))
      }
    }

    const handleLockUpdated = (event: any) => {
      if (event.sessionId === state.session?.id) {
        setState(prev => ({
          ...prev,
          locks: event.action === 'acquired' 
            ? [...prev.locks, event.lock]
            : prev.locks.filter(l => l.id !== event.lock.id)
        }))
      }
    }

    const handleConflictDetected = (event: any) => {
      if (event.sessionId === state.session?.id) {
        setState(prev => ({
          ...prev,
          conflicts: [...prev.conflicts, event.conflict]
        }))

        if (conflictResolution === 'automatic') {
          // Auto-resolve if possible
          setTimeout(() => {
            resolveConflict(event.conflict.id, { strategy: 'operational_transform', data: {} })
          }, 100)
        }
      }
    }

    const handleConflictResolved = (event: any) => {
      if (event.sessionId === state.session?.id) {
        setState(prev => ({
          ...prev,
          conflicts: prev.conflicts.filter(c => c.id !== event.conflictId)
        }))
      }
    }

    // Register event listeners
    manager.eventEmitter.on('participant-joined', handleParticipantJoined)
    manager.eventEmitter.on('participant-left', handleParticipantLeft)
    manager.eventEmitter.on('operation-applied', handleOperationApplied)
    manager.eventEmitter.on('cursor-updated', handleCursorUpdated)
    manager.eventEmitter.on('selection-updated', handleSelectionUpdated)
    manager.eventEmitter.on('lock-updated', handleLockUpdated)
    manager.eventEmitter.on('conflict-detected', handleConflictDetected)
    manager.eventEmitter.on('conflict-resolved', handleConflictResolved)

    return () => {
      manager.eventEmitter.off('participant-joined', handleParticipantJoined)
      manager.eventEmitter.off('participant-left', handleParticipantLeft)
      manager.eventEmitter.off('operation-applied', handleOperationApplied)
      manager.eventEmitter.off('cursor-updated', handleCursorUpdated)
      manager.eventEmitter.off('selection-updated', handleSelectionUpdated)
      manager.eventEmitter.off('lock-updated', handleLockUpdated)
      manager.eventEmitter.off('conflict-detected', handleConflictDetected)
      manager.eventEmitter.off('conflict-resolved', handleConflictResolved)
    }
  }, [state.session?.id, conflictResolution])

  // Set up sync timer
  useEffect(() => {
    if (state.isConnected && syncInterval > 0) {
      syncTimer.current = setInterval(() => {
        syncState()
      }, syncInterval)

      return () => {
        if (syncTimer.current) {
          clearInterval(syncTimer.current)
          syncTimer.current = null
        }
      }
    }
  }, [state.isConnected, syncInterval])

  const joinSession = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const session = await collaborationManager.current.joinSession(postId, user)
      
      setState(prev => ({
        ...prev,
        session,
        participants: session.participants,
        cursors: session.cursors,
        selections: session.selections,
        locks: session.locks,
        document: session.document,
        isConnected: true,
        isLoading: false
      }))

      // Start analytics collection
      if (session) {
        const analytics = collaborationManager.current.getAnalytics(session.id)
        setState(prev => ({ ...prev, analytics }))
      }

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to join session'
      }))
      
      // Set up reconnect timer
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current)
      }
      reconnectTimer.current = setTimeout(() => {
        joinSession()
      }, 5000)
    }
  }, [postId, user])

  const leaveSession = useCallback(async () => {
    try {
      if (state.session) {
        await collaborationManager.current.leaveSession(postId, user.id)
      }
      
      setState(prev => ({
        ...prev,
        session: null,
        participants: [],
        cursors: [],
        selections: [],
        locks: [],
        conflicts: [],
        document: null,
        isConnected: false,
        analytics: null
      }))

      // Clear timers
      if (syncTimer.current) {
        clearInterval(syncTimer.current)
        syncTimer.current = null
      }
      
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current)
        reconnectTimer.current = null
      }

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to leave session'
      }))
    }
  }, [state.session, postId, user.id])

  const applyOperation = useCallback(async (operationData: Omit<Operation, 'id' | 'timestamp' | 'applied' | 'acknowledged' | 'conflicts' | 'transformations'>): Promise<boolean> => {
    if (!state.session) return false

    try {
      const operation: Operation = {
        id: `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        applied: false,
        acknowledged: {
          sent: false,
          received: false,
          applied: false,
          failed: false,
          participants: {}
        },
        conflicts: [],
        transformations: [],
        ...operationData
      }

      const result = await collaborationManager.current.applyOperation(state.session.id, operation)
      
      if (result.success) {
        // Add to undo stack
        const inverseOp = collaborationManager.current.invertOperation(operation)
        undoStack.current.push(inverseOp)
        redoStack.current = [] // Clear redo stack on new operation
        
        return true
      } else {
        setState(prev => ({
          ...prev,
          error: result.error || 'Operation failed'
        }))
        return false
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Operation error'
      }))
      return false
    }
  }, [state.session])

  const updateCursor = useCallback(async (position: CursorPosition) => {
    if (!state.session) return

    try {
      await collaborationManager.current.updateCursor(state.session.id, user.id, position)
      setPersonalCursor(position)
    } catch (error) {
      console.error('Failed to update cursor:', error)
    }
  }, [state.session, user.id])

  const updateSelection = useCallback(async (selectionData: Omit<Selection, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!state.session) return

    try {
      const selection: Selection = {
        id: `sel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...selectionData
      }

      await collaborationManager.current.updateSelection(state.session.id, user.id, selection)
    } catch (error) {
      console.error('Failed to update selection:', error)
    }
  }, [state.session, user.id])

  const acquireLock = useCallback(async (blockId: string, type: 'edit' | 'format' | 'move' | 'delete', duration = 30000): Promise<ContentLock | null> => {
    if (!state.session) return null

    try {
      return await collaborationManager.current.acquireLock(state.session.id, user.id, {
        blockId,
        type,
        duration,
        priority: 1,
        isBreakable: false
      })
    } catch (error) {
      console.error('Failed to acquire lock:', error)
      return null
    }
  }, [state.session, user.id])

  const releaseLock = useCallback(async (lockId: string) => {
    if (!state.session) return

    try {
      await collaborationManager.current.releaseLock(state.session.id, lockId)
    } catch (error) {
      console.error('Failed to release lock:', error)
    }
  }, [state.session])

  const resolveConflict = useCallback(async (conflictId: string, resolution: any) => {
    if (!state.session) return

    try {
      await collaborationManager.current.resolveConflict(state.session.id, conflictId, {
        strategy: resolution.strategy || 'operational_transform',
        data: resolution.data || {},
        resolvedBy: user.id
      })
    } catch (error) {
      console.error('Failed to resolve conflict:', error)
    }
  }, [state.session, user.id])

  // High-level text editing operations
  const insertText = useCallback(async (text: string, position: number): Promise<boolean> => {
    return applyOperation({
      type: 'insert',
      userId: user.id,
      sessionId: state.session?.id || '',
      data: {
        content: text
      },
      position: {
        start: position,
        blockId: 'main-content'
      },
      metadata: {
        source: 'user',
        device: navigator.userAgent,
        intention: 'typing',
        priority: 1,
        retries: 0
      }
    })
  }, [applyOperation, user.id, state.session])

  const deleteText = useCallback(async (start: number, length: number): Promise<boolean> => {
    return applyOperation({
      type: 'delete',
      userId: user.id,
      sessionId: state.session?.id || '',
      data: {
        length
      },
      position: {
        start,
        end: start + length,
        blockId: 'main-content'
      },
      metadata: {
        source: 'user',
        device: navigator.userAgent,
        intention: 'typing',
        priority: 1,
        retries: 0
      }
    })
  }, [applyOperation, user.id, state.session])

  const formatText = useCallback(async (start: number, end: number, attributes: Record<string, any>): Promise<boolean> => {
    return applyOperation({
      type: 'format',
      userId: user.id,
      sessionId: state.session?.id || '',
      data: {
        attributes,
        formatType: 'style'
      },
      position: {
        start,
        end,
        blockId: 'main-content'
      },
      metadata: {
        source: 'user',
        device: navigator.userAgent,
        intention: 'format',
        priority: 1,
        retries: 0
      }
    })
  }, [applyOperation, user.id, state.session])

  const replaceText = useCallback(async (start: number, end: number, newText: string): Promise<boolean> => {
    const originalLength = end - start
    
    return applyOperation({
      type: 'replace',
      userId: user.id,
      sessionId: state.session?.id || '',
      data: {
        content: newText,
        originalContent: '', // Would need to get from document
        length: originalLength
      },
      position: {
        start,
        end,
        blockId: 'main-content'
      },
      metadata: {
        source: 'user',
        device: navigator.userAgent,
        intention: 'typing',
        priority: 1,
        retries: 0
      }
    })
  }, [applyOperation, user.id, state.session])

  const undo = useCallback(async (): Promise<boolean> => {
    if (undoStack.current.length === 0) return false

    const operation = undoStack.current.pop()!
    const success = await applyOperation(operation)
    
    if (success) {
      redoStack.current.push(collaborationManager.current.invertOperation(operation))
    }
    
    return success
  }, [applyOperation])

  const redo = useCallback(async (): Promise<boolean> => {
    if (redoStack.current.length === 0) return false

    const operation = redoStack.current.pop()!
    const success = await applyOperation(operation)
    
    if (success) {
      undoStack.current.push(collaborationManager.current.invertOperation(operation))
    }
    
    return success
  }, [applyOperation])

  const syncState = useCallback(async () => {
    if (!state.session) return

    try {
      const participants = collaborationManager.current.getParticipants(state.session.id)
      const cursors = collaborationManager.current.getCursors(state.session.id)
      const document = collaborationManager.current.getDocument(state.session.id)
      const analytics = collaborationManager.current.getAnalytics(state.session.id)

      setState(prev => ({
        ...prev,
        participants,
        cursors,
        document: document || prev.document,
        analytics
      }))
    } catch (error) {
      console.error('Sync error:', error)
    }
  }, [state.session])

  const actions: CollaborationActions = {
    joinSession,
    leaveSession,
    applyOperation,
    updateCursor,
    updateSelection,
    acquireLock,
    releaseLock,
    resolveConflict,
    insertText,
    deleteText,
    formatText,
    replaceText,
    undo,
    redo
  }

  return [state, actions]
}

// Utility hooks for specific collaboration features

export function useLiveCursors(postId: string, user: User) {
  const [state, actions] = useCollaboration({ postId, user, enableLiveCursors: true })
  
  return {
    cursors: state.cursors.filter(c => c.userId !== user.id),
    updateCursor: actions.updateCursor,
    isConnected: state.isConnected
  }
}

export function useConflictResolution(postId: string, user: User) {
  const [state, actions] = useCollaboration({ postId, user, conflictResolution: 'manual' })
  
  return {
    conflicts: state.conflicts,
    resolveConflict: actions.resolveConflict,
    hasConflicts: state.conflicts.length > 0
  }
}

export function useContentLocks(postId: string, user: User) {
  const [state, actions] = useCollaboration({ postId, user, enableLocks: true })
  
  return {
    locks: state.locks,
    acquireLock: actions.acquireLock,
    releaseLock: actions.releaseLock,
    isLocked: (blockId: string) => state.locks.some(lock => 
      lock.blockId === blockId && 
      lock.userId !== user.id && 
      lock.expiresAt > new Date()
    )
  }
}

export function useCollaborativeEditing(postId: string, user: User) {
  const [state, actions] = useCollaboration({ postId, user })
  
  return {
    document: state.document,
    participants: state.participants,
    isConnected: state.isConnected,
    insertText: actions.insertText,
    deleteText: actions.deleteText,
    formatText: actions.formatText,
    replaceText: actions.replaceText,
    undo: actions.undo,
    redo: actions.redo,
    updateCursor: actions.updateCursor,
    updateSelection: actions.updateSelection
  }
}