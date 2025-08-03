import { useState, useEffect, useCallback } from 'react'

interface AnimationConfig {
  duration?: number
  easing?: string
  delay?: number
}

interface SpringConfig {
  tension?: number
  friction?: number
  precision?: number
}

export function useAnimations() {
  const [animationQueue, setAnimationQueue] = useState<Array<() => void>>([])
  const [isAnimating, setIsAnimating] = useState(false)

  // Stagger animations for lists
  const staggerChildren = useCallback((
    elements: NodeListOf<Element> | Element[],
    config: AnimationConfig = {}
  ) => {
    const { duration = 300, easing = 'cubic-bezier(0.4, 0, 0.2, 1)', delay = 100 } = config
    
    Array.from(elements).forEach((element, index) => {
      const htmlElement = element as HTMLElement
      htmlElement.style.animationDelay = `${index * delay}ms`
      htmlElement.style.animationDuration = `${duration}ms`
      htmlElement.style.animationTimingFunction = easing
      htmlElement.classList.add('reveal-up')
    })
  }, [])

  // Smooth height transitions
  const animateHeight = useCallback((
    element: HTMLElement,
    targetHeight: number | 'auto',
    duration = 300
  ) => {
    return new Promise<void>((resolve) => {
      const startHeight = element.offsetHeight
      const endHeight = targetHeight === 'auto' 
        ? element.scrollHeight 
        : targetHeight

      element.style.height = `${startHeight}px`
      element.style.overflow = 'hidden'
      element.style.transition = `height ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`

      requestAnimationFrame(() => {
        element.style.height = `${endHeight}px`
      })

      setTimeout(() => {
        if (targetHeight === 'auto') {
          element.style.height = 'auto'
        }
        element.style.overflow = ''
        element.style.transition = ''
        resolve()
      }, duration)
    })
  }, [])

  // Smooth width transitions
  const animateWidth = useCallback((
    element: HTMLElement,
    targetWidth: number | 'auto',
    duration = 300
  ) => {
    return new Promise<void>((resolve) => {
      const startWidth = element.offsetWidth
      const endWidth = targetWidth === 'auto' 
        ? element.scrollWidth 
        : targetWidth

      element.style.width = `${startWidth}px`
      element.style.overflow = 'hidden'
      element.style.transition = `width ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`

      requestAnimationFrame(() => {
        element.style.width = `${endWidth}px`
      })

      setTimeout(() => {
        if (targetWidth === 'auto') {
          element.style.width = 'auto'
        }
        element.style.overflow = ''
        element.style.transition = ''
        resolve()
      }, duration)
    })
  }, [])

  // Fade transitions
  const fadeIn = useCallback((
    element: HTMLElement,
    duration = 300,
    startOpacity = 0
  ) => {
    return new Promise<void>((resolve) => {
      element.style.opacity = startOpacity.toString()
      element.style.transition = `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`

      requestAnimationFrame(() => {
        element.style.opacity = '1'
      })

      setTimeout(() => {
        element.style.transition = ''
        resolve()
      }, duration)
    })
  }, [])

  const fadeOut = useCallback((
    element: HTMLElement,
    duration = 300,
    endOpacity = 0
  ) => {
    return new Promise<void>((resolve) => {
      element.style.transition = `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`
      element.style.opacity = endOpacity.toString()

      setTimeout(() => {
        element.style.transition = ''
        resolve()
      }, duration)
    })
  }, [])

  // Scale animations
  const scaleIn = useCallback((
    element: HTMLElement,
    duration = 300,
    fromScale = 0.95
  ) => {
    return new Promise<void>((resolve) => {
      element.style.transform = `scale(${fromScale})`
      element.style.opacity = '0'
      element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`

      requestAnimationFrame(() => {
        element.style.transform = 'scale(1)'
        element.style.opacity = '1'
      })

      setTimeout(() => {
        element.style.transform = ''
        element.style.opacity = ''
        element.style.transition = ''
        resolve()
      }, duration)
    })
  }, [])

  const scaleOut = useCallback((
    element: HTMLElement,
    duration = 300,
    toScale = 0.95
  ) => {
    return new Promise<void>((resolve) => {
      element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`
      element.style.transform = `scale(${toScale})`
      element.style.opacity = '0'

      setTimeout(() => {
        element.style.transform = ''
        element.style.opacity = ''
        element.style.transition = ''
        resolve()
      }, duration)
    })
  }, [])

  // Slide animations
  const slideIn = useCallback((
    element: HTMLElement,
    direction: 'left' | 'right' | 'up' | 'down' = 'up',
    duration = 300,
    distance = 20
  ) => {
    return new Promise<void>((resolve) => {
      const transforms = {
        left: `translateX(-${distance}px)`,
        right: `translateX(${distance}px)`,
        up: `translateY(${distance}px)`,
        down: `translateY(-${distance}px)`
      }

      element.style.transform = transforms[direction]
      element.style.opacity = '0'
      element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`

      requestAnimationFrame(() => {
        element.style.transform = 'translate(0, 0)'
        element.style.opacity = '1'
      })

      setTimeout(() => {
        element.style.transform = ''
        element.style.opacity = ''
        element.style.transition = ''
        resolve()
      }, duration)
    })
  }, [])

  // Spring animation utility
  const spring = useCallback((
    element: HTMLElement,
    property: string,
    targetValue: string | number,
    config: SpringConfig = {}
  ) => {
    const { tension = 300, friction = 30, precision = 0.01 } = config
    
    return new Promise<void>((resolve) => {
      let currentValue = parseFloat(getComputedStyle(element)[property as any]) || 0
      const target = typeof targetValue === 'string' ? parseFloat(targetValue) : targetValue
      let velocity = 0
      
      const animate = () => {
        const spring = -tension * 0.000001 * (currentValue - target)
        const damper = -friction * 0.001 * velocity
        const acceleration = spring + damper
        
        velocity += acceleration
        currentValue += velocity
        
        if (property === 'opacity') {
          element.style.opacity = currentValue.toString()
        } else if (property.includes('transform')) {
          element.style.transform = `${property}(${currentValue}px)`
        } else {
          (element.style as any)[property] = `${currentValue}px`
        }
        
        if (Math.abs(velocity) > precision || Math.abs(target - currentValue) > precision) {
          requestAnimationFrame(animate)
        } else {
          resolve()
        }
      }
      
      animate()
    })
  }, [])

  // Morphing between states
  const morphShape = useCallback((
    element: HTMLElement,
    fromPath: string,
    toPath: string,
    duration = 500
  ) => {
    return new Promise<void>((resolve) => {
      const svg = element.querySelector('path')
      if (!svg) {
        resolve()
        return
      }

      let progress = 0
      const startTime = performance.now()

      const animate = (currentTime: number) => {
        progress = Math.min((currentTime - startTime) / duration, 1)
        const easeProgress = 1 - Math.pow(1 - progress, 3) // Ease out cubic
        
        // Simple path interpolation (in real app, use a proper library like flubber)
        svg.setAttribute('d', progress < 0.5 ? fromPath : toPath)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          resolve()
        }
      }

      requestAnimationFrame(animate)
    })
  }, [])

  // Parallax effect
  const parallax = useCallback((
    element: HTMLElement,
    speed = 0.5,
    offset = 0
  ) => {
    const updateParallax = () => {
      const scrolled = window.pageYOffset
      const rate = scrolled * -speed
      element.style.transform = `translateY(${rate + offset}px)`
    }

    window.addEventListener('scroll', updateParallax)
    return () => window.removeEventListener('scroll', updateParallax)
  }, [])

  // Intersection observer for scroll animations
  const observeIntersection = useCallback((
    element: HTMLElement,
    callback: (isIntersecting: boolean) => void,
    options: IntersectionObserverInit = {}
  ) => {
    const observer = new IntersectionObserver(
      ([entry]) => callback(entry.isIntersecting),
      { threshold: 0.1, rootMargin: '50px', ...options }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  // Queue animations
  const queueAnimation = useCallback((animation: () => void) => {
    setAnimationQueue(prev => [...prev, animation])
  }, [])

  // Process animation queue
  useEffect(() => {
    if (animationQueue.length > 0 && !isAnimating) {
      setIsAnimating(true)
      const nextAnimation = animationQueue[0]
      setAnimationQueue(prev => prev.slice(1))
      
      nextAnimation()
      
      setTimeout(() => {
        setIsAnimating(false)
      }, 100)
    }
  }, [animationQueue, isAnimating])

  // Accessibility: Respect reduced motion preferences
  const respectsReducedMotion = useCallback(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  return {
    staggerChildren,
    animateHeight,
    animateWidth,
    fadeIn,
    fadeOut,
    scaleIn,
    scaleOut,
    slideIn,
    spring,
    morphShape,
    parallax,
    observeIntersection,
    queueAnimation,
    respectsReducedMotion,
    isAnimating
  }
}