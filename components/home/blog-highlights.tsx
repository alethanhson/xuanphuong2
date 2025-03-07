import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { homeImages } from "@/lib/placeholder-images"

// Mock data for blog posts
const blogPosts = [
  {
    id: "1",
    title: "5 Lý Do Chuyển Đổi Sang CNC Gỗ Hiện Đại",
    slug: "5-ly-do-chuyen-doi-sang-cnc-go-hien-dai",
    excerpt:
      "Khám phá những lợi ích mà máy CNC gỗ hiện đại mang lại cho doanh nghiệp của bạn, từ tăng năng suất đến nâng cao chất lượng sản phẩm.",
    image: homeImages.blog1,
    category: "Công Nghệ CNC",
    categorySlug: "cong-nghe-cnc",
    author: "Nguyễn Văn A",
    publishedAt: "2023-05-15T00:00:00Z",
    readTime: 5,
  },
  {
    id: "2",
    title: "Hướng Dẫn Bảo Trì Máy CNC Kim Loại Đúng Cách",
    slug: "huong-dan-bao-tri-may-cnc-kim-loai-dung-cach",
    excerpt:
      "Bài viết chia sẻ các bước bảo trì máy CNC kim loại đúng cách để kéo dài tuổi thọ và đảm bảo hiệu suất làm việc tối ưu.",
    image: homeImages.blog2,
    category: "Bảo Trì",
    categorySlug: "bao-tri",
    author: "Trần Văn B",
    publishedAt: "2023-06-22T00:00:00Z",
    readTime: 8,
  },
  {
    id: "3",
    title: "Xu Hướng Công Nghệ CNC 2025: Tự Động Hóa và AI",
    slug: "xu-huong-cong-nghe-cnc-2025-tu-dong-hoa-va-ai",
    excerpt:
      "Khám phá những xu hướng công nghệ CNC mới nhất sẽ định hình ngành công nghiệp trong năm 2025, với trọng tâm là tự động hóa và trí tuệ nhân tạo.",
    image: homeImages.blog3,
    category: "Xu Hướng",
    categorySlug: "xu-huong",
    author: "Lê Thị C",
    publishedAt: "2023-07-10T00:00:00Z",
    readTime: 6,
  },
]

export default function BlogHighlights() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {blogPosts.map((post) => (
        <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <div className="relative h-40 sm:h-48">
            <Image
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <Badge className="absolute top-3 left-3 bg-white/90">{post.category}</Badge>
          </div>
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-zinc-500 mb-2 sm:mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{post.readTime} phút đọc</span>
              </div>
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 hover:text-primary transition-colors line-clamp-2">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h3>
            <p className="text-zinc-600 mb-4 text-sm sm:text-base line-clamp-3">{post.excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <User className="h-3 w-3 sm:h-4 sm:w-4 text-zinc-500" />
                <span>{post.author}</span>
              </div>
              <Button asChild variant="ghost" size="sm" className="gap-1 hover:text-primary">
                <Link href={`/blog/${post.slug}`}>
                  Đọc tiếp
                  <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

