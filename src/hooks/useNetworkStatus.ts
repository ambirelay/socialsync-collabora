import { useState, useEffect } from 'react'

export interface NetworkQuality {
  type: 'slow-2g' | '2g' | '3g' | '4g' | 'wifi' | 'unknown'
  downlink: number
  rtt: number
  saveData: boolean
}

export interface NetworkStatus {
  isOnline: boolean
  connectionQuality: string
  networkInfo?: NetworkQuality
  lastOnline?: Date
  connectionStable: boolean
}

export function useNetworkStatus(): NetworkStatus {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    connectionQuality: 'good',
    connectionStable: true
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateNetworkStatus = () => {
      const isOnline = navigator.onLine
      let connectionQuality = 'good'
      let networkInfo: NetworkQuality | undefined

      // Check for Network Information API
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection

      if (connection) {
        networkInfo = {
          type: connection.effectiveType || 'unknown',
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0,
          saveData: connection.saveData || false
        }

        // Determine connection quality
        if (connection.effectiveType === 'slow-2g' || connection.downlink < 0.5) {
          connectionQuality = 'poor'
        } else if (connection.effectiveType === '2g' || connection.downlink < 1.5) {
          connectionQuality = 'fair'
        } else if (connection.effectiveType === '3g' || connection.downlink < 5) {
          connectionQuality = 'good'
        } else {
          connectionQuality = 'excellent'
        }
      }

      setNetworkStatus(prev => ({
        ...prev,
        isOnline,
        connectionQuality,
        networkInfo,
        lastOnline: isOnline ? new Date() : prev.lastOnline,
        connectionStable: isOnline
      }))
    }

    const handleOnline = () => updateNetworkStatus()
    const handleOffline = () => updateNetworkStatus()
    const handleConnectionChange = () => updateNetworkStatus()

    // Initial check
    updateNetworkStatus()

    // Event listeners
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Listen for connection changes if supported
    const connection = (navigator as any).connection
    if (connection) {
      connection.addEventListener('change', handleConnectionChange)
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange)
      }
    }
  }, [])

  return networkStatus
}