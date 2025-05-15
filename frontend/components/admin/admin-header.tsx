"use client"

import {
  BellIcon,
  MessageSquare,
  Search,
  SunIcon,
  MoonIcon,
  Settings,
  HelpCircle,
  ChevronLeft,
  Home,
  AlertCircle,
  Bell,
  Menu,
  UserCircle,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import Cookies from 'js-cookie'
import React from "react"

type Notification = {
  id: string
  title: string
  message: string
  time: string
  isRead: boolean
  type: "message" | "alert" | "system"
}

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Khách hàng mới đăng ký",
    message: "Khách hàng Nguyễn Văn A đã đăng ký nhận tư vấn về sản phẩm CNC",
    time: "1 giờ trước",
    isRead: false,
    type: "alert",
  },
  {
    id: "2",
    title: "Đơn báo giá mới",
    message: "Công ty TNHH ABC đã yêu cầu báo giá cho sản phẩm CNC WoodMaster 500",
    time: "2 giờ trước",
    isRead: false,
    type: "message",
  },
  {
    id: "3",
    title: "Bài viết mới được phê duyệt",
    message: 'Bài viết "Hướng dẫn sử dụng máy CNC" đã được phê duyệt',
    time: "3 giờ trước",
    isRead: true,
    type: "system",
  },
]

// Path mapping for breadcrumbs
const pathMap: Record<string, string> = {
  admin: "Dashboard",
  products: "Sản phẩm",
  add: "Thêm mới",
  edit: "Chỉnh sửa",
  categories: "Danh mục",
  blog: "Blog",
  reports: "Báo cáo",
  orders: "Đơn hàng",
  customers: "Khách hàng",
  payments: "Thanh toán",
  settings: "Cài đặt",
  help: "Trợ giúp",
  contacts: "Liên hệ",
  inventory: "Kho hàng",
  website: "Trang web",
}

export default function AdminHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [unreadCount, setUnreadCount] = useState(0)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  // Get path segments for breadcrumbs
  const segments = pathname.split("/").filter(Boolean)

  useEffect(() => {
    // Count unread notifications
    const count = notifications.filter((n) => !n.isRead).length
    setUnreadCount(count)
  }, [notifications])

  useEffect(() => {
    try {
      const userData = Cookies.get("user")
      if (userData) {
        setUser(JSON.parse(userData))
      }
    } catch (error) {
      console.error("Error parsing user data from cookies:", error)
    }
  }, [])

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
  }

  const logout = () => {
    // Xóa thông tin người dùng khỏi cookies
    Cookies.remove("user")

    // Điều hướng người dùng đến trang đăng nhập
    router.push("/admin/login")
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 lg:h-[60px]">
      <div className="flex flex-1 items-center gap-4 md:gap-6">
        <div className="flex gap-2 items-center">
          {/* Back button */}
          {segments.length > 1 && (
            <Button variant="ghost" size="icon" asChild className="mr-2 hidden md:flex">
              <Link href={`/${segments.slice(0, -1).join("/")}`}>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
          )}

          {/* Breadcrumbs */}
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/admin" className="flex items-center">
                    <Home className="h-3.5 w-3.5 mr-1" />
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              {segments.map((segment, index) => {
                // Skip the first segment if it's 'admin'
                if (index === 0 && segment === "admin") return null

                const href = `/${segments.slice(0, index + 1).join("/")}`
                const isLast = index === segments.length - 1

                return (
                  <BreadcrumbItem key={segment}>
                    <BreadcrumbSeparator />
                    <BreadcrumbLink
                      asChild={!isLast}
                      className={isLast ? "font-semibold text-foreground pointer-events-none" : undefined}
                    >
                      {isLast ? (
                        <span>{pathMap[segment] || segment}</span>
                      ) : (
                        <Link href={href}>{pathMap[segment] || segment}</Link>
                      )}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="ml-auto md:ml-0 relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Tìm kiếm..." className="w-full bg-background pl-8 md:max-w-md" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
                >
                  {unreadCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Thông báo</SheetTitle>
              <SheetDescription className="flex justify-between items-center">
                <span>Bạn có {unreadCount} thông báo mới</span>
                {unreadCount > 0 && (
                  <Button variant="link" size="sm" onClick={markAllAsRead} className="p-0 h-auto">
                    Đánh dấu tất cả đã đọc
                  </Button>
                )}
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <div className="space-y-4">
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Không có thông báo nào</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-4 rounded-lg border p-3 ${!notification.isRead ? "bg-primary/5" : ""}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <Avatar className="h-9 w-9">
                        {notification.type === "message" && <MessageSquare className="h-5 w-5 text-blue-500" />}
                        {notification.type === "alert" && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                        {notification.type === "system" && <Settings className="h-5 w-5 text-green-500" />}
                        <AvatarFallback>
                          {notification.type === "message" ? "M" : notification.type === "alert" ? "A" : "S"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </div>
                      {!notification.isRead && (
                        <div className="ml-auto">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full relative">
              <MessageSquare className="h-5 w-5" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
              >
                2
              </Badge>
              <span className="sr-only">Messages</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Tin nhắn</SheetTitle>
              <SheetDescription>Bạn có 2 tin nhắn mới</SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-start gap-4 rounded-lg border p-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium">Nguyễn Văn A</p>
                      <p className="text-sm text-muted-foreground">Tôi muốn biết thêm về sản phẩm CNC WoodMaster...</p>
                      <p className="text-xs text-muted-foreground">30 phút trước</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <Button variant="ghost" size="icon" className="rounded-full">
          <HelpCircle className="h-5 w-5" />
          <span className="sr-only">Help</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <span className="sr-only">Profile menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Hồ sơ</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                <span>Thông báo</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

