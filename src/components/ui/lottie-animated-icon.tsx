import React, { useState, useEffect, useRef, useMemo } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Pre-built Lottie animation data (you would normally import these from JSON files)
const lottieAnimations = {
  loading: {
    // Simplified loading animation data
    v: "5.7.4",
    fr: 60,
    ip: 0,
    op: 120,
    w: 24,
    h: 24,
    nm: "Loading",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Circle",
        sr: 1,
        ks: {
          o: { a: 0, k: 100, ix: 11 },
          r: { 
            a: 1, 
            k: [
              { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] },
              { t: 120, s: [360] }
            ], 
            ix: 10 
          },
          p: { a: 0, k: [12, 12, 0], ix: 2 },
          a: { a: 0, k: [0, 0, 0], ix: 1 },
          s: { a: 0, k: [100, 100, 100], ix: 6 }
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              {
                d: 1,
                ty: "el",
                s: { a: 0, k: [20, 20], ix: 2 },
                p: { a: 0, k: [0, 0], ix: 3 },
                nm: "Ellipse Path 1",
                mn: "ADBE Vector Shape - Ellipse",
                hd: false
              },
              {
                ty: "st",
                c: { a: 0, k: [0.2, 0.6, 1, 1], ix: 3 },
                o: { a: 0, k: 100, ix: 4 },
                w: { a: 0, k: 2, ix: 5 },
                lc: 2,
                lj: 2,
                bm: 0,
                nm: "Stroke 1",
                mn: "ADBE Vector Graphic - Stroke",
                hd: false
              },
              {
                ty: "tr",
                p: { a: 0, k: [0, 0], ix: 2 },
                a: { a: 0, k: [0, 0], ix: 1 },
                s: { a: 0, k: [100, 100], ix: 3 },
                r: { a: 0, k: 0, ix: 6 },
                o: { a: 0, k: 100, ix: 7 },
                sk: { a: 0, k: 0, ix: 4 },
                sa: { a: 0, k: 0, ix: 5 },
                nm: "Transform"
              }
            ],
            nm: "Ellipse 1",
            np: 3,
            cix: 2,
            bm: 0,
            ix: 1,
            mn: "ADBE Vector Group",
            hd: false
          }
        ],
        ip: 0,
        op: 120,
        st: 0,
        bm: 0
      }
    ],
    markers: []
  },
  
  success: {
    v: "5.7.4",
    fr: 60,
    ip: 0,
    op: 60,
    w: 24,
    h: 24,
    nm: "Success",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Check",
        sr: 1,
        ks: {
          o: { a: 0, k: 100, ix: 11 },
          r: { a: 0, k: 0, ix: 10 },
          p: { a: 0, k: [12, 12, 0], ix: 2 },
          a: { a: 0, k: [0, 0, 0], ix: 1 },
          s: { 
            a: 1,
            k: [
              { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [0, 0, 100] },
              { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 20, s: [120, 120, 100] },
              { t: 40, s: [100, 100, 100] }
            ],
            ix: 6
          }
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              {
                ind: 0,
                ty: "sh",
                ix: 1,
                ks: {
                  a: 1,
                  k: [
                    {
                      i: { x: 0.833, y: 0.833 },
                      o: { x: 0.167, y: 0.167 },
                      t: 10,
                      s: [{ i: [[0, 0], [0, 0], [0, 0]], o: [[0, 0], [0, 0], [0, 0]], v: [[-6, -2], [-6, -2], [-6, -2]], c: false }]
                    },
                    {
                      t: 50,
                      s: [{ i: [[0, 0], [0, 0], [0, 0]], o: [[0, 0], [0, 0], [0, 0]], v: [[-6, -2], [-2, 2], [6, -6]], c: false }]
                    }
                  ],
                  ix: 2
                },
                nm: "Path 1",
                mn: "ADBE Vector Shape - Group",
                hd: false
              },
              {
                ty: "st",
                c: { a: 0, k: [0.2, 0.8, 0.2, 1], ix: 3 },
                o: { a: 0, k: 100, ix: 4 },
                w: { a: 0, k: 3, ix: 5 },
                lc: 2,
                lj: 2,
                bm: 0,
                nm: "Stroke 1",
                mn: "ADBE Vector Graphic - Stroke",
                hd: false
              }
            ]
          }
        ]
      }
    ]
  }
};

interface LottieAnimatedIconProps {
  icon?: LucideIcon;
  lottieAnimation?: keyof typeof lottieAnimations | object;
  size?: number;
  className?: string;
  
  // Animation control
  autoplay?: boolean;
  loop?: boolean;
  speed?: number;
  direction?: 1 | -1;
  
