'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/api';
import Cookies from 'js-cookie';

const loginSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ' }),
  password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
});

const registerSchema = loginSchema.extend({
  firstName: z.string().min(1, { message: 'Tên là bắt buộc' }),
  lastName: z.string().min(1, { message: 'Họ là bắt buộc' }),
  confirmPassword: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu không khớp',
  path: ['confirmPassword'],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const router = useRouter();
  const { login } = useAuth();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      confirmPassword: '',
    },
  });

  async function onLoginSubmit(data: LoginFormValues) {
    setIsLoading(true);
    try {
      const result = await login(data.email, data.password);
      
      if (result.success) {
        toast.success('Đăng nhập thành công', {
          description: 'Bạn đã đăng nhập thành công vào hệ thống.',
        });
        // Chuyển hướng đến trang chính
        router.push('/');
      } else {
        toast.error('Đăng nhập thất bại', {
          description: result.error || 'Vui lòng kiểm tra lại email và mật khẩu.',
        });
      }
    } catch (error) {
      toast.error('Đăng nhập thất bại', {
        description: 'Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onRegisterSubmit(data: RegisterFormValues) {
    try {
      // Gửi request đăng ký tới API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Đăng ký thất bại');
      }

      toast.success('Đăng ký thành công. Vui lòng đăng nhập.');
      setTab('login');
      loginForm.setValue('email', data.email);
    } catch (error) {
      console.error('Register error:', error);
      toast.error('Đăng ký thất bại. Vui lòng thử lại.');
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Đăng nhập</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Đăng nhập hoặc đăng ký để tiếp tục
        </p>
      </div>
      <Tabs defaultValue={tab} onValueChange={(v) => setTab(v as 'login' | 'register')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Đăng nhập</TabsTrigger>
          <TabsTrigger value="register">Đăng ký</TabsTrigger>
        </TabsList>
        <TabsContent value="login" className="space-y-4">
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...loginForm.register('email')}
              />
              {loginForm.formState.errors.email && (
                <p className="text-sm text-red-500">{loginForm.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mật khẩu</Label>
                <Button type="button" variant="link" className="h-auto p-0 text-sm">
                  Quên mật khẩu?
                </Button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...loginForm.register('password')}
              />
              {loginForm.formState.errors.password && (
                <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng nhập
                </>
              ) : "Đăng nhập"}
            </Button>
          </form>
        </TabsContent>
        <TabsContent value="register" className="space-y-4">
          <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Tên</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Tên"
                  {...registerForm.register('firstName')}
                />
                {registerForm.formState.errors.firstName && (
                  <p className="text-sm text-red-500">
                    {registerForm.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Họ</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Họ"
                  {...registerForm.register('lastName')}
                />
                {registerForm.formState.errors.lastName && (
                  <p className="text-sm text-red-500">
                    {registerForm.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                type="email"
                placeholder="your@email.com"
                {...registerForm.register('email')}
              />
              {registerForm.formState.errors.email && (
                <p className="text-sm text-red-500">{registerForm.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-password">Mật khẩu</Label>
              <Input
                id="register-password"
                type="password"
                placeholder="••••••••"
                {...registerForm.register('password')}
              />
              {registerForm.formState.errors.password && (
                <p className="text-sm text-red-500">
                  {registerForm.formState.errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-confirm-password">Xác nhận mật khẩu</Label>
              <Input
                id="register-confirm-password"
                type="password"
                placeholder="••••••••"
                {...registerForm.register('confirmPassword')}
              />
              {registerForm.formState.errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {registerForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Đăng ký
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
} 