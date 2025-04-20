'use client';

import { useEffect, useState, useRef } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ChevronLeft, Loader2, Check } from 'lucide-react';
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
type Category = Database['public']['Tables']['categories']['Row'];
// Define a custom ProductImage type that matches what we're using in the UI
interface ProductImage {
  id: string;
  product_id: number | string;
  url: string;
  alt: string;
  is_primary: boolean;
  created_at: string;
}
// Define a custom ProductFeature type that matches what we're using in the UI
interface ProductFeature {
  id: string;
  product_id: number | string;
  title: string;
  description: string;
  created_at: string;
}

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
  params: { id: string };
}) {
  // Properly unwrap params with React.use() as recommended by Next.js
  const unwrappedParams = use(params as any);
  const { id } = unwrappedParams as { id: string };
  // Keep id as string since it's a UUID in the database
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepValidationState, setStepValidationState] = useState<boolean[]>(
    Array(6).fill(false)
  );

  // Define the form steps
  const formSteps = [
    { id: 'basic', label: 'Thông tin cơ bản' },
    { id: 'images', label: 'Hình ảnh' },
    { id: 'features', label: 'Tính năng' },
    { id: 'specifications', label: 'Thông số kỹ thuật' },
    { id: 'applications', label: 'Ứng dụng' },
    { id: 'documents', label: 'Tài liệu' },
  ];

  // References for the first fields of each step
  const firstInputRefs = useRef<Array<HTMLInputElement | null>>(
    Array(formSteps.length).fill(null)
  );

  // Initialize form
  const form = useForm<ProductFormValues>({
    mode: 'onChange', // Validate on change
    criteriaMode: 'all',
    reValidateMode: 'onChange',
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

  // Function to validate the current step
  const validateCurrentStep = async (): Promise<boolean> => {
    // Avoid excessive logging
    // console.log('Validating step:', currentStep);
    let isValid = false;

    try {
      switch (currentStep) {
        case 0: // Basic information
          // Trigger validation for required fields in the first step
          await form.trigger(['name', 'slug', 'description', 'category_id', 'status']);

          // Check if there are any errors in these fields
          const errors = form.formState.errors;
          isValid = !errors.name && !errors.slug && !errors.description &&
                   !errors.category_id && !errors.status;

          // Avoid excessive logging
          // console.log('Basic info validation errors:', errors);
          break;
        case 1: // Images
          // Images are optional, but if there are any, there must be a primary one
          isValid = images.length === 0 || images.some(img => img.is_primary);
          break;
        case 2: // Features
          // Features are optional
          isValid = true;
          break;
        case 3: // Specifications
          // Specifications are optional
          isValid = true;
          break;
        case 4: // Applications
          // Applications are optional
          isValid = true;
          break;
        case 5: // Documents
          // Documents are optional
          isValid = true;
          break;
        default:
          isValid = false;
      }
    } catch (error) {
      console.error('Validation error:', error);
      isValid = false;
    }

    // Update the validation state of the current step
    // Only update if the validation state has changed to prevent unnecessary re-renders
    if (stepValidationState[currentStep] !== isValid) {
      const newStepValidationState = [...stepValidationState];
      newStepValidationState[currentStep] = isValid;
      setStepValidationState(newStepValidationState);
    }

    // Avoid excessive logging
    // console.log('Step validation result:', isValid);
    return isValid;
  };

  // Validate the current step when form values change - with debounce to prevent infinite loops
  useEffect(() => {
    // Use a debounced validation to prevent infinite loops
    const timeoutId = setTimeout(() => {
      validateCurrentStep();
    }, 300);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, form.formState.isDirty]);

  // Validate when images or features change
  useEffect(() => {
    validateCurrentStep();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images, features]);

  // Initial validation when the form is loaded with product data
  useEffect(() => {
    if (!isLoading) {
      // Use a timeout to ensure the form is fully loaded
      const timeoutId = setTimeout(() => {
        validateCurrentStep();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  // Add a form submission handler for the top button
  const handleTopSubmit = () => {
    form.handleSubmit(onSubmit)();
  };

  // Function to advance to the next step
  const goToNextStep = async () => {
    const isValid = await validateCurrentStep();

    if (isValid && currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1);

      // Focus the first field of the new step
      setTimeout(() => {
        if (firstInputRefs.current[currentStep + 1]) {
          firstInputRefs.current[currentStep + 1]?.focus();
        }
      }, 100);
    }
  };

  // Function to go back to the previous step
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Function to go to a specific step (only if it's already validated or previous)
  const goToStep = (stepIndex: number) => {
    if (
      stepIndex < currentStep ||
      stepValidationState[stepIndex] ||
      stepValidationState.slice(0, stepIndex).every(Boolean)
    ) {
      setCurrentStep(stepIndex);
    }
  };

  // Check if all required steps are validated
  const allStepsValid = () => {
    return stepValidationState[0]; // We only need the first step to be valid to submit
  };

  // Fetch categories and product data
  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data: categories, error } = await supabase
          .from('categories')
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
          .eq('id', id)
          .single();

        if (productError) throw productError;

        // Fetch product images
        const { data: productImages, error: imagesError } = await supabase
          .from('product_images')
          .select('*')
          .eq('product_id' as string, id)
          .order('is_primary', { ascending: false });

        if (imagesError) throw imagesError;

        // Map the database images to our UI format
        const mappedImages = (productImages || []).map(img => ({
          ...img,
          alt: 'Product image' // Add a default alt text
        }));

        // Fetch product features
        const { data: productFeatures, error: featuresError } = await supabase
          .from('product_features')
          .select('*')
          .eq('product_id' as string, id);

        if (featuresError) throw featuresError;

        // Set state
        setImages(mappedImages);
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
          category_id: product.category_id ? product.category_id.toString() : '',
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
  }, [id, form]);

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
      console.log('Submitting form with data:', data);

      // Update product data
      const { error: updateError } = await supabase
        .from('products')
        .update({
          name: data.name,
          slug: data.slug,
          description: data.description,
          short_description: data.short_description || null,
          category_id: data.category_id as any, // Cast to any to avoid type error
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
        .eq('id', id);

      if (updateError) throw updateError;

      // Update product images
      const { error: deleteImagesError } = await supabase
        .from('product_images')
        .delete()
        .eq('product_id', id as any);

      if (deleteImagesError) throw deleteImagesError;

      if (images.length > 0) {
        console.log('Inserting images:', images);
        const { error: insertImagesError } = await supabase
          .from('product_images')
          .insert(
            images.map((image) => ({
              product_id: id as any,
              url: image.url,
              alt: 'Product image', // Add a default alt text
              is_primary: image.is_primary,
              created_at: new Date().toISOString(),
            }))
          );

        if (insertImagesError) throw insertImagesError;
      }

      // Update product features
      const { error: deleteFeaturesError } = await supabase
        .from('product_features')
        .delete()
        .eq('product_id', id as any);

      if (deleteFeaturesError) throw deleteFeaturesError;

      if (features.length > 0) {
        console.log('Inserting features:', features);
        const { error: insertFeaturesError } = await supabase
          .from('product_features')
          .insert(
            features.map((feature) => ({
              product_id: id as any,
              title: feature.title,
              description: feature.description,
              created_at: new Date().toISOString(),
            }))
          );

        if (insertFeaturesError) throw insertFeaturesError;
      }

      // Update product specifications
      try {
        // Delete existing specifications
        const { error: deleteSpecsError } = await supabase
          .from('product_specifications')
          .delete()
          .eq('product_id', id as any);

        if (deleteSpecsError) throw deleteSpecsError;

        // Insert new specifications
        // We're not adding any specifications in this version

        // If we had specs to insert, we would do it here
        const specsToInsert: any[] = [];
        if (specsToInsert.length > 0) {
          const { error: insertSpecsError } = await supabase
            .from('product_specifications')
            .insert(specsToInsert);

          if (insertSpecsError) throw insertSpecsError;
        }
      } catch (specsError) {
        console.error('Error updating product specifications:', specsError);
      }

      toast({
        title: 'Thành công',
        description: 'Sản phẩm đã được cập nhật thành công.',
        variant: 'default',
      });

      // Redirect to product list page after successful update
      router.push('/admin/products');
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
    // No need to call validateCurrentStep here as it will be triggered by the useEffect
  };

  const setImageAsPrimary = (id: string) => {
    setImages(
      images.map((image) => ({
        ...image,
        is_primary: image.id === id,
      }))
    );
    // No need to call validateCurrentStep here as it will be triggered by the useEffect
  };

  // Handle adding a new feature
  const addFeature = () => {
    const newFeature: ProductFeature = {
      id: `feature-${Date.now()}`,
      product_id: id as any,
      title: '',
      description: '',
      created_at: new Date().toISOString(),
    };
    setFeatures([...features, newFeature]);
    // No need to call validateCurrentStep here as it will be triggered by the useEffect
  };

  // Handle removing a feature
  const removeFeature = (id: string) => {
    setFeatures(features.filter((feature) => feature.id !== id));
    // No need to call validateCurrentStep here as it will be triggered by the useEffect
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
            <Link href={`/admin/products/${id}`}>
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
            onClick={() => router.push(`/admin/products/${id}`)}
          >
            Hủy
          </Button>
          <Button type="button" onClick={handleTopSubmit} disabled={isSubmitting || !allStepsValid()}>
            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </div>

      <Tabs
        value={formSteps[currentStep].id}
        className="space-y-4"
        onValueChange={(value) => {
          const stepIndex = formSteps.findIndex(step => step.id === value);
          if (stepIndex !== -1) {
            goToStep(stepIndex);
          }
        }}
      >
        <TabsList className="grid grid-cols-6 w-full">
          {formSteps.map((step, index) => (
            <TabsTrigger
              key={step.id}
              value={step.id}
              disabled={index > currentStep && !stepValidationState[index-1]}
              className="relative"
            >
              {step.label}
              {stepValidationState[index] && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  <Check className="h-3 w-3" />
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <Form {...form}>
          <form onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(onSubmit)(e);
          }}>
            {/* Navigation buttons */}
            <div className="flex justify-between mb-6">
              <Button
                type="button"
                variant="outline"
                onClick={goToPreviousStep}
                disabled={currentStep === 0}
              >
                Quay lại
              </Button>

              <div className="flex gap-2">
                {currentStep < formSteps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={goToNextStep}
                    disabled={!stepValidationState[currentStep]}
                  >
                    Tiếp theo
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!allStepsValid() || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      'Lưu thay đổi'
                    )}
                  </Button>
                )}
              </div>
            </div>

            <TabsContent value="basic">
              <div>
              <h2 className="text-xl font-semibold mb-4">Thông tin cơ bản</h2>

              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cơ bản</CardTitle>
                  <CardDescription>
                    Cập nhật thông tin cơ bản cho sản phẩm
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
                          value={field.value || ''}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn danh mục" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
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
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
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

              <Card>
                <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="flex items-center justify-between border p-4 rounded-md"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={image.url}
                          alt={image.alt}
                          className="h-20 w-20 object-cover rounded-md"
                        />
                        <div>
                          <p className="font-medium">{image.alt}</p>
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
                                  product_id: id as any,
                                  url: e.target.result as string,
                                  alt: file.name || 'Product image', // Use filename as alt text
                                  is_primary: images.length === 0,
                                  created_at: new Date().toISOString(),
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

              <Card>
                <CardContent className="space-y-6 pt-6">
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

              <Card>
                <CardContent className="pt-6">
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
                  <Button type="button" variant="outline" onClick={goToPreviousStep}>
                    Quay lại
                  </Button>
                  <Button type="button" onClick={goToNextStep} disabled={!stepValidationState[currentStep]}>
                    Tiếp theo
                  </Button>
                </CardFooter>
              </Card>
            </div>
            </TabsContent>

          <TabsContent value="images">
            <div>
              <h2 className="text-xl font-semibold mb-4">Hình ảnh sản phẩm</h2>
              <Card>
                <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="flex items-center justify-between border p-4 rounded-md"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={image.url}
                          alt={image.alt}
                          className="h-20 w-20 object-cover rounded-md"
                        />
                        <div>
                          <p className="font-medium">{image.alt}</p>
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
                                  product_id: id as any,
                                  url: e.target.result as string,
                                  alt: file.name || 'Product image', // Use filename as alt text
                                  is_primary: images.length === 0,
                                  created_at: new Date().toISOString(),
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
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={goToPreviousStep}>
                    Quay lại
                  </Button>
                  <Button type="button" onClick={goToNextStep} disabled={!stepValidationState[currentStep]}>
                    Tiếp theo
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="features">
            <div>
              <h2 className="text-xl font-semibold mb-4">Tính năng sản phẩm</h2>
              <Card>
                <CardContent className="pt-6">
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
                  <Button type="button" variant="outline" onClick={goToPreviousStep}>
                    Quay lại
                  </Button>
                  <Button type="button" onClick={goToNextStep} disabled={!stepValidationState[currentStep]}>
                    Tiếp theo
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="specifications">
            <div>
              <h2 className="text-xl font-semibold mb-4">Thông số kỹ thuật</h2>
              <Card>
                <CardContent className="space-y-6 pt-6">
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
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={goToPreviousStep}>
                    Quay lại
                  </Button>
                  <Button type="button" onClick={goToNextStep} disabled={!stepValidationState[currentStep]}>
                    Tiếp theo
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="applications">
            <div>
              <h2 className="text-xl font-semibold mb-4">Ứng dụng sản phẩm</h2>

              <Card>
                <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <FormLabel>Catalogue sản phẩm (URL)</FormLabel>
                    <Input
                      placeholder="https://example.com/catalogue.pdf"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <FormLabel>Hướng dẫn sử dụng (URL)</FormLabel>
                    <Input
                      placeholder="https://example.com/manual.pdf"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <FormLabel>Bảng thông số chi tiết (URL)</FormLabel>
                    <Input
                      placeholder="https://example.com/datasheet.pdf"
                      className="mt-2"
                    />
                  </div>
                </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={goToPreviousStep}>
                    Quay lại
                  </Button>
                  <Button
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isSubmitting || !allStepsValid()}
                  >
                    {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <div>
              <h2 className="text-xl font-semibold mb-4">Tài liệu kỹ thuật</h2>

              <Card>
                <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <FormLabel>Ngành nội thất</FormLabel>
                    <Textarea
                      placeholder="Mô tả ứng dụng trong ngành nội thất"
                      className="resize-none mt-2"
                      rows={4}
                      defaultValue="Sản xuất nội thất, tủ bếp, cửa gỗ, bàn ghế"
                    />
                  </div>

                  <div>
                    <FormLabel>Trang trí nội thất</FormLabel>
                    <Textarea
                      placeholder="Mô tả ứng dụng trong trang trí nội thất"
                      className="resize-none mt-2"
                      rows={4}
                      defaultValue="Trang trí nội thất, ốp tường, trần nghệ thuật"
                    />
                  </div>

                  <div>
                    <FormLabel>Quảng cáo</FormLabel>
                    <Textarea
                      placeholder="Mô tả ứng dụng trong ngành quảng cáo"
                      className="resize-none mt-2"
                      rows={4}
                      defaultValue="Biển hiệu, logo, standee"
                    />
                  </div>

                  <div>
                    <FormLabel>Ứng dụng ngành công nghiệp gỗ</FormLabel>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center gap-2">
                        <Input defaultValue="Sản xuất đồ nội thất" />
                        <Button type="button" variant="destructive" size="sm">
                          Xóa
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input defaultValue="Sản xuất cửa gỗ" />
                        <Button type="button" variant="destructive" size="sm">
                          Xóa
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input defaultValue="Chế tác mỹ nghệ" />
                        <Button type="button" variant="destructive" size="sm">
                          Xóa
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input defaultValue="Sản xuất tủ bếp" />
                        <Button type="button" variant="destructive" size="sm">
                          Xóa
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input placeholder="Thêm ứng dụng mới" />
                        <Button type="button" variant="outline" size="sm">
                          Thêm
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <FormLabel>Ứng dụng ngành quảng cáo</FormLabel>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center gap-2">
                        <Input defaultValue="Biển hiệu quảng cáo" />
                        <Button type="button" variant="destructive" size="sm">
                          Xóa
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input defaultValue="Standee" />
                        <Button type="button" variant="destructive" size="sm">
                          Xóa
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input defaultValue="Bảng hiệu cửa hàng" />
                        <Button type="button" variant="destructive" size="sm">
                          Xóa
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input defaultValue="Logo công ty" />
                        <Button type="button" variant="destructive" size="sm">
                          Xóa
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input placeholder="Thêm ứng dụng mới" />
                        <Button type="button" variant="outline" size="sm">
                          Thêm
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={goToPreviousStep}>
                    Quay lại
                  </Button>
                  <Button type="button" onClick={goToNextStep} disabled={!stepValidationState[currentStep]}>
                    Tiếp theo
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}
