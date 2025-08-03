import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedIconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  animation?: 'pulse' | 'bounce' | 'rotate' | 'scale' | 'slide' | 'shake' | 'glow' | 'flip' | 'spin' | 'none';
  trigger?: 'hover' | 'click' | 'focus' | 'auto' | 'always';
  delay?: number;
  duration?: number;
  intensity?: 'subtle' | 'normal' | 'strong';
  color?: string;
  hoverColor?: string;
  disabled?: boolean;
  loading?: boolean;
  badge?: number | string;
  tooltip?: string;
  variant?: 'default' | 'ghost' | 'outline' | 'destructive' | 'secondary';
  onClick?: () => void;
  onHover?: () => void;
  onFocus?: () => void;
}

const animationVariants = {
  pulse: {
    subtle: {
      scale: [1, 1.05, 1],
      transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' }
    },
    normal: {
      scale: [1, 1.1, 1],
      transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' }
    },
    strong: {
      scale: [1, 1.2, 1],
      transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' }
    }
  },
  bounce: {
    subtle: {
      y: [0, -2, 0],
      transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' }
    },
    normal: {
      y: [0, -4, 0],
      transition: { duration: 0.5, repeat: Infinity, ease: 'easeInOut' }
    },
    strong: {
      y: [0, -8, 0],
      transition: { duration: 0.4, repeat: Infinity, ease: 'easeInOut' }
    }
  },
  rotate: {
    subtle: {
      rotate: 360,
      transition: { duration: 3, repeat: Infinity, ease: 'linear' }
    },
    normal: {
      rotate: 360,
      transition: { duration: 2, repeat: Infinity, ease: 'linear' }
    },
    strong: {
      rotate: 360,
      transition: { duration: 1, repeat: Infinity, ease: 'linear' }
    }
  },
  scale: {
    subtle: {
      scale: [1, 1.1, 1],
      transition: { duration: 0.3 }
    },
    normal: {
      scale: [1, 1.2, 1],
      transition: { duration: 0.3 }
    },
    strong: {
      scale: [1, 1.3, 1],
      transition: { duration: 0.3 }
    }
  },
  slide: {
    subtle: {
      x: [0, 2, 0],
      transition: { duration: 0.4, repeat: Infinity, ease: 'easeInOut' }
    },
    normal: {
      x: [0, 4, 0],
      transition: { duration: 0.4, repeat: Infinity, ease: 'easeInOut' }
    },
    strong: {
      x: [0, 8, 0],
      transition: { duration: 0.4, repeat: Infinity, ease: 'easeInOut' }
    }
  },
  shake: {
    subtle: {
      x: [0, -1, 1, 0],
      transition: { duration: 0.5, repeat: Infinity }
    },
    normal: {
      x: [0, -2, 2, 0],
      transition: { duration: 0.4, repeat: Infinity }
    },
    strong: {
      x: [0, -4, 4, 0],
      transition: { duration: 0.3, repeat: Infinity }
    }
  },
  glow: {
    subtle: {
      filter: ['drop-shadow(0 0 2px currentColor)', 'drop-shadow(0 0 4px currentColor)', 'drop-shadow(0 0 2px currentColor)'],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
    },
    normal: {
      filter: ['drop-shadow(0 0 4px currentColor)', 'drop-shadow(0 0 8px currentColor)', 'drop-shadow(0 0 4px currentColor)'],
      transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
    },
    strong: {
      filter: ['drop-shadow(0 0 6px currentColor)', 'drop-shadow(0 0 12px currentColor)', 'drop-shadow(0 0 6px currentColor)'],
      transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' }
    }
  },
  flip: {
    subtle: {
      rotateY: [0, 180, 360],
      transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
    },
    normal: {
      rotateY: [0, 180, 360],
      transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' }
    },
    strong: {
      rotateY: [0, 180, 360],
      transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' }
    }
  },
  spin: {
    subtle: {
      rotate: 360,
      transition: { duration: 4, repeat: Infinity, ease: 'linear' }
    },
    normal: {
      rotate: 360,
      transition: { duration: 2, repeat: Infinity, ease: 'linear' }
    },
    strong: {
      rotate: 360,
      transition: { duration: 1, repeat: Infinity, ease: 'linear' }
    }
  }
};

