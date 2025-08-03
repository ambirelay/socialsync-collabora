import { useState } from 'react'
import { Post, Platform } from '@/types'
import { usePosts } from '@/hooks/useData'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Calendar, Grid3X3, Users, Settings } from 'lucide-react'
import { toast, Toaster } from 'sonner'

function App() {
  // Basic state
  const { posts = [], addPost, updatePost } = usePosts()
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        {/* Simple Header */}
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Calendar size={20} className="text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold">ContentPlan Pro</h1>
              </div>
              <Button variant="outline" size="sm">
                <Settings size={16} className="mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <Calendar size={16} />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="feed" className="flex items-center gap-2">
                <Grid3X3 size={16} />
                Feed
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar size={16} />
                Calendar
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center gap-2">
                <Users size={16} />
                Team
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Dashboard</h2>
                  <Button onClick={() => toast.success('Create post clicked!')}>
                    Create Post
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-lg border bg-card">
                    <h3 className="font-semibold mb-2">Total Posts</h3>
                    <p className="text-2xl font-bold text-primary">{posts.length}</p>
                  </div>
                  <div className="p-6 rounded-lg border bg-card">
                    <h3 className="font-semibold mb-2">Scheduled</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {posts.filter(p => p.status === 'scheduled').length}
                    </p>
                  </div>
                  <div className="p-6 rounded-lg border bg-card">
                    <h3 className="font-semibold mb-2">Published</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {posts.filter(p => p.status === 'published').length}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border bg-card p-6">
                  <h3 className="font-semibold mb-4">Recent Posts</h3>
                  <div className="space-y-3">
                    {posts.slice(0, 5).map((post) => (
                      <div key={post.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex-1">
                          <p className="font-medium line-clamp-1">{post.content}</p>
                          <p className="text-sm text-muted-foreground">
                            {post.platforms.join(', ')} • {post.status}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    ))}
                    {posts.length === 0 && (
                      <p className="text-muted-foreground text-center py-8">
                        No posts yet. Create your first post to get started!
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="feed">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Content Feed</h2>
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Feed view coming soon...</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="calendar">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Calendar</h2>
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Calendar view coming soon...</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="team">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Team</h2>
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Team view coming soon...</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>

        <Toaster position="top-right" />
      </div>
    </ErrorBoundary>
  )
}

export default App