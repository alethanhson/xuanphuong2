// Script để xoá dữ liệu và tạo seed với categories máy CNC
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Khởi tạo Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listTables() {
  console.log('Lấy danh sách các bảng...');
  
  try {
    const { data, error } = await supabase.rpc('get_tables');
    if (error) {
      console.error('Lỗi khi lấy danh sách bảng:', error);
      return [];
    }
    
    console.log('Danh sách bảng:', data);
    return data || [];
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bảng:', error);
    return [];
  }
}

async function getTableColumns(tableName) {
  console.log(`Lấy thông tin cột của bảng ${tableName}...`);
  
  try {
    // Lấy một bản ghi để xem cấu trúc
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      console.error(`Lỗi khi lấy thông tin cột của bảng ${tableName}:`, error);
      return null;
    }
    
    if (data && data.length > 0) {
      const columns = Object.keys(data[0]);
      console.log(`Cột của bảng ${tableName}:`, columns);
      return columns;
    } else {
      console.log(`Bảng ${tableName} không có dữ liệu để xem cột`);
      return null;
    }
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin cột của bảng ${tableName}:`, error);
    return null;
  }
}

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
      console.log(`Đã xoá dữ liệu từ bảng ${tableName} thành công`);
    }
  } catch (error) {
    console.error(`Lỗi khi xoá dữ liệu từ bảng ${tableName}:`, error);
  }
}

async function clearDatabase() {
  console.log('Đang xoá dữ liệu...');
  
  try {
    // Xoá dữ liệu từ bảng products trước vì có FK đến categories
    await clearTable('products');
    
    // Xoá dữ liệu tracking website
    console.log('Xoá dữ liệu tracking website...');
    const trackingTables = [
      'page_views',
      'analytics_events',
      'visitor_sessions',
      'site_visitors',
      'user_activities',
      'website_analytics',
      'tracking_events'
    ];
    
    for (const table of trackingTables) {
      await clearTable(table);
    }
    
    // Xoá dữ liệu từ các bảng khác
    const tablesToClear = [
      'product_specifications',
      'product_features',
      'product_images',
      'blog_posts',
      'categories',
      'product_categories'
    ];
    
    // Xoá từng bảng và bắt lỗi riêng để không làm gián đoạn quá trình
    for (const table of tablesToClear) {
      await clearTable(table);
    }
    
    console.log('Xoá dữ liệu hoàn tất');
  } catch (error) {
    console.error('Lỗi khi xoá dữ liệu:', error);
  }
}

async function createCategory(categoryData) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert(categoryData)
      .select();
    
    if (error) {
      console.error('Lỗi khi tạo category:', error);
      return null;
    }
    
    console.log(`Đã tạo category "${categoryData.name}" thành công:`, data);
    return data;
  } catch (error) {
    console.error('Lỗi khi tạo category:', error);
    return null;
  }
}

async function seedCategories() {
  console.log('Đang tạo seed cho categories máy CNC...');
  
  try {
    const currentDate = new Date().toISOString();
    
    // Danh sách các category cần tạo
    const categories = [
      {
        name: 'Máy CNC Gỗ',
        slug: 'may-cnc-go',
        description: 'Máy CNC chuyên dụng cho gia công gỗ',
        type: 'product',
        created_at: currentDate
      },
      {
        name: 'Máy Gia Công Nội Thất',
        slug: 'may-gia-cong-noi-that',
        description: 'Máy chuyên dụng cho gia công nội thất',
        type: 'product',
        created_at: currentDate
      },
      {
        name: 'Máy Dán Cạnh',
        slug: 'may-dan-canh',
        description: 'Máy dán cạnh tự động và bán tự động',
        type: 'product',
        created_at: currentDate
      },
      {
        name: 'Máy Khoan Ngang',
        slug: 'may-khoan-ngang',
        description: 'Máy khoan ngang cho sản xuất đồ gỗ',
        type: 'product',
        created_at: currentDate
      },
      {
        name: 'Máy Cưa Bàn Trượt',
        slug: 'may-cua-ban-truot',
        description: 'Máy cưa bàn trượt hiện đại và chính xác',
        type: 'product',
        created_at: currentDate
      }
    ];
    
    // Tạo từng category một
    for (const category of categories) {
      await createCategory(category);
    }
    
    console.log('Tạo seed hoàn tất');
  } catch (error) {
    console.error('Lỗi khi tạo seed:', error);
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
    
    // Xoá dữ liệu cũ
    await clearDatabase();
    
    // Tạo seed mới
    await seedCategories();
    
    console.log('Quá trình hoàn tất');
  } catch (error) {
    console.error('Lỗi:', error);
  }
}

main(); 