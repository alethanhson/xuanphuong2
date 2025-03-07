import { ProductService } from "@/lib/api-services"
import ProductCard from "@/components/product-card"
import ProductSearch from "./product-search"
import Pagination from "@/components/pagination"
import type { ProductFilters } from "@/types/product"

interface ProductListProps {
  categorySlug?: string
  search?: string
  page?: number
  sortBy?: string
}

export default async function ProductList({ categorySlug, search, page = 1, sortBy = "newest" }: ProductListProps) {
  // Prepare filters
  const filters: ProductFilters = {
    categorySlug,
    search,
    page,
    limit: 9,
    sortBy: sortBy as any,
  }

  // Fetch products
  const response = await ProductService.getProducts(filters)

  if (response.error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-bold mb-2">Đã xảy ra lỗi</h3>
        <p className="text-zinc-600">{response.error.message}</p>
      </div>
    )
  }

  const { products, total, totalPages } = response.data || { products: [], total: 0, totalPages: 0 }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-bold mb-2">Không tìm thấy sản phẩm</h3>
        <p className="text-zinc-600">Vui lòng thử lại với bộ lọc khác</p>
      </div>
    )
  }

  return (
    <>
      {/* Search and Sort */}
      <ProductSearch initialSearch={search} initialSortBy={sortBy} />

      {/* Products */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} baseUrl="/products" preserveParams={true} />
      )}
    </>
  )
}

