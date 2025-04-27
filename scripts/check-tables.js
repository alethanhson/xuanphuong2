// Script để kiểm tra tất cả các bảng trong database
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Khởi tạo Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listAllTables() {
  try {
    // Sử dụng rpc để gọi function PostgreSQL
    const { data, error } = await supabase.rpc('list_tables');
    
    if (error) {
      console.error('Lỗi khi lấy danh sách bảng với RPC:', error);
      
      // Thử phương pháp khác - dùng simple query
      console.log('Thử phương pháp khác...');
      return await searchRelevantTables();
    }
    
    console.log('Tất cả các bảng trong database:');
    if (data && data.length) {
      data.forEach((table, index) => {
        console.log(`${index + 1}. ${table}`);
      });
    } else {
      console.log('Không tìm thấy bảng nào');
    }
  } catch (error) {
    console.error('Lỗi:', error);
  }
}

async function searchRelevantTables() {
  try {
    // Dùng dữ liệu mẫu để tìm bảng
    const tables = [
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
      'analytics_events'
    ];
    
    console.log('Tìm kiếm bảng phân tích truy cập:');
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count(*)', { count: 'exact', head: true });
        
        if (!error) {
          console.log(`Tìm thấy bảng: ${table} - Số lượng bản ghi: ${data.count || 'N/A'}`);
        }
      } catch (e) {
        // Bỏ qua lỗi
      }
    }
  } catch (error) {
    console.error('Lỗi khi tìm kiếm bảng:', error);
  }
}

async function checkAnalyticsTables() {
  console.log('Kiểm tra các bảng thống kê truy cập cụ thể:');
  
  // List các bảng thống kê phổ biến để kiểm tra
  const tableNames = [
    'page_views',
    'analytics',
    'visitors',
    'analytics_events',
    'visitor_sessions',
    'sessions',
    'visits',
    'pageviews'
  ];
  
  for (const tableName of tableNames) {
    try {
      const { count, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        console.log(`Bảng ${tableName}: Có ${count} bản ghi`);
      }
    } catch (error) {
      // Có thể bảng không tồn tại, bỏ qua
    }
  }
}

async function main() {
  try {
    // Kiểm tra kết nối
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      throw new Error(`Không thể kết nối với Supabase: ${error.message}`);
    }
    
    console.log('Đã kết nối thành công với Supabase');
    
    // Thử liệt kê tất cả các bảng
    await listAllTables();
    
    // Kiểm tra các bảng thống kê cụ thể
    await checkAnalyticsTables();
    
    console.log('Hoàn tất');
  } catch (error) {
    console.error('Lỗi:', error);
  }
}

main(); 