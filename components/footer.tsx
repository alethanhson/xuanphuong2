import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-300">
      <div className="container mx-auto px-4 py-10 sm:py-12">
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Tân Tiến Vinh</h3>
            <p className="mb-4 text-sm sm:text-base">
              Chuyên cung cấp máy móc CNC hiện đại cho ngành gỗ và kim loại, nâng cao hiệu suất sản xuất.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                aria-label="Facebook"
                className="text-zinc-300 hover:text-white transition-colors touch-target"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-zinc-300 hover:text-white transition-colors touch-target"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="text-zinc-300 hover:text-white transition-colors touch-target"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.543 6.498C22 8.28 22 12 22 12s0 3.72-.457 5.502c-.254.985-.997 1.76-1.938 2.022C17.896 20 12 20 12 20s-5.893 0-7.605-.476c-.945-.266-1.687-1.04-1.938-2.022C2 15.72 2 12 2 12s0-3.72.457-5.502c.254-.985.997-1.76 1.938-2.022C6.107 4 12 4 12 4s5.896 0 7.605.476c.945.266 1.687 1.04 1.938 2.022zM10 15.5l6-3.5-6-3.5v7z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white text-lg font-bold mb-4">Sản Phẩm</h3>
            <ul className="space-y-2 text-sm sm:text-base">
              <li>
                <Link
                  href="/products?category=wood"
                  className="text-zinc-300 hover:text-white transition-colors block py-1"
                >
                  Máy CNC Gỗ
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=metal"
                  className="text-zinc-300 hover:text-white transition-colors block py-1"
                >
                  Máy CNC Kim Loại
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=laser"
                  className="text-zinc-300 hover:text-white transition-colors block py-1"
                >
                  Máy CNC Laser
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=accessories"
                  className="text-zinc-300 hover:text-white transition-colors block py-1"
                >
                  Phụ Kiện CNC
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-bold mb-4">Dịch Vụ</h3>
            <ul className="space-y-2 text-sm sm:text-base">
              <li>
                <Link
                  href="/services#tu-van-thiet-ke"
                  className="text-zinc-300 hover:text-white transition-colors block py-1"
                >
                  Tư Vấn Thiết Kế
                </Link>
              </li>
              <li>
                <Link
                  href="/services#lap-dat-van-hanh"
                  className="text-zinc-300 hover:text-white transition-colors block py-1"
                >
                  Lắp Đặt Vận Hành
                </Link>
              </li>
              <li>
                <Link
                  href="/services#bao-tri-sua-chua"
                  className="text-zinc-300 hover:text-white transition-colors block py-1"
                >
                  Bảo Trì Bảo Dưỡng
                </Link>
              </li>
              <li>
                <Link href="/services#dao-tao" className="text-zinc-300 hover:text-white transition-colors block py-1">
                  Đào Tạo Nhân Viên
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-bold mb-4">Liên Hệ</h3>
            <ul className="space-y-3 text-sm sm:text-base">
              <li className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 mt-0.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>123 Đường Công Nghiệp, Quận 9, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a href="tel:0979756103" className="hover:text-white transition-colors">
                  0979.756.103
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a href="mailto:info@cncfuture.com" className="hover:text-white transition-colors">
                  info@cncfuture.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-8 pt-6 text-center text-sm sm:text-base">
          <p>&copy; 2025 Tân Tiến Vinh. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}

