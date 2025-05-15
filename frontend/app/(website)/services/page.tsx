import type { Metadata } from "next"
import Image from "next/image"
import { ArrowRight, Check } from "lucide-react"
import Script from "next/script"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PageHeader from "@/components/page-header"

export const metadata: Metadata = {
  title: "Dịch Vụ CNC Chuyên Nghiệp | Tư Vấn, Lắp Đặt, Bảo Trì | CNC Future",
  description: "Cung cấp giải pháp toàn diện về CNC từ tư vấn, thiết kế đến lắp đặt và bảo trì. Đội ngũ kỹ thuật chuyên nghiệp, hỗ trợ 24/7.",
  keywords: "dịch vụ CNC, tư vấn CNC, thiết kế CNC, lắp đặt máy CNC, bảo trì máy CNC, đào tạo CNC, sửa chữa CNC, giải pháp CNC, kỹ thuật CNC, CNC chuyên nghiệp",
  alternates: {
    canonical: "https://cncfuture.com/services",
  },
  openGraph: {
    title: "Dịch Vụ CNC Chuyên Nghiệp | CNC Future",
    description: "Cung cấp giải pháp toàn diện từ tư vấn, thiết kế đến lắp đặt và bảo trì máy CNC. Đội ngũ kỹ thuật chuyên nghiệp, hỗ trợ 24/7.",
    url: "https://cncfuture.com/services",
    type: "website",
    images: [
      {
        url: "https://cncfuture.com/services-overview.jpg",
        width: 1200,
        height: 630,
        alt: "Dịch vụ CNC Future chuyên nghiệp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dịch Vụ CNC Chuyên Nghiệp | CNC Future",
    description: "Cung cấp giải pháp toàn diện từ tư vấn, thiết kế đến lắp đặt và bảo trì máy CNC.",
    images: ["https://cncfuture.com/services-overview.jpg"],
  },
}

export default function ServicesPage() {
  return (
    <>
      <Script id="schema-services" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Dịch Vụ CNC",
            "provider": {
              "@type": "Organization",
              "name": "CNC Future",
              "url": "https://cncfuture.com"
            },
            "serviceType": ["Tư Vấn & Thiết Kế CNC", "Lắp Đặt & Vận Hành", "Bảo Trì & Sửa Chữa", "Đào Tạo"],
            "description": "Cung cấp giải pháp toàn diện từ tư vấn, thiết kế đến lắp đặt và bảo trì máy CNC.",
            "areaServed": "Việt Nam",
            "audience": "Doanh nghiệp sản xuất",
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Dịch vụ CNC",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Tư Vấn & Thiết Kế CNC"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Lắp Đặt & Vận Hành CNC"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Bảo Trì & Sửa Chữa CNC"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Đào Tạo Vận Hành CNC"
                  }
                }
              ]
            }
          }
        `}
      </Script>

      <PageHeader
        title="Dịch Vụ CNC Chuyên Nghiệp"
        description="Cung cấp giải pháp toàn diện từ tư vấn, thiết kế đến lắp đặt và bảo trì"
        backgroundImage="/services-header.jpg"
      />

      {/* Services Overview */}
      <section className="py-16" id="dich-vu-cnc-tong-quan">
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
              <Image 
                src="/services-overview.jpg" 
                alt="Dịch vụ CNC chất lượng cao - Đội ngũ kỹ thuật chuyên nghiệp đang làm việc với máy CNC" 
                fill 
                className="object-cover"
                priority 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Tabs */}
      <section className="py-16 bg-zinc-50" id="dich-vu-chi-tiet">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 relative inline-block">
              Dịch Vụ Của Chúng Tôi
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary"></span>
            </h2>
            <p className="text-zinc-600 max-w-2xl mx-auto mt-6">Khám phá các dịch vụ chuyên nghiệp từ CNC Future</p>
          </div>

          <Tabs defaultValue="consulting" className="w-full">
            <TabsList className="w-full max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-12">
              <TabsTrigger value="consulting">Tư Vấn & Thiết Kế</TabsTrigger>
              <TabsTrigger value="installation">Lắp Đặt & Vận Hành</TabsTrigger>
              <TabsTrigger value="maintenance">Bảo Trì & Sửa Chữa</TabsTrigger>
              <TabsTrigger value="training">Đào Tạo</TabsTrigger>
            </TabsList>

            <TabsContent value="consulting" className="bg-white p-8 rounded-xl shadow-sm">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="relative h-[400px] rounded-xl overflow-hidden">
                  <Image 
                    src="/service-consulting.jpg" 
                    alt="Dịch vụ tư vấn và thiết kế CNC - Chuyên gia kỹ thuật đang tư vấn cho khách hàng" 
                    fill 
                    className="object-cover" 
                  />
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
                          aria-hidden="true"
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
                          aria-hidden="true"
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
                          aria-hidden="true"
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
                          aria-hidden="true"
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
                          aria-hidden="true"
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
                  <Image 
                    src="/service-installation.jpg" 
                    alt="Kỹ thuật viên CNC Future đang lắp đặt và cài đặt máy CNC tại xưởng" 
                    fill 
                    className="object-cover" 
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="maintenance" className="bg-white p-8 rounded-xl shadow-sm">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="relative h-[400px] rounded-xl overflow-hidden">
                  <Image 
                    src="/service-maintenance.jpg" 
                    alt="Dịch vụ bảo trì và sửa chữa máy CNC - Kỹ thuật viên đang kiểm tra và sửa chữa máy" 
                    fill 
                    className="object-cover" 
                  />
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-4">Bảo Trì & Sửa Chữa</h3>
                  <p className="text-zinc-700 mb-6">
                    Để đảm bảo máy CNC hoạt động ổn định và kéo dài tuổi thọ, việc bảo trì định kỳ là cần thiết. Chúng tôi cung cấp dịch vụ bảo trì theo lịch trình và sửa chữa khẩn cấp với đội ngũ kỹ thuật viên giàu kinh nghiệm, sẵn sàng hỗ trợ 24/7.
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
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Bảo trì định kỳ</h4>
                        <p className="text-zinc-600">
                          Kiểm tra và bảo dưỡng máy CNC theo lịch trình, giúp phát hiện sớm các vấn đề tiềm ẩn và duy trì hiệu suất làm việc tối ưu.
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
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Sửa chữa khẩn cấp</h4>
                        <p className="text-zinc-600">
                          Đội ngũ kỹ thuật phản hồi nhanh trong vòng 24 giờ khi máy gặp sự cố, giảm thiểu thời gian dừng máy và đảm bảo sản xuất liên tục.
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
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Phụ tùng chính hãng</h4>
                        <p className="text-zinc-600">
                          Cung cấp các phụ tùng thay thế chính hãng, đảm bảo máy CNC hoạt động ổn định và bền bỉ theo thời gian.
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

            <TabsContent value="training" className="bg-white p-8 rounded-xl shadow-sm">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Đào Tạo Vận Hành CNC</h3>
                  <p className="text-zinc-700 mb-6">
                    Chúng tôi cung cấp các khóa đào tạo chuyên sâu về vận hành và lập trình máy CNC cho đội ngũ kỹ thuật của doanh nghiệp. Các khóa học được thiết kế phù hợp với từng đối tượng học viên, từ người mới bắt đầu đến kỹ thuật viên có kinh nghiệm.
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
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Khóa học cơ bản</h4>
                        <p className="text-zinc-600">
                          Dành cho người mới, cung cấp kiến thức nền tảng về nguyên lý hoạt động và cách vận hành máy CNC an toàn, hiệu quả.
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
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Lập trình nâng cao</h4>
                        <p className="text-zinc-600">
                          Hướng dẫn kỹ thuật lập trình G-code và sử dụng phần mềm CAM để tối ưu hóa quy trình sản xuất CNC.
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
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Tối ưu hóa sản xuất</h4>
                        <p className="text-zinc-600">
                          Đào tạo kỹ năng phân tích và tối ưu quy trình sản xuất, giúp tăng năng suất và giảm chi phí vận hành.
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
                  <Image 
                    src="/service-training.jpg" 
                    alt="Khóa đào tạo vận hành CNC chuyên nghiệp - Giảng viên đang hướng dẫn học viên" 
                    fill 
                    className="object-cover" 
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* FAQ Section for SEO */}
      <section className="py-16 bg-white" id="cau-hoi-thuong-gap">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 relative inline-block">
              Câu Hỏi Thường Gặp
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary"></span>
            </h2>
            <p className="text-zinc-600 max-w-2xl mx-auto mt-6">Những thắc mắc phổ biến về dịch vụ CNC của chúng tôi</p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="bg-zinc-50 p-6 rounded-lg">
                <h3 className="font-bold text-xl mb-2">CNC Future cung cấp những dịch vụ gì?</h3>
                <p>Chúng tôi cung cấp đầy đủ các dịch vụ về CNC bao gồm tư vấn & thiết kế, lắp đặt & vận hành, bảo trì & sửa chữa, và đào tạo vận hành CNC cho nhân viên của bạn.</p>
              </div>
              
              <div className="bg-zinc-50 p-6 rounded-lg">
                <h3 className="font-bold text-xl mb-2">Chi phí dịch vụ CNC như thế nào?</h3>
                <p>Chi phí dịch vụ phụ thuộc vào loại dịch vụ và quy mô dự án của bạn. Chúng tôi cung cấp báo giá miễn phí và tư vấn để đưa ra giải pháp phù hợp với ngân sách của doanh nghiệp.</p>
              </div>
              
              <div className="bg-zinc-50 p-6 rounded-lg">
                <h3 className="font-bold text-xl mb-2">Thời gian đáp ứng khi máy CNC gặp sự cố?</h3>
                <p>Đội ngũ kỹ thuật của chúng tôi sẽ phản hồi trong vòng 24 giờ, và trong trường hợp khẩn cấp, chúng tôi có dịch vụ hỗ trợ kỹ thuật 24/7 để đảm bảo hoạt động sản xuất của bạn không bị gián đoạn.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

