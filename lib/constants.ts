/**
 * Các giá trị mặc định cho hero slides nếu không lấy được từ database
 */
export const FALLBACK_HERO_SLIDES = [
  {
    id: "slide1",
    title: "Giải Pháp Thiết Bị Gỗ Toàn Diện",
    subtitle: "Cho Ngành Nội Thất Hiện Đại",
    description: "Nâng cao hiệu suất sản xuất với máy móc hiện đại, chất lượng cao và dịch vụ chuyên nghiệp.",
    image: "/hero-section/placeholder.svg",
    cta: {
      primary: {
        text: "Khám phá sản phẩm",
        link: "/products",
      },
      secondary: {
        text: "Liên hệ tư vấn",
        link: "/contact",
      },
    },
  },
  {
    id: "slide2",
    title: "Máy CNC Gỗ Chất Lượng Cao",
    subtitle: "Độ Chính Xác Tuyệt Đối",
    description: "Tối ưu hóa quy trình sản xuất đồ gỗ với các dòng máy CNC hiện đại, độ chính xác cao.",
    image: "/hero-section/placeholder.svg",
    cta: {
      primary: {
        text: "Xem máy CNC gỗ",
        link: "/products?category=may-cnc-go",
      },
      secondary: {
        text: "Yêu cầu báo giá",
        link: "/contact",
      },
    },
  },
  {
    id: "slide3",
    title: "Máy Dán Cạnh Hiện Đại",
    subtitle: "Công Nghệ Tiên Tiến",
    description: "Nâng cao chất lượng sản phẩm với dòng máy dán cạnh hiện đại, dễ sử dụng và độ bền cao.",
    image: "/hero-section/placeholder.svg",
    cta: {
      primary: {
        text: "Xem máy dán cạnh",
        link: "/products?category=may-dan-canh",
      },
      secondary: {
        text: "Đặt lịch tư vấn",
        link: "/contact",
      },
    },
  },
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