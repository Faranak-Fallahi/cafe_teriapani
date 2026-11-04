import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { menuCategories as mockCategories } from '../data/menuData.js'
import { menuProducts as mockProducts } from '../data/menuProducts.js'
import { specialOffers as mockOffers } from '../data/specialOffers.js'
import { storyChapters as mockStory } from '../data/storyChapters.js'
import { defaultSiteSettings, siteSettingsFromRow } from '../data/siteSettings.js'
import { loadMenu } from '../data/loadMenu.js'
import { AppDataContext } from './appDataContext.js'
import { getFileUrl, pb } from '../lib/pocketbase.js'

function formatPrice(price) {
  return `${new Intl.NumberFormat('fa-IR').format(Number(price) || 0)} تومان`
}

function categoryFromRow(row) {
  return {
    id: row.slug,
    recordId: row.id,
    title: row.name,
    funTitle: row.fun_title || row.name,
    mascotMessage: row.mascot_message || '',
    sticker: row.icon || '☕',
    tone: row.tone || 'cream',
    stickerTone: row.sticker_tone || undefined,
    featured: Boolean(row.is_featured),
    wide: Boolean(row.is_wide),
    badge: row.badge || '',
    order: row.sort_order ?? 0,
    isActive: row.is_active !== false,
  }
}

function productFromRow(row) {
  const categoryIds = (row.expand?.categories ?? []).map((category) => category.slug)
  const isFavorite = categoryIds.includes('favorites')
  return {
    id: row.slug,
    recordId: row.id,
    name: row.name,
    displayPrice: formatPrice(row.price),
    price: Number(row.price) || 0,
    description: row.description || '',
    ingredients: row.ingredients || '',
    allergens: row.allergens || '',
    image: row.image ? getFileUrl(row, row.image) : '',
    imagePath: row.image ? getFileUrl(row, row.image) : '',
    categoryIds,
    categoryId: categoryIds[0] ?? '',
    subcategoryId: row.subcategory_id || null,
    isAvailable: row.is_available !== false,
    mascotMessage: row.mascot_message || '',
    pairingProductId: row.pairing_product_slug || '',
    badge: isFavorite ? 'محبوب این هفته' : row.badge || '',
    isSample: false,
  }
}

function offerFromRow(row) {
  const price = Number(row.price) || 0
  return {
    id: row.slug,
    recordId: row.id,
    name: row.name,
    description: row.description || '',
    price,
    displayPrice: formatPrice(price),
    badge: row.badge || '',
    image: row.image ? getFileUrl(row, row.image) : '',
    imagePath: row.image ? getFileUrl(row, row.image) : '',
    moods: Array.isArray(row.moods) ? row.moods : [],
  }
}

function storyFromRow(row) {
  return {
    id: row.slug,
    recordId: row.id,
    chapter: row.chapter || '',
    title: row.title,
    description: row.description || '',
    photoLabel: row.photo_label || '',
    image: row.photo ? getFileUrl(row, row.photo) : '',
    order: Number(row.sort_order) || 0,
  }
}

function storySlugFromTitle() {
  return `chapter-${crypto.randomUUID()}`
}

function hasAdminAccess() {
  return pb.authStore.isValid && pb.authStore.record?.role === 'admin'
}

function loginErrorMessage(error, authenticatedWithoutAdminRole) {
  const status = error?.status || error?.response?.status
  if (!status || status === 0) return 'اتصال به سرور پاکت‌بیس برقرار نشد. روشن بودن سرور و نشانی اتصال را بررسی کنید.'
  if (authenticatedWithoutAdminRole) return 'این حساب کاربری مجوز ورود به پنل مدیریت را ندارد.'
  if (status === 404) return 'بخش ورود مدیر هنوز راه‌اندازی نشده است. ابتدا اسکیما و حساب مدیر پاکت‌بیس را تنظیم کنید.'
  if (status === 400 || status === 401) return 'ایمیل یا رمز عبور نادرست است.'
  if (status === 403) return 'این حساب اجازه ورود به پنل مدیریت را ندارد.'
  return 'ورود انجام نشد. لطفاً دوباره تلاش کنید یا تنظیمات حساب مدیر را بررسی کنید.'
}

