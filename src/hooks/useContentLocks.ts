import { useState, useEffect, useCallback } from 'react';
import { useKV } from '@github/spark/hooks';

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  color: string;
  lastActive: Date;
  currentLocation?: string;
}

interface ContentLock {
  postId: string;
  userId: string;
  userName: string;
  lockedAt: Date;
  expiresAt: Date;
}

export function useContentLocks() {
  // Initialize with error handling
  let locks: ContentLock[] = []
  let setLocks: (value: ContentLock[] | ((prev: ContentLock[]) => ContentLock[])) => void = () => {}
  let collaborators: Collaborator[] = []
  let setCollaborators: (value: Collaborator[] | ((prev: Collaborator[]) => Collaborator[])) => void = () => {}
  
  try {
    const [locksKV, setLocksKV] = useKV<ContentLock[]>('content-locks', [])
    const [collaboratorsKV, setCollaboratorsKV] = useKV<Collaborator[]>('active-collaborators', [])
    locks = locksKV || []
    setLocks = setLocksKV
    collaborators = collaboratorsKV || []
    setCollaborators = setCollaboratorsKV
  } catch (error) {
    console.error('Failed to initialize content locks KV storage:', error)
    // Fallback to in-memory state that doesn't persist
    locks = []
    setLocks = () => {}
    collaborators = []
    setCollaborators = () => {}
  }

  // Mock current user for demonstration
  const currentUser = {
    id: 'user-1',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    color: '#3b82f6'
  };

  // Clean up expired locks with error handling
  useEffect(() => {
    if (!setLocks || typeof setLocks !== 'function') return
    
    const cleanupInterval = setInterval(() => {
      try {
        const now = new Date()
        setLocks(currentLocks => {
          if (!Array.isArray(currentLocks)) return []
          return currentLocks.filter(lock => {
            try {
              return new Date(lock.expiresAt) > now
            } catch {
              return false // Remove locks with invalid dates
            }
          })
        })
      } catch (error) {
        console.error('Failed to clean up expired locks:', error)
      }
    }, 30000) // Clean up every 30 seconds

    return () => clearInterval(cleanupInterval)
  }, [setLocks])

  // Acquire a lock on content with enhanced error handling
  const acquireLock = useCallback(async (postId: string): Promise<boolean> => {
    if (!postId || typeof postId !== 'string') return false
    if (!setLocks || typeof setLocks !== 'function') return false
    
    try {
      const now = new Date()
      const expiresAt = new Date(now.getTime() + 5 * 60 * 1000) // 5 minutes
      
      // Check if already locked by someone else
      const existingLock = Array.isArray(locks) ? locks.find(lock => {
        try {
          return lock?.postId === postId && 
                 lock?.userId !== currentUser.id &&
                 new Date(lock.expiresAt) > now
        } catch {
          return false
        }
      }) : null

      if (existingLock) {
        return false // Cannot acquire lock
      }

      // Remove any existing lock by current user for this post
      setLocks(currentLocks => {
        if (!Array.isArray(currentLocks)) return []
        return currentLocks.filter(lock => {
          try {
            return !(lock?.postId === postId && lock?.userId === currentUser.id)
          } catch {
            return true // Keep locks we can't validate
          }
        })
      })

      // Add new lock
      const newLock: ContentLock = {
        postId,
        userId: currentUser.id,
        userName: currentUser.name,
        lockedAt: now,
        expiresAt
      }

      setLocks(currentLocks => {
        if (!Array.isArray(currentLocks)) return [newLock]
        return [...currentLocks, newLock]
      })
      return true
    } catch (error) {
      console.error('Failed to acquire content lock:', error)
      return false
    }
  }, [locks, setLocks])

  // Release a lock on content with error handling
  const releaseLock = useCallback(async (postId: string): Promise<void> => {
    if (!postId || typeof postId !== 'string') return
    if (!setLocks || typeof setLocks !== 'function') return
    
    try {
      setLocks(currentLocks => {
        if (!Array.isArray(currentLocks)) return []
        return currentLocks.filter(lock => {
          try {
            return !(lock?.postId === postId && lock?.userId === currentUser.id)
          } catch {
            return true // Keep locks we can't validate
          }
        })
      })
    } catch (error) {
      console.error('Failed to release content lock:', error)
    }
  }, [setLocks])

  // Get active collaborators with error handling
  const getCollaborators = useCallback(() => {
    try {
      // Mock collaborators for demo
      const mockCollaborators: Collaborator[] = [
        {
          id: 'user-2',
          name: 'Alex Thompson',
          avatar: 'AT',
          color: '#10b981',
          lastActive: new Date(),
          currentLocation: 'Editing Post #1234'
        },
        {
          id: 'user-3',
          name: 'Maria Garcia',
          avatar: 'MG',
          color: '#8b5cf6',
          lastActive: new Date(),
          currentLocation: 'Reviewing Calendar'
        },
        {
          id: 'user-4',
          name: 'David Kim',
          avatar: 'DK',
          color: '#f59e0b',
          lastActive: new Date(),
          currentLocation: 'In Analytics Dashboard'
        }
      ]

      return mockCollaborators
    } catch (error) {
      console.error('Failed to get collaborators:', error)
      return []
    }
  }, [])

  // Check if content is locked with error handling
  const isLocked = useCallback((postId: string): boolean => {
    if (!postId || typeof postId !== 'string') return false
    
    try {
      const now = new Date()
      return Array.isArray(locks) ? locks.some(lock => {
        try {
          return lock?.postId === postId && 
                 lock?.userId !== currentUser.id &&
                 new Date(lock.expiresAt) > now
        } catch {
          return false
        }
      }) : false
    } catch (error) {
      console.error('Failed to check lock status:', error)
      return false
    }
  }, [locks])

  // Get lock info for content with error handling
  const getLockInfo = useCallback((postId: string): ContentLock | null => {
    if (!postId || typeof postId !== 'string') return null
    
    try {
      const now = new Date()
      return Array.isArray(locks) ? locks.find(lock => {
        try {
          return lock?.postId === postId && 
                 new Date(lock.expiresAt) > now
        } catch {
          return false
        }
      }) || null : null
    } catch (error) {
      console.error('Failed to get lock info:', error)
      return null
    }
  }, [locks])

  return {
    acquireLock,
    releaseLock,
    getCollaborators,
    isLocked,
    getLockInfo,
    currentLocks: Array.isArray(locks) ? locks : []
  }
}