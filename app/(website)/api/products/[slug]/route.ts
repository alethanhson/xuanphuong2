import { type NextRequest, NextResponse } from "next/server"
import type { Product } from "@/types/product"

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
      {
        id: "2",
        url: "/product-wood-1-2.jpg",
        alt: "CNC WoodMaster 500 - Góc nhìn khác",
        isPrimary: false,
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
    specifications: [
      {
        id: "1",
        name: "Kích thước làm việc",
        value: "1300 x 2500 x 200mm",
      },
      {
        id: "2",
        name: "Công suất spindle",
        value: "5.5kW",
      },
    ],
    reviews: [
      {
        id: "1",
        author: "Nguyễn Văn A",
        company: "Xưởng Mộc Thành Công",
        rating: 5,
        comment: "Máy CNC WoodMaster 500 đã giúp chúng tôi tăng tốc độ cắt gỗ lên 2 lần và giảm đáng kể hao phí.",
        date: "2023-03-15",
      },
    ],
    isFeatured: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    model: "WM-500",
    workingDimensions: "1300 x 2500 x 200mm",
    spindlePower: "5.5kW",
    spindleSpeed: "24,000 rpm",
    movementSpeed: "30m/min",
    accuracy: "±0.01mm",
    controlSystem: "DSP Controller",
    compatibleSoftware: "Type3, Artcam, UcanCam",
    fileFormats: "G-code, NC, DXF, PLT, AI",
    powerConsumption: "7.5kW",
    machineDimensions: "3200 x 1800 x 1900mm",
    weight: "1200kg",
    applications: {
      furniture: "Sản xuất nội thất, tủ bếp, cửa gỗ, bàn ghế",
      interiorDecoration: "Trang trí nội thất, ốp tường, trần nghệ thuật",
      advertising: "Biển hiệu, logo, standee",
      woodIndustry: ["Sản xuất đồ nội thất", "Sản xuất cửa gỗ", "Chế tác mỹ nghệ", "Sản xuất tủ bếp"],
      advertisingIndustry: ["Biển hiệu quảng cáo", "Standee", "Bảng hiệu cửa hàng", "Logo công ty"],
    },
  },
  // Other products would be here
]

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug

    // Find the product by slug
    const product = products.find((p) => p.slug === slug)

    if (!product) {
      return NextResponse.json({ error: { code: "NOT_FOUND", message: "Product not found" } }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error in product detail API:", error)
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

