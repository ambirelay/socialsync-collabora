import { useState } from 'react'
import { Platform } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Sparkles, 
  Copy, 
  RefreshCw, 
  Lightbulb, 
  TrendingUp,
  Hash,
  Image,
  Calendar,
  Target,
  Wand2
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface ContentSuggestion {
  id: string
  title: string
  content: string
  platform: Platform
  tags: string[]
  estimatedEngagement: number
  trending: boolean
}

interface HashtagSuggestion {
  tag: string
  posts: number
  trend: 'up' | 'down' | 'stable'
  relevanceScore: number
}

interface AIContentAssistantProps {
  onUseContent: (content: string, platform: Platform) => void
  compact?: boolean
}

const sampleSuggestions: ContentSuggestion[] = [
  {
    id: 'sugg-1',
    title: 'Industry Insight Post',
    content: '💡 Did you know that 73% of consumers prefer brands that take a stand on social issues? \n\nThis shift in consumer behavior means authenticity isn\'t just nice-to-have—it\'s essential for building lasting customer relationships.\n\nHow is your brand showing up authentically? Share your thoughts below! 👇\n\n#BrandAuthenticity #Marketing2024 #ConsumerTrends',
    platform: 'linkedin',
    tags: ['professional', 'industry-insight', 'engagement'],
    estimatedEngagement: 85,
    trending: true
  },
  {
    id: 'sugg-2',
    title: 'Behind-the-Scenes Story',
    content: '✨ Monday motivation from our creative studio! \n\nOur team just wrapped up an incredible brainstorming session for our upcoming campaign. The energy in the room was infectious! 🚀\n\nWhat inspires your best creative work? Drop a comment and let us know! 💭',
    platform: 'instagram',
    tags: ['behind-scenes', 'team', 'motivation'],
    estimatedEngagement: 92,
    trending: false
  },
  {
    id: 'sugg-3',
    title: 'Quick Thread Starter',
    content: '🧵 Thread: 5 content marketing mistakes I see brands make every day\n\n1/ Posting without a strategy\n2/ Ignoring their community\n3/ Focusing only on selling\n4/ Inconsistent brand voice\n5/ Not measuring what matters\n\nLet me break each one down... (1/6)',
    platform: 'twitter',
    tags: ['thread', 'education', 'marketing-tips'],
    estimatedEngagement: 78,
    trending: true
  }
]

const hashtagSuggestions: HashtagSuggestion[] = [
  { tag: '#MarketingTips', posts: 125000, trend: 'up', relevanceScore: 95 },
  { tag: '#BrandStrategy', posts: 89000, trend: 'up', relevanceScore: 88 },
  { tag: '#ContentCreation', posts: 156000, trend: 'stable', relevanceScore: 82 },
  { tag: '#DigitalMarketing', posts: 245000, trend: 'down', relevanceScore: 79 },
  { tag: '#SocialMediaTips', posts: 198000, trend: 'up', relevanceScore: 91 }
]

const contentTemplates = [
  {
    name: 'Industry Insight',
    template: '💡 Did you know that [STATISTIC]?\n\nThis [INSIGHT/TREND] means [IMPLICATION].\n\nHow does this impact your [INDUSTRY/BUSINESS]? Share your thoughts! 👇'
  },
  {
    name: 'Behind the Scenes',
    template: '✨ [TIME CONTEXT] from our [LOCATION/TEAM]!\n\n[WHAT HAPPENED] and [FEELING/REACTION].\n\nWhat [RELATED QUESTION]? Let us know in the comments! 💭'
  },
  {
    name: 'Educational Thread',
    template: '🧵 Thread: [NUMBER] [TOPIC] every [AUDIENCE] should know\n\n1/ [POINT ONE]\n2/ [POINT TWO]\n3/ [POINT THREE]\n\nLet me break each one down... (1/[TOTAL])'
  },
  {
    name: 'Question Post',
    template: '🤔 Quick question for our community:\n\n[MAIN QUESTION]\n\nI\'ve been thinking about [CONTEXT] and would love to hear your perspective.\n\nDrop your thoughts below! 👇'
  }
]

