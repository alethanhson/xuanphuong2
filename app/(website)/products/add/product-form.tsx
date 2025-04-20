'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Check } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import type { Database } from '@/types/supabase';

// Importar componentes de pasos
import BasicInfoStep from './form-steps/basic-info';
import ImagesStep from './form-steps/images';
import FeaturesStep from './form-steps/features';
import SpecificationsStep from './form-steps/specifications';
import ApplicationsStep from './form-steps/applications';
import DocumentsStep from './form-steps/documents';

// Definir el esquema de validación
const productFormSchema = z.object({
  // Información básica (Tab 1)
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
  
  // Especificaciones técnicas (Tab 4)
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
  
  // Aplicaciones (Tab 5)
  furniture: z.string().optional(),
  interior_decoration: z.string().optional(),
  advertising: z.string().optional(),
  
  // Documentos (Tab 6)
  catalogue_url: z.string().optional(),
  manual_url: z.string().optional(),
  datasheet_url: z.string().optional(),
});

// Definir los tipos para los valores del formulario
type ProductFormValues = z.infer<typeof productFormSchema>;
type Category = Database['public']['Tables']['categories']['Row'];

// Definir los pasos del formulario
const formSteps = [
  { id: 'basic', label: 'Thông tin cơ bản' },
  { id: 'images', label: 'Hình ảnh' },
  { id: 'features', label: 'Tính năng' },
  { id: 'specifications', label: 'Thông số kỹ thuật' },
  { id: 'applications', label: 'Ứng dụng' },
  { id: 'documents', label: 'Tài liệu' },
];

