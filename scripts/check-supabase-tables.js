// Script để kiểm tra cấu trúc bảng và thực hiện truy vấn trên Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Khởi tạo Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  console.log('Kiểm tra kết nối Supabase...');
  
  try {
    // Kiểm tra kết nối
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Kết nối thành công!');
    console.log('User:', user ? 'Đã đăng nhập' : 'Chưa đăng nhập');
    
    // Kiểm tra cấu trúc bảng product_specifications
    console.log('\n1. Kiểm tra cấu trúc bảng product_specifications:');
    const { data: productSpecsInfo, error: productSpecsError } = await supabase
      .from('product_specifications')
      .select('*')
      .limit(1);
    
    if (productSpecsError) {
      console.error('Lỗi khi truy vấn bảng product_specifications:', productSpecsError);
    } else {
      console.log('Bảng product_specifications tồn tại.');
      if (productSpecsInfo && productSpecsInfo.length > 0) {
        console.log('Cấu trúc bảng:', Object.keys(productSpecsInfo[0]));
      } else {
        console.log('Bảng product_specifications không có dữ liệu.');
      }
    }
    
    // Kiểm tra cấu trúc bảng products
    console.log('\n2. Kiểm tra cấu trúc bảng products:');
    const { data: productsInfo, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(1);
    
    if (productsError) {
      console.error('Lỗi khi truy vấn bảng products:', productsError);
    } else {
      console.log('Bảng products tồn tại.');
      if (productsInfo && productsInfo.length > 0) {
        console.log('Cấu trúc bảng:', Object.keys(productsInfo[0]));
        console.log('Kiểu dữ liệu của id:', typeof productsInfo[0].id);
      } else {
        console.log('Bảng products không có dữ liệu.');
      }
    }
    
    // Kiểm tra cấu trúc bảng categories
    console.log('\n3. Kiểm tra cấu trúc bảng categories:');
    const { data: categoriesInfo, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(1);
    
    if (categoriesError) {
      console.error('Lỗi khi truy vấn bảng categories:', categoriesError);
    } else {
      console.log('Bảng categories tồn tại.');
      if (categoriesInfo && categoriesInfo.length > 0) {
        console.log('Cấu trúc bảng:', Object.keys(categoriesInfo[0]));
      } else {
        console.log('Bảng categories không có dữ liệu.');
      }
    }
    
    // Thử thêm một bản ghi vào bảng product_specifications
    console.log('\n4. Thử thêm một bản ghi vào bảng product_specifications:');
    
    // Lấy một product_id từ bảng products
    let productId = null;
    if (productsInfo && productsInfo.length > 0) {
      productId = productsInfo[0].id;
      console.log('Sử dụng product_id:', productId, 'Kiểu:', typeof productId);
      
      // Thử thêm một bản ghi
      const { data: insertResult, error: insertError } = await supabase
        .from('product_specifications')
        .insert({
          product_id: productId,
          name: 'test_spec',
          value: 'test_value',
          created_at: new Date().toISOString()
        })
        .select();
      
      if (insertError) {
        console.error('Lỗi khi thêm bản ghi:', insertError);
        
        // Thử chuyển đổi kiểu dữ liệu
        console.log('\nThử chuyển đổi kiểu dữ liệu của product_id:');
        const { data: insertResult2, error: insertError2 } = await supabase
          .from('product_specifications')
          .insert({
            product_id: parseInt(productId),
            name: 'test_spec',
            value: 'test_value',
            created_at: new Date().toISOString()
          })
          .select();
        
        if (insertError2) {
          console.error('Lỗi khi thêm bản ghi (sau khi chuyển đổi):', insertError2);
        } else {
          console.log('Thêm bản ghi thành công (sau khi chuyển đổi):', insertResult2);
        }
      } else {
        console.log('Thêm bản ghi thành công:', insertResult);
      }
    } else {
      console.log('Không có sản phẩm để thử nghiệm.');
    }
    
  } catch (error) {
    console.error('Lỗi:', error);
  }
}

main();
