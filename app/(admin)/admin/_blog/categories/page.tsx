"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Edit, Trash2 } from "lucide-react"

// Define the form schema for category
const categoryFormSchema = z.object({
  name: z.string().min(3, {
    message: "Tên danh mục phải có ít nhất 3 ký tự",
  }),
  slug: z.string().min(3, {
    message: "Slug phải có ít nhất 3 ký tự",
  }),
  description: z.string().optional(),
})

type CategoryFormValues = z.infer<typeof categoryFormSchema>

// Mock data for categories
const initialCategories = [
  {
    id: "1",
    name: "Hướng dẫn",
    slug: "huong-dan",
    description: "Các bài viết hướng dẫn sử dụng máy CNC",
  },
  {
    id: "2",
    name: "Kiến thức",
    slug: "kien-thuc",
    description: "Kiến thức chung về máy CNC và ứng dụng",
  },
  {
    id: "3",
    name: "Đánh giá",
    slug: "danh-gia",
    description: "Đánh giá các loại máy CNC trên thị trường",
  },
  {
    id: "4",
    name: "Tin tức",
    slug: "tin-tuc",
    description: "Tin tức mới nhất về công nghệ CNC",
  },
  {
    id: "5",
    name: "Công nghệ",
    slug: "cong-nghe",
    description: "Các bài viết về công nghệ CNC mới",
  },
]

export default function BlogCategoriesPage() {
  const [categories, setCategories] = useState(initialCategories)
  const [isEditing, setIsEditing] = useState(false)
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)

  // Initialize form
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  })

  // Start editing a category
  const handleEdit = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId)
    if (category) {
      form.reset({
        name: category.name,
        slug: category.slug,
        description: category.description,
      })
      setCurrentCategoryId(categoryId)
      setIsEditing(true)
    }
  }

  // Start deleting a category
  const handleDeleteClick = (categoryId: string) => {
    setCategoryToDelete(categoryId)
    setOpenDeleteDialog(true)
  }

  // Confirm deletion
  const confirmDelete = () => {
    if (categoryToDelete) {
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryToDelete))
      toast({
        title: "Xóa thành công",
        description: "Danh mục đã được xóa.",
      })
      setOpenDeleteDialog(false)
      setCategoryToDelete(null)
    }
  }

  // Auto-generate slug from category name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    form.setValue("name", name)

    // Generate slug
    const slug = name
      .toLowerCase()
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
      .replace(/[èéẹẻẽêềếệểễ]/g, "e")
      .replace(/[ìíịỉĩ]/g, "i")
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
      .replace(/[ùúụủũưừứựửữ]/g, "u")
      .replace(/[ỳýỵỷỹ]/g, "y")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")

    form.setValue("slug", slug)
  }

  // Reset form and editing state
  const resetForm = () => {
    form.reset({
      name: "",
      slug: "",
      description: "",
    })
    setCurrentCategoryId(null)
    setIsEditing(false)
  }

  // Handle form submission
  async function onSubmit(data: CategoryFormValues) {
    try {
      setIsSubmitting(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      if (isEditing && currentCategoryId) {
        // Update existing category
        setCategories((prev) => prev.map((cat) => (cat.id === currentCategoryId ? { ...cat, ...data } : cat)))
        toast({
          title: "Cập nhật thành công",
          description: "Danh mục đã được cập nhật.",
        })
      } else {
        // Add new category
        const newCategory = {
          id: Math.random().toString(36).substring(2, 9),
          ...data,
        }
        setCategories((prev) => [
          ...prev,
          {
            ...newCategory,
            description: newCategory.description || "",
          },
        ])
        toast({
          title: "Thêm thành công",
          description: "Danh mục mới đã được tạo.",
        })
      }

      // Reset form
      resetForm()
    } catch (error) {
      console.error(error)
      toast({
        title: "Lỗi!",
        description: "Đã xảy ra lỗi. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Danh mục Blog</h1>
          <p className="text-muted-foreground">Thêm, sửa, xóa danh mục bài viết</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? "Sửa danh mục" : "Thêm danh mục mới"}</CardTitle>
            <CardDescription>
              {isEditing ? "Cập nhật thông tin danh mục đã chọn" : "Tạo một danh mục mới cho blog"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên danh mục</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên danh mục" {...field} onChange={handleNameChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="nhap-ten-danh-muc" {...field} />
                      </FormControl>
                      <FormDescription>URL-friendly version của tên danh mục</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Mô tả ngắn gọn về danh mục này" className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  {isEditing && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Hủy
                    </Button>
                  )}
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? isEditing
                        ? "Đang cập nhật..."
                        : "Đang thêm..."
                      : isEditing
                        ? "Cập nhật"
                        : "Thêm danh mục"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách danh mục</CardTitle>
            <CardDescription>Quản lý các danh mục blog hiện có</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên danh mục</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="hidden md:table-cell">Mô tả</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Không có danh mục nào
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.slug}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {category.description || <span className="text-muted-foreground italic">Không có mô tả</span>}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(category.id)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(category.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn danh mục khỏi hệ thống.
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

