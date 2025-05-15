import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import ProductDetail from "./product-detail"
import ProductDetailLoading from "./loading"
import RelatedProducts from "./related-products"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Check, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ConsultationForm from "@/components/consultation-form"
import { ProductService } from "@/lib/services/product.service"

type ProductParams = {
  params: {
    slug: string
  }
}

// Generate metadata dynamically based on product
export async function generateMetadata(
  { params }: ProductParams
): Promise<Metadata> {
  // Phải await params trước khi truy cập thuộc tính của nó
  const slug = await Promise.resolve(params.slug);
  
  try {
    console.log('Generating metadata for slug:', slug);
    const response = await ProductService.getProductBySlug(slug)

    if (response.error || !response.data) {
      console.error('Error generating metadata:', response.error ? (response.error as any).message || 'Unknown error' : 'No product data');
      return {
        title: "Sản phẩm không tồn tại | CNC Future",
        description: "Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.",
      }
    }

    console.log('Metadata generation: product found:', response.data.name || response.data.title);
    const product = response.data

    // Ensure we have valid data for metadata
    const productName = product.name || product.title || 'Sản phẩm CNC';
    const productDescription = product.short_description ||
      (product.description ? product.description.substring(0, 160) : 'Sản phẩm CNC chất lượng cao');

    // Get the primary image or the first image if available
    const productImage = product.images && product.images.length > 0 ?
      product.images.find((img: {isPrimary?: boolean}) => img.isPrimary) || product.images[0] : null;

    return {
      title: `${productName} | CNC Future`,
      description: productDescription,
      openGraph: {
        title: `${productName} | CNC Future`,
        description: productDescription,
        type: "website",
        images: productImage ? [
          {
            url: productImage.url,
            width: 1200,
            height: 630,
            alt: productName,
          }
        ] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: productName,
        description: productDescription,
        images: productImage ? [productImage.url] : [],
      },
    };
  } catch (error) {
    console.error('Error in generateMetadata:', error);
    return {
      title: "Sản phẩm | CNC Future",
      description: "Xem chi tiết sản phẩm CNC chất lượng cao tại CNC Future.",
    };
  }
}

