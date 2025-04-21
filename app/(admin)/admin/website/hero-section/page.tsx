"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from "@hello-pangea/dnd"
import {
  PlusCircle,
  Trash2,
  Save,
  ArrowLeft,
  GripVertical,
  Image as ImageIcon,
  Link as LinkIcon,
  Type,
  AlignLeft
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import type { HeroSlide, HeroSectionSettings } from "@/lib/services/website-settings.service"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import ImageUploader from "@/components/admin/image-uploader"

export default function HeroSectionPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState<HeroSectionSettings>({
    slides: []
  })

  // Fetch hero section settings
  useEffect(() => {
    const initAndFetchSettings = async () => {
      try {
        setIsLoading(true)

        // Khởi tạo bảng website_settings nếu chưa tồn tại
        const initResponse = await fetch("/api/admin/website-settings/init")
        const initData = await initResponse.json()

        // Kiểm tra xem bảng có tồn tại không
        if (!initData.success && initData.message && initData.message.includes("chưa tồn tại")) {
          toast({
            title: "Cần tạo bảng dữ liệu",
            description: initData.message,
            variant: "destructive",
          })
          setSettings({
            slides: [createEmptySlide()]
          })
          setIsLoading(false)
          return
        }

        // Lấy cấu hình hero section
        const response = await fetch("/api/admin/website-settings/hero-section")
        const data = await response.json()

        if (data.success && data.settings) {
          setSettings(data.settings)
        } else {
          // Nếu không có dữ liệu, tạo một slide mẫu
          setSettings({
            slides: [createEmptySlide()]
          })
        }
      } catch (error) {
        console.error("Error fetching hero section settings:", error)
        toast({
          title: "Lỗi",
          description: "Không thể tải cấu hình Hero Section",
          variant: "destructive",
        })
        // Tạo một slide mẫu nếu có lỗi
        setSettings({
          slides: [createEmptySlide()]
        })
      } finally {
        setIsLoading(false)
      }
    }

    initAndFetchSettings()
  }, [])

  // Tạo một slide trống mới
  const createEmptySlide = (): HeroSlide => ({
    id: `slide_${Date.now()}`,
    title: "Tiêu đề slide",
    subtitle: "Tiêu đề phụ",
    description: "Mô tả ngắn về slide này",
    image: "/placeholder.svg",
    cta: {
      primary: {
        text: "Nút chính",
        link: "/",
      },
      secondary: {
        text: "Nút phụ",
        link: "/contact",
      },
    },
  })

  // Thêm slide mới
  const addSlide = () => {
    setSettings(prev => ({
      ...prev,
      slides: [...prev.slides, createEmptySlide()]
    }))
  }

  // Xóa slide
  const removeSlide = (index: number) => {
    if (settings.slides.length <= 1) {
      toast({
        title: "Không thể xóa",
        description: "Phải có ít nhất một slide",
        variant: "destructive",
      })
      return
    }

    setSettings(prev => ({
      ...prev,
      slides: prev.slides.filter((_, i) => i !== index)
    }))
  }

  // Cập nhật thông tin slide
  const updateSlide = (index: number, field: string, value: string) => {
    setSettings(prev => {
      const newSlides = [...prev.slides]

      // Cập nhật trường thông thường
      if (field === "title" || field === "subtitle" || field === "description" || field === "image") {
        newSlides[index] = {
          ...newSlides[index],
          [field]: value
        }
      }
      // Cập nhật trường CTA
      else if (field === "primaryText") {
        newSlides[index] = {
          ...newSlides[index],
          cta: {
            ...newSlides[index].cta,
            primary: {
              ...newSlides[index].cta.primary,
              text: value
            }
          }
        }
      } else if (field === "primaryLink") {
        newSlides[index] = {
          ...newSlides[index],
          cta: {
            ...newSlides[index].cta,
            primary: {
              ...newSlides[index].cta.primary,
              link: value
            }
          }
        }
      } else if (field === "secondaryText") {
        newSlides[index] = {
          ...newSlides[index],
          cta: {
            ...newSlides[index].cta,
            secondary: {
              ...newSlides[index].cta.secondary,
              text: value
            }
          }
        }
      } else if (field === "secondaryLink") {
        newSlides[index] = {
          ...newSlides[index],
          cta: {
            ...newSlides[index].cta,
            secondary: {
              ...newSlides[index].cta.secondary,
              link: value
            }
          }
        }
      }

      return {
        ...prev,
        slides: newSlides
      }
    })
  }

  // Xử lý kéo thả để sắp xếp lại slides
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(settings.slides)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setSettings(prev => ({
      ...prev,
      slides: items
    }))
  }

  // Lưu cấu hình
  const saveSettings = async () => {
    try {
      setIsSaving(true)

      // Kiểm tra xem bảng website_settings đã tồn tại chưa
      const initResponse = await fetch("/api/admin/website-settings/init")
      const initData = await initResponse.json()

      // Nếu bảng chưa tồn tại, hiển thị thông báo
      if (!initData.success && initData.message && initData.message.includes("chưa tồn tại")) {
        toast({
          title: "Không thể lưu",
          description: initData.message,
          variant: "destructive",
        })
        setIsSaving(false)
        return
      }

      const response = await fetch("/api/admin/website-settings/hero-section", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Thành công",
          description: "Đã lưu cấu hình Hero Section",
        })
        router.refresh()
      } else {
        throw new Error(data.error || "Lỗi không xác định")
      }
    } catch (error) {
      console.error("Error saving hero section settings:", error)
      toast({
        title: "Lỗi",
        description: "Không thể lưu cấu hình Hero Section",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cấu hình Hero Section</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý nội dung hiển thị trên Hero Section của trang chủ
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push("/admin/website")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <Button size="sm" onClick={saveSettings} disabled={isSaving}>
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Lưu thay đổi
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách slides</CardTitle>
          <CardDescription>
            Kéo và thả để sắp xếp thứ tự các slides. Nhấn vào từng slide để chỉnh sửa nội dung.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="slides">
              {(provided: any) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {settings.slides.map((slide, index) => (
                    <Draggable key={slide.id} draggableId={slide.id} index={index}>
                      {(provided: any) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="border rounded-lg overflow-hidden"
                        >
                          <div className="bg-muted p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div {...provided.dragHandleProps} className="cursor-move">
                                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <h3 className="font-medium">Slide {index + 1}</h3>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSlide(index)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Xóa slide</span>
                              </Button>
                            </div>
                          </div>

                          <div className="p-4">
                            <Tabs defaultValue="content">
                              <TabsList className="mb-4">
                                <TabsTrigger value="content">Nội dung</TabsTrigger>
                                <TabsTrigger value="image">Hình ảnh</TabsTrigger>
                                <TabsTrigger value="buttons">Nút CTA</TabsTrigger>
                                <TabsTrigger value="preview">Xem trước</TabsTrigger>
                              </TabsList>

                              <TabsContent value="content" className="space-y-4">
                                <div className="grid gap-2">
                                  <Label htmlFor={`title-${index}`} className="flex items-center gap-2">
                                    <Type className="h-4 w-4" /> Tiêu đề chính
                                  </Label>
                                  <Input
                                    id={`title-${index}`}
                                    value={slide.title}
                                    onChange={(e) => updateSlide(index, "title", e.target.value)}
                                    placeholder="Nhập tiêu đề chính"
                                  />
                                </div>

                                <div className="grid gap-2">
                                  <Label htmlFor={`subtitle-${index}`} className="flex items-center gap-2">
                                    <Type className="h-4 w-4" /> Tiêu đề phụ
                                  </Label>
                                  <Input
                                    id={`subtitle-${index}`}
                                    value={slide.subtitle}
                                    onChange={(e) => updateSlide(index, "subtitle", e.target.value)}
                                    placeholder="Nhập tiêu đề phụ"
                                  />
                                </div>

                                <div className="grid gap-2">
                                  <Label htmlFor={`description-${index}`} className="flex items-center gap-2">
                                    <AlignLeft className="h-4 w-4" /> Mô tả
                                  </Label>
                                  <Textarea
                                    id={`description-${index}`}
                                    value={slide.description}
                                    onChange={(e) => updateSlide(index, "description", e.target.value)}
                                    placeholder="Nhập mô tả"
                                    rows={3}
                                  />
                                </div>
                              </TabsContent>

                              <TabsContent value="image" className="space-y-4">
                                <ImageUploader
                                  value={slide.image}
                                  onChange={(url) => updateSlide(index, "image", url)}
                                  folder="hero-section"
                                  aspectRatio="video"
                                />
                              </TabsContent>

                              <TabsContent value="buttons" className="space-y-4">
                                <div className="border rounded-md p-4 space-y-4">
                                  <h4 className="font-medium">Nút chính</h4>
                                  <div className="grid gap-2">
                                    <Label htmlFor={`primary-text-${index}`} className="flex items-center gap-2">
                                      <Type className="h-4 w-4" /> Văn bản
                                    </Label>
                                    <Input
                                      id={`primary-text-${index}`}
                                      value={slide.cta.primary.text}
                                      onChange={(e) => updateSlide(index, "primaryText", e.target.value)}
                                      placeholder="Nhập văn bản nút"
                                    />
                                  </div>

                                  <div className="grid gap-2">
                                    <Label htmlFor={`primary-link-${index}`} className="flex items-center gap-2">
                                      <LinkIcon className="h-4 w-4" /> Đường dẫn
                                    </Label>
                                    <Input
                                      id={`primary-link-${index}`}
                                      value={slide.cta.primary.link}
                                      onChange={(e) => updateSlide(index, "primaryLink", e.target.value)}
                                      placeholder="Nhập đường dẫn"
                                    />
                                  </div>
                                </div>

                                <div className="border rounded-md p-4 space-y-4">
                                  <h4 className="font-medium">Nút phụ</h4>
                                  <div className="grid gap-2">
                                    <Label htmlFor={`secondary-text-${index}`} className="flex items-center gap-2">
                                      <Type className="h-4 w-4" /> Văn bản
                                    </Label>
                                    <Input
                                      id={`secondary-text-${index}`}
                                      value={slide.cta.secondary.text}
                                      onChange={(e) => updateSlide(index, "secondaryText", e.target.value)}
                                      placeholder="Nhập văn bản nút"
                                    />
                                  </div>

                                  <div className="grid gap-2">
                                    <Label htmlFor={`secondary-link-${index}`} className="flex items-center gap-2">
                                      <LinkIcon className="h-4 w-4" /> Đường dẫn
                                    </Label>
                                    <Input
                                      id={`secondary-link-${index}`}
                                      value={slide.cta.secondary.link}
                                      onChange={(e) => updateSlide(index, "secondaryLink", e.target.value)}
                                      placeholder="Nhập đường dẫn"
                                    />
                                  </div>
                                </div>
                              </TabsContent>

                              <TabsContent value="preview" className="space-y-4">
                                <div className="aspect-[21/9] relative rounded-md overflow-hidden border">
                                  <Image
                                    src={slide.image || "/placeholder.svg"}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                    unoptimized={slide.image?.startsWith("http") || slide.image?.startsWith("/")}
                                  />
                                  <div className="absolute inset-0 bg-black/50 flex items-center">
                                    <div className="container mx-auto px-4">
                                      <div className="max-w-3xl text-white">
                                        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                                          {slide.title}
                                        </h1>
                                        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-primary">
                                          {slide.subtitle}
                                        </h2>
                                        <p className="text-base text-white/80 mb-6">
                                          {slide.description}
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                          <Button size="sm" className="gap-2">
                                            {slide.cta.primary.text}
                                          </Button>
                                          <Button variant="outline" size="sm" className="gap-2 bg-white/10 hover:bg-white/20 border-white/20">
                                            {slide.cta.secondary.text}
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>
                            </Tabs>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={addSlide}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm slide mới
          </Button>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/admin/website")}>
            Hủy
          </Button>
          <Button onClick={saveSettings} disabled={isSaving}>
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Lưu thay đổi
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
