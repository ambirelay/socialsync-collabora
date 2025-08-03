import React, { useState, useEffect, useRef, useMemo, forwardRef } from 'react';
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { animated, useSpring, useSpringRef, useTrail, useChain, easings, config } from '@react-spring/web';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedAnimatedIconProps {
  icon: LucideIcon;
  size?: number | string;
  className?: string;
  
  // Enhanced Animation Options
  animation?: 
    | 'elasticBounce' | 'magneticHover' | 'liquidMorph' | 'particleFloat'
    | 'breathe' | 'heartbeat' | 'ripple' | 'morphScale' | 'orbitalRotate'
    | 'wobble' | 'pendulum' | 'rubber' | 'jello' | 'flash' | 'flipInX'
    | 'flipInY' | 'lightSpeed' | 'rollIn' | 'zoomIn' | 'slideInUp'
    | 'slideInDown' | 'fadeInUp' | 'bounceIn' | 'rotateIn' | 'swing'
    | 'pulse3D' | 'levitate' | 'glitch' | 'neon' | 'hologram' | 'none';
    
  trigger?: 'hover' | 'click' | 'focus' | 'auto' | 'always' | 'proximity' | 'scroll';
  
  // Advanced timing
  delay?: number;
  duration?: number;
  stagger?: number;
  
  // Intensity and behavior
  intensity?: 'minimal' | 'subtle' | 'normal' | 'strong' | 'extreme';
  easing?: 'linear' | 'ease' | 'easeIn' | 'easeOut' | 'easeInOut' | 'circOut' | 'backOut' | 'elasticOut';
  
  // Visual enhancements
  color?: string;
  hoverColor?: string;
  glowColor?: string;
  shadowColor?: string;
  
  // States
  disabled?: boolean;
  loading?: boolean;
  active?: boolean;
  
  // Interactive elements
  badge?: number | string;
  tooltip?: string;
  variant?: 'default' | 'ghost' | 'outline' | 'destructive' | 'secondary' | 'accent';
  
  // Event handlers
  onClick?: () => void;
  onHover?: () => void;
  onFocus?: () => void;
  onAnimationComplete?: () => void;
  
  // Advanced features
  magneticStrength?: number;
  particleCount?: number;
  morphTarget?: LucideIcon;
  trail?: boolean;
  reflect?: boolean;
  perspective?: boolean;
}

// Intensity mappings
const intensityMap = {
  minimal: { scale: 1.02, translate: 1, rotate: 2, glow: 2 },
  subtle: { scale: 1.05, translate: 2, rotate: 5, glow: 4 },
  normal: { scale: 1.1, translate: 4, rotate: 10, glow: 6 },
  strong: { scale: 1.15, translate: 8, rotate: 15, glow: 8 },
  extreme: { scale: 1.25, translate: 12, rotate: 25, glow: 12 },
};

// Enhanced color variants
const variantStyles = {
  default: 'text-foreground hover:text-primary',
  ghost: 'text-muted-foreground hover:text-foreground',
  outline: 'text-foreground border border-input hover:bg-accent hover:text-accent-foreground rounded-md p-1',
  destructive: 'text-destructive hover:text-destructive/80',
  secondary: 'text-secondary-foreground hover:text-primary',
  accent: 'text-accent-foreground hover:text-accent bg-accent/10 rounded-md p-1',
};

