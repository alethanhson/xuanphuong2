import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChevronLeft,
  Edit,
  Trash,
  Eye,
  Star,
  ArrowUpRight,
  MessageSquare,
  ShoppingCart,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

async function getProduct(id: string) {
  try {
    // In a real application, this would be a fetch to your API
    const res = await fetch(`/api/admin/products/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const product = await getProduct(id);

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
              {product.isFeatured && (
                <Badge className="bg-yellow-500 text-primary-foreground">
                  <Star className="mr-1 h-3 w-3 fill-current" /> Nổi bật
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              ID: {product.id} | Tạo: {product.createdAt} | Cập nhật:{' '}
              {product.updatedAt}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href={`/products/${product.slug}`} target="_blank">
                <Eye className="mr-2 h-4 w-4" /> Xem trên website
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/admin/products/${product.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        <div className="md:col-span-2 lg:col-span-3">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Thông tin sản phẩm</CardTitle>
              <CardDescription>Chi tiết về sản phẩm</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basic">
                <TabsList className="mb-4">
                  <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
                  <TabsTrigger value="images">Hình ảnh</TabsTrigger>
                  <TabsTrigger value="specs">Thông số kỹ thuật</TabsTrigger>
                  <TabsTrigger value="features">Tính năng</TabsTrigger>
                </TabsList>

                <TabsContent value="basic">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div>
                        <h3 className="font-medium text-muted-foreground">
                          Tên sản phẩm
                        </h3>
                        <p>{product.name}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-muted-foreground">
                          Danh mục
                        </h3>
                        <p>{product.category}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-muted-foreground">
                          Trạng thái
                        </h3>
                        <Badge
                          variant={
                            product.status === 'active'
                              ? 'default'
                              : product.status === 'outOfStock'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {product.status === 'active'
                            ? 'Đang bán'
                            : product.status === 'outOfStock'
                            ? 'Hết hàng'
                            : 'Bản nháp'}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="font-medium text-muted-foreground">
                          Giá
                        </h3>
                        <p>{product.price}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-muted-foreground">
                          Model
                        </h3>
                        <p>{product.model}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-muted-foreground">
                          Slug
                        </h3>
                        <p>{product.slug}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-1 font-medium text-muted-foreground">
                        Mô tả ngắn
                      </h3>
                      <p>{product.shortDescription}</p>
                    </div>

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
                          <div className="aspect-square relative">
                            <Image
                              src={image.url || '/placeholder.svg'}
                              alt={image.alt}
                              fill
                              className="object-cover"
                            />
                            {image.isPrimary && (
                              <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                                Ảnh chính
                              </div>
                            )}
                          </div>
                          <div className="p-2">
                            <p className="text-sm text-muted-foreground truncate">
                              {image.alt}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="specs">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <h3 className="font-medium text-muted-foreground">
                        Kích thước làm việc
                      </h3>
                      <p>{product.workingDimensions}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-muted-foreground">
                        Công suất spindle
                      </h3>
                      <p>{product.spindlePower}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-muted-foreground">
                        Tốc độ spindle
                      </h3>
                      <p>{product.spindleSpeed}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-muted-foreground">
                        Tốc độ di chuyển
                      </h3>
                      <p>{product.movementSpeed}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-muted-foreground">
                        Độ chính xác
                      </h3>
                      <p>{product.accuracy}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-muted-foreground">
                        Hệ thống điều khiển
                      </h3>
                      <p>{product.controlSystem}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-muted-foreground">
                        Phần mềm tương thích
                      </h3>
                      <p>{product.compatibleSoftware}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-muted-foreground">
                        Định dạng file
                      </h3>
                      <p>{product.fileFormats}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-muted-foreground">
                        Công suất tiêu thụ
                      </h3>
                      <p>{product.powerConsumption}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-muted-foreground">
                        Kích thước máy
                      </h3>
                      <p>{product.machineDimensions}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-muted-foreground">
                        Trọng lượng
                      </h3>
                      <p>{product.weight}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="features">
                  <div className="grid gap-4">
                    {product.features.map((feature) => (
                      <div key={feature.id} className="rounded-lg border p-4">
                        <h3 className="font-medium">{feature.name}</h3>
                        <p className="mt-1 text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Tương tác</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Lượt xem</span>
                  </div>
                  <span className="font-medium">{product.views}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Đơn hàng</span>
                  </div>
                  <span className="font-medium">{product.orders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Yêu cầu</span>
                  </div>
                  <span className="font-medium">{product.enquiries}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Thao tác nhanh</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa sản phẩm
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link href={`/products/${product.slug}`} target="_blank">
                    <Eye className="mr-2 h-4 w-4" /> Xem trên website
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash className="mr-2 h-4 w-4" /> Xóa sản phẩm
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
