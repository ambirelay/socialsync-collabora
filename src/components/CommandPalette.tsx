import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Plus, 
  Calendar, 
  Grid3x3, 
  Users, 
  BarChart3, 
  Settings, 
  Clock,
  Sparkles,
  Workflow,
  TrendingUp,
  Home,
  Palette,
  Briefcase,
  Shield,
  Plug
} from '@phosphor-icons/react'

interface Command {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ size: number }>
  category: string
  action: () => void
  keywords: string[]
}

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
  onSwitchTab: (tab: string) => void
  onCreatePost: () => void
  onOpenSettings: () => void
  aiEnabled?: boolean
  customCommands?: Array<{
    id: string
    title: string
    subtitle: string
    action: () => void
  }>
}

export function CommandPalette({ 
  open, 
  onClose, 
  onSwitchTab, 
  onCreatePost, 
  onOpenSettings,
  aiEnabled = false,
  customCommands = []
}: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const commands: Command[] = [
    // Quick Actions
    {
      id: 'create-post',
      title: 'Create New Post',
      description: 'Start creating a new social media post',
      icon: Plus,
      category: 'Actions',
      action: () => {
        onCreatePost()
        onClose()
      },
      keywords: ['new', 'post', 'create', 'content', 'add']
    },
    {
      id: 'open-settings',
      title: 'Open Settings',
      description: 'Configure app preferences and account settings',
      icon: Settings,
      category: 'Actions',
      action: () => {
        onOpenSettings()
        onClose()
      },
      keywords: ['settings', 'preferences', 'config', 'account']
    },

    // Navigation
    {
      id: 'nav-dashboard',
      title: 'Go to Dashboard',
      description: 'View your content overview and metrics',
      icon: Home,
      category: 'Navigation',
      action: () => {
        onSwitchTab('dashboard')
        onClose()
      },
      keywords: ['dashboard', 'home', 'overview', 'metrics']
    },
    {
      id: 'nav-feed',
      title: 'Go to Feed View',
      description: 'Browse and manage your content feed',
      icon: Grid3x3,
      category: 'Navigation',
      action: () => {
        onSwitchTab('feed')
        onClose()
      },
      keywords: ['feed', 'posts', 'content', 'browse']
    },
    {
      id: 'nav-calendar',
      title: 'Go to Calendar',
      description: 'View your content calendar and schedule',
      icon: Calendar,
      category: 'Navigation',
      action: () => {
        onSwitchTab('calendar')
        onClose()
      },
      keywords: ['calendar', 'schedule', 'planning', 'dates']
    },
    {
      id: 'nav-scheduler',
      title: 'Go to Scheduler',
      description: 'Manage publishing schedule and queue',
      icon: Clock,
      category: 'Navigation',
      action: () => {
        onSwitchTab('scheduler')
        onClose()
      },
      keywords: ['scheduler', 'publishing', 'queue', 'timing']
    },
    {
      id: 'nav-ai-assistant',
      title: 'Go to AI Assistant',
      description: 'Get AI-powered content suggestions',
      icon: Sparkles,
      category: 'Navigation',
      action: () => {
        onSwitchTab('ai-assistant')
        onClose()
      },
      keywords: ['ai', 'assistant', 'suggestions', 'artificial intelligence']
    },
    {
      id: 'nav-workflows',
      title: 'Go to Workflows',
      description: 'Manage automation and approval workflows',
      icon: Workflow,
      category: 'Navigation',
      action: () => {
        onSwitchTab('workflows')
        onClose()
      },
      keywords: ['workflows', 'automation', 'approval', 'process']
    },
    {
      id: 'nav-analytics',
      title: 'Go to Analytics',
      description: 'View performance metrics and insights',
      icon: BarChart3,
      category: 'Navigation',
      action: () => {
        onSwitchTab('analytics')
        onClose()
      },
      keywords: ['analytics', 'metrics', 'performance', 'insights', 'data']
    },
    {
      id: 'nav-team',
      title: 'Go to Team',
      description: 'Manage team members and collaboration',
      icon: Users,
      category: 'Navigation',
      action: () => {
        onSwitchTab('team')
        onClose()
      },
      keywords: ['team', 'members', 'collaboration', 'users']
    },

    // Advanced Features
    {
      id: 'nav-insights',
      title: 'Go to Content Insights',
      description: 'View content performance insights',
      icon: TrendingUp,
      category: 'Analytics',
      action: () => {
        onSwitchTab('insights')
        onClose()
      },
      keywords: ['insights', 'performance', 'content', 'analysis']
    },
    {
      id: 'nav-brand',
      title: 'Go to Brand Management',
      description: 'Manage brand assets and guidelines',
      icon: Palette,
      category: 'Management',
      action: () => {
        onSwitchTab('brand')
        onClose()
      },
      keywords: ['brand', 'assets', 'guidelines', 'design']
    },
    {
      id: 'nav-business-intelligence',
      title: 'Go to Business Intelligence',
      description: 'View business metrics and reports',
      icon: Briefcase,
      category: 'Analytics',
      action: () => {
        onSwitchTab('business-intelligence')
        onClose()
      },
      keywords: ['business', 'intelligence', 'reports', 'roi']
    },
    {
      id: 'nav-monitoring',
      title: 'Go to Performance Monitoring',
      description: 'Monitor system performance and health',
      icon: Shield,
      category: 'Management',
      action: () => {
        onSwitchTab('monitoring')
        onClose()
      },
      keywords: ['monitoring', 'performance', 'health', 'system']
    },
    {
      id: 'nav-integrations',
      title: 'Go to API Integrations',
      description: 'Manage external API connections',
      icon: Plug,
      category: 'Management',
      action: () => {
        onSwitchTab('integrations')
        onClose()
      },
      keywords: ['api', 'integrations', 'connections', 'external']
    }
  ]

  const filteredCommands = commands.filter(command => {
    const searchText = query.toLowerCase()
    return (
      command.title.toLowerCase().includes(searchText) ||
      command.description.toLowerCase().includes(searchText) ||
      command.category.toLowerCase().includes(searchText) ||
      command.keywords.some(keyword => keyword.includes(searchText))
    )
  })

  const groupedCommands = filteredCommands.reduce((groups, command) => {
    if (!groups[command.category]) {
      groups[command.category] = []
    }
    groups[command.category].push(command)
    return groups
  }, {} as Record<string, Command[]>)

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    if (!open) {
      setQuery('')
      setSelectedIndex(0)
    }
  }, [open])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action()
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="flex items-center border-b px-4 py-3">
          <Search className="mr-3 h-4 w-4 shrink-0 opacity-50" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands..."
            className="flex-1 border-0 shadow-none focus-visible:ring-0"
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <Badge variant="outline" className="ml-2 hidden sm:block">
            ⌘K
          </Badge>
        </div>

        <ScrollArea className="max-h-96">
          {Object.keys(groupedCommands).length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No commands found for "{query}"
            </div>
          ) : (
            <div className="p-2">
              {Object.entries(groupedCommands).map(([category, categoryCommands]) => (
                <div key={category}>
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    {category}
                  </div>
                  {categoryCommands.map((command, index) => {
                    const globalIndex = filteredCommands.indexOf(command)
                    const Icon = command.icon
                    return (
                      <div
                        key={command.id}
                        className={`flex items-center gap-3 rounded-md px-2 py-2 text-sm cursor-pointer transition-colors ${
                          globalIndex === selectedIndex
                            ? 'bg-accent text-accent-foreground'
                            : 'hover:bg-accent hover:text-accent-foreground'
                        }`}
                        onClick={() => command.action()}
                      >
                        <Icon size={16} className="shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{command.title}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {command.description}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="border-t px-4 py-2 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Use ↑↓ to navigate, Enter to select, Esc to close</span>
            <span>{filteredCommands.length} commands</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}export default CommandPalette
