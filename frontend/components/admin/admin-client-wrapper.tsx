"use client"

import dynamic from 'next/dynamic';
import { ReactNode, useState, useEffect } from 'react';
import { AuthProvider } from '@/lib/auth';
import { usePathname } from 'next/navigation';

// Dynamically import components to avoid hydration issues
const AdminHeader = dynamic(() => import('@/components/admin/admin-header'), { ssr: false });
const AdminSidebar = dynamic(() => import('@/components/admin/admin-sidebar'), { ssr: false });
const ProtectedRoute = dynamic(() => import('@/components/admin/protected-route'), { ssr: false });

interface AdminClientWrapperProps {
  children: ReactNode;
}

export default function AdminClientWrapper({ children }: AdminClientWrapperProps) {
  // Sử dụng state để kiểm soát việc render
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isLoginPage = pathname?.includes('/admin/login');

  // Đánh dấu component đã được mount
  useEffect(() => {
    setMounted(true);

    // Xóa các thuộc tính do extension thêm vào
    const body = document.querySelector("body");
    if (body) {
      // Xóa các thuộc tính monica
      if (body.hasAttribute("monica-id")) {
        body.removeAttribute("monica-id");
      }
      if (body.hasAttribute("monica-version")) {
        body.removeAttribute("monica-version");
      }

      // Xóa các thuộc tính khác có thể gây ra lỗi hydration
      const attributesToRemove = Array.from(body.attributes)
        .filter(attr => attr.name.startsWith('data-') || attr.name.includes('-'))
        .map(attr => attr.name);

      attributesToRemove.forEach(attr => {
        if (attr !== 'data-theme' && attr !== 'class') {
          body.removeAttribute(attr);
        }
      });
    }
  }, []);

  // Sử dụng two-pass rendering để tránh lỗi hydration
  // Chỉ render nội dung thực sự sau khi component đã được mount ở client
  if (!mounted) {
    // Render một placeholder có cấu trúc tương tự để tránh layout shift
    return (
      <div className="min-h-screen bg-background">
        <div className="hidden lg:block w-[280px]"></div>
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
          <div className="flex flex-col lg:col-start-2">
            <div className="h-16 lg:h-[60px] border-b"></div>
            <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-6">
              {/* Placeholder cho children */}
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2.5"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2.5"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2.5"></div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  // Render nội dung thực sự sau khi component đã được mount
  return (
    <AuthProvider>
      {isLoginPage ? (
        // Trang đăng nhập không cần sidebar và header
        <div className="min-h-screen bg-background">
          {children}
        </div>
      ) : (
        // Các trang admin khác cần bảo vệ và có layout đầy đủ
        <ProtectedRoute>
          <div className="min-h-screen bg-background">
            <AdminSidebar />
            <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
              <div className="flex flex-col lg:col-start-2">
                <AdminHeader />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-6">
                  {children}
                </main>
              </div>
            </div>
          </div>
        </ProtectedRoute>
      )}
    </AuthProvider>
  );
}
