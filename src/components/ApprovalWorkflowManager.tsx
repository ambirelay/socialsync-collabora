import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Plus, 
  Settings, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  ArrowDown,
  Edit3,
  Trash2,
  Copy,
  Play,
  AlertTriangle
} from 'lucide-react'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'

interface ApprovalStep {
  id: string
  name: string
  description?: string
  approvers: ApprovalUser[]
  requiredApprovals: number
  autoApprove: boolean
  deadline?: number // hours
  conditions?: ApprovalCondition[]
}

interface ApprovalUser {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
}

interface ApprovalCondition {
  type: 'platform' | 'content_type' | 'user_role' | 'time_range'
  operator: 'equals' | 'contains' | 'not_equals' | 'greater_than' | 'less_than'
  value: string | number
}

interface ApprovalWorkflow {
  id: string
  name: string
  description: string
  steps: ApprovalStep[]
  isActive: boolean
  isDefault: boolean
  conditions: ApprovalCondition[]
  createdBy: string
  createdAt: string
  stats: {
    totalProcessed: number
    averageTime: number // hours
    approvalRate: number // percentage
  }
}

const mockUsers: ApprovalUser[] = [
  {
    id: 'user-1',
    name: 'Sarah Chen',
    email: 'sarah@company.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    role: 'Marketing Director'
  },
  {
    id: 'user-2',
    name: 'Marcus Rodriguez',
    email: 'marcus@company.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    role: 'Content Manager'
  },
  {
    id: 'user-3',
    name: 'Emma Thompson',
    email: 'emma@company.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    role: 'Social Media Specialist'
  },
  {
    id: 'user-4',
    name: 'David Kim',
    email: 'david@company.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: 'Brand Manager'
  }
]

const defaultWorkflows: ApprovalWorkflow[] = [
  {
    id: 'workflow-1',
    name: 'Standard Content Review',
    description: 'Default workflow for all content requiring approval',
    isActive: true,
    isDefault: true,
    conditions: [],
    createdBy: 'user-1',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    stats: {
      totalProcessed: 47,
      averageTime: 4.2,
      approvalRate: 87
    },
    steps: [
      {
        id: 'step-1',
        name: 'Content Review',
        description: 'Initial content quality and brand compliance check',
        approvers: [mockUsers[1], mockUsers[2]],
        requiredApprovals: 1,
        autoApprove: false,
        deadline: 24,
        conditions: []
      },
      {
        id: 'step-2',
        name: 'Final Approval',
        description: 'Final sign-off before publishing',
        approvers: [mockUsers[0]],
        requiredApprovals: 1,
        autoApprove: false,
        deadline: 12,
        conditions: []
      }
    ]
  },
  {
    id: 'workflow-2',
    name: 'High-Impact Campaign',
    description: 'Enhanced workflow for important campaigns and announcements',
    isActive: true,
    isDefault: false,
    conditions: [
      { type: 'content_type', operator: 'equals', value: 'campaign' }
    ],
    createdBy: 'user-1',
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    stats: {
      totalProcessed: 12,
      averageTime: 8.5,
      approvalRate: 92
    },
    steps: [
      {
        id: 'step-1',
        name: 'Legal Review',
        description: 'Compliance and legal requirements check',
        approvers: [mockUsers[3]],
        requiredApprovals: 1,
        autoApprove: false,
        deadline: 48
      },
      {
        id: 'step-2',
        name: 'Brand Review',
        description: 'Brand consistency and messaging alignment',
        approvers: [mockUsers[1], mockUsers[3]],
        requiredApprovals: 2,
        autoApprove: false,
        deadline: 24
      },
      {
        id: 'step-3',
        name: 'Executive Approval',
        description: 'Final approval from marketing leadership',
        approvers: [mockUsers[0]],
        requiredApprovals: 1,
        autoApprove: false,
        deadline: 12
      }
    ]
  }
]

