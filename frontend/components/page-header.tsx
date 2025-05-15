import Image from "next/image"

interface PageHeaderProps {
  title: string
  description?: string
  backgroundImage?: string
}

export default function PageHeader({
  title,
  description,
  backgroundImage = "/placeholder.svg?height=400&width=1920",
}: PageHeaderProps) {
  return (
    <div className="relative">
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image src={backgroundImage || "/placeholder.svg"} alt={title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <div className="container px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">{title}</h1>
          {description && <p className="text-lg text-white/90 max-w-2xl mx-auto">{description}</p>}
        </div>
      </div>
    </div>
  )
}

