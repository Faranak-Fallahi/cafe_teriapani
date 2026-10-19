import { useCallback, useId, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Coffee, Star } from 'lucide-react'
import { menuCategories } from '../data/menuData.js'
import { menuProducts } from '../data/menuProducts.js'
import { menuSubcategories } from '../data/menuTaxonomy.js'
import { ProductDetailModal } from './ProductDetailModal.jsx'

function ProductImage({ product, className = '' }) {
  const image = product.image ?? product.imagePath ?? ''
  return image ? (
    <img className={`offer-image ${className}`} src={image} alt={product.name} />
  ) : (
    <div className={`offer-image offer-image--empty ${className}`} aria-label="جای تصویر محصول" />
  )
}

export function CategoryProductsScreen({ categoryId, onBack, mascotAnchorRef }) {
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const closeProductDetails = useCallback(() => setSelectedProduct(null), [])
  const subcategoryTrackRef = useRef(null)
  const subcategoryTrackId = `subcategory-track-${useId().replace(/:/g, '')}`
  const [scrollEdges, setScrollEdges] = useState({ canScrollLeft: false, canScrollRight: false })
  const category = menuCategories.find((item) => item.id === categoryId)
  const subcategories = menuSubcategories
    .filter((item) => item.categoryId === categoryId && item.isActive !== false)
    .sort((left, right) => left.order - right.order)
  const categoryProducts = menuProducts.filter((product) => product.categoryId === categoryId)
  const visibleProducts = selectedSubcategoryId === 'all'
    ? categoryProducts
    : categoryProducts.filter((product) => product.subcategoryId === selectedSubcategoryId)

  useLayoutEffect(() => {
    const track = subcategoryTrackRef.current
    if (!track) return undefined

    const updateScrollEdges = () => {
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth)
      const offsetFromRight = Math.max(0, Math.min(maxScroll, -track.scrollLeft))
      const nextEdges = {
        canScrollLeft: maxScroll - offsetFromRight > 1,
        canScrollRight: offsetFromRight > 1,
      }
      setScrollEdges((currentEdges) => (
        currentEdges.canScrollLeft === nextEdges.canScrollLeft
          && currentEdges.canScrollRight === nextEdges.canScrollRight
          ? currentEdges
          : nextEdges
      ))
    }

    const resizeObserver = new ResizeObserver(updateScrollEdges)
    resizeObserver.observe(track)
    if (track.firstElementChild) resizeObserver.observe(track.firstElementChild)
    track.addEventListener('scroll', updateScrollEdges, { passive: true })
    updateScrollEdges()

    return () => {
      resizeObserver.disconnect()
      track.removeEventListener('scroll', updateScrollEdges)
    }
  }, [categoryId, subcategories.length])

  const scrollSubcategories = (direction) => {
    subcategoryTrackRef.current?.scrollBy({ left: direction * 200, behavior: 'smooth' })
  }

  if (!category) {
    return (
      <section className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 bg-background p-6 text-center" role="status">
        <p>این دسته‌بندی در دسترس نیست.</p>
        <button type="button" className="category-back-action" onClick={onBack}>بازگشت به دسته‌بندی‌ها</button>
      </section>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <header className="category-header flex shrink-0 items-center justify-between px-5 pb-3 pt-5 sm:px-6">
        <div className="category-brand flex items-center gap-2">
          <Coffee className="category-brand-icon text-primary" size={27} aria-hidden="true" />
          <div>
            <p className="text-[11px] font-medium leading-tight text-dark/60">منوی کافه</p>
            <h1 className="category-brand-title category-fun-title font-extrabold leading-tight text-dark">{category.funTitle}</h1>
          </div>
          <button
            type="button"
            onClick={selectedProduct ? closeProductDetails : onBack}
            className="back-button inline-flex h-10 w-10 items-center justify-center rounded-full text-dark transition hover:bg-secondary focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label={selectedProduct ? 'بازگشت به فهرست محصولات' : 'بازگشت به دسته‌بندی‌ها'}
          >
            <ArrowRight size={21} aria-hidden="true" />
          </button>
        </div>
        <aside className="header-mascot" aria-label="راهنمای منوی تریاپانی">
          <div className="header-speech">{category.mascotMessage}</div>
          <div ref={mascotAnchorRef} className="header-mascot-anchor h-14 w-14" aria-hidden="true" />
        </aside>
      </header>

      <div className="category-scroll min-h-0 flex-1 overflow-y-auto px-4 pb-5 pt-2 sm:px-5">
          <div className="subcategory-nav-shell">
            <button
              type="button"
              className="subcategory-scroll-arrow"
              aria-label="پیمایش به گزینه‌های سمت چپ"
              aria-controls={subcategoryTrackId}
              disabled={!scrollEdges.canScrollLeft}
              onClick={() => scrollSubcategories(-1)}
            >
              <ChevronLeft size={22} aria-hidden="true" />
            </button>
            <nav
              ref={subcategoryTrackRef}
              id={subcategoryTrackId}
              className="subcategory-list flex w-full touch-pan-x gap-2 overflow-x-auto px-4 py-2 scroll-smooth no-scrollbar"
              aria-label={`زیردسته‌های ${category.title}`}
            >
              <button
                type="button"
                className={`subcategory-chip ${selectedSubcategoryId === 'all' ? 'subcategory-chip--active' : ''}`}
                aria-pressed={selectedSubcategoryId === 'all'}
                onClick={() => setSelectedSubcategoryId('all')}
              >
                همه
              </button>
              {subcategories.map((subcategory) => (
                <button
                  key={subcategory.id}
                  type="button"
                  className={`subcategory-chip ${selectedSubcategoryId === subcategory.id ? 'subcategory-chip--active' : ''}`}
                  aria-pressed={selectedSubcategoryId === subcategory.id}
                  onClick={() => setSelectedSubcategoryId(subcategory.id)}
                >
                  {subcategory.title}
                </button>
              ))}
            </nav>
            <button
              type="button"
              className="subcategory-scroll-arrow"
              aria-label="پیمایش به گزینه‌های سمت راست"
              aria-controls={subcategoryTrackId}
              disabled={!scrollEdges.canScrollRight}
              onClick={() => scrollSubcategories(1)}
            >
              <ChevronRight size={22} aria-hidden="true" />
            </button>
          </div>

          {visibleProducts.length ? (
            <section className="offers-list category-product-list" aria-label={`محصولات ${category.title}`}>
              {visibleProducts.map((product) => (
                <button key={product.id} type="button" className="offer-card" onClick={() => setSelectedProduct(product)} aria-label={`مشاهده جزئیات ${product.name}`}>
                  <div className="offer-card-media">
                    <ProductImage product={product} />
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
            </section>
          ) : (
            <p className="offers-empty" role="status">
              {categoryProducts.length
                ? 'برای این زیردسته فعلاً محصولی ثبت نشده است.'
                : 'برای این دسته فعلاً محصولی ثبت نشده است.'}
            </p>
        )}
      </div>
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal
            key="product-detail"
            product={selectedProduct}
            onClose={closeProductDetails}
            onSelectProduct={setSelectedProduct}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
