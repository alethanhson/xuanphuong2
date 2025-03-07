"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { ImageIcon, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"
import imageCompression from "browser-image-compression"

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

      // Compress image before uploading
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
      })

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
      console.error("Error uploading image:", error)
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your image. Please try again.",
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
        console.error("Error processing images:", error)
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: "There was an error processing your images. Please try again.",
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
  })

  const removeImage = (id: string) => {
    const updatedImages = images.filter((image) => image.id !== id)

    // If we removed the primary image, make the first remaining image primary
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group border rounded-lg overflow-hidden">
              <div className="aspect-square relative">
                <Image src={image.url || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
                {image.isPrimary && (
                  <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">Ảnh chính</div>
                )}
              </div>
              <div className="p-2">
                <input
                  type="text"
                  value={image.alt}
                  onChange={(e) => updateImageAlt(image.id, e.target.value)}
                  className="w-full text-sm p-1 border rounded"
                  placeholder="Mô tả ảnh"
                />
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeImage(image.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {!image.isPrimary && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="absolute bottom-12 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setPrimaryImage(image.id)}
                >
                  Đặt làm ảnh chính
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

