'use client';

import { useEffect, useState } from 'react';
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
import { ImageUpload } from '@/components/admin/products/image-upload';

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
  shortDescription: z.string().optional(),
  categoryId: z.string({
    required_error: 'Vui lòng chọn danh mục',
  }),
  isFeatured: z.boolean().default(false),
  status: z.enum(['active', 'outOfStock', 'draft'], {
    required_error: 'Vui lòng chọn trạng thái',
  }),
  model: z.string().optional(),
  workingDimensions: z.string().optional(),
  spindlePower: z.string().optional(),
  spindleSpeed: z.string().optional(),
  movementSpeed: z.string().optional(),
  accuracy: z.string().optional(),
  controlSystem: z.string().optional(),
  compatibleSoftware: z.string().optional(),
  fileFormats: z.string().optional(),
  powerConsumption: z.string().optional(),
  machineDimensions: z.string().optional(),
  weight: z.string().optional(),
  price: z.coerce.number().min(0, {
    message: 'Giá phải lớn hơn hoặc bằng 0',
  }),
  images: z
    .array(
      z.object({
        id: z.string(),
        url: z.string(),
        alt: z.string(),
        isPrimary: z.boolean(),
      })
    )
    .default([]),
  features: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().min(1, 'Tên tính năng không được để trống'),
        description: z.string().min(1, 'Mô tả tính năng không được để trống'),
      })
    )
    .default([]),
});

// Mock categories data
const categories = [
  { id: '1', name: 'Máy CNC Gỗ' },
  { id: '2', name: 'Máy CNC Kim Loại' },
  { id: '3', name: 'Máy CNC Laser' },
  { id: '4', name: 'Phụ kiện CNC' },
];

