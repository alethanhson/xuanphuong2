'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminSeedPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const createAdminAccount = async () => {
    try {
      setIsLoading(true);
      setStatus('idle');
      const response = await fetch('/api/admin/seed');
      const data = await response.json();

      if (response.ok) {
        setResult(JSON.stringify(data, null, 2));
        setStatus('success');
        toast({
          title: 'Thành công',
          description: data.message || 'Đã tạo tài khoản admin thành công',
        });
      } else {
        setResult(JSON.stringify(data, null, 2));
        setStatus('error');
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: data.error || 'Đã xảy ra lỗi khi tạo tài khoản admin',
        });
      }
    } catch (error) {
      console.error('Error creating admin account:', error);
      setStatus('error');
      setResult(JSON.stringify({ error: 'Đã xảy ra lỗi khi kết nối đến server' }, null, 2));
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Đã xảy ra lỗi khi tạo tài khoản admin',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Tạo tài khoản Admin</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Tài khoản Admin</CardTitle>
            <CardDescription>
              Tạo tài khoản admin mặc định cho hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-2">Thông tin tài khoản</h3>
              <p className="text-sm">
                Email: <span className="font-mono bg-background px-1 py-0.5 rounded">xuanphuong@gmail.com</span>
              </p>
              <p className="text-sm">
                Mật khẩu: <span className="font-mono bg-background px-1 py-0.5 rounded">admin123</span>
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={createAdminAccount} 
                disabled={isLoading}
                className="min-w-[150px]"
              >
                {isLoading ? 'Đang tạo...' : 'Tạo tài khoản Admin'}
              </Button>
            </div>

            {result && (
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-2">
                  {status === 'success' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  <h2 className="text-lg font-semibold">
                    {status === 'success' ? 'Thành công' : 'Lỗi'}
                  </h2>
                </div>
                <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
                  {result}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
