import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Tạo Supabase client với service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Cache cho các thống kê trang
let pageViewsCache: Record<string, any> = {};
let visitorStatsCache: any = null;
let lastCacheCleanup = Date.now();

// Lưu trữ URLs đã xử lý để tránh trùng lặp
let processedUrls: Set<string> = new Set();
const MAX_PROCESSED_URLS = 1000; // Giới hạn số URLs để tránh memory leak

/**
 * Hàm làm sạch cache định kỳ
 */
const cleanupCache = () => {
  const now = Date.now();
  // Chỉ làm sạch cache mỗi 5 phút
  if (now - lastCacheCleanup > 5 * 60 * 1000) {
    pageViewsCache = {};
    visitorStatsCache = null;
    // Reset processed URLs sau mỗi 5 phút
    processedUrls.clear();
    lastCacheCleanup = now;
  }
};

/**
 * Cập nhật cache cho page views - chỉ cập nhật nếu URL chưa được xử lý
 */
const updatePageViewsCache = (pageUrl: string, pageTitle: string, timeOnPage: number, visitorId: string) => {
  const today = new Date().toISOString().split('T')[0];
  const cacheKey = `${pageUrl}|${today}`;
  const visitKey = `${pageUrl}|${visitorId}|${today}`;
  
  // Kiểm tra xem URL với visitor ID này đã được xử lý chưa
  if (processedUrls.has(visitKey)) {
    return false; // Đã xử lý rồi, không cập nhật
  }
  
  // Thêm vào danh sách URLs đã xử lý
  processedUrls.add(visitKey);
  
  // Nếu danh sách URLs đã xử lý quá lớn, xóa bớt
  if (processedUrls.size > MAX_PROCESSED_URLS) {
    // Xóa 20% URLs cũ nhất
    const urlsToDelete = Math.floor(MAX_PROCESSED_URLS * 0.2);
    const urlsArray = Array.from(processedUrls);
    processedUrls = new Set(urlsArray.slice(urlsToDelete));
  }
  
  if (!pageViewsCache[cacheKey]) {
    pageViewsCache[cacheKey] = {
      count: 1,
      title: pageTitle,
      avgTime: timeOnPage || 0
    };
  } else {
    pageViewsCache[cacheKey].count += 1;
    if (timeOnPage) {
      // Cập nhật thời gian trung bình
      const prevAvg = pageViewsCache[cacheKey].avgTime || 0;
      const prevCount = pageViewsCache[cacheKey].count - 1;
      pageViewsCache[cacheKey].avgTime = 
        (prevAvg * prevCount + timeOnPage) / pageViewsCache[cacheKey].count;
    }
  }
  
  return true; // Đã cập nhật thành công
};

/**
 * Cập nhật cache cho visitor stats
 */
const updateVisitorStatsCache = () => {
  if (!visitorStatsCache) {
    visitorStatsCache = {
      visitors: 1,
      pageViews: 1
    };
  } else {
    visitorStatsCache.visitors += 1;
    visitorStatsCache.pageViews += 1;
  }
};

// Biến để kiểm soát quá trình flush cache
let isFlushingCache = false;

/**
 * Cập nhật thống kê từ cache vào cơ sở dữ liệu
 */