const hoverVariants = {
  scale: { scale: 1.1 },
  lift: { y: -2, scale: 1.05 },
  glow: { filter: 'drop-shadow(0 0 8px currentColor)' },
  rotate: { rotate: 15 },
  bounce: { y: -4 }
};

const variantStyles = {
  default: 'text-foreground hover:text-primary',
  ghost: 'text-muted-foreground hover:text-foreground',
  outline: 'text-foreground border border-input hover:bg-accent hover:text-accent-foreground',
  destructive: 'text-destructive hover:text-destructive/80',
  secondary: 'text-secondary-foreground hover:text-primary'
};

export function AnimatedIcon({
  icon: Icon,
  size = 24,
  className,
  animation = 'none',
  trigger = 'hover',
  delay = 0,
  duration = 0.3,
  intensity = 'normal',
  color,
  hoverColor,
  disabled = false,
  loading = false,
  badge,
  tooltip,
  variant = 'default',
  onClick,
  onHover,
  onFocus
}: AnimatedIconProps) {
  const [isTriggered, setIsTriggered] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (trigger === 'auto') {
      const timer = setTimeout(() => setIsTriggered(true), delay);
      return () => clearTimeout(timer);
    }
    if (trigger === 'always') {
      setIsTriggered(true);
    }
  }, [trigger, delay]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (trigger === 'hover') setIsTriggered(true);
    onHover?.();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (trigger === 'hover') setIsTriggered(false);
  };

  const handleClick = () => {
    if (disabled) return;
    if (trigger === 'click') {
      setIsTriggered(!isTriggered);
    }
    onClick?.();
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (trigger === 'focus') setIsTriggered(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (trigger === 'focus') setIsTriggered(false);
  };

  const getAnimationVariant = () => {
    if (loading) return animationVariants.spin[intensity];
    if (animation === 'none') return {};
    if (!isTriggered && trigger !== 'always') return {};
    return animationVariants[animation]?.[intensity] || {};
  };

  const getHoverVariant = () => {
    if (disabled || !isHovered) return {};
    return hoverVariants.lift;
  };

  const iconColor = disabled 
    ? 'text-muted-foreground/50' 
    : isHovered && hoverColor 
      ? hoverColor 
      : color || variantStyles[variant];

  return (
    <div className="relative inline-block">
      <motion.div
        className={cn(
          'inline-flex items-center justify-center transition-colors duration-200',
          iconColor,
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          className
        )}
        animate={{
          ...getAnimationVariant(),
          ...getHoverVariant()
        }}
        whileHover={disabled ? {} : hoverVariants.lift}
        whileTap={disabled ? {} : { scale: 0.95 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{ 
          animationDelay: `${delay}ms`,
          animationDuration: `${duration}s`
        }}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick && !disabled ? 0 : undefined}
        aria-label={tooltip}
        title={tooltip}
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="animate-spin rounded-full border-2 border-current border-t-transparent" 
                   style={{ width: size, height: size }} />
            </motion.div>
          ) : (
            <motion.div
              key="icon"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Icon size={size} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Badge */}
        {badge && (
          <motion.div
            className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center px-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          >
            {badge}
          </motion.div>
        )}

        {/* Glow effect */}
        {animation === 'glow' && isTriggered && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                '0 0 0 0 currentColor',
                '0 0 8px 2px currentColor',
                '0 0 0 0 currentColor'
              ]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}

        {/* Focus ring */}
        {isFocused && (
          <motion.div
            className="absolute inset-0 rounded-md border-2 border-ring"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          />
        )}
      </motion.div>
    </div>
  );
}

// Preset animated icons for common use cases
export const IconPresets = {
  Loading: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon animation="spin" trigger="always" {...props} />
  ),
  Notification: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon animation="pulse" trigger="always" intensity="subtle" {...props} />
  ),
  Success: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon animation="bounce" trigger="auto" intensity="normal" {...props} />
  ),
  Warning: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon animation="shake" trigger="always" intensity="subtle" {...props} />
  ),
  Interactive: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon animation="scale" trigger="hover" intensity="subtle" {...props} />
  ),
  Magic: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon animation="glow" trigger="hover" intensity="normal" {...props} />
  ),
  Floating: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon animation="bounce" trigger="always" intensity="subtle" {...props} />
  )
};