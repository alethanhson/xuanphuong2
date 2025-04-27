import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ScrollToTop from "@/components/scroll-to-top"
import { Toaster } from "@/components/ui/toaster"
import ClientLayout from "@/components/client-layout"
import AnalyticsProvider from "@/components/analytics-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://tantienvinh.com"),
  title: "Tân Tiến Vinh - Giải Pháp CNC Gỗ & Kim Loại Hàng Đầu Việt Nam",
  description:
    "Tân Tiến Vinh chuyên cung cấp máy móc CNC gia công gỗ và kim loại, giải pháp sản xuất thông minh nâng cao hiệu suất. Tư vấn, thiết kế, lắp đặt và bảo trì chuyên nghiệp.",
  keywords: ["máy cnc", "cnc gỗ", "cnc kim loại", "thiết bị cnc", "công nghệ cnc"],
  authors: [{ name: "Tân Tiến Vinh" }],
  robots: "index, follow",
  openGraph: {
    title: "Tân Tiến Vinh - Giải Pháp CNC Gỗ & Kim Loại Hàng Đầu Việt Nam",
    description:
      "Chuyên cung cấp máy CNC chất lượng cao, dịch vụ tư vấn, lắp đặt và bảo trì cho ngành gỗ và kim loại tại Việt Nam.",
    url: "https://tantienvinh.com",
    siteName: "Tân Tiến Vinh",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "https://tantienvinh.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tân Tiến Vinh - Giải Pháp CNC Gỗ & Kim Loại",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tân Tiến Vinh - Giải Pháp CNC Gỗ & Kim Loại Hàng Đầu Việt Nam",
    description: "Chuyên cung cấp máy CNC chất lượng cao, dịch vụ tư vấn, lắp đặt và bảo trì cho ngành gỗ và kim loại.",
    images: ["https://tantienvinh.com/images/twitter-image.jpg"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={inter.className} suppressHydrationWarning={true}>
        <ClientLayout>
          <AnalyticsProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <ScrollToTop />
            <Toaster />
          </AnalyticsProvider>
        </ClientLayout>
      </body>
    </html>
  )
}

