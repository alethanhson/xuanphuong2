import type { Metadata } from "next"
import Image from "next/image"
import { ArrowRight, Check, Users, Award, Clock, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import PageHeader from "@/components/page-header"

export const metadata: Metadata = {
  title: "Giới Thiệu | CNC Future",
  description: "Tìm hiểu về CNC Future - Nhà cung cấp giải pháp CNC hàng đầu Việt Nam.",
}

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="Giới Thiệu"
        description="Tìm hiểu về CNC Future - Nhà cung cấp giải pháp CNC hàng đầu Việt Nam"
        backgroundImage="/about-header.jpg"
      />

      {/* Company Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Về CNC Future</h2>
              <p className="text-zinc-700 mb-6">
                CNC Future được thành lập vào năm 2015, với sứ mệnh mang công nghệ CNC tiên tiến đến với các doanh
                nghiệp Việt Nam. Chúng tôi tự hào là đối tác phân phối chính thức của nhiều thương hiệu máy CNC hàng đầu
                thế giới.
              </p>
              <p className="text-zinc-700 mb-6">
                Với đội ngũ kỹ sư giàu kinh nghiệm và được đào tạo chuyên sâu, chúng tôi không chỉ cung cấp máy móc chất
                lượng cao mà còn đồng hành cùng khách hàng trong suốt quá trình sử dụng, từ tư vấn, lắp đặt đến bảo trì
                và nâng cấp.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-zinc-700">Nhà phân phối chính thức của các thương hiệu hàng đầu</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-zinc-700">Đội ngũ kỹ thuật được đào tạo chuyên sâu</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-zinc-700">Dịch vụ hậu mãi và bảo trì chuyên nghiệp</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-zinc-700">Giải pháp tùy chỉnh theo nhu cầu của từng khách hàng</span>
                </div>
              </div>

              <Button size="lg" className="group">
                Tìm Hiểu Thêm
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
              <Image src="/about-company.jpg" alt="CNC Future" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <p className="text-zinc-700">Nhân viên chuyên nghiệp</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">200+</div>
              <p className="text-zinc-700">Khách hàng tin tưởng</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">8+</div>
              <p className="text-zinc-700">Năm kinh nghiệm</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <p className="text-zinc-700">Dự án thành công</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 relative inline-block">
              Sứ Mệnh & Tầm Nhìn
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary"></span>
            </h2>
            <p className="text-zinc-600 max-w-2xl mx-auto mt-6">
              Chúng tôi cam kết mang đến những giải pháp CNC tốt nhất cho doanh nghiệp Việt Nam
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-2xl font-bold mb-4 text-primary">Sứ Mệnh</h3>
              <p className="text-zinc-700 mb-6">
                Sứ mệnh của CNC Future là mang công nghệ CNC tiên tiến đến với các doanh nghiệp Việt Nam, giúp nâng cao
                năng suất, chất lượng và khả năng cạnh tranh trên thị trường trong nước và quốc tế.
              </p>
              <p className="text-zinc-700">
                Chúng tôi cam kết cung cấp không chỉ máy móc chất lượng cao mà còn cả giải pháp toàn diện, từ tư vấn,
                thiết kế đến lắp đặt, đào tạo và bảo trì, đảm bảo khách hàng khai thác tối đa tiềm năng của công nghệ
                CNC.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-2xl font-bold mb-4 text-primary">Tầm Nhìn</h3>
              <p className="text-zinc-700 mb-6">
                CNC Future hướng đến trở thành nhà cung cấp giải pháp CNC hàng đầu tại Việt Nam, được khách hàng tin
                tưởng và lựa chọn nhờ chất lượng sản phẩm, dịch vụ chuyên nghiệp và đội ngũ nhân viên tận tâm.
              </p>
              <p className="text-zinc-700">
                Chúng tôi không ngừng cập nhật và đổi mới, đón đầu xu hướng công nghệ để mang đến những giải pháp tiên
                tiến nhất, góp phần vào sự phát triển của ngành sản xuất Việt Nam trong kỷ nguyên công nghiệp 4.0.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Sẵn sàng nâng cấp công nghệ sản xuất của bạn?</h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí về giải pháp CNC phù hợp nhất cho doanh nghiệp
            của bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="group">
              Liên Hệ Ngay
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
              Xem Sản Phẩm
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