export function AppDataProvider({ children }) {
  const [menu, setMenu] = useState(() => ({
    categories: [],
    products: [],
    dataSource: 'loading',
    isMenuLoading: true,
    loadError: '',
    offers: mockOffers,
    story: mockStory,
    siteSettings: defaultSiteSettings,
  }))
  const { categories, products, offers, story, siteSettings, dataSource, isMenuLoading, loadError } = menu
  const mountedRef = useRef(false)
  const requestIdRef = useRef(0)
  const [session, setSession] = useState(pb.authStore.record)
  const [isAdmin, setIsAdmin] = useState(hasAdminAccess())
  const [adminLoading, setAdminLoading] = useState(false)

  const refreshMenu = useCallback(async () => {
    if (!mountedRef.current) return false
    const requestId = ++requestIdRef.current
    setMenu((previous) => ({ ...previous, isMenuLoading: true, loadError: '' }))
    try {
      const authenticatedAsAdmin = hasAdminAccess()
      const result = await loadMenu(pb, authenticatedAsAdmin)
      if (!mountedRef.current || requestId !== requestIdRef.current) return false
      // Publish both lists together; never mix live categories with mock products.
      setMenu({
        categories: result.categories.map(categoryFromRow),
        products: result.products.map(productFromRow),
        offers: result.offers.map(offerFromRow),
        story: result.story.map(storyFromRow),
        siteSettings: siteSettingsFromRow(result.siteSettings),
        dataSource: 'pocketbase',
        isMenuLoading: false,
        loadError: '',
      })
      return true
    } catch {
      if (!mountedRef.current || requestId !== requestIdRef.current) return false
      setMenu((previous) => previous.dataSource === 'pocketbase'
        ? {
            ...previous,
            isMenuLoading: false,
            loadError: 'به‌روزرسانی منو ناموفق بود؛ آخرین اطلاعات دریافت‌شده نمایش داده می‌شود.',
          }
        : {
            categories: mockCategories,
            products: mockProducts,
            offers: mockOffers,
            story: mockStory,
            siteSettings: defaultSiteSettings,
            dataSource: 'mock',
            isMenuLoading: false,
            loadError: 'اتصال به منوی آنلاین برقرار نشد؛ منوی نمونه و موقت نمایش داده می‌شود.',
          })
      return false
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    const initialLoad = window.setTimeout(() => void refreshMenu(), 0)
    return () => {
      window.clearTimeout(initialLoad)
      mountedRef.current = false
      requestIdRef.current += 1
    }
  }, [refreshMenu])

  useEffect(() => pb.authStore.onChange((_token, record) => {
    setSession(record)
    setIsAdmin(hasAdminAccess())
    if (mountedRef.current) void refreshMenu()
  }, true), [refreshMenu])

  const signIn = useCallback(async (email, password) => {
    setAdminLoading(true)
    try {
      let lastAuthError
      let authenticatedWithoutAdminRole = false
      let missingAdminsCollection = false

      for (const collectionName of ['admins', 'users']) {
        try {
          const auth = await pb.collection(collectionName).authWithPassword(email.trim(), password)
          if (auth.record?.role === 'admin') {
            setSession(auth.record)
            setIsAdmin(true)
            await refreshMenu()
            return
          }
          authenticatedWithoutAdminRole = true
        } catch (error) {
          lastAuthError = error
          if (collectionName === 'admins' && error.status === 404) missingAdminsCollection = true
        }
        pb.authStore.clear()
      }

      if (missingAdminsCollection && !authenticatedWithoutAdminRole && lastAuthError?.status !== 0) {
        throw new Error(loginErrorMessage({ status: 404 }, false))
      }
      throw new Error(loginErrorMessage(lastAuthError, authenticatedWithoutAdminRole))
    } finally {
      setAdminLoading(false)
    }
  }, [refreshMenu])

  const signOut = useCallback(async () => {
    pb.authStore.clear()
    setSession(null)
    setIsAdmin(false)
    await refreshMenu()
  }, [refreshMenu])

  const saveCategory = useCallback(async (category) => {
    const slug = category.id || `category-${crypto.randomUUID()}`
    const row = {
      slug,
      name: category.title,
      fun_title: category.funTitle || category.title,
      mascot_message: category.mascotMessage || '',
      icon: category.sticker || '☕',
      tone: category.tone || 'cream',
      sticker_tone: category.stickerTone || '',
      is_featured: Boolean(category.featured),
      is_wide: Boolean(category.wide),
      badge: category.badge || '',
      sort_order: Number(category.order) || 0,
      is_active: category.isActive !== false,
    }
    if (category.recordId) await pb.collection('categories').update(category.recordId, row)
    else {
      try {
        const existing = await pb.collection('categories').getFirstListItem(`slug = "${slug}"`)
        await pb.collection('categories').update(existing.id, row)
      } catch (error) {
        if (error.status !== 404) throw error
        await pb.collection('categories').create(row)
      }
    }
    await refreshMenu()
  }, [refreshMenu])

  const deleteCategory = useCallback(async (categoryId) => {
    const category = await pb.collection('categories').getFirstListItem(`slug = "${categoryId}"`)
    await pb.collection('categories').delete(category.id)
    await refreshMenu()
  }, [refreshMenu])

  const saveProduct = useCallback(async (product) => {
    const slug = product.id || `product-${crypto.randomUUID()}`
    const categorySlugs = product.categoryIds ?? (product.categoryId ? [product.categoryId] : [])
    const categoryRows = await pb.collection('categories').getFullList({ fields: 'id,slug' })
    const categoryRecords = new Map(categoryRows.map((item) => [item.slug, item.id]))
    const row = {
      slug,
      name: product.name.trim(),
      price: Number(product.price) || 0,
      description: product.description || '',
      ingredients: product.ingredients || '',
      allergens: product.allergens || '',
      is_available: product.isAvailable !== false,
      mascot_message: product.mascotMessage || '',
      pairing_product_slug: product.pairingProductId || '',
      subcategory_id: product.subcategoryId || '',
      badge: product.badge || '',
      categories: [...new Set(categorySlugs)].map((categorySlug) => categoryRecords.get(categorySlug)).filter(Boolean),
    }
    let record = product.recordId ? { id: product.recordId } : null
    if (!record) {
      try { record = await pb.collection('products').getFirstListItem(`slug = "${slug}"`) }
      catch (error) { if (error.status !== 404) throw error }
    }

    let data = row
    if (product.imageFile) {
      data = new FormData()
      for (const [key, value] of Object.entries(row)) {
        if (key === 'categories') value.forEach((id) => data.append('categories', id))
        else data.append(key, String(value))
      }
      data.append('image', product.imageFile)
    }
    if (record) await pb.collection('products').update(record.id, data)
    else await pb.collection('products').create(data)
    await refreshMenu()
  }, [refreshMenu])

  const deleteProduct = useCallback(async (productId) => {
    const product = await pb.collection('products').getFirstListItem(`slug = "${productId}"`)
    await pb.collection('products').delete(product.id)
    await refreshMenu()
  }, [refreshMenu])

  const saveSiteSettings = useCallback(async (settings) => {
    const row = {
      slug: 'default',
      hero_title: settings.heroTitle.trim(),
      hero_subtitle: settings.heroSubtitle.trim(),
      announcement_text: settings.announcementText.trim(),
    }

    try {
      const existing = await pb.collection('site_settings').getFirstListItem('slug = "default"')
      await pb.collection('site_settings').update(existing.id, row)
    } catch (error) {
      if (error.status !== 404) throw error
      await pb.collection('site_settings').create(row)
    }
    await refreshMenu()
  }, [refreshMenu])

  const saveStoryChapter = useCallback(async (chapter) => {
    const slug = chapter.id || storySlugFromTitle()
    const row = {
      slug,
      chapter: chapter.chapter || '',
      title: chapter.title.trim(),
      description: chapter.description || '',
      photo_label: chapter.photoLabel || chapter.title.trim(),
      sort_order: Number(chapter.order) || 0,
    }
    let data = row
    if (chapter.imageFile) {
      data = new FormData()
      for (const [key, value] of Object.entries(row)) data.append(key, String(value))
      data.append('photo', chapter.imageFile)
    }

    if (chapter.recordId) {
      await pb.collection('our_story').update(chapter.recordId, data)
    } else {
      await pb.collection('our_story').create(data)
    }
    await refreshMenu()
  }, [refreshMenu])

  const deleteStoryChapter = useCallback(async (chapterId) => {
    const chapter = story.find((item) => item.id === chapterId)
    if (!chapter?.recordId) throw new Error('ÙØµÙ„ Ù¾ÛŒØ¯Ø§ Ù†Ø´Ø¯.')
    await pb.collection('our_story').delete(chapter.recordId)
    await refreshMenu()
  }, [refreshMenu, story])

  const value = useMemo(() => ({
    categories,
    products,
    offers,
    story,
    siteSettings,
    dataSource,
    loadError,
    isMenuLoading,
    session,
    isAdmin,
    adminLoading,
    signIn,
    signOut,
    refreshMenu,
    saveCategory,
    deleteCategory,
    saveProduct,
    deleteProduct,
    saveSiteSettings,
    saveStoryChapter,
    deleteStoryChapter,
  }), [categories, products, offers, story, siteSettings, dataSource, loadError, isMenuLoading, session, isAdmin, adminLoading, signIn, signOut, refreshMenu, saveCategory, deleteCategory, saveProduct, deleteProduct, saveSiteSettings, saveStoryChapter, deleteStoryChapter])

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}
