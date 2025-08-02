import { useState, useMemo } from 'react'
import { Post, Platform } from '@/types.ts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Legend,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  FunnelChart,
  Funnel
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Users, 
  Target, 
  Zap, 
  Calendar, 
  Clock,
  ArrowUp,
  ArrowDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Heart,
  MessageCircle,
  Share,
  Download,
  RefreshCw,
  Settings,
  Filter,
  Brain,
  Lightbulb,
  Flame,
  Star,
  Award,
  Activity,
  Globe,
  Gauge,
  PieChart as PieChartIcon
} from '@phosphor-icons/react'
import { format, subDays, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'

interface BusinessIntelligenceDashboardProps {
  posts: Post[]
}

interface KPIMetric {
  id: string
  name: string
  value: number
  previousValue: number
  target: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  status: 'good' | 'warning' | 'critical'
  icon: React.ComponentType<{ size: number }>
}

interface BusinessGoal {
  id: string
  name: string
  target: number
  current: number
  deadline: string
  category: 'growth' | 'engagement' | 'revenue' | 'efficiency'
  priority: 'high' | 'medium' | 'low'
  status: 'on-track' | 'at-risk' | 'behind'
}

interface ContentROI {
  contentType: string
  investment: number
  returns: number
  roi: number
  engagementCost: number
  conversionRate: number
}

interface PredictiveInsight {
  id: string
  type: 'opportunity' | 'risk' | 'trend'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  confidence: number
  recommendedAction: string
  timeline: string
}

interface CompetitorBenchmark {
  metric: string
  yourBrand: number
  competitor1: number
  competitor2: number
  competitor3: number
  industryAverage: number
}

export function BusinessIntelligenceDashboard({ posts }: BusinessIntelligenceDashboardProps) {
  const [dateRange, setDateRange] = useState('30')
  const [selectedKPI, setSelectedKPI] = useState<string>('all')
  const [activeTab, setActiveTab] = useState('overview')
  const [autoRefresh, setAutoRefresh] = useState(false)

  // Mock KPI data
  const kpiMetrics: KPIMetric[] = useMemo(() => [
    {
      id: 'engagement-rate',
      name: 'Avg Engagement Rate',
      value: 8.5,
      previousValue: 7.2,
      target: 10.0,
      unit: '%',
      trend: 'up',
      status: 'good',
      icon: Heart
    },
    {
      id: 'reach',
      name: 'Total Reach',
      value: 125000,
      previousValue: 98000,
      target: 150000,
      unit: '',
      trend: 'up',
      status: 'good',
      icon: Users
    },
    {
      id: 'conversions',
      name: 'Conversions',
      value: 342,
      previousValue: 298,
      target: 400,
      unit: '',
      trend: 'up',
      status: 'warning',
      icon: Target
    },
    {
      id: 'cost-per-engagement',
      name: 'Cost per Engagement',
      value: 0.45,
      previousValue: 0.52,
      target: 0.40,
      unit: '$',
      trend: 'down',
      status: 'good',
      icon: TrendingDown
    },
    {
      id: 'brand-sentiment',
      name: 'Brand Sentiment',
      value: 82,
      previousValue: 79,
      target: 85,
      unit: '%',
      trend: 'up',
      status: 'good',
      icon: Star
    },
    {
      id: 'content-velocity',
      name: 'Content Velocity',
      value: 24,
      previousValue: 18,
      target: 30,
      unit: 'posts/week',
      trend: 'up',
      status: 'warning',
      icon: Zap
    }
  ], [])

  // Mock business goals
  const businessGoals: BusinessGoal[] = useMemo(() => [
    {
      id: '1',
      name: 'Increase Brand Awareness',
      target: 200000,
      current: 125000,
      deadline: '2024-12-31',
      category: 'growth',
      priority: 'high',
      status: 'on-track'
    },
    {
      id: '2',
      name: 'Improve Engagement Rate',
      target: 12,
      current: 8.5,
      deadline: '2024-09-30',
      category: 'engagement',
      priority: 'high',
      status: 'at-risk'
    },
    {
      id: '3',
      name: 'Generate Qualified Leads',
      target: 500,
      current: 342,
      deadline: '2024-11-30',
      category: 'revenue',
      priority: 'medium',
      status: 'on-track'
    },
    {
      id: '4',
      name: 'Reduce Content Production Cost',
      target: 0.35,
      current: 0.45,
      deadline: '2024-10-15',
      category: 'efficiency',
      priority: 'medium',
      status: 'behind'
    }
  ], [])

  // Mock content ROI data
  const contentROI: ContentROI[] = useMemo(() => [
    {
      contentType: 'Educational Posts',
      investment: 5000,
      returns: 18500,
      roi: 270,
      engagementCost: 0.32,
      conversionRate: 4.2
    },
    {
      contentType: 'Product Demos',
      investment: 8000,
      returns: 35000,
      roi: 337,
      engagementCost: 0.55,
      conversionRate: 8.1
    },
    {
      contentType: 'Behind the Scenes',
      investment: 3000,
      returns: 8500,
      roi: 183,
      engagementCost: 0.28,
      conversionRate: 2.3
    },
    {
      contentType: 'User Generated Content',
      investment: 2000,
      returns: 12000,
      roi: 500,
      engagementCost: 0.15,
      conversionRate: 6.8
    },
    {
      contentType: 'Industry News',
      investment: 1500,
      returns: 4200,
      roi: 180,
      engagementCost: 0.45,
      conversionRate: 1.9
    }
  ], [])

  // Mock predictive insights
  const predictiveInsights: PredictiveInsight[] = useMemo(() => [
    {
      id: '1',
      type: 'opportunity',
      title: 'Video Content Opportunity',
      description: 'Video posts are showing 45% higher engagement than average. Increasing video content by 30% could boost overall engagement by 12%.',
      impact: 'high',
      confidence: 87,
      recommendedAction: 'Allocate 40% of content budget to video production',
      timeline: 'Next 2 weeks'
    },
    {
      id: '2',
      type: 'risk',
      title: 'Audience Fatigue Warning',
      description: 'Educational content engagement is declining by 2% weekly. Audience may be experiencing content fatigue.',
      impact: 'medium',
      confidence: 73,
      recommendedAction: 'Diversify content themes and increase interactive content',
      timeline: 'Next 4 weeks'
    },
    {
      id: '3',
      type: 'trend',
      title: 'LinkedIn Performance Surge',
      description: 'LinkedIn posts are outperforming other platforms by 25%. This trend is expected to continue for 6-8 weeks.',
      impact: 'high',
      confidence: 92,
      recommendedAction: 'Increase LinkedIn posting frequency by 50%',
      timeline: 'Immediate'
    },
    {
      id: '4',
      type: 'opportunity',
      title: 'Peak Engagement Windows',
      description: 'AI analysis reveals untapped engagement windows on Tuesday 2-4 PM and Thursday 11 AM-1 PM.',
      impact: 'medium',
      confidence: 81,
      recommendedAction: 'Schedule high-priority content during these windows',
      timeline: 'Next week'
    }
  ], [])

  // Mock competitor benchmarking data
  const competitorBenchmarks: CompetitorBenchmark[] = useMemo(() => [
    {
      metric: 'Engagement Rate (%)',
      yourBrand: 8.5,
      competitor1: 6.2,
      competitor2: 9.1,
      competitor3: 7.8,
      industryAverage: 7.4
    },
    {
      metric: 'Posting Frequency',
      yourBrand: 24,
      competitor1: 32,
      competitor2: 18,
      competitor3: 28,
      industryAverage: 25
    },
    {
      metric: 'Response Time (hrs)',
      yourBrand: 2.1,
      competitor1: 4.5,
      competitor2: 1.8,
      competitor3: 3.2,
      industryAverage: 3.1
    },
    {
      metric: 'Video Content (%)',
      yourBrand: 35,
      competitor1: 42,
      competitor2: 28,
      competitor3: 51,
      industryAverage: 39
    }
  ], [])

  // Generate time series data for charts
  const timeSeriesData = useMemo(() => {
    const days = eachDayOfInterval({
      start: subDays(new Date(), parseInt(dateRange)),
      end: new Date()
    })
    
    return days.map(day => ({
      date: format(day, 'MMM dd'),
      engagement: Math.floor(Math.random() * 1000) + 500,
      reach: Math.floor(Math.random() * 5000) + 2000,
      impressions: Math.floor(Math.random() * 8000) + 4000,
      clicks: Math.floor(Math.random() * 200) + 100,
      conversions: Math.floor(Math.random() * 20) + 5,
      revenue: Math.floor(Math.random() * 2000) + 500
    }))
  }, [dateRange])

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <ArrowUp size={16} className="text-green-500" />
      case 'down': return <ArrowDown size={16} className="text-red-500" />
      default: return <Minus size={16} className="text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': case 'on-track': return 'text-green-600 bg-green-50'
      case 'warning': case 'at-risk': return 'text-orange-600 bg-orange-50'
      case 'critical': case 'behind': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const calculateChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100
    return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Business Intelligence</h1>
          <p className="text-muted-foreground">Strategic insights and performance analytics</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="auto-refresh">Auto-refresh</Label>
            <Switch 
              id="auto-refresh"
              checked={autoRefresh} 
              onCheckedChange={setAutoRefresh} 
            />
          </div>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Export Report
          </Button>
          <Button>
            <RefreshCw size={16} className="mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Executive Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiMetrics.map((kpi) => {
          const Icon = kpi.icon
          const change = calculateChange(kpi.value, kpi.previousValue)
          
          return (
            <Card key={kpi.id} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{kpi.name}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">
                        {kpi.unit === '$' && kpi.unit}
                        {kpi.value.toLocaleString()}
                        {kpi.unit !== '$' && kpi.unit}
                      </span>
                      <div className="flex items-center gap-1 text-sm">
                        {getTrendIcon(kpi.trend)}
                        <span className={kpi.trend === 'up' ? 'text-green-600' : kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600'}>
                          {change}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Target: {kpi.unit === '$' && kpi.unit}{kpi.target.toLocaleString()}{kpi.unit !== '$' && kpi.unit}
                      </span>
                      <Badge variant="outline" className={`text-xs ${getStatusColor(kpi.status)}`}>
                        {kpi.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <Icon size={32} className="text-muted-foreground mb-2" />
                    <Progress 
                      value={Math.min((kpi.value / kpi.target) * 100, 100)} 
                      className="w-16 h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 size={16} />
            Overview
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target size={16} />
            Goals
          </TabsTrigger>
          <TabsTrigger value="roi" className="flex items-center gap-2">
            <TrendingUp size={16} />
            ROI Analysis
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Brain size={16} />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="competitive" className="flex items-center gap-2">
            <Zap size={16} />
            Competitive
          </TabsTrigger>
          <TabsTrigger value="forecasting" className="flex items-center gap-2">
            <Activity size={16} />
            Forecasting
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={20} />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="engagement" fill="#8884d8" name="Engagement" />
                    <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="#ff7300" name="Conversions" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Attribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon size={20} />
                  Revenue Attribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Organic Social', value: 45000, fill: '#0088FE' },
                        { name: 'Paid Campaigns', value: 32000, fill: '#00C49F' },
                        { name: 'Influencer', value: 18000, fill: '#FFBB28' },
                        { name: 'Email Marketing', value: 15000, fill: '#FF8042' },
                        { name: 'Other', value: 8000, fill: '#8884D8' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Content Performance Matrix */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 size={20} />
                Content Performance Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { type: 'Educational', performance: 'High', trend: 'up', engagement: '9.2%', reach: '45K' },
                  { type: 'Product Demo', performance: 'High', trend: 'up', engagement: '11.5%', reach: '38K' },
                  { type: 'Behind Scenes', performance: 'Medium', trend: 'stable', engagement: '7.8%', reach: '52K' },
                  { type: 'Industry News', performance: 'Low', trend: 'down', engagement: '4.2%', reach: '28K' }
                ].map((content) => (
                  <div key={content.type} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{content.type}</h3>
                      {getTrendIcon(content.trend as any)}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Engagement:</span>
                        <span className="font-medium">{content.engagement}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Reach:</span>
                        <span className="font-medium">{content.reach}</span>
                      </div>
                      <Badge 
                        variant={
                          content.performance === 'High' ? 'default' :
                          content.performance === 'Medium' ? 'secondary' : 'outline'
                        }
                        className="w-full justify-center"
                      >
                        {content.performance} Performance
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {businessGoals.map((goal) => (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{goal.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={goal.priority === 'high' ? 'destructive' : goal.priority === 'medium' ? 'default' : 'secondary'}>
                        {goal.priority} priority
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(goal.status)}>
                        {goal.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className="text-sm font-medium">
                        {((goal.current / goal.target) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={(goal.current / goal.target) * 100} className="h-3" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Current</p>
                      <p className="text-xl font-bold">{goal.current.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Target</p>
                      <p className="text-xl font-bold">{goal.target.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Deadline:</span>
                    <span className="font-medium">{format(new Date(goal.deadline), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Category:</span>
                    <Badge variant="outline" className="capitalize">{goal.category}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ROI Analysis Tab */}
        <TabsContent value="roi" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp size={20} />
                Content ROI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentROI.map((item) => (
                  <div key={item.contentType} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-lg">{item.contentType}</h3>
                      <Badge 
                        variant={item.roi >= 300 ? 'default' : item.roi >= 200 ? 'secondary' : 'outline'}
                        className="text-lg px-3 py-1"
                      >
                        {item.roi}% ROI
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Investment</p>
                        <p className="font-bold text-lg">${item.investment.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Returns</p>
                        <p className="font-bold text-lg">${item.returns.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Engagement Cost</p>
                        <p className="font-bold text-lg">${item.engagementCost}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Conversion Rate</p>
                        <p className="font-bold text-lg">{item.conversionRate}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Profit</p>
                        <p className="font-bold text-lg text-green-600">
                          ${(item.returns - item.investment).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="space-y-4">
            {predictiveInsights.map((insight) => (
              <Card key={insight.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      insight.type === 'opportunity' ? 'bg-green-100' :
                      insight.type === 'risk' ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      {insight.type === 'opportunity' ? <Lightbulb size={20} className="text-green-600" /> :
                       insight.type === 'risk' ? <AlertTriangle size={20} className="text-red-600" /> :
                       <TrendingUp size={20} className="text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{insight.title}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant={insight.impact === 'high' ? 'destructive' : insight.impact === 'medium' ? 'default' : 'secondary'}>
                            {insight.impact} impact
                          </Badge>
                          <Badge variant="outline">
                            {insight.confidence}% confidence
                          </Badge>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-3">{insight.description}</p>
                      <div className="bg-muted/30 p-3 rounded-lg mb-3">
                        <p className="font-medium text-sm mb-1">Recommended Action:</p>
                        <p className="text-sm">{insight.recommendedAction}</p>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Timeline: {insight.timeline}</span>
                        <Button size="sm">
                          Implement
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Competitive Tab */}
        <TabsContent value="competitive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap size={20} />
                Competitive Benchmarking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {competitorBenchmarks.map((benchmark) => (
                  <div key={benchmark.metric} className="space-y-3">
                    <h3 className="font-medium">{benchmark.metric}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="p-3 border-2 border-primary rounded-lg bg-primary/5">
                        <p className="text-sm text-muted-foreground">Your Brand</p>
                        <p className="text-xl font-bold text-primary">{benchmark.yourBrand}</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Competitor A</p>
                        <p className="text-xl font-bold">{benchmark.competitor1}</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Competitor B</p>
                        <p className="text-xl font-bold">{benchmark.competitor2}</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Competitor C</p>
                        <p className="text-xl font-bold">{benchmark.competitor3}</p>
                      </div>
                      <div className="p-3 border rounded-lg bg-muted/30">
                        <p className="text-sm text-muted-foreground">Industry Avg</p>
                        <p className="text-xl font-bold">{benchmark.industryAverage}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Forecasting Tab */}
        <TabsContent value="forecasting" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Growth Projection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity size={20} />
                  Growth Projection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={[
                    { month: 'Jan', actual: 100, projected: 100 },
                    { month: 'Feb', actual: 120, projected: 115 },
                    { month: 'Mar', actual: 140, projected: 135 },
                    { month: 'Apr', actual: 135, projected: 150 },
                    { month: 'May', actual: null, projected: 170 },
                    { month: 'Jun', actual: null, projected: 190 },
                    { month: 'Jul', actual: null, projected: 215 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="actual" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="projected" stackId="1" stroke="#ff7300" fill="#ff7300" fillOpacity={0.3} strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle size={20} />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { risk: 'Market Saturation', probability: 65, impact: 'High', mitigation: 'Diversify content strategy' },
                    { risk: 'Algorithm Changes', probability: 80, impact: 'Medium', mitigation: 'Multi-platform approach' },
                    { risk: 'Budget Constraints', probability: 40, impact: 'High', mitigation: 'Focus on organic growth' },
                    { risk: 'Team Capacity', probability: 55, impact: 'Medium', mitigation: 'Automate routine tasks' }
                  ].map((risk) => (
                    <div key={risk.risk} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{risk.risk}</h4>
                        <Badge variant={risk.impact === 'High' ? 'destructive' : 'secondary'}>
                          {risk.impact} Impact
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Probability</span>
                            <span>{risk.probability}%</span>
                          </div>
                          <Progress value={risk.probability} className="h-2" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <strong>Mitigation:</strong> {risk.mitigation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}export default EnhancedBusinessIntelligence
