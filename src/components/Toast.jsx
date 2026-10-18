import { useEffect } from 'react'
import { Check } from 'lucide-react'

export function Toast({ message, onDismiss }) {
  useEffect(() => {
    if (!message) return undefined
    const timeoutId = window.setTimeout(onDismiss, 3000)
    return () => window.clearTimeout(timeoutId)
  }, [message, onDismiss])

  if (!message) return null

  return (
    <div className="toast-message" role="status" aria-live="polite">
      <Check size={18} aria-hidden="true" />
      <span>{message}</span>
    </div>
  )
}
