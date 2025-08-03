import React, { createContext, useContext, useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Icon theme types
export type IconTheme = 
  | 'default'     // Standard outlined icons
  | 'filled'      // Filled/solid icons  
  | 'duotone'     // Two-tone icons
  | 'gradient'    // Gradient filled icons
  | 'glass'       // Glassmorphic style
  | 'neon'        // Neon glow effect
  | 'minimal'     // Ultra thin lines
  | 'bold'        // Extra thick lines
  | 'rounded'     // Rounded corners
  | 'sharp'       // Sharp, angular style

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type IconWeight = 'thin' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
export type IconVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'destructive' | 'muted';
export type IconState = 'default' | 'hover' | 'active' | 'disabled' | 'loading';

interface IconThemeConfig {
  name: string;
  description: string;
  strokeWidth: number;
  fillOpacity: number;
  glowIntensity: number;
  borderRadius: string;
  shadowEffect: string;
  gradientStops: string[];
  hoverTransform: string;
  animation: string;
}

const iconThemes: Record<IconTheme, IconThemeConfig> = {
  default: {
    name: 'Default',
    description: 'Clean, professional outlined icons',
    strokeWidth: 2,
    fillOpacity: 0,
    glowIntensity: 0,
    borderRadius: '0',
    shadowEffect: 'none',
    gradientStops: [],
    hoverTransform: 'scale(1.05)',
    animation: 'smooth'
  },
  filled: {
    name: 'Filled',
    description: 'Bold, solid filled icons',
    strokeWidth: 0,
    fillOpacity: 1,
    glowIntensity: 0,
    borderRadius: '2px',
    shadowEffect: '0 2px 4px rgba(0,0,0,0.1)',
    gradientStops: [],
    hoverTransform: 'scale(1.1)',
    animation: 'bounce'
  },
  duotone: {
    name: 'Duotone',
    description: 'Two-tone colored icons',
    strokeWidth: 1.5,
    fillOpacity: 0.2,
    glowIntensity: 0,
    borderRadius: '0',
    shadowEffect: 'none',
    gradientStops: ['var(--primary)', 'var(--secondary)'],
    hoverTransform: 'scale(1.05) rotate(2deg)',
    animation: 'smooth'
  },
  gradient: {
    name: 'Gradient',
    description: 'Beautiful gradient fills',
    strokeWidth: 0,
    fillOpacity: 1,
    glowIntensity: 0,
    borderRadius: '4px',
    shadowEffect: '0 4px 8px rgba(0,0,0,0.15)',
    gradientStops: ['var(--primary)', 'var(--accent)'],
    hoverTransform: 'scale(1.08)',
    animation: 'glow'
  },
  glass: {
    name: 'Glass',
    description: 'Glassmorphic transparency',
    strokeWidth: 1,
    fillOpacity: 0.1,
    glowIntensity: 0,
    borderRadius: '8px',
    shadowEffect: '0 8px 32px rgba(31, 38, 135, 0.37)',
    gradientStops: ['rgba(255, 255, 255, 0.18)'],
    hoverTransform: 'scale(1.05)',
    animation: 'float'
  },
  neon: {
    name: 'Neon',
    description: 'Glowing neon effects',
    strokeWidth: 2,
    fillOpacity: 0,
    glowIntensity: 8,
    borderRadius: '0',
    shadowEffect: '0 0 10px currentColor',
    gradientStops: ['var(--primary)', 'var(--accent)'],
    hoverTransform: 'scale(1.1)',
    animation: 'pulse'
  },
  minimal: {
    name: 'Minimal',
    description: 'Ultra-thin, minimal lines',
    strokeWidth: 1,
    fillOpacity: 0,
    glowIntensity: 0,
    borderRadius: '0',
    shadowEffect: 'none',
    gradientStops: [],
    hoverTransform: 'scale(1.02)',
    animation: 'fade'
  },
  bold: {
    name: 'Bold',
    description: 'Extra thick, bold lines',
    strokeWidth: 3,
    fillOpacity: 0,
    glowIntensity: 0,
    borderRadius: '0',
    shadowEffect: '0 2px 4px rgba(0,0,0,0.2)',
    gradientStops: [],
    hoverTransform: 'scale(1.08)',
    animation: 'bounce'
  },
  rounded: {
    name: 'Rounded',
    description: 'Soft, rounded corners',
    strokeWidth: 2,
    fillOpacity: 0.1,
    glowIntensity: 0,
    borderRadius: '50%',
    shadowEffect: '0 4px 12px rgba(0,0,0,0.1)',
    gradientStops: [],
    hoverTransform: 'scale(1.1) rotate(5deg)',
    animation: 'smooth'
  },
  sharp: {
    name: 'Sharp',
    description: 'Angular, geometric style',
    strokeWidth: 2,
    fillOpacity: 0,
    glowIntensity: 0,
    borderRadius: '0',
    shadowEffect: '2px 2px 0 rgba(0,0,0,0.1)',
    gradientStops: [],
    hoverTransform: 'scale(1.05) skew(-2deg)',
    animation: 'sharp'
  }
};

const iconSizes: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  '2xl': 32
};

