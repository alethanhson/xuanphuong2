import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';
import { COOKIE_CONFIG, BOUNCE_CONFIG, RETRY_CONFIG, VIETNAM_REGIONS } from './analytics-config';

// Khởi tạo Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Các hằng số
const SESSION_COOKIE = 'analytics_session_id';
const VISITOR_COOKIE = 'analytics_visitor_id';
const { SESSION_DURATION, VISITOR_DURATION } = COOKIE_CONFIG;

// Lấy hoặc tạo ID phiên và ID khách
const getOrCreateSessionId = (): string => {
  let sessionId = Cookies.get(SESSION_COOKIE);

  if (!sessionId) {
    sessionId = uuidv4();
    Cookies.set(SESSION_COOKIE, sessionId, {
      expires: new Date(new Date().getTime() + SESSION_DURATION * 60 * 1000),
      sameSite: 'strict'
    });
  }

  return sessionId;
};

const getOrCreateVisitorId = (): string => {
  let visitorId = Cookies.get(VISITOR_COOKIE);

  if (!visitorId) {
    visitorId = uuidv4();
    Cookies.set(VISITOR_COOKIE, visitorId, {
      expires: VISITOR_DURATION,
      sameSite: 'strict'
    });
  }

  return visitorId;
};

// Lấy thông tin trình duyệt và thiết bị
const getBrowserInfo = (): { deviceType: string; browser: string; os: string } => {
  if (typeof window === 'undefined') {
    return { deviceType: 'unknown', browser: 'unknown', os: 'unknown' };
  }

  const userAgent = navigator.userAgent;

  // Xác định loại thiết bị
  let deviceType = 'desktop';
  if (/Mobi|Android|iPhone|iPad|iPod/i.test(userAgent)) {
    deviceType = 'mobile';
    if (/iPad|Tablet/i.test(userAgent)) {
      deviceType = 'tablet';
    }
  }

  // Xác định trình duyệt
  let browser = 'unknown';
  if (/Chrome/i.test(userAgent) && !/Chromium|Edge|OPR|Edg/i.test(userAgent)) {
    browser = 'Chrome';
  } else if (/Firefox/i.test(userAgent)) {
    browser = 'Firefox';
  } else if (/Safari/i.test(userAgent) && !/Chrome|Chromium|Edge|OPR|Edg/i.test(userAgent)) {
    browser = 'Safari';
  } else if (/Edge|Edg/i.test(userAgent)) {
    browser = 'Edge';
  } else if (/OPR/i.test(userAgent)) {
    browser = 'Opera';
  }

  // Xác định hệ điều hành
  let os = 'unknown';
  if (/Windows/i.test(userAgent)) {
    os = 'Windows';
  } else if (/Macintosh|Mac OS X/i.test(userAgent)) {
    os = 'MacOS';
  } else if (/Linux/i.test(userAgent)) {
    os = 'Linux';
  } else if (/Android/i.test(userAgent)) {
    os = 'Android';
  } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
    os = 'iOS';
  }

  return { deviceType, browser, os };
};

// Lấy thông tin vị trí (giả lập)
const getLocationInfo = async (): Promise<{ region: string; city: string }> => {
  // Trong thực tế, bạn có thể sử dụng dịch vụ geolocation hoặc IP lookup
  // Ở đây chúng ta sẽ trả về dữ liệu mẫu cho Việt Nam

  // Chọn ngẫu nhiên một vị trí từ danh sách cấu hình
  const randomIndex = Math.floor(Math.random() * VIETNAM_REGIONS.length);
  return VIETNAM_REGIONS[randomIndex];
};

// Kiểm tra xem môi trường có hỗ trợ analytics không
const isAnalyticsEnabled = () => {
  return typeof window !== 'undefined' &&
         supabaseUrl &&
         supabaseAnonKey &&
         !localStorage.getItem('analytics_disabled') &&
         !sessionStorage.getItem('analytics_disabled');
};

// Kiểm tra xem có nên sử dụng fallback không
const shouldUseFallback = () => {
  return typeof window !== 'undefined' &&
         sessionStorage.getItem('use_analytics_fallback') === 'true';
};

// URL của Supabase Edge Function
const ANALYTICS_ENDPOINT = `${supabaseUrl}/functions/v1/track-analytics`;

// Tắt analytics trong môi trường phát triển nếu cần
const disableAnalytics = () => {
  localStorage.setItem('analytics_disabled', 'true');
  console.log('Analytics has been disabled for this session');
};

