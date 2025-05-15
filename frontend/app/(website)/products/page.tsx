import type { Metadata } from "next"
import { Suspense } from "react"
import ProductList from "./product-list"
import ProductFilters from "./product-filters"
import ProductsLoading from "./loading"
import PageHeader from "@/components/page-header"
import { constructMetadata } from "@/lib/utils"
import { ProductService } from "@/lib/services/product.service"
import { Category } from "@/types"

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

type SortByType = "newest" | "price-asc" | "price-desc" | "popular";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Extract search parameters
  const awaitedSearchParams = await searchParams
  const categorySlug = typeof awaitedSearchParams.category === "string" ? awaitedSearchParams.category : undefined
  const search = typeof awaitedSearchParams.search === "string" ? awaitedSearchParams.search : undefined
  const page = typeof awaitedSearchParams.page === "string" ? Number.parseInt(awaitedSearchParams.page) : 1
  const sortBy = typeof awaitedSearchParams.sortBy === "string" ? 
    (awaitedSearchParams.sortBy as SortByType) : "newest"

  // Fetch categories
  const categories = await getCategories()

  return (
    <>
      <PageHeader
        title="Sản Phẩm CNC"
        description="Khám phá các dòng máy CNC hiện đại, được thiết kế đặc biệt cho ngành gỗ và kim loại"
        backgroundImage="/products-header.jpg"
      />

      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-4 sm:p-6 mb-8 border border-zinc-100 dark:border-zinc-800">
            <ProductFilters 
              categories={categories}
              selectedCategory={categorySlug} 
              searchQuery={search} 
              sortBy={sortBy}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Filters - Only on desktop */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="sticky top-24 bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-4 sm:p-6 border border-zinc-100 dark:border-zinc-800">
                <h2 className="text-lg font-semibold mb-4">Danh mục sản phẩm</h2>
                <div className="space-y-2">
                  <a 
                    href="/products" 
                    className={`block px-3 py-2 rounded-lg transition-colors ${!categorySlug ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                  >
                    Tất cả sản phẩm
                  </a>
                  {categories.map((category: Category) => (
                    <a 
                      key={category.slug} 
                      href={`/products?category=${category.slug}`}
                      className={`block px-3 py-2 rounded-lg transition-colors ${categorySlug === category.slug ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                    >
                      {category.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-9">
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

