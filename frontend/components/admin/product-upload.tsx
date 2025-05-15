'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import imageCompression from 'browser-image-compression';

interface ProductUploadProps {
  onUploaded: (urls: string[]) => void;
  existingImages?: string[];
  maxFiles?: number;
}

export default function ProductUpload({
  onUploaded,
  existingImages = [],
  maxFiles = 5,
}: ProductUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(existingImages);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Kiểm tra số lượng file tối đa
    if (previews.length + acceptedFiles.length > maxFiles) {
      toast.error(`Chỉ được tải lên tối đa ${maxFiles} ảnh`);
      return;
    }

    // Thêm files mới vào danh sách
    setFiles((prev) => [...prev, ...acceptedFiles]);

    // Tạo previews cho các file mới
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, [maxFiles, previews.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeImage = (index: number) => {
    // Nếu là ảnh đã tồn tại
    if (index < existingImages.length) {
      const newExistingImages = [...existingImages];
      newExistingImages.splice(index, 1);
      setPreviews((prev) => {
        const newPreviews = [...prev];
        newPreviews.splice(index, 1);
        return newPreviews;
      });
      onUploaded(newExistingImages);
    } else {
      // Nếu là ảnh mới thêm vào
      const fileIndex = index - existingImages.length;
      setFiles((prev) => {
        const newFiles = [...prev];
        newFiles.splice(fileIndex, 1);
        return newFiles;
      });
      setPreviews((prev) => {
        const newPreviews = [...prev];
        newPreviews.splice(index, 1);
        return newPreviews;
      });
    }
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      return;
    }

    setIsUploading(true);
    const uploadedUrls: string[] = [...existingImages];

    try {
      // Nén ảnh trước khi upload
      const compressedFiles = await Promise.all(
        files.map(async (file) => {
          const options = {
            maxSizeMB: 1, // Nén xuống còn 1MB
            maxWidthOrHeight: 1920, // Giảm kích thước xuống 1920px
            useWebWorker: true,
          };
          return await imageCompression(file, options);
        })
      );

      // Upload từng file lên server
      for (const file of compressedFiles) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Lỗi upload ảnh');
        }

        const data = await response.json();
        uploadedUrls.push(data.url);
      }

      // Trả về danh sách URL cho component cha
      onUploaded(uploadedUrls);
      setFiles([]);
      toast.success('Upload ảnh thành công');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Lỗi khi upload ảnh. Vui lòng thử lại.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-10 w-10 mx-auto text-gray-500" />
        <p className="mt-2 text-sm text-gray-500">
          {isDragActive
            ? 'Thả ảnh vào đây...'
            : 'Kéo thả ảnh vào đây, hoặc click để chọn ảnh'}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          PNG, JPG, WEBP tối đa {maxFiles} ảnh (tối đa 10MB mỗi ảnh)
        </p>
      </div>

      {previews.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Ảnh đã chọn:</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <Button
          type="button"
          onClick={uploadFiles}
          disabled={isUploading}
          className="mt-4"
        >
          {isUploading ? 'Đang tải lên...' : 'Tải lên'}
        </Button>
      )}
    </div>
  );
} 