const iconVariants: Record<IconVariant, string> = {
  default: 'text-foreground',
  primary: 'text-primary',
  secondary: 'text-secondary-foreground', 
  success: 'text-green-600',
  warning: 'text-yellow-600',
  destructive: 'text-destructive',
  muted: 'text-muted-foreground'
};

// Context for icon theme management
interface IconThemeContextType {
  theme: IconTheme;
  setTheme: (theme: IconTheme) => void;
  config: IconThemeConfig;
  availableThemes: IconTheme[];
}

const IconThemeContext = createContext<IconThemeContextType | undefined>(undefined);

export function IconThemeProvider({ 
  children, 
  defaultTheme = 'default' 
}: { 
  children: React.ReactNode;
  defaultTheme?: IconTheme;
}) {
  const [theme, setTheme] = useState<IconTheme>(defaultTheme);
  
  const value = {
    theme,
    setTheme,
    config: iconThemes[theme],
    availableThemes: Object.keys(iconThemes) as IconTheme[]
  };

  return (
    <IconThemeContext.Provider value={value}>
      {children}
    </IconThemeContext.Provider>
  );
}

export function useIconTheme() {
  const context = useContext(IconThemeContext);
  if (!context) {
    throw new Error('useIconTheme must be used within an IconThemeProvider');
  }
  return context;
}

// Themed icon component
interface ThemedIconProps {
  icon: LucideIcon;
  size?: IconSize | number;
  variant?: IconVariant;
  state?: IconState;
  weight?: IconWeight;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  onHover?: () => void;
  theme?: IconTheme; // Override context theme
  animate?: boolean;
  loading?: boolean;
  badge?: string | number;
  tooltip?: string;
}

