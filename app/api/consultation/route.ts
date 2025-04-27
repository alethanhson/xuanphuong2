import { NextRequest, NextResponse } from 'next/server';
import { ConsultationService } from '@/lib/consultation-service';
import { z } from 'zod';

// Schema xác thực dữ liệu gửi lên
const consultationSchema = z.object({
  full_name: z.string().min(2, { message: 'Họ tên phải có ít nhất 2 ký tự' }),
  email: z.string().email({ message: 'Email không hợp lệ' }),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().optional(),
  product_id: z.string().uuid().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Lấy dữ liệu từ request
    const body = await request.json();

    // Xác thực dữ liệu
    const result = consultationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { 
          error: { 
            message: 'Dữ liệu không hợp lệ',
            details: result.error.format() 
          } 
        },
        { status: 400 }
      );
    }

    // Gửi dữ liệu đến Supabase
    const response = await ConsultationService.createConsultationRequest(result.data);

    if (response.error) {
      return NextResponse.json(
        { error: response.error },
        { status: 500 }
      );
    }

    // Trả về kết quả thành công
    return NextResponse.json(
      { 
        success: true, 
        data: response.data,
        message: 'Đăng ký tư vấn thành công. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unexpected error in consultation API:', error);
    return NextResponse.json(
      { error: { message: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.' } },
      { status: 500 }
    );
  }
} 