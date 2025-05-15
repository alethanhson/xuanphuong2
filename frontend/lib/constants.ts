/**
 * Các giá trị mặc định cho hero slides nếu không lấy được từ database
 */
export const FALLBACK_HERO_SLIDES = [
  {
    id: '1',
    title: 'Giải Pháp CNC Toàn Diện',
    subtitle: 'Cho Ngành Gỗ & Kim Loại',
    description: 'Tân Tiến Vinh cung cấp các thiết bị CNC chất lượng cao, đáp ứng mọi nhu cầu sản xuất của doanh nghiệp.',
    image: '/hero-section/hero-1.jpg',
    buttonText: 'Xem sản phẩm',
    buttonLink: '/products',
    cta: {
      primary: {
        text: 'Xem sản phẩm',
        link: '/products'
      },
      secondary: {
        text: 'Liên hệ tư vấn',
        link: '/contact'
      }
    }
  },
  {
    id: '2',
    title: 'Dịch Vụ Chuyên Nghiệp',
    subtitle: 'Đội Ngũ Kỹ Thuật Giàu Kinh Nghiệm',
    description: 'Chúng tôi cung cấp dịch vụ lắp đặt, bảo trì và sửa chữa với đội ngũ kỹ thuật viên được đào tạo bài bản.',
    image: '/hero-section/hero-2.jpg',
    buttonText: 'Dịch vụ của chúng tôi',
    buttonLink: '/services',
    cta: {
      primary: {
        text: 'Dịch vụ của chúng tôi',
        link: '/services'
      },
      secondary: {
        text: 'Liên hệ tư vấn',
        link: '/contact'
      }
    }
  },
  {
    id: '3',
    title: 'Phụ Tùng & Linh Kiện Chính Hãng',
    subtitle: 'Đảm Bảo Hiệu Suất Tối Ưu',
    description: 'Tân Tiến Vinh cung cấp phụ tùng thay thế chính hãng cho các thiết bị CNC, đảm bảo hoạt động ổn định và bền bỉ.',
    image: '/hero-section/hero-3.jpg',
    buttonText: 'Liên hệ ngay',
    buttonLink: '/contact',
    cta: {
      primary: {
        text: 'Liên hệ ngay',
        link: '/contact'
      },
      secondary: {
        text: 'Xem sản phẩm',
        link: '/products'
      }
    }
  }
];

/**
 * Các đường dẫn cho các trang
 */
export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  SERVICES: "/services",
  ABOUT: "/about",
  CONTACT: "/contact",
  BLOG: "/blog",
  ADMIN: "/admin",
};

/**
 * Thông tin công ty
 */
export const COMPANY_INFO = {
  NAME: "Tân Tiến Vinh",
  ADDRESS: "Số 123, Đường XYZ, Quận ABC, TP. Hồ Chí Minh",
  PHONE: "+84 123 456 789",
  EMAIL: "info@tantienvinh.com",
  WORKING_HOURS: "8:00 - 17:30, Thứ Hai - Thứ Bảy",
}; 