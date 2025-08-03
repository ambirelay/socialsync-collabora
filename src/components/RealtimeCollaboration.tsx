import { useState, useEffect, useRef } from 'react'
import { Post, User, Comment } from '@/types.ts'
import { useContentLocks } from '@/hooks/useCollaboration'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Users, MessageCircle, Eye, Edit3, Clock, CheckCircle, AlertCircle, Send, Lock, Unlock, GitMerge, Zap, Activity } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface RealtimeCollaborationProps {
  post: Post | null
  open: boolean
  onClose: () => void
  currentUser: User
  collaborators: User[]
}

export function RealtimeCollaboration({ 
  post, 
  open, 
  onClose, 
  currentUser, 
  collaborators = [] 
}: RealtimeCollaborationProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [selectedText, setSelectedText] = useState('')
  const [cursorPosition, setCursorPosition] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState('')
  
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const cursorLayerRef = useRef<HTMLDivElement>(null)
  
  // Mock collaboration hooks for now
  const collaborationState = {
    session: null,
    participants: collaborators.map(user => ({ 
      id: user.id, 
      userId: user.id, 
      user, 
      isActive: true,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    })),
    cursors: [],
    conflicts: [],
    isConnected: true,
    isLoading: false
  }
  
  const collaborationActions = {
    sendOperation: () => {},
    resolveCConflict: () => {},
    lockContent: () => {},
    unlockContent: () => {}
  }
  
  // Mock additional collaboration features
  const hasConflicts = false
  const hasActiveLocks = false
  const { locks, acquireLock, releaseLock, isLocked } = useContentLocks(post?.id || '', currentUser)

  // Initialize content
  useEffect(() => {
    if (post) {
      setEditedContent(post.content)
      
      // Mock comments for demo
      setComments([
        {
          id: '1',
          authorId: '2',
          author: {
            id: '2',
            name: 'Alex Thompson',
            email: 'alex@company.com',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            role: 'editor',
            permissions: ['edit'],
            timezone: 'America/New_York',
            language: 'en-US',
            lastActive: new Date(),
            preferences: {
              defaultView: 'calendar',
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
          content: 'This looks great! The AI optimization suggestions are really helping.',
          mentions: [],
          reactions: [],
          resolved: false,
          createdAt: new Date(Date.now() - 300000),
          updatedAt: new Date(Date.now() - 300000)
        }
      ])
    }
  }, [post])

  // Handle cursor movement in editor
  const handleCursorMove = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (editorRef.current) {
      const position = editorRef.current.selectionStart
      setCursorPosition(position)
      updateCursor({
        line: 0,
        column: position,
        offset: position
      })
    }
  }

  // Handle text selection
  const handleTextSelection = () => {
    if (editorRef.current) {
      const start = editorRef.current.selectionStart
      const end = editorRef.current.selectionEnd
      const selected = editedContent.slice(start, end)
      setSelectedText(selected)
      
      if (start !== end) {
        collaborationActions.updateSelection({
          start: { line: 0, column: start, offset: start },
          end: { line: 0, column: end, offset: end },
          direction: 'forward',
          type: 'text',
          content: selected,
          isCollapsed: false,
          color: currentUser.avatar ? '#4ECDC4' : '#FF6B6B',
          opacity: 0.3
        })
      }
    }
  }

  // Handle content editing with operational transforms
  const handleContentChange = async (newContent: string) => {
    if (!isEditing) return
    
    const oldContent = editedContent
    const diff = calculateDiff(oldContent, newContent)
    
    setEditedContent(newContent)
    
    // Apply operations for each change
    for (const change of diff) {
      if (change.type === 'insert') {
        await collaborationActions.insertText(change.text, change.position)
      } else if (change.type === 'delete') {
        await collaborationActions.deleteText(change.position, change.length)
      }
    }
  }

  // Start editing with content lock
  const handleStartEditing = async () => {
    const lock = await acquireLock('main-content', 'edit', 30000) // 30 seconds
    if (lock) {
      setIsEditing(true)
      toast.success('Content locked for editing')
    } else {
      toast.error('Content is currently being edited by another user')
    }
  }

  // Stop editing and release lock
  const handleStopEditing = async () => {
    const contentLock = locks.find(l => l.blockId === 'main-content' && l.userId === currentUser.id)
    if (contentLock) {
      await releaseLock(contentLock.id)
    }
    setIsEditing(false)
    toast.success('Editing session ended')
  }

  // Apply AI formatting suggestion
  const handleFormatSuggestion = async (start: number, end: number, formatting: Record<string, any>) => {
    await collaborationActions.formatText(start, end, formatting)
    toast.success('Formatting applied')
  }

  // Calculate simple text diff
  const calculateDiff = (oldText: string, newText: string) => {
    const changes: Array<{type: 'insert' | 'delete', position: number, text?: string, length?: number}> = []
    
    // Simple diff implementation for demo
    if (newText.length > oldText.length) {
      // Text was inserted
      for (let i = 0; i < Math.min(oldText.length, newText.length); i++) {
        if (oldText[i] !== newText[i]) {
          changes.push({
            type: 'insert',
            position: i,
            text: newText.slice(i, i + (newText.length - oldText.length))
          })
          break
        }
      }
      if (changes.length === 0) {
        // Text was appended
        changes.push({
          type: 'insert',
          position: oldText.length,
          text: newText.slice(oldText.length)
        })
      }
    } else if (newText.length < oldText.length) {
      // Text was deleted
      for (let i = 0; i < Math.min(oldText.length, newText.length); i++) {
        if (oldText[i] !== newText[i]) {
          changes.push({
            type: 'delete',
            position: i,
            length: oldText.length - newText.length
          })
          break
        }
      }
      if (changes.length === 0) {
        // Text was removed from end
        changes.push({
          type: 'delete',
          position: newText.length,
          length: oldText.length - newText.length
        })
      }
    }
    
    return changes
  }

  const handleAddComment = () => {
    if (!newComment.trim() || !post) return

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      authorId: currentUser.id,
      author: currentUser,
      content: newComment,
      mentions: [],
      reactions: [],
      resolved: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setComments(prev => [...prev, comment])
    setNewComment('')
    toast.success('Comment added')
  }

  const handleResolveComment = (commentId: string) => {
    setComments(prev => prev.map(comment =>
      comment.id === commentId ? { ...comment, resolved: true } : comment
    ))
    toast.success('Comment resolved')
  }

  const handleResolveConflict = async (conflictId: string, strategy: string) => {
    await resolveConflict(conflictId, { strategy, data: {} })
    toast.success('Conflict resolved')
  }

  if (!post) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Users size={20} />
            Real-time Collaborative Editing
            {isConnected && (
              <Badge variant="secondary" className="ml-2">
                <Activity size={12} className="mr-1 animate-pulse" />
                Live
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Connection Status & Conflicts */}
        {!isConnected && (
          <Alert className="mx-6 mb-0">
            <AlertCircle size={16} />
            <AlertDescription>
              Connecting to collaboration session...
            </AlertDescription>
          </Alert>
        )}

        {hasConflicts && (
          <Alert className="mx-6 mb-0">
            <GitMerge size={16} />
            <AlertDescription className="flex items-center justify-between">
              <span>{conflicts.length} conflict(s) detected in the document</span>
              <Button size="sm" variant="outline" onClick={() => {
                conflicts.forEach(conflict => handleResolveConflict(conflict.id, 'operational_transform'))
              }}>
                Auto-resolve
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-1 min-h-0">
          {/* Main Editor */}
          <div className="flex-1 p-6 pt-0">
            <div className="space-y-6">
              {/* Collaborative Editor */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      Content Editor
                      {isLocked('main-content') && !isEditing && (
                        <Badge variant="destructive">
                          <Lock size={12} className="mr-1" />
                          Locked by {locks.find(l => l.blockId === 'main-content')?.userId}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!isEditing ? (
                        <Button 
                          size="sm" 
                          onClick={handleStartEditing}
                          disabled={isLocked('main-content')}
                        >
                          <Edit3 size={14} className="mr-1" />
                          Edit
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={handleStopEditing}>
                          <Unlock size={14} className="mr-1" />
                          Stop Editing
                        </Button>
                      )}
                    </div>
                  </CardTitle>
                  <CardDescription>
                    {post.platforms.join(', ')} • {collaborationState.participants.length} collaborator(s) online
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {/* Live Cursors Layer */}
                    <div 
                      ref={cursorLayerRef}
                      className="absolute inset-0 pointer-events-none z-10"
                    >
                      {cursors.map((cursor) => (
                        <div
                          key={cursor.id}
                          className="absolute animate-pulse"
                          style={{
                            left: `${(cursor.position.offset / editedContent.length) * 100}%`,
                            top: '8px',
                            transform: 'translateX(-50%)'
                          }}
                        >
                          <div 
                            className="w-0.5 h-6 rounded-full"
                            style={{ backgroundColor: cursor.color }}
                          />
                          <div 
                            className="absolute -top-6 -left-2 px-2 py-1 rounded text-xs text-white font-medium whitespace-nowrap"
                            style={{ backgroundColor: cursor.color }}
                          >
                            {cursor.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Selections Layer */}
                    {collaborationState.selections.map((selection) => (
                      <div
                        key={selection.id}
                        className="absolute pointer-events-none"
                        style={{
                          left: `${(selection.start.offset / editedContent.length) * 100}%`,
                          width: `${((selection.end.offset - selection.start.offset) / editedContent.length) * 100}%`,
                          backgroundColor: selection.color,
                          opacity: selection.opacity,
                          height: '100%'
                        }}
                      />
                    ))}

                    {/* Main Text Editor */}
                    <Textarea
                      ref={editorRef}
                      value={editedContent}
                      onChange={(e) => handleContentChange(e.target.value)}
                      onMouseUp={handleTextSelection}
                      onKeyUp={handleCursorMove}
                      onClick={handleCursorMove}
                      disabled={!isEditing}
                      className="min-h-[300px] font-mono text-sm resize-none relative z-5"
                      placeholder="Start typing your content..."
                    />
                  </div>

                  {/* AI Suggestions */}
                  {selectedText && (
                    <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap size={16} className="text-primary" />
                        <span className="font-medium">AI Suggestions for selected text</span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleFormatSuggestion(
                            editedContent.indexOf(selectedText),
                            editedContent.indexOf(selectedText) + selectedText.length,
                            { bold: true }
                          )}
                        >
                          Make Bold
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleFormatSuggestion(
                            editedContent.indexOf(selectedText),
                            editedContent.indexOf(selectedText) + selectedText.length,
                            { italic: true }
                          )}
                        >
                          Make Italic
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => collaborationActions.replaceText(
                            editedContent.indexOf(selectedText),
                            editedContent.indexOf(selectedText) + selectedText.length,
                            selectedText.toUpperCase()
                          )}
                        >
                          Uppercase
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Comments Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle size={18} />
                    Comments & Feedback ({comments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ScrollArea className="h-64">
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={comment.author?.avatar} />
                            <AvatarFallback>
                              {comment.author?.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{comment.author?.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(comment.createdAt).toLocaleTimeString()}
                              </span>
                              {comment.resolved && (
                                <Badge variant="secondary" className="text-xs">
                                  <CheckCircle size={12} className="mr-1" />
                                  Resolved
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm">{comment.content}</p>
                            {!comment.resolved && currentUser.permissions.includes('edit') && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs"
                                onClick={() => handleResolveComment(comment.id)}
                              >
                                <CheckCircle size={12} className="mr-1" />
                                Mark as Resolved
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[60px]"
                    />
                    <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                      <Send size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="w-80 border-l bg-muted/30 p-6">
            <div className="space-y-6">
              {/* Active Collaborators */}
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Edit3 size={16} />
                  Active Collaborators ({collaborationState.participants.length})
                </h3>
                <div className="space-y-2">
                  {collaborationState.participants.map((participant) => (
                    <div key={participant.id} className="flex items-center gap-2">
                      <div className="relative">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={participant.user.avatar} />
                          <AvatarFallback className="text-xs">
                            {participant.user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div 
                          className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background"
                          style={{ backgroundColor: participant.isActive ? '#10B981' : '#6B7280' }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{participant.user.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Edit3 size={10} />
                          {participant.isActive ? 'Active' : 'Idle'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Conflict Resolution */}
              {hasConflicts && (
                <>
                  <div>
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <GitMerge size={16} />
                      Conflicts ({conflicts.length})
                    </h3>
                    <div className="space-y-2">
                      {conflicts.map((conflict) => (
                        <div key={conflict.id} className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                          <div className="text-sm font-medium">{conflict.type.replace('_', ' ')}</div>
                          <div className="text-xs text-muted-foreground mb-2">
                            Severity: {conflict.severity}
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleResolveConflict(conflict.id, 'operational_transform')}
                          >
                            Resolve
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Content Locks */}
              {locks.length > 0 && (
                <>
                  <div>
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <Lock size={16} />
                      Content Locks ({locks.length})
                    </h3>
                    <div className="space-y-2">
                      {locks.map((lock) => (
                        <div key={lock.id} className="p-2 bg-warning/10 border border-warning/20 rounded text-xs">
                          <div className="font-medium">{lock.blockId}</div>
                          <div className="text-muted-foreground">
                            {lock.type} lock by {lock.userId === currentUser.id ? 'You' : lock.userId}
                          </div>
                          <Progress 
                            value={Math.max(0, (lock.expiresAt.getTime() - Date.now()) / lock.duration * 100)} 
                            className="h-1 mt-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Analytics */}
              {collaborationState.analytics && (
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Activity size={16} />
                    Session Analytics
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span>{Math.round(collaborationState.analytics.session.duration / 60000)}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Operations</span>
                      <span>{collaborationState.analytics.session.totalOperations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Conflicts</span>
                      <span>{conflicts.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quality Score</span>
                      <span>{Math.round(collaborationState.analytics.session.qualityScore * 100)}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default RealtimeCollaboration