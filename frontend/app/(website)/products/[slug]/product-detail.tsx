"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import type { Product, ProductImage, ProductFeature } from "@/types/product"
import { Heart, Share2, Phone, Check, FileText, Truck, ShieldCheck, BarChart4, Download } from "lucide-react"
import ConsultationForm from "@/components/consultation-form"

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  // Ensure product has all required fields with fallbacks
  const safeProduct = {
    ...product,
    name: product.name || product.title || 'Sản phẩm',
    description: product.description || '',
    short_description: product.short_description || '',
    images: product.images || [],
    features: product.features || [],
    category: product.category || { name: 'Sản phẩm' },
    specifications: product.specifications || [],
    model: product.model || 'N/A',
    workingDimensions: product.workingSize || 'N/A',
    spindlePower: product.motorPower || product.power || 'N/A',
    spindleSpeed: product.spindleSpeed || 'N/A',
    movementSpeed: product.speed || 'N/A',
    accuracy: product.specifications?.find(spec => spec.name === 'Độ chính xác')?.value || 'N/A',
    controlSystem: product.controlSystem || 'N/A',
    compatibleSoftware: product.specifications?.find(spec => spec.name === 'Phần mềm tương thích')?.value || 'N/A',
    fileFormats: product.specifications?.find(spec => spec.name === 'Định dạng file')?.value || 'N/A',
    powerConsumption: product.power || 'N/A',
    machineDimensions: product.dimensions || 'N/A',
    weight: product.weight || 'N/A',
    warranty: product.warranty || '12 tháng',
    origin: product.origin || 'Nhập khẩu',
    status: product.status === 'PUBLISHED' ? 'Còn hàng' : 'Liên hệ',
    application: product.applications || 'Ứng dụng trong ngành chế biến gỗ, kim loại, nhựa và composite',
    isFeatured: product.isFeatured || false,
    highlightItems: product.highlightItems || [],
    specificationItems: product.specificationItems || [],
  };

  const pathname = usePathname()
  const [selectedImage, setSelectedImage] = useState<ProductImage | undefined>(
    safeProduct.images.find((img: ProductImage) => img.isPrimary) ||
    safeProduct.images[0] ||
    { id: '0', url: '/placeholder.svg' }
  )
  const [copied, setCopied] = useState(false)

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timeout)
    }
  }, [copied])

  // Function to copy product URL to clipboard
  const copyToClipboard = () => {
    const url = window.location.origin + pathname
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopied(true)
        toast({
          title: "Đã sao chép liên kết",
          description: "Liên kết sản phẩm đã được sao chép vào clipboard.",
        })
      })
      .catch(err => {
        console.error('Failed to copy: ', err)
        toast({
          title: "Không thể sao chép",
          description: "Có lỗi xảy ra khi sao chép liên kết.",
          variant: "destructive"
        })
      })
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-zinc-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Product Images */}
            <div>
              <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden border bg-zinc-50">
                <Image
                  src={selectedImage?.url || "/placeholder.svg?height=500&width=700"}
                  alt={safeProduct.name}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                {safeProduct.status && (
                  <Badge className="absolute top-4 left-4" variant={safeProduct.status === 'Còn hàng' ? 'default' : 'secondary'}>
                    {safeProduct.status}
                  </Badge>
                )}
              </div>

              {safeProduct.images.length > 1 && (
                <div className="grid grid-cols-5 gap-2 mt-4">
                  {safeProduct.images.map((image: ProductImage) => (
                    <div
                      key={image.id}
                      className={`relative h-20 cursor-pointer rounded-md overflow-hidden border-2 ${
                        selectedImage?.id === image.id ? "border-primary" : "border-transparent"
                      }`}
                      onClick={() => setSelectedImage(image)}
                    >
                      <Image 
                        src={image.url || "/placeholder.svg"} 
                        alt={`${safeProduct.name} - Hình ${image.id}`} 
                        fill 
                        className="object-cover" 
                        sizes="(max-width: 768px) 20vw, 10vw"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{safeProduct.category?.name || "Sản phẩm CNC"}</Badge>
                {safeProduct.isFeatured && <Badge>Nổi bật</Badge>}
                {safeProduct.origin && (
                  <Badge variant="secondary">{safeProduct.origin}</Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold mb-4">{safeProduct.name}</h1>

              <div className="prose max-w-none mb-6">
                <p className="text-lg text-zinc-700">{safeProduct.short_description || safeProduct.description.substring(0, 160)}</p>
              </div>

              {/* Key specifications */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <svg className="h-3 w-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" role="img">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Model</p>
                    <p className="font-medium">{safeProduct.model}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <svg className="h-3 w-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" role="img">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Kích thước làm việc</p>
                    <p className="font-medium">{safeProduct.workingDimensions}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <svg className="h-3 w-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" role="img">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Công suất</p>
                    <p className="font-medium">{safeProduct.spindlePower}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <svg className="h-3 w-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" role="img">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Độ chính xác</p>
                    <p className="font-medium">{safeProduct.accuracy}</p>
                  </div>
                </div>
              </div>

              {/* Ứng dụng */}
              {safeProduct.application && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Ứng dụng:</h3>
                  <p className="text-zinc-700">{safeProduct.application}</p>
                </div>
              )}

              {/* Benefits */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 bg-zinc-50 p-3 rounded-lg">
                  <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span className="text-sm">Bảo hành {safeProduct.warranty}</span>
                </div>
                <div className="flex items-center gap-2 bg-zinc-50 p-3 rounded-lg">
                  <Truck className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span className="text-sm">Hỗ trợ vận chuyển</span>
                </div>
                <div className="flex items-center gap-2 bg-zinc-50 p-3 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span className="text-sm">Tài liệu kỹ thuật</span>
                </div>
                <div className="flex items-center gap-2 bg-zinc-50 p-3 rounded-lg">
                  <BarChart4 className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span className="text-sm">Hỗ trợ đào tạo</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-auto">
                <div className="flex flex-wrap gap-4 mb-4">
                  <Button className="flex-1 md:flex-none">
                    <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
                    Liên hệ báo giá
                  </Button>
                  <Button variant="outline" size="icon" onClick={copyToClipboard} title="Chia sẻ sản phẩm" aria-label="Chia sẻ sản phẩm">
                    {copied ? <Check className="h-4 w-4 text-green-500" aria-hidden="true" /> : <Share2 className="h-4 w-4" aria-hidden="true" />}
                  </Button>
                  <Button variant="outline" size="icon" title="Lưu sản phẩm" aria-label="Lưu sản phẩm">
                    <Heart className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>

                {/* Download documents */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Download className="mr-1 h-3 w-3" aria-hidden="true" />
                    Catalogue
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Download className="mr-1 h-3 w-3" aria-hidden="true" />
                    Tài liệu kỹ thuật
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Features list */}
          {safeProduct.features && safeProduct.features.length > 0 && (
            <div className="border-t border-zinc-100 p-6 md:p-8">
              <h2 className="text-xl font-bold mb-4">Tính năng nổi bật</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {safeProduct.features.map((feature: ProductFeature) => (
                  <div key={feature.id} className="flex items-start gap-3 bg-zinc-50 p-4 rounded-lg">
                    <div className="rounded-full bg-primary/10 p-1.5 mt-0.5">
                      <svg
                        className="h-4 w-4 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-base mb-1">{feature.title}</h3>
                      <p className="text-sm text-zinc-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Description */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-zinc-100 overflow-hidden p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6">Mô tả sản phẩm</h2>
          <div className="prose max-w-none">
            <p className="whitespace-pre-line">{safeProduct.description}</p>
          </div>
        </div>

        {/* Add consultation form */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-zinc-100 overflow-hidden p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6">Yêu cầu tư vấn</h2>
          <p className="mb-6 text-zinc-600">Vui lòng để lại thông tin liên hệ, chúng tôi sẽ liên hệ với bạn sớm nhất có thể.</p>
          <ConsultationForm 
            productId={product.id} 
            productName={safeProduct.name} 
          />
        </div>
      </div>
    </section>
  )
}

