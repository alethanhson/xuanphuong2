'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import analytics from '@/lib/analytics'
import { setupAnalytics } from '@/lib/check-analytics'

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isAnalyticsReady, setIsAnalyticsReady] = useState(false)

  useEffect(() => {
    // Initialize and check analytics when the component mounts
    const initAnalytics = async () => {
      try {
        await setupAnalytics()
        setIsAnalyticsReady(true)
      } catch (error) {
        console.error('Failed to initialize analytics:', error)
        // Vẫn thiết lập sẵn sàng để theo dõi lượt xem trang nhưng sử dụng fallback
        sessionStorage.setItem('use_analytics_fallback', 'true')
        setIsAnalyticsReady(true)
      }
    }

    initAnalytics()
  }, [])

  useEffect(() => {
    // Track page views when the route changes, but only if analytics is ready
    if (isAnalyticsReady) {
      try {
        analytics.trackPageView(pathname)
      } catch (error) {
        console.error('Failed to track page view:', error)
        // Lỗi theo dõi trang không nên ngăn chặn trải nghiệm người dùng
      }
    }
  }, [pathname, searchParams, isAnalyticsReady])

  return <>{children}</>
}

export default AnalyticsProvider
