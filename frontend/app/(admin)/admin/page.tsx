"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Clock,
  Download,
  Eye,
  Layers,
  LogOut,
  UserCheck,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { AreaChart, BarChart } from "@/components/admin/charts"
import { AreaChart as AnalyticsAreaChart } from "@/components/admin/analytics/area-chart"
import { DoughnutChart } from "@/components/admin/analytics/doughnut-chart"
import { VisitorsTable } from "@/components/admin/analytics/visitors-table"
import { ReferrersTable } from "@/components/admin/analytics/referrers-table"
import { PageviewsTable } from "@/components/admin/analytics/pageviews-table"
import VietnamMap from "@/components/admin/analytics/vietnam-map"
import GeographicStats from "@/components/admin/analytics/geographic-stats"
import { useFetch, dashboardService } from "@/lib/api"
import type { DashboardStats, ChartData, CategoryChartData, Order, Customer, PageViewData, VisitorStatData } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminDashboard() {
  // Initialize with default value to avoid hydration mismatch
  const [activeTab, setActiveTab] = useState("overview");

  // Handle URL parameters after component mounts (client-side only)
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, []);

  // Update URL when tab changes
  useEffect(() => {
    const url = new URL(window.location.href);
    if (activeTab === "overview") {
      url.searchParams.delete('tab');
    } else {
      url.searchParams.set('tab', activeTab);
    }
    window.history.replaceState({}, '', url.toString());
  }, [activeTab]);
  const [dateRange, setDateRange] = useState("7days")

  // Fetch dashboard data
  const { data: stats, isLoading: statsLoading } = useFetch<DashboardStats>(dashboardService.getStats, undefined, {
    initialData: {
      totalVisitors: 20000,
      totalVisitorsChange: 12.5,
      uniqueVisitors: 14000,
      uniqueVisitorsChange: 8.2,
      pageViews: 60000,
      pageViewsChange: 15.3,
      avgSessionDuration: 250,
      avgSessionDurationChange: 6.8,
      bounceRate: 25.0,
      bounceRateChange: -5.2,
    },
    dependencies: [dateRange],
  })

  const { data: visitorData, isLoading: visitorLoading } = useFetch<ChartData[]>(
    dashboardService.getRevenueChart,
    undefined,
    {
      initialData: [
        { name: "01/07", total: 12500 },
        { name: "02/07", total: 13200 },
        { name: "03/07", total: 12800 },
        { name: "04/07", total: 13500 },
        { name: "05/07", total: 14200 },
        { name: "06/07", total: 14800 },
        { name: "07/07", total: 15100 },
        { name: "08/07", total: 15600 },
        { name: "09/07", total: 16200 },
        { name: "10/07", total: 16800 },
        { name: "11/07", total: 17500 },
        { name: "12/07", total: 18200 },
        { name: "13/07", total: 18900 },
        { name: "14/07", total: 19500 },
        { name: "15/07", total: 20000 },
      ],
      dependencies: [dateRange],
    },
  )

  const { data: pageViews, isLoading: pageViewsLoading } = useFetch<PageViewData[]>(
    dashboardService.getPageViews,
    undefined,
    {
      dependencies: [dateRange],
    },
  )

  const { data: visitorStats, isLoading: visitorStatsLoading } = useFetch<VisitorStatData[]>(
    dashboardService.getVisitorStats,
    undefined,
    {
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
          <p className="text-muted-foreground">Thống kê lượt truy cập và sử dụng website</p>
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
            <CardTitle className="text-sm font-medium">Tổng lượt truy cập</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-36" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.totalVisitors?.toLocaleString()}</div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span
                    className={`flex items-center ${stats?.totalVisitorsChange && stats.totalVisitorsChange > 0 ? "text-emerald-500" : "text-rose-500"}`}
                  >
                    {stats?.totalVisitorsChange && stats.totalVisitorsChange > 0 ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(stats?.totalVisitorsChange || 0)}%
                  </span>
                  <span>so với tuần trước</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Người dùng duy nhất</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.uniqueVisitors?.toLocaleString()}</div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span
                    className={`flex items-center ${stats?.uniqueVisitorsChange && stats.uniqueVisitorsChange > 0 ? "text-emerald-500" : "text-rose-500"}`}
                  >
                    {stats?.uniqueVisitorsChange && stats.uniqueVisitorsChange > 0 ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(stats?.uniqueVisitorsChange || 0)}%
                  </span>
                  <span>so với tuần trước</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lượt xem trang</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.pageViews?.toLocaleString()}</div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span
                    className={`flex items-center ${stats?.pageViewsChange && stats.pageViewsChange > 0 ? "text-emerald-500" : "text-rose-500"}`}
                  >
                    {stats?.pageViewsChange && stats.pageViewsChange > 0 ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(stats?.pageViewsChange || 0)}%
                  </span>
                  <span>so với tuần trước</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỉ lệ thoát</CardTitle>
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.bounceRate?.toFixed(1)}%</div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span
                    className={`flex items-center ${stats?.bounceRateChange && stats.bounceRateChange < 0 ? "text-emerald-500" : "text-rose-500"}`}
                  >
                    {stats?.bounceRateChange && stats.bounceRateChange < 0 ? (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(stats?.bounceRateChange || 0)}%
                  </span>
                  <span>so với tuần trước</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="analytics">Phân tích</TabsTrigger>
          <TabsTrigger value="reports">Báo cáo</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-7">
              <CardHeader>
                <CardTitle>Lượt truy cập theo ngày</CardTitle>
                <CardDescription>Biểu đồ lượt truy cập trong 15 ngày gần đây</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                {visitorLoading ? (
                  <Skeleton className="h-[350px] w-full" />
                ) : (
                  <AreaChart
                    data={visitorData || []}
                    height={350}
                    valueFormatter={(value: number) => `${value.toLocaleString()} lượt truy cập`}
                  />
                )}
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-7">
              <CardHeader>
                <CardTitle>Trang được xem nhiều nhất</CardTitle>
                <CardDescription>Top 10 trang được xem nhiều nhất</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Đường dẫn</TableHead>
                      <TableHead>Tiêu đề trang</TableHead>
                      <TableHead>Lượt xem</TableHead>
                      <TableHead className="text-right">Thời gian TB</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageViewsLoading
                      ? Array(5)
                          .fill(0)
                          .map((_, index) => (
                            <TableRow key={`loading-${index}`}>
                              <TableCell>
                                <Skeleton className="h-5 w-16" />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-5 w-24" />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-5 w-16" />
                              </TableCell>
                              <TableCell className="text-right">
                                <Skeleton className="h-5 w-20 ml-auto" />
                              </TableCell>
                            </TableRow>
                          ))
                      : pageViews?.map((page) => (
                          <TableRow key={page.pageUrl || `page-${page.id || Math.random().toString()}`}>
                            <TableCell className="font-medium">{page.pageUrl}</TableCell>
                            <TableCell>{page.pageTitle}</TableCell>
                            <TableCell>{page.viewCount?.toLocaleString() || '0'}</TableCell>
                            <TableCell className="text-right">{Math.floor((page.avgTimeOnPage || 0) / 60)}m {(page.avgTimeOnPage || 0) % 60}s</TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Thời gian trung bình</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4m 10s</div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span className="flex items-center text-emerald-500">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    12.5%
                  </span>
                  <span>so với tuần trước</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tỷ lệ thoát</CardTitle>
                <LogOut className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">25.0%</div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span className="flex items-center text-emerald-500">
                    <ArrowDown className="h-4 w-4 mr-1" />
                    5.2%
                  </span>
                  <span>so với tuần trước</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Trang/phiên</CardTitle>
                <Layers className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2</div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span className="flex items-center text-emerald-500">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    8.3%
                  </span>
                  <span>so với tuần trước</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="hidden md:flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Calendar className="h-4 w-4" />
                7 ngày
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Calendar className="h-4 w-4" />
                30 ngày
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Calendar className="h-4 w-4" />
                90 ngày
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Calendar className="h-4 w-4" />
                Năm nay
              </Button>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Xuất dữ liệu
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lượt truy cập theo thời gian</CardTitle>
              <CardDescription>Biểu đồ lượt truy cập theo ngày</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <AnalyticsAreaChart />
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-7">
            <Card className="col-span-7">
              <CardHeader>
                <CardTitle>Trang được xem nhiều nhất</CardTitle>
                <CardDescription>Top 10 trang được xem nhiều nhất</CardDescription>
              </CardHeader>
              <CardContent>
                <PageviewsTable />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Người dùng truy cập</CardTitle>
              <CardDescription>Phân tích chi tiết về thiết bị và trình duyệt</CardDescription>
            </CardHeader>
            <CardContent>
              <VisitorsTable />
            </CardContent>
          </Card>

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