// Animation configurations with Framer Motion
const animationConfigs = {
  elasticBounce: {
    hover: { 
      scale: [1, 1.2, 0.95, 1.1, 1],
      transition: { duration: 0.6, ease: [0.68, -0.55, 0.265, 1.55] }
    },
    click: { 
      scale: [1, 0.9, 1.3, 1],
      transition: { duration: 0.4, ease: "backOut" }
    },
    always: {
      scale: [1, 1.05, 1],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }
  },
  magneticHover: {
    hover: { 
      scale: 1.05,
      y: -2,
      transition: { duration: 0.15, ease: "easeOut" }
    },
    click: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  },
  liquidMorph: {
    hover: {
      scale: [1, 1.3, 1.1, 1.05, 1],
      rotate: [0, 5, -3, 2, 0],
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  },
  breathe: {
    always: {
      scale: [1, 1.03, 1],
      opacity: [1, 0.8, 1],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    }
  },
  heartbeat: {
    always: {
      scale: [1, 1.1, 1, 1.05, 1],
      transition: { 
        duration: 1.2,
        repeat: Infinity,
        repeatDelay: 0.5,
        ease: "easeInOut"
      }
    }
  },
  orbitalRotate: {
    hover: {
      rotate: [0, 360],
      transition: { duration: 1, ease: "linear" }
    },
    always: {
      rotate: 360,
      transition: { duration: 4, repeat: Infinity, ease: "linear" }
    }
  },
  wobble: {
    hover: {
      rotate: [0, -5, 5, -3, 3, 0],
      x: [0, 2, -2, 1, -1, 0],
      transition: { duration: 0.6 }
    }
  },
  rubber: {
    click: {
      scale: [1, 1.4, 0.8, 1.2, 0.95, 1.05, 1],
      transition: { duration: 0.8, ease: [0.68, -0.55, 0.265, 1.55] }
    }
  },
  jello: {
    hover: {
      scale: [1, 1.1, 0.9, 1.05],
      rotate: [0, -5, 5, -2],
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  },
  levitate: {
    always: {
      y: [0, -8, 0],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    }
  },
  pulse3D: {
    always: {
      scale: [1, 1.05, 1],
      filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }
  },
  neon: {
    always: {
      filter: [
        "drop-shadow(0 0 4px currentColor) brightness(1)",
        "drop-shadow(0 0 12px currentColor) brightness(1.5)",
        "drop-shadow(0 0 4px currentColor) brightness(1)"
      ],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }
  },
  hologram: {
    always: {
      opacity: [0.7, 1, 0.7],
      filter: [
        "brightness(1.2) saturate(1.8) hue-rotate(0deg)",
        "brightness(1.5) saturate(2) hue-rotate(10deg)",
        "brightness(1.2) saturate(1.8) hue-rotate(0deg)"
      ],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    }
  }
};

export const EnhancedAnimatedIcon = forwardRef<HTMLButtonElement, EnhancedAnimatedIconProps>(({
  icon: Icon,
  size = 20,
  className = "",
  animation = "magneticHover",
  trigger = "hover",
  intensity = "normal",
  duration = 0.3,
  delay = 0,
  color,
  hoverColor,
  glowColor,
  shadowColor,
  disabled = false,
  loading = false,
  active = false,
  badge,
  tooltip,
  variant = "default",
  onClick,
  onHover,
  onFocus,
  onAnimationComplete,
  magneticStrength = 10,
  ...props
}, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const controls = useAnimation();
  const iconRef = useRef<HTMLDivElement>(null);

  // Get animation configuration
  const animConfig = animationConfigs[animation];
  const intensityValues = intensityMap[intensity];

  // Handle animation trigger
  useEffect(() => {
    if (disabled) return;

    const shouldAnimate = 
      (trigger === 'always') ||
      (trigger === 'hover' && isHovered) ||
      (trigger === 'click' && isPressed) ||
      (trigger === 'focus' && isFocused);

    if (!shouldAnimate || !animConfig) return;

    let config;
    if (trigger === 'always' && animConfig.always) {
      config = animConfig.always;
    } else if (trigger === 'hover' && isHovered && animConfig.hover) {
      config = animConfig.hover;
    } else if (trigger === 'click' && isPressed && animConfig.click) {
      config = animConfig.click;
    } else if (trigger === 'focus' && isFocused && animConfig.focus) {
      config = animConfig.focus;
    }

    if (config) {
      controls.start(config).then(() => {
        onAnimationComplete?.();
      });
    }
  }, [trigger, isHovered, isPressed, isFocused, disabled, controls, animConfig, onAnimationComplete]);

  // Event handlers
  const handleMouseEnter = () => {
    if (disabled) return;
    setIsHovered(true);
    onHover?.();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (trigger === 'hover') {
      controls.start({ 
        scale: 1, 
        rotate: 0, 
        x: 0, 
        y: 0, 
        opacity: 1,
        filter: "brightness(1)" 
      });
    }
  };

  const handleMouseDown = () => {
    if (disabled) return;
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Dynamic styles
  const getColorClass = () => {
    if (disabled) return "text-muted-foreground opacity-50";
    if (isPressed && color) return color;
    if (isHovered && hoverColor) return hoverColor;
    if (active) return "text-primary";
    return variantStyles[variant] || variantStyles.default;
  };

  // Loading state
  if (loading) {
    return (
      <motion.div
        className={cn("inline-flex items-center justify-center", className)}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Icon size={size} className="text-muted-foreground" />
      </motion.div>
    );
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      className={cn(
        "inline-flex items-center justify-center relative transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className
      )}
      animate={controls}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      disabled={disabled}
      aria-label={tooltip}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      style={{
        willChange: 'transform, opacity, filter',
        backfaceVisibility: 'hidden',
        transformStyle: 'preserve-3d'
      }}
      {...props}
    >
      <motion.div
        ref={iconRef}
        className={cn(
          "flex items-center justify-center transition-colors duration-200",
          getColorClass()
        )}
      >
        <Icon size={size} />
      </motion.div>

      {/* Badge */}
      {badge && (
        <motion.span
          className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full min-w-4 h-4 flex items-center justify-center px-1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {badge}
        </motion.span>
      )}

      {/* Focus indicator */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            className="absolute inset-0 rounded-sm ring-2 ring-ring ring-offset-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
});

EnhancedAnimatedIcon.displayName = "EnhancedAnimatedIcon";

// Enhanced presets for specific use cases
export const EnhancedIconPresets = {
  // Attention-grabbing animations
  NeonGlow: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="neon" trigger="always" intensity="normal" {...props} />
  ),
  
  // Interaction feedback
  ElasticButton: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="elasticBounce" trigger="click" intensity="strong" {...props} />
  ),
  
  // Hover effects
  MagneticHover: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="magneticHover" trigger="hover" intensity="subtle" {...props} />
  ),
  
  // Status indicators
  HeartbeatNotification: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="heartbeat" trigger="always" intensity="subtle" {...props} />
  ),
  
  // Loading states
  OrbitingLoader: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="orbitalRotate" trigger="always" intensity="normal" {...props} />
  ),
  
  // Interactive elements
  LiquidMorph: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="liquidMorph" trigger="hover" intensity="normal" {...props} />
  ),
  
  // Floating elements
  FloatingIcon: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="levitate" trigger="always" intensity="minimal" {...props} />
  ),
  
  // Breathing elements
  BreathingIcon: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="breathe" trigger="always" intensity="subtle" {...props} />
  ),
  
  // Futuristic effects
  HologramIcon: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="hologram" trigger="always" intensity="normal" {...props} />
  ),
  
  // Playful interactions
  RubberBounce: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="rubber" trigger="click" intensity="strong" {...props} />
  ),
  
  // Subtle feedback
  Pulse3D: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="pulse3D" trigger="always" intensity="minimal" {...props} />
  ),
  
  // Wobbling effects
  WobbleHover: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="wobble" trigger="hover" intensity="normal" {...props} />
  )
};



export default EnhancedAnimatedIcon;