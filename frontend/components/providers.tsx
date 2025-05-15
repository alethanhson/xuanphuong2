'use client';

import React from 'react';
import QueryProvider from '@/lib/query-provider';

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Component bao tất cả các providers cần thiết cho ứng dụng
 */
export default function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  );
} 