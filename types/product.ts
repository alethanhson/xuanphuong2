import type { FilterParams } from "./common"
import type { Database } from './supabase'

export interface ProductCategory {
  id: string
  name: string
  slug: string
  description?: string
}

export interface ProductImage {
  id: string
  url: string
  alt: string
  isPrimary?: boolean
}

export interface ProductFeature {
  id: string
  title: string
  description: string
  icon?: string
}

export interface ProductSpecification {
  id: string
  name: string
  value: string
  group?: string
}

export interface ProductReview {
  id: string
  author: string
  company?: string
  rating: number
  comment: string
  date: string
  avatar?: string
}

export type Product = Database['public']['Tables']['products']['Row'] & {
  category?: Database['public']['Tables']['product_categories']['Row']
  images?: Database['public']['Tables']['product_images']['Row'][]
  features?: Database['public']['Tables']['product_features']['Row'][]
  specifications?: Database['public']['Tables']['product_specifications']['Row'][]
}

export interface ProductsResponse {
  data?: {
    products: Product[]
    total: number
    totalPages: number
  }
  error?: {
    message: string
  }
}

export interface ProductFilters {
  categorySlug?: string
  search?: string
  page?: number
  limit?: number
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'popular'
}

