import { useState, useEffect } from 'react'
import { Post, Platform } from '@/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { MediaLibraryDialog } from '@/components/MediaLibrary'
import { Calendar, Image, AlertCircle, CheckCircle, FolderOpen } from '@phosphor-icons/react'

interface PostEditorProps {
  post?: Post
  open: boolean
  onClose: () => void
  onSave: (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'author'>) => void
}

const platformOptions = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'facebook', label: 'Facebook' }
]

export function PostEditor({ post, open, onClose, onSave }: PostEditorProps) {
  const [content, setContent] = useState('')
  const [platform, setPlatform] = useState<Platform>('instagram')
  const [scheduledDate, setScheduledDate] = useState('')
  const [mediaUrl, setMediaUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)

  // Reset form when post changes or dialog opens
  useEffect(() => {
    if (open) {
      setContent(post?.content || '')
      setPlatform(post?.platform || 'instagram')
      setScheduledDate(
        post?.scheduledDate ? new Date(post.scheduledDate).toISOString().slice(0, 16) : ''
      )
      setMediaUrl(post?.mediaUrl || '')
    }
  }, [post, open])

  const handleSave = async () => {
    if (!content.trim() || !scheduledDate) return
    
    setIsLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    onSave({
      content: content.trim(),
      platform,
      scheduledDate: new Date(scheduledDate).toISOString(),
      status: post?.status || 'draft',
      authorId: post?.authorId || 'user-1',
      mediaUrl: mediaUrl || undefined,
      mediaType: mediaUrl ? 'image' : undefined
    })

    if (!post) {
      // Reset form for new posts
      setContent('')
      setScheduledDate('')
      setMediaUrl('')
    }
    
    setIsLoading(false)
    onClose()
  }

  const getCharacterLimit = () => {
    switch (platform) {
      case 'twitter': return 280
      case 'instagram': return 2200
      case 'linkedin': return 3000
      case 'facebook': return 8000
      default: return 2200
    }
  }

  const characterLimit = getCharacterLimit()
  const remainingChars = characterLimit - content.length
  const progressPercentage = Math.max(0, Math.min(100, (content.length / characterLimit) * 100))
  
  const isValid = content.trim() && scheduledDate && remainingChars >= 0
  const hasWarning = remainingChars < characterLimit * 0.1 && remainingChars > 0

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {post ? 'Edit Post' : 'Create New Post'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Platform Selection */}
          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <Select value={platform} onValueChange={(value: Platform) => setPlatform(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {platformOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="content">Content</Label>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${
                  remainingChars < 0 ? 'text-red-500' : 
                  hasWarning ? 'text-amber-500' : 
                  'text-muted-foreground'
                }`}>
                  {remainingChars} characters remaining
                </span>
                {remainingChars < 0 && <AlertCircle size={14} className="text-red-500" />}
                {isValid && remainingChars >= 0 && <CheckCircle size={14} className="text-green-500" />}
              </div>
            </div>
            <Textarea
              id="content"
              placeholder={`Write your ${platform} post...`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`min-h-[120px] resize-none ${
                remainingChars < 0 ? 'border-red-500 focus-visible:ring-red-500' : ''
              }`}
            />
            <div className="space-y-1">
              <Progress 
                value={progressPercentage} 
                className={`h-1 ${
                  remainingChars < 0 ? '[&>div]:bg-red-500' :
                  hasWarning ? '[&>div]:bg-amber-500' :
                  '[&>div]:bg-green-500'
                }`}
              />
              {remainingChars < 0 && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={12} />
                  Content exceeds {platform} character limit
                </p>
              )}
            </div>
          </div>

          {/* Media URL */}
          <div className="space-y-2">
            <Label htmlFor="media">Media (optional)</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Image size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="media"
                  placeholder="https://example.com/image.jpg"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowMediaLibrary(true)}
                className="flex-shrink-0"
              >
                <FolderOpen size={16} className="mr-2" />
                Browse
              </Button>
            </div>
            {mediaUrl && (
              <div className="mt-2">
                <img
                  src={mediaUrl}
                  alt="Media preview"
                  className="w-full max-w-xs h-32 object-cover rounded border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          {/* Scheduled Date */}
          <div className="space-y-2">
            <Label htmlFor="scheduled-date">Scheduled Date & Time</Label>
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                id="scheduled-date"
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Preview */}
          {content && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="border rounded-lg p-3 bg-muted/30">
                <div className="text-sm">
                  <div className="font-medium text-primary mb-1">
                    {platformOptions.find(p => p.value === platform)?.label}
                  </div>
                  <div className="whitespace-pre-wrap">{content}</div>
                  {mediaUrl && (
                    <div className="mt-2">
                      <img
                        src={mediaUrl}
                        alt="Preview"
                        className="max-w-full h-32 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!isValid || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                post ? 'Save Changes' : 'Create Post'
              )}
            </Button>
          </div>
        </div>

        {/* Media Library Dialog */}
        <MediaLibraryDialog
          open={showMediaLibrary}
          onClose={() => setShowMediaLibrary(false)}
          onSelect={(asset) => setMediaUrl(asset.url)}
        />
      </DialogContent>
    </Dialog>
  )
}