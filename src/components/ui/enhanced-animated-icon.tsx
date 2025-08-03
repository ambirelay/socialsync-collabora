import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedAnimatedIconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  animation?: 'none' | 'bounce' | 'pulse' | 'spin' | 'fade' | 'scale' | 'glow';
  trigger?: 'none' | 'hover' | 'click' | 'always';
  intensity?: 'minimal' | 'subtle' | 'normal' | 'strong';
  duration?: number;
  color?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const EnhancedAnimatedIcon = forwardRef<HTMLButtonElement, EnhancedAnimatedIconProps>(({
  icon: Icon,
  size = 24,
  className,
  animation = 'none',
  trigger = 'none',
  intensity = 'normal',
  duration = 300,
  color,
  onClick,
  disabled = false,
  ...props
}, ref) => {
  const getAnimationClass = () => {
    if (animation === 'none' || trigger === 'none') return '';
    
    const baseClass = 'transition-all duration-300 ease-in-out';
    const triggerClass = trigger === 'hover' ? 'hover:' : trigger === 'click' ? 'active:' : '';
    
    switch (animation) {
      case 'bounce':
        return `${baseClass} ${triggerClass}animate-bounce`;
      case 'pulse':
        return `${baseClass} ${triggerClass}animate-pulse`;
      case 'spin':
        return `${baseClass} ${triggerClass}animate-spin`;
      case 'fade':
        return `${baseClass} ${triggerClass}opacity-70`;
      case 'scale':
        return `${baseClass} ${triggerClass}scale-110`;
      case 'glow':
        return `${baseClass} ${triggerClass}drop-shadow-lg`;
      default:
        return baseClass;
    }
  };

  const intensityMultiplier = {
    minimal: 0.5,
    subtle: 0.75,
    normal: 1,
    strong: 1.25
  }[intensity];

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      ref={onClick ? ref : undefined}
      className={cn(
        'inline-flex items-center justify-center',
        getAnimationClass(),
        disabled && 'opacity-50 cursor-not-allowed',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        color,
        animationDuration: `${duration * intensityMultiplier}ms`,
      }}
      {...props}
    >
      <Icon size={size} />
    </Component>
  );
});

EnhancedAnimatedIcon.displayName = "EnhancedAnimatedIcon";

// Icon Presets for common use cases
export const EnhancedIconPresets = {
  NeonGlow: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="glow" trigger="always" intensity="normal" {...props} />
  ),
  
  ElasticButton: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="bounce" trigger="click" intensity="strong" {...props} />
  ),
  
  MagneticHover: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="scale" trigger="hover" intensity="subtle" {...props} />
  ),
  
  HeartbeatNotification: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="pulse" trigger="always" intensity="subtle" {...props} />
  ),
  
  SpinningLoader: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="spin" trigger="always" intensity="normal" {...props} />
  ),
  
  FloatingIcon: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="bounce" trigger="always" intensity="minimal" {...props} />
  ),
  
  BreathingIcon: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="pulse" trigger="always" intensity="subtle" {...props} />
  ),
  
  HologramIcon: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="fade" trigger="always" intensity="subtle" {...props} />
  ),
  
  Pulse3D: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="pulse" trigger="always" intensity="minimal" {...props} />
  ),
  
  WobbleHover: (props: Partial<EnhancedAnimatedIconProps>) => (
    <EnhancedAnimatedIcon animation="scale" trigger="hover" intensity="normal" {...props} />
  )
};

export { EnhancedAnimatedIcon };
export default EnhancedAnimatedIcon;