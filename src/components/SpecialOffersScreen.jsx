import { useState } from 'react'
import { ArrowLeft, Coffee, Sandwich, Sparkles, Star } from 'lucide-react'
import { specialOffers } from '../data/specialOffers.js'

const moods = [
  { id: 'coffee', title: 'کافئین لازمم', icon: Coffee },
  { id: 'fresh', title: 'خنک و تازه', icon: '🧊' },
  { id: 'sweet', title: 'هوس شیرینی', icon: '🍰' },
  { id: 'hungry', title: 'گرسنمه', icon: Sandwich },
  { id: 'surprise', title: 'سورپرایزم کن!', icon: Sparkles },
]

function BlankProductImage({ product, className = '' }) {
  return product.imagePath ? (
    <img className={`offer-image ${className}`} src={product.imagePath} alt={product.name} />
  ) : (
    <div className={`offer-image offer-image--empty ${className}`} aria-label="جای تصویر محصول" />
  )
}

export function SpecialOffersScreen({ onBack, mascotAnchorRef }) {
  const [selectedMood, setSelectedMood] = useState('coffee')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const visibleOffers = selectedMood === 'surprise'
    ? specialOffers
    : specialOffers.filter((product) => product.moods.includes(selectedMood))
  const back = selectedProduct ? () => setSelectedProduct(null) : onBack

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <header className="category-header offers-page-header flex shrink-0 items-center justify-between px-5 pb-3 pt-5 sm:px-6">
        <div className="offers-page-heading">
          <button type="button" onClick={back} className="back-button inline-flex h-10 w-10 items-center justify-center rounded-full text-dark transition hover:bg-secondary focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-primary" aria-label={selectedProduct ? 'بازگشت به پیشنهادها' : 'بازگشت به دسته‌بندی‌ها'}>
            <ArrowLeft size={21} aria-hidden="true" />
          </button>
          <h1 className="offers-title"><Sparkles size={25} fill="currentColor" aria-hidden="true" /> پیشنهاد هفته</h1>
          <span className="offers-heading-doodle" aria-hidden="true">✦</span>
        </div>
        <aside className="header-mascot" aria-label="راهنمای پیشنهادهای تریاپانی">
          <div className="header-speech">بگو تو چه مودِ مودی هستی!</div>
          <div ref={mascotAnchorRef} className="header-mascot-anchor h-14 w-14" aria-hidden="true" />
        </aside>
      </header>

      {selectedProduct ? (
        <section className="offer-detail category-scroll min-h-0 flex-1 overflow-y-auto px-4 pb-5 pt-4 sm:px-5" aria-label={`جزئیات ${selectedProduct.name}`}>
          <BlankProductImage product={selectedProduct} className="offer-detail-image" />
          <div className="offer-detail-copy">
            {selectedProduct.badge && <span className="offer-badge"><Star size={15} fill="currentColor" aria-hidden="true" />{selectedProduct.badge}</span>}
            <h2>{selectedProduct.name}</h2>
            <p>{selectedProduct.description}</p>
            <strong>{selectedProduct.displayPrice}</strong>
          </div>
        </section>
      ) : (
        <div className="category-scroll min-h-0 flex-1 overflow-y-auto px-4 pb-5 pt-2 sm:px-5">
          <h2 className="mood-question">الان تو چه مودِ مودی هستی؟ <span aria-hidden="true">🤔</span></h2>
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
                    <BlankProductImage product={product} />
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
