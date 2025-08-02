import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Palette, 
  Type, 
  Image, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Plus,
  Edit3,
  Trash2,
  Download,
  Upload,
  Eye,
  Settings,
  Hash,
  MessageSquare,
  Users,
  Globe
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'

interface BrandGuideline {
  id: string
  category: 'visual' | 'tone' | 'content' | 'legal'
  title: string
  description: string
  rule: string
  examples: string[]
  severity: 'error' | 'warning' | 'info'
  isActive: boolean
}

interface BrandAsset {
  id: string
  type: 'logo' | 'color' | 'font' | 'template'
  name: string
  url?: string
  value?: string
  usage: string
  restrictions?: string[]
}

interface ContentTemplate {
  id: string
  name: string
  description: string
  platforms: string[]
  template: string
  variables: string[]
  category: string
}

interface BrandVoice {
  personality: string[]
  toneAttributes: Record<string, number>
  dosList: string[]
  dontsList: string[]
  vocabularyPreferences: {
    preferred: string[]
    avoid: string[]
  }
}

const defaultGuidelines: BrandGuideline[] = [
  {
    id: 'guideline-1',
    category: 'visual',
    title: 'Logo Usage',
    description: 'Proper logo implementation and spacing requirements',
    rule: 'Maintain minimum clear space equal to the height of the logo mark around all sides',
    examples: ['Correct spacing in headers', 'Proper background contrast'],
    severity: 'error',
    isActive: true
  },
  {
    id: 'guideline-2',
    category: 'tone',
    title: 'Voice and Tone',
    description: 'Professional yet approachable communication style',
    rule: 'Use active voice, avoid jargon, and maintain conversational but professional tone',
    examples: ['We help businesses grow', 'Our team is here to support you'],
    severity: 'warning',
    isActive: true
  },
  {
    id: 'guideline-3',
    category: 'content',
    title: 'Hashtag Strategy',
    description: 'Strategic hashtag usage for maximum reach',
    rule: 'Use 3-5 relevant hashtags per post, mix branded and trending tags',
    examples: ['#YourBrand #Innovation #TechTrends', '#Monday #Motivation #Growth'],
    severity: 'info',
    isActive: true
  },
  {
    id: 'guideline-4',
    category: 'legal',
    title: 'Copyright Compliance',
    description: 'Ensure all content respects intellectual property rights',
    rule: 'Only use owned, licensed, or royalty-free images and music',
    examples: ['Stock photos from approved sources', 'Original photography'],
    severity: 'error',
    isActive: true
  }
]

const defaultAssets: BrandAsset[] = [
  {
    id: 'asset-1',
    type: 'logo',
    name: 'Primary Logo',
    url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
    usage: 'Main brand identifier for all applications',
    restrictions: ['Minimum size: 24px height', 'Do not stretch or distort']
  },
  {
    id: 'asset-2',
    type: 'color',
    name: 'Primary Blue',
    value: '#2563EB',
    usage: 'Primary brand color for CTAs and headers',
    restrictions: ['Use for maximum 30% of design', 'Ensure WCAG AA contrast']
  },
  {
    id: 'asset-3',
    type: 'font',
    name: 'Inter',
    usage: 'Primary typeface for all digital applications',
    restrictions: ['Minimum size: 14px for body text', 'Maximum 3 weights per design']
  }
]

const defaultTemplates: ContentTemplate[] = [
  {
    id: 'template-1',
    name: 'Product Announcement',
    description: 'Template for announcing new products or features',
    platforms: ['linkedin', 'twitter', 'facebook'],
    template: '🚀 Exciting news! We\'re thrilled to announce {PRODUCT_NAME}!\n\n{PRODUCT_DESCRIPTION}\n\n✨ Key benefits:\n{BENEFIT_LIST}\n\nLearn more: {LINK}\n\n{HASHTAGS}',
    variables: ['PRODUCT_NAME', 'PRODUCT_DESCRIPTION', 'BENEFIT_LIST', 'LINK', 'HASHTAGS'],
    category: 'announcement'
  },
  {
    id: 'template-2',
    name: 'Weekly Motivation',
    description: 'Inspirational content for Monday motivation posts',
    platforms: ['instagram', 'linkedin'],
    template: '💪 {DAY} Motivation\n\n{QUOTE}\n\nRemember: {PERSONAL_MESSAGE}\n\nWhat\'s your goal for this week? Share in the comments! 👇\n\n{HASHTAGS}',
    variables: ['DAY', 'QUOTE', 'PERSONAL_MESSAGE', 'HASHTAGS'],
    category: 'motivation'
  }
]

