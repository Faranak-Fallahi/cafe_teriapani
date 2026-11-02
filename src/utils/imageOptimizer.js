const MAX_IMAGE_DIMENSION = 1000
const WEBP_QUALITY = 0.8

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    const objectUrl = URL.createObjectURL(file)
    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Image could not be decoded'))
    }
    image.src = objectUrl
  })
}

export async function optimizeImage(file) {
  if (!file || typeof document === 'undefined') return file

  let image
  try {
    image = typeof createImageBitmap === 'function'
      ? await createImageBitmap(file)
      : await loadImage(file)

    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(image.width, image.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(image.width * scale))
    canvas.height = Math.max(1, Math.round(image.height * scale))
    const context = canvas.getContext('2d')
    if (!context || typeof canvas.toBlob !== 'function') return file
    context.drawImage(image, 0, 0, canvas.width, canvas.height)

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', WEBP_QUALITY))
    if (!blob || blob.type !== 'image/webp') return file

    const baseName = file.name.replace(/\.[^.]+$/, '') || 'image'
    return new File([blob], `${baseName}.webp`, { type: 'image/webp', lastModified: Date.now() })
  } catch {
    return file
  } finally {
    if (image && typeof image.close === 'function') image.close()
  }
}
