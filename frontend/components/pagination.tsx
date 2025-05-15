"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  preserveParams?: boolean
}

export default function Pagination({ currentPage, totalPages, baseUrl, preserveParams = false }: PaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createPageUrl = (page: number) => {
    if (!preserveParams) {
      return `${baseUrl}?page=${page}`
    }

    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    return `${baseUrl}?${params.toString()}`
  }

  return (
    <div className="flex justify-center items-center gap-1 sm:gap-2 mt-6 sm:mt-8 flex-wrap">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage <= 1}
        asChild={currentPage > 1}
        className="touch-target"
      >
        {currentPage > 1 ? (
          <Link href={createPageUrl(currentPage - 1)} aria-label="Previous page">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        ) : (
          <span>
            <ChevronLeft className="h-4 w-4" />
          </span>
        )}
      </Button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
        // On mobile, only show a limited range of pages
        const isMobile = typeof window !== "undefined" && window.innerWidth < 640
        const range = isMobile ? 1 : 2

        if (page === 1 || page === totalPages || (page >= currentPage - range && page <= currentPage + range)) {
          return (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              asChild={page !== currentPage}
              className="touch-target"
            >
              {page !== currentPage ? <Link href={createPageUrl(page)}>{page}</Link> : <span>{page}</span>}
            </Button>
          )
        }

        // Show ellipsis for skipped pages
        if (page === currentPage - range - 1 || page === currentPage + range + 1) {
          return (
            <span key={page} className="px-2">
              &hellip;
            </span>
          )
        }

        return null
      })}

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage >= totalPages}
        asChild={currentPage < totalPages}
        className="touch-target"
      >
        {currentPage < totalPages ? (
          <Link href={createPageUrl(currentPage + 1)} aria-label="Next page">
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span>
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </Button>
    </div>
  )
}

