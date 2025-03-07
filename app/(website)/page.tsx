import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle, ChevronRight, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import HeroSection from "@/components/home/hero-section"
import FeaturedProducts from "@/components/home/featured-products"
import ServiceOverview from "@/components/home/service-overview"
import TestimonialSlider from "@/components/home/testimonial-slider"
import BlogHighlights from "@/components/home/blog-highlights"
import ClientLogos from "@/components/home/client-logos"
import ContactSale from "@/components/home/contact-sale"
import CTASection from "@/components/home/cta-section-v2"
import { homeImages } from "@/lib/placeholder-images"

export const metadata: Metadata = {
  title: "CNC Future - Giải Pháp CNC Toàn Diện Cho Ngành Gỗ & Kim Loại",
  description:
    "Chuyên cung cấp máy CNC chất lượng cao, dịch vụ tư vấn, lắp đặt và bảo trì cho ngành gỗ và kim loại tại Việt Nam.",
  keywords: "máy cnc, cnc gỗ, cnc kim loại, máy cnc laser, thiết bị cnc, công nghệ cnc",
  openGraph: {
    title: "CNC Future - Giải Pháp CNC Toàn Diện Cho Ngành Gỗ & Kim Loại",
    description:
      "Chuyên cung cấp máy CNC chất lượng cao, dịch vụ tư vấn, lắp đặt và bảo trì cho ngành gỗ và kim loại tại Việt Nam.",
    url: "https://cncfuture.com",
    siteName: "CNC Future",
    images: [
      {
        url: homeImages.hero,
        width: 1200,
        height: 630,
        alt: "CNC Future - Giải Pháp CNC Toàn Diện",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
}

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <HeroSection />

      {/* Trusted By Section */}
      <section className="py-8 bg-zinc-50">
        <div className="container mx-auto px-4">
          <p className="text-center text-zinc-600 mb-6">Được tin dùng bởi hơn 500+ doanh nghiệp tại Việt Nam</p>
          <ClientLogos />
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative rounded-lg overflow-hidden">
              <div className="aspect-w-4 aspect-h-3 relative">
                <Image
                  src={homeImages.about || "/placeholder.svg"}
                  alt="Về CNC Future"
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent mix-blend-overlay"></div>
            </div>

            <div>
              <Badge className="mb-3 sm:mb-4">Về Chúng Tôi</Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                Đối tác tin cậy trong lĩnh vực <span className="text-primary">công nghệ CNC</span>
              </h2>
              <p className="text-zinc-700 mb-4 sm:mb-6 text-sm sm:text-base">
                CNC Future tự hào là đơn vị tiên phong trong việc cung cấp các giải pháp CNC toàn diện cho ngành công
                nghiệp gỗ và kim loại tại Việt Nam. Với hơn 10 năm kinh nghiệm, chúng tôi cam kết mang đến những sản
                phẩm chất lượng cao, dịch vụ chuyên nghiệp và giải pháp tối ưu cho doanh nghiệp của bạn.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm sm:text-base">Sản phẩm chất lượng cao</h3>
                    <p className="text-xs sm:text-sm text-zinc-600">Nhập khẩu từ các thương hiệu uy tín</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm sm:text-base">Đội ngũ kỹ thuật chuyên nghiệp</h3>
                    <p className="text-xs sm:text-sm text-zinc-600">Được đào tạo bài bản, giàu kinh nghiệm</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm sm:text-base">Dịch vụ hậu mãi tận tâm</h3>
                    <p className="text-xs sm:text-sm text-zinc-600">Hỗ trợ 24/7, bảo hành dài hạn</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm sm:text-base">Giải pháp tùy chỉnh</h3>
                    <p className="text-xs sm:text-sm text-zinc-600">Đáp ứng nhu cầu đặc thù của từng khách hàng</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/about">
                    Tìm hiểu thêm
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2">
                  <Link href="/contact">
                    <Phone className="h-4 w-4" />
                    Liên hệ ngay
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 sm:py-16 bg-zinc-50">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <Badge className="mb-3 sm:mb-4">Sản Phẩm Nổi Bật</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Máy CNC Chất Lượng Cao</h2>
            <p className="text-zinc-700 max-w-2xl mx-auto text-sm sm:text-base">
              Chúng tôi cung cấp các dòng máy CNC hiện đại, được thiết kế đặc biệt cho ngành gỗ và kim loại, giúp tối ưu
              hóa quy trình sản xuất của bạn.
            </p>
          </div>

          <FeaturedProducts />

          <div className="text-center mt-8 sm:mt-10">
            <Button asChild size="lg" className="gap-2">
              <Link href="/products">
                Xem tất cả sản phẩm
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <Badge className="mb-3 sm:mb-4">Dịch Vụ</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Giải Pháp Toàn Diện</h2>
            <p className="text-zinc-700 max-w-2xl mx-auto text-sm sm:text-base">
              Chúng tôi cung cấp các dịch vụ chuyên nghiệp từ tư vấn, thiết kế đến lắp đặt, bảo trì và đào tạo, đảm bảo
              máy móc của bạn luôn hoạt động hiệu quả.
            </p>
          </div>

          <ServiceOverview />

          <div className="text-center mt-8 sm:mt-10">
            <Button asChild size="lg" className="gap-2">
              <Link href="/services">
                Tìm hiểu thêm về dịch vụ
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 sm:py-16 bg-primary text-white">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <Badge variant="outline" className="mb-3 sm:mb-4 border-white/20 text-white">
              Tại Sao Chọn Chúng Tôi
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Lý Do Khách Hàng Tin Tưởng CNC Future
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto text-sm sm:text-base">
              Với hơn 10 năm kinh nghiệm, chúng tôi tự hào là đối tác tin cậy của hàng trăm doanh nghiệp trong lĩnh vực
              công nghiệp gỗ và kim loại.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Card className="bg-white/10 border-none text-white">
              <CardContent className="p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Chất Lượng Đảm Bảo</h3>
                <p className="text-white/80 text-sm sm:text-base">
                  Chúng tôi chỉ cung cấp các sản phẩm chất lượng cao từ các thương hiệu uy tín trên thế giới.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-none text-white">
              <CardContent className="p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Hiệu Suất Cao</h3>
                <p className="text-white/80 text-sm sm:text-base">
                  Máy móc của chúng tôi được thiết kế để tối ưu hóa hiệu suất và tiết kiệm chi phí sản xuất.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-none text-white">
              <CardContent className="p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Đội Ngũ Chuyên Nghiệp</h3>
                <p className="text-white/80 text-sm sm:text-base">
                  Đội ngũ kỹ thuật viên giàu kinh nghiệm, được đào tạo bài bản về công nghệ CNC.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-none text-white">
              <CardContent className="p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Hỗ Trợ Tận Tâm</h3>
                <p className="text-white/80 text-sm sm:text-base">
                  Dịch vụ hậu mãi 24/7, giải quyết mọi vấn đề kỹ thuật nhanh chóng và hiệu quả.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <Badge className="mb-3 sm:mb-4">Khách Hàng Nói Gì</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Đánh Giá Từ Khách Hàng</h2>
            <p className="text-zinc-700 max-w-2xl mx-auto text-sm sm:text-base">
              Hãy nghe những chia sẻ từ khách hàng đã và đang sử dụng sản phẩm và dịch vụ của CNC Future.
            </p>
          </div>

          <TestimonialSlider />
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />

      {/* Blog Section */}
      <section className="py-12 sm:py-16 bg-zinc-50">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <Badge className="mb-3 sm:mb-4">Blog & Tin Tức</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Bài Viết Mới Nhất</h2>
            <p className="text-zinc-700 max-w-2xl mx-auto text-sm sm:text-base">
              Cập nhật những thông tin mới nhất về công nghệ CNC, xu hướng ngành và các mẹo hữu ích.
            </p>
          </div>

          <BlogHighlights />

          <div className="text-center mt-8 sm:mt-10">
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link href="/blog">
                Xem tất cả bài viết
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Sale Section */}
      <section className="py-12 sm:py-16 md:py-24">
        <ContactSale />
      </section>
    </main>
  )
}

