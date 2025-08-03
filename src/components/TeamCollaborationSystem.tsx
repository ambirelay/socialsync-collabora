import { useState } from 'react'
import { User, UserRole, Post } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Users, 
  Plus, 
  Mail, 
  UserPlus,
  Settings,
  Crown,
  Edit,
  Trash2,
  MessageCircle,
  Calendar,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  Shield,
  Key,
  UserCheck,
  UserX,
  Activity,
  Target,
  Award
} from 'lucide-react'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'
import { format, subDays } from 'date-fns'

interface TeamMember extends User {
  joinedAt: string
  lastActive: string
  permissions: string[]
  postsCreated: number
  postsApproved: number
  commentsAdded: number
  status: 'active' | 'pending' | 'inactive'
  department?: string
  timezone?: string
}

interface TeamInvite {
  id: string
  email: string
  role: UserRole
  invitedBy: string
  invitedAt: string
  status: 'pending' | 'accepted' | 'expired'
  department?: string
}

interface Permission {
  id: string
  name: string
  description: string
  category: 'content' | 'team' | 'analytics' | 'settings'
}

interface TeamActivity {
  id: string
  type: 'user_joined' | 'role_changed' | 'post_created' | 'post_approved' | 'comment_added'
  userId: string
  user: User
  description: string
  timestamp: string
  metadata?: any
}

const sampleTeamMembers: TeamMember[] = [
  {
    id: 'user-1',
    name: 'Sarah Chen',
    email: 'sarah@company.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    role: 'admin',
    joinedAt: new Date(Date.now() - 86400000 * 90).toISOString(),
    lastActive: new Date(Date.now() - 1800000).toISOString(),
    permissions: ['create_posts', 'approve_posts', 'manage_team', 'view_analytics', 'manage_settings'],
    postsCreated: 45,
    postsApproved: 23,
    commentsAdded: 89,
    status: 'active',
    department: 'Marketing',
    timezone: 'UTC-8'
  },
  {
    id: 'user-2',
    name: 'Marcus Rodriguez',
    email: 'marcus@company.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    role: 'editor',
    joinedAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    lastActive: new Date(Date.now() - 3600000).toISOString(),
    permissions: ['create_posts', 'view_analytics'],
    postsCreated: 32,
    postsApproved: 0,
    commentsAdded: 54,
    status: 'active',
    department: 'Creative',
    timezone: 'UTC-5'
  },
  {
    id: 'user-3',
    name: 'Emma Thompson',
    email: 'emma@company.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    role: 'editor',
    joinedAt: new Date(Date.now() - 86400000 * 45).toISOString(),
    lastActive: new Date(Date.now() - 7200000).toISOString(),
    permissions: ['create_posts', 'view_analytics'],
    postsCreated: 28,
    postsApproved: 0,
    commentsAdded: 67,
    status: 'active',
    department: 'Content',
    timezone: 'UTC+1'
  },
  {
    id: 'user-4',
    name: 'David Park',
    email: 'david@company.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: 'reviewer',
    joinedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    lastActive: new Date(Date.now() - 14400000).toISOString(),
    permissions: ['approve_posts', 'view_analytics'],
    postsCreated: 5,
    postsApproved: 67,
    commentsAdded: 123,
    status: 'active',
    department: 'Marketing',
    timezone: 'UTC+9'
  },
  {
    id: 'user-5',
    name: 'Lisa Wang',
    email: 'lisa@company.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
    role: 'viewer',
    joinedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    lastActive: new Date(Date.now() - 86400000).toISOString(),
    permissions: ['view_analytics'],
    postsCreated: 0,
    postsApproved: 0,
    commentsAdded: 12,
    status: 'active',
    department: 'Sales',
    timezone: 'UTC-8'
  }
]

const sampleInvites: TeamInvite[] = [
  {
    id: 'invite-1',
    email: 'john@company.com',
    role: 'editor',
    invitedBy: 'user-1',
    invitedAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'pending',
    department: 'Marketing'
  },
  {
    id: 'invite-2',
    email: 'alex@agency.com',
    role: 'reviewer',
    invitedBy: 'user-1',
    invitedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: 'pending',
    department: 'External'
  }
]

