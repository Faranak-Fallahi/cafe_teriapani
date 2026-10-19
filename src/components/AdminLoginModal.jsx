import { useState } from 'react'
import { LockKeyhole, X } from 'lucide-react'
import { isSupabaseConfigured } from '../supabaseClient.js'
import { useAppData } from '../hooks/useAppData.js'

export function AdminLoginModal({ onClose, onSuccess }) {
  const { signIn, adminLoading } = useAppData()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      await signIn(email, password)
      onSuccess()
    } catch (loginError) {
      setError(loginError.message || 'ورود انجام نشد؛ اطلاعات را بررسی کنید.')
    }
  }

  return (
    <div className="admin-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="admin-login-card" role="dialog" aria-modal="true" aria-labelledby="admin-login-title">
        <button type="button" className="admin-modal-close" onClick={onClose} aria-label="بستن پنجره‌ی ورود"><X size={21} /></button>
        <span className="admin-modal-icon"><LockKeyhole size={24} aria-hidden="true" /></span>
        <h2 id="admin-login-title">ورود مدیر تریاپانی</h2>
        <p>با حساب مدیر کافه وارد شوید.</p>
        {!isSupabaseConfigured && (
          <div className="admin-setup-hint" role="status">
            اتصال Supabase هنوز تنظیم نشده است. مقادیر URL و anon key را در فایل محیطی قرار دهید.
          </div>
        )}
        <form onSubmit={submit} className="admin-form">
          <label>ایمیل مدیر
            <input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@example.com" />
          </label>
          <label>رمز عبور
            <input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          {error && <p className="admin-form-error" role="alert">{error}</p>}
          <button type="submit" className="admin-primary-button" disabled={adminLoading || !isSupabaseConfigured}>
            {adminLoading ? 'در حال ورود…' : 'ورود به پنل'}
          </button>
        </form>
      </section>
    </div>
  )
}
