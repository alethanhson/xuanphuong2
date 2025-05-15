import ProductCard from "@/components/product-card"
import ProductSearch from "./product-search"
import Pagination from "@/components/pagination"
import { ProductService } from "@/lib/services/product.service"
import { Product } from "@/types/product"
import { AlertCircle, Search } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ProductListProps {
  categorySlug?: string
  search?: string
  page?: number
  sortBy?: string
}

export default async function ProductList({ categorySlug, search, page = 1, sortBy = "newest" }: ProductListProps) {
  // Prepare filters
  const filters = {
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
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Đã xảy ra lỗi khi tải sản phẩm</AlertTitle>
        <AlertDescription>
          {response.error instanceof Error ? response.error.message : 'Không thể tải sản phẩm. Vui lòng thử lại sau.'}
        </AlertDescription>
      </Alert>
    )
  }

  // Đảm bảo response.data có giá trị mặc định đúng cấu trúc
  const data = response.data || { products: [], total: 0, totalPages: 0 };
  const products = Array.isArray(data.products) ? data.products : [];
  const total = data.total || 0;
  const totalPages = data.totalPages || 0;

  if (products.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-zinc-50 dark:bg-zinc-800/20 rounded-xl border border-zinc-100 dark:border-zinc-800">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
          <Search className="h-6 w-6 text-zinc-600 dark:text-zinc-400" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">Không tìm thấy sản phẩm</h3>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto">
          {search 
            ? `Không tìm thấy sản phẩm nào phù hợp với từ khóa "${search}".` 
            : categorySlug 
              ? "Không có sản phẩm nào trong danh mục này." 
              : "Không tìm thấy sản phẩm nào. Vui lòng thử lại với bộ lọc khác."}
        </p>
        <div className="mt-6">
          <a href="/products" className="text-sm font-medium text-primary hover:text-primary/80">
            Xem tất cả sản phẩm
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search input - only show on larger screens since this is hidden on mobile */}
      <div className="lg:hidden">
        <ProductSearch initialSearch={search} initialSortBy={sortBy} />
      </div>
      
      {/* Results summary */}
      <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400 py-2 border-b border-zinc-100 dark:border-zinc-800">
        <p>
          Hiển thị <span className="font-medium text-zinc-900 dark:text-zinc-200">{products.length}</span> trên tổng số <span className="font-medium text-zinc-900 dark:text-zinc-200">{total}</span> sản phẩm
        </p>
        <div className="hidden md:block">
          <ProductSearch initialSearch={search} initialSortBy={sortBy} />
        </div>
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: Product) => (
          <ProductCard 
            key={product.id} 
            product={product}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} baseUrl="/products" preserveParams={true} />
        </div>
      )}
    </div>
  )
}

