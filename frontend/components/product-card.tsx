"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils"
import type { Product } from "@/types/product"

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const mainImage = product.images?.[0]?.url || "/placeholder.jpg"
  const categoryName = product.category?.name || ""
  const shortDesc = product.short_description || product.description?.slice(0, 100) + "..." || ""
  const finalPrice = product.price
  
  // Chuẩn bị alt text tối ưu cho SEO
  const imageAlt = product.images?.[0]?.alt || `${product.title || product.name} - ${categoryName}`.trim()

  return (
    <div 
      className={cn(
        "group relative bg-white rounded-xl overflow-hidden transition-all duration-300",
        "border border-zinc-200/80 hover:border-primary/50",
        "hover:shadow-lg hover:shadow-primary/5",
        "dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-primary/50",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.slug}`} className="block" aria-label={`Xem chi tiết ${product.title || product.name}`}>
        {/* Image Container */}
        <div className="aspect-[4/3] relative overflow-hidden bg-zinc-100 dark:bg-zinc-800/80">
          <Image
            src={imageError ? "/placeholder.jpg" : mainImage}
            alt={imageAlt}
            fill
            className={cn(
              "object-cover transition-all duration-500",
              isHovered ? "scale-105" : "scale-100"
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImageError(true)}
            priority={!!product.isFeatured}
          />
          
          {/* Hover overlay */}
          <div 
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-black/60 to-black/10 flex items-center justify-center transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0"
            )}
          >
            <Button 
              variant="secondary" 
              size="sm" 
              className={cn(
                "transform transition-all duration-300",
                isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
            >
              <Eye className="w-4 h-4 mr-2" />
              Xem chi tiết
            </Button>
          </div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isFeatured && (
              <Badge className="bg-primary hover:bg-primary/90 border-none text-white gap-1 px-2 py-1">
                <Star className="w-3 h-3 fill-current" />
                Nổi bật
              </Badge>
            )}
            {product.status === "new" && (
              <Badge className="bg-green-500 hover:bg-green-600 border-none text-white px-2 py-1">
                Mới
              </Badge>
            )}
          </div>
          
          {categoryName && (
            <Badge variant="secondary" className="absolute top-3 right-3 bg-white/90 dark:bg-zinc-900/90 border-none">
              {categoryName}
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
            {product.title || product.name}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-2">
            {shortDesc}
          </p>
          <div className="flex items-end justify-between gap-4">
            <div>
              {product.price ? (
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(finalPrice)}
                    </span>
                  </div>
                  {product.price > 0 && (
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      Đã bao gồm VAT
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-0.5">
                  <span className="text-base font-semibold text-primary">
                    Liên hệ báo giá
                  </span>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    Giá ưu đãi
                  </div>
                </div>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className={cn(
                "transition-all duration-300",
                isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
              )}
            >
              Chi tiết
              <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </Link>
    </div>
  )
}

