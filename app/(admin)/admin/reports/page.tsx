import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDateRangePicker } from "@/components/admin/dashboard/date-range-picker"
import { Download, FileText, BarChart3, PieChart, TrendingUp, Share2 } from "lucide-react"
import { SalesBySourceChart } from "@/components/admin/reports/sales-by-source-chart"
import { ProductSalesChart } from "@/components/admin/reports/product-sales-chart"
import { RevenueChart } from "@/components/admin/reports/revenue-chart"

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Báo cáo & Thống kê</h1>
          <p className="text-muted-foreground mt-1">Xem và tạo báo cáo tùy chỉnh về hoạt động kinh doanh</p>
        </div>
        <div className="flex items-center gap-2 flex-col sm:flex-row w-full md:w-auto">
          <CalendarDateRangePicker />
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Doanh số</TabsTrigger>
          <TabsTrigger value="products">Sản phẩm</TabsTrigger>
          <TabsTrigger value="customers">Khách hàng</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Doanh thu theo thời gian</CardTitle>
              <CardDescription>Biểu đồ doanh thu của doanh nghiệp theo thời gian</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <RevenueChart />
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <a href="#" download>
                  <Download className="mr-2 h-4 w-4" />
                  Tải xuống báo cáo chi tiết
                </a>
              </Button>
            </CardFooter>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Doanh số theo nguồn</CardTitle>
                <CardDescription>Phân tích doanh số theo các kênh marketing</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <SalesBySourceChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top sản phẩm bán chạy</CardTitle>
                <CardDescription>Sản phẩm có doanh số cao nhất</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ProductSalesChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo sản phẩm</CardTitle>
              <CardDescription>Thống kê chi tiết về hiệu suất sản phẩm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">Bán hàng theo sản phẩm</span>
                  <span className="text-xs text-muted-foreground">Excel, PDF</span>
                </Button>
                <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <PieChart className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">Phân tích dòng sản phẩm</span>
                  <span className="text-xs text-muted-foreground">Excel, PDF</span>
                </Button>
                <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">Xu hướng sản phẩm</span>
                  <span className="text-xs text-muted-foreground">Excel, PDF</span>
                </Button>
                <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">Báo cáo tùy chỉnh</span>
                  <span className="text-xs text-muted-foreground">Tạo báo cáo mới</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo khách hàng</CardTitle>
              <CardDescription>Phân tích và thống kê về khách hàng</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">Khách hàng mới</span>
                  <span className="text-xs text-muted-foreground">Excel, PDF</span>
                </Button>
                <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <PieChart className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">Phân tích khách hàng</span>
                  <span className="text-xs text-muted-foreground">Excel, PDF</span>
                </Button>
                <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">Giữ chân khách hàng</span>
                  <span className="text-xs text-muted-foreground">Excel, PDF</span>
                </Button>
                <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Share2 className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">Giới thiệu khách hàng</span>
                  <span className="text-xs text-muted-foreground">Excel, PDF</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo marketing</CardTitle>
              <CardDescription>Hiệu quả các chiến dịch marketing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">Hiệu quả chiến dịch</span>
                  <span className="text-xs text-muted-foreground">Excel, PDF</span>
                </Button>
                <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <PieChart className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">Phân tích kênh</span>
                  <span className="text-xs text-muted-foreground">Excel, PDF</span>
                </Button>
                <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">ROI Marketing</span>
                  <span className="text-xs text-muted-foreground">Excel, PDF</span>
                </Button>
                <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">Báo cáo SEO</span>
                  <span className="text-xs text-muted-foreground">Excel, PDF</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

