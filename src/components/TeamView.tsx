import { useState } from 'react'
import { User, UserRole } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Users, Plus, Mail, Shield, Edit2, Trash2 } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

const sampleTeamMembers: User[] = [
  {
    id: 'user-1',
    name: 'Sarah Chen',
    email: 'sarah@company.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    role: 'admin'
  },
  {
    id: 'user-2',
    name: 'Marcus Rodriguez',
    email: 'marcus@company.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    role: 'editor'
  },
  {
    id: 'user-3',
    name: 'Emma Thompson',
    email: 'emma@company.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    role: 'editor'
  },
  {
    id: 'user-4',
    name: 'David Park',
    email: 'david@client.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: 'reviewer'
  },
  {
    id: 'user-5',
    name: 'Lisa Wang',
    email: 'lisa@client.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    role: 'viewer'
  }
]

const roleColors = {
  admin: 'bg-red-100 text-red-700 border-red-200',
  editor: 'bg-blue-100 text-blue-700 border-blue-200',
  reviewer: 'bg-amber-100 text-amber-700 border-amber-200',
  viewer: 'bg-gray-100 text-gray-700 border-gray-200'
}

const roleDescriptions = {
  admin: 'Full access to all features and settings',
  editor: 'Can create, edit, and submit content for approval',
  reviewer: 'Can review and approve/reject content',
  viewer: 'Can view content but cannot edit or approve'
}

export function TeamView() {
  const [teamMembers, setTeamMembers] = useKV<User[]>('team-members', sampleTeamMembers)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [inviteRole, setInviteRole] = useState<UserRole>('viewer')

  const handleInviteMember = () => {
    if (!inviteEmail.trim() || !inviteName.trim()) return

    const newMember: User = {
      id: `user-${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`
    }

    setTeamMembers(current => [...current, newMember])
    
    // Reset form
    setInviteEmail('')
    setInviteName('')
    setInviteRole('viewer')
    setShowInviteDialog(false)
    
    toast.success(`Invitation sent to ${newMember.name}`)
  }

  const handleUpdateRole = (userId: string, newRole: UserRole) => {
    setTeamMembers(current =>
      current.map(member =>
        member.id === userId ? { ...member, role: newRole } : member
      )
    )
    toast.success('Role updated successfully')
  }

  const handleRemoveMember = (userId: string) => {
    const member = teamMembers.find(m => m.id === userId)
    if (member) {
      setTeamMembers(current => current.filter(m => m.id !== userId))
      toast.success(`${member.name} removed from team`)
    }
  }

  const roleStats = {
    admin: teamMembers.filter(m => m.role === 'admin').length,
    editor: teamMembers.filter(m => m.role === 'editor').length,
    reviewer: teamMembers.filter(m => m.role === 'reviewer').length,
    viewer: teamMembers.filter(m => m.role === 'viewer').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-muted-foreground">Manage team members and their permissions</p>
        </div>
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={inviteRole} onValueChange={(value: UserRole) => setInviteRole(value)}>
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
                <p className="text-xs text-muted-foreground">
                  {roleDescriptions[inviteRole]}
                </p>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleInviteMember}
                  disabled={!inviteEmail.trim() || !inviteName.trim()}
                >
                  <Mail size={16} className="mr-2" />
                  Send Invitation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Role Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div>
                <div className="text-2xl font-semibold">{roleStats.admin}</div>
                <div className="text-sm text-muted-foreground">Admins</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <div>
                <div className="text-2xl font-semibold">{roleStats.editor}</div>
                <div className="text-sm text-muted-foreground">Editors</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div>
                <div className="text-2xl font-semibold">{roleStats.reviewer}</div>
                <div className="text-sm text-muted-foreground">Reviewers</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gray-500" />
              <div>
                <div className="text-2xl font-semibold">{roleStats.viewer}</div>
                <div className="text-sm text-muted-foreground">Viewers</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={20} />
            Team Members ({teamMembers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map(member => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">{member.email}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge className={roleColors[member.role]}>
                    <Shield size={12} className="mr-1" />
                    {member.role}
                  </Badge>
                  
                  <div className="flex items-center gap-1">
                    <Select
                      value={member.role}
                      onValueChange={(newRole: UserRole) => handleUpdateRole(member.id, newRole)}
                    >
                      <SelectTrigger className="w-[120px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">Viewer</SelectItem>
                        <SelectItem value="reviewer">Reviewer</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {member.role !== 'admin' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(roleDescriptions).map(([role, description]) => (
              <div key={role} className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={roleColors[role as UserRole]}>
                    <Shield size={12} className="mr-1" />
                    {role}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TeamView
