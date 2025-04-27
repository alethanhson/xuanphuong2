"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Mock data for testimonials
const testimonials = [
  {
    id: "1",
    author: "Nguyễn Văn A",
    role: "Giám đốc",
    company: "Xưởng Mộc Thành Công",
    quote:
      "Máy CNC WoodMaster 500 đã giúp chúng tôi tăng tốc độ cắt gỗ lên 2 lần và giảm đáng kể hao phí. Dịch vụ hỗ trợ kỹ thuật của Tân Tiến Vinh luôn sẵn sàng giải quyết mọi vấn đề một cách nhanh chóng.",
    avatar: "/placeholder.svg",
    rating: 5,
  },
  {
    id: "2",
    author: "Trần Thị B",
    role: "Quản lý sản xuất",
    company: "Cơ Khí Tân Tiến",
    quote:
      "Chúng tôi đã sử dụng máy CNC MetalPro 700 được hơn 2 năm và rất hài lòng với hiệu suất làm việc. Đội ngũ kỹ thuật của Tân Tiến Vinh rất chuyên nghiệp, từ tư vấn, lắp đặt đến bảo trì đều tận tâm.",
    avatar: "/placeholder.svg",
    rating: 5,
  },
  {
    id: "3",
    author: "Lê Văn C",
    role: "Chủ xưởng",
    company: "Nội Thất Hiện Đại",
    quote:
      "Đầu tư vào máy CNC của Tân Tiến Vinh là quyết định đúng đắn nhất của chúng tôi. Chất lượng sản phẩm tăng lên đáng kể, thời gian sản xuất giảm và khách hàng rất hài lòng với các sản phẩm tinh xảo.",
    avatar: "/placeholder.svg",
    rating: 4,
  },
  {
    id: "4",
    author: "Phạm Thị D",
    role: "Giám đốc điều hành",
    company: "Quảng Cáo Sáng Tạo",
    quote:
      "Máy CNC Laser của Tân Tiến Vinh đã giúp chúng tôi mở rộng dịch vụ và tăng doanh thu đáng kể. Khả năng cắt và khắc chính xác trên nhiều vật liệu khác nhau là một lợi thế lớn cho công ty chúng tôi.",
    avatar: "/placeholder.svg",
    rating: 5,
  },
]

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  // Auto slide change
  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay])

  // Navigate to previous testimonial
  const prevTestimonial = () => {
    setAutoplay(false)
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  // Navigate to next testimonial
  const nextTestimonial = () => {
    setAutoplay(false)
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="relative">
      <div className="max-w-4xl mx-auto">
        <Card className="border-none shadow-lg">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 relative rounded-full overflow-hidden border-4 border-primary/20 shrink-0">
                <Image
                  src={testimonials[currentIndex].avatar || "/placeholder.svg"}
                  alt={testimonials[currentIndex].author}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex mb-3 md:mb-4 justify-center md:justify-start">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        i < testimonials[currentIndex].rating ? "text-yellow-400" : "text-gray-300"
                      } fill-current`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-base sm:text-lg italic text-zinc-700 mb-4 md:mb-6 text-center md:text-left">
                  "{testimonials[currentIndex].quote}"
                </blockquote>
                <div className="text-center md:text-left">
                  <div className="font-bold text-base sm:text-lg">{testimonials[currentIndex].author}</div>
                  <div className="text-zinc-600 text-sm sm:text-base">
                    {testimonials[currentIndex].role}, {testimonials[currentIndex].company}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation buttons */}
        <div className="flex justify-center mt-4 sm:mt-6 gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevTestimonial}
            aria-label="Previous testimonial"
            className="touch-target"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {testimonials.map((_, index) => (
            <Button
              key={index}
              variant={currentIndex === index ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setAutoplay(false)
                setCurrentIndex(index)
              }}
              aria-label={`Testimonial ${index + 1}`}
              className="w-2 h-8 px-2 touch-target"
            >
              <span className="sr-only">Testimonial {index + 1}</span>
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            onClick={nextTestimonial}
            aria-label="Next testimonial"
            className="touch-target"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

