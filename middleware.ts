// import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import type { Database } from '@/types/supabase';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;

  const storedUser = req.cookies.get('user');

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!storedUser) {
      const redirectUrl = new URL('/admin/login', req.url);
      redirectUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

// Only run middleware on admin routes
export const config = {
  matcher: ['/admin/:path*'],
};
