export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_features: {
        Row: {
          id: string
          product_id: string
          title: string
          description: string
          icon: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          title: string
          description: string
          icon?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          title?: string
          description?: string
          icon?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_features_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          alt: string
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          url: string
          alt: string
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          url?: string
          alt?: string
          is_primary?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_specifications: {
        Row: {
          id: string
          product_id: string
          name: string
          value: string
          group: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          name: string
          value: string
          group?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          name?: string
          value?: string
          group?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_specifications_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          short_description: string | null
          category_id: string
          price: number | null
          is_featured: boolean
          status: string
          model: string | null
          working_dimensions: string | null
          spindle_power: string | null
          spindle_speed: string | null
          movement_speed: string | null
          accuracy: string | null
          control_system: string | null
          compatible_software: string | null
          file_formats: string | null
          power_consumption: string | null
          machine_dimensions: string | null
          weight: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description: string
          short_description?: string | null
          category_id: string
          price?: number | null
          is_featured?: boolean
          status?: string
          model?: string | null
          working_dimensions?: string | null
          spindle_power?: string | null
          spindle_speed?: string | null
          movement_speed?: string | null
          accuracy?: string | null
          control_system?: string | null
          compatible_software?: string | null
          file_formats?: string | null
          power_consumption?: string | null
          machine_dimensions?: string | null
          weight?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          short_description?: string | null
          category_id?: string
          price?: number | null
          is_featured?: boolean
          status?: string
          model?: string | null
          working_dimensions?: string | null
          spindle_power?: string | null
          spindle_speed?: string | null
          movement_speed?: string | null
          accuracy?: string | null
          control_system?: string | null
          compatible_software?: string | null
          file_formats?: string | null
          power_consumption?: string | null
          machine_dimensions?: string | null
          weight?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      },
      orders: {
        Row: {
          id: string
          orderNumber: string
          customerId: string
          status: string
          totalAmount: number
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          orderNumber: string
          customerId: string
          status: string
          totalAmount: number
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          orderNumber?: string
          customerId?: string
          status?: string
          totalAmount?: number
          createdAt?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customerId_fkey"
            columns: ["customerId"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          userId: string
          message: string
          isRead: boolean
          createdAt: string
        }
        Insert: {
          id?: string
          userId: string
          message: string
          isRead: boolean
          createdAt?: string
        }
        Update: {
          id?: string
          userId?: string
          message?: string
          isRead?: boolean
          createdAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_userId_fkey"
            columns: ["userId"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          content: string
          category_id: string
          author_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          category_id: string
          author_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          category_id?: string
          author_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
