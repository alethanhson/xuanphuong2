'use client';

import { useState, useEffect, Suspense } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import React from 'react';
import { ChevronLeft, Pencil, Trash, Eye, Star } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description?: string | null;
  category_id: number;
  price?: number | null;
  is_featured: boolean;
  status: string;
  created_at: string;
  updated_at?: string | null;
  categories?: {
    id: number;
    name: string;
    slug: string;
  } | null;
  images: Array<{
    id: number;
    url: string;
    alt?: string | null;
    isPrimary: boolean;
  }>;
  features: Array<{
    id: number;
    title: string;
    description: string;
  }>;
  specifications: Array<{
    id: number;
    name: string;
    value: string;
  }>;
  model?: string | null;
  working_dimensions?: string | null;
  spindle_power?: string | null;
  spindle_speed?: string | null;
  movement_speed?: string | null;
  accuracy?: string | null;
  control_system?: string | null;
  compatible_software?: string | null;
  file_formats?: string | null;
  power_consumption?: string | null;
  machine_dimensions?: string | null;
  weight?: string | null;
};

interface Params {
  id: string;
}

async function fetchProductData(id: string) {
  const supabase = createClientComponentClient<Database>();
  const { data: productData, error: productError } = await supabase
    .from('products')
    .select(
      `
      *,
      categories:product_categories(id, name, slug),
      images:product_images(*),
      features:product_features(*),
      specifications:product_specifications(*)
    `
    )
    .eq('id', id)
    .single();

  if (productError) {
    throw productError;
  }

  return productData;
}

