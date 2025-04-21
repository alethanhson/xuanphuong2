"use client"

import { useRouter } from "next/navigation"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  Image, 
  Settings, 
  FileText, 
  MessageSquare, 
  Phone, 
  Mail, 
  MapPin, 
  ChevronRight 
} from "lucide-react"

export default function WebsiteSettingsPage() {
  const router = useRouter()

  const settingsCategories = [
    {
      title: "Hero Section",
      description: "Quản lý slides và nội dung hiển thị trên Hero Section của trang chủ",
      icon: <Image className="h-8 w-8 text-primary" />,
      href: "/admin/website/hero-section",
    },
    {
      title: "Thông tin liên hệ",
      description: "Cập nhật thông tin liên hệ hiển thị trên website",
      icon: <Phone className="h-8 w-8 text-primary" />,
      href: "/admin/website/contact-info",
    },
    {
      title: "Footer",
      description: "Quản lý nội dung hiển thị ở footer của website",
      icon: <LayoutDashboard className="h-8 w-8 text-primary" />,
      href: "/admin/website/footer",
    },
    {
      title: "SEO",
      description: "Cấu hình SEO cho website",
      icon: <Settings className="h-8 w-8 text-primary" />,
      href: "/admin/website/seo",
    },
    {
      title: "Trang giới thiệu",
      description: "Quản lý nội dung trang giới thiệu",
      icon: <FileText className="h-8 w-8 text-primary" />,
      href: "/admin/website/about",
    },
    {
      title: "Testimonials",
      description: "Quản lý đánh giá từ khách hàng",
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      href: "/admin/website/testimonials",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý website</h1>
        <p className="text-muted-foreground mt-1">
          Quản lý nội dung và cấu hình hiển thị trên website
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {settingsCategories.map((category) => (
          <Card key={category.title} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                {category.icon}
                <CardTitle>{category.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="min-h-[40px]">{category.description}</CardDescription>
            </CardContent>
            <CardFooter className="pt-2 border-t bg-muted/50">
              <Button 
                variant="ghost" 
                className="w-full justify-between" 
                onClick={() => router.push(category.href)}
              >
                Quản lý
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
