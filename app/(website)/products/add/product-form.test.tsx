import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductForm from './product-form';
import { supabase } from '@/lib/supabaseClient';

// Mock supabase
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    storage: {
      from: jest.fn().mockReturnValue({
        upload: jest.fn().mockResolvedValue({ data: { path: 'test-path' } }),
        getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'https://test.com/image.jpg' } }),
      }),
    },
  },
}));

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

// Mock toast
jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn(),
}));

describe('ProductForm', () => {
  beforeEach(() => {
    // Setup supabase mock responses
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: [
            { id: '1', name: 'Category 1' },
            { id: '2', name: 'Category 2' },
          ],
          error: null,
        }),
      }),
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { id: '123', name: 'Test Product' },
            error: null,
          }),
        }),
      }),
    });
  });

  test('renders the form with all steps', async () => {
    render(<ProductForm />);
    
    // Wait for categories to load
    await waitFor(() => {
      expect(screen.queryByText('Đang tải dữ liệu...')).not.toBeInTheDocument();
    });
    
    // Check if the first step is rendered
    expect(screen.getByText('Thông tin cơ bản')).toBeInTheDocument();
    
    // Check if all tabs are present
    expect(screen.getByRole('tab', { name: 'Thông tin cơ bản' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Hình ảnh' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tính năng' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Thông số kỹ thuật' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Ứng dụng' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tài liệu' })).toBeInTheDocument();
  });

  test('validates the first step before allowing to proceed', async () => {
    render(<ProductForm />);
    
    // Wait for categories to load
    await waitFor(() => {
      expect(screen.queryByText('Đang tải dữ liệu...')).not.toBeInTheDocument();
    });
    
    // Try to go to next step without filling required fields
    const nextButton = screen.getByRole('button', { name: 'Tiếp theo' });
    expect(nextButton).toBeDisabled();
    
    // Fill required fields
    await userEvent.type(screen.getByLabelText('Tên sản phẩm'), 'Test Product');
    
    // Slug should be auto-generated
    expect(screen.getByLabelText('Slug')).toHaveValue('test-product');
    
    await userEvent.type(screen.getByLabelText('Mô tả chi tiết'), 'This is a test product description that is long enough to pass validation.');
    
    // Select category
    const categorySelect = screen.getByLabelText('Danh mục');
    fireEvent.click(categorySelect);
    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Category 1'));
    
    // Select status
    const statusSelect = screen.getByLabelText('Trạng thái');
    fireEvent.click(statusSelect);
    await waitFor(() => {
      expect(screen.getByText('Đang bán')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Đang bán'));
    
    // Now the next button should be enabled
    await waitFor(() => {
      expect(nextButton).not.toBeDisabled();
    });
    
    // Go to next step
    fireEvent.click(nextButton);
    
    // Check if we're on the images step
    await waitFor(() => {
      expect(screen.getByText('Hình ảnh sản phẩm')).toBeInTheDocument();
    });
  });

  test('allows navigation between steps when previous steps are valid', async () => {
    render(<ProductForm />);
    
    // Wait for categories to load
    await waitFor(() => {
      expect(screen.queryByText('Đang tải dữ liệu...')).not.toBeInTheDocument();
    });
    
    // Fill required fields in first step
    await userEvent.type(screen.getByLabelText('Tên sản phẩm'), 'Test Product');
    await userEvent.type(screen.getByLabelText('Mô tả chi tiết'), 'This is a test product description that is long enough to pass validation.');
    
    // Select category
    const categorySelect = screen.getByLabelText('Danh mục');
    fireEvent.click(categorySelect);
    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Category 1'));
    
    // Select status
    const statusSelect = screen.getByLabelText('Trạng thái');
    fireEvent.click(statusSelect);
    await waitFor(() => {
      expect(screen.getByText('Đang bán')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Đang bán'));
    
    // Go to next step
    const nextButton = screen.getByRole('button', { name: 'Tiếp theo' });
    await waitFor(() => {
      expect(nextButton).not.toBeDisabled();
    });
    fireEvent.click(nextButton);
    
    // Check if we're on the images step
    await waitFor(() => {
      expect(screen.getByText('Hình ảnh sản phẩm')).toBeInTheDocument();
    });
    
    // Go back to first step by clicking on the tab
    fireEvent.click(screen.getByRole('tab', { name: 'Thông tin cơ bản' }));
    
    // Check if we're back on the first step
    await waitFor(() => {
      expect(screen.getByLabelText('Tên sản phẩm')).toHaveValue('Test Product');
    });
  });

  test('submit button is only enabled when required steps are valid', async () => {
    render(<ProductForm />);
    
    // Wait for categories to load
    await waitFor(() => {
      expect(screen.queryByText('Đang tải dữ liệu...')).not.toBeInTheDocument();
    });
    
    // Go to last step
    fireEvent.click(screen.getByRole('tab', { name: 'Tài liệu' }));
    
    // Submit button should be disabled because first step is not valid
    expect(screen.getByRole('button', { name: 'Tạo sản phẩm' })).toBeDisabled();
    
    // Go back to first step
    fireEvent.click(screen.getByRole('tab', { name: 'Thông tin cơ bản' }));
    
    // Fill required fields in first step
    await userEvent.type(screen.getByLabelText('Tên sản phẩm'), 'Test Product');
    await userEvent.type(screen.getByLabelText('Mô tả chi tiết'), 'This is a test product description that is long enough to pass validation.');
    
    // Select category
    const categorySelect = screen.getByLabelText('Danh mục');
    fireEvent.click(categorySelect);
    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Category 1'));
    
    // Select status
    const statusSelect = screen.getByLabelText('Trạng thái');
    fireEvent.click(statusSelect);
    await waitFor(() => {
      expect(screen.getByText('Đang bán')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Đang bán'));
    
    // Go to last step
    fireEvent.click(screen.getByRole('tab', { name: 'Tài liệu' }));
    
    // Now the submit button should be enabled
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Tạo sản phẩm' })).not.toBeDisabled();
    });
  });
});
