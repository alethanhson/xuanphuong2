export default function ProductDetailLoading() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image Skeleton */}
          <div>
            <div className="bg-zinc-100 animate-pulse rounded-lg h-[400px]"></div>
            <div className="grid grid-cols-4 gap-2 mt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-zinc-100 animate-pulse rounded-md h-20"></div>
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-4">
            <div className="h-6 bg-zinc-100 animate-pulse rounded-md w-24"></div>
            <div className="h-10 bg-zinc-100 animate-pulse rounded-md w-full"></div>
            <div className="h-20 bg-zinc-100 animate-pulse rounded-md w-full"></div>
            <div className="space-y-2">
              <div className="h-6 bg-zinc-100 animate-pulse rounded-md w-48"></div>
              <div className="h-4 bg-zinc-100 animate-pulse rounded-md w-full"></div>
              <div className="h-4 bg-zinc-100 animate-pulse rounded-md w-full"></div>
              <div className="h-4 bg-zinc-100 animate-pulse rounded-md w-3/4"></div>
            </div>
            <div className="flex gap-4 pt-4">
              <div className="h-10 bg-zinc-100 animate-pulse rounded-md w-40"></div>
              <div className="h-10 bg-zinc-100 animate-pulse rounded-md w-10"></div>
              <div className="h-10 bg-zinc-100 animate-pulse rounded-md w-10"></div>
            </div>
          </div>
        </div>

        {/* Description Skeleton */}
        <div className="mt-12">
          <div className="h-8 bg-zinc-100 animate-pulse rounded-md w-48 mb-6"></div>
          <div className="space-y-2">
            <div className="h-4 bg-zinc-100 animate-pulse rounded-md w-full"></div>
            <div className="h-4 bg-zinc-100 animate-pulse rounded-md w-full"></div>
            <div className="h-4 bg-zinc-100 animate-pulse rounded-md w-full"></div>
            <div className="h-4 bg-zinc-100 animate-pulse rounded-md w-3/4"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

