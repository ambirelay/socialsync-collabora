import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Palette, 
  Upload, 
  Download, 
  Eye, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3,
  Copy,
  CheckCircle,
  AlertCircle,
  Image,
  Type,
  Layers,
  Zap,
  Target,
  Users,
  BookOpen,
  Globe,
  Heart,
  Star,
  Sparkles
} from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface BrandColor {
  id: string
  name: string
  hex: string
  rgb: string
  usage: string
  accessibility: 'AA' | 'AAA' | 'Fail'
}

interface BrandFont {
  id: string
  name: string
  family: string
  weight: string
  usage: 'primary' | 'secondary' | 'accent'
  url?: string
}

interface BrandAsset {
  id: string
  name: string
  type: 'logo' | 'icon' | 'pattern' | 'image'
  url: string
  variants: string[]
  usage: string
}

interface BrandGuideline {
  id: string
  category: 'voice' | 'visual' | 'content' | 'social'
  title: string
  description: string
  examples: string[]
  doNots: string[]
}

interface BrandProfile {
  name: string
  description: string
  mission: string
  values: string[]
  personality: string[]
  voiceTone: {
    formal: number
    casual: number
    friendly: number
    professional: number
    playful: number
  }
  targetAudience: {
    primary: string
    secondary: string
    demographics: string
    psychographics: string
  }
}

const defaultBrandProfile: BrandProfile = {
  name: 'ContentPlan',
  description: 'A collaborative social media content planning platform that helps teams create, manage, and publish engaging content across multiple platforms.',
  mission: 'To empower content creators and marketing teams with tools that streamline collaboration and maximize content impact.',
  values: ['Collaboration', 'Innovation', 'Quality', 'Transparency', 'Growth'],
  personality: ['Professional', 'Innovative', 'Reliable', 'User-centric', 'Forward-thinking'],
  voiceTone: {
    formal: 70,
    casual: 30,
    friendly: 80,
    professional: 85,
    playful: 25
  },
  targetAudience: {
    primary: 'Marketing teams and social media managers',
    secondary: 'Freelancers and content creators',
    demographics: 'Ages 25-45, college-educated professionals',
    psychographics: 'Tech-savvy, collaboration-focused, results-driven'
  }
}

const sampleColors: BrandColor[] = [
  {
    id: '1',
    name: 'Primary Blue',
    hex: '#2563EB',
    rgb: 'rgb(37, 99, 235)',
    usage: 'Primary actions, headers, links',
    accessibility: 'AA'
  },
  {
    id: '2',
    name: 'Success Green',
    hex: '#10B981',
    rgb: 'rgb(16, 185, 129)',
    usage: 'Success states, approvals',
    accessibility: 'AA'
  },
  {
    id: '3',
    name: 'Warning Orange',
    hex: '#F59E0B',
    rgb: 'rgb(245, 158, 11)',
    usage: 'Pending states, notifications',
    accessibility: 'AA'
  },
  {
    id: '4',
    name: 'Error Red',
    hex: '#EF4444',
    rgb: 'rgb(239, 68, 68)',
    usage: 'Error states, rejections',
    accessibility: 'AA'
  },
  {
    id: '5',
    name: 'Neutral Gray',
    hex: '#6B7280',
    rgb: 'rgb(107, 114, 128)',
    usage: 'Text, borders, backgrounds',
    accessibility: 'AAA'
  }
]

const sampleFonts: BrandFont[] = [
  {
    id: '1',
    name: 'Inter',
    family: 'Inter, sans-serif',
    weight: '400, 500, 600, 700',
    usage: 'primary',
    url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
  },
  {
    id: '2',
    name: 'Lora',
    family: 'Lora, serif',
    weight: '400, 500, 600',
    usage: 'secondary',
    url: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600&display=swap'
  },
  {
    id: '3',
    name: 'JetBrains Mono',
    family: 'JetBrains Mono, monospace',
    weight: '400, 500',
    usage: 'accent',
    url: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap'
  }
]

const sampleAssets: BrandAsset[] = [
  {
    id: '1',
    name: 'Primary Logo',
    type: 'logo',
    url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=200&fit=crop',
    variants: ['horizontal', 'vertical', 'icon-only'],
    usage: 'Headers, business cards, official documents'
  },
  {
    id: '2',
    name: 'App Icon',
    type: 'icon',
    url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
    variants: ['16x16', '32x32', '64x64', '128x128'],
    usage: 'App icons, favicons, small branding'
  },
  {
    id: '3',
    name: 'Brand Pattern',
    type: 'pattern',
    url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=400&fit=crop',
    variants: ['light', 'dark', 'colorful'],
    usage: 'Backgrounds, decorative elements'
  }
]

