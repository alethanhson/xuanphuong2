// Định nghĩa các interface chung cho toàn bộ ứng dụng

export interface BaseModel {
  id: string
  createdAt: string
  updatedAt: string
}

// Blog interfaces
export interface Blog extends BaseModel {
  title: string
  slug: string
  excerpt: string
  content: string
  categoryId: string
  category?: Category
  author: string
  status: "published" | "draft"
  views: number
  isFeatured: boolean
  metaTitle?: string
  metaDescription?: string
  tags?: string[]
  coverImage?: string
}

export interface Category extends BaseModel {
  name: string
  slug: string
  description?: string
  type: "blog" | "product"
}

// Product interfaces
export interface Product extends BaseModel {
  name: string
  slug: string
  description: string
  price: number
  salePrice?: number
  sku: string
  stock: number
  categoryId: string
  category?: Category
  images: string[]
  specifications?: ProductSpecification[]
  isFeatured: boolean
  status: "active" | "inactive" | "outOfStock"
  metaTitle?: string
  metaDescription?: string
}

export interface ProductSpecification {
  name: string
  value: string
}

// Order interfaces
export interface Order extends BaseModel {
  orderNumber: string
  customerId: string
  customer?: Customer
  items: OrderItem[]
  status: "pending" | "processing" | "completed" | "cancelled"
  totalAmount: number
  paymentMethod: string
  paymentStatus: "pending" | "paid" | "failed"
  shippingAddress: Address
  billingAddress: Address
  notes?: string
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
  total: number
}

export interface Customer extends BaseModel {
  name: string
  email: string
  phone?: string
  avatar?: string
  orders?: Order[]
  totalSpent: number
}

export interface Address {
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

// Dashboard interfaces
export interface DashboardStats {
  revenue: number
  revenueChange: number
  orders: number
  ordersChange: number
  customers: number
  customersChange: number
  products: number
  productsChange: number
}

export interface ChartData {
  name: string
  total: number
}

export interface CategoryChartData {
  name: string
  value: number
}

// Auth interfaces
export interface User extends BaseModel {
  name: string
  email: string
  role: "admin" | "editor" | "viewer"
  avatar?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

