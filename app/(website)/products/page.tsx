import type { Metadata } from "next"
import { Suspense } from "react"
import { ProductService } from "@/lib/services/product.service"
import ProductList from "./product-list"
import ProductFilters from "./product-filters"
import ProductsLoading from "./loading"
import PageHeader from "@/components/page-header"
import { constructMetadata } from "@/lib/utils"

export const metadata: Metadata = constructMetadata({
  title: "Sản Phẩm CNC | CNC Future",
  description: "Khám phá các dòng máy CNC hiện đại, được thiết kế đặc biệt cho ngành gỗ và kim loại từ CNC Future.",
  keywords: [
    "máy cnc",
    "cnc gỗ",
    "cnc kim loại",
    "máy cnc laser",
    "thiết bị cnc",
    "phụ kiện cnc",
    "máy khắc cnc",
    "máy cắt cnc"
  ],
  openGraph: {
    title: "Sản Phẩm CNC | CNC Future",
    description: "Khám phá các dòng máy CNC hiện đại, được thiết kế đặc biệt cho ngành gỗ và kim loại từ CNC Future.",
    type: "website",
    url: "https://cncfuture.com/products",
    siteName: "CNC Future",
    images: [
      {
        url: "/products-header.jpg",
        width: 1200,
        height: 630,
        alt: "Sản Phẩm CNC Future",
      },
    ],
  },
})

export const revalidate = 3600 // Revalidate every hour

async function getCategories() {
  const { data: categories, error } = await ProductService.getCategories()
  if (error) return []
  return categories
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Extract search parameters
  const categorySlug = typeof searchParams.category === "string" ? searchParams.category : undefined
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined
  const page = typeof searchParams.page === "string" ? Number.parseInt(searchParams.page) : 1
  const sortBy = typeof searchParams.sortBy === "string" ? searchParams.sortBy : "newest"

  // Fetch categories
  const categories = await getCategories()

  return (
    <>
      <PageHeader
        title="Sản Phẩm CNC"
        description="Khám phá các dòng máy CNC hiện đại, được thiết kế đặc biệt cho ngành gỗ và kim loại"
        backgroundImage="/products-header.jpg"
      />

      <section className="py-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <ProductFilters 
                  categories={categories}
                  selectedCategory={categorySlug} 
                  searchQuery={search} 
                  sortBy={sortBy} 
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <Suspense fallback={<ProductsLoading />}>
                <ProductList 
                  categorySlug={categorySlug} 
                  search={search} 
                  page={page} 
                  sortBy={sortBy} 
                />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