const sampleGuidelines: BrandGuideline[] = [
  {
    id: '1',
    category: 'voice',
    title: 'Professional Yet Approachable',
    description: 'Our voice balances professionalism with warmth, making complex concepts accessible.',
    examples: [
      'Transform your content strategy with data-driven insights',
      'Let\'s make content collaboration effortless',
      'Ready to amplify your brand\'s voice?'
    ],
    doNots: [
      'Avoid overly technical jargon',
      'Don\'t use aggressive sales language',
      'Avoid being too casual in professional contexts'
    ]
  },
  {
    id: '2',
    category: 'visual',
    title: 'Clean and Modern Design',
    description: 'Visual elements should be clean, purposeful, and maintain plenty of white space.',
    examples: [
      'Use consistent spacing between elements',
      'Maintain visual hierarchy with typography',
      'Apply brand colors intentionally'
    ],
    doNots: [
      'Don\'t overcrowd layouts',
      'Avoid decorative elements without purpose',
      'Don\'t mix too many font weights'
    ]
  },
  {
    id: '3',
    category: 'content',
    title: 'Value-First Content',
    description: 'Every piece of content should provide clear value to our audience.',
    examples: [
      'Share actionable tips and insights',
      'Provide behind-the-scenes content',
      'Celebrate customer success stories'
    ],
    doNots: [
      'Don\'t create content just to post',
      'Avoid purely promotional content',
      'Don\'t ignore audience feedback'
    ]
  },
  {
    id: '4',
    category: 'social',
    title: 'Authentic Engagement',
    description: 'Social media interactions should feel genuine and foster real connections.',
    examples: [
      'Respond to comments with personalized messages',
      'Share user-generated content with credit',
      'Ask meaningful questions to spark discussion'
    ],
    doNots: [
      'Don\'t use generic, automated responses',
      'Avoid controversial topics unrelated to our brand',
      'Don\'t ignore negative feedback'
    ]
  }
]

