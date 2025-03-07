import { Package2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CalendarDateRangePicker } from "@/components/admin/dashboard/date-range-picker"

export function DashboardHeader() {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-primary/10 p-2">
            <Package2 className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <p className="text-muted-foreground mt-1">Xem tổng quan hoạt động kinh doanh và thống kê trang web của bạn.</p>
      </div>
      <div className="flex items-center gap-2 flex-col sm:flex-row w-full md:w-auto">
        <CalendarDateRangePicker />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Xuất dữ liệu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Chọn định dạng</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Excel (.xlsx)</DropdownMenuItem>
            <DropdownMenuItem>CSV (.csv)</DropdownMenuItem>
            <DropdownMenuItem>PDF (.pdf)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

