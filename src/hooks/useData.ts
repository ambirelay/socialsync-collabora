import { useKV } from '@github/spark/hooks'
import { Post, Comment, User } from '@/types.ts'

// Mock current user - in a real app this would come from auth
const getCurrentUser = (): User => ({
  id: 'user-1',
  name: 'Sarah Chen',
  email: 'sarah@company.com',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
  role: 'admin',
  permissions: ['all'],
  timezone: 'America/New_York',
  language: 'en-US',
  department: 'Marketing',
  lastActive: new Date(),
  preferences: {
    defaultView: 'calendar',
    notifications: true,
    aiAssistance: true,
    advancedFeatures: true,
    theme: 'light',
    timezone: 'America/New_York',
    language: 'en-US',
    compactMode: false,
    focusMode: false
  },
  createdAt: new Date(),
  updatedAt: new Date()
})

// Sample posts for demonstration
const samplePosts: Post[] = [
  {
    id: 'post-1',
    content: '🚀 Excited to announce our new product launch! This revolutionary tool will change how teams collaborate on content. What do you think about this approach? #innovation #productivity',
    platforms: ['linkedin'],
    scheduledDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    status: 'approved',
    authorId: 'user-1',
    author: {
      id: 'user-1',
      name: 'Sarah Chen',
      email: 'sarah@company.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
      role: 'admin',
      permissions: ['all'],
      timezone: 'America/New_York',
      language: 'en-US',
      department: 'Marketing',
      lastActive: new Date(),
      preferences: {
        defaultView: 'calendar',
        notifications: true,
        aiAssistance: true,
        advancedFeatures: true,
        theme: 'light',
        timezone: 'America/New_York',
        language: 'en-US',
        compactMode: false,
        focusMode: false
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
    media: [{
      id: 'media-1',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=800&h=600&fit=crop',
      size: 1024000,
      createdAt: new Date(),
      updatedAt: new Date()
    }]
  },
  {
    id: 'post-2',
    content: 'Behind the scenes of our creative process ✨ Our team spent weeks perfecting this campaign. Swipe to see the evolution!',
    platforms: ['instagram'],
    scheduledDate: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    status: 'pending',
    authorId: 'user-2',
    author: {
      id: 'user-2',
      name: 'Marcus Rodriguez',
      email: 'marcus@company.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      role: 'editor',
      permissions: ['edit', 'comment'],
      timezone: 'America/New_York',
      language: 'en-US',
      department: 'Creative',
      lastActive: new Date(),
      preferences: {
        defaultView: 'feed',
        notifications: true,
        aiAssistance: true,
        advancedFeatures: false,
        theme: 'light',
        timezone: 'America/New_York',
        language: 'en-US',
        compactMode: false,
        focusMode: false
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 900000).toISOString(),
    media: [{
      id: 'media-2',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
      size: 1024000,
      createdAt: new Date(),
      updatedAt: new Date()
    }]
  },
  {
    id: 'post-3',
    content: 'Quick thread on content marketing best practices 🧵\n\n1/ Start with your audience\n2/ Focus on value, not selling\n3/ Consistency beats perfection\n4/ Engage with your community\n\nWhat would you add?',
    platforms: ['twitter'],
    scheduledDate: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
    status: 'draft',
    authorId: 'user-3',
    author: {
      id: 'user-3',
      name: 'Emma Thompson',
      email: 'emma@company.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      role: 'editor',
      permissions: ['edit', 'comment'],
      timezone: 'America/New_York',
      language: 'en-US',
      department: 'Marketing',
      lastActive: new Date(),
      preferences: {
        defaultView: 'calendar',
        notifications: true,
        aiAssistance: false,
        advancedFeatures: false,
        theme: 'light',
        timezone: 'America/New_York',
        language: 'en-US',
        compactMode: true,
        focusMode: false
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    updatedAt: new Date(Date.now() - 600000).toISOString()
  },
  {
    id: 'post-4',
    content: 'Celebrating our amazing team! 🎉 This quarter we achieved:\n\n✅ 150% increase in engagement\n✅ 25 new client partnerships\n✅ 95% client satisfaction rate\n\nProud of what we\'ve accomplished together. Here\'s to an even better next quarter!',
    platforms: ['facebook'],
    scheduledDate: new Date(Date.now() + 345600000).toISOString(), // 4 days from now
    status: 'rejected',
    authorId: 'user-1',
    author: {
      id: 'user-1',
      name: 'Sarah Chen',
      email: 'sarah@company.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
      role: 'admin',
      permissions: ['all'],
      timezone: 'America/New_York',
      language: 'en-US',
      department: 'Marketing',
      lastActive: new Date(),
      preferences: {
        defaultView: 'calendar',
        notifications: true,
        aiAssistance: true,
        advancedFeatures: true,
        theme: 'light',
        timezone: 'America/New_York',
        language: 'en-US',
        compactMode: false,
        focusMode: false
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    updatedAt: new Date(Date.now() - 300000).toISOString(),
    media: [{
      id: 'media-4',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop',
      size: 1024000,
      createdAt: new Date(),
      updatedAt: new Date()
    }]
  },
  {
    id: 'post-5',
    content: 'Monday motivation 💪 Remember: every expert was once a beginner. Keep learning, keep growing!',
    platforms: ['linkedin'],
    scheduledDate: new Date(Date.now() + 604800000).toISOString(), // Next week
    status: 'approved',
    authorId: 'user-2',
    author: {
      id: 'user-2',
      name: 'Marcus Rodriguez',
      email: 'marcus@company.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      role: 'editor',
      permissions: ['edit', 'comment'],
      timezone: 'America/New_York',
      language: 'en-US',
      department: 'Creative',
      lastActive: new Date(),
      preferences: {
        defaultView: 'feed',
        notifications: true,
        aiAssistance: true,
        advancedFeatures: false,
        theme: 'light',
        timezone: 'America/New_York',
        language: 'en-US',
        compactMode: false,
        focusMode: false
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    createdAt: new Date(Date.now() - 18000000).toISOString(),
    updatedAt: new Date(Date.now() - 1200000).toISOString()
  }
]

// Sample comments for demonstration
const sampleComments: Comment[] = [
  {
    id: 'comment-1',
    postId: 'post-2',
    authorId: 'user-1',
    author: {
      id: 'user-1',
      name: 'Sarah Chen',
      email: 'sarah@company.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
      role: 'admin',
      permissions: ['all'],
      timezone: 'America/New_York',
      language: 'en-US',
      department: 'Marketing',
      lastActive: new Date(),
      preferences: {
        defaultView: 'calendar',
        notifications: true,
        aiAssistance: true,
        advancedFeatures: true,
        theme: 'light',
        timezone: 'America/New_York',
        language: 'en-US',
        compactMode: false,
        focusMode: false
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    content: 'Love the creative direction! Can we add more brand colors to the final slide?',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'comment-2',
    postId: 'post-2',
    authorId: 'user-3',
    author: {
      id: 'user-3',
      name: 'Emma Thompson',
      email: 'emma@company.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      role: 'editor',
      permissions: ['edit', 'comment'],
      timezone: 'America/New_York',
      language: 'en-US',
      department: 'Marketing',
      lastActive: new Date(),
      preferences: {
        defaultView: 'calendar',
        notifications: true,
        aiAssistance: false,
        advancedFeatures: false,
        theme: 'light',
        timezone: 'America/New_York',
        language: 'en-US',
        compactMode: true,
        focusMode: false
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    content: 'Great work Marcus! The storytelling is compelling. Ready for approval once the brand colors are updated.',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: 'comment-3',
    postId: 'post-4',
    authorId: 'user-2',
    author: {
      id: 'user-2',
      name: 'Marcus Rodriguez',
      email: 'marcus@company.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      role: 'editor',
      permissions: ['edit', 'comment'],
      timezone: 'America/New_York',
      language: 'en-US',
      department: 'Creative',
      lastActive: new Date(),
      preferences: {
        defaultView: 'feed',
        notifications: true,
        aiAssistance: true,
        advancedFeatures: false,
        theme: 'light',
        timezone: 'America/New_York',
        language: 'en-US',
        compactMode: false,
        focusMode: false
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    content: 'The metrics look great, but can we make this less corporate and more personal? Maybe focus on the team members behind these achievements?',
    createdAt: new Date(Date.now() - 1200000).toISOString(),
    updatedAt: new Date(Date.now() - 1200000).toISOString()
  }
]

// Hook for managing posts
export const usePosts = () => {
  const [posts, setPosts] = useKV<Post[]>('posts', samplePosts)
  
  const addPost = (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'author'>) => {
    const newPost: Post = {
      ...post,
      id: `post-${Date.now()}`,
      author: getCurrentUser(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setPosts(currentPosts => [...currentPosts, newPost])
    return newPost
  }
  
  const updatePost = (postId: string, updates: Partial<Post>) => {
    setPosts(currentPosts =>
      currentPosts.map(post =>
        post.id === postId 
          ? { ...post, ...updates, updatedAt: new Date().toISOString() }
          : post
      )
    )
  }
  
  const deletePost = (postId: string) => {
    setPosts(currentPosts => currentPosts.filter(post => post.id !== postId))
  }
  
  return { posts, addPost, updatePost, deletePost }
}

// Hook for managing comments
export const useComments = (postId?: string) => {
  const [comments, setComments] = useKV<Comment[]>('comments', sampleComments)
  
  const postComments = postId 
    ? comments.filter(comment => comment.postId === postId)
    : comments
  
  const addComment = (comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'author'>) => {
    const newComment: Comment = {
      ...comment,
      id: `comment-${Date.now()}`,
      author: getCurrentUser(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setComments(currentComments => [...currentComments, newComment])
    return newComment
  }
  
  return { comments: postComments, addComment }
}

// Hook for current user
export const useCurrentUser = () => {
  return getCurrentUser()
}