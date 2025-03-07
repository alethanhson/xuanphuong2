"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { formatDate } from "@/lib/utils"
import { AppError } from "@/lib/error"
import { Edit, Eye, MoreHorizontal, Plus, Search, Trash2, Filter } from "lucide-react"

// Mock blog data
const initialBlogs = [
  {
    id: "1",
    title: "Hướng dẫn sử dụng máy CNC cơ bản",
    slug: "huong-dan-su-dung-may-cnc-co-ban",
    excerpt: "Bài viết hướng dẫn chi tiết cách sử dụng máy CNC cho người mới bắt đầu",
    category: "Hướng dẫn",
    author: "Admin",
    status: "published",
    views: 1250,
    createdAt: "2023-10-15T08:30:00",
    updatedAt: "2023-10-20T10:15:00",
  },
  {
    id: "2",
    title: "5 lợi ích của máy CNC trong sản xuất nội thất",
    slug: "5-loi-ich-cua-may-cnc-trong-san-xuat-noi-that",
    excerpt: "Khám phá những lợi ích mà máy CNC mang lại cho ngành sản xuất nội thất hiện đại",
    category: "Kiến thức",
    author: "Admin",
    status: "published",
    views: 980,
    createdAt: "2023-10-10T09:45:00",
    updatedAt: "2023-10-12T14:20:00",
  },
  {
    id: "3",
    title: "So sánh các loại máy CNC phổ biến trên thị trường",
    slug: "so-sanh-cac-loai-may-cnc-pho-bien-tren-thi-truong",
    excerpt: "Phân tích chi tiết về ưu nhược điểm của các loại máy CNC phổ biến hiện nay",
    category: "Đánh giá",
    author: "Admin",
    status: "draft",
    views: 0,
    createdAt: "2023-11-05T11:20:00",
    updatedAt: "2023-11-05T11:20:00",
  },
  {
    id: "4",
    title: "Bảo trì và bảo dưỡng máy CNC đúng cách",
    slug: "bao-tri-va-bao-duong-may-cnc-dung-cach",
    excerpt: "Những điều cần biết để bảo trì và bảo dưỡng máy CNC kéo dài tuổi thọ máy",
    category: "Hướng dẫn",
    author: "Admin",
    status: "published",
    views: 750,
    createdAt: "2023-10-25T13:10:00",
    updatedAt: "2023-10-28T09:30:00",
  },
  {
    id: "5",
    title: "Xu hướng công nghệ CNC mới nhất năm 2023",
    slug: "xu-huong-cong-nghe-cnc-moi-nhat-nam-2023",
    excerpt: "Cập nhật những xu hướng và công nghệ mới nhất trong lĩnh vực máy CNC",
    category: "Tin tức",
    author: "Admin",
    status: "published",
    views: 1560,
    createdAt: "2023-11-01T10:00:00",
    updatedAt: "2023-11-02T15:45:00",
  },
]

export default function BlogPage() {
  const router = useRouter()
  const [blogs, setBlogs] = useState(initialBlogs)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null)

  // Filter blogs based on search query and filters
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || blog.status === statusFilter
    const matchesCategory = categoryFilter === "all" || blog.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  // Handle delete click
  const handleDeleteClick = (blogId: string) => {
    setBlogToDelete(blogId)
    setOpenDeleteDialog(true)
  }

  // Confirm deletion
  const confirmDelete = () => {
    if (blogToDelete) {
      setBlogs((prev) => prev.filter((blog) => blog.id !== blogToDelete))
      toast({
        title: "Xóa thành công",
        description: "Bài viết đã được xóa.",
      })
      setOpenDeleteDialog(false)
      setBlogToDelete(null)
    }
  }

  // Get unique categories for filter
  const categories = Array.from(new Set(blogs.map((blog) => blog.category)))

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Blog</h1>
          <p className="text-muted-foreground">Quản lý tất cả bài viết trên website</p>
        </div>
        <Button onClick={() => router.push("/admin/blog/add")}>
          <Plus className="mr-2 h-4 w-4" /> Thêm bài viết
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách bài viết</CardTitle>
          <CardDescription>Quản lý tất cả bài viết trên website</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm bài viết..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="published">Đã xuất bản</SelectItem>
                  <SelectItem value="draft">Bản nháp</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead className="hidden md:table-cell">Danh mục</TableHead>
                  <TableHead className="hidden md:table-cell">Ngày tạo</TableHead>
                  <TableHead className="hidden md:table-cell">Lượt xem</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBlogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Không tìm thấy bài viết nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBlogs.map((blog) => (
                    <TableRow key={blog.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-medium">{blog.title}</div>
                          <div className="text-sm text-muted-foreground hidden md:block">
                            {blog.excerpt.length > 60 ? blog.excerpt.substring(0, 60) + "..." : blog.excerpt}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{blog.category}</TableCell>
                      <TableCell className="hidden md:table-cell">{formatDate(blog.createdAt)}</TableCell>
                      <TableCell className="hidden md:table-cell">{blog.views.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={blog.status === "published" ? "success" : "secondary"}>
                          {blog.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Mở menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => router.push(`/blog/${blog.slug}`)}
                              className="cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Xem
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/blog/edit/${blog.id}`)}
                              className="cursor-pointer"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(blog.id)}
                              className="cursor-pointer text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn bài viết khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export const errorHandler = (error: any) => {
  if (error instanceof AppError) {
    toast({
      variant: "destructive",
      title: "Lỗi",
      description: error.message,
    })
    return
  }

  console.error(error)
  toast({
    variant: "destructive",
    title: "Lỗi",
    description: error instanceof Error ? error.message : "Đã xảy ra lỗi không mong muốn",
  })
}

