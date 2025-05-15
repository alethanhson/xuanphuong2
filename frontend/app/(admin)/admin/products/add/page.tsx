"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Loader2, PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import ProductImageUpload from "@/components/admin/product-image-upload";
import apiClient from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Định nghĩa schema cho form
const productSchema = z.object({
  title: z.string().min(3, "Tên sản phẩm phải có ít nhất 3 ký tự"),
  slug: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Giá phải lớn hơn hoặc bằng 0"),
  oldPrice: z.coerce.number().min(0).optional(),
  stockQuantity: z.coerce.number().min(0).default(0),
  categoryId: z.string().nullable().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
  brand: z.string().optional(),
  model: z.string().optional(),
  origin: z.string().optional(),
  isOnSale: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  warranty: z.string().optional(),
  dimensions: z.string().optional(),
  weight: z.string().optional(),
  power: z.string().optional(),
  workingSize: z.string().optional(),
  speed: z.string().optional(),
  motorPower: z.string().optional(),
  applications: z.string().optional(),
  toolChangerCapacity: z.coerce.number().optional(),
  spindleSpeed: z.string().optional(),
  controlSystem: z.string().optional(),
  dustCollection: z.string().optional(),
  airPressure: z.string().optional(),
  productType: z.string().optional(),
});

// Định nghĩa kiểu dữ liệu cho form
type ProductFormValues = z.infer<typeof productSchema>;

