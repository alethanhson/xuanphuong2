import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// GET: Khởi tạo cấu hình hero section nếu chưa tồn tại
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()

    // Kiểm tra xem đã có bản ghi hero_section chưa
    let { data: heroSection, error: heroError } = await supabase
      .from('website_settings')
      .select('*')
      .eq('key', 'hero_section')
      .maybeSingle()

    // Nếu có lỗi do bảng không tồn tại
    if (heroError && heroError.message.includes("does not exist")) {
      console.log('Bảng website_settings không tồn tại')
      return NextResponse.json({
        success: false,
        message: 'Bảng website_settings chưa tồn tại. Vui lòng chạy migration để tạo bảng.'
      })
    } else if (heroError) {
      // Nếu có lỗi khác
      console.error('Lỗi khi kiểm tra hero_section:', heroError)
      return NextResponse.json({ error: heroError.message }, { status: 500 })
    }

    // Nếu chưa có bản ghi hero_section, tạo mới
    if (!heroSection) {
      console.log('Chưa có bản ghi hero_section, đang tạo...')

      // Tạo bản ghi hero_section với dữ liệu mẫu
      const { error: insertError } = await supabase
        .from('website_settings')
        .insert([
          {
            key: 'hero_section',
            value: {
              slides: [
                {
                  id: "slide1",
                  title: "Giải Pháp CNC Toàn Diện",
                  subtitle: "Cho Ngành Gỗ & Kim Loại",
                  description: "Nâng cao hiệu suất sản xuất với máy móc CNC hiện đại, chất lượng cao và dịch vụ chuyên nghiệp.",
                  image: "/placeholder.svg",
                  cta: {
                    primary: {
                      text: "Khám phá sản phẩm",
                      link: "/products"
                    },
                    secondary: {
                      text: "Liên hệ tư vấn",
                      link: "/contact"
                    }
                  }
                }
              ]
            }
          }
        ])

      if (insertError) {
        console.error('Lỗi khi tạo bản ghi hero_section:', insertError)
        return NextResponse.json({ error: 'Không thể tạo bản ghi hero_section' }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Cấu hình Hero Section đã được khởi tạo thành công'
    })
  } catch (error) {
    console.error('Lỗi server:', error)
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 })
  }
}