export function EnhancedBrandManagement() {
  const [brandProfile, setBrandProfile] = useKV<BrandProfile>('brand-profile', defaultBrandProfile)
  const [colors, setColors] = useKV<BrandColor[]>('brand-colors', sampleColors)
  const [fonts, setFonts] = useKV<BrandFont[]>('brand-fonts', sampleFonts)
  const [assets, setAssets] = useKV<BrandAsset[]>('brand-assets', sampleAssets)
  const [guidelines, setGuidelines] = useKV<BrandGuideline[]>('brand-guidelines', sampleGuidelines)
  
  const [activeTab, setActiveTab] = useState('profile')
  const [showColorDialog, setShowColorDialog] = useState(false)
  const [editingColor, setEditingColor] = useState<BrandColor | null>(null)

  const [newColor, setNewColor] = useState<Partial<BrandColor>>({
    name: '',
    hex: '#000000',
    usage: ''
  })

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const addColor = () => {
    if (!newColor.name || !newColor.hex || !newColor.usage) return

    const color: BrandColor = {
      id: Date.now().toString(),
      name: newColor.name,
      hex: newColor.hex,
      rgb: hexToRgb(newColor.hex),
      usage: newColor.usage,
      accessibility: checkAccessibility(newColor.hex)
    }

    setColors(current => [...current, color])
    setNewColor({ name: '', hex: '#000000', usage: '' })
    setShowColorDialog(false)
    toast.success('Color added to brand palette!')
  }

  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return 'rgb(0, 0, 0)'
    
    const r = parseInt(result[1], 16)
    const g = parseInt(result[2], 16)  
    const b = parseInt(result[3], 16)
    
    return `rgb(${r}, ${g}, ${b})`
  }

  const checkAccessibility = (hex: string): 'AA' | 'AAA' | 'Fail' => {
    // Simplified accessibility check - in real app would use proper contrast ratio calculation
    const luminance = getLuminance(hex)
    if (luminance > 0.5) return 'AAA'
    if (luminance > 0.3) return 'AA'
    return 'Fail'
  }

  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.slice(1), 16)
    const r = (rgb >> 16) & 0xff
    const g = (rgb >> 8) & 0xff
    const b = (rgb >> 0) & 0xff
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255
  }

  const updateBrandProfile = (updates: Partial<BrandProfile>) => {
    setBrandProfile(current => ({ ...current, ...updates }))
    toast.success('Brand profile updated!')
  }

  const exportBrandGuide = () => {
    const brandData = {
      profile: brandProfile,
      colors,
      fonts,
      assets,
      guidelines
    }
    
    const dataStr = JSON.stringify(brandData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = 'brand-guide.json'
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    
    toast.success('Brand guide exported!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Brand Management</h1>
          <p className="text-muted-foreground">Manage your brand identity and guidelines</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={exportBrandGuide}>
            <Download size={16} className="mr-2" />
            Export Brand Guide
          </Button>
          <Button>
            <Plus size={16} className="mr-2" />
            Add Asset
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Target size={16} />
            Profile
          </TabsTrigger>
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <Palette size={16} />
            Colors
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center gap-2">
            <Type size={16} />
            Typography
          </TabsTrigger>
          <TabsTrigger value="assets" className="flex items-center gap-2">
            <Image size={16} />
            Assets
          </TabsTrigger>
          <TabsTrigger value="guidelines" className="flex items-center gap-2">
            <BookOpen size={16} />
            Guidelines
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <CheckCircle size={16} />
            Compliance
          </TabsTrigger>
        </TabsList>

        {/* Brand Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target size={20} />
                  Brand Identity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="brand-name">Brand Name</Label>
                  <Input 
                    id="brand-name"
                    value={brandProfile.name}
                    onChange={(e) => updateBrandProfile({ name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="brand-description">Description</Label>
                  <Textarea 
                    id="brand-description"
                    value={brandProfile.description}
                    onChange={(e) => updateBrandProfile({ description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="brand-mission">Mission Statement</Label>
                  <Textarea 
                    id="brand-mission"
                    value={brandProfile.mission}
                    onChange={(e) => updateBrandProfile({ mission: e.target.value })}
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Brand Values</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {brandProfile.values.map((value, index) => (
                      <Badge key={index} variant="secondary">
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Voice & Tone */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart size={20} />
                  Voice & Tone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(brandProfile.voiceTone).map(([tone, value]) => (
                  <div key={tone}>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="capitalize">{tone}</Label>
                      <span className="text-sm text-muted-foreground">{value}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Target Audience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users size={20} />
                  Target Audience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="primary-audience">Primary Audience</Label>
                  <Input 
                    id="primary-audience"
                    value={brandProfile.targetAudience.primary}
                    onChange={(e) => updateBrandProfile({ 
                      targetAudience: { ...brandProfile.targetAudience, primary: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="secondary-audience">Secondary Audience</Label>
                  <Input 
                    id="secondary-audience"
                    value={brandProfile.targetAudience.secondary}
                    onChange={(e) => updateBrandProfile({ 
                      targetAudience: { ...brandProfile.targetAudience, secondary: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="demographics">Demographics</Label>
                  <Textarea 
                    id="demographics"
                    value={brandProfile.targetAudience.demographics}
                    onChange={(e) => updateBrandProfile({ 
                      targetAudience: { ...brandProfile.targetAudience, demographics: e.target.value }
                    })}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Brand Personality */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles size={20} />
                  Brand Personality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {brandProfile.personality.map((trait, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {trait}
                    </Badge>
                  ))}
                </div>
                <Separator className="my-4" />
                <p className="text-sm text-muted-foreground">
                  These personality traits guide how your brand communicates and appears across all touchpoints.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Brand Colors</h2>
            <Dialog open={showColorDialog} onOpenChange={setShowColorDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus size={16} className="mr-2" />
                  Add Color
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Brand Color</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="color-name">Color Name</Label>
                    <Input 
                      id="color-name"
                      value={newColor.name || ''}
                      onChange={(e) => setNewColor(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Primary Blue"
                    />
                  </div>
                  <div>
                    <Label htmlFor="color-hex">Hex Value</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="color-hex"
                        type="color"
                        value={newColor.hex || '#000000'}
                        onChange={(e) => setNewColor(prev => ({ ...prev, hex: e.target.value }))}
                        className="w-16 h-10 p-1"
                      />
                      <Input 
                        value={newColor.hex || ''}
                        onChange={(e) => setNewColor(prev => ({ ...prev, hex: e.target.value }))}
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="color-usage">Usage</Label>
                    <Input 
                      id="color-usage"
                      value={newColor.usage || ''}
                      onChange={(e) => setNewColor(prev => ({ ...prev, usage: e.target.value }))}
                      placeholder="e.g., Primary buttons, headers"
                    />
                  </div>
                  <Button onClick={addColor} className="w-full">
                    Add Color
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {colors.map((color) => (
              <Card key={color.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div 
                      className="w-full h-20 rounded-lg border"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{color.name}</h3>
                        <Badge 
                          variant={
                            color.accessibility === 'AAA' ? 'default' :
                            color.accessibility === 'AA' ? 'secondary' : 'destructive'
                          }
                          className="text-xs"
                        >
                          {color.accessibility}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{color.usage}</p>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span>HEX:</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyToClipboard(color.hex)}
                          className="h-6 px-2 font-mono"
                        >
                          {color.hex}
                          <Copy size={12} className="ml-1" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>RGB:</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyToClipboard(color.rgb)}
                          className="h-6 px-2 font-mono"
                        >
                          {color.rgb}
                          <Copy size={12} className="ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Typography System</h2>
            <Button>
              <Plus size={16} className="mr-2" />
              Add Font
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {fonts.map((font) => (
              <Card key={font.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{font.name}</CardTitle>
                    <Badge variant={
                      font.usage === 'primary' ? 'default' :
                      font.usage === 'secondary' ? 'secondary' : 'outline'
                    }>
                      {font.usage}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Font Family</p>
                    <code className="text-sm bg-muted px-2 py-1 rounded">{font.family}</code>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Available Weights</p>
                    <p className="text-sm">{font.weight}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Preview</p>
                    <div className="space-y-2">
                      <p className="text-2xl" style={{ fontFamily: font.family.split(',')[0] }}>
                        The quick brown fox
                      </p>
                      <p className="text-base" style={{ fontFamily: font.family.split(',')[0] }}>
                        jumps over the lazy dog
                      </p>
                      <p className="text-sm" style={{ fontFamily: font.family.split(',')[0] }}>
                        ABCDEFGHIJKLMNOPQRSTUVWXYZ
                      </p>
                    </div>
                  </div>
                  {font.url && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => copyToClipboard(font.url!)}
                    >
                      <Copy size={14} className="mr-2" />
                      Copy Font URL
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Assets Tab */}
        <TabsContent value="assets" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Brand Assets</h2>
            <Button>
              <Upload size={16} className="mr-2" />
              Upload Asset
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => (
              <Card key={asset.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                      <img 
                        src={asset.url} 
                        alt={asset.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{asset.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {asset.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{asset.usage}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Variants</p>
                      <div className="flex flex-wrap gap-1">
                        {asset.variants.map((variant) => (
                          <Badge key={variant} variant="secondary" className="text-xs">
                            {variant}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye size={14} className="mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download size={14} className="mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Guidelines Tab */}
        <TabsContent value="guidelines" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Brand Guidelines</h2>
            <Button>
              <Plus size={16} className="mr-2" />
              Add Guideline
            </Button>
          </div>

          <div className="space-y-4">
            {guidelines.map((guideline) => (
              <Card key={guideline.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {guideline.category}
                      </Badge>
                      {guideline.title}
                    </CardTitle>
                    <Button variant="ghost" size="sm">
                      <Edit3 size={16} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{guideline.description}</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                        <CheckCircle size={16} />
                        Do This
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {guideline.examples.map((example, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-red-700 mb-2 flex items-center gap-2">
                        <AlertCircle size={16} />
                        Don't Do This
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {guideline.doNots.map((dont, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                            {dont}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle size={20} />
                Brand Compliance Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-bold text-green-600 mb-2">87%</div>
                  <p className="text-muted-foreground">Overall Compliance Score</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span>Color Usage</span>
                        <span className="text-sm font-medium">92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span>Typography</span>
                        <span className="text-sm font-medium">88%</span>
                      </div>
                      <Progress value={88} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span>Voice & Tone</span>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span>Logo Usage</span>
                        <span className="text-sm font-medium">90%</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span>Content Guidelines</span>
                        <span className="text-sm font-medium">82%</span>
                      </div>
                      <Progress value={82} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span>Accessibility</span>
                        <span className="text-sm font-medium">95%</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-3">Recent Compliance Issues</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <AlertCircle size={16} className="text-orange-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Inconsistent font usage detected</p>
                        <p className="text-xs text-muted-foreground">3 posts used unauthorized font weights</p>
                      </div>
                      <Button variant="outline" size="sm">Fix</Button>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <AlertCircle size={16} className="text-red-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Logo used incorrectly</p>
                        <p className="text-xs text-muted-foreground">Logo placed on low-contrast background</p>
                      </div>
                      <Button variant="outline" size="sm">Fix</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}