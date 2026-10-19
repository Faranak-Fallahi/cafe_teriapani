import { useState } from 'react'
import { Save, X } from 'lucide-react'

function getNumericPrice(product) {
  if (Number.isFinite(product.price)) return String(product.price)
  return (product.displayPrice || '').replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit))).replace(/\D/g, '')
}

export function QuickProductEditor({ product, onSave, onClose }) {
  const [name, setName] = useState(product.name)
  const [price, setPrice] = useState(getNumericPrice(product))
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await onSave({ ...product, name: name.trim(), price: Number(price) })
      onClose()
    } catch (saveError) {
      setError(saveError.message || 'ذخیره انجام نشد.')
    } finally { setBusy(false) }
  }

  return (
    <div className="admin-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <form className="admin-login-card" role="dialog" aria-modal="true" onSubmit={submit} aria-labelledby="quick-product-title">
        <button type="button" className="admin-modal-close" onClick={onClose} aria-label="بستن ویرایش"><X size={21} /></button>
        <h2 id="quick-product-title">ویرایش سریع محصول</h2>
        <label>نام محصول<input required value={name} onChange={(event) => setName(event.target.value)} /></label>
        <label>قیمت به تومان<input required type="number" inputMode="numeric" min="0" value={price} onChange={(event) => setPrice(event.target.value)} /></label>
        {error && <p className="admin-form-error" role="alert">{error}</p>}
        <button type="submit" className="admin-primary-button" disabled={busy}><Save size={17} /> {busy ? 'در حال ذخیره…' : 'ذخیره'}</button>
      </form>
    </div>
  )
}
