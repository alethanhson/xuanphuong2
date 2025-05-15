'use client';

/**
 * API Client cho frontend
 * Tập trung tất cả các hàm API vào một file duy nhất
 */

import axios from 'axios';
import Cookies from 'js-cookie';
import { useState, useEffect, useCallback } from 'react';

// URL cơ sở của API
export const NESTJS_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Các đường dẫn API
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `/auth/login`,
  REGISTER: `/auth/register`,
  ME: `/auth/me`,
  
  // Sản phẩm
  PRODUCTS: `/products`,
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
  
  // Danh mục
  CATEGORIES: `/categories`,
  CATEGORY_DETAIL: (id: string) => `/categories/${id}`,
  
  // Dịch vụ
  SERVICES: `/services`,
  SERVICE_DETAIL: (id: string) => `/services/${id}`,
  
  // Khách hàng
  CUSTOMERS: `/customers`,
  CUSTOMER_DETAIL: (id: string) => `/customers/${id}`,
  
  // Blog
  BLOGS: `/blogs`,
  BLOG_DETAIL: (id: string) => `/blogs/${id}`,
  
  // Liên hệ
  CONTACTS: `/contacts`,
  CONTACT_DETAIL: (id: string) => `/contacts/${id}`,
  
  // Analytics
  ANALYTICS_TRACK: `/analytics/track`,
  ANALYTICS_STATS: `/analytics/stats`,
  
  // Admin
  ADMIN_PRODUCTS: `/admin/products`,
  ADMIN_PRODUCT_DETAIL: (id: string) => `/admin/products/${id}`,
  ADMIN_CATEGORIES: `/admin/categories`,
  ADMIN_CATEGORY_DETAIL: (id: string) => `/admin/categories/${id}`,
  
  // Admin Seed API
  ADMIN_SEED: `/admin-seed`,
};

// Cấu hình mặc định cho API requests
export const API_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 giây
};

// Tạo axios instance với cấu hình mặc định
const apiClient = axios.create({
  baseURL: '/api', // Sử dụng proxy đã cấu hình trong next.config.mjs
  headers: API_CONFIG.headers,
  timeout: API_CONFIG.timeout,
});

// Thêm interceptor để xử lý token
apiClient.interceptors.request.use((config) => {
  // Lấy token từ localStorage (client-side)
  if (typeof window !== 'undefined') {
    // Ưu tiên sử dụng admin_token cho các route admin nếu có
    const isAdminRoute = config.url?.includes('/admin');
    const token = isAdminRoute 
      ? localStorage.getItem('admin_token')
      : localStorage.getItem('auth_token');
      
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Log để debug (chỉ trong development)
      if (process.env.NODE_ENV === 'development') {
        console.log('API Request with token:', config.url);
      }
    } else if (process.env.NODE_ENV === 'development') {
      console.log('API Request without token:', config.url);
    }
  }
  return config;
});

