import { ProductService } from "@/lib/api-services"
import ProductCard from "@/components/product-card"

interface RelatedProductsProps {
  productId: string
}

export default async function RelatedProducts({ productId }: RelatedProductsProps) {
  const response = await ProductService.getRelatedProducts(productId, 3)

  if (response.error || !response.data || response.data.products.length === 0) {
    return null
  }

  const { products } = response.data

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-8">Sản phẩm liên quan</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

