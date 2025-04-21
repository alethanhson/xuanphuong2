"use client"

import { useState, useRef, ChangeEvent, memo, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  folder?: string
  className?: string
  aspectRatio?: "square" | "video" | "banner" | "auto"
  maxSizeMB?: number
}

function ImageUploader({
  value,
  onChange,
  folder = "products",
  className = "",
  aspectRatio = "video",
  maxSizeMB = 5
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>(value || "")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getAspectRatioClass = useCallback(() => {
    switch (aspectRatio) {
      case "square": return "aspect-square"
      case "video": return "aspect-video"
      case "banner": return "aspect-[21/9]"
      case "auto":
      default: return ""
    }
  }, [aspectRatio])

  const handleFileChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const maxSize = maxSizeMB * 1024 * 1024
    if (file.size > maxSize) {
      toast({
        title: "Lỗi",
        description: `Kích thước file quá lớn. Tối đa ${maxSizeMB}MB.`,
        variant: "destructive",
      })
      return
    }

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Lỗi",
        description: "Chỉ chấp nhận file hình ảnh.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUploading(true)
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)

      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", folder)

      const response = await fetch("/api/admin/upload-local", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Lỗi khi upload hình ảnh")
      }

      onChange(data.url)
      toast({
        title: "Thành công",
        description: "Đã upload hình ảnh thành công",
      })
    } catch (error) {
      console.error("Lỗi upload:", error)
      toast({
        title: "Lỗi",
        description: "Không thể upload hình ảnh. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }, [folder, maxSizeMB, onChange])

  const handleRemoveImage = useCallback(() => {
    onChange("")
    setPreviewUrl("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [onChange])

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <Label htmlFor="image-upload" className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4" /> Hình ảnh
        </Label>
        {previewUrl && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemoveImage}
            className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <X className="h-4 w-4 mr-1" />
            Xóa
          </Button>
        )}
      </div>

      <div className={`relative border rounded-md overflow-hidden ${getAspectRatioClass()}`}>
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted p-4 text-center">
            <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Kéo thả hoặc nhấp để tải lên hình ảnh
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG hoặc GIF. Tối đa {maxSizeMB}MB.
            </p>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}

        <Input
          id="image-upload"
          type="file"
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleFileChange}
          disabled={isUploading}
          ref={fileInputRef}
        />
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Đang tải lên...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Tải lên hình ảnh
          </>
        )}
      </Button>
    </div>
  )
}

export default memo(ImageUploader)