export default function ProductDetailPage({ params }: { params: Params }) {
  const router = useRouter();
  const { id } = React.use(params as any) as Params;
  console.log(id);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await fetchProductData(id);
        setProduct(productData as unknown as Product);
      } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải thông tin sản phẩm',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (!product) return;

    setIsDeleting(true);
    try {
      const { error: featuresError } =
        await createClientComponentClient<Database>()
          .from('product_features')
          .delete()
          .eq('product_id', product.id);

      if (featuresError) throw featuresError;

      const { error: specificationsError } =
        await createClientComponentClient<Database>()
          .from('product_specifications')
          .delete()
          .eq('product_id', product.id);

      if (specificationsError) throw specificationsError;

      const { error: imagesError } =
        await createClientComponentClient<Database>()
          .from('product_images')
          .delete()
          .eq('product_id', product.id);

      if (imagesError) throw imagesError;

      const { error: productError } =
        await createClientComponentClient<Database>()
          .from('products')
          .delete()
          .eq('id', String(product.id));

      if (productError) throw productError;

      toast({
        title: 'Thành công',
        description: 'Đã xóa sản phẩm',
      });

      router.push('/admin/products');
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa sản phẩm',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/admin/products">
            <ChevronLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
          </Link>
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {product.name}
              </h1>
              {product.is_featured && (
                <Badge className="bg-yellow-500 text-primary-foreground">
                  <Star className="mr-1 h-3 w-3 fill-current" /> Nổi bật
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              Cập nhật lần cuối:{' '}
              {formatDate(product.updated_at || product.created_at)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/products/${product.slug}`} target="_blank">
                <Eye className="mr-2 h-4 w-4" /> Xem
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/products/${id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" /> Sửa
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isDeleting}>
                  <Trash className="mr-2 h-4 w-4" />{' '}
                  {isDeleting ? 'Đang xóa...' : 'Xóa'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không
                    thể hoàn tác.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Xóa
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Chi tiết</TabsTrigger>
                  <TabsTrigger value="images">Hình ảnh</TabsTrigger>
                  <TabsTrigger value="features">Tính năng</TabsTrigger>
                  <TabsTrigger value="specifications">
                    Thông số kỹ thuật
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                  <div className="grid gap-6">
                    <div>
                      <h3 className="mb-1 font-medium text-muted-foreground">
                        Mô tả chi tiết
                      </h3>
                      <p className="whitespace-pre-line">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="images">
                  <div className="grid gap-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {product.images.map((image) => (
                        <div
                          key={image.id}
                          className="relative rounded-lg border overflow-hidden group"
                        >
                          <img
                            src={image.url}
                            alt={image.alt || product.name}
                            className="aspect-video w-full object-cover"
                          />
                          {image.isPrimary && (
                            <Badge className="absolute top-2 right-2 bg-yellow-500">
                              Chính
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="features">
                  <div className="grid gap-4">
                    {product.features.map((feature) => (
                      <div key={feature.id} className="rounded-lg border p-4">
                        <h3 className="font-medium">{feature.title}</h3>
                        <p className="mt-1 text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="specifications">
                  <div className="grid gap-4">
                    {/* Hiển thị thông số kỹ thuật từ bảng specifications */}
                    {product.specifications &&
                      product.specifications.map((spec) => (
                        <div
                          key={spec.id}
                          className="grid grid-cols-1 gap-2 sm:grid-cols-2 items-center rounded-lg border p-4"
                        >
                          <div className="font-medium">{spec.name}</div>
                          <div>{spec.value}</div>
                        </div>
                      ))}

                    {/* Hiển thị thông số kỹ thuật từ bảng products */}
                    {product.model && (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 items-center rounded-lg border p-4">
                        <div className="font-medium">Model</div>
                        <div>{product.model}</div>
                      </div>
                    )}
                    {product.working_dimensions && (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 items-center rounded-lg border p-4">
                        <div className="font-medium">Kích thước làm việc</div>
                        <div>{product.working_dimensions}</div>
                      </div>
                    )}
                    {product.spindle_power && (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 items-center rounded-lg border p-4">
                        <div className="font-medium">Công suất trục chính</div>
                        <div>{product.spindle_power}</div>
                      </div>
                    )}
                    {product.spindle_speed && (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 items-center rounded-lg border p-4">
                        <div className="font-medium">Tốc độ trục chính</div>
                        <div>{product.spindle_speed}</div>
                      </div>
                    )}
                    {product.movement_speed && (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 items-center rounded-lg border p-4">
                        <div className="font-medium">Tốc độ di chuyển</div>
                        <div>{product.movement_speed}</div>
                      </div>
                    )}
                    {product.accuracy && (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 items-center rounded-lg border p-4">
                        <div className="font-medium">Độ chính xác</div>
                        <div>{product.accuracy}</div>
                      </div>
                    )}
                    {product.control_system && (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 items-center rounded-lg border p-4">
                        <div className="font-medium">Hệ thống điều khiển</div>
                        <div>{product.control_system}</div>
                      </div>
                    )}
                    {product.compatible_software && (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 items-center rounded-lg border p-4">
                        <div className="font-medium">Phần mềm tương thích</div>
                        <div>{product.compatible_software}</div>
                      </div>
                    )}
                    {product.file_formats && (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 items-center rounded-lg border p-4">
                        <div className="font-medium">Định dạng file</div>
                        <div>{product.file_formats}</div>
                      </div>
                    )}
                    {product.power_consumption && (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 items-center rounded-lg border p-4">
                        <div className="font-medium">Công suất tiêu thụ</div>
                        <div>{product.power_consumption}</div>
                      </div>
                    )}
                    {product.machine_dimensions && (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 items-center rounded-lg border p-4">
                        <div className="font-medium">Kích thước máy</div>
                        <div>{product.machine_dimensions}</div>
                      </div>
                    )}
                    {product.weight && (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 items-center rounded-lg border p-4">
                        <div className="font-medium">Trọng lượng</div>
                        <div>{product.weight}</div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-medium">Thông tin sản phẩm</h3>
              <div className="mt-4 grid gap-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-muted-foreground">Trạng thái</div>
                  <div>
                    <Badge
                      className={
                        product.status === 'active'
                          ? 'bg-green-500'
                          : product.status === 'draft'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }
                    >
                      {product.status === 'active'
                        ? 'Đang bán'
                        : product.status === 'draft'
                        ? 'Nháp'
                        : 'Ngừng bán'}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-muted-foreground">Danh mục</div>
                  <div>{product.categories?.name || 'Không có'}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-muted-foreground">Giá</div>
                  <div>
                    {product.price
                      ? new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(product.price)
                      : 'Liên hệ'}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-muted-foreground">Ngày tạo</div>
                  <div>{formatDate(product.created_at)}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-muted-foreground">Cập nhật</div>
                  <div>
                    {product.updated_at
                      ? formatDate(product.updated_at)
                      : 'Chưa cập nhật'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
