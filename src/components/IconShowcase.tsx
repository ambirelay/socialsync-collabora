import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatedIcon, AnimatedIconPresets } from '@/components/ui/animated-icon-system';
import { EnhancedAnimatedIcon, EnhancedIconPresets } from '@/components/ui/enhanced-animated-icon';
import {
  Home, Settings, Bell, Calendar, Grid3X3, Users, BarChart3, 
  Plus, Heart, Star, MessageCircle, Share, ThumbsUp, 
  Eye, Edit, Trash2, Download, Upload, Search,
  Play, Pause, SkipForward, SkipBack, Volume2,
  Sun, Moon, Palette, Zap, Target, Sparkles,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown,
  CheckCircle, XCircle, AlertCircle, Info,
  Mail, Phone, MapPin, User, Lock, Unlock
} from 'lucide-react';

const iconList = [
  { icon: Home, name: 'Home', category: 'Navigation' },
  { icon: Settings, name: 'Settings', category: 'Navigation' },
  { icon: Bell, name: 'Bell', category: 'Communication' },
  { icon: Calendar, name: 'Calendar', category: 'Time' },
  { icon: Grid3X3, name: 'Grid', category: 'Layout' },
  { icon: Users, name: 'Users', category: 'Social' },
  { icon: BarChart3, name: 'Analytics', category: 'Data' },
  { icon: Plus, name: 'Plus', category: 'Actions' },
  { icon: Heart, name: 'Heart', category: 'Social' },
  { icon: Star, name: 'Star', category: 'Rating' },
  { icon: MessageCircle, name: 'Message', category: 'Communication' },
  { icon: Share, name: 'Share', category: 'Actions' },
  { icon: ThumbsUp, name: 'Like', category: 'Social' },
  { icon: Eye, name: 'View', category: 'Actions' },
  { icon: Edit, name: 'Edit', category: 'Actions' },
  { icon: Trash2, name: 'Delete', category: 'Actions' },
  { icon: Download, name: 'Download', category: 'Transfer' },
  { icon: Upload, name: 'Upload', category: 'Transfer' },
  { icon: Search, name: 'Search', category: 'Actions' },
  { icon: Play, name: 'Play', category: 'Media' },
  { icon: Pause, name: 'Pause', category: 'Media' },
  { icon: Volume2, name: 'Volume', category: 'Media' },
  { icon: Sun, name: 'Sun', category: 'Theme' },
  { icon: Moon, name: 'Moon', category: 'Theme' },
  { icon: Palette, name: 'Palette', category: 'Theme' },
  { icon: Zap, name: 'Energy', category: 'Status' },
  { icon: Target, name: 'Target', category: 'Goals' },
  { icon: Sparkles, name: 'Magic', category: 'Effects' },
  { icon: CheckCircle, name: 'Success', category: 'Status' },
  { icon: XCircle, name: 'Error', category: 'Status' },
  { icon: AlertCircle, name: 'Warning', category: 'Status' },
  { icon: Info, name: 'Info', category: 'Status' },
  { icon: Mail, name: 'Mail', category: 'Communication' },
  { icon: Phone, name: 'Phone', category: 'Communication' },
  { icon: MapPin, name: 'Location', category: 'Geography' },
  { icon: User, name: 'User', category: 'Identity' },
  { icon: Lock, name: 'Lock', category: 'Security' },
  { icon: Unlock, name: 'Unlock', category: 'Security' }
];

const animationTypes = [
  'bounce', 'shake', 'rotate', 'pulse', 'scale', 'flip', 'swing',
  'wobble', 'heartbeat', 'breathe', 'float', 'glow'
];

const enhancedAnimationTypes = [
  'elasticBounce', 'magneticHover', 'liquidMorph', 'breathe',
  'heartbeat', 'orbitalRotate', 'wobble', 'rubber', 'jello',
  'levitate', 'pulse3D', 'neon', 'hologram'
];

const triggerTypes = ['hover', 'click', 'always', 'focus'];
const intensityTypes = ['minimal', 'subtle', 'normal', 'strong', 'extreme'];

