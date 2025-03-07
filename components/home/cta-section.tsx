import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Phone } from "lucide-react"

export default function CTASection() {
  return (
    <section className="py-12 sm:py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Sẵn Sàng Nâng Cấp Công Nghệ CNC?</h2>
          <p className="text-base sm:text-lg text-white/80 mb-6 sm:mb-8">
            Liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí về giải pháp CNC phù hợp nhất cho doanh nghiệp
            của bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 gap-2">
              <Link href="/contact">
                <Phone className="h-4 w-4" />
                Liên hệ tư vấn
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10 gap-2">
              <Link href="/products">
                Khám phá sản phẩm
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

