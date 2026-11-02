import PocketBase from 'pocketbase'
import { menuCategories } from '../src/data/menuData.js'
import { menuProducts } from '../src/data/menuProducts.js'
import { productDetails } from '../src/data/productDetails.js'
import { specialOffers } from '../src/data/specialOffers.js'
import { storyChapters } from '../src/data/storyChapters.js'

const url = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090'
const email = process.env.POCKETBASE_ADMIN_EMAIL
const password = process.env.POCKETBASE_ADMIN_PASSWORD

if (!email || !password) {
  throw new Error('Set POCKETBASE_ADMIN_EMAIL and POCKETBASE_ADMIN_PASSWORD before seeding.')
}

const pb = new PocketBase(url)
await pb.collection('_superusers').authWithPassword(email, password)

const adminRule = '@request.auth.role = "admin"'
const publicReadRules = {
  listRule: '',
  viewRule: '',
  createRule: adminRule,
  updateRule: adminRule,
  deleteRule: adminRule,
}

function field(type, name, options = {}, required = false) {
  // PocketBase 0.23+ accepts field configuration as flattened properties.
  return { type, name, required, ...options }
}

async function ensureCollection(name, fields, options = {}) {
  const body = {
    type: options.type || 'base',
    name,
    fields,
    ...publicReadRules,
    ...(options.rules || {}),
    ...(options.collectionOptions || {}),
  }

  try {
    const collection = await pb.collections.getOne(name)
    // Avoid forcing a new required auth field onto existing user records.
    // Admin role provisioning is handled separately for an already-used PB.
    if (options.type === 'auth') return collection
    // PocketBase auth collections have required system fields (password,
    // tokenKey, email, etc.). Preserve existing fields when extending them.
    const mergedFields = new Map((collection.fields || []).map((existingField) => [existingField.name, existingField]))
    for (const requestedField of fields) mergedFields.set(requestedField.name, requestedField)
    return await pb.collections.update(collection.id, {
      ...body,
      fields: [...mergedFields.values()],
    })
  } catch (error) {
    if (error.status !== 404) throw error
    return pb.collections.create(body)
  }
}

const categoriesCollection = await ensureCollection('categories', [
  field('text', 'slug', { max: 80 }, true),
  field('text', 'name', { max: 200 }, true),
  field('text', 'fun_title', { max: 200 }),
  field('text', 'mascot_message', { max: 2000 }),
  field('text', 'icon', { max: 32 }),
  field('number', 'sort_order'),
  field('text', 'tone', { max: 40 }),
  field('text', 'sticker_tone', { max: 40 }),
  field('bool', 'is_featured'),
  field('bool', 'is_wide'),
  field('text', 'badge', { max: 100 }),
  field('bool', 'is_active'),
], { collectionOptions: { indexes: ['CREATE UNIQUE INDEX idx_categories_slug ON categories (slug)'] } })

await ensureCollection('users', [
  // Keep this optional so existing auth records without a role remain valid.
  field('select', 'role', { maxSelect: 1, values: ['admin'] }),
], {
  type: 'auth',
  rules: {
    listRule: adminRule,
    viewRule: adminRule,
    createRule: adminRule,
    updateRule: adminRule,
    deleteRule: adminRule,
  },
  collectionOptions: { passwordAuth: { enabled: true, identityFields: ['email'] } },
})

