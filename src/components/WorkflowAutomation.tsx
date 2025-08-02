import { useState } from 'react'
import { Post, Platform, PostStatus, UserRole } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Workflow, 
  Plus, 
  Play, 
  Pause, 
  Settings,
  CheckCircle,
  Clock,
  Users,
  MessageCircle,
  Zap,
  ArrowRight,
  Edit,
  Trash2,
  Copy
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'

interface WorkflowTrigger {
  type: 'post_created' | 'post_approved' | 'post_rejected' | 'comment_added' | 'schedule_reached'
  conditions: {
    platform?: Platform[]
    status?: PostStatus[]
    author?: string[]
    hasMedia?: boolean
    contentKeywords?: string[]
  }
}

interface WorkflowAction {
  type: 'assign_reviewer' | 'send_notification' | 'auto_approve' | 'schedule_post' | 'add_comment' | 'move_to_status'
  params: {
    assignTo?: string
    message?: string
    scheduleDelay?: number // minutes
    status?: PostStatus
    comment?: string
  }
}

interface WorkflowRule {
  id: string
  name: string
  description: string
  enabled: boolean
  trigger: WorkflowTrigger
  actions: WorkflowAction[]
  createdAt: string
  lastRun: string | null
  runCount: number
}

interface WorkflowExecution {
  id: string
  ruleId: string
  postId: string
  status: 'running' | 'completed' | 'failed'
  startedAt: string
  completedAt: string | null
  error?: string
}

