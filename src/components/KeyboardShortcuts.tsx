import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Keyboard, Command, Search } from '@phosphor-icons/react'

interface Shortcut {
  key: string
  description: string
  category: string
}

const shortcuts: Shortcut[] = [
  // Navigation
  { key: 'Cmd + 1', description: 'Go to Dashboard', category: 'Navigation' },
  { key: 'Cmd + 2', description: 'Go to Feed View', category: 'Navigation' },
  { key: 'Cmd + 3', description: 'Go to Calendar', category: 'Navigation' },
  { key: 'Cmd + 4', description: 'Go to Analytics', category: 'Navigation' },
  { key: 'Cmd + 5', description: 'Go to Team', category: 'Navigation' },
  
  // Content Actions
  { key: 'Cmd + N', description: 'Create New Post', category: 'Content' },
  { key: 'Cmd + E', description: 'Edit Selected Post', category: 'Content' },
  { key: 'Cmd + D', description: 'Duplicate Post', category: 'Content' },
  { key: 'Cmd + S', description: 'Save Draft', category: 'Content' },
  { key: 'Cmd + Enter', description: 'Submit for Approval', category: 'Content' },
  
  // Interface
  { key: 'Cmd + K', description: 'Open Command Palette', category: 'Interface' },
  { key: 'Cmd + /', description: 'Show Keyboard Shortcuts', category: 'Interface' },
  { key: 'Cmd + ,', description: 'Open Settings', category: 'Interface' },
  { key: 'Cmd + B', description: 'Toggle Notifications', category: 'Interface' },
  { key: 'Esc', description: 'Close Modal/Dialog', category: 'Interface' },
  
  // Calendar
  { key: 'T', description: 'Go to Today', category: 'Calendar' },
  { key: 'J', description: 'Next Day/Week', category: 'Calendar' },
  { key: 'K', description: 'Previous Day/Week', category: 'Calendar' },
  { key: 'M', description: 'Switch to Month View', category: 'Calendar' },
  { key: 'W', description: 'Switch to Week View', category: 'Calendar' },
  
  // Quick Actions
  { key: 'A', description: 'Approve Selected Post', category: 'Approval' },
  { key: 'R', description: 'Reject Selected Post', category: 'Approval' },
  { key: 'C', description: 'Add Comment', category: 'Approval' },
  { key: 'F', description: 'Focus Search', category: 'Search' },
  { key: 'G then H', description: 'Go to Home', category: 'Navigation' },
  { key: 'G then C', description: 'Go to Calendar', category: 'Navigation' }
]

interface KeyboardShortcutsProps {
  open: boolean
  onClose: () => void
  customShortcuts?: Array<{
    key: string
    action: string
    category: string
  }>
}

export function KeyboardShortcuts({ open, onClose, customShortcuts = [] }: KeyboardShortcutsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredShortcuts, setFilteredShortcuts] = useState(shortcuts)

  useEffect(() => {
    if (searchQuery) {
      const filtered = shortcuts.filter(
        shortcut =>
          shortcut.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shortcut.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shortcut.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredShortcuts(filtered)
    } else {
      setFilteredShortcuts(shortcuts)
    }
  }, [searchQuery])

  const categories = Array.from(new Set(filteredShortcuts.map(s => s.category)))

  const getPlatformKey = (key: string) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
    return key.replace('Cmd', isMac ? '⌘' : 'Ctrl')
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard size={24} />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search shortcuts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid gap-6 max-h-[50vh] overflow-y-auto">
            {categories.map((category) => {
              const categoryShortcuts = filteredShortcuts.filter(s => s.category === category)
              if (categoryShortcuts.length === 0) return null

              return (
                <div key={category}>
                  <h3 className="font-semibold text-lg mb-3 text-primary">{category}</h3>
                  <div className="grid gap-2">
                    {categoryShortcuts.map((shortcut, index) => (
                      <Card key={`${category}-${index}`} className="hover:bg-muted/50 transition-colors">
                        <CardContent className="flex items-center justify-between p-3">
                          <span className="text-sm">{shortcut.description}</span>
                          <Badge variant="outline" className="font-mono text-xs">
                            {getPlatformKey(shortcut.key)}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {filteredShortcuts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Keyboard size={48} className="mx-auto mb-4 opacity-50" />
              <p>No shortcuts found matching "{searchQuery}"</p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}export default KeyboardShortcuts