export default function AddProductPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [images, setImages] = useState<{url: string, alt: string}[]>([]);
  const [highlights, setHighlights] = useState<{content: string, order: number}[]>([]);
  const [specs, setSpecs] = useState<{name: string, value: string, group: string, order: number}[]>([]);

  // Khởi tạo form với react-hook-form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      price: 0,
      oldPrice: 0,
      stockQuantity: 0,
      categoryId: null,
      status: "PUBLISHED",
      brand: "",
      model: "",
      origin: "",
      isOnSale: false,
      isFeatured: false,
      warranty: "",
      dimensions: "",
      weight: "",
      power: "",
      workingSize: "",
      speed: "",
      motorPower: "",
      applications: "",
      toolChangerCapacity: undefined,
      spindleSpeed: "",
      controlSystem: "",
      dustCollection: "",
      airPressure: "",
      productType: "",
    },
  });

  // Lấy danh sách danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get("/api/admin/products/categories");
        if (response.data) {
          setCategories(response.data.data || []);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách danh mục:", error);
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể lấy danh sách danh mục",
        });
      }
    };

    fetchCategories();
  }, [toast]);

  // Xử lý khi submit form
  const onSubmit = async (data: ProductFormValues) => {
    setIsLoading(true);
    try {
      // Tạo slug từ title nếu chưa có
      if (!data.slug && data.title) {
        data.slug = data.title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^\w\s]/gi, "")
          .replace(/\s+/g, "-");
      }

      // Thêm hình ảnh và các thông tin khác vào dữ liệu gửi đi
      const productData = {
        ...data,
        images,
        highlightItems: highlights,
        specificationItems: specs
      };

      // Gọi API tạo sản phẩm
      const response = await apiClient.post("/api/admin/products", productData);
      
      if (response.data?.data) {
        toast({
          title: "Thành công",
          description: "Đã thêm sản phẩm thành công",
        });
        
        // Chuyển hướng về trang danh sách sản phẩm
        router.push("/admin/products");
      } else {
        throw new Error(response.data?.error?.message || "Có lỗi xảy ra");
      }
    } catch (error: any) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.message || "Không thể tạo sản phẩm",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý khi có ảnh mới được upload
  const handleImagesChange = (newImages: {url: string, alt: string}[]) => {
    setImages(newImages);
  };

  // Hàm thêm đặc điểm nổi bật
  const addHighlight = () => {
    setHighlights([...highlights, { content: "", order: highlights.length }]);
  };

  // Hàm cập nhật đặc điểm nổi bật
  const updateHighlight = (index: number, content: string) => {
    const newHighlights = [...highlights];
    newHighlights[index].content = content;
    setHighlights(newHighlights);
  };

  // Hàm xóa đặc điểm nổi bật
  const removeHighlight = (index: number) => {
    const newHighlights = [...highlights];
    newHighlights.splice(index, 1);
    setHighlights(newHighlights);
  };

  // Hàm thêm thông số kỹ thuật
  const addSpec = () => {
    setSpecs([...specs, { name: "", value: "", group: "Thông số chung", order: specs.length }]);
  };

  // Hàm cập nhật thông số kỹ thuật
  const updateSpec = (index: number, field: string, value: string) => {
    const newSpecs = [...specs];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setSpecs(newSpecs);
  };

  // Hàm xóa thông số kỹ thuật
  const removeSpec = (index: number) => {
    const newSpecs = [...specs];
    newSpecs.splice(index, 1);
    setSpecs(newSpecs);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Thêm sản phẩm mới</h1>
          <p className="text-gray-500">Thêm sản phẩm mới vào hệ thống</p>
        </div>
        <Link href="/admin/products">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
                  <TabsTrigger value="details">Thông tin chi tiết</TabsTrigger>
                  <TabsTrigger value="specs">Thông số kỹ thuật</TabsTrigger>
                  <TabsTrigger value="highlights">Đặc điểm nổi bật</TabsTrigger>
                </TabsList>

                <TabsContent value="basic">
                  <Card>
                    <CardHeader>
                      <CardTitle>Thông tin cơ bản</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tên sản phẩm</FormLabel>
                            <FormControl>
                              <Input placeholder="Tên sản phẩm" {...field} />
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
                            <FormLabel>Slug (URL)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Để trống sẽ tự động tạo từ tên sản phẩm" 
                                {...field} 
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormDescription>
                              Định dạng URL của sản phẩm, ví dụ: may-cnc-laser-fiber
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Giá (VNĐ)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="Nhập giá sản phẩm" 
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="oldPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Giá cũ (VNĐ)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="Giá trước khuyến mãi (nếu có)" 
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="categoryId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Danh mục</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value || undefined}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn danh mục" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="null">Không có danh mục</SelectItem>
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
                                  <SelectItem value="PUBLISHED">Đang bán</SelectItem>
                                  <SelectItem value="ARCHIVED">Đã ngưng bán</SelectItem>
                                  <SelectItem value="DRAFT">Bản nháp</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="stockQuantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Số lượng tồn kho</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="Số lượng tồn kho" 
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="productType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Loại sản phẩm</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Loại sản phẩm" 
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="isOnSale"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>Đang giảm giá</FormLabel>
                                <FormDescription>
                                  Đánh dấu sản phẩm đang được giảm giá
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

                        <FormField
                          control={form.control}
                          name="isFeatured"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>Sản phẩm nổi bật</FormLabel>
                                <FormDescription>
                                  Hiển thị sản phẩm ở mục sản phẩm nổi bật
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
                      </div>

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mô tả sản phẩm</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Mô tả chi tiết về sản phẩm" 
                                className="min-h-[150px]" 
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="details">
                  <Card>
                    <CardHeader>
                      <CardTitle>Thông tin chi tiết</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="brand"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Thương hiệu</FormLabel>
                              <FormControl>
                                <Input placeholder="Thương hiệu" {...field} value={field.value || ""} />
                              </FormControl>
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
                                <Input placeholder="Model sản phẩm" {...field} value={field.value || ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="origin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Xuất xứ</FormLabel>
                              <FormControl>
                                <Input placeholder="Xuất xứ" {...field} value={field.value || ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="warranty"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bảo hành</FormLabel>
                              <FormControl>
                                <Input placeholder="Thời gian bảo hành" {...field} value={field.value || ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="dimensions"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Kích thước</FormLabel>
                              <FormControl>
                                <Input placeholder="Kích thước sản phẩm" {...field} value={field.value || ""} />
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
                                <Input placeholder="Trọng lượng" {...field} value={field.value || ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="power"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Công suất</FormLabel>
                              <FormControl>
                                <Input placeholder="Công suất" {...field} value={field.value || ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="workingSize"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Kích thước gia công</FormLabel>
                              <FormControl>
                                <Input placeholder="Kích thước gia công" {...field} value={field.value || ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="speed"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tốc độ</FormLabel>
                              <FormControl>
                                <Input placeholder="Tốc độ" {...field} value={field.value || ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="motorPower"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Công suất động cơ</FormLabel>
                              <FormControl>
                                <Input placeholder="Công suất động cơ" {...field} value={field.value || ""} />
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
                              <FormLabel>Tốc độ trục chính</FormLabel>
                              <FormControl>
                                <Input placeholder="Tốc độ trục chính" {...field} value={field.value || ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="toolChangerCapacity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Số lượng dao</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number"
                                  placeholder="Số lượng dao" 
                                  {...field} 
                                  value={field.value === undefined ? "" : field.value}
                                  onChange={e => {
                                    const value = e.target.value;
                                    field.onChange(value === "" ? undefined : parseInt(value, 10));
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="applications"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ứng dụng</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Các ứng dụng của sản phẩm" 
                                className="min-h-[100px]" 
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="specs">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Thông số kỹ thuật</CardTitle>
                      <Button type="button" variant="outline" size="sm" onClick={addSpec}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Thêm thông số
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {specs.length === 0 ? (
                        <div className="text-center py-6 text-gray-500">
                          Chưa có thông số kỹ thuật. Nhấn nút thêm để bắt đầu.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {specs.map((spec, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border p-3 rounded-md">
                              <div className="md:col-span-3">
                                <Label htmlFor={`spec-group-${index}`}>Nhóm</Label>
                                <Select
                                  value={spec.group}
                                  onValueChange={(value) => updateSpec(index, "group", value)}
                                >
                                  <SelectTrigger id={`spec-group-${index}`}>
                                    <SelectValue placeholder="Chọn nhóm" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Thông số chung">Thông số chung</SelectItem>
                                    <SelectItem value="Cấu hình">Cấu hình</SelectItem>
                                    <SelectItem value="Hệ thống điều khiển">Hệ thống điều khiển</SelectItem>
                                    <SelectItem value="Phụ kiện">Phụ kiện</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="md:col-span-3">
                                <Label htmlFor={`spec-name-${index}`}>Tên thông số</Label>
                                <Input
                                  id={`spec-name-${index}`}
                                  value={spec.name}
                                  onChange={(e) => updateSpec(index, "name", e.target.value)}
                                  placeholder="Tên thông số"
                                />
                              </div>
                              <div className="md:col-span-5">
                                <Label htmlFor={`spec-value-${index}`}>Giá trị</Label>
                                <Input
                                  id={`spec-value-${index}`}
                                  value={spec.value}
                                  onChange={(e) => updateSpec(index, "value", e.target.value)}
                                  placeholder="Giá trị"
                                />
                              </div>
                              <div className="md:col-span-1 flex justify-end">
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeSpec(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="highlights">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Đặc điểm nổi bật</CardTitle>
                      <Button type="button" variant="outline" size="sm" onClick={addHighlight}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Thêm đặc điểm
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {highlights.length === 0 ? (
                        <div className="text-center py-6 text-gray-500">
                          Chưa có đặc điểm nổi bật. Nhấn nút thêm để bắt đầu.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {highlights.map((highlight, index) => (
                            <div key={index} className="flex items-center gap-4 border p-3 rounded-md">
                              <div className="flex-1">
                                <Input
                                  value={highlight.content}
                                  onChange={(e) => updateHighlight(index, e.target.value)}
                                  placeholder="Đặc điểm nổi bật của sản phẩm"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeHighlight(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Tạo sản phẩm
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Hình ảnh sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductImageUpload 
                images={images} 
                onChange={handleImagesChange} 
              />
              <p className="text-sm text-gray-500 mt-2">
                Hình ảnh đầu tiên sẽ là hình ảnh chính của sản phẩm
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 