type ProductFormValues = z.infer<typeof productFormSchema>;

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      shortDescription: '',
      categoryId: '',
      isFeatured: false,
      status: 'draft',
      price: 0,
      images: [],
      features: [],
    },
  });

  // Fetch product data
  useEffect(() => {
    async function fetchProduct() {
      try {
        setIsLoading(true);

        // In a real app, fetch from your API
        // const response = await fetch(`/api/admin/products/${params.id}`)
        // if (!response.ok) throw new Error('Failed to fetch product')
        // const data = await response.json()

        // Mock data for demonstration
        const data = {
          id: params.id,
          name: 'CNC WoodMaster 500',
          slug: 'cnc-woodmaster-500',
          description:
            'Máy CNC chuyên dụng cho ngành gỗ với hiệu suất cao và độ chính xác tuyệt đối. Thiết kế bền bỉ, dễ sử dụng, phù hợp với các xưởng sản xuất vừa và nhỏ.',
          shortDescription: 'Máy CNC chuyên dụng cho ngành gỗ',
          categoryId: '1',
          isFeatured: true,
          status: 'active',
          price: 0,
          model: 'WM-500',
          workingDimensions: '1300 x 2500 x 200mm',
          spindlePower: '5.5kW',
          spindleSpeed: '24,000 rpm',
          movementSpeed: '30m/min',
          accuracy: '±0.01mm',
          controlSystem: 'DSP Controller',
          compatibleSoftware: 'Type3, Artcam, UcanCam',
          fileFormats: 'G-code, NC, DXF, PLT, AI',
          powerConsumption: '7.5kW',
          machineDimensions: '3200 x 1800 x 1900mm',
          weight: '1200kg',
          images: [
            {
              id: '1',
              url: '/placeholder.svg?height=600&width=600',
              alt: 'CNC WoodMaster 500',
              isPrimary: true,
            },
            {
              id: '2',
              url: '/placeholder.svg?height=600&width=600',
              alt: 'CNC WoodMaster 500 mặt hông',
              isPrimary: false,
            },
          ],
          features: [
            {
              id: '1',
              name: 'Hệ thống điều khiển thông minh',
              description:
                'Hệ thống điều khiển DSP hiện đại, dễ dàng sử dụng với giao diện trực quan, hỗ trợ nhiều ngôn ngữ và kết nối USB.',
            },
            {
              id: '2',
              name: 'Độ chính xác cao',
              description:
                'Sai số chỉ ±0.01mm, đảm bảo các chi tiết được gia công chính xác, đồng đều và tinh xảo.',
            },
          ],
        };

        // Reset form with product data
        form.reset({
          name: data.name,
          slug: data.slug,
          description: data.description,
          shortDescription: data.shortDescription,
          categoryId: data.categoryId,
          isFeatured: data.isFeatured,
          status: data.status as 'active' | 'outOfStock' | 'draft',
          price: data.price,
          model: data.model,
          workingDimensions: data.workingDimensions,
          spindlePower: data.spindlePower,
          spindleSpeed: data.spindleSpeed,
          movementSpeed: data.movementSpeed,
          accuracy: data.accuracy,
          controlSystem: data.controlSystem,
          compatibleSoftware: data.compatibleSoftware,
          fileFormats: data.fileFormats,
          powerConsumption: data.powerConsumption,
          machineDimensions: data.machineDimensions,
          weight: data.weight,
          images: data.images,
          features: data.features,
        });
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [params.id, form]);

  // Handle form submission
  const onSubmit = async (data: ProductFormValues) => {
    try {
      setIsSubmitting(true);

      // Format the data for the API
      const productData = {
        id: params.id,
        name: data.name,
        slug: data.slug,
        description: data.description,
        shortDescription: data.shortDescription,
        categoryId: data.categoryId,
        isFeatured: data.isFeatured,
        status: data.status,
        price: data.price,
        model: data.model,
        workingDimensions: data.workingDimensions,
        spindlePower: data.spindlePower,
        spindleSpeed: data.spindleSpeed,
        movementSpeed: data.movementSpeed,
        accuracy: data.accuracy,
        controlSystem: data.controlSystem,
        compatibleSoftware: data.compatibleSoftware,
        fileFormats: data.fileFormats,
        powerConsumption: data.powerConsumption,
        machineDimensions: data.machineDimensions,
        weight: data.weight,
        images: data.images,
        features: data.features,
      };

      // Send the data to the API
      // const response = await fetch(`/api/admin/products/${params.id}`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(productData),
      // })

      // if (!response.ok) {
      //   throw new Error("Failed to update product")
      // }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: 'Thành công',
        description: 'Sản phẩm đã được cập nhật thành công.',
      });

      router.push(`/admin/products/${params.id}`);
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

  // Handle adding a new feature
  const addFeature = () => {
    const features = form.getValues('features') || [];
    form.setValue('features', [
      ...features,
      { id: `feature-${Date.now()}`, name: '', description: '' },
    ]);
  };

  // Handle removing a feature
  const removeFeature = (index: number) => {
    const features = form.getValues('features');
    const newFeatures = [...features];
    newFeatures.splice(index, 1);
    form.setValue('features', newFeatures);
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
            <Link href={`/admin/products/${params.id}`}>
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
            onClick={() => router.push(`/admin/products/${params.id}`)}
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
                  name="shortDescription"
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
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Danh mục</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
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
                  name="isFeatured"
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
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          initialImages={field.value}
                          onImagesChange={(images) => {
                            field.onChange(images);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Tải lên tối đa 10 hình ảnh cho sản phẩm. Ảnh đầu tiên sẽ
                        được chọn làm ảnh đại diện.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                    name="workingDimensions"
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
                    name="spindlePower"
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
                    name="spindleSpeed"
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
                    name="movementSpeed"
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
                    name="controlSystem"
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
                    name="compatibleSoftware"
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
                    name="fileFormats"
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
                    name="powerConsumption"
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
                    name="machineDimensions"
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
                  {form.watch('features').map((feature, index) => (
                    <div
                      key={feature.id}
                      className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start border p-4 rounded-md"
                    >
                      <Input
                        placeholder="Tên tính năng"
                        className="md:col-span-1"
                        value={feature.name}
                        onChange={(e) => {
                          const features = [...form.getValues('features')];
                          features[index].name = e.target.value;
                          form.setValue('features', features);
                        }}
                      />
                      <Textarea
                        placeholder="Mô tả tính năng"
                        className="md:col-span-2 resize-none"
                        value={feature.description}
                        onChange={(e) => {
                          const features = [...form.getValues('features')];
                          features[index].description = e.target.value;
                          form.setValue('features', features);
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="mt-2 md:mt-0"
                        onClick={() => removeFeature(index)}
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
                  onClick={() => router.push(`/admin/products/${params.id}`)}
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
