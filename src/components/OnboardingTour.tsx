import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Sparkles, ArrowRight, ArrowLeft, X, CheckCircle } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'

interface OnboardingStep {
  id: string
  title: string
  description: string
  content: React.ReactNode
  target?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to ContentPlan!',
    description: 'Your collaborative content planning platform',
    content: (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Sparkles size={32} className="text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Plan, Create, and Collaborate</h3>
          <p className="text-muted-foreground">
            ContentPlan helps marketing teams and agencies streamline their social media content creation, 
            approval workflows, and publishing schedules across multiple platforms.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="font-medium">Multi-Platform</div>
            <div className="text-muted-foreground">Instagram, Twitter, LinkedIn, Facebook</div>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="font-medium">Real-time Collaboration</div>
            <div className="text-muted-foreground">Comments, approvals, mentions</div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'dashboard',
    title: 'Your Dashboard',
    description: 'Get an overview of your content pipeline',
    content: (
      <div className="space-y-4">
        <p>The Dashboard provides a comprehensive overview of:</p>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
            <span><strong>Content Metrics:</strong> Track posts by status, platform performance</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
            <span><strong>Recent Activity:</strong> See what your team has been working on</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
            <span><strong>Quick Actions:</strong> Jump into creating content or reviewing approvals</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
            <span><strong>Upcoming Schedule:</strong> Preview your next few scheduled posts</span>
          </li>
        </ul>
      </div>
    )
  },
  {
    id: 'content-creation',
    title: 'Creating Content',
    description: 'Learn how to create and edit posts',
    content: (
      <div className="space-y-4">
        <p>ContentPlan makes content creation simple and powerful:</p>
        <div className="grid gap-3">
          <div className="p-3 border rounded-lg">
            <div className="font-medium mb-1">Platform-Specific Optimization</div>
            <div className="text-sm text-muted-foreground">
              Character limits, hashtag suggestions, and preview modes for each platform
            </div>
          </div>
          <div className="p-3 border rounded-lg">
            <div className="font-medium mb-1">Rich Media Support</div>
            <div className="text-sm text-muted-foreground">
              Upload images, videos, and organize them in your media library
            </div>
          </div>
          <div className="p-3 border rounded-lg">
            <div className="font-medium mb-1">AI-Powered Assistance</div>
            <div className="text-sm text-muted-foreground">
              Get content suggestions, optimal posting times, and trend insights
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="text-sm font-medium text-blue-900">Pro Tip:</div>
          <div className="text-sm text-blue-700">
            Press <Badge variant="outline" className="mx-1">Cmd+N</Badge> anywhere to quickly create a new post!
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'collaboration',
    title: 'Team Collaboration',
    description: 'Work together seamlessly',
    content: (
      <div className="space-y-4">
        <p>Collaborate effectively with your team:</p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium">Comments & Mentions</div>
              <div className="text-sm text-muted-foreground">
                Add threaded comments and mention team members with @username
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium">Approval Workflows</div>
              <div className="text-sm text-muted-foreground">
                Set up custom approval processes with multiple reviewers
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium">Real-time Updates</div>
              <div className="text-sm text-muted-foreground">
                See who's online and working on content in real-time
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium">Client Portal</div>
              <div className="text-sm text-muted-foreground">
                Share content with clients for feedback without full access
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'keyboard-shortcuts',
    title: 'Power User Features',
    description: 'Become a ContentPlan pro',
    content: (
      <div className="space-y-4">
        <p>Master these powerful features to work faster:</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-2 bg-muted/50 rounded flex justify-between">
            <span>Command Palette</span>
            <Badge variant="outline">⌘K</Badge>
          </div>
          <div className="p-2 bg-muted/50 rounded flex justify-between">
            <span>New Post</span>
            <Badge variant="outline">⌘N</Badge>
          </div>
          <div className="p-2 bg-muted/50 rounded flex justify-between">
            <span>Settings</span>
            <Badge variant="outline">⌘,</Badge>
          </div>
          <div className="p-2 bg-muted/50 rounded flex justify-between">
            <span>Shortcuts</span>
            <Badge variant="outline">⌘/</Badge>
          </div>
        </div>
        <div className="space-y-2">
          <div className="font-medium">Advanced Features:</div>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Drag and drop posts in calendar view</li>
            <li>• Bulk operations for multiple posts</li>
            <li>• Custom workflow automation</li>
            <li>• Advanced analytics and reporting</li>
            <li>• API integrations for external tools</li>
          </ul>
        </div>
        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <div className="text-sm font-medium text-green-900">You're all set!</div>
          <div className="text-sm text-green-700">
            Start by creating your first post or exploring the dashboard.
          </div>
        </div>
      </div>
    )
  }
]

interface OnboardingTourProps {
  open: boolean
  onClose: () => void
  user?: any
  advancedMode?: boolean
}

export function OnboardingTour({ open, onClose, user, advancedMode = false }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [hasSeenOnboarding, setHasSeenOnboarding] = useKV('onboarding-completed', false)

  const currentStepData = onboardingSteps[currentStep]
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    setHasSeenOnboarding(true)
    onClose()
    setCurrentStep(0)
  }

  const handleSkip = () => {
    setHasSeenOnboarding(true)
    onClose()
    setCurrentStep(0)
  }

  if (hasSeenOnboarding && !open) return null

  return (
    <Dialog open={open || !hasSeenOnboarding} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl" hideCloseButton>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Sparkles size={20} className="text-primary" />
              {currentStepData.title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-muted-foreground hover:text-foreground"
            >
              Skip tour
              <X size={16} className="ml-1" />
            </Button>
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground">{currentStepData.description}</p>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Step {currentStep + 1} of {onboardingSteps.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </DialogHeader>

        <div className="py-6">
          {currentStepData.content}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Previous
          </Button>

          <div className="flex gap-2">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-primary'
                    : index < currentStep
                    ? 'bg-primary/50'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <Button onClick={handleNext} className="flex items-center gap-2">
            {currentStep === onboardingSteps.length - 1 ? (
              <>
                Get Started
                <CheckCircle size={16} />
              </>
            ) : (
              <>
                Next
                <ArrowRight size={16} />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}export default OnboardingTour
