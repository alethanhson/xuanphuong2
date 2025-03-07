import { type NextRequest, NextResponse } from "next/server"
import type { ProductsResponse, Product } from "@/types/product"

// Mock data for demonstration
const products: Product[] = [
  {
    id: "1",
    name: "CNC WoodMaster 500",
    slug: "cnc-woodmaster-500",
    description: "Dòng máy gia công gỗ đa năng, tốc độ cao, cho phép cắt khắc các sản phẩm nội thất tinh xảo.",
    shortDescription: "Máy CNC gỗ hiện đại với độ chính xác cao",
    categoryId: "1",
    images: [
      {
        id: "1",
        url: "/product-wood-1.jpg",
        alt: "CNC WoodMaster 500",
        isPrimary: true,
      },
    ],
    isFeatured: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "CNC MetalPro 700",
    slug: "cnc-metalpro-700",
    description: "Công suất lớn, gia công chính xác các chi tiết kim loại. Thiết kế chắc chắn, bền bỉ.",
    shortDescription: "Máy CNC kim loại công suất lớn",
    categoryId: "2",
    images: [
      {
        id: "2",
        url: "/product-metal-1.jpg",
        alt: "CNC MetalPro 700",
        isPrimary: true,
      },
    ],
    isFeatured: false,
    createdAt: "2023-01-02T00:00:00Z",
    updatedAt: "2023-01-02T00:00:00Z",
  },
  {
    id: "3",
    name: "CNC LaserTech 500",
    slug: "cnc-lasertech-500",
    description: "Công nghệ laser tiên tiến, cho phép cắt và khắc với độ chính xác cực cao trên nhiều vật liệu.",
    shortDescription: "Máy CNC laser hiện đại",
    categoryId: "3",
    images: [
      {
        id: "3",
        url: "/product-laser-1.jpg",
        alt: "CNC LaserTech 500",
        isPrimary: true,
      },
    ],
    isFeatured: true,
    createdAt: "2023-01-03T00:00:00Z",
    updatedAt: "2023-01-03T00:00:00Z",
  },
]

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "3")

    // Find the product by slug
    const product = products.find((p) => p.slug === params.slug)

    if (!product) {
      return NextResponse.json({ error: { code: "NOT_FOUND", message: "Product not found" } }, { status: 404 })
    }

    // Get related products (same category, excluding the current product)
    let relatedProducts = products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id)

    // If not enough related products in the same category, add some from other categories
    if (relatedProducts.length < limit) {
      const otherProducts = products.filter((p) => p.categoryId !== product.categoryId && p.id !== product.id)
      relatedProducts = [...relatedProducts, ...otherProducts].slice(0, limit)
    } else {
      relatedProducts = relatedProducts.slice(0, limit)
    }

    const response: ProductsResponse = {
      products: relatedProducts,
      total: relatedProducts.length,
      page: 1,
      limit,
      totalPages: 1,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in related products API:", error)
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while processing your request",
        },
      },
      { status: 500 },
    )
  }
}

