import { useCallback, useEffect, useRef, useState } from 'react'
import { BookOpen, Coffee } from 'lucide-react'
import { useAppData } from '../hooks/useAppData.js'
import { CategoryCard } from './CategoryCard.jsx'
import { CategoryProductsScreen } from './CategoryProductsScreen.jsx'
import { OurStoryView } from './OurStoryView.jsx'
import { AdminLoginModal } from './AdminLoginModal.jsx'
import { AdminPanel } from './AdminPanel.jsx'
import { AdminEntryButton } from './AdminEntryButton.jsx'
import { BackButton } from './BackButton.jsx'
import { Toast } from './Toast.jsx'

export function CategoriesScreen({ onBack, mascotAnchorRef, mascotVisible = true }) {
  const [toastMessage, setToastMessage] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [isStoryOpen, setIsStoryOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false)
  const [adminEntryVisible, setAdminEntryVisible] = useState(false)
  const [entryToastMessage, setEntryToastMessage] = useState('')
  const longPressTimerRef = useRef(null)
  const hideEntryTimerRef = useRef(null)
  const dismissToast = useCallback(() => setToastMessage(''), [])
  const { categories, isAdmin, loadError, isMenuLoading, refreshMenu, siteSettings } = useAppData()
  const visibleCategories = categories
    .filter((category) => category.isActive !== false)
    .sort((left, right) => left.order - right.order)

  const hideAdminEntry = useCallback(() => {
    setAdminEntryVisible(false)
    setEntryToastMessage('')
    hideEntryTimerRef.current = null
  }, [])

  const activateAdminEntry = useCallback(() => {
    if (longPressTimerRef.current) window.clearTimeout(longPressTimerRef.current)
    longPressTimerRef.current = null
    setAdminEntryVisible(true)
    setEntryToastMessage('حالت مدیر فعال شد')
    if (hideEntryTimerRef.current) window.clearTimeout(hideEntryTimerRef.current)
    hideEntryTimerRef.current = window.setTimeout(hideAdminEntry, 30_000)
  }, [hideAdminEntry])

  const startMascotLongPress = useCallback(() => {
    if (longPressTimerRef.current) window.clearTimeout(longPressTimerRef.current)
    longPressTimerRef.current = window.setTimeout(activateAdminEntry, 1200)
  }, [activateAdminEntry])

  const cancelMascotLongPress = useCallback(() => {
    if (longPressTimerRef.current) window.clearTimeout(longPressTimerRef.current)
    longPressTimerRef.current = null
  }, [])

  useEffect(() => () => {
    if (longPressTimerRef.current) window.clearTimeout(longPressTimerRef.current)
    if (hideEntryTimerRef.current) window.clearTimeout(hideEntryTimerRef.current)
  }, [])

  const mascotInteractionProps = {
    onPointerDown: startMascotLongPress,
    onPointerUp: cancelMascotLongPress,
    onPointerLeave: cancelMascotLongPress,
    onPointerCancel: cancelMascotLongPress,
    onContextMenu: (event) => event.preventDefault(),
    onClick: (event) => { if (event.detail === 0) activateAdminEntry() },
  }

  const openCategory = (category) => {
    setToastMessage('')
    setActiveCategory(category.id)
  }

  const openAdmin = () => {
    setEntryToastMessage('')
    if (isAdmin) setIsAdminPanelOpen(true)
    else setIsLoginOpen(true)
  }

  if (isAdminPanelOpen && isAdmin) {
    return <AdminPanel onClose={() => setIsAdminPanelOpen(false)} />
  }

  let pageContent
  if (isStoryOpen) {
    pageContent = <OurStoryView onBack={() => setIsStoryOpen(false)} mascotAnchorRef={mascotAnchorRef} mascotInteractionProps={mascotInteractionProps} mascotVisible={mascotVisible} />
  } else if (activeCategory) {
    pageContent = (
      <CategoryProductsScreen
        categoryId={activeCategory}
        onBack={() => setActiveCategory(null)}
        mascotAnchorRef={mascotAnchorRef}
        mascotInteractionProps={mascotInteractionProps}
        mascotVisible={mascotVisible}
      />
    )
  } else {
    pageContent = (
      <div className="flex min-h-0 flex-1 flex-col">
        <header className="category-header category-header--menu flex shrink-0 items-center justify-between px-5 pb-3 pt-5 sm:px-6">
          <div className="category-brand flex items-center gap-2">
            <Coffee className="category-brand-icon text-primary" size={27} aria-hidden="true" />
            <div>
              <p className="text-[11px] font-medium leading-tight text-dark/60">کافه</p>
              <h1 className="category-brand-title text-2xl font-extrabold leading-tight text-dark">تریاپانی</h1>
            </div>
            <BackButton onClick={onBack} label="بازگشت به صفحه‌ی خوش‌آمد" />
          </div>
          <aside className="header-mascot" aria-label="راهنمای منوی تریاپانی">
            <div className="header-speech">{siteSettings?.heroSubtitle || 'چی میل داری؟'}</div>
            <button ref={mascotAnchorRef} type="button" className="header-mascot-anchor h-14 w-14" aria-label="برای فعال‌کردن ورود مدیر، مسکات را نگه دارید" {...mascotInteractionProps}>
              {mascotVisible && <img src="/assets/mascot.webp" alt="" className="header-mascot-image" />}
            </button>
          </aside>
        </header>

        <div className="category-scroll flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-5 pt-2 sm:px-5">
          {isMenuLoading ? (
            <div role="status" aria-live="polite" className="flex min-h-40 items-center justify-center gap-3 text-sm font-medium text-dark">
              <span aria-hidden="true" className="h-5 w-5 rounded-full border-2 border-primary/25 border-t-primary motion-safe:animate-spin" />
              در حال دریافت منوی تریاپانی…
            </div>
          ) : (
          <section className="category-grid" aria-label="دسته‌بندی‌های منو">
            {visibleCategories.map((category) => (
              <CategoryCard key={category.id} category={category} onSelect={openCategory} />
            ))}
            <button type="button" className="category-card category-card--wide story-category-card" onClick={() => setIsStoryOpen(true)} aria-label="باز کردن قصه‌ی تریاپانی">
              <span className="category-sticker story-category-sticker" aria-hidden="true"><BookOpen size={30} strokeWidth={2.2} /></span>
              <span className="category-card-copy">
                <span className="category-title">خاطره‌بازی 🕰️</span>
                <span className="story-category-subtitle">قصه‌ی تریاپانی</span>
              </span>
            </button>
          </section>
          )}
          <footer className="admin-entry-footer">
            <AdminEntryButton visible isAdmin={isAdmin} onClick={openAdmin} variant="footer" />
          </footer>
        </div>
      </div>
    )
  }

  return (
    <div className={`menu-screen-host ${adminEntryVisible && (isStoryOpen || activeCategory) ? 'menu-screen-host--admin-entry' : ''}`}>
      {pageContent}
      {loadError && (
        <div className="shrink-0 border-t border-primary/15 bg-background px-4 py-3 text-center text-xs text-dark">
          <p role="status">{loadError}</p>
          <button
            type="button"
            onClick={() => void refreshMenu()}
            disabled={isMenuLoading}
            className="mt-2 min-h-11 rounded-full bg-secondary px-5 font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-dark disabled:opacity-50"
          >
            تلاش دوباره
          </button>
        </div>
      )}
      <AdminEntryButton
        visible={adminEntryVisible && Boolean(isStoryOpen || activeCategory)}
        isAdmin={isAdmin}
        onClick={openAdmin}
      />
      <Toast message={entryToastMessage} onDismiss={() => setEntryToastMessage('')} />
      <Toast message={toastMessage} onDismiss={dismissToast} />
      {isLoginOpen && <AdminLoginModal onClose={() => setIsLoginOpen(false)} onSuccess={() => { setIsLoginOpen(false); setIsAdminPanelOpen(true) }} />}
    </div>
  )
}
