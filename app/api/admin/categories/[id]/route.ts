import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';


async function checkAdminPermission(supabase: any) {
  // Check if user is authenticated and has admin role
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { authorized: false, status: 401, message: 'Unauthorized' };
  }

  // Get user metadata to check role
  const { data: userData } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!userData || userData.role !== 'admin') {
    return { authorized: false, status: 403, message: 'Forbidden' };
  }

  return { authorized: true, user };
}

// Cập nhật danh mục
export async function PUT(
  request: Request,
  { params }: { params: { id: any } }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = await params;
    // Parse the request body
    const categoryData = await request.json();
    categoryData.updated_at = new Date().toISOString();

    // Cập nhật danh mục
    const { data: category, error } = await supabase
      .from("categories")
      .update(categoryData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Revalidate the categories page to update the cache
    revalidatePath('/admin/products/categories');

    return NextResponse.json({
      success: true,
      category: category,
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Xóa danh mục
export async function DELETE(
    request: Request,
    { params }: { params: { id: any } }
  ) {
    try {
      const supabase = await createServerSupabaseClient();

      const { id } = await params;

      const { error } = await supabase.from("categories").delete().eq("id", id);

      if (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Revalidate the categories page to update the cache
      revalidatePath('/admin/products/categories');

      return NextResponse.json({
        success: true,
        message: 'Category deleted successfully',
      });
    } catch (error) {
      console.error('Server error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

// Lấy thông tin một danh mục
export async function GET(
  request: Request,
  { params }: { params: { id: any } }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = await params;

    const { data: category, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error('Error fetching category:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      category: category,
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
