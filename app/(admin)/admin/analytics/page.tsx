import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDateRangePicker } from "@/components/admin/dashboard/date-range-picker"
import { Button } from "@/components/ui/button"
import { AreaChart } from "@/components/admin/analytics/area-chart"
import { DoughnutChart } from "@/components/admin/analytics/doughnut-chart"
import { VisitorsTable } from "@/components/admin/analytics/visitors-table"
import { ReferrersTable } from "@/components/admin/analytics/referrers-table"
import { PageviewsTable } from "@/components/admin/analytics/pageviews-table"
import { Download, BarChart, PieChart, LineChart, Share2 } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Phân tích & Thống kê</h1>
          <p className="text-muted-foreground mt-1">Phân tích chi tiết về lưu lượng truy cập và hành vi người dùng.</p>
        </div>
        <div className="flex items-center gap-2 flex-col sm:flex-row w-full md:w-auto">
          <CalendarDateRangePicker />
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Xuất dữ liệu
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng lượt xem trang</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">56,842</div>
            <p className="text-xs text-muted-foreground mt-1">+12.5% so với tháng trước</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Người dùng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,462</div>
            <p className="text-xs text-muted-foreground mt-1">+8.2% so với tháng trước</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thời gian trung bình</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3m 42s</div>
            <p className="text-xs text-muted-foreground mt-1">+5.1% so với tháng trước</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỉ lệ thoát</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32.8%</div>
            <p className="text-xs text-muted-foreground mt-1">-2.3% so với tháng trước</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="audience">Đối tượng</TabsTrigger>
            <TabsTrigger value="behavior">Hành vi</TabsTrigger>
            <TabsTrigger value="conversions">Chuyển đổi</TabsTrigger>
          </TabsList>
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <LineChart className="h-4 w-4" />
              Line
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <BarChart className="h-4 w-4" />
              Bar
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <PieChart className="h-4 w-4" />
              Pie
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lượt truy cập</CardTitle>
              <CardDescription>Số lượt truy cập theo thời gian</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <AreaChart />
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Trang được xem nhiều nhất</CardTitle>
                <CardDescription>Top 10 trang được xem nhiều nhất</CardDescription>
              </CardHeader>
              <CardContent>
                <PageviewsTable />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Thiết bị truy cập</CardTitle>
                <CardDescription>Phân bố người dùng theo thiết bị</CardDescription>
              </CardHeader>
              <CardContent>
                <DoughnutChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audience" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Người dùng truy cập</CardTitle>
              <CardDescription>Phân tích chi tiết về người dùng truy cập website</CardDescription>
            </CardHeader>
            <CardContent>
              <VisitorsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nguồn truy cập</CardTitle>
              <CardDescription>Các nguồn truy cập vào website</CardDescription>
            </CardHeader>
            <CardContent>
              <ReferrersTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chuyển đổi</CardTitle>
              <CardDescription>Thống kê chuyển đổi và mục tiêu</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full flex items-center justify-center border rounded-md border-dashed">
                <p className="text-muted-foreground">Kết nối API Analytics để hiển thị dữ liệu chuyển đổi thực tế</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

