"use client"

import type React from "react"

import { useState, useEffect } from "react"
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

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        // Sử dụng API proxy đã được cấu hình trong next.config.mjs
        const response = await fetch('/api/products/categories')
        
        if (!response.ok) {
          throw new Error('Không thể tải danh mục')
        }
        
        const data = await response.json()
        setCategories(data.data || [])
      } catch (error) {
        console.error('Lỗi khi tải danh mục:', error)
        toast({
          title: "Lỗi!",
          description: "Không thể tải danh mục. Vui lòng thử lại sau.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

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
  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        setIsSubmitting(true);
        
        // Gọi API để xóa danh mục
        const response = await fetch(`/api/admin/categories/${categoryToDelete}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Không thể xóa danh mục');
        }

        // Cập nhật state sau khi xóa thành công
        setCategories((prev) => prev.filter((cat) => cat.id !== categoryToDelete));
        
        toast({
          title: "Xóa thành công",
          description: "Danh mục đã được xóa.",
        });
      } catch (error) {
        console.error(error);
        toast({
          title: "Lỗi!",
          description: error instanceof Error ? error.message : "Không thể xóa danh mục. Vui lòng thử lại.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
        setOpenDeleteDialog(false);
        setCategoryToDelete(null);
      }
    }
  };

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

      if (isEditing && currentCategoryId) {
        // Gọi API để cập nhật danh mục
        const response = await fetch(`/api/admin/categories/${currentCategoryId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Không thể cập nhật danh mục');
        }

        const result = await response.json();
        
        // Cập nhật danh sách danh mục trong state
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === currentCategoryId
              ? {
                  ...cat,
                  ...data,
                  description: data.description || "",
                }
              : cat
          )
        );

        toast({
          title: "Cập nhật thành công",
          description: "Danh mục đã được cập nhật.",
        });
      } else {
        const response = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Không thể tạo danh mục mới');
        }

        const result = await response.json();
        
        // Thêm danh mục mới vào state
        setCategories((prev) => [
          ...prev,
          {
            ...result.data,
            description: result.data?.description || "",
          },
        ]);

        toast({
          title: "Thêm thành công",
          description: "Danh mục mới đã được tạo.",
        });
      }

      // Reset form
      resetForm();
    } catch (error) {
      console.error(error);
      toast({
        title: "Lỗi!",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Danh mục</h1>
          <p className="text-muted-foreground">Thêm, sửa, xóa danh mục sản phẩm</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? "Sửa danh mục" : "Thêm danh mục mới"}</CardTitle>
            <CardDescription>
              {isEditing ? "Cập nhật thông tin danh mục đã chọn" : "Tạo một danh mục mới cho sản phẩm"}
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
            <CardDescription>Tất cả danh mục sản phẩm hiện có</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span className="ml-2">Đang tải danh mục...</span>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Chưa có danh mục nào. Hãy tạo danh mục đầu tiên.
              </div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên danh mục</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category, index) => {
                      // Đảm bảo category có thể hiển thị thành chuỗi
                      const categoryId = typeof category === 'object' && category !== null ? category.id || `category-${index}` : `category-${index}`;
                      const categoryName = typeof category === 'object' && category !== null ? category.name || 'Unknown' : String(category);
                      const categorySlug = typeof category === 'object' && category !== null ? category.slug || '' : '';

                      return (
                        <TableRow key={categoryId}>
                          <TableCell className="font-medium">{categoryName}</TableCell>
                          <TableCell>{categorySlug}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(categoryId)}
                                title="Sửa danh mục"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteClick(categoryId)}
                                title="Xóa danh mục"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
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

