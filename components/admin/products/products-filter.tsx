"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Check, ChevronDown, Filter } from "lucide-react"
import { useState } from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"

const categories = [
  { id: "1", name: "Máy CNC Gỗ" },
  { id: "2", name: "Máy CNC Kim Loại" },
  { id: "3", name: "Máy CNC Laser" },
  { id: "4", name: "Phụ kiện CNC" },
]

const statuses = [
  { id: "active", name: "Đang bán" },
  { id: "outOfStock", name: "Hết hàng" },
  { id: "draft", name: "Bản nháp" },
]

export function ProductsFilter() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [date, setDate] = useState<Date | undefined>(undefined)

  const toggleCategory = (id: string) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== id))
    } else {
      setSelectedCategories([...selectedCategories, id])
    }
  }

  const toggleStatus = (id: string) => {
    if (selectedStatuses.includes(id)) {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== id))
    } else {
      setSelectedStatuses([...selectedStatuses, id])
    }
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedStatuses([])
    setDate(undefined)
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-1">
            <Filter className="h-4 w-4 mr-1" />
            Danh mục
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Chọn danh mục</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {categories.map((category) => (
            <DropdownMenuCheckboxItem
              key={category.id}
              checked={selectedCategories.includes(category.id)}
              onCheckedChange={() => toggleCategory(category.id)}
            >
              {category.name}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-1">
            Trạng thái
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Chọn trạng thái</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {statuses.map((status) => (
            <DropdownMenuCheckboxItem
              key={status.id}
              checked={selectedStatuses.includes(status.id)}
              onCheckedChange={() => toggleStatus(status.id)}
            >
              {status.name}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-1">
            <CalendarIcon className="h-4 w-4 mr-1" />
            {date ? format(date, "dd/MM/yyyy", { locale: vi }) : "Ngày tạo"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
        </PopoverContent>
      </Popover>

      {(selectedCategories.length > 0 || selectedStatuses.length > 0 || date) && (
        <Button variant="ghost" onClick={clearFilters} className="gap-1">
          Xóa bộ lọc
        </Button>
      )}

      <div className="flex flex-wrap gap-1 mt-2">
        {selectedCategories.map((id) => (
          <Badge key={id} variant="secondary" className="gap-1">
            {categories.find((c) => c.id === id)?.name}
            <button onClick={() => toggleCategory(id)}>
              <Check className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        {selectedStatuses.map((id) => (
          <Badge key={id} variant="secondary" className="gap-1">
            {statuses.find((s) => s.id === id)?.name}
            <button onClick={() => toggleStatus(id)}>
              <Check className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        {date && (
          <Badge variant="secondary" className="gap-1">
            {format(date, "dd/MM/yyyy", { locale: vi })}
            <button onClick={() => setDate(undefined)}>
              <Check className="h-3 w-3" />
            </button>
          </Badge>
        )}
      </div>
    </div>
  )
}

