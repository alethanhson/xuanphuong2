import type { Metadata } from "next"
import Image from "next/image"
import { ArrowRight, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PageHeader from "@/components/page-header"

export const metadata: Metadata = {
  title: "Dịch Vụ | CNC Future",
  description: "Cung cấp giải pháp toàn diện từ tư vấn, thiết kế đến lắp đặt và bảo trì máy CNC.",
  keywords: "dịch vụ CNC, tư vấn CNC, lắp đặt máy CNC, bảo trì máy CNC, đào tạo CNC",
  alternates: {
    canonical: "https://cncfuture.com/services",
  },
  openGraph: {
    title: "Dịch Vụ CNC Chuyên Nghiệp | CNC Future",
    description: "Cung cấp giải pháp toàn diện từ tư vấn, thiết kế đến lắp đặt và bảo trì máy CNC.",
    url: "https://cncfuture.com/services",
    type: "website",
  },
}

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="Dịch Vụ"
        description="Cung cấp giải pháp toàn diện từ tư vấn, thiết kế đến lắp đặt và bảo trì"
        backgroundImage="/services-header.jpg"
      />

      {/* Services Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Giải Pháp Toàn Diện Cho Doanh Nghiệp</h2>
              <p className="text-zinc-700 mb-6">
                CNC Future cung cấp các dịch vụ toàn diện từ tư vấn, thiết kế đến lắp đặt và bảo trì máy CNC. Chúng tôi
                cam kết đồng hành cùng doanh nghiệp của bạn trong suốt quá trình sử dụng máy móc, đảm bảo hiệu suất tối
                ưu và tuổi thọ cao.
              </p>
              <p className="text-zinc-700 mb-6">
                Với đội ngũ kỹ sư giàu kinh nghiệm và được đào tạo chuyên sâu, chúng tôi tự tin mang đến những giải pháp
                phù hợp nhất với nhu cầu và ngân sách của doanh nghiệp bạn.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-zinc-700">Đội ngũ kỹ thuật chuyên nghiệp</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-zinc-700">Phản hồi nhanh chóng trong vòng 24h</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-zinc-700">Giải pháp tùy chỉnh theo nhu cầu</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-zinc-700">Hỗ trợ kỹ thuật 24/7</span>
                </div>
              </div>

              <Button size="lg" className="group">
                Liên Hệ Tư Vấn
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
              <Image src="/services-overview.jpg" alt="Dịch vụ CNC Future" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Tabs */}
      <section className="py-16 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 relative inline-block">
              Dịch Vụ Của Chúng Tôi
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary"></span>
            </h2>
            <p className="text-zinc-600 max-w-2xl mx-auto mt-6">Khám phá các dịch vụ chuyên nghiệp từ CNC Future</p>
          </div>

          <Tabs defaultValue="consulting" className="w-full">
            <TabsList className="w-full max-w-3xl mx-auto grid grid-cols-4 mb-12">
              <TabsTrigger value="consulting">Tư Vấn & Thiết Kế</TabsTrigger>
              <TabsTrigger value="installation">Lắp Đặt & Vận Hành</TabsTrigger>
              <TabsTrigger value="maintenance">Bảo Trì & Sửa Chữa</TabsTrigger>
              <TabsTrigger value="training">Đào Tạo</TabsTrigger>
            </TabsList>

            <TabsContent value="consulting" className="bg-white p-8 rounded-xl shadow-sm">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="relative h-[400px] rounded-xl overflow-hidden">
                  <Image src="/service-consulting.jpg" alt="Tư vấn và thiết kế" fill className="object-cover" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-4">Tư Vấn & Thiết Kế</h3>
                  <p className="text-zinc-700 mb-6">
                    Chúng tôi cung cấp dịch vụ tư vấn chuyên nghiệp, giúp bạn lựa chọn máy CNC phù hợp nhất với nhu cầu
                    sản xuất và ngân sách. Đội ngũ kỹ sư của chúng tôi sẽ phân tích yêu cầu của bạn và đề xuất giải pháp
                    tối ưu.
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-1">
                        <svg
                          className="w-5 h-5 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Khảo sát nhu cầu</h4>
                        <p className="text-zinc-600">
                          Phân tích yêu cầu sản xuất, không gian xưởng và ngân sách để đề xuất giải pháp phù hợp.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-1">
                        <svg
                          className="w-5 h-5 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1V4z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Thiết kế layout</h4>
                        <p className="text-zinc-600">
                          Thiết kế bố trí xưởng tối ưu, đảm bảo hiệu quả sản xuất và an toàn lao động.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-1">
                        <svg
                          className="w-5 h-5 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Lập kế hoạch triển khai</h4>
                        <p className="text-zinc-600">
                          Xây dựng lộ trình triển khai chi tiết, từ lắp đặt đến đào tạo và bảo trì.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button className="group">
                    Tìm Hiểu Thêm
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="installation" className="bg-white p-8 rounded-xl shadow-sm">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Lắp Đặt & Vận Hành</h3>
                  <p className="text-zinc-700 mb-6">
                    Đội ngũ kỹ thuật của chúng tôi sẽ thực hiện lắp đặt máy CNC tại xưởng của bạn, đảm bảo máy hoạt động
                    ổn định và đạt hiệu suất tối đa. Chúng tôi cũng hỗ trợ cài đặt phần mềm và hướng dẫn vận hành ban
                    đầu.
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-1">
                        <svg
                          className="w-5 h-5 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37zM9.375 7.5c-.621 0-1.125.504-1.125 1.125v1.5a1.125 1.125 0 001.125 1.125h1.5a1.125 1.125 0 001.125-1.125v-1.5a1.125 1.125 0 00-1.125-1.125h-1.5z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Lắp đặt chuyên nghiệp</h4>
                        <p className="text-zinc-600">
                          Đội ngũ kỹ thuật viên giàu kinh nghiệm sẽ đảm bảo quá trình lắp đặt diễn ra nhanh chóng và
                          chính xác.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-1">
                        <svg
                          className="w-5 h-5 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11l-7-7m0 0l7 7m-7-7v14m-5-5l7 7m-7-7h12"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Hướng dẫn vận hành</h4>
                        <p className="text-zinc-600">
                          Chúng tôi sẽ hướng dẫn chi tiết cách vận hành máy CNC để đảm bảo bạn có thể sử dụng máy một
                          cách hiệu quả.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button className="group">
                    Tìm Hiểu Thêm
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
                <div className="relative h-[400px] rounded-xl overflow-hidden">
                  <Image src="/service-installation.jpg" alt="Lắp đặt và vận hành" fill className="object-cover" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="maintenance" className="bg-white p-8 rounded-xl shadow-sm">
              {/* rest of code here */}
            </TabsContent>
            <TabsContent value="training" className="bg-white p-8 rounded-xl shadow-sm">
              {/* rest of code here */}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  )
}

