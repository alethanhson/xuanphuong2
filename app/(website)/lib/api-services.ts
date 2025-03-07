import { get, post } from "./api-utils"
import type { ProductsResponse, Product, ProductFilters } from "@/types/product"
import type { BlogPostsResponse, BlogPost, BlogCategory } from "@/types/blog"
import type { ServicesResponse, Service } from "@/types/service"
import type { TestimonialsResponse } from "@/types/testimonial"
import type { CustomersResponse, CaseStudiesResponse, CaseStudy } from "@/types/customer"
import type { ContactFormData, ContactResponse } from "@/types/contact"

/**
 * Product API Services
 */
export const ProductService = {
  getProducts: (filters?: ProductFilters) => get<ProductsResponse>("/products", filters || {}),

  getProductBySlug: (slug: string) => get<Product>(`/products/${slug}`),

  getFeaturedProducts: (limit?: number) => get<ProductsResponse>("/products", { featured: true, limit }),

  getProductsByCategory: (categorySlug: string, filters?: ProductFilters) =>
    get<ProductsResponse>("/products", { ...filters, categorySlug }),

  getRelatedProducts: (productId: string, limit?: number) =>
    get<ProductsResponse>(`/products/${productId}/related`, { limit }),
}

/**
 * Blog API Services
 */
export const BlogService = {
  getPosts: (filters?: BlogFilters) => get<BlogPostsResponse>("/blog"),

  getPostBySlug: (slug: string) => get<BlogPost>(`/blog/${slug}`),

  getFeaturedPosts: (limit?: number) => get<BlogPostsResponse>("/blog", { featured: true, limit }),

  getCategories: () => get<BlogCategory[]>("/blog/categories"),

  getPostsByCategory: (categorySlug: string, filters?: BlogFilters) =>
    get<BlogPostsResponse>("/blog", { ...filters, categorySlug }),

  getRelatedPosts: (postId: string, limit?: number) => get<BlogPostsResponse>(`/blog/${postId}/related`, { limit }),
}

/**
 * Service API Services
 */
export const ServiceService = {
  getServices: () => get<ServicesResponse>("/services"),

  getServiceBySlug: (slug: string) => get<Service>(`/services/${slug}`),

  getFeaturedServices: () => get<ServicesResponse>("/services", { featured: true }),
}

/**
 * Testimonial API Services
 */
export const TestimonialService = {
  getTestimonials: (limit?: number) => get<TestimonialsResponse>("/testimonials", { limit }),
}

/**
 * Customer API Services
 */
export const CustomerService = {
  getCustomers: (limit?: number) => get<CustomersResponse>("/customers", { limit }),

  getFeaturedCustomers: (limit?: number) => get<CustomersResponse>("/customers", { featured: true, limit }),

  getCaseStudies: (limit?: number) => get<CaseStudiesResponse>("/case-studies", { limit }),

  getCaseStudyBySlug: (slug: string) => get<CaseStudy>(`/case-studies/${slug}`),
}

/**
 * Contact API Services
 */
export const ContactService = {
  submitContactForm: (data: ContactFormData) => post<ContactResponse, ContactFormData>("/contact", data),
}

export interface BlogFilters {
  category?: string
  author?: string
  [key: string]: any
}

