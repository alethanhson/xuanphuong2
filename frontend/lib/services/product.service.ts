import axios from 'axios';

/**
 * Service để sử dụng trong các Server Component của Next.js
 */
// Khi chạy trên máy chủ, chúng ta không thể gọi trực tiếp các API từ client
// Thay vào đó, chúng ta sẽ sử dụng API tương đối để Next.js xử lý thông qua rewrites
const axiosInstance = axios.create({
  baseURL: 'http://xuanphuong2-backend-1:3001', // Sử dụng URL tương đối để hoạt động với rewrites
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 giây
});

export const ProductService = {
  /**
   * Lấy danh sách sản phẩm
   */
  getProducts: async (options?: { 
    limit?: number; 
    page?: number; 
    categorySlug?: string; 
    search?: string;
    sortBy?: string;
    featured?: boolean;
  }) => {
    try {
      // Chuyển đổi từ categorySlug sang category nếu cần
      const params: any = { ...options };
      if (params.categorySlug && params.categorySlug !== 'all') {
        params.category = params.categorySlug;
      }
      // Xóa categorySlug khỏi params vì API không cần tham số này
      delete params.categorySlug;
      
      const response = await axiosInstance.get('/api/products', { params });
      
      // Đảm bảo trả về đúng cấu trúc dữ liệu
      return {
        data: {
          products: response.data?.data || [],
          total: response.data?.total || 0,
          totalPages: response.data?.totalPages || 1
        },
        error: null
      };
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm:', error);
      return {
        data: {
          products: [],
          total: 0,
          totalPages: 0
        },
        error: error
      };
    }
  },

  /**
   * Lấy chi tiết sản phẩm theo slug
   */
  getProductBySlug: async (slug: string) => {
    try {
      const response = await axiosInstance.get(`/api/products/slug/${slug}`);
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
      const response = await axiosInstance.get('/api/products/categories');
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
   */
  getRelatedProducts: async (productId: string, limit: number = 4) => {
    try {
      const response = await axiosInstance.get(`/api/products/related/${productId}?limit=${limit}`);
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