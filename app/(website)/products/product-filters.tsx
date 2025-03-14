"use client"

import type React from "react"
import type { Database } from "@/types/supabase"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, ChevronUp, Filter } from "lucide-react"

interface ProductFiltersProps {
  categories: Database['public']['Tables']['product_categories']['Row'][]
  selectedCategory?: string
  searchQuery?: string
  sortBy?: string
}

const sortOptions = [
  { id: "newest", name: "Mới nhất" },
  { id: "price-asc", name: "Giá: Thấp đến cao" },
  { id: "price-desc", name: "Giá: Cao đến thấp" },
  { id: "popular", name: "Phổ biến nhất" },
] as const

export default function ProductFilters({ categories, selectedCategory, searchQuery = "", sortBy = "newest" }: ProductFiltersProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [localSearch, setLocalSearch] = useState(searchQuery)

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams()

    if (slug) {
      params.set("category", slug)
    }

    if (searchQuery) {
      params.set("search", searchQuery)
    }

    if (sortBy !== "newest") {
      params.set("sortBy", sortBy)
    }

    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`)
  }

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams()

    if (selectedCategory) {
      params.set("category", selectedCategory)
    }

    if (searchQuery) {
      params.set("search", searchQuery)
    }

    if (value !== "newest") {
      params.set("sortBy", value)
    }

    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()

    if (selectedCategory) {
      params.set("category", selectedCategory)
    }

    if (localSearch) {
      params.set("search", localSearch)
    }

    if (sortBy !== "newest") {
      params.set("sortBy", sortBy)
    }

    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`)
  }

  return (
    <>
      {/* Mobile Filters Toggle */}
      <div className="lg:hidden mb-6">
        <Button
          variant="outline"
          className="w-full flex items-center justify-between"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Bộ lọc
          </span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {/* Filters Content */}
      <div className={`space-y-6 ${isOpen ? "block" : "hidden lg:block"}`}>
        {/* Search */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Tìm kiếm</h3>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="flex-1"
              aria-label="Tìm kiếm sản phẩm"
            />
            <Button type="submit" size="sm">
              Tìm
            </Button>
          </form>
        </div>

        <Separator />

        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Danh mục</h3>
          <div className="space-y-2">
            <div
              className={`cursor-pointer py-1 px-2 rounded-md transition-colors ${
                !selectedCategory ? "bg-primary/10 text-primary font-medium" : "hover:bg-zinc-100"
              }`}
              onClick={() => handleCategoryChange("")}
              role="button"
              tabIndex={0}
              aria-label="Hiển thị tất cả sản phẩm"
            >
              Tất cả sản phẩm
            </div>
            {categories.map((category) => (
              <div
                key={category.id}
                className={`cursor-pointer py-1 px-2 rounded-md transition-colors ${
                  category.slug === selectedCategory
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-zinc-100"
                }`}
                onClick={() => handleCategoryChange(category.slug)}
                role="button"
                tabIndex={0}
                aria-label={`Lọc theo danh mục ${category.name}`}
              >
                {category.name}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Sort */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Sắp xếp theo</h3>
          <RadioGroup value={sortBy} onValueChange={handleSortChange} className="space-y-2">
            {sortOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={`sort-${option.id}`} />
                <Label htmlFor={`sort-${option.id}`}>{option.name}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </>
  )
}

