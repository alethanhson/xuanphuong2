import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function CTASectionV2() {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-r from-primary to-blue-600 text-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Sẵn sàng nâng cấp công nghệ sản xuất?</h2>
            <p className="mb-8 text-lg">
              Hãy liên hệ ngay với chúng tôi để được tư vấn và nhận giải pháp tốt nhất cho nhu cầu sản xuất của bạn. Đội
              ngũ chuyên gia của chúng tôi sẽ hỗ trợ bạn từ khâu tư vấn đến triển khai.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Liên Hệ Ngay
              </Button>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                Xem Demo
              </Button>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                    <Image
                      src={`/avatar-${i}.jpg`}
                      alt={`Customer ${i}`}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <p className="font-semibold">Hơn 500+ khách hàng</p>
                <p className="text-white/80">đã tin tưởng chúng tôi</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-white/10 rounded-lg"></div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-lg"></div>
            <div className="relative bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20">
              <h3 className="text-xl font-bold mb-4">Đăng ký nhận tư vấn miễn phí</h3>
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Họ và tên"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Số điện thoại"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </div>
                <div>
                  <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30">
                    <option value="" className="bg-zinc-800">
                      Bạn quan tâm đến sản phẩm nào?
                    </option>
                    <option value="wood" className="bg-zinc-800">
                      Máy CNC Gỗ
                    </option>
                    <option value="metal" className="bg-zinc-800">
                      Máy CNC Kim Loại
                    </option>
                    <option value="other" className="bg-zinc-800">
                      Sản phẩm khác
                    </option>
                  </select>
                </div>
                <Button className="w-full bg-white text-primary hover:bg-white/90">Gửi Yêu Cầu</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

