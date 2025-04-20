'use client';

import React, { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImageIcon, Trash } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface ImagesStepProps {
  images: { id: string; file: File; preview: string; isPrimary: boolean }[];
  setImages: React.Dispatch<
    React.SetStateAction<
      { id: string; file: File; preview: string; isPrimary: boolean }[]
    >
  >;
}

const ImagesStep = forwardRef<HTMLInputElement, ImagesStepProps>(
  ({ images, setImages }, ref) => {
    // Manejar carga de imágenes
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const newImages = Array.from(e.target.files).map((file) => ({
          id: Math.random().toString(36).substring(2, 9),
          file,
          preview: URL.createObjectURL(file),
          isPrimary: images.length === 0,
        }));
        setImages((prev) => [...prev, ...newImages]);
      }
    };

    // Eliminar imagen
    const removeImage = (id: string) => {
      setImages((prev) => {
        const filtered = prev.filter((img) => img.id !== id);

        // Si eliminamos la imagen principal, establecer la primera imagen restante como principal
        if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
          filtered[0].isPrimary = true;
        }

        return filtered;
      });
    };

    // Establecer imagen como principal
    const setImageAsPrimary = (id: string) => {
      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          isPrimary: img.id === id,
        }))
      );
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>Hình ảnh sản phẩm</CardTitle>
          <CardDescription>
            Tải lên hình ảnh cho sản phẩm
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">
                      Nhấp để tải lên
                    </span>{' '}
                    hoặc kéo và thả
                  </p>
                  <p className="text-xs text-gray-500">
                    SVG, PNG, JPG hoặc GIF (Tối đa 5MB)
                  </p>
                </div>
                <Input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  ref={ref}
                />
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <div
                      className={`aspect-square overflow-hidden rounded-lg border ${
                        image.isPrimary ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <img
                        src={image.preview || '/placeholder.svg'}
                        alt="Product preview"
                        className="object-cover w-full h-full"
                      />
                      {image.isPrimary && (
                        <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                          Ảnh chính
                        </div>
                      )}
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1">
                      {!image.isPrimary && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setImageAsPrimary(image.id)}
                        >
                          <span className="text-xs">★</span>
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(image.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

ImagesStep.displayName = 'ImagesStep';

export default ImagesStep;