const availablePermissions: Permission[] = [
  { id: 'create_posts', name: 'Create Posts', description: 'Create and draft social media posts', category: 'content' },
  { id: 'edit_posts', name: 'Edit Posts', description: 'Edit existing posts from other users', category: 'content' },
  { id: 'delete_posts', name: 'Delete Posts', description: 'Delete posts from any user', category: 'content' },
  { id: 'approve_posts', name: 'Approve Posts', description: 'Approve posts for publishing', category: 'content' },
  { id: 'schedule_posts', name: 'Schedule Posts', description: 'Schedule posts for future publishing', category: 'content' },
  { id: 'manage_media', name: 'Manage Media', description: 'Upload and manage media library', category: 'content' },
  { id: 'invite_users', name: 'Invite Users', description: 'Send invitations to new team members', category: 'team' },
  { id: 'manage_team', name: 'Manage Team', description: 'Edit team member roles and permissions', category: 'team' },
  { id: 'remove_users', name: 'Remove Users', description: 'Remove team members from the workspace', category: 'team' },
  { id: 'view_analytics', name: 'View Analytics', description: 'Access analytics and performance data', category: 'analytics' },
  { id: 'export_data', name: 'Export Data', description: 'Export analytics and content data', category: 'analytics' },
  { id: 'manage_settings', name: 'Manage Settings', description: 'Configure workspace settings', category: 'settings' },
  { id: 'billing_access', name: 'Billing Access', description: 'View and manage billing information', category: 'settings' }
]

const sampleActivity: TeamActivity[] = [
  {
    id: 'activity-1',
    type: 'post_approved',
    userId: 'user-4',
    user: sampleTeamMembers[3],
    description: 'approved the LinkedIn post "AI Marketing Trends"',
    timestamp: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: 'activity-2',
    type: 'post_created',
    userId: 'user-2',
    user: sampleTeamMembers[1],
    description: 'created a new Instagram post about team culture',
    timestamp: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'activity-3',
    type: 'comment_added',
    userId: 'user-3',
    user: sampleTeamMembers[2],
    description: 'added a comment to "Product Launch Campaign"',
    timestamp: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'activity-4',
    type: 'user_joined',
    userId: 'user-5',
    user: sampleTeamMembers[4],
    description: 'joined the team as a Viewer',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
  }
]

interface TeamCollaborationSystemProps {
  posts: Post[]
}

