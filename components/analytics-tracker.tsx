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
  const activityCheckIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pageUrlRef = useRef<string>('');
  const pageTitleRef = useRef<string>('');
  const isClient = useIsClient();
  // Biến để kiểm soát việc throttling requests
  const lastSentTimeRef = useRef<number>(0);
  const analyticsQueueRef = useRef<any[]>([]);
  const isProcessingQueueRef = useRef<boolean>(false);
  // Lưu trữ danh sách các URL đã được track trong phiên hiện tại
  const trackedUrlsRef = useRef<Set<string>>(new Set());

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

    // Khôi phục danh sách URL đã được theo dõi từ sessionStorage
    try {
      const storedTrackedUrls = sessionStorage.getItem('tracked_urls');
      if (storedTrackedUrls) {
        trackedUrlsRef.current = new Set(JSON.parse(storedTrackedUrls));
      }
    } catch (error) {
      console.error('Lỗi khi khôi phục danh sách URL đã theo dõi:', error);
    }

    // Thiết lập các sự kiện theo dõi hoạt động
    setupActivityTracking();

    // Thiết lập xử lý hàng đợi analytics
    setupAnalyticsQueue();

    // Cleanup khi component unmount
    return () => {
      if (activityCheckIntervalRef.current) {
        clearInterval(activityCheckIntervalRef.current);
      }
      // Gửi dữ liệu còn lại trong hàng đợi
      processAnalyticsQueue(true);
      
      // Lưu danh sách URL đã theo dõi vào sessionStorage
      try {
        sessionStorage.setItem('tracked_urls', JSON.stringify(Array.from(trackedUrlsRef.current)));
      } catch (error) {
        console.error('Lỗi khi lưu danh sách URL đã theo dõi:', error);
      }
    };
  }, [isClient]);

  // Phát hiện thay đổi trang
  useEffect(() => {
    if (!isClient) return;
    
    const currentPageUrl = window.location.pathname + window.location.search;
    
    // Kiểm tra xem đã track trang này chưa
    const hasPageBeenTracked = trackedUrlsRef.current.has(currentPageUrl);
    
    if (hasPageBeenTracked) {
      // Đã track trang này rồi, không cần track lại
      setHasTrackedPageView(true);
      return;
    }
    
    if (hasTrackedPageView) {
      // Nếu đang ở trang mới và trang cũ đã được track, thêm dữ liệu trang cũ vào hàng đợi
      if (pageUrlRef.current !== currentPageUrl) {
        queueAnalyticsData();
      }
    }
    
    // Cập nhật thông tin trang mới
    pageUrlRef.current = currentPageUrl;
    pageTitleRef.current = document.title;
    sessionStartTimeRef.current = Date.now();
    timeOnPageRef.current = 0;
    
    // Nếu trang chưa được track thì reset trạng thái track
    if (!hasPageBeenTracked) {
      setHasTrackedPageView(false);
    }
  }, [pathname, searchParams, isClient, hasTrackedPageView]);

  // Theo dõi lượt xem trang 
  useEffect(() => {
    if (!isClient || !visitorId || !sessionId || hasTrackedPageView) return;
    
    const currentPageUrl = window.location.pathname + window.location.search;
    
    // Kiểm tra xem đã track trang này chưa
    if (trackedUrlsRef.current.has(currentPageUrl)) {
      setHasTrackedPageView(true);
      return;
    }
    
    trackPageView();
  }, [pathname, hasTrackedPageView, visitorId, sessionId, isClient]);

  // Thiết lập hàng đợi xử lý analytics
  const setupAnalyticsQueue = () => {
    // Xử lý hàng đợi mỗi 30 giây - tăng từ 10 giây lên 30 giây
    setInterval(() => {
      processAnalyticsQueue();
    }, 30000);
  };

  // Thêm dữ liệu vào hàng đợi
  const queueAnalyticsData = () => {
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

    analyticsQueueRef.current.push(data);
  };

  // Xử lý hàng đợi analytics
  const processAnalyticsQueue = (isUnload = false) => {
    if (isProcessingQueueRef.current || analyticsQueueRef.current.length === 0) return;
    
    isProcessingQueueRef.current = true;
    
    try {
      // Nếu đang unload trang, sử dụng sendBeacon
      if (isUnload && navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/track', JSON.stringify({
          batchEvents: analyticsQueueRef.current
        }));
        analyticsQueueRef.current = [];
      } else {
        // Gửi toàn bộ hàng đợi trong một request
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            batchEvents: analyticsQueueRef.current
          }),
        })
        .then(() => {
          // Xóa tất cả items đã xử lý khỏi hàng đợi
          analyticsQueueRef.current = [];
          isProcessingQueueRef.current = false;
        })
        .catch((error) => {
          console.error('Lỗi khi gửi analytics:', error);
          isProcessingQueueRef.current = false;
        });
      }
    } catch (error) {
      console.error('Lỗi khi xử lý hàng đợi analytics:', error);
      isProcessingQueueRef.current = false;
    }
  };

  // Thiết lập tracking theo dõi hoạt động người dùng
  const setupActivityTracking = () => {
    if (!isClient) return;
    
    // Sự kiện khi rời trang
    window.addEventListener('beforeunload', sendAnalyticsBeforeUnload);
    
    // Theo dõi hoạt động người dùng - sử dụng debounce để giảm số lần gọi
    const debouncedUpdate = debounce(updateUserActivity, 500); // Tăng thời gian debounce từ 300ms lên 500ms
    window.addEventListener('mousemove', debouncedUpdate);
    window.addEventListener('keypress', updateUserActivity);
    window.addEventListener('scroll', debouncedUpdate);
    window.addEventListener('click', updateUserActivity);
    
    // Theo dõi khi tab bị ẩn/hiện
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Thiết lập interval kiểm tra hoạt động và cập nhật thời gian
    // Tăng thời gian kiểm tra từ 15 giây lên 30 giây
    activityCheckIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const inactiveTime = now - lastActivityTimeRef.current;
      
      // Nếu không hoạt động quá 60 giây, coi như không tích cực
      if (inactiveTime > 60000 && isUserActiveRef.current) {
        isUserActiveRef.current = false;
      }
      
      // Nếu đang hoạt động, cập nhật thời gian trên trang
      if (isUserActiveRef.current) {
        timeOnPageRef.current += 30; // Tăng 30 giây mỗi lần kiểm tra
      }
      
      // Làm mới session ID nếu hoạt động trở lại sau thời gian dài
      if (!isUserActiveRef.current && inactiveTime > 30 * 60 * 1000) { // 30 phút
        refreshSession();
      }
    }, 30000); // Kiểm tra mỗi 30 giây
  };
  
  // Hàm debounce để giảm tần suất gọi hàm
  const debounce = (func: Function, wait: number) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return (...args: any[]) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
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
      // Tab bị ẩn - thêm dữ liệu vào hàng đợi
      queueAnalyticsData();
      // Không cần xử lý hàng đợi ngay lập tức
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
    
    // Thêm dữ liệu vào hàng đợi trước khi bắt đầu phiên mới
    queueAnalyticsData();
    
    // Đặt lại bộ đếm thời gian
    sessionStartTimeRef.current = Date.now();
    timeOnPageRef.current = 0;
    
    // Xóa danh sách URL đã theo dõi để có thể track lại trong phiên mới
    trackedUrlsRef.current.clear();
    try {
      sessionStorage.removeItem('tracked_urls');
    } catch (error) {
      console.error('Lỗi khi xóa danh sách URL đã theo dõi:', error);
    }
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
    
    // Thêm dữ liệu vào hàng đợi và xử lý ngay
    queueAnalyticsData();
    processAnalyticsQueue(true);
    
    // Lưu danh sách URL đã theo dõi vào sessionStorage
    try {
      sessionStorage.setItem('tracked_urls', JSON.stringify(Array.from(trackedUrlsRef.current)));
    } catch (error) {
      console.error('Lỗi khi lưu danh sách URL đã theo dõi:', error);
    }
  };

  // Hàm theo dõi lượt xem trang - chỉ track một lần duy nhất cho mỗi URL
  const trackPageView = async () => {
    if (!isClient) return;
    
    try {
      const currentPageUrl = window.location.pathname + window.location.search;
      
      // Kiểm tra xem URL này đã được theo dõi chưa
      if (trackedUrlsRef.current.has(currentPageUrl)) {
        setHasTrackedPageView(true);
        return;
      }
      
      const now = Date.now();
      // Chỉ gửi request nếu đã qua thời gian tối thiểu từ lần gửi cuối - tăng lên 10 giây
      if (now - lastSentTimeRef.current < 10000) {
        // Thêm vào hàng đợi để xử lý sau thay vì gửi ngay
        queueAnalyticsData();
        setHasTrackedPageView(true);
        trackedUrlsRef.current.add(currentPageUrl); // Đánh dấu URL đã được theo dõi
        return;
      }
      
      const data = {
        pageUrl: currentPageUrl,
        pageTitle: document.title,
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

      lastSentTimeRef.current = now;
      setHasTrackedPageView(true);
      trackedUrlsRef.current.add(currentPageUrl); // Đánh dấu URL đã được theo dõi
      
      // Lưu danh sách URL đã theo dõi vào sessionStorage
      try {
        sessionStorage.setItem('tracked_urls', JSON.stringify(Array.from(trackedUrlsRef.current)));
      } catch (error) {
        console.error('Lỗi khi lưu danh sách URL đã theo dõi:', error);
      }
    } catch (error) {
      console.error('Lỗi khi theo dõi lượt xem trang:', error);
    }
  };

  return null;
}

export default AnalyticsTracker; 