// Bật analytics
const enableAnalytics = () => {
  localStorage.removeItem('analytics_disabled');
  console.log('Analytics has been enabled');
};

// Theo dõi lượt xem trang
export const trackPageView = async (pageUrl?: string, pageTitle?: string): Promise<void> => {
  // Kiểm tra xem analytics có được bật không
  if (!isAnalyticsEnabled()) return;

  try {
    const sessionId = getOrCreateSessionId();
    const visitorId = getOrCreateVisitorId();
    const url = pageUrl || window.location.pathname;
    const title = pageTitle || document.title;
    const referrer = document.referrer;
    const { deviceType, browser, os } = getBrowserInfo();
    const { region, city } = await getLocationInfo();

    // Dữ liệu analytics
    const analyticsData = {
      session_id: sessionId,
      visitor_id: visitorId,
      page_url: url,
      page_title: title,
      referrer: referrer,
      user_agent: navigator.userAgent,
      ip_address: '127.0.0.1', // IP sẽ được xác định ở server
      region: region,
      city: city,
      device_type: deviceType,
      browser: browser,
      os: os
    };

    // Kiểm tra xem có nên sử dụng fallback không
    if (shouldUseFallback()) {
      // Sử dụng trực tiếp RPC function
      try {
        await supabase.rpc('track_analytics', analyticsData);
      } catch (rpcError) {
        console.error('RPC call failed:', rpcError);
        // Lưu vào sessionStorage để có thể gửi lại sau
        const pendingEvents = JSON.parse(sessionStorage.getItem('pending_analytics') || '[]');
        pendingEvents.push({ type: 'pageview', data: analyticsData, timestamp: Date.now() });
        sessionStorage.setItem('pending_analytics', JSON.stringify(pendingEvents));
      }
    } else {
      // Thử gọi Supabase Edge Function trước
      try {
        const response = await fetch(ANALYTICS_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'apikey': supabaseAnonKey
          },
          mode: 'cors',
          credentials: 'include',
          body: JSON.stringify({
            type: 'pageview',
            data: analyticsData
          })
        });

        if (!response.ok) {
          throw new Error(`Edge function returned ${response.status}`);
        }
      } catch (edgeFunctionError) {
        console.warn('Edge function failed, falling back to direct RPC call:', edgeFunctionError);

        // Fallback: Gọi trực tiếp RPC function
        try {
          await supabase.rpc('track_analytics', analyticsData);
        } catch (rpcError) {
          console.error('RPC fallback also failed:', rpcError);
          // Trong trường hợp cả hai cách đều thất bại, chúng ta vẫn lưu dữ liệu vào sessionStorage
          // để có thể gửi lại sau
          const pendingEvents = JSON.parse(sessionStorage.getItem('pending_analytics') || '[]');
          pendingEvents.push({ type: 'pageview', data: analyticsData, timestamp: Date.now() });
          sessionStorage.setItem('pending_analytics', JSON.stringify(pendingEvents));
        }
      }
    }

    // Thiết lập thời gian bắt đầu phiên
    sessionStorage.setItem(`pageStart_${url}`, Date.now().toString());

    // Theo dõi thời gian trên trang khi người dùng rời đi
    window.addEventListener('beforeunload', () => {
      updateSessionMetrics(url);
    });

    // Theo dõi khi người dùng chuyển trang trong ứng dụng
    const handleRouteChange = () => {
      updateSessionMetrics(url);
    };

    // Trong Next.js, bạn có thể sử dụng router.events.on('routeChangeStart', handleRouteChange)

  } catch (error) {
    console.error('Error tracking page view:', error);
    // Tắt analytics nếu có lỗi nghiêm trọng để tránh ảnh hưởng đến trải nghiệm người dùng
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.warn('Network error detected. Analytics will be temporarily disabled.');
      // Chỉ tắt tạm thời trong phiên hiện tại
      sessionStorage.setItem('analytics_disabled', 'true');
    }
  }
};

