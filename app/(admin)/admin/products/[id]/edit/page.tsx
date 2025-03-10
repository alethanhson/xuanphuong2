'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ChevronLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import type { Database } from '@/types/supabase';

// Define types
type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['product_categories']['Row'];
type ProductImage = Database['public']['Tables']['product_images']['Row'];
type ProductFeature = Database['public']['Tables']['product_features']['Row'];

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
    required_error: 'Vui lòng chọn danh mục sản phẩm',
  }).min(1, {
    message: 'Vui lòng chọn danh mục sản phẩm',
  }),
  is_featured: z.boolean().default(false),
  status: z.enum(['active', 'outOfStock', 'draft'], {
    required_error: 'Vui lòng chọn trạng thái',
  }),
  price: z.string().optional(),
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

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Initialize form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      short_description: '',
      category_id: undefined,
      is_featured: false,
      status: 'draft',
      price: '',
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

  // Fetch categories and product data
  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data: categories, error } = await supabase
          .from('product_categories')
          .select('*')
          .order('name');

        if (error) throw error;
        setCategories(categories);
      } catch (err) {
        console.error('Error loading categories:', err);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải danh mục sản phẩm.',
          variant: 'destructive',
        });
      }
    }

    async function fetchProduct() {
      try {
        setIsLoading(true);

        // Fetch product data
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', resolvedParams.id)
          .single();

        if (productError) throw productError;

        // Fetch product images
        const { data: productImages, error: imagesError } = await supabase
          .from('product_images')
          .select('*')
          .eq('product_id' as string, resolvedParams.id)
          .order('is_primary', { ascending: false });

        if (imagesError) throw imagesError;

        // Fetch product features
        const { data: productFeatures, error: featuresError } = await supabase
          .from('product_features')
          .select('*')
          .eq('product_id' as string, resolvedParams.id);

        if (featuresError) throw featuresError;

        // Set state
        setImages(productImages || []);
        setFeatures(productFeatures || []);

        if (!product) {
          setError('Không tìm thấy sản phẩm');
          return;
        }

        // Reset form with product data
        form.reset({
          name: product.name || '',
          slug: product.slug || '',
          description: product.description || '',
          short_description: product.short_description || '',
          category_id: product.category_id.toString(),
          is_featured: product.is_featured || false,
          status:
            (product.status as 'active' | 'outOfStock' | 'draft') || 'draft',
          price: product.price?.toString() || '',
          model: product.model || '',
          working_dimensions: product.working_dimensions || '',
          spindle_power: product.spindle_power || '',
          spindle_speed: product.spindle_speed || '',
          movement_speed: product.movement_speed || '',
          accuracy: product.accuracy || '',
          control_system: product.control_system || '',
          compatible_software: product.compatible_software || '',
          file_formats: product.file_formats || '',
          power_consumption: product.power_consumption || '',
          machine_dimensions: product.machine_dimensions || '',
          weight: product.weight || '',
        });
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
    fetchProduct();
  }, [resolvedParams.id, form]);

  // Handle form submission
  const onSubmit = async (data: ProductFormValues) => {
    try {
      if (!data.category_id) {
        toast({
          title: 'Lỗi',
          description: 'Vui lòng chọn danh mục sản phẩm',
          variant: 'destructive',
        });
        return;
      }

      setIsSubmitting(true);

      // Update product data
      const { error: updateError } = await supabase
        .from('products')
        .update({
          name: data.name,
          slug: data.slug,
          description: data.description,
          short_description: data.short_description || null,
          category_id: parseInt(data.category_id),
          is_featured: data.is_featured,
          status: data.status,
          price: data.price ? parseFloat(data.price) : null,
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
          updated_at: new Date().toISOString(),
        })
        .eq('id', resolvedParams.id);

      if (updateError) throw updateError;

      // Update product images
      const { error: deleteImagesError } = await supabase
        .from('product_images')
        .delete()
        .eq('product_id', parseInt(resolvedParams.id));

      if (deleteImagesError) throw deleteImagesError;

      if (images.length > 0) {
        const { error: insertImagesError } = await supabase
          .from('product_images')
          .insert(
            images.map((image) => ({
              product_id: parseInt(resolvedParams.id),
              url: image.url,
              alt_text: image.alt_text || null,
              is_primary: image.is_primary,
              created_at: new Date().toISOString(),
              updated_at: null,
            }))
          );

        if (insertImagesError) throw insertImagesError;
      }

      // Update product features
      const { error: deleteFeaturesError } = await supabase
        .from('product_features')
        .delete()
        .eq('product_id', parseInt(resolvedParams.id));

      if (deleteFeaturesError) throw deleteFeaturesError;

      if (features.length > 0) {
        const { error: insertFeaturesError } = await supabase
          .from('product_features')
          .insert(
            features.map((feature) => ({
              product_id: parseInt(resolvedParams.id),
              title: feature.title,
              description: feature.description,
              created_at: new Date().toISOString(),
              updated_at: null,
            }))
          );

        if (insertFeaturesError) throw insertFeaturesError;
      }

      toast({
        title: 'Thành công',
        description: 'Sản phẩm đã được cập nhật thành công.',
      });

      router.push(`/admin/products/${resolvedParams.id}`);
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra khi cập nhật sản phẩm. Vui lòng thử lại.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle image functions
  const removeImage = (id: string) => {
    setImages(images.filter((image) => image.id !== id));
  };

  const setImageAsPrimary = (id: string) => {
    setImages(
      images.map((image) => ({
        ...image,
        is_primary: image.id === id,
      }))
    );
  };

  // Handle adding a new feature
  const addFeature = () => {
    const newFeature: ProductFeature = {
      id: `feature-${Date.now()}`,
      product_id: parseInt(resolvedParams.id),
      title: '',
      description: '',
      created_at: new Date().toISOString(),
      updated_at: null,
    };
    setFeatures([...features, newFeature]);
  };

  // Handle removing a feature
  const removeFeature = (id: string) => {
    setFeatures(features.filter((feature) => feature.id !== id));
  };

  // Auto-generate slug from product name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue('name', name);

    // Only generate slug if it hasn't been manually edited
    if (form.getValues('slug') === form.formState.defaultValues?.slug) {
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
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center justify-center text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <h3 className="mt-4 text-lg font-semibold">
            Đang tải dữ liệu sản phẩm...
          </h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex flex-col items-center justify-center text-center p-6 border border-red-200 rounded-lg bg-red-50">
          <p className="text-red-600">{error}</p>
          <Button
            className="mt-4"
            onClick={() => router.push('/admin/products')}
          >
            Quay lại danh sách sản phẩm
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Button asChild variant="ghost" className="mb-2">
            <Link href={`/admin/products/${resolvedParams.id}`}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Quay lại thông tin sản
              phẩm
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Chỉnh sửa sản phẩm
          </h1>
          <p className="text-muted-foreground">Cập nhật thông tin sản phẩm</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/products/${resolvedParams.id}`)}
          >
            Hủy
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList>
            <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
            <TabsTrigger value="images">Hình ảnh</TabsTrigger>
            <TabsTrigger value="specs">Thông số kỹ thuật</TabsTrigger>
            <TabsTrigger value="features">Tính năng</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
                <CardDescription>
                  Nhập thông tin cơ bản của sản phẩm
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
                          placeholder="Mô tả chi tiết về sản phẩm, tính năng, ứng dụng..."
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
                          value={form.getValues('category_id')}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn danh mục" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
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
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Bản nháp</SelectItem>
                            <SelectItem value="active">Đang bán</SelectItem>
                            <SelectItem value="outOfStock">Hết hàng</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá (VNĐ)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Nhập 0 nếu bạn muốn hiển thị "Liên hệ"
                        </FormDescription>
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
                          Sản phẩm sẽ được hiển thị trên trang chủ
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
                <CardDescription>Tải lên hình ảnh của sản phẩm</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="flex items-center justify-between border p-4 rounded-md"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={image.url}
                          alt={image.alt_text || ''}
                          className="h-20 w-20 object-cover rounded-md"
                        />
                        <div>
                          <p className="font-medium">{image.alt_text}</p>
                          <p className="text-sm text-muted-foreground">
                            {image.is_primary ? 'Ảnh đại diện' : 'Ảnh phụ'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setImageAsPrimary(image.id)}
                          disabled={image.is_primary}
                        >
                          {image.is_primary
                            ? 'Ảnh đại diện'
                            : 'Đặt làm ảnh đại diện'}
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(image.id)}
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Nhấp để tải lên</span>{' '}
                          hoặc kéo và thả
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG hoặc GIF (Tối đa 10MB)
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              if (e.target?.result) {
                                const newImage: ProductImage = {
                                  id: `image-${Date.now()}`,
                                  product_id: parseInt(resolvedParams.id),
                                  url: e.target.result as string,
                                  alt_text: file.name,
                                  is_primary: images.length === 0,
                                  created_at: new Date().toISOString(),
                                  updated_at: null,
                                };
                                setImages([...images, newImage]);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specs">
            <Card>
              <CardHeader>
                <CardTitle>Thông số kỹ thuật</CardTitle>
                <CardDescription>
                  Nhập các thông số kỹ thuật của sản phẩm
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <FormControl>
                          <Input placeholder="Model" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="working_dimensions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kích thước làm việc</FormLabel>
                        <FormControl>
                          <Input placeholder="1300 x 2500 x 200mm" {...field} />
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
                        <FormLabel>Công suất spindle</FormLabel>
                        <FormControl>
                          <Input placeholder="5.5kW" {...field} />
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
                        <FormLabel>Tốc độ spindle</FormLabel>
                        <FormControl>
                          <Input placeholder="24,000 rpm" {...field} />
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
                          <Input placeholder="30m/min" {...field} />
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
                          <Input placeholder="±0.01mm" {...field} />
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
                          <Input placeholder="DSP Controller" {...field} />
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
                            placeholder="Type3, Artcam, UcanCam"
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
                            placeholder="G-code, NC, DXF, PLT, AI"
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
                          <Input placeholder="7.5kW" {...field} />
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
                            placeholder="3200 x 1800 x 1900mm"
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
                          <Input placeholder="1200kg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
              <CardContent>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div
                      key={feature.id}
                      className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start border p-4 rounded-md"
                    >
                      <Input
                        placeholder="Tên tính năng"
                        className="md:col-span-1"
                        value={feature.title}
                        onChange={(e) => {
                          const updatedFeatures = [...features];
                          updatedFeatures[index].title = e.target.value;
                          setFeatures(updatedFeatures);
                        }}
                      />
                      <Textarea
                        placeholder="Mô tả tính năng"
                        className="md:col-span-2 resize-none"
                        value={feature.description}
                        onChange={(e) => {
                          const updatedFeatures = [...features];
                          updatedFeatures[index].description = e.target.value;
                          setFeatures(updatedFeatures);
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="mt-2 md:mt-0"
                        onClick={() => removeFeature(feature.id)}
                      >
                        Xóa
                      </Button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={addFeature}
                  >
                    + Thêm tính năng
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/admin/products/${resolvedParams.id}`)
                  }
                >
                  Hủy
                </Button>
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </Form>
    </div>
  );
}
