import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Metadata } from "next"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString("vi-VN", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

export function constructMetadata({
  title = "Tân Tiến Vinh - Giải Pháp CNC Toàn Diện",
  description = "Tân Tiến Vinh cung cấp giải pháp máy CNC chất lượng cao cho ngành gỗ và kim loại tại Việt Nam",
  keywords = [],
  image = "/og-image.jpg",
  icons = [
    {
      rel: "icon",
      url: "/favicon.ico",
    },
  ],
  noIndex = false,
  openGraph,
  ...rest
}: {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  icons?: { rel: string; url: string }[]
  noIndex?: boolean
  openGraph?: any
  [key: string]: any
} = {}): Metadata {
  return {
    title,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: "Tân Tiến Vinh" }],
    metadataBase: new URL("https://cncfuture.com"),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
      locale: "vi_VN",
      type: "website",
      ...openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@cncfuture",
    },
    icons,
    robots: {
      index: !noIndex,
      follow: true,
      googleBot: {
        index: !noIndex,
        follow: true,
      },
    },
    ...rest,
  }
}

