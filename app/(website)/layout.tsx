import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ScrollToTop from "@/components/scroll-to-top"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  title: "CNC Future - Giải Pháp CNC Gỗ & Kim Loại Hàng Đầu Việt Nam",
  description:
    "CNC Future chuyên cung cấp máy móc CNC gia công gỗ và kim loại, giải pháp sản xuất thông minh nâng cao hiệu suất. Tư vấn, thiết kế, lắp đặt và bảo trì chuyên nghiệp.",
  keywords: "CNC, máy CNC, gia công gỗ, gia công kim loại, máy CNC gỗ, máy CNC kim loại, giải pháp sản xuất",
  authors: [{ name: "CNC Future" }],
  robots: "index, follow",
  openGraph: {
    title: "CNC Future - Giải Pháp CNC Gỗ & Kim Loại Hàng Đầu Việt Nam",
    description:
      "Chuyên cung cấp máy móc CNC gia công gỗ và kim loại, giải pháp sản xuất thông minh nâng cao hiệu suất.",
    url: "https://cncfuture.com",
    siteName: "CNC Future",
    locale: "vi_VN",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html>
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  )
}