  // Triggers
  trigger?: 'hover' | 'click' | 'focus' | 'auto' | 'always' | 'intersection';
  
  // Timing
  delay?: number;
  playOnce?: boolean;
  reverseOnLeave?: boolean;
  
  // Visual
  color?: string;
  backgroundColor?: string;
  variant?: 'default' | 'ghost' | 'outline' | 'destructive' | 'secondary';
  
  // States
  disabled?: boolean;
  loading?: boolean;
  
  // Interactive
  onClick?: () => void;
  onHover?: () => void;
  onComplete?: () => void;
  onSegmentStart?: () => void;
  
  // Segments (for complex animations)
  segments?: [number, number];
  initialSegment?: [number, number];
  hoverSegment?: [number, number];
  clickSegment?: [number, number];
  
  // Hybrid mode (combine Lottie with Lucide)
  hybridMode?: 'replace' | 'overlay' | 'background';
  fallbackIcon?: LucideIcon;
}

const variantStyles = {
  default: 'text-foreground hover:text-primary',
  ghost: 'text-muted-foreground hover:text-foreground',
  outline: 'text-foreground border border-input hover:bg-accent hover:text-accent-foreground rounded-md p-2',
  destructive: 'text-destructive hover:text-destructive/80',
  secondary: 'text-secondary-foreground hover:text-primary',
};

export function LottieAnimatedIcon({
  icon: Icon,
  lottieAnimation = 'loading',
  size = 24,
  className,
  autoplay = false,
  loop = false,
  speed = 1,
  direction = 1,
  trigger = 'hover',
  delay = 0,
  playOnce = false,
  reverseOnLeave = false,
  color,
  backgroundColor,
  variant = 'default',
  disabled = false,
  loading = false,
  onClick,
  onHover,
  onComplete,
  onSegmentStart,
  segments,
  initialSegment,
  hoverSegment,
  clickSegment,
  hybridMode = 'replace',
  fallbackIcon: FallbackIcon,
}: LottieAnimatedIconProps) {
  
  // State management
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Refs
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Get animation data
  const animationData = useMemo(() => {
    if (typeof lottieAnimation === 'string') {
      return lottieAnimations[lottieAnimation] || lottieAnimations.loading;
    }
    return lottieAnimation;
  }, [lottieAnimation]);
  
  // Animation control functions
  const playAnimation = (segment?: [number, number]) => {
    if (!lottieRef.current || disabled) return;
    
    setIsAnimating(true);
    
    if (segment) {
      lottieRef.current.playSegments(segment, true);
    } else if (segments) {
      lottieRef.current.playSegments(segments, true);
    } else {
      lottieRef.current.play();
    }
    
    if (playOnce) {
      setHasPlayed(true);
    }
  };
  
  const stopAnimation = () => {
    if (!lottieRef.current) return;
    
    if (reverseOnLeave) {
      lottieRef.current.setDirection(-1);
      lottieRef.current.play();
    } else {
      lottieRef.current.stop();
    }
    setIsAnimating(false);
  };
  
  const pauseAnimation = () => {
    if (!lottieRef.current) return;
    lottieRef.current.pause();
    setIsAnimating(false);
  };
  
  // Event handlers
  const handleMouseEnter = () => {
    setIsHovered(true);
    
    if (trigger === 'hover' && (!playOnce || !hasPlayed)) {
      setTimeout(() => {
        playAnimation(hoverSegment);
      }, delay);
    }
    
    onHover?.();
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    
    if (trigger === 'hover' && isAnimating) {
      if (reverseOnLeave) {
        stopAnimation();
      } else if (!loop) {
        pauseAnimation();
      }
    }
  };
  
  const handleClick = () => {
    if (disabled) return;
    
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
    
    if (trigger === 'click' && (!playOnce || !hasPlayed)) {
      playAnimation(clickSegment);
    }
    
    onClick?.();
  };
  
  const handleFocus = () => {
    setIsFocused(true);
    
    if (trigger === 'focus' && (!playOnce || !hasPlayed)) {
      playAnimation();
    }
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    
    if (trigger === 'focus' && isAnimating && !loop) {
      stopAnimation();
    }
  };
  
  const handleComplete = () => {
    setIsAnimating(false);
    onComplete?.();
  };
  
  const handleSegmentStart = () => {
    onSegmentStart?.();
  };
  
  // Auto-trigger effect
  useEffect(() => {
    if (trigger === 'auto' && (!playOnce || !hasPlayed)) {
      const timer = setTimeout(() => {
        playAnimation();
      }, delay);
      return () => clearTimeout(timer);
    }
    
    if (trigger === 'always') {
      playAnimation();
    }
  }, [trigger, delay, playOnce, hasPlayed]);
  
  // Intersection Observer for scroll trigger
  useEffect(() => {
    if (trigger !== 'intersection') return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!playOnce || !hasPlayed)) {
          setIsVisible(true);
          playAnimation();
        }
      },
      { threshold: 0.1 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, [trigger, playOnce, hasPlayed]);
  
  // Initial segment effect
  useEffect(() => {
    if (initialSegment && lottieRef.current) {
      lottieRef.current.playSegments(initialSegment, true);
      lottieRef.current.pause();
    }
  }, [initialSegment]);
  
  // Loading state override
  useEffect(() => {
    if (loading && lottieRef.current) {
      playAnimation();
    }
  }, [loading]);
  
  const containerClasses = cn(
    'inline-flex items-center justify-center transition-colors duration-200 relative',
    variantStyles[variant],
    disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
    className
  );
  
  const shouldShowLottie = !disabled && animationData && (isAnimating || autoplay || trigger === 'always' || loading);
  const shouldShowIcon = Icon && (hybridMode !== 'replace' || !shouldShowLottie);
  const shouldShowFallback = FallbackIcon && !shouldShowLottie && !shouldShowIcon;
  
  return (
    <div 
      ref={containerRef}
      className={containerClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      style={{ 
        width: size, 
        height: size,
        backgroundColor: backgroundColor 
      }}
    >
      <AnimatePresence mode="wait">
        {/* Lottie Animation */}
        {shouldShowLottie && (
          <motion.div
            key="lottie"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className={cn(
              hybridMode === 'background' ? 'absolute inset-0' : 'relative',
              hybridMode === 'overlay' ? 'absolute inset-0 z-10' : ''
            )}
            style={{ 
              width: size, 
              height: size,
              filter: color ? `hue-rotate(${color})` : undefined
            }}
          >
            <Lottie
              lottieRef={lottieRef}
              animationData={animationData}
              autoplay={autoplay || trigger === 'always' || loading}
              loop={loop}
              speed={speed}
              direction={direction}
              onComplete={handleComplete}
              onSegmentStart={handleSegmentStart}
              style={{ 
                width: size, 
                height: size 
              }}
              className="pointer-events-none"
            />
          </motion.div>
        )}
        
        {/* Lucide Icon */}
        {shouldShowIcon && (
          <motion.div
            key="icon"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className={cn(
              hybridMode === 'overlay' ? 'relative z-20' : 'relative',
              hybridMode === 'background' ? 'z-10' : ''
            )}
          >
            <Icon 
              size={hybridMode === 'overlay' ? size * 0.6 : size} 
              color={color}
            />
          </motion.div>
        )}
        
        {/* Fallback Icon */}
        {shouldShowFallback && (
          <motion.div
            key="fallback"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <FallbackIcon size={size} color={color} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Focus ring */}
      {isFocused && (
        <motion.div
          className="absolute inset-0 rounded-md border-2 border-ring"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        />
      )}
      
      {/* Click feedback */}
      {isClicked && (
        <motion.div
          className="absolute inset-0 bg-primary/20 rounded-md"
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.15 }}
        />
      )}
    </div>
  );
}

