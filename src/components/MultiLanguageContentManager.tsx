import { useState, useEffect } from 'react'
import { Post, MultiLanguageContent, Translation, GlobalStrategy } from '@/types.ts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Globe, Translate, CheckCircle, AlertTriangle, Users, Target, Sparkles, Clock } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface MultiLanguageContentManagerProps {
  posts: Post[]
  onTranslateContent: (postId: string, languages: string[]) => void
}

interface LanguageConfig {
  code: string
  name: string
  nativeName: string
  marketSize: number
  difficulty: 'easy' | 'medium' | 'hard'
  aiQuality: number
  culturalAdaptation: boolean
  regions: string[]
}

const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'es', name: 'Spanish', nativeName: 'Español', marketSize: 500000000, difficulty: 'easy', aiQuality: 95, culturalAdaptation: true, regions: ['Latin America', 'Spain'] },
  { code: 'fr', name: 'French', nativeName: 'Français', marketSize: 280000000, difficulty: 'medium', aiQuality: 92, culturalAdaptation: true, regions: ['France', 'Canada', 'Africa'] },
  { code: 'de', name: 'German', nativeName: 'Deutsch', marketSize: 95000000, difficulty: 'medium', aiQuality: 90, culturalAdaptation: true, regions: ['Germany', 'Austria', 'Switzerland'] },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', marketSize: 125000000, difficulty: 'hard', aiQuality: 85, culturalAdaptation: true, regions: ['Japan'] },
  { code: 'ko', name: 'Korean', nativeName: '한국어', marketSize: 80000000, difficulty: 'hard', aiQuality: 88, culturalAdaptation: true, regions: ['South Korea'] },
  { code: 'zh', name: 'Chinese', nativeName: '中文', marketSize: 1400000000, difficulty: 'hard', aiQuality: 87, culturalAdaptation: true, regions: ['China', 'Taiwan', 'Singapore'] },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', marketSize: 260000000, difficulty: 'easy', aiQuality: 93, culturalAdaptation: true, regions: ['Brazil', 'Portugal'] },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', marketSize: 65000000, difficulty: 'medium', aiQuality: 91, culturalAdaptation: false, regions: ['Italy'] },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', marketSize: 150000000, difficulty: 'hard', aiQuality: 83, culturalAdaptation: true, regions: ['Russia', 'Eastern Europe'] },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', marketSize: 400000000, difficulty: 'hard', aiQuality: 80, culturalAdaptation: true, regions: ['Middle East', 'North Africa'] }
]

