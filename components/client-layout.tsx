"use client"

import { ReactNode, useEffect, useState } from "react"
import { useSuppressionError } from "@/lib/hooks/use-suppression-error"

interface ClientLayoutProps {
  children: ReactNode
}

/**
 * Component client-side để xử lý các vấn đề hydration
 */
export default function ClientLayout({ children }: ClientLayoutProps) {
  // Sử dụng hook để ngăn chặn lỗi hydration
  useSuppressionError()

  // Sử dụng state để kiểm soát việc render
  const [mounted, setMounted] = useState(false)

  // Xóa các thuộc tính do extension thêm vào
  useEffect(() => {
    // Chức năng xóa thuộc tính monica và các thuộc tính khác
    function cleanupAttributes() {
      // Xóa các thuộc tính monica-id và monica-version
      const body = document.querySelector("body")
      if (body) {
        // Xóa rõ ràng các thuộc tính monica
        if (body.hasAttribute("monica-id")) {
          body.removeAttribute("monica-id")
        }
        if (body.hasAttribute("monica-version")) {
          body.removeAttribute("monica-version")
        }

        // Xóa các thuộc tính khác có thể gây ra lỗi hydration
        const attributesToRemove = Array.from(body.attributes)
          .filter(attr => attr.name.startsWith('data-') || attr.name.includes('-'))
          .map(attr => attr.name)

        attributesToRemove.forEach(attr => {
          if (attr !== 'data-theme' && attr !== 'class') {
            body.removeAttribute(attr)
          }
        })
      }
    }

    // Đánh dấu component đã được mount
    setMounted(true)
    
    // Xóa thuộc tính ngay lập tức
    cleanupAttributes()
    
    // Xóa thuộc tính sau một khoảng thời gian để đảm bảo các extension không thêm lại chúng
    const interval = setInterval(cleanupAttributes, 1000)
    
    return () => {
      clearInterval(interval)
    }
  }, [])

  // Chỉ render children sau khi component đã được mount ở client
  if (!mounted) {
    // Render một div trống để tránh lỗi hydration
    return <div suppressHydrationWarning></div>
  }

  return <>{children}</>
}
