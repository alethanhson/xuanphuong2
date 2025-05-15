import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatabaseService } from './database/database.service';
import * as bcrypt from 'bcryptjs';
import { Role } from './database/entities/user.entity';
import { Product, ProductStatus } from './database/entities/product.entity';
import { Category } from './database/entities/category.entity';
import { DeepPartial } from 'typeorm';
import { ProductHighlight } from './database/entities/product-highlight.entity';
import { ProductSpecification } from './database/entities/product-specification.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const databaseService = app.get(DatabaseService);

  try {
    // Xóa tất cả dữ liệu sản phẩm hiện có trước
    await databaseService.productSpecification.clear();
    await databaseService.productHighlight.clear();
    await databaseService.productImage.clear();
    await databaseService.product.clear();
    console.log('Đã xóa tất cả dữ liệu sản phẩm cũ');

    // Sau đó mới xóa dữ liệu category
    await databaseService.category.clear();
    console.log('Đã xóa tất cả dữ liệu category cũ');

    // Tạo các danh mục mới
    const categories = [
      {
        name: 'Máy CNC',
        slug: 'may-cnc',
        description: 'Các loại máy CNC dùng trong chế biến gỗ',
        image: '/images/categories/may-cnc.jpg',
      },
      {
        name: 'Máy dán cạnh',
        slug: 'may-dan-canh',
        description: 'Các loại máy dán cạnh tự động và bán tự động',
        image: '/images/categories/may-dan-canh.jpg',
      },
      {
        name: 'Máy chà nhám',
        slug: 'may-cha-nham',
        description: 'Các loại máy chà nhám dùng trong sản xuất đồ gỗ',
        image: '/images/categories/may-cha-nham.jpg',
      },
      {
        name: 'Máy cưa',
        slug: 'may-cua',
        description: 'Các loại máy cưa panel saw, cưa bàn trượt, cưa ripsaw',
        image: '/images/categories/may-cua.jpg',
      },
      {
        name: 'Máy phay',
        slug: 'may-phay',
        description: 'Các loại máy phay CNC, phay khoan, phay router',
        image: '/images/categories/may-phay.jpg',
      },
      {
        name: 'Máy gia công trung tâm CNC',
        slug: 'may-gia-cong-trung-tam-cnc',
        description: 'Các loại máy gia công trung tâm CNC dùng trong chế biến gỗ',
        image: '/images/categories/may-gia-cong-trung-tam-cnc.jpg',
      },
      {
        name: 'Máy CNC Nesting',
        slug: 'may-cnc-nesting',
        description: 'Các loại máy CNC Nesting tự động gia công ván',
        image: '/images/categories/may-cnc-nesting.jpg',
      },
      {
        name: 'Máy CNC 2.5D',
        slug: 'may-cnc-trung-tam-25d',
        description: 'Các loại máy CNC 2.5D',
        image: '/images/categories/may-cnc-25d.jpg',
      },
      {
        name: 'Máy CNC 3D 5 trục',
        slug: 'may-cnc-trung-tam-3d',
        description: 'Các loại máy phay CNC 3D 5 trục',
        image: '/images/categories/may-cnc-3d.jpg',
      },
    ];

    const savedCategories: Category[] = [];
    for (const category of categories) {
      const savedCategory = await databaseService.category.save(category);
      savedCategories.push(savedCategory);
    }
    console.log('Đã tạo các danh mục sản phẩm mới');

    // Tìm các category đã lưu
    const mayGiaCongTrungTamCategory = savedCategories.find(
      (cat) => cat.slug === 'may-gia-cong-trung-tam-cnc',
    );
    const mayCNC25DCategory = savedCategories.find(
      (cat) => cat.slug === 'may-cnc-trung-tam-25d',
    );
    const mayCNCNestingCategory = savedCategories.find(
      (cat) => cat.slug === 'may-cnc-nesting',
    );

    // Tạo sản phẩm mẫu
    const products: DeepPartial<Product>[] = [
      {
        title: 'MÁY PHAY KHOAN CNC TRUNG TÂM 3 ĐẦU 2 BÀN',
        slug: 'may-phay-khoan-cnc-trung-tam-3-dau-2-ban',
        description: 'Máy phay khoan CNC trung tâm 3 đầu 2 bàn (Router thay dao - Khoan 9 mũi - Cưa cắt xoay) với khả năng gia công đa năng, hiệu suất cao.',
        price: 350000000,
        oldPrice: 380000000,
        isOnSale: true,
        isFeatured: true,
        stockQuantity: 5,
        status: ProductStatus.PUBLISHED,
        brand: 'Holztek',
        model: 'HT-1325RBS-T2',
        origin: 'Trung Quốc',
        warranty: '12 Tháng',
        workingSize: '1250*2500mm x2 bàn',
        motorPower: '9 Kw',
        toolChangerCapacity: 12,
        spindleSpeed: '0-24,000 v/ph',
        drillingUnit: '9 mũi, Motor 2.2kw',
        sawUnit: 'Cụm cưa kép cắt đa hướng, Motor lưỡi cắt chính 6kw, Motor lưỡi cắt phụ 1.5kw',
        vacuumPump: '11kw x 1 (bơm giải nhiệt nước)',
        controlSystem: 'LNC Đài Loan',
        dustCollection: '150mm x1, 100mm x2',
        airPressure: '0.6 Mpa',
        categoryId: mayGiaCongTrungTamCategory?.id,
        productType: 'Máy CNC trung tâm 2.5D',
      },
      {
        title: 'MÁY CNC TRUNG TÂM 2.5D FULL OPTION',
        slug: 'may-cnc-trung-tam-25d-full-option',
        description: 'MÁY CNC TRUNG TÂM 2.5D FULL OPTION (Phay Router - khoan 5 mặt + cưa xoay đa hướng) WM-1325RBS là loại máy đa năng với đầy đủ các chức năng phay router, khoan 5 mặt và cưa xoay đa hướng.',
        price: 320000000,
        oldPrice: 350000000,
        isOnSale: true,
        isFeatured: true,
        stockQuantity: 3,
        status: ProductStatus.PUBLISHED,
        brand: 'Woodmaster',
        model: 'WM-1325RBS',
        origin: 'Trung Quốc',
        warranty: '12 Tháng',
        workingSize: '1300*2500mm',
        motorPower: '7.5 Kw',
        toolChangerCapacity: 8,
        spindleSpeed: '0-18,000 v/ph',
        drillingUnit: 'Khoan 5 mặt, Motor 2.2kw',
        sawUnit: 'Cụm cưa xoay đa hướng, Motor 4kw',
        vacuumPump: '7.5kw x 1',
        controlSystem: 'Syntec Đài Loan',
        dustCollection: '120mm x1, 100mm x1',
        airPressure: '0.6 Mpa',
        categoryId: mayCNC25DCategory?.id,
        productType: 'Máy CNC trung tâm 2.5D',
      },
      {
        title: 'MÁY CNC NESTING 4 ĐẦU FULL LINE',
        slug: 'may-cnc-nesting-4-dau-full-line',
        description: 'MÁY CNC NESTING 4 ĐẦU FULL LINE TẢI NẶNG CAO CẤP PRO-R4F là giải pháp toàn diện cho sản xuất nội thất công nghiệp với khả năng gia công ván hiệu quả cao.',
        price: 420000000,
        oldPrice: 450000000,
        isOnSale: true,
        isFeatured: true,
        stockQuantity: 2,
        status: ProductStatus.PUBLISHED,
        brand: 'Holztek',
        model: 'PRO-R4F',
        origin: 'Trung Quốc',
        warranty: '12 Tháng',
        workingSize: '1300*2500mm (Full line)',
        motorPower: '4 x 4.5 Kw',
        toolChangerCapacity: 16,
        spindleSpeed: '0-18,000 v/ph',
        drillingUnit: 'Hệ thống khoan tự động',
        controlSystem: 'SYNTEC - TAIWAN',
        vacuumPump: '11kw x 1 (giải nhiệt nước)',
        dustCollection: '150mm x4',
        airPressure: '0.6 Mpa',
        categoryId: mayCNCNestingCategory?.id,
        productType: 'Máy CNC Nesting',
      },
    ];

    // Dữ liệu highlights cho từng sản phẩm
    const productHighlights = {
      'may-phay-khoan-cnc-trung-tam-3-dau-2-ban': [
        { title: 'Công suất đầu Router', description: 'Công suất mạnh mẽ 9Kw, đáp ứng mọi nhu cầu gia công', order: 1 },
        { title: 'Thay dao tự động', description: 'Hệ thống thay dao tự động 12 mẫu, tiết kiệm thời gian vận hành', order: 2 },
        { title: 'Cụm đầu khoan đứng', description: 'Đầu khoan đứng 9 mũi, tăng hiệu quả gia công', order: 3 },
        { title: 'Cụm lưỡi cắt xoay đa hướng', description: 'Linh hoạt trong nhiều góc cắt khác nhau', order: 4 },
        { title: 'Hệ thống điều khiển trung tâm', description: 'Sử dụng công nghệ LNC Đài Loan - độ tin cậy cao', order: 5 },
        { title: 'Hệ thống driver tải nặng', description: 'Công suất 1.5kw, đảm bảo vận hành ổn định', order: 6 },
        { title: 'Hệ thống vít xoắn', description: 'Sử dụng linh kiện TBI Đài Loan, độ bền cao', order: 7 },
        { title: 'Hệ thống ray trượt', description: 'Ray trượt HIWIN Đài Loan, vận hành êm, chính xác', order: 8 },
        { title: 'Cụm motor chuyên dụng', description: 'Thiết kế pad cụm motor bằng nhôm nguyên khối 6061, tản nhiệt tốt', order: 9 },
        { title: 'Linh kiện điện chất lượng cao', description: 'Sử dụng linh kiện Schneider, Zhongchen với độ bền cao', order: 10 },
        { title: 'Bơm chân không', description: 'Bơm hút chân không giải nhiệt bằng nước 7.5kw, đảm bảo hiệu quả hút phôi', order: 11 },
        { title: 'Hệ thống bơm nhớt tự động', description: 'Bôi trơn tự động, tăng tuổi thọ máy', order: 12 },
        { title: 'Con lăn tỳ phôi tự động', description: 'Hỗ trợ di chuyển phôi, tăng hiệu quả làm việc', order: 13 },
      ],
      'may-cnc-trung-tam-25d-full-option': [
        { title: 'Máy CNC 2.5D đa chức năng', description: 'Đầy đủ tính năng cho gia công gỗ hiện đại', order: 1 },
        { title: 'Đầu phay Router', description: 'Công suất mạnh mẽ, gia công chính xác', order: 2 },
        { title: 'Cụm khoan 5 mặt', description: 'Tiện lợi cho gia công nhiều góc độ khác nhau', order: 3 },
        { title: 'Cụm cưa xoay đa hướng', description: 'Linh hoạt trong các góc cắt, tăng khả năng gia công', order: 4 },
        { title: 'Hệ thống điều khiển tân tiến', description: 'Công nghệ Syntec Đài Loan, dễ dàng sử dụng', order: 5 },
        { title: 'Giao diện thân thiện', description: 'Người dùng dễ dàng tiếp cận và vận hành hiệu quả', order: 6 },
      ],
      'may-cnc-nesting-4-dau-full-line': [
        { title: 'Hệ thống 4 đầu phay', description: 'Công suất lớn, tối ưu thời gian gia công', order: 1 },
        { title: 'Thay dao thông minh', description: 'Hệ thống tự động thay đổi dao phù hợp với từng lệnh gia công', order: 2 },
        { title: 'Bộ điều khiển tiên tiến', description: 'Sử dụng SYNTEC - TAIWAN, độ tin cậy cao', order: 3 },
        { title: 'Hệ thống full line', description: 'Tự động hóa hoàn toàn quá trình gia công', order: 4 },
        { title: 'Khả năng tải trọng cao', description: 'Xử lý các khối lượng lớn với độ ổn định cao', order: 5 },
        { title: 'Giải pháp sản xuất công nghiệp', description: 'Thiết kế chuyên nghiệp cho nhà máy sản xuất nội thất', order: 6 },
        { title: 'Tối ưu nguyên liệu', description: 'Tiết kiệm vật liệu, giảm phế phẩm trong quá trình cắt ván', order: 7 },
      ],
    };

    // Dữ liệu specifications cho từng sản phẩm
    const productSpecifications = {
      'may-phay-khoan-cnc-trung-tam-3-dau-2-ban': [
        { name: 'Kích thước làm việc', value: '1250*2500mm x2 bàn', group: 'Kích thước', order: 1 },
        { name: 'Hành trình Z', value: '200mm', group: 'Kích thước', order: 2 },
        { name: 'Tốc độ dịch chuyển trục', value: '60m/ph', group: 'Hiệu suất', order: 3 },
        { name: 'Tốc độ cắt tối đa', value: '25m/ phút', group: 'Hiệu suất', order: 4 },
        { name: 'Motor trục router', value: '9 Kw', group: 'Động cơ', order: 5 },
        { name: 'Thay dao tự động', value: '12 mẫu', group: 'Tính năng', order: 6 },
        { name: 'Tốc độ trục chính', value: '0-24,000 v/ph', group: 'Hiệu suất', order: 7 },
        { name: 'Cụm khoan đứng', value: '9 mũi, Motor 2.2kw', group: 'Tính năng', order: 8 },
        { name: 'Cụm cưa kép cắt đa hướng', value: '', group: 'Tính năng', order: 9 },
        { name: 'Motor lưỡi cắt chính', value: '6kw', group: 'Động cơ', order: 10 },
        { name: 'Motor lưỡi cắt phụ', value: '1.5kw', group: 'Động cơ', order: 11 },
        { name: 'Có khả năng cắt xoay', value: '0-90 độ', group: 'Tính năng', order: 12 },
        { name: 'Dường kính lưỡi cắt chính', value: '305mm', group: 'Kích thước', order: 13 },
        { name: 'Motor hút chân không', value: '11kw x 1 (bơm giải nhiệt nước)', group: 'Động cơ', order: 14 },
        { name: 'Họng hút bụi cho máy', value: '150mm x1, 100mm x2', group: 'Kích thước', order: 15 },
        { name: 'Áp lực khí yêu cầu', value: '0.6 Mpa', group: 'Yêu cầu', order: 16 },
      ],
      'may-cnc-trung-tam-25d-full-option': [
        { name: 'Kích thước làm việc', value: '1300*2500mm', group: 'Kích thước', order: 1 },
        { name: 'Hành trình Z', value: '200mm', group: 'Kích thước', order: 2 },
        { name: 'Tốc độ dịch chuyển trục', value: '50m/ph', group: 'Hiệu suất', order: 3 },
        { name: 'Tốc độ cắt tối đa', value: '20m/ phút', group: 'Hiệu suất', order: 4 },
        { name: 'Motor trục router', value: '7.5 Kw', group: 'Động cơ', order: 5 },
        { name: 'Thay dao tự động', value: '8 mẫu', group: 'Tính năng', order: 6 },
        { name: 'Tốc độ trục chính', value: '0-18,000 v/ph', group: 'Hiệu suất', order: 7 },
        { name: 'Cụm khoan 5 mặt', value: 'Motor 2.2kw', group: 'Tính năng', order: 8 },
        { name: 'Cụm cưa xoay đa hướng', value: '', group: 'Tính năng', order: 9 },
        { name: 'Motor lưỡi cưa', value: '4kw', group: 'Động cơ', order: 10 },
        { name: 'Có khả năng cắt xoay', value: '0-90 độ', group: 'Tính năng', order: 11 },
        { name: 'Dường kính lưỡi cắt', value: '250mm', group: 'Kích thước', order: 12 },
        { name: 'Motor hút chân không', value: '7.5kw x 1', group: 'Động cơ', order: 13 },
        { name: 'Họng hút bụi cho máy', value: '120mm x1, 100mm x1', group: 'Kích thước', order: 14 },
        { name: 'Áp lực khí yêu cầu', value: '0.6 Mpa', group: 'Yêu cầu', order: 15 },
      ],
      'may-cnc-nesting-4-dau-full-line': [
        { name: 'Kích thước làm việc', value: '1300*2500mm (Full line)', group: 'Kích thước', order: 1 },
        { name: 'Hành trình Z', value: '200mm', group: 'Kích thước', order: 2 },
        { name: 'Tốc độ dịch chuyển trục', value: '60m/ph', group: 'Hiệu suất', order: 3 },
        { name: 'Tốc độ cắt tối đa', value: '25m/ phút', group: 'Hiệu suất', order: 4 },
        { name: 'Số lượng đầu phay', value: '4', group: 'Tính năng', order: 5 },
        { name: 'Công suất mỗi đầu phay', value: '4.5 Kw', group: 'Động cơ', order: 6 },
        { name: 'Thay dao tự động', value: '16 vị trí', group: 'Tính năng', order: 7 },
        { name: 'Tốc độ trục chính', value: '0-18,000 v/ph', group: 'Hiệu suất', order: 8 },
        { name: 'Hệ thống full line tự động', value: 'Có', group: 'Tính năng', order: 9 },
        { name: 'Bơm chân không', value: '11kw x 1 (giải nhiệt nước)', group: 'Động cơ', order: 10 },
        { name: 'Hệ thống điều khiển', value: 'SYNTEC - TAIWAN', group: 'Điều khiển', order: 11 },
        { name: 'Họng hút bụi', value: '150mm x4', group: 'Kích thước', order: 12 },
        { name: 'Áp lực khí yêu cầu', value: '0.6 Mpa', group: 'Yêu cầu', order: 13 },
      ],
    };

    // Lưu sản phẩm
    for (const productData of products) {
      const product = await databaseService.product.save(
        productData as DeepPartial<Product>,
      );
      console.log(`Đã tạo sản phẩm: ${product.title}`);

      // Tạo ảnh cho sản phẩm
      const productImages = [
        {
          url: `/images/products/${product.slug}-1.jpg`,
          alt: product.title,
          isPrimary: true,
          productId: product.id,
        },
        {
          url: `/images/products/${product.slug}-2.jpg`,
          alt: product.title,
          isPrimary: false,
          productId: product.id,
        },
      ];

      for (const imageData of productImages) {
        await databaseService.productImage.save(imageData);
      }
      console.log(`Đã tạo ảnh cho sản phẩm: ${product.title}`);

      // Tạo highlights cho sản phẩm
      const highlights = productHighlights[product.slug] || [];
      for (const highlight of highlights) {
        await databaseService.productHighlight.save({
          productId: product.id,
          title: highlight.title,
          description: highlight.description,
          order: highlight.order,
        });
      }
      console.log(`Đã tạo ${highlights.length} highlights cho sản phẩm: ${product.title}`);

      // Tạo specifications cho sản phẩm
      const specifications = productSpecifications[product.slug] || [];
      for (const spec of specifications) {
        await databaseService.productSpecification.save({
          productId: product.id,
          name: spec.name,
          value: spec.value,
          order: spec.order,
          group: spec.group,
        });
      }
      console.log(`Đã tạo ${specifications.length} specifications cho sản phẩm: ${product.title}`);
    }

    // Kiểm tra và tạo user admin nếu chưa có
    const adminExists = await databaseService.user.findOne({
      where: { role: Role.ADMIN },
    });
    if (!adminExists) {
      // Tạo mật khẩu mã hóa
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      // Tạo user admin
      const admin = databaseService.user.create({
        email: 'xuanphuong@gmail.com',
        password: hashedPassword,
        name: 'Admin Xuân Phương',
        role: Role.ADMIN,
      });

      await databaseService.user.save(admin);
      console.log('Đã tạo user admin:', admin);
    } else {
      console.log('User admin đã tồn tại');
    }

    await app.close();
    console.log('Seed dữ liệu hoàn tất');
  } catch (error) {
    console.error('Lỗi khi seed dữ liệu:', error);
    await app.close();
    process.exit(1);
  }
}

bootstrap(); 