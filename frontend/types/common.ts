export interface ApiResponse<T> {
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    [key: string]: any
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface SortParams {
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface FilterParams {
  [key: string]: string | number | boolean | undefined
}

export interface QueryParams extends PaginationParams, SortParams, FilterParams {}

export interface SeoMeta {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  ogType?: "website" | "article" | "product"
  twitterCard?: "summary" | "summary_large_image"
}

export interface MenuItem {
  id: string
  label: string
  href: string
  children?: MenuItem[]
  isExternal?: boolean
}

export interface SiteConfig {
  name: string
  description: string
  url: string
  ogImage?: string
  links: {
    twitter?: string
    facebook?: string
    instagram?: string
    linkedin?: string
    youtube?: string
  }
  contact: {
    phone: string
    email: string
    address: string
    workingHours: string[]
  }
  mainNav: MenuItem[]
  footerNav: {
    title: string
    items: MenuItem[]
  }[]
}

