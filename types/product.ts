import type { FilterParams } from "./common"

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

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  categoryId: string
  category?: ProductCategory
  price?: number | null // null means "contact for price"
  priceFormatted?: string
  images: ProductImage[]
  features?: ProductFeature[]
  specifications?: ProductSpecification[]
  reviews?: ProductReview[]
  isFeatured?: boolean
  createdAt: string
  updatedAt: string

  // Additional properties
  model?: string
  workingDimensions?: string
  spindlePower?: string
  spindleSpeed?: string
  movementSpeed?: string
  accuracy?: string
  controlSystem?: string
  compatibleSoftware?: string
  fileFormats?: string
  powerConsumption?: string
  machineDimensions?: string
  weight?: string
  applications?: {
    furniture?: string
    interiorDecoration?: string
    advertising?: string
    woodIndustry: string[]
    advertisingIndustry: string[]
  }
}

export interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ProductFilters extends FilterParams {
  categoryId?: string
  categorySlug?: string
  search?: string
  featured?: boolean
  page?: number
  limit?: number
  sortBy?: "newest" | "price-asc" | "price-desc" | "popular"
}

