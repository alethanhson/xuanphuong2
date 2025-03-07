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
    features: [
      {
        id: "1",
        title: "Độ chính xác cao",
        description: "Sai số dưới 0.01mm",
      },
      {
        id: "2",
        title: "Tốc độ xử lý nhanh",
        description: "Tối ưu thời gian sản xuất",
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const featured = searchParams.get("featured") === "true"
    const categorySlug = searchParams.get("categorySlug") || undefined
    const search = searchParams.get("search") || undefined

    // Apply filters
    let filteredProducts = [...products]

    if (featured) {
      filteredProducts = filteredProducts.filter((product) => product.isFeatured)
    }

    if (categorySlug) {
      // In a real app, you would join with categories table
      // For now, we'll simulate this with a simple filter
      if (categorySlug === "wood") {
        filteredProducts = filteredProducts.filter((product) => product.categoryId === "1")
      } else if (categorySlug === "metal") {
        filteredProducts = filteredProducts.filter((product) => product.categoryId === "2")
      } else if (categorySlug === "laser") {
        filteredProducts = filteredProducts.filter((product) => product.categoryId === "3")
      }
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) || product.description.toLowerCase().includes(searchLower),
      )
    }

    // Calculate pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    const response: ProductsResponse = {
      products: paginatedProducts,
      total: filteredProducts.length,
      page,
      limit,
      totalPages: Math.ceil(filteredProducts.length / limit),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in products API:", error)
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

