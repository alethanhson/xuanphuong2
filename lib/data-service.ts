import { createServerSupabaseClient } from './supabase';
import type { Database } from '@/types/supabase';


export type Product = Database['public']['Tables']['products']['Row'] & {
  category?: { id: string; name: string; slug: string } | null;
  images?: { id: string; url: string; is_primary: boolean }[] | null;
  features?: { id: string; title: string; description: string }[] | null;
};

export type BlogPost = Partial<Database['public']['Tables']['blog_posts']['Row']> & {
  category?: { id: string; name: string; slug: string } | null;
  author?: { id?: string; name: string; avatar_url?: string | null } | null;

  published_at?: string | null;
  created_at: string;
  featured_image?: string | null;
};

/**
 * Fetch featured products from Supabase
 */
export async function getFeaturedProducts(limit = 5): Promise<Product[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:category_id(id, name, slug),
      images:product_images(id, url, is_primary),
      features:product_features(id, title, description)
    `)
    .eq('is_featured', true)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch featured blog posts from Supabase
 */
export async function getFeaturedBlogPosts(limit = 3): Promise<BlogPost[]> {
  const supabase = await createServerSupabaseClient();

  try {

    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        category:category_id(id, name, slug)
      `)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching featured blog posts:', error);
      return [];
    }


    const processedData = data?.map(post => ({
      ...post,
      created_at: post.created_at || new Date().toISOString(),
      published_at: post.published_at || post.created_at || new Date().toISOString()
    })) as BlogPost[] || [];

    return processedData;
  } catch (error) {
    console.error('Error fetching featured blog posts:', error);
    return [];
  }
}

/**
 * Fetch product categories from Supabase
 */
export async function getProductCategories() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching product categories:', error);
    return [];
  }

  return data || [];
}
