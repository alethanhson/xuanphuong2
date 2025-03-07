import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { ProductService } from "@/lib/api-services"
import ProductDetail from "./product-detail"
import ProductDetailLoading from "./loading"
import RelatedProducts from "./related-products"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Check, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Generate metadata dynamically based on product
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const response = await ProductService.getProductBySlug(params.slug)

  if (response.error || !response.data) {
    return {
      title: "Sản phẩm không tồn tại | CNC Future",
      description: "Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.",
    }
  }

  const product = response.data

  return {
    title: `${product.name} | CNC Future`,
    description: product.shortDescription || product.description.substring(0, 160),
    openGraph: {
      title: `${product.name} | CNC Future`,
      description: product.shortDescription || product.description.substring(0, 160),
      type: "website",
    },
  }
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const response = await ProductService.getProductBySlug(params.slug)

  if (response.error || !response.data) {
    notFound()
  }

  const product = response.data

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-zinc-100 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-zinc-600">
            <Link href="/" className="hover:text-primary">
              Trang chủ
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href="/products" className="hover:text-primary">
              Sản phẩm
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-zinc-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <Suspense fallback={<ProductDetailLoading />}>
        <ProductDetail product={product} />
      </Suspense>

      {/* Product Details Tabs */}
      <section className="py-12 bg-zinc-50">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="w-full max-w-3xl mx-auto grid grid-cols-4 mb-8">
              <TabsTrigger value="specifications">Thông số kỹ thuật</TabsTrigger>
              <TabsTrigger value="features">Tính năng</TabsTrigger>
              <TabsTrigger value="applications">Ứng dụng</TabsTrigger>
              <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
            </TabsList>

            <TabsContent value="specifications" className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Thông số kỹ thuật</h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 text-zinc-600">Model</td>
                        <td className="py-3 font-medium">{product.model || "WM-500"}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-zinc-600">Kích thước làm việc</td>
                        <td className="py-3 font-medium">{product.workingDimensions || "1300 x 2500 x 200mm"}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-zinc-600">Công suất spindle</td>
                        <td className="py-3 font-medium">{product.spindlePower || "5.5kW"}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-zinc-600">Tốc độ spindle</td>
                        <td className="py-3 font-medium">{product.spindleSpeed || "24,000 rpm"}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-zinc-600">Tốc độ di chuyển</td>
                        <td className="py-3 font-medium">{product.movementSpeed || "30m/min"}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-zinc-600">Độ chính xác</td>
                        <td className="py-3 font-medium">{product.accuracy || "±0.01mm"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 text-zinc-600">Hệ thống điều khiển</td>
                        <td className="py-3 font-medium">{product.controlSystem || "DSP Controller"}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-zinc-600">Phần mềm tương thích</td>
                        <td className="py-3 font-medium">{product.compatibleSoftware || "Type3, Artcam, UcanCam"}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-zinc-600">Định dạng file</td>
                        <td className="py-3 font-medium">{product.fileFormats || "G-code, NC, DXF, PLT, AI"}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-zinc-600">Công suất tiêu thụ</td>
                        <td className="py-3 font-medium">{product.powerConsumption || "7.5kW"}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-zinc-600">Kích thước máy</td>
                        <td className="py-3 font-medium">{product.machineDimensions || "3200 x 1800 x 1900mm"}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-zinc-600">Trọng lượng</td>
                        <td className="py-3 font-medium">{product.weight || "1200kg"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Tài liệu kỹ thuật</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Catalogue sản phẩm
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Hướng dẫn sử dụng
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Bảng thông số chi tiết
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Tính năng nổi bật</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Hệ thống điều khiển thông minh</h3>
                    <p className="text-zinc-700">
                      Hệ thống điều khiển DSP hiện đại, dễ dàng sử dụng với giao diện trực quan, hỗ trợ nhiều ngôn ngữ
                      và kết nối USB.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Độ chính xác cao</h3>
                    <p className="text-zinc-700">
                      Sai số chỉ ±0.01mm, đảm bảo các chi tiết được gia công chính xác, đồng đều và tinh xảo.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Tốc độ xử lý nhanh</h3>
                    <p className="text-zinc-700">
                      Tốc độ di chuyển lên đến 30m/phút, giúp tối ưu thời gian sản xuất và tăng năng suất.
                    </p>
                  </div>
                </div>

                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Hệ thống làm mát hiệu quả</h3>
                    <p className="text-zinc-700">
                      Hệ thống làm mát bằng nước hoặc không khí, giúp kéo dài tuổi thọ của dao cắt và đảm bảo chất lượng
                      bề mặt gia công.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Tương thích nhiều phần mềm</h3>
                    <p className="text-zinc-700">
                      Hỗ trợ nhiều phần mềm thiết kế phổ biến như Type3, Artcam, UcanCam và nhiều định dạng file khác
                      nhau.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Hệ thống an toàn tiên tiến</h3>
                    <p className="text-zinc-700">
                      Trang bị các tính năng an toàn như nút dừng khẩn cấp, cảm biến va chạm và bảo vệ quá tải, đảm bảo
                      an toàn cho người vận hành.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <Image src="/feature-1.jpg" alt="Hệ thống điều khiển" fill className="object-cover" />
                </div>
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <Image src="/feature-2.jpg" alt="Độ chính xác cao" fill className="object-cover" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="applications" className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Ứng dụng</h2>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-zinc-50 p-6 rounded-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Nội thất</h3>
                  <p className="text-zinc-600">
                    {product.applications?.furniture || "Sản xuất nội thất, tủ bếp, cửa gỗ, bàn ghế"}
                  </p>
                </div>

                <div className="bg-zinc-50 p-6 rounded-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Trang trí nội thất</h3>
                  <p className="text-zinc-600">
                    {product.applications?.interiorDecoration || "Trang trí nội thất, ốp tường, trần nghệ thuật"}
                  </p>
                </div>

                <div className="bg-zinc-50 p-6 rounded-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Quảng cáo</h3>
                  <p className="text-zinc-600">{product.applications?.advertising || "Biển hiệu, logo, standee"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Ngành công nghiệp gỗ</h3>
                  <ul className="space-y-2">
                    {(
                      product.applications?.woodIndustry || [
                        "Sản xuất đồ nội thất",
                        "Sản xuất cửa gỗ",
                        "Chế tác mỹ nghệ",
                        "Sản xuất tủ bếp",
                      ]
                    ).map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Ngành quảng cáo</h3>
                  <ul className="space-y-2">
                    {(
                      product.applications?.advertisingIndustry || [
                        "Biển hiệu quảng cáo",
                        "Standee",
                        "Bảng hiệu cửa hàng",
                        "Logo công ty",
                      ]
                    ).map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Đánh giá từ khách hàng</h2>

              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-6">
                  {product.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6">
                      <div className="flex items-center gap-2 mb-2">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                        {Array.from({ length: 5 - review.rating }).map((_, i) => (
                          <svg key={i} className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-zinc-700 mb-3">{review.comment}</p>
                      <div className="flex items-center">
                        <div className="font-medium">{review.author}</div>
                        {review.company && (
                          <>
                            <span className="mx-2 text-zinc-400">•</span>
                            <div className="text-zinc-600">{review.company}</div>
                          </>
                        )}
                        <span className="mx-2 text-zinc-400">•</span>
                        <div className="text-zinc-500 text-sm">{new Date(review.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-600">Chưa có đánh giá nào cho sản phẩm này.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Suspense fallback={<div className="h-96 bg-zinc-100 animate-pulse rounded-lg"></div>}>
        <RelatedProducts productId={product.id} />
      </Suspense>
    </>
  )
}

