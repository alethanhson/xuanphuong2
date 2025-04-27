import React from 'react';

declare module 'react' {
  interface HTMLAttributes<T> {
    suppressHydrationWarning?: boolean;
  }
} 