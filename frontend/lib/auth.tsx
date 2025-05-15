'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import { NESTJS_API_URL, API_ENDPOINTS } from './api';
import Cookies from 'js-cookie';

// Định nghĩa kiểu dữ liệu cho user
interface User {
  id: number | string;
  email: string;
  name: string;
  role: string;
}

// Định nghĩa kiểu dữ liệu cho context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Tạo context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook để sử dụng context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth phải được sử dụng trong AuthProvider');
  }
  return context;
}

// AuthProvider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Kiểm tra xác thực khi component được mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('admin_token');
        const userData = localStorage.getItem('admin_user');
        
        if (token && userData) {
          setUser(JSON.parse(userData));
          
          // Đảm bảo token cũng được lưu trong cookie
          if (typeof Cookies !== 'undefined') {
            Cookies.set('admin_token', token, { expires: 7, path: '/' });
          }
        } else {
          setUser(null);
          // Xóa cookie nếu không có token trong localStorage
          if (typeof Cookies !== 'undefined') {
            Cookies.remove('admin_token', { path: '/' });
          }
          
          // Chuyển hướng đến trang đăng nhập nếu đang ở trang admin nhưng chưa đăng nhập
          if (pathname?.includes('/admin') && !pathname?.includes('/admin/login')) {
            router.push('/admin/login');
          }
        }
      } catch (error) {
        console.error('Lỗi xác thực:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Hàm đăng nhập
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // URL đúng là ${NESTJS_API_URL}/api/auth/login
      const apiUrl = `${NESTJS_API_URL}/api/auth/login`;
      console.log('Đang gửi yêu cầu đăng nhập đến:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Email hoặc mật khẩu không đúng');
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (data.access_token) {
        const token = data.access_token;
        localStorage.setItem('auth_token', token);
        
        // Nếu là admin, lưu thêm admin_token
        if (data.user?.role === 'ADMIN') {
          localStorage.setItem('admin_token', token);
        }
        
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        
        // Lưu token vào cookie để middleware có thể truy cập
        if (typeof Cookies !== 'undefined') {
          Cookies.set('admin_token', token, { expires: 7, path: '/' });
        }
        
        // Cập nhật state
        setUser(data.user);
        
        console.log('Đăng nhập thành công, đang chuyển hướng đến /admin');
        
        // Chuyển hướng đến trang dashboard với cờ replace để tránh vấn đề lịch sử
        setTimeout(() => {
          router.push('/admin');
        }, 500); // Tăng thời gian chờ để đảm bảo cookies được lưu
        
      } else {
        throw new Error('Token không được trả về từ server');
      }
    } catch (error: any) {
      console.error('Lỗi đăng nhập:', error);
      console.error('Chi tiết lỗi:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Đã xảy ra lỗi khi đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    // Xóa token và thông tin người dùng từ localStorage
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    
    // Xóa cookie
    if (typeof Cookies !== 'undefined') {
      Cookies.remove('admin_token', { path: '/' });
    }
    
    // Cập nhật state
    setUser(null);
    
    // Chuyển hướng đến trang đăng nhập
    router.push('/admin/login');
  };

  // Giá trị được cung cấp bởi context
  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 