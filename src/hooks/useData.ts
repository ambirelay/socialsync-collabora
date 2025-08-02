import { useKV } from '@github/spark/hooks'
import { Post, Comment, User } from '@/types'

// Mock current user - in a real app this would come from auth
const getCurrentUser = (): User => ({
  id: 'user-1',
  name: 'Sarah Chen',
  email: 'sarah@company.com',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
  role: 'admin'
})

// Hook for managing posts
export const usePosts = () => {
  const [posts, setPosts] = useKV<Post[]>('posts', [])
  
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
  const [comments, setComments] = useKV<Comment[]>('comments', [])
  
  const postComments = postId 
    ? comments.filter(comment => comment.postId === postId)
    : comments
  
  const addComment = (comment: Omit<Comment, 'id' | 'createdAt' | 'author'>) => {
    const newComment: Comment = {
      ...comment,
      id: `comment-${Date.now()}`,
      author: getCurrentUser(),
      createdAt: new Date().toISOString()
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