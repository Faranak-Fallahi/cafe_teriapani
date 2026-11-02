import { useState } from 'react'
import { ImageOff } from 'lucide-react'

export function ProductImage({ product, variant = 'card', className = '', alt }) {
  const image = product?.image || product?.imagePath || product?.image_url || ''
  const [failedSource, setFailedSource] = useState('')
  const hasImage = Boolean(image) && failedSource !== image

  return (
    <div className={`product-image product-image--${variant} ${className}`.trim()}>
      {hasImage ? (
        <img
          key={image}
          src={image}
          alt={alt ?? product?.name ?? ''}
          loading="lazy"
          decoding="async"
          onError={() => setFailedSource(image)}
        />
      ) : (
        <span className="product-image-placeholder" role="img" aria-label={`تصویر ${product?.name ?? 'محصول'} در دسترس نیست`}>
          <ImageOff aria-hidden="true" size={variant === 'thumbnail' ? 17 : 25} strokeWidth={1.8} />
        </span>
      )}
    </div>
  )
}
