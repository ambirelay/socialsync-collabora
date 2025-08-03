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
  const [locks, setLocks] = useKV<ContentLock[]>('content-locks', []);
  const [collaborators, setCollaborators] = useKV<Collaborator[]>('active-collaborators', []);

  // Mock current user for demonstration
  const currentUser = {
    id: 'user-1',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    color: '#3b82f6'
  };

  // Clean up expired locks
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = new Date();
      setLocks(currentLocks => 
        currentLocks.filter(lock => new Date(lock.expiresAt) > now)
      );
    }, 30000); // Clean up every 30 seconds

    return () => clearInterval(cleanupInterval);
  }, [setLocks]);

  // Acquire a lock on content
  const acquireLock = useCallback(async (postId: string): Promise<boolean> => {
    try {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes
      
      // Check if already locked by someone else
      const existingLock = locks.find(lock => 
        lock.postId === postId && 
        lock.userId !== currentUser.id &&
        new Date(lock.expiresAt) > now
      );

      if (existingLock) {
        return false; // Cannot acquire lock
      }

      // Remove any existing lock by current user for this post
      setLocks(currentLocks => 
        currentLocks.filter(lock => 
          !(lock.postId === postId && lock.userId === currentUser.id)
        )
      );

      // Add new lock
      const newLock: ContentLock = {
        postId,
        userId: currentUser.id,
        userName: currentUser.name,
        lockedAt: now,
        expiresAt
      };

      setLocks(currentLocks => [...currentLocks, newLock]);
      return true;
    } catch (error) {
      console.error('Failed to acquire content lock:', error);
      return false;
    }
  }, [locks, setLocks]);

  // Release a lock on content
  const releaseLock = useCallback(async (postId: string): Promise<void> => {
    try {
      setLocks(currentLocks => 
        currentLocks.filter(lock => 
          !(lock.postId === postId && lock.userId === currentUser.id)
        )
      );
    } catch (error) {
      console.error('Failed to release content lock:', error);
    }
  }, [setLocks]);

  // Get active collaborators
  const getCollaborators = useCallback(() => {
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
    ];

    return mockCollaborators;
  }, []);

  // Check if content is locked
  const isLocked = useCallback((postId: string): boolean => {
    const now = new Date();
    return locks.some(lock => 
      lock.postId === postId && 
      lock.userId !== currentUser.id &&
      new Date(lock.expiresAt) > now
    );
  }, [locks]);

  // Get lock info for content
  const getLockInfo = useCallback((postId: string): ContentLock | null => {
    const now = new Date();
    return locks.find(lock => 
      lock.postId === postId && 
      new Date(lock.expiresAt) > now
    ) || null;
  }, [locks]);

  return {
    acquireLock,
    releaseLock,
    getCollaborators,
    isLocked,
    getLockInfo,
    currentLocks: locks
  };
}