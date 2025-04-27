// Script để xoá tất cả dữ liệu thống kê truy cập website
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Khởi tạo Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function clearAnalyticsTables() {
  const analyticsTables = [
    'page_views',
    'analytics',
    'visitors',
    'visitor_stats',
    'traffic',
    'traffic_stats',
    'user_stats',
    'user_activity',
    'visit_logs',
    'view_stats',
    'pageviews',
    'sessions',
    'visitor_sessions',
    'analytics_events',
    'visits'
  ];
  
  console.log('Đang xóa dữ liệu từ các bảng thống kê truy cập...');
  
  for (const tableName of analyticsTables) {
    try {
      // Trước tiên, kiểm tra xem bảng có tồn tại không
      const { count, error: countError } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      // Nếu không có lỗi, tức là bảng tồn tại
      if (!countError) {
        console.log(`Bảng ${tableName}: Có ${count || 0} bản ghi, đang xóa...`);
        
        // Xóa toàn bộ dữ liệu từ bảng
        const { error: deleteError } = await supabase
          .from(tableName)
          .delete()
          .not('id', 'is', null);  // Điều kiện xóa tất cả các bản ghi có id
        
        if (deleteError) {
          console.error(`Lỗi khi xóa dữ liệu từ bảng ${tableName}:`, deleteError);
        } else {
          console.log(`Đã xóa thành công dữ liệu từ bảng ${tableName}`);
          
          // Kiểm tra lại số lượng bản ghi
          const { count: newCount } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });
          
          console.log(`Bảng ${tableName} sau khi xóa: Còn ${newCount || 0} bản ghi`);
        }
      }
    } catch (error) {
      // Bỏ qua nếu bảng không tồn tại
    }
  }
  
  console.log('Đã hoàn tất việc xóa dữ liệu thống kê truy cập');
}

async function main() {
  try {
    // Kiểm tra kết nối
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      throw new Error(`Không thể kết nối với Supabase: ${error.message}`);
    }
    
    console.log('Đã kết nối thành công với Supabase');
    
    // Xóa dữ liệu thống kê
    await clearAnalyticsTables();
    
    console.log('Quá trình hoàn tất');
  } catch (error) {
    console.error('Lỗi:', error);
  }
}

main(); 