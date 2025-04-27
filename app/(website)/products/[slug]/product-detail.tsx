"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import type { Product } from "@/lib/product-service"
import { Heart, Share2, Phone, Check } from "lucide-react"
import ConsultationForm from "@/components/consultation-form"

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  // Ensure product has all required fields with fallbacks
  const safeProduct = {
    ...product,
    name: product.name || 'Sản phẩm',
    description: product.description || '',
    short_description: product.short_description || '',
    images: product.images || [],
    features: product.features || [],
    category: product.category || { name: 'Sản phẩm' }
  };

  const pathname = usePathname()
  const [selectedImage, setSelectedImage] = useState(
    safeProduct.images.find((img) => img.is_primary) ||
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="relative h-[400px] rounded-lg overflow-hidden border">
              <Image
                src={selectedImage?.url || "/placeholder.svg?height=400&width=600"}
                alt={safeProduct.name} /* Always use product name as alt text */
                fill
                className="object-contain"
              />
            </div>

            {safeProduct.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {safeProduct.images.map((image) => (
                  <div
                    key={image.id}
                    className={`relative h-20 cursor-pointer rounded-md overflow-hidden border-2 ${
                      selectedImage?.id === image.id ? "border-primary" : "border-transparent"
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <Image src={image.url || "/placeholder.svg"} alt={safeProduct.name} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{safeProduct.category?.name || "Sản phẩm CNC"}</Badge>
              {safeProduct.isFeatured && <Badge>Nổi bật</Badge>}
            </div>

            <h1 className="text-3xl font-bold mb-4">{safeProduct.name}</h1>

            <div className="prose max-w-none mb-6">
              <p className="text-lg">{safeProduct.short_description || safeProduct.description.substring(0, 160)}</p>
            </div>

            <div className="space-y-6">
              {/* Features */}
              {safeProduct.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Tính năng nổi bật</h3>
                  <ul className="space-y-2">
                    {safeProduct.features.map((feature) => (
                      <li key={feature.id} className="flex items-start gap-2">
                        <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                          <svg
                            className="h-3 w-3 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>
                          <strong>{feature.title}:</strong> {feature.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-4">
                <Button className="flex-1 md:flex-none">
                  <Phone className="mr-2 h-4 w-4" />
                  Liên hệ báo giá
                </Button>
                <Button variant="outline" size="icon" onClick={copyToClipboard} title="Chia sẻ sản phẩm">
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Add consultation form */}
            <div className="mt-8">
              <ConsultationForm 
                productId={product.id} 
                productName={product.name} 
              />
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Mô tả sản phẩm</h2>
          <div className="prose max-w-none">
            <p>{safeProduct.description}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

