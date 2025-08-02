import { useEffect } from 'react'
import { toast } from 'sonner'

interface UseKeyboardShortcutsProps {
  onCreatePost: () => void
  onOpenSettings: () => void
  onToggleNotifications: () => void
  isDialogOpen: boolean
}

export function useKeyboardShortcuts({
  onCreatePost,
  onOpenSettings,
  onToggleNotifications,
  isDialogOpen
}: UseKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when dialogs are open or when typing in inputs
      if (isDialogOpen || 
          event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLSelectElement) {
        return
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const modifierKey = isMac ? event.metaKey : event.ctrlKey

      if (modifierKey) {
        switch (event.key.toLowerCase()) {
          case 'n':
            event.preventDefault()
            onCreatePost()
            toast.success('Creating new post...', { duration: 1000 })
            break
          case ',':
            event.preventDefault()
            onOpenSettings()
            break
          case 'b':
            event.preventDefault()
            onToggleNotifications()
            break
        }
      }

      // Help shortcut (no modifier needed)
      if (event.key === '?' && !event.shiftKey) {
        event.preventDefault()
        showKeyboardShortcuts()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCreatePost, onOpenSettings, onToggleNotifications, isDialogOpen])
}

function showKeyboardShortcuts() {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const modKey = isMac ? '⌘' : 'Ctrl'
  
  toast.info(
    <div className="space-y-2">
      <div className="font-semibold">Keyboard Shortcuts</div>
      <div className="space-y-1 text-xs">
        <div><strong>{modKey} + N</strong> - New post</div>
        <div><strong>{modKey} + B</strong> - Toggle notifications</div>
        <div><strong>{modKey} + ,</strong> - Open settings</div>
        <div><strong>?</strong> - Show this help</div>
      </div>
    </div>,
    { duration: 5000 }
  )
}