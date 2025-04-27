import { NextRequest, NextResponse } from 'next/server';
import { supabase } from './supabaseClient';

// Các vùng miền tại Việt Nam để xác định khu vực
const VIETNAM_REGIONS = [
  { region: 'Hồ Chí Minh', city: 'Quận 1' },
  { region: 'Hà Nội', city: 'Ba Đình' },
  { region: 'Đà Nẵng', city: 'Hải Châu' },
  { region: 'Cần Thơ', city: 'Ninh Kiều' },
  { region: 'Hải Phòng', city: 'Hồng Bàng' },
  { region: 'Bình Dương', city: 'Thủ Dầu Một' },
  { region: 'Đồng Nai', city: 'Biên Hòa' },
  { region: 'Khánh Hòa', city: 'Nha Trang' },
  { region: 'Quảng Ninh', city: 'Hạ Long' },
  { region: 'Thừa Thiên Huế', city: 'Huế' },
  { region: 'Lâm Đồng', city: 'Đà Lạt' },
  { region: 'Kiên Giang', city: 'Phú Quốc' },
  { region: 'Quảng Nam', city: 'Hội An' },
  { region: 'Nghệ An', city: 'Vinh' },
  { region: 'Thanh Hóa', city: 'TP. Thanh Hóa' },
  { region: 'Bình Thuận', city: 'Phan Thiết' }
];

/**
 * Xác định khu vực địa lý dựa vào IP người dùng
 */
