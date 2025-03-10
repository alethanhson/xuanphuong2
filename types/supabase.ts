export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      blog_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          name: string;
          slug: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          name?: string;
          slug?: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          featured_image: string | null;
          category_id: number;
          author_id: string;
          is_featured: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string | null;
          seo_title: string | null;
          seo_description: string | null;
          view_count: number;
        };
        Insert: {
          id?: number;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          featured_image?: string | null;
          category_id: number;
          author_id: string;
          is_featured?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          view_count?: number;
        };
        Update: {
          id?: number;
          title?: string;
          slug?: string;
          excerpt?: string;
          content?: string;
          featured_image?: string | null;
          category_id?: number;
          author_id?: string;
          is_featured?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          view_count?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'blog_posts_author_id_fkey';
            columns: ['author_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'blog_posts_category_id_fkey';
            columns: ['category_id'];
            referencedRelation: 'blog_categories';
            referencedColumns: ['id'];
          }
        ];
      };
      product_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          name: string;
          slug: string;
          description?: string | null;
          image?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          name?: string;
          slug?: string;
          description?: string | null;
          image?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          short_description: string | null;
          price: number | null;
          category_id: number;
          is_featured: boolean;
          status: string;
          created_at: string;
          updated_at: string | null;
          seo_title: string | null;
          seo_description: string | null;
          view_count: number;
          model: string | null;
          working_dimensions: string | null;
          spindle_power: string | null;
          spindle_speed: string | null;
          movement_speed: string | null;
          accuracy: string | null;
          control_system: string | null;
          compatible_software: string | null;
          file_formats: string | null;
          power_consumption: string | null;
          machine_dimensions: string | null;
          weight: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description: string;
          short_description?: string | null;
          price?: number | null;
          category_id: number;
          featured?: boolean;
          status?: string;
          created_at?: string;
          updated_at?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          view_count?: number;
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
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          short_description?: string | null;
          price?: number | null;
          category_id?: number;
          featured?: boolean;
          status?: string;
          created_at?: string;
          updated_at?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          view_count?: number;
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
        };
        Relationships: [
          {
            foreignKeyName: 'products_category_id_fkey';
            columns: ['category_id'];
            referencedRelation: 'product_categories';
            referencedColumns: ['id'];
          }
        ];
      };
      product_images: {
        Row: {
          id: string;
          product_id: number;
          url: string;
          alt_text: string | null;
          is_primary: boolean;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          product_id: number;
          url: string;
          alt_text?: string | null;
          is_primary?: boolean;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          product_id?: number;
          url?: string;
          alt_text?: string | null;
          is_primary?: boolean;
          created_at?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'product_images_product_id_fkey';
            columns: ['product_id'];
            referencedRelation: 'products';
            referencedColumns: ['id'];
          }
        ];
      };
      product_features: {
        Row: {
          id: string;
          product_id: number;
          title: string;
          description: string;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          product_id: number;
          title: string;
          description: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          product_id?: number;
          title?: string;
          description?: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'product_features_product_id_fkey';
            columns: ['product_id'];
            referencedRelation: 'products';
            referencedColumns: ['id'];
          }
        ];
      };
      product_specifications: {
        Row: {
          id: string;
          product_id: number;
          name: string;
          value: string;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          product_id: number;
          name: string;
          value: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          product_id?: number;
          name?: string;
          value?: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'product_specifications_product_id_fkey';
            columns: ['product_id'];
            referencedRelation: 'products';
            referencedColumns: ['id'];
          }
        ];
      };
      profiles: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          avatar_url: string | null;
          role: string;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
