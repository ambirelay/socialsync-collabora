import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'

export type Theme = 'light' | 'dark' | 'auto'

export interface ThemeConfig {
  theme: Theme
  systemTheme: 'light' | 'dark'
  effectiveTheme: 'light' | 'dark'
  accentColor?: string
  customColors?: Record<string, string>
  reducedMotion: boolean
  highContrast: boolean
}

export function useTheme() {
  const [themeConfig, setThemeConfig] = useKV<ThemeConfig>('theme-config', {
    theme: 'auto',
    systemTheme: 'light',
    effectiveTheme: 'light',
    reducedMotion: false,
    highContrast: false
  })

  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light')

  // Detect system theme preference
  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const updateSystemTheme = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? 'dark' : 'light'
      setSystemTheme(newSystemTheme)
      setThemeConfig(prev => ({
        ...prev,
        systemTheme: newSystemTheme,
        effectiveTheme: prev.theme === 'auto' ? newSystemTheme : (prev.theme as 'light' | 'dark')
      }))
    }

    // Initial check
    const initialSystemTheme = mediaQuery.matches ? 'dark' : 'light'
    setSystemTheme(initialSystemTheme)
    setThemeConfig(prev => ({
      ...prev,
      systemTheme: initialSystemTheme,
      effectiveTheme: prev.theme === 'auto' ? initialSystemTheme : (prev.theme as 'light' | 'dark')
    }))

    mediaQuery.addEventListener('change', updateSystemTheme)
    return () => mediaQuery.removeEventListener('change', updateSystemTheme)
  }, [setThemeConfig])

  // Detect reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateReducedMotion = (e: MediaQueryListEvent) => {
      setThemeConfig(prev => ({
        ...prev,
        reducedMotion: e.matches
      }))
    }

    // Initial check
    setThemeConfig(prev => ({
      ...prev,
      reducedMotion: mediaQuery.matches
    }))

    mediaQuery.addEventListener('change', updateReducedMotion)
    return () => mediaQuery.removeEventListener('change', updateReducedMotion)
  }, [setThemeConfig])

  // Apply theme to document
  useEffect(() => {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    const effectiveTheme = themeConfig.effectiveTheme

    // Remove existing theme classes
    root.classList.remove('light', 'dark', 'high-contrast', 'reduced-motion')

    // Apply theme
    root.classList.add(effectiveTheme)

    if (themeConfig.highContrast) {
      root.classList.add('high-contrast')
    }

    if (themeConfig.reducedMotion) {
      root.classList.add('reduced-motion')
    }

    // Apply custom colors if any
    if (themeConfig.customColors) {
      Object.entries(themeConfig.customColors).forEach(([property, value]) => {
        root.style.setProperty(`--${property}`, value)
      })
    }

    // Set theme-color meta tag for mobile browsers
    const themeColorMeta = document.querySelector('meta[name="theme-color"]')
    if (themeColorMeta) {
      const themeColor = effectiveTheme === 'dark' ? '#0a0a0a' : '#ffffff'
      themeColorMeta.setAttribute('content', themeColor)
    }
  }, [themeConfig])

  const setTheme = (newTheme: Theme) => {
    setThemeConfig(prev => ({
      ...prev,
      theme: newTheme,
      effectiveTheme: newTheme === 'auto' ? systemTheme : (newTheme as 'light' | 'dark')
    }))
  }

  const toggleTheme = () => {
    const currentEffective = themeConfig.effectiveTheme
    const newTheme = currentEffective === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  const setAccentColor = (color: string) => {
    setThemeConfig(prev => ({
      ...prev,
      accentColor: color,
      customColors: {
        ...prev.customColors,
        'color-primary': color
      }
    }))
  }

  const setHighContrast = (enabled: boolean) => {
    setThemeConfig(prev => ({
      ...prev,
      highContrast: enabled
    }))
  }

  const resetTheme = () => {
    setThemeConfig({
      theme: 'auto',
      systemTheme,
      effectiveTheme: systemTheme,
      reducedMotion: themeConfig.reducedMotion, // Keep system preference
      highContrast: false
    })
  }

  return {
    ...themeConfig,
    setTheme,
    toggleTheme,
    setAccentColor,
    setHighContrast,
    resetTheme,
    isDark: themeConfig.effectiveTheme === 'dark',
    isLight: themeConfig.effectiveTheme === 'light',
    isAuto: themeConfig.theme === 'auto'
  }
}