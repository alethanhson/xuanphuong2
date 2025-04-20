import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  try {
    // Kiểm tra môi trường
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Seed API is not available in production' },
        { status: 403 }
      );
    }

    // Sử dụng client với service role key nếu có, nếu không sử dụng client thông thường
    let supabase;
    try {
      supabase = await createServerSupabaseClient();
    } catch (error) {
      console.log('Falling back to regular client');
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase credentials');
      }

      supabase = createClient(supabaseUrl, supabaseAnonKey);
    }

    // Kiểm tra xem tài khoản đã tồn tại chưa bằng cách thử đăng nhập
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'xuanphuong@gmail.com',
      password: 'admin123',
    });

    // Nếu đăng nhập thành công, tài khoản đã tồn tại
    if (signInData?.user) {
      console.log('Admin account already exists');
      return NextResponse.json(
        { message: 'Admin account already exists', user: signInData.user },
        { status: 200 }
      );
    }

    // Nếu lỗi không phải là "Invalid login credentials", có thể là lỗi khác
    if (signInError && !signInError.message.includes('Invalid login credentials')) {
      console.error('Error checking existing user:', signInError);
      return NextResponse.json(
        { error: signInError.message },
        { status: 500 }
      );
    }

    // Tạo tài khoản admin bằng phương thức đăng ký thông thường
    const { data: user, error: signUpError } = await supabase.auth.signUp({
      email: 'xuanphuong@gmail.com',
      password: 'admin123',
    });

    // Xác nhận email ngay lập tức nếu có service role key
    try {
      await supabase.auth.admin.updateUserById(
        user?.user?.id as string,
        { email_confirm: true }
      );
    } catch (error) {
      console.log('Could not auto-confirm email, user will need to confirm via email');
    }

    if (signUpError) {
      console.error('Error creating admin user:', signUpError);
      return NextResponse.json(
        { error: signUpError.message },
        { status: 500 }
      );
    }

    // Tạo profile với role admin
    if (user && user.user) {
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.user.id,
            first_name: 'Xuan',
            last_name: 'Phuong',
            role: 'admin',
            created_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error('Error creating admin profile:', profileError);
          // Không trả về lỗi vì có thể bảng profiles chưa tồn tại
          // Vẫn tiếp tục với việc tạo tài khoản
        }
      } catch (error) {
        console.error('Error creating admin profile:', error);
        // Không trả về lỗi vì có thể bảng profiles chưa tồn tại
        // Vẫn tiếp tục với việc tạo tài khoản
      }
    }

    return NextResponse.json(
      { message: 'Admin account created successfully', user },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
