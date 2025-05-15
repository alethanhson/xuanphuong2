import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Search, Calendar, User, ArrowRight, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import PageHeader from "@/components/page-header"

export const metadata: Metadata = {
  title: "Blog & Tin Tức | CNC Future",
  description: "Chia sẻ kiến thức, kinh nghiệm và câu chuyện thành công trong lĩnh vực CNC từ CNC Future.",
}

export default function BlogPage() {
  return (
    <>
      <PageHeader
        title="Blog & Tin Tức"
        description="Chia sẻ kiến thức, kinh nghiệm và câu chuyện thành công trong lĩnh vực CNC"
        backgroundImage="/blog-header.jpg"
      />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
                  <Input placeholder="Tìm kiếm bài viết..." className="pl-10" />
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-lg mb-4">Danh mục</h3>
                    <ul className="space-y-2">
                      <li>
                        <Link
                          href="/blog/category/cong-nghe-cnc"
                          className="text-zinc-700 hover:text-primary flex items-center justify-between"
                        >
                          <span>Công nghệ CNC</span>
                          <Badge variant="secondary">12</Badge>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/blog/category/huong-dan-ky-thuat"
                          className="text-zinc-700 hover:text-primary flex items-center justify-between"
                        >
                          <span>Hướng dẫn kỹ thuật</span>
                          <Badge variant="secondary">8</Badge>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/blog/category/xu-huong-nganh"
                          className="text-zinc-700 hover:text-primary flex items-center justify-between"
                        >
                          <span>Xu hướng ngành</span>
                          <Badge variant="secondary">5</Badge>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/blog/category/cau-chuyen-thanh-cong"
                          className="text-zinc-700 hover:text-primary flex items-center justify-between"
                        >
                          <span>Câu chuyện thành công</span>
                          <Badge variant="secondary">7</Badge>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/blog/category/tin-tuc-su-kien"
                          className="text-zinc-700 hover:text-primary flex items-center justify-between"
                        >
                          <span>Tin tức & Sự kiện</span>
                          <Badge variant="secondary">10</Badge>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-bold text-lg mb-4">Bài viết nổi bật</h3>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="relative w-20 h-20 rounded-md overflow-hidden shrink-0">
                          <Image src="/blog-1.jpg" alt="Blog thumbnail" fill className="object-cover" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm hover:text-primary">
                            <Link href="#">5 Lý Do Chuyển Đổi Sang CNC Gỗ</Link>
                          </h4>
                          <p className="text-zinc-500 text-xs mt-1">15/03/2025</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="relative w-20 h-20 rounded-md overflow-hidden shrink-0">
                          <Image src="/blog-2.jpg" alt="Blog thumbnail" fill className="object-cover" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm hover:text-primary">
                            <Link href="#">Cách Bảo Trì Máy CNC Kim Loại</Link>
                          </h4>
                          <p className="text-zinc-500 text-xs mt-1">02/03/2025</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="relative w-20 h-20 rounded-md overflow-hidden shrink-0">
                          <Image src="/blog-3.jpg" alt="Blog thumbnail" fill className="object-cover" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm hover:text-primary">
                            <Link href="#">Xu Hướng Công Nghệ CNC 2025</Link>
                          </h4>
                          <p className="text-zinc-500 text-xs mt-1">25/02/2025</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-bold text-lg mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="hover:bg-primary hover:text-white cursor-pointer">
                        CNC
                      </Badge>
                      <Badge variant="outline" className="hover:bg-primary hover:text-white cursor-pointer">
                        Máy gỗ
                      </Badge>
                      <Badge variant="outline" className="hover:bg-primary hover:text-white cursor-pointer">
                        Máy kim loại
                      </Badge>
                      <Badge variant="outline" className="hover:bg-primary hover:text-white cursor-pointer">
                        Công nghệ
                      </Badge>
                      <Badge variant="outline" className="hover:bg-primary hover:text-white cursor-pointer">
                        Bảo trì
                      </Badge>
                      <Badge variant="outline" className="hover:bg-primary hover:text-white cursor-pointer">
                        Xu hướng
                      </Badge>
                      <Badge variant="outline" className="hover:bg-primary hover:text-white cursor-pointer">
                        Sản xuất
                      </Badge>
                      <Badge variant="outline" className="hover:bg-primary hover:text-white cursor-pointer">
                        Nội thất
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Blog Posts */}
            <div className="lg:col-span-3">
              {/* Featured Post */}
              <div className="mb-12 bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="grid md:grid-cols-2">
                  <div className="relative h-64 md:h-auto">
                    <Image src="/blog-featured.jpg" alt="Featured blog post" fill className="object-cover" />
                  </div>
                  <div className="p-6 md:p-8">
                    <Badge className="mb-4">Xu Hướng</Badge>
                    <h2 className="text-2xl font-bold mb-4 hover:text-primary">
                      <Link href="/blog/xu-huong-cong-nghe-cnc-2025">
                        Xu Hướng Công Nghệ CNC 2025: Tự Động Hóa và AI
                      </Link>
                    </h2>
                    <p className="text-zinc-600 mb-4">
                      Khám phá những công nghệ mới nhất trong lĩnh vực CNC sẽ định hình ngành công nghiệp trong năm tới,
                      từ tự động hóa hoàn toàn đến ứng dụng trí tuệ nhân tạo trong quy trình sản xuất.
                    </p>
                    <div className="flex items-center text-sm text-zinc-500 mb-6">
                      <div className="flex items-center mr-4">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>25/02/2025</span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <span>Nguyễn Văn A</span>
                      </div>
                    </div>
                    <Button className="group">
                      Đọc tiếp
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Blog Posts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <div className="relative h-48">
                    <Image src="/blog-1.jpg" alt="Blog post" fill className="object-cover" />
                    <Badge className="absolute top-3 left-3">Công Nghệ</Badge>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 hover:text-primary">
                      <Link href="/blog/5-ly-do-chuyen-doi-sang-cnc-go">5 Lý Do Chuyển Đổi Sang CNC Gỗ</Link>
                    </h3>
                    <p className="text-zinc-600 mb-4">
                      Tìm hiểu vì sao máy CNC gỗ đang trở thành xu hướng tất yếu trong sản xuất nội thất hiện đại và
                      những lợi ích mà nó mang lại.
                    </p>
                    <div className="flex items-center text-sm text-zinc-500 mb-4">
                      <div className="flex items-center mr-4">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>15/03/2025</span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <span>Trần Thị B</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full group">
                      Đọc tiếp
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>

                <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <div className="relative h-48">
                    <Image src="/blog-2.jpg" alt="Blog post" fill className="object-cover" />
                    <Badge className="absolute top-3 left-3">Hướng Dẫn</Badge>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 hover:text-primary">
                      <Link href="/blog/cach-bao-tri-may-cnc-kim-loai">Cách Bảo Trì Máy CNC Kim Loại</Link>
                    </h3>
                    <p className="text-zinc-600 mb-4">
                      Mẹo kéo dài tuổi thọ máy móc và đảm bảo chất lượng gia công kim loại luôn ổn định với các bước bảo
                      trì định kỳ.
                    </p>
                    <div className="flex items-center text-sm text-zinc-500 mb-4">
                      <div className="flex items-center mr-4">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>02/03/2025</span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <span>Lê Văn C</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full group">
                      Đọc tiếp
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>

                <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <div className="relative h-48">
                    <Image src="/blog-3.jpg" alt="Blog post" fill className="object-cover" />
                    <Badge className="absolute top-3 left-3">Xu Hướng</Badge>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 hover:text-primary">
                      <Link href="/blog/xu-huong-cong-nghe-cnc-2025">Xu Hướng Công Nghệ CNC 2025</Link>
                    </h3>
                    <p className="text-zinc-600 mb-4">
                      Khám phá những công nghệ mới nhất trong lĩnh vực CNC sẽ định hình ngành công nghiệp trong năm tới.
                    </p>
                    <div className="flex items-center text-sm text-zinc-500 mb-4">
                      <div className="flex items-center mr-4">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>25/02/2025</span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <span>Nguyễn Văn A</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full group">
                      Đọc tiếp
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>

                <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <div className="relative h-48">
                    <Image src="/blog-4.jpg" alt="Blog post" fill className="object-cover" />
                    <Badge className="absolute top-3 left-3">Câu Chuyện</Badge>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 hover:text-primary">
                      <Link href="/blog/cau-chuyen-thanh-cong-cua-xuong-moc-thanh-cong">
                        Câu Chuyện Thành Công Của Xưởng Mộc Thành Công
                      </Link>
                    </h3>
                    <p className="text-zinc-600 mb-4">
                      Xưởng Mộc Thành Công đã tăng năng suất 40% sau khi đầu tư máy CNC WoodMaster 500. Hãy cùng tìm
                      hiểu câu chuyện của họ.
                    </p>
                    <div className="flex items-center text-sm text-zinc-500 mb-4">
                      <div className="flex items-center mr-4">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>10/02/2025</span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <span>Phạm Thị D</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full group">
                      Đọc tiếp
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>

                <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <div className="relative h-48">
                    <Image src="/blog-5.jpg" alt="Blog post" fill className="object-cover" />
                    <Badge className="absolute top-3 left-3">Sự Kiện</Badge>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 hover:text-primary">
                      <Link href="/blog/trien-lam-cong-nghe-cnc-2025">Triển Lãm Công Nghệ CNC 2025</Link>
                    </h3>
                    <p className="text-zinc-600 mb-4">
                      CNC Future sẽ tham gia Triển lãm Công nghệ CNC 2025 tại TP.HCM. Đến và trải nghiệm những công nghệ
                      mới nhất.
                    </p>
                    <div className="flex items-center text-sm text-zinc-500 mb-4">
                      <div className="flex items-center mr-4">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>05/02/2025</span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <span>Hoàng Văn E</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full group">
                      Đọc tiếp
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>

                <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <div className="relative h-48">
                    <Image src="/blog-6.jpg" alt="Blog post" fill className="object-cover" />
                    <Badge className="absolute top-3 left-3">Hướng Dẫn</Badge>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 hover:text-primary">
                      <Link href="/blog/huong-dan-su-dung-phan-mem-cnc">Hướng Dẫn Sử Dụng Phần Mềm CNC</Link>
                    </h3>
                    <p className="text-zinc-600 mb-4">
                      Tìm hiểu cách sử dụng các phần mềm thiết kế và điều khiển CNC phổ biến như Type3, Artcam, UcanCam.
                    </p>
                    <div className="flex items-center text-sm text-zinc-500 mb-4">
                      <div className="flex items-center mr-4">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>01/02/2025</span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <span>Lê Văn C</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full group">
                      Đọc tiếp
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-12">
                <nav className="flex items-center gap-1">
                  <Button variant="outline" size="icon" disabled aria-label="Trang trước">
                    <ChevronDown className="h-4 w-4 rotate-90" />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-primary text-white hover:bg-primary/90">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <span className="px-2">...</span>
                  <Button variant="outline" size="sm">
                    8
                  </Button>
                  <Button variant="outline" size="icon" aria-label="Trang sau">
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

