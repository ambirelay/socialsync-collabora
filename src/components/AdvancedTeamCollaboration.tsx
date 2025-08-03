import { useState, useMemo } from 'react'
import { Post, User, UserRole } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { 
  Users, 
  Plus, 
  Settings, 
  Crown, 
  Shield, 
  Eye, 
  Edit3,
  UserPlus,
  UserMinus,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Bell,
  Activity,
  BarChart3,
  Target,
  Award,
  Star,
  Zap,
  Globe,
  Lock,
  Unlock,
  Send,
  FileText,
  Video,
  Headphones,
  Share,
  Download,
  Upload,
  Filter,
  Search,
  MoreHorizontal
} from '@phosphor-icons/react'
import { format, formatDistanceToNow } from 'date-fns'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface TeamMember extends User {
  joinedAt: string
  lastActive: string
  permissions: {
    canCreatePosts: boolean
    canEditAllPosts: boolean
    canDeletePosts: boolean
    canApproveContent: boolean
    canManageTeam: boolean
    canViewAnalytics: boolean
    canManageSettings: boolean
  }
  workload: {
    assignedPosts: number
    completedPosts: number
    avgCompletionTime: number
  }
  performance: {
    contentQualityScore: number
    collaborationScore: number
    productivityScore: number
    clientSatisfactionScore: number
  }
  preferences: {
    notifications: {
      email: boolean
      push: boolean
      mentions: boolean
      assignments: boolean
    }
    timezone: string
    language: string
  }
}

interface WorkspaceInvite {
  id: string
  email: string
  role: UserRole
  invitedBy: string
  invitedAt: string
  expiresAt: string
  status: 'pending' | 'accepted' | 'expired'
}

interface TeamActivity {
  id: string
  type: 'post_created' | 'post_approved' | 'comment_added' | 'user_joined' | 'role_changed' | 'post_assigned'
  userId: string
  user: User
  targetId?: string
  targetType?: 'post' | 'user' | 'comment'
  description: string
  timestamp: string
}

interface PerformanceMetric {
  userId: string
  period: 'week' | 'month' | 'quarter'
  postsCreated: number
  postsApproved: number
  avgEngagementRate: number
  collaborationScore: number
  clientFeedbackScore: number
}

interface CollaborationProject {
  id: string
  name: string
  description: string
  status: 'planning' | 'active' | 'review' | 'completed'
  priority: 'low' | 'medium' | 'high'
  dueDate: string
  assignedMembers: string[]
  progress: number
  posts: string[]
  createdBy: string
  createdAt: string
}

interface AdvancedTeamCollaborationProps {
  posts: Post[]
}

const roleHierarchy: Record<UserRole, number> = {
  viewer: 1,
  reviewer: 2,
  editor: 3,
  admin: 4
}

const defaultPermissions: Record<UserRole, TeamMember['permissions']> = {
  viewer: {
    canCreatePosts: false,
    canEditAllPosts: false,
    canDeletePosts: false,
    canApproveContent: false,
    canManageTeam: false,
    canViewAnalytics: false,
    canManageSettings: false
  },
  reviewer: {
    canCreatePosts: false,
    canEditAllPosts: false,
    canDeletePosts: false,
    canApproveContent: true,
    canManageTeam: false,
    canViewAnalytics: true,
    canManageSettings: false
  },
  editor: {
    canCreatePosts: true,
    canEditAllPosts: false,
    canDeletePosts: false,
    canApproveContent: true,
    canManageTeam: false,
    canViewAnalytics: true,
    canManageSettings: false
  },
  admin: {
    canCreatePosts: true,
    canEditAllPosts: true,
    canDeletePosts: true,
    canApproveContent: true,
    canManageTeam: true,
    canViewAnalytics: true,
    canManageSettings: true
  }
}

