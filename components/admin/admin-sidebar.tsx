"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  Home,
  Package2,
  Monitor,
  Contact,
  HelpCircle,
  Menu,
  Tag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Define sidebar item type for better organization
type SidebarItem = {
  title: string
  href: string
  icon: React.ElementType
  submenu?: SidebarItem[]
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: Home,
  },

  {
    title: "Sản phẩm",
    href: "/admin/products",
    icon: Package2,
    submenu: [
      {
        title: "Tất cả sản phẩm",
        href: "/admin/products",
        icon: Package2,
      },
      {
        title: "Thêm sản phẩm",
        href: "/admin/products/add",
        icon: Package2,
      },
      {
        title: "Danh mục",
        href: "/admin/products/categories",
        icon: Tag,
      },
    ],
  },
  // {
  //   title: "Khách hàng",
  //   href: "/admin/customers",
  //   icon: Users,
  // },
  // {
  //   title: "Blog",
  //   href: "/admin/blog",
  //   icon: ScrollText,
  //   submenu: [
  //     {
  //       title: "Tất cả bài viết",
  //       href: "/admin/blog",
  //       icon: ScrollText,
  //     },
  //     {
  //       title: "Thêm bài viết",
  //       href: "/admin/blog/add",
  //       icon: ScrollText,
  //     },
  //     {
  //       title: "Danh mục",
  //       href: "/admin/blog/categories",
  //       icon: Layers,
  //     },
  //   ],
  // },
  {
    title: "Liên hệ",
    href: "/admin/contacts",
    icon: Contact,
  },
  {
    title: "Trang web",
    href: "/admin/website",
    icon: Monitor,
  },
]

const SidebarContent = ({ pathname }: { pathname: string }) => {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleSubmenu = (title: string) => {
    setOpenItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  // Check if the current path matches the item or any of its submenu items
  const isActive = (item: SidebarItem): boolean => {
    if (pathname === item.href) return true
    if (item.submenu) {
      return item.submenu.some((subItem) => pathname === subItem.href)
    }
    return false
  }

  return (
    <nav className="grid items-start px-4 text-sm font-medium">
      {sidebarItems.map((item) =>
        item.submenu ? (
          <Collapsible
            key={item.title}
            open={openItems.includes(item.title) || isActive(item)}
            onOpenChange={() => toggleSubmenu(item.title)}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-start",
                  isActive(item)
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={cn("transform transition-transform", openItems.includes(item.title) ? "rotate-180" : "")}
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pt-1 pb-2">
              {item.submenu.map((subItem) => (
                <Link
                  key={subItem.title}
                  href={subItem.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-sm",
                    pathname === subItem.href
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <subItem.icon className="h-3.5 w-3.5" />
                  {subItem.title}
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <Link
            key={item.title}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ),
      )}
    </nav>
  )
}

// Mobile sidebar with Sheet component
const MobileSidebar = ({ pathname }: { pathname: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link href="/admin" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">Tân Tiến Vinh Admin</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <SidebarContent pathname={pathname} />
          </div>
          <div className="mt-auto p-4">
            <nav className="grid items-start gap-2 px-2 text-sm font-medium">

              <Link
                href="/admin/help"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                  pathname === "/admin/help"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <HelpCircle className="h-4 w-4" />
                Trợ giúp
              </Link>
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile sidebar */}
      <div className="lg:hidden fixed left-4 top-4 z-50">
        <MobileSidebar pathname={pathname} />
      </div>

      {/* Desktop sidebar */}
      <div className="fixed inset-y-0 left-0 z-20 hidden w-[280px] border-r lg:block">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link href="/admin" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">Tân Tiến Vinh Admin</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <SidebarContent pathname={pathname} />
          </div>
          <div className="mt-auto p-4">
            <nav className="grid items-start gap-2 px-2 text-sm font-medium">

              <Link
                href="/admin/help"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                  pathname === "/admin/help"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <HelpCircle className="h-4 w-4" />
                Trợ giúp
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}

