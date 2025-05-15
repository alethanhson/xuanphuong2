'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  delay?: number;
  text?: string;
  className?: string;
}

/**
 * Component hiển thị trạng thái đang tải với delay để tránh nhấp nháy
 */
export default function LoadingState({ 
  delay = 400, 
  text = 'Đang tải...', 
  className = '' 
}: LoadingStateProps) {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!showLoading) return null;

  return (
    <div className={`flex flex-col items-center justify-center space-y-2 p-4 ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
} 