"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { homeImages } from "@/lib/placeholder-images"

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: "Giải Pháp CNC Toàn Diện",
      subtitle: "Cho Ngành Gỗ & Kim Loại",
      description: "Nâng cao hiệu suất sản xuất với máy móc CNC hiện đại, chất lượng cao và dịch vụ chuyên nghiệp.",
      image: homeImages.hero,
      cta: {
        primary: {
          text: "Khám phá sản phẩm",
          link: "/products",
        },
        secondary: {
          text: "Liên hệ tư vấn",
          link: "/contact",
        },
      },
    },
    {
      title: "Máy CNC Gỗ Chất Lượng Cao",
      subtitle: "Độ Chính Xác Tuyệt Đối",
      description: "Tối ưu hóa quy trình sản xuất đồ gỗ với các dòng máy CNC hiện đại, độ chính xác cao.",
      image: homeImages.productWood1,
      cta: {
        primary: {
          text: "Xem máy CNC gỗ",
          link: "/products?category=wood",
        },
        secondary: {
          text: "Yêu cầu báo giá",
          link: "/contact",
        },
      },
    },
    {
      title: "Máy CNC Kim Loại Hiện Đại",
      subtitle: "Công Nghệ Tiên Tiến",
      description: "Gia công kim loại chính xác với các dòng máy CNC công suất lớn, bền bỉ và đa năng.",
      image: homeImages.productMetal1,
      cta: {
        primary: {
          text: "Xem máy CNC kim loại",
          link: "/products?category=metal",
        },
        secondary: {
          text: "Đặt lịch tư vấn",
          link: "/contact",
        },
      },
    },
  ]

  // Auto slide change
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  // Handle manual slide change
  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <section className="relative bg-zinc-900 overflow-hidden">
      {/* Slides */}
      <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px]">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === index ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image src={slide.image || "/placeholder.svg"} alt={slide.title} fill className="object-cover" priority />
              <div className="absolute inset-0 bg-black/50"></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-3xl text-white">
                  <h1
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 animate-fade-in-up"
                    style={{ animationDelay: "0.2s" }}
                  >
                    {slide.title}
                  </h1>
                  <h2
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-4 text-primary animate-fade-in-up"
                    style={{ animationDelay: "0.4s" }}
                  >
                    {slide.subtitle}
                  </h2>
                  <p
                    className="text-base sm:text-lg md:text-xl text-white/80 mb-6 md:mb-8 animate-fade-in-up"
                    style={{ animationDelay: "0.6s" }}
                  >
                    {slide.description}
                  </p>
                  <div
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in-up"
                    style={{ animationDelay: "0.8s" }}
                  >
                    <Button asChild size="lg" className="gap-2">
                      <Link href={slide.cta.primary.link}>
                        {slide.cta.primary.text}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="gap-2 bg-white/10 hover:bg-white/20 border-white/20"
                    >
                      <Link href={slide.cta.secondary.link}>
                        {slide.cta.secondary.text}
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-[10px] h-[10px] rounded-full transition-all touch-target ${
              currentSlide === index ? "bg-primary w-6" : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block animate-bounce">
        <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/80 rounded-full mt-2 animate-scroll-down"></div>
        </div>
      </div>
    </section>
  )
}

