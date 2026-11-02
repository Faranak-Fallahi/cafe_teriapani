import { forwardRef } from 'react'
import { ArrowRight, X } from 'lucide-react'

export const BackButton = forwardRef(function BackButton({ onClick, label = 'بازگشت', variant = 'back', className = '' }, ref) {
  const Icon = variant === 'close' ? X : ArrowRight

  return (
    <button
      ref={ref}
      type="button"
      className={`page-back-button ${className}`.trim()}
      onClick={onClick}
      aria-label={label}
    >
      <Icon size={22} aria-hidden="true" />
    </button>
  )
})
