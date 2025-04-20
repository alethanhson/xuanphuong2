import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Create a server-side Supabase client
export async function createServerSupabaseClient() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl) {
      console.error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
      throw new Error('Missing Supabase URL');
    }

    if (!supabaseServiceKey) {
      console.error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
      throw new Error('Missing Supabase API key');
    }

    console.log('Creating Supabase client with URL:', supabaseUrl.substring(0, 20) + '...');

    return createClient<Database>(supabaseUrl, supabaseServiceKey);
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    throw error;
  }
}
