import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, AlertTriangle, CheckCircle, FileText, Users, Lock, Eye, Clock, Database, Bug } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface ComplianceCheck {
  id: string
  category: 'privacy' | 'accessibility' | 'content' | 'legal' | 'security'
  title: string
  description: string
  status: 'passed' | 'warning' | 'failed'
  severity: 'low' | 'medium' | 'high' | 'critical'
  autoFixAvailable: boolean
  regulations: string[]
}

interface ComplianceReport {
  overall: 'compliant' | 'needs_review' | 'non_compliant'
  score: number
  lastChecked: Date
  checksPerformed: number
  issuesFound: number
  autoFixed: number
}

export function EnterpriseComplianceCenter({ posts, onComplianceCheck, onAutoRemediate }: any) {
  const [activeChecks, setActiveChecks] = useState<ComplianceCheck[]>([])
  const [complianceReport, setComplianceReport] = useState<ComplianceReport | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Mock compliance checks
  const mockChecks: ComplianceCheck[] = [
    {
      id: 'gdpr-1',
      category: 'privacy',
      title: 'GDPR Data Processing Notice',
      description: 'Content must include appropriate data processing notices when collecting user information',
      status: 'passed',
      severity: 'high',
      autoFixAvailable: true,
      regulations: ['GDPR', 'CCPA']
    },
    {
      id: 'ada-1',
      category: 'accessibility',
      title: 'Image Alt Text Compliance',
      description: '3 posts missing alt text descriptions for accessibility compliance',
      status: 'warning',
      severity: 'medium',
      autoFixAvailable: true,
      regulations: ['ADA', 'WCAG 2.1']
    },
    {
      id: 'content-1',
      category: 'content',
      title: 'Medical Claims Verification',
      description: 'Health-related content requires scientific backing and disclaimers',
      status: 'failed',
      severity: 'critical',
      autoFixAvailable: false,
      regulations: ['FDA', 'FTC']
    },
    {
      id: 'legal-1',
      category: 'legal',
      title: 'Influencer Disclosure',
      description: 'Sponsored content must include proper #ad or #sponsored disclosures',
      status: 'warning',
      severity: 'high',
      autoFixAvailable: true,
      regulations: ['FTC Guidelines', 'ASA Standards']
    },
    {
      id: 'security-1',
      category: 'security',
      title: 'Link Security Validation',
      description: 'All external links checked for malware and phishing threats',
      status: 'passed',
      severity: 'high',
      autoFixAvailable: false,
      regulations: ['Internal Security Policy']
    },
    {
      id: 'privacy-2',
      category: 'privacy',
      title: 'Child Safety Compliance',
      description: 'Content targeting minors requires additional privacy protections',
      status: 'warning',
      severity: 'critical',
      autoFixAvailable: true,
      regulations: ['COPPA', 'GDPR Article 8']
    }
  ]

  useEffect(() => {
    setActiveChecks(mockChecks)
    setComplianceReport({
      overall: 'needs_review',
      score: 78,
      lastChecked: new Date(),
      checksPerformed: mockChecks.length,
      issuesFound: mockChecks.filter(c => c.status !== 'passed').length,
      autoFixed: mockChecks.filter(c => c.autoFixAvailable && c.status !== 'passed').length
    })
  }, [])

  const runComplianceScan = async () => {
    setIsScanning(true)
    
    // Simulate scanning
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setIsScanning(false)
    toast.success('Compliance scan completed')
  }

  const autoFixIssues = async () => {
    const fixableIssues = activeChecks.filter(c => c.autoFixAvailable && c.status !== 'passed')
    
    for (const issue of fixableIssues) {
      onAutoRemediate(issue.id, {
        complianceFix: issue.title,
        category: issue.category
      })
    }
    
    // Update checks to show as fixed
    setActiveChecks(prev => prev.map(check => 
      check.autoFixAvailable && check.status !== 'passed' 
        ? { ...check, status: 'passed' as const }
        : check
    ))
    
    toast.success(`Auto-fixed ${fixableIssues.length} compliance issues`)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="text-green-500" size={20} />
      case 'warning': return <AlertTriangle className="text-yellow-500" size={20} />
      case 'failed': return <Bug className="text-red-500" size={20} />
      default: return <Clock className="text-gray-500" size={20} />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'privacy': return <Lock size={16} />
      case 'accessibility': return <Eye size={16} />
      case 'content': return <FileText size={16} />
      case 'legal': return <Shield size={16} />
      case 'security': return <Database size={16} />
      default: return <Shield size={16} />
    }
  }

  const filteredChecks = selectedCategory === 'all' 
    ? activeChecks 
    : activeChecks.filter(c => c.category === selectedCategory)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="text-primary" size={32} />
            Enterprise Compliance Center
          </h1>
          <p className="text-muted-foreground mt-2">
            Automated compliance monitoring and remediation across all regulations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={runComplianceScan}
            disabled={isScanning}
            variant="outline"
          >
            {isScanning ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full mr-2" />
                Scanning...
              </>
            ) : (
              <>
                <Shield size={16} className="mr-2" />
                Run Full Scan
              </>
            )}
          </Button>
          <Button
            onClick={autoFixIssues}
            disabled={!activeChecks.some(c => c.autoFixAvailable && c.status !== 'passed')}
          >
            <CheckCircle size={16} className="mr-2" />
            Auto-Fix Issues
          </Button>
        </div>
      </div>

      {/* Compliance Overview */}
      {complianceReport && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className={`${
            complianceReport.overall === 'compliant' ? 'border-green-200 bg-green-50/50' :
            complianceReport.overall === 'needs_review' ? 'border-yellow-200 bg-yellow-50/50' :
            'border-red-200 bg-red-50/50'
          }`}>
            <CardContent className="p-6 text-center">
              <div className={`text-3xl font-bold mb-2 ${
                complianceReport.overall === 'compliant' ? 'text-green-600' :
                complianceReport.overall === 'needs_review' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {complianceReport.score}%
              </div>
              <p className="text-sm text-muted-foreground">Overall Compliance Score</p>
              <Badge 
                variant={complianceReport.overall === 'compliant' ? 'default' : 'destructive'}
                className="mt-2"
              >
                {complianceReport.overall.replace('_', ' ').toUpperCase()}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {complianceReport.checksPerformed}
              </div>
              <p className="text-sm text-muted-foreground">Checks Performed</p>
              <p className="text-xs text-muted-foreground mt-1">
                Last scan: {complianceReport.lastChecked.toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {complianceReport.issuesFound}
              </div>
              <p className="text-sm text-muted-foreground">Issues Found</p>
              <p className="text-xs text-green-600 mt-1">
                {complianceReport.autoFixed} auto-fixable
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {posts.length}
              </div>
              <p className="text-sm text-muted-foreground">Content Items</p>
              <p className="text-xs text-muted-foreground mt-1">
                Under monitoring
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="checks" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="checks">Active Checks</TabsTrigger>
          <TabsTrigger value="regulations">Regulations</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="checks" className="space-y-4">
          {/* Category Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">Filter by category:</span>
            {['all', 'privacy', 'accessibility', 'content', 'legal', 'security'].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category !== 'all' && getCategoryIcon(category)}
                <span className="ml-1">{category}</span>
              </Button>
            ))}
          </div>

          {/* Compliance Checks */}
          <div className="space-y-3">
            {filteredChecks.map((check) => (
              <Card key={check.id} className="transition-all duration-200 hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(check.status)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{check.title}</h3>
                            <Badge variant="outline" className="flex items-center gap-1">
                              {getCategoryIcon(check.category)}
                              {check.category}
                            </Badge>
                            <Badge 
                              variant={
                                check.severity === 'critical' ? 'destructive' :
                                check.severity === 'high' ? 'destructive' :
                                check.severity === 'medium' ? 'default' : 'secondary'
                              }
                            >
                              {check.severity}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            {check.description}
                          </p>
                          
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-muted-foreground">Regulations:</span>
                            {check.regulations.map((reg) => (
                              <Badge key={reg} variant="outline" className="text-xs">
                                {reg}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          {check.autoFixAvailable && check.status !== 'passed' && (
                            <Button
                              size="sm"
                              onClick={() => {
                                onAutoRemediate(check.id, { fix: check.title })
                                toast.success('Issue auto-fixed')
                              }}
                            >
                              Auto-Fix
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="regulations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'GDPR', description: 'General Data Protection Regulation', status: 'active', coverage: 89 },
              { name: 'CCPA', description: 'California Consumer Privacy Act', status: 'active', coverage: 92 },
              { name: 'COPPA', description: 'Children\'s Online Privacy Protection Act', status: 'active', coverage: 95 },
              { name: 'ADA', description: 'Americans with Disabilities Act', status: 'active', coverage: 78 },
              { name: 'FTC Guidelines', description: 'Federal Trade Commission Guidelines', status: 'active', coverage: 85 },
              { name: 'SOX', description: 'Sarbanes-Oxley Act', status: 'monitoring', coverage: 70 }
            ].map((regulation) => (
              <Card key={regulation.name}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    {regulation.name}
                    <Badge variant={regulation.status === 'active' ? 'default' : 'secondary'}>
                      {regulation.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{regulation.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Coverage</span>
                      <span className="font-medium">{regulation.coverage}%</span>
                    </div>
                    <Progress value={regulation.coverage} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              Compliance reports are generated automatically and can be exported for audits.
              All reports include timestamps, check results, and remediation actions taken.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Daily Compliance Report', date: 'Today', issues: 3, status: 'needs_attention' },
              { title: 'Weekly Summary', date: 'This Week', issues: 12, status: 'under_review' },
              { title: 'Monthly Audit Report', date: 'January 2024', issues: 45, status: 'completed' },
              { title: 'Quarterly Assessment', date: 'Q4 2023', issues: 123, status: 'completed' }
            ].map((report) => (
              <Card key={report.title} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{report.title}</h3>
                    <Badge variant={report.status === 'completed' ? 'default' : 'secondary'}>
                      {report.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{report.date}</p>
                  <p className="text-sm">
                    <span className="font-medium">{report.issues}</span> issues identified
                  </p>
                  <Button size="sm" variant="outline" className="w-full mt-3">
                    <FileText size={14} className="mr-2" />
                    View Report
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Monitoring Settings</CardTitle>
              <CardDescription>
                Configure automated compliance checks and notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Scan Frequency</h4>
                  <div className="space-y-2">
                    {['Real-time', 'Hourly', 'Daily', 'Weekly'].map((freq) => (
                      <label key={freq} className="flex items-center gap-2">
                        <input type="radio" name="frequency" value={freq.toLowerCase()} />
                        <span className="text-sm">{freq}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Auto-remediation</h4>
                  <div className="space-y-2">
                    {['Low severity only', 'Medium and below', 'All issues', 'Manual only'].map((level) => (
                      <label key={level} className="flex items-center gap-2">
                        <input type="radio" name="remediation" value={level.toLowerCase()} />
                        <span className="text-sm">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default EnterpriseComplianceCenter
