import { useState, useEffect } from 'react'
import { Post, Platform } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Lightbulb, 
  TrendingUp, 
  Hash, 
  Calendar,
  Target,
  Sparkles,
  RefreshCw,
  Copy,
  Send,
  BarChart3,
  Users,
  Eye
} from 'lucide-react'
import { toast } from 'sonner'
import { format, addDays } from 'date-fns'

interface ContentSuggestion {
  id: string
  type: 'trending' | 'engagement' | 'seasonal' | 'brand' | 'competitor'
  title: string
  content: string
  platform: Platform
  estimatedReach: number
  estimatedEngagement: number
  confidence: number
  hashtags: string[]
  bestTimeToPost: string
  reasoning: string
}

interface TrendingTopic {
  topic: string
  volume: number
  growth: number
  platforms: Platform[]
  relevanceScore: number
}

interface CompetitorInsight {
  competitor: string
  contentType: string
  engagement: number
  strategy: string
  opportunity: string
}

interface ContentSuggestionEngineProps {
  posts: Post[]
  onUseContent: (content: string, platform: Platform) => void
}

const mockTrendingTopics: TrendingTopic[] = [
  {
    topic: 'AI in Marketing',
    volume: 12500,
    growth: 45,
    platforms: ['linkedin', 'twitter'],
    relevanceScore: 92
  },
  {
    topic: 'Remote Work Culture',
    volume: 8900,
    growth: 23,
    platforms: ['linkedin', 'facebook'],
    relevanceScore: 78
  },
  {
    topic: 'Sustainable Business',
    volume: 15600,
    growth: 67,
    platforms: ['instagram', 'linkedin'],
    relevanceScore: 85
  },
  {
    topic: 'Customer Experience',
    volume: 9800,
    growth: 34,
    platforms: ['twitter', 'linkedin'],
    relevanceScore: 88
  }
]

const mockCompetitorInsights: CompetitorInsight[] = [
  {
    competitor: 'Industry Leader A',
    contentType: 'Video testimonials',
    engagement: 156,
    strategy: 'User-generated content focus',
    opportunity: 'Create more authentic customer stories'
  },
  {
    competitor: 'Startup B',
    contentType: 'Behind-the-scenes',
    engagement: 234,
    strategy: 'Transparency and process sharing',
    opportunity: 'Show more of your team and process'
  },
  {
    competitor: 'Enterprise C',
    contentType: 'Industry insights',
    engagement: 189,
    strategy: 'Thought leadership positioning',
    opportunity: 'Share more data-driven insights'
  }
]

