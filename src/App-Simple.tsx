import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Grid3X3, Users, Settings, Bell, BarChart3, Home, Sparkles, Plus } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="min-h-screen bg-background">
      {/* Simple Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Calendar size={18} className="text-white" />
              </div>
              <h1 className="text-xl font-bold">ContentPlan Pro</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Bell size={16} />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings size={16} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="inline-flex h-9 items-center justify-start rounded-lg bg-muted p-1">
            <TabsTrigger value="dashboard" className="flex items-center gap-1">
              <Home size={14} />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="feed" className="flex items-center gap-1">
              <Grid3X3 size={14} />
              Feed
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-1">
              <Calendar size={14} />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-1">
              <Users size={14} />
              Team
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1">
              <BarChart3 size={14} />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">Dashboard</h2>
                <Button>
                  <Plus size={16} className="mr-2" />
                  Create Post
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">+2 from last week</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground">Ready to publish</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">Awaiting review</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.2%</div>
                    <p className="text-xs text-muted-foreground">+0.3% from last week</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Post published successfully</p>
                        <p className="text-xs text-muted-foreground">LinkedIn • 2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Content awaiting approval</p>
                        <p className="text-xs text-muted-foreground">Instagram • 4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">New team member joined</p>
                        <p className="text-xs text-muted-foreground">Team • 1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="feed">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Content Feed</h2>
              <div className="text-center py-12">
                <Grid3X3 size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Content feed coming soon</p>
                <p className="text-muted-foreground">View and manage your content in a beautiful feed layout</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Content Calendar</h2>
              <div className="text-center py-12">
                <Calendar size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Calendar view coming soon</p>
                <p className="text-muted-foreground">Schedule and organize your content with drag-and-drop calendar</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="team">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Team Collaboration</h2>
              <div className="text-center py-12">
                <Users size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Team features coming soon</p>
                <p className="text-muted-foreground">Collaborate with your team members on content creation</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Analytics</h2>
              <div className="text-center py-12">
                <BarChart3 size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Analytics coming soon</p>
                <p className="text-muted-foreground">Track performance and insights for your content</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Floating Action Button */}
      <Button className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-40">
        <Plus size={24} />
      </Button>
    </div>
  )
}

export default App