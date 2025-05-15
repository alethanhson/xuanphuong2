import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  productApi,
  serviceApi,
  blogApi,
  contactApi,
  customerApi,
  authApi,
} from '@/lib/api';

/**
 * Hooks để lấy danh sách sản phẩm
 */
export function useProducts(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productApi.getAll(params),
  });
}

/**
 * Hook để lấy thông tin chi tiết sản phẩm
 */
export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => (id ? productApi.getById(id) : null),
    enabled: !!id,
  });
}

/**
 * Hook để tạo sản phẩm mới
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, any>) => productApi.create(data),
    onSuccess: () => {
      toast.success('Tạo sản phẩm thành công');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      toast.error('Lỗi khi tạo sản phẩm: ' + (error as Error).message);
    },
  });
}

/**
 * Hook để cập nhật sản phẩm
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, any> }) =>
      productApi.update(id, data),
    onSuccess: (_, variables) => {
      toast.success('Cập nhật sản phẩm thành công');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
    },
    onError: (error) => {
      toast.error('Lỗi khi cập nhật sản phẩm: ' + (error as Error).message);
    },
  });
}

/**
 * Hook để xóa sản phẩm
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productApi.delete(id),
    onSuccess: () => {
      toast.success('Xóa sản phẩm thành công');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      toast.error('Lỗi khi xóa sản phẩm: ' + (error as Error).message);
    },
  });
}

/**
 * Hook để lấy danh sách dịch vụ
 */
export function useServices(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['services', params],
    queryFn: () => serviceApi.getAll(params),
  });
}

/**
 * Hook để lấy thông tin chi tiết dịch vụ
 */
export function useService(id: string | undefined) {
  return useQuery({
    queryKey: ['service', id],
    queryFn: () => (id ? serviceApi.getById(id) : null),
    enabled: !!id,
  });
}

/**
 * Hook để lấy danh sách bài viết
 */
export function useBlogs(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['blogs', params],
    queryFn: () => blogApi.getAll(params),
  });
}

/**
 * Hook để lấy thông tin chi tiết bài viết
 */
export function useBlog(id: string | undefined) {
  return useQuery({
    queryKey: ['blog', id],
    queryFn: () => (id ? blogApi.getById(id) : null),
    enabled: !!id,
  });
}

/**
 * Hook để gửi form liên hệ
 */
export function useSubmitContact() {
  return useMutation({
    mutationFn: (data: Record<string, any>) => contactApi.submit(data),
    onSuccess: () => {
      toast.success('Gửi liên hệ thành công');
    },
    onError: (error) => {
      toast.error('Lỗi khi gửi liên hệ: ' + (error as Error).message);
    },
  });
}

/**
 * Hook để đăng nhập
 */
export function useLogin() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onError: (error) => {
      toast.error('Đăng nhập thất bại: ' + (error as Error).message);
    },
  });
}

/**
 * Hook để lấy thông tin người dùng hiện tại
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authApi.getCurrentUser(),
    retry: 1,
    refetchOnWindowFocus: false,
  });
} 