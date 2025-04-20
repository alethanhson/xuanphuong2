"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { homeImages } from "@/lib/placeholder-images"
import type { Product } from "@/lib/data-service"

// Fallback data in case no products are provided
const fallbackProducts = [
  {
    id: "1",
    name: "CNC WoodMaster 500",
    slug: "cnc-woodmaster-500",
    category: { name: "Máy CNC Gỗ", slug: "wood" },
    description: "Máy CNC gỗ hiện đại với độ chính xác cao, tốc độ xử lý nhanh.",
    images: [{ url: homeImages.productWood1, is_primary: true }],
    features: [
      { id: "1", title: "Kích thước làm việc", description: "1300 x 2500 x 200mm" },
      { id: "2", title: "Công suất spindle", description: "5.5kW" },
      { id: "3", title: "Tốc độ spindle", description: "24,000 rpm" },
    ],
  },
  {
    id: "2",
    name: "CNC MetalPro 700",
    slug: "cnc-metalpro-700",
    category: { name: "Máy CNC Kim Loại", slug: "metal" },
    description: "Máy CNC kim loại công suất lớn, gia công chính xác các chi tiết kim loại.",
    images: [{ url: homeImages.productMetal1, is_primary: true }],
    features: [
      { id: "1", title: "Kích thước làm việc", description: "1500 x 3000 x 200mm" },
      { id: "2", title: "Công suất spindle", description: "7.5kW" },
      { id: "3", title: "Tốc độ spindle", description: "18,000 rpm" },
    ],
  },
  {
    id: "3",
    name: "CNC LaserTech 500",
    slug: "cnc-lasertech-500",
    category: { name: "Máy CNC Laser", slug: "laser" },
    description: "Máy CNC laser hiện đại, cho phép cắt và khắc với độ chính xác cực cao.",
    images: [{ url: homeImages.productLaser1, is_primary: true }],
    features: [
      { id: "1", title: "Kích thước làm việc", description: "1300 x 900mm" },
      { id: "2", title: "Công suất laser", description: "150W" },
      { id: "3", title: "Tốc độ cắt", description: "0-40000mm/min" },
    ],
  },
]

interface FeaturedProductsProps {
  products?: Product[]
}

export default function FeaturedProducts({ products = [] }: FeaturedProductsProps) {
  // Use provided products or fallback to mock data if empty
  const productList = products.length > 0 ? products : fallbackProducts

  const [currentIndex, setCurrentIndex] = useState(0)
  const productsPerPage = 3
  const totalPages = Math.ceil(productList.length / productsPerPage)

  // Navigate to previous page
  const prevPage = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalPages - 1 : prev - 1))
  }

  // Navigate to next page
  const nextPage = () => {
    setCurrentIndex((prev) => (prev === totalPages - 1 ? 0 : prev + 1))
  }

  // Calculate current visible products
  const visibleProducts = () => {
    const start = currentIndex * productsPerPage
    return productList.slice(start, start + productsPerPage)
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {visibleProducts().map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-zinc-200"
          >
            <div className="relative h-48 sm:h-56 md:h-64">
              <Image
                src={product.images?.[0]?.url || "/placeholder.svg?height=224&width=400"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <Badge className="absolute top-3 left-3 bg-white/90">{product.category?.name || 'Sản phẩm'}</Badge>
            </div>
            <div className="p-4 sm:p-5">
              <h3 className="text-lg sm:text-xl font-bold mb-2 hover:text-primary transition-colors">
                <Link href={`/products/${product.slug}`}>{product.name}</Link>
              </h3>
              <p className="text-zinc-600 mb-4 text-sm sm:text-base">{product.description}</p>
              <ul className="space-y-1 mb-4 text-xs sm:text-sm">
                {product.features?.map((feature) => (
                  <li key={feature.id} className="text-zinc-600 flex items-start gap-2">
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>{feature.title}:</strong> {feature.description}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="w-full group">
                <Link href={`/products/${product.slug}`}>
                  Xem chi tiết
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 sm:mt-8 gap-2">
          <Button variant="outline" size="icon" onClick={prevPage} aria-label="Previous page" className="touch-target">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }).map((_, index) => (
            <Button
              key={index}
              variant={currentIndex === index ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Page ${index + 1}`}
              className="touch-target"
            >
              {index + 1}
            </Button>
          ))}
          <Button variant="outline" size="icon" onClick={nextPage} aria-label="Next page" className="touch-target">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

