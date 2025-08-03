import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSpring, animated, useSpringValue, useChain, useSpringRef } from '@react-spring/web';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
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
  
  // Physics-based properties
  tension?: number;
  friction?: number;
  mass?: number;
  velocity?: number;
  
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

// Physics presets for spring animations
const springPresets = {
  gentle: { tension: 120, friction: 14, mass: 1 },
  wobbly: { tension: 180, friction: 12, mass: 1 },
  stiff: { tension: 210, friction: 20, mass: 1 },
  slow: { tension: 280, friction: 60, mass: 1 },
  molasses: { tension: 280, friction: 120, mass: 1 },
  bouncy: { tension: 300, friction: 10, mass: 1 },
  elastic: { tension: 400, friction: 8, mass: 0.8 },
  snappy: { tension: 500, friction: 30, mass: 0.5 },
};

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

export function EnhancedAnimatedIcon({
  icon: Icon,
  size = 24,
  className,
  animation = 'none',
  trigger = 'hover',
  tension = 180,
  friction = 12,
  mass = 1,
  velocity = 0,
  delay = 0,
  duration = 0.6,
  stagger = 0,
  intensity = 'normal',
  easing = 'elasticOut',
  color,
  hoverColor,
  glowColor,
  shadowColor,
  disabled = false,
  loading = false,
  active = false,
  badge,
  tooltip,
  variant = 'default',
  onClick,
  onHover,
  onFocus,
  onAnimationComplete,
  magneticStrength = 0.3,
  particleCount = 6,
  morphTarget,
  trail = false,
  reflect = false,
  perspective = false,
}: EnhancedAnimatedIconProps) {
  
  // State management
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Refs
  const iconRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Spring refs for chaining
  const springRef = useSpringRef();
  const trailRef = useSpringRef();
  
  // Get intensity values
  const intensityValues = intensityMap[intensity];
  
  // Motion values for magnetic effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const magneticX = useTransform(mouseX, [-100, 100], [-intensityValues.translate * magneticStrength, intensityValues.translate * magneticStrength]);
  const magneticY = useTransform(mouseY, [-100, 100], [-intensityValues.translate * magneticStrength, intensityValues.translate * magneticStrength]);
  
  // Main spring animation
  const [springs, api] = useSpring(() => ({
    ref: springRef,
    from: { 
      scale: 1, 
      rotate: 0, 
      x: 0, 
      y: 0, 
      opacity: 1,
      filter: 'blur(0px) brightness(1) saturate(1)',
      boxShadow: '0px 0px 0px rgba(0,0,0,0)',
    },
    config: { tension, friction, mass, velocity },
    onRest: onAnimationComplete,
  }));
  
  // Particle springs for complex animations
  const [particleSprings] = useSpring(() => ({
    ref: trailRef,
    from: { opacity: 0, scale: 0, rotate: 0 },
    to: { opacity: 1, scale: 1, rotate: 360 },
    config: springPresets.elastic,
    loop: animation === 'particleFloat',
  }));
  
  // Chain animations
  useChain([springRef, trailRef], [0, stagger]);
  
  // Enhanced animation definitions
  const animations = useMemo(() => ({
    elasticBounce: {
      scale: isHovered ? 1 + intensityValues.scale * 0.2 : 1,
      y: isHovered ? -intensityValues.translate * 2 : 0,
      config: springPresets.elastic,
    },
    magneticHover: {
      x: isHovered ? magneticX.get() : 0,
      y: isHovered ? magneticY.get() : 0,
      scale: isHovered ? 1 + intensityValues.scale * 0.1 : 1,
      config: springPresets.wobbly,
    },
    liquidMorph: {
      scale: isHovered ? [1, 1.3, 1.1] : [1],
      rotate: isHovered ? [0, 10, -5, 0] : [0],
      config: springPresets.gentle,
    },
    breathe: {
      scale: [1, 1 + intensityValues.scale * 0.05, 1],
      opacity: [1, 0.8, 1],
      config: springPresets.gentle,
      loop: trigger === 'always',
    },
    heartbeat: {
      scale: [1, 1.1, 1, 1.05, 1],
      config: springPresets.stiff,
      loop: trigger === 'always',
    },
    ripple: {
      scale: isHovered ? [1, 1.4, 1] : [1],
      opacity: isHovered ? [1, 0.6, 1] : [1],
      config: springPresets.wobbly,
    },
    orbitalRotate: {
      rotate: trigger === 'always' ? 360 : isHovered ? intensityValues.rotate * 4 : 0,
      x: trigger === 'always' ? [0, 10, 0, -10, 0] : [0],
      y: trigger === 'always' ? [0, -10, 0, 10, 0] : [0],
      config: springPresets.gentle,
      loop: trigger === 'always',
    },
    wobble: {
      rotate: isHovered ? [0, -5, 3, -2, 1, 0] : [0],
      x: isHovered ? [0, 2, -2, 1, 0] : [0],
      config: springPresets.bouncy,
    },
    pendulum: {
      rotate: trigger === 'always' ? [0, 20, -20, 0] : isHovered ? [0, 15, 0] : [0],
      config: springPresets.gentle,
      loop: trigger === 'always',
    },
    rubber: {
      scale: isClicked ? [1, 1.4, 0.8, 1.2, 1] : isHovered ? [1, 1.1, 1] : [1],
      config: springPresets.bouncy,
    },
    jello: {
      scale: isHovered ? [1, 1.1, 0.9, 1.05, 1] : [1],
      rotate: isHovered ? [0, -5, 5, -2, 0] : [0],
      config: springPresets.wobbly,
    },
    glitch: {
      x: isHovered ? [0, -2, 2, -1, 1, 0] : [0],
      filter: isHovered ? 'blur(0.5px) brightness(1.2) saturate(1.5)' : 'blur(0px) brightness(1) saturate(1)',
      config: { tension: 500, friction: 10 },
    },
    neon: {
      filter: isHovered 
        ? `blur(0px) brightness(1.5) saturate(2) drop-shadow(0 0 ${intensityValues.glow}px currentColor)`
        : 'blur(0px) brightness(1) saturate(1)',
      scale: isHovered ? 1 + intensityValues.scale * 0.05 : 1,
      config: springPresets.gentle,
    },
    hologram: {
      opacity: trigger === 'always' ? [0.7, 1, 0.7] : isHovered ? [1, 0.8, 1] : [1],
      filter: trigger === 'always' 
        ? 'blur(0px) brightness(1.2) saturate(1.8) hue-rotate(10deg)'
        : isHovered 
          ? 'blur(0px) brightness(1.1) saturate(1.3)'
          : 'blur(0px) brightness(1) saturate(1)',
      config: springPresets.gentle,
      loop: trigger === 'always',
    },
    levitate: {
      y: trigger === 'always' ? [0, -8, 0] : isHovered ? -intensityValues.translate : 0,
      boxShadow: trigger === 'always' || isHovered
        ? `0px ${8 + intensityValues.glow}px ${16 + intensityValues.glow}px rgba(0,0,0,0.2)`
        : '0px 0px 0px rgba(0,0,0,0)',
      config: springPresets.gentle,
      loop: trigger === 'always',
    },
    pulse3D: {
      scale: trigger === 'always' ? [1, 1.1, 1] : isHovered ? [1, 1.05, 1] : [1],
      filter: trigger === 'always' || isHovered
        ? `blur(0px) brightness(1.2) drop-shadow(0 0 ${intensityValues.glow}px currentColor)`
        : 'blur(0px) brightness(1)',
      config: springPresets.gentle,
      loop: trigger === 'always',
    },
  }), [isHovered, isClicked, trigger, intensityValues, magneticX, magneticY]);
  
  // Get current animation
  const currentAnimation = animations[animation as keyof typeof animations] || {};
  
  // Apply animation to spring
  useEffect(() => {
    if (animation !== 'none' && currentAnimation) {
      api.start(currentAnimation);
    }
  }, [animation, currentAnimation, api]);
  
  // Handle mouse movement for magnetic effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || animation !== 'magneticHover') return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    
    mouseX.set(deltaX);
    mouseY.set(deltaY);
    setMousePosition({ x: deltaX, y: deltaY });
  };
  
  // Event handlers
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (trigger === 'hover') {
      api.start(currentAnimation);
    }
    onHover?.();
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    if (trigger === 'hover') {
      api.start({ 
        scale: 1, 
        rotate: 0, 
        x: 0, 
        y: 0, 
        opacity: 1,
        filter: 'blur(0px) brightness(1) saturate(1)',
        boxShadow: '0px 0px 0px rgba(0,0,0,0)',
      });
    }
    mouseX.set(0);
    mouseY.set(0);
  };
  
  const handleClick = () => {
    if (disabled) return;
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
    
    if (trigger === 'click') {
      api.start(currentAnimation);
    }
    onClick?.();
  };
  
  const handleFocus = () => {
    setIsFocused(true);
    if (trigger === 'focus') {
      api.start(currentAnimation);
    }
    onFocus?.();
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    if (trigger === 'focus') {
      api.start({ 
        scale: 1, 
        rotate: 0, 
        x: 0, 
        y: 0, 
        opacity: 1,
        filter: 'blur(0px) brightness(1) saturate(1)',
        boxShadow: '0px 0px 0px rgba(0,0,0,0)',
      });
    }
  };
  
  // Auto-trigger effect
  useEffect(() => {
    if (trigger === 'auto') {
      const timer = setTimeout(() => {
        api.start(currentAnimation);
      }, delay);
      return () => clearTimeout(timer);
    }
    
    if (trigger === 'always') {
      api.start(currentAnimation);
    }
  }, [trigger, delay, currentAnimation, api]);
  
  // Intersection Observer for scroll trigger
  useEffect(() => {
    if (trigger !== 'scroll') return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          api.start(currentAnimation);
        }
      },
      { threshold: 0.1 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, [trigger, currentAnimation, api]);
  
  // Icon color logic
  const iconColor = disabled 
    ? 'text-muted-foreground/50' 
    : isHovered && hoverColor 
      ? hoverColor 
      : color || variantStyles[variant];
  
  return (
    <div 
      ref={containerRef}
      className="relative inline-block"
      onMouseMove={handleMouseMove}
    >
      <animated.div
        ref={iconRef}
        className={cn(
          'inline-flex items-center justify-center transition-colors duration-200',
          iconColor,
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          perspective && 'transform-gpu perspective-1000',
          className
        )}
        style={{
          transform: animation === 'magneticHover' 
            ? `translate3d(${magneticX.get()}px, ${magneticY.get()}px, 0)`
            : undefined,
          ...springs,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
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
              <div 
                className="animate-spin rounded-full border-2 border-current border-t-transparent" 
                style={{ 
                  width: typeof size === 'number' ? size : 24, 
                  height: typeof size === 'number' ? size : 24 
                }} 
              />
            </motion.div>
          ) : morphTarget && isHovered ? (
            <motion.div
              key="morph"
              initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 180 }}
              transition={{ duration: 0.3, ease: 'backOut' }}
            >
              <morphTarget size={size} />
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
        
        {/* Reflection effect */}
        {reflect && (
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)',
              clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0% 100%)',
            }}
          />
        )}
        
        {/* Trail effect */}
        {trail && (isHovered || trigger === 'always') && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 3 }).map((_, i) => (
              <animated.div
                key={i}
                className="absolute inset-0 opacity-30"
                style={{
                  ...particleSprings,
                  transform: `scale(${0.8 - i * 0.1}) translateX(${-i * 2}px) translateY(${-i * 2}px)`,
                  animationDelay: `${i * 50}ms`,
                }}
              >
                <Icon size={size} />
              </animated.div>
            ))}
          </div>
        )}
      </animated.div>
      
      {/* Badge */}
      {badge && (
        <motion.div
          className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center px-1 shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        >
          {badge}
        </motion.div>
      )}
      
      {/* Particle effects */}
      {animation === 'particleFloat' && (isHovered || trigger === 'always') && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: particleCount }).map((_, i) => (
            <animated.div
              key={i}
              className="absolute w-1 h-1 bg-current rounded-full opacity-60"
              style={{
                ...particleSprings,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 100}ms`,
              }}
            />
          ))}
        </div>
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
    </div>
  );
}

// Enhanced presets with new animations
export const EnhancedIconPresets = {
  MagneticButton: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="magneticHover" trigger="hover" intensity="subtle" {...props} />
  ),
  ElasticBounce: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="elasticBounce" trigger="hover" intensity="normal" {...props} />
  ),
  BreathingIcon: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="breathe" trigger="always" intensity="subtle" {...props} />
  ),
  HeartbeatNotification: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="heartbeat" trigger="always" intensity="normal" {...props} />
  ),
  LiquidMorph: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="liquidMorph" trigger="hover" intensity="strong" {...props} />
  ),
  OrbitalLoader: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="orbitalRotate" trigger="always" intensity="normal" {...props} />
  ),
  RubberClick: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="rubber" trigger="click" intensity="strong" {...props} />
  ),
  JelloHover: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="jello" trigger="hover" intensity="normal" {...props} />
  ),
  GlitchEffect: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="glitch" trigger="hover" intensity="strong" {...props} />
  ),
  NeonGlow: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="neon" trigger="always" intensity="normal" {...props} />
  ),
  HologramFlicker: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="hologram" trigger="always" intensity="subtle" {...props} />
  ),
  LevitatingIcon: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="levitate" trigger="always" intensity="normal" {...props} />
  ),
  Pulse3D: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="pulse3D" trigger="always" intensity="subtle" {...props} />
  ),
  ParticleFloat: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="particleFloat" trigger="hover" intensity="normal" particleCount={8} {...props} />
  ),
};