// Cập nhật thông tin phiên
const updateSessionMetrics = async (pageUrl: string): Promise<void> => {
  // Kiểm tra xem analytics có được bật không
  if (!isAnalyticsEnabled() || sessionStorage.getItem('analytics_disabled')) return;

  try {
    const sessionId = Cookies.get(SESSION_COOKIE);
    if (!sessionId) return;

    const pageStartStr = sessionStorage.getItem(`pageStart_${pageUrl}`);
    if (!pageStartStr) return;

    const pageStart = parseInt(pageStartStr, 10);
    const duration = Math.floor((Date.now() - pageStart) / 1000); // Thời gian tính bằng giây

    // Xác định nếu là bounce (chỉ xem 1 trang và ở dưới thời gian cấu hình)
    const isBounce = duration < BOUNCE_CONFIG.MAX_DURATION;

    // Dữ liệu cập nhật phiên
    const sessionData = {
      session_id: sessionId,
      duration: duration,
      is_bounce: isBounce
    };

    // Kiểm tra xem có nên sử dụng fallback không
    if (shouldUseFallback()) {
      // Sử dụng trực tiếp RPC function
      try {
        await supabase.rpc('update_analytics_session', sessionData);
      } catch (rpcError) {
        console.error('RPC call failed for session update:', rpcError);
        // Lưu vào sessionStorage để có thể gửi lại sau
        const pendingEvents = JSON.parse(sessionStorage.getItem('pending_analytics') || '[]');
        pendingEvents.push({ type: 'session', data: sessionData, timestamp: Date.now() });
        sessionStorage.setItem('pending_analytics', JSON.stringify(pendingEvents));
      }
    } else {
      // Thử gọi Supabase Edge Function trước
      try {
        const response = await fetch(ANALYTICS_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'apikey': supabaseAnonKey
          },
          mode: 'cors',
          credentials: 'include',
          body: JSON.stringify({
            type: 'session',
            data: sessionData
          })
        });

        if (!response.ok) {
          throw new Error(`Edge function returned ${response.status}`);
        }
      } catch (edgeFunctionError) {
        console.warn('Edge function failed for session update, falling back to direct RPC call:', edgeFunctionError);

        // Fallback: Gọi trực tiếp RPC function
        try {
          await supabase.rpc('update_analytics_session', sessionData);
        } catch (rpcError) {
          console.error('RPC fallback also failed for session update:', rpcError);
          // Lưu vào sessionStorage để có thể gửi lại sau
          const pendingEvents = JSON.parse(sessionStorage.getItem('pending_analytics') || '[]');
          pendingEvents.push({ type: 'session', data: sessionData, timestamp: Date.now() });
          sessionStorage.setItem('pending_analytics', JSON.stringify(pendingEvents));
        }
      }
    }

    // Xóa thời gian bắt đầu
    sessionStorage.removeItem(`pageStart_${pageUrl}`);

  } catch (error) {
    console.error('Error updating session metrics:', error);
  }
};

// Gửi lại các sự kiện đang chờ xử lý
const retryPendingEvents = async (): Promise<void> => {
  if (!isAnalyticsEnabled()) return;

  const pendingEventsStr = sessionStorage.getItem('pending_analytics');
  if (!pendingEventsStr) return;

  try {
    const pendingEvents = JSON.parse(pendingEventsStr);
    if (!Array.isArray(pendingEvents) || pendingEvents.length === 0) return;

    console.log(`Retrying ${pendingEvents.length} pending analytics events`);

    // Lọc các sự kiện quá cũ (theo cấu hình)
    const now = Date.now();
    const validEvents = pendingEvents.filter(event => {
      return now - event.timestamp < RETRY_CONFIG.MAX_AGE_HOURS * 60 * 60 * 1000;
    });

    // Gửi lại các sự kiện hợp lệ
    const failedEvents = [];

    for (const event of validEvents) {
      try {
        if (event.type === 'pageview') {
          await supabase.rpc('track_analytics', event.data);
        } else if (event.type === 'session') {
          await supabase.rpc('update_analytics_session', event.data);
        }
      } catch (error) {
        console.warn(`Failed to retry event of type ${event.type}:`, error);
        failedEvents.push(event);
      }
    }

    // Cập nhật danh sách sự kiện đang chờ
    if (failedEvents.length > 0) {
      sessionStorage.setItem('pending_analytics', JSON.stringify(failedEvents));
    } else {
      sessionStorage.removeItem('pending_analytics');
    }

  } catch (error) {
    console.error('Error retrying pending events:', error);
  }
};

// Khởi tạo analytics
export const initAnalytics = (): void => {
  if (typeof window === 'undefined') return;

  // Kiểm tra xem analytics có bị tắt tạm thời trong phiên trước không
  if (sessionStorage.getItem('analytics_disabled')) {
    console.warn('Analytics was temporarily disabled in the previous session. Trying to re-enable...');
    sessionStorage.removeItem('analytics_disabled');
  }

  // Thử gửi lại các sự kiện đang chờ
  retryPendingEvents();

  // Theo dõi lượt xem trang khi trang được tải
  trackPageView();
};

export default {
  trackPageView,
  initAnalytics,
  enableAnalytics,
  disableAnalytics
};