export function IconShowcase() {
  const [selectedAnimation, setSelectedAnimation] = useState('bounce');
  const [selectedEnhancedAnimation, setSelectedEnhancedAnimation] = useState('magneticHover');
  const [selectedTrigger, setSelectedTrigger] = useState('hover');
  const [selectedIntensity, setSelectedIntensity] = useState('normal');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(iconList.map(item => item.category)))];
  const filteredIcons = selectedCategory === 'all' 
    ? iconList 
    : iconList.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold gradient-text">
          Animated Icon Showcase
        </h1>
        <p className="text-muted-foreground">
          Explore our comprehensive collection of beautifully animated icons with advanced hover, click, and state animations
        </p>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Animations</TabsTrigger>
          <TabsTrigger value="enhanced">Enhanced Animations</TabsTrigger>
          <TabsTrigger value="presets">Preset Collections</TabsTrigger>
        </TabsList>

        {/* Basic Animations Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Animation Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Animation Type</label>
                  <select 
                    value={selectedAnimation} 
                    onChange={(e) => setSelectedAnimation(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    {animationTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Trigger</label>
                  <select 
                    value={selectedTrigger} 
                    onChange={(e) => setSelectedTrigger(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    {triggerTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Intensity</label>
                  <select 
                    value={selectedIntensity} 
                    onChange={(e) => setSelectedIntensity(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    {intensityTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {filteredIcons.map((item, index) => (
              <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <AnimatedIcon
                      icon={item.icon}
                      size={24}
                      animation={selectedAnimation as any}
                      trigger={selectedTrigger as any}
                      intensity={selectedIntensity as any}
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-medium">{item.name}</div>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {item.category}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Enhanced Animations Tab */}
        <TabsContent value="enhanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enhanced Animation Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Enhanced Animation</label>
                  <select 
                    value={selectedEnhancedAnimation} 
                    onChange={(e) => setSelectedEnhancedAnimation(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    {enhancedAnimationTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Trigger</label>
                  <select 
                    value={selectedTrigger} 
                    onChange={(e) => setSelectedTrigger(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    {triggerTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Intensity</label>
                  <select 
                    value={selectedIntensity} 
                    onChange={(e) => setSelectedIntensity(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    {intensityTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {filteredIcons.map((item, index) => (
              <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <EnhancedAnimatedIcon
                      icon={item.icon}
                      size={24}
                      animation={selectedEnhancedAnimation as any}
                      trigger={selectedTrigger as any}
                      intensity={selectedIntensity as any}
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-medium">{item.name}</div>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {item.category}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Presets Tab */}
        <TabsContent value="presets" className="space-y-6">
          <div className="grid gap-6">
            {/* Basic Presets */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Animation Presets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <AnimatedIconPresets.MenuIcon icon={Home} size={24} />
                    </div>
                    <span className="text-xs font-medium">Menu Icon</span>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <AnimatedIconPresets.AddIcon icon={Plus} size={24} />
                    </div>
                    <span className="text-xs font-medium">Add Icon</span>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <AnimatedIconPresets.HeartIcon icon={Heart} size={24} />
                    </div>
                    <span className="text-xs font-medium">Heart Icon</span>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <AnimatedIconPresets.BellIcon icon={Bell} size={24} />
                    </div>
                    <span className="text-xs font-medium">Bell Icon</span>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <AnimatedIconPresets.SettingsIcon icon={Settings} size={24} />
                    </div>
                    <span className="text-xs font-medium">Settings Icon</span>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <AnimatedIconPresets.LoadingIcon icon={Zap} size={24} />
                    </div>
                    <span className="text-xs font-medium">Loading Icon</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Presets */}
            <Card>
              <CardHeader>
                <CardTitle>Enhanced Animation Presets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <EnhancedIconPresets.NeonGlow icon={Sparkles} size={24} />
                    </div>
                    <span className="text-xs font-medium">Neon Glow</span>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <EnhancedIconPresets.ElasticButton icon={Star} size={24} />
                    </div>
                    <span className="text-xs font-medium">Elastic Button</span>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <EnhancedIconPresets.MagneticHover icon={Target} size={24} />
                    </div>
                    <span className="text-xs font-medium">Magnetic Hover</span>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <EnhancedIconPresets.HeartbeatNotification icon={Bell} size={24} />
                    </div>
                    <span className="text-xs font-medium">Heartbeat</span>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <EnhancedIconPresets.FloatingIcon icon={Eye} size={24} />
                    </div>
                    <span className="text-xs font-medium">Floating</span>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <EnhancedIconPresets.RubberBounce icon={ThumbsUp} size={24} />
                    </div>
                    <span className="text-xs font-medium">Rubber Bounce</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Live Demo Section */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button className="flex items-center gap-2">
              <AnimatedIcon icon={Heart} size={16} animation="heartbeat" trigger="always" />
              Like Button
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <EnhancedAnimatedIcon icon={Share} size={16} animation="elasticBounce" trigger="click" />
              Share
            </Button>
            
            <Button variant="secondary" className="flex items-center gap-2">
              <AnimatedIcon icon={Download} size={16} animation="bounce" trigger="hover" />
              Download
            </Button>
            
            <Button variant="destructive" className="flex items-center gap-2">
              <EnhancedAnimatedIcon icon={Trash2} size={16} animation="wobble" trigger="hover" />
              Delete
            </Button>
            
            <Button className="flex items-center gap-2">
              <EnhancedIconPresets.NeonGlow icon={Sparkles} size={16} />
              Magic Button
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}