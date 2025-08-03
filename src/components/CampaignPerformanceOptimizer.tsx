import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Target, 
  TrendingUp, 
  BarChart3, 
  Zap,
  DollarSign,
  Users,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  Calendar,
  Clock,
  MapPin,
  Smartphone,
  Monitor,
  Play,
  Pause,
  Stop,
  Settings,
  Plus,
  Edit3,
  Copy,
  Trash2,
  Download,
  RefreshCw,
  Filter,
  Search,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Globe,
  PieChart
} from '@phosphor-icons/react'
import { Post } from '@/types.ts'

interface CampaignPerformanceOptimizerProps {
  posts: Post[]
  onOptimizeCampaign?: (campaignId: string, optimizations: any) => void
  onCreateCampaign?: (campaign: Campaign) => void
}

interface Campaign {
  id: string
  name: string
  description: string
  status: 'draft' | 'active' | 'paused' | 'completed' | 'archived'
  startDate: string
  endDate: string
  budget: number
  spent: number
  objective: string
  platforms: string[]
  targetAudience: {
    demographics: string[]
    interests: string[]
    locations: string[]
  }
  performance: {
    impressions: number
    reach: number
    engagement: number
    clicks: number
    conversions: number
    ctr: number
    cpm: number
    cpc: number
    roas: number
  }
  optimization: {
    score: number
    suggestions: OptimizationSuggestion[]
    autoOptimization: boolean
  }
}

interface OptimizationSuggestion {
  type: 'budget' | 'audience' | 'creative' | 'timing' | 'bidding'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  confidence: number
  expectedImprovement: string
}

