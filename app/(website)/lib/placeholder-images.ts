// Hàm tạo placeholder image URL với nội dung tùy chỉnh
export function getPlaceholderImage(
  width: number,
  height: number,
  text: string,
  bgColor = "1e40af",
  textColor = "ffffff",
): string {
  // Mã hóa text để sử dụng trong URL
  const encodedText = encodeURIComponent(text)

  // Tạo URL cho placeholder.com với text tùy chỉnh
  return `https://via.placeholder.com/${width}x${height}/${bgColor}/${textColor}?text=${encodedText}`
}

// Các placeholder image cho trang chủ
export const homeImages = {
  hero: getPlaceholderImage(1920, 800, "CNC Future - Giải Pháp CNC Toàn Diện", "1e40af", "ffffff"),
  about: getPlaceholderImage(800, 600, "Về CNC Future", "0f172a", "ffffff"),
  service1: getPlaceholderImage(400, 300, "Tư Vấn & Thiết Kế", "1e3a8a", "ffffff"),
  service2: getPlaceholderImage(400, 300, "Lắp Đặt & Vận Hành", "1e3a8a", "ffffff"),
  service3: getPlaceholderImage(400, 300, "Bảo Trì & Sửa Chữa", "1e3a8a", "ffffff"),
  service4: getPlaceholderImage(400, 300, "Đào Tạo", "1e3a8a", "ffffff"),
  productWood1: getPlaceholderImage(600, 400, "CNC WoodMaster 500", "0f766e", "ffffff"),
  productWood2: getPlaceholderImage(600, 400, "CNC WoodMaster 900", "0f766e", "ffffff"),
  productWood3: getPlaceholderImage(600, 400, "CNC WoodMaster Compact", "0f766e", "ffffff"),
  productWood4: getPlaceholderImage(600, 400, "CNC WoodMaster Pro", "0f766e", "ffffff"),
  productMetal1: getPlaceholderImage(600, 400, "CNC MetalPro 700", "334155", "ffffff"),
  productMetal2: getPlaceholderImage(600, 400, "CNC MetalPro 1000", "334155", "ffffff"),
  productMetal3: getPlaceholderImage(600, 400, "CNC MetalPro Laser", "334155", "ffffff"),
  productMetal4: getPlaceholderImage(600, 400, "CNC MetalPro Compact", "334155", "ffffff"),
  productLaser1: getPlaceholderImage(600, 400, "CNC LaserTech 500", "7e22ce", "ffffff"),
  avatar1: getPlaceholderImage(100, 100, "NV", "6d28d9", "ffffff"),
  avatar2: getPlaceholderImage(100, 100, "TT", "6d28d9", "ffffff"),
  avatar3: getPlaceholderImage(100, 100, "LV", "6d28d9", "ffffff"),
  avatar4: getPlaceholderImage(100, 100, "PT", "6d28d9", "ffffff"),
  blog1: getPlaceholderImage(600, 400, "5 Lý Do Chuyển Đổi Sang CNC Gỗ", "0369a1", "ffffff"),
  blog2: getPlaceholderImage(600, 400, "Cách Bảo Trì Máy CNC Kim Loại", "0369a1", "ffffff"),
  blog3: getPlaceholderImage(600, 400, "Xu Hướng Công Nghệ CNC 2025", "0369a1", "ffffff"),
  blog4: getPlaceholderImage(600, 400, "Câu Chuyện Thành Công", "0369a1", "ffffff"),
  blog5: getPlaceholderImage(600, 400, "Triển Lãm Công Nghệ CNC 2025", "0369a1", "ffffff"),
  blog6: getPlaceholderImage(600, 400, "Hướng Dẫn Sử Dụng Phần Mềm CNC", "0369a1", "ffffff"),
  blogFeatured: getPlaceholderImage(800, 500, "Xu Hướng Công Nghệ CNC 2025: Tự Động Hóa và AI", "0369a1", "ffffff"),
}

