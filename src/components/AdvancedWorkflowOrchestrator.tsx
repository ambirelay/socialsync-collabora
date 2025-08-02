import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Workflow, 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  Trash2,
  Copy,
  GitBranch,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Bot,
  Zap,
  Calendar,
  Target,
  Eye,
  Edit3,
  Save,
  MoreHorizontal,
  Filter,
  Search
} from '@phosphor-icons/react'
import { Post } from '@/types.ts'

interface AdvancedWorkflowOrchestratorProps {
  posts: Post[]
  onUpdateWorkflow?: (workflowId: string, updates: any) => void
  onExecuteWorkflow?: (workflowId: string) => void
}

interface WorkflowStep {
  id: string
  type: 'condition' | 'action' | 'delay' | 'approval' | 'notification'
  name: string
  description: string
  config: any
  position: { x: number; y: number }
  connections: string[]
}

interface Workflow {
  id: string
  name: string
  description: string
  status: 'active' | 'paused' | 'draft'
  trigger: string
  steps: WorkflowStep[]
  executions: number
  successRate: number
  lastRun: string
  category: string
  createdBy: string
  automationLevel: 'manual' | 'semi-auto' | 'full-auto'
}

export default function AdvancedWorkflowOrchestrator({ 
  posts, 
  onUpdateWorkflow,
  onExecuteWorkflow 
}: AdvancedWorkflowOrchestratorProps) {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Mock workflow data
  const workflows: Workflow[] = [
    {
      id: 'wf-1',
      name: 'Content Approval Pipeline',
      description: 'Automated content review and approval workflow for all social media posts',
      status: 'active',
      trigger: 'Post Created',
      steps: [
        {
          id: 'step-1',
          type: 'condition',
          name: 'Check Content Type',
          description: 'Route based on content type',
          config: { conditions: ['video', 'image', 'text'] },
          position: { x: 100, y: 100 },
          connections: ['step-2', 'step-3']
        },
        {
          id: 'step-2',
          type: 'approval',
          name: 'Manager Approval',
          description: 'Requires manager approval for video content',
          config: { approvers: ['manager@company.com'], timeout: 24 },
          position: { x: 200, y: 150 },
          connections: ['step-4']
        },
        {
          id: 'step-3',
          type: 'action',
          name: 'Auto-approve Text',
          description: 'Auto-approve text-only posts under 280 characters',
          config: { conditions: { maxLength: 280 } },
          position: { x: 200, y: 50 },
          connections: ['step-4']
        },
        {
          id: 'step-4',
          type: 'notification',
          name: 'Notify Team',
          description: 'Send notification to content team',
          config: { channels: ['slack', 'email'], template: 'approval-complete' },
          position: { x: 300, y: 100 },
          connections: []
        }
      ],
      executions: 156,
      successRate: 94.2,
      lastRun: '2024-03-15T10:30:00Z',
      category: 'Content Management',
      createdBy: 'Sarah Chen',
      automationLevel: 'semi-auto'
    },
    {
      id: 'wf-2',
      name: 'Smart Scheduling Optimizer',
      description: 'AI-powered scheduling based on audience engagement patterns and competitor analysis',
      status: 'active',
      trigger: 'Manual/Scheduled',
      steps: [
        {
          id: 'step-1',
          type: 'condition',
          name: 'Analyze Audience Data',
          description: 'Check optimal posting times for target audience',
          config: { platforms: ['instagram', 'twitter', 'linkedin'] },
          position: { x: 100, y: 100 },
          connections: ['step-2']
        },
        {
          id: 'step-2',
          type: 'action',
          name: 'AI Scheduling',
          description: 'Use AI to determine best posting schedule',
          config: { ai_model: 'engagement-optimizer', lookback_days: 30 },
          position: { x: 200, y: 100 },
          connections: ['step-3']
        },
        {
          id: 'step-3',
          type: 'action',
          name: 'Auto-schedule Posts',
          description: 'Schedule posts across platforms',
          config: { platforms: 'all', buffer_time: 15 },
          position: { x: 300, y: 100 },
          connections: []
        }
      ],
      executions: 43,
      successRate: 97.7,
      lastRun: '2024-03-15T08:00:00Z',
      category: 'Scheduling',
      createdBy: 'AI Assistant',
      automationLevel: 'full-auto'
    },
    {
      id: 'wf-3',
      name: 'Crisis Response Protocol',
      description: 'Emergency workflow for handling negative feedback and crisis communication',
      status: 'paused',
      trigger: 'Negative Sentiment Detected',
      steps: [
        {
          id: 'step-1',
          type: 'condition',
          name: 'Sentiment Analysis',
          description: 'Analyze severity of negative feedback',
          config: { threshold: -0.7, sources: ['comments', 'mentions', 'reviews'] },
          position: { x: 100, y: 100 },
          connections: ['step-2', 'step-3']
        },
        {
          id: 'step-2',
          type: 'notification',
          name: 'Alert Leadership',
          description: 'Immediate notification for severe issues',
          config: { urgency: 'high', recipients: ['leadership@company.com'] },
          position: { x: 200, y: 50 },
          connections: ['step-4']
        },
        {
          id: 'step-3',
          type: 'action',
          name: 'Auto-respond',
          description: 'Automated response for minor issues',
          config: { template: 'apologetic-professional', delay: 30 },
          position: { x: 200, y: 150 },
          connections: ['step-4']
        },
        {
          id: 'step-4',
          type: 'approval',
          name: 'Review Response',
          description: 'Human review of automated responses',
          config: { approvers: ['pr@company.com'], timeout: 2 },
          position: { x: 300, y: 100 },
          connections: []
        }
      ],
      executions: 12,
      successRate: 100,
      lastRun: '2024-03-10T14:22:00Z',
      category: 'Crisis Management',
      createdBy: 'Alex Thompson',
      automationLevel: 'semi-auto'
    }
  ]

  const workflowCategories = ['All', 'Content Management', 'Scheduling', 'Analytics', 'Crisis Management', 'Compliance']
  
  const filteredWorkflows = workflows.filter(workflow => {
    const matchesStatus = filterStatus === 'all' || workflow.status === filterStatus
    const matchesSearch = workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || workflow.category === selectedCategory
    
    return matchesStatus && matchesSearch && matchesCategory
  })

  const selectedWorkflowData = selectedWorkflow 
    ? workflows.find(w => w.id === selectedWorkflow)
    : null

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'condition': return <GitBranch size={16} />
      case 'action': return <Zap size={16} />
      case 'delay': return <Clock size={16} />
      case 'approval': return <Users size={16} />
      case 'notification': return <AlertCircle size={16} />
      default: return <Settings size={16} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Workflow className="text-primary" size={24} />
            Advanced Workflow Orchestrator
          </h2>
          <p className="text-muted-foreground mt-1">
            Design, automate, and manage complex content workflows with AI assistance
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Create Workflow
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search workflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {workflowCategories.map(category => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workflows List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredWorkflows.map((workflow) => (
            <Card 
              key={workflow.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedWorkflow === workflow.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedWorkflow(workflow.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{workflow.name}</h3>
                      <Badge className={getStatusColor(workflow.status)}>
                        {workflow.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {workflow.automationLevel}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {workflow.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Play size={14} />
                        <span>{workflow.executions} runs</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle size={14} />
                        <span>{workflow.successRate}% success</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>Last: {new Date(workflow.lastRun).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onExecuteWorkflow?.(workflow.id)
                      }}
                    >
                      <Play size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle edit
                      }}
                    >
                      <Edit3 size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle more options
                      }}
                    >
                      <MoreHorizontal size={14} />
                    </Button>
                  </div>
                </div>
                
                {/* Workflow Steps Preview */}
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-xs text-muted-foreground">Steps:</span>
                  {workflow.steps.slice(0, 4).map((step, index) => (
                    <div key={step.id} className="flex items-center gap-1">
                      <div className="flex items-center gap-1 bg-muted/30 rounded px-2 py-1">
                        {getStepIcon(step.type)}
                        <span className="text-xs">{step.name}</span>
                      </div>
                      {index < Math.min(workflow.steps.length, 4) - 1 && (
                        <ArrowRight size={12} className="text-muted-foreground" />
                      )}
                    </div>
                  ))}
                  {workflow.steps.length > 4 && (
                    <span className="text-xs text-muted-foreground">
                      +{workflow.steps.length - 4} more
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredWorkflows.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Workflow size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-medium mb-2">No workflows found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery || filterStatus !== 'all' || selectedCategory !== 'all'
                    ? 'Try adjusting your search filters'
                    : 'Create your first workflow to automate content processes'
                  }
                </p>
                <Button onClick={() => setIsCreating(true)}>
                  <Plus size={16} className="mr-2" />
                  Create Workflow
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Workflow Details Panel */}
        <div className="lg:col-span-1">
          {selectedWorkflowData ? (
            <div className="space-y-4">
              {/* Workflow Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {selectedWorkflowData.name}
                  </CardTitle>
                  <CardDescription>
                    {selectedWorkflowData.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Status</div>
                      <Badge className={getStatusColor(selectedWorkflowData.status)}>
                        {selectedWorkflowData.status}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Trigger</div>
                      <div className="font-medium">{selectedWorkflowData.trigger}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Executions</div>
                      <div className="font-medium">{selectedWorkflowData.executions}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Success Rate</div>
                      <div className="font-medium text-green-600">
                        {selectedWorkflowData.successRate}%
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Created by</div>
                    <div className="font-medium">{selectedWorkflowData.createdBy}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Category</div>
                    <Badge variant="secondary">{selectedWorkflowData.category}</Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => onExecuteWorkflow?.(selectedWorkflowData.id)}
                    >
                      <Play size={14} className="mr-1" />
                      Run Now
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit3 size={14} />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Workflow Steps */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Workflow Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedWorkflowData.steps.map((step, index) => (
                      <div key={step.id} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          {getStepIcon(step.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{step.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {step.description}
                          </div>
                          <Badge variant="outline" className="text-xs mt-1">
                            {step.type}
                          </Badge>
                        </div>
                        {index < selectedWorkflowData.steps.length - 1 && (
                          <div className="flex-shrink-0 w-px h-8 bg-border mt-8" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Avg. Execution Time</span>
                      <span className="font-medium">2.3 minutes</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cost per Run</span>
                      <span className="font-medium">$0.05</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Time Saved</span>
                      <span className="font-medium text-green-600">45 hours/month</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Eye size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-medium mb-2">Select a workflow</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a workflow from the list to view details and manage settings
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create Workflow Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Workflow</DialogTitle>
            <DialogDescription>
              Design a custom workflow to automate your content processes
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="workflow-name">Workflow Name</Label>
                <Input
                  id="workflow-name"
                  placeholder="e.g., Content Approval Process"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="workflow-category">Category</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {workflowCategories.slice(1).map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="workflow-description">Description</Label>
              <Textarea
                id="workflow-description"
                placeholder="Describe what this workflow does..."
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="workflow-trigger">Trigger Event</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="What starts this workflow?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="post-created">Post Created</SelectItem>
                  <SelectItem value="post-scheduled">Post Scheduled</SelectItem>
                  <SelectItem value="approval-requested">Approval Requested</SelectItem>
                  <SelectItem value="negative-sentiment">Negative Sentiment Detected</SelectItem>
                  <SelectItem value="manual">Manual Trigger</SelectItem>
                  <SelectItem value="scheduled">Scheduled Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch id="ai-assistance" />
                <Label htmlFor="ai-assistance">Enable AI Assistance</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="auto-execute" />
                <Label htmlFor="auto-execute">Auto-execute when triggered</Label>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Handle workflow creation
                setIsCreating(false)
              }}>
                Create & Design
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}export default AdvancedWorkflowOrchestrator