export function MultiLanguageContentManager({ posts, onTranslateContent }: MultiLanguageContentManagerProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [translationInProgress, setTranslationInProgress] = useState(false)
  const [translations, setTranslations] = useState<Record<string, Translation[]>>({})
  const [globalStrategy, setGlobalStrategy] = useState<GlobalStrategy | null>(null)
  const [previewLanguage, setPreviewLanguage] = useState<string>('es')

  useEffect(() => {
    // Mock global strategy
    setGlobalStrategy({
      primaryMarkets: ['es', 'fr', 'de'],
      secondaryMarkets: ['ja', 'ko', 'pt'],
      contentStrategy: 'glocal',
      brandConsistency: 85,
      localRelevance: 78
    })
  }, [])

  const handleTranslatePost = async (post: Post, languages: string[]) => {
    if (languages.length === 0) {
      toast.error('Please select at least one language')
      return
    }

    setTranslationInProgress(true)
    setSelectedPost(post)
    setSelectedLanguages(languages)

    try {
      // Simulate translation process
      const translationPromises = languages.map(async (langCode, index) => {
        await new Promise(resolve => setTimeout(resolve, 1000 * (index + 1)))
        
        const language = SUPPORTED_LANGUAGES.find(l => l.code === langCode)
        if (!language) return null

        // Mock AI translation with cultural adaptation
        let translatedContent = post.content
        
        // Apply language-specific adaptations
        switch (langCode) {
          case 'ja':
            translatedContent = `🌸 ${post.content} (Polite Japanese style with cultural respect)`
            break
          case 'de':
            translatedContent = `${post.content} (Professional German tone with detailed explanations)`
            break
          case 'es':
            translatedContent = `¡${post.content}! (Warm Spanish tone with community focus)`
            break
          case 'fr':
            translatedContent = `${post.content} (Elegant French style with cultural sophistication)`
            break
          case 'zh':
            translatedContent = `${post.content} (Respectful Chinese tone with harmony emphasis)`
            break
          default:
            translatedContent = `${post.content} (Translated to ${language.name})`
        }

        return {
          language: langCode,
          content: translatedContent,
          translator: 'ai' as const,
          quality: language.aiQuality,
          reviewed: false,
          culturallyAdapted: language.culturalAdaptation,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })

      const results = await Promise.all(translationPromises)
      const validTranslations = results.filter(Boolean) as Translation[]

      setTranslations(prev => ({
        ...prev,
        [post.id]: validTranslations
      }))

      onTranslateContent(post.id, languages)
      toast.success(`Content translated to ${languages.length} languages`)
    } catch (error) {
      toast.error('Translation failed. Please try again.')
    } finally {
      setTranslationInProgress(false)
    }
  }

  const getLanguageFlag = (langCode: string) => {
    const flagMap: Record<string, string> = {
      es: '🇪🇸', fr: '🇫🇷', de: '🇩🇪', ja: '🇯🇵', ko: '🇰🇷',
      zh: '🇨🇳', pt: '🇵🇹', it: '🇮🇹', ru: '🇷🇺', ar: '🇸🇦'
    }
    return flagMap[langCode] || '🌐'
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'hard': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getQualityColor = (quality: number) => {
    if (quality >= 90) return 'text-green-600'
    if (quality >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Globe className="text-primary" size={32} />
            Multi-Language Content Manager
          </h1>
          <p className="text-muted-foreground mt-2">
            Translate and localize content for global audiences with AI assistance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-gradient-to-r from-blue-500/10 to-green-500/10">
            <Translate size={14} className="mr-1" />
            {SUPPORTED_LANGUAGES.length} Languages
          </Badge>
          {globalStrategy && (
            <Badge variant="outline">
              {globalStrategy.primaryMarkets.length + globalStrategy.secondaryMarkets.length} Markets
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="translate" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="translate">Translate Content</TabsTrigger>
          <TabsTrigger value="manage">Manage Translations</TabsTrigger>
          <TabsTrigger value="strategy">Global Strategy</TabsTrigger>
          <TabsTrigger value="analytics">Language Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="translate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Content Selection */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Select Content</CardTitle>
                <CardDescription>Choose a post to translate</CardDescription>
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
                    onClick={() => setSelectedPost(post)}
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
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {post.status}
                          </Badge>
                          {translations[post.id] && (
                            <Badge variant="secondary" className="text-xs">
                              {translations[post.id].length} translations
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Language Selection */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Choose Languages</CardTitle>
                <CardDescription>
                  Select target languages for translation and localization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SUPPORTED_LANGUAGES.map((language) => (
                    <div
                      key={language.code}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                        selectedLanguages.includes(language.code)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                      onClick={() => {
                        setSelectedLanguages(prev => 
                          prev.includes(language.code)
                            ? prev.filter(l => l !== language.code)
                            : [...prev, language.code]
                        )
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getLanguageFlag(language.code)}</span>
                          <div>
                            <div className="font-medium">{language.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {language.nativeName}
                            </div>
                          </div>
                        </div>
                        {selectedLanguages.includes(language.code) && (
                          <CheckCircle className="text-primary" size={16} />
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Market:</span>
                          <div className="font-medium">
                            {(language.marketSize / 1000000).toFixed(0)}M users
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Quality:</span>
                          <div className={`font-medium ${getQualityColor(language.aiQuality)}`}>
                            {language.aiQuality}%
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Difficulty:</span>
                          <div className={`font-medium capitalize ${getDifficultyColor(language.difficulty)}`}>
                            {language.difficulty}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Cultural:</span>
                          <div className="font-medium">
                            {language.culturalAdaptation ? '✓' : '–'}
                          </div>
                        </div>
                      </div>

                      <div className="mt-2">
                        <div className="text-xs text-muted-foreground mb-1">Regions:</div>
                        <div className="flex flex-wrap gap-1">
                          {language.regions.map((region) => (
                            <Badge key={region} variant="outline" className="text-xs">
                              {region}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {selectedLanguages.length} languages selected
                    {selectedLanguages.length > 0 && (
                      <span className="ml-2">
                        • {selectedLanguages.map(code => 
                          SUPPORTED_LANGUAGES.find(l => l.code === code)?.marketSize || 0
                        ).reduce((sum, size) => sum + size, 0) / 1000000}M total reach
                      </span>
                    )}
                  </div>
                  <Button
                    onClick={() => selectedPost && handleTranslatePost(selectedPost, selectedLanguages)}
                    disabled={!selectedPost || selectedLanguages.length === 0 || translationInProgress}
                  >
                    {translationInProgress ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full mr-2" />
                        Translating...
                      </>
                    ) : (
                      <>
                        <Translate size={16} className="mr-2" />
                        Translate Content
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Translation Progress */}
          {translationInProgress && selectedPost && (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Sparkles className="text-primary animate-pulse" size={24} />
                    <div>
                      <h3 className="font-semibold">AI Translation in Progress</h3>
                      <p className="text-sm text-muted-foreground">
                        Translating "{selectedPost.content}" to {selectedLanguages.length} languages
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {selectedLanguages.map((langCode, index) => {
                      const language = SUPPORTED_LANGUAGES.find(l => l.code === langCode)
                      if (!language) return null

                      const isCompleted = index < selectedLanguages.findIndex(code => code === langCode) + 1
                      const isInProgress = index === selectedLanguages.findIndex(code => code === langCode)

                      return (
                        <div key={langCode} className="flex items-center gap-3">
                          <span className="text-lg">{getLanguageFlag(langCode)}</span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{language.name}</span>
                              {isCompleted && <CheckCircle className="text-green-500" size={16} />}
                              {isInProgress && <Clock className="text-blue-500 animate-pulse" size={16} />}
                            </div>
                            <Progress 
                              value={isCompleted ? 100 : isInProgress ? 66 : 0} 
                              className="h-2"
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          <div className="space-y-4">
            {Object.entries(translations).map(([postId, postTranslations]) => {
              const post = posts.find(p => p.id === postId)
              if (!post || postTranslations.length === 0) return null

              return (
                <Card key={postId}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="truncate">{post.content}</span>
                      <Badge variant="outline">
                        {postTranslations.length} translations
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {postTranslations.map((translation) => {
                        const language = SUPPORTED_LANGUAGES.find(l => l.code === translation.language)
                        if (!language) return null

                        return (
                          <div key={translation.language} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{getLanguageFlag(translation.language)}</span>
                                <span className="font-medium">{language.name}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Badge variant={translation.reviewed ? 'default' : 'secondary'} className="text-xs">
                                  {translation.reviewed ? 'Reviewed' : 'Pending'}
                                </Badge>
                                {translation.culturallyAdapted && (
                                  <Badge variant="outline" className="text-xs">
                                    Cultural
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded">
                              {translation.content}
                            </div>

                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">
                                Quality: <span className={getQualityColor(translation.quality)}>
                                  {translation.quality}%
                                </span>
                              </span>
                              <span className="text-muted-foreground">
                                {translation.translator === 'ai' ? 'AI Generated' : 'Human Translated'}
                              </span>
                            </div>

                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="flex-1">
                                Edit
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1">
                                Review
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {Object.keys(translations).length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Translate size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Translations Yet</h3>
                  <p className="text-muted-foreground">
                    Start by translating content in the "Translate Content" tab
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="strategy" className="space-y-4">
          {globalStrategy && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Global Content Strategy</CardTitle>
                  <CardDescription>
                    Overview of your multilingual content approach
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {globalStrategy.brandConsistency}%
                      </div>
                      <p className="text-sm text-muted-foreground">Brand Consistency</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {globalStrategy.localRelevance}%
                      </div>
                      <p className="text-sm text-muted-foreground">Local Relevance</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-1 capitalize">
                        {globalStrategy.contentStrategy}
                      </div>
                      <p className="text-sm text-muted-foreground">Strategy Type</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Primary Markets</h4>
                      <div className="space-y-2">
                        {globalStrategy.primaryMarkets.map((langCode) => {
                          const language = SUPPORTED_LANGUAGES.find(l => l.code === langCode)
                          if (!language) return null
                          return (
                            <div key={langCode} className="flex items-center gap-3 p-2 bg-muted/30 rounded">
                              <span className="text-lg">{getLanguageFlag(langCode)}</span>
                              <div className="flex-1">
                                <div className="font-medium">{language.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {(language.marketSize / 1000000).toFixed(0)}M users
                                </div>
                              </div>
                              <Badge variant="default" className="text-xs">Primary</Badge>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Secondary Markets</h4>
                      <div className="space-y-2">
                        {globalStrategy.secondaryMarkets.map((langCode) => {
                          const language = SUPPORTED_LANGUAGES.find(l => l.code === langCode)
                          if (!language) return null
                          return (
                            <div key={langCode} className="flex items-center gap-3 p-2 bg-muted/30 rounded">
                              <span className="text-lg">{getLanguageFlag(langCode)}</span>
                              <div className="flex-1">
                                <div className="font-medium">{language.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {(language.marketSize / 1000000).toFixed(0)}M users
                                </div>
                              </div>
                              <Badge variant="secondary" className="text-xs">Secondary</Badge>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Users size={24} className="text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">
                  {Object.values(translations).flat().length}
                </div>
                <p className="text-xs text-muted-foreground">Total Translations</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Globe size={24} className="text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">
                  {new Set(Object.values(translations).flat().map(t => t.language)).size}
                </div>
                <p className="text-xs text-muted-foreground">Active Languages</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Target size={24} className="text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(Object.values(translations).flat().reduce((sum, t) => sum + t.quality, 0) / Math.max(Object.values(translations).flat().length, 1))}%
                </div>
                <p className="text-xs text-muted-foreground">Average Quality</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default MultiLanguageContentManagerexport default MultiLanguageContentManager
