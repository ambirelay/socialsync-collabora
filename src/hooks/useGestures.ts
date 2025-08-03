import { useState, useEffect, useCallback, useRef } from 'react'

interface GestureState {
  startX: number
  startY: number
  currentX: number
  currentY: number
  deltaX: number
  deltaY: number
  distance: number
  isActive: boolean
  direction: 'up' | 'down' | 'left' | 'right' | null
  velocity: number
}

interface SwipeConfig {
  threshold?: number
  velocity?: number
  preventDefaultTouchmoveEvent?: boolean
  deltaThreshold?: number
}

interface PinchState {
  initialDistance: number
  currentDistance: number
  scale: number
  isActive: boolean
  centerX: number
  centerY: number
}

export function useGestures() {
  // Swipe gesture hook
  const useSwipe = useCallback((
    callbacks: {
      onSwipeLeft?: () => void
      onSwipeRight?: () => void
      onSwipeUp?: () => void
      onSwipeDown?: () => void
      onSwipeStart?: (gesture: GestureState) => void
      onSwipeMove?: (gesture: GestureState) => void
      onSwipeEnd?: (gesture: GestureState) => void
    },
    config: SwipeConfig = {}
  ) => {
    const {
      threshold = 50,
      velocity = 0.3,
      preventDefaultTouchmoveEvent = false,
      deltaThreshold = 10
    } = config

    const [gestureState, setGestureState] = useState<GestureState>({
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      deltaX: 0,
      deltaY: 0,
      distance: 0,
      isActive: false,
      direction: null,
      velocity: 0
    })

    const startTimeRef = useRef<number>(0)

    const handleTouchStart = useCallback((e: TouchEvent) => {
      const touch = e.touches[0]
      startTimeRef.current = Date.now()
      
      const newState: GestureState = {
        startX: touch.clientX,
        startY: touch.clientY,
        currentX: touch.clientX,
        currentY: touch.clientY,
        deltaX: 0,
        deltaY: 0,
        distance: 0,
        isActive: true,
        direction: null,
        velocity: 0
      }
      
      setGestureState(newState)
      callbacks.onSwipeStart?.(newState)
    }, [callbacks])

    const handleTouchMove = useCallback((e: TouchEvent) => {
      if (preventDefaultTouchmoveEvent) {
        e.preventDefault()
      }

      const touch = e.touches[0]
      const deltaX = touch.clientX - gestureState.startX
      const deltaY = touch.clientY - gestureState.startY
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      
      let direction: GestureState['direction'] = null
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? 'right' : 'left'
      } else if (Math.abs(deltaY) > deltaThreshold) {
        direction = deltaY > 0 ? 'down' : 'up'
      }

      const currentTime = Date.now()
      const timeDelta = currentTime - startTimeRef.current
      const currentVelocity = timeDelta > 0 ? distance / timeDelta : 0

      const newState: GestureState = {
        ...gestureState,
        currentX: touch.clientX,
        currentY: touch.clientY,
        deltaX,
        deltaY,
        distance,
        direction,
        velocity: currentVelocity
      }
      
      setGestureState(newState)
      callbacks.onSwipeMove?.(newState)
    }, [gestureState, preventDefaultTouchmoveEvent, deltaThreshold, callbacks])

    const handleTouchEnd = useCallback(() => {
      const { deltaX, deltaY, distance, velocity: gestureVelocity } = gestureState
      
      if (distance > threshold || gestureVelocity > velocity) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX > 0) {
            callbacks.onSwipeRight?.()
          } else {
            callbacks.onSwipeLeft?.()
          }
        } else {
          if (deltaY > 0) {
            callbacks.onSwipeDown?.()
          } else {
            callbacks.onSwipeUp?.()
          }
        }
      }

      const finalState = { ...gestureState, isActive: false }
      setGestureState(finalState)
      callbacks.onSwipeEnd?.(finalState)
    }, [gestureState, threshold, velocity, callbacks])

    return {
      gestureState,
      handlers: {
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd
      }
    }
  }, [])

  // Pinch gesture hook
  const usePinch = useCallback((
    callbacks: {
      onPinchStart?: (state: PinchState) => void
      onPinchMove?: (state: PinchState) => void
      onPinchEnd?: (state: PinchState) => void
    }
  ) => {
    const [pinchState, setPinchState] = useState<PinchState>({
      initialDistance: 0,
      currentDistance: 0,
      scale: 1,
      isActive: false,
      centerX: 0,
      centerY: 0
    })

    const getDistance = useCallback((touch1: Touch, touch2: Touch) => {
      return Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      )
    }, [])

    const getCenter = useCallback((touch1: Touch, touch2: Touch) => {
      return {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2
      }
    }, [])

    const handleTouchStart = useCallback((e: TouchEvent) => {
      if (e.touches.length !== 2) return

      const distance = getDistance(e.touches[0], e.touches[1])
      const center = getCenter(e.touches[0], e.touches[1])
      
      const newState: PinchState = {
        initialDistance: distance,
        currentDistance: distance,
        scale: 1,
        isActive: true,
        centerX: center.x,
        centerY: center.y
      }
      
      setPinchState(newState)
      callbacks.onPinchStart?.(newState)
    }, [getDistance, getCenter, callbacks])

    const handleTouchMove = useCallback((e: TouchEvent) => {
      if (e.touches.length !== 2 || !pinchState.isActive) return

      const currentDistance = getDistance(e.touches[0], e.touches[1])
      const center = getCenter(e.touches[0], e.touches[1])
      const scale = currentDistance / pinchState.initialDistance
      
      const newState: PinchState = {
        ...pinchState,
        currentDistance,
        scale,
        centerX: center.x,
        centerY: center.y
      }
      
      setPinchState(newState)
      callbacks.onPinchMove?.(newState)
    }, [pinchState, getDistance, getCenter, callbacks])

    const handleTouchEnd = useCallback(() => {
      const finalState = { ...pinchState, isActive: false }
      setPinchState(finalState)
      callbacks.onPinchEnd?.(finalState)
    }, [pinchState, callbacks])

    return {
      pinchState,
      handlers: {
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd
      }
    }
  }, [])

  // Long press gesture hook
  const useLongPress = useCallback((
    callback: (e: TouchEvent | MouseEvent) => void,
    duration = 500
  ) => {
    const [isPressed, setIsPressed] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout>()
    const eventRef = useRef<TouchEvent | MouseEvent>()

    const start = useCallback((e: TouchEvent | MouseEvent) => {
      setIsPressed(true)
      eventRef.current = e
      
      timeoutRef.current = setTimeout(() => {
        callback(e)
        setIsPressed(false)
      }, duration)
    }, [callback, duration])

    const cancel = useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setIsPressed(false)
    }, [])

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [])

    return {
      isPressed,
      handlers: {
        onMouseDown: start,
        onMouseUp: cancel,
        onMouseLeave: cancel,
        onTouchStart: start,
        onTouchEnd: cancel,
        onTouchCancel: cancel
      }
    }
  }, [])

  // Drag gesture hook
  const useDrag = useCallback((
    callbacks: {
      onDragStart?: (e: MouseEvent | TouchEvent) => void
      onDragMove?: (e: MouseEvent | TouchEvent, delta: { x: number; y: number }) => void
      onDragEnd?: (e: MouseEvent | TouchEvent) => void
    }
  ) => {
    const [isDragging, setIsDragging] = useState(false)
    const startPos = useRef({ x: 0, y: 0 })
    const currentPos = useRef({ x: 0, y: 0 })

    const getEventPosition = useCallback((e: MouseEvent | TouchEvent) => {
      if ('touches' in e) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
      return { x: e.clientX, y: e.clientY }
    }, [])

    const handleStart = useCallback((e: MouseEvent | TouchEvent) => {
      const pos = getEventPosition(e)
      startPos.current = pos
      currentPos.current = pos
      setIsDragging(true)
      callbacks.onDragStart?.(e)
    }, [getEventPosition, callbacks])

    const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
      if (!isDragging) return

      const pos = getEventPosition(e)
      const delta = {
        x: pos.x - currentPos.current.x,
        y: pos.y - currentPos.current.y
      }
      
      currentPos.current = pos
      callbacks.onDragMove?.(e, delta)
    }, [isDragging, getEventPosition, callbacks])

    const handleEnd = useCallback((e: MouseEvent | TouchEvent) => {
      if (!isDragging) return
      
      setIsDragging(false)
      callbacks.onDragEnd?.(e)
    }, [isDragging, callbacks])

    useEffect(() => {
      if (isDragging) {
        const handleMouseMove = (e: MouseEvent) => handleMove(e)
        const handleMouseUp = (e: MouseEvent) => handleEnd(e)
        const handleTouchMove = (e: TouchEvent) => handleMove(e)
        const handleTouchEnd = (e: TouchEvent) => handleEnd(e)

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
        document.addEventListener('touchmove', handleTouchMove, { passive: false })
        document.addEventListener('touchend', handleTouchEnd)

        return () => {
          document.removeEventListener('mousemove', handleMouseMove)
          document.removeEventListener('mouseup', handleMouseUp)
          document.removeEventListener('touchmove', handleTouchMove)
          document.removeEventListener('touchend', handleTouchEnd)
        }
      }
    }, [isDragging, handleMove, handleEnd])

    return {
      isDragging,
      handlers: {
        onMouseDown: handleStart,
        onTouchStart: handleStart
      }
    }
  }, [])

  // Double tap gesture hook
  const useDoubleTap = useCallback((
    callback: (e: TouchEvent | MouseEvent) => void,
    delay = 300
  ) => {
    const lastTapRef = useRef<number>(0)
    const timeoutRef = useRef<NodeJS.Timeout>()

    const handleTap = useCallback((e: TouchEvent | MouseEvent) => {
      const now = Date.now()
      const timeSinceLastTap = now - lastTapRef.current

      if (timeSinceLastTap < delay && timeSinceLastTap > 0) {
        callback(e)
        lastTapRef.current = 0
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      } else {
        lastTapRef.current = now
        timeoutRef.current = setTimeout(() => {
          lastTapRef.current = 0
        }, delay)
      }
    }, [callback, delay])

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [])

    return {
      handlers: {
        onClick: handleTap,
        onTouchEnd: handleTap
      }
    }
  }, [])

  return {
    useSwipe,
    usePinch,
    useLongPress,
    useDrag,
    useDoubleTap
  }
}