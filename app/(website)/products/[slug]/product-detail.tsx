"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/types/product"
import { Heart, Share2, Phone } from "lucide-react"

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(product.images.find((img) => img.isPrimary) || product.images[0])

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="relative h-[400px] rounded-lg overflow-hidden border">
              <Image
                src={selectedImage?.url || "/placeholder.svg?height=400&width=600"}
                alt={selectedImage?.alt || product.name}
                fill
                className="object-contain"
              />
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {product.images.map((image) => (
                  <div
                    key={image.id}
                    className={`relative h-20 cursor-pointer rounded-md overflow-hidden border-2 ${
                      selectedImage?.id === image.id ? "border-primary" : "border-transparent"
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <Image src={image.url || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{product.category?.name || "Sản phẩm CNC"}</Badge>
              {product.isFeatured && <Badge>Nổi bật</Badge>}
            </div>

            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            <div className="prose max-w-none mb-6">
              <p className="text-lg">{product.shortDescription}</p>
            </div>

            <div className="space-y-6">
              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Tính năng nổi bật</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature) => (
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
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Mô tả sản phẩm</h2>
          <div className="prose max-w-none">
            <p>{product.description}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

