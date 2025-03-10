import { createServerSupabaseClient } from '@/lib/supabase';
import type { ProductFilters } from '@/types/product';
export class ProductService {
  static async getProducts(filters: ProductFilters) {
    const supabase = await createServerSupabaseClient();
    try {
      const {
        categorySlug,
        search,
        page = 1,
        limit = 9,
        sortBy = 'newest',
      } = filters;

      // Tính toán offset cho phân trang
      const offset = (page - 1) * limit;

      // Bắt đầu query
      let query = supabase.from('products').select(
        `
          *,
          category:product_categories(*),
          images:product_images(*),
          features:product_features(*),
          specifications:product_specifications(*)
        `,
        { count: 'exact' }
      );

      // Thêm điều kiện lọc theo category
      if (categorySlug) {
        query = query.eq('category.slug', categorySlug);
      }

      // Thêm điều kiện tìm kiếm
      if (search) {
        query = query.or(
          `name.ilike.%${search}%,description.ilike.%${search}%,short_description.ilike.%${search}%`
        );
      }

      // Thêm sắp xếp
      switch (sortBy) {
        case 'price-asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price-desc':
          query = query.order('price', { ascending: false });
          break;
        case 'popular':
          query = query.order('view_count', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      // Thêm phân trang
      query = query.range(offset, offset + limit - 1);

      const { data: products, count, error } = await query;

      if (error) {
        throw error;
      }

      return {
        data: {
          products,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      };
    } catch (error: any) {
      return {
        error: {
          message: error.message || 'Có lỗi xảy ra khi lấy danh sách sản phẩm',
        },
      };
    }
  }

  static async getProductBySlug(slug: string) {
    const supabase = await createServerSupabaseClient();
    try {
      const { data, error } = await supabase
        .from('products')
        .select(
          `
          *,
          category:product_categories(*),
          images:product_images(*),
          features:product_features(*),
          specifications:product_specifications(*)
        `
        )
        .eq('slug', slug)
        .single();

      if (error) {
        throw error;
      }

      // Tăng lượt xem
      await supabase
        .from('products')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', data.id);

      return { data };
    } catch (error: any) {
      return {
        error: {
          message: error.message || 'Có lỗi xảy ra khi lấy thông tin sản phẩm',
        },
      };
    }
  }

  static async getRelatedProducts(
    productId: string,
    categoryId: number,
    limit = 3
  ) {
    try {
        const supabase = await createServerSupabaseClient();

      const { data, error } = await supabase
        .from('products')
        .select(
          `
          *,
          category:product_categories(*),
          images:product_images(*)
        `
        )
        .eq('category_id', categoryId)
        .neq('id', productId)
        .limit(limit);

      if (error) {
        throw error;
      }

      return { data };
    } catch (error: any) {
      return {
        error: {
          message: error.message || 'Có lỗi xảy ra khi lấy sản phẩm liên quan',
        },
      };
    }
  }

  static async getCategories() {
    try {
      const supabase = await createServerSupabaseClient();
        
      const { data, error } = await supabase // Sử dụng supabase đã được khởi tạo
        .from('product_categories')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      return { data };
    } catch (error: any) {
      return {
        error: {
          message: error.message || 'Có lỗi xảy ra khi lấy danh mục sản phẩm',
        },
      };
    }
  }
}
