import type { Metadata } from "next"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import PageHeader from "@/components/page-header"

export const metadata: Metadata = {
  title: "Liên Hệ | CNC Future",
  description: "Liên hệ với CNC Future để được tư vấn về giải pháp CNC phù hợp với nhu cầu của bạn.",
}

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Liên Hệ"
        description="Liên hệ với chúng tôi để được tư vấn về giải pháp CNC phù hợp với nhu cầu của bạn"
        backgroundImage="/contact-header.jpg"
      />

      {/* Contact Info & Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="md:col-span-1">
              <h2 className="text-2xl font-bold mb-6">Thông Tin Liên Hệ</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Điện thoại</h3>
                    <p className="text-zinc-600 mb-1">Gọi cho chúng tôi</p>
                    <a href="tel:0355197235" className="text-primary font-medium">
                      035.519.7235
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Email</h3>
                    <p className="text-zinc-600 mb-1">Gửi email cho chúng tôi</p>
                    <a href="mailto:info@cncfuture.vn" className="text-primary font-medium">
                      info@cncfuture.vn
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Địa chỉ</h3>
                    <p className="text-zinc-600 mb-1">Trụ sở chính</p>
                    <p className="text-zinc-700">123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Giờ làm việc</h3>
                    <p className="text-zinc-600 mb-1">Thời gian làm việc</p>
                    <p className="text-zinc-700">Thứ 2 - Thứ 6: 8:00 - 17:30</p>
                    <p className="text-zinc-700">Thứ 7: 8:00 - 12:00</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-semibold text-lg mb-4">Theo dõi chúng tôi</h3>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.162 5.656a8.384 8.384 0 01-2.402.658A4.196 4.196 0 0021.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 00-7.126 3.814 11.874 11.874 0 01-8.62-4.37 4.168 4.168 0 00-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 01-1.894-.523v.052a4.185 4.185 0 003.355 4.101 4.21 4.21 0 01-1.89.072A4.185 4.185 0 007.97 16.65a8.394 8.394 0 01-6.191 1.732 11.83 11.83 0 006.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 002.087-2.165z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2">
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Gửi Tin Nhắn</h2>
                <p className="text-zinc-600 mb-6">
                  Điền thông tin vào form dưới đây, chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
                </p>

                <form>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1">
                        Họ và tên
                      </label>
                      <Input id="name" placeholder="Nhập họ và tên" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">
                        Email
                      </label>
                      <Input id="email" type="email" placeholder="Nhập địa chỉ email" />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 mb-1">
                        Số điện thoại
                      </label>
                      <Input id="phone" placeholder="Nhập số điện thoại" />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-zinc-700 mb-1">
                        Chủ đề
                      </label>
                      <Input id="subject" placeholder="Nhập chủ đề" />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-zinc-700 mb-1">
                      Tin nhắn
                    </label>
                    <Textarea id="message" placeholder="Nhập nội dung tin nhắn" rows={5} />
                  </div>

                  <Button type="submit" size="lg" className="w-full md:w-auto">
                    Gửi Tin Nhắn
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-16 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 relative inline-block">
              Bản Đồ
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary"></span>
            </h2>
            <p className="text-zinc-600 max-w-2xl mx-auto mt-6">Tìm đường đến với chúng tôi</p>
          </div>

          <div className="rounded-xl overflow-hidden shadow-sm h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4241674197956!2d106.69945937469967!3d10.777228089387625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4670702e31%3A0xa5777fb3a5bb9972!2zMTIzIEzDqiBM4bujaSwgQsOqzIFuIE5naMOpLCBRdeG6rW4gMSwgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1708956462019!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 relative inline-block">
              Câu Hỏi Thường Gặp
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary"></span>
            </h2>
            <p className="text-zinc-600 max-w-2xl mx-auto mt-6">
              Những câu hỏi thường gặp về sản phẩm và dịch vụ của chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-3">Làm thế nào để chọn máy CNC phù hợp?</h3>
              <p className="text-zinc-700">
                Để chọn máy CNC phù hợp, bạn cần xác định rõ nhu cầu sản xuất, loại vật liệu cần gia công, kích thước
                sản phẩm, độ chính xác yêu cầu và ngân sách. Chúng tôi sẽ tư vấn giúp bạn lựa chọn máy phù hợp nhất.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-3">Thời gian bảo hành máy CNC là bao lâu?</h3>
              <p className="text-zinc-700">
                Thời gian bảo hành tiêu chuẩn cho máy CNC của chúng tôi là 24 tháng. Ngoài ra, chúng tôi còn cung cấp
                các gói bảo hành mở rộng và bảo trì định kỳ để đảm bảo máy hoạt động ổn định lâu dài.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-3">Có cần đào tạo để sử dụng máy CNC không?</h3>
              <p className="text-zinc-700">
                Có, việc đào tạo là cần thiết để vận hành máy CNC hiệu quả và an toàn. Chúng tôi cung cấp dịch vụ đào t
                việc đào tạo là cần thiết để vận hành máy CNC hiệu quả và an toàn. Chúng tôi cung cấp dịch vụ đào tạo
                chuyên nghiệp cho khách hàng sau khi mua máy, bao gồm cả lý thuyết và thực hành trên máy thực tế.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-3">Chi phí bảo trì máy CNC như thế nào?</h3>
              <p className="text-zinc-700">
                Chi phí bảo trì phụ thuộc vào loại máy, tần suất sử dụng và gói dịch vụ bạn lựa chọn. Chúng tôi cung cấp
                các gói bảo trì định kỳ với chi phí cạnh tranh, giúp kéo dài tuổi thọ máy và giảm thiểu thời gian dừng
                máy.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-3">Thời gian giao hàng và lắp đặt mất bao lâu?</h3>
              <p className="text-zinc-700">
                Thời gian giao hàng thông thường từ 2-4 tuần tùy thuộc vào loại máy và tình trạng kho. Thời gian lắp đặt
                và chạy thử từ 2-5 ngày tùy thuộc vào độ phức tạp của máy và điều kiện tại xưởng của khách hàng.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-3">Có hỗ trợ kỹ thuật 24/7 không?</h3>
              <p className="text-zinc-700">
                Có, chúng tôi cung cấp dịch vụ hỗ trợ kỹ thuật 24/7 qua điện thoại và email. Đối với các vấn đề cần hỗ
                trợ trực tiếp, đội ngũ kỹ thuật của chúng tôi sẽ có mặt tại xưởng của bạn trong thời gian sớm nhất.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

