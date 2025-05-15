'use client'

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import AnalyticsTracker from './analytics-tracker'
import { useIsClient } from '@/app/hooks/use-is-client'

// Định nghĩa các kiểu dữ liệu
type AnalyticsContextType = {
  isEnabled: boolean
  isReady: boolean
  trackEvent: (eventName: string, eventData?: Record<string, any>) => void
}

// Tạo context với giá trị mặc định
const AnalyticsContext = createContext<AnalyticsContextType>({
  isEnabled: false,
  isReady: false,
  trackEvent: () => {} // Hàm rỗng mặc định
})

// Custom hook để sử dụng analytics context
export const useAnalytics = () => useContext(AnalyticsContext)

// Lưu trữ ID các sự kiện đã gửi để tránh trùng lặp
const sentEventIds = new Set<string>();
const MAX_STORED_IDS = 1000;

/**
 * Tạo ID duy nhất cho sự kiện dựa trên tên và dữ liệu
 */
const createEventId = (eventName: string, eventData: Record<string, any>): string => {
  const dataString = JSON.stringify(eventData);
  return `${eventName}-${btoa(dataString).substring(0, 20)}-${Date.now()}`;
};

// Provider component
export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  const [isEnabled, setIsEnabled] = useState(true)
  const isClient = useIsClient()
  // Hàng đợi cho các sự kiện
  const eventQueueRef = useRef<Array<{
    id: string;
    eventName: string;
    eventData: Record<string, any>;
    timestamp: string;
  }>>([]);
  // Biến để kiểm soát việc xử lý hàng đợi
  const isProcessingQueueRef = useRef<boolean>(false);
  // Thời gian gửi gần nhất
  const lastSentTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isClient) return

    // Kiểm tra xem analytics có bị tắt bởi người dùng không
    const disabledByUser = localStorage.getItem('analytics_disabled') === 'true'
    setIsEnabled(!disabledByUser)
    
    // Khởi tạo analytics
    try {
      const setupAnalytics = async () => {
        // Kiểm tra kết nối API Analytics
        const response = await fetch('/api/analytics/track', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })
        
        if (response.ok) {
          setIsReady(true)
        } else {
          console.warn('Analytics API không khả dụng, một số tính năng theo dõi có thể bị giới hạn')
          setIsReady(true) // Vẫn thiết lập là sẵn sàng nhưng hệ thống sẽ sử dụng fallback
        }
      }
      
      setupAnalytics()

      // Thiết lập bộ xử lý hàng đợi định kỳ - tăng từ 5 giây lên 30 giây
      const intervalId = setInterval(() => {
        processEventQueue();
      }, 30000);

      // Thêm sự kiện beforeunload để gửi dữ liệu cuối cùng
      window.addEventListener('beforeunload', processEventQueueSync);

      return () => {
        clearInterval(intervalId);
        window.removeEventListener('beforeunload', processEventQueueSync);
        // Gửi dữ liệu còn lại khi unmount
        processEventQueueSync();
      };
    } catch (error) {
      console.error('Lỗi khi khởi tạo analytics:', error)
      // Vẫn thiết lập trạng thái sẵn sàng để không làm gián đoạn trải nghiệm người dùng
      setIsReady(true)
    }
  }, [isClient])

  // Loại bỏ các sự kiện trùng lặp trong hàng đợi
  const deduplicateQueue = () => {
    if (eventQueueRef.current.length <= 1) return;
    
    // Sử dụng Set để loại bỏ các sự kiện trùng lặp
    const uniqueEventIds = new Set<string>();
    const uniqueEvents: typeof eventQueueRef.current = [];
    
    for (const event of eventQueueRef.current) {
      if (!uniqueEventIds.has(event.id)) {
        uniqueEventIds.add(event.id);
        uniqueEvents.push(event);
      }
    }
    
    eventQueueRef.current = uniqueEvents;
  };

  // Xử lý hàng đợi sự kiện bất đồng bộ
  const processEventQueue = async () => {
    if (isProcessingQueueRef.current || eventQueueRef.current.length === 0) return;
    
    isProcessingQueueRef.current = true;
    
    try {
      // Loại bỏ các sự kiện trùng lặp trước khi xử lý
      deduplicateQueue();
      
      // Chỉ gửi tối đa 20 sự kiện mỗi lần xử lý
      const eventsToProcess = eventQueueRef.current.slice(0, 20);
      
      // Gửi nhiều sự kiện cùng lúc trong một request
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          batchEvents: eventsToProcess.map(event => ({
            eventName: event.eventName,
            eventData: event.eventData,
            pageUrl: window.location.pathname,
            pageTitle: document.title,
            timestamp: event.timestamp,
            visitorId: localStorage.getItem('analytics_visitor_id') || '',
            sessionId: localStorage.getItem('analytics_session_id') || '',
          })),
        }),
      });
      
      // Thêm sự kiện đã xử lý vào danh sách đã gửi
      for (const event of eventsToProcess) {
        sentEventIds.add(event.id);
      }
      
      // Giới hạn số lượng IDs được lưu trữ
      if (sentEventIds.size > MAX_STORED_IDS) {
        // Chuyển thành mảng và xóa bớt
        const sentIdsArray = Array.from(sentEventIds);
        const newSentIds = new Set(sentIdsArray.slice(sentIdsArray.length - MAX_STORED_IDS / 2));
        sentEventIds.clear();
        for (const id of newSentIds) {
          sentEventIds.add(id);
        }
      }
      
      // Xóa các sự kiện đã xử lý khỏi hàng đợi
      eventQueueRef.current = eventQueueRef.current.slice(eventsToProcess.length);
    } catch (error) {
      console.error('Lỗi khi xử lý hàng đợi sự kiện:', error);
    } finally {
      isProcessingQueueRef.current = false;
    }
  };

  // Xử lý hàng đợi sự kiện đồng bộ (khi trang đóng)
  const processEventQueueSync = () => {
    if (eventQueueRef.current.length === 0) return;
    
    try {
      // Loại bỏ các sự kiện trùng lặp trước khi xử lý
      deduplicateQueue();
      
      // Sử dụng sendBeacon để đảm bảo gửi dữ liệu trước khi trang đóng
      if (navigator.sendBeacon) {
        const events = eventQueueRef.current.map(event => ({
          eventName: event.eventName,
          eventData: event.eventData,
          pageUrl: window.location.pathname,
          pageTitle: document.title,
          timestamp: event.timestamp,
          visitorId: localStorage.getItem('analytics_visitor_id') || '',
          sessionId: localStorage.getItem('analytics_session_id') || '',
        }));
        
        navigator.sendBeacon('/api/analytics/track', JSON.stringify({
          batchEvents: events,
        }));
        
        // Xóa hàng đợi
        eventQueueRef.current = [];
      }
    } catch (error) {
      console.error('Lỗi khi gửi dữ liệu cuối cùng:', error);
    }
  };

  // Hàm theo dõi sự kiện tùy chỉnh (ngoài pageview)
  const trackEvent = (eventName: string, eventData: Record<string, any> = {}) => {
    if (!isEnabled || !isReady || !isClient) return
    
    try {
      // Tạo ID duy nhất cho sự kiện
      const eventId = createEventId(eventName, eventData);
      
      // Kiểm tra xem sự kiện này đã được gửi chưa
      if (sentEventIds.has(eventId)) {
        return; // Đã gửi rồi, bỏ qua
      }
      
      // Thêm sự kiện vào hàng đợi
      eventQueueRef.current.push({
        id: eventId,
        eventName,
        eventData,
        timestamp: new Date().toISOString(),
      });
      
      // Nếu hàng đợi quá lớn hoặc đã qua đủ thời gian, xử lý ngay
      const now = Date.now();
      if (eventQueueRef.current.length >= 20 || now - lastSentTimeRef.current > 60000) { // Tăng lên từ 10 sự kiện và 10 giây
        lastSentTimeRef.current = now;
        // Xử lý hàng đợi bất đồng bộ
        setTimeout(processEventQueue, 0);
      }
    } catch (error) {
      console.error('Lỗi khi theo dõi sự kiện:', error)
    }
  }

  // Cung cấp context và kèm theo AnalyticsTracker component
  return (
    <AnalyticsContext.Provider value={{ isEnabled, isReady, trackEvent }}>
      {children}
      {isClient && isEnabled && <AnalyticsTracker />}
    </AnalyticsContext.Provider>
  )
}

export default AnalyticsProvider
