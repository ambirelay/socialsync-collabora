import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Bell, 
  Palette, 
  Globe, 
  Shield, 
  Download,
  Trash2,
  HardDrive
} from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface UserSettings {
  notifications: {
    email: boolean
    push: boolean
    comments: boolean
    approvals: boolean
    mentions: boolean
  }
  display: {
    timezone: string
    dateFormat: string
    startOfWeek: string
  }
  privacy: {
    profileVisible: boolean
    activityVisible: boolean
  }
}

const defaultSettings: UserSettings = {
  notifications: {
    email: true,
    push: true,
    comments: true,
    approvals: true,
    mentions: true
  },
  display: {
    timezone: 'America/New_York',
    dateFormat: 'MM/dd/yyyy',
    startOfWeek: 'monday'
  },
  privacy: {
    profileVisible: true,
    activityVisible: true
  }
}

interface SettingsModalProps {
  open: boolean
  onClose: () => void
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const [settings, setSettings] = useKV<UserSettings>('user-settings', defaultSettings)
  const [activeSection, setActiveSection] = useState<'notifications' | 'display' | 'privacy' | 'data'>('notifications')

  const updateSettings = (section: keyof UserSettings, key: string, value: any) => {
    setSettings(current => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: value
      }
    }))
    toast.success('Settings updated')
  }

  const exportData = () => {
    // Mock data export
    const dataBlob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'contentplan-settings.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Settings exported successfully')
  }

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      // In a real app, this would clear all user data
      toast.success('All data cleared successfully')
    }
  }

  const sections = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'display', label: 'Display', icon: Palette },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'data', label: 'Data', icon: HardDrive }
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings size={20} />
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 gap-6 overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 space-y-1">
            {sections.map(section => {
              const Icon = section.icon
              return (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveSection(section.id as any)}
                >
                  <Icon size={16} className="mr-2" />
                  {section.label}
                </Button>
              )
            })}
          </div>

          <Separator orientation="vertical" />

          {/* Content */}
          <div className="flex-1 overflow-y-auto space-y-6">
            {activeSection === 'notifications' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Email Notifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable email notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={settings.notifications.email}
                        onCheckedChange={(checked) => updateSettings('notifications', 'email', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Activity Notifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Comments on my posts</Label>
                      <Switch
                        checked={settings.notifications.comments}
                        onCheckedChange={(checked) => updateSettings('notifications', 'comments', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Approval requests</Label>
                      <Switch
                        checked={settings.notifications.approvals}
                        onCheckedChange={(checked) => updateSettings('notifications', 'approvals', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Mentions</Label>
                      <Switch
                        checked={settings.notifications.mentions}
                        onCheckedChange={(checked) => updateSettings('notifications', 'mentions', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'display' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Display Settings</h3>
                </div>

                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label>Timezone</Label>
                      <Select
                        value={settings.display.timezone}
                        onValueChange={(value) => updateSettings('display', 'timezone', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                          <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                          <SelectItem value="UTC">Coordinated Universal Time (UTC)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Date Format</Label>
                      <Select
                        value={settings.display.dateFormat}
                        onValueChange={(value) => updateSettings('display', 'dateFormat', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                          <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                          <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Start of Week</Label>
                      <Select
                        value={settings.display.startOfWeek}
                        onValueChange={(value) => updateSettings('display', 'startOfWeek', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sunday">Sunday</SelectItem>
                          <SelectItem value="monday">Monday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'privacy' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
                </div>

                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Profile Visibility</Label>
                        <p className="text-sm text-muted-foreground">Make your profile visible to team members</p>
                      </div>
                      <Switch
                        checked={settings.privacy.profileVisible}
                        onCheckedChange={(checked) => updateSettings('privacy', 'profileVisible', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Activity Visibility</Label>
                        <p className="text-sm text-muted-foreground">Show your activity to team members</p>
                      </div>
                      <Switch
                        checked={settings.privacy.activityVisible}
                        onCheckedChange={(checked) => updateSettings('privacy', 'activityVisible', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'data' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Data Management</h3>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Export Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Export your settings and preferences as a JSON file.
                    </p>
                    <Button onClick={exportData} variant="outline">
                      <Download size={16} className="mr-2" />
                      Export Settings
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base text-red-600">Danger Zone</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Clear all your data including posts, comments, and settings. This action cannot be undone.
                    </p>
                    <Button onClick={clearAllData} variant="destructive">
                      <Trash2 size={16} className="mr-2" />
                      Clear All Data
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}