export function ApprovalWorkflowManager() {
  const [workflows, setWorkflows] = useKV<ApprovalWorkflow[]>('approval-workflows', defaultWorkflows)
  const [editingWorkflow, setEditingWorkflow] = useState<ApprovalWorkflow | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [selectedTab, setSelectedTab] = useState('overview')

  const createNewWorkflow = () => {
    const newWorkflow: ApprovalWorkflow = {
      id: `workflow-${Date.now()}`,
      name: 'New Workflow',
      description: '',
      steps: [],
      isActive: false,
      isDefault: false,
      conditions: [],
      createdBy: 'current-user',
      createdAt: new Date().toISOString(),
      stats: {
        totalProcessed: 0,
        averageTime: 0,
        approvalRate: 0
      }
    }
    setEditingWorkflow(newWorkflow)
    setIsCreating(true)
  }

  const saveWorkflow = (workflow: ApprovalWorkflow) => {
    if (isCreating) {
      setWorkflows(prev => [...prev, workflow])
      toast.success('Workflow created successfully')
    } else {
      setWorkflows(prev => prev.map(w => w.id === workflow.id ? workflow : w))
      toast.success('Workflow updated successfully')
    }
    setEditingWorkflow(null)
    setIsCreating(false)
  }

  const deleteWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.filter(w => w.id !== workflowId))
    toast.success('Workflow deleted')
  }

  const duplicateWorkflow = (workflow: ApprovalWorkflow) => {
    const duplicated: ApprovalWorkflow = {
      ...workflow,
      id: `workflow-${Date.now()}`,
      name: `${workflow.name} (Copy)`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      stats: {
        totalProcessed: 0,
        averageTime: 0,
        approvalRate: 0
      }
    }
    setWorkflows(prev => [...prev, duplicated])
    toast.success('Workflow duplicated')
  }

  const toggleWorkflowStatus = (workflowId: string) => {
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId ? { ...w, isActive: !w.isActive } : w
    ))
  }

  const setDefaultWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.map(w => ({
      ...w,
      isDefault: w.id === workflowId
    })))
    toast.success('Default workflow updated')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Approval Workflows</h2>
          <p className="text-muted-foreground">
            Manage content approval processes and automation rules
          </p>
        </div>
        <Button onClick={createNewWorkflow}>
          <Plus size={16} className="mr-2" />
          Create Workflow
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Workflows</p>
                    <p className="text-2xl font-bold">
                      {workflows.filter(w => w.isActive).length}
                    </p>
                  </div>
                  <Settings className="text-blue-500" size={24} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Approval Time</p>
                    <p className="text-2xl font-bold">
                      {workflows.reduce((acc, w) => acc + w.stats.averageTime, 0) / workflows.length || 0}h
                    </p>
                  </div>
                  <Clock className="text-orange-500" size={24} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Approval Rate</p>
                    <p className="text-2xl font-bold">
                      {Math.round(workflows.reduce((acc, w) => acc + w.stats.approvalRate, 0) / workflows.length || 0)}%
                    </p>
                  </div>
                  <CheckCircle className="text-green-500" size={24} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Processed</p>
                    <p className="text-2xl font-bold">
                      {workflows.reduce((acc, w) => acc + w.stats.totalProcessed, 0)}
                    </p>
                  </div>
                  <Users className="text-purple-500" size={24} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Approval Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: '1',
                    type: 'approved',
                    content: 'Product Launch Post',
                    user: 'Sarah Chen',
                    workflow: 'Standard Content Review',
                    time: '2 hours ago'
                  },
                  {
                    id: '2',
                    type: 'pending',
                    content: 'Holiday Campaign',
                    user: 'Marcus Rodriguez',
                    workflow: 'High-Impact Campaign',
                    time: '4 hours ago'
                  },
                  {
                    id: '3',
                    type: 'rejected',
                    content: 'Weekly Newsletter',
                    user: 'Emma Thompson',
                    workflow: 'Standard Content Review',
                    time: '6 hours ago'
                  }
                ].map(activity => (
                  <div key={activity.id} className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {activity.type === 'approved' && <CheckCircle className="text-green-500" size={20} />}
                      {activity.type === 'pending' && <Clock className="text-orange-500" size={20} />}
                      {activity.type === 'rejected' && <XCircle className="text-red-500" size={20} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{activity.content}</span>
                        <Badge variant="secondary" className="text-xs">
                          {activity.workflow}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {activity.type === 'approved' && 'Approved'}
                        {activity.type === 'pending' && 'Pending approval'}
                        {activity.type === 'rejected' && 'Rejected'} by {activity.user} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <div className="grid gap-4">
            {workflows.map(workflow => (
              <Card key={workflow.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {workflow.name}
                          {workflow.isDefault && (
                            <Badge variant="secondary">Default</Badge>
                          )}
                          {!workflow.isActive && (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {workflow.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={workflow.isActive}
                        onCheckedChange={() => toggleWorkflowStatus(workflow.id)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingWorkflow(workflow)}
                      >
                        <Edit3 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => duplicateWorkflow(workflow)}
                      >
                        <Copy size={16} />
                      </Button>
                      {!workflow.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteWorkflow(workflow.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Workflow Steps */}
                    <div>
                      <h4 className="font-medium mb-3">Approval Steps</h4>
                      <div className="space-y-3">
                        {workflow.steps.map((step, index) => (
                          <div key={step.id} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">{step.name}</span>
                                {step.deadline && (
                                  <Badge variant="outline" className="text-xs">
                                    {step.deadline}h deadline
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">
                                {step.description}
                              </p>
                              <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                  {step.approvers.slice(0, 3).map(approver => (
                                    <Avatar key={approver.id} className="w-6 h-6 border-2 border-background">
                                      <AvatarImage src={approver.avatar} alt={approver.name} />
                                      <AvatarFallback className="text-xs">
                                        {approver.name[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                  ))}
                                  {step.approvers.length > 3 && (
                                    <div className="w-6 h-6 bg-muted border-2 border-background rounded-full flex items-center justify-center text-xs">
                                      +{step.approvers.length - 3}
                                    </div>
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  Requires {step.requiredApprovals} approval{step.requiredApprovals !== 1 ? 's' : ''}
                                </span>
                              </div>
                            </div>
                            {index < workflow.steps.length - 1 && (
                              <ArrowDown className="text-muted-foreground mt-2" size={16} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Workflow Stats */}
                    <div>
                      <h4 className="font-medium mb-3">Performance</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Total Processed</span>
                          <span className="font-medium">{workflow.stats.totalProcessed}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Average Time</span>
                          <span className="font-medium">{workflow.stats.averageTime}h</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Approval Rate</span>
                          <span className="font-medium">{workflow.stats.approvalRate}%</span>
                        </div>
                      </div>

                      {!workflow.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-4"
                          onClick={() => setDefaultWorkflow(workflow.id)}
                        >
                          Set as Default
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflows.map(workflow => (
                    <div key={workflow.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{workflow.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {workflow.stats.approvalRate}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${workflow.stats.approvalRate}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bottleneck Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                    <AlertTriangle className="text-red-500" size={20} />
                    <div>
                      <p className="text-sm font-medium">Step 2: Final Approval</p>
                      <p className="text-xs text-muted-foreground">
                        Average delay: 18h (exceeds 12h target)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                    <Clock className="text-yellow-500" size={20} />
                    <div>
                      <p className="text-sm font-medium">Step 1: Content Review</p>
                      <p className="text-xs text-muted-foreground">
                        Average delay: 8h (within 24h target)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Workflow Editor Dialog */}
      {editingWorkflow && (
        <WorkflowEditor
          workflow={editingWorkflow}
          users={mockUsers}
          onSave={saveWorkflow}
          onCancel={() => {
            setEditingWorkflow(null)
            setIsCreating(false)
          }}
        />
      )}
    </div>
  )
}

// Workflow Editor Component
function WorkflowEditor({ 
  workflow, 
  users, 
  onSave, 
  onCancel 
}: {
  workflow: ApprovalWorkflow
  users: ApprovalUser[]
  onSave: (workflow: ApprovalWorkflow) => void
  onCancel: () => void
}) {
  const [editedWorkflow, setEditedWorkflow] = useState<ApprovalWorkflow>(workflow)

  const addStep = () => {
    const newStep: ApprovalStep = {
      id: `step-${Date.now()}`,
      name: 'New Step',
      description: '',
      approvers: [],
      requiredApprovals: 1,
      autoApprove: false,
      deadline: 24
    }
    setEditedWorkflow(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }))
  }

  const updateStep = (stepId: string, updates: Partial<ApprovalStep>) => {
    setEditedWorkflow(prev => ({
      ...prev,
      steps: prev.steps.map(step =>
        step.id === stepId ? { ...step, ...updates } : step
      )
    }))
  }

  const removeStep = (stepId: string) => {
    setEditedWorkflow(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== stepId)
    }))
  }

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {workflow.id.startsWith('workflow-') ? 'Create' : 'Edit'} Approval Workflow
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Workflow Name</Label>
                <Input
                  id="name"
                  value={editedWorkflow.name}
                  onChange={(e) => setEditedWorkflow(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={editedWorkflow.isActive}
                    onCheckedChange={(checked) => setEditedWorkflow(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="default"
                    checked={editedWorkflow.isDefault}
                    onCheckedChange={(checked) => setEditedWorkflow(prev => ({ ...prev, isDefault: checked }))}
                  />
                  <Label htmlFor="default">Default</Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={editedWorkflow.description}
                onChange={(e) => setEditedWorkflow(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe when this workflow should be used..."
              />
            </div>

            {/* Steps */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Approval Steps</Label>
                <Button size="sm" onClick={addStep}>
                  <Plus size={16} className="mr-2" />
                  Add Step
                </Button>
              </div>

              <div className="space-y-4">
                {editedWorkflow.steps.map((step, index) => (
                  <Card key={step.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                          <Input
                            value={step.name}
                            onChange={(e) => updateStep(step.id, { name: e.target.value })}
                            className="font-medium"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStep(step.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Description</Label>
                          <Input
                            value={step.description || ''}
                            onChange={(e) => updateStep(step.id, { description: e.target.value })}
                            placeholder="Step description..."
                          />
                        </div>
                        <div>
                          <Label>Deadline (hours)</Label>
                          <Input
                            type="number"
                            value={step.deadline || ''}
                            onChange={(e) => updateStep(step.id, { deadline: parseInt(e.target.value) || undefined })}
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <Label>Required Approvals: {step.requiredApprovals}</Label>
                        <Input
                          type="range"
                          min="1"
                          max={step.approvers.length || 1}
                          value={step.requiredApprovals}
                          onChange={(e) => updateStep(step.id, { requiredApprovals: parseInt(e.target.value) })}
                          className="mt-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => onSave(editedWorkflow)}>
            Save Workflow
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}