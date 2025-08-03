import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { 
  Users, 
  TrendingUp, 
  Target, 
  Brain, 
  Zap, 
  Globe, 
  Heart, 
  Eye,
  Clock,
  MapPin,
  Smartphone,
  Monitor,
  ShoppingBag,
  MessageCircle,
  Share2,
  ThumbsUp,
  BarChart3,
  PieChart,
  Activity,
  Sparkles,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'
import { Post } from '@/types'

interface AdvancedAudienceIntelligenceProps {
  posts: Post[]
  onTargetAudience?: (audience: AudienceSegment) => void
  onOptimizeContent?: (postId: string, optimizations: any) => void
}

interface AudienceSegment {
  id: string
  name: string
  size: number
  growth: number
  engagement: number
  demographics: {
    age: string
    gender: string
    location: string
    interests: string[]
  }
  behavior: {
    activeHours: string[]
    platforms: string[]
    contentPreferences: string[]
  }
  sentiment: 'positive' | 'neutral' | 'negative'
  conversionRate: number
}

interface ContentRecommendation {
  type: string
  confidence: number
  suggestion: string
  expectedImpact: string
}

export default function AdvancedAudienceIntelligence({ 
  posts, 
  onTargetAudience,
  onOptimizeContent 
}: AdvancedAudienceIntelligenceProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  // Mock audience segments data
  const audienceSegments: AudienceSegment[] = [
    {
      id: 'millennials-tech',
      name: 'Tech-Savvy Millennials',
      size: 45000,
      growth: 12.5,
      engagement: 8.7,
      demographics: {
        age: '25-35',
        gender: '52% Female, 48% Male',
        location: 'Urban areas, primarily US/EU',
        interests: ['Technology', 'Innovation', 'Productivity', 'Remote Work']
      },
      behavior: {
        activeHours: ['9-11 AM', '7-9 PM'],
        platforms: ['LinkedIn', 'Twitter', 'Instagram'],
        contentPreferences: ['How-to guides', 'Industry insights', 'Video content']
      },
      sentiment: 'positive',
      conversionRate: 4.2
    },
    {
      id: 'gen-z-creators',
      name: 'Gen Z Content Creators',
      size: 32000,
      growth: 28.3,
      engagement: 12.1,
      demographics: {
        age: '18-25',
        gender: '58% Female, 42% Male',
        location: 'Global, mobile-first',
        interests: ['Creativity', 'Social Impact', 'Authenticity', 'Trends']
      },
      behavior: {
        activeHours: ['3-5 PM', '9-11 PM'],
        platforms: ['TikTok', 'Instagram', 'YouTube'],
        contentPreferences: ['Short videos', 'Behind-the-scenes', 'User-generated content']
      },
      sentiment: 'positive',
      conversionRate: 6.8
    },
    {
      id: 'enterprise-leaders',
      name: 'Enterprise Decision Makers',
      size: 18500,
      growth: 8.1,
      engagement: 6.4,
      demographics: {
        age: '35-55',
        gender: '45% Female, 55% Male',
        location: 'Major business hubs worldwide',
        interests: ['Leadership', 'Strategy', 'ROI', 'Efficiency']
      },
      behavior: {
        activeHours: ['8-10 AM', '2-4 PM'],
        platforms: ['LinkedIn', 'Twitter', 'Email'],
        contentPreferences: ['Case studies', 'Whitepapers', 'Executive insights']
      },
      sentiment: 'neutral',
      conversionRate: 3.1
    }
  ]

  // Mock content recommendations
  const contentRecommendations: ContentRecommendation[] = [
    {
      type: 'Timing Optimization',
      confidence: 94,
      suggestion: 'Post during 9-11 AM for 35% higher engagement with Tech-Savvy Millennials',
      expectedImpact: '+35% engagement, +12% reach'
    },
    {
      type: 'Content Format',
      confidence: 89,
      suggestion: 'Use more video content for Gen Z audience - 67% preference increase',
      expectedImpact: '+67% video engagement, +23% shares'
    },
    {
      type: 'Platform Strategy',
      confidence: 87,
      suggestion: 'Focus LinkedIn content on weekday mornings for B2B audience',
      expectedImpact: '+28% professional engagement'
    },
    {
      type: 'Hashtag Strategy',
      confidence: 82,
      suggestion: 'Include trending hashtags: #FutureOfWork, #AIInnovation for tech audience',
      expectedImpact: '+19% discoverability'
    }
  ]

  const performAnalysis = async () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    
    // Simulate AI analysis progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setIsAnalyzing(false)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 500)
  }

  useEffect(() => {
    performAnalysis()
  }, [selectedTimeframe, selectedPlatform])

  const selectedSegmentData = selectedSegment 
    ? audienceSegments.find(s => s.id === selectedSegment)
    : null

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="text-primary" size={24} />
            Advanced Audience Intelligence
          </h2>
          <p className="text-muted-foreground mt-1">
            AI-powered audience analysis and content optimization recommendations
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={performAnalysis} 
            disabled={isAnalyzing}
            variant="outline"
            size="sm"
          >
            <RefreshCw size={16} className={isAnalyzing ? 'animate-spin' : ''} />
            Refresh
          </Button>
          
          <Button variant="outline" size="sm">
            <Download size={16} />
            Export
          </Button>
        </div>
      </div>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Analyzing audience data...</span>
                <span className="text-sm text-muted-foreground">{Math.round(analysisProgress)}%</span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Processing engagement patterns, demographic insights, and behavioral data
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="segments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="segments">Audience Segments</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        {/* Audience Segments Tab */}
        <TabsContent value="segments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Segments List */}
            <div className="lg:col-span-2 space-y-4">
              {audienceSegments.map((segment) => (
                <Card 
                  key={segment.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedSegment === segment.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedSegment(segment.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-semibold text-lg">{segment.name}</h3>
                          <Badge 
                            variant={segment.sentiment === 'positive' ? 'default' : 
                                   segment.sentiment === 'neutral' ? 'secondary' : 'destructive'}
                            className="text-xs"
                          >
                            {segment.sentiment}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Users size={14} />
                              Size
                            </div>
                            <div className="font-medium">
                              {(segment.size / 1000).toFixed(0)}K
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <TrendingUp size={14} />
                              Growth
                            </div>
                            <div className="font-medium text-green-600">
                              +{segment.growth}%
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Heart size={14} />
                              Engagement
                            </div>
                            <div className="font-medium">
                              {segment.engagement}/10
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Target size={14} />
                              Conversion
                            </div>
                            <div className="font-medium">
                              {segment.conversionRate}%
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onTargetAudience?.(segment)
                        }}
                      >
                        <Target size={14} />
                        Target
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Selected Segment Details */}
            <div className="lg:col-span-1">
              {selectedSegmentData ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {selectedSegmentData.name}
                    </CardTitle>
                    <CardDescription>
                      Detailed audience profile and behavior patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Demographics */}
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Users size={16} />
                        Demographics
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Age:</span>
                          <span className="ml-2">{selectedSegmentData.demographics.age}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Gender:</span>
                          <span className="ml-2">{selectedSegmentData.demographics.gender}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Location:</span>
                          <span className="ml-2">{selectedSegmentData.demographics.location}</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Interests */}
                    <div>
                      <h4 className="font-medium mb-3">Top Interests</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedSegmentData.demographics.interests.map((interest, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Behavior */}
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Activity size={16} />
                        Behavior Patterns
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-muted-foreground block mb-1">Active Hours:</span>
                          <div className="flex flex-wrap gap-1">
                            {selectedSegmentData.behavior.activeHours.map((hour, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <Clock size={12} className="mr-1" />
                                {hour}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-muted-foreground block mb-1">Preferred Platforms:</span>
                          <div className="flex flex-wrap gap-1">
                            {selectedSegmentData.behavior.platforms.map((platform, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {platform}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-muted-foreground block mb-1">Content Preferences:</span>
                          <div className="space-y-1">
                            {selectedSegmentData.behavior.contentPreferences.map((pref, index) => (
                              <div key={index} className="text-xs">{pref}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    <Users size={48} className="mx-auto mb-3 opacity-50" />
                    <p>Select an audience segment to view detailed insights</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Engagement Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp size={18} />
                  Engagement Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Video Content</span>
                    <div className="flex items-center gap-2">
                      <Progress value={85} className="w-20 h-2" />
                      <span className="text-sm font-medium">85%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Carousel Posts</span>
                    <div className="flex items-center gap-2">
                      <Progress value={72} className="w-20 h-2" />
                      <span className="text-sm font-medium">72%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Text + Image</span>
                    <div className="flex items-center gap-2">
                      <Progress value={58} className="w-20 h-2" />
                      <span className="text-sm font-medium">58%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Peak Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock size={18} />
                  Peak Activity Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { time: '9:00 AM', activity: 92 },
                    { time: '1:00 PM', activity: 78 },
                    { time: '7:00 PM', activity: 89 },
                    { time: '10:00 PM', activity: 65 }
                  ].map((slot, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{slot.time}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={slot.activity} className="w-20 h-2" />
                        <span className="text-sm text-muted-foreground">{slot.activity}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Platform Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 size={18} />
                  Platform Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { platform: 'Instagram', score: 8.7, trend: '+12%' },
                    { platform: 'LinkedIn', score: 7.2, trend: '+8%' },
                    { platform: 'Twitter', score: 6.8, trend: '+5%' },
                    { platform: 'TikTok', score: 9.1, trend: '+25%' }
                  ].map((platform, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{platform.platform}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{platform.score}/10</span>
                        <Badge variant="secondary" className="text-xs">
                          {platform.trend}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI-Generated Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles size={20} />
                AI-Generated Insights
              </CardTitle>
              <CardDescription>
                Machine learning insights based on your content performance and audience behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    insight: "Your Gen Z audience engages 67% more with behind-the-scenes content",
                    confidence: 94,
                    action: "Create more authentic, unpolished content"
                  },
                  {
                    insight: "Posts with questions in captions see 43% more comments",
                    confidence: 87,
                    action: "End posts with engaging questions"
                  },
                  {
                    insight: "Tuesday posts perform 28% better for your B2B audience",
                    confidence: 82,
                    action: "Schedule important announcements on Tuesdays"
                  },
                  {
                    insight: "Video content under 30 seconds gets 56% more completion rates",
                    confidence: 91,
                    action: "Keep videos concise and impactful"
                  }
                ].map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium flex-1">{item.insight}</p>
                      <Badge variant="secondary" className="text-xs ml-2">
                        {item.confidence}% confident
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{item.action}</p>
                    <Progress value={item.confidence} className="h-1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {contentRecommendations.map((rec, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap size={18} />
                      {rec.type}
                    </CardTitle>
                    <Badge variant="default">
                      {rec.confidence}% confident
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{rec.suggestion}</p>
                  <div className="bg-muted/50 rounded-lg p-3 mb-4">
                    <h4 className="text-xs font-medium text-muted-foreground mb-1">Expected Impact</h4>
                    <p className="text-sm font-medium text-green-600">{rec.expectedImpact}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      Apply Recommendation
                    </Button>
                    <Button variant="outline" size="sm">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Growth Predictions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={20} />
                  Growth Predictions
                </CardTitle>
                <CardDescription>
                  AI forecasts for the next 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Follower Growth</span>
                    <span className="text-lg font-bold text-green-600">+2,450</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Engagement Rate</span>
                    <span className="text-lg font-bold text-blue-600">+0.8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Reach Expansion</span>
                    <span className="text-lg font-bold text-purple-600">+15.2%</span>
                  </div>
                  <Separator />
                  <p className="text-xs text-muted-foreground">
                    Based on current trends and planned content strategy
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe size={20} />
                  Emerging Trends
                </CardTitle>
                <CardDescription>
                  Topics gaining momentum in your audience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { topic: 'AI-powered productivity', growth: '+145%', confidence: 92 },
                    { topic: 'Sustainable business practices', growth: '+89%', confidence: 87 },
                    { topic: 'Remote team collaboration', growth: '+67%', confidence: 83 },
                    { topic: 'Personal branding tips', growth: '+54%', confidence: 78 }
                  ].map((trend, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{trend.topic}</p>
                        <p className="text-xs text-muted-foreground">
                          {trend.confidence}% prediction confidence
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {trend.growth}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Calendar Predictions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar size={20} />
                Optimal Posting Calendar
              </CardTitle>
              <CardDescription>
                AI-recommended posting schedule for maximum impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 text-center">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <div key={index} className="text-xs font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
                {/* Mock calendar with optimal times */}
                {Array.from({ length: 7 }, (_, i) => (
                  <div key={i} className="space-y-1">
                    <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      9 AM
                    </div>
                    {i === 1 && (
                      <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        2 PM
                      </div>
                    )}
                    {(i === 0 || i === 2 || i === 4) && (
                      <div className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        7 PM
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-100 rounded"></div>
                  <span>High engagement</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-100 rounded"></div>
                  <span>Medium engagement</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-purple-100 rounded"></div>
                  <span>Best for video</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdvancedAudienceIntelligence
