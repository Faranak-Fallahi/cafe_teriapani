export function AdminEntryButton({ visible, isAdmin, onClick, variant = 'floating' }) {
  if (!visible) return null

  return (
    <button type="button" className={variant === 'footer' ? 'admin-entry-link' : 'admin-entry-floating'} onClick={onClick}>
      {isAdmin ? 'پنل مدیریت' : 'ورود مدیر'}
    </button>
  )
}
