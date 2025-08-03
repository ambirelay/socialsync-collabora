import { useState, useEffect, useCallback, useRef } from 'react'

interface ScrollConfig {
  smooth?: boolean
  offset?: number
  duration?: number
}

interface ScrollMetrics {
  scrollY: number
  scrollX: number
  scrollDirection: 'up' | 'down' | 'left' | 'right' | null
  scrollVelocity: number
  isScrolling: boolean
  progress: number // 0-1 representing scroll progress through document
}

export function useScrollEnhancements() {
  const [scrollMetrics, setScrollMetrics] = useState<ScrollMetrics>({
    scrollY: 0,
    scrollX: 0,
    scrollDirection: null,
    scrollVelocity: 0,
    isScrolling: false,
    progress: 0
  })

  const lastScrollY = useRef(0)
  const lastScrollX = useRef(0)
  const lastTimestamp = useRef(0)
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()
  const rafRef = useRef<number>()

  // Smooth scroll to element with enhanced options
  const scrollToElement = useCallback((
    element: HTMLElement | string,
    config: ScrollConfig = {}
  ) => {
    const { smooth = true, offset = 0, duration = 800 } = config
    const target = typeof element === 'string' 
      ? document.querySelector(element) as HTMLElement
      : element

    if (!target) return

    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset
    const startPosition = window.pageYOffset
    const distance = targetPosition - startPosition

    if (!smooth) {
      window.scrollTo(0, targetPosition)
      return
    }

    const startTime = performance.now()

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeProgress = easeOutCubic(progress)
      
      window.scrollTo(0, startPosition + distance * easeProgress)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animateScroll)
      }
    }

    rafRef.current = requestAnimationFrame(animateScroll)
  }, [])

  // Smooth scroll to top
  const scrollToTop = useCallback((config: ScrollConfig = {}) => {
    scrollToElement(document.body, { ...config, offset: 0 })
  }, [scrollToElement])

  // Enhanced scroll spy
  const useScrollSpy = useCallback((
    selectors: string[],
    options: IntersectionObserverInit = {}
  ) => {
    const [activeId, setActiveId] = useState<string>('')

    useEffect(() => {
      const elements = selectors
        .map(selector => document.querySelector(selector))
        .filter(Boolean) as HTMLElement[]

      if (elements.length === 0) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id)
            }
          })
        },
        {
          rootMargin: '-20% 0px -35% 0px',
          threshold: 0.1,
          ...options
        }
      )

      elements.forEach(element => observer.observe(element))

      return () => observer.disconnect()
    }, [selectors, options])

    return activeId
  }, [])

  // Virtual scrolling for large lists
  const useVirtualScroll = useCallback((
    items: any[],
    itemHeight: number,
    containerHeight: number,
    overscan = 5
  ) => {
    const [scrollTop, setScrollTop] = useState(0)

    const visibleStart = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const visibleEnd = Math.min(
      items.length,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    )

    const visibleItems = items.slice(visibleStart, visibleEnd).map((item, index) => ({
      ...item,
      index: visibleStart + index
    }))

    const totalHeight = items.length * itemHeight
    const offsetY = visibleStart * itemHeight

    return {
      visibleItems,
      totalHeight,
      offsetY,
      onScroll: (e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop)
      }
    }
  }, [])

  // Infinite scroll hook
  const useInfiniteScroll = useCallback((
    callback: () => void,
    threshold = 100
  ) => {
    useEffect(() => {
      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement
        if (scrollHeight - scrollTop - clientHeight < threshold) {
          callback()
        }
      }

      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => window.removeEventListener('scroll', handleScroll)
    }, [callback, threshold])
  }, [])

  // Scroll lock functionality
  const useScrollLock = useCallback(() => {
    const [isLocked, setIsLocked] = useState(false)

    const lockScroll = useCallback(() => {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollBarWidth}px`
      setIsLocked(true)
    }, [])

    const unlockScroll = useCallback(() => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
      setIsLocked(false)
    }, [])

    useEffect(() => {
      return () => {
        if (isLocked) {
          unlockScroll()
        }
      }
    }, [isLocked, unlockScroll])

    return { isLocked, lockScroll, unlockScroll }
  }, [])

  // Momentum scrolling for touch devices
  const useMomentumScroll = useCallback((
    elementRef: React.RefObject<HTMLElement>,
    friction = 0.95,
    threshold = 0.1
  ) => {
    useEffect(() => {
      const element = elementRef.current
      if (!element) return

      let velocity = 0
      let lastY = 0
      let isTracking = false
      let animationId: number

      const handleTouchStart = (e: TouchEvent) => {
        isTracking = true
        lastY = e.touches[0].clientY
        velocity = 0
        if (animationId) cancelAnimationFrame(animationId)
      }

      const handleTouchMove = (e: TouchEvent) => {
        if (!isTracking) return
        const currentY = e.touches[0].clientY
        velocity = currentY - lastY
        lastY = currentY
      }

      const handleTouchEnd = () => {
        isTracking = false
        
        const animate = () => {
          if (Math.abs(velocity) > threshold) {
            element.scrollTop -= velocity
            velocity *= friction
            animationId = requestAnimationFrame(animate)
          }
        }
        
        animate()
      }

      element.addEventListener('touchstart', handleTouchStart, { passive: true })
      element.addEventListener('touchmove', handleTouchMove, { passive: true })
      element.addEventListener('touchend', handleTouchEnd, { passive: true })

      return () => {
        element.removeEventListener('touchstart', handleTouchStart)
        element.removeEventListener('touchmove', handleTouchMove)
        element.removeEventListener('touchend', handleTouchEnd)
        if (animationId) cancelAnimationFrame(animationId)
      }
    }, [elementRef, friction, threshold])
  }, [])

  // Update scroll metrics
  useEffect(() => {
    const updateScrollMetrics = () => {
      const currentScrollY = window.pageYOffset
      const currentScrollX = window.pageXOffset
      const currentTime = performance.now()

      const deltaY = currentScrollY - lastScrollY.current
      const deltaX = currentScrollX - lastScrollX.current
      const deltaTime = currentTime - lastTimestamp.current

      const velocity = deltaTime > 0 ? Math.abs(deltaY) / deltaTime : 0

      let direction: ScrollMetrics['scrollDirection'] = null
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        direction = deltaY > 0 ? 'down' : 'up'
      } else if (Math.abs(deltaX) > 0) {
        direction = deltaX > 0 ? 'right' : 'left'
      }

      const documentHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = documentHeight > 0 ? currentScrollY / documentHeight : 0

      setScrollMetrics({
        scrollY: currentScrollY,
        scrollX: currentScrollX,
        scrollDirection: direction,
        scrollVelocity: velocity,
        isScrolling: true,
        progress: Math.max(0, Math.min(1, progress))
      })

      lastScrollY.current = currentScrollY
      lastScrollX.current = currentScrollX
      lastTimestamp.current = currentTime

      // Clear scrolling state after inactivity
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        setScrollMetrics(prev => ({ ...prev, isScrolling: false, scrollVelocity: 0 }))
      }, 150)
    }

    const throttledUpdate = () => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        updateScrollMetrics()
        rafRef.current = undefined
      })
    }

    window.addEventListener('scroll', throttledUpdate, { passive: true })
    window.addEventListener('resize', throttledUpdate, { passive: true })

    return () => {
      window.removeEventListener('scroll', throttledUpdate)
      window.removeEventListener('resize', throttledUpdate)
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return {
    scrollMetrics,
    scrollToElement,
    scrollToTop,
    useScrollSpy,
    useVirtualScroll,
    useInfiniteScroll,
    useScrollLock,
    useMomentumScroll
  }
}