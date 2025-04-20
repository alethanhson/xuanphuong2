import { ProductService } from "@/lib/product-service"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface RelatedProductsProps {
  productId: string
}

export default async function RelatedProducts({ productId }: RelatedProductsProps) {
  // Get products from the same category
  const response = await ProductService.getProducts({
    limit: 3,
    sortBy: 'newest'
  })

  if (response.error || !response.data || response.data.products.length === 0) {
    return null
  }

  // Filter out the current product and limit to 3 products
  const products = response.data.products
    .filter(product => product.id !== productId)
    .slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-8">Sản phẩm liên quan</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-zinc-200">
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
              <p className="text-zinc-600 mb-4 text-sm sm:text-base">{product.short_description || product.description.substring(0, 100)}</p>
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
    </div>
  )
}