export async function getGeolocation(req: NextRequest) {
  try {
    // Lấy IP của người dùng
    const ip = req.headers.get('x-forwarded-for') || req.ip || '';
    
    // Bỏ qua IP localhost hoặc IP nội bộ
    if (ip === '127.0.0.1' || ip === 'localhost' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      // Trả về random một vị trí cho môi trường dev
      const randomIndex = Math.floor(Math.random() * VIETNAM_REGIONS.length);
      return {
        country: 'Việt Nam',
        ...VIETNAM_REGIONS[randomIndex],
        ip: ip
      };
    }

    // Gọi API ipinfo.io để lấy thông tin vị trí
    // Lưu ý: Bạn cần đăng ký API key từ ipinfo.io trong môi trường production
    const response = await fetch(`https://ipinfo.io/${ip}/json`);
    
    if (!response.ok) {
      throw new Error(`Error fetching geolocation: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Phân tích thông tin vị trí
    const country = data.country === 'VN' ? 'Việt Nam' : (data.country_name || data.country);
    
    // Xác định khu vực trong Việt Nam
    let region = data.region || '';
    let city = data.city || '';
    
    // Nếu ở Việt Nam, kiểm tra và map lại với danh sách khu vực đã định nghĩa
    if (country === 'Việt Nam' || data.country === 'VN') {
      // Tìm khu vực phù hợp nhất dựa trên tên thành phố hoặc khu vực
      const matchedRegion = VIETNAM_REGIONS.find(
        item => 
          item.region.toLowerCase().includes(region.toLowerCase()) || 
          item.city.toLowerCase().includes(city.toLowerCase()) ||
          region.toLowerCase().includes(item.region.toLowerCase()) ||
          city.toLowerCase().includes(item.city.toLowerCase())
      );
      
      if (matchedRegion) {
        region = matchedRegion.region;
        city = matchedRegion.city;
      }
    }
    
    return {
      ip,
      country,
      region,
      city
    };
  } catch (error) {
    console.error('Error determining geolocation:', error);
    
    // Trả về random một vị trí nếu có lỗi
    const randomIndex = Math.floor(Math.random() * VIETNAM_REGIONS.length);
    return {
      country: 'Việt Nam',
      ...VIETNAM_REGIONS[randomIndex],
      ip: ip || 'unknown'
    };
  }
}

/**
 * Cập nhật thống kê lượt truy cập theo khu vực
 */
export async function trackPageView(geoData: any, pageUrl: string, pageTitle: string) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // 1. Cập nhật bảng geographic_stats
    // Kiểm tra xem đã có bản ghi cho khu vực này trong ngày hay chưa
    const { data: existingStats, error: selectError } = await supabase
      .from('geographic_stats')
      .select('*')
      .eq('region', geoData.region)
      .eq('stat_date', today);
      
    if (selectError) {
      console.error('Error selecting geographic stats:', selectError);
      return;
    }
    
    if (existingStats && existingStats.length > 0) {
      // Đã có bản ghi, cập nhật số lượng
      const { error: updateError } = await supabase
        .from('geographic_stats')
        .update({
          visitor_count: existingStats[0].visitor_count + 1,
          page_views: existingStats[0].page_views + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingStats[0].id);
        
      if (updateError) {
        console.error('Error updating geographic stats:', updateError);
      }
    } else {
      // Chưa có bản ghi, tạo mới
      const { error: insertError } = await supabase
        .from('geographic_stats')
        .insert({
          region: geoData.region,
          city: geoData.city,
          country: geoData.country,
          visitor_count: 1,
          page_views: 1,
          stat_date: today
        });
        
      if (insertError) {
        console.error('Error inserting geographic stats:', insertError);
      }
    }
    
    // 2. Cập nhật bảng page_views
    // Kiểm tra xem đã có bản ghi cho trang này trong ngày hay chưa
    const { data: existingPageViews, error: pageViewsSelectError } = await supabase
      .from('page_views')
      .select('*')
      .eq('page_url', pageUrl)
      .eq('stat_date', today);
      
    if (pageViewsSelectError) {
      console.error('Error selecting page views:', pageViewsSelectError);
      return;
    }
    
    if (existingPageViews && existingPageViews.length > 0) {
      // Đã có bản ghi, cập nhật số lượng
      const { error: updateError } = await supabase
        .from('page_views')
        .update({
          view_count: existingPageViews[0].view_count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingPageViews[0].id);
        
      if (updateError) {
        console.error('Error updating page views:', updateError);
      }
    } else {
      // Chưa có bản ghi, tạo mới
      const { error: insertError } = await supabase
        .from('page_views')
        .insert({
          page_url: pageUrl,
          page_title: pageTitle,
          view_count: 1,
          unique_visitors: 1,
          stat_date: today
        });
        
      if (insertError) {
        console.error('Error inserting page views:', insertError);
      }
    }
    
    // 3. Cập nhật bảng visitor_stats cho toàn bộ website
    const { data: existingVisitorStats, error: visitorStatsSelectError } = await supabase
      .from('visitor_stats')
      .select('*')
      .eq('stat_date', today);
      
    if (visitorStatsSelectError) {
      console.error('Error selecting visitor stats:', visitorStatsSelectError);
      return;
    }
    
    if (existingVisitorStats && existingVisitorStats.length > 0) {
      // Đã có bản ghi, cập nhật số lượng
      const { error: updateError } = await supabase
        .from('visitor_stats')
        .update({
          total_visitors: existingVisitorStats[0].total_visitors + 1,
          page_views: existingVisitorStats[0].page_views + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingVisitorStats[0].id);
        
      if (updateError) {
        console.error('Error updating visitor stats:', updateError);
      }
    } else {
      // Chưa có bản ghi, tạo mới
      const { error: insertError } = await supabase
        .from('visitor_stats')
        .insert({
          stat_date: today,
          total_visitors: 1,
          unique_visitors: 1,
          page_views: 1,
          avg_session_duration: 0,
          bounce_rate: 0
        });
        
      if (insertError) {
        console.error('Error inserting visitor stats:', insertError);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error tracking page view:', error);
    return false;
  }
}

/**
 * Middleware để thu thập thông tin người dùng khi truy cập
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
    
    // Lấy thông tin địa lý của người dùng
    const geoData = await getGeolocation(req);
    
    // Lấy thông tin về trang đang truy cập
    const pageUrl = req.nextUrl.pathname;
    const pageTitle = 'Website Page'; // Có thể cải thiện để lấy title thực tế
    
    // Ghi lại lượt truy cập
    await trackPageView(geoData, pageUrl, pageTitle);
    
    return null;
  } catch (error) {
    console.error('Error in analytics middleware:', error);
    return null;
  }
} 