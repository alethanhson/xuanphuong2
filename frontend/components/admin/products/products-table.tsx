'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, ArrowUpDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductCardView } from '@/components/admin/products/products-card-view';
import { ProductFilters } from '@/components/admin/products/products-filters';
import { toast } from '@/components/ui/use-toast';
import apiClient, { API_ENDPOINTS } from '@/lib/api';

export type Product = {
  id: string;
  name: string;
  category: string;
  categoryId?: string;
  status: 'active' | 'outOfStock' | 'draft';
  price: string | null;
  createdAt: string;
  image?: string;
  isFeatured?: boolean;
};

export function ProductsTable() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Thêm state pagination để lưu thông tin phân trang từ API
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  // Thêm state cho bộ lọc danh mục
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<{id: string, name: string}[]>([]);

  // Load products
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        
        // Kiểm tra token xác thực
        const token = localStorage.getItem('admin_token');
        if (!token) {
          console.warn('Không tìm thấy token xác thực');
          router.push('/admin/login'); // Chuyển hướng đến trang đăng nhập nếu không có token
          return;
        }
        
        // Sử dụng apiClient để gọi đến NestJS backend
        const response = await apiClient.get(API_ENDPOINTS.ADMIN_PRODUCTS);
        
        // Lấy danh sách danh mục nếu chưa có
        if (allCategories.length === 0) {
          try {
            const catResponse = await apiClient.get(API_ENDPOINTS.ADMIN_CATEGORIES);
            if (catResponse.data && catResponse.data.data) {
              setAllCategories(catResponse.data.data);
            }
          } catch (error) {
            console.error('Không thể lấy danh sách danh mục:', error);
          }
        }
        
        // Kiểm tra dữ liệu trả về từ API
        if (response.data && response.data.data && Array.isArray(response.data.data.products)) {
          // Lưu thông tin phân trang
          if (response.data.data.pagination) {
            setPagination(response.data.data.pagination);
          }

          // Chuyển đổi các giá trị complex thành string để tránh lỗi "Objects are not valid as React child"
          const formattedProducts = response.data.data.products.map((product: any) => {
            // Xử lý ngày tháng
            let formattedDate = '';
            try {
              const date = new Date(product.createdAt);
              formattedDate = new Intl.DateTimeFormat('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }).format(date);
            } catch (e) {
              formattedDate = String(product.createdAt);
            }

            const categoryName = typeof product.category === 'object' ? product.category?.name || 'Không có danh mục' : product.category || 'Không có danh mục';
            const categoryId = typeof product.category === 'object' ? product.category?.id : product.categoryId || '';
            
            return {
              ...product,
              name: product.name || product.title || 'Sản phẩm không có tên',
              category: categoryName,
              categoryId: categoryId,
              price: typeof product.price === 'number' ? `${product.price.toLocaleString('vi-VN')}đ` : product.price || 'Liên hệ',
              image: typeof product.image === 'object' ? product.image?.url : product.image || '',
              status: product.status || 'draft',
              createdAt: formattedDate,
              isFeatured: !!product.isFeatured,
            };
          });
          setProducts(formattedProducts);
        } else {
          // Dự phòng: Nếu API trả về định dạng khác mong đợi
          console.warn('API response format unexpected:', response.data);
          if (response.data && response.data.data && response.data.data.products) {
            // Lưu thông tin phân trang nếu có
            if (response.data.data.pagination) {
              setPagination(response.data.data.pagination);
            }

            const products = Array.isArray(response.data.data.products) ? response.data.data.products : [];
            // Chuyển đổi các giá trị complex thành string
            const formattedProducts = products.map((product: any) => {
              // Xử lý ngày tháng
              let formattedDate = '';
              try {
                const date = new Date(product.createdAt);
                formattedDate = new Intl.DateTimeFormat('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                }).format(date);
              } catch (e) {
                formattedDate = String(product.createdAt);
              }

              const categoryName = typeof product.category === 'object' ? product.category?.name || 'Không có danh mục' : product.category || 'Không có danh mục';
              const categoryId = typeof product.category === 'object' ? product.category?.id : product.categoryId || '';
              
              return {
                ...product,
                name: product.name || product.title || 'Sản phẩm không có tên',
                category: categoryName,
                categoryId: categoryId,
                price: typeof product.price === 'number' ? `${product.price.toLocaleString('vi-VN')}đ` : product.price || 'Liên hệ',
                image: typeof product.image === 'object' ? product.image?.url : product.image || '',
                status: product.status || 'draft',
                createdAt: formattedDate,
                isFeatured: !!product.isFeatured,
              };
            });
            setProducts(formattedProducts);
          } else {
            throw new Error('Không nhận được dữ liệu hợp lệ từ API');
          }
        }
      } catch (error: any) {
        console.error('Error fetching products:', error);
        
        if (error.response && error.response.status === 401) {
          // Token hết hạn hoặc không hợp lệ
          localStorage.removeItem('admin_token');
          router.push('/admin/login');
          return;
        }
        
        // Dữ liệu mẫu cho trường hợp API không hoạt động
        const mockProducts: Product[] = [
          {
            id: '1',
            name: 'Máy CNC Router 13251',
            category: 'Máy CNC Gỗ',
            categoryId: '1',
            status: 'active',
            price: '150.000.000đ',
            createdAt: '2023-07-15',
            image: 'https://via.placeholder.com/150?text=CNC+Router',
            isFeatured: true
          },
          {
            id: '2',
            name: 'Máy dán cạnh tự động HCVE-268',
            category: 'Máy dán cạnh',
            categoryId: '2',
            status: 'active',
            price: '85.000.000đ',
            createdAt: '2023-08-10',
            image: 'https://via.placeholder.com/150?text=Edge+Bander',
            isFeatured: true
          },
          {
            id: '3',
            name: 'Máy chà nhám thùng SOSN MS1300',
            category: 'Máy chà nhám',
            categoryId: '3',
            status: 'active',
            price: '65.000.000đ',
            createdAt: '2023-09-01',
            image: 'https://via.placeholder.com/150?text=Sander',
            isFeatured: false
          },
          {
            id: '4',
            name: 'Máy cưa bàn trượt 3200mm',
            category: 'Máy cưa',
            categoryId: '4',
            status: 'outOfStock',
            price: '120.000.000đ',
            createdAt: '2023-10-05',
            image: 'https://via.placeholder.com/150?text=Sliding+Table+Saw',
            isFeatured: false
          },
          {
            id: '5',
            name: 'Máy phay định hình CNC',
            category: 'Máy phay',
            categoryId: '5',
            status: 'draft',
            price: '180.000.000đ',
            createdAt: '2023-10-20',
            image: 'https://via.placeholder.com/150?text=CNC+Milling',
            isFeatured: false
          }
        ];
        
        // Sử dụng dữ liệu mẫu khi API lỗi
        setProducts(mockProducts);
        
        // Mẫu danh mục
        if (allCategories.length === 0) {
          setAllCategories([
            { id: '1', name: 'Máy CNC Gỗ' },
            { id: '2', name: 'Máy dán cạnh' },
            { id: '3', name: 'Máy chà nhám' },
            { id: '4', name: 'Máy cưa' },
            { id: '5', name: 'Máy phay' }
          ]);
        }
        
        // Cập nhật thông tin phân trang giả lập
        setPagination({
          total: mockProducts.length,
          page: 1,
          limit: 10,
          totalPages: 1
        });
        console.log('Sử dụng dữ liệu mẫu do không thể kết nối tới API');
        // setError('Đang sử dụng dữ liệu mẫu do không thể kết nối tới API. Lỗi: ' + (error.message || 'Không xác định'));
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [router, allCategories.length]);

  // Thêm bộ lọc cho sản phẩm dựa trên danh mục đã chọn
  const filteredProducts = useMemo(() => {
    if (selectedCategories.length === 0) return products;
    return products.filter(product => {
      // Nếu sản phẩm có categoryId, kiểm tra nó có trong danh sách đã chọn không
      if (product.categoryId) {
        return selectedCategories.includes(product.categoryId);
      }
      // Nếu không có categoryId, kiểm tra tên danh mục
      return selectedCategories.some(catId => {
        const category = allCategories.find(c => c.id === catId);
        return category && product.category === category.name;
      });
    });
  }, [products, selectedCategories, allCategories]);

  // Handle product deletion
  const handleDeleteProduct = async (id: string) => {
    try {
      setIsDeleting(true);
      
      // Kiểm tra token xác thực
      const token = localStorage.getItem('admin_token');
      if (!token) {
        console.warn('Không tìm thấy token xác thực');
        router.push('/admin/login');
        return;
      }
      
      // Sử dụng apiClient để gọi đến NestJS backend
      await apiClient.delete(API_ENDPOINTS.ADMIN_PRODUCT_DETAIL(id));
      
      // Remove product from state
      setProducts((prev) => prev.filter((product) => product.id !== id));
      toast({
        title: 'Sản phẩm đã được xóa',
        description: 'Sản phẩm đã được xóa thành công.',
      });
    } catch (error: any) {
      console.error('Error deleting product:', error);
      
      if (error.response && error.response.status === 401) {
        // Token hết hạn hoặc không hợp lệ
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
        return;
      }
      
      toast({
        title: 'Lỗi xóa sản phẩm',
        description: 'Có lỗi xảy ra khi xóa sản phẩm: ' + (error.message || 'Không xác định'),
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: 'Tên sản phẩm',
      cell: ({ row }) => (
        <div className="flex gap-2">
          {row.original.isFeatured && (
            <Badge
              variant="outline"
              className="bg-yellow-50 text-yellow-700 border-yellow-200"
            >
              Nổi bật
            </Badge>
          )}
          <span className="font-medium">{row.getValue('name')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Danh mục',
      cell: ({ row }) => <div>{row.getValue('category')}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;

        return (
          <Badge
            variant={
              status === 'active'
                ? 'default'
                : status === 'outOfStock'
                ? 'secondary'
                : 'outline'
            }
          >
            {status === 'active'
              ? 'Đang bán'
              : status === 'outOfStock'
              ? 'Hết hàng'
              : 'Bản nháp'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'price',
      header: ({ column }) => {
        return (
          <div className="text-right flex justify-end">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              Giá
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        const price = row.getValue('price') as string;

        return <div className="text-right">{price}</div>;
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Ngày tạo',
      cell: ({ row }) => <div>{row.getValue('createdAt')}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const product = row.original;

        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Mở menu</span>
                  <DotsHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/admin/products/${product.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Xem
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Chỉnh sửa
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => setDeleteId(product.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  // Xử lý khi chọn danh mục
  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategories(prev => {
      // Nếu đã chọn, bỏ chọn
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      }
      // Nếu chưa chọn, thêm vào
      return [...prev, categoryId];
    });
  };

  // Xóa tất cả bộ lọc
  const clearFilters = () => {
    setSelectedCategories([]);
    setColumnFilters([]);
    table.resetColumnFilters();
  };

  const table = useReactTable({
    data: filteredProducts, // Sử dụng products đã lọc theo danh mục
    columns,
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.id,
    initialState: {
      pagination: {
        pageIndex: pagination.page - 1,
        pageSize: pagination.limit,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (loading) {
    return (
      <div className="w-full rounded-md border p-8">
        <div className="flex flex-col items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">
            Đang tải sản phẩm...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full rounded-md border border-red-200 bg-red-50 p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-red-500">{error}</p>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => router.refresh()}>
              Thử lại
            </Button>
            <Button variant="outline" onClick={() => setError(null)}>
              Hiển thị dữ liệu mẫu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <ProductFilters 
          table={table}
          categories={allCategories}
          selectedCategories={selectedCategories}
          onCategoryFilterChange={handleCategoryFilter}
          onClearFilters={clearFilters}
          viewMode={viewMode}
          onViewModeChange={(mode) => setViewMode(mode)}
        />

        {viewMode === 'table' ? (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        Không tìm thấy kết quả
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Chỉ hiển thị phân trang khi số trang > 1 */}
            <div className="flex items-center justify-between">
              <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} /{' '}
                {table.getFilteredRowModel().rows.length} hàng được chọn
                {pagination.total > filteredProducts.length ? ` (Tổng số ${pagination.total} sản phẩm)` : ''}
              </div>
              
              {table.getPageCount() > 1 && (
                <div className="flex items-center space-x-6 lg:space-x-8">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Số hàng mỗi trang</p>
                    <Select
                      value={`${table.getState().pagination.pageSize}`}
                      onValueChange={(value) => {
                        table.setPageSize(Number(value));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Số hàng mỗi trang" />
                      </SelectTrigger>
                      <SelectContent>
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                          <SelectItem key={pageSize} value={`${pageSize}`}>
                            {pageSize}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Trang {table.getState().pagination.pageIndex + 1} của{' '}
                    {table.getPageCount()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      className="hidden h-8 w-8 p-0 lg:flex"
                      onClick={() => table.setPageIndex(0)}
                      disabled={!table.getCanPreviousPage()}
                    >
                      <span className="sr-only">Trang đầu</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevrons-left"
                      >
                        <path d="m11 17-5-5 5-5" />
                        <path d="m18 17-5-5 5-5" />
                      </svg>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      <span className="sr-only">Trang trước</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevron-left"
                      >
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      <span className="sr-only">Trang tiếp</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevron-right"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </Button>
                    <Button
                      variant="outline"
                      className="hidden h-8 w-8 p-0 lg:flex"
                      onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                      disabled={!table.getCanNextPage()}
                    >
                      <span className="sr-only">Trang cuối</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevrons-right"
                      >
                        <path d="m13 17 5-5-5-5" />
                        <path d="m6 17 5-5-5-5" />
                      </svg>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <ProductCardView
            products={filteredProducts}
            onDelete={(id) => setDeleteId(id)}
          />
        )}
      </div>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
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
              onClick={() => deleteId && handleDeleteProduct(deleteId)}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isDeleting ? 'Đang xóa...' : 'Xóa sản phẩm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
