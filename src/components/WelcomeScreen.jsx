import { ArrowLeft } from 'lucide-react'
import { Coffee, Croissant, Droplets, Leaf, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

const doodles = [
  { id: 'coffee', Icon: Coffee, className: 'welcome-doodle--coffee', tone: 'text-primary', rotate: -10 },
  { id: 'croissant', Icon: Croissant, className: 'welcome-doodle--croissant', tone: 'text-dark/50', rotate: 12 },
  { id: 'sparkles', Icon: Sparkles, className: 'welcome-doodle--sparkles', tone: 'text-secondary', rotate: -6 },
  { id: 'leaf', Icon: Leaf, className: 'welcome-doodle--leaf', tone: 'text-sage', rotate: 15 },
  { id: 'drops', Icon: Droplets, className: 'welcome-doodle--drops', tone: 'text-primary/70', rotate: -14 },
]

export function WelcomeScreen({ onEnter, prefersReducedMotion }) {
  return (
    <section aria-label="صفحه‌ی خوش‌آمد تریاپانی" className="welcome-screen flex min-h-0 flex-1 flex-col items-center justify-between overflow-y-auto px-7 pb-8 pt-7 text-center sm:px-9 sm:pt-9">
      <div className="flex w-full flex-col items-center">
        <div className="brand-mark mb-3" aria-label="تریاپانی">
          <span className="brand-cup" aria-hidden="true">☕</span>
          <h1 className="text-4xl font-extrabold tracking-tight text-dark">تریاپانی</h1>
          <span className="brand-smile" aria-hidden="true" />
        </div>
        <div className="welcome-artwork" aria-label="مسکات و طرح‌های کافه">
          {doodles.map(({ id, Icon, className, tone, rotate }, index) => (
            <motion.span
              key={id}
              className={`welcome-doodle ${className} ${tone}`}
              aria-hidden="true"
              animate={prefersReducedMotion ? undefined : { y: [0, -7, 0], rotate: [rotate, rotate + 5, rotate] }}
              transition={{ duration: 2.8 + index * 0.25, delay: index * 0.12, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Icon size={28} strokeWidth={1.7} />
            </motion.span>
          ))}
          <motion.img
            layoutId="mascot-character"
            src="/assets/mascot.webp"
            alt="مسکات لبخندزن تریاپانی با لباس نارنجی"
            className="welcome-mascot h-64 w-64 max-w-full object-contain sm:h-[17rem] sm:w-[17rem]"
            transition={{ layout: prefersReducedMotion ? { duration: 0.01 } : { type: 'spring', stiffness: 150, damping: 23, mass: 0.85 } }}
          />
        </div>
      </div>

      <div className="mt-5 flex w-full flex-col items-center">
        <p className="welcome-speech">سلام! خیلی خوش اومدی به تریاپانی رفیق</p>
        <p className="mt-3 text-sm font-semibold text-dark/70">در حال چیدن میز خوشمزه‌ها...</p>
        <button
          type="button"
          onClick={onEnter}
          className="mt-6 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-primary px-6 text-lg font-bold text-white shadow-md shadow-primary/20 transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-dark"
        >
          <span>مشاهده منوی خوشمزه</span>
          <ArrowLeft aria-hidden="true" size={22} />
        </button>
        <p className="mt-3 text-xs text-dark/60">یه لحظه صبر کن تا جادو رو ببینی ✨</p>
      </div>
    </section>
  )
}
