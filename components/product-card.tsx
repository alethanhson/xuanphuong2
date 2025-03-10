"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star } from "lucide-react"
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
  const shortDesc = product.short_description || product.description.slice(0, 100) + "..."

  return (
    <div 
      className={cn(
        "group relative bg-white rounded-2xl overflow-hidden transition-all duration-300",
        "border border-zinc-200/80 hover:border-primary/30",
        "hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]",
        "dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-primary/30",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="aspect-[4/3] relative overflow-hidden bg-zinc-50 dark:bg-zinc-800">
          <Image
            src={imageError ? "/placeholder.jpg" : mainImage}
            alt={product.name}
            fill
            className={cn(
              "object-cover transition-all duration-500",
              isHovered ? "scale-110 blur-[2px]" : "scale-100"
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
            priority
          />
          <div className={cn(
            "absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            <Button variant="secondary" size="sm" className="transform translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
              Xem chi tiết
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_featured && (
              <Badge className="bg-primary/90 hover:bg-primary border-none text-white gap-1">
                <Star className="w-3 h-3 fill-current" />
                Nổi bật
              </Badge>
            )}
          </div>
          {categoryName && (
            <Badge variant="outline" className="absolute top-3 right-3 bg-white/90 dark:bg-zinc-900/90">
              {categoryName}
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">
            {shortDesc}
          </p>
          <div className="flex items-end justify-between gap-4">
            <div>
              {product.price ? (
                <div className="space-y-1">
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(product.price)}
                  </span>
                  {product.price > 0 && (
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      Đã bao gồm VAT
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-lg font-semibold text-primary">
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
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </Link>
    </div>
  )
}

