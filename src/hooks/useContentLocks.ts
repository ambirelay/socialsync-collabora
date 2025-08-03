import { useState, useCallback, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'

export interface ContentLock {
  id: string
  postId: string
  userId: string
  userName: string
  userAvatar?: string
  timestamp: number
  section?: string // Which part of the content is being edited
  cursorPosition?: number
}

export function useContentLocks(postId?: string) {
  const [locks, setLocks] = useKV<ContentLock[]>(`content-locks-${postId}`, [])
  const [myActiveLocks, setMyActiveLocks] = useState<Set<string>>(new Set())
  
  // Mock current user - in real app this would come from auth context
  const currentUser = {
    id: 'user-1',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face'
  }

  const acquireLock = useCallback((section: string, cursorPosition?: number) => {
    if (!postId) return null

    const lockId = `${currentUser.id}-${section}-${Date.now()}`
    const newLock: ContentLock = {
      id: lockId,
      postId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      timestamp: Date.now(),
      section,
      cursorPosition
    }

    setLocks(currentLocks => {
      // Remove any existing locks from this user for this section
      const filteredLocks = currentLocks.filter(
        lock => !(lock.userId === currentUser.id && lock.section === section)
      )
      return [...filteredLocks, newLock]
    })

    setMyActiveLocks(prev => new Set([...prev, lockId]))
    return lockId
  }, [postId, setLocks, currentUser.id, currentUser.name, currentUser.avatar])

  const releaseLock = useCallback((lockId: string) => {
    setLocks(currentLocks => currentLocks.filter(lock => lock.id !== lockId))
    setMyActiveLocks(prev => {
      const newSet = new Set(prev)
      newSet.delete(lockId)
      return newSet
    })
  }, [setLocks])

  const releaseAllLocks = useCallback(() => {
    setLocks(currentLocks => 
      currentLocks.filter(lock => lock.userId !== currentUser.id)
    )
    setMyActiveLocks(new Set())
  }, [setLocks, currentUser.id])

  const updateLockCursor = useCallback((lockId: string, cursorPosition: number) => {
    setLocks(currentLocks =>
      currentLocks.map(lock =>
        lock.id === lockId ? { ...lock, cursorPosition, timestamp: Date.now() } : lock
      )
    )
  }, [setLocks])

  const isLocked = useCallback((section: string, excludeCurrentUser = false) => {
    return locks.some(lock => 
      lock.section === section && 
      (!excludeCurrentUser || lock.userId !== currentUser.id) &&
      Date.now() - lock.timestamp < 30000 // 30 second timeout
    )
  }, [locks, currentUser.id])

  const getActiveLocks = useCallback((section?: string) => {
    const activeLocks = locks.filter(lock => 
      Date.now() - lock.timestamp < 30000 && // Filter out stale locks
      (!section || lock.section === section)
    )
    
    // Clean up stale locks
    if (activeLocks.length !== locks.length) {
      setLocks(activeLocks)
    }
    
    return activeLocks
  }, [locks, setLocks])

  const getCollaborators = useCallback(() => {
    const activeLocks = getActiveLocks()
    const collaboratorMap = new Map()
    
    activeLocks.forEach(lock => {
      if (!collaboratorMap.has(lock.userId)) {
        collaboratorMap.set(lock.userId, {
          id: lock.userId,
          name: lock.userName,
          avatar: lock.userAvatar,
          activeSections: [lock.section],
          lastActivity: lock.timestamp
        })
      } else {
        const collaborator = collaboratorMap.get(lock.userId)
        collaborator.activeSections.push(lock.section)
        collaborator.lastActivity = Math.max(collaborator.lastActivity, lock.timestamp)
      }
    })
    
    return Array.from(collaboratorMap.values())
  }, [getActiveLocks])

  // Auto-cleanup on unmount
  useEffect(() => {
    return () => {
      releaseAllLocks()
    }
  }, [releaseAllLocks])

  // Auto-refresh locks every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Refresh active locks from my user to keep them alive
      myActiveLocks.forEach(lockId => {
        setLocks(currentLocks =>
          currentLocks.map(lock =>
            lock.id === lockId ? { ...lock, timestamp: Date.now() } : lock
          )
        )
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [myActiveLocks, setLocks])

  return {
    locks: getActiveLocks(),
    acquireLock,
    releaseLock,
    releaseAllLocks,
    updateLockCursor,
    isLocked,
    getActiveLocks,
    getCollaborators,
    myActiveLocks: Array.from(myActiveLocks)
  }
}