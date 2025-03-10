'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
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
import { ImageIcon, Trash, Plus, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import type { Database } from '@/types/supabase';

// Define the form schema
const productFormSchema = z.object({
  name: z.string().min(3, {
    message: 'Tên sản phẩm phải có ít nhất 3 ký tự',
  }),
  slug: z.string().min(3, {
    message: 'Slug phải có ít nhất 3 ký tự',
  }),
  description: z.string().min(10, {
    message: 'Mô tả phải có ít nhất 10 ký tự',
  }),
  short_description: z.string().optional(),
  category_id: z.string({
    required_error: 'Vui lòng chọn danh mục',
  }),
  price: z.string().optional(),
  is_featured: z.boolean().default(false),
  status: z.enum(['active', 'outOfStock', 'draft'], {
    required_error: 'Vui lòng chọn trạng thái',
  }),
  model: z.string().optional(),
  working_dimensions: z.string().optional(),
  spindle_power: z.string().optional(),
  spindle_speed: z.string().optional(),
  movement_speed: z.string().optional(),
  accuracy: z.string().optional(),
  control_system: z.string().optional(),
  compatible_software: z.string().optional(),
  file_formats: z.string().optional(),
  power_consumption: z.string().optional(),
  machine_dimensions: z.string().optional(),
  weight: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;
type Category = Database['public']['Tables']['product_categories']['Row'];

export default function AddProductPage() {
  const router = useRouter();
  const [images, setImages] = useState<
    { id: string; file: File; preview: string; isPrimary: boolean }[]
  >([]);
  const [features, setFeatures] = useState<
    { id: string; name: string; description: string; icon: string }[]
  >([]);
  const [newFeatureName, setNewFeatureName] = useState('');
  const [newFeatureDescription, setNewFeatureDescription] = useState('');
  const [newFeatureIcon, setNewFeatureIcon] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories on component mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('product_categories')
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          throw error;
        }

        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: 'Lỗi!',
          description: 'Không thể tải danh mục. Vui lòng thử lại sau.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
  }, []);

  // Initialize form with default values
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      short_description: '',
      category_id: '',
      price: '',
      is_featured: false,
      status: 'draft',
      model: '',
      working_dimensions: '',
      spindle_power: '',
      spindle_speed: '',
      movement_speed: '',
      accuracy: '',
      control_system: '',
      compatible_software: '',
      file_formats: '',
      power_consumption: '',
      machine_dimensions: '',
      weight: '',
    },
  });

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map((file) => ({
        id: Math.random().toString(36).substring(2, 9),
        file,
        preview: URL.createObjectURL(file),
        isPrimary: images.length === 0,
      }));
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  // Remove image
  const removeImage = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);

      // If we removed the primary image, set the first remaining image as primary
      if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }

      return filtered;
    });
  };

  // Set image as primary
  const setImageAsPrimary = (id: string) => {
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        isPrimary: img.id === id,
      }))
    );
  };

  // Add feature
  const addFeature = () => {
    if (newFeatureName.trim() === '' || newFeatureDescription.trim() === '') {
      toast({
        title: 'Lỗi!',
        description: 'Tên và mô tả tính năng không được để trống.',
        variant: 'destructive',
      });
      return;
    }

    const newFeature = {
      id: Math.random().toString(36).substring(2, 9),
      name: newFeatureName,
      description: newFeatureDescription,
      icon: newFeatureIcon,
    };

    setFeatures((prev) => [...prev, newFeature]);
    setNewFeatureName('');
    setNewFeatureDescription('');
    setNewFeatureIcon('');
  };

  // Remove feature
  const removeFeature = (id: string) => {
    setFeatures((prev) => prev.filter((feature) => feature.id !== id));
  };

  // Auto-generate slug from product name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue('name', name);

    // Generate slug
    const slug = name
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
  };

  // Form submission handler
  async function onSubmit(data: ProductFormValues) {
    try {
      setIsSubmitting(true);

      // Upload images if any
      const uploadedImages = [];
      if (images.length > 0) {
        for (const image of images) {
          const fileExt = image.file.name.split('.').pop();
          const fileName = `${Math.random()
            .toString(36)
            .substring(2, 9)}.${fileExt}`;
          const filePath = `products/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('CNC')
            .upload(filePath, image.file);

          if (uploadError) {
            throw uploadError; 
          }

          // Get public URL
          const { data: publicUrlData } = supabase.storage
            .from('CNC')
            .getPublicUrl(filePath);

          uploadedImages.push({
            url: publicUrlData.publicUrl,
            alt: image.file.name,
            isPrimary: image.isPrimary,
          });
        }
      }

      // Prepare product data
      const productData = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        short_description: data.short_description || null,
        category_id: data.category_id,
        price: data.price ? Number.parseFloat(data.price) : null,
        is_featured: data.is_featured,
        status: data.status,
        model: data.model || null,
        working_dimensions: data.working_dimensions || null,
        spindle_power: data.spindle_power || null,
        spindle_speed: data.spindle_speed || null,
        movement_speed: data.movement_speed || null,
        accuracy: data.accuracy || null,
        control_system: data.control_system || null,
        compatible_software: data.compatible_software || null,
        file_formats: data.file_formats || null,
        power_consumption: data.power_consumption || null,
        machine_dimensions: data.machine_dimensions || null,
        weight: data.weight || null,
      };

      // Insert product
      const { data: product, error } = await supabase
        .from('products')
        .insert(productData as any)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Insert product images
      if (uploadedImages.length > 0) {
        const imageInserts = uploadedImages.map((image) => ({
          product_id: product.id,
          url: image.url,
          alt: image.alt,
          is_primary: image.isPrimary,
          created_at: new Date().toISOString(),
        }));

        const { error: imageError } = await supabase
          .from('product_images')
          .insert(imageInserts as any);

        if (imageError) {
          console.error('Error adding product images:', imageError);
        }
      }

      // Insert product features
      if (features.length > 0) {
        const featureInserts = features.map((feature) => ({
          product_id: product.id,
          title: feature.name,
          description: feature.description,
          icon: feature.icon || null,
          created_at: new Date().toISOString(),
        }));

        const { error: featureError } = await supabase
          .from('product_features')
          .insert(featureInserts as any);

        if (featureError) {
          console.error('Error adding product features:', featureError);
        }
      }

      toast({
        title: 'Thành công!',
        description: 'Sản phẩm đã được tạo thành công.',
      });

      // Chuyển hướng sau khi hoàn tất
      router.push('/admin/products');
    } catch (error) {
      console.error(error);
      toast({
        title: 'Lỗi!',
        description: 'Đã xảy ra lỗi khi tạo sản phẩm.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center justify-center text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <h3 className="mt-4 text-lg font-semibold">Đang tải dữ liệu...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Thêm Sản Phẩm Mới
          </h1>
          <p className="text-muted-foreground">
            Tạo một sản phẩm mới cho cửa hàng của bạn
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/products')}
          >
            Hủy
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo...
              </>
            ) : (
              'Lưu sản phẩm'
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
          <TabsTrigger value="images">Hình ảnh</TabsTrigger>
          <TabsTrigger value="features">Tính năng</TabsTrigger>
          <TabsTrigger value="specifications">Thông số kỹ thuật</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cơ bản</CardTitle>
                  <CardDescription>
                    Nhập thông tin cơ bản cho sản phẩm
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên sản phẩm</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập tên sản phẩm"
                              {...field}
                              onChange={handleNameChange}
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
                            <Input placeholder="nhap-ten-san-pham" {...field} />
                          </FormControl>
                          <FormDescription>
                            URL-friendly version của tên sản phẩm
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="short_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả ngắn</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Mô tả ngắn gọn về sản phẩm"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Mô tả ngắn sẽ hiển thị ở trang danh sách sản phẩm
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả chi tiết</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Mô tả chi tiết về sản phẩm"
                            className="min-h-[200px] resize-none"
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
                      name="category_id"
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
                                  value={category.id.toString()}
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
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Giá (VND)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Nhập giá sản phẩm"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Để trống nếu "Liên hệ"
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              <SelectItem value="active">Đang bán</SelectItem>
                              <SelectItem value="outOfStock">
                                Hết hàng
                              </SelectItem>
                              <SelectItem value="draft">Bản nháp</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập model sản phẩm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="is_featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Sản phẩm nổi bật
                          </FormLabel>
                          <FormDescription>
                            Sản phẩm sẽ được hiển thị ở trang chủ
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
                  <CardTitle>Hình ảnh sản phẩm</CardTitle>
                  <CardDescription>
                    Tải lên hình ảnh cho sản phẩm
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
                            <div
                              className={`aspect-square overflow-hidden rounded-lg border ${
                                image.isPrimary ? 'ring-2 ring-primary' : ''
                              }`}
                            >
                              <img
                                src={image.preview || '/placeholder.svg'}
                                alt="Product preview"
                                className="object-cover w-full h-full"
                              />
                              {image.isPrimary && (
                                <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                                  Ảnh chính
                                </div>
                              )}
                            </div>
                            <div className="absolute top-2 right-2 flex gap-1">
                              {!image.isPrimary && (
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="icon"
                                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => setImageAsPrimary(image.id)}
                                >
                                  <span className="text-xs">★</span>
                                </Button>
                              )}
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(image.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features">
              <Card>
                <CardHeader>
                  <CardTitle>Tính năng sản phẩm</CardTitle>
                  <CardDescription>
                    Thêm các tính năng nổi bật của sản phẩm
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium">
                          Tên tính năng
                        </label>
                        <Input
                          placeholder="Ví dụ: Tốc độ cao"
                          value={newFeatureName}
                          onChange={(e) => setNewFeatureName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Mô tả</label>
                        <Input
                          placeholder="Ví dụ: Tốc độ xử lý nhanh chóng"
                          value={newFeatureDescription}
                          onChange={(e) =>
                            setNewFeatureDescription(e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Icon (tùy chọn)
                        </label>
                        <Input
                          placeholder="Ví dụ: speed"
                          value={newFeatureIcon}
                          onChange={(e) => setNewFeatureIcon(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addFeature}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Thêm tính năng
                    </Button>

                    {features.length > 0 && (
                      <div className="border rounded-md">
                        <div className="grid grid-cols-1 divide-y">
                          {features.map((feature) => (
                            <div
                              key={feature.id}
                              className="p-4 flex items-start justify-between"
                            >
                              <div>
                                <h4 className="font-medium">{feature.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {feature.description}
                                </p>
                                {feature.icon && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Icon: {feature.icon}
                                  </p>
                                )}
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFeature(feature.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications">
              <Card>
                <CardHeader>
                  <CardTitle>Thông số kỹ thuật</CardTitle>
                  <CardDescription>
                    Nhập thông số kỹ thuật chi tiết của sản phẩm
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="working_dimensions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kích thước làm việc</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ví dụ: 1500 x 3000 mm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="spindle_power"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Công suất trục chính</FormLabel>
                          <FormControl>
                            <Input placeholder="Ví dụ: 5.5 kW" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="spindle_speed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tốc độ trục chính</FormLabel>
                          <FormControl>
                            <Input placeholder="Ví dụ: 24,000 rpm" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="movement_speed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tốc độ di chuyển</FormLabel>
                          <FormControl>
                            <Input placeholder="Ví dụ: 30 m/min" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="accuracy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Độ chính xác</FormLabel>
                          <FormControl>
                            <Input placeholder="Ví dụ: ±0.01 mm" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="control_system"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hệ thống điều khiển</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ví dụ: DSP, Mach3, etc."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="compatible_software"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phần mềm tương thích</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ví dụ: ArtCAM, Type3, etc."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="file_formats"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Định dạng file</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ví dụ: G-code, NC, DXF, etc."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="power_consumption"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Công suất tiêu thụ</FormLabel>
                          <FormControl>
                            <Input placeholder="Ví dụ: 7.5 kW" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="machine_dimensions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kích thước máy</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ví dụ: 2200 x 3500 x 2000 mm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trọng lượng</FormLabel>
                          <FormControl>
                            <Input placeholder="Ví dụ: 1200 kg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
