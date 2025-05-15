/**
 * Interface cho dữ liệu yêu cầu tư vấn
 */
interface ConsultationRequest {
  full_name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  product_id?: string;
}

/**
 * Service xử lý các yêu cầu tư vấn
 */
export class ConsultationService {
  /**
   * Tạo một yêu cầu tư vấn mới
   */
  static async createConsultationRequest(data: ConsultationRequest) {
    // Giả lập gửi dữ liệu đến API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Log dữ liệu vào console thay vì gửi đến database
    console.log('Dữ liệu yêu cầu tư vấn:', data);
    
    // Tạo dữ liệu phản hồi giả lập
    const responseData = {
      id: `req_${Date.now()}`,
      ...data,
      created_at: new Date().toISOString(),
      status: 'pending'
    };
    
    return {
      data: responseData,
      error: null
    };
  }
  
  /**
   * Lấy danh sách yêu cầu tư vấn
   */
  static async getConsultationRequests() {
    // Giả lập lấy dữ liệu từ API
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Tạo dữ liệu mẫu
    const mockData = [
      {
        id: 'req_1',
        full_name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        phone: '0901234567',
        message: 'Tôi muốn tư vấn về máy CNC 5 trục',
        created_at: '2024-06-01T10:30:00Z',
        status: 'completed'
      },
      {
        id: 'req_2',
        full_name: 'Trần Thị B',
        email: 'tranthib@example.com',
        phone: '0909876543',
        message: 'Cần báo giá cho máy CNC Laser',
        created_at: '2024-06-02T14:20:00Z',
        status: 'pending'
      }
    ];
    
    return {
      data: mockData,
      error: null
    };
  }
} 