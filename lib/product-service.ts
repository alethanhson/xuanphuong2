import { createServerSupabaseClient } from './supabase';
import type { Database } from '@/types/supabase';
import type { ProductFilters } from '@/types/product';

// Define the Product type based on the database schema
export type Product = Database['public']['Tables']['products']['Row'] & {
  category?: { id: string; name: string; slug: string } | null;
  images?: { id: string; url: string; alt_text?: string | null; is_primary: boolean }[] | null;
  features?: { id: string; title: string; description: string }[] | null;
  specifications?: { id: string; name: string; value: string }[] | null;
  // Add any additional fields that might be used in the UI
  shortDescription?: string;
  workingDimensions?: string;
  spindlePower?: string;
  spindleSpeed?: string;
  movementSpeed?: string;
  accuracy?: string;
  controlSystem?: string;
  compatibleSoftware?: string;
  fileFormats?: string;
  powerConsumption?: string;
  machineDimensions?: string;
  weight?: string;
  isFeatured?: boolean;
  reviews?: {
    id: string;
    author: string;
    company?: string;
    rating: number;
    comment: string;
    date: string;
  }[];
  applications?: {
    furniture?: string;
    interiorDecoration?: string;
    advertising?: string;
    woodIndustry?: string[];
    advertisingIndustry?: string[];
  };
};

// Define the response type
export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
  };
}

/**
 * Service for handling product-related operations
 */
