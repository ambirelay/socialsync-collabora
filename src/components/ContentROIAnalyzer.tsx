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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  BarChart3, 
  PieChart,
  Calculator,
  Sparkles,
  Filter,
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Eye,
  Users,
  Heart,
  Share2,
  MessageCircle,
  Clock,
  Calendar
} from '@phosphor-icons/react'
import { Post } from '@/types'

interface ContentROIAnalyzerProps {
  posts: Post[]
  onOptimizeROI?: (recommendations: ROIRecommendation[]) => void
}

interface ROIMetrics {
  totalInvestment: number
  totalRevenue: number
  roi: number
  costPerEngagement: number
  revenuePerPost: number
  engagementValue: number
}

interface ROIRecommendation {
  type: 'investment' | 'content' | 'timing' | 'platform'
  title: string
  description: string
  expectedImpact: string
  confidence: number
  priority: 'high' | 'medium' | 'low'
}

interface ContentCost {
  creation: number
  design: number
  promotion: number
  management: number
}

export default function ContentROIAnalyzer({ posts, onOptimizeROI }: ContentROIAnalyzerProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [customCosts, setCustomCosts] = useState<ContentCost>({
    creation: 150,
    design: 100,
    promotion: 200,
    management: 80
  })

  // Mock ROI data
  const roiMetrics: ROIMetrics = {
    totalInvestment: 2850,
    totalRevenue: 8400,
    roi: 194.7,
    costPerEngagement: 0.12,
    revenuePerPost: 280,
    engagementValue: 2.45
  }

  const roiRecommendations: ROIRecommendation[] = [
    {
      type: 'content',
      title: 'Focus on Video Content',
      description: 'Video posts generate 340% higher ROI than static images',
      expectedImpact: '+$2,400 monthly revenue',
      confidence: 92,
      priority: 'high'
    },
    {
      type: 'timing',
      title: 'Optimize Posting Schedule',
      description: 'Post during peak hours to reduce promotion costs by 45%',
      expectedImpact: '-$890 monthly costs',
      confidence: 87,
      priority: 'high'
    },
    {
      type: 'platform',
      title: 'Reallocate LinkedIn Budget',
      description: 'LinkedIn shows 25% higher conversion rates than other platforms',
      expectedImpact: '+18% conversion rate',
      confidence: 83,
      priority: 'medium'
    },
    {
      type: 'investment',
      title: 'Increase Design Investment',
      description: 'Professional visuals correlate with 67% higher engagement value',
      expectedImpact: '+$1,200 monthly value',
      confidence: 78,
      priority: 'medium'
    }
  ]

  const performROIAnalysis = async () => {
    setIsAnalyzing(true)
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      onOptimizeROI?.(roiRecommendations)
    }, 2000)
  }

  const platformROI = [
    { platform: 'Instagram', investment: 950, revenue: 3200, roi: 236.8, posts: 12 },
    { platform: 'LinkedIn', investment: 850, revenue: 2800, roi: 229.4, posts: 8 },
    { platform: 'Twitter', investment: 650, revenue: 1600, roi: 146.2, posts: 15 },
    { platform: 'TikTok', investment: 400, revenue: 800, roi: 100.0, posts: 10 }
  ]

  const contentTypeROI = [
    { type: 'Video', avgCost: 250, avgRevenue: 850, roi: 240, count: 8 },
    { type: 'Carousel', avgCost: 180, avgRevenue: 540, roi: 200, count: 12 },
    { type: 'Image + Text', avgCost: 120, avgRevenue: 360, roi: 200, count: 18 },
    { type: 'Text Only', avgCost: 80, avgRevenue: 180, roi: 125, count: 7 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calculator className="text-primary" size={24} />
            Content ROI Analyzer
          </h2>
          <p className="text-muted-foreground mt-1">
            Track investment returns and optimize content profitability
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
          
          <Button 
            onClick={performROIAnalysis} 
            disabled={isAnalyzing}
            variant="outline"
            size="sm"
          >
            <RefreshCw size={16} className={isAnalyzing ? 'animate-spin' : ''} />
            Analyze
          </Button>
          
          <Button variant="outline" size="sm">
            <Download size={16} />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total ROI</p>
                <p className="text-2xl font-bold text-green-600">
                  {roiMetrics.roi.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp size={20} className="text-green-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUp size={14} className="text-green-600" />
              <span className="text-xs text-green-600">+12.5% vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">
                  ${roiMetrics.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSign size={20} className="text-blue-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUp size={14} className="text-green-600" />
              <span className="text-xs text-green-600">+8.3% vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Investment</p>
                <p className="text-2xl font-bold">
                  ${roiMetrics.totalInvestment.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Target size={20} className="text-orange-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUp size={14} className="text-red-600" />
              <span className="text-xs text-red-600">+5.2% vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cost/Engagement</p>
                <p className="text-2xl font-bold">
                  ${roiMetrics.costPerEngagement.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <BarChart3 size={20} className="text-purple-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <ArrowDown size={14} className="text-green-600" />
              <span className="text-xs text-green-600">-15.7% vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="platforms">By Platform</TabsTrigger>
          <TabsTrigger value="content-types">By Content Type</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="costs">Cost Management</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ROI Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={18} />
                  ROI Trend (30 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-48 bg-muted/20 rounded-lg flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <BarChart3 size={48} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">ROI Trend Visualization</p>
                      <p className="text-xs">Interactive chart would appear here</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <div className="font-semibold text-green-600">Best Day</div>
                      <div className="text-muted-foreground">March 15</div>
                      <div className="font-medium">347% ROI</div>
                    </div>
                    <div>
                      <div className="font-semibold text-blue-600">Average</div>
                      <div className="text-muted-foreground">Daily</div>
                      <div className="font-medium">{roiMetrics.roi.toFixed(0)}% ROI</div>
                    </div>
                    <div>
                      <div className="font-semibold text-orange-600">Goal</div>
                      <div className="text-muted-foreground">Target</div>
                      <div className="font-medium">250% ROI</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart size={18} />
                  Revenue Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { source: 'Direct Sales', amount: 3200, percentage: 38 },
                    { source: 'Lead Generation', amount: 2800, percentage: 33 },
                    { source: 'Brand Partnerships', amount: 1600, percentage: 19 },
                    { source: 'Affiliate Income', amount: 800, percentage: 10 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full bg-primary opacity-${100 - index * 20}`} />
                        <span className="text-sm font-medium">{item.source}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">${item.amount.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics Breakdown</CardTitle>
              <CardDescription>
                Detailed analysis of content performance and financial impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Eye size={14} />
                    Total Impressions
                  </div>
                  <div className="text-xl font-bold">2.4M</div>
                  <div className="text-xs text-muted-foreground">
                    CPM: $1.19 • Value: $2,856
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users size={14} />
                    Unique Reach
                  </div>
                  <div className="text-xl font-bold">186K</div>
                  <div className="text-xs text-muted-foreground">
                    CPR: $15.32 • Frequency: 12.9
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Heart size={14} />
                    Engagements
                  </div>
                  <div className="text-xl font-bold">23.8K</div>
                  <div className="text-xs text-muted-foreground">
                    CPE: $0.12 • Rate: 12.8%
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Target size={14} />
                    Conversions
                  </div>
                  <div className="text-xl font-bold">142</div>
                  <div className="text-xs text-muted-foreground">
                    CPA: $20.07 • Rate: 0.76%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platform Analysis Tab */}
        <TabsContent value="platforms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform ROI Comparison</CardTitle>
              <CardDescription>
                Investment and return analysis across all social media platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Platform</TableHead>
                    <TableHead className="text-right">Investment</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">ROI</TableHead>
                    <TableHead className="text-right">Posts</TableHead>
                    <TableHead className="text-right">Revenue/Post</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {platformROI.map((platform, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{platform.platform}</TableCell>
                      <TableCell className="text-right">${platform.investment}</TableCell>
                      <TableCell className="text-right">${platform.revenue}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={platform.roi > 200 ? 'default' : platform.roi > 150 ? 'secondary' : 'outline'}>
                          {platform.roi.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{platform.posts}</TableCell>
                      <TableCell className="text-right font-medium">
                        ${(platform.revenue / platform.posts).toFixed(0)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Platform Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {platformROI.slice(0, 2).map((platform, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{platform.platform} Deep Dive</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Avg. Cost per Post</div>
                      <div className="font-semibold">${(platform.investment / platform.posts).toFixed(0)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Profit Margin</div>
                      <div className="font-semibold text-green-600">
                        {(((platform.revenue - platform.investment) / platform.revenue) * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Break-even Posts</div>
                      <div className="font-semibold">{Math.ceil(platform.investment / (platform.revenue / platform.posts))}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Efficiency Score</div>
                      <div className="font-semibold">{(platform.roi / 10).toFixed(1)}/10</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="text-sm font-medium mb-2">ROI Progress</div>
                    <Progress value={(platform.roi / 300) * 100} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0%</span>
                      <span>Target: 250%</span>
                      <span>300%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Content Types Tab */}
        <TabsContent value="content-types" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Type Performance</CardTitle>
              <CardDescription>
                ROI analysis by content format and strategy effectiveness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Content Type</TableHead>
                    <TableHead className="text-right">Avg. Cost</TableHead>
                    <TableHead className="text-right">Avg. Revenue</TableHead>
                    <TableHead className="text-right">ROI</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                    <TableHead className="text-right">Efficiency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contentTypeROI.map((content, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{content.type}</TableCell>
                      <TableCell className="text-right">${content.avgCost}</TableCell>
                      <TableCell className="text-right">${content.avgRevenue}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={content.roi > 200 ? 'default' : content.roi > 150 ? 'secondary' : 'outline'}>
                          {content.roi}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{content.count}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-1">
                          <Progress value={(content.roi / 300) * 100} className="w-16 h-2" />
                          <span className="text-xs">{Math.round((content.roi / 300) * 100)}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {roiRecommendations.map((rec, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles size={18} />
                      {rec.title}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge variant={rec.priority === 'high' ? 'default' : rec.priority === 'medium' ? 'secondary' : 'outline'}>
                        {rec.priority}
                      </Badge>
                      <Badge variant="outline">
                        {rec.confidence}% confident
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{rec.description}</p>
                  <div className="bg-muted/50 rounded-lg p-3 mb-4">
                    <h4 className="text-xs font-medium text-muted-foreground mb-1">Expected Impact</h4>
                    <p className="text-sm font-medium text-green-600">{rec.expectedImpact}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      Implement
                    </Button>
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Cost Management Tab */}
        <TabsContent value="costs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cost Structure Management</CardTitle>
              <CardDescription>
                Configure and optimize your content creation costs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Content Creation Costs</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="creation-cost">Content Creation</Label>
                      <Input
                        id="creation-cost"
                        type="number"
                        value={customCosts.creation}
                        onChange={(e) => setCustomCosts(prev => ({ ...prev, creation: Number(e.target.value) }))}
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Average cost for content creation (writing, research, planning)
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="design-cost">Design & Visuals</Label>
                      <Input
                        id="design-cost"
                        type="number"
                        value={customCosts.design}
                        onChange={(e) => setCustomCosts(prev => ({ ...prev, design: Number(e.target.value) }))}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="promotion-cost">Paid Promotion</Label>
                      <Input
                        id="promotion-cost"
                        type="number"
                        value={customCosts.promotion}
                        onChange={(e) => setCustomCosts(prev => ({ ...prev, promotion: Number(e.target.value) }))}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="management-cost">Management & Analytics</Label>
                      <Input
                        id="management-cost"
                        type="number"
                        value={customCosts.management}
                        onChange={(e) => setCustomCosts(prev => ({ ...prev, management: Number(e.target.value) }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Cost Analysis</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <span className="text-sm">Total Cost per Post</span>
                      <span className="font-semibold">
                        ${Object.values(customCosts).reduce((a, b) => a + b, 0)}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {Object.entries(customCosts).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between text-sm">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={(value / Object.values(customCosts).reduce((a, b) => a + b, 0)) * 100} 
                              className="w-16 h-2" 
                            />
                            <span className="font-medium">${value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Break-even Engagement</span>
                      <span className="font-medium">
                        {Math.ceil(Object.values(customCosts).reduce((a, b) => a + b, 0) / roiMetrics.engagementValue)} interactions
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Target Revenue per Post</span>
                      <span className="font-medium text-green-600">
                        ${Math.ceil(Object.values(customCosts).reduce((a, b) => a + b, 0) * 2.5)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={() => {
                  // Calculate and show updated ROI projections
                }}>
                  Update Projections
                </Button>
                <Button variant="outline">
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}