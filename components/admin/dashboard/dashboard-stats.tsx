import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Users, DollarSign, Store, CreditCard } from "lucide-react"

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng khách truy cập</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">15,432</div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center">
            <span className="text-green-500 flex items-center mr-1">
              <ArrowUp className="h-3 w-3 mr-1" />
              12.5%
            </span>
            so với tháng trước
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Đơn báo giá</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">234</div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center">
            <span className="text-green-500 flex items-center mr-1">
              <ArrowUp className="h-3 w-3 mr-1" />
              8.2%
            </span>
            so với tháng trước
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Doanh số</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12.5 tỷ</div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center">
            <span className="text-green-500 flex items-center mr-1">
              <ArrowUp className="h-3 w-3 mr-1" />
              18.2%
            </span>
            so với tháng trước
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tỉ lệ chuyển đổi</CardTitle>
          <Store className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3.2%</div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center">
            <span className="text-red-500 flex items-center mr-1">
              <ArrowDown className="h-3 w-3 mr-1" />
              0.5%
            </span>
            so với tháng trước
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

