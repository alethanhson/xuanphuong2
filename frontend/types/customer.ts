export interface Customer {
  id: string
  name: string
  logo: string
  industry?: string
  description?: string
  website?: string
  isFeatured?: boolean
}

export interface CaseStudy {
  id: string
  title: string
  slug: string
  customer: Customer
  challenge: string
  solution: string
  results: string
  image: string
  productUsed?: string
  industry?: string
  metrics?: {
    name: string
    value: string
    unit?: string
  }[]
  testimonial?: string
  testimonialAuthor?: string
  testimonialRole?: string
}

export interface CustomersResponse {
  customers: Customer[]
  total: number
}

export interface CaseStudiesResponse {
  caseStudies: CaseStudy[]
  total: number
}

