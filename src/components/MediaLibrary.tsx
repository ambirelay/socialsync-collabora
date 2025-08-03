import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Image, Video, FileText, Upload, Search, FolderOpen, Grid3X3, List, Trash2 } from 'lucide-react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface MediaAsset {
  id: string
  name: string
  url: string
  type: 'image' | 'video' | 'document'
  size: number
  uploadedAt: string
  tags: string[]
  folder?: string
}

const sampleAssets: MediaAsset[] = [
  {
    id: 'asset-1',
    name: 'product-launch-hero.jpg',
    url: 'https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=800&h=600&fit=crop',
    type: 'image',
    size: 245760,
    uploadedAt: new Date(Date.now() - 86400000).toISOString(),
    tags: ['product', 'launch', 'hero'],
    folder: 'campaigns'
  },
  {
    id: 'asset-2',
    name: 'team-celebration.jpg',
    url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop',
    type: 'image',
    size: 189440,
    uploadedAt: new Date(Date.now() - 172800000).toISOString(),
    tags: ['team', 'celebration', 'office'],
    folder: 'team'
  },
  {
    id: 'asset-3',
    name: 'creative-process.mp4',
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
    type: 'video',
    size: 1024000,
    uploadedAt: new Date(Date.now() - 259200000).toISOString(),
    tags: ['creative', 'process', 'behind-scenes'],
    folder: 'campaigns'
  },
  {
    id: 'asset-4',
    name: 'brand-guidelines.pdf',
    url: '/assets/brand-guidelines.pdf',
    type: 'document',
    size: 512000,
    uploadedAt: new Date(Date.now() - 604800000).toISOString(),
    tags: ['brand', 'guidelines', 'document'],
    folder: 'brand'
  },
  {
    id: 'asset-5',
    name: 'workspace-photo.jpg',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    type: 'image',
    size: 167890,
    uploadedAt: new Date(Date.now() - 345600000).toISOString(),
    tags: ['workspace', 'office', 'environment'],
    folder: 'team'
  }
]

const typeIcons = {
  image: Image,
  video: Video,
  document: FileText
}

const typeColors = {
  image: 'bg-blue-100 text-blue-700',
  video: 'bg-purple-100 text-purple-700',
  document: 'bg-green-100 text-green-700'
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

interface MediaLibraryProps {
  onSelectAsset?: (asset: MediaAsset) => void
  allowMultiple?: boolean
}

export function MediaLibrary({ onSelectAsset, allowMultiple = false }: MediaLibraryProps) {
  const [assets, setAssets] = useKV<MediaAsset[]>('media-assets', sampleAssets)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFolder, setSelectedFolder] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])

  // Get unique folders
  const folders = ['all', ...new Set(assets.map(asset => asset.folder).filter(Boolean))]

  // Filter assets
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesFolder = selectedFolder === 'all' || asset.folder === selectedFolder
    return matchesSearch && matchesFolder
  })

  const handleSelectAsset = (asset: MediaAsset) => {
    if (allowMultiple) {
      setSelectedAssets(current => 
        current.includes(asset.id) 
          ? current.filter(id => id !== asset.id)
          : [...current, asset.id]
      )
    } else {
      onSelectAsset?.(asset)
    }
  }

  const handleDeleteAsset = (assetId: string) => {
    const asset = assets.find(a => a.id === assetId)
    setAssets(current => current.filter(a => a.id !== assetId))
    toast.success(`${asset?.name} deleted successfully`)
  }

  const handleUpload = () => {
    // Mock upload functionality
    const newAsset: MediaAsset = {
      id: `asset-${Date.now()}`,
      name: 'new-upload.jpg',
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      type: 'image',
      size: 234567,
      uploadedAt: new Date().toISOString(),
      tags: ['new', 'upload'],
      folder: selectedFolder === 'all' ? undefined : selectedFolder
    }
    
    setAssets(current => [newAsset, ...current])
    toast.success('File uploaded successfully')
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Media Library</h3>
          <p className="text-sm text-muted-foreground">
            {filteredAssets.length} of {assets.length} assets
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleUpload} size="sm">
            <Upload size={16} className="mr-2" />
            Upload
          </Button>
          <div className="flex items-center border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 size={16} />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <FolderOpen size={16} className="text-muted-foreground" />
          <div className="flex items-center gap-1">
            {folders.map(folder => (
              <Button
                key={folder}
                variant={selectedFolder === folder ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedFolder(folder)}
                className="capitalize"
              >
                {folder}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Assets Display */}
      <ScrollArea className="h-[400px]">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAssets.map(asset => {
              const Icon = typeIcons[asset.type]
              const isSelected = selectedAssets.includes(asset.id)
              
              return (
                <Card 
                  key={asset.id} 
                  className={`cursor-pointer hover:shadow-md transition-all ${
                    isSelected ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleSelectAsset(asset)}
                >
                  <CardContent className="p-3">
                    <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-muted">
                      {asset.type === 'image' ? (
                        <img 
                          src={asset.url} 
                          alt={asset.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon size={32} className="text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge className={`${typeColors[asset.type]} text-xs`}>
                          <Icon size={10} className="mr-1" />
                          {asset.type}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteAsset(asset.id)
                          }}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                      
                      <div>
                        <div className="font-medium text-sm line-clamp-1" title={asset.name}>
                          {asset.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatFileSize(asset.size)}
                        </div>
                      </div>
                      
                      {asset.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {asset.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {asset.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{asset.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredAssets.map(asset => {
              const Icon = typeIcons[asset.type]
              const isSelected = selectedAssets.includes(asset.id)
              
              return (
                <div
                  key={asset.id}
                  className={`flex items-center gap-4 p-3 border rounded-lg cursor-pointer hover:bg-muted/30 transition-colors ${
                    isSelected ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleSelectAsset(asset)}
                >
                  <div className="w-12 h-12 rounded bg-muted flex items-center justify-center flex-shrink-0">
                    {asset.type === 'image' ? (
                      <img 
                        src={asset.url} 
                        alt={asset.name}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <Icon size={20} className="text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-medium truncate">{asset.name}</div>
                      <Badge className={`${typeColors[asset.type]} text-xs`}>
                        {asset.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatFileSize(asset.size)}</span>
                      <span>•</span>
                      <span>{asset.folder || 'Root'}</span>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteAsset(asset.id)
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </ScrollArea>

      {allowMultiple && selectedAssets.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {selectedAssets.length} asset(s) selected
          </div>
          <Button onClick={() => setSelectedAssets([])}>
            Clear Selection
          </Button>
        </div>
      )}
    </div>
  )
}

// Media Library Dialog Component
interface MediaLibraryDialogProps {
  open: boolean
  onClose: () => void
  onSelect: (asset: MediaAsset) => void
}

export function MediaLibraryDialog({ open, onClose, onSelect }: MediaLibraryDialogProps) {
  const handleSelect = (asset: MediaAsset) => {
    onSelect(asset)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Choose Media</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <MediaLibrary onSelectAsset={handleSelect} />
        </div>
      </DialogContent>
    </Dialog>
  )
}