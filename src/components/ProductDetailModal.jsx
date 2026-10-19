import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Check, X } from 'lucide-react'
import { productDetails } from '../data/productDetails.js'
import { useAppData } from '../hooks/useAppData.js'

function ProductImage({ product }) {
  const image = product.image ?? product.imagePath ?? ''
  return image ? (
    <img className="product-detail-photo" src={image} alt={product.name} />
  ) : (
    <div className="product-detail-photo product-detail-photo--empty" role="img" aria-label={`جای تصویر ${product.name}`} />
  )
}

export function ProductDetailModal({ product, onClose, onSelectProduct, onOrder }) {
  const { products } = useAppData()
  const closeButtonRef = useRef(null)
  const sheetRef = useRef(null)
  const [orderFeedback, setOrderFeedback] = useState({ productId: null, message: '' })
  const reduceMotion = useReducedMotion()
  const sampleDetails = product.isSample ? productDetails[product.id] ?? {} : {}
  const details = {
    ingredients: product.ingredients || sampleDetails.ingredients,
    allergens: product.allergens || sampleDetails.allergens,
    mascotMessage: product.mascotMessage || sampleDetails.mascotMessage,
    pairingProductId: product.pairingProductId || sampleDetails.pairingProductId,
  }
  const pairedProduct = products.find((item) => item.id === details.pairingProductId)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previousFocus = document.activeElement
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const focusableElements = sheetRef.current?.querySelectorAll('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')
      if (!focusableElements?.length) {
        event.preventDefault()
        return
      }
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      if (previousFocus instanceof HTMLElement) previousFocus.focus()
    }
  }, [onClose])

  const transition = reduceMotion ? { duration: 0.01 } : { type: 'spring', stiffness: 280, damping: 30 }

  return (
      <motion.div
        className="product-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.18 }}
        onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}
      >
        <motion.section
          ref={sheetRef}
          className="product-detail-sheet"
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-detail-title"
          aria-describedby="product-detail-description"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={transition}
        >
          <div className="product-sheet-topbar">
            <span className="product-sheet-handle" aria-hidden="true" />
            <button ref={closeButtonRef} type="button" className="product-detail-close" onClick={onClose} aria-label="بستن جزئیات محصول">
              <X size={25} aria-hidden="true" />
            </button>
          </div>

          <div className="product-detail-scroll">
            <ProductImage product={product} />
            <div className="product-detail-heading">
              <h2 id="product-detail-title">{product.name}</h2>
              <p className="product-detail-price">{product.displayPrice}</p>
            </div>

            <p id="product-detail-description" className="product-detail-description">{product.description}</p>

            <section className="product-info-section" aria-labelledby="product-ingredients-title">
              <h3 id="product-ingredients-title">مواد تشکیل‌دهنده</h3>
              <p>{details.ingredients || 'اطلاعات ترکیبات این محصول به‌زودی تکمیل می‌شود.'}</p>
              {details.allergens && (
                <div className="product-allergen-note">
                  <strong>نکته‌ی آلرژی:</strong> {details.allergens}
                </div>
              )}
              <p className="product-sample-note">اطلاعات ترکیبات و آلرژی نمونه است؛ پیش از سفارش از کافه استعلام کنید.</p>
            </section>

            <aside className="mascot-pairing" aria-label="پیشنهاد مسکات تریاپانی">
              <img src="/assets/mascot.webp" alt="مسکات خندان تریاپانی" />
              <div className="mascot-pairing-copy">
                <p>{details.mascotMessage || 'رفیق، این انتخابت حسابی می‌چسبه!'}</p>
                {pairedProduct && (
                  <button type="button" className="mascot-pairing-product" onClick={() => onSelectProduct(pairedProduct)}>
                    <span>پیشنهاد کنارش: <strong>{pairedProduct.name}</strong></span>
                    <ArrowLeft size={17} aria-hidden="true" />
                  </button>
                )}
              </div>
            </aside>
          </div>

          <footer className="product-detail-footer">
            {orderFeedback.productId === product.id && orderFeedback.message && (
              <p className="product-order-message" role="status" aria-live="polite">{orderFeedback.message}</p>
            )}
            <div className="product-detail-total">
              <span>قیمت کل</span>
              <strong>{product.displayPrice}</strong>
            </div>
            <button
              type="button"
              className="product-order-button"
              onClick={() => {
                setOrderFeedback({ productId: product.id, message: 'برای سفارش حضوری، نام این محصول را به همکاران کافه بگویید.' })
                onOrder?.(product)
              }}
            >
              <Check size={19} aria-hidden="true" />
              سفارش این مورد
            </button>
          </footer>
        </motion.section>
      </motion.div>
  )
}
