'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
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
import { toast } from '@/components/ui/use-toast';
import {
  MultiStepForm,
  MultiStepFormContent,
} from '@/components/ui/multi-step-form';
import { ImageUpload } from '@/components/admin/products/image-upload';

// Define the form schema (combined schema for all steps)
const productFormSchema = z.object({
  // Step 1: Basic Information
  name: z.string().min(3, {
    message: 'Tên sản phẩm phải có ít nhất 3 ký tự',
  }),
  slug: z.string().min(3, {
    message: 'Slug phải có ít nhất 3 ký tự',
  }),
  shortDescription: z.string().optional(),
  description: z.string().min(10, {
    message: 'Mô tả phải có ít nhất 10 ký tự',
  }),
  categoryId: z.string({
    required_error: 'Vui lòng chọn danh mục',
  }),
  status: z.enum(['active', 'outOfStock', 'draft'], {
    required_error: 'Vui lòng chọn trạng thái',
  }),
  isFeatured: z.boolean().default(false),
  price: z.coerce.number().min(0, {
    message: 'Giá phải lớn hơn hoặc bằng 0',
  }),

  // Step 2: Images
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

  // Step 3: Specifications
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

  // Step 4: Features
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

type ProductFormValues = z.infer<typeof productFormSchema>;

export default function AddProductWizardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/categories');

        if (!response.ok) {
          throw new Error('Không thể tải danh mục');
        }

        const data = await response.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error('Lỗi khi tải danh mục:', error);
        toast({
          title: 'Lỗi!',
          description: 'Không thể tải danh mục. Vui lòng thử lại sau.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Initialize form with default values
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      shortDescription: '',
      description: '',
      categoryId: '',
      status: 'draft',
      isFeatured: false,
      price: 0,
      images: [],
      model: '',
      workingDimensions: '',
      spindlePower: '',
      spindleSpeed: '',
      movementSpeed: '',
      accuracy: '',
      controlSystem: '',
      compatibleSoftware: '',
      fileFormats: '',
      powerConsumption: '',
      machineDimensions: '',
      weight: '',
      features: [{ id: '1', name: '', description: '' }],
    },
    mode: 'onChange',
  });

  // Define the steps
  const steps = [
    {
      id: 'step-1',
      label: 'Thông tin cơ bản',
      description: 'Thông tin chung về sản phẩm',
    },
    { id: 'step-2', label: 'Hình ảnh', description: 'Hình ảnh sản phẩm' },
    {
      id: 'step-3',
      label: 'Thông số kỹ thuật',
      description: 'Thông số kỹ thuật của sản phẩm',
    },
    { id: 'step-4', label: 'Tính năng', description: 'Các tính năng nổi bật' },
  ];

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
    if (features.length <= 1) return; // Don't remove the last feature

    const newFeatures = [...features];
    newFeatures.splice(index, 1);
    form.setValue('features', newFeatures);
  };

  // Handle form submission
  const onSubmit = async (data: ProductFormValues) => {
    try {
      setIsSubmitting(true);

      const productData = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        short_description: data.shortDescription,
        category_id: data.categoryId,
        is_featured: data.isFeatured,
        status: data.status,
        price: data.price,
        model: data.model,
        working_dimensions: data.workingDimensions,
        spindle_power: data.spindlePower,
        spindle_speed: data.spindleSpeed,
        movement_speed: data.movementSpeed,
        accuracy: data.accuracy,
        control_system: data.controlSystem,
        compatible_software: data.compatibleSoftware,
        file_formats: data.fileFormats,
        power_consumption: data.powerConsumption,
        machine_dimensions: data.machineDimensions,
        weight: data.weight,
        images: data.images,
        features: data.features,
      };

      // Send the data to the API
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Có lỗi xảy ra khi tạo sản phẩm');
      }

      toast({
        title: 'Thành công',
        description: 'Sản phẩm đã được tạo thành công.',
      });

      router.push('/admin/products');
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra khi tạo sản phẩm. Vui lòng thử lại.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle navigation between steps
  const nextStep = async () => {
    const fields = [
      // Step 1 fields
      ['name', 'slug', 'description', 'categoryId', 'status'],
      // Step 2 fields - images are optional
      [],
      // Step 3 fields - all are optional
      [],
      // Step 4 fields - features are validated on submission
      [],
    ];

    const currentFields = fields[currentStep];

    // Validate current step fields
    const isValid = await form.trigger(currentFields as any);

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  // Define step content
  const stepContents = [
    // Step 1: Basic Information
    {
      id: 'step-1-content',
      content: (
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
                      defaultValue={field.value}
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
                      defaultValue={field.value}
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
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => router.push('/admin/products')}
            >
              Hủy
            </Button>
            <Button onClick={nextStep}>
              Tiếp tục
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ),
    },
    // Step 2: Images
    {
      id: 'step-2-content',
      content: (
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
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
            <Button onClick={nextStep}>
              Tiếp tục
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ),
    },
    // Step 3: Specifications
    {
      id: 'step-3-content',
      content: (
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
                      <Input placeholder="Type3, Artcam, UcanCam" {...field} />
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
                      <Input placeholder="3200 x 1800 x 1900mm" {...field} />
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
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
            <Button onClick={nextStep}>
              Tiếp tục
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ),
    },
    // Step 4: Features
    {
      id: 'step-4-content',
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Tính năng sản phẩm</CardTitle>
            <CardDescription>
              Thêm các tính năng nổi bật của sản phẩm
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
                  disabled={form.watch('features').length <= 1}
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>Đang lưu...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Lưu sản phẩm
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Thêm Sản Phẩm Mới
          </h1>
          <p className="text-muted-foreground">
            Hoàn thành các bước để tạo sản phẩm mới
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/products">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Link>
        </Button>
      </div>

      <Form {...form}>
        <div className="space-y-8">
          <MultiStepForm
            steps={steps}
            currentStepIndex={currentStep}
            goToStep={goToStep}
          />

          <MultiStepFormContent
            steps={stepContents}
            currentStepIndex={currentStep}
          />
        </div>
      </Form>
    </div>
  );
}