export function ContentSuggestionEngine({ posts, onUseContent }: ContentSuggestionEngineProps) {
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([])
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all')
  const [contentType, setContentType] = useState<string>('all')
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<string>('')

  // Generate AI-powered content suggestions based on user's posting history
  const generateSuggestions = async () => {
    setIsGenerating(true)
    
    try {
      // Simulate AI analysis of posting patterns
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newSuggestions: ContentSuggestion[] = [
        {
          id: 'sugg-ai-1',
          type: 'trending',
          title: 'AI Marketing Trend Analysis',
          content: `🤖 The AI revolution in marketing is here, and the numbers are staggering:

📊 73% of marketers are already using AI tools
🚀 Companies see 37% increase in campaign efficiency
💡 Personalization accuracy improved by 85%

But here's what most miss: AI isn't replacing creativity—it's amplifying it.

The brands winning right now are those combining AI precision with human intuition.

What's your experience with AI in marketing? Share your biggest win or challenge below! 👇

#AIMarketing #MarketingTrends #DigitalTransformation #MarketingAutomation`,
          platform: 'linkedin',
          estimatedReach: 2400,
          estimatedEngagement: 180,
          confidence: 92,
          hashtags: ['#AIMarketing', '#MarketingTrends', '#DigitalTransformation'],
          bestTimeToPost: '10:00 AM - Tuesday',
          reasoning: 'Based on trending topic "AI in Marketing" with high relevance to your audience'
        },
        {
          id: 'sugg-ai-2',
          type: 'engagement',
          title: 'Team Culture Showcase',
          content: `Behind every great campaign is an even greater team 🌟

Today, we're celebrating the incredible collaboration that made our latest project possible:

✨ Sarah's strategic vision
🎨 Marcus's creative execution  
📊 Emma's data-driven insights
🚀 The whole team's dedication

When diverse talents unite around a shared goal, magic happens.

Tag someone who makes your work better! 👥

#TeamWork #CompanyCulture #Collaboration #Success`,
          platform: 'instagram',
          estimatedReach: 1800,
          estimatedEngagement: 240,
          confidence: 87,
          hashtags: ['#TeamWork', '#CompanyCulture', '#Collaboration'],
          bestTimeToPost: '2:00 PM - Wednesday',
          reasoning: 'High engagement potential based on your team-focused content performance'
        },
        {
          id: 'sugg-ai-3',
          type: 'seasonal',
          title: 'Year-End Reflection Thread',
          content: `2024 Marketing Lessons Learned 🧵

1/ Authenticity beats perfection every time
- Brands showing real stories got 3x more engagement
- Perfect posts? Ignored. Real moments? Shared.

2/ Community > Audience
- It's not about follower count anymore
- It's about connection depth and mutual value

3/ Video still reigns supreme
- But the format matters less than the message
- 30s of value > 3min of fluff

4/ Data-driven creativity is the sweet spot
- Use insights to inform, not constrain
- Let numbers guide, let creativity lead

What's your biggest marketing lesson from this year? 👇

#MarketingLessons #2024Reflection #DigitalMarketing #GrowthMindset`,
          platform: 'twitter',
          estimatedReach: 3200,
          estimatedEngagement: 290,
          confidence: 89,
          hashtags: ['#MarketingLessons', '#2024Reflection', '#DigitalMarketing'],
          bestTimeToPost: '9:30 AM - Thursday',
          reasoning: 'Thread format performs well for your account, seasonal timing optimal'
        },
        {
          id: 'sugg-ai-4',
          type: 'brand',
          title: 'Customer Success Story',
          content: `💫 CLIENT SPOTLIGHT 💫

When [Client Name] came to us, they were struggling with:
❌ Inconsistent brand messaging
❌ Low social media engagement  
❌ Disconnected marketing efforts

6 months later:
✅ 245% increase in brand awareness
✅ 156% boost in engagement rates
✅ Unified voice across all channels

"Working with this team transformed not just our marketing, but how we think about our brand story." - [Client Quote]

The secret? We didn't just change their content—we helped them find their authentic voice.

Ready to transform your brand story? Let's chat! 💬

#ClientSuccess #BrandTransformation #Marketing #Results`,
          platform: 'facebook',
          estimatedReach: 1600,
          estimatedEngagement: 145,
          confidence: 84,
          hashtags: ['#ClientSuccess', '#BrandTransformation', '#Marketing'],
          bestTimeToPost: '11:00 AM - Friday',
          reasoning: 'Success stories perform well on Facebook, builds credibility and trust'
        }
      ]
      
      setSuggestions(newSuggestions)
      toast.success('New content suggestions generated!')
    } catch (error) {
      toast.error('Failed to generate suggestions')
    } finally {
      setIsGenerating(false)
    }
  }

  // Filter suggestions based on selected criteria
  const filteredSuggestions = suggestions.filter(suggestion => {
    const platformMatch = selectedPlatform === 'all' || suggestion.platform === selectedPlatform
    const typeMatch = contentType === 'all' || suggestion.type === contentType
    return platformMatch && typeMatch
  })

  const handleUseContent = (suggestion: ContentSuggestion) => {
    onUseContent(suggestion.content, suggestion.platform)
    toast.success(`Content added to ${suggestion.platform} drafts!`)
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success('Content copied to clipboard!')
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600'
    if (confidence >= 80) return 'text-blue-600'
    if (confidence >= 70) return 'text-amber-600'
    return 'text-gray-600'
  }

  const getTypeColor = (type: string) => {
    const colors = {
      trending: 'bg-red-100 text-red-700',
      engagement: 'bg-blue-100 text-blue-700',
      seasonal: 'bg-green-100 text-green-700',
      brand: 'bg-purple-100 text-purple-700',
      competitor: 'bg-orange-100 text-orange-700'
    }
    return colors[type] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Lightbulb className="text-primary" />
            Content Suggestion Engine
          </h1>
          <p className="text-muted-foreground">AI-powered content ideas tailored to your brand and audience</p>
        </div>
        <Button onClick={generateSuggestions} disabled={isGenerating}>
          {isGenerating ? (
            <RefreshCw className="animate-spin mr-2" size={16} />
          ) : (
            <Sparkles className="mr-2" size={16} />
          )}
          {isGenerating ? 'Generating...' : 'Generate New Ideas'}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Content Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Platform</Label>
              <Select value={selectedPlatform} onValueChange={(value) => setSelectedPlatform(value as Platform | 'all')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Content Type</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="engagement">High Engagement</SelectItem>
                  <SelectItem value="seasonal">Seasonal</SelectItem>
                  <SelectItem value="brand">Brand Story</SelectItem>
                  <SelectItem value="competitor">Competitive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Trending Topic</Label>
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger>
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Topics</SelectItem>
                  {mockTrendingTopics.map(topic => (
                    <SelectItem key={topic.topic} value={topic.topic}>
                      {topic.topic} (+{topic.growth}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Suggestions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Suggested Content</h2>
            <Badge variant="secondary">{filteredSuggestions.length} suggestions</Badge>
          </div>
          
          {filteredSuggestions.length > 0 ? (
            <div className="space-y-4">
              {filteredSuggestions.map(suggestion => (
                <Card key={suggestion.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getTypeColor(suggestion.type)}>
                            {suggestion.type}
                          </Badge>
                          <Badge variant="outline">
                            {suggestion.platform}
                          </Badge>
                          <span className={`text-sm font-medium ${getConfidenceColor(suggestion.confidence)}`}>
                            {suggestion.confidence}% confidence
                          </span>
                        </div>
                        <h3 className="font-semibold">{suggestion.title}</h3>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-muted p-3 rounded text-sm whitespace-pre-line">
                        {suggestion.content}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Eye size={16} className="text-muted-foreground" />
                          <span>~{suggestion.estimatedReach.toLocaleString()} reach</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BarChart3 size={16} className="text-muted-foreground" />
                          <span>~{suggestion.estimatedEngagement} engagement</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-muted-foreground" />
                          <span>Best: {suggestion.bestTimeToPost}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Hash size={16} className="text-muted-foreground" />
                          <span>{suggestion.hashtags.length} hashtags</span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
                        <strong>AI Reasoning:</strong> {suggestion.reasoning}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button onClick={() => handleUseContent(suggestion)} size="sm">
                          <Send size={14} className="mr-1" />
                          Use Content
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(suggestion.content)}>
                          <Copy size={14} className="mr-1" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Lightbulb size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">No suggestions available</h3>
                <p className="text-muted-foreground mb-4">
                  Click "Generate New Ideas" to get AI-powered content suggestions
                </p>
                <Button onClick={generateSuggestions} disabled={isGenerating}>
                  <Sparkles className="mr-2" size={16} />
                  Generate Ideas
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Trending Topics & Insights */}
        <div className="space-y-6">
          {/* Trending Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp size={20} />
                Trending Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTrendingTopics.map(topic => (
                  <div key={topic.topic} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{topic.topic}</span>
                      <Badge variant="secondary" className="text-xs">
                        +{topic.growth}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{topic.volume.toLocaleString()} posts</span>
                      <span>•</span>
                      <span>{topic.relevanceScore}% relevant</span>
                    </div>
                    <Progress value={topic.relevanceScore} className="h-1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Competitor Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target size={20} />
                Competitor Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-4">
                  {mockCompetitorInsights.map((insight, index) => (
                    <div key={index} className="p-3 border rounded-lg space-y-2">
                      <div className="font-medium text-sm">{insight.competitor}</div>
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">{insight.contentType}</span> • {insight.engagement}% engagement
                      </div>
                      <div className="text-xs bg-yellow-50 p-2 rounded">
                        <strong>Opportunity:</strong> {insight.opportunity}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ContentSuggestionEngine
