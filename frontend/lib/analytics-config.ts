// Cấu hình cho hệ thống analytics

// Thời gian lưu cookie
export const COOKIE_CONFIG = {
  // Thời gian lưu ID phiên (phút)
  SESSION_DURATION: 30,
  
  // Thời gian lưu ID khách (ngày)
  VISITOR_DURATION: 365,
};

// Cấu hình cho việc xác định bounce
export const BOUNCE_CONFIG = {
  // Thời gian tối đa (giây) để xác định là bounce
  MAX_DURATION: 30,
  
  // Số trang tối đa để xác định là bounce
  MAX_PAGES: 1,
};

// Cấu hình cho việc retry
export const RETRY_CONFIG = {
  // Thời gian tối đa (giờ) để giữ sự kiện chờ xử lý
  MAX_AGE_HOURS: 24,
  
  // Số lần thử lại tối đa
  MAX_RETRIES: 3,
  
  // Thời gian chờ giữa các lần thử lại (ms)
  RETRY_DELAY: 5000,
};

// Danh sách các vùng miền tại Việt Nam
export const VIETNAM_REGIONS = [
  { region: 'Hồ Chí Minh', city: 'Quận 1' },
  { region: 'Hà Nội', city: 'Ba Đình' },
  { region: 'Đà Nẵng', city: 'Hải Châu' },
  { region: 'Cần Thơ', city: 'Ninh Kiều' },
  { region: 'Hải Phòng', city: 'Hồng Bàng' },
  { region: 'Bình Dương', city: 'Thủ Dầu Một' },
  { region: 'Đồng Nai', city: 'Biên Hòa' },
  { region: 'Khánh Hòa', city: 'Nha Trang' },
  { region: 'Bắc Ninh', city: 'TP. Bắc Ninh' },
  { region: 'Quảng Ninh', city: 'Hạ Long' },
  { region: 'Thừa Thiên Huế', city: 'Huế' },
  { region: 'Lâm Đồng', city: 'Đà Lạt' },
  { region: 'Kiên Giang', city: 'Phú Quốc' },
  { region: 'Bà Rịa - Vũng Tàu', city: 'Vũng Tàu' },
  { region: 'Long An', city: 'Tân An' },
  { region: 'Quảng Nam', city: 'Hội An' },
  { region: 'Nghệ An', city: 'Vinh' },
  { region: 'Thanh Hóa', city: 'TP. Thanh Hóa' },
  { region: 'Hải Dương', city: 'TP. Hải Dương' },
  { region: 'Bình Thuận', city: 'Phan Thiết' }
];

export default {
  COOKIE_CONFIG,
  BOUNCE_CONFIG,
  RETRY_CONFIG,
  VIETNAM_REGIONS
};
