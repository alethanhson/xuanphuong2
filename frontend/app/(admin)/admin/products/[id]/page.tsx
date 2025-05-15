'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, ArrowLeft, Trash2, Calendar, Tag, Info, Box, Printer, FileText } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/use-toast';
import apiClient, { API_ENDPOINTS } from '@/lib/api';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        
        // Kiểm tra token xác thực
        const token = localStorage.getItem('admin_token');
        if (!token) {
          console.warn('Không tìm thấy token xác thực');
          router.push('/admin/login');
          return;
        }
        
        // Sử dụng apiClient để gọi đến NestJS backend
        const response = await apiClient.get(API_ENDPOINTS.ADMIN_PRODUCT_DETAIL(params.id as string));
        
        if (response.data && response.data.data) {
          setProduct(response.data.data);
        } else {
          throw new Error('Không nhận được dữ liệu hợp lệ từ API');
        }
      } catch (error: any) {
        console.error('Error fetching product:', error);
        
        if (error.response && error.response.status === 401) {
          // Token hết hạn hoặc không hợp lệ
          localStorage.removeItem('admin_token');
          router.push('/admin/login');
          return;
        }
        
        // Dữ liệu mẫu cho trường hợp API không hoạt động
        setProduct({
          id: params.id,
          name: 'Máy CNC Router 13251',
          description: '<p>Đây là mẫu máy CNC Router cao cấp dành cho ngành gỗ. Máy được trang bị động cơ mạnh mẽ, có thể xử lý đa dạng các loại vật liệu như gỗ, nhựa, nhôm mềm.</p><p>Máy có kích thước bàn làm việc lớn, phù hợp với các xưởng sản xuất vừa và lớn.</p>',
          category: {
            id: '1',
            name: 'Máy CNC Gỗ'
          },
          status: 'active',
          price: 150000000,
          images: [
            { url: 'https://via.placeholder.com/800x600?text=CNC+Router+1' },
            { url: 'https://via.placeholder.com/800x600?text=CNC+Router+2' }
          ],
          mainImage: { url: 'https://via.placeholder.com/800x600?text=CNC+Router+Main' },
          sku: 'CNC-RTR-13251',
          stock: 5,
          isFeatured: true,
          specifications: [
            { name: 'Kích thước bàn', value: '1325 x 2500 mm' },
            { name: 'Công suất', value: '5.5 kW' },
            { name: 'Tốc độ spindle', value: '24000 rpm' },
            { name: 'Hệ thống điều khiển', value: 'DSP A18' }
          ],
          createdAt: '2023-07-15T10:30:00Z',
          updatedAt: '2023-10-20T14:45:00Z'
        });
        
        setError('Đang sử dụng dữ liệu mẫu do không thể kết nối tới API. Lỗi: ' + (error.message || 'Không xác định'));
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchProduct();
    }
  }, [params.id, router]);

  // Xử lý xóa sản phẩm
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      await apiClient.delete(API_ENDPOINTS.ADMIN_PRODUCT_DETAIL(params.id as string));
      
      toast({
        title: 'Sản phẩm đã được xóa',
        description: 'Sản phẩm đã được xóa thành công.',
      });
      
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error deleting product:', error);
      
      toast({
        title: 'Lỗi xóa sản phẩm',
        description: 'Có lỗi xảy ra khi xóa sản phẩm. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialog(false);
    }
  };

  // Hiển thị giá đã định dạng
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price).replace('₫', 'đ');
  };

  // Định dạng ngày tháng
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Button asChild variant="ghost">
            <Link href="/admin/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Link>
          </Button>
        </div>
        <div className="bg-red-50 text-red-700 rounded-md p-4 border border-red-200">
          Không tìm thấy sản phẩm với mã: {params.id}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mt-1 text-muted-foreground">
              <span>Mã: {product.id}</span>
              {product.sku && (
                <>
                  <span>•</span>
                  <span>SKU: {product.sku}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href={`/admin/products/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Link>
          </Button>
          <Button variant="destructive" onClick={() => setDeleteDialog(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 text-yellow-800 rounded-md p-4 border border-yellow-200">
          {error}
        </div>
      )}

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="details">Chi tiết</TabsTrigger>
          <TabsTrigger value="images">Hình ảnh</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Thông tin cơ bản */}
            <Card className="md:col-span-2">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-xl font-semibold">Thông tin sản phẩm</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Tên sản phẩm</h3>
                      <p className="text-base">{product.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Giá</h3>
                      <p className="text-base font-semibold">{typeof product.price === 'number' ? formatPrice(product.price) : product.price}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Danh mục</h3>
                      <p className="text-base">{product.category?.name || 'Chưa phân loại'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Trạng thái</h3>
                      <Badge variant={
                        product.status === 'active'
                          ? 'default'
                          : product.status === 'outOfStock'
                          ? 'secondary'
                          : 'outline'
                      }>
                        {product.status === 'active'
                          ? 'Đang bán'
                          : product.status === 'outOfStock'
                          ? 'Hết hàng'
                          : 'Bản nháp'}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Mô tả sản phẩm</h3>
                    {product.description ? (
                      <div className="prose max-w-none mt-2" dangerouslySetInnerHTML={{ __html: product.description }} />
                    ) : (
                      <p className="text-muted-foreground">Không có mô tả</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Ảnh sản phẩm */}
              <Card>
                <CardContent className="p-6">
                  <div className="aspect-square relative mb-4 bg-gray-100 rounded-lg overflow-hidden">
                    {product.mainImage?.url || product.image ? (
                      <Image
                        src={product.mainImage?.url || product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Box className="h-16 w-16 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.isFeatured && (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Sản phẩm nổi bật
                      </Badge>
                    )}
                    {product.stock !== undefined && product.stock <= 0 && (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Hết hàng
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Thông tin bổ sung */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-medium">Thời gian</h3>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Ngày tạo</p>
                        <p className="text-sm">{formatDate(product.createdAt)}</p>
                      </div>
                      {product.updatedAt && (
                        <div>
                          <p className="text-xs text-muted-foreground">Cập nhật lần cuối</p>
                          <p className="text-sm">{formatDate(product.updatedAt)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Hành động nhanh */}
              <Card>
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-sm font-medium">Hành động nhanh</h3>
                  <div className="space-y-2">
                    <Button asChild variant="outline" className="w-full justify-start">
                      <Link href={`/admin/products/${params.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa sản phẩm
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-start">
                      <Link href={`/products/${product.slug || params.id}`} target="_blank">
                        <FileText className="mr-2 h-4 w-4" />
                        Xem trang sản phẩm
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => window.print()}>
                      <Printer className="mr-2 h-4 w-4" />
                      In thông tin
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="py-4">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Thông số kỹ thuật</h2>
              {product.specifications && product.specifications.length > 0 ? (
                <div className="divide-y">
                  {product.specifications.map((spec: any, index: number) => (
                    <div key={index} className="py-3 grid grid-cols-3">
                      <div className="col-span-1 font-medium">{spec.name}</div>
                      <div className="col-span-2">{spec.value}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Không có thông số kỹ thuật</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="images" className="py-4">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Hình ảnh sản phẩm</h2>
              {(product.images && product.images.length > 0) || product.mainImage ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {product.mainImage && (
                    <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <Image 
                        src={product.mainImage.url} 
                        alt="Hình ảnh chính" 
                        fill 
                        className="object-cover"
                      />
                      <Badge className="absolute top-2 left-2" variant="secondary">Ảnh chính</Badge>
                    </div>
                  )}
                  {product.images && product.images.map((image: any, index: number) => (
                    <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <Image 
                        src={image.url} 
                        alt={`Hình ảnh ${index + 1}`} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Không có hình ảnh</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Bạn có chắc chắn muốn xóa sản phẩm này?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Sản phẩm này sẽ bị xóa vĩnh viễn
              khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isDeleting ? 'Đang xóa...' : 'Xóa sản phẩm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 