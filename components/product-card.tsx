"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import type { Product } from "@/types/product"

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className = "" }: ProductCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true)

  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0]

  return (
    <div
      className={`bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md ${
        product.isFeatured ? "border-2 border-primary" : "border border-zinc-200"
      } ${className}`}
    >
      <div className="relative">
        <div className="relative h-56 overflow-hidden">
          <Image
            src={primaryImage?.url || "/placeholder.svg?height=224&width=400"}
            alt={primaryImage?.alt || product.name}
            fill
            className={`object-cover transition-transform duration-500 hover:scale-105 ${
              isImageLoading ? "blur-sm" : "blur-0"
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onLoadingComplete={() => setIsImageLoading(false)}
          />
        </div>

        {product.isFeatured && <Badge className="absolute top-3 right-3 bg-primary">Nổi bật</Badge>}

        <Badge variant="outline" className="absolute top-3 left-3 bg-white/90">
          {product.category?.name || "Sản phẩm CNC"}
        </Badge>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold mb-2 hover:text-primary transition-colors">
          <Link href={`/products/${product.slug}`} title={`Xem chi tiết ${product.name}`}>
            {product.name}
          </Link>
        </h3>

        <p className="text-zinc-600 text-sm mb-4 line-clamp-2">{product.shortDescription || product.description}</p>

        <Link href={`/products/${product.slug}`}>
          <Button variant="outline" className="w-full group">
            Xem chi tiết
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

