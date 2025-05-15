"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Trash2, Upload } from "lucide-react";
import Image from "next/image";

interface ProductImage {
  url: string;
  alt: string;
}

interface ProductImageUploadProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
}

export default function ProductImageUpload({ 
  images = [], 
  onChange 
}: ProductImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  // Hàm xử lý khi upload file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      // Giả lập việc upload file
      // Trong thực tế, bạn sẽ gửi file lên server và nhận lại URL
      const newImages = [...images];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Tạo URL tạm thời cho ảnh (trong môi trường thực tế sẽ upload lên server)
        const imageUrl = URL.createObjectURL(file);
        
        newImages.push({
          url: imageUrl,
          alt: file.name
        });
      }
      
      onChange(newImages);
      e.target.value = '';
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
    } finally {
      setUploading(false);
    }
  };

  // Hàm xóa ảnh
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  // Hàm cập nhật alt text cho ảnh
  const updateAltText = (index: number, altText: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], alt: altText };
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {images.map((image, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="relative pt-[56.25%]">
              <Image
                src={image.url}
                alt={image.alt || "Product image"}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-3">
              <Input
                placeholder="Mô tả ảnh"
                value={image.alt || ""}
                onChange={(e) => updateAltText(index, e.target.value)}
                className="text-sm"
              />
            </CardContent>
            <CardFooter className="p-2 pt-0 flex justify-end">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeImage(index)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Xóa
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="product-image-upload"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Nhấn để chọn</span> hoặc kéo thả ảnh
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP (Tối đa 5MB)</p>
          </div>
          <Input
            id="product-image-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  );
} 