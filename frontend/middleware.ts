import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;

  // Cho phép truy cập các routes không cần bảo vệ
  if (pathname === '/login' || pathname === '/api/admin-seed' || pathname === '/admin/login') {
    return res;
  }

  // Kiểm tra xem route có phải admin không
  if (pathname.startsWith('/admin')) {
    // Middleware không thể truy cập localStorage, vì nó hoạt động ở server-side
    // Thay vào đó, chúng ta sẽ chuyển việc xác thực đến Client Component
    // Middleware chỉ kiểm tra sơ bộ

    // Kiểm tra cookie admin_token thay vì auth_token để phù hợp với auth.tsx
    const authCookie = req.cookies.get('admin_token');
    
    if (!authCookie || !authCookie.value) {
      // Cho phép truy cập trang login ngay cả khi không có token
      if (pathname === '/admin/login') {
        return res;
      }
      
      // Chuyển hướng đến trang đăng nhập admin
      const redirectUrl = new URL('/admin/login', req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

// Chỉ chạy middleware cho các route admin
export const config = {
  matcher: ['/admin/:path*'],
};
