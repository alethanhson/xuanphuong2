import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

// Thêm biến kiểm soát debug logging
const MODE_DEBUG = process.env.NODE_ENV === 'development';

type Product = {
  id: string;
  name: string;
  slug: string;
  status: string;
  price: number | null;
  created_at: string;
  categories?: { id: string; name: string } | null;
  product_images?: { id: string; url: string; is_primary: boolean }[] | null;
  images?: { id: string; url: string; is_primary: boolean }[] | null;
};

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: products, error } = await supabase
      .from('products')
      .select(
        `
      *,
      categories:category_id(id, name),
      images:product_images(*)
    `
      )
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Invalid products data' },
        { status: 500 }
      );
    }

    const formattedProducts = (products as unknown as Product[]).map(
      (product) => {
        const primaryImage =
          product.images?.find((img) => img.is_primary) || product.images?.[0];

        return {
          id: product.id,
          name: product.name,
          slug: product.slug,
          category: product.categories?.name || 'Uncategorized',
          status: product.status,
          price: product.price
            ? new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(product.price)
            : 'Liên hệ',
          createdAt: new Date(product.created_at).toLocaleDateString('vi-VN'),
          image: primaryImage?.url || null,
        };
      }
    );

    return NextResponse.json({
      products: formattedProducts,
      total: formattedProducts.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();

    const productData = await request.json();

    // Extract images from the product data to handle separately
    const { features, images, ...productDetails } = productData;

    // Add timestamps
    const now = new Date().toISOString();
    productDetails.created_at = now;
    productDetails.updated_at = now;

    // Insert the product
    const { data: product, error } = await supabase
      .from('products')
      .insert([productDetails])
      .select()
      .single();

    if (error) {
      console.error('Lỗi tạo sản phẩm:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (images && images.length > 0) {
      const imageInserts = images.map((image: any, index: number) => ({
        product_id: product?.id,
        url: image.url,
        alt: image.alt || product?.name,
        is_primary: index === 0,
      }));

      const { error: imageError } = await supabase
        .from('product_images')
        .insert(imageInserts);

      if (imageError) {
        // Chỉ log lỗi thêm hình ảnh khi cần thiết
        console.error('Lỗi thêm hình ảnh sản phẩm:', imageError.message);
      }
    }

    if (features && features.length > 0) {
      const featureInserts = features.map((feature: any) => ({
        product_id: product?.id,
        title: feature.title,
        description: feature.description,
        icon: feature.icon,
      }));

      const { error: featureError } = await supabase
        .from('product_features')
        .insert(featureInserts);

      if (featureError) {
        // Chỉ log lỗi thêm tính năng khi cần thiết
        console.error('Lỗi thêm tính năng sản phẩm:', featureError.message);
      }
    }

    // Revalidate the products page to update the cache
    revalidatePath('/admin/products');
    revalidatePath('/products');

    return NextResponse.json({
      success: true,
      product: product,
    });
  } catch (error) {
    // Log lỗi server với thông tin chi tiết hơn
    console.error('Lỗi server:', error instanceof Error ? error.message : 'Lỗi không xác định');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