// Preset Lottie animated icons
export const LottieIconPresets = {
  LoadingSpinner: (props: Partial<LottieAnimatedIconProps>) => (
    <LottieAnimatedIcon 
      lottieAnimation="loading" 
      autoplay 
      loop 
      trigger="always" 
      {...props} 
    />
  ),
  
  SuccessCheck: (props: Partial<LottieAnimatedIconProps>) => (
    <LottieAnimatedIcon 
      lottieAnimation="success" 
      trigger="auto" 
      playOnce 
      delay={200}
      {...props} 
    />
  ),
  
  HoverButton: (props: Partial<LottieAnimatedIconProps>) => (
    <LottieAnimatedIcon 
      trigger="hover" 
      reverseOnLeave 
      speed={1.5}
      {...props} 
    />
  ),
  
  ClickAnimation: (props: Partial<LottieAnimatedIconProps>) => (
    <LottieAnimatedIcon 
      trigger="click" 
      playOnce 
      speed={2}
      {...props} 
    />
  ),
  
  ScrollReveal: (props: Partial<LottieAnimatedIconProps>) => (
    <LottieAnimatedIcon 
      trigger="intersection" 
      playOnce 
      delay={300}
      {...props} 
    />
  ),
  
  HybridIcon: (props: Partial<LottieAnimatedIconProps>) => (
    <LottieAnimatedIcon 
      hybridMode="overlay" 
      trigger="hover" 
      reverseOnLeave
      {...props} 
    />
  ),
};