import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnhancedAnimatedIcon, EnhancedIconPresets } from './enhanced-animated-icon';
import { LottieAnimatedIcon, LottieIconPresets } from './lottie-animated-icon';
import { AnimatedIcon, IconPresets } from './animated-icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Slider } from './slider';
import { Switch } from './switch';
import { Label } from './label';
import { Separator } from './separator';
import { 
  Play, Pause, RotateCcw, Settings, Zap, Heart, Star, 
  Sparkles, Bell, Home, User, Search, Plus, X, Check,
  ArrowRight, ArrowLeft, Download, Upload, Trash2, Edit,
  Save, Share, Copy, Link, Eye, EyeOff, Lock, Unlock,
  Mail, Phone, Calendar, Clock, MapPin, Camera, Image,
  Music, Video, File, Folder, Archive, Database, Server,
  Wifi, Globe, Shield, Key, Bookmark, Tag, Flag, Award,
  Gift, Coffee, Smile, ThumbsUp, MessageCircle, Send
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconLibrary = {
  navigation: [
    { icon: Home, name: 'Home' },
    { icon: User, name: 'User' },
    { icon: Search, name: 'Search' },
    { icon: Bell, name: 'Bell' },
    { icon: Settings, name: 'Settings' },
  ],
  actions: [
    { icon: Plus, name: 'Plus' },
    { icon: X, name: 'X' },
    { icon: Check, name: 'Check' },
    { icon: Edit, name: 'Edit' },
    { icon: Save, name: 'Save' },
    { icon: Trash2, name: 'Trash' },
    { icon: Copy, name: 'Copy' },
    { icon: Share, name: 'Share' },
  ],
  media: [
    { icon: Camera, name: 'Camera' },
    { icon: Image, name: 'Image' },
    { icon: Music, name: 'Music' },
    { icon: Video, name: 'Video' },
    { icon: Download, name: 'Download' },
    { icon: Upload, name: 'Upload' },
  ],
  communication: [
    { icon: Mail, name: 'Mail' },
    { icon: Phone, name: 'Phone' },
    { icon: MessageCircle, name: 'Message' },
    { icon: Send, name: 'Send' },
  ],
  system: [
    { icon: File, name: 'File' },
    { icon: Folder, name: 'Folder' },
    { icon: Database, name: 'Database' },
    { icon: Server, name: 'Server' },
    { icon: Wifi, name: 'Wifi' },
    { icon: Globe, name: 'Globe' },
  ],
  social: [
    { icon: Heart, name: 'Heart' },
    { icon: Star, name: 'Star' },
    { icon: ThumbsUp, name: 'Thumbs Up' },
    { icon: Smile, name: 'Smile' },
    { icon: Gift, name: 'Gift' },
    { icon: Award, name: 'Award' },
  ]
};

const animationTypes = {
  framer: [
    'pulse', 'bounce', 'rotate', 'scale', 'slide', 'shake', 'glow', 
    'flip', 'spin', 'none'
  ],
  enhanced: [
    'elasticBounce', 'magneticHover', 'liquidMorph', 'particleFloat',
    'breathe', 'heartbeat', 'ripple', 'morphScale', 'orbitalRotate',
    'wobble', 'pendulum', 'rubber', 'jello', 'flash', 'glitch', 
    'neon', 'hologram', 'levitate', 'pulse3D'
  ],
  lottie: [
    'loading', 'success', 'hover', 'click', 'reveal', 'hybrid'
  ]
};

const triggerTypes = ['hover', 'click', 'focus', 'auto', 'always'];
const intensityLevels = ['minimal', 'subtle', 'normal', 'strong', 'extreme'];

interface AnimationDemoProps {
  type: 'framer' | 'enhanced' | 'lottie';
  icon: React.ComponentType<{ size?: number }>;
  animation: string;
  trigger: string;
  intensity: string;
  size: number;
  speed: number;
  showTrail: boolean;
  showParticles: boolean;
}

function AnimationDemo({ 
  type, 
  icon, 
  animation, 
  trigger, 
  intensity, 
  size, 
  speed, 
  showTrail, 
  showParticles 
}: AnimationDemoProps) {
  const baseProps = {
    icon,
    size,
    trigger: trigger as any,
    intensity: intensity as any,
    duration: 1 / speed,
  };

  switch (type) {
    case 'enhanced':
      return (
        <EnhancedAnimatedIcon
          {...baseProps}
          animation={animation as any}
          trail={showTrail}
          particleCount={showParticles ? 8 : 0}
          className="m-2"
        />
      );
    case 'lottie':
      return (
        <LottieAnimatedIcon
          {...baseProps}
          lottieAnimation={animation as any}
          speed={speed}
          className="m-2"
        />
      );
    default:
      return (
        <AnimatedIcon
          {...baseProps}
          animation={animation as any}
          className="m-2"
        />
      );
  }
}

export function AdvancedIconAnimationSystem() {
  const [selectedType, setSelectedType] = useState<'framer' | 'enhanced' | 'lottie'>('enhanced');
  const [selectedCategory, setSelectedCategory] = useState('navigation');
  const [selectedAnimation, setSelectedAnimation] = useState('elasticBounce');
  const [selectedTrigger, setSelectedTrigger] = useState('hover');
  const [selectedIntensity, setSelectedIntensity] = useState('normal');
  const [iconSize, setIconSize] = useState(32);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [showTrail, setShowTrail] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const currentIcons = iconLibrary[selectedCategory as keyof typeof iconLibrary] || [];
  const currentAnimations = animationTypes[selectedType] || [];

  // Update animation when type changes
  React.useEffect(() => {
    setSelectedAnimation(currentAnimations[0] || 'none');
  }, [selectedType, currentAnimations]);

  const presetAnimations = useMemo(() => [
    {
      name: 'Magnetic Button',
      component: <EnhancedIconPresets.MagneticButton icon={Star} size={40} />,
      description: 'Follows cursor with magnetic attraction'
    },
    {
      name: 'Elastic Bounce',
      component: <EnhancedIconPresets.ElasticBounce icon={Heart} size={40} />,
      description: 'Bounces with elastic physics'
    },
    {
      name: 'Breathing Icon',
      component: <EnhancedIconPresets.BreathingIcon icon={Zap} size={40} />,
      description: 'Gentle breathing animation'
    },
    {
      name: 'Heartbeat',
      component: <EnhancedIconPresets.HeartbeatNotification icon={Bell} size={40} />,
      description: 'Heartbeat rhythm for notifications'
    },
    {
      name: 'Liquid Morph',
      component: <EnhancedIconPresets.LiquidMorph icon={Sparkles} size={40} />,
      description: 'Liquid-like morphing effect'
    },
    {
      name: 'Orbital Rotation',
      component: <EnhancedIconPresets.OrbitalLoader icon={Settings} size={40} />,
      description: 'Orbital motion with rotation'
    },
    {
      name: 'Rubber Click',
      component: <EnhancedIconPresets.RubberClick icon={Plus} size={40} />,
      description: 'Rubber-like click feedback'
    },
    {
      name: 'Neon Glow',
      component: <EnhancedIconPresets.NeonGlow icon={Star} size={40} />,
      description: 'Neon glow effect'
    },
    {
      name: 'Levitating',
      component: <EnhancedIconPresets.LevitatingIcon icon={Heart} size={40} />,
      description: 'Floating with shadow'
    },
    {
      name: 'Particle Float',
      component: <EnhancedIconPresets.ParticleFloat icon={Sparkles} size={40} />,
      description: 'Floating particles on hover'
    },
  ], []);

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold gradient-text">Advanced Icon Animation System</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Experience next-generation icon animations with physics-based springs, 
          Lottie integrations, and advanced visual effects.
        </p>
      </div>

      <Tabs value={selectedType} onValueChange={(value) => setSelectedType(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="framer" className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Settings size={16} />
            </motion.div>
            Framer Motion
          </TabsTrigger>
          <TabsTrigger value="enhanced" className="flex items-center gap-2">
            <EnhancedAnimatedIcon 
              icon={Zap} 
              size={16} 
              animation="neon" 
              trigger="always" 
              intensity="subtle"
            />
            Enhanced Spring
          </TabsTrigger>
          <TabsTrigger value="lottie" className="flex items-center gap-2">
            <LottieIconPresets.LoadingSpinner size={16} />
            Lottie
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings size={20} />
                Animation Controls
              </CardTitle>
              <CardDescription>
                Customize animation properties and behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Icon Category */}
              <div className="space-y-2">
                <Label>Icon Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(iconLibrary).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Animation Type */}
              <div className="space-y-2">
                <Label>Animation</Label>
                <Select value={selectedAnimation} onValueChange={setSelectedAnimation}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currentAnimations.map((animation) => (
                      <SelectItem key={animation} value={animation}>
                        {animation.charAt(0).toUpperCase() + animation.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Trigger */}
              <div className="space-y-2">
                <Label>Trigger</Label>
                <Select value={selectedTrigger} onValueChange={setSelectedTrigger}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {triggerTypes.map((trigger) => (
                      <SelectItem key={trigger} value={trigger}>
                        {trigger.charAt(0).toUpperCase() + trigger.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Intensity */}
              {selectedType === 'enhanced' && (
                <div className="space-y-2">
                  <Label>Intensity</Label>
                  <Select value={selectedIntensity} onValueChange={setSelectedIntensity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {intensityLevels.map((intensity) => (
                        <SelectItem key={intensity} value={intensity}>
                          {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Size */}
              <div className="space-y-2">
                <Label>Size: {iconSize}px</Label>
                <Slider
                  value={[iconSize]}
                  onValueChange={(value) => setIconSize(value[0])}
                  min={16}
                  max={64}
                  step={4}
                />
              </div>

              {/* Speed */}
              <div className="space-y-2">
                <Label>Speed: {animationSpeed}x</Label>
                <Slider
                  value={[animationSpeed]}
                  onValueChange={(value) => setAnimationSpeed(value[0])}
                  min={0.1}
                  max={3}
                  step={0.1}
                />
              </div>

              {/* Enhanced Options */}
              {selectedType === 'enhanced' && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="trail">Show Trail</Label>
                      <Switch
                        id="trail"
                        checked={showTrail}
                        onCheckedChange={setShowTrail}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="particles">Particle Effects</Label>
                      <Switch
                        id="particles"
                        checked={showParticles}
                        onCheckedChange={setShowParticles}
                      />
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Playback Controls */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex-1"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedAnimation('none');
                    setTimeout(() => setSelectedAnimation(currentAnimations[0]), 100);
                  }}
                >
                  <RotateCcw size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview Area */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>
                Interact with the icons to see animations in action
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 p-6 bg-muted/30 rounded-lg min-h-[200px]">
                <AnimatePresence>
                  {currentIcons.map(({ icon, name }, index) => (
                    <motion.div
                      key={`${selectedType}-${name}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-background/50 transition-colors"
                      title={name}
                    >
                      {isPlaying && (
                        <AnimationDemo
                          type={selectedType}
                          icon={icon}
                          animation={selectedAnimation}
                          trigger={selectedTrigger}
                          intensity={selectedIntensity}
                          size={iconSize}
                          speed={animationSpeed}
                          showTrail={showTrail}
                          showParticles={showParticles}
                        />
                      )}
                      <span className="text-xs text-muted-foreground mt-1 text-center">
                        {name}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preset Animations Showcase */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles size={20} />
              Preset Animations
            </CardTitle>
            <CardDescription>
              Pre-configured animations for common use cases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {presetAnimations.map((preset, index) => (
                <motion.div
                  key={preset.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center text-center space-y-3 p-4 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-background border-2 border-border/50">
                    {preset.component}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{preset.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {preset.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance & Accessibility Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap size={20} />
                Performance Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">GPU Accelerated</Badge>
                <span className="text-sm text-muted-foreground">Hardware acceleration</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Physics-Based</Badge>
                <span className="text-sm text-muted-foreground">React Spring integration</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Intersection Observer</Badge>
                <span className="text-sm text-muted-foreground">Scroll-triggered animations</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Reduced Motion</Badge>
                <span className="text-sm text-muted-foreground">Accessibility support</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield size={20} />
                Accessibility Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Focus Management</Badge>
                <span className="text-sm text-muted-foreground">Keyboard navigation</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Screen Reader</Badge>
                <span className="text-sm text-muted-foreground">ARIA labels</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">High Contrast</Badge>
                <span className="text-sm text-muted-foreground">Theme adaptation</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Motion Preferences</Badge>
                <span className="text-sm text-muted-foreground">Respects user settings</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </Tabs>
    </div>
  );
}