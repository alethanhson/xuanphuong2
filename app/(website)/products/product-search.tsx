"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface ProductSearchProps {
  initialSearch?: string
  initialSortBy?: string
}

export default function ProductSearch({ initialSearch = "", initialSortBy = "newest" }: ProductSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(initialSearch)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams(searchParams.toString())

    if (search) {
      params.set("search", search)
    } else {
      params.delete("search")
    }

    router.push(`/products?${params.toString()}`)
  }

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value !== "newest") {
      params.set("sortBy", value)
    } else {
      params.delete("sortBy")
    }

    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
      <form onSubmit={handleSearch} className="relative w-full md:w-auto md:min-w-[300px]">
        <Input
          type="search"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pr-10"
        />
        <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
          <Search className="h-4 w-4" />
          <span className="sr-only">Tìm kiếm</span>
        </Button>
      </form>

      <div className="flex items-center gap-2 w-full md:w-auto">
        <span className="text-sm text-zinc-500 whitespace-nowrap">Sắp xếp theo:</span>
        <Select value={initialSortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Sắp xếp theo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mới nhất</SelectItem>
            <SelectItem value="price-asc">Giá: Thấp đến cao</SelectItem>
            <SelectItem value="price-desc">Giá: Cao đến thấp</SelectItem>
            <SelectItem value="popular">Phổ biến nhất</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

