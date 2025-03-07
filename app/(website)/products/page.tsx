import type { Metadata } from "next"
import { Suspense } from "react"
import ProductList from "./product-list"
import ProductFilters from "./product-filters"
import ProductsLoading from "./loading"
import PageHeader from "@/components/page-header"

export const metadata: Metadata = {
  title: "Sản Phẩm CNC | CNC Future",
  description: "Khám phá các dòng máy CNC hiện đại, được thiết kế đặc biệt cho ngành gỗ và kim loại từ CNC Future.",
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Extract search parameters
  const categorySlug = typeof searchParams.category === "string" ? searchParams.category : undefined
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined
  const page = typeof searchParams.page === "string" ? Number.parseInt(searchParams.page) : 1
  const sortBy = typeof searchParams.sortBy === "string" ? searchParams.sortBy : "newest"

  return (
    <>
      <PageHeader
        title="Sản Phẩm CNC"
        description="Khám phá các dòng máy CNC hiện đại, được thiết kế đặc biệt cho ngành gỗ và kim loại"
        backgroundImage="/products-header.jpg"
      />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <ProductFilters selectedCategory={categorySlug} searchQuery={search} sortBy={sortBy} />
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <Suspense fallback={<ProductsLoading />}>
                <ProductList categorySlug={categorySlug} search={search} page={page} sortBy={sortBy} />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

