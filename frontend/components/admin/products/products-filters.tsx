'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuCheckboxItem, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ChevronDown, CalendarIcon, Filter, X, LayoutList, LayoutGrid } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import { Product } from './products-table';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Category {
  id: string;
  name: string;
}

interface ProductFiltersProps {
  table: Table<Product>;
  categories: Category[];
  selectedCategories: string[];
  onCategoryFilterChange: (categoryId: string) => void;
  onClearFilters: () => void;
  viewMode: 'table' | 'grid';
  onViewModeChange: (mode: 'table' | 'grid') => void;
}

export function ProductFilters({
  table,
  categories,
  selectedCategories,
  onCategoryFilterChange,
  onClearFilters,
  viewMode,
  onViewModeChange
}: ProductFiltersProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);

  // Hàm lọc theo ngày tạo
  const handleDateFilter = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    
    if (selectedDate) {
      const formattedDate = format(selectedDate, 'dd/MM/yyyy', { locale: vi });
      table.getColumn('createdAt')?.setFilterValue(formattedDate);
    } else {
      table.getColumn('createdAt')?.setFilterValue(undefined);
    }
  };

  return (
    <div className="space-y-4">
      {/* Phần nút lọc trên cùng */}
      <div className="flex flex-wrap gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              <Filter className="h-4 w-4 mr-1" />
              Danh mục
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Chọn danh mục</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categories.map((category) => (
              <DropdownMenuCheckboxItem
                key={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => onCategoryFilterChange(category.id)}
              >
                {category.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              Trạng thái
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Trạng thái sản phẩm</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={table.getColumn('status')?.getFilterValue() === 'active'}
              onCheckedChange={() => table.getColumn('status')?.setFilterValue(table.getColumn('status')?.getFilterValue() === 'active' ? null : 'active')}
            >
              Đang bán
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={table.getColumn('status')?.getFilterValue() === 'outOfStock'}
              onCheckedChange={() => table.getColumn('status')?.setFilterValue(table.getColumn('status')?.getFilterValue() === 'outOfStock' ? null : 'outOfStock')}
            >
              Hết hàng
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={table.getColumn('status')?.getFilterValue() === 'draft'}
              onCheckedChange={() => table.getColumn('status')?.setFilterValue(table.getColumn('status')?.getFilterValue() === 'draft' ? null : 'draft')}
            >
              Bản nháp
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {date ? format(date, 'dd/MM/yyyy', { locale: vi }) : 'Ngày tạo'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateFilter}
              initialFocus
              locale={vi}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Phần tìm kiếm và các nút lọc */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex-1 max-w-sm mr-2">
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="icon"
            onClick={() => onViewModeChange('table')}
            title="Chế độ xem bảng"
            className="h-9 w-9"
          >
            <LayoutList className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => onViewModeChange('grid')}
            title="Chế độ xem lưới"
            className="h-9 w-9"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Hiển thị badge của các bộ lọc đã chọn */}
      {(selectedCategories.length > 0 || table.getState().columnFilters.length > 0) && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedCategories.map((catId) => {
            const category = categories.find(c => c.id === catId);
            return category ? (
              <Badge key={catId} variant="secondary" className="flex items-center gap-1">
                {category.name}
                <Button
                  variant="ghost"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => onCategoryFilterChange(catId)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ) : null;
          })}
          {table.getState().columnFilters.map(filter => {
            if (filter.id === 'status') {
              const statusLabel = 
                filter.value === 'active' ? 'Đang bán' : 
                filter.value === 'outOfStock' ? 'Hết hàng' : 
                filter.value === 'draft' ? 'Bản nháp' : '';
              return (
                <Badge key={filter.id} variant="secondary" className="flex items-center gap-1">
                  {statusLabel}
                  <Button
                    variant="ghost"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => table.getColumn('status')?.setFilterValue(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            }
            if (filter.id === 'createdAt' && date) {
              return (
                <Badge key={filter.id} variant="secondary" className="flex items-center gap-1">
                  Ngày tạo: {format(date, 'dd/MM/yyyy', { locale: vi })}
                  <Button
                    variant="ghost"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => handleDateFilter(undefined)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            }
            return null;
          })}
          <Button variant="ghost" onClick={() => {
            onClearFilters();
            setDate(undefined);
            table.getColumn('createdAt')?.setFilterValue(undefined);
          }} className="h-6 text-xs">
            Xóa bộ lọc
          </Button>
        </div>
      )}
    </div>
  );
} 