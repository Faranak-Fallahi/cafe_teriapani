import { writeFile } from 'node:fs/promises'
import { menuCategories } from '../src/data/menuData.js'
import { menuProducts } from '../src/data/menuProducts.js'
import { productDetails } from '../src/data/productDetails.js'

const quote = (value) => value == null ? 'null' : `'${String(value).replaceAll("'", "''")}'`
const bool = (value) => value ? 'true' : 'false'
const number = (value) => Number(value) || 0
const numericPrice = (product) => {
  if (Number.isFinite(product.price)) return product.price
  return Number((product.displayPrice || '').replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit))).replace(/\D/g, '')) || 0
}

const lines = [
  '-- Demo menu seed generated from the local fallback fixtures. Safe to run more than once.',
  'insert into public.categories (id, name, fun_title, mascot_message, icon, sort_order, tone, sticker_tone, is_featured, is_wide, badge, is_active) values',
  menuCategories.map((category) => `(${[
    quote(category.id), quote(category.title), quote(category.funTitle), quote(category.mascotMessage), quote(category.sticker),
    number(category.order), quote(category.tone), quote(category.stickerTone), bool(category.featured), bool(category.wide),
    quote(category.badge || null), bool(category.isActive !== false),
  ].join(', ')})`).join(',\n'),
  'on conflict (id) do nothing;',
  '',
  'insert into public.products (id, name, price, description, ingredients, allergens, image_url, is_available, mascot_message, pairing_product_id, subcategory_id, badge) values',
  menuProducts.map((product) => {
    const details = productDetails[product.id] || {}
    return `(${[
      quote(product.id), quote(product.name), numericPrice(product), quote(product.description), quote(details.ingredients || ''),
      quote(details.allergens || ''), quote(product.image ?? product.imagePath ?? null), bool(product.isAvailable !== false),
      quote(details.mascotMessage || ''), quote(details.pairingProductId || null), quote(product.subcategoryId || null), quote(product.badge || null),
    ].join(', ')})`
  }).join(',\n'),
  'on conflict (id) do nothing;',
  '',
]

const relations = menuProducts.flatMap((product) => {
  const categoryIds = product.categoryIds ?? (product.categoryId ? [product.categoryId] : [])
  return [...new Set(categoryIds)].map((categoryId) => `(${quote(product.id)}, ${quote(categoryId)})`)
})
if (relations.length) {
  lines.push('insert into public.product_categories (product_id, category_id) values', relations.join(',\n'), 'on conflict do nothing;', '')
}

await writeFile(new URL('../supabase/seed.sql', import.meta.url), `${lines.join('\n')}\n`, 'utf8')
console.log(`Generated Supabase seed for ${menuCategories.length} categories and ${menuProducts.length} sample products.`)