export function ThemedIcon({
  icon: Icon,
  size = 'md',
  variant = 'default',
  state = 'default',
  weight = 'regular',
  className,
  style,
  onClick,
  onHover,
  theme: overrideTheme,
  animate = true,
  loading = false,
  badge,
  tooltip,
  ...props
}: ThemedIconProps) {
  const { theme: contextTheme, config } = useIconTheme();
  const activeTheme = overrideTheme || contextTheme;
  const themeConfig = iconThemes[activeTheme];
  
  const iconSize = typeof size === 'number' ? size : iconSizes[size];
  const variantClass = iconVariants[variant];
  
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const getIconStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      strokeWidth: themeConfig.strokeWidth,
      fill: themeConfig.fillOpacity > 0 ? 'currentColor' : 'none',
      fillOpacity: themeConfig.fillOpacity,
      borderRadius: themeConfig.borderRadius,
      filter: themeConfig.glowIntensity > 0 
        ? `drop-shadow(0 0 ${themeConfig.glowIntensity}px currentColor)` 
        : undefined,
      ...style
    };

    // Add gradient fill for gradient theme
    if (activeTheme === 'gradient' && themeConfig.gradientStops.length > 0) {
      baseStyle.fill = 'url(#icon-gradient)';
    }

    // Add glass effect
    if (activeTheme === 'glass') {
      baseStyle.backdropFilter = 'blur(10px)';
      baseStyle.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      baseStyle.border = '1px solid rgba(255, 255, 255, 0.2)';
    }

    // State-based modifications
    if (state === 'disabled') {
      baseStyle.opacity = 0.5;
      baseStyle.pointerEvents = 'none';
    }

    if (state === 'loading') {
      baseStyle.animation = 'spin 1s linear infinite';
    }

    return baseStyle;
  };

  const getWrapperClass = () => {
    return cn(
      'inline-flex items-center justify-center relative transition-all duration-200',
      variantClass,
      state === 'disabled' && 'opacity-50 pointer-events-none',
      onClick && 'cursor-pointer select-none',
      className
    );
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover?.();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMouseDown = () => setIsActive(true);
  const handleMouseUp = () => setIsActive(false);

  const getMotionProps = () => {
    if (!animate) return {};
    
    const baseProps = {
      whileHover: isHovered ? { 
        transform: themeConfig.hoverTransform,
        transition: { duration: 0.2 }
      } : {},
      whileTap: { scale: 0.95 },
      transition: { type: 'spring', stiffness: 400, damping: 17 }
    };

    // Add theme-specific animations
    switch (themeConfig.animation) {
      case 'bounce':
        return {
          ...baseProps,
          animate: { y: [0, -2, 0] },
          transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
        };
      case 'pulse':
        return {
          ...baseProps,
          animate: { scale: [1, 1.05, 1] },
          transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
        };
      case 'glow':
        return {
          ...baseProps,
          animate: { 
            filter: [
              'drop-shadow(0 0 4px currentColor)',
              'drop-shadow(0 0 8px currentColor)',
              'drop-shadow(0 0 4px currentColor)'
            ]
          },
          transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
        };
      case 'float':
        return {
          ...baseProps,
          animate: { y: [0, -1, 0] },
          transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
        };
      default:
        return baseProps;
    }
  };

  return (
    <div className="relative inline-block">
      {/* Gradient definition for gradient theme */}
      {activeTheme === 'gradient' && (
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              {themeConfig.gradientStops.map((stop, index) => (
                <stop 
                  key={index}
                  offset={`${(index / (themeConfig.gradientStops.length - 1)) * 100}%`}
                  stopColor={stop}
                />
              ))}
            </linearGradient>
          </defs>
        </svg>
      )}

      <motion.div
        className={getWrapperClass()}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={onClick}
        title={tooltip}
        {...getMotionProps()}
      >
        <Icon 
          size={iconSize}
          style={getIconStyle()}
          {...props}
        />

        {/* Loading overlay */}
        {loading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div 
              className="animate-spin rounded-full border-2 border-current border-t-transparent"
              style={{ width: iconSize * 0.8, height: iconSize * 0.8 }}
            />
          </motion.div>
        )}

        {/* Badge */}
        {badge && (
          <motion.span
            className="absolute -top-1 -right-1 min-w-[1rem] h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center px-1 font-medium"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          >
            {badge}
          </motion.span>
        )}

        {/* Glow effect for neon theme */}
        {activeTheme === 'neon' && isHovered && (
          <motion.div
            className="absolute inset-0 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.5, 1, 0.5],
              boxShadow: [
                '0 0 5px currentColor',
                '0 0 20px currentColor',
                '0 0 5px currentColor'
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.div>
    </div>
  );
}

// Theme selector component
export function IconThemeSelector() {
  const { theme, setTheme, availableThemes } = useIconTheme();

  return (
    <div className="flex flex-wrap gap-2">
      {availableThemes.map((themeName) => {
        const themeConfig = iconThemes[themeName];
        return (
          <button
            key={themeName}
            onClick={() => setTheme(themeName)}
            className={cn(
              'px-3 py-2 text-sm rounded-md border transition-all',
              theme === themeName
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground'
            )}
            title={themeConfig.description}
          >
            {themeConfig.name}
          </button>
        );
      })}
    </div>
  );
}