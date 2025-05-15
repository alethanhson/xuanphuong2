'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Filter, SlidersHorizontal, Search, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ProductFilters } from '@/types/product'
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetClose,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'

// Danh sách các tùy chọn sắp xếp
const SORT_OPTIONS = [
  { name: 'Mới nhất', value: 'newest' },
  { name: 'Giá tăng dần', value: 'price-asc' },
  { name: 'Giá giảm dần', value: 'price-desc' },
  { name: 'Phổ biến nhất', value: 'popular' },
] as const

interface ProductFiltersProps {
  initialFilters?: ProductFilters
  onFilterChange?: (filters: ProductFilters) => void
  categories?: any[]
  selectedCategory?: string
  searchQuery?: string
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'popular'
}

export default function ProductFiltersComponent({
  initialFilters = {},
  onFilterChange,
  categories = [],
  selectedCategory = '',
  searchQuery = '',
  sortBy = 'newest',
}: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Khởi tạo state từ URL hoặc giá trị mặc định
  const [filters, setFilters] = useState<ProductFilters>({
    categorySlug: selectedCategory || searchParams.get('category') || 'all',
    search: searchQuery || searchParams.get('search') || '',
    sortBy: (sortBy || searchParams.get('sort') as ProductFilters['sortBy']) || 'newest',
    page: 1,
    limit: 12,
  })

  // Đếm số bộ lọc đang áp dụng
  const activeFilterCount = [
    filters.categorySlug && filters.categorySlug !== 'all' ? 1 : 0,
    filters.search ? 1 : 0,
    filters.sortBy && filters.sortBy !== 'newest' ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  // Cập nhật URL khi filters thay đổi
  useEffect(() => {
    // Gọi callback khi filters thay đổi nếu có
    if (onFilterChange) {
      onFilterChange(filters)
    }
    
    // Cập nhật URL
    const params = new URLSearchParams()
    
    if (filters.categorySlug && filters.categorySlug !== 'all') {
      params.set('category', filters.categorySlug)
    }
    
    if (filters.search) {
      params.set('search', filters.search)
    }
    
    if (filters.sortBy && filters.sortBy !== 'newest') {
      params.set('sort', filters.sortBy)
    }
    
    const url = `/products${params.toString() ? `?${params.toString()}` : ''}`
    router.push(url, { scroll: false })
  }, [filters, onFilterChange, router])

  // Xử lý thay đổi danh mục
  const handleCategoryChange = (value: string) => {
    setFilters((prev) => ({ ...prev, categorySlug: value, page: 1 }))
  }

  // Xử lý thay đổi sắp xếp
  const handleSortChange = (value: string) => {
    setFilters((prev) => ({ ...prev, sortBy: value as ProductFilters['sortBy'], page: 1 }))
  }

  // Xử lý tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters((prev) => ({ ...prev, page: 1 }))
  }

  // Reset bộ lọc
  const resetFilters = () => {
    setFilters({
      categorySlug: 'all',
      search: '',
      sortBy: 'newest',
      page: 1,
      limit: 12,
    })
  }

  // Hiển thị tên danh mục từ slug
  const getCategoryName = (slug: string) => {
    if (slug === 'all') return 'Tất cả'
    const category = categories.find(c => c.slug === slug)
    return category ? category.name : 'Không xác định'
  }

  return (
    <div className="space-y-4">
      {/* Desktop filters */}
      <div className="hidden md:flex md:flex-wrap md:gap-4 md:items-center">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 flex">
          <div className="relative flex-1 min-w-[280px]">
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              className="pr-10"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            />
            <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0 h-full" aria-label="Tìm kiếm sản phẩm">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>

        {/* Category dropdown */}
        <Select value={filters.categorySlug} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[200px]" aria-label="Chọn danh mục sản phẩm">
            <SelectValue placeholder="Danh mục sản phẩm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.slug} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort dropdown */}
        <Select value={filters.sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]" aria-label="Sắp xếp sản phẩm">
            <SelectValue placeholder="Sắp xếp theo" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset filters button - only show when filters are applied */}
        {activeFilterCount > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1.5" 
            onClick={resetFilters}
          >
            <X className="h-3.5 w-3.5" />
            <span>Xóa bộ lọc</span>
            <Badge variant="secondary" className="ml-1 px-1 py-0 h-5">{activeFilterCount}</Badge>
          </Button>
        )}
      </div>

      {/* Mobile filters */}
      <div className="md:hidden flex gap-2">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              className="pr-10"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            />
            <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0 h-full" aria-label="Tìm kiếm sản phẩm">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10 flex-shrink-0" aria-label="Mở bộ lọc">
              <SlidersHorizontal className="h-5 w-5" />
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="absolute -top-2 -right-2 min-w-5 h-5 flex items-center justify-center p-0">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[60vh]">
            <SheetHeader className="mb-4">
              <SheetTitle>Lọc sản phẩm</SheetTitle>
            </SheetHeader>
            
            <div className="space-y-6 py-2">
              {/* Mobile Category selector */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Danh mục sản phẩm</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={filters.categorySlug === 'all' ? 'default' : 'outline'}
                    className="justify-start"
                    onClick={() => handleCategoryChange('all')}
                  >
                    Tất cả danh mục
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.slug}
                      variant={filters.categorySlug === category.slug ? 'default' : 'outline'}
                      className="justify-start truncate"
                      onClick={() => handleCategoryChange(category.slug)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Mobile Sort options */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Sắp xếp theo</h3>
                <div className="grid grid-cols-2 gap-2">
                  {SORT_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      variant={filters.sortBy === option.value ? 'default' : 'outline'}
                      className="justify-start"
                      onClick={() => handleSortChange(option.value)}
                    >
                      {option.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <Button variant="outline" onClick={resetFilters} className="flex items-center gap-1.5">
                <X className="h-3.5 w-3.5" />
                Xóa bộ lọc
              </Button>
              <SheetClose asChild>
                <Button>Áp dụng</Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Active filter display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center text-sm pt-2">
          <span className="text-zinc-500">Bộ lọc hiện tại:</span>
          <div className="flex flex-wrap gap-2">
            {filters.categorySlug && filters.categorySlug !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1.5">
                Danh mục: {getCategoryName(filters.categorySlug)}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setFilters(prev => ({ ...prev, categorySlug: 'all' }))}
                />
              </Badge>
            )}
            {filters.search && (
              <Badge variant="secondary" className="flex items-center gap-1.5">
                Tìm: "{filters.search}"
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                />
              </Badge>
            )}
            {filters.sortBy && filters.sortBy !== 'newest' && (
              <Badge variant="secondary" className="flex items-center gap-1.5">
                Sắp xếp: {SORT_OPTIONS.find(o => o.value === filters.sortBy)?.name || ''}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setFilters(prev => ({ ...prev, sortBy: 'newest' }))}
                />
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 