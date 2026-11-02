import { useState } from 'react'
import { ImagePlus, LogOut, Pencil, Plus, Save, Trash2 } from 'lucide-react'
import { useAppData } from '../hooks/useAppData.js'
import { ConfirmDialog } from './ConfirmDialog.jsx'
import { Toast } from './Toast.jsx'
import { BackButton } from './BackButton.jsx'
import { ProductImage } from './ProductImage.jsx'

const emptyCategory = { title: '', funTitle: '', mascotMessage: '', sticker: '☕', order: 1, tone: 'cream', isActive: true }
const emptyProduct = { name: '', price: '', description: '', ingredients: '', allergens: '', image: '', isAvailable: true, categoryIds: [], mascotMessage: '', pairingProductId: '' }

export function AdminPanel({ onClose }) {
  const {
    categories, products, signOut, saveCategory, deleteCategory,
    saveProduct, deleteProduct,
  } = useAppData()
  const [activeTab, setActiveTab] = useState('categories')
  const [categoryDraft, setCategoryDraft] = useState(null)
  const [productDraft, setProductDraft] = useState(null)
  const [productFilter, setProductFilter] = useState('all')
  const [imageFile, setImageFile] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [toastMessage, setToastMessage] = useState('')

  const showError = (saveError) => setError(saveError.message || 'ذخیره انجام نشد؛ دوباره تلاش کنید.')
  const clearEditor = () => {
    setCategoryDraft(null)
    setProductDraft(null)
    setImageFile(null)
    setError('')
  }

  const submitCategory = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await saveCategory({ ...categoryDraft, order: Number(categoryDraft.order) || 0 })
      clearEditor()
      setToastMessage('ذخیره شد ✓')
    } catch (saveError) { showError(saveError) } finally { setBusy(false) }
  }

  const submitProduct = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await saveProduct({ ...productDraft, price: Number(productDraft.price) || 0, imageFile })
      clearEditor()
      setToastMessage('ذخیره شد ✓')
    } catch (saveError) { showError(saveError) } finally { setBusy(false) }
  }

  const confirmDelete = async () => {
    setBusy(true)
    setError('')
    try {
      if (pendingDelete.type === 'category') await deleteCategory(pendingDelete.item.id)
      else await deleteProduct(pendingDelete.item.id)
      setPendingDelete(null)
      setToastMessage('حذف شد ✓')
    } catch (deleteError) { showError(deleteError) } finally { setBusy(false) }
  }

  const handleSignOut = async () => {
    setBusy(true)
    try { await signOut(); onClose() } catch (signOutError) { showError(signOutError) } finally { setBusy(false) }
  }

  const filteredProducts = productFilter === 'all'
    ? products
    : products.filter((product) => product.categoryIds?.includes(productFilter) || product.categoryId === productFilter)

  return (
    <div className="admin-panel-screen">
      <header className="admin-panel-header">
        <BackButton onClick={onClose} label="بازگشت به منو" />
        <div><p>تریاپانی</p><h1>پنل مدیریت</h1></div>
        <button type="button" className="admin-logout-button" onClick={handleSignOut} disabled={busy}><LogOut size={17} /> خروج</button>
      </header>

      <nav className="admin-tabs" aria-label="بخش‌های پنل مدیریت">
        <button type="button" aria-pressed={activeTab === 'categories'} className={activeTab === 'categories' ? 'admin-tab admin-tab--active' : 'admin-tab'} onClick={() => { clearEditor(); setActiveTab('categories') }}>دسته‌بندی‌ها</button>
        <button type="button" aria-pressed={activeTab === 'products'} className={activeTab === 'products' ? 'admin-tab admin-tab--active' : 'admin-tab'} onClick={() => { clearEditor(); setActiveTab('products') }}>محصولات</button>
      </nav>

      <main className="admin-panel-content">
        {activeTab === 'categories' ? (
          <section aria-labelledby="admin-categories-title">
            <div className="admin-section-heading"><h2 id="admin-categories-title">مدیریت دسته‌بندی‌ها</h2><button type="button" className="admin-small-button" onClick={() => { setError(''); setCategoryDraft({ ...emptyCategory }) }}><Plus size={17} /> دسته‌ی جدید</button></div>
            {categoryDraft && (
              <form className="admin-editor-form" onSubmit={submitCategory}>
                <h3>{categoryDraft.id ? 'ویرایش دسته‌بندی' : 'دسته‌بندی تازه'}</h3>
                <label>نام دسته<input required value={categoryDraft.title} onChange={(event) => setCategoryDraft({ ...categoryDraft, title: event.target.value })} /></label>
                <label>تیتر نمایشی<input required value={categoryDraft.funTitle} onChange={(event) => setCategoryDraft({ ...categoryDraft, funTitle: event.target.value })} /></label>
                <label>پیام مسکات<textarea rows="2" value={categoryDraft.mascotMessage} onChange={(event) => setCategoryDraft({ ...categoryDraft, mascotMessage: event.target.value })} /></label>
                <div className="admin-form-row"><label>آیکون یا ایموجی<input value={categoryDraft.sticker} onChange={(event) => setCategoryDraft({ ...categoryDraft, sticker: event.target.value })} /></label><label>ترتیب نمایش<input type="number" min="0" value={categoryDraft.order} onChange={(event) => setCategoryDraft({ ...categoryDraft, order: event.target.value })} /></label></div>
                <label className="admin-checkbox"><input type="checkbox" checked={categoryDraft.isActive !== false} onChange={(event) => setCategoryDraft({ ...categoryDraft, isActive: event.target.checked })} /> نمایش در منوی مشتری</label>
                {error && <p className="admin-form-error" role="alert">{error}</p>}
                <div className="admin-form-actions"><button type="button" className="admin-secondary-button" onClick={clearEditor}>انصراف</button><button type="submit" className="admin-primary-button" disabled={busy}><Save size={17} /> ذخیره</button></div>
              </form>
            )}
            <div className="admin-record-list">
              {categories.map((category) => (
                <article className="admin-record" key={category.id}>
                  <span className="admin-record-icon">{category.sticker || '☕'}</span>
                  <div className="admin-record-copy"><strong>{category.title}</strong><span>{category.funTitle || category.title}</span></div>
                  <div className="admin-record-actions">
                    <button type="button" className="admin-icon-button" onClick={() => { setError(''); setCategoryDraft({ ...emptyCategory, ...category }) }} aria-label={`ویرایش ${category.title}`}><Pencil size={17} /></button>
                    <button type="button" className="admin-icon-button admin-icon-button--danger" onClick={() => setPendingDelete({ type: 'category', item: category })} aria-label={`حذف ${category.title}`}><Trash2 size={17} /></button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : (
          <section aria-labelledby="admin-products-title">
            <div className="admin-section-heading"><h2 id="admin-products-title">مدیریت محصولات</h2><button type="button" className="admin-small-button" onClick={() => { setError(''); setImageFile(null); setProductDraft({ ...emptyProduct }) }}><Plus size={17} /> محصول جدید</button></div>
            <label className="admin-filter-label">فیلتر دسته
              <select value={productFilter} onChange={(event) => setProductFilter(event.target.value)}><option value="all">همه‌ی دسته‌ها</option>{categories.map((category) => <option value={category.id} key={category.id}>{category.title}</option>)}</select>
            </label>
            {productDraft && (
              <form className="admin-editor-form" onSubmit={submitProduct}>
                <h3>{productDraft.id ? 'ویرایش محصول' : 'محصول تازه'}</h3>
                <label>نام محصول<input required value={productDraft.name} onChange={(event) => setProductDraft({ ...productDraft, name: event.target.value })} /></label>
                <label>قیمت به تومان<input required type="number" min="0" inputMode="numeric" value={productDraft.price} onChange={(event) => setProductDraft({ ...productDraft, price: event.target.value })} /></label>
                <label>توضیحات<textarea rows="2" value={productDraft.description} onChange={(event) => setProductDraft({ ...productDraft, description: event.target.value })} /></label>
                <label>مواد تشکیل‌دهنده<textarea rows="2" value={productDraft.ingredients || ''} onChange={(event) => setProductDraft({ ...productDraft, ingredients: event.target.value })} /></label>
                <label>هشدار آلرژن<textarea rows="2" value={productDraft.allergens || ''} onChange={(event) => setProductDraft({ ...productDraft, allergens: event.target.value })} /></label>
                <label>پیام مسکات<textarea rows="2" value={productDraft.mascotMessage || ''} onChange={(event) => setProductDraft({ ...productDraft, mascotMessage: event.target.value })} /></label>
                <label>پیشنهاد محصول مکمل<select value={productDraft.pairingProductId || ''} onChange={(event) => setProductDraft({ ...productDraft, pairingProductId: event.target.value })}><option value="">بدون پیشنهاد</option>{products.filter((product) => product.id !== productDraft.id).map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select></label>
                <fieldset className="admin-category-checks"><legend>دسته‌بندی‌های محصول (چند انتخاب)</legend>{categories.map((category) => <label className="admin-checkbox" key={category.id}><input type="checkbox" checked={productDraft.categoryIds?.includes(category.id) ?? productDraft.categoryId === category.id} onChange={(event) => { const previousIds = productDraft.categoryIds ?? (productDraft.categoryId ? [productDraft.categoryId] : []); const categoryIds = event.target.checked ? [...new Set([...previousIds, category.id])] : previousIds.filter((id) => id !== category.id); setProductDraft({ ...productDraft, categoryIds }) }} /> {category.title}</label>)}</fieldset>
                <label className="admin-upload-label"><ImagePlus size={19} /> عکس محصول<input type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] ?? null)} />{imageFile?.name || productDraft.image || 'بدون تصویر'}</label>
                <label className="admin-checkbox"><input type="checkbox" checked={productDraft.isAvailable !== false} onChange={(event) => setProductDraft({ ...productDraft, isAvailable: event.target.checked })} /> موجود و قابل‌نمایش</label>
                {error && <p className="admin-form-error" role="alert">{error}</p>}
                <div className="admin-form-actions"><button type="button" className="admin-secondary-button" onClick={clearEditor}>انصراف</button><button type="submit" className="admin-primary-button" disabled={busy}><Save size={17} /> ذخیره</button></div>
              </form>
            )}
            <div className="admin-record-list">
              {filteredProducts.map((product) => (
                <article className="admin-record" key={product.id}>
                  <span className="admin-product-thumb" aria-hidden="true"><ProductImage product={product} variant="thumbnail" alt="" /></span>
                  <div className="admin-record-copy"><strong>{product.name}</strong><span>{product.displayPrice}</span></div>
                  <div className="admin-record-actions">
                    <button type="button" className="admin-icon-button" onClick={() => { setError(''); setImageFile(null); setProductDraft({ ...emptyProduct, ...product, price: product.price ?? '', categoryIds: product.categoryIds ?? (product.categoryId ? [product.categoryId] : []) }) }} aria-label={`ویرایش ${product.name}`}><Pencil size={17} /></button>
                    <button type="button" className="admin-icon-button admin-icon-button--danger" onClick={() => setPendingDelete({ type: 'product', item: product })} aria-label={`حذف ${product.name}`}><Trash2 size={17} /></button>
                  </div>
                </article>
              ))}
              {!filteredProducts.length && <p className="admin-empty">محصولی در این فهرست نیست.</p>}
            </div>
          </section>
        )}
        {error && !categoryDraft && !productDraft && <p className="admin-form-error" role="alert">{error}</p>}
      </main>
      <Toast message={toastMessage} onDismiss={() => setToastMessage('')} />
      {pendingDelete && <ConfirmDialog message={pendingDelete.type === 'category' ? `دسته‌ی «${pendingDelete.item.title}» و پیوندهای محصولاتش حذف شود؟` : `محصول «${pendingDelete.item.name}» حذف شود؟`} onConfirm={confirmDelete} onCancel={() => setPendingDelete(null)} busy={busy} />}
    </div>
  )
}
