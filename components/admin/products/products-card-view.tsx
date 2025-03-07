'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Edit, Eye, Trash2, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDate } from '@/lib/utils';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Product } from './products-table';

interface ProductCardViewProps {
  products: Product[];
  onDelete: (id: string) => void;
}

export function ProductCardView({ products, onDelete }: ProductCardViewProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      await onDelete(id);
    } finally {
      setIsDeleting(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'outOfStock':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Đang bán';
      case 'outOfStock':
        return 'Hết hàng';
      default:
        return 'Bản nháp';
    }
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Eye className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">Không tìm thấy sản phẩm</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          Thử thay đổi bộ lọc hoặc thêm sản phẩm mới.
        </p>
        <Button asChild>
          <Link href="/admin/products/add">Thêm sản phẩm</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <div className="relative h-48 w-full overflow-hidden bg-gray-100">
            <Image
              src={product.image || '/placeholder.svg?height=192&width=384'}
              alt={product.name}
              className="object-cover transition-all hover:scale-105"
              fill
            />
            {product.isFeatured && (
              <div className="absolute left-2 top-2">
                <Badge className="bg-yellow-500 text-primary-foreground">
                  <Star className="mr-1 h-3 w-3 fill-current" /> Nổi bật
                </Badge>
              </div>
            )}
            <div className="absolute right-2 top-2">
              <Badge variant={getStatusColor(product.status)}>
                {getStatusText(product.status)}
              </Badge>
            </div>
          </div>
          <CardHeader className="p-4 pb-0">
            <div className="flex items-start justify-between">
              <CardTitle className="line-clamp-1 text-lg">
                {product.name}
              </CardTitle>
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
                    onClick={() => handleDelete(product.id)}
                    disabled={isDeleting === product.id}
                  >
                    {isDeleting === product.id ? (
                      <>Đang xóa...</>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardDescription className="mt-2 line-clamp-1 text-sm">
              {product.category}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Ngày tạo: {product.createdAt}
              </span>
              <span className="font-medium">{product.price}</span>
            </div>
          </CardContent>
          <CardFooter className="border-t p-4">
            <div className="flex w-full gap-2">
              <Button asChild variant="outline" className="w-full">
                <Link href={`/admin/products/${product.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  Xem
                </Link>
              </Button>
              <Button asChild className="w-full">
                <Link href={`/admin/products/${product.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Sửa
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
