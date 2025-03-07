"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowDown,
  ArrowUp,
  CreditCard,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  Calendar,
  TrendingUp,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { AreaChart, BarChart } from "@/components/admin/charts"
import { useFetch } from "@/hooks/use-api"
import { dashboardService } from "@/lib/api"
import type { DashboardStats, ChartData, CategoryChartData, Order, Customer } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState("7days")

  // Fetch dashboard data
  const { data: stats, isLoading: statsLoading } = useFetch<DashboardStats>(dashboardService.getStats, undefined, {
    initialData: {
      revenue: 152500000,
      revenueChange: 12.5,
      orders: 45,
      ordersChange: 8.2,
      customers: 28,
      customersChange: 15.3,
      products: 32,
      productsChange: -5.2,
    },
    dependencies: [dateRange],
  })

  const { data: revenueData, isLoading: revenueLoading } = useFetch<ChartData[]>(
    dashboardService.getRevenueChart,
    undefined,
    {
      initialData: [
        { name: "Tháng 1", total: 18000000 },
        { name: "Tháng 2", total: 22000000 },
        { name: "Tháng 3", total: 25000000 },
        { name: "Tháng 4", total: 19000000 },
        { name: "Tháng 5", total: 28000000 },
        { name: "Tháng 6", total: 32000000 },
        { name: "Tháng 7", total: 35000000 },
        { name: "Tháng 8", total: 40000000 },
        { name: "Tháng 9", total: 38000000 },
        { name: "Tháng 10", total: 42000000 },
        { name: "Tháng 11", total: 45000000 },
        { name: "Tháng 12", total: 50000000 },
      ],
      dependencies: [dateRange],
    },
  )

  const { data: categoryData, isLoading: categoryLoading } = useFetch<CategoryChartData[]>(
    dashboardService.getCategoryChart,
    undefined,
    {
      initialData: [
        { name: "Máy CNC Gỗ", value: 45 },
        { name: "Máy CNC Kim Loại", value: 25 },
        { name: "Máy CNC Laser", value: 20 },
        { name: "Phụ kiện CNC", value: 10 },
      ],
      dependencies: [dateRange],
    },
  )

  const { data: recentOrders, isLoading: ordersLoading } = useFetch<Order[]>(
    dashboardService.getRecentOrders,
    undefined,
    {
      initialData: [
        {
          id: "1",
          orderNumber: "ORD-001",
          customerId: "1",
          customer: { name: "Nguyễn Văn A", email: "nguyenvana@example.com" } as Customer,
          items: [],
          status: "completed",
          totalAmount: 12500000,
          paymentMethod: "bank_transfer",
          paymentStatus: "paid",
          shippingAddress: {} as any,
          billingAddress: {} as any,
          createdAt: "2023-11-05T12:00:00",
          updatedAt: "2023-11-05T12:00:00",
        },
        {
          id: "2",
          orderNumber: "ORD-002",
          customerId: "2",
          customer: { name: "Trần Thị B", email: "tranthib@example.com" } as Customer,
          items: [],
          status: "processing",
          totalAmount: 8900000,
          paymentMethod: "cod",
          paymentStatus: "pending",
          shippingAddress: {} as any,
          billingAddress: {} as any,
          createdAt: "2023-11-04T15:30:00",
          updatedAt: "2023-11-04T15:30:00",
        },
        {
          id: "3",
          orderNumber: "ORD-003",
          customerId: "3",
          customer: { name: "Lê Văn C", email: "levanc@example.com" } as Customer,
          items: [],
          status: "pending",
          totalAmount: 5600000,
          paymentMethod: "bank_transfer",
          paymentStatus: "pending",
          shippingAddress: {} as any,
          billingAddress: {} as any,
          createdAt: "2023-11-04T09:15:00",
          updatedAt: "2023-11-04T09:15:00",
        },
        {
          id: "4",
          orderNumber: "ORD-004",
          customerId: "4",
          customer: { name: "Phạm Thị D", email: "phamthid@example.com" } as Customer,
          items: [],
          status: "completed",
          totalAmount: 15200000,
          paymentMethod: "bank_transfer",
          paymentStatus: "paid",
          shippingAddress: {} as any,
          billingAddress: {} as any,
          createdAt: "2023-11-03T14:45:00",
          updatedAt: "2023-11-03T14:45:00",
        },
        {
          id: "5",
          orderNumber: "ORD-005",
          customerId: "5",
          customer: { name: "Hoàng Văn E", email: "hoangvane@example.com" } as Customer,
          items: [],
          status: "processing",
          totalAmount: 7800000,
          paymentMethod: "cod",
          paymentStatus: "pending",
          shippingAddress: {} as any,
          billingAddress: {} as any,
          createdAt: "2023-11-03T11:20:00",
          updatedAt: "2023-11-03T11:20:00",
        },
      ],
      dependencies: [dateRange],
    },
  )

  const { data: topCustomers, isLoading: customersLoading } = useFetch<Customer[]>(
    dashboardService.getTopCustomers,
    undefined,
    {
      initialData: [
        {
          id: "1",
          name: "Nguyễn Văn A",
          email: "nguyenvana@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          totalSpent: 12500000,
          createdAt: "",
          updatedAt: "",
        },
        {
          id: "2",
          name: "Trần Thị B",
          email: "tranthib@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          totalSpent: 8900000,
          createdAt: "",
          updatedAt: "",
        },
        {
          id: "3",
          name: "Lê Văn C",
          email: "levanc@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          totalSpent: 5600000,
          createdAt: "",
          updatedAt: "",
        },
        {
          id: "4",
          name: "Phạm Thị D",
          email: "phamthid@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          totalSpent: 15200000,
          createdAt: "",
          updatedAt: "",
        },
        {
          id: "5",
          name: "Hoàng Văn E",
          email: "hoangvane@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          totalSpent: 7800000,
          createdAt: "",
          updatedAt: "",
        },
      ],
      dependencies: [dateRange],
    },
  )

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Tổng quan về hoạt động kinh doanh của bạn</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn khoảng thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hôm nay</SelectItem>
              <SelectItem value="yesterday">Hôm qua</SelectItem>
              <SelectItem value="7days">7 ngày qua</SelectItem>
              <SelectItem value="30days">30 ngày qua</SelectItem>
              <SelectItem value="90days">90 ngày qua</SelectItem>
              <SelectItem value="thisYear">Năm nay</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-36" />
            ) : (
              <>
                <div className="text-2xl font-bold">{formatCurrency(stats?.revenue || 0)}</div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span
                    className={`flex items-center ${stats?.revenueChange && stats.revenueChange > 0 ? "text-emerald-500" : "text-rose-500"}`}
                  >
                    {stats?.revenueChange && stats.revenueChange > 0 ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(stats?.revenueChange || 0)}%
                  </span>
                  <span>so với tháng trước</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đơn hàng</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.orders}</div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span
                    className={`flex items-center ${stats?.ordersChange && stats.ordersChange > 0 ? "text-emerald-500" : "text-rose-500"}`}
                  >
                    {stats?.ordersChange && stats.ordersChange > 0 ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(stats?.ordersChange || 0)}%
                  </span>
                  <span>so với tháng trước</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách hàng mới</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.customers}</div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span
                    className={`flex items-center ${stats?.customersChange && stats.customersChange > 0 ? "text-emerald-500" : "text-rose-500"}`}
                  >
                    {stats?.customersChange && stats.customersChange > 0 ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(stats?.customersChange || 0)}%
                  </span>
                  <span>so với tháng trước</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sản phẩm đã bán</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.products}</div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span
                    className={`flex items-center ${stats?.productsChange && stats.productsChange > 0 ? "text-emerald-500" : "text-rose-500"}`}
                  >
                    {stats?.productsChange && stats.productsChange > 0 ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(stats?.productsChange || 0)}%
                  </span>
                  <span>so với tháng trước</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="analytics">Phân tích</TabsTrigger>
          <TabsTrigger value="reports">Báo cáo</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Doanh thu theo tháng</CardTitle>
                <CardDescription>Biểu đồ doanh thu theo tháng trong năm</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                {revenueLoading ? (
                  <Skeleton className="h-[350px] w-full" />
                ) : (
                  <AreaChart
                    data={revenueData || []}
                    height={350}
                    valueFormatter={(value: number) => formatCurrency(value)}
                  />
                )}
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Phân bố sản phẩm theo danh mục</CardTitle>
                <CardDescription>Tỷ lệ phân bố sản phẩm theo từng danh mục</CardDescription>
              </CardHeader>
              <CardContent>
                {categoryLoading ? (
                  <Skeleton className="h-[350px] w-full" />
                ) : (
                  <BarChart data={categoryData || []} height={350} valueFormatter={(value: number) => `${value}%`} />
                )}
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Đơn hàng gần đây</CardTitle>
                <CardDescription>Danh sách các đơn hàng mới nhất</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã đơn</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead className="hidden md:table-cell">Ngày đặt</TableHead>
                      <TableHead className="text-right">Số tiền</TableHead>
                      <TableHead className="text-right">Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ordersLoading
                      ? Array(5)
                          .fill(0)
                          .map((_, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Skeleton className="h-5 w-16" />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-5 w-24" />
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <Skeleton className="h-5 w-24" />
                              </TableCell>
                              <TableCell className="text-right">
                                <Skeleton className="h-5 w-20 ml-auto" />
                              </TableCell>
                              <TableCell className="text-right">
                                <Skeleton className="h-5 w-20 ml-auto" />
                              </TableCell>
                            </TableRow>
                          ))
                      : recentOrders?.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.orderNumber}</TableCell>
                            <TableCell>{order.customer?.name}</TableCell>
                            <TableCell className="hidden md:table-cell">{formatDate(order.createdAt)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(order.totalAmount)}</TableCell>
                            <TableCell className="text-right">
                              <Badge
                                variant={
                                  order.status === "completed"
                                    ? "default"
                                    : order.status === "processing"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {order.status === "completed"
                                  ? "Hoàn thành"
                                  : order.status === "processing"
                                    ? "Đang xử lý"
                                    : "Chờ xác nhận"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Khách hàng hàng đầu</CardTitle>
                <CardDescription>Khách hàng có giá trị đơn hàng cao nhất</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {customersLoading
                    ? Array(5)
                        .fill(0)
                        .map((_, index) => (
                          <div key={index} className="flex items-center">
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <div className="ml-4 space-y-1">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-4 w-20 ml-auto" />
                          </div>
                        ))
                    : topCustomers?.map((customer) => (
                        <div key={customer.id} className="flex items-center">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={customer.avatar} alt="Avatar" />
                            <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">{customer.name}</p>
                            <p className="text-sm text-muted-foreground">{customer.email}</p>
                          </div>
                          <div className="ml-auto font-medium">{formatCurrency(customer.totalSpent)}</div>
                        </div>
                      ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tỷ lệ chuyển đổi</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.6%</div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span className="flex items-center text-emerald-500">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    0.5%
                  </span>
                  <span>so với tháng trước</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lượt xem trang</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,543</div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span className="flex items-center text-emerald-500">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    12.2%
                  </span>
                  <span>so với tháng trước</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Giá trị đơn hàng trung bình</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3,250,000 ₫</div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span className="flex items-center text-emerald-500">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    8.3%
                  </span>
                  <span>so với tháng trước</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Phân tích chi tiết</CardTitle>
              <CardDescription>Thông tin chi tiết về hiệu suất kinh doanh</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Đang phát triển tính năng phân tích chi tiết...</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo</CardTitle>
              <CardDescription>Xem và tải xuống các báo cáo</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Đang phát triển tính năng báo cáo...</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông báo</CardTitle>
              <CardDescription>Quản lý thông báo hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Đang phát triển tính năng thông báo...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

