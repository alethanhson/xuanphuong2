import { supabase } from '@/lib/supabaseClient';

export const createServerSupabaseClient = async () => {
  const { cookies } = await import('next/headers');
  const cookieStore = cookies();

  return supabase;
};
