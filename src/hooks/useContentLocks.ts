import { useState, useCallback, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'

interface ContentLock {
  postId: string
  userId: string
  userName: string
  userAvatar?: string
  lockedAt: Date
  expiresAt: Date
}

interface Collaborator {
  id: string
  name: string
  avatar?: string
  status: 'online' | 'away' | 'offline'
  currentAction?: string
  lastSeen: Date
}

// Mock collaborators for demonstration
const MOCK_COLLABORATORS: Collaborator[] = [
  {
    id: 'user-1',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    status: 'online',
    currentAction: 'Editing calendar',
    lastSeen: new Date()
  },
  {
    id: 'user-2',
    name: 'Alex Thompson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    status: 'online',
    currentAction: 'Reviewing posts',
    lastSeen: new Date()
  },
  {
    id: 'user-3',
    name: 'Maria Garcia',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    status: 'away',
    currentAction: 'In meeting',
    lastSeen: new Date(Date.now() - 300000) // 5 minutes ago
  }
]

export function useContentLocks() {
  const [contentLocks, setContentLocks] = useKV<ContentLock[]>('content-locks', [])
  const [collaborators] = useState<Collaborator[]>(MOCK_COLLABORATORS)
  
  // Mock current user
  const currentUser = {
    id: 'user-1',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face'
  }

  const acquireLock = useCallback(async (postId: string): Promise<boolean> => {
    // Check if content is already locked by someone else
    const existingLock = contentLocks.find(lock => 
      lock.postId === postId && 
      lock.userId !== currentUser.id &&
      lock.expiresAt > new Date()
    )

    if (existingLock) {
      return false // Cannot acquire lock
    }

    // Remove any existing locks by this user for this content
    const updatedLocks = contentLocks.filter(lock => 
      !(lock.postId === postId && lock.userId === currentUser.id)
    )

    // Add new lock
    const newLock: ContentLock = {
      postId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      lockedAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    }

    setContentLocks([...updatedLocks, newLock])
    return true
  }, [contentLocks, setContentLocks, currentUser])

  const releaseLock = useCallback(async (postId: string): Promise<void> => {
    setContentLocks(currentLocks => 
      currentLocks.filter(lock => 
        !(lock.postId === postId && lock.userId === currentUser.id)
      )
    )
  }, [setContentLocks, currentUser])

  const getLock = useCallback((postId: string): ContentLock | null => {
    return contentLocks.find(lock => 
      lock.postId === postId && 
      lock.expiresAt > new Date()
    ) || null
  }, [contentLocks])

  const isLocked = useCallback((postId: string): boolean => {
    const lock = getLock(postId)
    return lock !== null && lock.userId !== currentUser.id
  }, [getLock, currentUser])

  const isLockedByCurrentUser = useCallback((postId: string): boolean => {
    const lock = getLock(postId)
    return lock !== null && lock.userId === currentUser.id
  }, [getLock, currentUser])

  const getCollaborators = useCallback((): Collaborator[] => {
    // Filter to show only online and away collaborators
    return collaborators.filter(collab => collab.status !== 'offline')
  }, [collaborators])

  const getActiveCollaborators = useCallback((): Collaborator[] => {
    return collaborators.filter(collab => collab.status === 'online')
  }, [collaborators])

  // Clean up expired locks periodically
  const cleanupExpiredLocks = useCallback(() => {
    const now = new Date()
    setContentLocks(currentLocks => 
      currentLocks.filter(lock => lock.expiresAt > now)
    )
  }, [setContentLocks])

  // Memoized values
  const activeLocks = useMemo(() => {
    const now = new Date()
    return contentLocks.filter(lock => lock.expiresAt > now)
  }, [contentLocks])

  const locksByUser = useMemo(() => {
    return activeLocks.reduce((acc, lock) => {
      if (!acc[lock.userId]) {
        acc[lock.userId] = []
      }
      acc[lock.userId].push(lock)
      return acc
    }, {} as Record<string, ContentLock[]>)
  }, [activeLocks])

  return {
    // Core lock operations
    acquireLock,
    releaseLock,
    getLock,
    isLocked,
    isLockedByCurrentUser,
    
    // Collaborator information
    getCollaborators,
    getActiveCollaborators,
    collaborators,
    
    // Lock state
    contentLocks: activeLocks,
    locksByUser,
    
    // Utilities
    cleanupExpiredLocks,
    currentUser
  }
}

export type { ContentLock, Collaborator }