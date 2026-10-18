import { useCallback, useState } from 'react'
import { ArrowRight, Coffee } from 'lucide-react'
import { motion } from 'framer-motion'
import { categories } from '../data/categories.js'
import { CategoryCard } from './CategoryCard.jsx'
import { Toast } from './Toast.jsx'

export function CategoriesScreen({ onBack, prefersReducedMotion }) {
  const [toastMessage, setToastMessage] = useState('')
  const dismissToast = useCallback(() => setToastMessage(''), [])

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="category-header flex shrink-0 items-center justify-between px-5 pb-3 pt-5 sm:px-6">
        <div className="category-brand flex items-center gap-2">
          <Coffee className="category-brand-icon text-primary" size={27} aria-hidden="true" />
          <div>
            <p className="text-[11px] font-medium leading-tight text-dark/60">کافه</p>
            <h1 className="category-brand-title text-2xl font-extrabold leading-tight text-dark">تریاپانی</h1>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="back-button inline-flex h-10 w-10 items-center justify-center rounded-full text-dark transition hover:bg-secondary focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="بازگشت به صفحه‌ی خوش‌آمد"
          >
            <ArrowRight size={21} aria-hidden="true" />
          </button>
        </div>
        <motion.aside
          className="header-mascot"
          aria-label="راهنمای منوی تریاپانی"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.05 : 0.25 }}
        >
          <div className="header-speech">چی میل داری؟</div>
          <motion.img
            layoutId="mascot-character"
            src="/assets/mascot.webp"
            alt="مسکات تریاپانی"
            className="header-mascot-image h-14 w-14 object-contain"
            transition={{ layout: prefersReducedMotion ? { duration: 0.01 } : { type: 'spring', stiffness: 150, damping: 23, mass: 0.85 } }}
          />
        </motion.aside>
      </header>

      <div className="category-scroll min-h-0 flex-1 overflow-y-auto px-4 pb-5 pt-2 sm:px-5">
        <section className="category-grid" aria-label="دسته‌بندی‌های منو">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onSelect={(selected) => setToastMessage(`«${selected.title}» در مرحله‌ی بعد آماده می‌شود.`)}
            />
          ))}
        </section>
      </div>

      <Toast message={toastMessage} onDismiss={dismissToast} />
    </div>
  )
}
