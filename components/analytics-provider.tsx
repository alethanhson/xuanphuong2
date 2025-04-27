'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import AnalyticsTracker from './analytics-tracker'
import { useIsClient } from '@/hooks/use-is-client'

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

// Provider component
export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  const [isEnabled, setIsEnabled] = useState(true)
  const isClient = useIsClient()

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
    } catch (error) {
      console.error('Lỗi khi khởi tạo analytics:', error)
      // Vẫn thiết lập trạng thái sẵn sàng để không làm gián đoạn trải nghiệm người dùng
      setIsReady(true)
    }
  }, [isClient])

  // Hàm theo dõi sự kiện tùy chỉnh (ngoài pageview)
  const trackEvent = (eventName: string, eventData: Record<string, any> = {}) => {
    if (!isEnabled || !isReady || !isClient) return
    
    try {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventName,
          eventData,
          pageUrl: window.location.pathname,
          pageTitle: document.title,
          timestamp: new Date().toISOString(),
        }),
      }).catch(err => console.error('Lỗi khi theo dõi sự kiện:', err))
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