export function AdvancedTeamCollaboration({ posts }: AdvancedTeamCollaborationProps) {
  const [teamMembers, setTeamMembers] = useKV<TeamMember[]>('team-members', [])
  const [invites, setInvites] = useKV<WorkspaceInvite[]>('workspace-invites', [])
  const [activities, setActivities] = useKV<TeamActivity[]>('team-activities', [])
  const [projects, setProjects] = useKV<CollaborationProject[]>('collaboration-projects', [])
  
  const [activeTab, setActiveTab] = useState('overview')
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [showProjectDialog, setShowProjectDialog] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  
  const [newInvite, setNewInvite] = useState({
    email: '',
    role: 'editor' as UserRole,
    customMessage: ''
  })

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    priority: 'medium' as const,
    dueDate: '',
    assignedMembers: [] as string[]
  })

  // Mock data initialization
  useMemo(() => {
    if (teamMembers.length === 0) {
      const mockMembers: TeamMember[] = [
        {
          id: 'user-1',
          name: 'Sarah Chen',
          email: 'sarah@company.com',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
          role: 'admin',
          joinedAt: '2024-01-15T00:00:00Z',
          lastActive: new Date(Date.now() - 3600000).toISOString(),
          permissions: defaultPermissions.admin,
          workload: {
            assignedPosts: 8,
            completedPosts: 12,
            avgCompletionTime: 2.5
          },
          performance: {
            contentQualityScore: 92,
            collaborationScore: 88,
            productivityScore: 95,
            clientSatisfactionScore: 91
          },
          preferences: {
            notifications: {
              email: true,
              push: true,
              mentions: true,
              assignments: true
            },
            timezone: 'America/New_York',
            language: 'en'
          }
        },
        {
          id: 'user-2',
          name: 'Marcus Rodriguez',
          email: 'marcus@company.com',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          role: 'editor',
          joinedAt: '2024-02-01T00:00:00Z',
          lastActive: new Date(Date.now() - 1800000).toISOString(),
          permissions: defaultPermissions.editor,
          workload: {
            assignedPosts: 6,
            completedPosts: 8,
            avgCompletionTime: 3.2
          },
          performance: {
            contentQualityScore: 87,
            collaborationScore: 92,
            productivityScore: 85,
            clientSatisfactionScore: 89
          },
          preferences: {
            notifications: {
              email: true,
              push: false,
              mentions: true,
              assignments: true
            },
            timezone: 'America/Los_Angeles',
            language: 'en'
          }
        },
        {
          id: 'user-3',
          name: 'Emma Thompson',
          email: 'emma@company.com',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          role: 'editor',
          joinedAt: '2024-02-15T00:00:00Z',
          lastActive: new Date(Date.now() - 7200000).toISOString(),
          permissions: defaultPermissions.editor,
          workload: {
            assignedPosts: 4,
            completedPosts: 6,
            avgCompletionTime: 2.8
          },
          performance: {
            contentQualityScore: 90,
            collaborationScore: 85,
            productivityScore: 88,
            clientSatisfactionScore: 93
          },
          preferences: {
            notifications: {
              email: false,
              push: true,
              mentions: true,
              assignments: false
            },
            timezone: 'Europe/London',
            language: 'en'
          }
        }
      ]
      setTeamMembers(mockMembers)
    }
  }, [teamMembers.length, setTeamMembers])

  const currentUser = teamMembers.find(member => member.id === 'user-1') || teamMembers[0]

  const sendInvite = () => {
    if (!newInvite.email || !newInvite.role) return

    const invite: WorkspaceInvite = {
      id: Date.now().toString(),
      email: newInvite.email,
      role: newInvite.role,
      invitedBy: currentUser?.id || 'user-1',
      invitedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending'
    }

    setInvites(current => [...current, invite])
    setNewInvite({ email: '', role: 'editor', customMessage: '' })
    setShowInviteDialog(false)
    toast.success(`Invitation sent to ${invite.email}`)
  }

  const updateMemberRole = (memberId: string, newRole: UserRole) => {
    setTeamMembers(current =>
      current.map(member =>
        member.id === memberId
          ? { ...member, role: newRole, permissions: defaultPermissions[newRole] }
          : member
      )
    )
    toast.success('Member role updated successfully')
  }

  const removeMember = (memberId: string) => {
    setTeamMembers(current => current.filter(member => member.id !== memberId))
    toast.success('Member removed from workspace')
  }

  const createProject = () => {
    if (!newProject.name || !newProject.description) return

    const project: CollaborationProject = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      status: 'planning',
      priority: newProject.priority,
      dueDate: newProject.dueDate,
      assignedMembers: newProject.assignedMembers,
      progress: 0,
      posts: [],
      createdBy: currentUser?.id || 'user-1',
      createdAt: new Date().toISOString()
    }

    setProjects(current => [...current, project])
    setNewProject({
      name: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      assignedMembers: []
    })
    setShowProjectDialog(false)
    toast.success('Project created successfully')
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin': return <Crown size={16} className="text-yellow-600" />
      case 'editor': return <Edit3 size={16} className="text-blue-600" />
      case 'reviewer': return <Eye size={16} className="text-green-600" />
      default: return <Users size={16} className="text-gray-600" />
    }
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 75) return 'text-blue-600'
    if (score >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  const teamStats = useMemo(() => {
    const totalMembers = teamMembers.length
    const activeMembers = teamMembers.filter(member => 
      new Date(member.lastActive) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length
    const avgPerformance = teamMembers.reduce((sum, member) => 
      sum + (member.performance.contentQualityScore + member.performance.collaborationScore + 
             member.performance.productivityScore + member.performance.clientSatisfactionScore) / 4, 0
    ) / Math.max(teamMembers.length, 1)
    const totalWorkload = teamMembers.reduce((sum, member) => sum + member.workload.assignedPosts, 0)

    return {
      totalMembers,
      activeMembers,
      avgPerformance: Math.round(avgPerformance),
      totalWorkload,
      pendingInvites: invites.filter(invite => invite.status === 'pending').length
    }
  }, [teamMembers, invites])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Collaboration</h1>
          <p className="text-muted-foreground">Manage your team and enhance collaboration</p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus size={16} className="mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    value={newProject.name}
                    onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Q4 Campaign Launch"
                  />
                </div>
                <div>
                  <Label htmlFor="project-description">Description</Label>
                  <Textarea
                    id="project-description"
                    value={newProject.description}
                    onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the project goals and scope..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="project-priority">Priority</Label>
                    <Select 
                      value={newProject.priority} 
                      onValueChange={(value: 'low' | 'medium' | 'high') => 
                        setNewProject(prev => ({ ...prev, priority: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="project-due">Due Date</Label>
                    <Input
                      id="project-due"
                      type="date"
                      value={newProject.dueDate}
                      onChange={(e) => setNewProject(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                </div>
                <Button onClick={createProject} className="w-full">
                  Create Project
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus size={16} className="mr-2" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="invite-email">Email Address</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    value={newInvite.email}
                    onChange={(e) => setNewInvite(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="colleague@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="invite-role">Role</Label>
                  <Select 
                    value={newInvite.role} 
                    onValueChange={(value: UserRole) => setNewInvite(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Viewer</SelectItem>
                      <SelectItem value="reviewer">Reviewer</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="invite-message">Custom Message (Optional)</Label>
                  <Textarea
                    id="invite-message"
                    value={newInvite.customMessage}
                    onChange={(e) => setNewInvite(prev => ({ ...prev, customMessage: e.target.value }))}
                    placeholder="Welcome to our content team! Looking forward to collaborating..."
                    rows={3}
                  />
                </div>
                <Button onClick={sendInvite} className="w-full">
                  <Send size={16} className="mr-2" />
                  Send Invitation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold">{teamStats.totalMembers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Today</p>
                <p className="text-2xl font-bold">{teamStats.activeMembers}</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Performance</p>
                <p className="text-2xl font-bold">{teamStats.avgPerformance}%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Workload</p>
                <p className="text-2xl font-bold">{teamStats.totalWorkload}</p>
              </div>
              <Target className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Invites</p>
                <p className="text-2xl font-bold">{teamStats.pendingInvites}</p>
              </div>
              <Mail className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Users size={16} />
            Overview
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center gap-2">
            <UserPlus size={16} />
            Members
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <FileText size={16} />
            Projects
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BarChart3 size={16} />
            Performance
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity size={16} />
            Activity
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Team Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 size={20} />
                  Team Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {teamMembers.slice(0, 5).map((member) => {
                  const avgScore = Math.round(
                    (member.performance.contentQualityScore + 
                     member.performance.collaborationScore + 
                     member.performance.productivityScore + 
                     member.performance.clientSatisfactionScore) / 4
                  )
                  
                  return (
                    <div key={member.id} className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{member.name}</span>
                          <span className={`text-sm font-bold ${getPerformanceColor(avgScore)}`}>
                            {avgScore}%
                          </span>
                        </div>
                        <Progress value={avgScore} className="h-2" />
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Current Workload Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target size={20} />
                  Workload Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="text-xs">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{member.workload.assignedPosts}</p>
                      <p className="text-xs text-muted-foreground">assigned posts</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity size={20} />
                Recent Team Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {[
                    {
                      user: teamMembers[1],
                      action: 'created a new post',
                      target: 'Instagram campaign post',
                      time: '2 hours ago'
                    },
                    {
                      user: teamMembers[0],
                      action: 'approved',
                      target: 'LinkedIn thought leadership article',
                      time: '4 hours ago'
                    },
                    {
                      user: teamMembers[2],
                      action: 'commented on',
                      target: 'Twitter thread about industry trends',
                      time: '6 hours ago'
                    },
                    {
                      user: teamMembers[1],
                      action: 'was assigned to',
                      target: 'Q4 Campaign Project',
                      time: '8 hours ago'
                    },
                    {
                      user: teamMembers[0],
                      action: 'invited',
                      target: 'alex@company.com to join the team',
                      time: '1 day ago'
                    }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                        <AvatarFallback className="text-xs">
                          {activity.user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user.name}</span>
                          {' '}{activity.action}{' '}
                          <span className="font-medium">{activity.target}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Team Members ({teamMembers.length})</h2>
            <div className="flex items-center gap-3">
              <Input placeholder="Search members..." className="w-64" />
              <Button variant="outline">
                <Filter size={16} className="mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <Card key={member.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal size={16} />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Role</span>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(member.role)}
                        <Badge variant="outline" className="capitalize">
                          {member.role}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Last Active</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(member.lastActive), { addSuffix: true })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Workload</span>
                      <span className="text-sm font-medium">
                        {member.workload.assignedPosts} posts
                      </span>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span>Performance Score</span>
                        <span className="font-medium">
                          {Math.round(
                            (member.performance.contentQualityScore + 
                             member.performance.collaborationScore + 
                             member.performance.productivityScore + 
                             member.performance.clientSatisfactionScore) / 4
                          )}%
                        </span>
                      </div>
                      <Progress 
                        value={Math.round(
                          (member.performance.contentQualityScore + 
                           member.performance.collaborationScore + 
                           member.performance.productivityScore + 
                           member.performance.clientSatisfactionScore) / 4
                        )} 
                        className="h-2" 
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedMember(member)}
                      >
                        <Eye size={14} className="mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <MessageCircle size={14} className="mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pending Invites */}
          {invites.filter(invite => invite.status === 'pending').length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail size={20} />
                  Pending Invitations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {invites.filter(invite => invite.status === 'pending').map((invite) => (
                    <div key={invite.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{invite.email}</p>
                        <p className="text-sm text-muted-foreground">
                          Invited as {invite.role} • {formatDistanceToNow(new Date(invite.invitedAt), { addSuffix: true })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Pending</Badge>
                        <Button variant="outline" size="sm">
                          Resend
                        </Button>
                        <Button variant="outline" size="sm">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Collaboration Projects</h2>
            <Button onClick={() => setShowProjectDialog(true)}>
              <Plus size={16} className="mr-2" />
              New Project
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: '1',
                name: 'Q4 Holiday Campaign',
                description: 'Complete social media campaign for holiday season including content creation, scheduling, and performance tracking.',
                status: 'active' as const,
                priority: 'high' as const,
                progress: 65,
                dueDate: '2024-12-01',
                assignedMembers: ['user-1', 'user-2', 'user-3'],
                postsCount: 24
              },
              {
                id: '2',
                name: 'Brand Voice Guidelines',
                description: 'Develop comprehensive brand voice and tone guidelines for all social media platforms.',
                status: 'review' as const,
                priority: 'medium' as const,
                progress: 85,
                dueDate: '2024-11-15',
                assignedMembers: ['user-1', 'user-3'],
                postsCount: 8
              },
              {
                id: '3',
                name: 'Influencer Partnership',
                description: 'Coordinate content creation with key influencers for product launch campaign.',
                status: 'planning' as const,
                priority: 'high' as const,
                progress: 25,
                dueDate: '2024-12-15',
                assignedMembers: ['user-2'],
                postsCount: 12
              }
            ].map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={project.priority === 'high' ? 'destructive' : project.priority === 'medium' ? 'default' : 'secondary'}>
                        {project.priority}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Progress</span>
                      <span className="text-sm font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span>Due Date:</span>
                    <span className="font-medium">{format(new Date(project.dueDate), 'MMM dd, yyyy')}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span>Posts:</span>
                    <span className="font-medium">{project.postsCount} created</span>
                  </div>

                  <div>
                    <p className="text-sm mb-2">Assigned Team:</p>
                    <div className="flex -space-x-2">
                      {project.assignedMembers.map((memberId) => {
                        const member = teamMembers.find(m => m.id === memberId)
                        if (!member) return null
                        return (
                          <Avatar key={memberId} className="w-8 h-8 border-2 border-background">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback className="text-xs">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye size={14} className="mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit3 size={14} className="mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {teamMembers.map((member) => (
              <Card key={member.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <p className="text-sm text-muted-foreground capitalize">{member.role}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Content Quality</p>
                      <div className="flex items-center gap-2">
                        <Progress value={member.performance.contentQualityScore} className="flex-1 h-2" />
                        <span className="text-sm font-medium">{member.performance.contentQualityScore}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Collaboration</p>
                      <div className="flex items-center gap-2">
                        <Progress value={member.performance.collaborationScore} className="flex-1 h-2" />
                        <span className="text-sm font-medium">{member.performance.collaborationScore}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Productivity</p>
                      <div className="flex items-center gap-2">
                        <Progress value={member.performance.productivityScore} className="flex-1 h-2" />
                        <span className="text-sm font-medium">{member.performance.productivityScore}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Client Satisfaction</p>
                      <div className="flex items-center gap-2">
                        <Progress value={member.performance.clientSatisfactionScore} className="flex-1 h-2" />
                        <span className="text-sm font-medium">{member.performance.clientSatisfactionScore}%</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold">{member.workload.completedPosts}</p>
                      <p className="text-xs text-muted-foreground">Completed Posts</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{member.workload.avgCompletionTime}h</p>
                      <p className="text-xs text-muted-foreground">Avg Completion</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{member.workload.assignedPosts}</p>
                      <p className="text-xs text-muted-foreground">Current Load</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity size={20} />
                Team Activity Feed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {Array.from({ length: 15 }, (_, i) => {
                    const member = teamMembers[i % teamMembers.length]
                    const actions = [
                      'created a new post for',
                      'approved content for',
                      'commented on',
                      'was assigned to',
                      'completed work on',
                      'shared feedback on'
                    ]
                    const targets = [
                      'Instagram Campaign',
                      'LinkedIn Article',
                      'Twitter Thread',
                      'Facebook Post',
                      'TikTok Video',
                      'YouTube Short'
                    ]
                    
                    return (
                      <div key={i} className="flex items-start gap-3 p-3 border rounded-lg">
                        <Avatar className="w-8 h-8 mt-1">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback className="text-xs">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{member.name}</span>
                            {' '}{actions[i % actions.length]}{' '}
                            <span className="font-medium">{targets[i % targets.length]}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {Math.floor(Math.random() * 8) + 1} hours ago
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {member.role}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdvancedTeamCollaboration
