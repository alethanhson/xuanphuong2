import type { ApiResponse, DashboardStats, ChartData, CategoryChartData, Order, Customer } from "@/types";
import { createClient } from '@supabase/supabase-js';

// Khởi tạo Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Hàm trợ giúp để tạo response chuẩn
function createResponse<T>(success: boolean, data?: T, message?: string): ApiResponse<T> {
  return {
    success,
    data,
    message,
  };
}

// Dashboard service
export const dashboardService = {
  // Lấy thống kê tổng quan
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    try {
      // Trong thực tế, bạn sẽ gọi API để lấy dữ liệu từ server
      // Ở đây chúng ta sẽ trả về dữ liệu mẫu
      return createResponse(true, {
        revenue: 152500000,
        revenueChange: 12.5,
        orders: 45,
        ordersChange: 8.2,
        customers: 28,
        customersChange: 15.3,
        products: 32,
        productsChange: -5.2,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return createResponse(false, undefined, "Không thể lấy dữ liệu thống kê");
    }
  },

  // Lấy dữ liệu biểu đồ doanh thu
  getRevenueChart: async (): Promise<ApiResponse<ChartData[]>> => {
    try {
      // Trong thực tế, bạn sẽ gọi API để lấy dữ liệu từ server
      return createResponse(true, [
        { name: "Tháng 1", total: 18000000 },
        { name: "Tháng 2", total: 22000000 },
        { name: "Tháng 3", total: 25000000 },
        { name: "Tháng 4", total: 19000000 },
        { name: "Tháng 5", total: 28000000 },
        { name: "Tháng 6", total: 32000000 },
        { name: "Tháng 7", total: 35000000 },
        { name: "Tháng 8", total: 40000000 },
        { name: "Tháng 9", total: 38000000 },
        { name: "Tháng 10", total: 42000000 },
        { name: "Tháng 11", total: 45000000 },
        { name: "Tháng 12", total: 50000000 },
      ]);
    } catch (error) {
      console.error("Error fetching revenue chart data:", error);
      return createResponse(false, undefined, "Không thể lấy dữ liệu biểu đồ doanh thu");
    }
  },

  // Lấy dữ liệu biểu đồ danh mục
  getCategoryChart: async (): Promise<ApiResponse<CategoryChartData[]>> => {
    try {
      // Trong thực tế, bạn sẽ gọi API để lấy dữ liệu từ server
      return createResponse(true, [
        { name: "Máy CNC Gỗ", value: 45 },
        { name: "Máy CNC Kim Loại", value: 25 },
        { name: "Máy CNC Laser", value: 20 },
        { name: "Phụ kiện CNC", value: 10 },
      ]);
    } catch (error) {
      console.error("Error fetching category chart data:", error);
      return createResponse(false, undefined, "Không thể lấy dữ liệu biểu đồ danh mục");
    }
  },

  // Lấy danh sách đơn hàng gần đây
  getRecentOrders: async (): Promise<ApiResponse<Order[]>> => {
    try {
      // Trong thực tế, bạn sẽ gọi API để lấy dữ liệu từ server
      return createResponse(true, [
        {
          id: "1",
          orderNumber: "ORD-001",
          customerId: "1",
          customer: { name: "Nguyễn Văn A", email: "nguyenvana@example.com" } as Customer,
          items: [],
          status: "completed",
          totalAmount: 12500000,
          paymentMethod: "bank_transfer",
          paymentStatus: "paid",
          shippingAddress: {} as any,
          billingAddress: {} as any,
          createdAt: "2023-11-05T12:00:00",
          updatedAt: "2023-11-05T12:00:00",
        },
        {
          id: "2",
          orderNumber: "ORD-002",
          customerId: "2",
          customer: { name: "Trần Thị B", email: "tranthib@example.com" } as Customer,
          items: [],
          status: "processing",
          totalAmount: 8900000,
          paymentMethod: "cod",
          paymentStatus: "pending",
          shippingAddress: {} as any,
          billingAddress: {} as any,
          createdAt: "2023-11-04T15:30:00",
          updatedAt: "2023-11-04T15:30:00",
        },
        {
          id: "3",
          orderNumber: "ORD-003",
          customerId: "3",
          customer: { name: "Lê Văn C", email: "levanc@example.com" } as Customer,
          items: [],
          status: "pending",
          totalAmount: 5600000,
          paymentMethod: "bank_transfer",
          paymentStatus: "pending",
          shippingAddress: {} as any,
          billingAddress: {} as any,
          createdAt: "2023-11-04T09:15:00",
          updatedAt: "2023-11-04T09:15:00",
        },
        {
          id: "4",
          orderNumber: "ORD-004",
          customerId: "4",
          customer: { name: "Phạm Thị D", email: "phamthid@example.com" } as Customer,
          items: [],
          status: "completed",
          totalAmount: 15200000,
          paymentMethod: "bank_transfer",
          paymentStatus: "paid",
          shippingAddress: {} as any,
          billingAddress: {} as any,
          createdAt: "2023-11-03T14:45:00",
          updatedAt: "2023-11-03T14:45:00",
        },
        {
          id: "5",
          orderNumber: "ORD-005",
          customerId: "5",
          customer: { name: "Hoàng Văn E", email: "hoangvane@example.com" } as Customer,
          items: [],
          status: "processing",
          totalAmount: 7800000,
          paymentMethod: "cod",
          paymentStatus: "pending",
          shippingAddress: {} as any,
          billingAddress: {} as any,
          createdAt: "2023-11-03T11:20:00",
          updatedAt: "2023-11-03T11:20:00",
        },
      ]);
    } catch (error) {
      console.error("Error fetching recent orders:", error);
      return createResponse(false, undefined, "Không thể lấy danh sách đơn hàng gần đây");
    }
  },

  // Lấy danh sách khách hàng hàng đầu
  getTopCustomers: async (): Promise<ApiResponse<Customer[]>> => {
    try {
      // Trong thực tế, bạn sẽ gọi API để lấy dữ liệu từ server
      return createResponse(true, [
        {
          id: "1",
          name: "Nguyễn Văn A",
          email: "nguyenvana@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          totalSpent: 12500000,
          createdAt: "",
          updatedAt: "",
        },
        {
          id: "2",
          name: "Trần Thị B",
          email: "tranthib@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          totalSpent: 8900000,
          createdAt: "",
          updatedAt: "",
        },
        {
          id: "3",
          name: "Lê Văn C",
          email: "levanc@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          totalSpent: 5600000,
          createdAt: "",
          updatedAt: "",
        },
        {
          id: "4",
          name: "Phạm Thị D",
          email: "phamthid@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          totalSpent: 15200000,
          createdAt: "",
          updatedAt: "",
        },
        {
          id: "5",
          name: "Hoàng Văn E",
          email: "hoangvane@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          totalSpent: 7800000,
          createdAt: "",
          updatedAt: "",
        },
      ]);
    } catch (error) {
      console.error("Error fetching top customers:", error);
      return createResponse(false, undefined, "Không thể lấy danh sách khách hàng hàng đầu");
    }
  },
};

// Các service khác có thể được thêm vào đây
export const productService = {
  // Các phương thức liên quan đến sản phẩm
};

export const orderService = {
  // Các phương thức liên quan đến đơn hàng
};

export const customerService = {
  // Các phương thức liên quan đến khách hàng
};
