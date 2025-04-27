// Script để tạo bảng geographic_stats và thêm dữ liệu thống kê theo khu vực vào database
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Khởi tạo Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Hàm tạo bảng geographic_stats bằng cách sử dụng SQL trực tiếp
async function createGeographicStatsTable() {
  try {
    // SQL để tạo bảng geographic_stats
    const { error } = await supabase.rpc('exec_sql', {
      sql_string: `
        CREATE TABLE IF NOT EXISTS public.geographic_stats (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          region VARCHAR(255) NOT NULL,
          city VARCHAR(255),
          visitor_count INT NOT NULL DEFAULT 0,
          page_views INT NOT NULL DEFAULT 0,
          stat_date DATE NOT NULL DEFAULT CURRENT_DATE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Tạo index cho các trường thường xuyên truy vấn
        CREATE INDEX IF NOT EXISTS geographic_stats_region_idx ON public.geographic_stats (region);
        CREATE INDEX IF NOT EXISTS geographic_stats_stat_date_idx ON public.geographic_stats (stat_date);
      `
    });

    if (error) {
      throw error;
    }

    console.log('Đã tạo bảng geographic_stats thành công');
    return true;
  } catch (error) {
    console.error('Lỗi khi tạo bảng geographic_stats:', error);
    
    // Thử cách 2 nếu rpc không hoạt động
    console.log('Thử tạo bảng bằng API Supabase...');
    try {
      // Kiểm tra xem bảng đã tồn tại chưa
      const { data: existingTable, error: checkError } = await supabase
        .from('geographic_stats')
        .select('id')
        .limit(1);
        
      if (checkError && checkError.code === '42P01') {
        // Bảng chưa tồn tại, tiếp tục tạo mới
        console.log('Bảng geographic_stats chưa tồn tại, đang tạo mới...');
      } else if (!checkError) {
        console.log('Bảng geographic_stats đã tồn tại, xóa dữ liệu cũ...');
        const { error: clearError } = await supabase
          .from('geographic_stats')
          .delete()
          .not('id', 'is', null);
          
        if (clearError) {
          console.error('Lỗi khi xóa dữ liệu cũ:', clearError);
        } else {
          console.log('Đã xóa dữ liệu cũ thành công');
        }
        return true;
      }
    } catch (err) {
      console.error('Lỗi khi kiểm tra bảng:', err);
    }
    
    return false;
  }
}

// Dữ liệu thống kê theo khu vực
const geoStatsSampleData = [
  { region: "Hồ Chí Minh", city: "Quận 1", visitor_count: 2, page_views: 8 },
  { region: "Hà Nội", city: "Ba Đình", visitor_count: 1, page_views: 5 },
  { region: "Đà Nẵng", city: "Hải Châu", visitor_count: 1, page_views: 3 },
  { region: "Cần Thơ", city: "Ninh Kiều", visitor_count: 2, page_views: 6 },
  { region: "Hải Phòng", city: "Hồng Bàng", visitor_count: 1, page_views: 2 },
  { region: "Bình Dương", city: "Thủ Dầu Một", visitor_count: 2, page_views: 4 },
  { region: "Đồng Nai", city: "Biên Hòa", visitor_count: 2, page_views: 7 },
  { region: "Khánh Hòa", city: "Nha Trang", visitor_count: 1, page_views: 3 },
  { region: "Bắc Ninh", city: "TP. Bắc Ninh", visitor_count: 0, page_views: 0 },
  { region: "Quảng Ninh", city: "Hạ Long", visitor_count: 2, page_views: 5 },
  { region: "Thừa Thiên Huế", city: "Huế", visitor_count: 1, page_views: 2 },
  { region: "Lâm Đồng", city: "Đà Lạt", visitor_count: 1, page_views: 3 },
  { region: "Kiên Giang", city: "Phú Quốc", visitor_count: 1, page_views: 4 },
  { region: "Bà Rịa - Vũng Tàu", city: "Vũng Tàu", visitor_count: 0, page_views: 0 },
  { region: "Long An", city: "Tân An", visitor_count: 0, page_views: 0 },
  { region: "Quảng Nam", city: "Hội An", visitor_count: 1, page_views: 2 },
  { region: "Nghệ An", city: "Vinh", visitor_count: 1, page_views: 3 },
  { region: "Thanh Hóa", city: "TP. Thanh Hóa", visitor_count: 1, page_views: 2 },
  { region: "Hải Dương", city: "TP. Hải Dương", visitor_count: 0, page_views: 0 },
  { region: "Bình Thuận", city: "Phan Thiết", visitor_count: 1, page_views: 3 }
];

// Hàm thêm dữ liệu mẫu vào bảng
async function seedGeographicStatsData() {
  try {
    const today = new Date().toISOString().split('T')[0]; // Lấy ngày hiện tại dưới dạng YYYY-MM-DD
    
    // Thêm trường stat_date vào mỗi bản ghi
    const dataWithDate = geoStatsSampleData.map(item => ({
      ...item,
      stat_date: today
    }));
    
    // Thêm dữ liệu vào bảng
    const { data, error } = await supabase
      .from('geographic_stats')
      .insert(dataWithDate)
      .select();
    
    if (error) {
      throw error;
    }
    
    console.log(`Đã thêm ${data.length} bản ghi vào bảng geographic_stats`);
    return true;
  } catch (error) {
    console.error('Lỗi khi thêm dữ liệu vào bảng geographic_stats:', error);
    return false;
  }
}

// Hàm kiểm tra dữ liệu đã được thêm
async function checkGeographicStatsData() {
  try {
    // Lấy tất cả dữ liệu từ bảng
    const { data, error } = await supabase
      .from('geographic_stats')
      .select('*')
      .order('visitor_count', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    console.log(`Bảng geographic_stats có ${data.length} bản ghi:`);
    console.log(JSON.stringify(data.slice(0, 5), null, 2));
    
    return true;
  } catch (error) {
    console.error('Lỗi khi kiểm tra dữ liệu trong bảng geographic_stats:', error);
    return false;
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
    
    // Tạo bảng geographic_stats
    const tableCreated = await createGeographicStatsTable();
    
    if (tableCreated) {
      // Thêm dữ liệu mẫu
      await seedGeographicStatsData();
      
      // Kiểm tra dữ liệu
      await checkGeographicStatsData();
    }
    
    console.log('Quá trình chuyển đổi hoàn tất');
  } catch (error) {
    console.error('Lỗi:', error);
  }
}

main(); 