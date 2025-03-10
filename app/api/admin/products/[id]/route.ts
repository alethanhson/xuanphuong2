import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { Database } from '@/types/supabase';

// Định nghĩa kiểu dữ liệu cho specifications
type ProductSpecification = Database['public']['Tables']['product_specifications']['Row'];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Sử dụng destructuring để lấy id từ params
    const { id } = params || {};
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID sản phẩm không hợp lệ' },
        { status: 400 }
      );
    }

    // Chuyển đổi id từ string sang number
    const numericId = Number(id);
    
    if (isNaN(numericId)) {
      return NextResponse.json(
        { error: 'ID sản phẩm không hợp lệ' },
        { status: 400 }
      );
    }

    // Fetch the product with all related data
    try {
      const { data: product, error } = await supabase
        .from('products')
        .select(
          `
          *,
          categories:category_id(id, name, slug),
          images:product_images(*),
          features:product_features(*)
        `
        )
        .eq('id', numericId)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
          { error: 'Không thể tải sản phẩm' },
          { status: 500 }
        );
      }

      // Thử lấy specifications riêng nếu có
      let specifications: ProductSpecification[] = [];
      try {
        const { data: specs } = await supabase
          .from('product_specifications')
          .select('*')
          .eq('product_id', numericId);
        
        if (specs) {
          specifications = specs;
        }
      } catch (specError) {
        console.error('Error fetching specifications:', specError);
        // Không trả về lỗi, chỉ log và tiếp tục
      }

      // Trả về sản phẩm với specifications (nếu có)
      return NextResponse.json({
        ...product,
        specifications
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      return NextResponse.json(
        { error: 'Không thể tải sản phẩm' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Lỗi máy chủ nội bộ' },
      { status: 500 }
    );
  }
}

// Định nghĩa kiểu dữ liệu cho request body của PUT
interface UpdateProductRequest {
  name: string;
  slug: string;
  description: string;
  short_description?: string | null;
  category_id: number;
  price?: number | null;
  is_featured?: boolean;
  status: string;
  model?: string | null;
  working_dimensions?: string | null;
  spindle_power?: string | null;
  spindle_speed?: string | null;
  movement_speed?: string | null;
  accuracy?: string | null;
  control_system?: string | null;
  compatible_software?: string | null;
  file_formats?: string | null;
  power_consumption?: string | null;
  machine_dimensions?: string | null;
  weight?: string | null;
  images?: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  features?: Array<{
    title: string;
    description: string;
  }>;
  specifications?: Array<{
    name: string;
    value: string;
  }>;
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Sử dụng destructuring để lấy id từ params
    const { id } = params || {};
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID sản phẩm không hợp lệ' },
        { status: 400 }
      );
    }
    
    // Chuyển đổi id từ string sang number
    const numericId = Number(id);
    
    if (isNaN(numericId)) {
      return NextResponse.json(
        { error: 'ID sản phẩm không hợp lệ' },
        { status: 400 }
      );
    }
    
    const supabase = await createServerSupabaseClient();

    // Check if user is authenticated and has admin role
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user metadata to check role
    const { data: userData } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!userData || userData.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse request body
    const requestData: UpdateProductRequest = await request.json();
    
    // Prepare product data for update
    const productDetails = {
      name: requestData.name,
      slug: requestData.slug,
      description: requestData.description,
      short_description: requestData.short_description || null,
      category_id: requestData.category_id,
      price: requestData.price ? Number(requestData.price) : null,
      featured: requestData.is_featured || false,
      status: requestData.status,
      updated_at: new Date().toISOString(),
    };

    // Update the product
    const { data: updatedProduct, error } = await supabase
      .from('products')
      .update(productDetails)
      .eq('id', numericId.toString())
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Handle images if provided
    const { images } = requestData;
    if (images && images.length > 0) {
      // First, delete existing images
      await supabase.from('product_images').delete().eq('product_id', numericId);

      // Then insert new images
      const imageInserts = images.map((image, index) => ({
        product_id: numericId,
        url: image.url,
        alt_text: image.alt || updatedProduct.name,
        is_primary: image.isPrimary || index === 0, // First image is primary by default
      }));

      await supabase.from('product_images').insert(imageInserts);
    }

    // Handle features if provided
    const { features } = requestData;
    if (features && features.length > 0) {
      // First, delete existing features
      await supabase.from('product_features').delete().eq('product_id', numericId);

      // Then insert new features
      const featureInserts = features.map((feature) => ({
        product_id: numericId,
        title: feature.title,
        description: feature.description,
      }));

      await supabase.from('product_features').insert(featureInserts);
    }

    // Handle specifications if provided
    const { specifications } = requestData;
    if (specifications && specifications.length > 0) {
      // First, delete existing specifications
      try {
        await supabase
          .from('product_specifications')
          .delete()
          .eq('product_id', numericId);
      } catch (error) {
        console.error('Error deleting specifications:', error);
        // Continue even if there's an error
      }

      // Then insert new specifications
      try {
        const specInserts = specifications.map((spec) => ({
          product_id: numericId,
          name: spec.name,
          value: spec.value,
        }));

        await supabase.from('product_specifications').insert(specInserts);
      } catch (error) {
        console.error('Error inserting specifications:', error);
        // Continue even if there's an error
      }
    }

    // Revalidate the products pages to update the cache
    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${numericId}`);
    revalidatePath('/products');
    revalidatePath(`/products/${updatedProduct.slug}`);

    return NextResponse.json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Lỗi máy chủ nội bộ' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Sử dụng destructuring để lấy id từ params
    const { id } = params || {};
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID sản phẩm không hợp lệ' },
        { status: 400 }
      );
    }
    
    // Chuyển đổi id từ string sang number
    const numericId = Number(id);
    
    if (isNaN(numericId)) {
      return NextResponse.json(
        { error: 'ID sản phẩm không hợp lệ' },
        { status: 400 }
      );
    }
    
    const supabase = await createServerSupabaseClient();

    // Check if user is authenticated and has admin role
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user metadata to check role
    const { data: userData } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!userData || userData.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get the product slug before deleting for revalidation
    const { data: product } = await supabase
      .from('products')
      .select('slug')
      .eq('id', numericId)
      .single();

    // Delete related data first (foreign key constraints)
    await supabase.from('product_images').delete().eq('product_id', numericId);
    await supabase.from('product_features').delete().eq('product_id', numericId);
    
    // Xử lý product_specifications nếu có
    try {
      await supabase.from('product_specifications').delete().eq('product_id', numericId);
    } catch (error) {
      console.error('Lỗi khi xóa product_specifications:', error);
      // Tiếp tục xử lý ngay cả khi có lỗi
    }

    // Delete the product
    const { error } = await supabase.from('products').delete().eq('id', numericId);

    if (error) {
      console.error('Error deleting product:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Revalidate the products pages to update the cache
    revalidatePath('/admin/products');
    if (product) {
      revalidatePath(`/products/${product.slug}`);
    }
    revalidatePath('/products');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Lỗi máy chủ nội bộ' },
      { status: 500 }
    );
  }
}
