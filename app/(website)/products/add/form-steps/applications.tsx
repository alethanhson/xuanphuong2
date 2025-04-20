'use client';

import React, { forwardRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface ApplicationsStepProps {
  form: UseFormReturn<any>;
  woodIndustryApps: string[];
  setWoodIndustryApps: React.Dispatch<React.SetStateAction<string[]>>;
  advertisingApps: string[];
  setAdvertisingApps: React.Dispatch<React.SetStateAction<string[]>>;
}

const ApplicationsStep = forwardRef<HTMLInputElement, ApplicationsStepProps>(
  ({ form, woodIndustryApps, setWoodIndustryApps, advertisingApps, setAdvertisingApps }, ref) => {
    const [newWoodApp, setNewWoodApp] = useState('');
    const [newAdApp, setNewAdApp] = useState('');

    return (
      <Card>
        <CardHeader>
          <CardTitle>Ứng dụng sản phẩm</CardTitle>
          <CardDescription>
            Thêm thông tin về các ứng dụng của sản phẩm
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="furniture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngành nội thất</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ví dụ: Sản xuất nội thất, tủ bếp, cửa gỗ, bàn ghế"
                      className="resize-none"
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
              name="interior_decoration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trang trí nội thất</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ví dụ: Trang trí nội thất, ốp tường, trần nghệ thuật"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="advertising"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quảng cáo</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ví dụ: Biển hiệu, logo, standee"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Ngành công nghiệp gỗ</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Thêm ứng dụng mới"
                    value={newWoodApp}
                    onChange={(e) => setNewWoodApp(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (newWoodApp.trim() !== '') {
                        setWoodIndustryApps(prev => [...prev, newWoodApp]);
                        setNewWoodApp('');
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="border rounded-md divide-y">
                  {woodIndustryApps.map((app, index) => (
                    <div key={index} className="p-3 flex items-center justify-between">
                      <span>{app}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setWoodIndustryApps(prev => prev.filter((_, i) => i !== index))}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Ngành quảng cáo</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Thêm ứng dụng mới"
                    value={newAdApp}
                    onChange={(e) => setNewAdApp(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (newAdApp.trim() !== '') {
                        setAdvertisingApps(prev => [...prev, newAdApp]);
                        setNewAdApp('');
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="border rounded-md divide-y">
                  {advertisingApps.map((app, index) => (
                    <div key={index} className="p-3 flex items-center justify-between">
                      <span>{app}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setAdvertisingApps(prev => prev.filter((_, i) => i !== index))}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

ApplicationsStep.displayName = 'ApplicationsStep';

export default ApplicationsStep;
