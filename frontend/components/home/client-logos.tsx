"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

// Client logos data
const clientLogos = [
  { id: "1", name: "Client 1", logo: "/placeholder.svg" },
  { id: "2", name: "Client 2", logo: "/placeholder.svg" },
  { id: "3", name: "Client 3", logo: "/placeholder.svg" },
  { id: "4", name: "Client 4", logo: "/placeholder.svg" },
  { id: "5", name: "Client 5", logo: "/placeholder.svg" },
  { id: "6", name: "Client 6", logo: "/placeholder.svg" },
]

export default function ClientLogos() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Infinite scroll animation
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scrollWidth = container.scrollWidth
    const clientWidth = container.clientWidth

    if (scrollWidth <= clientWidth) return

    let scrollPos = 0
    const scrollSpeed = 0.5

    const scroll = () => {
      scrollPos += scrollSpeed
      if (scrollPos >= scrollWidth / 2) {
        scrollPos = 0
      }
      if (container) {
        container.scrollLeft = scrollPos
      }
      requestAnimationFrame(scroll)
    }

    const animation = requestAnimationFrame(scroll)

    return () => cancelAnimationFrame(animation)
  }, [])

  return (
    <div className="relative overflow-hidden py-2">
      {/* Gradient overlays for smooth fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 z-10 bg-gradient-to-r from-zinc-50 to-transparent"></div>
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 z-10 bg-gradient-to-l from-zinc-50 to-transparent"></div>

      <div
        ref={containerRef}
        className="flex items-center gap-8 sm:gap-12 overflow-x-auto scrollbar-hide py-3 sm:py-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Double the logos for infinite scroll effect */}
        {[...clientLogos, ...clientLogos].map((client, index) => (
          <div key={`${client.id}-${index}`} className="flex-shrink-0">
            <Image
              src={client.logo || "/placeholder.svg"}
              alt={client.name}
              width={150}
              height={60}
              className="h-8 sm:h-10 md:h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

