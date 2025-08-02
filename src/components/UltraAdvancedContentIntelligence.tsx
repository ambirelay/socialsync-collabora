import { useState, useEffect } from 'react'
import { Post } from '@/types.ts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Brain, TrendingUp, Target, Zap, Eye, Heart, MessageCircle, Share2, Users, Clock, Globe } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface ContentIntelligenceProps {
  posts: Post[]
  onOptimizeContent: (postId: string, optimizations: any) => void
  onGenerateVariants: (post: Post) => void
}

interface ContentScore {
  overall: number
  engagement: number
  virality: number
  sentiment: number
  readability: number
  seo: number
}

interface AIInsight {
  type: 'optimization' | 'warning' | 'opportunity' | 'trend'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  action?: string
}

export function UltraAdvancedContentIntelligence({ posts, onOptimizeContent, onGenerateVariants }: ContentIntelligenceProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [contentScore, setContentScore] = useState<ContentScore | null>(null)
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [predictiveMetrics, setPredictiveMetrics] = useState<any>(null)

  // Simulate AI analysis
  const analyzeContent = async (post: Post) => {
    setIsAnalyzing(true)
    setSelectedPost(post)
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock AI-generated scores
    const score: ContentScore = {
      overall: Math.floor(Math.random() * 30) + 70,
      engagement: Math.floor(Math.random() * 30) + 65,
      virality: Math.floor(Math.random() * 40) + 40,
      sentiment: Math.floor(Math.random() * 20) + 75,
      readability: Math.floor(Math.random() * 25) + 70,
      seo: Math.floor(Math.random() * 35) + 55
    }
    
    setContentScore(score)
    
    // Mock AI insights
    const insights: AIInsight[] = [
      {
        type: 'optimization',
        title: 'Hashtag Optimization',
        description: 'Adding trending hashtags could increase reach by 34%',
        impact: 'high',
        action: 'Add #MondayMotivation, #ContentStrategy'
      },
      {
        type: 'opportunity',
        title: 'Engagement Window',
        description: 'Peak audience activity detected in 2 hours',
        impact: 'medium',
        action: 'Reschedule for optimal engagement'
      },
      {
        type: 'trend',
        title: 'Visual Content Trend',
        description: 'Carousel posts showing 45% higher engagement',
        impact: 'medium',
        action: 'Convert to carousel format'
      },
      {
        type: 'warning',
        title: 'Sentiment Alert',
        description: 'Content tone may be perceived as overly promotional',
        impact: 'low',
        action: 'Add more value-driven language'
      }
    ]
    
    setAiInsights(insights)
    
    // Mock predictive metrics
    setPredictiveMetrics({
      expectedReach: Math.floor(Math.random() * 10000) + 5000,
      expectedEngagement: Math.floor(Math.random() * 500) + 200,
      expectedShares: Math.floor(Math.random() * 50) + 10,
      confidenceScore: Math.floor(Math.random() * 20) + 75
    })
    
    setIsAnalyzing(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="text-primary" size={32} />
            Ultra-Advanced Content Intelligence
          </h1>
          <p className="text-muted-foreground mt-2">
            AI-powered content optimization and performance prediction
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-gradient-to-r from-purple-500/10 to-blue-500/10">
            <Zap size={14} className="mr-1" />
            AI Powered
          </Badge>
          <Badge variant="outline">
            {posts.length} Posts Analyzed
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Selection Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Select Content to Analyze</CardTitle>
            <CardDescription>
              Choose a post for AI-powered insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {posts.slice(0, 5).map((post) => (
              <div
                key={post.id}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                  selectedPost?.id === post.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
                onClick={() => analyzeContent(post)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-wrap gap-1 mt-1">
                    {post.platforms.map((platform) => (
                      <div
                        key={platform}
                        className="w-2 h-2 rounded-full bg-primary/60"
                        title={platform}
                      />
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {post.content || 'Untitled Post'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(post.scheduledDate || post.createdAt).toLocaleDateString()}
                    </p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {post.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Analysis Results */}
        <div className="lg:col-span-2 space-y-6">
          {isAnalyzing ? (
            <Card className="h-96 flex items-center justify-center">
              <div className="text-center space-y-4">
                <Brain size={48} className="text-primary animate-pulse mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold">AI Analysis in Progress</h3>
                  <p className="text-muted-foreground">
                    Analyzing content performance, sentiment, and optimization opportunities...
                  </p>
                </div>
                <Progress value={66} className="w-64 mx-auto" />
              </div>
            </Card>
          ) : selectedPost && contentScore ? (
            <Tabs defaultValue="scores" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="scores">Content Scores</TabsTrigger>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
                <TabsTrigger value="predictions">Predictions</TabsTrigger>
                <TabsTrigger value="optimize">Optimize</TabsTrigger>
              </TabsList>

              <TabsContent value="scores" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="text-primary" size={20} />
                      Content Performance Scores
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Overall Score */}
                    <div className="text-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg">
                      <div className={`text-4xl font-bold ${getScoreColor(contentScore.overall)}`}>
                        {contentScore.overall}
                      </div>
                      <p className="text-sm text-muted-foreground">Overall Score</p>
                    </div>

                    {/* Individual Scores */}
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { key: 'engagement', label: 'Engagement Potential', icon: Heart },
                        { key: 'virality', label: 'Virality Score', icon: Share2 },
                        { key: 'sentiment', label: 'Sentiment Analysis', icon: MessageCircle },
                        { key: 'readability', label: 'Readability', icon: Eye },
                        { key: 'seo', label: 'SEO Score', icon: TrendingUp },
                      ].map(({ key, label, icon: Icon }) => (
                        <div key={key} className="p-4 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon size={16} className="text-primary" />
                            <span className="text-sm font-medium">{label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={contentScore[key as keyof ContentScore]} 
                              className="flex-1" 
                            />
                            <span className={`text-sm font-bold ${getScoreColor(contentScore[key as keyof ContentScore])}`}>
                              {contentScore[key as keyof ContentScore]}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insights" className="space-y-4">
                <div className="space-y-3">
                  {aiInsights.map((insight, index) => (
                    <Card key={index} className="transition-all duration-200 hover:shadow-md">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={getImpactColor(insight.impact)}>
                                {insight.impact} impact
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {insight.type}
                              </Badge>
                            </div>
                            <h4 className="font-semibold">{insight.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {insight.description}
                            </p>
                            {insight.action && (
                              <p className="text-sm text-primary font-medium">
                                💡 {insight.action}
                              </p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              onOptimizeContent(selectedPost.id, { insight })
                              toast.success('Optimization applied')
                            }}
                          >
                            Apply
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="predictions" className="space-y-4">
                {predictiveMetrics && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="text-primary" size={20} />
                        Performance Predictions
                      </CardTitle>
                      <CardDescription>
                        AI-powered forecasting based on historical data and current trends
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-500/5 rounded-lg">
                          <Eye size={24} className="text-blue-500 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-blue-600">
                            {predictiveMetrics.expectedReach.toLocaleString()}
                          </div>
                          <p className="text-xs text-muted-foreground">Expected Reach</p>
                        </div>
                        <div className="text-center p-4 bg-green-500/5 rounded-lg">
                          <Heart size={24} className="text-green-500 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-green-600">
                            {predictiveMetrics.expectedEngagement.toLocaleString()}
                          </div>
                          <p className="text-xs text-muted-foreground">Expected Engagement</p>
                        </div>
                        <div className="text-center p-4 bg-purple-500/5 rounded-lg">
                          <Share2 size={24} className="text-purple-500 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-purple-600">
                            {predictiveMetrics.expectedShares}
                          </div>
                          <p className="text-xs text-muted-foreground">Expected Shares</p>
                        </div>
                        <div className="text-center p-4 bg-orange-500/5 rounded-lg">
                          <Target size={24} className="text-orange-500 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-orange-600">
                            {predictiveMetrics.confidenceScore}%
                          </div>
                          <p className="text-xs text-muted-foreground">Confidence</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="optimize" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Content Optimization Actions</CardTitle>
                    <CardDescription>
                      Apply AI-recommended improvements to boost performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button
                        className="h-auto p-6 flex flex-col items-start text-left"
                        variant="outline"
                        onClick={() => {
                          onOptimizeContent(selectedPost.id, { 
                            optimization: 'hashtags',
                            hashtags: ['#MondayMotivation', '#ContentStrategy', '#DigitalMarketing']
                          })
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Globe size={20} className="text-primary" />
                          <span className="font-semibold">Optimize Hashtags</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Add trending hashtags for 34% more reach
                        </p>
                      </Button>

                      <Button
                        className="h-auto p-6 flex flex-col items-start text-left"
                        variant="outline"
                        onClick={() => {
                          const optimizedTime = new Date()
                          optimizedTime.setHours(optimizedTime.getHours() + 2)
                          onOptimizeContent(selectedPost.id, { 
                            optimization: 'timing',
                            scheduledDate: optimizedTime.toISOString()
                          })
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Clock size={20} className="text-primary" />
                          <span className="font-semibold">Optimize Timing</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Schedule for peak audience activity
                        </p>
                      </Button>

                      <Button
                        className="h-auto p-6 flex flex-col items-start text-left"
                        variant="outline"
                        onClick={() => onGenerateVariants(selectedPost)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Users size={20} className="text-primary" />
                          <span className="font-semibold">A/B Test Variants</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Generate 3 content variations for testing
                        </p>
                      </Button>

                      <Button
                        className="h-auto p-6 flex flex-col items-start text-left"
                        variant="outline"
                        onClick={() => {
                          onOptimizeContent(selectedPost.id, { 
                            optimization: 'sentiment',
                            tone: 'more engaging and conversational'
                          })
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <MessageCircle size={20} className="text-primary" />
                          <span className="font-semibold">Improve Sentiment</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Enhance tone for better engagement
                        </p>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <div className="text-center space-y-4">
                <Brain size={48} className="text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold">Select Content to Analyze</h3>
                  <p className="text-muted-foreground">
                    Choose a post from the sidebar to get AI-powered insights and optimization recommendations
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default UltraAdvancedContentIntelligenceexport default UltraAdvancedContentIntelligence