const defaultBrandVoice: BrandVoice = {
  personality: ['Professional', 'Innovative', 'Approachable', 'Trustworthy'],
  toneAttributes: {
    formal: 3,
    casual: 7,
    serious: 4,
    playful: 6,
    respectful: 9,
    confident: 8
  },
  dosList: [
    'Use active voice',
    'Keep sentences concise',
    'Include call-to-actions',
    'Show personality',
    'Use industry expertise'
  ],
  dontsList: [
    'Use complex jargon',
    'Make promises you can\'t keep',
    'Be overly promotional',
    'Use negative language',
    'Ignore accessibility'
  ],
  vocabularyPreferences: {
    preferred: ['innovative', 'solution', 'partnership', 'growth', 'success'],
    avoid: ['cheap', 'revolutionary', 'amazing', 'incredible', 'unprecedented']
  }
}

export function BrandManagementSystem() {
  const [guidelines, setGuidelines] = useKV<BrandGuideline[]>('brand-guidelines', defaultGuidelines)
  const [assets, setAssets] = useKV<BrandAsset[]>('brand-assets', defaultAssets)
  const [templates, setTemplates] = useKV<ContentTemplate[]>('content-templates', defaultTemplates)
  const [brandVoice, setBrandVoice] = useKV<BrandVoice>('brand-voice', defaultBrandVoice)
  
  const [editingGuideline, setEditingGuideline] = useState<BrandGuideline | null>(null)
  const [editingTemplate, setEditingTemplate] = useState<ContentTemplate | null>(null)
  const [activeTab, setActiveTab] = useState('guidelines')

  const addGuideline = () => {
    const newGuideline: BrandGuideline = {
      id: `guideline-${Date.now()}`,
      category: 'content',
      title: 'New Guideline',
      description: '',
      rule: '',
      examples: [],
      severity: 'info',
      isActive: true
    }
    setEditingGuideline(newGuideline)
  }

  const saveGuideline = (guideline: BrandGuideline) => {
    if (guideline.id.includes(Date.now().toString())) {
      setGuidelines(prev => [...prev, guideline])
    } else {
      setGuidelines(prev => prev.map(g => g.id === guideline.id ? guideline : g))
    }
    setEditingGuideline(null)
    toast.success('Guideline saved successfully')
  }

  const deleteGuideline = (id: string) => {
    setGuidelines(prev => prev.filter(g => g.id !== id))
    toast.success('Guideline deleted')
  }

  const toggleGuideline = (id: string) => {
    setGuidelines(prev => prev.map(g => 
      g.id === id ? { ...g, isActive: !g.isActive } : g
    ))
  }

  const addTemplate = () => {
    const newTemplate: ContentTemplate = {
      id: `template-${Date.now()}`,
      name: 'New Template',
      description: '',
      platforms: [],
      template: '',
      variables: [],
      category: 'general'
    }
    setEditingTemplate(newTemplate)
  }

  const saveTemplate = (template: ContentTemplate) => {
    if (template.id.includes(Date.now().toString())) {
      setTemplates(prev => [...prev, template])
    } else {
      setTemplates(prev => prev.map(t => t.id === template.id ? template : t))
    }
    setEditingTemplate(null)
    toast.success('Template saved successfully')
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return <AlertTriangle className="text-red-500" size={16} />
      case 'warning': return <AlertTriangle className="text-yellow-500" size={16} />
      case 'info': return <CheckCircle className="text-blue-500" size={16} />
      default: return <CheckCircle className="text-gray-500" size={16} />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Brand Management</h2>
          <p className="text-muted-foreground">
            Maintain consistent brand identity across all content and channels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Export Guidelines
          </Button>
          <Button variant="outline">
            <Upload size={16} className="mr-2" />
            Import Assets
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="voice">Brand Voice</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="guidelines" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Content Guidelines</h3>
              <p className="text-sm text-muted-foreground">
                Rules and standards for maintaining brand consistency
              </p>
            </div>
            <Button onClick={addGuideline}>
              <Plus size={16} className="mr-2" />
              Add Guideline
            </Button>
          </div>

          <div className="grid gap-4">
            {guidelines.map(guideline => (
              <Card key={guideline.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">
                        {getSeverityIcon(guideline.severity)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{guideline.title}</h4>
                          <Badge variant="outline" className="text-xs capitalize">
                            {guideline.category}
                          </Badge>
                          <Badge className={getSeverityColor(guideline.severity)}>
                            {guideline.severity}
                          </Badge>
                          {!guideline.isActive && (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {guideline.description}
                        </p>
                        <div className="bg-muted/50 rounded p-3 mb-2">
                          <p className="text-sm font-medium mb-1">Rule:</p>
                          <p className="text-sm">{guideline.rule}</p>
                        </div>
                        {guideline.examples.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-1">Examples:</p>
                            <ul className="text-sm text-muted-foreground">
                              {guideline.examples.map((example, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <CheckCircle size={12} className="text-green-500" />
                                  {example}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={guideline.isActive}
                        onCheckedChange={() => toggleGuideline(guideline.id)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingGuideline(guideline)}
                      >
                        <Edit3 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteGuideline(guideline.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assets" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Brand Assets</h3>
              <p className="text-sm text-muted-foreground">
                Logos, colors, fonts, and other brand elements
              </p>
            </div>
            <Button>
              <Plus size={16} className="mr-2" />
              Add Asset
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assets.map(asset => (
              <Card key={asset.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    {asset.type === 'logo' && <Image size={20} />}
                    {asset.type === 'color' && <Palette size={20} />}
                    {asset.type === 'font' && <Type size={20} />}
                    {asset.type === 'template' && <Settings size={20} />}
                    <div>
                      <h4 className="font-medium">{asset.name}</h4>
                      <Badge variant="outline" className="text-xs capitalize">
                        {asset.type}
                      </Badge>
                    </div>
                  </div>

                  {asset.url && (
                    <div className="mb-3">
                      <img 
                        src={asset.url} 
                        alt={asset.name}
                        className="w-full h-24 object-cover rounded border"
                      />
                    </div>
                  )}

                  {asset.value && (
                    <div className="mb-3">
                      <div 
                        className="w-full h-12 rounded border"
                        style={{ backgroundColor: asset.value }}
                      />
                      <p className="text-sm font-mono mt-1">{asset.value}</p>
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground mb-2">
                    {asset.usage}
                  </p>

                  {asset.restrictions && asset.restrictions.length > 0 && (
                    <div>
                      <p className="text-xs font-medium mb-1">Restrictions:</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {asset.restrictions.map((restriction, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <AlertTriangle size={10} className="text-yellow-500" />
                            {restriction}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Content Templates</h3>
              <p className="text-sm text-muted-foreground">
                Pre-approved templates for consistent messaging
              </p>
            </div>
            <Button onClick={addTemplate}>
              <Plus size={16} className="mr-2" />
              Add Template
            </Button>
          </div>

          <div className="grid gap-4">
            {templates.map(template => (
              <Card key={template.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingTemplate(template)}
                      >
                        <Edit3 size={16} />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye size={16} className="mr-2" />
                        Preview
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">
                      {template.category}
                    </Badge>
                    {template.platforms.map(platform => (
                      <Badge key={platform} variant="secondary" className="text-xs capitalize">
                        {platform}
                      </Badge>
                    ))}
                  </div>

                  <div className="bg-muted/50 rounded p-3 mb-3">
                    <pre className="text-sm whitespace-pre-wrap font-sans">
                      {template.template}
                    </pre>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Variables:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.map(variable => (
                        <Badge key={variable} variant="outline" className="text-xs font-mono">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="voice" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Brand Voice & Personality</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Personality Traits</h4>
                <div className="flex flex-wrap gap-2">
                  {brandVoice.personality.map(trait => (
                    <Badge key={trait} variant="secondary">
                      {trait}
                    </Badge>
                  ))}
                  <Button variant="outline" size="sm">
                    <Plus size={16} className="mr-2" />
                    Add Trait
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Tone Attributes</h4>
                <div className="space-y-3">
                  {Object.entries(brandVoice.toneAttributes).map(([attribute, value]) => (
                    <div key={attribute} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm capitalize">{attribute}</span>
                        <span className="text-sm text-muted-foreground">{value}/10</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${value * 10}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 text-green-600">Do's</h4>
                  <ul className="space-y-2">
                    {brandVoice.dosList.map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle size={16} className="text-green-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-3 text-red-600">Don'ts</h4>
                  <ul className="space-y-2">
                    {brandVoice.dontsList.map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <AlertTriangle size={16} className="text-red-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Preferred Vocabulary</h4>
                  <div className="flex flex-wrap gap-1">
                    {brandVoice.vocabularyPreferences.preferred.map(word => (
                      <Badge key={word} className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {word}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Words to Avoid</h4>
                  <div className="flex flex-wrap gap-1">
                    {brandVoice.vocabularyPreferences.avoid.map(word => (
                      <Badge key={word} className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        {word}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { check: 'Brand Guidelines Adherence', status: 'passed', score: 94 },
                    { check: 'Legal Compliance Review', status: 'warning', score: 78 },
                    { check: 'Accessibility Standards', status: 'passed', score: 88 },
                    { check: 'Copyright Verification', status: 'failed', score: 45 }
                  ].map(item => (
                    <div key={item.check} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.status === 'passed' && <CheckCircle className="text-green-500" size={16} />}
                        {item.status === 'warning' && <AlertTriangle className="text-yellow-500" size={16} />}
                        {item.status === 'failed' && <AlertTriangle className="text-red-500" size={16} />}
                        <span className="text-sm">{item.check}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{item.score}%</span>
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              item.status === 'passed' ? 'bg-green-500' :
                              item.status === 'warning' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Violations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      post: 'Product Launch Post',
                      violation: 'Logo minimum size violation',
                      severity: 'error',
                      time: '2 hours ago'
                    },
                    {
                      post: 'Weekly Newsletter',
                      violation: 'Preferred vocabulary not used',
                      severity: 'warning',
                      time: '1 day ago'
                    },
                    {
                      post: 'Holiday Campaign',
                      violation: 'Hashtag strategy deviation',
                      severity: 'info',
                      time: '2 days ago'
                    }
                  ].map((violation, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-start gap-2">
                        {getSeverityIcon(violation.severity)}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{violation.post}</p>
                          <p className="text-sm text-muted-foreground">{violation.violation}</p>
                          <p className="text-xs text-muted-foreground">{violation.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Guideline Editor Dialog */}
      {editingGuideline && (
        <GuidelineEditor
          guideline={editingGuideline}
          onSave={saveGuideline}
          onCancel={() => setEditingGuideline(null)}
        />
      )}

      {/* Template Editor Dialog */}
      {editingTemplate && (
        <TemplateEditor
          template={editingTemplate}
          onSave={saveTemplate}
          onCancel={() => setEditingTemplate(null)}
        />
      )}
    </div>
  )
}

// Guideline Editor Component
function GuidelineEditor({ 
  guideline, 
  onSave, 
  onCancel 
}: {
  guideline: BrandGuideline
  onSave: (guideline: BrandGuideline) => void
  onCancel: () => void
}) {
  const [editedGuideline, setEditedGuideline] = useState<BrandGuideline>(guideline)

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {guideline.id.includes(Date.now().toString()) ? 'Create' : 'Edit'} Brand Guideline
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editedGuideline.title}
                onChange={(e) => setEditedGuideline(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select 
                value={editedGuideline.category} 
                onValueChange={(value: any) => setEditedGuideline(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visual">Visual</SelectItem>
                  <SelectItem value="tone">Tone</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={editedGuideline.description}
              onChange={(e) => setEditedGuideline(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="rule">Rule</Label>
            <Textarea
              id="rule"
              value={editedGuideline.rule}
              onChange={(e) => setEditedGuideline(prev => ({ ...prev, rule: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="severity">Severity</Label>
              <Select 
                value={editedGuideline.severity} 
                onValueChange={(value: any) => setEditedGuideline(prev => ({ ...prev, severity: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <Switch
                id="active"
                checked={editedGuideline.isActive}
                onCheckedChange={(checked) => setEditedGuideline(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="active">Active</Label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => onSave(editedGuideline)}>
            Save Guideline
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Template Editor Component
function TemplateEditor({ 
  template, 
  onSave, 
  onCancel 
}: {
  template: ContentTemplate
  onSave: (template: ContentTemplate) => void
  onCancel: () => void
}) {
  const [editedTemplate, setEditedTemplate] = useState<ContentTemplate>(template)

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {template.id.includes(Date.now().toString()) ? 'Create' : 'Edit'} Content Template
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={editedTemplate.name}
                  onChange={(e) => setEditedTemplate(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={editedTemplate.category}
                  onChange={(e) => setEditedTemplate(prev => ({ ...prev, category: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={editedTemplate.description}
                onChange={(e) => setEditedTemplate(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="template">Template Content</Label>
              <Textarea
                id="template"
                value={editedTemplate.template}
                onChange={(e) => setEditedTemplate(prev => ({ ...prev, template: e.target.value }))}
                rows={8}
                placeholder="Use {VARIABLE_NAME} for dynamic content..."
              />
            </div>

            <div>
              <Label>Variables (extracted from template)</Label>
              <div className="flex flex-wrap gap-1 mt-2">
                {editedTemplate.variables.map(variable => (
                  <Badge key={variable} variant="outline" className="font-mono">
                    {variable}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => onSave(editedTemplate)}>
            Save Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}