export function TeamCollaborationSystem({ posts }: TeamCollaborationSystemProps) {
  const [teamMembers, setTeamMembers] = useKV<TeamMember[]>('team-members', sampleTeamMembers)
  const [invites, setInvites] = useKV<TeamInvite[]>('team-invites', sampleInvites)
  const [activity] = useKV<TeamActivity[]>('team-activity', sampleActivity)
  
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [showEditMemberDialog, setShowEditMemberDialog] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'editor' as UserRole,
    department: ''
  })

  const roleColors = {
    admin: 'bg-purple-100 text-purple-700',
    editor: 'bg-blue-100 text-blue-700',
    reviewer: 'bg-green-100 text-green-700',
    viewer: 'bg-gray-100 text-gray-700'
  }

  const roleIcons = {
    admin: Crown,
    editor: Edit,
    reviewer: CheckCircle,
    viewer: Users
  }

  const handleInviteUser = () => {
    if (!inviteForm.email) return

    const newInvite: TeamInvite = {
      id: `invite-${Date.now()}`,
      email: inviteForm.email,
      role: inviteForm.role,
      invitedBy: 'user-1', // Current user
      invitedAt: new Date().toISOString(),
      status: 'pending',
      department: inviteForm.department || undefined
    }

    setInvites(current => [...current, newInvite])
    setInviteForm({ email: '', role: 'editor', department: '' })
    setShowInviteDialog(false)
    toast.success(`Invitation sent to ${newInvite.email}`)
  }

  const handleUpdateMemberRole = (memberId: string, newRole: UserRole) => {
    setTeamMembers(current =>
      current.map(member =>
        member.id === memberId
          ? { ...member, role: newRole }
          : member
      )
    )
    toast.success('Member role updated')
  }

  const handleRemoveMember = (memberId: string) => {
    const member = teamMembers.find(m => m.id === memberId)
    if (member && member.role === 'admin') {
      toast.error('Cannot remove admin user')
      return
    }
    
    setTeamMembers(current => current.filter(member => member.id !== memberId))
    toast.success('Team member removed')
  }

  const handleCancelInvite = (inviteId: string) => {
    setInvites(current => current.filter(invite => invite.id !== inviteId))
    toast.success('Invitation cancelled')
  }

  const getActivityIcon = (type: string) => {
    const icons = {
      user_joined: UserPlus,
      role_changed: Settings,
      post_created: Plus,
      post_approved: CheckCircle,
      comment_added: MessageCircle
    }
    return icons[type] || Activity
  }

  const getActivityColor = (type: string) => {
    const colors = {
      user_joined: 'text-green-600',
      role_changed: 'text-blue-600',
      post_created: 'text-purple-600',
      post_approved: 'text-green-600',
      comment_added: 'text-amber-600'
    }
    return colors[type] || 'text-gray-600'
  }

  // Calculate team statistics
  const activeMembers = teamMembers.filter(m => m.status === 'active').length
  const totalPosts = teamMembers.reduce((sum, member) => sum + member.postsCreated, 0)
  const totalApprovals = teamMembers.reduce((sum, member) => sum + member.postsApproved, 0)
  const totalComments = teamMembers.reduce((sum, member) => sum + member.commentsAdded, 0)

  const topContributor = teamMembers.reduce((top, member) => 
    member.postsCreated > top.postsCreated ? member : top
  )

  const topReviewer = teamMembers.reduce((top, member) => 
    member.postsApproved > top.postsApproved ? member : top
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="text-primary" />
            Team Collaboration
          </h1>
          <p className="text-muted-foreground">Manage your team, permissions, and collaboration settings</p>
        </div>
        <Button onClick={() => setShowInviteDialog(true)}>
          <UserPlus size={16} className="mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Team Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Members</p>
                <div className="text-2xl font-bold">{activeMembers}</div>
                <p className="text-xs text-muted-foreground">{invites.length} pending invites</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
                <div className="text-2xl font-bold">{totalPosts}</div>
                <p className="text-xs text-muted-foreground">Created by team</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Approvals</p>
                <div className="text-2xl font-bold">{totalApprovals}</div>
                <p className="text-xs text-muted-foreground">Posts reviewed</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle size={24} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Team Comments</p>
                <div className="text-2xl font-bold">{totalComments}</div>
                <p className="text-xs text-muted-foreground">Collaboration points</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <MessageCircle size={24} className="text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="members" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="invites">Pending Invites</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <div className="space-y-6">
            {/* Top Contributors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="text-amber-500" size={20} />
                    Top Contributor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={topContributor.avatar} alt={topContributor.name} />
                      <AvatarFallback>
                        {topContributor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{topContributor.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {topContributor.postsCreated} posts created
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="text-green-500" size={20} />
                    Top Reviewer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={topReviewer.avatar} alt={topReviewer.name} />
                      <AvatarFallback>
                        {topReviewer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{topReviewer.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {topReviewer.postsApproved} posts approved
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Team Members List */}
            <Card>
              <CardHeader>
                <CardTitle>Team Members ({teamMembers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map(member => {
                    const RoleIcon = roleIcons[member.role]
                    return (
                      <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{member.name}</span>
                              <Badge className={roleColors[member.role]}>
                                <RoleIcon size={12} className="mr-1" />
                                {member.role}
                              </Badge>
                              {member.status === 'active' && (
                                <div className="w-2 h-2 bg-green-500 rounded-full" title="Online" />
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {member.email} • {member.department}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Last active: {format(new Date(member.lastActive), 'MMM d, h:mm a')}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right text-sm">
                            <div className="font-medium">{member.postsCreated}</div>
                            <div className="text-muted-foreground">posts</div>
                          </div>
                          <div className="text-right text-sm">
                            <div className="font-medium">{member.postsApproved}</div>
                            <div className="text-muted-foreground">approved</div>
                          </div>
                          <div className="text-right text-sm">
                            <div className="font-medium">{member.commentsAdded}</div>
                            <div className="text-muted-foreground">comments</div>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedMember(member)
                                setShowEditMemberDialog(true)
                              }}
                            >
                              <Settings size={14} />
                            </Button>
                            {member.role !== 'admin' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveMember(member.id)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="invites">
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations ({invites.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {invites.length > 0 ? (
                <div className="space-y-3">
                  {invites.map(invite => {
                    const RoleIcon = roleIcons[invite.role]
                    return (
                      <div key={invite.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                            <Mail size={20} />
                          </div>
                          <div>
                            <div className="font-medium">{invite.email}</div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge className={roleColors[invite.role]}>
                                <RoleIcon size={12} className="mr-1" />
                                {invite.role}
                              </Badge>
                              <span>•</span>
                              <span>{invite.department}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Invited {format(new Date(invite.invitedAt), 'MMM d, yyyy')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            <Clock size={12} className="mr-1" />
                            {invite.status}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelInvite(invite.id)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Mail size={48} className="mx-auto mb-4 opacity-50" />
                  <div>No pending invitations</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Permission Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {['content', 'team', 'analytics', 'settings'].map(category => (
                  <div key={category}>
                    <h3 className="font-semibold capitalize mb-3">{category} Permissions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {availablePermissions
                        .filter(permission => permission.category === category)
                        .map(permission => (
                          <div key={permission.id} className="p-3 border rounded-lg">
                            <div className="font-medium">{permission.name}</div>
                            <div className="text-sm text-muted-foreground mb-2">
                              {permission.description}
                            </div>
                            <div className="flex gap-1">
                              {['admin', 'editor', 'reviewer', 'viewer'].map(role => {
                                const hasPermission = role === 'admin' || 
                                  (role === 'editor' && ['create_posts', 'view_analytics', 'manage_media'].includes(permission.id)) ||
                                  (role === 'reviewer' && ['approve_posts', 'view_analytics'].includes(permission.id)) ||
                                  (role === 'viewer' && ['view_analytics'].includes(permission.id))
                                
                                return (
                                  <Badge
                                    key={role}
                                    variant={hasPermission ? "default" : "secondary"}
                                    className="text-xs"
                                  >
                                    {role}
                                  </Badge>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Team Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {activity.map(item => {
                    const ActivityIcon = getActivityIcon(item.type)
                    return (
                      <div key={item.id} className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center ${getActivityColor(item.type)}`}>
                          <ActivityIcon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={item.user.avatar} alt={item.user.name} />
                              <AvatarFallback className="text-xs">
                                {item.user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">{item.user.name}</span>
                            <span className="text-sm text-muted-foreground">{item.description}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {format(new Date(item.timestamp), 'MMM d, h:mm a')}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invite User Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@company.com"
                value={inviteForm.email}
                onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={inviteForm.role} onValueChange={(value) => setInviteForm(prev => ({ ...prev, role: value as UserRole }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="reviewer">Reviewer</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="department">Department (optional)</Label>
              <Input
                id="department"
                placeholder="Marketing, Creative, etc."
                value={inviteForm.department}
                onChange={(e) => setInviteForm(prev => ({ ...prev, department: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleInviteUser} disabled={!inviteForm.email}>
                Send Invitation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={showEditMemberDialog} onOpenChange={setShowEditMemberDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedMember.avatar} alt={selectedMember.name} />
                  <AvatarFallback>
                    {selectedMember.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedMember.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedMember.email}</div>
                </div>
              </div>
              <div>
                <Label>Role</Label>
                <Select 
                  value={selectedMember.role} 
                  onValueChange={(value) => handleUpdateMemberRole(selectedMember.id, value as UserRole)}
                  disabled={selectedMember.role === 'admin'}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="reviewer">Reviewer</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowEditMemberDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowEditMemberDialog(false)}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}