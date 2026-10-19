import { AlertTriangle } from 'lucide-react'

export function ConfirmDialog({ title = 'مطمئنی؟', message, onConfirm, onCancel, busy = false }) {
  return (
    <div className="admin-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel() }}>
      <section className="admin-login-card admin-confirm-card" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message">
        <span className="admin-modal-icon admin-warning-icon"><AlertTriangle size={24} aria-hidden="true" /></span>
        <h2 id="confirm-title">{title}</h2>
        <p id="confirm-message">{message}</p>
        <div className="admin-confirm-actions">
          <button type="button" className="admin-secondary-button" onClick={onCancel} disabled={busy}>انصراف</button>
          <button type="button" className="admin-danger-button" onClick={onConfirm} disabled={busy}>{busy ? 'در حال حذف…' : 'بله، حذف شود'}</button>
        </div>
      </section>
    </div>
  )
}
