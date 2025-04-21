"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { useState, useEffect } from "react"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  // Đánh dấu component đã được mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Khi chưa mount, render một div trống với suppressHydrationWarning
  if (!mounted) {
    return (
      <div suppressHydrationWarning style={{ visibility: "hidden" }}>
        {children}
      </div>
    )
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
