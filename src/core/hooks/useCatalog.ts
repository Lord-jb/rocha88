// src/core/hooks/useCatalog.ts
import { useQuery } from '@tanstack/react-query'
import { collection, getDocs, query, orderBy, limit, doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Product, Category } from '../../types/product'

interface LayoutConfig {
  logo?: string
  banners: Array<{ url: string; alt?: string }>
  promotions: string[]
  popups: string[]
}

interface CatalogData {
  products: Product[]
  categories: Category[]
  layout: LayoutConfig
}

export function useCatalog(productLimit = 6) {
  return useQuery<CatalogData>({
    queryKey: ['catalog', productLimit],
    queryFn: async () => {
      try {
        const [productsSnap, categoriesSnap, layoutDoc] = await Promise.all([
          getDocs(query(collection(db, 'produtos'), orderBy('createdAt', 'desc'), limit(productLimit))),
          getDocs(query(collection(db, 'categorias'), orderBy('nome'))),
          getDoc(doc(db, 'config', 'layout'))
        ])

        const products = productsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Product[]
        const categories = categoriesSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Category[]
        
        const layoutData = layoutDoc.exists() ? layoutDoc.data() : {}
        
        let banners: Array<{ url: string; alt?: string }> = []
        if (layoutData.banners) {
          if (Array.isArray(layoutData.banners)) {
            banners = layoutData.banners.map((b: any) => {
              if (typeof b === 'string') {
                return { url: b, alt: 'Banner 88 Brindes' }
              }
              return { url: b.url || b, alt: b.alt || 'Banner 88 Brindes' }
            })
          }
        }
        
        const layout: LayoutConfig = {
          logo: layoutData.logo || '',
          banners,
          promotions: layoutData.promotions || [],
          popups: layoutData.popups || []
        }

        console.log('Catalog loaded:', { 
          productsCount: products.length, 
          categoriesCount: categories.length, 
          bannersCount: banners.length,
          layout 
        })

        return { products, categories, layout }
      } catch (error) {
        console.error('Error loading catalog:', error)
        throw error
      }
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export function setCachedCatalog(data: CatalogData) {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem('catalog-cache', JSON.stringify({
      catalog: data,
      timestamp: Date.now()
    }))
  } catch (e) {
    console.warn('Failed to cache catalog')
  }
}