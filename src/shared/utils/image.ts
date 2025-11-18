// src/shared/utils/image.ts
const CLOUDFLARE_ACCOUNT_HASH = 'iem94FVEkj3Qjv3DsJXpbQ'

export function optimizeUrl(imageId: string, variant: 'public' | 'thumbnail' | 'original' = 'public'): string {
  if (!imageId) {
    console.warn('optimizeUrl: imageId vazio')
    return ''
  }
  
  if (imageId.startsWith('http://') || imageId.startsWith('https://')) {
    return imageId
  }
  
  if (imageId.startsWith('blob:') || imageId.startsWith('data:')) {
    return imageId
  }
  
  const url = `https://imagedelivery.net/${CLOUDFLARE_ACCOUNT_HASH}/${imageId}/${variant}`
  console.log('optimizeUrl:', { imageId, variant, url })
  return url
}

export function preloadImage(imageId: string, priority: 'high' | 'low' = 'high') {
  if (typeof window === 'undefined') return
  
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = optimizeUrl(imageId, 'public')
  document.head.appendChild(link)
}

export function preloadCriticalImages(imageIds: string[]) {
  if (typeof window === 'undefined') return
  
  imageIds.slice(0, 3).forEach((id, i) => {
    if (id) preloadImage(id, i === 0 ? 'high' : 'low')
  })
}