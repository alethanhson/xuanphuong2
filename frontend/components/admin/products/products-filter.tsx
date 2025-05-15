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