export function AIContentAssistant({ onUseContent, compact = false }: AIContentAssistantProps) {
  const [prompt, setPrompt] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('linkedin')
  const [tone, setTone] = useState('professional')
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('')

  const generateContent = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt to generate content')
      return
    }

    setIsGenerating(true)
    
    try {
      // Create the AI prompt
      const aiPrompt = spark.llmPrompt`Create a ${tone} social media post for ${selectedPlatform} about: ${prompt}. 
      
      Requirements:
      - Keep it engaging and authentic
      - Include relevant emojis
      - Add 3-5 relevant hashtags
      - Match the platform's typical content style
      - Make it actionable or thought-provoking
      
      Platform: ${selectedPlatform}
      Tone: ${tone}`

      const response = await spark.llm(aiPrompt, 'gpt-4o-mini')
      setGeneratedContent(response)
      toast.success('Content generated successfully!')
    } catch (error) {
      toast.error('Failed to generate content. Please try again.')
      console.error('AI generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Content copied to clipboard!')
  }

  const useContent = (content: string) => {
    onUseContent(content, selectedPlatform)
    toast.success('Content added to post editor!')
  }

  const generateFromTemplate = (template: string) => {
    setPrompt(`Using this template: ${template}`)
    setSelectedTemplate(template)
  }

  const optimizeContent = async (content: string) => {
    setIsGenerating(true)
    
    try {
      const aiPrompt = spark.llmPrompt`Optimize this social media post for better engagement on ${selectedPlatform}:

      Original post: ${content}
      
      Please:
      - Improve the hook/opening
      - Add more engaging elements
      - Optimize hashtags for reach
      - Ensure platform-specific best practices
      - Keep the core message intact`

      const response = await spark.llm(aiPrompt, 'gpt-4o-mini')
      setGeneratedContent(response)
      toast.success('Content optimized!')
    } catch (error) {
      toast.error('Failed to optimize content')
    } finally {
      setIsGenerating(false)
    }
  }

  const getHashtagRecommendations = async (content: string) => {
    try {
      const aiPrompt = spark.llmPrompt`Suggest 5-8 relevant hashtags for this social media post on ${selectedPlatform}:

      Content: ${content}
      
      Return hashtags that are:
      - Relevant to the content
      - Mix of popular and niche tags
      - Platform-appropriate
      - Likely to increase reach`

      const response = await spark.llm(aiPrompt, 'gpt-4o-mini')
      return response.split('\n').filter(line => line.includes('#'))
    } catch (error) {
      toast.error('Failed to get hashtag recommendations')
      return []
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Wand2 size={24} className="text-purple-600" />
            AI Content Assistant
          </h2>
          <p className="text-muted-foreground">Generate engaging content with AI assistance</p>
        </div>
        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
          <Sparkles size={14} className="mr-1" />
          Powered by AI
        </Badge>
      </div>

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles size={20} />
                Content Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Platform</label>
                  <Select value={selectedPlatform} onValueChange={(value: Platform) => setSelectedPlatform(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tone</label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="authoritative">Authoritative</SelectItem>
                      <SelectItem value="playful">Playful</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">What do you want to post about?</label>
                <Textarea
                  placeholder="e.g., Our team's latest project success, industry trends in AI, behind-the-scenes of our product development..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <Button 
                onClick={generateContent}
                disabled={isGenerating || !prompt.trim()}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} className="mr-2" />
                    Generate Content
                  </>
                )}
              </Button>

              {generatedContent && (
                <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Generated Content</h4>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => optimizeContent(generatedContent)}
                        disabled={isGenerating}
                      >
                        <RefreshCw size={14} className="mr-1" />
                        Optimize
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(generatedContent)}
                      >
                        <Copy size={14} className="mr-1" />
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => useContent(generatedContent)}
                      >
                        Use Content
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm bg-white rounded p-3 border whitespace-pre-wrap">
                    {generatedContent}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {sampleSuggestions.map(suggestion => (
              <Card key={suggestion.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      {suggestion.trending && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                          <TrendingUp size={12} className="mr-1" />
                          Trending
                        </Badge>
                      )}
                      <Badge variant="outline">{suggestion.platform}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm bg-muted/50 rounded p-3 whitespace-pre-wrap">
                    {suggestion.content}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Est. engagement: {suggestion.estimatedEngagement}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(suggestion.content)}
                      >
                        <Copy size={14} className="mr-1" />
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => useContent(suggestion.content)}
                      >
                        Use
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {suggestion.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="hashtags" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash size={20} />
                Trending Hashtags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hashtagSuggestions.map(hashtag => (
                  <div key={hashtag.tag} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{hashtag.tag}</div>
                      <div className="text-sm text-muted-foreground">
                        {hashtag.posts.toLocaleString()} posts
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        hashtag.trend === 'up' ? 'bg-green-500' :
                        hashtag.trend === 'down' ? 'bg-red-500' : 'bg-gray-500'
                      }`} />
                      <Badge variant="outline" className="text-xs">
                        {hashtag.relevanceScore}% match
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(hashtag.tag)}
                      >
                        <Copy size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {contentTemplates.map((template, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb size={16} />
                    {template.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm bg-muted/50 rounded p-3 font-mono whitespace-pre-wrap">
                    {template.template}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(template.template)}
                    >
                      <Copy size={14} className="mr-1" />
                      Copy Template
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => generateFromTemplate(template.template)}
                    >
                      <Wand2 size={14} className="mr-1" />
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AIContentAssistant
