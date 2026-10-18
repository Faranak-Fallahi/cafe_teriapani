import { motion, useReducedMotion } from 'framer-motion'

export function CategoryCard({ category, onSelect }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(category)}
      whileHover={prefersReducedMotion ? undefined : { y: -2 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 380, damping: 24, mass: 0.55 }}
      className={`category-card category-card--${category.tone} ${category.wide ? 'category-card--wide' : ''} ${category.featured ? 'category-card--featured' : ''}`}
      aria-label={`نمایش ${category.title}`}
    >
      <span className={`category-sticker category-sticker--${category.stickerTone ?? category.tone}`} aria-hidden="true">{category.sticker}</span>
      <span className="category-card-copy">
        {category.badge && <span className="category-badge">{category.badge}</span>}
        <span className="category-title">{category.title}</span>
      </span>
    </motion.button>
  )
}