await ensureCollection('products', [
  field('text', 'slug', { max: 100 }, true),
  field('text', 'name', { max: 200 }, true),
  field('number', 'price'),
  field('text', 'description', { max: 4000 }),
  field('text', 'ingredients', { max: 2000 }),
  field('text', 'allergens', { max: 2000 }),
  field('file', 'image', { maxSelect: 1, maxSize: 10485760, mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'], thumbs: ['100x100', '400x400'] }),
  field('bool', 'is_available'),
  field('text', 'mascot_message', { max: 2000 }),
  field('text', 'pairing_product_slug', { max: 100 }),
  field('text', 'subcategory_id', { max: 100 }),
  field('text', 'badge', { max: 100 }),
  field('relation', 'categories', { collectionId: categoriesCollection.id, cascadeDelete: false, minSelect: 0, maxSelect: 20 }),
], { collectionOptions: { indexes: ['CREATE UNIQUE INDEX idx_products_slug ON products (slug)'] } })

await ensureCollection('special_offers', [
  field('text', 'slug', { max: 100 }, true),
  field('text', 'name', { max: 200 }, true),
  field('text', 'description', { max: 4000 }),
  field('number', 'price'),
  field('text', 'badge', { max: 100 }),
  field('file', 'image', { maxSelect: 1, maxSize: 10485760, mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'], thumbs: ['400x400'] }),
  field('json', 'moods'),
  field('bool', 'is_active'),
], { collectionOptions: { indexes: ['CREATE UNIQUE INDEX idx_special_offers_slug ON special_offers (slug)'] } })

await ensureCollection('our_story', [
  field('text', 'slug', { max: 80 }, true),
  field('text', 'chapter', { max: 100 }),
  field('text', 'title', { max: 200 }, true),
  field('text', 'description', { max: 4000 }),
  field('text', 'photo_label', { max: 300 }),
  field('file', 'photo', { maxSelect: 1, maxSize: 10485760, mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'], thumbs: ['800x600'] }),
  field('number', 'sort_order'),
], { collectionOptions: { indexes: ['CREATE UNIQUE INDEX idx_our_story_slug ON our_story (slug)'] } })

await ensureCollection('mascot_settings', [
  field('text', 'slug', { max: 80 }, true),
  field('text', 'welcome_message', { max: 1000 }),
  field('text', 'menu_message', { max: 1000 }),
  field('bool', 'is_active'),
], { collectionOptions: { indexes: ['CREATE UNIQUE INDEX idx_mascot_settings_slug ON mascot_settings (slug)'] } })

function parsePrice(product) {
  const source = String(product.price ?? product.displayPrice ?? '')
  const westernDigits = source.replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
  return Number(westernDigits.replace(/[^0-9]/g, '')) || 0
}

async function upsertBySlug(collectionName, slug, data) {
  try {
    const existing = await pb.collection(collectionName).getFirstListItem(`slug = "${slug.replaceAll('"', '\\"')}"`)
    return await pb.collection(collectionName).update(existing.id, data)
  } catch (error) {
    if (error.status !== 404) throw error
    return pb.collection(collectionName).create({ slug, ...data })
  }
}

const categoryRecords = new Map()
for (const [index, category] of menuCategories.entries()) {
  const record = await upsertBySlug('categories', category.id, {
    name: category.title,
    fun_title: category.funTitle || category.title,
    mascot_message: category.mascotMessage || '',
    icon: category.sticker || '☕',
    sort_order: category.order ?? index + 1,
    tone: category.tone || 'cream',
    sticker_tone: category.stickerTone || '',
    is_featured: Boolean(category.featured),
    is_wide: Boolean(category.wide),
    badge: category.badge || '',
    is_active: category.isActive !== false,
  })
  categoryRecords.set(category.id, record.id)
}

for (const product of menuProducts) {
  const details = productDetails[product.id] || {}
  const categorySlugs = product.categoryIds || (product.categoryId ? [product.categoryId] : [])
  const categoryIds = categorySlugs.map((slug) => categoryRecords.get(slug)).filter(Boolean)
  await upsertBySlug('products', product.id, {
    name: product.name,
    price: parsePrice(product),
    description: product.description || '',
    ingredients: product.ingredients || details.ingredients || '',
    allergens: product.allergens || details.allergens || '',
    is_available: product.isAvailable !== false,
    mascot_message: product.mascotMessage || details.mascotMessage || '',
    pairing_product_slug: product.pairingProductId || details.pairingProductId || '',
    subcategory_id: product.subcategoryId || '',
    badge: product.badge || '',
    categories: categoryIds,
  })
}

for (const offer of specialOffers) {
  await upsertBySlug('special_offers', offer.id, {
    name: offer.name,
    description: offer.description || '',
    price: parsePrice(offer),
    badge: offer.badge || '',
    moods: offer.moods || [],
    is_active: true,
  })
}

for (const [index, chapter] of storyChapters.entries()) {
  await upsertBySlug('our_story', chapter.id, {
    chapter: chapter.chapter || '',
    title: chapter.title,
    description: chapter.description || '',
    photo_label: chapter.photoLabel || '',
    sort_order: index + 1,
  })
}

await upsertBySlug('mascot_settings', 'default', {
  welcome_message: 'به کافه تریاپانی خوش اومدی!',
  menu_message: 'چی میل داری؟',
  is_active: true,
})

console.log(`PocketBase schema ready. Seeded ${menuCategories.length} categories, ${menuProducts.length} products, ${specialOffers.length} offers, ${storyChapters.length} story chapters, and mascot settings.`)
