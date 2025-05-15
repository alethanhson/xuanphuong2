'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Nếu đã hoàn thành kiểm tra xác thực và người dùng chưa đăng nhập
    if (!loading && !isAuthenticated) {
      // Nếu không phải trang đăng nhập, chuyển hướng về trang đăng nhập
      if (!pathname?.includes('/admin/login')) {
        router.push('/admin/login');
      }
    }
  }, [isAuthenticated, loading, router, pathname]);

  // Nếu đang tải, hiển thị trạng thái loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-t-blue-500 border-b-blue-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Nếu đã xác thực hoặc đang ở trang đăng nhập, hiển thị nội dung
  return <>{children}</>;
} 