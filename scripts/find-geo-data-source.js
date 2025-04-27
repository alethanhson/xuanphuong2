// Script để tìm nguồn gốc dữ liệu thống kê người dùng theo khu vực địa lý
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Khởi tạo Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Danh sách các thành phố cần tìm
const citiesToFind = [
  'Bình Dương',
  'Đồng Nai',
  'Cần Thơ',
  'Hồ Chí Minh',
  'Quảng Ninh',
  'Nghệ An',
  'Đà Nẵng',
  'Hà Nội'
];

// Hàm kiểm tra nội dung của bảng
async function checkTableForGeoData(tableName) {
  try {
    console.log(`Kiểm tra bảng ${tableName}...`);
    
    // Lấy tất cả dữ liệu từ bảng
    const { data, error } = await supabase
      .from(tableName)
      .select('*');
    
    if (error) {
      console.error(`Lỗi khi truy vấn bảng ${tableName}:`, error);
      return false;
    }
    
    if (!data || data.length === 0) {
      console.log(`Bảng ${tableName} không có dữ liệu`);
      return false;
    }
    
    console.log(`Bảng ${tableName} có ${data.length} bản ghi`);
    
    // Kiểm tra xem dữ liệu có chứa thông tin về các thành phố cần tìm không
    let foundCities = [];
    let jsonString = JSON.stringify(data);
    
    for (const city of citiesToFind) {
      if (jsonString.includes(city)) {
        foundCities.push(city);
      }
    }
    
    if (foundCities.length > 0) {
      console.log(`Tìm thấy các thành phố sau trong bảng ${tableName}: ${foundCities.join(', ')}`);
      console.log('Mẫu dữ liệu:');
      console.log(JSON.stringify(data.slice(0, 3), null, 2));
      return true;
    }
    
    // Duyệt qua từng cột để tìm thông tin chi tiết hơn
    if (data.length > 0) {
      const sampleRecord = data[0];
      const columns = Object.keys(sampleRecord);
      
      console.log(`Các cột trong bảng ${tableName}: ${columns.join(', ')}`);
      
      // Kiểm tra từng cột có chứa dữ liệu liên quan đến địa lý không
      const geoRelatedColumns = columns.filter(col => 
        col.toLowerCase().includes('city') || 
        col.toLowerCase().includes('region') || 
        col.toLowerCase().includes('location') || 
        col.toLowerCase().includes('country') || 
        col.toLowerCase().includes('province') || 
        col.toLowerCase().includes('area') ||
        col.toLowerCase().includes('geo')
      );
      
      if (geoRelatedColumns.length > 0) {
        console.log(`Bảng ${tableName} có các cột liên quan đến địa lý: ${geoRelatedColumns.join(', ')}`);
        
        // Hiển thị mẫu dữ liệu của các cột này
        console.log('Mẫu dữ liệu các cột địa lý:');
        data.slice(0, 5).forEach(record => {
          const geoData = {};
          geoRelatedColumns.forEach(col => {
            geoData[col] = record[col];
          });
          console.log(geoData);
        });
        
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error(`Lỗi khi kiểm tra bảng ${tableName}:`, error);
    return false;
  }
}

async function searchAllTables() {
  // Danh sách các bảng có thể chứa dữ liệu địa lý
  const potentialTables = [
    'visitor_locations',
    'user_locations',
    'geo_stats',
    'region_stats',
    'location_stats',
    'country_stats',
    'visitor_stats',
    'page_views',
    'analytics',
    'visits',
    'sessions',
    'user_stats',
    'profiles',
    'users',
    'website_stats',
    'geo_analytics',
    'geo_data',
    'geo_views',
    'visitor_metadata',
    'user_data',
    'visitors'
  ];
  
  console.log('Bắt đầu tìm kiếm dữ liệu địa lý trong các bảng...');
  
  let foundTables = 0;
  
  for (const tableName of potentialTables) {
    const found = await checkTableForGeoData(tableName);
    if (found) {
      foundTables++;
    }
  }
  
  if (foundTables === 0) {
    console.log('Không tìm thấy bảng nào chứa dữ liệu địa lý theo các thành phố đã chỉ định');
  } else {
    console.log(`Đã tìm thấy ${foundTables} bảng có thể chứa dữ liệu địa lý`);
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
    
    // Tìm kiếm trong tất cả các bảng
    await searchAllTables();
    
    console.log('Quá trình tìm kiếm hoàn tất');
  } catch (error) {
    console.error('Lỗi:', error);
  }
}

main(); 