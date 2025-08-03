import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Accessibility-focused icon component
interface AccessibleIconProps {
  icon: LucideIcon;
  label: string; // Always required for accessibility
  size?: number;
  className?: string;
  variant?: 'button' | 'decoration' | 'status' | 'navigation';
  state?: 'default' | 'active' | 'disabled' | 'loading' | 'error' | 'success';
  onClick?: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  tooltip?: string;
  description?: string;
  ariaExpanded?: boolean;
  ariaPressed?: boolean;
  ariaChecked?: boolean;
  disabled?: boolean;
  loading?: boolean;
  badge?: string | number;
  badgeAriaLabel?: string;
  animationPreference?: 'respect' | 'ignore'; // Respect user's motion preferences
  highContrast?: boolean;
  focusVisible?: boolean;
  role?: string;
  tabIndex?: number;
  id?: string;
}

export function AccessibleIcon({
  icon: Icon,
  label,
  size = 24,
  className,
  variant = 'decoration',
  state = 'default',
  onClick,
  onKeyDown,
  tooltip,
  description,
  ariaExpanded,
  ariaPressed,
  ariaChecked,
  disabled = false,
  loading = false,
  badge,
  badgeAriaLabel,
  animationPreference = 'respect',
  highContrast = false,
  focusVisible = true,
  role,
  tabIndex,
  id,
  ...props
}: AccessibleIconProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const iconRef = useRef<HTMLDivElement>(null);

  // Check for reduced motion preference
  useEffect(() => {
    if (animationPreference === 'respect') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      
      const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [animationPreference]);

  // Keyboard event handling
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;
    
    // Handle Space and Enter for button-like icons
    if ((event.key === ' ' || event.key === 'Enter') && onClick) {
      event.preventDefault();
      setIsPressed(true);
      onClick();
    }
    
    onKeyDown?.(event);
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'Enter') {
      setIsPressed(false);
    }
  };

  // Mouse event handling
  const handleClick = () => {
    if (disabled) return;
    onClick?.();
  };

  const handleMouseDown = () => {
    if (!disabled) setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleMouseEnter = () => {
    if (!disabled) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setIsPressed(false);
  };

  // Determine interactive properties
  const isInteractive = variant === 'button' || variant === 'navigation' || onClick;
  const shouldAnimate = !prefersReducedMotion || animationPreference === 'ignore';

  // Generate ARIA attributes
  const getAriaAttributes = () => {
    const attrs: Record<string, any> = {
      'aria-label': tooltip || label,
      'aria-hidden': variant === 'decoration' ? 'true' : undefined,
    };

    if (description) {
      attrs['aria-describedby'] = `${id}-description`;
    }

    if (ariaExpanded !== undefined) attrs['aria-expanded'] = ariaExpanded;
    if (ariaPressed !== undefined) attrs['aria-pressed'] = ariaPressed;
    if (ariaChecked !== undefined) attrs['aria-checked'] = ariaChecked;
    if (disabled) attrs['aria-disabled'] = 'true';
    if (loading) attrs['aria-busy'] = 'true';

    return attrs;
  };

  // Generate class names based on state and variant
  const getClassNames = () => {
    const baseClasses = [
      'inline-flex items-center justify-center relative transition-all duration-200',
      className
    ];

    // Variant-specific classes
    switch (variant) {
      case 'button':
        baseClasses.push(
          'rounded-md p-2 border',
          disabled 
            ? 'opacity-50 cursor-not-allowed border-input' 
            : 'cursor-pointer border-input hover:bg-accent hover:text-accent-foreground'
        );
        break;
      
      case 'navigation':
        baseClasses.push(
          'rounded-md p-1.5',
          disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'cursor-pointer hover:bg-accent hover:text-accent-foreground'
        );
        break;
    }

    // State-specific classes
    switch (state) {
      case 'active':
        baseClasses.push('bg-primary text-primary-foreground');
        break;
      case 'disabled':
        baseClasses.push('opacity-50 cursor-not-allowed');
        break;
      case 'loading':
        baseClasses.push('opacity-75');
        break;
      case 'error':
        baseClasses.push('text-destructive');
        break;
      case 'success':
        baseClasses.push('text-green-600');
        break;
    }

    // Focus classes
    if (isFocused && focusVisible) {
      baseClasses.push('ring-2 ring-ring ring-offset-2 ring-offset-background');
    }

    // High contrast support
    if (highContrast) {
      baseClasses.push('contrast-more:border-current contrast-more:bg-background');
    }

    return cn(...baseClasses);
  };

  // Animation variants
  const animationVariants = {
    hover: shouldAnimate ? {
      scale: 1.05,
      transition: { duration: 0.15, ease: 'easeOut' }
    } : {},
    tap: shouldAnimate ? {
      scale: 0.95,
      transition: { duration: 0.1, ease: 'easeInOut' }
    } : {},
    focus: shouldAnimate ? {
      scale: 1.02,
      transition: { duration: 0.15, ease: 'easeOut' }
    } : {}
  };

  // Loading animation
  const loadingVariants = shouldAnimate ? {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  } : {};

  return (
    <>
      <motion.div
        ref={iconRef}
        id={id}
        className={getClassNames()}
        role={role || (isInteractive ? 'button' : 'img')}
        tabIndex={disabled ? -1 : (tabIndex !== undefined ? tabIndex : (isInteractive ? 0 : -1))}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        animate={
          isPressed && shouldAnimate ? animationVariants.tap :
          isFocused && shouldAnimate ? animationVariants.focus :
          isHovered && shouldAnimate ? animationVariants.hover : 
          {}
        }
        {...getAriaAttributes()}
        {...props}
      >
        {/* Main icon */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              className="relative"
              {...(shouldAnimate ? loadingVariants : {})}
              initial={shouldAnimate ? { opacity: 0, scale: 0.8 } : {}}
              animate={shouldAnimate ? { opacity: 1, scale: 1 } : {}}
              exit={shouldAnimate ? { opacity: 0, scale: 0.8 } : {}}
            >
              <div 
                className="border-2 border-current border-t-transparent rounded-full animate-spin"
                style={{ width: size * 0.8, height: size * 0.8 }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="icon"
              initial={shouldAnimate ? { opacity: 0, scale: 0.8 } : {}}
              animate={shouldAnimate ? { opacity: 1, scale: 1 } : {}}
              exit={shouldAnimate ? { opacity: 0, scale: 0.8 } : {}}
            >
              <Icon 
                size={size}
                strokeWidth={state === 'active' ? 2.5 : 2}
                className={cn(
                  'transition-colors duration-200',
                  disabled && 'opacity-50'
                )}
                aria-hidden="true" // Icon is decorative, label provides the accessible name
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Badge */}
        {badge && (
          <motion.div
            className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 bg-destructive text-destructive-foreground text-xs font-medium rounded-full flex items-center justify-center px-1"
            initial={shouldAnimate ? { scale: 0, opacity: 0 } : {}}
            animate={shouldAnimate ? { scale: 1, opacity: 1 } : {}}
            transition={shouldAnimate ? { type: 'spring', stiffness: 500, damping: 15 } : {}}
            aria-label={badgeAriaLabel || `${badge} notifications`}
            role="status"
          >
            {badge}
          </motion.div>
        )}

        {/* Status indicator */}
        {(state === 'error' || state === 'success') && (
          <motion.div
            className={cn(
              'absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background',
              state === 'error' ? 'bg-destructive' : 'bg-green-500'
            )}
            initial={shouldAnimate ? { scale: 0 } : {}}
            animate={shouldAnimate ? { scale: 1 } : {}}
            transition={shouldAnimate ? { type: 'spring', stiffness: 300, damping: 15 } : {}}
            aria-hidden="true"
          />
        )}

        {/* Focus indicator for high contrast mode */}
        {isFocused && (
          <div className="absolute inset-0 border-2 border-transparent contrast-more:border-current rounded-md pointer-events-none" />
        )}
      </motion.div>

      {/* Hidden description for screen readers */}
      {description && (
        <span 
          id={`${id}-description`}
          className="sr-only"
        >
          {description}
        </span>
      )}
    </>
  );
}

// Preset accessible icon components
export const AccessibleIconPresets = {
  Button: (props: Omit<AccessibleIconProps, 'variant'>) => (
    <AccessibleIcon variant="button" {...props} />
  ),
  
  Navigation: (props: Omit<AccessibleIconProps, 'variant'>) => (
    <AccessibleIcon variant="navigation" {...props} />
  ),
  
  Status: (props: Omit<AccessibleIconProps, 'variant'>) => (
    <AccessibleIcon variant="status" {...props} />
  ),
  
  Decoration: (props: Omit<AccessibleIconProps, 'variant'>) => (
    <AccessibleIcon variant="decoration" {...props} />
  )
};

// Icon group component for managing multiple related icons
interface IconGroupProps {
  children: React.ReactNode;
  label: string;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'tight' | 'normal' | 'loose';
  className?: string;
}

export function IconGroup({
  children,
  label,
  orientation = 'horizontal',
  spacing = 'normal',
  className
}: IconGroupProps) {
  const spacingClasses = {
    tight: orientation === 'horizontal' ? 'gap-1' : 'gap-1',
    normal: orientation === 'horizontal' ? 'gap-2' : 'gap-2', 
    loose: orientation === 'horizontal' ? 'gap-4' : 'gap-4'
  };

  return (
    <div
      className={cn(
        'flex',
        orientation === 'horizontal' ? 'flex-row items-center' : 'flex-col items-start',
        spacingClasses[spacing],
        className
      )}
      role="group"
      aria-label={label}
    >
      {children}
    </div>
  );
}

// Icon with tooltip component
interface IconWithTooltipProps extends AccessibleIconProps {
  tooltipContent: React.ReactNode;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  tooltipDelay?: number;
}

export function IconWithTooltip({
  tooltipContent,
  tooltipSide = 'top',
  tooltipDelay = 700,
  ...iconProps
}: IconWithTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setShowTooltip(true);
    }, tooltipDelay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setShowTooltip(false);
  };

  const handleFocus = () => {
    setShowTooltip(true);
  };

  const handleBlur = () => {
    setShowTooltip(false);
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <AccessibleIcon {...iconProps} />
      
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className={cn(
              'absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg pointer-events-none',
              {
                'bottom-full left-1/2 transform -translate-x-1/2 mb-1': tooltipSide === 'top',
                'top-full left-1/2 transform -translate-x-1/2 mt-1': tooltipSide === 'bottom',
                'right-full top-1/2 transform -translate-y-1/2 mr-1': tooltipSide === 'left',
                'left-full top-1/2 transform -translate-y-1/2 ml-1': tooltipSide === 'right',
              }
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            role="tooltip"
          >
            {tooltipContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}