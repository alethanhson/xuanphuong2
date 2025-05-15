'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import apiClient, { API_ENDPOINTS } from '@/lib/api';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>({
    name: '',
    description: '',
    price: '',
    status: 'draft',
    categoryId: '',
    isFeatured: false,
  });
  
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch product data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Kiểm tra token xác thực
        const token = localStorage.getItem('admin_token');
        if (!token) {
          console.warn('Không tìm thấy token xác thực');
          router.push('/admin/login');
          return;
        }
        
        // Fetch categories
        const categoriesResponse = await apiClient.get(API_ENDPOINTS.ADMIN_CATEGORIES);
        if (categoriesResponse.data && categoriesResponse.data.data) {
          setCategories(categoriesResponse.data.data);
        }
        
        // Fetch product by ID
        const productResponse = await apiClient.get(API_ENDPOINTS.ADMIN_PRODUCT_DETAIL(params.id as string));
        
        if (productResponse.data && productResponse.data.data) {
          const productData = productResponse.data.data;
          
          // Extract categoryId from category object if needed
          let categoryId = productData.categoryId;
          if (typeof productData.category === 'object' && productData.category?.id) {
            categoryId = productData.category.id;
          }
          
          setProduct({
            ...productData,
            categoryId,
            // Ensure price is a string for input element
            price: typeof productData.price === 'number' ? productData.price.toString() : productData.price || '',
          });
        } else {
          throw new Error('Không nhận được dữ liệu hợp lệ từ API');
        }
      } catch (error: any) {
        console.error('Error fetching product data:', error);
        
        if (error.response && error.response.status === 401) {
          // Token hết hạn hoặc không hợp lệ
          localStorage.removeItem('admin_token');
          router.push('/admin/login');
          return;
        }
        
        // Mẫu dữ liệu trong trường hợp API lỗi
        setError('Không thể tải dữ liệu sản phẩm. Lỗi: ' + (error.message || 'Không xác định'));
        setProduct({
          id: params.id,
          name: 'Máy CNC Router 13251',
          description: 'Đây là mẫu máy CNC Router cao cấp dành cho ngành gỗ.',
          price: '150000000',
          status: 'active',
          categoryId: '1',
          isFeatured: true,
        });
        
        // Categories fallback
        if (categories.length === 0) {
          setCategories([
            { id: '1', name: 'Máy CNC Gỗ' },
            { id: '2', name: 'Máy dán cạnh' },
            { id: '3', name: 'Máy chà nhám' },
          ]);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id, router]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      
      // Prepare data for API
      const formData = {
        ...product,
        // Convert price to number for API
        price: product.price ? parseFloat(product.price) : 0,
      };
      
      // Update product via API
      await apiClient.put(API_ENDPOINTS.ADMIN_PRODUCT_DETAIL(params.id as string), formData);
      
      toast({
        title: 'Sản phẩm đã được cập nhật',
        description: 'Sản phẩm đã được cập nhật thành công.',
      });
      
      // Navigate back to product detail
      router.push(`/admin/products/${params.id}`);
    } catch (error: any) {
      console.error('Error updating product:', error);
      
      toast({
        title: 'Lỗi cập nhật sản phẩm',
        description: 'Có lỗi xảy ra khi cập nhật sản phẩm: ' + (error.message || 'Không xác định'),
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct((prev: any) => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setProduct((prev: any) => ({ ...prev, [name]: value }));
  };

  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setProduct((prev: any) => ({ ...prev, [name]: checked }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button asChild variant="ghost" size="icon">
            <Link href={`/admin/products/${params.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Chỉnh sửa sản phẩm
            </h1>
            <div className="text-muted-foreground mt-1">
              Cập nhật thông tin sản phẩm
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button type="submit" form="edit-product-form" disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 text-yellow-800 rounded-md p-4 border border-yellow-200">
          {error}
        </div>
      )}

      <form id="edit-product-form" onSubmit={handleSubmit}>
        <Tabs defaultValue="basic">
          <TabsList>
            <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
            <TabsTrigger value="details">Chi tiết</TabsTrigger>
            <TabsTrigger value="images">Hình ảnh</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 py-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Tên sản phẩm</Label>
                  <Input
                    id="name"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    placeholder="Nhập tên sản phẩm"
                    required
                  />
                </div>
                
                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    placeholder="Nhập mô tả sản phẩm"
                    rows={5}
                  />
                </div>
                
                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Danh mục</Label>
                  <Select 
                    value={product.categoryId} 
                    onValueChange={(value) => handleSelectChange('categoryId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select 
                    value={product.status} 
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Đang bán</SelectItem>
                      <SelectItem value="outOfStock">Hết hàng</SelectItem>
                      <SelectItem value="draft">Bản nháp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">Giá (VNĐ)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={product.price}
                    onChange={handleChange}
                    placeholder="Nhập giá sản phẩm"
                    min="0"
                  />
                </div>
                
                {/* Featured */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isFeatured"
                    checked={product.isFeatured}
                    onCheckedChange={(checked) => handleSwitchChange('isFeatured', checked)}
                  />
                  <Label htmlFor="isFeatured">Sản phẩm nổi bật</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="details" className="py-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">Mã SKU</Label>
                  <Input
                    id="sku"
                    name="sku"
                    value={product.sku || ''}
                    onChange={handleChange}
                    placeholder="Nhập mã SKU"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stock">Số lượng trong kho</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={product.stock || ''}
                    onChange={handleChange}
                    placeholder="Nhập số lượng"
                    min="0"
                  />
                </div>
                
                <p className="text-sm text-muted-foreground mt-4">
                  Quản lý thông số kỹ thuật và thuộc tính chi tiết khác hiện chưa được hỗ trợ trong phiên bản này.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="images" className="py-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Quản lý hình ảnh hiện chưa được hỗ trợ trong phiên bản này. Vui lòng sử dụng cài đặt hình ảnh qua API trực tiếp.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
} 