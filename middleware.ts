import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;

  // Bỏ qua các route không cần kiểm tra
  if (pathname === '/admin/login' || pathname === '/api/admin/seed' || pathname === '/admin/seed') {
    return res;
  }

  // Kiểm tra xem người dùng đã đăng nhập chưa
  if (pathname.startsWith('/admin')) {
    const storedUser = req.cookies.get('user');

    if (!storedUser) {
      const redirectUrl = new URL('/admin/login', req.url);
      redirectUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    try {
      // Kiểm tra quyền admin
      const userData = JSON.parse(storedUser.value);

      // Nếu không có thông tin user, chuyển hướng đến trang login
      if (!userData || !userData.id) {
        const redirectUrl = new URL('/admin/login', req.url);
        redirectUrl.searchParams.set('redirectedFrom', pathname);
        return NextResponse.redirect(redirectUrl);
      }

      // Kiểm tra role từ cookie (sẽ được cập nhật trong login page)
      if (userData.role !== 'admin') {
        return NextResponse.redirect(new URL('/admin/unauthorized', req.url));
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      const redirectUrl = new URL('/admin/login', req.url);
      redirectUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

// Only run middleware on admin routes
export const config = {
  matcher: ['/admin/:path*', '/api/admin/seed'],
};
