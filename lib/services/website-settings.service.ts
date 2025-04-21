import { createServerSupabaseClient } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

// Types for website settings
export type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta: {
    primary: {
      text: string;
      link: string;
    };
    secondary: {
      text: string;
      link: string;
    };
  };
};

export type HeroSectionSettings = {
  slides: HeroSlide[];
};

export type WebsiteSettings = {
  hero_section: HeroSectionSettings;
  // Add other website settings here as needed
};

// Define the response type
export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
  };
}

/**
 * Service for handling website settings
 */
export const WebsiteSettingsService = {
  /**
   * Get hero section settings
   */
  async getHeroSectionSettings(): Promise<ApiResponse<HeroSectionSettings>> {
    try {
      const supabase = await createServerSupabaseClient();

      const { data, error } = await supabase
        .from('website_settings')
        .select('value')
        .eq('key', 'hero_section')
        .single();

      if (error) {
        console.error('Error fetching hero section settings:', error);
        return { error: { message: 'Failed to fetch hero section settings' } };
      }

      return { data: data.value as HeroSectionSettings };
    } catch (error) {
      console.error('Error in getHeroSectionSettings:', error);
      return { error: { message: 'An unexpected error occurred' } };
    }
  },

  /**
   * Update hero section settings
   */
  async updateHeroSectionSettings(settings: HeroSectionSettings): Promise<ApiResponse<HeroSectionSettings>> {
    try {
      const supabase = await createServerSupabaseClient();

      const { data, error } = await supabase
        .from('website_settings')
        .update({ 
          value: settings,
          updated_at: new Date().toISOString()
        })
        .eq('key', 'hero_section')
        .select('value')
        .single();

      if (error) {
        console.error('Error updating hero section settings:', error);
        return { error: { message: 'Failed to update hero section settings' } };
      }

      return { data: data.value as HeroSectionSettings };
    } catch (error) {
      console.error('Error in updateHeroSectionSettings:', error);
      return { error: { message: 'An unexpected error occurred' } };
    }
  },

  /**
   * Get all website settings
   */
  async getAllSettings(): Promise<ApiResponse<Record<string, any>>> {
    try {
      const supabase = await createServerSupabaseClient();

      const { data, error } = await supabase
        .from('website_settings')
        .select('key, value');

      if (error) {
        console.error('Error fetching website settings:', error);
        return { error: { message: 'Failed to fetch website settings' } };
      }

      // Convert array of settings to an object
      const settings = data.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as Record<string, any>);

      return { data: settings };
    } catch (error) {
      console.error('Error in getAllSettings:', error);
      return { error: { message: 'An unexpected error occurred' } };
    }
  },

  /**
   * Update a specific setting
   */
  async updateSetting(key: string, value: any): Promise<ApiResponse<any>> {
    try {
      const supabase = await createServerSupabaseClient();

      const { data, error } = await supabase
        .from('website_settings')
        .update({ 
          value,
          updated_at: new Date().toISOString()
        })
        .eq('key', key)
        .select('value')
        .single();

      if (error) {
        console.error(`Error updating ${key} settings:`, error);
        return { error: { message: `Failed to update ${key} settings` } };
      }

      return { data: data.value };
    } catch (error) {
      console.error(`Error in update${key}Settings:`, error);
      return { error: { message: 'An unexpected error occurred' } };
    }
  }
};
