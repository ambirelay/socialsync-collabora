import React, { useState, useEffect, useRef, useMemo, forwardRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Animation types and configurations
type AnimationType = 
  | 'bounce' | 'shake' | 'rotate' | 'pulse' | 'scale' | 'flip' | 'swing'
  | 'wobble' | 'heartbeat' | 'breathe' | 'float' | 'glow' | 'morph' | 'elastic'
  | 'magnetic' | 'liquid' | 'particle' | 'orbital' | 'rubber' | 'jello'
  | 'levitate' | 'neon' | 'hologram' | 'glitch' | 'none';

type TriggerType = 'hover' | 'click' | 'focus' | 'always' | 'once' | 'proximity';
type IntensityType = 'minimal' | 'subtle' | 'normal' | 'strong' | 'extreme';
type EasingType = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'backOut' | 'bounceOut' | 'elasticOut';

interface AnimatedIconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  animation?: AnimationType;
  trigger?: TriggerType;
  intensity?: IntensityType;
  duration?: number;
  delay?: number;
  loop?: boolean;
  color?: string;
  hoverColor?: string;
  clickColor?: string;
  disabled?: boolean;
  loading?: boolean;
  badge?: number | string;
  onClick?: () => void;
  onHover?: () => void;
  onAnimationComplete?: () => void;
  'aria-label'?: string;
}

// Animation configurations
const animationConfigs = {
  bounce: {
    hover: { y: [-2, -8, -2], transition: { duration: 0.3, ease: "easeOut" } },
    click: { scale: [1, 0.9, 1.1, 1], transition: { duration: 0.2 } },
    always: { y: [0, -4, 0], transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" } }
  },
  shake: {
    hover: { x: [-1, 1, -1, 1, 0], transition: { duration: 0.4 } },
    click: { x: [-2, 2, -2, 2, 0], transition: { duration: 0.3 } },
    always: { x: [-1, 1, -1], transition: { duration: 0.5, repeat: Infinity } }
  },
  rotate: {
    hover: { rotate: [0, 5, -5, 0], transition: { duration: 0.3 } },
    click: { rotate: [0, 180], transition: { duration: 0.4 } },
    always: { rotate: 360, transition: { duration: 2, repeat: Infinity, ease: "linear" } }
  },
  pulse: {
    hover: { scale: [1, 1.1, 1], transition: { duration: 0.2 } },
    click: { scale: [1, 0.95, 1.05, 1], transition: { duration: 0.2 } },
    always: { scale: [1, 1.05, 1], transition: { duration: 1.5, repeat: Infinity } }
  },
  scale: {
    hover: { scale: 1.1, transition: { duration: 0.2, ease: "easeOut" } },
    click: { scale: [1, 0.9, 1.1, 1], transition: { duration: 0.15 } },
    always: { scale: [1, 1.02, 1], transition: { duration: 2, repeat: Infinity } }
  },
  flip: {
    hover: { rotateY: [0, 180], transition: { duration: 0.4 } },
    click: { rotateX: [0, 180], transition: { duration: 0.3 } },
    always: { rotateY: [0, 360], transition: { duration: 3, repeat: Infinity } }
  },
  swing: {
    hover: { rotate: [0, 10, -10, 0], transition: { duration: 0.5 } },
    click: { rotate: [0, 15, -15, 0], transition: { duration: 0.4 } },
    always: { rotate: [0, 5, -5, 0], transition: { duration: 2, repeat: Infinity } }
  },
  wobble: {
    hover: { 
      rotate: [0, -5, 5, -3, 3, 0],
      x: [0, 2, -2, 1, -1, 0],
      transition: { duration: 0.6 }
    },
    click: { 
      rotate: [0, -10, 10, -5, 5, 0],
      transition: { duration: 0.4 }
    },
    always: {
      rotate: [0, -2, 2, -2, 2, 0],
      transition: { duration: 1.5, repeat: Infinity }
    }
  },
  heartbeat: {
    hover: { scale: [1, 1.1, 1, 1.05, 1], transition: { duration: 0.6 } },
    click: { scale: [1, 1.2, 1, 1.1, 1], transition: { duration: 0.4 } },
    always: { 
      scale: [1, 1.05, 1, 1.02, 1],
      transition: { duration: 1.2, repeat: Infinity, repeatDelay: 0.5 }
    }
  },
  breathe: {
    hover: { scale: 1.05, opacity: 0.8, transition: { duration: 0.3 } },
    click: { scale: [1, 1.1, 1], opacity: [1, 0.7, 1], transition: { duration: 0.4 } },
    always: { 
      scale: [1, 1.03, 1],
      opacity: [1, 0.8, 1],
      transition: { duration: 3, repeat: Infinity }
    }
  },
  float: {
    hover: { y: -3, transition: { duration: 0.2 } },
    click: { y: [-1, -5, -1], transition: { duration: 0.3 } },
    always: { 
      y: [0, -3, 0],
      transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
    }
  },
  glow: {
    hover: { 
      filter: ["brightness(1)", "brightness(1.3)"],
      transition: { duration: 0.2 }
    },
    click: { 
      filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
      transition: { duration: 0.3 }
    },
    always: {
      filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"],
      transition: { duration: 2, repeat: Infinity }
    }
  }
};

// Intensity multipliers
const intensityMultipliers = {
  minimal: 0.3,
  subtle: 0.6,
  normal: 1,
  strong: 1.4,
  extreme: 2
};

// Color variants
const colorVariants = {
  default: "text-foreground",
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
  destructive: "text-destructive",
  muted: "text-muted-foreground"
};

// Custom hook for managing icon states
const useIconState = (trigger: TriggerType, disabled: boolean) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  const shouldAnimate = useMemo(() => {
    if (disabled) return false;
    
    switch (trigger) {
      case 'always':
        return true;
      case 'hover':
        return isHovered;
      case 'click':
        return isPressed;
      case 'focus':
        return isFocused;
      case 'once':
        return !hasAnimated;
      default:
        return false;
    }
  }, [trigger, disabled, isHovered, isPressed, isFocused, hasAnimated]);

  return {
    isHovered,
    setIsHovered,
    isPressed,
    setIsPressed,
    isFocused,
    setIsFocused,
    shouldAnimate,
    markAsAnimated: () => setHasAnimated(true)
  };
};

