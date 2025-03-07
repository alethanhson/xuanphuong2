import type { Metadata } from 'next';
import type React from 'react';
import AdminHeader from '@/components/admin/admin-header';
import AdminSidebar from '@/components/admin/admin-sidebar';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
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
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen bg-background">
            <AdminSidebar />
            <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
              <div className="flex flex-col lg:col-start-2">
                <AdminHeader />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-6">
                  {children}
                </main>
              </div>
            </div>
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
