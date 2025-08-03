import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, Pause, Heart, Star, Download, Upload, Search, Filter, Sort, 
  Bell, Settings, User, Mail, Phone, Calendar, Clock, MapPin,
  Trash2, Edit, Copy, Share, Eye, EyeOff, Lock, Unlock,
  CheckCircle, XCircle, AlertCircle, Info, Lightbulb, Zap,
  TrendingUp, TrendingDown, BarChart, PieChart, Activity,
  Home, Grid, List, Folder, File, Image, Video, Music
} from 'lucide-react';
import { AnimatedIcon, IconPresets } from '@/components/ui/animated-icon';
import { ThemedIcon, IconThemeSelector, useIconTheme } from '@/components/ui/icon-theme-system';
import { AccessibleIcon, IconGroup } from '@/components/ui/accessible-icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

export function IconShowcase() {
  const [selectedDemo, setSelectedDemo] = useState('animations');
  const [enableAnimations, setEnableAnimations] = useState(true);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const { theme } = useIconTheme();

  const animationDemos = [
    { icon: Play, animation: 'pulse' as const, label: 'Pulse Animation' },
    { icon: Heart, animation: 'bounce' as const, label: 'Bounce Animation' },
    { icon: Star, animation: 'rotate' as const, label: 'Rotate Animation' },
    { icon: Download, animation: 'scale' as const, label: 'Scale Animation' },
    { icon: Upload, animation: 'slide' as const, label: 'Slide Animation' },
    { icon: Bell, animation: 'shake' as const, label: 'Shake Animation' },
    { icon: Lightbulb, animation: 'glow' as const, label: 'Glow Animation' },
    { icon: Zap, animation: 'flip' as const, label: 'Flip Animation' },
  ];

  const presetDemos = [
    { component: IconPresets.Loading, icon: Settings, label: 'Loading Preset' },
    { component: IconPresets.Notification, icon: Bell, label: 'Notification Preset' },
    { component: IconPresets.Success, icon: CheckCircle, label: 'Success Preset' },
    { component: IconPresets.Warning, icon: AlertCircle, label: 'Warning Preset' },
    { component: IconPresets.Interactive, icon: User, label: 'Interactive Preset' },
    { component: IconPresets.Magic, icon: Zap, label: 'Magic Preset' },
    { component: IconPresets.Floating, icon: Star, label: 'Floating Preset' },
  ];

  const accessibilityDemos = [
    { icon: Home, variant: 'button' as const, label: 'Home Button', description: 'Navigate to home page' },
    { icon: Search, variant: 'navigation' as const, label: 'Search', description: 'Search through content' },
    { icon: Settings, variant: 'button' as const, label: 'Settings', description: 'Open application settings', badge: '3' },
    { icon: Mail, variant: 'status' as const, label: 'Unread Messages', description: '5 unread messages', badge: '5' },
    { icon: Calendar, variant: 'navigation' as const, label: 'Calendar View', description: 'Switch to calendar view' },
    { icon: Bell, variant: 'button' as const, label: 'Notifications', description: 'View notifications', badge: '12' },
  ];

  const statusVariants = [
    { variant: 'default' as const, label: 'Default', color: 'text-foreground' },
    { variant: 'primary' as const, label: 'Primary', color: 'text-primary' },
    { variant: 'secondary' as const, label: 'Secondary', color: 'text-secondary-foreground' },
    { variant: 'success' as const, label: 'Success', color: 'text-green-600' },
    { variant: 'warning' as const, label: 'Warning', color: 'text-yellow-600' },
    { variant: 'destructive' as const, label: 'Destructive', color: 'text-destructive' },
    { variant: 'muted' as const, label: 'Muted', color: 'text-muted-foreground' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Icon System Showcase</h2>
          <p className="text-muted-foreground">
            Professional icon animations, theming, and accessibility features
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch 
              checked={enableAnimations} 
              onCheckedChange={setEnableAnimations}
              id="animations-toggle"
            />
            <label htmlFor="animations-toggle" className="text-sm">
              Enable Animations
            </label>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch 
              checked={showAccessibility} 
              onCheckedChange={setShowAccessibility}
              id="accessibility-toggle"
            />
            <label htmlFor="accessibility-toggle" className="text-sm">
              Show Accessibility Features
            </label>
          </div>
        </div>
      </div>

      <Tabs value={selectedDemo} onValueChange={setSelectedDemo} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="animations">Animations</TabsTrigger>
          <TabsTrigger value="themes">Themes</TabsTrigger>
          <TabsTrigger value="presets">Presets</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
        </TabsList>

        <TabsContent value="animations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AnimatedIcon icon={Play} animation="pulse" trigger="always" size={20} />
                Animation Showcase
              </CardTitle>
              <CardDescription>
                Various animation presets with different intensities and triggers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {animationDemos.map(({ icon, animation, label }) => (
                  <div key={label} className="text-center space-y-3">
                    <div className="flex justify-center">
                      <AnimatedIcon
                        icon={icon}
                        animation={enableAnimations ? animation : 'none'}
                        trigger="always"
                        size={32}
                        intensity="normal"
                        className="text-primary"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{label}</div>
                      <Badge variant="outline" className="text-xs mt-1">
                        {animation}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Animation Intensities</CardTitle>
              <CardDescription>Same animation with different intensity levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center gap-8">
                {(['subtle', 'normal', 'strong'] as const).map(intensity => (
                  <div key={intensity} className="text-center space-y-3">
                    <div className="flex justify-center">
                      <AnimatedIcon
                        icon={Heart}
                        animation={enableAnimations ? 'bounce' : 'none'}
                        trigger="always"
                        intensity={intensity}
                        size={32}
                        className="text-red-500"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-sm capitalize">{intensity}</div>
                      <Badge variant="secondary" className="text-xs">
                        Bounce
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="themes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ThemedIcon icon={Star} theme="gradient" size="sm" />
                Icon Theme System
              </CardTitle>
              <CardDescription>
                Current theme: <Badge variant="outline">{theme}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <IconThemeSelector />
              
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {[Settings, Bell, Heart, Star, Download, Calendar].map((Icon, index) => (
                  <div key={index} className="text-center space-y-2">
                    <div className="flex justify-center">
                      <ThemedIcon
                        icon={Icon}
                        size="lg"
                        animate={enableAnimations}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Icon.name || `Icon ${index + 1}`}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Color Variants</CardTitle>
              <CardDescription>Icons with different semantic colors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
                {statusVariants.map(({ variant, label, color }) => (
                  <div key={variant} className="text-center space-y-2">
                    <div className="flex justify-center">
                      <ThemedIcon
                        icon={CheckCircle}
                        variant={variant}
                        size="lg"
                        animate={enableAnimations}
                      />
                    </div>
                    <div>
                      <div className="text-xs font-medium">{label}</div>
                      <div className={cn("text-xs", color)}>●</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="presets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconPresets.Magic icon={Zap} size={20} />
                Icon Presets
              </CardTitle>
              <CardDescription>
                Pre-configured icons for common use cases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {presetDemos.map(({ component: PresetComponent, icon, label }) => (
                  <div key={label} className="text-center space-y-3">
                    <div className="flex justify-center">
                      <PresetComponent 
                        icon={icon} 
                        size={32}
                        className="text-primary"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{label}</div>
                      <Badge variant="outline" className="text-xs mt-1">
                        Preset
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interactive Examples</CardTitle>
              <CardDescription>Click or hover to see interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <AnimatedIcon 
                    icon={Download} 
                    animation="scale" 
                    trigger="hover" 
                    size={16}
                  />
                  Download
                </Button>
                
                <Button variant="outline" className="flex items-center gap-2">
                  <IconPresets.Loading icon={Settings} size={16} />
                  Loading...
                </Button>
                
                <Button variant="outline" className="flex items-center gap-2">
                  <IconPresets.Interactive icon={Heart} size={16} />
                  Like
                </Button>
                
                <Button variant="outline" className="flex items-center gap-2">
                  <IconPresets.Success icon={CheckCircle} size={16} />
                  Success
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AccessibleIcon 
                  icon={Eye} 
                  label="Accessibility" 
                  variant="decoration"
                  size={20}
                />
                Accessibility Features
              </CardTitle>
              <CardDescription>
                Icons with full accessibility support and ARIA attributes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {accessibilityDemos.map(({ icon, variant, label, description, badge }) => (
                  <div key={label} className="text-center space-y-3 p-4 border rounded-lg">
                    <div className="flex justify-center">
                      <AccessibleIcon
                        icon={icon}
                        label={label}
                        description={description}
                        variant={variant}
                        size={32}
                        badge={badge}
                        onClick={() => console.log(`${label} clicked`)}
                        focusVisible={showAccessibility}
                        highContrast={showAccessibility}
                      />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{label}</div>
                      <div className="text-xs text-muted-foreground">{description}</div>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {variant}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Icon Groups</CardTitle>
              <CardDescription>Logically grouped icons with ARIA labels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <IconGroup label="Navigation controls" orientation="horizontal" spacing="normal">
                <AccessibleIcon icon={Home} label="Home" variant="navigation" />
                <AccessibleIcon icon={Search} label="Search" variant="navigation" />
                <AccessibleIcon icon={Settings} label="Settings" variant="navigation" />
                <AccessibleIcon icon={User} label="Profile" variant="navigation" />
              </IconGroup>

              <IconGroup label="File actions" orientation="horizontal" spacing="normal">
                <AccessibleIcon icon={File} label="New file" variant="button" />
                <AccessibleIcon icon={Folder} label="Open folder" variant="button" />
                <AccessibleIcon icon={Copy} label="Copy" variant="button" />
                <AccessibleIcon icon={Trash2} label="Delete" variant="button" />
              </IconGroup>

              <IconGroup label="Media controls" orientation="horizontal" spacing="normal">
                <AccessibleIcon icon={Play} label="Play" variant="button" />
                <AccessibleIcon icon={Pause} label="Pause" variant="button" />
                <AccessibleIcon icon={Upload} label="Upload" variant="button" />
                <AccessibleIcon icon={Download} label="Download" variant="button" />
              </IconGroup>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}