// Main AnimatedIcon component
export const AnimatedIcon = forwardRef<HTMLButtonElement, AnimatedIconProps>(({
  icon: Icon,
  size = 20,
  className = "",
  animation = "scale",
  trigger = "hover",
  intensity = "normal",
  duration = 0.3,
  delay = 0,
  loop = false,
  color,
  hoverColor,
  clickColor,
  disabled = false,
  loading = false,
  badge,
  onClick,
  onHover,
  onAnimationComplete,
  "aria-label": ariaLabel,
  ...props
}, ref) => {
  const {
    isHovered,
    setIsHovered,
    isPressed,
    setIsPressed,
    isFocused,
    setIsFocused,
    shouldAnimate,
    markAsAnimated
  } = useIconState(trigger, disabled);

  const controls = useAnimation();
  const iconRef = useRef<HTMLDivElement>(null);

  // Get animation configuration
  const animConfig = animationConfigs[animation] || animationConfigs.scale;
  const multiplier = intensityMultipliers[intensity];

  // Apply intensity to animation values
  const getIntensifiedAnimation = (config: any) => {
    if (!config) return {};
    
    const intensified = { ...config };
    if (config.scale) {
      if (Array.isArray(config.scale)) {
        intensified.scale = config.scale.map((s: number) => 1 + (s - 1) * multiplier);
      } else {
        intensified.scale = 1 + (config.scale - 1) * multiplier;
      }
    }
    
    if (config.y && Array.isArray(config.y)) {
      intensified.y = config.y.map((y: number) => y * multiplier);
    }
    
    if (config.x && Array.isArray(config.x)) {
      intensified.x = config.x.map((x: number) => x * multiplier);
    }
    
    return intensified;
  };

  // Handle animation trigger
  useEffect(() => {
    if (!shouldAnimate || !animConfig) return;

    let config;
    if (trigger === 'always') {
      config = getIntensifiedAnimation(animConfig.always);
    } else if (trigger === 'hover' && isHovered) {
      config = getIntensifiedAnimation(animConfig.hover);
    } else if (trigger === 'click' && isPressed) {
      config = getIntensifiedAnimation(animConfig.click);
    } else {
      return;
    }

    if (config) {
      controls.start({
        ...config,
        transition: {
          ...config.transition,
          duration: config.transition?.duration || duration,
          delay,
          repeat: loop || trigger === 'always' ? Infinity : 0
        }
      }).then(() => {
        if (trigger === 'once') markAsAnimated();
        onAnimationComplete?.();
      });
    }
  }, [shouldAnimate, controls, animConfig, trigger, isHovered, isPressed, duration, delay, loop, intensity, multiplier, markAsAnimated, onAnimationComplete]);

  // Event handlers
  const handleMouseEnter = () => {
    if (disabled) return;
    setIsHovered(true);
    onHover?.();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (trigger === 'hover') {
      controls.start({ scale: 1, rotate: 0, x: 0, y: 0, opacity: 1, filter: "brightness(1)" });
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
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Dynamic color classes
  const getColorClass = () => {
    if (disabled) return "text-muted-foreground opacity-50";
    if (isPressed && clickColor) return clickColor;
    if (isHovered && hoverColor) return hoverColor;
    if (color) return color;
    return "text-foreground";
  };

  // Loading spinner
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
      aria-label={ariaLabel}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
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

AnimatedIcon.displayName = "AnimatedIcon";

// Preset animated icons for common use cases
export const AnimatedIconPresets = {
  // Navigation icons
  MenuIcon: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon animation="wobble" trigger="hover" intensity="subtle" {...props} />
  ),
  
  // Action icons
  AddIcon: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon animation="rotate" trigger="hover" intensity="normal" {...props} />
  ),
  
  // Status icons
  LoadingIcon: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon animation="rotate" trigger="always" intensity="normal" {...props} />
  ),
  
  // Interactive icons
  HeartIcon: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon animation="heartbeat" trigger="click" intensity="strong" {...props} />
  ),
  
  // Notification icons
  BellIcon: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon animation="swing" trigger="hover" intensity="subtle" {...props} />
  ),
  
  // Settings icons
  SettingsIcon: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon animation="rotate" trigger="hover" intensity="minimal" duration={0.5} {...props} />
  )
};

export default AnimatedIcon;