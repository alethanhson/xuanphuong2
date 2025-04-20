'use client';

import React, { forwardRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface FeaturesStepProps {
  features: { id: string; name: string; description: string; icon: string }[];
  setFeatures: React.Dispatch<
    React.SetStateAction<
      { id: string; name: string; description: string; icon: string }[]
    >
  >;
}

const FeaturesStep = forwardRef<HTMLInputElement, FeaturesStepProps>(
  ({ features, setFeatures }, ref) => {
    const [newFeatureName, setNewFeatureName] = useState('');
    const [newFeatureDescription, setNewFeatureDescription] = useState('');
    const [newFeatureIcon, setNewFeatureIcon] = useState('');

    // Añadir característica
    const addFeature = () => {
      if (newFeatureName.trim() === '' || newFeatureDescription.trim() === '') {
        toast({
          title: 'Lỗi!',
          description: 'Tên và mô tả tính năng không được để trống.',
          variant: 'destructive',
        });
        return;
      }

      const newFeature = {
        id: Math.random().toString(36).substring(2, 9),
        name: newFeatureName,
        description: newFeatureDescription,
        icon: newFeatureIcon,
      };

      setFeatures((prev) => [...prev, newFeature]);
      setNewFeatureName('');
      setNewFeatureDescription('');
      setNewFeatureIcon('');
    };

    // Eliminar característica
    const removeFeature = (id: string) => {
      setFeatures((prev) => prev.filter((feature) => feature.id !== id));
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>Tính năng sản phẩm</CardTitle>
          <CardDescription>
            Thêm các tính năng nổi bật của sản phẩm
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">
                  Tên tính năng
                </label>
                <Input
                  placeholder="Ví dụ: Tốc độ cao"
                  value={newFeatureName}
                  onChange={(e) => setNewFeatureName(e.target.value)}
                  ref={ref}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Mô tả</label>
                <Input
                  placeholder="Ví dụ: Tốc độ xử lý nhanh chóng"
                  value={newFeatureDescription}
                  onChange={(e) =>
                    setNewFeatureDescription(e.target.value)
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Icon (tùy chọn)
                </label>
                <Input
                  placeholder="Ví dụ: speed"
                  value={newFeatureIcon}
                  onChange={(e) => setNewFeatureIcon(e.target.value)}
                />
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={addFeature}
            >
              <Plus className="mr-2 h-4 w-4" /> Thêm tính năng
            </Button>

            {features.length > 0 && (
              <div className="border rounded-md">
                <div className="grid grid-cols-1 divide-y">
                  {features.map((feature) => (
                    <div
                      key={feature.id}
                      className="p-4 flex items-start justify-between"
                    >
                      <div>
                        <h4 className="font-medium">{feature.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                        {feature.icon && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Icon: {feature.icon}
                          </p>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFeature(feature.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

FeaturesStep.displayName = 'FeaturesStep';

export default FeaturesStep;
