"use client"

import { useState, useCallback, useMemo } from "react"
import { useDropzone } from "react-dropzone"
import { ImageIcon, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"
import imageCompression from "browser-image-compression"

// Kiểm soát việc ghi log debug
const MODE_DEBUG = process.env.NODE_ENV === 'development';

// Cấu hình nén ảnh
const COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'image/jpeg',
}

interface ImageUploadProps {
  onImagesChange: (images: { id: string; url: string; alt: string; isPrimary: boolean }[]) => void
  initialImages?: { id: string; url: string; alt: string; isPrimary: boolean }[]
}

export function ImageUpload({ onImagesChange, initialImages = [] }: ImageUploadProps) {
  const [images, setImages] = useState<{ id: string; url: string; alt: string; isPrimary: boolean }[]>(initialImages)
  const [uploading, setUploading] = useState(false)

  const uploadImage = async (file: File) => {
    try {
      setUploading(true)

      // Nén ảnh trước khi tải lên
      const compressedFile = await imageCompression(file, COMPRESSION_OPTIONS)

      const formData = new FormData()
      formData.append("file", compressedFile)

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()

      return {
        id: Date.now().toString(),
        url: data.url,
        alt: file.name.split(".")[0],
        isPrimary: images.length === 0,
      }
    } catch (error) {
      // Chỉ log lỗi quan trọng
      console.error("Lỗi tải lên hình ảnh:", error instanceof Error ? error.message : "Lỗi không xác định")
      toast({
        variant: "destructive",
        title: "Tải lên thất bại",
        description: "Đã xảy ra lỗi khi tải lên hình ảnh. Vui lòng thử lại.",
      })
      return null
    } finally {
      setUploading(false)
    }
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      setUploading(true)

      try {
        // Tạo mảng promise để tải lên nhiều file cùng lúc
        const uploadPromises = acceptedFiles.map((file) => uploadImage(file))
        const uploadedImages = await Promise.all(uploadPromises)

        const validImages = uploadedImages.filter(Boolean) as {
          id: string
          url: string
          alt: string
          isPrimary: boolean
        }[]

        if (validImages.length > 0) {
          const newImages = [...images, ...validImages]
          setImages(newImages)
          onImagesChange(newImages)
        }
      } catch (error) {
        // Chỉ log lỗi quan trọng
        console.error("Lỗi xử lý hình ảnh:", error instanceof Error ? error.message : "Lỗi không xác định")
        toast({
          variant: "destructive",
          title: "Tải lên thất bại",
          description: "Đã xảy ra lỗi khi xử lý hình ảnh. Vui lòng thử lại.",
        })
      } finally {
        setUploading(false)
      }
    },
    [images, onImagesChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    disabled: uploading,
    maxSize: 5 * 1024 * 1024, // 5MB limit
  })

  const removeImage = (id: string) => {
    const updatedImages = images.filter((image) => image.id !== id)

    // Nếu xóa hình ảnh chính, đặt hình ảnh đầu tiên còn lại làm hình ảnh chính
    if (updatedImages.length > 0 && !updatedImages.some((img) => img.isPrimary)) {
      updatedImages[0].isPrimary = true
    }

    setImages(updatedImages)
    onImagesChange(updatedImages)
  }

  const setPrimaryImage = (id: string) => {
    const updatedImages = images.map((image) => ({
      ...image,
      isPrimary: image.id === id,
    }))

    setImages(updatedImages)
    onImagesChange(updatedImages)
  }

  const updateImageAlt = (id: string, alt: string) => {
    const updatedImages = images.map((image) => (image.id === id ? { ...image, alt } : image))

    setImages(updatedImages)
    onImagesChange(updatedImages)
  }

  // Tối ưu hiệu suất với useMemo
  const imagesList = useMemo(() => {
    return images.map((image) => (
      <div key={image.id} className="relative border rounded-md overflow-hidden">
        <div className="aspect-video relative">
          <Image
            src={image.url}
            alt={image.alt}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-2 flex flex-col gap-2">
          <input
            type="text"
            value={image.alt}
            onChange={(e) => updateImageAlt(image.id, e.target.value)}
            placeholder="Mô tả hình ảnh"
            className="px-2 py-1 border rounded text-sm"
          />
          <div className="flex justify-between">
            <Button
              type="button"
              size="sm"
              variant={image.isPrimary ? "default" : "outline"}
              onClick={() => setPrimaryImage(image.id)}
              disabled={image.isPrimary}
            >
              {image.isPrimary ? "Hình chính" : "Đặt làm chính"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={() => removeImage(image.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    ));
  }, [images]);

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${
          isDragActive ? "border-primary" : "border-gray-300"
        }`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {uploading ? (
            <Loader2 className="w-8 h-8 mb-4 text-gray-500 animate-spin" />
          ) : (
            <ImageIcon className="w-8 h-8 mb-4 text-gray-500" />
          )}
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Nhấp để tải lên</span> hoặc kéo và thả
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, JPEG hoặc WEBP (Tối đa 5MB)</p>
        </div>
        <input {...getInputProps()} />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {imagesList}
        </div>
      )}
    </div>
  )
}