export const ProductService = {
  /**
   * Get a product by its slug
   */
  async getProductBySlug(slug: string): Promise<ApiResponse<Product>> {
    try {
      console.log('Fetching product with slug:', slug);
      const supabase = await createServerSupabaseClient();

      // First, check if the products table exists and has the expected structure
      try {
        console.log('Checking products table structure...');
        const { data: tableInfo, error: tableError } = await supabase
          .from('products')
          .select('id')
          .limit(1);

        if (tableError) {
          console.error('Error checking products table:', tableError);
          return { error: { message: 'Database structure issue' } };
        }

        console.log('Products table check result:', tableInfo ? 'Table exists' : 'Table empty');
      } catch (tableCheckError) {
        console.error('Exception checking products table:', tableCheckError);
      }

      // Fetch the product with all related data
      console.log('Executing query for slug:', slug);
      // First, check the structure of the product_images table
      try {
        console.log('Checking product_images table structure...');
        const { data: imageColumns, error: imageError } = await supabase
          .from('product_images')
          .select('*')
          .limit(1);

        if (imageError) {
          console.error('Error checking product_images table:', imageError);
        } else {
          console.log('product_images columns:', imageColumns && imageColumns.length > 0 ? Object.keys(imageColumns[0]) : 'No data');
        }
      } catch (e) {
        console.error('Exception checking product_images table:', e);
      }

      // Fetch the product with all related data, but only select columns we know exist
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:category_id(id, name, slug),
          images:product_images(id, url, is_primary),
          features:product_features(id, title, description)
        `)
        .eq('slug', slug)
        .single();

      console.log('Query result:', { hasData: !!data, error: error || 'No error' });

      if (error || !data) {
        console.error('Error fetching product by slug:', error?.message || error || 'No data returned');

        // Log the error for debugging purposes
        console.log('Error details:', error);

        return { error: { message: 'Failed to fetch product' } };
      }

      // Fetch specifications separately if they exist
      let specifications: any[] = [];
      try {
        const { data: specs, error: specsError } = await supabase
          .from('product_specifications')
          .select('*')
          .eq('product_id', data.id.toString());

        if (!specsError && specs) {
          specifications = specs;
        }
      } catch (error) {
        console.error('Error fetching specifications:', error);
      }

      // Process the data to match the expected format
      const processedProduct: Product = {
        ...data,
        // Map database fields to UI fields
        shortDescription: data.short_description || '',
        workingDimensions: data.working_dimensions || '',
        spindlePower: data.spindle_power || '',
        spindleSpeed: data.spindle_speed || '',
        movementSpeed: data.movement_speed || '',
        accuracy: data.accuracy || '',
        controlSystem: data.control_system || '',
        compatibleSoftware: data.compatible_software || '',
        fileFormats: data.file_formats || '',
        powerConsumption: data.power_consumption || '',
        machineDimensions: data.machine_dimensions || '',
        weight: data.weight || '',
        isFeatured: data.is_featured || false,
        // Add specifications
        specifications,
        // Add empty reviews array (could be fetched from a reviews table if it exists)
        reviews: [],
        // Add empty applications object (could be fetched from a separate table if it exists)
        applications: {
          furniture: 'Sản xuất nội thất, tủ bếp, cửa gỗ, bàn ghế',
          interiorDecoration: 'Trang trí nội thất, ốp tường, trần nghệ thuật',
          advertising: 'Biển hiệu, logo, standee',
          woodIndustry: [
            'Sản xuất đồ nội thất',
            'Sản xuất cửa gỗ',
            'Chế tác mỹ nghệ',
            'Sản xuất tủ bếp',
          ],
          advertisingIndustry: [
            'Biển hiệu quảng cáo',
            'Standee',
            'Bảng hiệu cửa hàng',
            'Logo công ty',
          ],
        },
      };

      // Process images to ensure they have the expected format
      if (processedProduct.images) {
        processedProduct.images = processedProduct.images.map(img => ({
          ...img,
          alt: processedProduct.name, // Use product name as alt text since alt_text column doesn't exist
          isPrimary: img.is_primary
        }));
      } else {
        processedProduct.images = [];
      }

      return { data: processedProduct };
    } catch (error) {
      console.error('Error in getProductBySlug:', error);
      return { error: { message: 'An unexpected error occurred' } };
    }
  },

  /**
   * Get products with filters
   */
  async getProducts(filters: ProductFilters): Promise<ApiResponse<{ products: Product[]; total: number; totalPages: number }>> {
    try {
      console.log('Fetching products with filters:', filters);
      const supabase = await createServerSupabaseClient();

      // Build the query
      let query = supabase
        .from('products')
        .select(`
          *,
          category:category_id(id, name, slug),
          images:product_images(id, url, is_primary)
        `, { count: 'exact' });

      // Apply filters
      if (filters.categorySlug) {
        // First get the category ID from the slug
        const { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', filters.categorySlug)
          .single();

        if (category) {
          query = query.eq('category_id', category.id.toString());
        }
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'price-asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price-desc':
          query = query.order('price', { ascending: false });
          break;
        case 'popular':
          query = query.order('view_count', { ascending: false });
          break;
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }

      // Apply pagination
      const limit = filters.limit || 9;
      const page = filters.page || 1;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to);

      // Execute the query
      console.log('Executing products query...');
      const { data, error, count } = await query;

      console.log('Products query result:', {
        hasData: !!data,
        count: count || 0,
        error: error ? 'Error occurred' : 'No error'
      });

      if (error) {
        console.error('Error fetching products:', error);
        return { error: { message: 'Failed to fetch products' } };
      }

      // Log if no data is found
      if (!data || data.length === 0) {
        console.log('No products found in database');
      }

      // Process the data
      const products = data ? data.map((product: Product | null) => {
        if (!product) return null;

        // Process images
        const images = product.images?.map((img: { id: string; url: string; alt_text?: string | null; is_primary: boolean }) => ({
          ...img,
          alt: product.name, // Use product name as alt text since alt_text column doesn't exist
          isPrimary: img.is_primary
        })) || [];

        // Map database fields to UI fields
        return {
          ...product,
          shortDescription: product.short_description || '',
          isFeatured: product.is_featured || false,
          images
        } as Product;
      }).filter(Boolean) as Product[] : [];

      return {
        data: {
          products,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        }
      };
    } catch (error) {
      console.error('Error in getProducts:', error);
      return { error: { message: 'An unexpected error occurred' } };
    }
  }
};
