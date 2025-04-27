import analytics from './analytics';

/**
 * Kiểm tra xem Supabase Edge Function có hoạt động không
 * @returns Promise<boolean> - true nếu Edge Function hoạt động, false nếu không
 */
export const checkAnalyticsEndpoint = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Anon Key is missing');
    return false;
  }
  
  const ANALYTICS_ENDPOINT = `${supabaseUrl}/functions/v1/track-analytics`;
  
  try {
    // Gửi request kiểm tra
    const response = await fetch(ANALYTICS_ENDPOINT, {
      method: 'OPTIONS',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'apikey': supabaseAnonKey
      },
      mode: 'cors',
      credentials: 'same-origin'
    });
    
    return response.ok;
  } catch (error) {
    console.warn('Analytics endpoint check failed:', error);
    return false;
  }
};

/**
 * Kiểm tra và cấu hình analytics
 */
export const setupAnalytics = async (): Promise<void> => {
  const isEndpointAvailable = await checkAnalyticsEndpoint();
  
  if (!isEndpointAvailable) {
    console.warn('Analytics endpoint is not available. Using direct RPC calls as fallback.');
    // Lưu thông tin này để sử dụng trong analytics.ts
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('use_analytics_fallback', 'true');
    }
  } else {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('use_analytics_fallback');
    }
    console.log('Analytics endpoint is available.');
  }
  
  // Khởi tạo analytics
  analytics.initAnalytics();
};

export default {
  checkAnalyticsEndpoint,
  setupAnalytics
};
