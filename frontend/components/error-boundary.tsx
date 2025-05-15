"use client"

import React, { type ReactNode } from "react"
import { Button } from "@/components/ui/button"

export class ErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h2 className="text-2xl font-bold mb-4">Đã có lỗi xảy ra</h2>
          <p className="text-muted-foreground mb-4">Vui lòng thử tải lại trang</p>
          <Button
            onClick={() => {
              this.setState({ hasError: false })
              window.location.reload()
            }}
          >
            Tải lại trang
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

