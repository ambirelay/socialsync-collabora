import { useState, useEffect } from 'react'
import { Post, GlobalMarketData, MarketRegion, LocalizationOpportunity } from '@/types.ts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Globe, TrendingUp, MapPin, DollarSign, Users, AlertTriangle, CheckCircle, Target, BarChart3 } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface GlobalMarketInsightsProps {
  posts: Post[]
  onMarketExpansion: (markets: string[]) => void
}

export function GlobalMarketInsights({ posts, onMarketExpansion }: GlobalMarketInsightsProps) {
  const [marketData, setMarketData] = useState<GlobalMarketData | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<MarketRegion | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Mock global market data
  useEffect(() => {
    const mockMarketData: GlobalMarketData = {
      regions: [
        {
          id: 'north-america',
          name: 'North America',
          countries: ['United States', 'Canada', 'Mexico'],
          marketSize: 450000000,
          growth: 8.5,
          competitionLevel: 85,
          entryBarriers: ['High ad costs', 'Saturated market', 'Complex regulations'],
          opportunities: ['B2B content', 'Video-first platforms', 'Voice search optimization'],
          platforms: [
            { platform: 'instagram', users: 150000000, growth: 12, demographics: { '18-34': 55, '35-54': 30 }, adCosts: { cpm: 8.5, cpc: 1.25 } },
            { platform: 'facebook', users: 200000000, growth: -2, demographics: { '25-54': 65, '55+': 25 }, adCosts: { cpm: 6.2, cpc: 0.89 } },
            { platform: 'twitter', users: 85000000, growth: 5, demographics: { '25-44': 42, '45-64': 35 }, adCosts: { cpm: 9.1, cpc: 1.84 } },
            { platform: 'linkedin', users: 90000000, growth: 18, demographics: { '25-54': 70, 'professionals': 85 }, adCosts: { cpm: 15.3, cpc: 3.21 } }
          ]
        },
        {
          id: 'europe',
          name: 'Europe',
          countries: ['Germany', 'France', 'United Kingdom', 'Italy', 'Spain'],
          marketSize: 380000000,
          growth: 12.3,
          competitionLevel: 72,
          entryBarriers: ['GDPR compliance', 'Language diversity', 'Cultural differences'],
          opportunities: ['Multilingual content', 'Sustainability focus', 'Privacy-first messaging'],
          platforms: [
            { platform: 'instagram', users: 125000000, growth: 15, demographics: { '18-34': 58, '35-54': 28 }, adCosts: { cpm: 6.8, cpc: 0.95 } },
            { platform: 'facebook', users: 180000000, growth: 3, demographics: { '25-54': 62, '55+': 28 }, adCosts: { cpm: 4.9, cpc: 0.72 } },
            { platform: 'linkedin', users: 75000000, growth: 22, demographics: { '25-54': 75, 'professionals': 88 }, adCosts: { cpm: 12.4, cpc: 2.89 } }
          ]
        },
        {
          id: 'asia-pacific',
          name: 'Asia-Pacific',
          countries: ['Japan', 'South Korea', 'Australia', 'Singapore', 'Thailand'],
          marketSize: 680000000,
          growth: 24.7,
          competitionLevel: 68,
          entryBarriers: ['Platform preferences', 'Cultural nuances', 'Local competitors'],
          opportunities: ['Mobile-first content', 'Live streaming', 'Social commerce'],
          platforms: [
            { platform: 'instagram', users: 95000000, growth: 28, demographics: { '18-34': 65, '35-54': 25 }, adCosts: { cpm: 4.2, cpc: 0.58 } },
            { platform: 'youtube', users: 280000000, growth: 35, demographics: { '16-44': 70, 'mobile': 85 }, adCosts: { cpm: 3.8, cpc: 0.45 } }
          ]
        },
        {
          id: 'latin-america',
          name: 'Latin America',
          countries: ['Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru'],
          marketSize: 320000000,
          growth: 31.2,
          competitionLevel: 45,
          entryBarriers: ['Economic volatility', 'Currency fluctuations', 'Infrastructure'],
          opportunities: ['Emerging middle class', 'Mobile growth', 'Local partnerships'],
          platforms: [
            { platform: 'instagram', users: 85000000, growth: 42, demographics: { '18-34': 72, 'mobile': 92 }, adCosts: { cpm: 2.1, cpc: 0.28 } },
            { platform: 'facebook', users: 120000000, growth: 25, demographics: { '18-44': 68, 'mobile': 89 }, adCosts: { cpm: 1.8, cpc: 0.23 } }
          ]
        }
      ],
      currencies: [
        { code: 'USD', name: 'US Dollar', exchangeRate: 1.0, volatility: 0.05 },
        { code: 'EUR', name: 'Euro', exchangeRate: 0.85, volatility: 0.08 },
        { code: 'GBP', name: 'British Pound', exchangeRate: 0.73, volatility: 0.12 },
        { code: 'JPY', name: 'Japanese Yen', exchangeRate: 110.2, volatility: 0.07 }
      ],
      regulations: [
        {
          id: 'gdpr',
          name: 'GDPR',
          region: 'Europe',
          type: 'privacy',
          requirements: ['Data consent', 'Right to be forgotten', 'Data portability'],
          penalties: ['Up to 4% of annual revenue'],
          compliance: true
        },
        {
          id: 'ccpa',
          name: 'CCPA',
          region: 'California',
          type: 'privacy',
          requirements: ['Opt-out rights', 'Data disclosure', 'Non-discrimination'],
          penalties: ['$2,500-$7,500 per violation'],
          compliance: false
        }
      ],
      culturalFactors: [
        {
          region: 'Asia-Pacific',
          factor: 'Collectivist culture',
          impact: 0.8,
          recommendations: ['Group-focused messaging', 'Community building', 'Respect for hierarchy']
        },
        {
          region: 'Europe',
          factor: 'Privacy concerns',
          impact: 0.9,
          recommendations: ['Transparent data usage', 'Consent-first approach', 'Local data storage']
        }
      ],
      localizationOpportunities: [
        {
          region: 'Europe',
          language: 'German',
          marketSize: 83000000,
          competition: 0.7,
          effort: 'medium',
          roi: 185,
          recommendations: ['Professional tone', 'Detailed explanations', 'Engineering focus']
        },
        {
          region: 'Asia-Pacific',
          language: 'Japanese',
          marketSize: 125000000,
          competition: 0.6,
          effort: 'high',
          roi: 225,
          recommendations: ['Respect hierarchy', 'Detailed processes', 'Quality emphasis']
        }
      ]
    }

    setMarketData(mockMarketData)
  }, [])

  const analyzeMarketOpportunity = async (region: MarketRegion) => {
    setIsLoading(true)
    setSelectedRegion(region)
    
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsLoading(false)
    toast.success(`Market analysis completed for ${region.name}`)
  }

  const getMarketPotentialColor = (growth: number) => {
    if (growth >= 25) return 'text-green-600'
    if (growth >= 15) return 'text-blue-600'
    if (growth >= 5) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getCompetitionColor = (level: number) => {
    if (level >= 80) return 'text-red-600'
    if (level >= 60) return 'text-yellow-600'
    return 'text-green-600'
  }

  if (!marketData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <Globe size={48} className="text-primary animate-pulse mx-auto" />
          <p className="text-muted-foreground">Loading global market insights...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Globe className="text-primary" size={32} />
            Global Market Insights
          </h1>
          <p className="text-muted-foreground mt-2">
            Identify expansion opportunities and market trends worldwide
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-gradient-to-r from-blue-500/10 to-green-500/10">
            <Globe size={14} className="mr-1" />
            {marketData.regions.length} Markets
          </Badge>
          <Badge variant="outline">
            {marketData.localizationOpportunities.length} Opportunities
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="regions">Regional Analysis</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="currencies">Currencies</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Global Market Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Users size={24} className="text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">
                  {(marketData.regions.reduce((sum, r) => sum + r.marketSize, 0) / 1000000).toFixed(0)}M
                </div>
                <p className="text-xs text-muted-foreground">Total Addressable Market</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp size={24} className="text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">
                  {(marketData.regions.reduce((sum, r) => sum + r.growth, 0) / marketData.regions.length).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Average Growth Rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <MapPin size={24} className="text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">
                  {marketData.regions.length}
                </div>
                <p className="text-xs text-muted-foreground">Key Regions</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Target size={24} className="text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-600">
                  {marketData.localizationOpportunities.length}
                </div>
                <p className="text-xs text-muted-foreground">Expansion Opportunities</p>
              </CardContent>
            </Card>
          </div>

          {/* Regional Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {marketData.regions.map((region) => (
              <Card key={region.id} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => analyzeMarketOpportunity(region)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{region.name}</CardTitle>
                    <Badge variant="outline">
                      {region.countries.length} countries
                    </Badge>
                  </div>
                  <CardDescription>
                    {(region.marketSize / 1000000).toFixed(0)}M users • {region.growth}% growth
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Market Size:</span>
                      <div className="font-semibold">
                        {(region.marketSize / 1000000).toFixed(0)}M users
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Growth Rate:</span>
                      <div className={`font-semibold ${getMarketPotentialColor(region.growth)}`}>
                        +{region.growth}%
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Competition:</span>
                      <div className={`font-semibold ${getCompetitionColor(region.competitionLevel)}`}>
                        {region.competitionLevel}% saturated
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Platforms:</span>
                      <div className="font-semibold">
                        {region.platforms.length} active
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground mb-2 block">Top Opportunities:</span>
                    <div className="flex flex-wrap gap-1">
                      {region.opportunities.slice(0, 3).map((opp, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {opp}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {marketData.localizationOpportunities.map((opportunity, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{opportunity.region} - {opportunity.language}</span>
                    <Badge variant={
                      opportunity.roi > 200 ? 'default' :
                      opportunity.roi > 150 ? 'secondary' : 'outline'
                    }>
                      {opportunity.roi}% ROI
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {(opportunity.marketSize / 1000000).toFixed(0)}M potential users
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {opportunity.roi}%
                      </div>
                      <p className="text-xs text-muted-foreground">Expected ROI</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {Math.round(opportunity.competition * 100)}%
                      </div>
                      <p className="text-xs text-muted-foreground">Competition</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600 capitalize">
                        {opportunity.effort}
                      </div>
                      <p className="text-xs text-muted-foreground">Effort Level</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-medium mb-2 block">Recommendations:</span>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {opportunity.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle size={12} className="text-green-500 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button 
                    className="w-full"
                    onClick={() => {
                      onMarketExpansion([opportunity.region])
                      toast.success(`Expansion plan created for ${opportunity.region}`)
                    }}
                  >
                    <Target size={16} className="mr-2" />
                    Create Expansion Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="space-y-4">
            {marketData.regulations.map((regulation) => (
              <Card key={regulation.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{regulation.name}</h3>
                        <Badge variant="outline">{regulation.region}</Badge>
                        <Badge 
                          variant={regulation.compliance ? 'default' : 'destructive'}
                          className="flex items-center gap-1"
                        >
                          {regulation.compliance ? (
                            <CheckCircle size={12} />
                          ) : (
                            <AlertTriangle size={12} />
                          )}
                          {regulation.compliance ? 'Compliant' : 'Needs Attention'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Requirements:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {regulation.requirements.map((req, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-primary rounded-full" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Penalties:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {regulation.penalties.map((penalty, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <AlertTriangle size={12} className="text-red-500" />
                                {penalty}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="currencies" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {marketData.currencies.map((currency) => (
              <Card key={currency.code}>
                <CardContent className="p-4 text-center">
                  <DollarSign size={24} className="text-green-500 mx-auto mb-2" />
                  <div className="text-lg font-bold">{currency.code}</div>
                  <p className="text-sm text-muted-foreground mb-3">{currency.name}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Rate:</span>
                      <span className="font-medium">{currency.exchangeRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Volatility:</span>
                      <span className={`font-medium ${
                        currency.volatility > 0.1 ? 'text-red-600' :
                        currency.volatility > 0.05 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {(currency.volatility * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Selected Region Analysis */}
      {isLoading && (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="animate-pulse space-y-4">
              <BarChart3 size={48} className="text-primary mx-auto" />
              <p>Analyzing market opportunity...</p>
              <Progress value={66} className="w-64 mx-auto" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default GlobalMarketInsights
