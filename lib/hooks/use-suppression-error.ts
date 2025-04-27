"use client"

import { useEffect } from "react"

/**
 * Hook để ngăn chặn lỗi hydration do extension trình duyệt
 */
export function useSuppressionError() {
  useEffect(() => {
    // Ngăn chặn lỗi hydration trong console
    const originalConsoleError = console.error
    console.error = (...args: any[]) => {
      // Danh sách các lỗi hydration cần bỏ qua
      const hydrationErrorMessages = [
        "Hydration failed because the initial UI does not match what was rendered on the server",
        "There was an error while hydrating",
        "Hydration failed because the server rendered HTML",
        "Text content does not match server-rendered HTML",
        "Hydration failed because the initial",
        "Warning: Expected server HTML to contain a matching",
        "Warning: An error occurred during hydration",
        "Warning: Prop `style` did not match",
        "does not match server-rendered HTML",
        "A tree hydrated but some attributes of the server rendered HTML didn't match the client properties",
        "monica-id",
        "monica-version"
      ]

      if (typeof args[0] === "string") {
        // Kiểm tra xem lỗi có phải là lỗi hydration không
        const isHydrationError = hydrationErrorMessages.some(msg => args[0].includes(msg))
        if (isHydrationError) {
          // Bỏ qua lỗi hydration
          return
        }
      }

      originalConsoleError(...args)
    }

    return () => {
      console.error = originalConsoleError
    }
  }, [])
}