export default function CampaignPerformanceOptimizer({ 
  posts, 
  onOptimizeCampaign,
  onCreateCampaign 
}: CampaignPerformanceOptimizerProps) {
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('all')

  // Mock campaign data
  const campaigns: Campaign[] = [
    {
      id: 'camp-1',
      name: 'Q1 Product Launch Campaign',
      description: 'Multi-platform campaign to promote new product features and drive conversions',
      status: 'active',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      budget: 25000,
      spent: 18750,
      objective: 'Conversions',
      platforms: ['Instagram', 'Facebook', 'LinkedIn'],
      targetAudience: {
        demographics: ['25-45', 'College+', 'Income 50k+'],
        interests: ['Technology', 'Business', 'Innovation'],
        locations: ['United States', 'Canada', 'United Kingdom']
      },
      performance: {
        impressions: 2450000,
        reach: 892000,
        engagement: 127000,
        clicks: 48500,
        conversions: 2850,
        ctr: 1.98,
        cpm: 7.65,
        cpc: 0.39,
        roas: 4.2
      },
      optimization: {
        score: 87,
        autoOptimization: true,
        suggestions: [
          {
            type: 'budget',
            title: 'Increase Instagram Budget',
            description: 'Instagram shows 34% higher conversion rate than other platforms',
            impact: 'high',
            confidence: 94,
            expectedImprovement: '+18% conversions'
          },
          {
            type: 'audience',
            title: 'Expand to Tech Enthusiast Segment',
            description: 'Similar audience segment shows strong engagement patterns',
            impact: 'medium',
            confidence: 82,
            expectedImprovement: '+12% reach'
          }
        ]
      }
    },
    {
      id: 'camp-2',
      name: 'Brand Awareness Spring Campaign',
      description: 'Focus on building brand recognition and thought leadership in the industry',
      status: 'active',
      startDate: '2024-03-15',
      endDate: '2024-04-15',
      budget: 15000,
      spent: 4200,
      objective: 'Brand Awareness',
      platforms: ['LinkedIn', 'Twitter', 'YouTube'],
      targetAudience: {
        demographics: ['30-55', 'Graduate', 'Management'],
        interests: ['Leadership', 'Strategy', 'Professional Development'],
        locations: ['North America', 'Europe']
      },
      performance: {
        impressions: 1240000,
        reach: 456000,
        engagement: 89000,
        clicks: 23400,
        conversions: 890,
        ctr: 1.89,
        cpm: 9.21,
        cpc: 0.18,
        roas: 2.8
      },
      optimization: {
        score: 73,
        autoOptimization: false,
        suggestions: [
          {
            type: 'creative',
            title: 'A/B Test Video vs Static Creative',
            description: 'Video content typically performs 65% better for brand awareness',
            impact: 'high',
            confidence: 88,
            expectedImprovement: '+25% engagement'
          },
          {
            type: 'timing',
            title: 'Optimize Posting Schedule',
            description: 'Adjust posting times to match audience peak activity',
            impact: 'medium',
            confidence: 76,
            expectedImprovement: '+8% reach'
          }
        ]
      }
    },
    {
      id: 'camp-3',
      name: 'Holiday Season Retargeting',
      description: 'Retargeting campaign to convert website visitors during holiday season',
      status: 'completed',
      startDate: '2024-02-01',
      endDate: '2024-02-29',
      budget: 12000,
      spent: 11800,
      objective: 'Retargeting',
      platforms: ['Facebook', 'Instagram', 'Google Ads'],
      targetAudience: {
        demographics: ['18-65', 'All Education', 'All Income'],
        interests: ['Previous Visitors', 'Cart Abandoners', 'Product Viewers'],
        locations: ['Global']
      },
      performance: {
        impressions: 890000,
        reach: 245000,
        engagement: 67000,
        clicks: 34500,
        conversions: 4200,
        ctr: 3.87,
        cpm: 13.26,
        cpc: 0.34,
        roas: 7.8
      },
      optimization: {
        score: 95,
        autoOptimization: true,
        suggestions: []
      }
    }
  ]

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesStatus = filterStatus === 'all' || campaign.status === filterStatus
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPlatform = selectedPlatform === 'all' || 
                           campaign.platforms.some(p => p.toLowerCase() === selectedPlatform)
    
    return matchesStatus && matchesSearch && matchesPlatform
  })

  const selectedCampaignData = selectedCampaign 
    ? campaigns.find(c => c.id === selectedCampaign)
    : null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'archived': return 'bg-gray-100 text-gray-500'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play size={14} className="text-green-600" />
      case 'paused': return <Pause size={14} className="text-yellow-600" />
      case 'completed': return <CheckCircle size={14} className="text-blue-600" />
      case 'draft': return <Edit3 size={14} className="text-gray-600" />
      case 'archived': return <Stop size={14} className="text-gray-500" />
      default: return <Clock size={14} className="text-gray-600" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="text-primary" size={24} />
            Campaign Performance Optimizer
          </h2>
          <p className="text-muted-foreground mt-1">
            AI-powered campaign optimization and performance analytics
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Campaigns</p>
                <p className="text-2xl font-bold">{campaigns.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Target size={20} className="text-blue-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-xs text-muted-foreground">
                {campaigns.filter(c => c.status === 'active').length} active
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">
                  ${campaigns.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign size={20} className="text-green-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-xs text-muted-foreground">
                ${campaigns.reduce((sum, c) => sum + c.spent, 0).toLocaleString()} spent
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. ROAS</p>
                <p className="text-2xl font-bold text-green-600">
                  {(campaigns.reduce((sum, c) => sum + c.performance.roas, 0) / campaigns.length).toFixed(1)}x
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp size={20} className="text-green-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUp size={14} className="text-green-600" />
              <span className="text-xs text-green-600">+12% vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Conversions</p>
                <p className="text-2xl font-bold">
                  {campaigns.reduce((sum, c) => sum + c.performance.conversions, 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Target size={20} className="text-purple-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUp size={14} className="text-green-600" />
              <span className="text-xs text-green-600">+8.5% vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaigns List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredCampaigns.map((campaign) => (
            <Card 
              key={campaign.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedCampaign === campaign.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedCampaign(campaign.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{campaign.name}</h3>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(campaign.status)}
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {campaign.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} />
                        <span>${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target size={14} />
                        <span>{campaign.performance.conversions.toLocaleString()} conversions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp size={14} />
                        <span>{campaign.performance.roas.toFixed(1)}x ROAS</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={16} className="text-primary" />
                      <span className="font-semibold text-primary">
                        {campaign.optimization.score}/100
                      </span>
                    </div>
                    <Progress value={campaign.optimization.score} className="w-20 h-2" />
                  </div>
                </div>
                
                {/* Platform Badges */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-muted-foreground">Platforms:</span>
                  {campaign.platforms.map(platform => (
                    <Badge key={platform} variant="outline" className="text-xs">
                      {platform}
                    </Badge>
                  ))}
                </div>
                
                {/* Quick Metrics */}
                <div className="grid grid-cols-4 gap-4 text-center text-sm">
                  <div>
                    <div className="text-muted-foreground text-xs">Impressions</div>
                    <div className="font-medium">{(campaign.performance.impressions / 1000000).toFixed(1)}M</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">CTR</div>
                    <div className="font-medium">{campaign.performance.ctr.toFixed(2)}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">CPC</div>
                    <div className="font-medium">${campaign.performance.cpc.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Budget Used</div>
                    <div className="font-medium">{((campaign.spent / campaign.budget) * 100).toFixed(0)}%</div>
                  </div>
                </div>
                
                {/* Optimization Alerts */}
                {campaign.optimization.suggestions.length > 0 && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle size={14} className="text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">
                        {campaign.optimization.suggestions.length} optimization suggestions
                      </span>
                    </div>
                    <p className="text-xs text-yellow-700">
                      {campaign.optimization.suggestions[0].title}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {filteredCampaigns.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Target size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-medium mb-2">No campaigns found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery || filterStatus !== 'all' || selectedPlatform !== 'all'
                    ? 'Try adjusting your search filters'
                    : 'Create your first campaign to start optimizing performance'
                  }
                </p>
                <Button onClick={() => setIsCreating(true)}>
                  <Plus size={16} className="mr-2" />
                  Create Campaign
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Campaign Details Panel */}
        <div className="lg:col-span-1">
          {selectedCampaignData ? (
            <div className="space-y-4">
              {/* Campaign Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {selectedCampaignData.name}
                  </CardTitle>
                  <CardDescription>
                    {selectedCampaignData.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Optimization Score</span>
                    <div className="flex items-center gap-2">
                      <Progress value={selectedCampaignData.optimization.score} className="w-20 h-2" />
                      <span className="font-bold text-primary">
                        {selectedCampaignData.optimization.score}/100
                      </span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(selectedCampaignData.status)}
                        <span className="capitalize">{selectedCampaignData.status}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Budget</span>
                      <span className="font-medium">${selectedCampaignData.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Spent</span>
                      <span className="font-medium">${selectedCampaignData.spent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ROAS</span>
                      <span className="font-medium text-green-600">
                        {selectedCampaignData.performance.roas.toFixed(1)}x
                      </span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => onOptimizeCampaign?.(selectedCampaignData.id, {})}
                    >
                      <Zap size={14} className="mr-1" />
                      Optimize
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit3 size={14} />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Impressions</span>
                      <span className="font-medium">
                        {(selectedCampaignData.performance.impressions / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Reach</span>
                      <span className="font-medium">
                        {(selectedCampaignData.performance.reach / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Engagement</span>
                      <span className="font-medium">
                        {(selectedCampaignData.performance.engagement / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">CTR</span>
                      <span className="font-medium">
                        {selectedCampaignData.performance.ctr.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">CPC</span>
                      <span className="font-medium">
                        ${selectedCampaignData.performance.cpc.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">CPM</span>
                      <span className="font-medium">
                        ${selectedCampaignData.performance.cpm.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Optimization Suggestions */}
              {selectedCampaignData.optimization.suggestions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles size={18} />
                      AI Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedCampaignData.optimization.suggestions.map((suggestion, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm">{suggestion.title}</h4>
                            <div className="flex gap-1">
                              <Badge className={getImpactColor(suggestion.impact)} size="sm">
                                {suggestion.impact}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {suggestion.confidence}%
                              </Badge>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {suggestion.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-green-600">
                              {suggestion.expectedImprovement}
                            </span>
                            <Button size="sm" variant="outline" className="text-xs h-6">
                              Apply
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Eye size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-medium mb-2">Select a campaign</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a campaign from the list to view performance details and optimization suggestions
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create Campaign Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>
              Set up a new marketing campaign with AI-powered optimization
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input
                  id="campaign-name"
                  placeholder="e.g., Summer Product Launch"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="campaign-objective">Objective</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select objective" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="awareness">Brand Awareness</SelectItem>
                    <SelectItem value="traffic">Website Traffic</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                    <SelectItem value="leads">Lead Generation</SelectItem>
                    <SelectItem value="conversions">Conversions</SelectItem>
                    <SelectItem value="retargeting">Retargeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="campaign-description">Description</Label>
              <Textarea
                id="campaign-description"
                placeholder="Describe your campaign goals and strategy..."
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="campaign-budget">Budget ($)</Label>
                <Input
                  id="campaign-budget"
                  type="number"
                  placeholder="10000"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="campaign-duration">Duration (days)</Label>
                <Input
                  id="campaign-duration"
                  type="number"
                  placeholder="30"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label>Target Platforms</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {['Instagram', 'Facebook', 'LinkedIn', 'Twitter', 'YouTube', 'TikTok'].map(platform => (
                  <label key={platform} className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">{platform}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Handle campaign creation
                setIsCreating(false)
              }}>
                Create Campaign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CampaignPerformanceOptimizer
