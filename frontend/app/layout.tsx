import Providers from '@/components/providers';
import '@/app/globals.css';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@/components/ui/sonner';

// Sử dụng font Inter từ Google Fonts
const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
});

// Metadata cho SEO
export const metadata: Metadata = {
  title: {
    template: '%s | Xuân Phương',
    default: 'Xuân Phương',
  },
  description: 'Xuân Phương - Chuyên cung cấp các dịch vụ và sản phẩm chất lượng cao',
  keywords: ['xuân phương', 'dịch vụ', 'sản phẩm'],
  authors: [{ name: 'Xuân Phương', url: 'https://xuanphuong.com' }],
  creator: 'Xuân Phương',
  metadataBase: new URL('https://xuanphuong.com'),
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://xuanphuong.com',
    title: 'Xuân Phương',
    description: 'Chuyên cung cấp các dịch vụ và sản phẩm chất lượng cao',
    siteName: 'Xuân Phương',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Xuân Phương',
    description: 'Chuyên cung cấp các dịch vụ và sản phẩm chất lượng cao',
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="vi">
      <body className={`${inter.className} min-h-screen bg-white text-black antialiased`}>
        <Providers>{children}</Providers>
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
} 