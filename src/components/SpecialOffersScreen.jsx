import { useState } from 'react'
import { ArrowLeft, Coffee, Sandwich, Sparkles, Star } from 'lucide-react'
import { useAppData } from '../hooks/useAppData.js'
import { ProductImage } from './ProductImage.jsx'
import { BackButton } from './BackButton.jsx'

const moods = [
  { id: 'coffee', title: 'کافئین لازمم', icon: Coffee },
  { id: 'fresh', title: 'خنک و تازه', icon: '🧊' },
  { id: 'sweet', title: 'هوس شیرینی', icon: '🍰' },
  { id: 'hungry', title: 'گرسنمه', icon: Sandwich },
  { id: 'surprise', title: 'سورپرایزم کن!', icon: Sparkles },
]

export function SpecialOffersScreen({ onBack, mascotAnchorRef, mascotInteractionProps }) {
  const { offers } = useAppData()
  const [selectedMood, setSelectedMood] = useState('coffee')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const visibleOffers = selectedMood === 'surprise'
    ? offers
    : offers.filter((product) => product.moods.includes(selectedMood))
  const back = selectedProduct ? () => setSelectedProduct(null) : onBack

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <header className="category-header offers-page-header flex shrink-0 items-center justify-between px-5 pb-3 pt-5 sm:px-6">
        <div className="offers-page-heading">
          <BackButton onClick={back} label={selectedProduct ? 'بازگشت به پیشنهادها' : 'بازگشت به دسته‌بندی‌ها'} />
          <h1 className="offers-title"><Sparkles size={25} fill="currentColor" aria-hidden="true" /> پیشنهاد هفته</h1>
          <span className="offers-heading-doodle" aria-hidden="true">✦</span>
        </div>
        <aside className="header-mascot" aria-label="راهنمای پیشنهادهای تریاپانی">
          <div className="header-speech">بگو تو چه مودی هستی؟</div>
          <button ref={mascotAnchorRef} type="button" className="header-mascot-anchor h-14 w-14" aria-label="برای فعال‌کردن ورود مدیر، مسکات را نگه دارید" {...mascotInteractionProps} />
        </aside>
      </header>

      {selectedProduct ? (
        <section className="offer-detail category-scroll min-h-0 flex-1 overflow-y-auto px-4 pb-5 pt-4 sm:px-5" aria-label={`جزئیات ${selectedProduct.name}`}>
          <ProductImage product={selectedProduct} variant="detail" className="offer-detail-image" />
          <div className="offer-detail-copy">
            {selectedProduct.badge && <span className="offer-badge"><Star size={15} fill="currentColor" aria-hidden="true" />{selectedProduct.badge}</span>}
            <h2>{selectedProduct.name}</h2>
            <p>{selectedProduct.description}</p>
            <strong>{selectedProduct.displayPrice}</strong>
          </div>
        </section>
      ) : (
        <div className="category-scroll min-h-0 flex-1 overflow-y-auto px-4 pb-5 pt-2 sm:px-5">
          <h2 className="mood-question">بگو تو چه مودی هستی؟ <span aria-hidden="true">🤔</span></h2>
          <div className="mood-list" role="group" aria-label="انتخاب حال‌وهوای امروز">
            {moods.map(({ id, title, icon: Icon }) => (
              <button key={id} type="button" className={`mood-chip ${selectedMood === id ? 'mood-chip--active' : ''}`} aria-pressed={selectedMood === id} onClick={() => setSelectedMood(id)}>
                {typeof Icon === 'string' ? <span aria-hidden="true">{Icon}</span> : <Icon size={21} aria-hidden="true" />}
                <span>{title}</span>
              </button>
            ))}
          </div>
          <h2 className="offers-list-heading"><span aria-hidden="true">👇</span> پیشنهادهای مخصوص این مود</h2>
          {visibleOffers.length ? (
            <div className="offers-list">
              {visibleOffers.map((product) => (
                <button key={product.id} type="button" className="offer-card" onClick={() => setSelectedProduct(product)} aria-label={`مشاهده جزئیات ${product.name}`}>
                  <div className="offer-card-media">
                    <ProductImage product={product} variant="card" />
                    {product.badge && <span className="offer-badge offer-badge--overlay"><Star size={15} fill="currentColor" aria-hidden="true" />{product.badge}</span>}
                  </div>
                  <span className="offer-card-copy">
                    <strong className="offer-name">{product.name}</strong>
                    <span className="offer-description">{product.description}</span>
                    <span className="offer-price">{product.displayPrice}</span>
                    <span className="offer-action"><span>مشاهده جزئیات</span><span className="offer-action-icon"><ArrowLeft size={20} aria-hidden="true" /></span></span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="offers-empty" role="status">برای این حال‌وهوا فعلاً پیشنهادی نداریم.</p>
          )}
        </div>
      )}
    </div>
  )
}
