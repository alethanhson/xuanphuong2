export interface Testimonial {
  id: string
  author: string
  company?: string
  role?: string
  quote: string
  rating: number
  avatar?: string
  isActive: boolean
  createdAt: string
}

export interface TestimonialsResponse {
  testimonials: Testimonial[]
  total: number
}

