import type { Metadata } from "next"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import PageHeader from "@/components/page-header"
import ConsultationForm from "@/components/consultation-form"

export const metadata: Metadata = {
  title: "Liên Hệ - Tân Tiến Vinh",
  description: "Liên hệ với Tân Tiến Vinh để được tư vấn và hỗ trợ về các sản phẩm, dịch vụ CNC gỗ và kim loại.",
}

export default function ContactPage() {
  return (
    <div className="container py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Liên Hệ Với Chúng Tôi</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Thông Tin Liên Hệ</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-3 h-5 w-5 text-primary shrink-0 mt-0.5"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <div>
                  <p className="font-medium">Điện thoại</p>
                  <p className="text-muted-foreground">0987 654 321</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-3 h-5 w-5 text-primary shrink-0 mt-0.5"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">info@tantienvinh.com</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-3 h-5 w-5 text-primary shrink-0 mt-0.5"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <div>
                  <p className="font-medium">Địa chỉ</p>
                  <p className="text-muted-foreground">123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Giờ Làm Việc</h2>
            <div className="space-y-2">
              <p className="flex justify-between">
                <span className="font-medium">Thứ Hai - Thứ Sáu:</span>
                <span>8:00 - 17:30</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium">Thứ Bảy:</span>
                <span>8:00 - 12:00</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium">Chủ Nhật:</span>
                <span>Nghỉ</span>
              </p>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Bản Đồ</h2>
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5177580119246!2d106.70396791154693!3d10.771594089387611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f40a3b49e59%3A0xa1bd14e483a602db!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBLaW5oIHThur8gVFAuIEhDTQ!5e0!3m2!1svi!2s!4v1619881737149!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
        
        <div>
          <ConsultationForm className="sticky top-8" />
        </div>
      </div>
    </div>
  )
}

