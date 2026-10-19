import { useCallback, useEffect, useMemo, useState } from 'react'
import { menuCategories as mockCategories } from '../data/menuData.js'
import { menuProducts as mockProducts } from '../data/menuProducts.js'
import { isSupabaseConfigured, supabase } from '../supabaseClient.js'
import { AppDataContext } from './appDataContext.js'

function formatPrice(price) {
  return `${new Intl.NumberFormat('fa-IR').format(Number(price) || 0)} تومان`
}

function categoryFromRow(row) {
  return {
    id: row.id,
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
  const categoryIds = (row.product_categories ?? []).map((relation) => relation.category_id)
  return {
    id: row.id,
    name: row.name,
    displayPrice: formatPrice(row.price),
    price: Number(row.price) || 0,
    description: row.description || '',
    ingredients: row.ingredients || '',
    allergens: row.allergens || '',
    image: row.image_url || '',
    imagePath: row.image_url || '',
    categoryIds,
    categoryId: categoryIds[0] ?? '',
    subcategoryId: row.subcategory_id || null,
    isAvailable: row.is_available !== false,
    mascotMessage: row.mascot_message || '',
    pairingProductId: row.pairing_product_id || '',
    badge: row.badge || '',
    isSample: false,
  }
}

function ensureConfigured() {
  if (!supabase) throw new Error('ابتدا نشانی Supabase و کلید anon را در فایل محیطی تنظیم کنید.')
}

export function AppDataProvider({ children }) {
  const [categories, setCategories] = useState(mockCategories)
  const [products, setProducts] = useState(mockProducts)
  const [dataSource, setDataSource] = useState(isSupabaseConfigured ? 'loading' : 'mock')
  const [session, setSession] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminLoading, setAdminLoading] = useState(false)
  const [loadError, setLoadError] = useState('')

  const refreshMenu = useCallback(async () => {
    if (!supabase) return false
    try {
      const [categoryResult, productResult] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('products').select('*, product_categories(category_id)').order('name'),
      ])
      const error = categoryResult.error || productResult.error
      if (error) throw error

      setCategories(categoryResult.data.map(categoryFromRow))
      setProducts(productResult.data.map(productFromRow))
      setDataSource('supabase')
      setLoadError('')
      return true
    } catch {
      setCategories(mockCategories)
      setProducts(mockProducts)
      setLoadError('اتصال به منو برقرار نشد؛ اطلاعات نمونه نمایش داده می‌شود.')
      setDataSource('mock')
      return false
    }
  }, [])

  useEffect(() => {
    if (!supabase) return undefined
    let isCurrent = true

    const load = async () => {
      setDataSource('loading')
      const [sessionResult, categoryResult, productResult] = await Promise.all([
        supabase.auth.getSession(),
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('products').select('*, product_categories(category_id)').order('name'),
      ])
      if (!isCurrent) return

      if (sessionResult.data?.session) setSession(sessionResult.data.session)
      const error = categoryResult.error || productResult.error
      if (error) {
        setCategories(mockCategories)
        setProducts(mockProducts)
        setLoadError('اتصال به منو برقرار نشد؛ اطلاعات نمونه نمایش داده می‌شود.')
        setDataSource('mock')
      } else {
        setCategories(categoryResult.data.map(categoryFromRow))
        setProducts(productResult.data.map(productFromRow))
        setDataSource('supabase')
      }
    }

    load().catch(() => {
      if (!isCurrent) return
      setCategories(mockCategories)
      setProducts(mockProducts)
      setLoadError('اتصال به منو برقرار نشد؛ اطلاعات نمونه نمایش داده می‌شود.')
      setDataSource('mock')
    })
    const { data: authData } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setIsAdmin(false)
    })

    return () => {
      isCurrent = false
      authData.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!supabase || !session?.user?.id) return undefined

    let isCurrent = true
    supabase.from('user_roles').select('role').eq('user_id', session.user.id).eq('role', 'admin').maybeSingle()
      .then(({ data, error }) => {
        if (isCurrent) setIsAdmin(!error && Boolean(data))
      })
      .catch(() => { if (isCurrent) setIsAdmin(false) })

    return () => { isCurrent = false }
  }, [session?.user?.id])

  const signIn = useCallback(async (email, password) => {
    ensureConfigured()
    setAdminLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (error) throw error
      const { data: role, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .eq('role', 'admin')
        .maybeSingle()
      if (roleError || !role) {
        await supabase.auth.signOut()
        throw new Error('این حساب دسترسی مدیر ندارد.')
      }
      setSession(data.session)
      setIsAdmin(true)
    } finally {
      setAdminLoading(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    ensureConfigured()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setSession(null)
    setIsAdmin(false)
  }, [])

  const saveCategory = useCallback(async (category) => {
    ensureConfigured()
    const row = {
      id: category.id || crypto.randomUUID(),
      name: category.title,
      fun_title: category.funTitle || category.title,
      mascot_message: category.mascotMessage || '',
      icon: category.sticker || '☕',
      tone: category.tone || 'cream',
      sticker_tone: category.stickerTone || null,
      is_featured: Boolean(category.featured),
      is_wide: Boolean(category.wide),
      badge: category.badge || null,
      sort_order: Number(category.order) || 0,
      is_active: category.isActive !== false,
    }
    const { error } = await supabase.from('categories').upsert(row)
    if (error) throw error
    await refreshMenu()
  }, [refreshMenu])

  const deleteCategory = useCallback(async (categoryId) => {
    ensureConfigured()
    const { error } = await supabase.from('categories').delete().eq('id', categoryId)
    if (error) throw error
    await refreshMenu()
  }, [refreshMenu])

  const saveProduct = useCallback(async (product) => {
    ensureConfigured()
    const productId = product.id || crypto.randomUUID()
    const categoryIds = product.categoryIds ?? (product.categoryId ? [product.categoryId] : [])
    const row = {
      id: productId,
      name: product.name.trim(),
      price: Number(product.price) || 0,
      description: product.description || '',
      ingredients: product.ingredients || '',
      allergens: product.allergens || '',
      image_url: product.image || null,
      is_available: product.isAvailable !== false,
      mascot_message: product.mascotMessage || '',
      pairing_product_id: product.pairingProductId || null,
      subcategory_id: product.subcategoryId || null,
      badge: product.badge || null,
    }
    const { error } = await supabase.from('products').upsert(row)
    if (error) throw error

    const { error: removeRelationsError } = await supabase.from('product_categories').delete().eq('product_id', productId)
    if (removeRelationsError) throw removeRelationsError
    if (categoryIds.length) {
      const { error: relationError } = await supabase.from('product_categories').insert(
        [...new Set(categoryIds)].map((categoryId) => ({ product_id: productId, category_id: categoryId })),
      )
      if (relationError) throw relationError
    }
    await refreshMenu()
  }, [refreshMenu])

  const deleteProduct = useCallback(async (productId) => {
    ensureConfigured()
    const { error } = await supabase.from('products').delete().eq('id', productId)
    if (error) throw error
    await refreshMenu()
  }, [refreshMenu])

  const uploadProductImage = useCallback(async (file) => {
    ensureConfigured()
    const safeName = file.name.replace(/[^\w.-]+/g, '-')
    const path = `${crypto.randomUUID()}-${safeName}`
    const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: false, contentType: file.type })
    if (error) throw error
    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    return data.publicUrl
  }, [])

  const value = useMemo(() => ({
    categories,
    products,
    dataSource,
    loadError,
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
    uploadProductImage,
  }), [categories, products, dataSource, loadError, session, isAdmin, adminLoading, signIn, signOut, refreshMenu, saveCategory, deleteCategory, saveProduct, deleteProduct, uploadProductImage])

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}
