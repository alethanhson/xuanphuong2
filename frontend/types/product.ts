export interface ProductCategory {
  id: string
  name: string
  slug: string
  description?: string
}

export interface ProductImage {
  id: string
  url: string
  alt?: string
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
  title: string
  name?: string
  slug: string
  description: string
  short_description?: string
  price: number
  images: ProductImage[]
  categoryId: string
  category?: ProductCategory
  features?: ProductFeature[]
  specifications?: ProductSpecification[]
  createdAt: string
  updatedAt: string
  
  // Các trường được bổ sung từ backend
  model?: string
  workingDimensions?: string
  workingSize?: string
  motorPower?: string
  power?: string
  spindlePower?: string
  spindleSpeed?: string
  movementSpeed?: string
  speed?: string
  accuracy?: string
  controlSystem?: string
  compatibleSoftware?: string
  fileFormats?: string
  powerConsumption?: string
  machineDimensions?: string
  dimensions?: string
  weight?: string
  warranty?: string
  origin?: string
  status?: string
  applications?: string
  application?: string
  isFeatured?: boolean
  highlightItems?: ProductHighlight[]
  specificationItems?: ProductSpecificationItem[]
  reviews?: ProductReview[]
  drillingUnit?: string
  sawUnit?: string
  vacuumPump?: string
  dustCollection?: string
  airPressure?: string
  toolChangerCapacity?: number
}

export interface ProductsResponse {
  data: {
    products: Product[]
    total: number
    totalPages: number
  }
  error?: any
}

export interface ProductFilters {
  page?: number
  limit?: number
  categorySlug?: string
  search?: string
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'popular'
  sortOrder?: 'asc' | 'desc'
  featured?: boolean
}

// Định nghĩa interfaces bổ sung từ backend
export interface ProductHighlight {
  id: string
  title: string
  description: string
  icon?: string
  order: number
}

export interface ProductSpecificationItem {
  id: string
  name: string
  value: string
  group?: string
  order: number
}

