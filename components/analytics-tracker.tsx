'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { getCookie, setCookie } from 'cookies-next';
import { useIsClient } from '@/hooks/use-is-client';

// Component không hiển thị gì cả, chỉ theo dõi hoạt động người dùng
export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hasTrackedPageView, setHasTrackedPageView] = useState(false);
  const sessionStartTimeRef = useRef<number>(Date.now());
  const lastActivityTimeRef = useRef<number>(Date.now());
  const timeOnPageRef = useRef<number>(0);
  const [visitorId, setVisitorId] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');
  const isUserActiveRef = useRef<boolean>(true);
  const activityCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pageUrlRef = useRef<string>('');
  const pageTitleRef = useRef<string>('');
  const isClient = useIsClient();

  // Khởi tạo ID và bộ đếm thời gian - chỉ khi ở client
  useEffect(() => {
    if (!isClient) return;
    
    // Lấy URL và tiêu đề hiện tại
    pageUrlRef.current = window.location.pathname + window.location.search;
    pageTitleRef.current = document.title;
    
    // Khởi tạo visitor ID
    const storedVisitorId = getCookie('analytics_visitor_id');
    if (storedVisitorId) {
      setVisitorId(storedVisitorId as string);
    } else {
      const newVisitorId = generateUUID();
      setCookie('analytics_visitor_id', newVisitorId, { 
        maxAge: 365 * 24 * 60 * 60, // 1 năm
        path: '/' 
      });
      setVisitorId(newVisitorId);
    }

    // Khởi tạo session ID
    const storedSessionId = getCookie('analytics_session_id');
    if (storedSessionId) {
      setSessionId(storedSessionId as string);
    } else {
      const newSessionId = generateUUID();
      setCookie('analytics_session_id', newSessionId, { 
        maxAge: 30 * 60, // 30 phút
        path: '/' 
      });
      setSessionId(newSessionId);
    }

    // Thiết lập các sự kiện theo dõi hoạt động
    setupActivityTracking();

    // Cleanup khi component unmount
    return () => {
      if (activityCheckIntervalRef.current) {
        clearInterval(activityCheckIntervalRef.current);
      }
      sendAnalyticsBeforeUnload();
    };
  }, [isClient]);

  // Reset tracking state khi navigation xảy ra
  useEffect(() => {
    if (!isClient) return;
    
    if (hasTrackedPageView) {
      // Gửi dữ liệu trang trước đó
      sendAnalyticsData();
    }
    
    // Cập nhật thông tin trang mới
    pageUrlRef.current = window.location.pathname + window.location.search;
    pageTitleRef.current = document.title;
    sessionStartTimeRef.current = Date.now();
    timeOnPageRef.current = 0;
    setHasTrackedPageView(false);
  }, [pathname, searchParams, isClient, hasTrackedPageView]);

  // Theo dõi lượt xem trang 
  useEffect(() => {
    if (!isClient || !visitorId || !sessionId || hasTrackedPageView) return;
    
    trackPageView();
  }, [pathname, hasTrackedPageView, visitorId, sessionId, isClient]);

  // Thiết lập tracking theo dõi hoạt động người dùng
  const setupActivityTracking = () => {
    if (!isClient) return;
    
    // Sự kiện khi rời trang
    window.addEventListener('beforeunload', sendAnalyticsBeforeUnload);
    
    // Theo dõi hoạt động người dùng
    window.addEventListener('mousemove', updateUserActivity);
    window.addEventListener('keypress', updateUserActivity);
    window.addEventListener('scroll', updateUserActivity);
    window.addEventListener('click', updateUserActivity);
    
    // Theo dõi khi tab bị ẩn/hiện
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Thiết lập interval kiểm tra hoạt động và cập nhật thời gian
    activityCheckIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const inactiveTime = now - lastActivityTimeRef.current;
      
      // Nếu không hoạt động quá 60 giây, coi như không tích cực
      if (inactiveTime > 60000 && isUserActiveRef.current) {
        isUserActiveRef.current = false;
      }
      
      // Nếu đang hoạt động, cập nhật thời gian trên trang
      if (isUserActiveRef.current) {
        timeOnPageRef.current += 5; // Tăng 5 giây mỗi lần kiểm tra
      }
      
      // Làm mới session ID nếu hoạt động trở lại sau thời gian dài
      if (!isUserActiveRef.current && inactiveTime > 30 * 60 * 1000) { // 30 phút
        refreshSession();
      }
    }, 5000); // Kiểm tra mỗi 5 giây
  };
  
  // Cập nhật trạng thái hoạt động của người dùng
  const updateUserActivity = () => {
    lastActivityTimeRef.current = Date.now();
    if (!isUserActiveRef.current) {
      isUserActiveRef.current = true;
    }
  };
  
  // Xử lý sự kiện khi tab ẩn/hiện
  const handleVisibilityChange = () => {
    if (!isClient) return;
    
    if (document.visibilityState === 'hidden') {
      // Tab bị ẩn - có thể gửi dữ liệu trước khi người dùng rời đi
      sendAnalyticsData();
    } else {
      // Tab hiện lại - cập nhật thời gian hoạt động
      updateUserActivity();
    }
  };
  
  // Làm mới session ID sau thời gian không hoạt động
  const refreshSession = () => {
    if (!isClient) return;
    
    const newSessionId = generateUUID();
    setCookie('analytics_session_id', newSessionId, { 
      maxAge: 30 * 60, // 30 phút
      path: '/' 
    });
    setSessionId(newSessionId);
    
    // Gửi dữ liệu trước khi bắt đầu phiên mới
    sendAnalyticsData();
    
    // Đặt lại bộ đếm thời gian
    sessionStartTimeRef.current = Date.now();
    timeOnPageRef.current = 0;
  };

  // Tạo UUID v4 đơn giản
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Hàm gửi dữ liệu phân tích khi rời trang
  const sendAnalyticsBeforeUnload = () => {
    if (!isClient) return;
    
    // Huỷ bỏ các event listener
    window.removeEventListener('beforeunload', sendAnalyticsBeforeUnload);
    window.removeEventListener('mousemove', updateUserActivity);
    window.removeEventListener('keypress', updateUserActivity);
    window.removeEventListener('scroll', updateUserActivity);
    window.removeEventListener('click', updateUserActivity);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    
    // Gửi dữ liệu trước khi rời trang
    sendAnalyticsData(true);
  };

  // Hàm theo dõi lượt xem trang
  const trackPageView = async () => {
    if (!isClient) return;
    
    try {
      const data = {
        pageUrl: pageUrlRef.current,
        pageTitle: pageTitleRef.current,
        referrer: document.referrer || '',
        userAgent: navigator.userAgent,
        sessionId: sessionId,
        visitorId: visitorId,
        timeOnPage: 0 // Ban đầu bằng 0, sẽ cập nhật sau
      };

      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      setHasTrackedPageView(true);
    } catch (error) {
      console.error('Lỗi khi theo dõi lượt xem trang:', error);
    }
  };

  // Gửi dữ liệu phân tích
  const sendAnalyticsData = (isUnload = false) => {
    if (!isClient || !visitorId || !sessionId) return;

    const data = {
      pageUrl: pageUrlRef.current,
      pageTitle: pageTitleRef.current,
      referrer: document.referrer || '',
      userAgent: navigator.userAgent,
      sessionId: sessionId,
      visitorId: visitorId,
      timeOnPage: timeOnPageRef.current
    };

    if (isUnload) {
      // Sử dụng sendBeacon nếu trình duyệt hỗ trợ để đảm bảo dữ liệu được gửi khi rời trang
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/track', JSON.stringify(data));
      } else {
        // Fallback cho các trình duyệt không hỗ trợ sendBeacon
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          keepalive: true
        }).catch(err => console.error('Lỗi khi gửi dữ liệu:', err));
      }
    } else {
      // Gửi theo cách thông thường
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).catch(err => console.error('Lỗi khi gửi dữ liệu:', err));
    }
  };

  // Component này không hiển thị gì cả - chỉ theo dõi hoạt động
  return null;
}

export default AnalyticsTracker; 