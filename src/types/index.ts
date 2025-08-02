export type PostStatus = 'draft' | 'pending' | 'approved' | 'rejected'
export type Platform = 'instagram' | 'twitter' | 'linkedin' | 'facebook'
export type UserRole = 'admin' | 'editor' | 'reviewer' | 'viewer'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
}

export interface Post {
  id: string
  content: string
  platform: Platform
  scheduledDate: string
  status: PostStatus
  authorId: string
  author: User
  createdAt: string
  updatedAt: string
  mediaUrl?: string
  mediaType?: 'image' | 'video'
}

export interface Comment {
  id: string
  postId: string
  authorId: string
  author: User
  content: string
  createdAt: string
  parentId?: string
  mentions?: string[]
}

export interface Approval {
  id: string
  postId: string
  reviewerId: string
  reviewer: User
  status: 'approved' | 'rejected'
  note?: string
  createdAt: string
}