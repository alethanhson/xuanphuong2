import { NextRequest, NextResponse } from 'next/server';
import { getGeolocation, trackPageView } from '@/lib/analytics-middleware';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * API endpoint để thu thập dữ liệu phân tích từ client side
 * 
 * POST /api/analytics/track
 * Nhận thông tin trang hiện tại và ghi lại lượt truy cập
 */
export async function POST(req: NextRequest) {
  try {
    // Tạo Supabase client với service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Lấy dữ liệu từ request
    const data = await req.json();
    const { 
      pageUrl, 
      pageTitle, 
      referrer = '', 
      userAgent = '',
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

    // Lấy IP từ request headers
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    
    // Lấy thông tin địa lý từ IP
    let geoData = null;
    try {
      // Sử dụng dịch vụ ipinfo.io để lấy thông tin địa lý
      const ipinfoResponse = await fetch(`https://ipinfo.io/${ip}/json?token=${process.env.IPINFO_TOKEN}`);
      if (ipinfoResponse.ok) {
        geoData = await ipinfoResponse.json();
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin địa lý:', error);
    }
    
    // Nếu không có eventName, đây là request tracking page view thông thường
    if (!eventName) {
      // Ghi lại lượt truy cập
      await trackPageView(geoData, pageUrl, pageTitle || 'Trang web');

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

      // Chuẩn bị dữ liệu để lưu vào Supabase
      const analyticsData = {
        page_url: pageUrl || '',
        page_title: pageTitle || '',
        referrer: referrer || '',
        user_agent: userAgent || '',
        ip_address: ip,
        visitor_id: finalVisitorId,
        session_id: finalSessionId,
        time_on_page: timeOnPage || null,
        country: geoData?.country || null,
        region: geoData?.region || null,
        city: geoData?.city || null,
        created_at: new Date().toISOString(),
        event_type: 'pageview',
        event_data: {}
      };
      
      // Lưu dữ liệu vào bảng page_views
      const { error } = await supabase
        .from('page_views')
        .insert([analyticsData]);
      
      if (error) {
        console.error('Lỗi khi lưu dữ liệu analytics:', error);
        return NextResponse.json({ error: 'Lỗi khi lưu dữ liệu analytics' }, { status: 500 });
      }
      
      // Cập nhật bảng geographic_stats nếu có thông tin địa lý
      if (geoData?.country) {
        await updateGeographicStats(supabase, geoData);
      }
    } else {
      // Đây là sự kiện tùy chỉnh
      const eventAnalyticsData = {
        page_url: pageUrl || '',
        page_title: pageTitle || '',
        referrer: referrer || '',
        user_agent: userAgent || '',
        ip_address: ip,
        visitor_id: visitorId,
        session_id: sessionId,
        country: geoData?.country || null,
        region: geoData?.region || null,
        city: geoData?.city || null,
        created_at: new Date().toISOString(),
        event_type: eventName,
        event_data: eventData || {}
      };
      
      // Lưu vào bảng events
      const { error } = await supabase
        .from('events')
        .insert([eventAnalyticsData]);
      
      if (error) {
        console.error('Lỗi khi lưu dữ liệu sự kiện:', error);
        return NextResponse.json({ error: 'Lỗi khi lưu dữ liệu sự kiện' }, { status: 500 });
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        sessionId: sessionId || null,
        visitorId: visitorId || null,
        pageUrl,
        region: geoData?.region,
        city: geoData?.city
      }
    });
  } catch (error) {
    console.error('Lỗi máy chủ:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 });
  }
}

/**
 * Cập nhật thống kê theo khu vực địa lý
 */
async function updateGeographicStats(supabase: any, geoData: any) {
  try {
    // Kiểm tra xem đã có bản ghi cho quốc gia/vùng này chưa
    const { data: existingStats } = await supabase
      .from('geographic_stats')
      .select('*')
      .match({ 
        country: geoData.country,
        region: geoData.region || '' 
      })
      .single();
    
    if (existingStats) {
      // Cập nhật bản ghi hiện có
      await supabase
        .from('geographic_stats')
        .update({ 
          visit_count: existingStats.visit_count + 1,
          last_visit: new Date().toISOString()
        })
        .match({ id: existingStats.id });
    } else {
      // Tạo bản ghi mới
      await supabase
        .from('geographic_stats')
        .insert([{
          country: geoData.country,
          region: geoData.region || '',
          city: geoData.city || '',
          visit_count: 1,
          last_visit: new Date().toISOString()
        }]);
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật thống kê địa lý:', error);
  }
}

/**
 * API endpoint để lấy thông tin địa lý của người dùng hiện tại
 * 
 * GET /api/analytics/track
 * Trả về thông tin định vị địa lý của IP người dùng
 */
export async function GET(req: NextRequest) {
  try {
    // Lấy thông tin địa lý từ IP người dùng
    const geoData = await getGeolocation(req);
    
    return NextResponse.json({
      success: true,
      data: {
        country: geoData.country,
        region: geoData.region,
        city: geoData.city
      }
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin địa lý:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi máy chủ' },
      { status: 500 }
    );
  }
} 