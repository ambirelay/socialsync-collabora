import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  { icon: MapPin, name: 'Location', category: 'Navigation' },
  { icon: User, name: 'User', category: 'People' },
  { icon: Lock, name: 'Lock', category: 'Security' },
  { icon: Unlock, name: 'Unlock', category: 'Security' }
];

const categories = Array.from(new Set(iconList.map(icon => icon.category)));

export default function IconShowcase() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  const filteredIcons = selectedCategory === 'All' 
    ? iconList 
    : iconList.filter(icon => icon.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Lucide Icon Library</h1>
          <p className="text-muted-foreground">
            Beautiful, customizable icons from the Lucide icon library used throughout ContentPlan Pro
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === 'All' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('All')}
            className="h-8"
          >
            All ({iconList.length})
          </Button>
          {categories.map(category => {
            const count = iconList.filter(icon => icon.category === category).length;
            return (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="h-8"
              >
                {category} ({count})
              </Button>
            );
          })}
        </div>
      </div>

      {/* Icon Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {filteredIcons.map(({ icon: IconComponent, name, category }) => (
          <Card
            key={name}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${
              hoveredIcon === name ? 'ring-2 ring-primary' : ''
            }`}
            onMouseEnter={() => setHoveredIcon(name)}
            onMouseLeave={() => setHoveredIcon(null)}
          >
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="mb-3 p-3 rounded-lg bg-muted/50 transition-colors duration-200 hover:bg-primary/10">
                <IconComponent size={24} className="text-foreground" />
              </div>
              <div className="space-y-1">
                <div className="font-medium text-sm">{name}</div>
                <Badge variant="secondary" className="text-xs">
                  {category}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Icon Usage Examples */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Size Examples */}
          <div>
            <h3 className="font-semibold mb-3">Icon Sizes</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Home size={12} />
                <span className="text-sm">12px</span>
              </div>
              <div className="flex items-center gap-2">
                <Home size={16} />
                <span className="text-sm">16px</span>
              </div>
              <div className="flex items-center gap-2">
                <Home size={20} />
                <span className="text-sm">20px</span>
              </div>
              <div className="flex items-center gap-2">
                <Home size={24} />
                <span className="text-sm">24px</span>
              </div>
              <div className="flex items-center gap-2">
                <Home size={32} />
                <span className="text-sm">32px</span>
              </div>
            </div>
          </div>

          {/* Color Examples */}
          <div>
            <h3 className="font-semibold mb-3">Icon Colors</h3>
            <div className="flex items-center gap-4">
              <Heart size={24} className="text-red-500" />
              <Star size={24} className="text-yellow-500" />
              <CheckCircle size={24} className="text-green-500" />
              <AlertCircle size={24} className="text-orange-500" />
              <XCircle size={24} className="text-destructive" />
              <Settings size={24} className="text-muted-foreground" />
            </div>
          </div>

          {/* Button Examples */}
          <div>
            <h3 className="font-semibold mb-3">Icons in Buttons</h3>
            <div className="flex flex-wrap gap-2">
              <Button>
                <Plus size={16} className="mr-2" />
                Create Post
              </Button>
              <Button variant="outline">
                <Edit size={16} className="mr-2" />
                Edit
              </Button>
              <Button variant="secondary">
                <Share size={16} className="mr-2" />
                Share
              </Button>
              <Button variant="destructive">
                <Trash2 size={16} className="mr-2" />
                Delete
              </Button>
              <Button size="sm">
                <Download size={14} className="mr-1" />
                Download
              </Button>
            </div>
          </div>

          {/* Usage Code */}
          <div>
            <h3 className="font-semibold mb-3">Code Examples</h3>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-2">
              <div>{'import { Home, Settings, Bell } from "lucide-react"'}</div>
              <div>{'<Home size={24} />'}</div>
              <div>{'<Settings size={16} className="text-muted-foreground" />'}</div>
              <div>{'<Bell size={18} className="text-primary" />'}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}