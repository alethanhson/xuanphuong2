import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight, Play } from "lucide-react"

export default function CTASection() {
  return (
    <section className="py-12 sm:py-16 bg-primary text-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Sẵn sàng nâng cấp công nghệ sản xuất?
            </h2>
            <p className="text-white/80 mb-6 sm:mb-8 text-sm sm:text-base">
              Hãy liên hệ ngay với chúng tôi để được tư vấn và nhận giải pháp tốt nhất cho nhu cầu sản xuất của bạn. Đội ngũ chuyên gia của chúng tôi sẽ hỗ trợ bạn từ khâu tư vấn đến triển khai.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
              <Button asChild className="bg-white text-primary hover:bg-white/90 transition-colors shadow-md hover:shadow-lg">
                <Link href="/contact" className="gap-2">
                  Liên Hệ Ngay
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10 transition-colors">
                <Link href="#" className="gap-2">
                  <Play className="h-4 w-4 fill-current" />
                  Xem Demo
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-primary overflow-hidden">
                  <Image 
                    src="/customers/customer-1.jpg" 
                    alt="Customer 1" 
                    fill 
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-primary overflow-hidden">
                  <Image 
                    src="/customers/customer-2.jpg" 
                    alt="Customer 2" 
                    fill 
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-primary overflow-hidden">
                  <Image 
                    src="/customers/customer-3.jpg" 
                    alt="Customer 3" 
                    fill 
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-primary overflow-hidden bg-white/20 flex items-center justify-center text-sm sm:text-base font-medium">
                  <span>10+</span>
                </div>
              </div>
              <div>
                <p className="font-medium text-sm sm:text-base">Hơn 500+ khách hàng</p>
                <p className="text-white/80 text-xs sm:text-sm">đã tin tưởng chúng tôi</p>
              </div>
            </div>
          </div>

          <div className="relative p-6 sm:p-8 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent rounded-xl"></div>
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 relative">Đăng ký nhận tư vấn miễn phí</h3>
            <div className="space-y-4 relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Họ và tên"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                />
              </div>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                />
              </div>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="Số điện thoại"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                />
              </div>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all appearance-none"
                >
                  <option value="" className="bg-primary">Bạn quan tâm đến sản phẩm nào?</option>
                  <option value="cnc-wood" className="bg-primary">Máy CNC Gỗ</option>
                  <option value="cnc-metal" className="bg-primary">Máy CNC Kim Loại</option>
                  <option value="other" className="bg-primary">Sản phẩm khác</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ChevronRight className="h-4 w-4 rotate-90 text-white/60" />
                </div>
              </div>
              <Button className="w-full bg-white text-primary hover:bg-white/90 transition-colors font-medium">
                Gửi Yêu Cầu
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

