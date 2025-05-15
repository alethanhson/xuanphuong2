export default function ProductsLoading() {
  return (
    <div className="space-y-8">
      <div className="h-12 bg-zinc-100 animate-pulse rounded-md w-full max-w-md"></div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-zinc-100 animate-pulse rounded-lg h-80"></div>
        ))}
      </div>
    </div>
  )
}

