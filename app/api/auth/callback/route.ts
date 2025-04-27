import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Khởi tạo Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function GET(request: NextRequest) {
  try {
    // Lấy các tham số từ URL
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const next = requestUrl.searchParams.get('next') || '/admin';
    
    if (!code) {
      return NextResponse.redirect(new URL('/', requestUrl.origin));
    }

    // Khởi tạo supabase admin client để xác thực token
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Đổi code lấy về từ trang đăng nhập thành session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error || !data.session) {
      console.error('Error exchanging code for session:', error);
      return NextResponse.redirect(new URL('/', requestUrl.origin));
    }
    
    // Lưu token vào cookie để middleware có thể kiểm tra
    const cookieStore = cookies();
    cookieStore.set('sb-access-token', data.session.access_token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 tuần
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    
    // Lưu refresh token
    cookieStore.set('sb-refresh-token', data.session.refresh_token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 ngày
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    
    // Lưu thông tin user để dễ truy cập (không bao gồm thông tin nhạy cảm)
    const userData = {
      id: data.user?.id,
      email: data.user?.email,
      role: data.user?.role,
      lastSignIn: new Date().toISOString(),
    };
    
    cookieStore.set('user-info', JSON.stringify(userData), {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 tuần
      httpOnly: false, // Có thể truy cập từ JS client
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    
    // Chuyển hướng đến trang tiếp theo (thường là trang admin)
    return NextResponse.redirect(new URL(next, requestUrl.origin));
  } catch (error) {
    console.error('Lỗi xử lý callback:', error);
    // Chuyển hướng về trang chủ nếu có lỗi
    return NextResponse.redirect(new URL('/', new URL(request.url).origin));
  }
} 