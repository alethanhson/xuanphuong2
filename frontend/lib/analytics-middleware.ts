import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware để thu thập thông tin lượt truy cập
 */
export async function analyticsMiddleware(req: NextRequest) {
  try {
    // Bỏ qua các request tĩnh và API
    const url = req.nextUrl.pathname;
    if (
      url.startsWith('/api/') || 
      url.includes('/_next/') || 
      url.includes('/favicon.ico') ||
      url.endsWith('.png') ||
      url.endsWith('.jpg') ||
      url.endsWith('.jpeg') ||
      url.endsWith('.svg') ||
      url.endsWith('.css') ||
      url.endsWith('.js')
    ) {
      return null;
    }
    
    // Gọi API để ghi lại lượt truy cập
    try {
      const pageUrl = req.nextUrl.pathname;
      const pageTitle = 'Website Page'; // Có thể cải thiện để lấy title thực tế
      
      // Gửi request đến API endpoint
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pageUrl,
          pageTitle
        })
      }).catch(error => {
        console.error('Lỗi khi gọi API tracking:', error);
      });
    } catch (error) {
      console.error('Lỗi khi ghi lại lượt truy cập:', error);
    }
    
    return null;
  } catch (error) {
    console.error('Lỗi trong middleware analytics:', error);
    return null;
  }
} 