const flushCacheToDatabase = async () => {
  // Nếu đang flush, bỏ qua
  if (isFlushingCache) return;
  
  // Kiểm tra xem có dữ liệu để flush không
  if (Object.keys(pageViewsCache).length === 0 && !visitorStatsCache) return;
  
  isFlushingCache = true;
  
  try {
    // Tạo bản sao của cache để xử lý
    const pageViewsToProcess = { ...pageViewsCache };
    const visitorStatsToProcess = visitorStatsCache ? { ...visitorStatsCache } : null;
    
    // Xóa cache hiện tại để nhận dữ liệu mới
    pageViewsCache = {};
    visitorStatsCache = null;
    
    // Cập nhật dữ liệu page_views từ cache
    const pageViewEntries = Object.entries(pageViewsToProcess);
    if (pageViewEntries.length > 0) {
      for (const [key, data] of pageViewEntries) {
        const [pageUrl, date] = key.split('|');
        
        try {
          // Kiểm tra xem đã có bản ghi cho trang này trong ngày hay chưa
          const { data: existingPageView } = await supabase
            .from('page_views')
            .select('*')
            .eq('page_url', pageUrl)
            .eq('stat_date', date)
            .maybeSingle();
          
          if (existingPageView) {
            // Đã có bản ghi, cập nhật số lượng
            await supabase
              .from('page_views')
              .update({
                view_count: existingPageView.view_count + data.count,
                updated_at: new Date().toISOString()
              })
              .eq('id', existingPageView.id);
          } else {
            // Chưa có bản ghi, tạo mới
            await supabase
              .from('page_views')
              .insert([{
                page_url: pageUrl,
                page_title: data.title || '',
                stat_date: date,
                view_count: data.count,
                unique_visitors: 1,
                avg_time_on_page: data.avgTime || 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }]);
          }
        } catch (error) {
          console.error(`Lỗi khi cập nhật page_views cho ${pageUrl}:`, error);
        }
      }
    }
    
    // Cập nhật visitor_stats từ cache
    if (visitorStatsToProcess) {
      const today = new Date().toISOString().split('T')[0];
      
      try {
        const { data: existingVisitorStats } = await supabase
          .from('visitor_stats')
          .select('*')
          .eq('stat_date', today)
          .maybeSingle();
          
        if (existingVisitorStats) {
          // Đã có bản ghi, cập nhật số lượng
          await supabase
            .from('visitor_stats')
            .update({
              total_visitors: existingVisitorStats.total_visitors + visitorStatsToProcess.visitors,
              page_views: existingVisitorStats.page_views + visitorStatsToProcess.pageViews,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingVisitorStats.id);
        } else {
          // Chưa có bản ghi, tạo mới
          await supabase
            .from('visitor_stats')
            .insert({
              stat_date: today,
              total_visitors: visitorStatsToProcess.visitors,
              unique_visitors: visitorStatsToProcess.visitors,
              page_views: visitorStatsToProcess.pageViews,
              avg_session_duration: 0,
              bounce_rate: 0
            });
        }
      } catch (error) {
        console.error('Lỗi khi cập nhật visitor_stats:', error);
      }
    }
  } catch (error) {
    console.error('Lỗi khi flush cache vào database:', error);
  } finally {
    isFlushingCache = false;
  }
};

// Gọi hàm để xử lý cache định kỳ, mỗi 60 giây (tăng từ 30 lên 60)
setInterval(() => {
  flushCacheToDatabase();
}, 60 * 1000);

/**
 * Xử lý một sự kiện tùy chỉnh
 */
const processCustomEvent = async (eventData: any) => {
  const { eventName, eventData: customData = {}, pageUrl = '', sessionId = '', visitorId = '' } = eventData;
  
  if (!eventName) return;
  
  try {
    // Lưu vào bảng events
    await supabase
      .from('events')
      .insert([{
        event_type: eventName,
        event_data: customData,
        page_url: pageUrl,
        session_id: sessionId,
        visitor_id: visitorId,
        created_at: eventData.timestamp || new Date().toISOString()
      }]);
  } catch (error) {
    console.error('Lỗi khi lưu dữ liệu sự kiện:', error);
  }
};

/**
 * API endpoint để thu thập dữ liệu phân tích từ client side
 * 
 * POST /api/analytics/track
 * Nhận thông tin trang hiện tại và ghi lại lượt truy cập
 */
export async function POST(req: NextRequest) {
  try {
    // Làm sạch cache nếu cần
    cleanupCache();
    
    // Lấy dữ liệu từ request
    const data = await req.json();
    
    // Kiểm tra xem đây có phải là batch events không
    if (data.batchEvents && Array.isArray(data.batchEvents)) {
      let updatedCount = 0;
      let skippedCount = 0;
      
      // Xử lý nhiều sự kiện cùng lúc
      for (const event of data.batchEvents) {
        if (event.eventName) {
          // Đây là sự kiện tùy chỉnh
          await processCustomEvent(event);
          updatedCount++;
        } else {
          // Đây là pageview
          const { pageUrl, pageTitle, timeOnPage, visitorId } = event;
          if (pageUrl && visitorId) {
            const wasUpdated = updatePageViewsCache(pageUrl, pageTitle || '', timeOnPage ? Math.floor(timeOnPage) : 0, visitorId);
            if (wasUpdated) {
              updateVisitorStatsCache();
              updatedCount++;
            } else {
              skippedCount++;
            }
          }
        }
      }
      
      return NextResponse.json({
        success: true,
        data: { 
          batchProcessed: true, 
          count: data.batchEvents.length,
          updated: updatedCount,
          skipped: skippedCount
        }
      });
    }
    
    // Xử lý single event (cách cũ)
    const { 
      pageUrl, 
      pageTitle, 
      eventName,
      eventData = {},
      sessionId,
      visitorId,
      timeOnPage
    } = data;

    if (!pageUrl) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Nếu không có eventName, đây là request tracking page view thông thường
    if (!eventName) {
      // Xử lý session ID và visitor ID
      let finalSessionId = sessionId;
      let finalVisitorId = visitorId;

      if (!finalSessionId || !finalVisitorId) {
        // Nếu không có ID từ client, kiểm tra cookie
        const cookieStore = cookies();
        finalSessionId = finalSessionId || cookieStore.get('analytics_session_id')?.value;
        finalVisitorId = finalVisitorId || cookieStore.get('analytics_visitor_id')?.value;

        if (!finalSessionId) {
          finalSessionId = crypto.randomUUID();
          // Thiết lập cookie cho phiên hiện tại (hết hạn sau 30 phút)
          cookieStore.set('analytics_session_id', finalSessionId, {
            path: '/',
            maxAge: 30 * 60, // 30 phút
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          });
        }

        if (!finalVisitorId) {
          finalVisitorId = crypto.randomUUID();
          // Thiết lập cookie cho người dùng (hết hạn sau 1 năm)
          cookieStore.set('analytics_visitor_id', finalVisitorId, {
            path: '/',
            maxAge: 365 * 24 * 60 * 60, // 1 năm
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          });
        }
      }

      // Cập nhật cache thay vì truy vấn database trực tiếp - nếu URL chưa được xử lý
      const wasUpdated = updatePageViewsCache(pageUrl, pageTitle || '', timeOnPage ? Math.floor(timeOnPage) : 0, finalVisitorId || '');
      
      // Chỉ cập nhật visitor stats nếu URL chưa được xử lý
      if (wasUpdated) {
        updateVisitorStatsCache();
      }
      
      // Nếu cache quá lớn, flush ngay lập tức
      if (Object.keys(pageViewsCache).length > 100) { // Tăng ngưỡng từ 50 lên 100
        // Sử dụng setTimeout để không block request hiện tại
        setTimeout(() => flushCacheToDatabase(), 0);
      }
      
      return NextResponse.json({
        success: true,
        data: {
          sessionId: finalSessionId || null,
          visitorId: finalVisitorId || null,
          pageUrl,
          tracked: wasUpdated // Cho biết URL đã được track hay chưa
        }
      });
    } else {
      // Đây là sự kiện tùy chỉnh - xử lý qua hàm chung
      await processCustomEvent(data);
      
      return NextResponse.json({
        success: true,
        data: {
          sessionId: sessionId || null,
          visitorId: visitorId || null,
          eventName
        }
      });
    }
  } catch (error) {
    console.error('Lỗi máy chủ:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 });
  }
}

/**
 * API endpoint để lấy thông tin thống kê
 * 
 * GET /api/analytics/track
 * Trả về thông tin số lượt truy cập hôm nay
 */
export async function GET(req: NextRequest) {
  try {
    // Lấy thống kê cho ngày hôm nay
    const today = new Date().toISOString().split('T')[0];
    const { data: todayStats, error } = await supabase
      .from('visitor_stats')
      .select('*')
      .eq('stat_date', today)
      .maybeSingle();
      
    if (error) {
      console.error('Lỗi khi lấy thống kê hôm nay:', error);
      return NextResponse.json(
        { success: false, message: 'Lỗi khi lấy thống kê' },
        { status: 500 }
      );
    }
    
    // Trả về dữ liệu từ DB + cache (nếu chưa flush)
    let pageViews = todayStats?.page_views || 0;
    let totalVisitors = todayStats?.total_visitors || 0;
    
    // Thêm dữ liệu từ cache nếu có
    if (visitorStatsCache) {
      pageViews += visitorStatsCache.pageViews;
      totalVisitors += visitorStatsCache.visitors;
    }
    
    return NextResponse.json({
      success: true,
      data: {
        page_views: pageViews,
        total_visitors: totalVisitors,
        unique_visitors: todayStats?.unique_visitors || 0
      }
    });
  } catch (error) {
    console.error('Lỗi máy chủ:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi máy chủ' },
      { status: 500 }
    );
  }
} 