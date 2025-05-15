import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductsTable } from "@/components/admin/products/products-table"

export default function ProductsPage() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý sản phẩm</h1>
          <p className="text-muted-foreground mt-1">Quản lý tất cả sản phẩm trên trang web của bạn.</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm sản phẩm mới
          </Link>
        </Button>
      </div>

      <ProductsTable />
    </div>
  )
}

