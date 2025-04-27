"use client"

import React, { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { toast } from "sonner"

// Schema cho form đăng ký tư vấn
const formSchema = z.object({
  full_name: z.string().min(2, { message: "Họ tên phải có ít nhất 2 ký tự" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().optional(),
  product_id: z.string().optional(),
})

// Khai báo kiểu dữ liệu cho form
type FormValues = z.infer<typeof formSchema>

interface ConsultationFormProps {
  productId?: string
  productName?: string
  className?: string
}

export default function ConsultationForm({ 
  productId, 
  productName,
  className = ""
}: ConsultationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Khởi tạo form với React Hook Form và Zod
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      company: "",
      message: productName ? `Tôi quan tâm đến sản phẩm ${productName}` : "",
      product_id: productId,
    },
  })

  // Hàm xử lý gửi form
  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    
    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error?.message || "Đã xảy ra lỗi khi gửi yêu cầu")
      }

      // Hiển thị thông báo thành công
      toast.success(result.message || "Đăng ký tư vấn thành công. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.")
      
      // Reset form
      form.reset()
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error(error instanceof Error ? error.message : "Đã xảy ra lỗi. Vui lòng thử lại sau.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`p-6 rounded-lg bg-muted/50 ${className}`}>
      <h3 className="text-xl font-semibold mb-4">
        {productName ? `Đăng ký tư vấn về ${productName}` : "Đăng ký tư vấn"}
      </h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ và tên <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Nhập họ và tên của bạn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="Nhập địa chỉ email của bạn" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập số điện thoại của bạn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Công ty</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên công ty của bạn (nếu có)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lời nhắn</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Nhập nội dung cần tư vấn" 
                    className="min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu tư vấn"}
          </Button>
        </form>
      </Form>
    </div>
  )
} 