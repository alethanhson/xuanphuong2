import type { Metadata } from 'next';
import type React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import ClientLayout from '@/components/client-layout';
import AdminClientWrapper from '@/components/admin/admin-client-wrapper';
import './globals.css';

export const metadata: Metadata = {
  title: 'Admin Dashboard | CNC Future',
  description: 'Admin dashboard for managing CNC Future website content',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ClientLayout>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AdminClientWrapper>
              {children}
            </AdminClientWrapper>
            <Toaster />
          </ThemeProvider>
        </ClientLayout>
      </body>
    </html>
  );
}
