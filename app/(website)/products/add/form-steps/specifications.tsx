'use client';

import React, { forwardRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
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

interface SpecificationsStepProps {
  form: UseFormReturn<any>;
}

const SpecificationsStep = forwardRef<HTMLInputElement, SpecificationsStepProps>(
  ({ form }, ref) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Thông số kỹ thuật</CardTitle>
          <CardDescription>
            Nhập thông số kỹ thuật chi tiết của sản phẩm
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="working_dimensions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kích thước làm việc</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ví dụ: 1500 x 3000 mm"
                      {...field}
                      ref={ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="spindle_power"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Công suất trục chính</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: 5.5 kW" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="spindle_speed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tốc độ trục chính</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: 24,000 rpm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="movement_speed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tốc độ di chuyển</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: 30 m/min" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accuracy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Độ chính xác</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: ±0.01 mm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="control_system"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hệ thống điều khiển</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ví dụ: DSP, Mach3, etc."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="compatible_software"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phần mềm tương thích</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ví dụ: ArtCAM, Type3, etc."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file_formats"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Định dạng file</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ví dụ: G-code, NC, DXF, etc."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="power_consumption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Công suất tiêu thụ</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: 7.5 kW" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="machine_dimensions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kích thước máy</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ví dụ: 2200 x 3500 x 2000 mm"
                      {...field}
                    />
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
                    <Input placeholder="Ví dụ: 1200 kg" {...field} />
                  </FormControl>
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

SpecificationsStep.displayName = 'SpecificationsStep';

export default SpecificationsStep;