// Các placeholder image cho trang sản phẩm
export const productImages = {
  header: getPlaceholderImage(1920, 400, "Sản Phẩm CNC", "1e40af", "ffffff"),
  productDetail1: getPlaceholderImage(800, 600, "CNC WoodMaster 500 - Chi tiết", "0f766e", "ffffff"),
  productDetail2: getPlaceholderImage(800, 600, "CNC WoodMaster 500 - Góc nhìn khác", "0f766e", "ffffff"),
  productDetail3: getPlaceholderImage(800, 600, "CNC WoodMaster 500 - Mặt trước", "0f766e", "ffffff"),
  productDetail4: getPlaceholderImage(800, 600, "CNC WoodMaster 500 - Mặt sau", "0f766e", "ffffff"),
  feature1: getPlaceholderImage(600, 400, "Hệ thống điều khiển", "0f766e", "ffffff"),
  feature2: getPlaceholderImage(600, 400, "Độ chính xác cao", "0f766e", "ffffff"),
}

// Các placeholder image cho trang dịch vụ
export const serviceImages = {
  header: getPlaceholderImage(1920, 400, "Dịch Vụ CNC Future", "1e40af", "ffffff"),
  overview: getPlaceholderImage(800, 600, "Giải Pháp Toàn Diện", "1e3a8a", "ffffff"),
  consulting: getPlaceholderImage(800, 600, "Tư Vấn & Thiết Kế", "1e3a8a", "ffffff"),
  installation: getPlaceholderImage(800, 600, "Lắp Đặt & Vận Hành", "1e3a8a", "ffffff"),
  maintenance: getPlaceholderImage(800, 600, "Bảo Trì & Sửa Chữa", "1e3a8a", "ffffff"),
  training: getPlaceholderImage(800, 600, "Đào Tạo", "1e3a8a", "ffffff"),
}

// Các placeholder image cho trang blog
export const blogImages = {
  header: getPlaceholderImage(1920, 400, "Blog & Tin Tức CNC Future", "1e40af", "ffffff"),
}

// Các placeholder image cho trang giới thiệu
export const aboutImages = {
  header: getPlaceholderImage(1920, 400, "Giới Thiệu CNC Future", "1e40af", "ffffff"),
  company: getPlaceholderImage(800, 600, "Về CNC Future", "0f172a", "ffffff"),
  team1: getPlaceholderImage(400, 500, "Nguyễn Văn A - Giám đốc điều hành", "1e3a8a", "ffffff"),
  team2: getPlaceholderImage(400, 500, "Trần Thị B - Giám đốc kỹ thuật", "1e3a8a", "ffffff"),
  team3: getPlaceholderImage(400, 500, "Lê Văn C - Giám đốc kinh doanh", "1e3a8a", "ffffff"),
  team4: getPlaceholderImage(400, 500, "Phạm Thị D - Giám đốc dịch vụ khách hàng", "1e3a8a", "ffffff"),
}

// Các placeholder image cho trang khách hàng
export const customerImages = {
  header: getPlaceholderImage(1920, 400, "Khách Hàng CNC Future", "1e40af", "ffffff"),
  caseStudy1: getPlaceholderImage(600, 400, "Xưởng Mộc Thành Công", "0f766e", "ffffff"),
  caseStudy2: getPlaceholderImage(600, 400, "Cơ Khí Tân Tiến", "334155", "ffffff"),
  client1: getPlaceholderImage(200, 100, "Client 1", "64748b", "ffffff"),
  client2: getPlaceholderImage(200, 100, "Client 2", "64748b", "ffffff"),
  client3: getPlaceholderImage(200, 100, "Client 3", "64748b", "ffffff"),
  client4: getPlaceholderImage(200, 100, "Client 4", "64748b", "ffffff"),
  client5: getPlaceholderImage(200, 100, "Client 5", "64748b", "ffffff"),
  client6: getPlaceholderImage(200, 100, "Client 6", "64748b", "ffffff"),
}

// Các placeholder image cho trang liên hệ
export const contactImages = {
  header: getPlaceholderImage(1920, 400, "Liên Hệ CNC Future", "1e40af", "ffffff"),
}

// Logo placeholder
export const logoImage = getPlaceholderImage(150, 40, "CNC Future", "1e40af", "ffffff")

