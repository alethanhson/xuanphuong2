import { createServerSupabaseClient } from './supabase';
import type { Database } from '@/types/supabase';

// Định nghĩa kiểu dữ liệu cho yêu cầu tư vấn
export type ConsultationRequest = Database['public']['Tables']['consultation_requests']['Insert'];

// Định nghĩa kiểu dữ liệu phản hồi API
export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
  };
}

/**
 * Service xử lý các yêu cầu tư vấn
 */
export const ConsultationService = {
  /**
   * Lưu yêu cầu tư vấn mới vào Supabase
   */
  async createConsultationRequest(request: ConsultationRequest): Promise<ApiResponse<{ id: string }>> {
    try {
      const supabase = await createServerSupabaseClient();

      // Thêm dữ liệu vào bảng consultation_requests
      const { data, error } = await supabase
        .from('consultation_requests')
        .insert(request)
        .select('id')
        .single();

      if (error) {
        console.error('Error creating consultation request:', error);
        return { error: { message: 'Không thể gửi yêu cầu tư vấn. Vui lòng thử lại sau.' } };
      }

      return { data: { id: data.id } };
    } catch (error) {
      console.error('Unexpected error in createConsultationRequest:', error);
      return { error: { message: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.' } };
    }
  },

  /**
   * Lấy danh sách các yêu cầu tư vấn (cho admin)
   */
  async getConsultationRequests(): Promise<ApiResponse<ConsultationRequest[]>> {
    try {
      const supabase = await createServerSupabaseClient();

      const { data, error } = await supabase
        .from('consultation_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching consultation requests:', error);
        return { error: { message: 'Không thể lấy danh sách yêu cầu tư vấn.' } };
      }

      return { data };
    } catch (error) {
      console.error('Unexpected error in getConsultationRequests:', error);
      return { error: { message: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.' } };
    }
  },

  /**
   * Cập nhật trạng thái yêu cầu tư vấn
   */
  async updateConsultationStatus(id: string, status: string): Promise<ApiResponse<null>> {
    try {
      const supabase = await createServerSupabaseClient();

      const { error } = await supabase
        .from('consultation_requests')
        .update({ 
          status, 
          ...(status === 'responded' ? { responded_at: new Date().toISOString() } : {})
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating consultation status:', error);
        return { error: { message: 'Không thể cập nhật trạng thái yêu cầu tư vấn.' } };
      }

      return { data: null };
    } catch (error) {
      console.error('Unexpected error in updateConsultationStatus:', error);
      return { error: { message: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.' } };
    }
  }
}; 