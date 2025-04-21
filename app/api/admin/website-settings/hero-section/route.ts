import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import type { HeroSectionSettings } from "@/lib/services/website-settings.service"

// GET: Lấy cấu hình hero section
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from("website_settings")
      .select("value")
      .eq("key", "hero_section")
      .single()

    if (error) {
      console.error("Error fetching hero section settings:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      settings: data.value,
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT: Cập nhật cấu hình hero section
export async function PUT(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()

    // Bỏ qua việc kiểm tra xác thực để đơn giản hóa trong quá trình phát triển
    // Trong môi trường production thực tế, bạn nên thêm kiểm tra xác thực ở đây

    // Lấy dữ liệu từ request
    const settings: HeroSectionSettings = await request.json()

    // Validate dữ liệu
    if (!settings || !Array.isArray(settings.slides) || settings.slides.length === 0) {
      return NextResponse.json({ error: "Invalid settings data" }, { status: 400 })
    }

    // Cập nhật cấu hình
    const { data, error } = await supabase
      .from("website_settings")
      .update({
        value: settings,
        updated_at: new Date().toISOString(),
      })
      .eq("key", "hero_section")
      .select("value")
      .single()

    if (error) {
      console.error("Error updating hero section settings:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Revalidate trang chủ để cập nhật cache
    revalidatePath("/")

    return NextResponse.json({
      success: true,
      settings: data.value,
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
