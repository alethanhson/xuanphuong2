import type { ApiResponse } from "@/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

/**
 * Tạo một API client đơn giản với các phương thức cơ bản
 */
export const apiClient = {
  /**
   * Gửi request GET đến API
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("API request failed:", error)
      return {
        data: {} as T,
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      }
    }
  },

  /**
   * Gửi request POST đến API
   */
  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("API request failed:", error)
      return {
        data: {} as T,
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      }
    }
  },

  /**
   * Gửi request PUT đến API
   */
  async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("API request failed:", error)
      return {
        data: {} as T,
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      }
    }
  },

  /**
   * Gửi request DELETE đến API
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("API request failed:", error)
      return {
        data: {} as T,
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      }
    }
  },

  /**
   * Tải lên file đến API
   */
  async uploadFile<T>(endpoint: string, file: File): Promise<ApiResponse<T>> {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("API request failed:", error)
      return {
        data: {} as T,
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      }
    }
  },
}

/**
 * Lấy token xác thực từ localStorage
 */
function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("admin_user")
    if (user) {
      const userData = JSON.parse(user)
      return userData.token || null
    }
  }
  return null
}

/**
 * API service cho blog
 */
export const blogService = {
  getBlogs: () => apiClient.get<Blog[]>("/blogs"),
  getBlog: (id: string) => apiClient.get<Blog>(`/blogs/${id}`),
  createBlog: (blog: Partial<Blog>) => apiClient.post<Blog>("/blogs", blog),
  updateBlog: (id: string, blog: Partial<Blog>) => apiClient.put<Blog>(`/blogs/${id}`, blog),
  deleteBlog: (id: string) => apiClient.delete<void>(`/blogs/${id}`),
  uploadBlogImage: (file: File) => apiClient.uploadFile<{ url: string }>("/upload/blog", file),
}

/**
 * API service cho danh mục
 */
export const categoryService = {
  getCategories: (type?: "blog" | "product") => {
    const endpoint = type ? `/categories?type=${type}` : "/categories"
    return apiClient.get<Category[]>(endpoint)
  },
  getCategory: (id: string) => apiClient.get<Category>(`/categories/${id}`),
  createCategory: (category: Partial<Category>) => apiClient.post<Category>("/categories", category),
  updateCategory: (id: string, category: Partial<Category>) => apiClient.put<Category>(`/categories/${id}`, category),
  deleteCategory: (id: string) => apiClient.delete<void>(`/categories/${id}`),
}

/**
 * API service cho sản phẩm
 */
export const productService = {
  getProducts: () => apiClient.get<Product[]>("/products"),
  getProduct: (id: string) => apiClient.get<Product>(`/products/${id}`),
  createProduct: (product: Partial<Product>) => apiClient.post<Product>("/products", product),
  updateProduct: (id: string, product: Partial<Product>) => apiClient.put<Product>(`/products/${id}`, product),
  deleteProduct: (id: string) => apiClient.delete<void>(`/products/${id}`),
  uploadProductImage: (file: File) => apiClient.uploadFile<{ url: string }>("/upload/product", file),
}

/**
 * API service cho đơn hàng
 */
export const orderService = {
  getOrders: () => apiClient.get<Order[]>("/orders"),
  getOrder: (id: string) => apiClient.get<Order>(`/orders/${id}`),
  updateOrderStatus: (id: string, status: Order["status"]) => apiClient.put<Order>(`/orders/${id}/status`, { status }),
  updatePaymentStatus: (id: string, paymentStatus: Order["paymentStatus"]) =>
    apiClient.put<Order>(`/orders/${id}/payment-status`, { paymentStatus }),
}

/**
 * API service cho dashboard
 */
export const dashboardService = {
  getStats: () => apiClient.get<DashboardStats>("/dashboard/stats"),
  getRevenueChart: () => apiClient.get<ChartData[]>("/dashboard/revenue-chart"),
  getCategoryChart: () => apiClient.get<CategoryChartData[]>("/dashboard/category-chart"),
  getRecentOrders: () => apiClient.get<Order[]>("/dashboard/recent-orders"),
  getTopCustomers: () => apiClient.get<Customer[]>("/dashboard/top-customers"),
}

/**
 * API service cho xác thực
 */
export const authService = {
  login: (credentials: LoginCredentials) => apiClient.post<{ user: User; token: string }>("/auth/login", credentials),
  logout: () => apiClient.post<void>("/auth/logout", {}),
  getCurrentUser: () => apiClient.get<User>("/auth/me"),
}

// Import các types
import type {
  Blog,
  Category,
  Product,
  Order,
  Customer,
  DashboardStats,
  ChartData,
  CategoryChartData,
  User,
  LoginCredentials,
} from "@/types"

