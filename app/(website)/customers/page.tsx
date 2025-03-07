import type { Metadata } from "next"
import Image from "next/image"
import { Star, Quote } from "lucide-react"

import PageHeader from "@/components/page-header"

export const metadata: Metadata = {
  title: "Khách Hàng | CNC Future",
  description: "Khám phá câu chuyện thành công và đánh giá từ khách hàng của CNC Future.",
}

export default function CustomersPage() {
  return (
    <>
      <PageHeader
        title="Khách Hàng"
        description="Khám phá câu chuyện thành công và đánh giá từ khách hàng của chúng tôi"
        backgroundImage="/customers-header.jpg"
      />

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 relative inline-block">
              Đánh Giá Từ Khách Hàng
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary"></span>
            </h2>
            <p className="text-zinc-600 max-w-2xl mx-auto mt-6">
              Khám phá những gì khách hàng nói về sản phẩm và dịch vụ của chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="mb-6">
                <Quote className="h-8 w-8 text-primary/20" />
                <p className="text-zinc-700 mt-2">
                  "Máy CNC WoodMaster 500 đã giúp chúng tôi tăng tốc độ cắt gỗ lên 2 lần và giảm đáng kể hao phí. Đầu tư
                  đáng giá nhất của xưởng trong năm nay."
                </p>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center mr-3">
                  <span className="font-medium">NV</span>
                </div>
                <div>
                  <div className="font-medium">Nguyễn Văn A</div>
                  <div className="text-sm text-zinc-500">Giám đốc Xưởng Mộc Thành Công</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star, index) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${index < 4 ? "fill-yellow-400 text-yellow-400" : "fill-zinc-200 text-zinc-200"}`}
                  />
                ))}
              </div>
              <div className="mb-6">
                <Quote className="h-8 w-8 text-primary/20" />
                <p className="text-zinc-700 mt-2">
                  "Máy hoạt động rất ổn định, độ chính xác cao. Chúng tôi đã sản xuất được nhiều sản phẩm có độ tinh xảo
                  cao. Tuy nhiên, phần mềm điều khiển có thể cải thiện thêm."
                </p>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center mr-3">
                  <span className="font-medium">TT</span>
                </div>
                <div>
                  <div className="font-medium">Trần Thị B</div>
                  <div className="text-sm text-zinc-500">Quản lý Sản xuất Nội Thất Hiện Đại</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="mb-6">
                <Quote className="h-8 w-8 text-primary/20" />
                <p className="text-zinc-700 mt-2">
                  "Sau khi đầu tư máy CNC MetalPro 700, năng suất của xưởng chúng tôi đã tăng 40%. Chất lượng sản phẩm
                  đồng đều và tiết kiệm được nhiều chi phí nhân công."
                </p>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center mr-3">
                  <span className="font-medium">LV</span>
                </div>
                <div>
                  <div className="font-medium">Lê Văn C</div>
                  <div className="text-sm text-zinc-500">Chủ Xưởng Cơ Khí Tân Tiến</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 relative inline-block">
              Câu Chuyện Thành Công
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary"></span>
            </h2>
            <p className="text-zinc-600 max-w-2xl mx-auto mt-6">
              Khám phá cách các doanh nghiệp đã cải thiện hiệu suất với máy CNC của chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto">
                  <Image src="/case-study-1.jpg" alt="Case study" fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">Xưởng Mộc Thành Công</h3>
                  <p className="text-zinc-600 mb-4">
                    Xưởng Mộc Thành Công đã tăng năng suất 40% và giảm 25% chi phí sản xuất sau khi đầu tư máy CNC
                    WoodMaster 500.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Sản phẩm:</span>
                      <span>CNC WoodMaster 500</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Ngành:</span>
                      <span>Sản xuất nội thất</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Kết quả:</span>
                      <span>Tăng 40% năng suất</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto">
                  <Image src="/case-study-2.jpg" alt="Case study" fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">Cơ Khí Tân Tiến</h3>
                  <p className="text-zinc-600 mb-4">
                    Cơ Khí Tân Tiến đã mở rộng danh mục sản phẩm và tăng 35% doanh thu sau khi đầu tư máy CNC MetalPro
                    700.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Sản phẩm:</span>
                      <span>CNC MetalPro 700</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Ngành:</span>
                      <span>Gia công kim loại</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Kết quả:</span>
                      <span>Tăng 35% doanh thu</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-4xl font-bold text-primary mb-2">85%</div>
              <p className="text-zinc-700">khách hàng báo cáo tăng năng suất sau khi sử dụng máy CNC của chúng tôi</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <p className="text-zinc-700">khách hàng hài lòng với dịch vụ hỗ trợ kỹ thuật của chúng tôi</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-4xl font-bold text-primary mb-2">200+</div>
              <p className="text-zinc-700">doanh nghiệp đã tin tưởng và sử dụng sản phẩm của chúng tôi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 relative inline-block">
              Khách Hàng Tiêu Biểu
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary"></span>
            </h2>
            <p className="text-zinc-600 max-w-2xl mx-auto mt-6">
              Những doanh nghiệp hàng đầu đã tin tưởng và sử dụng sản phẩm của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((client) => (
              <div key={client} className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm">
                <Image
                  src={`/client-${client}.png`}
                  alt={`Client ${client}`}
                  width={120}
                  height={60}
                  className="opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

