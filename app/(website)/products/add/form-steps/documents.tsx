'use client';

import React, { forwardRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface DocumentsStepProps {
  form: UseFormReturn<any>;
}

const DocumentsStep = forwardRef<HTMLInputElement, DocumentsStepProps>(
  ({ form }, ref) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tài liệu kỹ thuật</CardTitle>
          <CardDescription>
            Thêm các tài liệu kỹ thuật cho sản phẩm
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="catalogue_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catalogue sản phẩm (URL)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập đường dẫn tới file catalogue"
                      {...field}
                      ref={ref}
                    />
                  </FormControl>
                  <FormDescription>
                    Đường dẫn tới file PDF hoặc tài liệu catalogue sản phẩm
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="manual_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hướng dẫn sử dụng (URL)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập đường dẫn tới file hướng dẫn sử dụng"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Đường dẫn tới file PDF hoặc tài liệu hướng dẫn sử dụng
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="datasheet_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bảng thông số chi tiết (URL)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập đường dẫn tới file bảng thông số chi tiết"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Đường dẫn tới file PDF hoặc tài liệu bảng thông số chi tiết
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    );
  }
);

DocumentsStep.displayName = 'DocumentsStep';

export default DocumentsStep;
