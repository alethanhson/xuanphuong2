// Script để xoá dữ liệu thống kê truy cập theo khu vực địa lý
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Khởi tạo Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Hàm kiểm tra và hiển thị nội dung của bảng
async function checkTableContent(tableName) {
  try {
    // Kiểm tra xem bảng có tồn tại không
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(5);
    
    if (!error && data) {
      console.log(`Bảng ${tableName} tồn tại với ${data.length} mẫu dữ liệu:`);
      console.log(JSON.stringify(data, null, 2));
      return true;
    }
  } catch (error) {
    // Bỏ qua nếu bảng không tồn tại
  }
  return false;
}

// Hàm tìm kiếm các bảng có chứa từ khóa
async function searchTablesWithKeyword(keyword) {
  console.log(`Tìm kiếm bảng chứa từ khóa: ${keyword}`);
  
  const commonTables = [
    'page_views',
    'visitor_stats',
    'geo_stats',
    'analytics',
    'analytics_geo',
    'country_stats',
    'region_stats',
    'location_stats',
    'geo_analytics',
    'geo_data',
    'geo_views',
    'visitor_locations',
    'user_locations',
    'visit_geo',
    'website_stats'
  ];
  
  // Các kết quả khớp
  const matches = [];
  
  for (const tableName of commonTables) {
    const exists = await checkTableContent(tableName);
    if (exists) {
      matches.push(tableName);
    }
  }
  
  return matches;
}

// Hàm xóa dữ liệu từ bảng
async function clearTable(tableName) {
  console.log(`Xoá dữ liệu từ bảng ${tableName}...`);
  
  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .not('id', 'is', null); // Xoá tất cả các bản ghi có id
    
    if (error) {
      console.error(`Lỗi khi xoá dữ liệu từ bảng ${tableName}:`, error);
    } else {
      console.log(`Đã xoá thành công dữ liệu từ bảng ${tableName}`);
      
      // Kiểm tra lại
      const { count, error: countError } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      if (!countError) {
        console.log(`Bảng ${tableName} sau khi xóa: Còn ${count || 0} bản ghi`);
      }
    }
  } catch (error) {
    console.error(`Lỗi khi xoá bảng ${tableName}:`, error);
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
    
    // Kiểm tra các bảng phổ biến
    console.log('Tìm kiếm các bảng thống kê theo khu vực địa lý...');
    const geoTables = await searchTablesWithKeyword('geo');
    
    if (geoTables.length === 0) {
      console.log('Không tìm thấy bảng thống kê theo khu vực nào.');
    } else {
      console.log(`Đã tìm thấy ${geoTables.length} bảng: ${geoTables.join(', ')}`);
      
      // Xóa dữ liệu từ các bảng tìm thấy
      for (const tableName of geoTables) {
        await clearTable(tableName);
      }
    }
    
    // Thử kiểm tra và xóa một số bảng cụ thể
    console.log('Kiểm tra và xóa các bảng cụ thể...');
    const specificTables = [
      'visitor_stats',
      'page_views',
      'website_stats'
    ];
    
    for (const tableName of specificTables) {
      const exists = await checkTableContent(tableName);
      if (exists) {
        await clearTable(tableName);
      }
    }
    
    console.log('Quá trình hoàn tất');
  } catch (error) {
    console.error('Lỗi:', error);
  }
}

main(); 