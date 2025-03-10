'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { ImageIcon, Trash } from 'lucide-react';

// Define the form schema
const blogFormSchema = z.object({
  title: z.string().min(5, {
    message: 'Tiêu đề phải có ít nhất 5 ký tự',
  }),
  slug: z.string().min(5, {
    message: 'Slug phải có ít nhất 5 ký tự',
  }),
  excerpt: z.string().min(10, {
    message: 'Tóm tắt phải có ít nhất 10 ký tự',
  }),
  content: z.string().min(50, {
    message: 'Nội dung phải có ít nhất 50 ký tự',
  }),
  categoryId: z.string({
    required_error: 'Vui lòng chọn danh mục',
  }),
  isFeatured: z.boolean().default(false),
  status: z.enum(['published', 'draft'], {
    required_error: 'Vui lòng chọn trạng thái',
  }),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  tags: z.string().optional(),
});

// Mock categories data
const categories = [
  { id: '1', name: 'Hướng dẫn' },
  { id: '2', name: 'Kiến thức' },
  { id: '3', name: 'Đánh giá' },
  { id: '4', name: 'Tin tức' },
  { id: '5', name: 'Công nghệ' },
];

type BlogFormValues = z.infer<typeof blogFormSchema>;

export default function AddBlogPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log(window.innerWidth);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Đang tải...</div>;
  }
  const [images, setImages] = useState<
    { id: string; file: File; preview: string }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      categoryId: '',
      isFeatured: false,
      status: 'draft',
      metaTitle: '',
      metaDescription: '',
      tags: '',
    },
  });

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map((file) => ({
        id: Math.random().toString(36).substring(2, 9),
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  // Remove image
  const removeImage = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      return filtered;
    });
  };

  // Auto-generate slug from blog title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue('title', title);

    // Generate slug
    const slug = title
      .toLowerCase()
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
      .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
      .replace(/[ìíịỉĩ]/g, 'i')
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
      .replace(/[ùúụủũưừứựửữ]/g, 'u')
      .replace(/[ỳýỵỷỹ]/g, 'y')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');

    form.setValue('slug', slug);

    // Auto-generate meta title if empty
    if (!form.getValues('metaTitle')) {
      form.setValue('metaTitle', title);
    }
  };

  // Form submission handler
  async function onSubmit(data: BlogFormValues) {
    try {
      setIsSubmitting(true);

      // Here you would normally upload images and send data to API
      console.log('Form data', data);
      console.log('Images', images);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: 'Thành công!',
        description: 'Bài viết đã được tạo thành công.',
      });

      // Redirect to blogs page
      router.push('/admin/blog');
    } catch (error) {
      console.error(error);
      toast({
        title: 'Lỗi!',
        description: 'Đã xảy ra lỗi khi tạo bài viết.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Thêm Bài Viết Mới
          </h1>
          <p className="text-muted-foreground">
            Tạo một bài viết mới cho blog của bạn
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/admin/blog')}>
            Hủy
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? 'Đang tạo...' : 'Xuất bản'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">Nội dung</TabsTrigger>
          <TabsTrigger value="images">Hình ảnh</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle>Nội dung bài viết</CardTitle>
                  <CardDescription>
                    Nhập thông tin nội dung cho bài viết
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tiêu đề</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập tiêu đề bài viết"
                              {...field}
                              onChange={handleTitleChange}
                            />
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
                            <Input
                              placeholder="nhap-tieu-de-bai-viet"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            URL-friendly version của tiêu đề
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tóm tắt</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tóm tắt ngắn gọn về bài viết"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Tóm tắt sẽ hiển thị ở trang danh sách bài viết
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nội dung</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Nội dung chi tiết của bài viết"
                            className="min-h-[300px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Danh mục</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn danh mục" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trạng thái</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn trạng thái" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="draft">Bản nháp</SelectItem>
                              <SelectItem value="published">
                                Xuất bản
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="cnc, máy cnc, hướng dẫn"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Các tags cách nhau bởi dấu phẩy
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Bài viết nổi bật
                          </FormLabel>
                          <FormDescription>
                            Bài viết sẽ được hiển thị ở trang chủ
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="images">
              <Card>
                <CardHeader>
                  <CardTitle>Hình ảnh bài viết</CardTitle>
                  <CardDescription>
                    Tải lên hình ảnh cho bài viết
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 hover:bg-gray-100"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <ImageIcon className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Nhấp để tải lên
                            </span>{' '}
                            hoặc kéo và thả
                          </p>
                          <p className="text-xs text-gray-500">
                            SVG, PNG, JPG hoặc GIF (Tối đa 5MB)
                          </p>
                        </div>
                        <Input
                          id="image-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>

                    {images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {images.map((image) => (
                          <div key={image.id} className="relative group">
                            <div className="aspect-square overflow-hidden rounded-lg border">
                              <img
                                src={image.preview || '/placeholder.svg'}
                                alt="Blog preview"
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(image.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo">
              <Card>
                <CardHeader>
                  <CardTitle>SEO</CardTitle>
                  <CardDescription>
                    Tối ưu hóa bài viết cho công cụ tìm kiếm
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="metaTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Meta title cho SEO" {...field} />
                        </FormControl>
                        <FormDescription>
                          Tiêu đề hiển thị trên kết quả tìm kiếm
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="metaDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Meta description cho SEO"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Mô tả hiển thị trên kết quả tìm kiếm
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="border rounded-md p-4">
                    <h3 className="text-sm font-medium mb-2">
                      Xem trước kết quả tìm kiếm
                    </h3>
                    <div className="space-y-1">
                      <div className="text-blue-600 text-lg">
                        {form.watch('metaTitle') ||
                          form.watch('title') ||
                          'Tiêu đề bài viết'}
                      </div>
                      <div className="text-green-700 text-sm">
                        {`${window.location.origin}/blog/${
                          form.watch('slug') || 'slug-bai-viet'
                        }`}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {form.watch('metaDescription') ||
                          form.watch('excerpt') ||
                          'Mô tả bài viết sẽ hiển thị ở đây...'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}