const sampleWorkflows: WorkflowRule[] = [
  {
    id: 'workflow-1',
    name: 'Auto-assign LinkedIn posts',
    description: 'Automatically assign all LinkedIn posts to the social media manager for review',
    enabled: true,
    trigger: {
      type: 'post_created',
      conditions: {
        platform: ['linkedin'],
        status: ['draft']
      }
    },
    actions: [
      {
        type: 'assign_reviewer',
        params: {
          assignTo: 'user-2',
          message: 'New LinkedIn post ready for review'
        }
      },
      {
        type: 'send_notification',
        params: {
          message: 'LinkedIn post assigned for review'
        }
      }
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    lastRun: new Date(Date.now() - 3600000).toISOString(),
    runCount: 15
  },
  {
    id: 'workflow-2',
    name: 'Auto-approve simple posts',
    description: 'Automatically approve posts without media from trusted authors',
    enabled: true,
    trigger: {
      type: 'post_created',
      conditions: {
        hasMedia: false,
        author: ['user-1', 'user-2']
      }
    },
    actions: [
      {
        type: 'auto_approve',
        params: {}
      },
      {
        type: 'add_comment',
        params: {
          comment: 'Auto-approved based on author trust level and content simplicity'
        }
      }
    ],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    lastRun: new Date(Date.now() - 7200000).toISOString(),
    runCount: 8
  },
  {
    id: 'workflow-3',
    name: 'Schedule approved posts',
    description: 'Automatically schedule approved posts for optimal engagement times',
    enabled: false,
    trigger: {
      type: 'post_approved',
      conditions: {}
    },
    actions: [
      {
        type: 'schedule_post',
        params: {
          scheduleDelay: 60 // 1 hour delay
        }
      }
    ],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    lastRun: null,
    runCount: 0
  }
]

interface WorkflowAutomationProps {
  posts: Post[]
  onUpdatePost: (postId: string, updates: Partial<Post>) => void
}

export function WorkflowAutomation({ posts, onUpdatePost }: WorkflowAutomationProps) {
  const [workflows, setWorkflows] = useKV<WorkflowRule[]>('workflows', sampleWorkflows)
  const [executions, setExecutions] = useKV<WorkflowExecution[]>('workflow-executions', [])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingWorkflow, setEditingWorkflow] = useState<WorkflowRule | null>(null)
  const [newWorkflow, setNewWorkflow] = useState<Partial<WorkflowRule>>({
    name: '',
    description: '',
    enabled: true,
    trigger: {
      type: 'post_created',
      conditions: {}
    },
    actions: []
  })

  const toggleWorkflow = (workflowId: string) => {
    setWorkflows(current =>
      current.map(workflow =>
        workflow.id === workflowId 
          ? { ...workflow, enabled: !workflow.enabled }
          : workflow
      )
    )
    
    const workflow = workflows.find(w => w.id === workflowId)
    toast.success(`Workflow "${workflow?.name}" ${workflow?.enabled ? 'disabled' : 'enabled'}`)
  }

  const duplicateWorkflow = (workflow: WorkflowRule) => {
    const duplicated: WorkflowRule = {
      ...workflow,
      id: `workflow-${Date.now()}`,
      name: `${workflow.name} (Copy)`,
      enabled: false,
      createdAt: new Date().toISOString(),
      lastRun: null,
      runCount: 0
    }
    
    setWorkflows(current => [...current, duplicated])
    toast.success('Workflow duplicated')
  }

  const deleteWorkflow = (workflowId: string) => {
    if (confirm('Are you sure you want to delete this workflow?')) {
      setWorkflows(current => current.filter(w => w.id !== workflowId))
      toast.success('Workflow deleted')
    }
  }

  const executeWorkflow = async (workflow: WorkflowRule, post: Post) => {
    const executionId = `exec-${Date.now()}`
    
    const execution: WorkflowExecution = {
      id: executionId,
      ruleId: workflow.id,
      postId: post.id,
      status: 'running',
      startedAt: new Date().toISOString(),
      completedAt: null
    }
    
    setExecutions(current => [...current, execution])
    
    try {
      // Simulate workflow execution
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Execute actions
      for (const action of workflow.actions) {
        switch (action.type) {
          case 'auto_approve':
            onUpdatePost(post.id, { status: 'approved' })
            break
          case 'move_to_status':
            if (action.params.status) {
              onUpdatePost(post.id, { status: action.params.status })
            }
            break
          case 'assign_reviewer':
            // In a real app, this would assign the post to a specific reviewer
            break
          case 'send_notification':
            toast.info(action.params.message || 'Workflow notification')
            break
          case 'add_comment':
            // In a real app, this would add a comment to the post
            break
          case 'schedule_post':
            if (action.params.scheduleDelay) {
              const scheduleTime = new Date(Date.now() + action.params.scheduleDelay * 60000)
              onUpdatePost(post.id, { scheduledDate: scheduleTime.toISOString() })
            }
            break
        }
      }
      
      // Update execution status
      setExecutions(current =>
        current.map(exec =>
          exec.id === executionId
            ? { ...exec, status: 'completed', completedAt: new Date().toISOString() }
            : exec
        )
      )
      
      // Update workflow stats
      setWorkflows(current =>
        current.map(w =>
          w.id === workflow.id
            ? { ...w, lastRun: new Date().toISOString(), runCount: w.runCount + 1 }
            : w
        )
      )
      
      toast.success(`Workflow "${workflow.name}" executed successfully`)
    } catch (error) {
      setExecutions(current =>
        current.map(exec =>
          exec.id === executionId
            ? { ...exec, status: 'failed', completedAt: new Date().toISOString(), error: String(error) }
            : exec
        )
      )
      
      toast.error(`Workflow "${workflow.name}" failed to execute`)
    }
  }

  const testWorkflow = (workflow: WorkflowRule) => {
    // Find a suitable post to test with
    const testPost = posts.find(post => {
      const conditions = workflow.trigger.conditions
      
      if (conditions.platform && !conditions.platform.includes(post.platform)) return false
      if (conditions.status && !conditions.status.includes(post.status)) return false
      if (conditions.hasMedia !== undefined && Boolean(post.mediaUrl) !== conditions.hasMedia) return false
      
      return true
    })
    
    if (!testPost) {
      toast.error('No suitable posts found for testing this workflow')
      return
    }
    
    executeWorkflow(workflow, testPost)
  }

  const createWorkflow = () => {
    if (!newWorkflow.name || !newWorkflow.description) {
      toast.error('Please fill in all required fields')
      return
    }
    
    const workflow: WorkflowRule = {
      id: `workflow-${Date.now()}`,
      name: newWorkflow.name,
      description: newWorkflow.description,
      enabled: newWorkflow.enabled || false,
      trigger: newWorkflow.trigger || { type: 'post_created', conditions: {} },
      actions: newWorkflow.actions || [],
      createdAt: new Date().toISOString(),
      lastRun: null,
      runCount: 0
    }
    
    setWorkflows(current => [...current, workflow])
    setShowCreateDialog(false)
    setNewWorkflow({
      name: '',
      description: '',
      enabled: true,
      trigger: { type: 'post_created', conditions: {} },
      actions: []
    })
    
    toast.success('Workflow created successfully')
  }

  const activeWorkflows = workflows.filter(w => w.enabled).length
  const totalExecutions = executions.length
  const successRate = executions.length > 0 
    ? (executions.filter(e => e.status === 'completed').length / executions.length) * 100
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Workflow size={32} className="text-blue-600" />
            Workflow Automation
          </h1>
          <p className="text-muted-foreground">Automate your content approval and publishing workflows</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Create Workflow
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Workflow</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Workflow Name</Label>
                <Input
                  placeholder="e.g., Auto-approve team posts"
                  value={newWorkflow.name || ''}
                  onChange={(e) => setNewWorkflow(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe what this workflow does..."
                  value={newWorkflow.description || ''}
                  onChange={(e) => setNewWorkflow(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={newWorkflow.enabled || false}
                  onCheckedChange={(enabled) => setNewWorkflow(prev => ({ ...prev, enabled }))}
                />
                <Label>Enable immediately</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={createWorkflow}>
                  Create Workflow
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Workflows</p>
                <div className="text-2xl font-bold">{activeWorkflows}</div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Workflow size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Executions</p>
                <div className="text-2xl font-bold">{totalExecutions}</div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Play size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <div className="text-2xl font-bold">{successRate.toFixed(1)}%</div>
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
                <p className="text-sm font-medium text-muted-foreground">Time Saved</p>
                <div className="text-2xl font-bold">2.4h</div>
                <p className="text-xs text-muted-foreground">this week</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock size={24} className="text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflows List */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workflows.map(workflow => (
              <div key={workflow.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{workflow.name}</h4>
                      <Badge variant={workflow.enabled ? 'default' : 'secondary'}>
                        {workflow.enabled ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {workflow.runCount} runs
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {workflow.description}
                    </p>
                    
                    {/* Workflow Steps Visualization */}
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline" className="bg-blue-50">
                        {workflow.trigger.type.replace('_', ' ')}
                      </Badge>
                      <ArrowRight size={16} className="text-muted-foreground" />
                      <div className="flex items-center gap-1">
                        {workflow.actions.map((action, index) => (
                          <Badge key={index} variant="outline" className="bg-green-50">
                            {action.type.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={workflow.enabled}
                      onCheckedChange={() => toggleWorkflow(workflow.id)}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testWorkflow(workflow)}
                      disabled={!workflow.enabled}
                    >
                      <Play size={14} className="mr-1" />
                      Test
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => duplicateWorkflow(workflow)}
                    >
                      <Copy size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingWorkflow(workflow)}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteWorkflow(workflow.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
                
                {workflow.lastRun && (
                  <div className="text-xs text-muted-foreground">
                    Last run: {new Date(workflow.lastRun).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
            
            {workflows.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Workflow size={48} className="mx-auto mb-4 opacity-50" />
                <div className="text-lg font-medium mb-2">No workflows created</div>
                <div className="text-sm">Create your first workflow to automate repetitive tasks</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Executions */}
      {executions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Executions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {executions.slice(-5).reverse().map(execution => {
                const workflow = workflows.find(w => w.id === execution.ruleId)
                const post = posts.find(p => p.id === execution.postId)
                
                return (
                  <div key={execution.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{workflow?.name}</span>
                        <Badge
                          variant={
                            execution.status === 'completed' ? 'default' :
                            execution.status === 'failed' ? 'destructive' :
                            'secondary'
                          }
                        >
                          {execution.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Post: {post?.content.slice(0, 50)}...
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(execution.startedAt).toLocaleString()}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}