export default async function ProductDetailPage(
  { params }: ProductParams
) {
  // Phải await params trước khi truy cập thuộc tính của nó
  const slug = await Promise.resolve(params.slug);
  
  try {
    console.log('Fetching product detail for slug:', slug);
    const response = await ProductService.getProductBySlug(slug)

    if (response.error || !response.data) {
      console.error('Product not found or error:', response.error ? (response.error as any).message || 'Unknown error' : 'No data');
      notFound()
    }

    console.log('Product fetched successfully:', response.data.name || response.data.title);
    const product = response.data;

    if (!product) {
      // This case should ideally be caught by the notFound() call above,
      // but adding an explicit check for TypeScript safety.
      console.error('Product is undefined after fetch, despite no explicit error.');
      notFound(); // Ensure notFound is called if product is unexpectedly undefined
    }
    
    // Lấy sản phẩm liên quan
    const relatedResponse = await ProductService.getRelatedProducts(product.id, 3);
    const relatedProducts = relatedResponse.data || [];

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
            <span className="text-zinc-900 font-medium">{product.name || product.title}</span>
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
                        <td className="py-3 font-medium">{product.model || "N/A"}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-zinc-600">Kích thước làm việc</td>
                        <td className="py-3 font-medium">{product.workingSize || product.workingDimensions || "N/A"}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-zinc-600">Công suất spindle</td>
                        <td className="py-3 font-medium">{product.motorPower || product.power || "N/A"}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-zinc-600">Tốc độ spindle</td>
                        <td className="py-3 font-medium">{product.spindleSpeed || "N/A"}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-zinc-600">Tốc độ di chuyển</td>
                        <td className="py-3 font-medium">{product.speed || "N/A"}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-zinc-600">Độ chính xác</td>
                        <td className="py-3 font-medium">{
                          product.specificationItems?.find((item: any) => item.name === "Độ chính xác")?.value || 
                          "±0.01mm"
                        }</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 text-zinc-600">Hệ thống điều khiển</td>
                        <td className="py-3 font-medium">{product.controlSystem || "N/A"}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-zinc-600">Phần mềm tương thích</td>
                        <td className="py-3 font-medium">{
                          product.specificationItems?.find((item: any) => item.name === "Phần mềm tương thích")?.value || 
                          "Type3, Artcam, UcanCam"
                        }</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-zinc-600">Định dạng file</td>
                        <td className="py-3 font-medium">{
                          product.specificationItems?.find((item: any) => item.name === "Định dạng file")?.value || 
                          "G-code, NC, DXF, PLT, AI"
                        }</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-zinc-600">Công suất tiêu thụ</td>
                        <td className="py-3 font-medium">{product.power || "N/A"}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-zinc-600">Kích thước máy</td>
                        <td className="py-3 font-medium">{product.dimensions || "N/A"}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-zinc-600">Trọng lượng</td>
                        <td className="py-3 font-medium">{product.weight || "N/A"}</td>
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
                {product.features && Array.isArray(product.features) && product.features.length > 0 ? (
                  product.features.map((feature: any) => (
                    <div key={feature.id} className="mb-6">
                      <h3 className="text-xl font-semibold mb-3">{feature.title || `Tính năng #${feature.id}`}</h3>
                      <p className="text-zinc-700">{feature.description || 'Đang cập nhật thông tin'}</p>
                    </div>
                  ))
                ) : product.highlightItems && product.highlightItems.length > 0 ? (
                  product.highlightItems.map((highlight: any) => (
                    <div key={highlight.id} className="mb-6">
                      <h3 className="text-xl font-semibold mb-3">{highlight.title || `Tính năng #${highlight.id}`}</h3>
                      <p className="text-zinc-700">{highlight.description || 'Đang cập nhật thông tin'}</p>
                    </div>
                  ))
                ) : (
                  <>
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

                    <div className="mb-6">
                      <h3 className="text-xl font-semibold mb-3">Hệ thống làm mát hiệu quả</h3>
                      <p className="text-zinc-700">
                        Hệ thống làm mát bằng nước hoặc không khí, giúp kéo dài tuổi thọ của dao cắt và đảm bảo chất lượng
                        bề mặt gia công.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="applications" className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Ứng dụng</h2>
              <div className="mb-8">
                <p className="text-zinc-700 mb-4">
                  {product.applications || product.application || `${product.name || product.title} được ứng dụng rộng rãi trong các ngành:`}
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-zinc-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Ngành gỗ</h3>
                    <ul className="text-zinc-600 list-disc list-inside space-y-1">
                      <li>Chế tác đồ gỗ nội thất</li>
                      <li>Điêu khắc và trang trí gỗ</li>
                      <li>Sản xuất cửa, tủ bếp</li>
                      <li>Gia công chi tiết gỗ phức tạp</li>
                    </ul>
                  </div>
                  <div className="bg-zinc-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Ngành quảng cáo</h3>
                    <ul className="text-zinc-600 list-disc list-inside space-y-1">
                      <li>Làm biển hiệu, biển quảng cáo</li>
                      <li>Cắt chữ nổi, logo 3D</li>
                      <li>Gia công vật liệu mica, nhựa</li>
                      <li>Trang trí nội ngoại thất</li>
                    </ul>
                  </div>
                  <div className="bg-zinc-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Ngành cơ khí</h3>
                    <ul className="text-zinc-600 list-disc list-inside space-y-1">
                      <li>Chế tạo khuôn mẫu</li>
                      <li>Gia công chi tiết kim loại phi sắt</li>
                      <li>Sản xuất mô hình, prototype</li>
                      <li>Phay, khắc trên nhôm, đồng</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 p-6 rounded-lg">
                <h3 className="font-bold text-xl mb-4">Lợi ích khi sử dụng</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-1.5 mt-0.5">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Tăng năng suất</h4>
                      <p className="text-sm text-zinc-600">Giảm 60-70% thời gian sản xuất so với phương pháp thủ công</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-1.5 mt-0.5">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Độ chính xác cao</h4>
                      <p className="text-sm text-zinc-600">Sai số cực thấp, đảm bảo chất lượng đồng đều</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-1.5 mt-0.5">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Tính linh hoạt cao</h4>
                      <p className="text-sm text-zinc-600">Có thể gia công nhiều loại vật liệu và hình dạng phức tạp</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-1.5 mt-0.5">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Tiết kiệm chi phí</h4>
                      <p className="text-sm text-zinc-600">Giảm phế phẩm, tối ưu hóa sử dụng vật liệu</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Đánh giá từ khách hàng</h2>
              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-6">
                  {product.reviews.map((review: {
                    id: string | number;
                    author: string;
                    avatar?: string;
                    company?: string;
                    date: string;
                    rating: number;
                    comment: string;
                  }) => (
                    <div key={review.id} className="border-b pb-6">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="relative h-12 w-12 rounded-full bg-primary/10 overflow-hidden">
                          {review.avatar ? (
                            <Image src={review.avatar} alt={review.author} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-primary font-bold text-lg">
                              {review.author.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold">{review.author}</h3>
                          <p className="text-sm text-zinc-500">{review.company || 'Khách hàng'} · {review.date}</p>
                        </div>
                      </div>
                      <div className="flex mb-3">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-zinc-300'}`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-zinc-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="text-center py-12">
                    <p className="text-zinc-500 mb-4">Chưa có đánh giá nào cho sản phẩm này</p>
                    <Button>Viết đánh giá đầu tiên</Button>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <Suspense>
          <RelatedProducts productId={product.id} />
        </Suspense>
      )}
    </>
    )
  } catch (error) {
    console.error('Error in ProductDetailPage:', error);
    notFound();
  }
}