// Thêm interceptor response để xử lý lỗi
apiClient.interceptors.response.use(
  (response) => {
    // Log để debug (chỉ trong development)
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response success:', response.config.url);
    }
    return response;
  },
  (error) => {
    // Log lỗi để debug
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error.config?.url, error.response?.status, error.message);
    }
    
    // Xử lý lỗi 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      // Xóa token và chuyển hướng đến trang đăng nhập
      if (typeof window !== 'undefined') {
        console.log('Token không hợp lệ, đang xóa...');
        const isAdminRoute = error.config?.url?.includes('/admin');
        
        if (isAdminRoute) {
          localStorage.removeItem('admin_token');
          window.location.href = '/admin/login';
        } else {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Xuất cả apiClient mặc định và phiên bản không thêm headers cho các API public
export const publicApiClient = axios.create({
  baseURL: '/api',
  headers: API_CONFIG.headers,
  timeout: API_CONFIG.timeout,
});

/**
 * Hàm trợ giúp để lấy headers với token xác thực
 */
export const getAuthHeaders = (token?: string, isAdmin: boolean = false) => {
  if (token) {
    return {
      ...API_CONFIG.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  
  if (typeof window !== 'undefined') {
    // Ưu tiên sử dụng admin_token cho các route admin
    const authToken = isAdmin
      ? localStorage.getItem('admin_token')
      : localStorage.getItem('auth_token');
      
    return {
      ...API_CONFIG.headers,
      Authorization: authToken ? `Bearer ${authToken}` : '',
    };
  }
  
  return API_CONFIG.headers;
};

// Authentication
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post(API_ENDPOINTS.LOGIN, { email, password });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },
  
  adminLogin: async (email: string, password: string) => {
    const response = await apiClient.post('/admin/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('admin_token', response.data.token);
    }
    return response.data;
  },
  
  register: async (userData: any) => {
    const response = await apiClient.post(API_ENDPOINTS.REGISTER, userData);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('auth_token');
  },
  
  adminLogout: () => {
    localStorage.removeItem('admin_token');
  },
  
  getCurrentUser: async () => {
    const response = await apiClient.get(API_ENDPOINTS.ME);
    return response.data;
  },
};

// Products
export const productApi = {
  getAll: async (params?: any) => {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS, { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCT_DETAIL(id));
    return response.data;
  },
  
  getBySlug: async (slug: string) => {
    const response = await apiClient.get(`/products/slug/${slug}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  getRelatedProducts: async (productId: string, limit: number = 4) => {
    const response = await apiClient.get(`/products/related/${productId}?limit=${limit}`);
    return response.data;
  },
  
  create: async (productData: any) => {
    const response = await apiClient.post(API_ENDPOINTS.PRODUCTS, productData);
    return response.data;
  },
  
  update: async (id: string, productData: any) => {
    const response = await apiClient.patch(API_ENDPOINTS.PRODUCT_DETAIL(id), productData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await apiClient.delete(API_ENDPOINTS.PRODUCT_DETAIL(id));
    return response.data;
  },
};

// Services
export const serviceApi = {
  getAll: async (params?: any) => {
    const response = await apiClient.get(API_ENDPOINTS.SERVICES, { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await apiClient.get(API_ENDPOINTS.SERVICE_DETAIL(id));
    return response.data;
  },
  
  create: async (serviceData: any) => {
    const response = await apiClient.post(API_ENDPOINTS.SERVICES, serviceData);
    return response.data;
  },
  
  update: async (id: string, serviceData: any) => {
    const response = await apiClient.patch(API_ENDPOINTS.SERVICE_DETAIL(id), serviceData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await apiClient.delete(API_ENDPOINTS.SERVICE_DETAIL(id));
    return response.data;
  },
};

// Customers
export const customerApi = {
  getAll: async (params?: any) => {
    const response = await apiClient.get(API_ENDPOINTS.CUSTOMERS, { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await apiClient.get(API_ENDPOINTS.CUSTOMER_DETAIL(id));
    return response.data;
  },
  
  create: async (customerData: any) => {
    const response = await apiClient.post(API_ENDPOINTS.CUSTOMERS, customerData);
    return response.data;
  },
  
  update: async (id: string, customerData: any) => {
    const response = await apiClient.patch(API_ENDPOINTS.CUSTOMER_DETAIL(id), customerData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await apiClient.delete(API_ENDPOINTS.CUSTOMER_DETAIL(id));
    return response.data;
  },
};

// Blog
export const blogApi = {
  getAll: async (params?: any) => {
    const response = await apiClient.get(API_ENDPOINTS.BLOGS, { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await apiClient.get(API_ENDPOINTS.BLOG_DETAIL(id));
    return response.data;
  },
  
  create: async (blogData: any) => {
    const response = await apiClient.post(API_ENDPOINTS.BLOGS, blogData);
    return response.data;
  },
  
  update: async (id: string, blogData: any) => {
    const response = await apiClient.patch(API_ENDPOINTS.BLOG_DETAIL(id), blogData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await apiClient.delete(API_ENDPOINTS.BLOG_DETAIL(id));
    return response.data;
  },
};

// Contacts
export const contactApi = {
  submit: async (contactData: any) => {
    const response = await apiClient.post(API_ENDPOINTS.CONTACTS, contactData);
    return response.data;
  },
  
  getAll: async (params?: any) => {
    const response = await apiClient.get(API_ENDPOINTS.CONTACTS, { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await apiClient.get(API_ENDPOINTS.CONTACT_DETAIL(id));
    return response.data;
  },
  
  update: async (id: string, contactData: any) => {
    const response = await apiClient.patch(API_ENDPOINTS.CONTACT_DETAIL(id), contactData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await apiClient.delete(API_ENDPOINTS.CONTACT_DETAIL(id));
    return response.data;
  },
};

/**
 * Service API cho phần Dashboard
 */
export const dashboardService = {
  /**
   * Lấy thống kê tổng quan
   */
  async getStats(): Promise<any> {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  },
  
  /**
   * Lấy dữ liệu biểu đồ doanh thu
   */
  async getRevenueChart(): Promise<any[]> {
    const response = await apiClient.get('/dashboard/revenue-chart');
    return response.data;
  },
  
  /**
   * Lấy dữ liệu lượt xem trang
   */
  async getPageViews(): Promise<any[]> {
    const response = await apiClient.get('/dashboard/page-views');
    return response.data;
  },
  
  /**
   * Lấy dữ liệu thống kê người truy cập
   */
  async getVisitorStats(): Promise<any[]> {
    const response = await apiClient.get('/dashboard/visitor-stats');
    return response.data;
  },
  
  /**
   * Lấy danh sách đơn hàng gần đây
   */
  async getRecentOrders(): Promise<any[]> {
    const response = await apiClient.get('/dashboard/recent-orders');
    return response.data;
  },
};

/**
 * Hook cơ bản để thực hiện các request API
 */
export function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<T>(url);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData };
}

/**
 * Hook xác thực người dùng
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const login = async (email: string, password: string) => {
    try {
      const { token, user } = await authApi.login(email, password);
      setUser(user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Đăng nhập thất bại' };
    }
  };

  const logout = async () => {
    try {
      authApi.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    }
  };

  const checkAuth = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      const user = await authApi.getCurrentUser();
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('auth_token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    checkAuth
  };
}

/**
 * Hook tùy chỉnh để lấy dữ liệu từ API
 */
export function useFetch<T, P = void>(
  fetcher: (params?: P) => Promise<T>,
  params?: P,
  options: {
    initialData?: T;
    dependencies?: any[];
    enabled?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  } = {}
) {
  const { initialData = null, dependencies = [], enabled = true, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const result = await fetcher(params);
      setData(result);
      if (onSuccess) onSuccess(result);
    } catch (err) {
      setIsError(true);
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      if (onError) onError(errorObj);
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, params, enabled, onSuccess, onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  return { data, isLoading, isError, error, refetch: fetchData };
}

export const productService = {
  getProducts: async (options?: { 
    limit?: number; 
    page?: number; 
    category?: string; 
    featured?: boolean;
  }) => {
    try {
      const response = await apiClient.get('/products', { params: options });
      return {
        data: response.data?.data || [],
        error: null
      };
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm:', error);
      return {
        data: [],
        error: error
      };
    }
  },

  /**
   * Lấy chi tiết sản phẩm theo ID
   * @param id ID của sản phẩm
   */
  getProductById: async (id: string) => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return {
        data: response.data?.data || null,
        error: null
      };
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
      return {
        data: null,
        error: error
      };
    }
  },

  /**
   * Lấy chi tiết sản phẩm theo slug
   * @param slug Slug của sản phẩm
   */
  getProductBySlug: async (slug: string) => {
    try {
      const response = await apiClient.get(`/products/slug/${slug}`);
      return {
        data: response.data?.data || null,
        error: null
      };
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
      return {
        data: null,
        error: error
      };
    }
  },

  /**
   * Lấy danh sách danh mục sản phẩm
   */
  getCategories: async () => {
    try {
      const response = await apiClient.get('/products/categories');
      return {
        data: response.data?.data || [],
        error: null
      };
    } catch (error) {
      console.error('Lỗi khi lấy danh mục sản phẩm:', error);
      return {
        data: [],
        error: error
      };
    }
  },

  /**
   * Lấy sản phẩm liên quan
   * @param productId ID của sản phẩm
   * @param limit Số lượng sản phẩm liên quan cần lấy
   */
  getRelatedProducts: async (productId: string, limit: number = 4) => {
    try {
      const response = await apiClient.get(`/products/related/${productId}?limit=${limit}`);
      return {
        data: response.data?.data || [],
        error: null
      };
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm liên quan:', error);
      return {
        data: [],
        error: error
      };
    }
  }
};

// Để tương thích ngược, giữ lại tên ProductService nhưng trỏ tới productService
export const ProductService = productService;

export default apiClient; 