export default function ProductForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stepValidationState, setStepValidationState] = useState<boolean[]>(
    Array(formSteps.length).fill(false)
  );
  
  // Referencias para los primeros campos de cada paso
  const firstInputRefs = useRef<(HTMLInputElement | null)[]>(
    Array(formSteps.length).fill(null)
  );

  // Estado para imágenes y características
  const [images, setImages] = useState<
    { id: string; file: File; preview: string; isPrimary: boolean }[]
  >([]);
  const [features, setFeatures] = useState<
    { id: string; name: string; description: string; icon: string }[]
  >([]);
  const [woodIndustryApps, setWoodIndustryApps] = useState<string[]>([
    'Sản xuất đồ nội thất',
    'Sản xuất cửa gỗ',
    'Chế tác mỹ nghệ',
    'Sản xuất tủ bếp',
  ]);
  const [advertisingApps, setAdvertisingApps] = useState<string[]>([
    'Biển hiệu quảng cáo',
    'Standee',
    'Bảng hiệu cửa hàng',
    'Logo công ty',
  ]);

  // Inicializar formulario con valores predeterminados
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    mode: 'onChange', // Validar al cambiar
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
      furniture: 'Sản xuất nội thất, tủ bếp, cửa gỗ, bàn ghế',
      interior_decoration: 'Trang trí nội thất, ốp tường, trần nghệ thuật',
      advertising: 'Biển hiệu, logo, standee',
      catalogue_url: '',
      manual_url: '',
      datasheet_url: '',
    },
  });

  // Cargar categorías al montar el componente
  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('categories')
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

  // Función para validar el paso actual
  const validateCurrentStep = async (): Promise<boolean> => {
    let isValid = false;
    
    switch (currentStep) {
      case 0: // Información básica
        isValid = await form.trigger(['name', 'slug', 'description', 'category_id', 'status']);
        break;
      case 1: // Imágenes
        // Las imágenes son opcionales, pero si hay alguna, debe haber una primaria
        isValid = images.length === 0 || images.some(img => img.isPrimary);
        break;
      case 2: // Características
        // Las características son opcionales
        isValid = true;
        break;
      case 3: // Especificaciones técnicas
        // Las especificaciones son opcionales
        isValid = true;
        break;
      case 4: // Aplicaciones
        // Las aplicaciones son opcionales
        isValid = true;
        break;
      case 5: // Documentos
        // Los documentos son opcionales
        isValid = true;
        break;
      default:
        isValid = false;
    }

    // Actualizar el estado de validación del paso actual
    const newStepValidationState = [...stepValidationState];
    newStepValidationState[currentStep] = isValid;
    setStepValidationState(newStepValidationState);
    
    return isValid;
  };

  // Validar el paso actual cuando cambian los valores del formulario
  useEffect(() => {
    validateCurrentStep();
  }, [form.watch(), images, features]);

  // Función para avanzar al siguiente paso
  const goToNextStep = async () => {
    const isValid = await validateCurrentStep();
    
    if (isValid && currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      
      // Enfocar el primer campo del nuevo paso
      setTimeout(() => {
        if (firstInputRefs.current[currentStep + 1]) {
          firstInputRefs.current[currentStep + 1]?.focus();
        }
      }, 100);
    }
  };

  // Función para retroceder al paso anterior
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Función para ir a un paso específico (solo si ya está validado o es anterior)
  const goToStep = (stepIndex: number) => {
    if (
      stepIndex < currentStep || 
      stepValidationState[stepIndex] || 
      stepValidationState.slice(0, stepIndex).every(Boolean)
    ) {
      setCurrentStep(stepIndex);
    }
  };

  // Verificar si todos los pasos están validados
  const allStepsValid = () => {
    return stepValidationState[0]; // Solo necesitamos que el primer paso sea válido para enviar
  };

  // Generar slug a partir del nombre del producto
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue('name', name);

    // Generar slug
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

  // Manejar envío del formulario
  async function onSubmit(data: ProductFormValues) {
    try {
      setIsSubmitting(true);

      // Subir imágenes si hay alguna
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

          // Obtener URL pública
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

      // Preparar datos del producto
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

      // Insertar producto
      const { data: product, error } = await supabase
        .from('products')
        .insert(productData as any)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Insertar imágenes del producto
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

      // Insertar características del producto
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

      // Guardar aplicaciones de industria de madera y publicidad
      try {
        // Guardar información de aplicaciones en la tabla product_specifications
        const specsToInsert = [
          {
            product_id: product.id,
            name: 'wood_industry_applications',
            value: JSON.stringify(woodIndustryApps),
            created_at: new Date().toISOString(),
          },
          {
            product_id: product.id,
            name: 'advertising_applications',
            value: JSON.stringify(advertisingApps),
            created_at: new Date().toISOString(),
          }
        ];

        // Añadir campos de aplicación si existen
        if (data.furniture) {
          specsToInsert.push({
            product_id: product.id,
            name: 'furniture',
            value: data.furniture,
            created_at: new Date().toISOString(),
          });
        }

        if (data.interior_decoration) {
          specsToInsert.push({
            product_id: product.id,
            name: 'interior_decoration',
            value: data.interior_decoration,
            created_at: new Date().toISOString(),
          });
        }

        if (data.advertising) {
          specsToInsert.push({
            product_id: product.id,
            name: 'advertising',
            value: data.advertising,
            created_at: new Date().toISOString(),
          });
        }

        // Añadir documentos técnicos si existen
        if (data.catalogue_url) {
          specsToInsert.push({
            product_id: product.id,
            name: 'catalogue_url',
            value: data.catalogue_url,
            created_at: new Date().toISOString(),
          });
        }

        if (data.manual_url) {
          specsToInsert.push({
            product_id: product.id,
            name: 'manual_url',
            value: data.manual_url,
            created_at: new Date().toISOString(),
          });
        }

        if (data.datasheet_url) {
          specsToInsert.push({
            product_id: product.id,
            name: 'datasheet_url',
            value: data.datasheet_url,
            created_at: new Date().toISOString(),
          });
        }

        const { error: appError } = await supabase
          .from('product_specifications')
          .insert(specsToInsert as any);

        if (appError) {
          console.error('Error adding product specifications:', appError);
        }
      } catch (appError) {
        console.error('Error saving specifications:', appError);
      }

      toast({
        title: 'Thành công!',
        description: 'Sản phẩm đã được tạo thành công.',
      });

      // Redireccionar después de completar
      router.push('/products');
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
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center justify-center text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <h3 className="mt-4 text-lg font-semibold">Đang tải dữ liệu...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Indicador de pasos */}
      <div className="mb-8">
        <Tabs 
          value={formSteps[currentStep].id} 
          className="w-full"
          onValueChange={(value) => {
            const stepIndex = formSteps.findIndex(step => step.id === value);
            if (stepIndex !== -1) {
              goToStep(stepIndex);
            }
          }}
        >
          <TabsList className="w-full grid grid-cols-6">
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
        </Tabs>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Contenido del paso actual */}
          <div className="mt-4">
            {currentStep === 0 && (
              <BasicInfoStep 
                form={form} 
                categories={categories} 
                handleNameChange={handleNameChange}
                ref={(el) => (firstInputRefs.current[0] = el)}
              />
            )}
            
            {currentStep === 1 && (
              <ImagesStep 
                images={images} 
                setImages={setImages} 
                ref={(el) => (firstInputRefs.current[1] = el)}
              />
            )}
            
            {currentStep === 2 && (
              <FeaturesStep 
                features={features} 
                setFeatures={setFeatures} 
                ref={(el) => (firstInputRefs.current[2] = el)}
              />
            )}
            
            {currentStep === 3 && (
              <SpecificationsStep 
                form={form} 
                ref={(el) => (firstInputRefs.current[3] = el)}
              />
            )}
            
            {currentStep === 4 && (
              <ApplicationsStep 
                form={form} 
                woodIndustryApps={woodIndustryApps}
                setWoodIndustryApps={setWoodIndustryApps}
                advertisingApps={advertisingApps}
                setAdvertisingApps={setAdvertisingApps}
                ref={(el) => (firstInputRefs.current[4] = el)}
              />
            )}
            
            {currentStep === 5 && (
              <DocumentsStep 
                form={form} 
                ref={(el) => (firstInputRefs.current[5] = el)}
              />
            )}
          </div>

          {/* Botones de navegación */}
          <div className="flex justify-between pt-8">
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
                      Đang tạo...
                    </>
                  ) : (
                    'Tạo sản phẩm'
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
